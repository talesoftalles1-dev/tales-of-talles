---
dominio: jarvis
tipo: output
status: gerado
titulo: Mapa de Agentes — JARVIS OS
criado: 2026-07-07
atualizado: 2026-07-07
relacionado:
  - "[[_Contrato de Autoridade dos Agentes]]"
  - "[[estagiarios]]"
  - "[[agent_roster]]"
  - "[[_master_index]]"
tags:
  - tema/ia
---

# 🤖 Mapa de Agentes — JARVIS OS (2026-07-07)

> Compilação regenerável. Autoridade vinculante: [[_Contrato de Autoridade dos Agentes]] · execução: [[estagiarios]] · estado vivo: [[agent_roster]].

## Estrutura de comando

```
Operador (Talles) — decisões estratégicas, capital, comunicação externa, canon
  └─ Jarvis / Executive Assistant — orquestra, prioriza (§8), NUNCA executa domínio
       └─ Especialistas de domínio — executam no domínio, NUNCA priorizam entre domínios
            └─ Estagiários E1–E9 — subagentes spawnáveis (.claude/agents/), herdam a autoridade da linha
```

Conflito resolve: Especialista → Executive Assistant → Operador. Default deny: o que não está permitido exige aprovação humana.

## Matriz resumida (✅ autônomo · ⚠️ com aprovação · ❌ proibido)

| Agente | Criar | Editar | Priorizar | Executar | Arquivar | Estado real |
|---|:--:|:--:|:--:|:--:|:--:|---|
| **EA / Jarvis** | ✅ | ✅ | ✅ | ❌ | ⚠️ | 🟢 dashboard diário 07:00 |
| **TOR** (dev) | ✅ | ✅ | ❌¹ | ⚠️² | ✅ | 🔵 sob demanda (E4) |
| **BOBBY** (comercial) | ✅ | ✅ | ✅³ | ⚠️⁴ | ✅ | 🟡 degradado — n8n pessoal congelado; skill `yalt-crm` viva |
| **RESEARCH** | ✅ | ✅ | ❌ | ✅⁵ | ⚠️ | ⚪ sob demanda (E3) |
| **WRITING** | ✅ | ✅ | ❌ | ⚠️⁶ | ❌ | ⚪ sob demanda (E2) |
| **FINANCE** | ✅ | ✅ | ❌ | ❌⁷ | ⚠️ | ⚪ sob demanda |
| **CALENDAR** | ⚠️ | ⚠️ | ❌ | ⚠️ | ✅ | ⚪ sob demanda |
| **KNOWLEDGE** | ✅ | ✅ | ❌ | ✅⁵ | ⚠️ | ⚪ sob demanda (E7) |
| **HEALTH** | ✅ | ✅ | ❌ | ❌ | ⚠️ | ⚪ sob demanda |

¹ ordena backlog técnico, não objetivos de negócio · ² testes ✅, deploy ⚠️ · ³ só pipeline comercial · ⁴ rascunho ✅, envio ⚠️ · ⁵ leitura/pesquisa/Wiki · ⁶ rascunho ✅, publicar ⚠️ · ⁷ **nunca move dinheiro** — só registra.

## Estagiários (camada de execução — todos ⚪ standby, 9 arquivos funcionais confirmados)

| # | Codinome | Linha de autoridade | Ratificação |
|---|---|---|---|
| E1 | ORGANIZER | deriva do EA (triagem) | vinculado |
| E2 | WRITING | linha WRITING | vinculado |
| E3 | RESEARCH | linha RESEARCH | vinculado |
| E4 | TOR | linha TOR | vinculado |
| E5 | REVIEWER | linha nova | ✅ PR #20 (2026-07-03) |
| E6 | AUTOMATOR | Camada 2 (n8n) | ✅ PR #20 (2026-07-03) |
| E7 | KNOWLEDGE | linha KNOWLEDGE | vinculado |
| E8 | PLANNER | linha nova | ✅ PR #20 (2026-07-03) |
| E9 | BOBBY | linha BOBBY | vinculado (já ratificada) |

## Sobreposições e fronteiras (estado: saudável)

- E2/E3/E4/E7/E9 **não são agentes novos** — são a materialização executável das linhas existentes (reconciliação anti-bifurcação feita em `estagiarios.md`). Uma autoridade, dois formatos.
- **Coaches APEX** (Ilia, Cariani, Sanji, Muzy) são **personas de dados**, não agentes — sem linha na matriz (decisão do §9 do Spec).
- Fronteira E6: AUTOMATOR prepara automações; **ativar agendamento/workflow é do Operador**.
- Decisões exclusivas do Operador: projeto estratégico, capital, comunicação externa final, canon, exclusão definitiva.
