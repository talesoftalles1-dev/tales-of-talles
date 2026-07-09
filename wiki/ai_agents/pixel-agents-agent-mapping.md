---
dominio: jarvis
tipo: sistema
status: ativo
criado: 2026-06-27
atualizado: 2026-07-08
relacionado:
  - "[[_master_index]]"
  - "[[_Contrato de Autoridade dos Agentes]]"
  - "[[protocolo_orquestracao_jarvis]]"
  - "[[estagiarios]]"
tags:
  - tema/ia
---

# Mapeamento Canônico — Pixel Agents

Documento de autoridade para mapear agentes do JARVIS para slots do painel Pixel Agents. Mantenha este arquivo como referência única para nomes, assentos e áreas.

## Resultado Operacional

- PR (Vault/Tales-of-Talles): https://github.com/talesoftalles1-dev/tales-of-talles/pull/30
- Status: merged em `main` em `2026-07-08`
- Layout local referenciado: `~/.pixel-agents/layout.json`
- Config local referenciado: `~/.pixel-agents/config.json`

## Mapa de Agentes (roster canônico)

| Vault / Função | Codinome / Nome Interno | Exibição / Nome | Slot |
|---|---|---|---|
| Executive Assistant (EA) | EA | EA | MAIN |
| Programação | TOR | TOR | MAIN |
| Comercial | BOBBY | BOB | BIN |
| Pesquisa | RES | RES | MAIN |
| Documentação / Escrita | WRI / WRITING | WRI | MAIN |
| Organização | ORG | ORG | PAN |
| Revisão | REV | REV | DEV |
| Automações | AUT / AUTOMATOR | AUT | DEV |
| Conhecimento | KNL / KNOWLEDGE | KNL | DEV |
| Planejamento | PLN / PLANNER | PLN | DEV |
| Comercial (linha/suporte) | BOB | BOB | BIN |
| Mascote (não operacional) | Ernys | Ernys | <auto> |

## Regras de Mapeamento

- Nome exibido no painel = nome interno canônico.
- Mantenha `<auto>` para atribuição dinâmica de assentos.
- Não sobrescreva agentes reais; use seeding baseado em vault.
