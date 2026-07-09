# Jarvis Watcher

Observa `raw/inbox` e cria notas em `wiki/` com commit/push automático.

## Dependências

- Python 3.10+
- Git
- `watchdog`

Windows PowerShell para registro como tarefa agendada.

## Instalação

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r tools/requirements.txt
```

## Configuração

Edite `config.yaml` em `tools/` ou use argumentos CLI.
Defaults: repo root é a raiz do repositório.

## Uso

```powershell
python tools/jarvis_watcher.py --repo-root "C:\Users\talle\Desktop\Jarvis.worktrees\agents-jarvis-ai-personal-assistant-system"
```

Com dry-run:
```powershell
python tools/jarvis_watcher.py --repo-root "<repo>" --dry-run
```

## Scheduled Task (Windows)

Ver `docs/jarvis_watcher_scheduled_task.ps1`.

## Comportamento

- Ignora temporários e diretórios.
- Espera arquivo estável antes de processar.
- Move original para `raw/processed/YYYY-MM-DD/`.
- Se push falhar, move original para `raw/failed/` e loga erro.
- Logs em `logs/jarvis_watcher.log`.

## Troubleshooting

- Push falhando: configure seu acesso Git (SSH ou store Windows).
- Nada acontece: verifique `logs/jarvis_watcher.log`.
