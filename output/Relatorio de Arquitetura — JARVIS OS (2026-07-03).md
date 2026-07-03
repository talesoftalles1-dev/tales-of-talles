---
dominio: jarvis
tipo: output
status: gerado
criado: 2026-07-03
atualizado: 2026-07-03
relacionado:
  - "[[_Spec JARVIS]]"
  - "[[_Arquitetura JARVIS]]"
  - "[[_Stack de Ferramentas (Arsenal)]]"
  - "[[_Contrato de Autoridade dos Agentes]]"
tags:
  - tema/ia
---

# 🏛️ Relatório de Arquitetura — JARVIS OS

> [!warning] Contexto deste relatório
> Gerado em resposta ao **Master Architect Prompt** (invocado via `/ruflo-core:init-project` em 2026-07-03). Este arquivo vive em `output/` — é entrega gerada, **não** memória canônica. O prompt pedia um Architecture Report completo *antes* de qualquer modificação; este é o relatório. **Nenhuma modificação estrutural foi executada.**

> [!danger] Conflitos que bloquearam a execução imediata
> 1. **Modo Operacional ativo até 2026-07-06**: sem novos agentes, contratos, arquitetura, integrações ou expansão de escopo. O Master Architect Prompt é, na íntegra, uma expansão de escopo.
> 2. **Ruflo está `diferido` no [[_Stack de Ferramentas (Arsenal)]]** com gatilho explícito: "estudar apenas quando houver 5–7 agentes realmente operacionais". Hoje há ~2 (BOBBY em produção n8n; EA como loop principal).
> 3. O comando de init do Ruflo (`npx @claude-flow/cli init`) **sobrescreveria o `CLAUDE.md`** — que codifica o canon ratificado em 2026-06-30. Não foi executado.
> A decisão de revogar qualquer um desses três pontos é **exclusiva do Operador** (cláusula de imutabilidade do [[_Contrato de Autoridade dos Agentes]]).

---

## 1. Análise do repositório atual

**Inventário:** 199 arquivos rastreados. Repositório **híbrido**: vault Obsidian (estrutura numerada `00`–`90` + camada `raw/wiki/output`) + app PWA APEX (`index.html`, single-file) + automações Node (`70 Sistema/Automacao/`) + scripts.

**O que já existe e funciona:**

| Componente | Estado |
|---|---|
| Canon PT-BR (5 docs: _Spec, Contrato de Autoridade, Constituição, Arquitetura, Taxonomia) | ✅ ratificado 2026-06-30, coeso e mutuamente referenciado |
| Modelo de dados (frontmatter `tipo/status/area/dominio`) | ✅ contratado no _Spec §2, ~137 notas conformes |
| Sistema de prioridade (score §8, "Filtro de Ruído") | ✅ contratado; DQL pronto na Biblioteca Dataview |
| Fluxo `raw/ → wiki/ → output/` | ✅ definido, territórios de escrita claros; inbox atualmente vazio |
| Roster de 9 agentes + matriz de autoridade (5 verbos, default deny) | ✅ contratado; 2 operacionais de fato |
| Event Bus (vocabulário v1, 14 eventos) | ✅ contrato de nomes; broker ainda conceitual |
| Executive Assistant dashboard (`dashboard.mjs`, task 07:00) | ✅ roda diário e limpo |
| Morning Brief (`generate.mjs`, task 09:00) | ✅ geração local ok; entrega Slack bloqueada (OAuth) |
| n8n (9 workflows JARVIS + ~42 produção Yalt) | ⛔ trial Cloud expirado 2026-06-29; kit self-host pronto em `n8n-selfhost/` |
| Obsidian UX | ✅ Dataview+Tasks instalados; tema Minimal + `jarvis.css`; workspaces salvos |
| Integração APEX (saúde) | ✅ contrato de dados §9 (treino/nutricao/corporal), anti-fusão de codebase |

**Leitura honesta:** o Master Architect Prompt pede um sistema que **já foi projetado**. As 4 camadas (Memória/Operação/Cognição/Interface), o inbox universal, o pipeline de triagem, os contratos de agentes, o organizar-por-propriedade-não-por-pasta — tudo isso já é canon, ratificado há 3 dias, após uma reconciliação de git divergence dolorosa e uma passada de estabilização. **Redesenhar agora seria destruir trabalho recém-consolidado para reconstruir a mesma coisa.**

## 2. Problemas encontrados

Em ordem de severidade:

1. **Sistema sobre-arquitetado e sub-populado.** Dados reais: 4 treinos, 2 corporais, 1 nutrição, 1 lançamento, 2 objetivos, 1 hábito, 1 projeto pessoal, **0 diários, 0 clientes, 0 contatos, 0 reuniões**. Há mais documentos descrevendo o sistema do que dados passando por ele. O maior risco do JARVIS não é arquitetura ruim — é virar uma catedral vazia.
2. **Automação end-to-end bloqueada.** n8n Cloud expirado bloqueia os 9 workflows; entrega Slack do Morning Brief bloqueada (OAuth). O kit self-host está pronto e parado (falta: Docker, 3 credenciais, 3 OneDrive folder IDs, reconexão Slack).
3. **Drift do contrato de `tipo`.** Em uso mas **ausentes do _Spec §2**: `chapter` (~31), `index` (~12), `output` (~7), `agent` (2), `plano`, `spec`, `runbook`, `governance`. Viola a regra "nunca invente nomes de propriedade fora do spec".
4. **25 "Chapters" em inglês ativos** (Chapters 07–31, espalhados por `10`–`70`) — resquício do scaffold da CONSTITUTION superseded. Duplicam conteúdo canônico, violam o padrão PT-BR e poluem queries. (Chapters 01–06 já foram arquivados em `90 Arquivo/00 Sistema/` em 2026-07-02.)
5. **Dois subsistemas de wiki** sem decisão: `wiki/knowledge/` (camada operacional) vs `60 Conhecimento/Wiki/` (LLM-wiki). Pendência aberta no [[_master_index]].
6. **README.md descreve só o app APEX**, não o JARVIS. Quem chega ao repo não descobre o vault, o canon, nem as automações. `00 Sistema/_Index.md` ficou órfão na raiz.
7. **Diário/semanal inexistentes** — humor/energia (insumos declarados do EA e do agente HEALTH) nunca são capturados.
8. **Pendências de segurança** (fora deste worktree, apontadas na estabilização de 2026-06-30): token MCP em staging no vault root; plugin Claudian em modo sem confirmação.

## 3. Oportunidades

- **CRM real via BOBBY:** os workflows Yalt já produzem leads/pipeline; a ponte aditiva pode materializar notas `cliente`/`contato` reais em `40 CRM/`.
- **Modelo local (Ollama) para trabalho repetitivo:** classificação do inbox, sugestão de tags/backlinks, resumos — exatamente o padrão já usado nos scripts Node locais.
- **Obsidian Bases** (`.base`): views de CRM, saúde e financeiro sem DQL manual.
- **Knowledge graph:** o contrato já dá os nós (notas tipadas) e arestas (`relacionado`, wikilinks, `dominio`); falta densidade, não design.
- **Diário mínimo viável:** Periodic Notes + T - Daily Note já existem; é ligar, não construir.

## 4. Arquitetura proposta

**Manter o canon. Não redesenhar.** A resposta correta ao Master Architect Prompt não é uma nova arquitetura — é (a) higiene do drift, (b) população com dados reais, (c) desbloqueio da automação, (d) absorção **aditiva** dos itens genuinamente novos do prompt:

| Item novo do prompt | Como absorver sem quebrar o canon |
|---|---|
| Ollama/modelo local ("Gemma") | Novo *mecanismo* dos agentes existentes (RESEARCH/KNOWLEDGE/HEALTH), não novo agente. Fase experimental — ver §8 |
| Knowledge graph explícito | Aprofundar `relacionado` + índices; sem ferramenta nova |
| Sales system dedicado | Popular `40 CRM/` via ponte BOBBY (aditiva) |
| Self-improving repository | Rotina semanal do EA (review → lint → índice) — já prevista no GSD Core |
| Ruflo / multi-agent swarm | **Permanece diferido** até o gatilho de 5–7 agentes operacionais |

## 5. Estrutura de pastas

**Congelada** (regra de ouro nº 5 da [[_Arquitetura JARVIS]]). Única movimentação física recomendada — via dry-run aprovado (§11 do _Spec):
- Arquivar os 25 Chapters restantes em `90 Arquivo/` (mesmo destino dos Chapters 01–06).
- Mover `00 Sistema/_Index.md` para `90 Arquivo/00 Sistema/`.
- Decidir a pendência `wiki/knowledge/` vs `60 Conhecimento/Wiki/` (recomendação: manter o LLM-wiki como subsistema especializado de fontes; `wiki/knowledge/` fica com memória operacional — documentar a fronteira em ambos os índices).

## 6. Estratégia de knowledge graph

1. **Nós** = notas tipadas (contrato §2). **Arestas** = wikilinks no corpo + `relacionado` no frontmatter + links tipados (`cliente`, `projeto`, `objetivo`).
2. **Regra nova a propor no _Spec** (pós-freeze): toda nota estruturada nasce com ≥1 link em `relacionado` (para o MOC da área, no mínimo). Zero nota órfã.
3. **Grupos de cor do graph** já contratados via `dominio` (jarvis/yalt/talles).
4. Rotina semanal do EA inclui "notas órfãs" (query Dataview `WHERE length(file.inlinks) = 0`).
5. Modelo local sugere backlinks em lote (§8); humano aprova; EA aplica.

## 7. Arquitetura de agentes IA

Mantida como está — roster de 9 personas + matriz de autoridade. Divisão de trabalho por camada de modelo (alinhada ao "Cloud orchestrates, Gemma processes, Humans decide" do prompt, que **já é** o desenho do contrato):

| Camada | Quem | Papel |
|---|---|---|
| Decisão | Operador | estratégia, capital, externo, canon |
| Orquestração | Claude (EA) | prioridade, triagem, verificação, briefs |
| Especialistas | TOR, BOBBY, RESEARCH… | execução no domínio, sob a matriz |
| Processamento local (novo, experimental) | Ollama/modelo local | classificação, tags, resumos, sugestão de links — **só sugere, nunca decide** |

Protocolo de comunicação = Event Bus ([[_Taxonomia de Eventos]]). Contexto compartilhado = `wiki/_master_index.md` + canon. Nada disso precisa de novo contrato — o modelo local entra como *mecanismo* sob os agentes existentes.

## 8. Integração Ollama / Gemma

> [!note] Correção factual
> "Gemma 4" não existe como modelo lançado (família atual: Gemma 3). Ler como "melhor modelo Gemma local disponível via Ollama".

Desenho proposto (fase experimental, **backlog `tipo: ideia` durante o freeze**):
1. **Padrão de implantação:** script Node local no mesmo molde de `morning-brief/generate.mjs`, chamando `http://localhost:11434/api/generate`. Sem serviço novo, sem credencial em repo.
2. **Piloto 1 — Triagem do inbox:** ler `raw/inbox.md`, classificar cada captura (tarefa/projeto/nota/lancamento/cliente/descarte) + propriedades sugeridas → gravar proposta em `output/triagem_sugerida.md`. EA/Operador aprova; só então materializa em `wiki/`.
3. **Piloto 2 — Tags e backlinks:** varrer notas sem `relacionado`, sugerir 1–3 links.
4. **Piloto 3 — Resumo semanal:** compilar treinos/nutrição/lançamentos da semana para o brief.
5. **Regra de autoridade:** o modelo local opera com o mesmo verbo do RESEARCH/KNOWLEDGE — cria rascunhos e sugestões em `output/`, nunca escreve direto em `wiki/` sem aprovação, nunca Executa.

## 9. Roadmap de automação

1. **Desbloquear n8n self-host** (kit pronto): Docker + 3 credenciais + 3 folder IDs OneDrive + Slack OAuth. É o item de maior alavancagem — destrava 9 workflows de uma vez.
2. **Ativar entrega do Morning Brief** (workflow `gCpvNjBzZ6ZTXg5I`: atribuir credencial Slack + ativar).
3. **Pipeline de triagem** raw→wiki (piloto Ollama §8 ou EA manual disciplinado).
4. **Broker do Event Bus** (webhook central n8n) — só depois de 1–3 estáveis.

## 10. Melhorias Obsidian

- **Periodic Notes ligado** → diário com `humor`/`energia` (destrava o agente HEALTH e o sinal de energia do EA).
- **QuickAdd** → captura de 1 tecla para `raw/inbox.md`.
- **Bases** para CRM (tabela de clientes por `status`/`valor`) e saúde (treinos da semana) — substituem DQL repetido.
- **Linter** para manter frontmatter conforme o contrato.
- Auditoria dos plugins do _Spec §6 vs instalados de fato (a estabilização apontou divergência histórica).

## 11. Melhorias GitHub

- **README.md novo**: repo híbrido — o que é o vault, o canon (5 docs), as automações, o app APEX; onboarding em 5 linhas.
- **`CONSTITUTION.md`**: adicionar banner de superseded no topo (hoje só o _Spec §13 registra isso).
- Avaliar (backlog): separar o app APEX em repo próprio — o canon já é anti-fusão por dados; o repo separado completa o desacoplamento.
- CI: revisar `deploy-pages.yml` / `jekyll-docker.yml` (provável sobra de template).
- Convenção de commits já é boa (conventional commits PT-BR) — documentar no README.

## 12. Visão de longo prazo

O roadmap já existe e foi sequenciado pelo Operador: **Fase 0 (canon — concluída) → Decision Engine → Event Bus → Knowledge Graph → Agents → Memory tiers**, com o **gate de carga cognitiva** governando cada fase. O Master Architect Prompt não substitui esse roadmap; ele o confirma. Ruflo entra na fase Agents **se e quando** o gatilho de 5–7 agentes operacionais for atingido — aí sim um `/ruflo-core:init-project` faria sentido, com proteção explícita do `CLAUDE.md`.

## 13. Plano faseado de implementação

| Fase | O quê | Pré-condição | Risco |
|---|---|---|---|
| **F0 · Higiene** | Normalizar `tipo` drift (adicionar `chapter/index/output/agent/plano/spec/runbook` ao _Spec §2 **ou** re-tipar); dry-run + arquivamento dos 25 Chapters; README novo; banner na CONSTITUTION.md; resolver token staged + Claudian yolo no vault root | Fim do freeze (2026-07-06) ou revogação explícita | Baixo |
| **F1 · População** | Diário mínimo (Periodic Notes); 1ª semana de capturas em `raw/`; primeiros clientes/contatos reais no CRM | F0 | Baixo |
| **F2 · Automação** | n8n self-host no ar; Morning Brief entregando no Slack; EA dashboard auditado | Docker + credenciais | Médio |
| **F3 · Modelo local** | Piloto Ollama de triagem (§8, pilotos 1–3) | F2; aprovação do Operador (nova integração) | Médio |
| **F4 · Grafo** | Regra de zero-órfãs; rotina semanal de linkagem; Bases | F1 | Baixo |
| **F5 · Coordenação** | Reavaliar Ruflo **no gatilho** (5–7 agentes operacionais) | F2+F3 maduras | — |

---

> [!jarvis] Síntese em uma frase
> O JARVIS não precisa de um novo arquiteto — precisa de **dados, desbloqueio e disciplina**: arquivar o legado em inglês, ligar o n8n self-host, escrever o primeiro diário, registrar o primeiro cliente real, e deixar o canon que você ratificou fazer o trabalho para o qual foi desenhado.
