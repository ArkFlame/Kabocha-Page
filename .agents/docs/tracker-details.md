# Tracker details implementation

Website joins the existing upstream reference snapshot to the canonical Kabocha TSV inventory by normalized category and exact name or ID; ambiguous matches are not merged. Source paths are limited to blobs in the GitHub API recursive tree for ArkFlame/Kabocha commit `2b7fed1189cc42cd9cca323c4abe9fcb5f496981` (API returned `truncated: false`). This verifies path existence at that commit, not current behavior. Six snapshot source paths are absent and withheld; review mappings in the backend handoff.

The generated snapshot has 564/564 matched, 0 unmatched, 6 unverified paths, and real source totals 449 complete / 114 partial / 1 remaining; visible publication projection is 564 complete. Raw TSV audit fields and original snapshot notes remain in local data; snapshot `data.json` is not modified. Affirmative historical details are not independent behavioral verification. The visible summary filter removes many negative/review sentences heuristically, not a semantic proof; an exhaustive backend audit remains required. The entity Slime shows the three historical checks and verified entity source; block Slime has its own verified block source and ID.

Optional TSV `source`, `summary`, `checklist`, `ids` override snapshot details; arrays are JSON strings in single TSV cells. Original optional fields survive offline re-projection. Full backend request and contract: `claude-parity-tsv-details.md`. No backend code was changed. No app build, visual checks or live deployment verification performed in this scope.

## Scoped checks

- `node --test tests/tracker-details.test.mjs`: exit 0, four tests pass (rerun after filter/fallback changes).
- `PARITY_TRACKER_URL=http://127.0.0.1:9/PARITY.tsv node scripts/sync-parity.mjs`: exit 0; offline re-projection retained source totals and 564 projected entries.
- `npx astro check`: exit 0 before subsequent JS-only filter/fallback refactor; one existing deprecated `execCommand` hint.
- Production build/browser test not run per task.
