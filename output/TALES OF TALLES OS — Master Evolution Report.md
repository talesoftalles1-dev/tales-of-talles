---
dominio: jarvis
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

Wrote 769 lines to C:\Users\talle\Desktop\tales-of-talles.html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<title>TALES OF TALLES · IDENTITY OS</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
:root{
  --bg:#07070d;--surface:#0e0e1c;--border:rgba(255,255,255,0.07);
  --gold:#c9a227;--gold-dim:rgba(201,162,39,0.12);
  --emerald:#10b981;--red:#ef4444;--purple:#a78bfa;
  --text:#e8e8f0;--dim:rgba(232,232,240,0.5);--muted:rgba(232,232,240,0.28);
  --glass:rgba(255,255,255,0.04);--mono:'SF Mono','Fira Code',monospace
}
html,body{height:100%;background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;overflow:hidden;user-select:none}
#app{display:flex;flex-direction:column;height:100dvh;max-width:430px;margin:0 auto}

/* HEADER */
#hdr{flex-shrink:0;background:linear-gradient(180deg,rgba(201,162,39,0.07) 0%,transparent 100%);border-bottom:1px solid var(--border);padding:12px 16px 10px}
.hdr-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px}
.id-tag{font-size:9px;letter-spacing:.2em;color:var(--gold);font-weight:600;text-transform:uppercase;margin-bottom:1px}
.id-name{font-size:22px;font-weight:800;letter-spacing:.06em;line-height:1}
.id-sub{font-size:10px;color:var(--muted);margin-top:3px;display:flex;gap:8px;align-items:center}
.id-sub span{display:flex;align-items:center;gap:3px}
.id-sub b{color:var(--text);font-weight:600;font-family:var(--mono);font-size:10px}
.orb{display:flex;flex-direction:column;align-items:center;gap:1px}
.orb-val{font-family:var(--mono);font-size:30px;font-weight:800;line-height:1;color:var(--emerald);text-shadow:0 0 20px rgba(16,185,129,.4);transition:color .5s}
.orb-lbl{font-size:8px;letter-spacing:.14em;color:var(--muted);text-transform:uppercase}
.rbars{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px}
.rb{display:flex;flex-direction:column;gap:3px}
.rb-lbl{font-size:8px;letter-spacing:.1em;color:var(--muted);text-transform:uppercase}
.rb-track{height:3px;background:rgba(255,255,255,0.07);border-radius:2px;overflow:hidden}
.rb-fill{height:100%;border-radius:2px;transition:width .6s cubic-bezier(.4,0,.2,1)}
.rb-val{font-family:var(--mono);font-size:9px;color:var(--dim)}

/* TICKER */
#ticker{flex-shrink:0;background:rgba(201,162,39,.05);border-bottom:1px solid rgba(201,162,39,.08);padding:7px 16px;display:flex;align-items:center;gap:8px;min-height:34px}
.tick-dot{width:5px;height:5px;border-radius:50%;background:var(--gold);flex-shrink:0;animation:pulse-g 2s infinite}
@keyframes pulse-g{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}
.tick-coach{font-size:9px;letter-spacing:.12em;color:var(--gold);text-transform:uppercase;font-weight:700;flex-shrink:0}
.tick-msg{font-family:var(--mono);font-size:11px;color:var(--dim);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}

/* CONTENT */
#content{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:none}
#content::-webkit-scrollbar{display:none}
.tab{display:none;padding:14px 14px 24px}
.tab.on{display:block}

/* NAV */
#nav{flex-shrink:0;display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--border);background:var(--surface)}
.nb{display:flex;flex-direction:column;align-items:center;gap:3px;padding:9px 4px 14px;border:none;background:none;color:var(--muted);cursor:pointer;transition:color .2s;font-family:inherit}
.nb.on{color:var(--gold)}
.nb-ic{font-size:17px;line-height:1}
.nb-lbl{font-size:9px;letter-spacing:.1em;text-transform:uppercase;font-weight:600}

/* CARDS */
.card{background:var(--glass);border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:10px;backdrop-filter:blur(10px)}
.card-ttl{font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);margin-bottom:10px;font-weight:600}
.sec{font-size:8px;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);margin:14px 0 8px;font-weight:600}

/* BUTTONS */
.btn{border:none;border-radius:8px;font-family:inherit;cursor:pointer;font-weight:600;letter-spacing:.05em;transition:all .15s}
.btn:active{transform:scale(.95)}
.btn-gold{background:linear-gradient(135deg,#c9a227,#a07d18);color:#000;padding:10px 16px;font-size:12px}
.btn-glass{background:var(--glass);border:1px solid var(--border);color:var(--dim);padding:8px 12px;font-size:11px}
.btn-glass:active{background:rgba(255,255,255,.08)}

/* TODAY */
.score-wrap{text-align:center;padding:12px 0}
.score-ring{position:relative;width:96px;height:96px;margin:0 auto 10px}
.score-ring svg{width:100%;height:100%;transform:rotate(-90deg)}
.ring-track{fill:none;stroke:rgba(255,255,255,.06);stroke-width:5}
.ring-fill{fill:none;stroke:var(--emerald);stroke-width:5;stroke-linecap:round;transition:stroke-dashoffset .8s cubic-bezier(.4,0,.2,1);filter:drop-shadow(0 0 6px rgba(16,185,129,.5))}
.ring-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center}
.ring-num{font-family:var(--mono);font-size:26px;font-weight:800;line-height:1;color:var(--emerald)}
.ring-sub{font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:var(--muted)}
.miss-ttl{font-size:13px;font-weight:700;letter-spacing:.08em}
.miss-sub{font-size:10px;color:var(--muted);margin-top:3px}

.qlog-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
.qlog{background:var(--glass);border:1px solid var(--border);border-radius:10px;padding:12px 8px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:5px;transition:all .15
s;font-family:inherit;text-align:center}
.qlog:active{transform:scale(.93);border-color:rgba(201,162,39,.3);background:rgba(201,162,39,.05)}
.qlog-ic{font-size:20px}
.qlog-lbl{font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-weight:600}

.stat-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
.stat{background:var(--glass);border:1px solid var(--border);border-radius:8px;padding:10px;text-align:center}
.stat-v{font-family:var(--mono);font-size:16px;font-weight:700;line-height:1}
.stat-l{font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-top:3px}

/* STRIKING */
.strike-item{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)}
.strike-item:last-child{border-bottom:none}
.s-name{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;width:72px;flex-shrink:0;color:var(--dim)}
.s-prog{flex:1;display:flex;flex-direction:column;gap:4px}
.stars{display:flex;gap:3px}
.star{font-size:11px;color:var(--muted);transition:color .3s,text-shadow .3s}
.star.lit{color:var(--gold);text-shadow:0 0 6px rgba(201,162,39,.6)}
.xp-track{height:2px;background:rgba(255,255,255,.06);border-radius:1px;overflow:hidden}
.xp-fill{height:100%;background:linear-gradient(90deg,var(--gold),#e8c04a);border-radius:1px;transition:width .4s cubic-bezier(.4,0,.2,1)}
.s-xp{font-family:var(--mono);font-size:9px;color:var(--muted);flex-shrink:0;width:38px;text-align:right}

.drill-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.drill{background:var(--glass);border:1px solid var(--border);border-radius:10px;padding:12px 10px;cursor:pointer;text-align:left;transition:all .15s;font-family:inherit}
.drill:active{transform:scale(.94);background:rgba(201,162,39,.06);border-color:rgba(201,162,39,.2)}
.drill.wide{grid-column:1/-1}
.d-name{font-size:11px;font-weight:600;color:var(--text);letter-spacing:.05em;margin-bottom:3px}
.d-xp{font-family:var(--mono);font-size:9px;color:var(--gold)}

/* BODY */
#heatmap-canvas{width:100%;border-radius:8px;display:block}
.hm-legend{display:flex;gap:14px;margin-top:8px;justify-content:center}
.leg{display:flex;align-items:center;gap:5px;font-size:9px;color:var(--muted);letter-spacing:.08em;text-transform:uppercase}
.leg-dot{width:8px;height:8px;border-radius:50%}
.view-tog{display:flex;gap:6px;margin-bottom:10px}
.vtb{flex:1;padding:7px;border:1px solid var(--border);border-radius:6px;background:var(--glass);color:var(--muted);font-size:10px;letter-spacing:.08em;text-transform:uppercase;font-weight:600
;cursor:pointer;transition:all .2s;font-family:inherit}
.vtb.on{background:rgba(201,162,39,.1);border-color:rgba(201,162,39,.3);color:var(--gold)}
.m-list{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:10px}
.m-item{display:flex;align-items:center;justify-content:space-between;background:var(--glass);border:1px solid var(--border);border-radius:6px;padding:6px 8px}
.m-name{font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--dim)}
.m-pct{font-family:var(--mono);font-size:10px;font-weight:700}

/* COACH */
.coach-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.ccard{background:var(--glass);border:1px solid var(--border);border-radius:10px;padding:12px;cursor:pointer;transition:all .2s;font-family:inherit;text-align:left}
.ccard:active{transform:scale(.95)}
.ccard.on{border-color:rgba(201,162,39,.4);background:rgba(201,162,39,.06)}
.c-av{font-size:24px;margin-bottom:6px}
.c-name{font-size:12px;font-weight:700;letter-spacing:.05em;color:var(--text);margin-bottom:2px}
.c-role{font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.c-badge{display:inline-block;font-size:7px;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);border:1px solid rgba(201,162,39,.4);padding:1px 5px;border-radius:3px;margin-top:4p
x}
.insight{background:rgba(201,162,39,.05);border:1px solid rgba(201,162,39,.1);border-radius:10px;padding:14px;margin-top:10px;cursor:pointer;transition:background .2s}
.insight:active{background:rgba(201,162,39,.1)}
.ins-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.ins-name{font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);font-weight:700}
.ins-hint{font-size:9px;color:var(--muted)}
.ins-msg{font-family:var(--mono);font-size:13px;color:var(--text);line-height:1.55}

/* TOAST */
#toast{position:fixed;top:20px;left:50%;transform:translateX(-50%) translateY(-70px);background:rgba(5,5,15,.95);border:1px solid rgba(201,162,39,.2);border-radius:20px;padding:8px 16px;font-f
amily:var(--mono);font-size:11px;color:var(--gold);z-index:1000;transition:transform .3s cubic-bezier(.34,1.56,.64,1);white-space:nowrap;max-width:90vw;overflow:hidden;text-overflow:ellipsis;b
ackdrop-filter:blur(20px)}
#toast.show{transform:translateX(-50%) translateY(0)}
</style>
</head>
<body>
<div id="app">

<header id="hdr">
  <div class="hdr-top">
    <div>
      <div class="id-tag">Identity OS · MMA + Boxing</div>
      <div class="id-name">TALLES</div>
      <div class="id-sub">
        <span><b id="h-weight">77</b>kg</span>
        <span style="color:var(--border)">·</span>
        <span><b>1.94</b>m</span>
        <span style="color:var(--border)">·</span>
        <span><b id="h-streak">0</b>d streak</span>
      </div>
    </div>
    <div class="orb">
      <div class="orb-val" id="orb-score">72</div>
      <div class="orb-lbl">Readiness</div>
    </div>
  </div>
  <div class="rbars">
    <div class="rb">
      <div class="rb-lbl">Recovery</div>
      <div class="rb-track"><div class="rb-fill" id="rb-rec" style="background:var(--emerald);width:72%"></div></div>
      <div class="rb-val" id="rv-rec">72%</div>
    </div>
    <div class="rb">
      <div class="rb-lbl">Fatigue</div>
      <div class="rb-track"><div class="rb-fill" id="rb-fat" style="background:var(--red);width:20%"></div></div>
      <div class="rb-val" id="rv-fat">20%</div>
    </div>
    <div class="rb">
      <div class="rb-lbl">Load</div>
      <div class="rb-track"><div class="rb-fill" id="rb-load" style="background:var(--gold);width:0%"></div></div>
      <div class="rb-val" id="rv-load">0</div>
    </div>
    <div class="rb">
      <div class="rb-lbl">Streak</div>
      <div class="rb-track"><div class="rb-fill" id="rb-str" style="background:var(--purple);width:0%"></div></div>
      <div class="rb-val" id="rv-str">0d</div>
    </div>
  </div>
</header>

<div id="ticker">
  <div class="tick-dot"></div>
  <span class="tick-coach" id="tick-name">SANJI</span>
  <span class="tick-msg" id="tick-msg">Initializing coach intelligence...</span>
</div>

<div id="content">

  <!-- TODAY -->
  <div id="t-today" class="tab on">
    <div class="card">
      <div class="score-wrap">
        <div class="score-ring">
          <svg viewBox="0 0 100 100">
            <circle class="ring-track" cx="50" cy="50" r="44"/>
            <circle class="ring-fill" id="ring-fill" cx="50" cy="50" r="44" stroke-dasharray="276.46" stroke-dashoffset="76.05"/>
          </svg>
          <div class="ring-center">
            <div class="ring-num" id="ring-num">72</div>
            <div class="ring-sub">Readiness</div>
          </div>
        </div>
        <div class="miss-ttl" id="miss-ttl">READY TO TRAIN</div>
        <div class="miss-sub" id="miss-sub">Standard session. Maintain technique focus.</div>
      </div>
    </div>

    <div class="sec">Quick Log</div>
    <div class="qlog-grid">
      <button class="qlog" onclick="D({type:'LOG_TRAINING',payload:{minutes:60,intensity:7}})">
        <span class="qlog-ic">🥊</span><span class="qlog-lbl">Training</span>
      </button>
      <button class="qlog" onclick="D({type:'LOG_NUTRITION',payload:{kcal:2800,protein:180}})">
        <span class="qlog-ic">🍗</span><span class="qlog-lbl">Nutrition</span>
      </button>
      <button class="qlog" onclick="D({type:'LOG_RECOVERY',payload:{hours:8,quality:8}})">
        <span class="qlog-ic">💤</span><span class="qlog-lbl">Sleep</span>
      </button>
      <button class="qlog" onclick="D({type:'LOG_TRAINING',payload:{minutes:30,intensity:3,tag:'light'}})">
        <span class="qlog-ic">🏃</span><span class="qlog-lbl">Light Work</span>
      </button>
      <button class="qlog" onclick="D({type:'LOG_SPARRING',payload:{rounds:4}})">
        <span class="qlog-ic">⚡</span><span class="qlog-lbl">Sparring</span>
      </button>
      <button class="qlog" onclick="D({type:'LOG_REST',payload:{}})">
        <span class="qlog-ic">🔋</span><span class="qlog-lbl">Rest Day</span>
      </button>
    </div>

    <div class="sec">Body Stats</div>
    <div class="stat-row">
      <div class="stat">
        <div class="stat-v" id="st-wt">77<span style="font-size:9px;color:var(--muted)">kg</span></div>
        <div class="stat-l">Weight</div>
      </div>
      <div class="stat">
        <div class="stat-v" id="st-delta" style="color:var(--gold)">+7<span style="font-size:9px;color:var(--muted)">kg</span></div>
        <div class="stat-l">To Target</div>
      </div>
      <div class="stat">
        <div class="stat-v" id="st-sess" style="color:var(--emerald)">0</div>
        <div class="stat-l">Sessions</div>
      </div>
    </div>
  </div>

  <!-- STRIKE -->
  <div id="t-strike" class="tab">
    <div class="card">
      <div class="card-ttl">Striking Arsenal</div>
      <div id="strike-list"></div>
    </div>
    <div class="sec">Boxing Drills</div>
    <div class="drill-grid">
      <button class="drill" onclick="D({type:'LOG_DRILL',payload:{drill:'jab_cross'}})">
        <div class="d-name">Jab–Cross</div>
        <div class="d-xp">+15 JAB · +10 CROSS</div>
      </button>
      <button class="drill" onclick="D({type:'LOG_DRILL',payload:{drill:'hook_series'}})">
        <div class="d-name">Hook Series</div>
        <div class="d-xp">+20 HOOK</div>
      </button>
      <button class="drill" onclick="D({type:'LOG_DRILL',payload:{drill:'uppercut_work'}})">
        <div class="d-name">Uppercut Work</div>
        <div class="d-xp">+20 UPPERCUT</div>
      </button>
      <button class="drill" onclick="D({type:'LOG_DRILL',payload:{drill:'body_attack'}})">
        <div class="d-name">Body Attack</div>
        <div class="d-xp">+20 BODY SHOT</div>
      </button>
      <button class="drill wide" onclick="D({type:'LOG_DRILL',payload:{drill:'full_combo'}})">
        <div class="d-name">Full Combination</div>
        <div class="d-xp">+10 ALL STRIKES</div>
      </button>
    </div>
  </div>

  <!-- BODY -->
  <div id="t-body" class="tab">
    <div class="card">
      <div class="card-ttl">Muscle Metabolic Heatmap</div>
      <div class="view-tog">
        <button class="vtb on" id="vb-front" onclick="setView('front')">Front</button>
        <button class="vtb" id="vb-back" onclick="setView('back')">Back</button>
      </div>
      <canvas id="heatmap-canvas" width="380" height="290"></canvas>
      <div class="hm-legend">
        <div class="leg"><div class="leg-dot" style="background:#10b981"></div>Active</div>
        <div class="leg"><div class="leg-dot" style="background:#f59e0b"></div>Moderate</div>
        <div class="leg"><div class="leg-dot" style="background:#ef4444"></div>Fatigued</div>
        <div class="leg"><div class="leg-dot" style="background:#3b82f6"></div>Rest</div>
      </div>
    </div>
    <div class="sec">Muscle Status</div>
    <div class="m-list" id="m-list"></div>
  </div>

  <!-- COACH -->
  <div id="t-coach" class="tab">
    <div class="sec">Select Lead Coach</div>
    <div class="coach-grid" id="coach-grid"></div>
    <div class="insight" id="insight-card" onclick="D({type:'NEXT_INSIGHT',payload:{cid:S.coach.active}})">
      <div class="ins-hdr">
        <span class="ins-name" id="ins-name">SANJI · NUTRITION</span>
        <span class="ins-hint">tap for next →</span>
      </div>
      <div class="ins-msg" id="ins-msg">Loading...</div>
    </div>
  </div>

</div>

<nav id="nav">
  <button class="nb on" onclick="tab('today',0)"><span class="nb-ic">◎</span><span class="nb-lbl">Today</span></button>
  <button class="nb" onclick="tab('strike',1)"><span class="nb-ic">⚡</span><span class="nb-lbl">Strike</span></button>
  <button class="nb" onclick="tab('body',2)"><span class="nb-ic">◈</span><span class="nb-lbl">Body</span></button>
  <button class="nb" onclick="tab('coach',3)"><span class="nb-ic">◇</span><span class="nb-lbl">Coach</span></button>
</nav>

</div>
<div id="toast"></div>

<script>
'use strict';

// ── CONSTANTS ────────────────────────────────────────────────────────────────
const XP_LVL = 100, MAX_LVL = 5, DECAY_MS = 5*60*1000, DECAY = 2;

const COACHES = {
  sanji:   {name:'Sanji',  role:'Nutrition',              av:'🍖'},
  ilia:    {name:'Ilia',   role:'Striking',                av:'🥊'},
  cariani: {name:'Cariani',role:'Strength & Conditioning', av:'⚙️'},
  muzy:    {name:'Muzy',   role:'Recovery',                av:'💎'}
};

const INSIGHTS = {
  sanji:  [
    '77 → Hit 180g protein today to support muscle gain.',
    '84 → Add 300 kcal above maintenance this week.',
    '6 → Post-training window: eat within 30 min.',
    '77 → Creatine 5g daily. Load phase: 20g for 5 days.',
    '180 → Protein target. Split across 5 meals.'
  ],
  ilia:   [
    '3 → Jab needs 50 more reps today. Snap it.',
    '12 → Lead hook is telegraphing. Fix shoulder dip.',
    '47 → Combination speed is the priority this week.',
    '8 → Shadowbox 3×3min before bag work. Always.',
    '2 → Footwork before punching. Move first.'
  ],
  cariani:[
    '77 → Weighted pull-ups 4×6. Back fatigue modifier active.',
    '15 → Back fatigue +15%. Reduce deadlift volume today.',
    '4 → Calf raises: light load, high rep. +15% modifier noted.',
    '3 → Compound lifts only this week. No isolation.',
    '8 → Explosive work first. Skill work after. Always.'
  ],
  muzy:   [
    '8 → Sleep 8h minimum. Non-negotiable.',
    '20 → Ice bath: 10min at 10°C post-training.',
    '5 → Active recovery: 20min walk, no intensity.',
    '3 → HRV below baseline. Reduce intensity today.',
    '7 → Compression protocol overnight. Calves priority.'
  ]
};

const DRILL_XP = {
  jab_cross:    {jab:15,straight:10},
  hook_series:  {hook:20},
  uppercut_work:{uppercut:20},
  body_attack:  {bodyShot:20},
  full_combo:   {jab:10,straight:10,hook:10,uppercut:10,bodyShot:10}
};

const DRILL_MUS = {
  jab_cross:    ['chest','shoulders','core'],
  hook_series:  ['shoulders','core','lats'],
  uppercut_work:['chest','biceps','core'],
  body_attack:  ['core','hip','chest'],
  full_combo:   ['chest','shoulders','core','lats','hip']
};

const MF = [
  {id:'chest',    lbl:'Chest',      x:.50,y:.29,rx:.12,ry:.08},
  {id:'shoulders',lbl:'Shoulders',  x:.50,y:.20,rx:.20,ry:.06},
  {id:'biceps',   lbl:'Biceps',     x:.50,y:.35,rx:.08,ry:.05},
  {id:'core',     lbl:'Core',       x:.50,y:.41,rx:.10,ry:.09},
  {id:'hip',      lbl:'Hip Flexors',x:.50,y:.51,rx:.09,ry:.05},
  {id:'quads',    lbl:'Quads',      x:.50,y:.64,rx:.12,ry:.09}
];
const MB = [
  {id:'traps',     lbl:'Traps',      x:.50,y:.20,rx:.16,ry:.06},
  {id:'lats',      lbl:'Lats',       x:.50,y:.30,rx:.14,ry:.09},
  {id:'lower_back',lbl:'Lower Back', x:.50,y:.41,rx:.09,ry:.07},
  {id:'glutes',    lbl:'Glutes',     x:.50,y:.52,rx:.12,ry:.07},
  {id:'hamstrings',lbl:'Hamstrings', x:.50,y:.64,rx:.11,ry:.08},
  {id:'calves',    lbl:'Calves',     x:.50,y:.77,rx:.07,ry:.06}
];
const ALL_MUS = [...MF,...MB];

// ── INITIAL STATE ─────────────────────────────────────────────────────────────
const INIT = {
  athlete:{weight:77,targetWeight:84,height:1.94},
  readiness:{score:72,recovery:72,fatigue:20,load:0,streak:0},
  striking:{
    jab:     {level:1,xp:0},
    straight:{level:1,xp:0},
    hook:    {level:1,xp:0},
    uppercut:{level:1,xp:0},
    bodyShot:{level:1,xp:0}
  },
  muscles:Object.fromEntries(ALL_MUS.map(m=>[m.id,{act:0,fat:0,rec:100}])),
  coach:{active:'sanji',idx:{sanji:0,ilia:0,cariani:0,muzy:0}},
  sessions:0
};

// ── PURE HELPERS ──────────────────────────────────────────────────────────────
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
function calcScore(rec,fat,load,streak){
  return clamp(Math.round(rec*.5 - fat*.3 - Math.min(load,80)*.1 + Math.min(streak,7)*2),0,100);
}
function scoreColor(s){return s>=80?'#10b981':s>=60?'#f59e0b':s>=40?'#f97316':'#ef4444'}
function muscleColor(m){
  if(m.fat>70) return '#ef4444';
  if(m.fat>40) return '#f59e0b';
  if(m.act>50) return '#10b981';
  return '#3b82f6';
}
function mission(s){
  if(s>=80) return {t:'PEAK CONDITION',     sub:'High-intensity session ready. Push limits.'};
  if(s>=65) return {t:'READY TO TRAIN',     sub:'Standard session. Maintain technique focus.'};
  if(s>=45) return {t:'MODERATE LOAD',      sub:'Light technical work or skill drills only.'};
  return           {t:'RECOVERY MODE',       sub:'Rest day. Let the adaptation happen.'};
}
function hexRgb(h){return[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]}

// ── REDUCER ───────────────────────────────────────────────────────────────────
function reduce(S,ev){
  switch(ev.type){

  case 'LOG_TRAINING':{
    const {minutes=60,intensity=5}=ev.payload;
    const load=clamp(S.readiness.load+Math.round(minutes*intensity/10),0,100);
    const fat=clamp(S.readiness.fatigue+Math.round(intensity*4),0,100);
    const streak=S.readiness.streak+1;
    const score=calcScore(S.readiness.recovery,fat,load,streak);
    return {...S,sessions:S.sessions+1,readiness:{...S.readiness,load,fatigue:fat,streak,score}};
  }

  case 'LOG_DRILL':{
    const {drill}=ev.payload;
    const xpMap=DRILL_XP[drill]||{};
    const mids=DRILL_MUS[drill]||[];
    let lvUp=null;
    const striking={...S.striking};
    for(const[k,xp] of Object.entries(xpMap)){
      if(!striking[k]) continue;
      const cur=striking[k];
      const nx=cur.xp+xp;
      const nl=Math.min(MAX_LVL,cur.level+Math.floor(nx/XP_LVL));
      if(nl>cur.level) lvUp=k;
      striking[k]={level:nl,xp:nx%XP_LVL};
    }
    const muscles={...S.muscles};
    for(const id of mids){
      if(!muscles[id]) continue;
      const m=muscles[id];
      muscles[id]={act:clamp(m.act+25,0,100),fat:clamp(m.fat+15,0,100),rec:clamp(m.rec-15,0,100)};
    }
    const fat=clamp(S.readiness.fatigue+3,0,100);
    const score=calcScore(S.readiness.recovery,fat,S.readiness.load,S.readiness.streak);
    return {...S,striking,muscles,readiness:{...S.readiness,fatigue:fat,score},_lvUp:lvUp};
  }

  case 'LOG_NUTRITION':{
    const {protein=0}=ev.payload;
    const bonus=protein>=150?5:protein>=100?2:0;
    const rec=clamp(S.readiness.recovery+bonus,0,100);
    return {...S,readiness:{...S.readiness,recovery:rec,score:calcScore(rec,S.readiness.fatigue,S.readiness.load,S.readiness.streak)}};
  }

  case 'LOG_RECOVERY':{
    const {hours=7,quality=7}=ev.payload;
    const bonus=Math.round((hours/8)*(quality/10)*20);
    const rec=clamp(S.readiness.recovery+bonus,0,100);
    const fat=clamp(S.readiness.fatigue-15,0,100);
    const muscles={};
    for(const[id,m] of Object.entries(S.muscles))
      muscles[id]={act:clamp(m.act-20,0,100),fat:clamp(m.fat-20,0,100),rec:clamp(m.rec+25,0,100)};
    return {...S,muscles,readiness:{...S.readiness,recovery:rec,fatigue:fat,score:calcScore(rec,fat,S.readiness.load,S.readiness.streak)}};
  }

  case 'LOG_SPARRING':{
    const {rounds=3}=ev.payload;
    const fat=clamp(S.readiness.fatigue+rounds*8,0,100);
    const xp=rounds*5;
    const striking={};
    for(const[k,v] of Object.entries(S.striking)){
      const nx=v.xp+xp;
      striking[k]={level:Math.min(MAX_LVL,v.level+Math.floor(nx/XP_LVL)),xp:nx%XP_LVL};
    }
    return {...S,striking,sessions:S.sessions+1,readiness:{...S.readiness,fatigue:fat,score:calcScore(S.readiness.recovery,fat,S.readiness.load,S.readiness.streak)}};
  }

  case 'LOG_REST':{
    const rec=clamp(S.readiness.recovery+10,0,100);
    const fat=clamp(S.readiness.fatigue-10,0,100);
    const muscles={};
    for(const[id,m] of Object.entries(S.muscles))
      muscles[id]={act:clamp(m.act-10,0,100),fat:clamp(m.fat-10,0,100),rec:clamp(m.rec+15,0,100)};
    return {...S,muscles,readiness:{...S.readiness,recovery:rec,fatigue:fat,score:calcScore(rec,fat,S.readiness.load,S.readiness.streak)}};
  }

  case 'SELECT_COACH':
    return {...S,coach:{...S.coach,active:ev.payload.id}};

  case 'NEXT_INSIGHT':{
    const cid=ev.payload.cid;
    const pool=INSIGHTS[cid]||[];
    const next=(( S.coach.idx[cid]||0)+1)%pool.length;
    return {...S,coach:{...S.coach,idx:{...S.coach.idx,[cid]:next}}};
  }

  case 'MUSCLE_DECAY':{
    const muscles={};
    for(const[id,m] of Object.entries(S.muscles))
      muscles[id]={act:clamp(m.act-DECAY,0,100),fat:clamp(m.fat-DECAY*.5,0,100),rec:clamp(m.rec+DECAY*.5,0,100)};
    return {...S,muscles};
  }

  default: return S;
  }
}

// ── EVENT BUS ─────────────────────────────────────────────────────────────────
let S={...INIT};

function D(ev){
  S=reduce(S,ev);
  if(S._lvUp){toast(`⭐ ${S._lvUp.toUpperCase()} LEVELED UP!`);S={...S,_lvUp:null}}
  const t=ev.type;
  if(t==='LOG_TRAINING') toast('✓ Training session logged');
  if(t==='LOG_NUTRITION') toast('✓ Nutrition logged');
  if(t==='LOG_RECOVERY') toast('✓ Sleep logged · Muscles recovering');
  if(t==='LOG_SPARRING') toast(`⚡ ${ev.payload.rounds} sparring rounds logged`);
  if(t==='LOG_REST') toast('🔋 Rest day logged');
  if(t==='LOG_DRILL'){
    const xm=DRILL_XP[ev.payload.drill]||{};
    const tot=Object.values(xm).reduce((a,b)=>a+b,0);
    if(tot) toast(`+${tot} XP · ${ev.payload.drill.replace(/_/g,' ').toUpperCase()}`);
  }
  render();
}

// ── RENDER ────────────────────────────────────────────────────────────────────
function render(){
  rHeader();rToday();rStrike();rBody();rCoach();
}

function rHeader(){
  const r=S.readiness;
  const col=scoreColor(r.score);
  $t('orb-score',r.score);
  $t('h-weight',S.athlete.weight);
  $t('h-streak',r.streak);
  el('orb-score').style.color=col;
  barW('rb-rec',r.recovery); $t('rv-rec',r.recovery+'%');
  barW('rb-fat',r.fatigue);  $t('rv-fat',r.fatigue+'%');
  barW('rb-load',Math.min(100,r.load)); $t('rv-load',r.load);
  barW('rb-str',Math.min(100,r.streak*13)); $t('rv-str',r.streak+'d');
  const cid=S.coach.active,c=COACHES[cid];
  const ins=INSIGHTS[cid]||[];
  $t('tick-name',c.name.toUpperCase());
  $t('tick-msg',ins[S.coach.idx[cid]||0]||'Analyzing metrics...');
}

function rToday(){
  const r=S.readiness;
  const s=r.score,col=scoreColor(s);
  const circ=276.46,off=circ-(circ*s/100);
  const rf=el('ring-fill');
  if(rf){rf.style.strokeDashoffset=off;rf.style.stroke=col;rf.style.filter=`drop-shadow(0 0 6px ${col}80)`}
  const rn=el('ring-num');if(rn){rn.textContent=s;rn.style.color=col}
  const m=mission(s);
  $t('miss-ttl',m.t);$t('miss-sub',m.sub);
  $t('st-wt',S.athlete.weight+'kg');
  const d=S.athlete.targetWeight-S.athlete.weight;
  const de=el('st-delta');
  if(de){de.innerHTML=`${d>=0?'+':''}${d}<span style="font-size:9px;color:var(--muted)">kg</span>`;de.style.color=d>0?'var(--gold)':'var(--emerald)'}
  $t('st-sess',S.sessions);
}

function rStrike(){
  const c=el('strike-list');if(!c)return;
  const defs=[
    {k:'jab',      lbl:'Jab'},
    {k:'straight', lbl:'Cross'},
    {k:'hook',     lbl:'Hook'},
    {k:'uppercut', lbl:'Uppercut'},
    {k:'bodyShot', lbl:'Body Shot'}
  ];
  c.innerHTML='';
  for(const d of defs){
    const data=S.striking[d.k];
    const pct=(data.xp/XP_LVL)*100;
    const row=document.createElement('div');
    row.className='strike-item';
    row.innerHTML=`
      <span class="s-name">${d.lbl}</span>
      <div class="s-prog">
        <div class="stars">${[1,2,3,4,5].map(i=>`<span class="star${i<=data.level?' lit':''}" >★</span>`).join('')}</div>
        <div class="xp-track"><div class="xp-fill" style="width:${pct}%"></div></div>
      </div>
      <span class="s-xp">${data.xp}/${XP_LVL}</span>`;
    c.appendChild(row);
  }
}

function rBody(){drawHeatmap();renderMList()}

function rCoach(){
  const g=el('coach-grid');if(!g)return;
  g.innerHTML='';
  for(const[id,c] of Object.entries(COACHES)){
    const on=S.coach.active===id;
    const card=document.createElement('button');
    card.className=`ccard${on?' on':''}`;
    card.onclick=()=>D({type:'SELECT_COACH',payload:{id}});
    card.innerHTML=`<div class="c-av">${c.av}</div><div class="c-name">${c.name}</div><div class="c-role">${c.role}</div>${on?'<span class="c-badge">● Lead</span>':''}`;
    g.appendChild(card);
  }
  const cid=S.coach.active,c=COACHES[cid];
  const ins=INSIGHTS[cid]||[];
  $t('ins-name',`${c.name.toUpperCase()} · ${c.role.toUpperCase()}`);
  $t('ins-msg',ins[S.coach.idx[cid]||0]||'...');
  const ic=el('insight-card');
  if(ic) ic.onclick=()=>D({type:'NEXT_INSIGHT',payload:{cid}});
}

// ── HEATMAP ───────────────────────────────────────────────────────────────────
let hmView='front';

function setView(v){
  hmView=v;
  el('vb-front').classList.toggle('on',v==='front');
  el('vb-back').classList.toggle('on',v==='back');
  drawHeatmap();renderMList();
}

function drawHeatmap(){
  const cv=el('heatmap-canvas');if(!cv)return;
  const ctx=cv.getContext('2d');
  const W=cv.width,H=cv.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(8,8,18,0.7)';
  ctx.fillRect(0,0,W,H);
  drawSilhouette(ctx,W,H);
  const mgroup=hmView==='front'?MF:MB;
  for(const m of mgroup){
    const ms=S.muscles[m.id]||{act:0,fat:0,rec:100};
    const col=muscleColor(ms);
    const alpha=0.12+(ms.act/100)*0.5+(ms.fat/100)*0.2;
    const cx=m.x*W,cy=m.y*H,rx=m.rx*W,ry=m.ry*H;
    const [r,g,b]=hexRgb(col);
    const grd=ctx.createRadialGradient(cx,cy,0,cx,cy,rx);
    grd.addColorStop(0,`rgba(${r},${g},${b},${Math.min(.85,alpha+.25)})`);
    grd.addColorStop(.6,`rgba(${r},${g},${b},${alpha})`);
    grd.addColorStop(1,`rgba(${r},${g},${b},0)`);
    ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);
    ctx.fillStyle=grd;ctx.fill();
    ctx.fillStyle=`rgba(${r},${g},${b},0.9)`;
    ctx.font='bold 9px -apple-system,sans-serif';
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(m.lbl,cx,cy);
  }
  ctx.fillStyle='rgba(255,255,255,0.12)';
  ctx.font='9px monospace';ctx.textAlign='right';ctx.textBaseline='top';
  ctx.fillText(hmView.toUpperCase(),W-8,8);
}

function drawSilhouette(ctx,W,H){
  const cx=W/2;
  ctx.strokeStyle='rgba(255,255,255,0.07)';
  ctx.lineWidth=1.5;
  ctx.fillStyle='rgba(255,255,255,0.02)';
  // head
  ctx.beginPath();ctx.ellipse(cx,H*.09,W*.07,H*.065,0,0,Math.PI*2);ctx.fill();ctx.stroke();
  // torso
  ctx.beginPath();
  ctx.moveTo(cx-W*.15,H*.16);ctx.lineTo(cx-W*.17,H*.47);
  ctx.lineTo(cx-W*.11,H*.47);ctx.lineTo(cx,H*.50);
  ctx.lineTo(cx+W*.11,H*.47);ctx.lineTo(cx+W*.17,H*.47);
  ctx.lineTo(cx+W*.15,H*.16);ctx.closePath();ctx.fill();ctx.stroke();
  // arms
  for(const s of[-1,1]){
    ctx.beginPath();
    ctx.moveTo(cx+s*W*.15,H*.18);
    ctx.quadraticCurveTo(cx+s*W*.25,H*.35,cx+s*W*.22,H*.50);
    ctx.quadraticCurveTo(cx+s*W*.20,H*.55,cx+s*W*.18,H*.50);
    ctx.quadraticCurveTo(cx+s*W*.19,H*.34,cx+s*W*.11,H*.18);
    ctx.closePath();ctx.fill();ctx.stroke();
  }
  // legs
  for(const s of[-1,1]){
    ctx.beginPath();
    ctx.moveTo(cx+s*W*.11,H*.47);
    ctx.quadraticCurveTo(cx+s*W*.13,H*.65,cx+s*W*.12,H*.88);
    ctx.quadraticCurveTo(cx+s*W*.08,H*.91,cx+s*W*.04,H*.88);
    ctx.quadraticCurveTo(cx+s*W*.04,H*.65,cx,H*.47);
    ctx.closePath();ctx.fill();ctx.stroke();
  }
}

function renderMList(){
  const list=el('m-list');if(!list)return;
  list.innerHTML='';
  const mgroup=hmView==='front'?MF:MB;
  for(const m of mgroup){
    const ms=S.muscles[m.id]||{act:0,fat:0,rec:100};
    const col=muscleColor(ms);
    const div=document.createElement('div');
    div.className='m-item';
    const val=ms.fat>ms.act?ms.fat+'%F':ms.act+'%A';
    div.innerHTML=`<span class="m-name">${m.lbl}</span><span class="m-pct" style="color:${col}">${val}</span>`;
    list.appendChild(div);
  }
}

// ── UTILS ─────────────────────────────────────────────────────────────────────
function el(id){return document.getElementById(id)}
function $t(id,v){const e=el(id);if(e)e.textContent=v}
function barW(id,pct){const e=el(id);if(e)e.style.width=clamp(pct,0,100)+'%'}

let _tt;
function toast(msg){
  const e=el('toast');if(!e)return;
  e.textContent=msg;e.classList.add('show');
  clearTimeout(_tt);_tt=setTimeout(()=>e.classList.remove('show'),2200);
}

function tab(name,idx){
  document.querySelectorAll('.tab').forEach(p=>p.classList.remove('on'));
  document.querySelectorAll('.nb').forEach(b=>b.classList.remove('on'));
  const p=el('t-'+name);if(p)p.classList.add('on');
  document.querySelectorAll('.nb')[idx]?.classList.add('on');
  el('content').scrollTop=0;
  if(name==='body')drawHeatmap();
}

// ── TIMERS ────────────────────────────────────────────────────────────────────
setInterval(()=>D({type:'MUSCLE_DECAY'}),DECAY_MS);
setInterval(()=>D({type:'NEXT_INSIGHT',payload:{cid:S.coach.active}}),8000);

// ── BOOT ─────────────────────────────────────────────────────────────────────
render();
</script>
</body>
</html>
