---
name: carousel-konzept
description: "Macht aus einem Thema (+ optionaler Recherche) ein fertiges Carousel-Konzept: filtert value-basierte, zielgruppen-relevante Angles, waehlt den staerksten, baut den Slide-Bogen (Hook bis CTA) und schreibt die Copy im Tone-of-Voice des Nutzers (sein voice-profil). Output ist eine Slide-Spec (JSON), die der carousel-build-Skill direkt baut. Nutze diesen Skill IMMER wenn aus einem Thema ein Carousel-/Slideshow-/Instagram-Post-Konzept werden soll, wenn der carousel-producer-Agent ein Thema uebergibt, oder wenn jemand 'Konzept fuer einen Carousel-Post', 'welcher Angle', 'Slides-Outline', 'was posten wir zu X' sagt. Value-first, Audience und CTA kommen aus der carousel-profil.md des Nutzers."
---

# Carousel Konzept — Thema zu Slide-Spec

Das "Gehirn" der Carousel-Pipeline. Du bekommst ein Thema (oft + Recherche-Fakten) und lieferst ein
**Konzept**: den staerksten value-basierten Angle und eine fertige **Slide-Spec**, die [[carousel-build]]
direkt baut. Die Charaktere/Objekte liefert [[carousel-assets]].

Warum es das gibt: Bei vollautonomem Betrieb gibt es keinen Zwischenstopp. Die Qualitaet des ganzen
Posts haengt daran, ob HIER der richtige Angle, der richtige Bogen und die richtige Copy entstehen.
Deshalb stecken die Qualitaets-Prinzipien (Value-first, Bogen) in diesem Skill — Audience, Voice und CTA deines Nutzers kommen aus `~/Documents/Projects/carousel-library/carousel-profil.md` (IMMER zuerst lesen).

## Audience (fuer wen)
Steht in der `carousel-profil.md` deines Nutzers (Themen + Zielgruppe). Lies sie und denk sie bei
jedem Angle mit. Was fuer praktisch jede Audience gilt: Sie riecht Marketing-Geschwafel sofort. Sie
belohnt ein klares Aha, ein konkretes Vorgehen, ein ehrliches "so mach ich das". Sie bestraft
Buzzwords, Overclaim, "Game-Changer"-Sprache und Text ohne Substanz.

## Schritt 1: Angles finden + value-ranken
Aus Thema + Recherche 3-5 moegliche Angles ableiten. Jeder Angle = eine konkrete Versprechung an die
Audience. Bewerte jeden nach:
- **Value-Dichte:** Lernt die Person etwas Anwendbares? (am wichtigsten)
- **Spezifitaet:** Konkret (ein Workflow, ein Skill, eine Entscheidung) schlaegt allgemein ("KI ist maechtig").
- **Hook-Kraft:** Stoppt Slide 1 den Daumen? Spannung/Kontrast/ueberraschende These.
- **Audience-Fit:** Trifft es einen echten Schmerz/Wunsch der Builder/Founder.
- **Eigenstaendigkeit:** Kann dein Nutzer glaubwuerdig "so mach ich das" sagen (echte Praxis > Theorie)?
Waehle den staerksten Angle. Nenne kurz die Alternativen + warum der gewaehlte gewinnt (1-2 Saetze).

**Hero = der geloeste Pain, nicht der Mechanismus.** Fuehre mit dem, was die Person FUEHLT (Tokens/Geld
sparen, Zeit, weniger Bugs, weniger Stress), nicht mit dem WIE (z.B. "schreibt weniger Code"). Das WIE
ist eine Innen-Slide, der Pain gehoert aufs Cover. Bsp. Ponytail-Skill: Hero = "bis zu 94% weniger
Tokens" (Pain: Usage-Limits/Kosten), nicht "schreibt weniger Code" (nur das Nebenprodukt). Frag dich:
warum ist der Person das Ergebnis nachts wichtig? Das ist der Hook.

**Zahlen ehrlich, aber plakativ:** Hat eine Metrik eine hohe Spitze und einen mageren Schnitt, ist der
Spitzenwert mit **"bis zu X%"** ok (ehrliche Decke) + ein konkretes Beispiel ("Beispiel: ein
Datumsfeld, 404->23"). NICHT den Schnitt danebenstellen wenn er der Spitze widerspricht (wirkt
unsauber). Nie eine Zahl behaupten, die die Quelle nicht hergibt. Bei aufgeblaehten Marketing-Zahlen
(Single-Shot-Artefakte o.ae.) lieber den belastbaren Wert + "bis zu" als den Fake. Im Zweifel dem
Nutzer kurz den Tradeoff nennen (No-Overclaim vs. plakativ).

Anti-Pattern: kein generischer Listicle ohne Substanz, kein reiner News-Aufguss, kein Clickbait ohne Einloesung.

## Schritt 2: Visuelles Konzept (Pflicht, das Wichtigste gegen Wiederholung)
Bevor du Slides planst, entscheide das EIGENE visuelle Konzept fuer DIESES Thema. Der Look ist Brand
(Cream, Serif, Maskottchen, Marks) und bleibt - aber Aufbau, Motive, Cover und Slide-Anzahl werden
pro Thema neu gedacht. Beantworte explizit:
- **Metapher:** Was ist das eine zentrale Bild / die Metapher, die dieses Thema traegt? (z.B. fuer
  "Agentic OS" eher Schichten/Kernel/ein nachgestelltes OS-Interface als ein Berater-Streit.)
- **Themen-eigene Bildideen:** Nenne 2-3 Visualisierungen, die zu DIESEM Thema gehoeren und im
  letzten Post NICHT vorkamen. Du bist NICHT auf vorhandene Motive begrenzt - erfinde frei (Mockups,
  nachgestellte Screenshots, Diagramme, Schritt-Flows, Zeitachsen, Splitscreens, Vergleiche ...).
- **Anti-Repetition-Check:** Wuerde ein Motiv (VS-Streit, Charakter-Lineup, Terminal), ein Aufbau
  oder das Cover 1:1 aus dem letzten Carousel wiederkehren? Dann nur behalten, wenn es HIER inhaltlich
  zwingend ist (ein VS nur bei echtem Streit, ein Lineup nur bei echten N Figuren). Sonst neu denken.
  Form verstehen (warum war es im Beispiel richtig?), nicht kopieren.
- **Free-Modus beachten:** Steht in der carousel-profil.md `higgsfield: nein`, plane NUR Visuals, die HyperFrames als Code kann (Typo, Terminal, Diagramme, Flows, Marks, CSS-Objekte) — keine `NEW(...)`-Asset-Anforderungen, kein generiertes Cover (stattdessen Typo-/Motiv-Cover).
- **Neue Assets bewusst einplanen (nur Voll-Modus):** Wenn das Konzept ein Bild/Cover/Mockup braucht, das die
  Bibliothek nicht hat, signalisiere den Bedarf in der Spec (z.B.
  `assets:["scene:cover-NEW(<beschreibung>)", "object:mockup-NEW(<beschreibung>)"]`). carousel-assets
  entscheidet dann reuse vs. generate. Das Cover ist IMMER neu, nie das vom letzten Post.

## Schritt 3: Slide-Bogen bauen (Anzahl vom Thema, nicht vom Default)
Lege die Slide-Anzahl fest, die der Value WIRKLICH braucht. Oft 5-6, manchmal 7-8. Lieber weniger
Slides mit Wucht als ein aufgefuellter Default. Nur **Cover + CTA** sind Pflicht, ein Beweis-/Demo-
Slide (konkretes Beispiel) ist fast immer der Value-Kern.
Werkzeugkasten an Patterns (KEINE Checkliste, frei kombinierbar, durch eigene Visualisierungen
ergaenzbar):
- **cover** — Hook. Die ueberraschende These / das Versprechen.
- **problem** — der Schmerz / die alte Welt / der blinde Fleck.
- **idea/lineup** — die Kern-Idee / der Shift.
- **list** — die Bausteine / Schritte / Stimmen einzeln.
- **terminal/demo** — der Beweis: konkret, am Beispiel.
- **clash/contrast** — Spannung: alt vs neu, Lager gegeneinander, Einwand + Antwort.
- **verdict/payoff** — das Ergebnis / die Empfehlung / der Gewinn.
- **cta** — der konkrete naechste Schritt. WAS da steht und WIE es formuliert ist, kommt aus der carousel-profil.md (Keyword kommentieren, Link, folgen).
Ein Pattern kommt nur rein, wenn dein visuelles Konzept (Schritt 2) es traegt, nicht weil es im
letzten Post war.

## Schritt 4: Copy schreiben (Tone-of-Voice)
Nutze das voice-profil deines Nutzers (Skill `voice-profil` oder voice.md), falls vorhanden — sonst: direkt, kurze Saetze, konkret, kein Corporate. Immer: keine Em-Dashes, echte Umlaute, "ich"-Perspektive wo es passt. Pro Slide: kurzer Kicker, knackige Headline
(Serif-tauglich), minimal Copy. **Weniger Text, mehr Visual** — wenn eine Slide nach Textwand klingt,
kuerzen und das Visual die Aussage tragen lassen. Kein Overclaim, keine erfundenen Zahlen.

## Schritt 5: Slide-Spec ausgeben (Schnittstelle zu carousel-build)
Beginne mit einer Zeile zum visuellen Konzept (Metapher + welche Bildideen neu/themen-eigen sind),
dann gib das JSON aus (carousel-build baut es direkt). `total` ist die vom Thema getriebene Anzahl,
NICHT automatisch 8:
```json
{
  "thema": "...",
  "angle": "der gewaehlte Angle in einem Satz",
  "visuelles_konzept": "die Metapher + die themen-eigenen Bildideen in 1-2 Saetzen",
  "alternativen": ["...", "..."],
  "total": 6,
  "format": "instagram",
  "slides": [
    { "n": 1, "pattern": "cover", "kicker": "...", "headline": "...", "sub": "...",
      "mark": "circle:<wort>", "assets": ["scene:cover-NEW(<themen-eigenes Cover, nie das letzte>)"] },
    { "n": 2, "pattern": "problem", "kicker": "...", "headline": "...", "punch": "...",
      "mark": "underline:<wort>", "assets": ["char:<rolle> wenn er WIRKLICH passt"] },
    { "n": 4, "pattern": "terminal", "kicker": "Das Beispiel", "headline": "...",
      "terminal": { "prompt": "...", "lines": ["..."], "verdict": "..." }, "assets": [] },
    { "n": 6, "pattern": "cta", "kicker": "Dein Zug", "headline": "...", "cta": "<CTA aus carousel-profil.md>",
      "assets": ["char:lineup wenn passend"] }
  ]
}
```
Felder pro Slide: `n`, `pattern` (cover|problem|lineup|list|terminal|clash|verdict|cta oder ein
eigenes), `kicker`, `headline`, plus pattern-spezifisch (`sub`/`copy`/`punch`/`lines`/`fields`/`cta`/
`terminal`), `mark` (optional: circle/underline/highlight + Wort), `assets` (was carousel-assets
liefern muss). Asset-Syntax: vorhandenes wiederverwenden `char:<rolle>`/`char:lineup`/`scene:<id>`;
NEU generieren `scene:cover-NEW(...)`/`object:mockup-NEW(...)`/`char:NEW(...)`. Cover immer NEU.
Halte Headlines kurz genug fuer die Serif-Headline (passt in 1-2 Zeilen).

## Output an den Aufrufer
Kurz: gewaehlter Angle + warum, dann die Slide-Spec (JSON). Wenn der carousel-producer-Agent ruft,
gib NUR das Konzept zurueck (er reicht es an assets + build weiter). Wenn ein Mensch ruft, erklaere
den Angle in 2 Saetzen und zeig die Slide-Outline lesbar.
