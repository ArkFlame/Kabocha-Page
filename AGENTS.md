# Kabocha implementation handoff

Follow [.agents/docs/kabocha-parity-goal.md](.agents/docs/kabocha-parity-goal.md) for the full-site implementation and publication goal.

- Preserve green Kabocha branding, the unchanged favicon, Astro static GitHub Pages compatibility, and unrelated work/secrets.
- The requested 100% feature-parity launch copy is a publication assumption, not proof of backend completion or successful checks. Record actual verification honestly; never mark unchecked tasks done or claim unverified perfection.
- Keep durable findings, route/state inventory, measurements, asset origins, completed/pending work, commands/exits, screenshots and deployment evidence under project-local `.agents/docs/`; keep these docs off public pages.
- Update this handoff as findings change. Follow the goal's production build, deployment, commit/push and live verification requirements during implementation.

## Known deployment quirk (reported, not rechecked here)

Origin: `https://github.com/ArkFlame/Kabocha-Page.git`; branch: `main`. Config defaults to `https://arkflame.github.io` with base `/Kabocha`, potentially mismatching repository Pages `/Kabocha-Page`. Derive the actual Pages URL/custom-domain settings; do not blindly assume either base. Reported `gh api repos/ArkFlame/Kabocha-Page/pages` returned 404, exit 1 (disabled Pages or insufficient permissions possible): live deployment is UNVERIFIED. Provision/fix the Pages workflow if needed; local build is not deployment verification. Existing source is untracked and README modified: preserve these changes.
