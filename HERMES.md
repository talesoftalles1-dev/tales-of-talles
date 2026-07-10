<!--
  PONTEIRO DE CONTEXTO — NÃO DUPLIQUE O CANON AQUI.
  O Hermes lê este arquivo (prioridade sobre AGENTS.md) ao rodar no vault.
  Conteúdo canônico vive em CLAUDE.md/AGENTS.md e 70 Sistema/_Spec JARVIS.md.
  Mantenha este arquivo curto: só o que o Hermes precisa que difere/complementa.
  O vault-lint vigia drift entre CLAUDE.md e AGENTS.md — não crie uma 3ª cópia.
-->
# JARVIS — contexto para o Hermes Agent

Este é o vault **JARVIS** (segundo cérebro pessoal + empresarial em Obsidian).
O contrato completo está em `CLAUDE.md` / `AGENTS.md` (idênticos) e no spec
`70 Sistema/_Spec JARVIS.md`. **Leia o spec antes de criar/editar nota estruturada.**

## Regras que o Hermes precisa respeitar

- **Idioma:** todo conteúdo do vault é PT-BR. Mantenha.
- **Fonte da verdade = frontmatter**, não pastas. Queries Dataview filtram por
  `tipo`/`status`/`area`, nunca por caminho.
- **Fluxo raw → wiki → output:** humano despeja em `raw/`; IA materializa em
  `wiki/`; entregas regeneráveis vão em `output/` (nunca fonte de verdade).
- **Wikilinks resolvem por basename** no vault-lint. Links com prefixo de pasta
  (`[[30 Empresa/Yalt/x]]`) ou apontando pra `raw/` QUEBRAM o lint. Use o
  basename simples uma vez que o alvo exista fora de `raw/`.
- **Nunca invente nomes de propriedade** fora do spec; adicione ao spec primeiro.
- **Entrega PR-first** no repo `talesoftalles1-dev/tales-of-talles` (branch,
  commit convencional, push, PR) — direto na `main` só se pedido explicitamente.
- **Valide localmente antes de commit:** `node "70 Sistema/Automacao/vault-lint/lint.mjs"`
  deve dar 0 erros. Outputs gerados ficam exemptos, não são notas canônicas.

## Skills específicas deste vault

Skills do Hermes para este projeto ficam em `.hermes/skills/`. Skills globais
(obsidian-authoring, jarvis-automation-pipelines, jarvis-commercial-agents,
markdown-vault-governance, etc.) já vivem no diretório global do Hermes e
carregam automaticamente.

## Paralelo Claude + Hermes

Claude (Copilot CLI) e Hermes operam este vault em paralelo. Claude edita
código/abre/faz merge de PRs; Hermes monitora, valida (vault-lint/dry-run) e
intervém se o Claude travar. Hermes acompanha os PRs do Claude sem duplicar.
