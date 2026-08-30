#!/usr/bin/env bash
# Installiert den Carousel-Producer für Claude Code.
# Nicht-destruktiv: eigene Bestandteile werden mit Timestamp gesichert,
# fremde vorhandene Skills (higgsfield-generate, tiefe-recherche) werden NICHT überschrieben.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
AGENT_FILE="$HOME/.claude/agents/carousel-producer.md"
SKILLS_DIR="$HOME/.claude/skills"
LIB_DIR="${CAROUSEL_LIBRARY:-$HOME/Documents/Projects/carousel-library}"
TS="$(date +%Y%m%d-%H%M%S)"

backup() {
  if [ -e "$1" ]; then
    mv "$1" "$1.bak-$TS"
    echo "  Backup: $1.bak-$TS"
  fi
}

echo "==> Carousel-Producer installieren"

# 1. Agent
mkdir -p "$(dirname "$AGENT_FILE")"
backup "$AGENT_FILE"
cp "$REPO_DIR/agent/carousel-producer.md" "$AGENT_FILE"
echo "✓ Agent: $AGENT_FILE"

# 2. Kern-Skills (immer aktualisieren, mit Backup)
mkdir -p "$SKILLS_DIR"
for s in carousel-konzept carousel-build carousel-assets; do
  backup "$SKILLS_DIR/$s"
  cp -R "$REPO_DIR/skills/$s" "$SKILLS_DIR/$s"
  echo "✓ Skill: $s"
done

# 3. Helfer-Skills (nur wenn noch nicht vorhanden — deine Versionen bleiben unangetastet)
for s in higgsfield-generate tiefe-recherche; do
  if [ -e "$SKILLS_DIR/$s" ]; then
    echo "· Skill $s existiert schon — übersprungen"
  else
    cp -R "$REPO_DIR/skills/$s" "$SKILLS_DIR/$s"
    echo "✓ Skill: $s"
  fi
done

# 4. Asset-Bibliothek (nur anlegen, wenn keine existiert — nie eine gefüllte überschreiben)
if [ -e "$LIB_DIR" ]; then
  echo "· Bibliothek existiert schon: $LIB_DIR — unangetastet"
else
  mkdir -p "$(dirname "$LIB_DIR")"
  cp -R "$REPO_DIR/library" "$LIB_DIR"
  echo "✓ Bibliothek (leer): $LIB_DIR"
fi

# 5. Voraussetzungen prüfen
echo ""
echo "==> Voraussetzungen:"
for cmd in node npx ffmpeg python3; do
  if command -v "$cmd" >/dev/null 2>&1; then echo "  ✓ $cmd"; else echo "  ✗ FEHLT: $cmd"; fi
done

echo ""
echo "==> Fertig. Nächste Schritte:"
echo "  1. Das Setup-Interview läuft direkt in dieser Claude-Session weiter (siehe SETUP-PROMPT.md)"
echo "  2. Danach Claude Code neu starten, damit Agent + Skills geladen werden"
echo "  3. Ab dann reicht: 'carousel zu <THEMA>'"
