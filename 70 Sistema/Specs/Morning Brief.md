---
dominio: jarvis

tipo: spec
status: ativo
criado: 2026-06-27
atualizado: 2026-06-27
---

# 📄 Morning Brief Specification

## Onde roda
- **Local**: Executado no computador do usuário via Obsidian‑Skills (Node.js) on a daily cron.
- **Trigger**: n8n cron node (`0 7 * * *` – 07:00 local time).  
- **Arquivos envolvidos**:
  - `70 Sistema/Automation/morning_brief.js` – gera o briefing.
  - `output/morning_brief/YYYY-MM-DD.md` – arquivo de fonte única.
  - `00 JARVIS/🤖 JARVIS.md` – dashboard que **consome** o briefing.

## Agenda de execução
1. **Checa fila de retry** (`output/morning_brief/pending/`). Se houver arquivo pending, tenta enviá‑lo ao Slack primeiro.
2. **Lê o Vault** usando Obsidian‑Skills (`read_note`, `dataview_query`).
3. **Aplica o *Priority Contract*** – reutiliza a query que já calcula o campo `score` (definido em `_Spec JARVIS.md`).
4. **Ordena por `score DESC`** e extrai as seções:
   - Top 3 Actions
   - Risks & Blockers
   - Commercial Signals
   - Today’s tasks
   - Projects Requiring Attention (only if any).
5. **Renderiza Markdown** exatamente no formato exigido (sem métricas extras).
6. **Grava** `output/morning_brief/YYYY-MM-DD.md`.
7. **Injeta** o bloco entre `<!-- MORNING_BRIEF_START -->` e `<!-- MORNING_BRIEF_END -->` em `00 JARVIS/🤖 JARVIS.md`.
8. **Entrega ao Slack** (`#daily-test` ou `#daily` com prefixo `[TEST]`).
9. **Falha do Slack** → move o briefing para `70 Sistema/Logs/Morning Brief/pending/YYYY-MM-DD.md` **e** copia para `output/morning_brief/pending/` para retry.

## Formato de saída (exatamente)
```
🌅 JARVIS Morning Brief

🎯 Top 3 Actions
- …
- …
- …

⚠ Risks & Blockers
- …

💼 Commercial Signals
- …

📅 Today
- …

🏗 Projects Requiring Attention
- … (only if any)
```

## Modos de falha e recuperação
- **Falha de geração**: log em `70 Sistema/Logs/Morning Brief/generation_error.log` e aborta – a tentativa será re‑tentada no próximo cron.
- **Falha de entrega Slack**: conforme passo 9, o briefing entra na fila de retry e será tentado novamente na próxima execução.
- **Arquivo já existente**: sobrescreve o dia corrente; arquivos antigos permanecem em `output/morning_brief/` para histórico.

## Observações
- Não há **novas regras de pontuação** – usamos a query `score` já presente no contrato de prioridade.
- O Dashboard jamais cria um *novo* briefing; apenas **inclui** o bloco gerado.
- Cores permanecem as definidas no contrato de marca; a UI foca em tipografia e hierarquia.

---
