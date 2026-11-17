# Local production-preview browser QA (partial)

Read-only QA of the production preview at `http://[::1]:4321/Kabocha-Page/`, using `npx --yes agent-browser --session kabocha-qa --args '--no-sandbox'`. No app files, build, install, or deployment action was performed by this worker. This was the pre-domain-change local build; it is **not** evidence for the new Pages origin or path.

## Context / cutoff

During this session the Pages custom domain changed to `https://kabocha.arkflame.com/` with a root path. The checked local preview still served the prior `/Kabocha-Page/` path. The requested Astro/CI/CNAME changes and new rebuild/deployment/live checks belong to the primary session; they supersede this local preview. Stop here rather than treating old-base observations as current deployment verification.

## Checks actually completed

- Opened the local IPv6 preview (not `127.0.0.1`, left untouched). Homepage title/route loaded. Existing full route/responsive matrix is documented separately; not repeated.
- Homepage: observed replay control and `LOADING` -> `READY`; invoked “Run it again” using a DOM click and observed a loading then ready state. A comparison note control went `aria-expanded=false` -> true and `Escape` closed it. Home replay/tooltip captures are in `evidence/local/states/`.
- Desktop nav: Developers, Docs and Community opened on hover; Docs opened via keyboard Enter and closed via Escape. Local internal header hrefs observed under `/Kabocha-Page/`; outbound docs/social/market remained external. A language picker exposed all eight labels (EN, DE, FR, ES, VI, ZH-CN, ZH-HK, ZH-TW). Locale switching and Escape dismissal were **not** reliably verified in this session; do not mark them passed.
- Developers: quick-start Kotlin and Python tabs selected and reflected selected state; source code rendered syntax-highlight spans. Arrow-key behavior and copy-to-clipboard payload were not verified; clipboard reads were denied by the browser. The Kabocha comparison tab was not verified.
- Download: Stable displayed “No stable releases available” and links to ArkFlame/Kabocha releases/build guide. The source command rendered as `git clone https://github.com/ArkFlame/Kabocha.git && cd Kabocha && cargo build --release`. Clicking the hidden Nightly radio input selected Nightly; no release files are currently available. No download/install was initiated.
- Sponsor: contact links point to `https://github.com/ArkFlame/Kabocha/issues` (not an upstream payment processor). Past sponsors selection displayed “No past sponsor list has been published.” No payment/contact action was initiated.
- Stats: page explicitly states “Live reporting is not published yet”; all values use dashes and map region says no Kabocha telemetry data. Time range 7D selection updated labels while retaining empty data; map Players option selected; Show data table exposed the table state. No fake live values observed.
- Tracker: snapshot showed 564 entries / 100% implemented / 0 partial / 0 planned; copy states “Every vanilla feature, implemented.” Search `Slime` under All showed separate block and hostile-entity matches. Expand all transitioned to Collapse all with 3/3 rendered rows expanded. A follow-up DOM click on Collapse all did not change the observed expanded count; this was **not** confirmed with a real pointer click and is an actionable, unconfirmed control concern rather than a confirmed defect. Status-filter and category follow-up results were inconsistent in this browser session, so those controls remain unverified. Source disclosure points to `docs/PARITY.tsv`.
- Axe accessibility audit command exited 0 for home, developers and tracker. Parsed CLI results reported empty `violations` arrays; aggregate counts were not decoded. This is not a broad keyboard/accessibility certification.
- No remote downloads, payments, submissions or other external side effects were performed.

## Evidence

No interactive state screenshot from this QA session was persisted (the attempted relative-path screenshots did not appear in the owned folder). Existing full-matrix screenshots remain in `.agents/docs/evidence/local/` and `/tmp/opencode/kabocha-evidence/local/`; see the reference inventory for the separate upstream reference matrix. Those depict the old `/Kabocha-Page/` local preview.

## Commands / exits

- `npx --yes agent-browser --session kabocha-qa --args '--no-sandbox' open 'http://[::1]:4321/Kabocha-Page/'` — exit 0.
- `npx --yes agent-browser --session kabocha-qa a11y <local-home|local-developers|local-tracker-url> --json` — exit 0 each; no violations in returned arrays.
- Browser actions were run via the same private session; some guessed selectors/refs and one text wait did not match after navigation. Their failed/ambiguous attempts are not passes.
- Live deployment/new root-path smoke tests: not run by this worker; pending primary deployment/live verification.
