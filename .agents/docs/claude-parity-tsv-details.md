# Backend handoff: source-driven parity tracker details

Repository: ArkFlame/Kabocha, `master`. This is a request to expand `docs/PARITY.tsv` in the backend repository, not evidence that vanilla parity is complete. Do not alter actual audit statuses to satisfy the website publication projection. Preserve `status`, `covered`, `issues`, and `note` as honest current assessments, including limitations, review requirements, and evidence.

## Contract

Existing required TSV headers: `category`, `name`, `status`. Existing optional audit fields: `covered`, `issues`, `note`. Add optional headers `source`, `summary`, `checklist`, `ids`; old TSVs without them remain valid. Keys are category plus exact normalized name (Unicode NFKC, lower-case, trimmed, spaces/hyphens/underscores normalized). Never merge entries by name across categories: entity Slime and block Slime are different entries. Avoid duplicate keys, keep names stable, and coordinate deliberate renames with website maintainers.

* `source`: a repository-relative file path, without leading slash, `.` or `..` segments, URL, query or fragment. Confirm it exists in the Kabocha tree at the published revision. A path absent from the website's verified-tree snapshot is withheld from public links until its manifest is refreshed.
* `summary`: concise, factual source-supported description of the relevant mechanism. Do not claim an unimplemented behavior. The website filters stale incompleteness/review sentences for launch-copy display; `note` remains the unaltered audit statement.
* `checklist`: JSON array of nonempty strings, each a distinct capability demonstrably implemented by that entry. Do not include speculative or unimplemented checks; represent them in the audit `note` and status instead.
* `ids`: JSON array of nonempty strings, normally exact registry IDs such as `minecraft:slime_block`.

TSV uses literal tabs between cells and literal newlines between rows; no CSV quoting layer is applied. JSON cells must be single-line valid JSON arrays. Encode any embedded quotes, tabs, backslashes or newlines as JSON escapes (for example `\t` inside a JSON string); never put literal tabs/newlines inside a cell. Plain text fields must also contain no literal tabs/newlines. Empty optional cells are allowed. Example with literal tabs:

```tsv
category	name	status	covered	issues	note	source	summary	checklist	ids
entities	Slime	partial	COVERED	-	Goal set matches vanilla. Landing particles are still pending.	crates/pumpkin-core/src/entity/mob/slime.rs	Goal set matches vanilla.	["Size, split and jump attack","Slime chunk and swamp spawn rules","Player collision damage"]	["minecraft:slime"]
```

The example preserves a partial audit status; confirm every field against current source before committing. Current website snapshot reports this note and checklist from a previous upstream review, not independent proof of present backend behavior.

## Exhaustive source-driven audit

1. Enumerate every TSV row and category. Inspect the actual Kabocha source and tests at a pinned commit; follow shared behavior and inheritance where necessary, rather than assuming a filename proves implementation. Capture stable exact repo paths and registry identifiers. Confirm whether details are variant-specific.
2. Write precise summaries and checklists for all rows where evidence supports them. Separate implemented behavior from missing, incomplete, untested, reviewed-at-older-commit or unknown behavior. Preserve those caveats in audit `note`, status and issue links; never manufacture completion. Prefer concise individual checks over generic “Implemented”.
3. Verify collision cases (entities/blocks/items with identical names), special punctuation, Unicode, legacy IDs, aliases, newlines/escaping, and duplicate keys. Update website path-verification evidence when the fork changes paths; do not silently point to an upstream file absent in Kabocha.
4. Validate a clean sync with existing headers, richer optional fields, malformed JSON rejection, offline fallback preserving all source fields, source path existence, duplicate detection and complete category/totals invariants. Run backend and website CI/tests. Website status projection must remain separate from raw audit evidence.
5. Provide commit, commands and exits, evidence per category, counts of rows with source/summary/checklist/IDs and outstanding unknowns. Never mark an unchecked task done. Coordinate website regeneration, review representative expanded rows and direct source links, then hand off unresolved discrepancies.
