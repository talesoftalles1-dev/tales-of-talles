---
dominio: jarvis
tipo: agent
status: canonico
titulo: Pixel Agents — Mapeamento de Agentes do Vault para o Painel
area: sistema
criado: 2026-07-08
atualizado: 2026-07-08
relacionado:
  - "[[_Contrato de Autoridade dos Agentes]]"
  - "[[protocolo_orquestracao_jarvis]]"
  - "[[estagiarios]]"
  - "[[agent_roster]]"
  - "[[executive_assistant]]"
tags:
  - pixel-agents
  - integracao
---

# Pixel Agents — Mapeamento do Vault para o Painel

> Este documento é a única fonte da verdade para mapear identidades, personagens, papéis e cargas do JARVIS para o painel Pixel Agents.
> Alterou identidade, status operacional ou relação entre agente? Atualize primeiro aqui; depois importe/sincronize para o painel.

## Regras de mapeamento

- **Um agente ≠ uma sala obrigatória.** O painel deve refletir ocupação, não imposição.
- **Personagem humano:** só se houver assinatura canônica do agente no vault. Caso contrário, usa sprite genérica.
- **Codinome canônico prevalece sobre rótulo curto.** Ex.: `TOR`, `WRI`, `RES`.
- **Ernys** é um personagem alternativo do proprio JARVIS, nao um agente, podendo aparecer em toys, mascote ou easter egg.
- **Mouse** acompanhará o que estiver na tela, não ficar preso.
- **Oficina exclusiva dos coelhos.** Separe layout de oficina com itens de fabrica.
- Não duplicar agentes: se estiver em um arranjo, usar o mesmo.

## Status operacional ↔ estado visual no painel

| Status canônico               | Visual no painel          |
|-------------------------------|---------------------------|
| 🟢 **ativo**                  | Senta e digita/pesquisa   |
| 🟡 **sob demanda** / idle     | Em pé, esperando instrução |
| 🔴 **degradado**              | Em pé, sobreaviso         |
| ⚪ **offline/standby**        | Fora da tela / oculto     |
| 🔵 **exclusivo EA**           | Sentado na mesa principal |

## Identidades canônicas e mapeamento painel

| Agente     | Codinome | Tipo           | Status     | Personagem | Espécie/Estilo         | Visual |
|------------|----------|----------------|------------|------------|------------------------|--------|
| EA         | `EA`     | Orchestrator   | Ativo      | Jarvis     | Ambígua                | Robo/Pessoa, monocromatico |
| TOR        | `TOR`    | Programação    | Sob demanda| TOR        | Raposa, designer       | Raposa, estilizada |
| BOBBY      | `BOBBY`  | CRM / Comercial| Inspector  | Bobby      | Cachorro, mais oreia   | Cachorro, estilizado |
| RESEARCH    | `RES`   | Pesquisa       | Sob demanda| Researcher | Ambiente                | Estilizada, link para ambiente |
| WRITING     | `WRI`   | Documentação   | Sob demanda| Writer     | Lupa / folha           | Estilizada, link para texto |
| E1 · ORGANIZER | `ORG`  | Organização    | Standby    | Organizer  | Estrutura/localidade   | Estilizada, link para localidade |
| E2 · WRITING | `WRI`   | Documentação  | Standby    | Writer     | Lupa / folha           | Estilizada, link para texto |
| E3 · RESEARCH | `RES`  | Pesquisa       | Standby    | Researcher | Ambiente                | Estilizada, link para ambiente |
| E4 · TOR   | `TOR`    | Programação    | Standby    | DevFox     | Raposa, designer       | Raposa, estilizada |
| E5 · REVIEWER | `REV` | Revisão        | Standby    | Reviewer   | Olhos / cheque         | Estilizada, link para checklist |
| E6 · AUTOMATOR | `AUT` | Automações     | Standby    | Automator  | Engrenagem             | Estilizada, link para fluxo |
| E7 · KNOWLEDGE | `KNL` | Conhecimento   | Standby    | Keeper     | Livro/base             | Estilizada, link para wiki |
| E8 · PLANNER | `PLN` | Planejamento   | Standby    | Planner    | Diagrama/mapa           | Estilizada, link para plano |
| E9 · BOBBY  | `BOB`    | Comercial      | Standby    | BobbyDog   | Cachorro, mais oreia   | Cachorro, estilizado |

## Células de ocupação

### Mesa principal
| Assento | Código | Agente/Personagem | Função | Carga |
|---------|--------|-------------------|--------|-------|
| 1       | `EA`   | Exec. Assistant   | Co piloto do JARVIS | 100% |
| 2       | `DEV`  | TOR/WRI           | Persistente na tela | 40% |

### Mesa secudária
| Assento | Código | Agente/Personagem | Função | Carga |
|---------|--------|-------------------|--------|-------|
| 1       | `DEV`  | TOR/WRI           | Codificacao        | 40% |
| 2       | `OFF`  |                   | Ajustes na tela    | 40% |
| 3       | `PLA`  | Planner           | Planejamento       | 30% |
| 4       | `RES`  | RES               | Pesquisa           | 30% |

### Desktops
| Item               | Código  | Função                   |
|--------------------|---------|--------------------------|
| Desktop principal  | `DEV`  | Area de trabalho principal |
| Desktop secundária | `MAIN` | Controle do JARVIS        |

### Posicoes, planejamento, pesquisa
| Posicao | Código | Função |
|---------|--------|--------|
| Painel outlook | `PAN` | Planejamento |
| Geral | `GEN` | Pesquisa flexivel |

### Oficina
| Item                   | Código  | Função           |
|------------------------|---------|------------------|
| Mesa principal         | `TBL`  | Mesa de trabalho  |
| Estacap de ferramentas | `TOO`  | Ferramentas       |
| Lixeira                | `BIN`  | Exclusao          |

### Espaco reserva
| Código | Função |
|--------|--------|
| `R1`/`R2`/`R3`/`R4`/`R5` | Espaco reserva |

## Apelidos amigáveis
| Codinome | Apelido     |
|----------|------------|
| `EA`     | JARVIS     |
| `TOR`    | DEV        |
| `BOBBY`  | —          |
| `RES`    | —          |
| `WRI`    | —          |
| `AUT`    | —          |
| `KNL`    | —          |
| `PLN`    | —          |

## Pancartas na cabeca dos personagens
- Atalho para tela `11`
- Atalho para page `7`
- Avanço de tela `N`

## Manutencao
- Este documento sempre tem precedencia sobre outros arquivos ao sincronizar para o Painel Pixel Agents.
- Quando surgir conflito entre `teamConfig.json` e este documento, considere o documento e reconcilie o JSON como subproduto.
- Atualize após qualquer mudanca de: autoridade, padrao visual, orquestracao, ou inventario de Estagiarios.
