# Kabocha-Page deployment

Scope: Astro static site in ArkFlame/Kabocha-Page (branch main), published with GitHub Actions to GitHub Pages.

## Current repository and Pages facts

- Remote: https://github.com/ArkFlame/Kabocha-Page.git; standalone site at repository root, default branch main.
- Pages is enabled with build_type: workflow; the API reports html_url https://arkflame.com/Kabocha-Page/, https_enforced true, cname null. The organization custom domain arkflame.com is inherited; do not change its DNS/domain settings.
- Actual site base is /Kabocha-Page, production origin https://arkflame.com. Astro defaults are in astro.config.mjs; workflow sets PUBLIC_SITE_URL=https://arkflame.com and PUBLIC_BASE_PATH=/Kabocha-Page.
- Deployment is pending commit/push and a successful workflow run. Local production build and tests passed, but no deployed workflow, live route, or remote asset response is verified yet.

## Workflow

.github/workflows/kabocha-pages.yml

- Triggers on push to main and workflow_dispatch.
- Permissions: contents: read, pages: write, id-token: write; concurrency group pages, cancel-in-progress false.
- Steps: checkout v7, setup-node v7 (Node 24), configure-pages v6, npm ci, npm run build, upload dist artifact v5, deploy-pages v5 using github-pages environment.
- Build env: PUBLIC_SITE_URL=https://arkflame.com, PUBLIC_BASE_PATH=/Kabocha-Page. configure-pages outputs origin/base path/base URL to the run summary for comparison with explicit HTTPS env values.
- Build command: node scripts/sync-parity.mjs && astro check && astro build. Tracker sync needs network to raw.githubusercontent.com; if unreachable it retains/reprojects the committed snapshot. Pages artifact deployment serves files directly; .nojekyll is unnecessary.

## Provisioning record (2026-11-17)

- gh api --method POST repos/ArkFlame/Kabocha-Page/pages -f build_type=workflow → exit 0; Pages enabled.
- gh api --method PUT repos/ArkFlame/Kabocha-Page/pages -F https_enforced=true → exit 0.
- Subsequent API state: https://arkflame.com/Kabocha-Page/, HTTPS enforced, workflow build source, cname null. Earlier initial provisioning response was HTTP/status null; superseded by the later HTTPS-enforced API state.

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
    curl -sS -o /dev/null -w '%{http_code} %{url_effective}\n' https://arkflame.com/Kabocha-Page/

Then render /, /parity/, and a nested route under https://arkflame.com/Kabocha-Page/; verify assets resolve under /Kabocha-Page/, the Pages workflow succeeds, HTTPS works, and HTTP redirects to HTTPS. Record workflow/run IDs, commands/exits, route evidence and screenshots here and in progress.md. The primary owns the eventual live-verification update.
