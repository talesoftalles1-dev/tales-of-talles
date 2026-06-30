---
dominio: jarvis
tipo: checklist
status: ativo
contexto: validação de saúde operacional do sistema
area: empresa
criado: 2026-06-30
atualizado: 2026-06-30
tags:
  - revisar
  - tema/ia
---

# ✅ Checklist — Validação Operacional JARVIS

> [!info] Checklist reutilizável
> Roda sempre que se quer confirmar que a automação está realmente funcionando no mundo real — não só "o código existe", mas "rodou, sem intervenção, e o operador conseguiu usar o resultado". Duplique os resultados a cada rodada (não edite por cima); este arquivo é o instrumento, não o log.

## Contexto

- **Contexto:** validação periódica pós-mudança ou pós-incidente, antes de confiar em mais um dia de automação.
- **Quem usa:** Operador ou sessão de IA em modo estabilização.
- **Frequência:** após qualquer mudança estrutural; recomendado também 1x/semana enquanto o sistema é novo.

## Itens

### 1. Scheduled tasks (Windows Task Scheduler)
- [ ] `JARVIS Executive Assistant` — `State: Ready`, `LastTaskResult: 0`, `LastRunTime` é hoje
- [ ] `JARVIS Morning Brief` — `State: Ready`, `LastRunTime` é hoje (resultado pode ser 0 ou 2 — ver item 3)
- [ ] `NextRunTime` de ambas está no futuro (a tarefa não foi desabilitada/expirada)

### 2. Dashboard (Executive Assistant)
- [ ] `output/daily_dashboard.md` tem `Última compilação` de hoje
- [ ] Seção **Hoje** tem no máx. 3 itens (gate de carga cognitiva, `_Spec §8`)
- [ ] Seção **Vitais** bate com a realidade (inbox pendente = 0 ou número plausível)
- [ ] Log do dia em `70 Sistema/Automacao/executive-assistant/logs/YYYY-MM-DD.log` tem `"status":"written"`

### 3. Morning Brief — geração + entrega
- [ ] Arquivo `output/YYYY-MM-DD-morning-brief.txt` foi gerado hoje e tem conteúdo real (não vazio)
- [ ] Log do dia em `70 Sistema/Automacao/morning-brief/logs/YYYY-MM-DD.log`: se `status: slack_failed`, é a falha conhecida (webhook 500 / credencial Slack morta) — não uma regressão nova
- [ ] Se `status` for outro valor / erro diferente do já documentado → **investigar antes de assumir que é o mesmo bloqueio antigo**

### 4. Obsidian — UI/UX renderizando de verdade
- [ ] Obsidian está rodando (`Get-Process Obsidian`) — só então as próximas checagens fazem sentido
- [ ] `.obsidian/community-plugins.json` lista os plugins esperados e nenhum motivo pra eles terem sido desativados
- [ ] Abrir `🤖 JARVIS` (Dashboard): blocos ` ```dataview ` e ` ```tasks ` renderizam como tabela/checklist, **não** como texto cru
- [ ] Nenhuma nota crítica (Dashboard, MOCs de pilar) está com aba travada em modo "Source" por acidente

### 5. Inbox / captura
- [ ] `raw/inbox.md` não tem captura acumulada há mais de 24-48h sem triagem
- [ ] Se houver pendência, o Dashboard sinaliza corretamente ("N aguardando triagem")

### 6. Git / canonicidade
- [ ] `git status` no vault root: nada crítico ficou staged por acidente (credenciais, tokens, `data.json` de plugin)
- [ ] Nenhum PR aberto há mais de alguns dias esperando merge do Operador sem ele saber
- [ ] Arquivos de canon (`_Spec JARVIS`, `_Contrato de Autoridade dos Agentes`, `🪐 Constituição JARVIS`) não foram editados por engano por uma sessão de IA

### 7. Segurança / superfície de automação
- [ ] Nenhuma credencial viva (API key, token, secret) em arquivo rastreado pelo git
- [ ] Plugins novos que dão a um LLM execução de comando/bash no vault estão com modo de permissão **não-yolo** (confirmação humana ligada) — ou o Operador confirmou conscientemente que quer yolo
- [ ] `.gitignore` cobre qualquer `data.json`/config de plugin que carregue segredo

---

> [!tip] Dica
> Se um item falhar e a causa **já está documentada** (ex.: Slack OAuth morto), não é uma regressão — é o estado conhecido. Só vire alarme se o erro for **diferente** do já registrado, ou se um item que sempre passou começar a falhar.
