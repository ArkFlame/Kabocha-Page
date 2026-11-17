# Release risk review

Date: 2026-11-17
Scope: read-only source review for the release reviewer request. No app/source/config edits, build, install, deployment, remote service calls, or installer/payment actions were performed. The checked deployment target is https://arkflame.com/Kabocha-Page/ with base /Kabocha-Page.

## Actionable findings

### Medium — nested main landmarks on download and sponsor

- Evidence: src/kabocha/app.tsx:13-15 wraps every page component in <main>. src/kabocha/pages/download/Download.tsx:26 and src/kabocha/pages/sponsor/Sponsor.tsx:7 each return another <main>.
- Impact: those routes render nested main landmarks, which are invalid landmark structure and can confuse assistive-technology landmark navigation.
- Action: make the shared wrapper a neutral container, or remove the page-level main from those routes; retain exactly one main landmark per document.

### Medium — operational guides and market links resolve to Pumpkin services without upstream labeling

- Evidence: src/kabocha/links.ts:3,8 set DOCS_URL to https://docs.pumpkinmc.org and MARKET_URL to https://market.pumpkinmc.org/. Kabocha-labeled navigation and footer entries use these constants in src/kabocha/components/menu.ts:40-76, src/kabocha/components/Footer.tsx:26-47, and other page links. The footer explicitly labels Pumpkin social accounts as upstream (Footer.tsx:68-70) but does not similarly label documentation/market destinations. The existing handoff also records this as pending attribution/validation (.agents/docs/ui-handoff.md:9).
- Impact: visitors following Kabocha's docs/market actions are taken to Pumpkin-operated services; their applicability, branding and Kabocha support are not established by this source tree.
- Action: confirm these destinations are intentionally shared, then label them as upstream and identify the limits of their Kabocha applicability; otherwise replace only with confirmed Kabocha destinations. Do not invent a docs/market service.

### Medium — Pages deployment actions use movable major-version tags

- Evidence: .github/workflows/kabocha-pages.yml:24,27,35,55,68 references actions by @vN tags rather than immutable commit SHAs.
- Impact: a tag can move, so the workflow's third-party action code is not pinned to the reviewed revision. This is deployment supply-chain exposure.
- Action: pin each action to a verified full commit SHA and retain a readable version comment. Existing workflow-level permissions are appropriately narrow for Pages (contents: read, pages: write, id-token: write, lines 9-12); no fork pull_request trigger is present.

### Medium — duplicate TSV headers silently overwrite fields

- Evidence: scripts/sync-parity.mjs:22-32 splits the header and constructs rows with Object.fromEntries(headers.map(...)), but does not reject repeated header names. Repeated names silently keep the last cell for that key; validate at lines 47-57 checks row content and duplicate entry keys, not header uniqueness.
- Impact: malformed source TSV can silently replace a required or optional audit field instead of failing validation. This is a data-integrity defect at the import boundary.
- Action: reject duplicate header names before row mapping, with a row-independent schema error. Existing malformed optional JSON arrays and over-wide rows are explicitly rejected; offline fallback retains raw audit values through restoreSnapshot at lines 179-191, and schema-parse errors are not masked by stale fallback at lines 207-213.

## Checks and reassuring evidence

- Base config is static directory output with trailing slashes (astro.config.mjs:5-11); deployment workflow explicitly builds with PUBLIC_SITE_URL=https://arkflame.com and PUBLIC_BASE_PATH=/Kabocha-Page (kabocha-pages.yml:46-52). Route inventory in src/kabocha/routes.ts:17-102 uses those route paths and shared base-aware URL construction. No definite base-path mismatch was found in inspected configuration.
- Download selection is tied to ArkFlame/Kabocha releases and filters release-page and asset URLs to that repository (src/kabocha/pages/download/Download.tsx:19-20,31). No artifact link to the Pumpkin upstream was observed.
- Sponsorship copy says amounts are illustrative and routes inquiries to ArkFlame/Kabocha issues; it publishes no payment destination (src/kabocha/pages/sponsor/Sponsor.tsx:7-9). No money redirection defect was found.
- Telemetry hook explicitly supplies empty observations because no Kabocha endpoint is published (src/kabocha/pages/stats/useTelemetry.ts:4-13); it does not present synthetic usage as observed data.
- Parity projection intentionally shows publication completion as directed by the goal. Source status, issue, note, and optional audit fields remain separate (scripts/sync-parity.mjs:130-153,179-191); no issue is raised against the requested 100% projection. The six unverified source paths are documented as withheld in .agents/docs/tracker-details.md:3, and backend audit guidance is in .agents/docs/claude-parity-tsv-details.md.
- No serialized API token/secret or unexpected analytics/ad endpoint was found in the reviewed source search. This is not a repository-wide secret scan.

## Review limits

This was source inspection only. The provided build/test/browser results were treated as primary-reported evidence, not independently rerun. No live URLs were requested. Locale completeness, service correctness/availability, production rendering, and actual remote deployment remain outside this review; the existing docs already record outstanding verification.

## Follow-up verification and disposition (2026-11-17)

Primary reports all four medium findings resolved; the original findings above are retained as review history.

- Nested main landmarks: shared page wrapper is now neutral; the download and sponsor pages each have one main landmark. Production browser audit reported exactly one global main per page.
- Upstream docs/market links: accessible labels and titles were added to identify the upstream services and applicability limits.
- Mutable action tags: all five GitHub Actions references are pinned to verified full commit SHAs; readable version comments retained.
- Duplicate TSV headers: required and optional duplicate headers are now rejected; regression cases cover the guard.

Primary reports final build exit 0 (6.84s after these review fixes), 16 built-artifact tests passed, and the additional five tracker cases passed after the duplicate-header guard. The earlier full regression command passed 22/22 before that added case; a combined 23-test command was not run. Live browser smoke evidence is in .agents/docs/evidence/live/ with results.json; 15 HTTPS probes returned expected HTTP 200 for pages/assets and 404 for the unknown path. Production-browser evidence is reported as 10 routes at desktop plus home/tracker/stats at mobile, fonts and hydration ready, zero failed first-party assets/page errors/broken images/horizontal overflow, and 176 SVG world-map country paths. Targeted interaction QA remains underway.

Remaining limitations: full visual parity is not claimed; service-backed release/telemetry/funding data and deeper backend source details require separate audit. Locale coverage is partial with English fallback. This follow-up incorporates primary-reported verification; it was not independently rerun by the read-only reviewer.
