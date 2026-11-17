# Kabocha implementation handoff

Follow [.agents/docs/kabocha-parity-goal.md](.agents/docs/kabocha-parity-goal.md) for the full-site implementation and publication goal.

- Preserve green Kabocha branding, the unchanged favicon, Astro static GitHub Pages compatibility, and unrelated work/secrets.
- The requested 100% feature-parity launch copy is a publication assumption, not proof of backend completion or successful checks. Record actual verification honestly; never claim unverified perfection.
- Keep durable findings, route/state inventory, measurements, asset origins, completed/pending work, commands/exits, screenshots and deployment evidence under project-local .agents/docs/; keep these docs off public pages.
- Update this handoff as findings change. Follow the goal's production build, deployment, commit/push and live verification requirements.

## Repository and deployment facts

- Origin: https://github.com/ArkFlame/Kabocha-Page.git, branch main, standalone Astro site at the repository root.
- Pages is enabled with build_type: workflow; the current custom domain is kabocha.arkflame.com at root. Keep public/CNAME aligned; do not change DNS or the Pages domain setting.
- Astro defaults to site https://kabocha.arkflame.com and base /. Workflow derives origin/base_path from configure-pages and normalizes origin to HTTPS and blank root base to /. PUBLIC_* overrides remain supported. Internal links use import.meta.env.BASE_URL.
- Production build and regression tests have passed locally. Live deployment remains pending commit/push, workflow success, and live route verification. GitHub Pages HTTPS enforcement is not yet enabled: the API PUT failed with certificate-not-ready HTTP 404; browser HTTPS success is not proof of GitHub enforcement. A local build is not deployment verification.

## Durable docs

- [.agents/docs/assets-data.md](.agents/docs/assets-data.md) — converted artwork, favicon hash, local font, upstream asset provenance and parity projection.
- [.agents/docs/deployment.md](.agents/docs/deployment.md) — workflow, Pages provisioning and live verification status/checklist.
- [.agents/docs/verification-plan.md](.agents/docs/verification-plan.md) — built-site test coverage and deferred checks.
- [.agents/docs/claude-parity-tsv-details.md](.agents/docs/claude-parity-tsv-details.md) — detailed tracker-row adaptation.
- [.agents/docs/reference-inventory.md](.agents/docs/reference-inventory.md) — completed reference inventory and captures.
- [.agents/docs/progress.md](.agents/docs/progress.md) — actual scoped checks, browser matrix and remaining release gates.
