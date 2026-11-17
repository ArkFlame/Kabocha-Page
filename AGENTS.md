# Kabocha implementation handoff

Follow [.agents/docs/kabocha-parity-goal.md](.agents/docs/kabocha-parity-goal.md) for the full-site implementation and publication goal.

- Preserve green Kabocha branding, the unchanged favicon, Astro static GitHub Pages compatibility, and unrelated work/secrets.
- The requested 100% feature-parity launch copy is a publication assumption, not proof of backend completion or successful checks. Record actual verification honestly; never claim unverified perfection.
- Keep durable findings, route/state inventory, measurements, asset origins, completed/pending work, commands/exits, screenshots and deployment evidence under project-local .agents/docs/; keep these docs off public pages.
- Update this handoff as findings change. Follow the goal's production build, deployment, commit/push and live verification requirements.

## Repository and deployment facts

- Origin: https://github.com/ArkFlame/Kabocha-Page.git, branch main, standalone Astro site at the repository root.
- Current custom domain is kabocha.arkflame.com at root; keep public/CNAME aligned and do not change DNS or Pages domain settings.
- Astro defaults to https://kabocha.arkflame.com and base /. Workflow derives site/base from configure-pages, normalizing to HTTPS and root; PUBLIC_* overrides remain supported.
- Root-path fix commit 95705089b32ecd13bc2d26da908beef9fd5cdea6 was pushed; Pages workflow 44141125159 succeeded. Primary reports production build, root asset checks and production browser smoke checks passed. TLS hostname validation passed, but GitHub Pages https_enforced remains false/not yet confirmed. See deployment.md and progress.md; historical /Kabocha-Page checks are not evidence for the current domain.

## Durable docs

- [.agents/docs/assets-data.md](.agents/docs/assets-data.md) — converted artwork, favicon hash, local font, upstream asset provenance and parity projection.
- [.agents/docs/deployment.md](.agents/docs/deployment.md) — workflow, Pages provisioning and live verification status/checklist.
- [.agents/docs/verification-plan.md](.agents/docs/verification-plan.md) — built-site test coverage and deferred checks.
- [.agents/docs/claude-parity-tsv-details.md](.agents/docs/claude-parity-tsv-details.md) — detailed tracker-row adaptation.
- [.agents/docs/reference-inventory.md](.agents/docs/reference-inventory.md) — completed reference inventory and captures.
- [.agents/docs/progress.md](.agents/docs/progress.md) — actual scoped checks, browser matrix and remaining release gates.
