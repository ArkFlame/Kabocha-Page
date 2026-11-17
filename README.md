# Kabocha — Astro website

Static, pixel-matched Kabocha landing site built with Astro on the green Kabocha palette and original mascot artwork.

This repository is the standalone site (`ArkFlame/Kabocha-Page`), not a subdirectory of the `ArkFlame/Kabocha` Rust project. Astro sources live at the repository root; the deployable build is produced by `npm run build` into `dist/`.

## Development

```bash
npm ci
npm run dev
npm run build
npm run preview
```

`npm run build` runs three steps in order:

1. `node scripts/sync-parity.mjs` — refreshes `src/data/parity.generated.json` from the public Kabocha tracker (or keeps the last committed snapshot when the tracker is unreachable).
2. `astro check` — type and template diagnostics.
3. `astro build` — emits the static site to `dist/`.

Local builds default to the production Pages site; `PUBLIC_SITE_URL` and `PUBLIC_BASE_PATH` override `site` and `base` at build time.

Deployment targets **https://kabocha.arkflame.com/** at the custom-domain root (`PUBLIC_BASE_PATH=/`). The workflow derives origin and base path from GitHub Pages metadata, normalizes the origin to HTTPS, and handles an empty base path as `/`. `PUBLIC_SITE_URL` and `PUBLIC_BASE_PATH` remain available for local or alternate-host overrides. The root `public/CNAME` records `kabocha.arkflame.com`.

## Deployment

Deployment runs through the official GitHub Pages artifact flow in `.github/workflows/kabocha-pages.yml`:

- triggers on every push to `main` and on manual `workflow_dispatch`;
- installs with `npm ci` on Node 24 and builds with `npm run build`;
- derives `PUBLIC_SITE_URL` and `PUBLIC_BASE_PATH` from `configure-pages` outputs (HTTPS-normalized origin; empty base path becomes `/`);
- uploads `dist/` via `actions/upload-pages-artifact` and publishes via `actions/deploy-pages`;
- requests only `contents: read`, `pages: write` and `id-token: write`.

Live target: **https://kabocha.arkflame.com/**. The custom domain now targets the root path; `public/CNAME` is included in the Pages artifact. HTTPS enforcement/certificate issuance is pending; do not infer it from an HTTPS browser response alone.

One-time provisioning: in **Settings → Pages**, set **Source** to **GitHub Actions**. No build branch, `gh-pages` branch, base path or `.nojekyll` file is needed — artifact deployments are served directly by Pages without Jekyll processing.

Operational details, required settings, provisioning commands and the current (unverified live) state are recorded in [.agents/docs/deployment.md](.agents/docs/deployment.md). Those internal docs are not part of the public site.

## Parity content

`scripts/sync-parity.mjs` reads `../docs/PARITY.tsv` when the site sits next to the source repository, otherwise it fetches the public tracker from GitHub and writes `src/data/parity.generated.json`. The rendered audit lives at `/parity/`.

Two different things are shown on that page, and they must not be conflated:

- **Requested launch copy** — the public site presents the project's all-features-complete, 100% parity publication projection. This is a launch-copy assumption requested for publication, applied through the data worker's generated projection; it is not backend, QA or implementation evidence.
- **Actual tracker evidence** — the generated entry counts and statuses the sync script can derive from the tracker. The build never forges these values to match a reference screenshot, and no row is marked verified merely to reach a target percentage.

Splash performance figures reproduce the reference design. The detailed performance section labels them as **PumpkinMC upstream reference metrics**, not measured Kabocha benchmarks. Download links point at GitHub Releases and only resolve once binaries are published.

No external UI framework, analytics or runtime network requests are required for the public site.
