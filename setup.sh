#!/usr/bin/env bash
#
# Prvotní setup: založí git repo lokálně, napojí na tvoje GitHub repo a pushne.
# Spusť na svém Macu (NE v sandboxu) z kořene projektu.
#
# Nejdřív si na github.com vytvoř PRÁZDNÉ repo (bez README/.gitignore) a zkopíruj jeho URL.
# Pak:
#
#     bash setup.sh https://github.com/<user>/<repo>.git
#
# Při pushi se git zeptá na username + heslo — jako heslo vlož svůj fine-grained token.
# (Nebo dej token rovnou do URL: https://<TOKEN>@github.com/<user>/<repo>.git)

set -euo pipefail

REMOTE_URL="${1:-}"

cd "$(dirname "$0")"

command -v git >/dev/null || { echo "✗ git není nainstalovaný"; exit 1; }

# Úklid případných sandbox artefaktů (jsou v .gitignore, jen pro jistotu)
rm -rf .nm_broken_* .git_broken_* 2>/dev/null || true

if [ ! -d .git ]; then
  echo "▶ git init…"
  git init -q
  git branch -M main
fi

echo "▶ Commit…"
git add -A
git commit -q -m "Astro migrace marketing webu (1:1 z Next.js prototypu)" || echo "  (nic k commitu — pokračuji)"

if [ -z "$REMOTE_URL" ]; then
  echo ""
  echo "ℹ️  Commit hotový. Chybí URL repa. Dokonči ručně:"
  echo "      git remote add origin https://github.com/<user>/<repo>.git"
  echo "      git push -u origin main"
  exit 0
fi

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REMOTE_URL"
else
  git remote add origin "$REMOTE_URL"
fi

echo "▶ Push na $REMOTE_URL …"
git push -u origin main

echo ""
echo "✅ Repo je na GitHubu. Teď jednorázově propoj Cloudflare Pages:"
echo "   dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git → vyber repo"
echo "   Build: preset Astro · command 'npm run build' · output 'dist' · NODE_VERSION=20"
echo "   Pak Custom domains → wemarry.cz. Od teď stačí git push (jako ve tvém druhém projektu)."
echo "   Před produkcí doplň ga4Id a app.login v src/config/site.ts."
