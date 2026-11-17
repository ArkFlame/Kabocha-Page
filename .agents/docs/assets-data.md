# Kabocha assets, fonts and parity projection

Date: 2026-11-17. Scope: `public/`, `scripts/sync-parity.mjs`, `src/data/parity.generated.json` and this note. The UI worker owns `src/` and must update asset references; the old `kabocha-logo.png` and `kabocha-clip.png` files were removed after conversion.

## Green brand artwork

| Asset | Size | Bytes | Method |
| --- | --- | --- | --- |
| `public/kabocha.webp` | 1143x945, RGBA | 41,924 | Pillow 12.3.0, WebP quality 90, method 6, exact alpha |
| `public/kabocha-clip.webp` | 1254x1254, RGBA | 115,258 | same |
| old `public/kabocha-logo.png` | 1143x945 | 893,850 | removed after conversion |
| old `public/kabocha-clip.png` | 1254x1254 | 1,113,278 | removed after conversion |

Both WebP files retain an alpha range of 0-255. ImageMagick PSNR against the source PNGs: 45.11 dB (logo) and 45.34 dB (clip). `public/favicon.png` was not modified: SHA-256 starts `2f5d6056b03f8ddc`, 33,814 bytes, 192x159 RGBA, matching the pre-change hash.

Representative sampled greens (opaque pixels, median / quantized clusters):

- Main logo body: `#285B2A`; secondary body cluster `#295C2B`.
- Clip body: `#316F38`; midtone `#397039`; deep shade `#1A4A1C` / `#253C19`.
- Highlight streaks: `#74853F` (logo), `#91AF65` (clip).
- Existing site accent already in `src/styles/global.css`: `#62C94E`; deep accent `#286D36`.
- Recommended mapping for upstream orange/coral brand accents (`#FF6B2C`): use `#62C94E` for readable accent text/buttons on the dark surface, `#326E38` or `#285B2A` for fills/borders, and dark ink (`#070B05`) on bright green. Leave the orange stem inside the artwork; do not recolor semantic warning/error colors.
- Orange stem sample: `#B5651F` to `#E09A55`; this is artwork only, not a UI accent.

## Upstream assets

Source: `https://github.com/Pumpkin-MC/Pumpkin-Website`, branch `master`, commit `4372cae39656e9dcf470c31c94b6e36914bf25c5` (2026-11-17T12:43:59Z), downloaded as a zip to `/tmp/opencode/kabocha-assets-upstream` for reference. The repository exposes no detected license in the GitHub API at this commit. Upstream artwork and third-party logos remain the property of their owners; this parity adaptation does not grant a new license. Keep attribution/legal copy in the site and review redistribution before publication.

| Upstream | Public destination | Treatment |
| --- | --- | --- |
| `assets/backgrounds/pumpkin_chunk_loading.webp` | `assets/backgrounds/kabocha_chunk_loading.webp` | Copied byte-for-byte; generic Minecraft landscape, no orange mascot. 960x540 animated WebP, 2,448,894 bytes. Rename reference to the Kabocha path. |
| `assets/logos/paper-logo.png` | `assets/logos/paper-logo.png` | Copied unchanged; PaperMC competitor logo. |
| `assets/logos/folia-logo.png` | `assets/logos/folia-logo.png` | Copied unchanged; Folia competitor logo. |
| `assets/logos/vanilla-logo.png` | `assets/logos/vanilla-logo.png` | Upstream file was an ICO with a `.png` name; normalized to a real 256x256 RGBA PNG. Visual content unchanged (Minecraft grass block). |
| `assets/logos/icon_png.png` | not copied | Orange Pumpkin mascot; replaced with generated green `assets/logos/icon.png` (512x512, dark square) and `assets/logos/apple-touch-icon.png` (180x180). |
| `assets/icon.svg` | not copied | Embedded orange Pumpkin mascot. Replaced with generated `assets/icon.svg`, a green wrapper embedding `kabocha.webp` as base64. Use `/assets/icon.svg` only as an image, not as the favicon. |
| `assets/pumpkin-clipboard.webp` | not copied | Orange Pumpkin mascot. Replaced with `assets/kabocha-clipboard.webp` (copy of `kabocha-clip.webp`, 768x768-equivalent green artwork, 115,258 bytes). |
| `assets/logos/ogimage.png` | not copied | Upstream Pumpkin social card. Replaced with generated `assets/logos/og-kabocha.png` (1229x528, dark surface, green wordmark and Kabocha mascot). |
| `CNAME` | not copied | Forbidden by brief and would overwrite deployment domain. |
| `install.sh`, `ppm.sh` | not copied | Would install upstream Pumpkin binaries; do not ship. |
| `robots.txt` | not copied | Kabocha keeps its own allow-all file. |

`public/robots.txt` remains `User-agent: *` / `Allow: /`. It contains no absolute host, base path or stale `/Kabocha` rule, so there is nothing to strip without guessing the final Pages URL. A sitemap should only be added after the deployed origin/base is confirmed.

## Local font

Bricolage Grotesque v9, Latin + Latin Extended + Vietnamese WOFF2 subsets fetched from Google Fonts:

- `public/fonts/bricolage-grotesque-latin.woff2` (76,888 bytes)
- `public/fonts/bricolage-grotesque-latin-ext.woff2` (30,736 bytes)
- `public/fonts/bricolage-grotesque-vietnamese.woff2` (12,984 bytes)
- `public/fonts/bricolage-grotesque.css` declares family `"Bricolage Grotesque"`, `font-weight: 200 800`, normal style, `font-display: swap`, and the three subsets.
- `public/fonts/OFL.txt` is the SIL Open Font License 1.1 text from Google Fonts.

Inspect metadata: family `Bricolage Grotesque 96pt ExtraBold`, version 1.001, axes `opsz 12-96` and `wght 200-800`. UI worker should replace the external Google Fonts stylesheet with a base-aware `<link rel="stylesheet" href={`${base}fonts/bricolage-grotesque.css`}>` and keep `font-family: "Bricolage Grotesque", system-ui, sans-serif`. If a CSP is used, allow `font-src 'self'`.

## Desired UI paths

- Hero/header/footer mascot: `kabocha.webp` (root, width/height 1143x945); `/assets/icon.svg` is a drop-in green icon wrapper.
- Clipboard/tracker illustration: `assets/kabocha-clipboard.webp` or root `kabocha-clip.webp`.
- Apple touch icon: `assets/logos/apple-touch-icon.png`; general logo icon: `assets/logos/icon.png`.
- Social image: `assets/logos/og-kabocha.png` (1229x528).
- Background: `assets/backgrounds/kabocha_chunk_loading.webp`.
- Competitor logos: `assets/logos/paper-logo.png`, `assets/logos/folia-logo.png`, `assets/logos/vanilla-logo.png`.
- Fonts: `fonts/bricolage-grotesque.css`.
- Existing `src/pages/index.astro` and `src/pages/parity.astro` still point at the removed `kabocha-logo.png`; the UI worker must update them. The favicon reference stays `favicon.png`.

## Parity publication projection

`scripts/sync-parity.mjs` keeps the real tracker inventory and derives the count (564 rows at this run). The public projection is launch copy and assumes full vanilla parity:

```json
{
  "source": "https://github.com/ArkFlame/Kabocha/blob/master/docs/PARITY.tsv",
  "updatedAt": "ISO-8601 projection timestamp",
  "projection": { "mode": "publication", "allComplete": true, "disclaimer": "..." },
  "total": 564,
  "complete": 564,
  "partial": 0,
  "remaining": 0,
  "sourceTotals": { "total": 564, "complete": 449, "partial": 114, "remaining": 1 },
  "categories": [
    {
      "name": "blocks",
      "total": 201,
      "complete": 201,
      "partial": 0,
      "remaining": 0,
      "sourceComplete": 174,
      "sourcePartial": 27,
      "sourceRemaining": 0
    }
  ],
  "items": [
    {
      "category": "entities",
      "name": "Blaze",
      "status": "done",
      "covered": "complete",
      "issues": "-",
      "note": "",
      "sourceStatus": "partial",
      "sourceCovered": "COVERED",
      "sourceIssues": "1960:open",
      "sourceNote": "original tracker note"
    }
  ]
}
```

Compatibility notes for the UI:

- Existing consumers of `total`, `complete`, `partial`, `remaining`, `categories[].*`, `items[].status`, `items[].covered`, `items[].issues` and `items[].note` keep working. All projected statuses are `done`, covered is `complete`, issues are `-`, and notes are empty.
- `sourceStatus`, `sourceCovered`, `sourceIssues`, `sourceNote` and `sourceTotals` are evidence metadata, not public claims. Do not render them as current completion state.
- Category totals and `complete` sums equal the derived row count; filters and 100% charts stay consistent. The count is derived, not hardcoded.
- Fallback behavior: if the tracker is unreachable and a previous snapshot exists, the script reprojects that snapshot as all-complete from its `sourceStatus` fields instead of retaining old partial stats. Required-column validation, duplicate-row rejection, empty-tracker rejection and the 15-second fetch timeout remain.

Commands actually run:

- `node scripts/sync-parity.mjs` -> exit 0, `public 564/564 done; source 449/564 done, 114 partial, 1 remaining`.
- Same command with `PARITY_TRACKER_URL=http://127.0.0.1:9/PARITY.tsv` -> exit 0, fallback reprojected 564/564 complete.
- Python assertions read `src/data/parity.generated.json`: 564 items, all `status=done`, `covered=complete`, `issues=-`, `note=""`; category sums 564 and all category complete=total.

This is a publication-copy projection, not backend QA evidence. No app build or deployment was run in this scope; the primary session verifies integration.
