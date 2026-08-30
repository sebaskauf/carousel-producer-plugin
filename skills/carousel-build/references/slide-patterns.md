# Slide-Patterns — die Archetypen

Jede Slide bekommt einen `pattern`. Hier steht Layout + welche Motive (siehe motif-library.md). Maße
1080x1350. Padding/Farben aus stil-dna.md. Default-Reihenfolge: cover, problem, idea/lineup, list,
terminal, clash, verdict, cta — aber flexibel nach Konzept.

## cover (statisch, Pflicht, Slide 1)
Scroll-Stopper. Generiertes Bild (Selfie/Szene) full-bleed (`object-fit:cover`) + Vignette +
oben/unten Scrim. Headline unten ueber dem Scrim als **Font-Mix**: ein Wort Serif-Italic, ein
Display-Wort (Impact) mit Hand-Kringel, ein Serif-Bold-Wort, ein Handschrift-Wort mit Highlighter +
Unterstrich. Kicker (Mono) oben mit Unterstrich. Kleiner "weiterswipen ->"-Pill. KEINE Animation
(leere `paused` Timeline registrieren). Export als JPG + statisches MP4 fuer die Gallery.

## problem (Slide 2-ish)
"Eine Meinung + blinde Flecken". EIN grosser Charakter mittig + Blind-Spot-Marker (`?`, Motiv 10)
fuellen den Raum + eine kurze Sprechblase ("Mach es so."). Punchline unten mit Unterstrich auf dem
Schluesselwort. Wenig Text.

## lineup / idea (z.B. "X statt Y")
Headline mit Hand-Kringel auf dem Akzentwort + eine kurze Lead-Zeile + Charakter-Lineup (Motiv 7,
2 Reihen wenn >=5 Charaktere) mittig. Quelle/Methode als kleiner Mono-Chip unten links. Charaktere
GROSS und zentriert, nicht am Footer.

## list (die Rollen/Punkte einzeln)
Vertikale Liste: pro Zeile [Charakter 100px] [Label fett] [Frage/Subline muted]. Stagger-Entrance
von links. Gut fuer "die N Stimmen / die N Schritte". Saubere, ruhige Slide (Benchmark-Qualitaet).

## terminal / demo
Dunkles Terminal-Fenster (Motiv 5) mit echtem Ablauf (Prompt -> System -> Output -> Verdikt) ODER
helles Typewriter-Fenster (Motiv 6) wenn der User eine Frage eintippt. Cursor-Klick (Motiv 4) auf
den `/command`. Headline darueber. Das ist der "Beweis"-Slide.

## clash / streit
Face-off (Motiv 8): zwei Lager, mittiger Burst + VS, kurzer Shake, Bicker-Jitter. KURZE Quotes,
`max-width` auf Blasen. Visualisiert Konflikt/Kontrast statt ruhigem Chat.

## verdict / payoff
Weisse Karte mittig mit Empfehlung (Serif) + Feldern (Konfidenz/Risiko/naechster Schritt) +
handgezeichneter "approved"-Haken (gruen) oben rechts. Optional Charakter als Stempel.

## cta (Pflicht, letzte Slide)
Headline + 1 kurze Zeile + schwarzer Pill-Button (die CTA-URL/das Keyword aus der carousel-profil.md, mit accent-URL) +
Signatur-Scrawl (Motiv 9) als Sign-off + Charakter-Crowd dicht darunter (nicht am Footer kleben,
Abstand eng halten). Klarer naechster Schritt.

## Allgemein
- Erst End-Zustand als statisches HTML/CSS (Layout-vor-Animation), dann Entrances.
- Settle nach ~2s, dann sanftes Idle-Bob.
- Seitenzahl `0X / 08` unten rechts (Mono, `#B3A892`).
- Nach dem Bauen: Settle-Frame anschauen, Ueberlauf/tote-Flaeche/Footer-Overlap pruefen, fixen.
