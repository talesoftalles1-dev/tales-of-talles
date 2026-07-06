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
  - "[[Ponte n8n ↔ JARVIS]]"
tags:
  - tema/ia
  - tema/lideranca
---

# 🔍 Auditoria TALLES OS — Relatório Priorizado

> [!warning] Natureza deste documento
> Mora em `output/` → é **regenerável**, não é fonte da verdade. As correções aprovadas devem nascer em `wiki/` ou nos docs canônicos de `70 Sistema/`, nunca aqui.

> [!jarvis] Veredito em uma frase
> Não existe **um** "TALES OF TALLES OS" para consolidar — existem **dois sistemas saudáveis e distintos** que partilham pessoa e ferramentas. O JARVIS (vault) já está mais arquitetado do que a missão presume. O maior valor agora **não** é inventar arquitetura nova (a missão proíbe isso) — é **remover drift, resolver ambiguidades de fonte-da-verdade e definir como os dois sistemas se relacionam.**

---

## 0. Escopo e honestidade de método

| O que pude auditar | O que **não** pude |
|---|---|
| As 2 pastas conectadas: vault **Jarvis** e **TALES OF TALLES — IDENTITY OS** | O "repositório GitHub" da missão — **não há git legível** aqui (a `.git` da pasta não abre como repo; provável placeholder cloud-only do OneDrive) |
| Conteúdo de specs, contratos, automação Morning Brief (código real), HTMLs do app, docs n8n | O interior dos workflows n8n (vivem em 2 instâncias cloud — só tenho a documentação local sobre eles) |
| Drift, redundância, segredos em repouso, lacunas estruturais | Estado real de execução das automações (logs locais sugerem, não confirmam) |

A missão pede 12 secções de "consolidação enterprise". A realidade conectada não comporta isso sem **inventar** assets — então este relatório é **priorizado e factual**: audita o que existe e ranqueia o que mexer.

---

## 1. Mapa de arquitetura — dois sistemas, não um

```text
                        TALLES (Operador)
                              │
        ┌─────────────────────┴─────────────────────┐
        ▼                                             ▼
  ████ JARVIS — Vida & Empresa OS ████        ████ IDENTITY OS — App de Luta ████
  Obsidian (vault local, PT-BR)                PWA single-file (HTML)
  4 camadas: Memória·Operação·Cognição·UI      Camp Day, Arsenal, Coaches, Heatmap
  Agentes: EA, TOR, BOBBY, KNOWLEDGE…          tales-of-talles_FINAL.html (atual)
  Automação: Morning Brief (Node local)        Persistência: localStorage (IndexedDB = aspiração)
  └── n8n: n8n.enyo.cc (Yalt, ~42 workflows)   └── n8n: talesoftalles.app.n8n.cloud (4 coaches + Vision + Notion)
```

**Conclusão estrutural:** são produtos diferentes que **compartilham toolchain** (n8n, Claude, Notion, Slack) — não uma arquitetura única. Forçá-los a "um sistema" violaria a própria regra da missão ("não criar sistemas paralelos / preferir consolidação"). A relação correta está no item **§3.H3**.

---

## 2. Mapa de dependências (o que sustenta o quê)

**JARVIS:** `_Spec JARVIS` (§8 prioridade) é a raiz — dele dependem Dashboard, Daily Brief, Morning Brief (`lib/priority.mjs`), e todos os agentes. `_Contrato de Autoridade` + `_Taxonomia de Eventos` = "Constituição Operacional", da qual depende o roteamento do Event Bus e do `#daily`. **Cadeia limpa, sem ciclos.**

**Ponto frágil:** o Morning Brief real (`generate.mjs`) depende do `config.json` (segredos) e do caminho do vault no OneDrive — quebra silenciosa se o OneDrive dessincronizar (já previsto nos modos de falha, bom).

**IDENTITY OS:** o app depende dos webhooks em `talesoftalles.app.n8n.cloud` para os coaches, com **fallback local** se o n8n cair (excelente — nunca fica em branco). Dependência pendente: webhook `tales-notion-sync` ainda por ligar.

---

## 3. Redundâncias, drift e fontes da verdade

### 🔴 Cluster "Brief" — a maior dívida do vault

Há **6 documentos** girando em torno do mesmo tema, e **dois deles se contradizem**:

| Documento | Papel | Veredito |
|---|---|---|
| `_Daily Brief (Canônico)` | Estrutura das secções | ✅ Manter — é o contrato |
| `_Canal Daily (Contrato)` | Regras do canal `#daily` | ✅ Manter — complementar |
| `_Daily Brief — Revisão` | Registro de decisão (P3) | ✅ Manter como histórico |
| `Automacao/_Morning Brief — Spec` | Pipeline real (`generate.mjs`) | ✅ **Esta é a spec verdadeira** |
| `Automacao/_Morning Brief — Runbook` | Operação | ✅ Manter |
| **`Specs/Morning Brief.md`** | Spec antiga | 🔴 **CONFLITANTE — depreciar** |

> [!danger] Dois contratos para a mesma automação
> `Specs/Morning Brief.md` descreve uma implementação que **não existe**: caminho `70 Sistema/Automation/morning_brief.js` (pasta "Automation" em inglês, inexistente), cron **07:00**, canal **#daily-test**, fila de retry em `output/morning_brief/pending/`, injeção de bloco no Dashboard via comentários HTML. A realidade (`Automacao/morning-brief/generate.mjs`) roda **09:00** via Task Scheduler, grava `output/YYYY-MM-DD-morning-brief.txt`, sem fila de retry. Quem seguir o doc errado constrói a coisa errada.

**Drift de terminologia menor:** "Daily Brief" e "Morning Brief" são usados como sinónimos. Fixar **um** termo de superfície ("Morning Brief" = a entrega; "Daily Brief" = a estrutura) e dizê-lo num índice.

### Tabela de Fontes da Verdade

| Domínio | Canônico | Apoio | Depreciar |
|---|---|---|---|
| Arquitetura do vault | `_Spec JARVIS` | `_Arquitetura JARVIS` | — |
| Governança de agentes | `_Contrato de Autoridade` + `_Taxonomia de Eventos` | `Agentes JARVIS` | — |
| Morning Brief | `Automacao/_Morning Brief — Spec` + código | Runbook | **`Specs/Morning Brief.md`** |
| App de luta | `tales-of-talles_FINAL.html` | `PATCH_MODO_HOJE`, `GUIA_LIGACOES_n8n` | `tales-of-talles.html` (legacy), `.bak` |

---

## 4. Auditoria de agentes (resumo)

O modelo de agentes é **forte**: cada persona tem Propósito·Pode·Não pode·Inputs·Outputs·Escalonamento, com matriz de 5 verbos e *default deny*. Sem sobreposição de responsabilidade — exatamente o que a missão pede, **já feito.**

**Única lacuna:** o roster lista 9 personas, mas operacionais de facto são ~2 (BOBBY no n8n, EA como loop principal) — já reconhecido no Arsenal (gatilho Ruflo). Recomendação: marcar **status operacional** por agente (`operacional` / `chapéu manual` / `planejado`) para a realidade não divergir do papel.

---

## 5. Conectores / MCP / n8n

**Duas instâncias n8n, sem inventário unificado:**

| Instância | Dono | Conteúdo | Risco |
|---|---|---|---|
| `n8n.enyo.cc` | Yalt (produção) | ~42 workflows, SDR 307K leads, Cloudbeds | Não tocar — regra aditiva já fixada ✅ |
| `talesoftalles.app.n8n.cloud` | Pessoal (app) | 4 coaches + Vision + Sync Notion | Saudável; chave Anthropic centralizada no n8n ✅ |

Positivo: o app **deixou de chamar a Anthropic do telemóvel** → chave agora vive só no n8n (Vision/coaches). Boa postura de segurança. Falta: documentar a 2ª instância no Arsenal/Ponte (hoje só a Yalt está mapeada).

---

## 6. Segurança

| Item | Severidade | Nota |
|---|---|---|
| `morning-brief/config.json` com `slackBotToken` + webhooks em texto plano, dentro do vault sincronizado no OneDrive | 🟠 Média | **Está gitignored** (não vaza p/ GitHub) ✅. Mas é segredo em repouso na cloud. Mover p/ variáveis de ambiente / credential store, ou confirmar que a pasta OneDrive não é partilhada. |
| Chave Anthropic no n8n (não no cliente) | 🟢 OK | Postura correta. |
| Cláusula de imutabilidade (só Operador altera Constituição/Contrato/Spec) | 🟢 OK | Excelente governança. |

---

## 7. Auditoria do Identity OS (app)

- 🔴 **Ambiguidade de arquivo canônico** (o anti-padrão documentado, a morder): as instruções do projeto nomeiam `tales-of-talles_2.html` em `/mnt/project/` como verdade — **esse arquivo não existe** na pasta conectada. O que existe é `tales-of-talles_FINAL.html` (452KB, 7767 linhas, atual), `tales-of-talles.html` (252KB, legacy) e um `.bak`. **Resolver qual é a verdade antes de qualquer edição.**
- 🟡 **Gap arquitetura vs realidade** (conhecido, não é bug): `_FINAL.html` tem ~20 referências a `localStorage` vs ~9 a IndexedDB e 1 menção a SharedWorker. O mandato (event sourcing + IndexedDB + SharedWorker + reducer puro) continua **aspiracional**. Tratar como roadmap, não emergência.
- 🟡 **Patch pendente:** `Modo "Hoje"` + ativação do `Sync Notion` (`/webhook/tales-notion-sync`) revisados mas **não aplicados** — à espera de validação `node --check`.
- `AGENTS.md` do app está praticamente vazio (só cabeçalho).

---

## 8. 🎯 Matriz de Prioridade

> Cada item responde: **muda uma decisão / destrava trabalho / fecha um risco?** Senão, é ruído.

### 🔴 Crítico (fazer primeiro — fonte-da-verdade em risco)

| # | Ação | Porquê | Esforço |
|---|---|---|---|
| C1 | **Resolver o arquivo canônico do app**: confirmar `_FINAL.html` como verdade, alinhar as instruções do projeto (que citam `_2.html`), arquivar legacy + `.bak` | Edições futuras podem cair no arquivo errado — o anti-padrão que já causou retrabalho | Baixo |
| C2 | **Depreciar `Specs/Morning Brief.md`** e apontar tudo para `Automacao/_Morning Brief — Spec` | Dois contratos conflitantes para a mesma automação | Baixo |

### 🟠 Alto impacto

| # | Ação | Porquê | Esforço |
|---|---|---|---|
| H1 | Tirar segredos do `config.json` → env vars / credential store (ou confirmar OneDrive privado) | Segredo em repouso na cloud | Baixo |
| H2 | Criar **1 índice do subsistema Brief** + fixar terminologia (Morning=entrega, Daily=estrutura) | 6 docs sem hub, "Daily/Morning" ambíguo | Baixo |
| H3 | **Definir a relação dos 2 sistemas**: registar o Identity OS como `projeto`/área no vault, ligado ao agente HEALTH + Diário do Camp — **sem fundir código** | A missão pede "um sistema"; a forma correta é JARVIS como guarda-chuva, app como projeto rastreado | Médio |

### 🟡 Médio impacto

| # | Ação | Porquê |
|---|---|---|
| M1 | Higiene do root do vault: processar/remover `.md` de 0 bytes, canvas/base "Sem título", `.m4a`, `debug-*.log` | Ruído contra o próprio contrato `raw→wiki→output` |
| M2 | Concluir o patch do app (Modo Hoje + ligar `tales-notion-sync`) com validação | Trabalho já 90% pronto |
| M3 | Marcar status operacional por agente (operacional/manual/planejado) | Papel ≠ realidade |
| M4 | Documentar a 2ª instância n8n (app) no Arsenal/Ponte | Inventário só cobre a Yalt |

### 🟢 Nice to have / futuro

| # | Ação | Nota |
|---|---|---|
| N1 | Ativar o Path 1 (Critical Alerts → #daily) | Já construído, inativo |
| N2 | Espelhar o Morning Brief no `#daily` | Depende da ponte n8n |
| N3 | Migração localStorage → IndexedDB/event-sourcing no app | Roadmap longo, não bug |
| N4 | Confirmar versionamento git real de ambos | Não verificável aqui |

---

## 9. Roadmap de execução (4 micro-sprints)

> Disciplina existente: **um foco por ciclo, validado antes de avançar.** Mantido.

- **Sprint 1 — Fonte da verdade** (C1, C2): resolver arquivo canônico do app + depreciar spec conflitante. *Risco: nenhum. Impacto: elimina retrabalho.*
- **Sprint 2 — Higiene & segurança** (H1, H2, M1): segredos fora do config, índice do Brief, limpar root. *Risco: baixo.*
- **Sprint 3 — Relação dos sistemas** (H3, M3, M4): Identity OS como projeto no vault ligado ao HEALTH; status dos agentes; 2ª n8n documentada. *Risco: baixo; só docs.*
- **Sprint 4 — Entrega** (M2, N1, N2): concluir patch do app + ativar Critical Alerts + espelhar brief no `#daily`. *Risco: médio — toca automação; validar isolado, regra aditiva.*

---

## 10. O que **não** fazer (anti-recomendações)

1. **Não fundir** os dois codebases num "OS único". São produtos distintos; a partilha de toolchain já é a integração.
2. **Não criar** novos frameworks/pastas/vaults — a fundação JARVIS basta (regra "congelado" já no `_Arquitetura`).
3. **Não migrar** o app para IndexedDB no meio do polimento visual — é roadmap, não bug.
4. **Não tocar** nos ~42 workflows da produção Yalt — regra aditiva sagrada.
