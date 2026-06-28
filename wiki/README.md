# Wiki (Obsidian) — estrutura e instruções

Visão rápida
- Organização: PARA + Zettelkasten aplicada dentro de wiki/ com divisão tri-linear:
  - wiki/projects/ (Projects)
  - wiki/areas/ (Areas)
  - wiki/knowledge/ (Resources & Zettels)
- Pastas adicionais: wiki/daily, wiki/tracking, wiki/templates, wiki/assets, wiki/archive
- Arquivos sensíveis: coloque credenciais em wiki/.env (local) — há um .env.example em wiki/.

Plugins recomendados
- Templater
- Dataview
- QuickAdd
- Periodic Notes / Calendar
- Obsidian Git (opcional, para commits locais)

Como usar os scripts
- Import do tracker (CSV/API): wiki/scripts/import_tracking.py
  - Configure wiki/.env com TRACKER_API_TOKEN ou TRACKER_CSV_PATH
  - Rode: python3 wiki/scripts/import_tracking.py --mode csv
- Backup local via Git: wiki/scripts/backup_git.sh
  - Rode: bash wiki/scripts/backup_git.sh "mensagem do commit"

Dataview e templates já incluídos em wiki/templates/.
MOCs iniciais em wiki/.
