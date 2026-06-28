---
tipo: doc
status: publicado
categoria: sistema
area: empresa
criado: 2026-06-27
atualizado: 2026-06-27
relacionado:
  - "[[_Spec JARVIS]]"
  - "[[_Arquitetura JARVIS]]"
  - "[[_Contrato de Autoridade dos Agentes]]"
  - "[[_Taxonomia de Eventos]]"
  - "[[_Stack de Ferramentas (Arsenal)]]"
  - "[[Ponte n8n ↔ JARVIS]]"
  - "[[🔌 Ponte APEX ↔ JARVIS]]"
  - "[[Agentes JARVIS]]"
tags:
  - tema/ia
  - tema/lideranca
---

# 🧭 TALES OF TALLES OS — Master Evolution Report

> [!warning] Natureza deste documento
> Mora em `output/` → é **regenerável**, não é fonte da verdade ([[_Contrato de Autoridade dos Agentes]]). As decisões canônicas continuam nos specs/contratos de `70 Sistema/`. Este relatório **audita e prioriza** — não cria contrato. **Supera e absorve** o `Auditoria TALLES OS — Relatorio Priorizado` (2026-06-27) anterior, que deve ser arquivado (ver §12 · C0) para não virar fonte paralela.

> [!jarvis] Veredito em uma frase
> Não há **um repositório** a refatorar — há **um ecossistema distribuído e maduro** (JARVIS vault + app IDENTITY OS + 2 instâncias n8n + Notion + plugins Cowork) que já está **mais arquitetado** do que a missão presume. O maior valor não é "construir o OS" — ele já existe — é **religar o que está partido (OAuth Slack/Gmail), fechar buracos de segurança (chave do CRM exposta), eliminar 1 redundância (cluster Brief) e ativar o que já foi construído e está inativo.** Consolidação > expansão.

---

## 0. Método e honestidade de escopo

> [!danger] A premissa da missão precisa de correção factual
> A missão diz: *"o repositório existe no GitHub, trate-o como fonte da verdade, produza um OS unificado sem sistemas paralelos."* **Verifiquei: isso não bate com a realidade.** O repo GitHub `talesoftalles1-dev/tales-of-talles` é **só o app** — `index.html` + `README.md`, **100% HTML**, 10 commits. Ele **não** contém as skills, MCPs, connectors, agentes, dashboards, vault Obsidian nem o Revenue OS. Tratá-lo como monorepo-fonte-da-verdade levaria a **inventar assets** — exatamente o que a missão proíbe.

**A realidade conectada** (fonte da verdade de facto, distribuída):

| Domínio | Onde vive de verdade | Auditável aqui? |
|---|---|---|
| Vault de vida & empresa (JARVIS) | `OneDrive/Documents/Jarvis` (local) | ✅ total |
| App de performance (IDENTITY OS) | GitHub `tales-of-talles` (HTML) + `tales-of-talles_FINAL.html` | ✅ via README + HTML |
| Automação comercial (Yalt) | n8n `n8n.enyo.cc` (proj. `1PX1Rl4zSy2AjmI3`) | ◑ via docs/memória (workflows vivem na cloud) |
| Coaches do app + sync | n8n `talesoftalles.app.n8n.cloud` + Notion CAMP 2026 | ◑ via docs |
| Skills / MCPs / connectors | Ambiente Claude Code / Cowork (plugins) | ✅ inventário no ambiente |

**Postura deste relatório:** factual e priorizado. Onde a missão pede 12 secções enterprise, eu entrego as 12 — mas auditando **o que existe**, marcando claramente o que é cloud-only (inferido de docs) vs. verificável. Nenhum asset inventado.

---

## 1. Architecture Audit

### 1.1 Mapa de arquitetura — dois produtos, quatro camadas, um operador

```text
                            TALLES (Operador)
                                   │
        ┌──────────────────────────┴──────────────────────────┐
        ▼                                                        ▼
  ████ JARVIS — Vida & Empresa OS ████              ████ IDENTITY OS — App de Performance ████
  Obsidian (vault local, PT-BR)                     PWA single-file (HTML, event-driven)
  4 camadas (abaixo)                                Coaches: Ilia·Cariani·Sanji·Muzy
  Agentes: EA, TOR, BOBBY, KNOWLEDGE, HEALTH…       Readiness · Heatmap · Arsenal · Body scan
  Morning Brief (Node local) + Event Bus            Persistência: localStorage→IndexedDB (aspiração)
        │                                                        │
        │  n8n: n8n.enyo.cc (Yalt · ~42 wf · SDR 307K)          │  n8n: talesoftalles.app.n8n.cloud (coaches+Vision+Notion)
        └──────────────────────────┬──────────────────────────┘
                                   ▼
                    Toolchain partilhada: n8n · Claude · Slack · Notion · OneDrive
```

**As 4 camadas do JARVIS** (de [[_Arquitetura JARVIS]] — congeladas; o que evolui são os **contratos** entre elas):

| Camada | Sistema | Ferramenta oficial (Arsenal) | Papel |
|---|---|---|---|
| 1 · Memória | Obsidian (vault) | Obsidian Skills | fonte da verdade: conhecimento, projetos, CRM, diário |
| 2 · Operação | n8n | n8n MCP | sistema nervoso: eventos, integrações, briefings |
| 3 · Cognição | Claude Code | GSD Core (método) · Ruflo (diferido) | os agentes como operadores |
| 4 · Interface | Dashboard + Slack `#daily` | UI/UX Pro Max | superfície de **decisão**, não de informação |

**Conclusão estrutural (inalterada vs. auditoria anterior, reconfirmada):** são **produtos distintos que partilham toolchain** — não uma arquitetura única. A "integração" correta é por **dados e contratos** (Event Bus, pontes n8n↔vault e APEX↔vault), **não** por fusão de codebase. Forçar "um repo só" violaria a própria regra da missão.

### 1.2 Dependency Map

- **Raiz:** `_Spec JARVIS` (§2 esquema, §8 prioridade) → dele dependem Dashboard, Daily Brief, Morning Brief (`generate.mjs`), todos os agentes e todas as queries Dataview.
- **Constituição Operacional:** `_Contrato de Autoridade` + `_Taxonomia de Eventos` → governam Event Bus, roteamento `#daily` e quem pode o quê. **Cadeia limpa, sem ciclos.**
- **Pontos frágeis (dependências partidas — detalhe em §4 e §9):**
  - Morning Brief depende de `config.json` (segredos) + caminho OneDrive → quebra silenciosa se o OneDrive dessincronizar.
  - **TODO o `#sdr`/`#daily` comercial depende da credencial Slack OAuth — que está partida** (ambas as contas Slack sem token). Hoje os posts falham em silêncio.
  - Apollo Enrichment / CRM Sync / Admin dependem de **3 credenciais que ainda não existem** → workflows inativos.
- **Dependência aspiracional:** o app cita event-sourcing + IndexedDB + SharedWorker; a implementação real ainda é majoritariamente `localStorage`. Roadmap, não bug.

### 1.3 Inventário de componentes (verificável)

- **Vault:** 38 docs em `70 Sistema/` (specs, contratos, automação, 18 templates), 4 hubs de área, dashboard, Biblioteca Dataview, `jarvis.css` (596 linhas), sub-wiki LLM.
- **Camada operacional nova:** fluxo `raw/ → wiki/ → output/` (adicionado, sem migrar a estrutura numerada).
- **Integração desta sessão (2026-06-27):** hub [[🩺 Saúde & Performance]], `_Spec` §9 (tipos `treino`/`nutricao`/`corporal`), [[🔌 Ponte APEX ↔ JARVIS]] — deram à persona **HEALTH** o seu primeiro domínio de dados real.

---

## 2. Skills Audit

> [!note] Instalado ≠ adotado
> Princípio do [[_Stack de Ferramentas (Arsenal)]]: dezenas de skills/plugins estão **instalados** no ambiente; poucos são **adotados** como camada oficial. A disciplina aqui é **não promover** uma skill a contrato sem valor mensurável.

### 2.1 Skills oficiais (adotadas como camada)

| Skill | Camada | Papel | Status |
|---|---|---|---|
| **Obsidian Skills** (`obsidian-markdown`, `obsidian-bases`, `json-canvas`, `obsidian-cli`, `defuddle`) | Memória | I/O do vault fiel ao `_Spec` | `oficial` |
| **n8n MCP** | Operação | engenharia de workflows por código (aditivo) | `oficial` |
| **GSD Core** (método) | Cognição | laço discutir→planejar→executar→verificar do EA | `em incorporação` |
| **UI/UX Pro Max** | Interface | evolução da decision surface | `em uso` |
| **Ruflo** (coordenação multi-agente) | Cognição | só quando houver 5–7 agentes operacionais | `diferido` |

### 2.2 Skills instaladas por domínio (plugins Cowork — capacidade latente)

`sales` (account-research, call-prep, pipeline-review, forecast, draft-outreach…), `marketing`, `product-management`, `data` (analyze, build-dashboard, sql), `legal`, `small-business`, `enterprise-search`, `productivity` (memory/task management), além das de criação de documento (docx/pptx/xlsx/pdf), `skill-creator`, `mcp-builder`, `theme-factory`, `canvas-design`.

### 2.3 Arquitetura unificada de skills (recomendação)

- **Mapear cada skill a uma das 4 camadas** e a um agente dono. Skills sem camada/dono = ruído latente.
- **Compor, não duplicar:** o `sales:*` e o `small-business:*` têm forte sobreposição (pipeline, outreach, briefing). Para o contexto Yalt, **eleger `sales:*` como família canônica** e tratar `small-business:*` como referência — evita dois "como fazer pipeline".
- **Regra de ouro:** skill nova só vira oficial com (a) camada, (b) agente dono no [[_Contrato de Autoridade dos Agentes]], (c) valor mensurável. Senão fica `instalado`, não `oficial`.

---

## 3. MCP Audit

Servidores MCP conectados no ambiente (capacidade real disponível ao JARVIS):

| MCP | Uso no OS | Veredito |
|---|---|---|
| **n8n MCP** | camada de Operação oficial | ✅ ativo, alto valor |
| **Notion** | CAMP 2026 + sync do app | ✅ ativo |
| **Slack** | entrega `#daily`/`#sdr` | 🔴 **OAuth partido** (ver §4/§9) |
| **Gmail / AgentMail** | rascunhos de outreach | 🔴 Gmail OAuth partido (YAL-5) |
| **Google Calendar** | agente CALENDAR | ◑ pouco usado |
| **Apollo** | enrichment de leads | ⚠️ workflow inativo (sem credencial) |
| **Supermetrics** | marketing analytics | ◔ instalado, sem uso no OS |
| **Linear / Asana / ClickUp** | gestão de tarefas | ◔ redundante com Tasks/Dataview do vault |
| **Canva / Gamma** | criação de assets | ◑ sob demanda |
| **Zapier** | 9k apps (ponte genérica) | ◔ fallback, não adotado |
| **mcp-registry** | descoberta de connectors | utilitário |

**Recomendações:** (1) **consolidar gestão de tarefas** — o vault (Tasks + Dataview §8) já é canônico; **não** adotar Linear/Asana/ClickUp como segundo backlog. (2) Avaliar Supermetrics só se houver relatório de marketing recorrente (senão, manter `instalado`). (3) Apollo/Slack/Gmail = **religar credenciais** (não é problema de MCP, é de auth — §4).

---

## 4. Connector Audit

| Connector | Estado | Detalhe / ação |
|---|---|---|
| **Slack OAuth** (×2 contas) | 🔴 **Partido** | "Unable to sign without access token". Todos os posts `#sdr`/`#daily` falham **em silêncio** (onError=continue). **Religar OAuth** desbloqueia toda a camada de Interface comercial. |
| **Gmail OAuth** (YAL-5) | 🔴 Partido | rascunhos de outreach não são criados. Religar. |
| **Apollo** (`Header Auth`) | ⚠️ Ausente | credencial `httpHeaderAuth X-Api-Key` a criar 1× (só o Operador). |
| **n8n API Key (yalt)** | ⚠️ Ausente | `X-N8N-API-KEY` — necessária p/ Admin/limpeza. |
| **CRM Yalt API** | ⚠️ Ausente como credencial | token estava **hardcoded** no CRM Sync; movido p/ credencial, mas a credencial precisa ser criada. **+ chave exposta no vault — ver §9.** |
| **OneDrive ↔ vault** | ✅ Funcional | base das pontes (MS Graph é o caminho recomendado p/ n8n→vault). |
| **CRM custom** (`sales-crm.yalt.co`) | ◑ Parcial | API = CRUD de leads. Sem connector no registry (é custom) → caminho: MCP próprio (skill `mcp-builder`) ou n8n como ponte. |
| **ESP / tracking de email** | 🔴 Inexistente | sem opens/clicks/bounce. IPzMarketing(E-goi) e SendGrid aparecem no DNS mas **não** no caminho de produção. |

**Missing connectors (valor real):** (1) um **MCP do CRM Yalt** para o Claude ler/escrever leads sem expor a chave no chat; (2) uma **camada de ESP/tracking** se o objetivo for medir entregabilidade (hoje impossível com rascunhos Gmail manuais).

---

## 5. Agent Operating Model Audit

O modelo é **forte** ([[_Contrato de Autoridade dos Agentes]]): 5 verbos (**Criar · Editar · Priorizar · Executar · Arquivar**), *default deny*, separação de poderes (EA orquestra prioridade; especialistas executam no domínio; irreversível/externo → humano).

| Agente | Domínio | Executar | Status operacional real |
|---|---|:--:|---|
| **Operador (Talles)** | tudo | ✅ | — |
| **Executive Assistant** | orquestração/prioridade | ❌ | ✅ loop principal (Claude Code) |
| **BOBBY** | comercial | ⚠️ enviar | ✅ roda no n8n (Yalt) |
| **TOR** | dev | ⚠️ deploy | ◑ chapéu manual (Claude Code) |
| **KNOWLEDGE** | wiki/memória | ✅ ler | ◑ chapéu manual |
| **HEALTH** | treino/nutrição/corpo | ❌ | 🆕 **agora com domínio de dados** ([[🩺 Saúde & Performance]]) |
| RESEARCH · WRITING · FINANCE · CALENDAR | — | vário | ⚪ planejado / chapéu manual |

**Lacuna (já diagnosticada, reconfirmada):** o roster lista ~10 personas, mas **operacionais de facto são ~2** (EA + BOBBY). **Recomendação:** marcar `status operacional` por agente (`operacional` / `chapéu manual` / `planejado`) no próprio contrato — para o papel nunca divergir da realidade. **Sem sobreposição de responsabilidades** — isto a missão já tem feito.

---

## 6. Knowledge System Audit

### 6.1 Estrutura (saudável)

`raw/` (humano despeja) → `wiki/` (IA organiza) → `output/` (entrega regenerável). Estrutura numerada `00–90` **congelada** como armazenamento; **queries filtram por propriedade**, nunca por pasta. Padrões de nomeação, metadata (frontmatter §2) e linking (`[[wikilink]]`) já estão no `_Spec`.

### 6.2 Repositórios — canônico / referência / arquivo

| Função | Canônico | Referência | Arquivar |
|---|---|---|---|
| Arquitetura | `_Spec JARVIS` | `_Arquitetura JARVIS` | — |
| Governança de agentes | `_Contrato de Autoridade` + `_Taxonomia de Eventos` | `Agentes JARVIS` | — |
| Morning Brief | `Automacao/_Morning Brief — Spec` + código | Runbook | 🔴 **`Specs/Morning Brief.md`** |
| App de performance | `tales-of-talles_FINAL.html` | README GitHub | `.html` legacy + `.bak` |
| Saúde no vault | `_Spec` §9 + [[🩺 Saúde & Performance]] | [[🔌 Ponte APEX ↔ JARVIS]] | — |

### 6.3 🔴 Redundância principal — cluster "Brief"

Seis documentos giram em torno do mesmo tema e **dois se contradizem**: `Specs/Morning Brief.md` (antigo: cron 07h, pasta "Automation" inexistente, canal `#daily-test`, fila de retry) **vs.** a realidade `Automacao/_Morning Brief — Spec` + `generate.mjs` (09h, `output/YYYY-MM-DD-morning-brief.txt`, sem retry). **Quem seguir o doc errado constrói a coisa errada.** Ação: **depreciar `Specs/Morning Brief.md`**, fixar terminologia (**Morning = entrega**, **Daily = estrutura**), criar **1 índice do subsistema Brief**.

### 6.4 Higiene do root

Processar/remover ruído contra o próprio contrato: `.md` de 0 bytes (`2026-06-27.md`, `2026062714xx.md`), canvas/base "Sem título", `Recording …m4a` solto, `debug-*.log`.

---

## 7. Dashboard & UX Audit — Blueprint 2.0

O `🤖 JARVIS.md` já segue **decision-first**: superfície primária (`.jarvis-brief-surface`) com Top 3 · Riscos · Comercial · **🩺 Body & Training** (novo) · Hoje; tudo o mais colapsado em "Tudo o resto". Sinal-vs-ruído é governado pela [[_Taxonomia de Eventos]] (só 🔴 Crítico interrompe).

**Pontos fortes:** prioridade calculada ao vivo (score §8, nunca armazenada); espelhamento `#daily`; `jarvis.css` premium escopado (não quebra temas).

**Blueprint 2.0 — evoluções de alto valor:**

| Área | Hoje | 2.0 |
|---|---|---|
| Visibilidade executiva | 4–5 seções de decisão | + faixa de **status de saúde do sistema** (OAuth Slack/Gmail ✅/🔴, últimos syncs) — hoje as falhas são silenciosas |
| Awareness em tempo real | pull (abrir o vault) | push 🔴 via `#daily` quando a Ponte n8n estiver ativa (Path 1 já construído, inativo) |
| Visão única | Pessoal + Comercial + Saúde | ✅ entregue nesta sessão; falta o **pulso comercial** chegar do n8n (depende do Slack/ponte) |
| Operacional | tabelas Dataview | manter — é o ponto forte; **não** adicionar UI paralela |

> [!tip] Princípio a preservar
> O dashboard mostra **decisão**, não inventário. Toda evolução de UI passa por **UI/UX Pro Max** e respeita o filtro de ruído. Nada de "mais widgets".

---

## 8. Revenue Operating System Audit

**Pipeline (n8n `n8n.enyo.cc`, proj. `1PX1Rl4zSy2AjmI3`):** DataTable `yalt_leads_pilot` (`SfxIm4B4JhJvdBGA`) como espinha dorsal, com máquina de estados `pipeline_state` (`new → enriching → qualified → drafted → sent_or_exported → synced → error`), `last_error`, `last_synced_at`.

**Fluxo:** Import → Qualificação/Outreach (IA gpt-5.2, Pilot 307K backlog) → Apollo Enrichment → Follow-up → CRM Sync → Briefing/Orquestrador.

| Componente | ID | Estado |
|---|---|---|
| **Pilot Qualificação & Outreach** | `8joJZGZhRP33ASuK` | ✅ endurecido + **publicado v8** (idempotente, 3 saídas, urgency_flag) |
| **Orquestrador Comercial (Control Tower)** | `0BFmxjllpEmxJGKN` | ⚠️ **construído, INATIVO** (funil + erros + top ARR; testado: 132 leads, ARR ~€1,36M/ano) |
| Apollo Enrichment | `d7UZ2jt2lpnK7sBn` | ⚠️ inativo (sem credencial) |
| CRM Status Sync | `3Yx6Je5MtsrKcO2P` | ⚠️ inativo (token→credencial pendente) |
| Briefing SDR antigo | `Sq71PU4KyTtqB033` | 🔻 desativar quando o Orquestrador subir |
| Critical Alerts → #daily (Path 1) | `nCG0dfGEzyBLhxLv` | ⚠️ construído, inativo |

**Gaps de receita:**
- 🔴 **Entrega cega:** Slack OAuth partido → nenhum briefing chega ao `#sdr`. **É o gargalo nº 1** — destrava forecasting, visibilidade e o Orquestrador de uma vez.
- 🔴 **Sem tracking de email** (opens/clicks/bounce) → não há funil de conversão mensurável nem A/B. Decidir se vale uma camada ESP.
- ⚠️ **Forecasting** existe como dado (ARR por estágio no Orquestrador) mas não chega a lugar nenhum (Slack). Ligar ao `#daily`/Dashboard fecha o ciclo.
- 🧹 Lead de teste `ZZ-TESTE-HARDENING-v8-apagar` (id 132) ainda na DataTable — apagar.

> [!danger] Regra sagrada (preservar)
> Os ~42 workflows de produção Yalt **não se tocam** sem pedido explícito. Toda integração é **aditiva**. Esta regra já está no [[Ponte n8n ↔ JARVIS]] e é mantida.

---

## 9. Security Audit

| # | Achado | Severidade | Ação |
|---|---|:--:|---|
| S1 | **Chave de API do CRM em texto plano no vault** (`yalt_ecf3…a8`) — em `40 CRM/🤝 CRM.md` (2 ocorrências, incl. "My api key for claude"), dentro do OneDrive sincronizado | 🔴 **Crítica** | **Rotacionar a chave**, remover do `.md`, guardar em credential store / env. Nunca no vault nem no chat. |
| S2 | **Slack OAuth partido** (×2) | 🟠 Alta (operacional) | religar — destrava entrega; sem isto o sistema é cego |
| S3 | **Gmail OAuth partido** (YAL-5) | 🟠 Alta | religar p/ rascunhos de outreach |
| S4 | `morning-brief/config.json` com `slackBotToken` + webhooks em texto plano no OneDrive | 🟠 Média | gitignored ✅, mas é segredo em repouso na cloud → env/credential store ou confirmar pasta privada |
| S5 | Token do CRM antes **hardcoded** no CRM Sync | 🟡 | já movido p/ credencial (bom) — concluir criando a credencial |
| S6 | **DMARC `p=none`** + **SPF `~all`** (softfail); SendGrid fora do SPF | 🟡 | endurecer DMARC e SPF `-all` após confirmar remetentes |
| ✅ | Chave Anthropic no n8n (não no cliente do app); cláusula de imutabilidade (só Operador altera Constituição/Contrato/Spec); *default deny* na matriz | 🟢 | **postura correta — manter** |

> [!warning] S1 é a prioridade absoluta de segurança
> Uma chave de produção do CRM sincronizada na nuvem em texto plano é o risco mais sério do ecossistema. Rotacionar **hoje**.

---

## 10. Refactor Recommendations (consolidação > expansão)

1. **Fonte única do Brief:** depreciar `Specs/Morning Brief.md`; tudo aponta para `Automacao/_Morning Brief — Spec` + código. Fixar termos (Morning=entrega · Daily=estrutura) num índice.
2. **Fonte única do app:** confirmar `tales-of-talles_FINAL.html` como canônico; arquivar `.html` legacy + `.bak`; alinhar instruções que citam arquivos inexistentes (`_2.html`).
3. **Um só backlog de tarefas:** vault (Tasks + Dataview §8) é canônico. **Não** adotar Linear/Asana/ClickUp como segundo sistema.
4. **Uma família de skills comerciais:** `sales:*` canônica; `small-business:*` como referência.
5. **Status operacional por agente** no contrato (operacional/manual/planejado).
6. **Arquivar a auditoria anterior** (`Auditoria TALLES OS`) — este relatório a absorve; manter duas é criar fonte paralela.
7. **Segredos fora do vault** (S1, S4): credential store/env.

---

## 11. Unified Architecture (o modelo coeso alvo)

> Um operador. Quatro camadas. Dois produtos ligados por **dados e contratos** — não por código.

```text
  MEMÓRIA (Obsidian)  ──fonte da verdade──┐
     _Spec · Contratos · CRM · Saúde       │
            ▲           │                  ▼
   pontes  │            │ Event Bus  INTERFACE (Dashboard + #daily)
  (n8n↔vault│           │ (eventos)   decisão-first, status do sistema
   APEX↔vault)          ▼                  ▲
  OPERAÇÃO (n8n) ──Yalt + coaches──────────┘
     BOBBY · pipeline_state · briefings
            ▲
            │ governa
  COGNIÇÃO (Claude Code): EA orquestra · TOR/BOBBY/HEALTH/KNOWLEDGE executam
            (Contrato de Autoridade — 5 verbos, default deny)
```

**Contratos que unificam tudo (já existem — preservar e honrar):** `_Spec` (§2 dados, §8 prioridade, §9 saúde), `_Contrato de Autoridade`, `_Taxonomia de Eventos`, `Ponte n8n↔JARVIS`, `🔌 Ponte APEX↔JARVIS`. **Nenhum framework novo é necessário.**

---

## 12. Future Roadmap

### 12.1 Matriz de prioridade

| Classe | Itens |
|---|---|
| 🔴 **Crítico** | **S1** rotacionar chave CRM exposta · **S2** religar Slack OAuth · **C0** arquivar auditoria anterior · **R1** depreciar `Specs/Morning Brief.md` |
| 🟠 **Alto** | **S3** religar Gmail · criar **3 credenciais** (Apollo/n8n/CRM) · ativar **Orquestrador** `0BFmxjllpEmxJGKN` + desativar briefing antigo · ativar **Path 1** Critical Alerts |
| 🟡 **Médio** | índice do Brief + terminologia · `status operacional` por agente · higiene do root · confirmar canônico do app + arquivar legacy · ligar **Ponte APEX→vault** (caminho 1) |
| 🟢 **Nice-to-have** | MCP do CRM Yalt · camada ESP/tracking · faixa de "system health" no Dashboard · migração localStorage→IndexedDB no app |

### 12.2 Execução — 4 micro-sprints (um foco por ciclo, validado antes de avançar)

**Sprint 1 — Segurança & verdade** · _risco: baixo · impacto: elimina risco crítico + retrabalho_
- Objetivos: fechar o buraco de segurança e as fontes conflitantes.
- Entregáveis: chave CRM rotacionada e fora do vault (S1); `Specs/Morning Brief.md` depreciado (R1); `Auditoria TALLES OS` arquivada (C0).
- Arquivos: `40 CRM/🤝 CRM.md`, `40 CRM/Clientes/CRM API.md`, `70 Sistema/Specs/Morning Brief.md`, `output/Auditoria TALLES OS…`.
- Riscos: nenhum técnico (S1 exige ação do Operador no provedor do CRM).

**Sprint 2 — Religar o sistema nervoso** · _risco: baixo (só auth) · impacto: o sistema deixa de ser cego_
- Objetivos: restaurar entrega e enrichment.
- Entregáveis: Slack OAuth (S2) + Gmail (S3) religados; 3 credenciais n8n criadas; teste manual de 1 post no `#daily`.
- Arquivos/recursos: credenciais n8n (Operador); workflows Apollo/CRM Sync passam a poder ativar.
- Riscos: baixo; só o Operador cria credenciais (nenhuma automação inventa segredo).

**Sprint 3 — Ativar o que já está construído** · _risco: baixo; só docs+ativação aditiva_
- Objetivos: ligar valor já pronto e inativo.
- Entregáveis: Orquestrador `0BFmxjllpEmxJGKN` ativo + briefing antigo `Sq71PU4KyTtqB033` desativado; Path 1 Critical Alerts ativo; `status operacional` por agente; índice do Brief + terminologia.
- Arquivos: `_Contrato de Autoridade`, `Agentes JARVIS`, novo `_Índice do Brief`.
- Riscos: médio — toca agendamentos; validar isolado, regra aditiva.

**Sprint 4 — Fechar os ciclos de dados** · _risco: médio · impacto: "repleta de dados" de ponta a ponta_
- Objetivos: dados fluindo app↔vault e n8n↔vault.
- Entregáveis: Ponte APEX→vault no caminho 1 (n8n→OneDrive); pulso comercial do BOBBY no `#daily`/vault; higiene do root; (opcional) MCP do CRM Yalt.
- Arquivos: `🔌 Ponte APEX ↔ JARVIS`, `Ponte n8n ↔ JARVIS`, root do vault.
- Riscos: médio (MS Graph no n8n); tudo aditivo.

---

## 13. O que **não** fazer (anti-recomendações)

1. **Não** fundir os codebases num "OS único" — são produtos distintos; a partilha de toolchain + as pontes já são a integração.
2. **Não** criar frameworks/pastas/vaults novos — a fundação JARVIS basta (pastas congeladas).
3. **Não** adotar um segundo sistema de tarefas/CRM/briefing — consolidar nos canônicos.
4. **Não** tocar nos ~42 workflows de produção Yalt — regra aditiva sagrada.
5. **Não** transformar este `output/` em fonte da verdade — decisões nascem nos specs/contratos.

## 14. Só o Operador pode (gates humanos)

Rotacionar a chave do CRM (S1) · religar OAuth Slack/Gmail · criar as 3 credenciais n8n · ativar/desativar workflows em produção · alterar `_Spec`/Contratos/Constituição · aprovar a §9 (Saúde) adicionada nesta sessão.

> [!jarvis] Próximo passo recomendado
> Comece pelo **Sprint 1** — é baixo risco e fecha o único risco **crítico** (chave exposta) e a maior fonte de retrabalho (docs conflitantes) numa só passada. Quer que eu execute agora o que é seguro e aditivo (arquivar a auditoria anterior, depreciar o `Specs/Morning Brief.md`, criar o índice do Brief), deixando os gates humanos (chave, OAuth, credenciais) para você?
