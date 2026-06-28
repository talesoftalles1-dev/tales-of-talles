#!/usr/bin/env python3
"""
Importador genérico para app de tracking
- Suporta CSV local (--mode csv)
- Suporta chamada API simples (--mode api), lê TRACKER_API_TOKEN e TRACKER_API_URL de wiki/.env
- Gera/atualiza notas em wiki/tracking/ ou cria entries em wiki/daily/
"""

import os
import csv
import json
import argparse
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]  # ../..
VAULT = ROOT / "wiki"
TRACKING_DIR = VAULT / "tracking"
DAILY_DIR = VAULT / "daily"

def ensure_dirs():
    TRACKING_DIR.mkdir(parents=True, exist_ok=True)
    DAILY_DIR.mkdir(parents=True, exist_ok=True)

def import_csv(path):
    with open(path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Espera colunas: date, duration, note, tag
            date = row.get('date') or row.get('Date')
            duration = row.get('duration') or row.get('Duration') or "0"
            note = row.get('note') or ""
            tag = row.get('tag') or ""
            filename = f"{date} - tracking.md"
            out = TRACKING_DIR / filename
            append_tracking(out, date, duration, note, tag)

def import_api(url, token):
    import requests
    headers = {}
    if token:
        headers['Authorization'] = f"Bearer {token}"
    r = requests.get(url, headers=headers)
    r.raise_for_status()
    data = r.json()
    # Espera lista de eventos com fields: date, duration, note, tag
    for ev in data:
        date = ev.get('date') or ev.get('timestamp', '')[:10]
        duration = str(ev.get('duration', 0))
        note = ev.get('note', '')
        tag = ev.get('tag', '')
        filename = f"{date} - tracking.md"
        out = TRACKING_DIR / filename
        append_tracking(out, date, duration, note, tag)

def append_tracking(path, date, duration, note, tag):
    header = f"---\ntype: tracking\ndate: {date}\ntags: [{tag}]\n---\n\n"
    content = f"- time: {datetime.now().isoformat()}\n  duration: {duration}\n  note: \"{note}\"\n\n"
    if path.exists():
        with open(path, 'a', encoding='utf-8') as f:
            f.write(content)
    else:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(header + content)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--mode', choices=['csv','api'], required=True)
    parser.add_argument('--path', help='CSV path (overrides .env)')
    parser.add_argument('--url', help='API URL (overrides .env)')
    args = parser.parse_args()
    load_dotenv(VAULT / '.env')
    ensure_dirs()
    if args.mode == 'csv':
        p = args.path or os.getenv('TRACKER_CSV_PATH')
        if not p:
            raise SystemExit("CSV path required (arg or TRACKER_CSV_PATH in wiki/.env)")
        import_csv(Path(p))
    else:
        url = args.url or os.getenv('TRACKER_API_URL')
        token = os.getenv('TRACKER_API_TOKEN')
        if not url:
            raise SystemExit("API URL required (arg or TRACKER_API_URL in wiki/.env)")
        import_api(url, token)

if __name__ == '__main__':
    main()
