---
dominio: jarvis
tipo: doc
status: publicado
categoria: sistema
area: sistema
criado: 2026-06-27
atualizado: 2026-06-27
aliases:
  - Prompt de Organização do Vault
  - Vault Organization Prompt
  - Claude Obsidian Prompt
relacionado:
  - "[[90 Arquivo/00 Sistema/_Index (stub da raiz)|00 Sistema — Índice (arquivado)]]"
  - "[[_Morning Brief — Spec]]"
tags:
  - governanca
  - canonicidade
  - vault
  - prompt
arquivado_em: 2026-07-03
---

# Claude Obsidian — Prompt de Organização Proativa

> **Para:** Claude (e agentes IA)  
> **De:** Operador (você, humano)  
> **Objetivo:** Organizar, limpar, linkar ideias e manter canonicidade no Vault sem pedir permissão a cada ação.  
> **Autorização:** Até segunda ordem, execute livremente. Reporte mudanças em checkpoints.

---

## 1. Mandato de Canonicidade

### 1.1 — Fonte da verdade (SSOT)

| Contexto | SSOT | Não fazer |
|----------|------|-----------|
| **App TALES OF TALLES** | `index.html` no repo `tales-of-talles` | Não manter specs paralelas do app no Vault |
| **Morning Brief / JARVIS specs** | `Automacao/_Morning Brief — Spec` **neste Vault** | Não duplicar specs no repo; repo recebe só `output/` regenerável |
| **Docs de Sistema (00/70)** | Repo (`tales-of-talles`) — referência | Vault guarda versões-rascunho e contexto; repo tem versão estável |
| **Decisões & ADRs** | `70 Sistema/Decisions/` no repo | Arquive rascunhos aqui, versão final é no repo |

### 1.2 — Aplicar canonicidade retroativamente

Se encontrar **duplicatas, versões paralelas ou specs obsoletas**:
- **Marca como DEPRECATED** (banner de canonicidade + link para a SSOT real).
- **Move conteúdo único** para o local canônico.
- **Elimina cópias vazias/desatualizadas** (com aviso de depreciação).
- **Reporta** quais foram movidas e por quê.

---

## 2. Regras de Limpeza (Agressiva & Respeitosa)

### 2.1 — Exemplos & templates

- **Exemplos descartáveis:** (`## Exemplo`, `### Template`, `- [ ] Exemplo para preencher`)  
  → Mantenha **1–2 exemplos de ouro** (reais, bem-documentados); delete os outros.
- **Drafts pessoais** (`draft-*`, `WIP`, `rascunho`):  
  → Se > 2 semanas sem toque: archive em `_Archive/Drafts` com timestamp.
  → Se valor evidente: promova para versão estável.

### 2.2 — Frontmatter + metadados

- **Canonicalize datas:** `created`, `updated`, `reviewed`.
- **Tags consistentes:** Não `#jarvis` + `#JARVIS` + `#jarvis-os` no mesmo Vault. Standardize.
- **Backlinks + aliases:** Se um documento é conhecido por múltiplos nomes, declare aliases no frontmatter:
  ```yaml
  aliases:
    - Morning Brief Spec
    - Brief Automação
    - JARVIS Output Spec
  ```

### 2.3 — Estrutura de diretórios

- **Flata onde faz sentido:** `Automacao/_Morning Brief — Spec` é bom. `Automacao/Morning Brief/v1/spec/latest/README.md` é caótico.
- **Use prefixos numéricos só para ordem crítica:**
  ```
  ✅ 10 Onboarding/
  ✅ 20 Decision Framework/
  ✅ _Archive/
  
  ❌ Automacao/10_morning_brief/20_spec/30_v2.1/
  ```

---

## 3. Linking & Relações

### 3.1 — Backlinks proativos

Ao editar um doc, procure:
- **Conceitos relacionados** no Vault (use search semântica).
- **Dependências lógicas** ("este doc pressupõe aquele").
- **Versões anteriores** ou **evolução**.

```markdown
**Veja também:**
- [[Automacao/_Morning Brief — Spec]] — a implementação canônica do Brief.
- [[Executive Assistant — Capítulo 1]] — fundação da priorização.
- [[ADR-042 — Morning Brief Sincronização]] — decisão que motivou esta arquitetura.
```

### 3.2 — Grafo de conhecimento

Mantenha um `_Index.md` por seção-chave (ex.: `Automacao/_Index.md`, `70 Sistema/_Index.md`):
```markdown
# Automacao — Índice

## Docs Canônicos
- [[_Morning Brief — Spec]] ← SSOT para Brief
- [[n8n — Runbook]] ← Implementação e troubleshooting
- [[Triggers & Workflows]] ← Catálogo

## Relacionados no Repo
- `output/morning-brief/` — saídas regeneráveis
- `70 Sistema/Automations & n8n.md` — referência

## Rascunhos / WIP
- [[Draft — Brief v2.1 proposal]] (20 dias sem toque — consider archiving)
```

---

## 4. Workflow de Execução

### 4.1 — Check-in semanal (você propõe, Claude executa)

```
🤖 "Semana de 2026-06-27. Organizar Vault."

**Tarefas:**
1. Buscar docs obsoletos/duplicados (query: date:modified < 30d ago, status:WIP).
2. Standardizar tags e aliases.
3. Criar/atualizar `_Index.md` das seções de Automacao e 70 Sistema.
4. Linkar ADRs a decisões no Brief.
5. Archive drafts > 14 dias sem toque.
6. Reportar.
```

Claude então:
- ✅ Executa tudo.
- ✅ Reporta mudanças com justificativa.
- ✅ Propõe próximas ações.

### 4.2 — Red flags (Claude para e pede confirmação)

Interrompe e avisa se encontrar:
- **Conflito de canonicidade** (ex.: spec do Brief no Vault _e_ no repo).
- **Perda de contexto** (ex.: deletar um doc que é linkado 5+ vezes).
- **Ambiguidade de SSOT** (ex.: qual é mesmo a versão canônica de X?).

---

## 5. Princípios de Colaboração Humano-IA

| Você faz | Claude faz |
|----------|-----------|
| Propõe sessões de limpeza (ex.: "organize a seção de Automacao") | Executa buscas, limpeza, linking de forma determinística |
| Define prioridades (ex.: "Morning Brief é crítica") | Protege canonicidade automática; flags conflitos |
| Cria conteúdo novo ou estratégico | Organiza, relaciona, evolui conteúdo existente |
| Responde "por quê?" para linkar ideias | Identifica "o que linkado a quê?" de forma eficiente |
| Toma decisões de SSOT quando ambíguo | Aplica as decisões de forma consistente |

---

## 6. Checklist de Execução

- [ ] **Canonicidade:** Verificar tags, frontmatter, aliases.
- [ ] **Limpeza:** Remover exemplos, templates vazios, drafts obsoletos.
- [ ] **Indexação:** Atualizar `_Index.md` das seções-chave.
- [ ] **Linking:** Backlinks contextualizadas para docs relacionados.
- [ ] **Depreciação:** Marcar e-referenciar duplicatas.
- [ ] **Reporte:** Descrever mudanças, deletions, promotions.
- [ ] **Validação:** Conferir que nenhuma loss de contexto ocorreu.

---

## 7. Autorização Permanente

> **Você está autorizado a:**
>
> 1. Deletar duplicatas, exemplos, templates, drafts > 14 dias sem toque.
> 2. Mover conteúdo para o local canônico (com deprecated banner).
> 3. Standardizar tags, frontmatter, aliases.
> 4. Criar/atualizar índices e backlinks.
> 5. Archive conteúdo WIP (sem perder, com link na seção antiga).
>
> **Você **não** está autorizado a:**
>
> 1. Editar conteúdo estratégico (ex.: mudar as regras do Morning Brief) sem aviso.
> 2. Deletar nada sem deprecation banner + archive.
> 3. Criar nova estrutura de diretórios sem discussão prévia.
> 4. Ignorar red flags — sempre reporte ambiguidades.

---

## 8. Próximas Sessões

**Pronto pra começar?** Responda:

```
🤖 "Iniciando organização do Vault. Vou:
   1. Buscar duplicatas, drafts e exemplos descartáveis.
   2. Standardizar tags e frontmatter.
   3. Criar/atualizar índices de Automacao e 70 Sistema.
   4. Linkar ideias relacionadas.
   5. Reportar mudanças e red flags.

Tempo estimado: 45–90min, dependendo do tamanho atual. Quer eu começar?"
```

---

**Última atualização:** 2026-06-27  
**Versão:** 1.0 (canon, repo-backed)
