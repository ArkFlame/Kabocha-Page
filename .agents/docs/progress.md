# Kabocha-Page progress

Updated: 2026-11-17. Root-path fix commit 95705089b32ecd13bc2d26da908beef9fd5cdea6 is pushed; current-domain workflow and reported live checks passed. The 100% parity UI is publication projection, not backend QA evidence.

## Status checklist

| Scope | Status | Evidence |
| --- | --- | --- |
| Assets and parity projection | PASS (scoped) | Worker checks in [assets-data.md](assets-data.md): node --check scripts/sync-parity.mjs, sync, offline fallback, projection sums and favicon checksum. Public projection is 564/564; independent source totals remain 449 complete, 114 partial, 1 remaining. |
| Implementation build | PASS | Primary reports latest npm run build exit 0; 10 root routes generated. Root-path build took 8.96s; final build after review fixes took 6.84s. |
| Regression tests | PASS | node --test tests/*.test.mjs src/kabocha/pages/stats/stats.test.mjs passed 22/22 before duplicate-header coverage was added. Subsequently 16 built-artifact tests and five tracker cases passed separately. Current-domain node --test tests/site.test.mjs passed 17/17, including the root/custom-domain regression. Do not imply one combined 23-test run. |
| Tracker detail adaptation | PASS (scoped) | All 564 rich-detail rows matched; 0 unmatched. Six unverified source paths withheld. Raw source audit (449/114/1) kept separate from the all-complete launch projection. See [claude-parity-tsv-details.md](claude-parity-tsv-details.md). |
| Local browser matrix | PASS (scoped) | 30 route × viewport captures (1342×900, 768×1024, 390×844); no overflow, broken images, or browser errors. Eight selected captures and manifest/metrics under .agents/docs/evidence/local/; full capture set at /tmp/opencode/kabocha-evidence/local. First matrix wait timed out on offscreen lazy avatars; harness was corrected to wait only for fonts/rendered data. Tablet root clipping was fixed. |
| Map and accessibility checks | PASS (scoped) | 188 SVG map paths rendered; stats accessibility audit 49 passes, 0 violations. Home's initial contrast issue was fixed; targeted keyboard/locales/filter/collapse checks remain incomplete (see browser-verification.md). |
| Reference inventory | PASS (scoped) | [reference-inventory.md](reference-inventory.md), 16 durable reference captures. |
| Targeted interactions and release review | IN PROGRESS | Browser QA and read-only release review underway; see their final notes when available. |
| Pages deployment and live routes | PENDING | Pages is provisioned for kabocha.arkflame.com at root; HTTPS enforcement is pending certificate issuance. The previous /Kabocha-Page build produced broken asset URLs after the domain change. Root-path fix is pending build/deploy, live route and asset checks. |

## Fidelity and known limitations

- UI adapts upstream React into Astro; it is not a claim of pixel-perfect parity. Release review must document remaining visual/behavior differences.
- The current release API has no releases; Kabocha telemetry/funding services are not available. Honest empty states differ from populated upstream reference states. Do not fabricate releases, telemetry, payments, or binaries.
- Upstream de/es/fr/vi locale coverage is partial and falls back to English, matching reference behavior; do not claim all strings are newly translated.
- Build emits a deprecated execCommand hint for clipboard fallback and a 524 kB bundle warning; no build errors. These are disclosed, not represented as failed checks.
- Upstream source commit 4372cae39656e9dcf470c31c94b6e36914bf25c5 had no detected license; preserve attribution/provenance and review redistribution before publication. See [assets-data.md](assets-data.md).
- The favicon remains unchanged; see its verified SHA-256 and asset measurements in [assets-data.md](assets-data.md).

## Remaining release gates

1. Finish targeted browser interactions and read-only release review; update this log with their actual results.
2. Commit/push the implementation (primary owns this); confirm the Pages workflow succeeds.
3. Verify live HTTPS and route/assets at https://kabocha.arkflame.com/, including /, /parity/, and a nested route; primary records evidence here and in [deployment.md](deployment.md).
