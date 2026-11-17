# Kabocha-Page deployment

Scope: Astro static site in ArkFlame/Kabocha-Page (branch main), published with GitHub Actions to GitHub Pages.

## Current repository and Pages facts

- Remote: https://github.com/ArkFlame/Kabocha-Page.git; standalone site at repository root, default branch main.
- Pages is enabled with build_type: workflow; current user-selected custom domain is kabocha.arkflame.com and the target URL is http://kabocha.arkflame.com/ (as reported by the Pages API). The repo must publish public/CNAME with that hostname. Do not change DNS or Pages custom-domain settings.
- Actual site target is the custom-domain root, base /. Astro defaults to https://kabocha.arkflame.com and /. Workflow derives origin/base_path from configure-pages outputs and normalizes origin to HTTPS; an empty base path is normalized to /. PUBLIC_* overrides remain supported.
- Root-path fix commit 95705089b32ecd13bc2d26da908beef9fd5cdea6 was pushed. Pages workflow 44141125159 succeeded (build 27s, deploy 10s): https://github.com/ArkFlame/Kabocha-Page/actions/runs/44141125159. Primary reports live root-domain checks passed. GitHub Pages HTTPS enforcement remains false/not confirmed; valid TLS is not equivalent to the API enforcement flag.

## Workflow

.github/workflows/kabocha-pages.yml

- Triggers on push to main and workflow_dispatch.
- Permissions: contents: read, pages: write, id-token: write; concurrency group pages, cancel-in-progress false.
- Steps: checkout@v7 (3d3c42e5aac5ba805825da76410c181273ba90b1), setup-node@v7 (949feb2413d6458794dcd2491c4babbbce0c15c1; Node 24), configure-pages@v6 (45bfe0192ca1faeb007ade9deae92b16b8254a0d), npm ci, npm run build, upload-pages-artifact@v5 (fc324d3547104276b827a68afc52ff2a11cc49c9), deploy-pages@v5 (368f82528645a54fb793d4d04e342629a3f51346) using github-pages environment.
- Build env is derived from configure-pages outputs: origin is normalized to HTTPS (certificate provisioning can cause the action to report HTTP), and empty base_path is normalized to /. Both resolved values are reported in the run summary.
- Build command: node scripts/sync-parity.mjs && astro check && astro build. Tracker sync needs network to raw.githubusercontent.com; if unreachable it retains/reprojects the committed snapshot. Pages artifact deployment serves files directly; .nojekyll is unnecessary.

## Current domain and HTTPS record (2026-11-17)

- Primary changed the Pages custom domain to kabocha.arkflame.com. API state provided: build_type workflow, cname kabocha.arkflame.com, html_url http://kabocha.arkflame.com/, https_enforced false.
- The earlier /Kabocha-Page deployment generated broken asset URLs after the domain changed; that state is historical and is not evidence about the current root deployment.
- HTTPS certificate hostname validation passed for kabocha.arkflame.com (wildcard *.arkflame.com, expiry 2027-01-06). The Pages API HTTPS enforcement PUT failed with certificate-not-ready HTTP 404; API still reports https_enforced false. Do not claim enforcement or infer the certificate provider.

## Provisioning record (2026-11-17)

- gh api --method POST repos/ArkFlame/Kabocha-Page/pages -f build_type=workflow → exit 0; Pages enabled.
- gh api --method PUT repos/ArkFlame/Kabocha-Page/pages -F https_enforced=true → exit 0.
- Earlier API state for arkflame.com/Kabocha-Page was superseded by the current custom domain; do not treat that old URL/HTTPS setting as current evidence.

## Current root-path verification (primary-reported)

- Commit 95705089b32ecd13bc2d26da908beef9fd5cdea6 fixed root-path output and was pushed. Workflow run 44141125159 succeeded: https://github.com/ArkFlame/Kabocha-Page/actions/runs/44141125159 (build 27s, deploy 10s).
- `npm run build` exited 0; generated 10 routes; build took 8.96s. `node --test tests/site.test.mjs` exited 0, 17/17 passed, including a custom-domain regression.
- Generated index has no /Kabocha-Page asset/module prefixes, canonical URL is the current custom domain, and public/CNAME matches it.
- 19 current-domain HTTP checks returned 200: ten routes plus artwork, icon, favicon, local font CSS/WOFF2, generated stylesheet and client/entry JS. Results: .agents/docs/evidence/custom-domain/http-results.json.
- Production Chrome checked all ten routes at 1342×900 and home/tracker/stats at 390×844 (13 captures). All hydrated and loaded fonts; zero old-base references, failed first-party assets, broken images, page errors, or horizontal overflow. Screenshots and browser-results.json are in .agents/docs/evidence/custom-domain/. SSL hostname validation passed. These reports do not demonstrate full visual parity.
- GitHub Pages HTTPS enforcement is not yet enabled/confirmed. A previous API attempt failed with certificate-not-ready HTTP 404; API state reported false. Browser TLS validity is separate from GitHub's enforcement setting.
- Earlier arkflame.com/Kabocha-Page checks and workflow 44139165102 are historical, superseded by the current custom-domain-root deployment. The failed legacy Jekyll run 44139155753 followed an unexpected switch to legacy build mode; it is not an Astro workflow failure and does not justify changing Astro frontmatter.

## Remaining verification

- Targeted interaction QA remains incomplete; see .agents/docs/browser-verification.md for unchecked keyboard, locale, filter and collapse states.
- Full pixel/behavior parity is UNVERIFIED; upstream-backed releases, telemetry and funding are unavailable, and locale fallback remains partial. Do not invent service results or claim perfection.
- Follow up on GitHub Pages HTTPS enforcement when certificate readiness permits. Do not change DNS or the Pages custom-domain setting.
- Update this record after later verification; commit/push and workflow evidence above do not establish checks not listed here.
