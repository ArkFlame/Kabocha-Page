import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
const read = file => readFileSync(new URL(file, import.meta.url), 'utf8');
test('dashboard renders empty chart and map without telemetry fetches', () => {
  const stats = read('./Stats.tsx');
  const chart = read('./TrendChart.tsx');
  const hook = read('./useTelemetry.ts');
  const map = read('./WorldMap.tsx');
  assert.match(stats, /<TrendChart data=\{trends \?\? \[\]\}/);
  assert.match(stats, /<WorldMap/);
  assert.match(chart, /data\.length === 0 && \([\s\S]*?<svg/);
  assert.match(hook, /const trends: TrendPoint\[\] = \[\]/);
  assert.match(hook, /const geo: GeoEntry\[\] = \[\]/);
  assert.doesNotMatch(hook, /\bfetch\s*\(/);
  assert.match(map, /onZoomKey/);
});
