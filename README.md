# Carousel-Producer — Claude-Code-Agent

Ein Claude-Code-Agent, der aus einem einzigen Thema (oder deinem Video-Skript) einen fertigen, animierten Instagram-Karussell-Post produziert: recherchiert, wählt den value-stärksten Angle, baut 5 bis 8 Slides mit Hook, Inhalt und CTA, rendert alles (MP4 pro Slide + statische JPGs) und zeigt dir eine Preview-Gallery. Du musst nur noch posten.

Aus dem KI-Content-System-Modul der [SKAILE Academy](https://www.skool.com/skaile-academy).

## Wichtig: nicht kopieren, einrichten

Beim Setup interviewt dich Claude (Themen, Zielgruppe, Stil, CTA) und schreibt deine Antworten in eine `carousel-profil.md`. Deine Ressourcen-Bibliothek (Charaktere, Szenen, Objekte) startet **leer** und füllt sich mit jedem Post — in DEINEM Stil, nicht im Stil des Erstellers.

## Voraussetzung: Higgsfield

Dieser Producer generiert eigene Charaktere/Maskottchen, fotorealistische Cover-Szenen und Themen-Bilder über [Higgsfield](https://higgsfield.ai) (Mitgliedschaft, wenige Credits pro Bild). Ohne Higgsfield gibt es denselben Producer als reine HyperFrames-Edition — alle Slides als Code, keine Zugänge nötig: [carousel-producer-free](https://github.com/sebaskauf/carousel-producer-free).

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
skills/higgsfield-generate/     Helfer: Bild-Generierung über Higgsfield
skills/tiefe-recherche/         Helfer: Themen-Recherche mit Quellen
template/projekt/               Projekt-Vorlage (package.json, hyperframes.json, Preview-Gallery)
library/                        leere Start-Bibliothek (wird nach ~/Documents/Projects/carousel-library/ installiert)
install.sh                      Installation mit Backup, überschreibt keine fremden Skills
SETUP-PROMPT.md                 der Prompt, der alles einrichtet
```

## Voraussetzungen

- [Claude Code](https://claude.com/claude-code)
- Node.js ≥ 18 und ffmpeg (fürs Rendern via [HyperFrames](https://www.npmjs.com/package/hyperframes)), python3 (Kontaktbogen/Katalog)
- [Higgsfield](https://higgsfield.ai)-Mitgliedschaft (wenige Credits pro Bild)

## Lizenz

MIT (siehe [LICENSE](LICENSE)).

Gebaut von [Sebastian Kauffmann](https://github.com/sebaskauf) (SKAILE) mit Claude Code.

## Mit Agentic OS: eigener Tab im Cockpit

Nutzt du das Agentic OS aus der Academy, kannst du deine Carousels dort als
eigenen **CAROUSEL-Tab** sehen: Projektliste, Slide-Vorschau, und der
`carousel-producer` als festes Terminal daneben.

Der Tab liegt in [`agentic-os-tab/`](agentic-os-tab/) und wird beim Setup
eingebaut. Er ist **optional** und läuft ab Plugin-Version v0.2.0, ohne dass am
übrigen Cockpit etwas geändert wird. Dafür brauchst du Node.js. Der zweite Block
in [SETUP-PROMPT.md](SETUP-PROMPT.md) erledigt das.

