#!/usr/bin/env python3
"""
Smoke test para Jarvis watcher.

Uso:
  python tools/smoke_test_watcher.py --repo-root <repo_root>

Requisitos:
  - watchdog instalado
  - git disponivel no PATH
  - repo com git inicializado
"""

import os
import sys
import time
import subprocess
import tempfile
import argparse

REPO_DEFAULT = r'C:\Users\talle\Desktop\Jarvis.worktrees\agents-jarvis-ai-personal-assistant-system'


def run(cmd, cwd=None):
    res = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    return res.returncode, res.stdout.strip(), res.stderr.strip()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-root", default=REPO_DEFAULT)
    parser.add_argument("--timeout", type=int, default=30)
    args = parser.parse_args()
    repo = args.repo_root

    inbox = os.path.join(repo, "raw", "inbox")
    wiki = os.path.join(repo, "wiki")
    processed = os.path.join(repo, "raw", "processed")
    log_file = os.path.join(repo, "logs", "jarvis_watcher.log")

    os.makedirs(inbox, exist_ok=True)

    # Create test file
    stem = time.strftime("%Y%m%d-%H%M%S")
    test_rel = f"smoke-{stem}.txt"
    test_abs = os.path.join(inbox, test_rel)
    content = f"Smoke test {stem}\nLinha 2.\n"
    with open(test_abs, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Criado arquivo de teste: {test_abs}")

    # Ensure watcher not already running is user's responsibility;
    # we only validate post-conditions here.
    deadline = time.time() + args.timeout
    ok = False
    while time.time() < deadline:
        time.sleep(2)
        files = [f for f in os.listdir(wiki) if f.startswith(stem) and f.endswith(".md")] if os.path.isdir(wiki) else []
        if files:
            ok = True
            break
    if not ok:
        print("FAIL: nota não apareceu em wiki/ no tempo esperado")
    else:
        print(f"OK: nota criada em wiki/: {files}")

    # check archive
    arch_day = time.strftime("%Y-%m-%d")
    archived = os.path.join(processed, arch_day, test_rel)
    if os.path.exists(archived):
        print(f"OK: arquivo movido para raw/processed/{arch_day}/")
    else:
        print(f"FAIL: arquivo original não foi arquivado em {archived}")

    # check git log for recent commit message
    rc, out, err = run(["git", "log", "--oneline", "-5"], cwd=repo)
    commit_ok = any("adicionar nota automática" in line for line in out.splitlines()) if rc == 0 else False
    if commit_ok:
        print("OK: commit automático encontrado no git log")
    else:
        print("FAIL: commit automático não encontrado")

    # check log file
    if os.path.exists(log_file):
        print(f"OK: logs/jarvis_watcher.log existe")
    else:
        print("FAIL: logs/jarvis_watcher.log não existe")

    all_ok = ok and commit_ok and os.path.exists(archived) and os.path.exists(log_file)
    print("RESULTADO:", "PASS" if all_ok else "FAIL")
    sys.exit(0 if all_ok else 1)


if __name__ == "__main__":
    main()
