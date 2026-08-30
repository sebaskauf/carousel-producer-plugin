---
name: carousel-build
description: "Baut aus einer Slide-Spec eine fertige animierte Social-Carousel (Instagram/LinkedIn) im Stil des Nutzers (Beispiel-Look: Claude-Code-Editorial) und rendert sie zu MP4 + Cover-JPG + optionalem <5MB-GIF + Preview-Gallery. Enthaelt die Stil-DNA und eine Motiv-Bibliothek (handgezeichnete Kringel/Unterstriche/Highlighter, Cursor-Klick, Terminal-Fenster, Charakter-Lineup, Clash/VS, Typewriter-Prompt). Nutze diesen Skill IMMER wenn aus einem Slide-/Carousel-Konzept echte Slides gebaut, gestylt oder gerendert werden sollen, wenn der carousel-producer-Agent eine Slide-Spec uebergibt, oder wenn jemand 'Carousel bauen', 'Slides rendern', 'animierte Slideshow' sagt. Auch wenn nur 'mach daraus die Slides' gesagt wird und ein Konzept/Spec vorliegt."
---

# Carousel Build — Slide-Spec zu gerenderter Carousel

Dieser Skill verwandelt eine **Slide-Spec** (was auf jeder Slide steht + welche Assets sie braucht)
in fertige, animierte Carousel-Slides im Stil des Nutzers und rendert sie aus.
Er ist das "Werk" der Carousel-Pipeline. Das "Gehirn" (Thema -> Konzept -> Slide-Spec) ist
[[carousel-konzept]], die Charaktere/Objekte liefert [[carousel-assets]], gebaut wird mit dem
`hyperframes`-Skill.

Warum dieser Skill existiert: Ohne festen Stil und feste Bausteine wuerde jeder neue Post anders
und schlechter aussehen. Dieser Skill konserviert das Handwerk, das funktioniert. Der LOOK kommt aus
zwei Quellen: der mitgelieferte Beispiel-Look (`references/stil-dna.md`: Editorial-Serif auf Cream,
Terracotta-Maskottchen, handgezeichnete Marker) plus die Overrides aus der `carousel-profil.md` des
Nutzers — seine Farben, sein Charakterstil, seine Stimmung schlagen den Beispiel-Look.

## Voraussetzungen

- `hyperframes`-Skill (HTML -> Video-Engine). CLI: `npx --yes hyperframes@0.6.98 render -c <slide>.html -o renders/<slide>.mp4`
- `ffmpeg` (Frame-Export, GIF-Konvertierung)
- Charaktere/Objekte als transparente PNGs (von [[carousel-assets]] in `assets/cut/`)
- Fonts: Georgia (Serif), Impact (Display), "Bradley Hand" (Handschrift), JetBrains Mono/Menlo — auf macOS vorinstalliert; auf anderen Systemen aehnliche installierte Fonts in `design.md` eintragen

## Eingabe: die Slide-Spec

Erwarte ein Array von Slides. Pro Slide mindestens: `n` (Nummer), `pattern` (Archetyp, siehe unten),
`kicker`, `headline`, optionale `copy`/`sub`/Felder, und `assets` (welche Charaktere/Objekte gebraucht
werden). Beispiel:

```json
{ "total": 8, "format": "instagram", "slides": [
  { "n": 1, "pattern": "cover", "kicker": "...", "headline": "...", "assets": ["scene:selfie"] },
  { "n": 3, "pattern": "lineup", "kicker": "Die Idee", "headline": "Sieben Berater statt einer.",
    "mark": "circle:einer", "assets": ["char:role-1..role-7"] }
] }
```

Wenn keine formale Spec vorliegt, aber Inhalt + Reihenfolge klar sind: leite die `pattern` pro Slide
selbst ab (Cover zuerst, CTA zuletzt, dazwischen passend) und baue los.

## Ablauf

1. **Projekt vorbereiten.** Arbeite in einem HyperFrames-Projekt-Ordner (z.B.
   `~/Downloads/<thema>-carousel/`). Falls keiner existiert: die Projekt-Vorlage
   `~/Documents/Projects/carousel-producer-plugin/template/projekt/` kopieren (sie hat schon
   `package.json`, `hyperframes.json`, `preview-gallery.html`) oder `npx hyperframes init`. Lege
   `design.md` an: Stil-DNA als Basis, dann die Overrides aus `carousel-profil.md` (Farben,
   Charakterstil, hell/dunkel) drueberschreiben.
2. **Assets sicherstellen.** Für jeden `assets`-Eintrag pruefen, ob das PNG in `assets/cut/` liegt.
   Fehlt etwas -> [[carousel-assets]] aufrufen (reuse aus Bibliothek oder neu generieren).
3. **Pro Slide eine `slide-<n>.html` bauen.** Jede Slide ist eine eigenstaendige HyperFrames-
   Composition (1080x1350, kein `<template>`-Wrapper, `data-composition-id="main"`,
   `window.__timelines["main"]=tl`). Stil-DNA + den passenden Pattern + die noetigen Motive
   verwenden. Layout-vor-Animation (erst End-Zustand als statisches HTML/CSS, dann Entrances).
   Lies dafuer:
   - `references/stil-dna.md` — Farben, Fonts, Abstaende, Don'ts (IMMER zuerst)
   - `references/slide-patterns.md` — die Archetypen (cover, problem, lineup, list, terminal, clash, verdict, cta)
   - `references/motif-library.md` — die wiederverwendbaren Bausteine (Kringel, Unterstrich, Highlighter, Cursor, Terminal, Lineup, Clash, Typewriter) als Copy-Paste-Code
4. **Rendern + verifizieren.** Render jede Slide zu MP4, zieh einen Settle-Frame raus, bau einen
   Kontaktbogen und SCHAU IHN AN, bevor du fertig meldest. Nutze `scripts/render-all.sh` und
   `scripts/contact-sheet.py`. Typische Fehler: Text laeuft aus der Spalte (Spaltenbreite/Font
   pruefen), tote Abstaende (Inhalt vertikal zentrieren statt `margin-top:auto` ans Ende kleben),
   Charaktere ueberlappen Footer.
5. **Exportieren.** Statische JPGs (`export-static/slide-<n>.jpg`, voller Aufloesung, fuer
   LinkedIn-PDF), optional <5MB-Loop-GIFs (`scripts/gif.sh`, palettegen/paletteuse), und die
   `preview-gallery.html` aktualisieren (lädt `renders/slide-<n>.mp4`).
6. **Ausgeben.** Gallery oeffnen (`open preview-gallery.html`) + Kontaktbogen an den User schicken.

## Harte Qualitaets-Regeln (sonst sieht es billig aus)

- **Cover = statisch + scroll-stoppend.** Im Voll-Modus: echtes generiertes Bild (Szene/Mockup)
  full-bleed + dunkler Scrim + Text-Mix aus mehreren Fonts (Serif-Italic + Display + Handschrift) +
  mind. einem handgezeichneten Mark. Im Free-Modus (`higgsfield: nein` im Profil): grosser
  Font-Mix + ein starkes HTML-Motiv (Terminal, Diagramm, CSS-Objekt) + Mark — auch ohne Foto
  scroll-stoppend. KEINE Animation noetig. Details: Pattern `cover`.
- **Body-Slides: Text via HTML, nie im KI-Bild.** Bildmodelle verhunzen eingebetteten Text.
- **Weniger Text, mehr Visual.** Wenn eine Slide nach Textwand aussieht, kuerzen und ein Motiv/
  Charakter die Aussage tragen lassen. Tote Flaeche ist ein Bug, kein Feature.
- **Echte generierte Charaktere** aus `assets/cut/` im Charakterstil des Nutzers (Beispiel-Look:
  3D-Terracotta, `>‹`-Augen). NIE smooth-SVG-Blobs oder Pixel-SVG selbst bauen — das wurde mehrfach
  verworfen. (Free-Modus: Slides funktionieren ohne Charaktere — Motive tragen die Aussage.)
- **Motive bewusst, nicht zufaellig.** Kringel/Unterstrich/Highlighter heben EIN Schluesselwort
  hervor, nicht drei. Cursor klickt etwas Konkretes. Terminal zeigt echten Ablauf.
- Echte Umlaute (ä/ö/ü/ß), keine Em-Dashes, Voice = dein Nutzer (sein voice-profil, siehe `references/voice-regeln.md`).

## HyperFrames-Tabus (brechen den Render)

Kein `Math.random`/`Date.now`, keine `repeat:-1` (endlich rechnen), Timeline synchron + `{paused:true}`,
nur visuelle Properties animieren, `gsap.set` auf spaeter-erscheinende Clips vermeiden (stattdessen
`tl.set(...)` im Timeline-Verlauf). Details im `hyperframes`-Skill.

## Output-Formate

- **Instagram-Carousel (primaer):** pro Slide ein MP4 (Cover als statisches MP4/JPG). Reihenfolge = Slide-Nummer.
- **LinkedIn:** statische JPGs als Dokument-PDF, ODER <5MB-Loop-GIFs (animiert nur <5MB & <400 Frames).

## Bei Korrekturen

Wenn dein Nutzer eine Slide kritisiert: erst den Settle-Frame anschauen, das konkrete Problem benennen
(Abstand? Ausschnitt? Motiv?), gezielt fixen, neu rendern, gegenpruefen. Wiederkehrende Lektionen
gehoeren in die `carousel-profil.md` bzw. `design.md` des Nutzers (Stil) oder in `references/stil-dna.md` (Handwerk).
