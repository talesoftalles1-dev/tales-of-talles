---
tipo: doc
status: publicado
categoria: sistema
criado: 2026-06-27
atualizado: 2026-06-27
relacionado:
  - "[[_Spec JARVIS]]"
  - "[[🔌 Plugins]]"
  - "[[🎨 Tema e Visual]]"
  - "[[🔁 Automacoes]]"
tags:
  - tema/ia
---

# 📖 Guia do Sistema JARVIS

> [!jarvis] O que é o JARVIS
> Um **sistema operacional pessoal e empresarial** dentro do Obsidian. Não é um bloco de notas — é um software: dashboard único, dados estruturados por propriedades, painéis ao vivo, captura sem fricção e automações. Este guia liga todas as peças e mostra como instalar, configurar e operar tudo.

> [!tip] Atalho mental
> **Você** faz: capturar, decidir, perguntar. **O sistema** faz: organizar, cruzar, calcular, lembrar. Você entra pelo Dashboard ([[🤖 JARVIS]]) e nunca precisa abrir pastas.

---

## 🧭 Mapa da documentação

Cada peça do sistema tem sua própria página de referência. Este guia é o índice e o passo a passo de instalação.

| Página | Para quê |
|---|---|
| [[🤖 JARVIS]] | **Dashboard** — sua porta de entrada diária |
| [[🗺️ Mapa do Sistema]] | **Canvas visual** — todas as áreas conectadas, navegação por clique |
| [[🪐 Constituição JARVIS]] | Identidade, valores e critérios de decisão — o nível acima dos objetivos |
| [[_Spec JARVIS]] | **Contrato** — esquema de propriedades, tipos, tags (fonte da verdade) |
| [[wiki/_master-index|🧭 Master Index]] | **Fluxo raw → wiki → output** — índice soberano da memória operacional da IA |
| [[_Arquitetura JARVIS]] | **Camadas + Event Bus** — como Obsidian/n8n/Slack/Claude se orquestram |
| [[_Daily Brief (Canônico)]] | A estrutura única que o Dashboard e o Slack #daily compartilham |
| [[_Contrato de Autoridade dos Agentes]] | **Quem decide o quê** — poderes e limites por agente (Constituição Operacional) |
| [[_Taxonomia de Eventos]] | Eventos Informacional / Operacional / Crítico e roteamento (Constituição Operacional) |
| [[_Daily Brief — Revisão]] | Relatório: o que manter / simplificar / remover no brief (recomendações P3) |
| [[_Canal Daily (Contrato)]] | Contrato do canal Slack #daily — Morning Brief (09h) + Critical Alerts |
| [[🔌 Plugins]] | Quais plugins, por quê e como configurar cada um |
| [[🎨 Tema e Visual]] | Tema, CSS premium e callouts de design |
| [[📊 Biblioteca Dataview]] | Todas as consultas prontas para copiar |
| [[✅ Central de Tarefas]] | Gestão de tarefas (Hoje / Semana / Atrasadas…) |
| [[🔁 Automacoes]] | Captura, criação de notas, resumos, manutenção |
| [[Agentes JARVIS]] | Personas cognitivas (Executive Assistant, TOR, BOBBY…) e como invocá-las |
| [[Ponte n8n ↔ JARVIS]] | Conectar a máquina comercial n8n (Yalt) ao vault, com segurança |
| [[⌨️ Atalhos e Hotkeys]] | Teclas de produtividade estilo Raycast |

---

## 🏛️ As 6 fases do projeto

O JARVIS foi construído em camadas. Entender a ordem ajuda a manter e a expandir.

### Fase 1 — Arquitetura e pastas
Estrutura numerada (`00`–`90`) que ordena o vault para a próxima década, agora combinada com a camada de fluxo `raw/` → `wiki/` → `output/`. **Princípio central: propriedades são a fonte da verdade; pastas são só armazenamento.** Você nunca consulta por caminho — consulta por `tipo`, `status`, `area`.

```
raw/              📥 Dump humano bruto
wiki/             🧭 Memória operacional mantida pela IA
output/           📤 Dashboards e relatórios gerados
00 JARVIS/        🤖 Dashboard + este guia
10 Inbox/         📥 Captura crua (#captura)
20 Pessoal/       Projetos · Diário · Objetivos · Hábitos · Estudos · Ideias
30 Empresa/       Projetos · Reuniões · Documentação
40 CRM/           Clientes · Contatos
50 Financeiro/    Pessoal · Empresa (1 nota = 1 lançamento)
60 Conhecimento/  Wiki · IA/Prompts · Notas
70 Sistema/       Templates · SOPs · Checklists · Automação · Spec · docs
90 Arquivo/       Encerrados (nada se deleta, tudo se arquiva)
```

**Função de cada área:**
- **raw** — entrada humana bruta: inbox universal e clips ainda não processados.
- **wiki** — domínio estruturado da IA: índices, agentes, áreas, projetos e conhecimento.
- **output** — entregas geradas: dashboards, relatórios e compilações sobrescrevíveis.
- **00 JARVIS** — o centro de comando. Só o que você abre todo dia.
- **10 Inbox** — tudo entra aqui primeiro, sem classificar. Processa-se depois.
- **20 Pessoal** — sua vida: o que você toca, persegue e aprende.
- **30 Empresa** — operação do negócio: execução, reuniões, processos.
- **40 CRM** — relacionamento comercial: pipeline de clientes e pessoas.
- **50 Financeiro** — livro-razão de notas atômicas; totais calculados ao vivo.
- **60 Conhecimento** — cérebro de longo prazo: Wiki, prompts, estudos, notas.
- **70 Sistema** — a "engenharia": templates, automações, contrato, docs.
- **90 Arquivo** — acervo consultável fora do caminho do dia a dia.

### Fase 2 — Templates e propriedades
15 templates Templater em `70 Sistema/Templates/`, cada um com o frontmatter exato do [[_Spec JARVIS]]. Toda nota nasce com as propriedades certas — é isso que faz as queries funcionarem.

### Fase 3 — Dashboard JARVIS
A página [[🤖 JARVIS]] com captura rápida, agenda do dia, buckets de tarefas, projetos ativos, objetivos, CRM em foco, últimas notas e estatísticas ao vivo — tudo em cards estilo software.

### Fase 4 — Dataview e Tasks
Painéis ao vivo (Dataview) filtrando por propriedade + gestão de tarefas (Tasks) por vencimento. Biblioteca completa em [[📊 Biblioteca Dataview]] e [[✅ Central de Tarefas]].

### Fase 5 — Automação
QuickAdd (captura e criação), Auto Note Mover (organização), Linter (manutenção do frontmatter), botões no dashboard, fluxo de resumo de reunião com IA. Tudo em [[🔁 Automacoes]].

### Fase 6 — Visual e UX
Tema **Minimal** + Style Settings + o snippet `jarvis.css` (cards, glow ciano, métricas, tabelas estilizadas). Detalhes em [[🎨 Tema e Visual]].

---

## 🚀 Instalação passo a passo

> [!warning] Faça nesta ordem
> Os plugins dependem uns dos outros (ex.: Periodic Notes usa os templates). Siga a sequência.

### 1. Plugins da comunidade
Em **Configurações → Plugins da comunidade → Procurar**, instale e ative (IDs entre parênteses):

1. **Templater** (`templater-obsidian`)
2. **Dataview** (`dataview`)
3. **Tasks** (`obsidian-tasks-plugin`)
4. **QuickAdd** (`quickadd`)
5. **Calendar** (`calendar`)
6. **Periodic Notes** (`periodic-notes`)
7. **Homepage** (`homepage`)
8. **Style Settings** (`obsidian-style-settings`)
9. **Iconize** (`obsidian-icon-folder`)
10. **Linter** (`obsidian-linter`)
11. **Auto Note Mover** (`obsidian-auto-note-mover`)
12. **Buttons** (`buttons`)

> Detalhe de cada configuração em **[[🔌 Plugins]]**.

### 2. Configurações essenciais (resumo)
- **Templater** → Template folder: `70 Sistema/Templates`. Ative *Trigger Templater on new file creation*.
- **Dataview** → ative *Enable JavaScript Queries* e *Enable Inline Queries*.
- **Tasks** → formato *Emoji*. Sem global filter (mais simples).
- **Periodic Notes** → Daily: pasta `20 Pessoal/Diario`, formato `YYYY-MM-DD`, template `T - Daily Note`. Weekly: formato `gggg-[W]ww`, template `T - Weekly Note`.
- **Homepage** → abrir `00 JARVIS/🤖 JARVIS`, *Open on startup*.

### 3. Ativar o visual premium
1. **Configurações → Aparência → Tema** → instale e selecione **Minimal**.
2. Ainda em Aparência, role até **CSS snippets**, clique em ↻ (recarregar) e **ligue `jarvis`**.
3. Em **Style Settings** (ícone na barra lateral), ajuste o accent para o ciano `#22D3EE`.
4. (Opcional) **Iconize** → atribua ícones às pastas para o acabamento de "software".

> Passo a passo visual completo em **[[🎨 Tema e Visual]]**.

### 4. Primeiro voo
- Abra o Dashboard [[🤖 JARVIS]] (deve abrir sozinho no startup).
- Os dados de exemplo (Acme Corp, Lançamento do Novo Site, etc.) já fazem os painéis "acenderem".
- Crie sua primeira nota real: `Ctrl/Cmd+P` → *QuickAdd* → ou insira um template via Templater.

---

## 🔄 Operação no dia a dia

> [!cyan] O ritmo do sistema
> **Manhã:** abra o Dashboard, veja a agenda e os buckets de tarefa.
> **Durante o dia:** capture tudo no Inbox com `#captura` (sem classificar).
> **Fim do dia:** preencha a Daily Note (foco, log, gratidão).
> **Semana:** processe o Inbox até zerar e faça a Weekly Note (revisão).

| Quero… | Como |
|---|---|
| Capturar algo rápido | Cole em `raw/inbox.md`; QuickAdd legado ainda pode cair no `10 Inbox` com `#captura` |
| Criar projeto/cliente/reunião | QuickAdd ou template Templater correspondente |
| Ver o que fazer hoje | Dashboard → Agenda / [[✅ Central de Tarefas]] |
| Lançar uma despesa/receita | QuickAdd "Lançamento" → `50 Financeiro` |
| Registrar uma decisão de reunião | Nota da reunião → seção Decisões/Ações |
| Encontrar algo | Quick Switcher (`Ctrl/Cmd+O`) ou o MOC da área |
| Arquivar | Mude `status` para `concluido`/`arquivado` (não mova a pasta) |

---

## 🧠 Sub-sistema Wiki

`wiki/` é a memória operacional ampla da IA. `60 Conhecimento/Wiki/` continua como base de conhecimento incremental especializada (padrão "LLM Wiki"): fontes imutáveis em `Wiki/raw/`, páginas geradas e interligadas mantidas pelo assistente. Use quando for acumular conhecimento sobre um tema ao longo do tempo. Manual: [[_Wiki — Como Manter]].

---

## 📈 Escalabilidade — por que isso aguenta 10 anos

1. **Consulta por propriedade, não por pasta** → reorganizar pastas nunca quebra um painel.
2. **Contrato único** ([[_Spec JARVIS]]) → nomes de campo padronizados; nada de improviso.
3. **Numeração de pastas** → ordem estável mesmo com centenas de notas.
4. **Arquivar, não deletar** → histórico íntegro e consultável.
5. **Linter** → frontmatter sempre consistente, mesmo digitado às pressas.
6. **Tags só para temas** → sem explosão de tags redundantes com as propriedades.

---

## ✅ Checklist de implantação

- [ ] Instalar os 12 plugins da comunidade
- [ ] Configurar Templater, Dataview, Tasks, Periodic Notes e Homepage
- [ ] Selecionar o tema Minimal e ativar o snippet `jarvis.css`
- [ ] Ajustar accent ciano no Style Settings
- [ ] Criar as macros do QuickAdd (ver [[🔁 Automacoes]])
- [ ] Configurar regras do Auto Note Mover
- [ ] Ligar o Linter (lint on save)
- [ ] Definir hotkeys (ver [[⌨️ Atalhos e Hotkeys]])
- [ ] Fazer a primeira Daily Note e processar o Inbox

---

> [!jarvis]- 🔗 Voltar ao topo do sistema
> [[🤖 JARVIS]] · [[wiki/_master-index|🧭 Master Index]] · [[_Spec JARVIS]] · [[🔌 Plugins]] · [[🎨 Tema e Visual]] · [[📊 Biblioteca Dataview]] · [[✅ Central de Tarefas]] · [[🔁 Automacoes]]
