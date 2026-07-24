#!/usr/bin/env bash
# Carousel-Producer Installer
# Kopiert Agent, Skills, Asset-Bibliothek und Projekt-Vorlage an exakt die Orte,
# an denen das Original-Setup laeuft. Bestehende Versionen werden vorher gesichert.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PAYLOAD="$SCRIPT_DIR/../payload"
TS="$(date +%Y%m%d-%H%M%S)"

backup_if_exists() {
  local target="$1"
  if [ -e "$target" ]; then
    mv "$target" "${target}.backup-${TS}"
    echo "  Backup: ${target} -> ${target}.backup-${TS}"
  fi
}

echo "== Carousel-Producer Installation =="

# 1. Agent
mkdir -p "$HOME/.claude/agents"
backup_if_exists "$HOME/.claude/agents/carousel-producer.md"
cp "$PAYLOAD/agents/carousel-producer.md" "$HOME/.claude/agents/"
echo "OK Agent -> ~/.claude/agents/carousel-producer.md"

# 2. Skills
mkdir -p "$HOME/.claude/skills"
for s in carousel-konzept carousel-build carousel-assets tiefe-recherche higgsfield-generate; do
  backup_if_exists "$HOME/.claude/skills/$s"
  cp -R "$PAYLOAD/skills/$s" "$HOME/.claude/skills/"
  echo "OK Skill -> ~/.claude/skills/$s"
done

# 3. Asset-Bibliothek
mkdir -p "$HOME/.skaile"
backup_if_exists "$HOME/.skaile/carousel-library"
cp -R "$PAYLOAD/library" "$HOME/.skaile/carousel-library"
echo "OK Bibliothek -> ~/.skaile/carousel-library ($(ls "$HOME/.skaile/carousel-library/characters" | wc -l | tr -d ' ') Charaktere)"

# 4. Projekt-Vorlage (nur anlegen, nie ueberschreiben)
mkdir -p "$HOME/Downloads"
if [ ! -d "$HOME/Downloads/skaile-carousel" ]; then
  cp -R "$PAYLOAD/prototyp" "$HOME/Downloads/skaile-carousel"
  echo "OK Vorlage -> ~/Downloads/skaile-carousel"
else
  echo "SKIP Vorlage: ~/Downloads/skaile-carousel existiert schon"
fi

# 5. Voraussetzungen pruefen
echo ""
echo "== Voraussetzungen =="
for cmd in node npx ffmpeg python3; do
  if command -v "$cmd" >/dev/null 2>&1; then echo "OK $cmd"; else echo "FEHLT $cmd (bitte installieren)"; fi
done
if command -v higgsfield >/dev/null 2>&1; then echo "OK higgsfield CLI"; else echo "HINWEIS higgsfield CLI nicht gefunden (fuer Bild-Generierung: npm install -g higgsfield, dann higgsfield auth login)"; fi

echo ""
echo "== Fertig. Naechste Schritte =="
echo "1. Higgsfield-Connector in Claude verbinden (claude.ai -> Settings -> Connectors -> Higgsfield)"
echo "2. higgsfield auth login (falls CLI-Weg genutzt wird)"
echo "3. Claude Code neu starten, dann einfach ein Thema nennen: 'carousel zu <thema>'"
