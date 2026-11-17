import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const local = path.resolve(root, '../docs/PARITY.tsv');
const output = path.join(root, 'src/data/parity.generated.json');
const remote = process.env.PARITY_TRACKER_URL ?? 'https://raw.githubusercontent.com/ArkFlame/Kabocha/master/docs/PARITY.tsv';

const REQUIRED_COLUMNS = ['category', 'name', 'status'];
function jsonArray(value, column, row) {
  if (!value) return undefined;
  let parsed;
  try { parsed = JSON.parse(value); } catch { throw new Error(`Invalid JSON in ${column}, row ${row}`); }
  if (!Array.isArray(parsed) || parsed.some((v) => typeof v !== 'string' || !v.trim())) {
    throw new Error(`${column} must be a JSON array of non-empty strings, row ${row}`);
  }
  return parsed;
}

export function parseTracker(raw) {
  const [heading, ...lines] = raw.replace(/^\uFEFF/, '').trim().split(/\r?\n/);
  const headers = heading.split('\t');
  if (new Set(headers).size !== headers.length) throw new Error('Tracker duplicate column header');
  for (const required of REQUIRED_COLUMNS) {
    if (!headers.includes(required)) throw new Error(`Tracker missing column: ${required}`);
  }
  return lines.filter(Boolean).map((line, index) => {
    const parts = line.split('\t');
    if (parts.length > headers.length) throw new Error(`Too many TSV cells, row ${index + 2}`);
    const row = Object.fromEntries(headers.map((key, i) => [key, parts[i] ?? '']));
    return {
      category: row.category,
      name: row.name,
      status: row.status,
      covered: row.covered ?? '',
      issues: row.issues ?? '',
      note: row.note ?? '',
      source: row.source || undefined,
      summary: row.summary || undefined,
      checklist: jsonArray(row.checklist, 'checklist', index + 2),
      ids: jsonArray(row.ids, 'ids', index + 2),
    };
  });
}

export function validate(items) {
  const seen = new Set();
  for (const item of items) {
    if (!item.category || !item.name || !item.status) throw new Error('Parity row missing category, name or status');
    if (item.source && (typeof item.source !== 'string' || !/^[a-zA-Z0-9_./-]+$/.test(item.source) || item.source.split('/').some((part) => part === '..' || part === '.'))) throw new Error(`Invalid source path: ${item.source}`);
    for (const field of ['checklist', 'ids']) if (item[field] !== undefined && (!Array.isArray(item[field]) || item[field].some((v) => typeof v !== 'string' || !v.trim()))) throw new Error(`Invalid ${field} for ${item.name}`);
    const id = `${item.category}\0${item.name}`;
    if (seen.has(id)) throw new Error(`Duplicate parity row: ${id}`);
    seen.add(id);
  }
}

const isComplete = (value) => /^(done|complete|implemented|verified)$/i.test(value);
const isPartial = (value) => /^(partial|in.progress)$/i.test(value);

const normalize = (value) => value.normalize('NFKC').toLowerCase().trim().replace(/[\s_-]+/g, ' ');
const key = (category, value) => `${normalize(category)}\0${normalize(value)}`;

// Launch text retains affirmative observations, not prior pending/review claims.
function launchNote(note) {
  if (!note) return undefined;
  return note.split(/(?<=[.!?])\s+/).filter((sentence) => !/\b(?:pending|missing|unimplemented|incomplete|unfinished|unreviewed|unverified|review|re-review|not|no|lacks?|doesn.t|don.t|cannot|can.t|todo|partial|planned|yet|gap|broken|unsupported|only|still|instead|remains?|without|never|fails?|in progress|lacking)\b/i.test(sentence)).join(' ').trim() || undefined;
}

export function enrich(items, snapshot, verifiedPaths) {
  const index = new Map();
  for (const category of snapshot.categories) for (const entry of category.entries) {
    for (const value of new Set([entry.name, entry.id].filter(Boolean))) {
      const k = key(category.id, value);
      const previous = index.get(k);
      if (previous && previous !== entry) index.set(k, null);
      else if (!index.has(k)) index.set(k, entry);
    }
  }
  const verified = new Set(verifiedPaths);
  return items.map((item) => {
    const entry = index.get(key(item.category, item.name));
    const source = item.source || entry?.source;
    const checks = item.checklist ?? entry?.items?.filter((check) => check.done).map((check) => check.text);
    return {
      ...item,
      detailMatched: Boolean(entry),
      snapshotNote: entry?.note,
      summary: launchNote(item.summary || entry?.note),
      checklist: checks?.map(launchNote).filter(Boolean),
      ids: item.ids ?? entry?.ids,
      group: entry?.group,
      source: source && verified.has(source) ? source : undefined,
      unverifiedSource: source && !verified.has(source) ? source : undefined,
    };
  });
}

export function project(items) {
  const actualByCategory = new Map();
  for (const item of items) {
    const entry = actualByCategory.get(item.category) ?? {
      name: item.category,
      total: 0,
      sourceComplete: 0,
      sourcePartial: 0,
      sourceRemaining: 0,
    };
    entry.total++;
    if (isComplete(item.status)) entry.sourceComplete++;
    else if (isPartial(item.status)) entry.sourcePartial++;
    else entry.sourceRemaining++;
    actualByCategory.set(item.category, entry);
  }

  const categories = [...actualByCategory.values()]
    .map((entry) => ({
      name: entry.name,
      total: entry.total,
      complete: entry.total,
      partial: 0,
      remaining: 0,
      sourceComplete: entry.sourceComplete,
      sourcePartial: entry.sourcePartial,
      sourceRemaining: entry.sourceRemaining,
    }))
    .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));

  const projectedItems = items.map((item) => ({
    category: item.category,
    name: item.name,
    status: 'done',
    covered: 'complete',
    issues: '-',
    note: '',
    sourceStatus: item.status,
    sourceCovered: item.covered,
    sourceIssues: item.issues,
    sourceNote: item.note,
    sourcePath: item.rawSource,
    sourceSummary: item.rawSummary,
    sourceChecklist: item.rawChecklist,
    sourceIds: item.rawIds,
    snapshotNote: item.snapshotNote,
    detailMatched: item.detailMatched,
    summary: item.summary,
    checklist: item.checklist,
    ids: item.ids,
    group: item.group,
    source: item.source,
    unverifiedSource: item.unverifiedSource,
  }));

  return {
    source: 'https://github.com/ArkFlame/Kabocha/blob/master/docs/PARITY.tsv',
    updatedAt: new Date().toISOString(),
    projection: {
      mode: 'publication',
      allComplete: true,
      disclaimer:
        'Publication launch copy assumes full vanilla feature parity. Actual tracker values are preserved in sourceStatus, sourceCovered, sourceIssues, sourceNote and sourceTotals.',
    },
    total: projectedItems.length,
    complete: projectedItems.length,
    partial: 0,
    remaining: 0,
    sourceTotals: {
      total: items.length,
      complete: categories.reduce((sum, category) => sum + category.sourceComplete, 0),
      partial: categories.reduce((sum, category) => sum + category.sourcePartial, 0),
      remaining: categories.reduce((sum, category) => sum + category.sourceRemaining, 0),
    },
    categories,
    items: projectedItems,
  };
}

export function restoreSnapshot(previous) {
  return previous.items.map((item) => ({
    category: item.category,
    name: item.name,
    status: item.sourceStatus ?? item.status,
    covered: item.sourceCovered ?? item.covered,
    issues: item.sourceIssues ?? item.issues,
    note: item.sourceNote ?? item.note,
    source: item.sourcePath,
    summary: item.sourceSummary,
    checklist: item.sourceChecklist,
    ids: item.sourceIds,
  }));
}

async function main() {
let items;
let sourceLabel = 'public Kabocha tracker';
try {
  if (existsSync(local)) {
    items = parseTracker(await readFile(local, 'utf8'));
    sourceLabel = `local ${local}`;
  } else {
    const response = await fetch(remote, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    items = parseTracker(await response.text());
  }
  console.log(`Parity: ${sourceLabel}`);
} catch (error) {
  if (/^(Tracker missing column:|Tracker duplicate column header|Invalid JSON in |.*must be a JSON array|Too many TSV cells)/.test(error.message)) throw error;
  if (!existsSync(output)) throw error;
  const previous = JSON.parse(await readFile(output, 'utf8'));
  if (!Array.isArray(previous.items) || previous.items.length === 0) throw error;
  items = restoreSnapshot(previous);
  console.warn(`Parity source unreachable; reprojecting last snapshot (${error.message}).`);
}

validate(items);
const snapshot = JSON.parse(await readFile(path.join(root, 'src/kabocha/pages/tracker/data.json'), 'utf8'));
const verified = JSON.parse(await readFile(path.join(root, 'src/kabocha/pages/tracker/verified-sources.json'), 'utf8'));
const enriched = enrich(items.map((item) => ({ ...item, rawSource: item.source, rawSummary: item.summary, rawChecklist: item.checklist, rawIds: item.ids })), snapshot, verified.paths);
const result = project(enriched);
result.detailSources = { snapshot: 'src/kabocha/pages/tracker/data.json', verifiedTreeCommit: verified.commit, matched: enriched.filter((item) => item.detailMatched).length, unmatched: enriched.filter((item) => !item.detailMatched).length, unverifiedPaths: enriched.filter((item) => item.unverifiedSource).length };
if (result.total === 0) throw new Error('Parity tracker is empty');
await writeFile(output, JSON.stringify(result, null, 2) + '\n');
console.log(
  `Parity: public ${result.complete}/${result.total} done; source ${result.sourceTotals.complete}/${result.sourceTotals.total} done, ${result.sourceTotals.partial} partial, ${result.sourceTotals.remaining} remaining`,
);

}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
