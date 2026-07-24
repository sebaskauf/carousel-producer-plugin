# Stil-DNA — SKAILE / Claude-Code-Editorial-Carousel

Quelle der Wahrheit fuer den Look. Lies das, bevor du eine Slide baust. Lege diese Werte auch als
`design.md` ins Projekt (HyperFrames liest `design.md` automatisch).

## WICHTIG: Look ist Brand, der letzte Post ist NICHT die Vorlage
Diese Stil-DNA beschreibt unseren **wiedererkennbaren Look** (Brand). Den haelt jeder Post. Was ein
einzelner frueherer Post daraus gemacht hat (welche Motive, welche Slide-Reihenfolge, welches
Cover-Bild, welche Charaktere) ist **nur ein Beispiel fuer dieses eine Thema**, nie eine Schablone
fuer das naechste.

**Immer gleich (Brand, Wiedererkennung):**
- Cream-Hintergrund, Editorial-Ruhe, Serif-Headlines + Mono-Kicker.
- Terracotta-3D-Maskottchen-Look (`>‹`-Augen, glossy clay) als Figuren-Sprache.
- Handgezeichnete Marks (Kringel/Unterstrich/Highlighter) als Akzent, sparsam.
- Farbpalette + Fonts (unten).

**Jedes Mal NEU gedacht (pro Thema, nie vom letzten Post abgekupfert):**
- Das visuelle Kern-Konzept / die Metapher fuer DIESES Thema.
- Welche Motive sinnvoll sind (ein VS-Streit nur bei echtem Streit, ein Charakter-Lineup nur wenn es
  wirklich N Figuren gibt, ein Terminal nur bei echtem Ablauf). Frei neue Visualisierungen erfinden
  ist ausdruecklich erwuenscht (Mockups, nachgestellte Screenshots, Diagramme, Flows, Zeitachsen ...).
- Das Cover-Bild: muss SPEZIFISCH zum Thema passen (siehe carousel-assets). Vorhandenes nur bei
  spezifischem Fit, sonst generieren. Nicht dasselbe Bild aus Bequemlichkeit fuer jedes Thema.
- Die Slide-Anzahl (vom Value getrieben, oft 5-6, nicht automatisch 8).

**Hartes Don't:** Den letzten Post nicht reproduzieren. Wenn ein Motiv/Bild/Aufbau 1:1 aus dem vorigen
Carousel wiederkaeme, ist das ein Warnsignal: erst begruenden warum es HIER zwingend ist, sonst neu
denken. Form verstehen (warum war es dort richtig?), nicht kopieren.

## Format
- 1080 x 1350 px (4:5, Instagram-Portrait). Cover statisch, Body-Slides animiert.
- Jede Slide eine eigenstaendige Composition, Dauer ~3.6-4.8s, Settle nach ~2s.

## Farben
| Token | Hex | Einsatz |
|---|---|---|
| bg-cream | `#F2EDE3` | Body-Hintergrund |
| paper-glow | `radial-gradient(120% 70% at 50% 0%, rgba(255,255,255,.55), transparent 60%)` | sanfter Lichtkegel oben |
| ink | `#1A1A1A` | Headline/Text |
| accent | `#C2410C` | Kicker, Akzentwort, Marks (Body) |
| accent-bright | `#FF8A4C` | Cover-Akzent, helle Marks |
| muted | `#5A5446` / `#8A7E6B` | Fliesstext, Sub |
| page-num | `#B3A892` | Seitenzahl unten rechts |
| window | `#FFFFFF` | Karten/Fenster |
| terminal-bg | `#181410` / Bar `#241d16` | Terminal-Fenster |
| traffic | rot `#FF5F57` gelb `#FEBC2E` gruen `#28C840` | Fenster-Punkte |
| cover-dark | `linear-gradient(168deg,#3a2418,#2a1812,#1d100b)` | Cover-Scrim/Fallback |

## Fonts (alle lokal auf macOS verfuegbar -> rendern sauber)
- **Headline (Serif):** `Georgia, "Times New Roman", serif`, weight 600. (Newsreader NICHT embedden -> faellt auf Georgia zurueck, also gleich Georgia nehmen.)
- **Body/UI:** `Inter, -apple-system, sans-serif`.
- **Code/Terminal/Kicker:** `"JetBrains Mono", Menlo, monospace`.
- **Cover-Display ("7"):** `Impact, "Arial Narrow", sans-serif`.
- **Cover-Handschrift ("streiten."):** `"Bradley Hand", "Marker Felt", cursive`.
- Cover lebt vom **Font-Mix** (Serif-Italic + Display + Handschrift) + Marks. Body-Slides ruhiger: Serif-Headline + Mono-Kicker.

## Abstaende / Layout
- Padding ~92-104px oben, 76-84px seitlich.
- Kicker: 24px, letter-spacing .26em, uppercase, accent, weight 800.
- Headline: 78-104px je nach Zeilenzahl, line-height ~1.0, letter-spacing -0.015em.
- Seitenzahl: unten rechts, Mono, `0X / 08`.
- **Inhalt vertikal zentrieren** (`flex:1` Mittelblock mit `justify-content:center`), NICHT mit
  `margin-top:auto` ans untere Ende kleben — das war der Haupt-Bug (tote Flaeche, Charaktere am Footer).
- Tote Flaeche aktiv fuellen (Charaktere groesser, Motive, blinde-Flecken-Marker).
- **Der Slide-Wrapper MUSS den echten 1080x1350-Viewport fuellen** (`position:absolute; inset:0` auf
  dem .wrap/.scene-content). `width:100%;height:100%` reicht NICHT: die HyperFrames-Container
  (#root/#scene/.clip) sind beim Render NICHT 1350px hoch, also kollabiert `height:100%` auf
  Content-Hoehe -> der ganze Inhalt klebt oben, der absolute Footer (`bottom:Xpx`) schwebt mittig im
  Bild, unten bleibt ~35% tote Cream-Flaeche. Mit `position:absolute;inset:0` greift der
  Initial-Containing-Block (echte 1080x1350) und `flex:1` verteilt korrekt. (Second-Brain-Build
  2026-06-25, kostete eine Re-Render-Runde ueber alle Body-Slides.)
- **Trailing-Punkt hinter einem inline-block-Mark** (Kringel/Highlight/Unterstrich-Wort): bei langer
  oder zentrierter Headline bricht das "." auf eine eigene Zeile um und schwebt als verwaister Punkt.
  Entweder Punkt weglassen oder Headline-Breite/Font so waehlen, dass Wort+Punkt sicher in die Zeile passen.

## Animation
- Entrances mit variierten Eases (power2/power3/expo/back), Offset erste Anim ~0.1-0.3s.
- Sanftes Idle-Bob auf Charakteren (`y:-12, yoyo, repeat:1`), endliche Repeats.
- Marks zeichnen sich per `stroke-dashoffset` ein (siehe motif-library).

## Don'ts (teuer gelernt)
- **Keine smooth-SVG- oder Pixel-SVG-Tamagotchis selbst bauen.** Mehrfach verworfen ("0 wie das
  Original"). Echte 3D-Terracotta-Tamagotchis kommen aus der Bibliothek (Higgsfield + Cutout).
- **Kein Text in KI-Bildern.** Bildmodelle verhunzen ihn -> Text immer als HTML.
- **Keine Textwand.** Weniger Text, mehr Visual. Copy auf das Noetigste.
- **Keine Em-Dashes.** Echte Umlaute ä/ö/ü/ß. Voice = Sebastian.
- **Marks sparsam.** Ein Schluesselwort markieren, nicht jedes.
- Kein Newnano/Neon/Cyberpunk, kein reines Schwarz als BG.

## Slide-Bogen (ein Werkzeugkasten, KEINE Pflicht-Reihenfolge)
Cover (Hook) -> Problem -> Idee -> Demo/Beispiel -> Streit/Kontrast -> Payoff -> CTA ist EIN bewaehrter
Bogen, nicht das Schema fuer jeden Post. Nur Cover + CTA sind gesetzt. Dazwischen waehlst du die
Slides, die das Thema wirklich braucht (oft 5-6). Reihenfolge, Anzahl und Motive richten sich nach dem
visuellen Konzept (siehe carousel-konzept), nicht nach diesem Default. Patterns sind frei kombinierbar
und du darfst neue Visualisierungen bauen, die hier gar nicht aufgelistet sind.

## Quality-Bar / offene Verbesserungen (aus dem Council-Prototyp)
- **Terminal** darf realistischer/cleaner sein (echte Prompt-Sequenz, gute Mono-Ausrichtung, Cursor-Blink).
- **Cursor** weicher reinfahren + klar erkennbarer Klick (Ring + Dip), nicht zu hektisch.
- **Streit/Clash-Slide** klarer als Face-off inszenieren (zwei Lager, Burst, kurzer Shake), Sprechblasen duerfen NICHT aus der Spalte laufen (kurze Quotes, Spaltenbreite begrenzen).
Diese drei sind in `motif-library.md` bereits in der verbesserten Fassung.
