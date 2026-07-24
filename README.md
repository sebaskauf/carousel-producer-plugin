# Carousel-Producer Plugin

Instagram-Carousel-Produktion END-TO-END mit Claude Code: Du nennst ein Thema, der Agent recherchiert, waehlt den staerksten Angle, baut den Slide-Bogen, holt Charaktere aus der mitgelieferten Asset-Bibliothek (oder generiert neue via Higgsfield), rendert die Slides als animierte Carousel und liefert MP4 + Cover + Preview.

Enthalten:
- **Agent** `carousel-producer` (Orchestrator, vollautonom)
- **5 Skills**: carousel-konzept, carousel-build (inkl. Stil-DNA, Motiv-Bibliothek, Render-Scripts), carousel-assets, tiefe-recherche, higgsfield-generate
- **Asset-Bibliothek** (~42 MB): Tamagotchi-Charaktere, Szenen, Katalog
- **Projekt-Vorlage** fuer den HyperFrames-Render-Stack

## Voraussetzungen

- Claude Code mit bezahltem Claude-Plan
- Node.js + npm (fuer HyperFrames-Rendering)
- ffmpeg (fuer MP4/GIF-Export), python3 (Contact-Sheets)
- Higgsfield-Account (Bild-Generierung): Connector in Claude verbinden (claude.ai, Settings, Connectors, Higgsfield) und/oder CLI (`npm install -g higgsfield`, `higgsfield auth login`)

## Installation

```bash
# 1. Dieses Verzeichnis als Marketplace hinzufuegen (Pfad anpassen)
claude plugin marketplace add /pfad/zu/carousel-producer-plugin

# 2. Plugin installieren
claude plugin install carousel-producer@skaile
```

Dann in Claude Code:

```
/carousel-producer:setup
```

Das Setup kopiert Agent, Skills, Asset-Bibliothek und Projekt-Vorlage an ihre Zielorte (`~/.claude/agents/`, `~/.claude/skills/`, `~/.skaile/carousel-library/`, `~/Downloads/skaile-carousel/`), sichert vorhandene Versionen automatisch und prueft die Voraussetzungen. Danach Claude Code neu starten.

## Nutzung

Einfach ein Thema nennen:

```
carousel zu KI-Automatisierung im Handwerk
```

Der Agent macht den Rest: Recherche, Konzept, Assets, Build, Render, Preview.

## Hinweise

- Die Skills erwarten die Asset-Bibliothek unter `~/.skaile/carousel-library/`. Genau dorthin installiert sie das Setup.
- Kosten: Die Bild-Generierung laeuft ueber deinen eigenen Higgsfield-Account (wenige Credits pro neuem Asset; vieles kommt aus der mitgelieferten Bibliothek).
- Der Output landet standardmaessig in `~/Downloads/<thema>-carousel/`.
