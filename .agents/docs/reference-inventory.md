# Pumpkin reference inventory

Read-only browser discovery of `https://pumpkinmc.org/` for Kabocha adaptation. Routes came from the live sitemap (`https://pumpkinmc.org/sitemap.xml`, fetched 2026-11-17); site source corroboration: `https://github.com/Pumpkin-MC/Pumpkin-Website` (`master`, per handoff). No source application files were edited. Captures are references, not Kabocha assets.

## Reference runtime / measurements

- Desktop viewport 1342×900; tablet 768×1024; mobile 390×844; DPR 1.
- Document `lang=en-US`; body font stack `"Bricolage Grotesque", system-ui, sans-serif`; body 16px, background `rgb(13,13,13)` (#0d0d0d), foreground `rgb(240,240,240)`; secondary text sampled #999; accent sampled `rgb(255,107,44)`.
- H1 is weight 800. Standard inner-route hero h1 80px/78.4px line-height; homepage 67.1px/68.442px; 404 48px/60px. Common major homepage section h2 48px/800. Refreshed dynamic values observed; telemetry is live and tracker data carries a snapshot date/commit.
- Homepage animation was allowed to settle before final captures: wait for page text to stop changing, then wait until `LOADING` absent; observed `PUMPKIN READY 0.005s` and `VANILLA READY 15.000s`. Earlier intermediate matrix images may show LOADING; final home screenshots were overwritten after readiness.

## Route inventory

| Capture key | Observed URL | Title | H1 | document height |
|---|---|---|---|---:|
| `home` | `https://pumpkinmc.org/` | Pumpkin - Blazingly Fast Minecraft Server | A Minecraft server that boots in 5 ms. | 67.1px/800/68.442px | 3797px |
| `download` | `https://pumpkinmc.org/download/` | Download Pumpkin - Blazingly Fast Minecraft Server | Download Pumpkin. | 80px/800/78.4px | 3361px |
| `developers` | `https://pumpkinmc.org/developers/` | For Developers - Pumpkin | Build plugins without the pain. | 80px/800/78.4px | 5397px |
| `sponsor` | `https://pumpkinmc.org/sponsor/` | Sponsorship - Pumpkin | Sponsorship. | 80px/800/78.4px | 3069px |
| `contributors` | `https://pumpkinmc.org/contributors/` | Contributors - Pumpkin | Built by its contributors. | 80px/800/78.4px | 3746px |
| `stats` | `https://pumpkinmc.org/stats/` | Telemetry & Stats - Pumpkin | Ecosystem telemetry. | 80px/800/78.4px | 5814px |
| `tracker` | `https://pumpkinmc.org/tracker/#all` | Vanilla Parity - Pumpkin | Vanilla parity | 67.1px/800/68.442px | 34167px |
| `donate` | `https://pumpkinmc.org/sponsor/` | Sponsorship - Pumpkin | Sponsorship. | 80px/800/78.4px | 3069px |
| `notfound` | `https://pumpkinmc.org/this-page-does-not-exist-xyz/` | Page not found - Pumpkin | This page does not exist. | 48px/800/60px | 1114px |

`/donate/` is not a separate rendered route: browser navigation resolves to `/sponsor/` (same title/content); preserve as an alias/redirect if reproducing. HTTP status checks, independently of browser rendering: ``/` 200 https://pumpkinmc.org/`, ``/download/` 200 https://pumpkinmc.org/download/`, ``/developers/` 200 https://pumpkinmc.org/developers/`, ``/sponsor/` 200 https://pumpkinmc.org/sponsor/`, ``/contributors/` 200 https://pumpkinmc.org/contributors/`, ``/stats/` 200 https://pumpkinmc.org/stats/`, ``/tracker/` 200 https://pumpkinmc.org/tracker/`, ``/donate/` 200 https://pumpkinmc.org/donate/`, ``/this-page-does-not-exist-kabocha/` 404 redirect=`.

## Header, footer, external destinations

Desktop header: Pumpkin home link; three disclosure buttons **Developers**, **Docs**, **Community**; direct **Tracker** and **Market** links; **Language: English** menu; GitHub and Download links. Hover opens each disclosure. Developers offers plugin API intro, Bukkit migration, examples, languages (Rust, Kotlin, Python, Go, C#, C/C++, D, Zig, TypeScript), contributing, architecture, networking and source. Docs links include admin/config/troubleshooting/benchmarks/helping material. Community includes Discord and social/video links. Language picker has English, Deutsch, Français, Español, Tiếng Việt, 简体中文, 繁體中文（香港）, 繁體中文（台灣）. Mobile header collapses to Pumpkin and Menu; expanded menu contains same nav categories, language radios, GitHub and Download.

Footer shared on route/404: USE IT (Download, Getting started, Configuration, Troubleshooting); BUILD ON IT (Plugin docs, For developers, Examples, Market, Contributing); FOLLOW (Blog, Stats, Vanilla parity, Benchmarks, Sponsorship); PROJECT (Releases, Report a bug, Contributors, License, All repositories); creator credit. Keep outbound destinations outbound; do not map these to local routes.

External hosts enumerated from rendered links (destination links include specific paths where noted):
- **billing.stripe.com** — [https://billing.stripe.com/p/login/8x23cueJM7jfaK14XB5os00](https://billing.stripe.com/p/login/8x23cueJM7jfaK14XB5os00)
- **blog.pumpkinmc.org** — [https://blog.pumpkinmc.org/](https://blog.pumpkinmc.org/)
- **buy.stripe.com** — [https://buy.stripe.com/00w4gygRU473bO50Hl5os05](https://buy.stripe.com/00w4gygRU473bO50Hl5os05), [https://buy.stripe.com/28EfZggRU9rn3hzfCf5os08](https://buy.stripe.com/28EfZggRU9rn3hzfCf5os08), [https://buy.stripe.com/4gMaEW6dg9rndWd9dR5os03](https://buy.stripe.com/4gMaEW6dg9rndWd9dR5os03), [https://buy.stripe.com/4gMeVc59cavrdWdfCf5os09](https://buy.stripe.com/4gMeVc59cavrdWdfCf5os09), [https://buy.stripe.com/5kQbJ00SWgTP9FX89N5os06](https://buy.stripe.com/5kQbJ00SWgTP9FX89N5os06), [https://buy.stripe.com/7sY6oGeJM6fb2dvfCf5os07](https://buy.stripe.com/7sY6oGeJM6fb2dvfCf5os07), [https://buy.stripe.com/8x23cueJM7jfaK14XB5os00](https://buy.stripe.com/8x23cueJM7jfaK14XB5os00), [https://buy.stripe.com/8x29AS0SWavr5pH89N5os04](https://buy.stripe.com/8x29AS0SWavr5pH89N5os04)
- **discord.com** — [https://discord.com/invite/wT8XjrjKkf](https://discord.com/invite/wT8XjrjKkf)
- **docs.pumpkinmc.org** — [https://docs.pumpkinmc.org/](https://docs.pumpkinmc.org/), [https://docs.pumpkinmc.org/about/benchmarks](https://docs.pumpkinmc.org/about/benchmarks), [https://docs.pumpkinmc.org/about/helping](https://docs.pumpkinmc.org/about/helping), [https://docs.pumpkinmc.org/admin/introduction](https://docs.pumpkinmc.org/admin/introduction), [https://docs.pumpkinmc.org/admin/migrating-from-bukkit](https://docs.pumpkinmc.org/admin/migrating-from-bukkit), [https://docs.pumpkinmc.org/config/basic](https://docs.pumpkinmc.org/config/basic), [https://docs.pumpkinmc.org/config/bedrock](https://docs.pumpkinmc.org/config/bedrock), [https://docs.pumpkinmc.org/config/introduction](https://docs.pumpkinmc.org/config/introduction)
- **dub.pm** — [https://dub.pm/](https://dub.pm/)
- **github.com** — [https://github.com/0neRain](https://github.com/0neRain), [https://github.com/0x-jerry](https://github.com/0x-jerry), [https://github.com/1matin](https://github.com/1matin), [https://github.com/2982136527](https://github.com/2982136527), [https://github.com/4lve](https://github.com/4lve), [https://github.com/6x64](https://github.com/6x64), [https://github.com/80-svg](https://github.com/80-svg), [https://github.com/Aalivexy](https://github.com/Aalivexy)
- **go.dev** — [https://go.dev/doc/install](https://go.dev/doc/install)
- **market.pumpkinmc.org** — [https://market.pumpkinmc.org/](https://market.pumpkinmc.org/), [https://market.pumpkinmc.org/api/docs/](https://market.pumpkinmc.org/api/docs/)
- **marshall.dev** — [https://marshall.dev/](https://marshall.dev/)
- **signpath.io** — [https://signpath.io/](https://signpath.io/)
- **signpath.org** — [https://signpath.org/](https://signpath.org/)
- **www.gnu.org** — [https://www.gnu.org/software/make/](https://www.gnu.org/software/make/)
- **www.youtube.com** — [https://www.youtube.com/@PumpkinServer](https://www.youtube.com/@PumpkinServer)
- **x.com** — [https://x.com/pumpkinmcdev](https://x.com/pumpkinmcdev)
- **ziglang.org** — [https://ziglang.org/download/](https://ziglang.org/download/)

## Content and key states

- **Home**: server-in-Rust positioning, Java/Bedrock on one world; animated startup comparison; Download / docs CTAs; feature cards; Pumpkin-vs-Vanilla-vs-Spigot/Paper-vs-Folia feature matrix; per-cell explanation disclosure; plugin-language area; bottom CTA. “Run it again” restarts comparison.
- **Download**: Stable/Nightly radio switch, version/release download CTA, Linux quick download, file matrix, ppm install instructions, post-download steps. Nightly observed `nightly · 87f8822`; Stable observed `0.2.2+26.3-26.60` (version is dynamic). Copy-install-command, release notes/older versions.
- **Developers**: plugin API positioning; language-tab selector (Rust, Python, C#, C/C++, Go, Kotlin, D, Zig, TypeScript), quick-start tabs and code-copy controls; “Same feature, two APIs” Java/Rust examples; feature cards and docs CTA. Kotlin tab selected for capture.
- **Sponsor**: community tier links €5/10/20/50/100/250 monthly; corporate €500/1,000/2,000/4,000 monthly; external Manage sponsorship; Active · 15 / Past Sponsors · 6 tabs and sponsor listings.
- **Contributors**: “Most commits”, “Everyone else”, “Want to contribute?”; GitHub contributor attribution/cards, dynamic remote data.
- **Stats**: live telemetry, time ranges 24H/7D/30D/90D/All, Refresh (disabled during polling), API docs. Activity, server map, country breakdown, popular plugins, players, player breakdown (Java/Bedrock, online mode, view distance), client brands/locales and hardware/software/version charts. Chart radio controls; snapshot sampled live counts/poll time vary. Captured 7D and Players map-selection states.
- **Tracker**: “Vanilla parity”, commit and MC-version snapshot, totals implemented/partial/planned; category radios All, Entities, Blocks, Items, Commands, Redstone, Combat, World; status radios Any/Implemented/Partial/Planned; Search entries field; expandable rows and Expand all. Search “creeper” narrowed hostile entities to Creeper; row expands details. Category selection updates hash (`#blocks`) and groupings. Data was 564 entries, 449 implemented (80%), 114 partial (20%), 1 planned at observed snapshot.
- **404**: own not-found h1, homepage/download/docs recovery links; shared footer; direct fallback route captured.

## Evidence

- Full responsive matrix (all nine route keys above × desktop/tablet/mobile) is in `/tmp/opencode/kabocha-evidence/reference/`: `{route}-{desktop,tablet,mobile}.png`, plus route JSON (`{route}.json`). Route keys include duplicate `donate` (which renders `/sponsor/`) and `notfound` (a deliberately missing path). Ephemeral `/tmp` only; selected stable captures are copied below for durable handoff.
- Durable selected captures: `.agents/docs/evidence/reference/`: home desktop/mobile, tracker desktop/mobile, desktop nav disclosure states (Developers/Docs/Community), language menu, mobile expanded menu and Developers disclosure, tracker Blocks/search+expanded row, stats 7D/map Players, developer Kotlin tab, download Nightly. Full-page layout images except menu/open-state screenshots as named; screenshot dimensions are browser viewport 1342×900 / 768×1024 / 390×844 for matrix.
- Browser: `agent-browser` through `npx --yes`, private session `kabocha-inventory`, Chromium `--no-sandbox`. Session was closed at handoff.

## Limits / caveats

- No Kabocha UI/build/test work; external link reachability and live published Pages were not tested here. Telemetry, contributor counts, releases, sponsor roster and tracker are dynamic—treat captured data as visual/state examples, not constants. `/donate/` resolved to sponsor. At least one initial tracker wait for a guessed selector timed out; actual page loaded and snapshot/controls were inspected successfully. Stats radio wait and chart interactions completed; console/errors were empty when checked. Preserve actual reference external URLs rather than assuming new local routes.
