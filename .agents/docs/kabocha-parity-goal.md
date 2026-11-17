# Kabocha full-site parity goal
Finish the ENTIRE site as a pixel-perfect replica of https://pumpkinmc.org/, adapted to Kabocha. No filler, explanatory banners, questions, or homepage-only finish.

## Discover, then implement
Inventory all same-site routes, navbar/dropdown destinations, footer links, download/docs/developer/community/tracker/market/locales where applicable, every section/table and interaction. Separate internal pages from external destinations; do not invent services. Capture reference screenshots/route states first. Live reference is authoritative; supplied screenshots are context (hero alternatives differ). Prioritize missing navbar/incorrect fonts.
Match reference copy, composition, actual font families/weights, typography, spacing, breakpoints, nonbrand colors, borders, offset shadows, icons, illustrations, animation/timing, responsive/interactive states. Replace Pumpkin product mentions with Kabocha and upstream project/repo actions with https://github.com/ArkFlame/Kabocha where appropriate; preserve legal/license attribution. Keep logo-derived green Kabocha branding: consistently map orange/coral brand accents to green, not semantic warnings/errors or indiscriminately recolored illustrations.

## Assets
Use existing green Kabocha artwork; locate existing kabocha logo and kabocha-clip PNGs, convert to kabocha.webp and kabocha-clip.webp preserving transparency/quality; update references; remove only replaced PNGs. Leave favicon unchanged. Never use the orange Pumpkin mascot as Kabocha. Attachments if needed:
- /home/linsaftw/Downloads/ChatGPT Image Nov 17, 2026, 01_22_01 PM.png
- /home/linsaftw/Downloads/screencapture-pumpkinmc-org-2026-11-17-13_22_10.png
Also consult the inline parity screenshot if available.

## Launch copy, not backend evidence
Assume Kabocha has reached 100% Minecraft/Vanilla feature parity for publication. EVERY Kabocha feature row/category is implemented/complete; all progress views show 100%, with zero partial/planned/remaining. Keep sums, counts, filters, search, details, badges and charts consistent; derive actual entry count, never hardcode screenshot's 564. Replace stale Kabocha incomplete/early-development disclaimers with final-release copy retaining composition/space. Do NOT change competitor statuses falsely. Not backend/QA evidence: never check off implementation/verification before checking.

## Build, verify, publish
Preserve Astro static GitHub Pages architecture, existing scripts/deployment, base-aware assets/internal links, nested direct routes; no runtime server dependence or broken placeholder controls. Defaults: PUBLIC_SITE_URL=https://arkflame.github.io, PUBLIC_BASE_PATH=/Kabocha; directory output/trailing slashes. Derive actual Pages URL/base; see AGENTS.md quirk. npm run build runs parity sync, astro check, astro build; use actual Pages site/base.
Compare matched desktop/mobile/tablet screenshots for ALL routes and key states against reference; fix diffs. Check keyboard/focus, menus, responsive tables, reduced motion, links, missing fonts/assets, console errors, production build and nested Pages routes/assets.
Commit all task changes, preserve unrelated changes/secrets, push current branch without force. Verify successful GitHub Actions Pages deployment, then actual live deployed routes, screenshots and console. Report deployment URL, real commands/exits, results and blockers. No unverified perfection claims.

## Handoff
Maintain local .agents/ (not /.agents): route inventory, exact completed work, quirks, typography/color measurements, asset origins, pending tasks, commands/exits and screenshot evidence. Update root AGENTS.md for handoff; keep docs off public pages and verification truthful.
If supported, use subagents for independent files/deliverables; serialize overlapping edits/builds. Resolve real IDs: prefer DeepSeek v4.1 Flash free, then GPT Luna routine/Terra difficult; no invented IDs or blocking on unavailable models. Finish all routes.
