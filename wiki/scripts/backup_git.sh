#!/usr/bin/env bash
# Backup local: commit & push the wiki folder (run locally)
MSG=${1:-"vault: auto backup"}
git add wiki
git commit -m "$MSG" || echo "nothing to commit"
git push || echo "push failed — check remote"
