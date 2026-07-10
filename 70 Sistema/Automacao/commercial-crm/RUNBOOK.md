# JARVIS Commercial CRM — Agentes Comerciais (Frentes 1·2·3)

Pipeline de agentes comerciais do JARVIS. Stack: Node + Gemma 4 (Ollama local) + CRM Yalt.
Cérebro local, memória no Obsidian, orquestração pelo Hermes. Substitui o n8n (branch `fix/workflows-replacement-n8n`).

## Frentes
| # | Agente | Script | Saída | Envio externo? |
|---|--------|--------|-------|----------------|
| 1 | Gerente (briefing diário) | `manager.mjs` | `output/comercial/daily_pipeline_YYYY-MM-DD.md` | Não (só briefing) |
| 2 | Enriquecimento | `enrichment.mjs` | `output/comercial/enriquecimento_YYYY-MM-DD.json` | Não (só lê/escreve CRM) |
| 3 | Cold email (rascunho) | `cold_email.mjs --limit N` | `output/comercial/cold_emails_YYYY-MM-DD.{md,json}` | Não (rascunho; envio atrás de `YALT_SEND_REAL=1`) |

## Pré-requisitos
- Node 20+ (runners do Actions usam Node 24).
- Ollama com `gemma4` (`ollama run gemma4`). Verificar: `curl localhost:11434/api/tags`.
- Chave do CRM Yalt (`x-api-key`, formato `yalt_xxx`) — em `config.json` (gitignored) ou env `YALT_API_KEY`.
- Para Frente 3 em escala/real: Gmail OAuth religado OU ESP configurado (ver `30 Empresa/Documentacao/Plano de Testes de Email Yalt.md`).

## Como rodar (local)
```powershell
cd "70 Sistema\Automacao\commercial-crm"
$env:YALT_API_KEY="yalt_xxx"          # ou edite config.json (gitignored)
node manager.mjs                       # Frente 1
node enrichment.mjs                    # Frente 2 (pagination automática dos 285 leads)
node cold_email.mjs --limit 10         # Frente 3 (rascunho de 10 leads com email)
```

## Contratos de segurança
- Sem envio externo automático (cláusula BOBBY/E9). Frente 3 gera RASCUNHO; envio real
  só com `YALT_SEND_REAL=1` E após Gmail/ESP validado pelo Operador.
- Segredos nunca hardcoded/commitados (`config.json` e `logs/` no `.gitignore`). No Actions, via `secrets.YALT_API_KEY`.
- Falha segura: se o Gemma não responder (timeout), o Gerente cai no briefing fallback (sem LLM).
- `enrich-lusha`/`enrich-kaspr` podem retornar 500 se o provedor não estiver contratado — tratado, não quebra o pipeline.

## Automação (GitHub Actions)
- `.github/workflows/commercial-crm-agents.yml` roda diariamente 07:00 UTC (08:00 Lisboa).
- Executa as 3 frentes e commita os outputs regeneráveis em `output/comercial/`.
- O Gerente usa `JARVIS_AGENT_BRAIN=ollama` (precisa de runner com Ollama; no Actions o Ollama
  não está disponível por padrão → nesse caso o Gerente usa o fallback). Para usar Gemma no CI,
  adicione um passo que instale/rode Ollama, ou rode localmente via agendador Windows.

## Observações de latência (Gemma 4 8B Q4_K_M)
- O modelo é lento (~150s por síntese). O Gerente envia só top-10 leads ao Gemma para caber no timeout.
- Cold email é serial (1 lead por vez). Para lotes grandes, aumentar `limit` ou paralelizar.
