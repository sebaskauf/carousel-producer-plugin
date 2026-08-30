# Carousel-Producer — Claude-Code-Agent

Ein Claude-Code-Agent, der aus einem einzigen Thema (oder deinem Video-Skript) einen fertigen, animierten Instagram-Karussell-Post produziert: recherchiert, wählt den value-stärksten Angle, baut 5 bis 8 Slides mit Hook, Inhalt und CTA, rendert alles (MP4 pro Slide + statische JPGs) und zeigt dir eine Preview-Gallery. Du musst nur noch posten.

Aus dem KI-Content-System-Modul der [SKAILE Academy](https://www.skool.com/skaile-academy).

## Wichtig: nicht kopieren, einrichten

Beim Setup interviewt dich Claude (Themen, Zielgruppe, Stil, CTA) und schreibt deine Antworten in eine `carousel-profil.md`. Deine Ressourcen-Bibliothek (Charaktere, Szenen, Objekte) startet **leer** und füllt sich mit jedem Post — in DEINEM Stil, nicht im Stil des Erstellers.

## Zwei Modi

| | Voll-Modus (Higgsfield) | Free-Modus |
|---|---|---|
| Slides (Code-Animationen) | ✓ | ✓ |
| Eigene Charaktere / Maskottchen | ✓ | – |
| Fotorealistische Cover-Szenen | ✓ | – |
| Themen-Bilder / Mockups | ✓ | – |
| Kosten | Higgsfield-Mitgliedschaft + wenige Credits pro Bild | komplett kostenlos |

Der Setup-Prompt fragt dich, welchen Modus du willst — wechseln geht jederzeit über die `carousel-profil.md`.

## Installation

Den kompletten Prompt aus [`SETUP-PROMPT.md`](SETUP-PROMPT.md) in Claude Code kopieren. Claude installiert Agent + Skills, führt das Interview und beweist das Setup mit einem gerenderten Beispiel-Slide in deinem Look.

## Benutzung (nach dem Setup)

```
carousel zu [THEMA]
```

Oder mit deinem Video-Skript als Input (Repurposing), oder "recherchier ein Thema und mach ein Carousel draus".

## Was drin ist

```
agent/carousel-producer.md      Orchestrator-Agent (Setup-Interview, Pipeline, Qualitäts-Bar)
skills/carousel-konzept/        Thema → Angle → Slide-Spec (das "Gehirn")
skills/carousel-build/          Slide-Spec → gebaute + gerenderte Slides (Stil-DNA, Patterns, Motive, Render-Scripts)
skills/carousel-assets/         Asset-Bibliothek: reuse oder generieren (Higgsfield), Background-Cut, Katalog
skills/higgsfield-generate/     Helfer: Bild-Generierung (nur Voll-Modus genutzt)
skills/tiefe-recherche/         Helfer: Themen-Recherche mit Quellen
template/projekt/               Projekt-Vorlage (package.json, hyperframes.json, Preview-Gallery)
library/                        leere Start-Bibliothek (wird nach ~/Documents/Projects/carousel-library/ installiert)
install.sh                      Installation mit Backup, überschreibt keine fremden Skills
SETUP-PROMPT.md                 der Prompt, der alles einrichtet
```

## Voraussetzungen

- [Claude Code](https://claude.com/claude-code)
- Node.js ≥ 18 und ffmpeg (fürs Rendern via [HyperFrames](https://www.npmjs.com/package/hyperframes)), python3 (Kontaktbogen/Katalog)
- Optional: [Higgsfield](https://higgsfield.ai)-Mitgliedschaft für den Voll-Modus

## Lizenz

MIT (siehe [LICENSE](LICENSE)).

Gebaut von [Sebastian Kauffmann](https://github.com/sebaskauf) (SKAILE) mit Claude Code.
