import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const DATA_FILE = join(ROOT, 'src', 'data', 'parity.generated.json');
const FAVICON_SHA256 = '2f5d6056b03f8ddc4d32f7047713089518f6fe3ea5a1cf8e0be2c2ef172dd61d';

function normalizeBase(raw) {
  const value = String(raw ?? '').trim();
  if (!value || value === '/') return '';
  return '/' + value.replace(/^\/+/, '').replace(/\/+$/, '');
}

const BASE = normalizeBase(process.env.PUBLIC_BASE_PATH ?? '/');

const ROUTES = [
  { url: '/', file: 'index.html' },
  { url: '/download/', file: 'download/index.html' },
  { url: '/developers/', file: 'developers/index.html' },
  { url: '/sponsor/', file: 'sponsor/index.html' },
  { url: '/contributors/', file: 'contributors/index.html' },
  { url: '/stats/', file: 'stats/index.html' },
  { url: '/tracker/', file: 'tracker/index.html' },
  { url: '/parity/', file: 'parity/index.html' },
  { url: '/404.html', file: '404.html' },
];

function isFile(path) {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

function formatFailures(failures) {
  const shown = failures.slice(0, 25);
  const hidden = failures.length - shown.length;
  return shown.join('\n') + (hidden > 0 ? '\n... and ' + hidden + ' more' : '');
}

function pageHtml(route) {
  const path = join(DIST, route.file);
  assert.ok(
    isFile(path),
    'Missing built page ' + route.file + ' for ' + route.url +
      '. Run npm run build with PUBLIC_BASE_PATH=' + (BASE || '/') + ' before these tests.'
  );
  return readFileSync(path, 'utf8');
}

function isRedirectPage(html) {
  return /<meta\b[^>]*\bhttp-equiv\s*=\s*(?:"refresh"|'refresh'|refresh\b)/i.test(html);
}

function extractTitle(html) {
  const match = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  return match ? match[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : '';
}

function extractReferences(html) {
  const tagPattern = /<(a|img|script|link|source|video|audio|track|iframe)\b((?:"[^"]*"|'[^']*'|[^'">])*)>/gi;
  const attrPattern = /\b(href|src|poster|srcset)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>]+))/gi;
  const references = [];

  for (const tagMatch of html.matchAll(tagPattern)) {
    const tag = tagMatch[1].toLowerCase();
    const attributes = tagMatch[2];

    for (const attrMatch of attributes.matchAll(attrPattern)) {
      const attr = attrMatch[1].toLowerCase();
      const value = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';

      if (attr === 'srcset') {
        if (value.includes('data:')) continue;
        for (const candidate of value.split(',')) {
          const url = candidate.trim().split(/\s+/)[0];
          if (url) references.push({ tag, attr, value: url });
        }
      } else {
        references.push({ tag, attr, value });
      }
    }
  }

  return references;
}

function localPathFor(value, currentPath) {
  if (
    !value ||
    value.startsWith('#') ||
    value.startsWith('?') ||
    value.startsWith('//') ||
    /^[a-z][a-z0-9+.-]*:/i.test(value)
  ) {
    return null;
  }

  let url;
  try {
    url = new URL(value, 'https://kabocha.invalid' + currentPath);
  } catch {
    return { error: 'invalid URL' };
  }

  if (url.protocol !== 'https:' || url.hostname !== 'kabocha.invalid') return null;
  return { pathname: url.pathname };
}

function outputCandidates(pathname) {
  let clean;
  try {
    clean = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  if (BASE) {
    if (clean === BASE) {
      clean = '/';
    } else if (clean.startsWith(BASE + '/')) {
      clean = clean.slice(BASE.length);
    } else {
      return null;
    }
  }

  if (!clean.startsWith('/')) return null;

  const trailingSlash = clean === '/' || clean.endsWith('/');
  const parts = clean.split('/').filter(Boolean);
  if (parts.some((part) => part === '.' || part === '..')) return null;

  const relative = parts.join('/');
  if (trailingSlash) return [relative ? relative + '/index.html' : 'index.html'];
  return [relative, relative + '/index.html', relative + '.html'];
}

function findOutput(pathname) {
  const candidates = outputCandidates(pathname);
  if (!candidates) return { outsideBase: true };

  for (const candidate of candidates) {
    if (isFile(join(DIST, candidate))) return { file: candidate };
  }

  return { missing: candidates };
}

for (const route of ROUTES) {
  test('route ' + route.url + ' builds as ' + route.file, () => {
    const html = pageHtml(route);
    const title = extractTitle(html);

    if (route.url === '/parity/' && isRedirectPage(html)) {
      assert.match(html, /\/tracker\//i, 'parity alias redirect must target the tracker');
      return;
    }

    assert.ok(title, route.file + ' has no <title>');
    assert.match(title, /Kabocha/i, route.file + ' title must name Kabocha; got: ' + title);
  });
}

test('built pages expose accessible navigation landmarks and image alternatives', () => {
  const failures = [];

  for (const route of ROUTES) {
    const html = pageHtml(route);
    const label = route.file;
    if (route.url === '/parity/' && isRedirectPage(html)) continue;

    if (!/<html\b[^>]*\blang\s*=\s*(?:"[^"]+"|'[^']+'|[^\s>]+)/i.test(html)) {
      failures.push(label + ': missing <html lang>');
    }
    if (!/<meta\b[^>]*\bname\s*=\s*(?:"viewport"|'viewport'|viewport\b)/i.test(html)) {
      failures.push(label + ': missing viewport meta tag');
    }
    if (!/<main\b/i.test(html)) failures.push(label + ': missing <main> landmark');

    const navs = [...html.matchAll(/<nav\b((?:"[^"]*"|'[^']*'|[^'">])*)>([\s\S]*?)<\/nav>/gi)];
    if (navs.length === 0) {
      failures.push(label + ': missing <nav> landmark');
    } else if (!navs.some((nav) => /<a\b[^>]*\bhref\s*=/i.test(nav[2]))) {
      failures.push(label + ': <nav> contains no anchor links');
    }

    const images = [...html.matchAll(/<img\b((?:"[^"]*"|'[^']*'|[^'">])*)>/gi)];
    for (const image of images) {
      if (!/\balt\s*=/i.test(image[1])) {
        failures.push(label + ': <img> without alt attribute');
      }
    }
  }

  assert.equal(failures.length, 0, formatFailures(failures));
});


test('custom-domain deployment defaults to root and preserves Pages-derived overrides', () => {
  const config = readFileSync(join(ROOT, 'astro.config.mjs'), 'utf8');
  const workflow = readFileSync(join(ROOT, '.github', 'workflows', 'kabocha-pages.yml'), 'utf8');
  const cname = readFileSync(join(ROOT, 'public', 'CNAME'), 'utf8').trim();

  assert.equal(cname, 'kabocha.arkflame.com');
  assert.match(config, /PUBLIC_SITE_URL \?\? 'https:\/\/kabocha\.arkflame\.com'/);
  assert.match(config, /PUBLIC_BASE_PATH \|\| '\/'/);
  assert.match(workflow, /PUBLIC_SITE_URL: \$\{\{ steps\.site\.outputs\.site \}\}/);
  assert.match(workflow, /PUBLIC_BASE_PATH: \$\{\{ steps\.site\.outputs\.base \}\}/);
  assert.match(workflow, /PAGES_BASE_PATH \|\| '\/'/);
  assert.doesNotMatch(workflow, /PUBLIC_BASE_PATH: \/Kabocha-Page/);
});

test('site-relative references resolve under the configured base and built output', () => {
  const failures = [];

  for (const route of ROUTES) {
    const html = pageHtml(route);
    const currentPath = BASE + route.url;
    const seen = new Set();

    for (const reference of extractReferences(html)) {
      const key = reference.tag + '|' + reference.attr + '|' + reference.value;
      if (seen.has(key)) continue;
      seen.add(key);

      if (/(?:^|\/)(?:kabocha|kabocha-clip)\.png(?:$|[?#])/i.test(reference.value)) {
        failures.push(route.file + ': retired PNG reference ' + reference.tag + '[' + reference.attr + ']="' + reference.value + '"');
      }

      if (
        ['img', 'source', 'video', 'audio', 'link'].includes(reference.tag) &&
        /pumpkin/i.test(reference.value)
      ) {
        failures.push(route.file + ': unadapted Pumpkin media reference ' + reference.tag + '[' + reference.attr + ']="' + reference.value + '"');
      }

      const local = localPathFor(reference.value, currentPath);
      if (!local) continue;

      if (local.error) {
        failures.push(route.file + ': invalid local reference ' + reference.tag + '[' + reference.attr + ']="' + reference.value + '"');
        continue;
      }

      const inBase = !BASE || local.pathname === BASE || local.pathname.startsWith(BASE + '/');
      if (!inBase) {
        failures.push(
          route.file + ': ' + reference.tag + '[' + reference.attr + ']="' + reference.value +
            '" resolves to ' + local.pathname + ', outside base ' + BASE
        );
        continue;
      }

      const output = findOutput(local.pathname);
      if (output.outsideBase) {
        failures.push(route.file + ': ' + reference.tag + '[' + reference.attr + ']="' + reference.value + '" is outside base ' + BASE);
      } else if (output.missing) {
        failures.push(
          route.file + ': ' + reference.tag + '[' + reference.attr + ']="' + reference.value +
            '" has no built file (tried ' + output.missing.join(', ') + ')'
        );
      }
    }
  }

  assert.equal(failures.length, 0, formatFailures(failures));
});

test('converted mascot assets exist and retired PNG artwork is gone', () => {
  for (const file of ['kabocha.webp', 'kabocha-clip.webp']) {
    const path = join(DIST, file);
    assert.ok(isFile(path), 'missing built asset ' + file);
    assert.ok(statSync(path).size > 0, 'built asset is empty: ' + file);
  }

  for (const file of ['kabocha.png', 'kabocha-clip.png']) {
    assert.equal(existsSync(join(DIST, file)), false, 'retired PNG still in dist: ' + file);
    assert.equal(existsSync(join(ROOT, 'public', file)), false, 'retired PNG still in public/: ' + file);
  }
});

test('favicon exists, is referenced, and is byte-identical to the original', () => {
  const source = join(ROOT, 'public', 'favicon.png');
  const built = join(DIST, 'favicon.png');

  for (const path of [source, built]) {
    assert.ok(isFile(path), 'missing favicon: ' + path);
    const digest = createHash('sha256').update(readFileSync(path)).digest('hex');
    assert.equal(digest, FAVICON_SHA256, 'favicon changed: ' + path + ' has sha256 ' + digest);
  }

  const failures = [];
  for (const route of ROUTES) {
    const html = pageHtml(route);
    if (route.url === '/parity/' && isRedirectPage(html)) continue;
    const linkTags = [...html.matchAll(/<link\b((?:"[^"]*"|'[^']*'|[^'">])*)>/gi)].map((match) => match[0]);
    const icon = linkTags.find((tag) =>
      /\brel\s*=\s*(?:"[^"]*\bicon\b[^"]*"|'[^']*\bicon\b[^']*'|icon\b)/i.test(tag)
    );
    if (!icon) {
      failures.push(route.file + ': no <link rel="icon">');
    } else if (!/\bhref\s*=\s*(?:"[^"]+"|'[^']+'|[^\s>]+)/i.test(icon)) {
      failures.push(route.file + ': favicon link has no href');
    }
  }

  assert.equal(failures.length, 0, formatFailures(failures));
});

test('parity projection marks every Kabocha row done', () => {
  assert.ok(isFile(DATA_FILE), 'missing parity data: ' + DATA_FILE);
  const data = JSON.parse(readFileSync(DATA_FILE, 'utf8'));

  assert.ok(Number.isInteger(data.total) && data.total > 0, 'parity total must be a positive integer');
  assert.equal(data.complete, data.total, 'complete count must equal total');
  assert.equal(data.partial, 0, 'no partial rows are allowed in publication data');
  assert.equal(data.remaining, 0, 'no remaining rows are allowed in publication data');

  assert.ok(Array.isArray(data.items), 'parity data must contain items');
  assert.equal(data.items.length, data.total, 'items length must equal total');

  const unfinished = data.items.filter((item) => item.status !== 'done');
  assert.equal(
    unfinished.length,
    0,
    'unprojected item statuses: ' + formatFailures(unfinished.slice(0, 10).map((item) => item.category + '/' + item.name + '=' + item.status))
  );
});

test('parity category totals and item statuses are coherent', () => {
  const data = JSON.parse(readFileSync(DATA_FILE, 'utf8'));
  assert.ok(Array.isArray(data.categories) && data.categories.length > 0, 'parity data must contain categories');

  const categoryNames = new Set();
  const itemCounts = new Map();
  let total = 0;
  let complete = 0;
  let partial = 0;
  let remaining = 0;

  for (const category of data.categories) {
    assert.ok(category.name, 'category without a name');
    assert.ok(Number.isInteger(category.total) && category.total > 0, category.name + ' must have a positive total');
    assert.equal(category.complete, category.total, category.name + ' complete must equal total');
    assert.equal(category.partial, 0, category.name + ' must have zero partial rows');
    assert.equal(category.remaining, 0, category.name + ' must have zero remaining rows');

    categoryNames.add(category.name);
    itemCounts.set(category.name, { total: 0, complete: 0 });
    total += category.total;
    complete += category.complete;
    partial += category.partial ?? 0;
    remaining += category.remaining ?? 0;
  }

  assert.equal(total, data.total, 'category totals must sum to the top-level total');
  assert.equal(complete, data.complete, 'category complete counts must sum to the top-level complete count');
  assert.equal(partial, data.partial, 'category partial counts must sum to the top-level partial count');
  assert.equal(remaining, data.remaining, 'category remaining counts must sum to the top-level remaining count');

  const unknown = [];
  for (const item of data.items) {
    if (!categoryNames.has(item.category)) {
      unknown.push(item.category + '/' + item.name);
      continue;
    }
    const counts = itemCounts.get(item.category);
    counts.total += 1;
    if (item.status === 'done') counts.complete += 1;
  }
  assert.equal(unknown.length, 0, 'items in unknown categories: ' + formatFailures(unknown));

  const mismatches = [];
  for (const category of data.categories) {
    const counts = itemCounts.get(category.name);
    if (counts.total !== category.total || counts.complete !== category.complete) {
      mismatches.push(
        category.name + ': rows=' + counts.total + '/' + category.total +
          ', done=' + counts.complete + '/' + category.complete
      );
    }
  }
  assert.equal(mismatches.length, 0, 'category totals disagree with item rows: ' + formatFailures(mismatches));
});

test('tracker route displays 100% completion', () => {
  const route = ROUTES.find((entry) => entry.url === '/tracker/');
  const html = pageHtml(route);
  const text = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ');

  assert.match(text, /\b100(?:\.0+)?\s*%/, 'tracker page must visibly show 100%');
});
