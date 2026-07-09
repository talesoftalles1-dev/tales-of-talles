#!/usr/bin/env python3
"""
Jarvis watcher: observa raw/inbox e cria notas em wiki/ com commit automático.
Uso:
  python jarvis_watcher.py --repo-root <repo_root> [--dry-run]
Configuração padrão em tools/config.yaml.
"""

import os
import sys
import time
import uuid
import argparse
import logging
import pathlib
import shutil
import subprocess
from datetime import datetime
from logging.handlers import RotatingFileHandler

try:
    import yaml
except Exception:
    yaml = None

try:
    from watchdog.observers import Observer
    from watchdog.events import FileSystemEventHandler
except Exception:
    Observer = None
    FileSystemEventHandler = object


class JarvisConfig:
    def __init__(self, repo_root: str, cli_overrides: dict | None = None):
        self.repo_root = os.path.abspath(repo_root)
        self.watch_dir = os.path.join(self.repo_root, "raw", "inbox")
        self.wiki_dir = os.path.join(self.repo_root, "wiki")
        self.archive_dir = os.path.join(self.repo_root, "raw", "processed")
        self.failed_dir = os.path.join(self.repo_root, "raw", "failed")
        self.log_file = os.path.join(self.repo_root, "logs", "jarvis_watcher.log")
        self.commit_msg = "chore(jarvis): adicionar nota automática — {title}"
        self.stable_seconds = 2
        self.poll_interval = 1
        self._load(cli_overrides or {})

    def _load(self, cli_overrides):
        cfg_path = os.path.join(self.repo_root, "tools", "config.yaml")
        if os.path.exists(cfg_path) and yaml is not None:
            try:
                with open(cfg_path, "r", encoding="utf-8") as f:
                    data = yaml.safe_load(f) or {}
                self.watch_dir = _resolve(self.repo_root, data.get("watch_dir", self.watch_dir))
                self.wiki_dir = _resolve(self.repo_root, data.get("wiki_dir", self.wiki_dir))
                self.archive_dir = _resolve(self.repo_root, data.get("archive_dir", self.archive_dir))
                self.failed_dir = _resolve(self.repo_root, data.get("failed_dir", self.failed_dir))
                self.log_file = _resolve(self.repo_root, data.get("log_file", self.log_file))
                self.commit_msg = data.get("commit_msg", self.commit_msg)
                self.stable_seconds = int(data.get("stable_seconds", self.stable_seconds))
                self.poll_interval = int(data.get("poll_interval", self.poll_interval))
            except Exception as e:
                print(f"Aviso: falha ao ler config.yaml: {e}")
        for key, value in cli_overrides.items():
            if value is not None:
                setattr(self, key, _resolve(self.repo_root, value) if key.endswith("_dir") or key == "log_file" else value)


def _resolve(repo_root, value):
    if value is None:
        return value
    value = os.path.expanduser(value)
    if os.path.isabs(value):
        return value
    return os.path.abspath(os.path.join(repo_root, value))


def make_frontmatter(title, date_iso, source, raw_content):
    indented_raw = "\n".join(["  " + line for line in raw_content.splitlines()])
    front = (
        "---\n"
        f'title: "{title}"\n'
        f'date: "{date_iso}"\n'
        "lang: pt-BR\n"
        f"source: {source}\n"
        "raw: |\n"
        f"{indented_raw}\n"
        "---\n\n"
    )
    return front


def setup_logging(log_file):
    os.makedirs(os.path.dirname(log_file), exist_ok=True)
    logger = logging.getLogger("jarvis_watcher")
    if not logger.handlers:
        logger.setLevel(logging.INFO)
        handler = RotatingFileHandler(log_file, maxBytes=5_000_000, backupCount=5, encoding="utf-8")
        fmt = logging.Formatter("%(asctime)s %(levelname)s %(message)s", datefmt="%Y-%m-%d %H:%M:%S")
        handler.setFormatter(fmt)
        logger.addHandler(handler)
        logger.addHandler(logging.StreamHandler(sys.stdout))
    return logger


def retry(times=3, delay=1):
    def decorator(func):
        def wrapper(*args, **kwargs):
            last = None
            for i in range(times):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last = e
                    time.sleep(delay * (i + 1))
            raise last
        return wrapper
    return decorator


def wait_for_stable(path, stable_seconds, poll_interval):
    last = -1
    waited = 0
    while waited < max(stable_seconds * 3, 15):
        try:
            size = os.path.getsize(path)
        except FileNotFoundError:
            return False
        if size == last and size > 0:
            if waited >= stable_seconds:
                return True
        else:
            waited = 0
            last = size
        time.sleep(poll_interval)
        waited += poll_interval
    return last > 0


@retry(times=3, delay=1)
def atomic_move(src, dst):
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.move(src, dst)


def unique_path(path):
    if not os.path.exists(path):
        return path
    stem = pathlib.Path(path).stem
    suffix = pathlib.Path(path).suffix
    parent = os.path.dirname(path)
    for i in range(1, 10000):
        candidate = os.path.join(parent, f"{stem}_{i}{suffix}")
        if not os.path.exists(candidate):
            return candidate
    raise RuntimeError(f"Caminho duplicado não resolvido: {path}")


def run_git(repo_root, *cmd):
    res = subprocess.run(cmd, cwd=repo_root, capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(res.stderr.strip() or res.stdout.strip())
    return res.stdout.strip()


def git_add_commit_push(logger, repo_root, relpath, commit_message, dry_run=False):
    relpath = os.path.relpath(relpath, repo_root)
    try:
        logger.info("git add %s", relpath)
        if not dry_run:
            run_git(repo_root, "git", "add", relpath)
            run_git(repo_root, "git", "commit", "-m", commit_message)
        logger.info("git commit ok: %s", commit_message)
    except Exception as e:
        logger.error("git add/commit failed: %s", e)
        return False, str(e)
    try:
        if dry_run:
            logger.info("dry-run: git push skipped")
            return True, ""
        logger.info("git push")
        run_git(repo_root, "git", "push")
        logger.info("git push ok")
        return True, ""
    except Exception as e:
        logger.error("git push failed: %s", e)
        return False, str(e)


def archive_source(logger, src, archive_root, failed_root, dry_run=False):
    date_prefix = datetime.utcnow().strftime("%Y-%m-%d")
    dest_dir = os.path.join(archive_root, date_prefix)
    dest = unique_path(os.path.join(dest_dir, os.path.basename(src)))
    try:
        if not dry_run:
            atomic_move(src, dest)
        logger.info("arquivo movido para %s", dest)
        return dest
    except Exception as e:
        logger.error("falha ao mover arquivo processado para archive: %s", e)
        failed = unique_path(os.path.join(failed_root, os.path.basename(src)))
        try:
            if not dry_run:
                atomic_move(src, failed)
            logger.info("arquivo movido para failed %s", failed)
        except Exception as e2:
            logger.error("falha ao mover arquivo para failed: %s", e2)
        return None


def is_ignored(name):
    if name.startswith(".") or name.startswith("~"):
        return True
    if name.endswith(".tmp") or name.endswith(".temp") or name.endswith("~"):
        return True
    return False


class JarvisHandler(FileSystemEventHandler):
    def __init__(self, cfg: JarvisConfig, dry_run=False):
        self.cfg = cfg
        self.dry_run = dry_run
        self.logger = setup_logging(cfg.log_file)
        self.seen = set()

    def _process(self, src):
        if not os.path.isfile(src):
            return
        name = os.path.basename(src)
        if is_ignored(name):
            self.logger.info("ignorando arquivo temporário: %s", src)
            return
        if src in self.seen:
            return
        self.seen.add(src)
        self.logger.info("processando arquivo: %s", src)

        if not wait_for_stable(src, self.cfg.stable_seconds, self.cfg.poll_interval):
            self.logger.error("arquivo instável/tam 0: %s", src)
            return

        try:
            with open(src, "r", encoding="utf-8") as f:
                content = f.read()
        except Exception as e:
            self.logger.error("não foi possível ler %s: %s", src, e)
            return

        now = datetime.utcnow()
        date_iso = now.isoformat() + "Z"
        shortid = uuid.uuid4().hex[:6]
        title = f"Nota automática {now.strftime('%Y-%m-%d %H:%M:%S')} {shortid}"

        front = make_frontmatter(title, date_iso, "raw/inbox", content)
        filename = f"{now.strftime('%Y-%m-%d-%H%M%S')}-{shortid}.md"
        os.makedirs(self.cfg.wiki_dir, exist_ok=True)
        dest_path = unique_path(os.path.join(self.cfg.wiki_dir, filename))

        try:
            with open(dest_path, "w", encoding="utf-8") as out:
                out.write(front)
                out.write(content)
        except Exception as e:
            self.logger.error("falha ao escrever nota em %s: %s", dest_path, e)
            return

        self.logger.info("nota criada: %s", dest_path)
        commit_message = self.cfg.commit_msg.replace("{title}", title)
        pushed, err = git_add_commit_push(self.logger, self.cfg.repo_root, dest_path, commit_message, dry_run=self.dry_run)
        if not pushed:
            self.logger.error("commit/push não concluído: %s", err)

        archive_source(self.logger, src, self.cfg.archive_dir, self.cfg.failed_dir, dry_run=self.dry_run)

    def on_created(self, event):
        if event.is_directory:
            return
        self._process(event.src_path)

    def on_moved(self, event):
        if event.is_directory:
            return
        self._process(event.dest_path)


def main():
    parser = argparse.ArgumentParser(description="Watcher Jarvis: raw/inbox -> wiki/")
    parser.add_argument("--repo-root", default=os.getcwd(), help="Raiz do repositório")
    parser.add_argument("--dry-run", action="store_true", help="Não aplica git/move, só loga")
    parser.add_argument("--watch-dir", dest="cli_watch_dir", default=None)
    parser.add_argument("--wiki-dir", dest="cli_wiki_dir", default=None)
    parser.add_argument("--archive-dir", dest="cli_archive_dir", default=None)
    parser.add_argument("--failed-dir", dest="cli_failed_dir", default=None)
    parser.add_argument("--log-file", dest="cli_log_file", default=None)
    parser.add_argument("--commit-msg", dest="cli_commit_msg", default=None)
    args = parser.parse_args()

    cfg = JarvisConfig(
        args.repo_root,
        {
            "watch_dir": args.cli_watch_dir,
            "wiki_dir": args.cli_wiki_dir,
            "archive_dir": args.cli_archive_dir,
            "failed_dir": args.cli_failed_dir,
            "log_file": args.cli_log_file,
            "commit_msg": args.cli_commit_msg,
        },
    )

    os.makedirs(cfg.watch_dir, exist_ok=True)
    os.makedirs(cfg.wiki_dir, exist_ok=True)
    os.makedirs(cfg.archive_dir, exist_ok=True)
    os.makedirs(cfg.failed_dir, exist_ok=True)

    print(f"Repo root: {cfg.repo_root}")
    print(f"Observando: {cfg.watch_dir}")
    print(f"Notas: {cfg.wiki_dir}")
    print(f"Archive: {cfg.archive_dir}")
    print(f"Failed: {cfg.failed_dir}")
    print(f"Dry-run: {args.dry_run}")

    if Observer is None:
        print("Erro: watchdog não instalado. Rode: pip install watchdog")
        sys.exit(2)

    handler = JarvisHandler(cfg, dry_run=args.dry_run)
    observer = Observer()
    observer.schedule(handler, cfg.watch_dir, recursive=False)
    observer.start()
    print("Watcher iniciado. Ctrl+C para parar.")
    try:
        while True:
            time.sleep(cfg.poll_interval)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()


if __name__ == "__main__":
    main()
