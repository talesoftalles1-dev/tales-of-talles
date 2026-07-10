# Jarvis Watcher

Observa `raw/inbox` e cria notas em `wiki/` com commit/push automático.

## Dependências

- Python 3.10+
- Git
- `watchdog`

## Instalação

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r tools/requirements.txt
```

## Configuração

Edite `tools/config.yaml` ou passe argumentos CLI.
Defaults: repo root é a raiz do repositório.

## Uso

```powershell
python tools/jarvis_watcher.py --repo-root "<repo_root>"
```

Dry-run:
```powershell
python tools/jarvis_watcher.py --repo-root "<repo_root>" --dry-run
```

## Scheduled Task (Windows)

Ver `tools/scripts/register_jarvis_watcher.ps1`.

## Comportamento

- Ignora temporários e diretórios.
- Espera estabilidade do arquivo antes de processar.
- Move original para `raw/processed/YYYY-MM-DD/`.
- Se push falhar, move original para `raw/failed/` e loga erro.
- Logs em `logs/jarvis_watcher.log`.

## Troubleshooting

- Push falhando: configure credencial Git (SSH ou Windows Credential Manager).
- Nada acontece: verifique `logs/jarvis_watcher.log`.
