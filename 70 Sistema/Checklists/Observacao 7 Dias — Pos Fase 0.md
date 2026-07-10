---
dominio: jarvis
tipo: checklist
status: ativo
area: empresa
criado: 2026-06-30
atualizado: 2026-06-30
tags:
  - revisar
  - tema/ia
---

# 🔭 Plano de Observação — 7 Dias (pós Fase 0)

> [!success] Janela OFICIALMENTE iniciada — 2026-06-30
> Operador aprovou explicitamente o resultado da estabilização e deu a ordem de entrar em **Operational Mode**. Esta nota é, a partir de agora, o contrato vigente até 2026-07-06 (ou até o fechamento formal na seção final).

> [!info] Propósito
> A fundação foi endurecida (canon ratificado — [[_Spec JARVIS|Spec JARVIS]] / [PR #15](https://github.com/talesoftalles1-dev/tales-of-talles/pull/15), MERGED 2026-06-30 — e validação operacional rodada). Antes de avançar pra Fase 1 (Decision Engine) ou qualquer outra construção, **observe o sistema em uso real por 7 dias**. Esta janela não é passiva: é um instrumento de decisão — ela diz se o sistema está pronto pra mais complexidade ou se ainda precisa de mais endurecimento.
>
> **Objetivo único da semana:** provar que o JARVIS melhora a tomada de decisão diária em uso real. Nada além disso importa esta semana.

## 🔒 Regra principal — Operational Mode

> [!danger] O que NÃO fazer durante os 7 dias
> Nenhuma arquitetura nova. Nenhum agente novo. Nenhum contrato novo. Nenhuma camada arquitetural nova. Nenhuma integração nova (Ruflo permanece diferido). Nenhuma propriedade nova no `_Spec`. Nenhuma automação nova. **Não expandir escopo.** Só observar, registrar e corrigir o que quebrar (bug fix ≠ expansão).
>
> **Toda ideia nova vira `tipo: ideia` em [[20 Pessoal/Ideias|Ideias]]** (mecanismo que já existe no `_Spec` — não se cria backlog novo). **Nada sai do backlog pra execução nesta janela sem evidência concreta de necessidade** — não basta parecer útil, precisa ter aparecido como dor real no uso dos 7 dias.

## ✅ Critérios de sucesso da semana (definidos pelo Operador)

- [ ] Morning Brief entregue todos os dias (no `#daily`, não só gerado local).
- [ ] Critical Alerts funcionando.
- [ ] Nenhum vazamento de credenciais (ver achados de 2026-06-30 — já corrigido o primeiro).
- [ ] Dashboard utilizado diariamente (uso real, não só existir).
- [ ] Top 3 considerado útil pelo Operador.
- [ ] Menos ruído, mais decisão.

## 📋 Próxima prioridade operacional (ordem do Operador)

| # | Item | Dono | Status |
|---|---|---|---|
| 1 | Reconectar Slack no n8n (`enyo.cc`) | **Operador** (2 cliques, não automatizável) | 🔴 Pendente |
| 2 | Executar primeiro Morning Brief real no `#daily` | Sistema (automático às 09:00, assim que #1 resolver) | ⏳ Bloqueado por #1 |
| 3 | Confirmar recebimento da mensagem | **Eu** (tenho leitura no `#daily` via Slack, confirmado 2026-06-30 — só 1 post manual de 27/06 até agora) | ⏳ Bloqueado por #1 |
| 4 | Validar formato humano do briefing | **Eu** (mesma checagem do #3) | ⏳ Bloqueado por #1 |
| 5 | Iniciar coleta diária da observação de 7 dias | Ambos (tabela abaixo) | ✅ Iniciado hoje |
| 6 | Merge da PR #15 | ~~Operador~~ | ✅ **MERGED 2026-06-30** |
| 7 | Reexecutar validação operacional após o merge | Eu | ⏳ Vault root ainda não sincronizado com `main` (branch `reconcile/vault-merge-20260628`, working tree sujo, Obsidian aberto — sincronizar com segurança exige tree limpo; aguardando janela seguura, não forçado nesta sessão) |

## 🛑 Hold position (2026-06-30) — não fazer até um dos gatilhos

> [!danger] Proibido até Trigger A ou Trigger B
> Sincronizar a branch do vault ao vivo · rebase · merge de outras branches · tocar `graph.json` · tocar `workspace.json` · refatorar o Morning Brief · modificar a arquitetura do Dashboard · reexecutar validação contra estado obsoleto.

**Até:**
```text
Slack reconectado
E
Vault root seguro pra sync (working tree limpo + Obsidian fechado)
```

### Trigger A — Slack reconectado
Assim que confirmado, imediatamente:
1. Verificar entrega automática do Morning Brief.
2. Verificar formatação no `#daily`.
3. Verificar que não há posts duplicados.
4. Verificar que Critical Alerts continua isolado do Morning Brief (não devem se misturar num só canal/mensagem).
5. Registrar evidência operacional do Dia 1 (na tabela acima).

### Trigger B — Janela git segura (tree limpo + Obsidian fechado)
Assim que confirmado, imediatamente:
1. Sincronizar o vault ao vivo com o estado canônico (`main`, pós PR #15).
2. Reexecutar a [[Validacao Operacional JARVIS|Validação Operacional]].
3. Verificar que os artefatos da PR #15 resolveram corretamente no vault root.
4. Verificar integridade do `_master-index` (sem referências hífen remanescentes).
5. Registrar baseline pós-sync.

## 📌 Status atual

```text
Arquitetura: CONGELADA
Governança: CONGELADA
Desenvolvimento: PAUSADO
Operações: ATIVA
Janela de Observação: ATIVA
Próxima ação: AGUARDAR RECONEXÃO DO SLACK
```

Nenhuma mudança adicional recomendada até que uma das condições de gatilho ocorra.

## Checklist diário (2 minutos, todo dia)

Rode a seção **1–3** de [[Validacao Operacional JARVIS]] (scheduled tasks, dashboard, Morning Brief) e marque aqui:

| Dia | Data | EA rodou sozinho? | Brief gerou local? | Brief postou no #daily? | Dashboard ≤ 3 itens Hoje? | Algo quebrou? |
|---|---|:--:|:--:|:--:|:--:|---|
| 1 | 2026-06-30 | ✅ | ✅ | ❌ (Slack token morto, conhecido) | ✅ | — |
| 2 | 2026-07-01 | | | | | |
| 3 | 2026-07-02 | | | | | |
| 4 | 2026-07-03 | | | | | |
| 5 | 2026-07-04 | | | | | |
| 6 | 2026-07-05 | | | | | |
| 7 | 2026-07-06 | | | | | |

## Sinais a observar (qualitativo, não só checklist)

- [ ] **Uso real do Dashboard:** você abriu `🤖 JARVIS` de manhã pra decidir o dia, ou voltou a olhar listas soltas / memória? (é o teste de verdade do "Zero Anxiety")
- [ ] **Captura:** itens novos foram parar em `raw/inbox.md` (fluxo certo) ou direto nas pastas numeradas (fluxo antigo, ainda válido mas sinaliza hábito não migrado)?
- [ ] **Confiança na priorização:** alguma vez o score do `_Spec §8` sugeriu algo que pareceu errado? Se sim, anote o caso — é dado real pra calibrar a fórmula, não bug.
- [ ] **Carga cognitiva:** alguma seção do Dashboard cresceu a ponto de incomodar (mais de 3 em "Hoje", bloqueios acumulando sem ação)?
- [ ] **Slack reconnect:** você completou o passo manual (ver Validação Operacional §3)? Se sim, em qual dia — marque na tabela acima quando o Brief passar a postar.
- [ ] **PR #15 (ratificação do canon):** foi revisado/mergeado? Se sim, rode a validação de novo — alguns itens (link `_master-index`) devem se resolver sozinhos.

## Achados de segurança em aberto (decidir, não ignorar)

Os dois itens abaixo (de Validação Operacional §7) não bloqueiam uso diário, mas não devem ficar 7 dias sem decisão consciente:

- [ ] **Token do plugin `mcp-tools-istefox`** — decidir: manter staged (e aceitar que vai pro histórico do git) ou remover do tracking + adicionar ao `.gitignore`.
- [ ] **Claudian em `permissionMode: yolo`** — decidir conscientemente: manter (aceitando ações sem confirmação dentro do Obsidian) ou trocar pro modo com aprovação, alinhado ao `_Contrato de Autoridade dos Agentes`.

## No fim dos 7 dias

Releia esta nota inteira e responda:

1. **O sistema sobreviveu sozinho?** (scheduled tasks rodaram todo dia sem você precisar mexer)
2. **Você confiou nele?** (abriu o Dashboard em vez de procurar informação manualmente)
3. **Algo incomodou todo santo dia?** (isso é sinal mais forte que qualquer métrica — vira prioridade #1 antes de qualquer fase nova)

Se as respostas forem sim/sim/nada-grave → **Fase 0 está realmente fechada**, libera Fase 1 (Decision Engine) do [[_Roadmap JARVIS OS]]. Se não → o próximo trabalho é mais estabilização, não mais arquitetura.

> [!tip] Quando arquivar esta nota
> Ao final da janela, mude `status` para `arquivado` e linke o resultado em [[_Roadmap JARVIS OS]] como nota de fechamento da Fase 0.
