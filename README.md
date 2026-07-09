# 🤖 JARVIS — Sistema Operacional Pessoal e Empresarial

Este repositório é **híbrido**. Ele contém três coisas que compartilham a mesma história de vida do Operador (Talles):

| Componente | O que é | Entrada |
|---|---|---|
| **Vault JARVIS** (Obsidian) | Segundo cérebro: vida pessoal, empresa (Yalt), CRM, financeiro, conhecimento e contratos de agentes IA | `00 JARVIS/🤖 JARVIS.md` (Dashboard) |
| **App APEX** (`index.html`) | PWA single-file de tracking atlético MMA — TALES OF TALLES · IDENTITY OS | abrir `index.html` no navegador |
| **Automações** (`70 Sistema/Automacao/`) | Scripts Node locais (Daily Dashboard, Morning Brief) + kit de migração n8n self-host | RUNBOOKs em cada pasta |

## O canon (fonte da verdade)

O vault se comporta como software, não como bloco de notas. A arquitetura é governada por um conjunto de documentos **PT-BR** — toda dúvida estrutural resolve neles, nesta ordem:

| Documento | Responsabilidade |
|---|---|
| `70 Sistema/_Spec JARVIS.md` | **Canon estrutural** — pastas, propriedades, prioridade, nomenclatura, governança |
| `70 Sistema/_Contrato de Autoridade dos Agentes.md` | Quem (qual agente) pode Criar / Editar / Priorizar / Executar / Arquivar |
| `00 JARVIS/🪐 Constituição JARVIS.md` | Valores do Operador — filtro de decisão acima dos objetivos |
| `70 Sistema/_Arquitetura JARVIS.md` | 4 camadas (Memória · Operação · Cognição · Interface) e Event Bus |
| `70 Sistema/_Taxonomia de Eventos.md` | Vocabulário de eventos do sistema |

> A antiga `CONSTITUTION.md` (inglês, raiz) está **superseded** desde 2026-06-30 — mantida só como referência histórica. Instruções para agentes de IA: `CLAUDE.md` (fonte editável; `AGENTS.md` é espelho gerado dele — não editar direto). Lista completa e sempre-atual da documentação: `00 JARVIS/📖 Guia do Sistema.md` § Mapa da documentação.

## Princípio central

**Propriedades (frontmatter) são a fonte da verdade para consultas; pastas são só armazenamento.** Toda query Dataview filtra por `tipo` / `status` / `area` / `dominio`, nunca pelo caminho da pasta.

## Estrutura

```
raw/              captura bruta (humano despeja; IA processa e remove)
wiki/             memória estruturada auto-mantida pela IA (_master_index.md)
output/           entregas geradas e sobrescrevíveis (dashboards, relatórios)

00 JARVIS/        dashboard + guia          40 CRM/          clientes, contatos
10 Inbox/         captura estruturada       50 Financeiro/   lançamentos
20 Pessoal/       saúde, objetivos, hábitos 60 Conhecimento/ wiki, prompts
30 Empresa/       Yalt: projetos, reuniões  70 Sistema/      canon, templates, automação
                                            90 Arquivo/      encerrados
```

## Automações ativas

- **Daily Dashboard** — `70 Sistema/Automacao/executive-assistant/` · tarefa Windows 07:00 → `output/daily_dashboard.md`
- **Morning Brief** — `70 Sistema/Automacao/morning-brief/` · tarefa Windows 09:00 (entrega Slack pendente de credencial)
- **n8n self-host** — kit pronto em `70 Sistema/Automacao/n8n-selfhost/` (Docker Compose + 8 workflows exportados)

## CI (GitHub Actions)

- **Vault Lint** (`vault-lint.yml`) — roda em todo PR para `main` e em branches de trabalho; valida frontmatter contra o `_Spec`, wikilinks e o espelho `CLAUDE.md` ↔ `AGENTS.md`. Comenta o resultado no PR (inclusive quando falha).
- **Deploy Pages** (`deploy-pages.yml`) — publica o PWA (`index.html` + `sw.js`) no GitHub Pages a cada push no `main`.
- **Site Maintenance** (`site-maintenance.yml`) — diário 06:50 UTC: valida os estáticos do PWA (incl. sincronia de versão do Service Worker) e roda o vault-lint, publicando o relatório como artifact.
- Runbook de entrega: `70 Sistema/Runbooks/MERGE_RUNBOOK.md`.

## App APEX — TALES OF TALLES · IDENTITY OS

PWA offline-first de evolução atlética (atleta 1,94 m · 77 kg → 84 kg, MMA/boxe): arsenal de striking estilo UFC (★1–★5), heatmap muscular com fadiga/recuperação, readiness diário, body scan e 4 coaches IA (Sanji · Ilia · Cariani · Muzy, protocolo ≤140 caracteres). Integração com o vault é **por dados, não por código**: os treinos/nutrição/corporal viram notas tipadas — contrato em `_Spec JARVIS` §9 e `70 Sistema/Automacao/🔌 Ponte APEX ↔ JARVIS.md`.

## Convenções

- **Idioma:** todo conteúdo do vault em PT-BR.
- **Commits:** conventional commits em PT-BR (`feat(vault): …`, `fix(hud): …`), com pathspec explícito.
- **Migrações:** nunca deletar — mover (`git mv`), em lote versionado, com tag de recuperação (`jarvis/pre-<fase>-<data>`). Ver `_Spec JARVIS` §11.
- **Anti-bifurcação:** uma fonte da verdade por conceito; sem variantes `_2`/`_FINAL`; sem segredos no repo. Ver `_Spec JARVIS` §12.
