---
tipo: doc
area: empresa
atualizado: 2026-07-10
agente: E9 · BOBBY (Comercial)
janela: Plano do dia
fonte: Yalt Sales CRM (chave válida)
---

# BOBBY · Comercial — Plano do dia (2026-07-10)

Chave do CRM ativa. Dados puxados de `stats/leads` + varredura completa dos estágios ativos.

## 1. Funil (FATO)

| Estágio | Leads |
|---|---|
| new (scrapper, não trabalhado) | 308.025 |
| inadequate | 7.373 |
| **approaching** | **148** |
| **to-prospect** | **77** |
| **later** | **35** |
| **negociation** | **10** |
| **send-proposal** | **2** |
| closed (ganhos) | 4 |
| lost | 104 |
| **Total base** | **315.778** |

**Pipeline real (qualificado, sem `new`/`inadequate`): 272 leads ativos.** Valor total registado no CRM: €1.692,5 · valor qualificado: €695. → *Praticamente nenhum lead tem valor de negócio preenchido.*

## 2. Follow-ups vencidos (FATO)

**110 dos 111 follow-ups agendados estão vencidos. 0 marcados para hoje.** Distribuição do atraso por estágio:

- approaching: 71 vencidos
- later: 21
- to-prospect: 10
- negociation: 7
- send-proposal: 1

### Prioridade máxima — negociação & proposta (12 leads mais quentes)

| Lead | Estágio | Últ. contacto | Follow-up | Atraso | Contacto |
|---|---|---|---|---|---|
| **LADY BABKA** | send-proposal | 25/06 | 26/06 | **14d** | Mariana Aguilar |
| Bottega Ibérica | send-proposal | 18/06 | 27/07 | *futuro (ok)* | Jaime |
| PGL Alimentar | negociation | 12/02 | 09/03 | **123d** | Adm |
| Supermercado Horizonte | negociation | nunca | 09/03 | 123d | sem contacto |
| Fogo de Chão | negociation | nunca | 09/03 | 123d | sem contacto |
| I love nicolau | negociation | 13/03 | 09/04 | 92d | Maria Xavier · **EV €196** |
| Pilcore.com | negociation | 15/04 | 15/04 | 86d | Jonas Gomez (prio. low) |
| made in brazil | negociation | 06/07 | 16/04 | FU desatualizado | — |
| XMI | negociation | 25/06 | 22/04 | FU desatualizado | Mahalia Miranda |
| Nicola | negociation | nunca | — | sem FU | Equipe comercial |
| Natas | negociation | 18/06 | — | sem FU | Cristina Roque |
| Leitaria Quinta do Paço | negociation | 06/07 | — | sem FU | sem contacto |

*(contactos/telefones/emails completos no CRM)*

## 3. Top oportunidades (FATO + RECOMENDAÇÃO)

Como o campo `salesData` só traz enriquecimento (site, redes, decisor, fornecedor atual) e **apenas 2 leads têm valor estimado**, o ranking é por estágio, não por valor:

1. **LADY BABKA** (send-proposal) — proposta na mão, follow-up caiu há 14 dias. **Maior probabilidade de fecho.**
2. **Edicare** (later) — **EV €800**, o maior valor único do funil, mas parado há 100 dias.
3. **I love nicolau** (negociation) — EV €196, 92 dias sem mexer.
4. **Bottega Ibérica** (send-proposal) — follow-up agendado 27/07, único no prazo. Manter.
5. **PGL Alimentar** (negociation) — último toque em Fevereiro; reaquecer ou marcar como perdido.

## 4. Riscos (RECOMENDAÇÃO)

- **7 negociações efetivamente frias** (>80 dias sem avanço): PGL Alimentar, I love nicolau, Pilcore, + as de follow-up vencido. Risco alto de morte por inércia.
- **Sujeira de dados:** "Supermercado Horizonte" e "Fogo de Chão" estão em *negociation* mas **nunca foram contactados e não têm telefone/email** — provável classificação errada. Verificar ou rebaixar.
- **Follow-up desatualizado:** "made in brazil" (últ. 06/07) e "XMI" (últ. 25/06) foram tocados há pouco mas mantêm data de follow-up antiga — corrigir para não sumirem da fila.
- **71 leads em `approaching` com follow-up vencido** — funil médio a esfriar em bloco.

## 5. Plano do dia (RECOMENDAÇÃO)

1. **Fechar o loop da LADY BABKA** — proposta enviada, 14 dias de silêncio. Ação de maior retorno hoje.
2. **Decidir Edicare (€800)** — reviver com nova proposta ou arquivar; 100 dias parado não pode ficar em aberto.
3. **Reaquecer 3 negociações** (I love nicolau, PGL Alimentar, Pilcore) com 1 mensagem curta cada.
4. **Higiene:** verificar Horizonte/Fogo de Chão; atualizar follow-up de made in brazil e XMI.
5. **Bloco de prospeção** para escoar os 71 `approaching` vencidos (batch, não 1-a-1).

---
_FATO = dados do CRM. RECOMENDAÇÃO = leitura do BOBBY. Nenhum outreach externo enviado — mensagens sugeridas ficam para aprovação do Operador (Talles)._
