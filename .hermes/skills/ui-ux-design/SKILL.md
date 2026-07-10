---
name: ui-ux-design
description: "UI/UX design intelligence for the JARVIS vault — distilled from the claudekit design system. Use when building any web UI, dashboard, or visual artifact: apply the JARVIS dark-premium palette, spacing scale, typography, and accessibility contracts. Loads for HTML/CSS/JS dashboards, the Tales of Talles site, or any user-facing visual in the vault."
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
---

# UI/UX Design (JARVIS system)

Design intelligence for vault-built UIs. The JARVIS visual language is
**dark-premium** — high contrast, cyan accent, generous spacing.

## Palette (canonical — see `70 Sistema/🎨 Tema e Visual.md`)
| Token | Hex | Use |
|---|---|---|
| bg | `#0B0E14` | Page background |
| surface | `#11151F` | Cards, panels |
| border | `#1E2733` | Hairline borders |
| accent | `#22D3EE` | Primary CTA, links, active |
| success | `#22C55E` | Positive metric |
| warning | `#F59E0B` | Caution |
| danger | `#EF4444` | Negative / error |
| text | `#E6EDF3` | Body text |
| muted | `#8B98A9` | Secondary text |

## Rules
- **One accent.** Cyan `#22D3EE` only. No rainbow.
- **Spacing scale** 4px base: 4 / 8 / 12 / 16 / 24 / 32 / 48.
- **Radius** 8px cards, 6px buttons, 999px pills.
- **Type** system font stack; display 600 weight, body 400.
- **Dark-first.** Never ship a light-only UI in this vault.
- **Mobile** — single column < 640px; grid ≥ 768px.

## Accessibility
- Contrast AA (4.5:1 text). Muted `#8B98A9` on bg `#0B0E14` = 5.1:1 ✓.
- Focus ring: 2px accent. Never remove outline without replacement.
- Tap targets ≥ 44px.

## Build pattern (static dashboards)
Reuse `70 Sistema/Automacao/yalt-dashboard/lib/render.mjs` as the template:
pure function `data -> HTML string`, no fetch in the browser, snapshot generated
by a Node script at deploy time. Repo is public → never embed API keys client-side.

See also: `obsidian-authoring`, `gsd-workflow`.
