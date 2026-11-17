# Kabocha-Page deployment

Scope: Astro static site in ArkFlame/Kabocha-Page (branch main), published with GitHub Actions to GitHub Pages.

## Current repository and Pages facts

- Remote: https://github.com/ArkFlame/Kabocha-Page.git; standalone site at repository root, default branch main.
- Pages is enabled with build_type: workflow; current user-selected custom domain is kabocha.arkflame.com and the target URL is http://kabocha.arkflame.com/ (as reported by the Pages API). The repo must publish public/CNAME with that hostname. Do not change DNS or Pages custom-domain settings.
- Actual site target is the custom-domain root, base /. Astro defaults to https://kabocha.arkflame.com and /. Workflow derives origin/base_path from configure-pages outputs and normalizes origin to HTTPS; an empty base path is normalized to /. PUBLIC_* overrides remain supported.
- Deployment is pending commit/push and a successful workflow run. Local production build and tests passed, but no deployed workflow, live route, or remote asset response is verified yet.

## Workflow

.github/workflows/kabocha-pages.yml

- Triggers on push to main and workflow_dispatch.
- Permissions: contents: read, pages: write, id-token: write; concurrency group pages, cancel-in-progress false.
- Steps: checkout@v7 (3d3c42e5aac5ba805825da76410c181273ba90b1), setup-node@v7 (949feb2413d6458794dcd2491c4babbbce0c15c1; Node 24), configure-pages@v6 (45bfe0192ca1faeb007ade9deae92b16b8254a0d), npm ci, npm run build, upload-pages-artifact@v5 (fc324d3547104276b827a68afc52ff2a11cc49c9), deploy-pages@v5 (368f82528645a54fb793d4d04e342629a3f51346) using github-pages environment.
- Build env is derived from configure-pages outputs: origin is normalized to HTTPS (certificate provisioning can cause the action to report HTTP), and empty base_path is normalized to /. Both resolved values are reported in the run summary.
- Build command: node scripts/sync-parity.mjs && astro check && astro build. Tracker sync needs network to raw.githubusercontent.com; if unreachable it retains/reprojects the committed snapshot. Pages artifact deployment serves files directly; .nojekyll is unnecessary.

## Domain and HTTPS record (2026-11-17)

- Primary changed the Pages custom domain to kabocha.arkflame.com. API state provided: build_type workflow, cname kabocha.arkflame.com, html_url http://kabocha.arkflame.com/, https_enforced false.
- Primary reports root HTML returns HTTP 200, but the old `/Kabocha-Page/` assets returned 404 because the built site used the repository subpath. Root `/kabocha.webp` returned 200.
- Primary attempted `gh api --method PUT repos/ArkFlame/Kabocha-Page/pages -F https_enforced=true`; it failed exit 1 with HTTP 404 “The certificate does not exist yet”. Browser/curl HTTPS root reportedly returns 200 with valid TLS, but this does not prove GitHub Pages `https_enforced` is enabled. Re-attempt after deploying the CNAME/root-path artifact; remain honest about pending enforcement.

## Provisioning record (2026-11-17)

- gh api --method POST repos/ArkFlame/Kabocha-Page/pages -f build_type=workflow → exit 0; Pages enabled.
- gh api --method PUT repos/ArkFlame/Kabocha-Page/pages -F https_enforced=true → exit 0.
- Earlier API state for arkflame.com/Kabocha-Page was superseded by the current custom domain; do not treat that old URL/HTTPS setting as current evidence.

## Local verification (not deployment verification)

- Primary reports final npm run build exit 0; 10 generated routes (/, /download, /developers, /sponsor, /contributors, /stats, /tracker, /parity, /donate, /404.html). Final build took 3.33s after root overflow/clip fix. Earlier combined build timed out at 120s; a 600s rerun succeeded in 177s, followed by the latest 3.33s build.
- node --test tests/*.test.mjs src/kabocha/pages/stats/stats.test.mjs → exit 0, 22 passed, 0 failed.
- Browser/local evidence and limitations are in progress.md, verification-plan.md, and reference-inventory.md.

## Live verification after push

Run and record actual results; do not mark deployment complete based on local artifacts:

    gh workflow list --repo ArkFlame/Kabocha-Page
    gh run list --repo ArkFlame/Kabocha-Page --workflow kabocha-pages.yml --limit 5
    gh run watch --repo ArkFlame/Kabocha-Page <run-id>
    gh api repos/ArkFlame/Kabocha-Page/pages --jq '{html_url,status,build_type,cname,https_enforced}'
    curl -sS -o /dev/null -w '%{http_code} %{url_effective}\n' https://kabocha.arkflame.com/

Then render /, /parity/, and a nested route under https://kabocha.arkflame.com/; verify all asset URLs use the custom-domain root (no repository prefix), the Pages workflow succeeds, HTTPS works, and HTTP redirects to HTTPS. Retest the Pages HTTPS-enforcement API after certificate issuance; valid browser TLS alone is not proof that enforcement is enabled. Record workflow/run IDs, commands/exits, route evidence and screenshots here and in progress.md. The primary owns the eventual live-verification update.
