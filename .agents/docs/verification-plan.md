# Built-site verification plan

Owner: tests/site.test.mjs (CODER). Scope is the built Astro artifact in dist/ plus src/data/parity.generated.json. This plan does not authorize source, package, build or deployment edits.

## Invocation

Run after the final production build, from the repository root:

    PUBLIC_BASE_PATH=/Kabocha-Page node --test tests/site.test.mjs

PUBLIC_BASE_PATH defaults to /Kabocha-Page in the test. The expected production origin is https://arkflame.com (base /Kabocha-Page); tests never contact it.

Prerequisite: npm run build (parity sync, astro check, astro build) has completed successfully and dist/ reflects the final implementation. The test command itself performs no build, install, network request, browser launch or file write.

## Covered by the test

- Route artifacts for /, /download/, /developers/, /sponsor/, /contributors/, /stats/, /tracker/, /parity/ alias and 404.html. Content routes must have a Kabocha title; /parity/ may instead be a redirect page whose target is /tracker/.
- Built internal references from a, img, script, link, source, video, audio, track and iframe elements: href, src, poster and srcset. Each local destination must include the configured base, resolve to a real file under dist/, and honor directory output (trailing-slash routes must be index.html). External schemes, data URLs, protocol-relative URLs, hash-only and query-only references are skipped.
- No references to removed kabocha.png or kabocha-clip.png artwork; no Pumpkin media URLs in img, source, video, audio or link elements. Upstream Pumpkin text/legal attribution is not blanket-banned.
- Accessible page shell: html lang, viewport meta, main landmark, a nav landmark containing at least one anchor, and alt on every img.
- Converted assets: non-empty dist/kabocha.webp and dist/kabocha-clip.webp; retired PNGs absent from dist/ and public/.
- Favicon: public/favicon.png and dist/favicon.png exist and match SHA256 2f5d6056b03f8ddc4d32f7047713089518f6fe3ea5a1cf8e0be2c2ef172dd61d; every content route (non-redirect alias) has a link rel icon with href.
- Parity data projection: complete equals total and total is positive; partial and remaining are zero; every item status is done; items length equals total.
- Category coherence: every category has complete equal to total, positive total, zero partial and zero remaining; category totals and complete counts sum to the top-level fields; every item category exists; category row counts and done counts match items.
- Tracker route visibly shows 100 percent. Other routes are not required to mention 100 percent.

Assertions intentionally avoid minified bundle filenames, hash-specific _astro paths, framework markup details and exact class names. Reference checks validate files, not markup shape.

## Deferred checks (not covered by this test)

- CSS reduced-motion and focus-visible behavior: requires accurate CSS/source inspection or a browser; not asserted here.
- Browser keyboard navigation, menus, responsive tables, console errors, fonts and screenshots at desktop/tablet/mobile widths.
- Full visual comparison against the PumpkinMC reference for every route and state.
- Live GitHub Pages deployment, HTTPS, workflow success and remote asset responses.

These remain browser/manual/deployment checks for the primary and are not implied by a passing node test.

## Status

Authored 2026-11-17 by the tests worker. The test file passed node --check (exit 0), and sha256sum public/favicon.png (exit 0) confirmed the hash used by the test. The test suite was NOT executed in this worker: dist/ was absent and the brief forbids builds/install now while source workers settle. Integration execution is deferred to the primary once the final npm run build is complete; record the real exit code then. No build, deployment or remote verification is claimed.
