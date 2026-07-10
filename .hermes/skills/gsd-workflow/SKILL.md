---
name: gsd-workflow
description: "Plan-driven development methodology (GSD = Git. Ship. Done.) for the JARVIS vault. Use when starting any coding/build task: write an actionable markdown plan first, work branch-by-branch with conventional commits, and ship via PR. Loads whenever the user asks to build, implement, or deliver a feature in the tales-of-talles repo or any vault automation."
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
---

# GSD Workflow (Git. Ship. Done.)

Plan-driven development for the JARVIS vault. The repo is contract-first and
PR-first — never push directly to `main` unless the user explicitly asks.

## When to use
- Building a new automation, script, or site feature in `tales-of-talles`.
- Any task with >3 steps or external side-effects (deploy, API calls).
- When the user says "build", "implement", "ship", "PR", or "feature".

## The loop
1. **Plan** — write `PLAN.md` (or a `.hermes/plan.md`) with: goal, files touched,
   risks, verification steps. Keep it short and actionable.
2. **Branch** — `git checkout -b feat/<slug>` (or `fix/<slug>`).
3. **Commit** — conventional commits (`feat:`, `fix:`, `chore:`, `docs:`).
4. **Verify locally** — run the thing (lint, dry-run, node script) BEFORE pushing.
5. **PR** — `gh pr create`; never merge your own PR without user sign-off unless
   they delegated ("resolve everything", "you have full control").
6. **Ship** — merge via squash; delete branch.

## Vault-specific rules
- `vault-lint` must stay 0/0 — wikilinks resolve by basename only.
- `.obsidian/` is gitignored entirely (secrets). Never commit it.
- `output/` is regenerable — safe to overwrite, never trust as source of truth.
- Secrets come from env vars (`YALT_API_KEY`, etc.) — never hardcoded.

## Verification checklist
- [ ] Plan written and approved
- [ ] Branch created, commits conventional
- ] Local run green (lint / dry-run / build)
- [ ] PR opened, CI green
- [ ] Merged, branch cleaned

See also: `obsidian-authoring`, `ui-ux-design`.
