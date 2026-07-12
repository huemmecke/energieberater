#!/usr/bin/env bash
set -euo pipefail

REPO_NAME="energieberater"
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

cd "$PROJECT_DIR"

echo "→ Prüfe GitHub-Login…"
if ! gh auth status >/dev/null 2>&1; then
  echo "Nicht eingeloggt. Bitte zuerst ausführen:"
  echo "  gh auth login"
  exit 1
fi

GITHUB_USER="$(gh api user -q .login)"
echo "→ Eingeloggt als: $GITHUB_USER"

if git remote get-url origin >/dev/null 2>&1; then
  echo "→ Remote origin existiert bereits:"
  git remote -v
else
  if gh repo view "$GITHUB_USER/$REPO_NAME" >/dev/null 2>&1; then
    echo "→ Repo existiert bereits, verknüpfe Remote…"
    git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
  else
    echo "→ Erstelle GitHub-Repo: $REPO_NAME"
    gh repo create "$REPO_NAME" --private --source=. --remote=origin --description "Energieweiser KI-Berater Website"
  fi
fi

echo "→ Push nach GitHub…"
git push -u origin main

echo "→ Verbinde Vercel mit GitHub…"
npx vercel git connect --yes

echo ""
echo "Fertig!"
echo "  GitHub: https://github.com/$GITHUB_USER/$REPO_NAME"
echo "  Vercel: https://ai-berater-fawn.vercel.app"
