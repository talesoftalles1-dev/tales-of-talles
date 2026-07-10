---
name: obsidian-authoring
description: "Author and edit Obsidian vault artifacts by hand — Obsidian Flavored Markdown (wikilinks, embeds, callouts, properties), .base database files (views/filters/formulas), .canvas visual files (nodes/edges/groups), and driving a live vault via the `obsidian` CLI. Use whenever creating/editing .md notes with Obsidian-specific syntax, .base or .canvas files, or running vault operations and plugin/theme dev from the command line."
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
---

# Obsidian Authoring

Umbrella skill for hand-authoring the four Obsidian artifact types plus CLI-driven
vault ops. Load the matching reference for deep syntax; the sections below are the
working quick-reference.

Pick the sub-domain:

| You are working on… | Section | Deep reference |
|---|---|---|
| `.md` notes (wikilinks, callouts, embeds, frontmatter) | [Flavored Markdown](#flavored-markdown) | `references/CALLOUTS.md`, `references/EMBEDS.md`, `references/PROPERTIES.md` |
| `.base` database views | [Bases](#bases) | `references/FUNCTIONS_REFERENCE.md` |
| `.canvas` visual files | [Canvas](#canvas) | `references/CANVAS_EXAMPLES.md` |
| Live vault ops / plugin dev | [Obsidian CLI](#obsidian-cli) | `obsidian help` (always current) |

> JARVIS vault caveat: this vault's lint resolves wikilinks by **basename only**.
> Folder-prefixed links (`[[30 Empresa/Yalt/x]]`) and `raw/` links break the lint —
> use the plain basename once the target exists outside `raw/`. See the
> `markdown-vault-governance` skill for the full contract.

---

## Flavored Markdown

Obsidian extends CommonMark/GFM. Standard Markdown is assumed; these are the extensions.

### Internal links (wikilinks)
```markdown
[[Note Name]]                  Link to note
[[Note Name|DisplayText]]      Custom display text
[[Note Name#Heading]]          Link to heading
[[Note Name#^block-id]]        Link to block
[[#Heading in same note]]      Same-note heading link
```
Define a block ID by appending `^block-id` to a paragraph. For lists/quotes, put the
block ID on its own line after the block. Use `[[wikilinks]]` for in-vault notes
(Obsidian tracks renames), `[text](url)` for external URLs only.

### Embeds — prefix any wikilink with `!`
```markdown
![[Note Name]]            Embed full note
![[Note Name#Heading]]    Embed section
![[image.png|300]]        Embed image with width
![[document.pdf#page=3]]  Embed PDF page
```
Audio, video, search embeds, external images: `references/EMBEDS.md`.

### Callouts
```markdown
> [!note]
> Basic callout.

> [!warning] Custom Title
> Callout with a custom title.

> [!faq]- Collapsed by default
> Foldable (- collapsed, + expanded).
```
Common types: `note tip warning info example quote bug danger success failure question abstract todo`.
Full list + aliases + nesting: `references/CALLOUTS.md`.

### Properties (frontmatter)
```yaml
---
title: My Note
tags: [project, active]
aliases: [Alternative Name]
cssclasses: [custom-class]
---
```
All property types + tag rules: `references/PROPERTIES.md`.

### Other syntax
```markdown
#tag  #nested/tag          Tags (no number as first char)
%%hidden%%                 Comment (hidden in reading view)
==Highlighted text==       Highlight
$e^{i\pi}+1=0$   /  $$...$$  LaTeX math (inline / block)
```mermaid ...```          Mermaid diagrams (add `class Node internal-link;` to link nodes)
Text[^1]   [^1]: note      Footnotes;  ^[inline]  inline footnote
```

---

## Bases

`.base` files are YAML defining database-like views over notes.

### Skeleton
```yaml
filters:            # global, applies to all views. ONE key: and | or | not
  and:
    - 'status == "active"'
    - not: ['file.hasTag("archived")']
formulas:
  days_until_due: 'if(due, (date(due) - today()).days, "")'
properties:
  formula.days_until_due: { displayName: "Days Until Due" }
views:
  - type: table        # table | cards | list | map
    name: "Active"
    limit: 30
    groupBy: { property: status, direction: ASC }
    order: [file.name, status, formula.days_until_due, due]
    summaries: { formula.days_until_due: Average }
```

### Property types
1. **Note** (frontmatter): `author` or `note.author`
2. **File**: `file.name basename path folder ext size ctime mtime tags links backlinks embeds properties`
3. **Formula**: `formula.my_formula`

`this` = the base file (main area) / the embedding file (when embedded).

### Filter operators
`== != > < >= <=` and `&&` `||` `!`. Combine with `and`/`or`/`not` blocks (nestable).

### Summary formulas (built-in)
`Average Min Max Sum Range Median Stddev Earliest Latest Checked Unchecked Empty Filled Unique`.

### Pitfalls (bite before Obsidian does)
- **Duration ≠ number.** `date - date` returns a Duration. Access `.days`/`.hours`
  first, THEN `.round(0)`. `(now() - file.ctime).days.round(0)` ✓ ;
  `(now() - file.ctime).round(0)` ✗.
- **Null-guard properties:** `'if(due, (date(due) - today()).days, "")'` — not all notes
  have every property.
- **Define every `formula.X`** referenced in `order`/`properties` (fails silently otherwise).
- **YAML quoting:** single-quote formulas that contain double quotes:
  `'if(done, "Yes", "No")'`. Quote any string with `: { } [ ] , & * # ? | - < > = ! % @ \``.

Embed: `![[MyBase.base]]` or `![[MyBase.base#View Name]]`.
Complete function reference (Date/String/Number/List/File/Link/Object/RegExp): `references/FUNCTIONS_REFERENCE.md`.

---

## Canvas

`.canvas` files are JSON per the [JSON Canvas 1.0 spec](https://jsoncanvas.org/spec/1.0/):
`{"nodes": [], "edges": []}`. Array order = z-index (first = bottom).

### Nodes — required: `id type x y width height`
`type` is one of `text | file | link | group`, each adds a field:
- **text**: `"text"` (Markdown; use `\n` for newlines, NOT `\\n`)
- **file**: `"file"` (vault path) + optional `"subpath"` (`#heading`)
- **link**: `"url"`
- **group**: optional `"label"`, `"background"`, `"backgroundStyle"` (`cover|ratio|repeat`)

Optional on any node: `"color"` — preset `"1"`–`"6"` (red/orange/yellow/green/cyan/purple) or hex `"#FF0000"`.

```json
{"id":"6f0ad84f44ce9c17","type":"text","x":0,"y":0,"width":400,"height":200,"text":"# Hello\n\n**Markdown** body."}
```

### Edges — required: `id fromNode toNode`
Optional: `fromSide`/`toSide` (`top right bottom left`), `fromEnd`/`toEnd` (`none|arrow`, toEnd defaults arrow), `color`, `label`.

### IDs & layout
- IDs: 16-char lowercase hex (64-bit random), unique across BOTH nodes and edges.
- `x`→right, `y`→down, top-left origin, coords can be negative. Space nodes 50–100px;
  pad 20–50px inside groups; align to multiples of 10/20.

### Validation checklist (run after every create/edit)
1. All `id` unique (nodes + edges). 2. Every `fromNode`/`toNode` resolves to a node.
3. Required fields present per type. 4. `type`/`*Side`/`*End`/color values legal.
5. JSON parses (watch unescaped newlines in text).

Full worked examples (mind map, project board, research canvas, flowchart): `references/CANVAS_EXAMPLES.md`.

---

## Obsidian CLI

Drive a **running** Obsidian instance with the `obsidian` command. Requires Obsidian open.
`obsidian help` is always the current, authoritative command list. Docs: https://help.obsidian.md/cli

### Syntax
- Parameters take `=`: `obsidian create name="My Note" content="Hello"`. Quote values with spaces.
- Flags are bare switches: `obsidian create name="X" silent overwrite`.
- Multiline: `\n` newline, `\t` tab.

### File / vault targeting
- `file=<name>` resolves like a wikilink (basename, no path/ext). `path=<folder/note.md>` is exact from root.
- No target → active file. `vault=<name>` as FIRST param picks a vault (default: most recently focused).

### Common ops
```bash
obsidian read file="My Note"
obsidian create name="New" content="# Hi" template="Template" silent
obsidian append file="My Note" content="New line"
obsidian search query="term" limit=10
obsidian daily:read ; obsidian daily:append content="- [ ] task"
obsidian property:set name="status" value="done" file="My Note"
obsidian tasks daily todo ; obsidian tags sort=count counts ; obsidian backlinks file="My Note"
```
`--copy` copies output to clipboard; `silent` stops files opening; `total` on list cmds gives a count.

### Plugin/theme dev cycle
1. `obsidian plugin:reload id=my-plugin` — pick up code changes
2. `obsidian dev:errors` — if errors, fix and loop to 1
3. `obsidian dev:screenshot path=shot.png` / `obsidian dev:dom selector=".workspace-leaf" text` — verify visually
4. `obsidian dev:console level=error` — check console
Extras: `obsidian eval code="app.vault.getFiles().length"`, `obsidian dev:css selector=".x" prop=color`, `obsidian dev:mobile on`. `obsidian help` lists CDP/debugger controls.

---

## References
- Obsidian Flavored Markdown: https://help.obsidian.md/obsidian-flavored-markdown
- Bases: https://help.obsidian.md/bases/syntax · Canvas: https://jsoncanvas.org/spec/1.0/
- Local: `references/CALLOUTS.md`, `references/EMBEDS.md`, `references/PROPERTIES.md`, `references/FUNCTIONS_REFERENCE.md`, `references/CANVAS_EXAMPLES.md`
