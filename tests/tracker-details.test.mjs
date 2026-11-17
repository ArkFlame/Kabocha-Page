import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { enrich, parseTracker, project, restoreSnapshot, validate } from '../scripts/sync-parity.mjs';
const snapshot = JSON.parse(await readFile(new URL('../src/kabocha/pages/tracker/data.json', import.meta.url), 'utf8'));
const verified = JSON.parse(await readFile(new URL('../src/kabocha/pages/tracker/verified-sources.json', import.meta.url), 'utf8'));

test('category-scoped matching preserves slime details and verified paths', () => {
  const rows = [{category:'entities',name:'Slime',status:'partial'}, {category:'blocks',name:'Slime',status:'done'}];
  const [mob, block] = enrich(rows, snapshot, verified.paths);
  assert.equal(mob.summary, 'Goal set matches vanilla.');
  assert.deepEqual(mob.checklist, ['Size, split and jump attack', 'Slime chunk and swamp spawn rules', 'Player collision damage']);
  assert.equal(mob.source, 'crates/pumpkin-core/src/entity/mob/slime.rs');
  assert.equal(block.source, 'crates/pumpkin-core/src/block/blocks/slime.rs');
  assert.deepEqual(block.ids, ['minecraft:slime_block']);
  assert.match(mob.snapshotNote, /pending/);
});

test('optional TSV detail fields override snapshot and projection retains real status', () => {
  const text = 'category\tname\tstatus\tnote\tsource\tsummary\tchecklist\tids\nentities\tSlime\tpartial\tOriginal\tcrates/pumpkin-core/src/entity/mob/slime.rs\tCustom summary.\t["Custom check"]\t["minecraft:slime"]\n';
  const rows = parseTracker(text); validate(rows);
  const [item] = enrich(rows, snapshot, verified.paths);
  assert.equal(item.summary, 'Custom summary.'); assert.deepEqual(item.checklist, ['Custom check']); assert.deepEqual(item.ids, ['minecraft:slime']);
  const result = project([item]); assert.equal(result.complete, 1); assert.equal(result.partial, 0); assert.equal(result.sourceTotals.partial, 1); assert.equal(result.items[0].sourceStatus, 'partial'); assert.equal(result.items[0].sourceNote, 'Original');
});

test('malformed JSON, duplicate rows, traversal and unverified source are rejected or withheld', () => {
  assert.throws(() => parseTracker('category\tname\tstatus\tchecklist\nx\ty\tdone\t{}'), /JSON array/);
  assert.throws(() => parseTracker('category\tname\tstatus\tids\nx\ty\tdone\t['), /Invalid JSON/);
  assert.throws(() => validate([{category:'x',name:'y',status:'done'},{category:'x',name:'y',status:'done'}]), /Duplicate/);
  assert.throws(() => validate([{category:'x',name:'y',status:'done',source:'../secret'}]), /Invalid source/);
  const [item] = enrich([{category:'entities',name:'Slime',status:'done',source:'unknown.rs'}], snapshot, verified.paths);
  assert.equal(item.source, undefined); assert.equal(item.unverifiedSource, 'unknown.rs');
});

test('offline fallback preserves optional TSV fields and raw audit values', () => {
  const previous = {items:[{category:'entities',name:'Slime',status:'done',sourceStatus:'partial',sourceCovered:'REVIEW',sourceIssues:'7:open',sourceNote:'original',sourcePath:'crates/pumpkin-core/src/entity/mob/slime.rs',sourceSummary:'Custom summary.',sourceChecklist:['Custom check'],sourceIds:['minecraft:slime']}]};
  const [row] = restoreSnapshot(previous);
  assert.equal(row.status,'partial'); assert.equal(row.note,'original'); assert.equal(row.source,previous.items[0].sourcePath); assert.deepEqual(row.checklist,['Custom check']); assert.deepEqual(row.ids,['minecraft:slime']);
});

test('duplicate required and optional TSV headers are rejected', () => {
  assert.throws(() => parseTracker('category\tname\tstatus\tname\nentities\tSlime\tdone\tOther'), /duplicate column header/);
  assert.throws(() => parseTracker('category\tname\tstatus\tsummary\tsummary\nentities\tSlime\tdone\tOne\tTwo'), /duplicate column header/);
});
