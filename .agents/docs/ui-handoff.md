# UI adaptation handoff

Adapted from Pumpkin-MC/Pumpkin-Website commit 4372cae39656e9dcf470c31c94b6e36914bf25c5; upstream website license metadata was null, not evidence of a website-source license. Credits remain in footer.

Astro/React routes, base-aware paths, locally hosted font, green theme and generated parity projection are present. The projected 100% statuses are publication copy, not backend verification. Source status/notes are not shown in tracker rows. Download, sponsor and stats use provisional honest empty states rather than upstream services. Contributors query ArkFlame/Kabocha.

Checks: npm install exit 0 (earlier session); npx astro check initially exit 1, after fixes exit 0 (two hints). Production build and browser tests not run by this worker.

Pending: verify full production build and built-site tests, responsive screenshots and interactions, locale copy accuracy, release/API empty states, snippet syntax highlighting, and exact visual fidelity. Download/stats/sponsor currently differ materially from upstream interactive layouts. Links to upstream documentation, blog, market and plugin projects refer to upstream services and need explicit attribution/validation. No deployment or live verification performed.

## UI follow-up

Restored upstream social destinations with explicit Pumpkin labels, syntax-colored Shiki tokens for all 29 snippets, disabled the optional Astro dev toolbar, corrected comparison-header foreground contrast, and translated launch-completion facts in all eight locales plus Chinese tracker summary and categories. Four upstream locales (German, Spanish, French, Vietnamese) only contain nav/hero/facts upstream; remaining interface sections still fall back to English and need full translations. Chinese and other localized copy beyond the modified launch fields still needs an editorial review for stale claims. Highlight tokens are generated snapshots and must be regenerated if snippets or theme change. Production screenshot and accessibility recheck are pending. No app build was run for this follow-up.

Follow-up checks: `node --test tests/ui-source.test.mjs` exit 0; `npx astro check` exit 0, two hints. A subsequent minor cleanup removed an unused map index and redundant untranslated tracker details; not rechecked.
