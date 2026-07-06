---
dominio: jarvis
tipo: doc
status: publicado
categoria: sistema
criado: 2026-06-27
atualizado: 2026-06-27
relacionado:
  - "[[🤖 JARVIS]]"
  - "[[_Morning Brief — Spec]]"
tags:
  - tema/ia
---

# 🎨 UX Decision Log — Dashboard Decision-First

> Registro de mudanças visuais com **justificativa cognitiva**. Rejeita alterações cosméticas.

## Before / After — Rationale

| Antes | Depois | Por quê |
|---|---|---|
| 4 seções visíveis incluindo "Mudou desde ontem" | 4 seções decisórias: Top 3 · Riscos · Comercial · Hoje | "Mudou" é delta informacional — útil, mas não muda ação imediata; desceu para colapsado |
| Comercial só em painel colapsado | Comercial na superfície | Sinais de receita precisam ser visíveis sem navegação (critério #7) |
| Estatísticas com números grandes em ciano | Métricas muted + colapsadas | Números grandes puxam atenção para inventário, não decisão |
| Headings uniformes | Tier 1 com borda/color por prioridade | Hierarquia visual = hierarquia de decisão (P1–P4) |
| Tasks com spacing padrão | Tasks maiores na superfície | Top 3 legível em <3s (critério #5) |

## Decisões detalhadas

### 1. `.jarvis-brief-surface` wrapper
- **O que:** div envolvendo as 4 seções de decisão.
- **Por quê:** permite CSS escopado sem afetar MOCs/outras notas.
- **TTD:** estilos de scan aplicados só onde importa.

### 2. Headings h2 com cor por tier
- **O que:** Top 3 ciano, Riscos âmbar, Comercial verde, Hoje neutro.
- **Por quê:** codifica Prioridades 1–4 do directive sem ler texto.
- **TTD:** olho encontra risco em <5s pelo âmbar.

### 3. Callouts `[!jarvis]` compactos na superfície
- **O que:** padding reduzido, título uppercase pequeno.
- **Por quê:** callouts originais eram banners grandes — competiam com tarefas.
- **TTD:** mais linhas de ação visíveis above-the-fold.

### 4. `.jarvis-metrics-muted`
- **O que:** opacidade 0.65, números menores, sem hover glow.
- **Por quê:** estatísticas são referência, não gatilho de ação.
- **TTD:** elimina distração magnética dos números grandes.

### 5. `.jarvis-secondary` com borda tracejada
- **O que:** separa captura/navegação da superfície de decisão.
- **Por quê:** captura é operação, não briefing.
- **TTD:** fronteira clara entre "ler" e "fazer".

### 6. Projects → colapsado "🏗 Projects Requiring Attention"
- **O que:** ranking por score §8 saiu da superfície.
- **Por quê:** Morning Brief Slack inclui top 3 projetos; dashboard prioriza ações táticas (tarefas).
- **TTD:** projetos acessíveis em 1 clique, zero scroll na abertura.

## O que NÃO mudou (por design)

- Contratos de governança, taxonomia, score §8
- Queries Dataview — mesma lógica, nova disposição
- Paleta de marca (`_Spec JARVIS` §7)
- Path 1 n8n Critical Alerts

## 2026-07-06 — Transformação OS (higiene visual do HUD v2)

| Antes | Depois | Por quê |
|---|---|---|
| `jarvis-high-fidelity.css` redefinia `--jarvis-*` em `:root` | Tokens escopados a `.jarvis-dashboard-v2`/`.jarvis-hud-container` | O neon emerald vazava para o vault inteiro e tornava falsa a paleta ciano documentada (`_Spec` §7). Agora: neon só no HUD, ciano no resto — as docs voltam a ser verdade |
| HUD com telemetria decorativa ("Deploy do PWA concluído", conexões Notion/Stripe, cargas %) | Cards e integrações refletem estado real ([[agent_roster]]) | Dashboard que mente vira ruído; regra nova: **nenhum status fake no HUD** |
| Rótulos de UI em inglês (Channels, Core Agents, System Vitals…) | PT-BR (Canais, Agentes, Vitais do Sistema…) | Padrão de idioma do vault |
| Vitais com fallback inventado (`readiness : 85`) | "— (sem registro)" quando não há dado | Honestidade de dados > estética |
| `jarvis-performance.css` com `td:contains()` (jQuery, inválido) | Classe `.jarvis-metric-hot` documentada | A regra era ignorada silenciosamente pelo navegador |

> **Pendente do Operador:** `baseFontSize: 23` em `appearance.json` vs 16px recomendado em [[🎨 Tema e Visual]] §5 — preferência de leitura, não defeito; decidir e alinhar doc ou config.

## Verificação

| Critério | Como validar |
|---|---|
| Top 3 em <3s | Abrir Dashboard — primeiras 3 checkboxes visíveis sem scroll |
| Riscos em <5s | Heading âmbar + tabela bloqueios above-the-fold |
| Comercial sem navegação | Tabela CRM na superfície |
| Histórico colapsado | "🗂️ Tudo o resto" fechado por default (`[!note]-`) |
