---
description: Installiert den Carousel-Producer (Agent, 5 Skills, Asset-Bibliothek, Projekt-Vorlage) an die Original-Pfade und prueft die Voraussetzungen
---

Installiere den Carousel-Producer aus diesem Plugin. Gehe exakt so vor:

1. Finde das Plugin-Verzeichnis: Suche mit Glob nach `~/.claude/plugins/**/carousel-producer/scripts/install.sh` (Fallback: `~/.claude/**/carousel-producer/scripts/install.sh`). Nimm den Treffer, dessen Elternverzeichnis auch `.claude-plugin/plugin.json` mit `"name": "carousel-producer"` enthaelt.

2. Fuehre das Installer-Script aus: `bash <gefundener Pfad zu install.sh>`. Das Script kopiert Agent, Skills, Asset-Bibliothek und Projekt-Vorlage an die Zielorte (bestehende Versionen werden automatisch gesichert) und prueft die Voraussetzungen (node, npx, ffmpeg, python3, higgsfield CLI).

3. Gib dem Nutzer die Script-Ausgabe wieder und erklaere die naechsten Schritte:
   - Higgsfield-Connector in Claude verbinden (claude.ai, Settings, Connectors, Higgsfield), damit der Agent Bilder generieren kann
   - Falls die higgsfield CLI fehlt: `npm install -g higgsfield`, dann `higgsfield auth login`
   - Claude Code neu starten, damit Agent und Skills geladen werden
   - Danach reicht ein Thema als Prompt, z.B. "carousel zu KI im Handwerk"

4. Falls das Script FEHLT-Zeilen ausgibt, biete an, die fehlenden Tools zu installieren (z.B. `brew install ffmpeg node python3` auf macOS).
