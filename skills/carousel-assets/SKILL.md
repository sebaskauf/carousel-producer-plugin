---
name: carousel-assets
description: "Verwaltet die wiederverwendbare Asset-Bibliothek fuer Carousel-Posts (Charaktere im Stil des Nutzers, Objekte, Szenen/Cover-Bilder) und entscheidet pro benoetigtem Piece, ob etwas Passendes schon existiert (wiederverwenden) oder neu generiert werden muss (via higgsfield-generate, dann Background-Cut, dann in den Katalog aufnehmen). Nutze diesen Skill IMMER wenn fuer eine Carousel/Slideshow Charaktere, Maskottchen, Tamagotchis, Objekte oder Cover-/Selfie-Bilder gebraucht werden, wenn der carousel-producer-Agent Assets anfordert, wenn jemand 'Charaktere fuer den Post', 'Maskottchen erstellen', 'Cover-Bild generieren', 'Asset-Bibliothek' sagt, oder wenn beim Slide-Bauen ein PNG in assets/cut/ fehlt. Pflegt Katalog (catalog.json) + menschlichen Index (LIBRARY.md)."
---

# Carousel Assets — katalogisierte, wiederverwendbare Bild-Bibliothek

Liefert die Bild-Bausteine fuer Carousels und haelt sie in einer **durable Bibliothek**, damit nicht
jedes Mal neu generiert wird. Kern: pro benoetigtem Piece **erst pruefen, ob die Bibliothek es schon
abdeckt** — nur wenn nicht, neu erzeugen und dann **dauerhaft aufnehmen**. So waechst die Bibliothek
organisch und bleibt guenstig + konsistent.

Bibliothek-Home: `~/Documents/Projects/carousel-library/` (Override per ENV `CAROUSEL_LIBRARY`)
```
characters/   objects/   scenes/        # transparente PNG-Cutouts (scenes: auch volle JPGs/PNGs)
catalog.json                            # maschinenlesbar (fuer den Agent)
LIBRARY.md                              # menschlicher Index, 1 Zeile pro Piece, thematisch gruppiert
```

## Kern-Logik: passt die Bibliothek zum Konzept? (sonst neu generieren)

Du bekommst vom Konzept das **visuelle Konzept** + eine Liste benoetigter Pieces. Die Bibliothek ist
ein **Angebot, KEINE Pflicht**. Maskottchen-Charaktere sind Brand und gut wiederverwendbar. Cover,
Szenen und themen-spezifische Visuals werden oft besser neu gemacht. Fuer JEDES Piece:

1. **Visuelles Konzept zuerst.** Was soll dieses Piece im Post konkret zeigen (carousel-konzept
   Schritt 2)?
2. **Katalog lesen + ehrlich pruefen** (`catalog.json` + `LIBRARY.md`): Gibt es ein Piece, das
   wirklich zu DIESEM Konzept passt? Nicht "laesst sich irgendwie umdeuten" - passt es echt? Ein
   Council-Berater ist nicht automatisch die richtige Figur fuer jedes Thema. Reuse nur, wenn das
   Piece die gewollte Bildaussage wirklich traegt.
3. **Passt -> wiederverwenden** (ins Projekt kopieren, kein Credit). **Passt nicht / Luecke -> neu
   generieren** (siehe unten), Background-Cut, **in die Bibliothek aufnehmen** (Datei + Katalog-Eintrag
   + LIBRARY.md-Zeile), dann ins Projekt kopieren.
4. **Cover muss SPEZIFISCH passen, nicht nur allgemein.** Das Cover-Bild muss genau zu DIESEM Thema
   tragen. Ein vorhandenes Asset (auch eins vom letzten Post) ist ok, WENN es spezifisch passt. Ein
   nur allgemein passendes Bild (z.B. dasselbe Gruppen-Selfie fuer jedes Thema) ist es nicht -> dann
   generieren. Die scharfe Unterscheidung "spezifisch vs. allgemein" IST die Entscheidung; dieser
   Spielraum bleibt bewusst bestehen, statt einer starren "immer neu"- oder "immer reuse"-Regel.
5. Nenne kurz + ehrlich, was wiederverwendet und was neu erzeugt wurde. **Credits sind richtig
   investiert, wenn sie Originalitaet bringen. "0 Credits" ist KEIN Qualitaetsmerkmal.**

Der Charakter-Cast deines Nutzers (verschiedene Rollen/Props, im Stil aus seiner carousel-profil.md)
ist der Brand-Seed und gut wiederverwendbar - aber nur dort, wo eine Figur inhaltlich passt, nicht
als Fueller.

## Neu generieren (nur bei echter Luecke)

Genutzt wird `higgsfield-generate` ueber die **claude.ai-Higgsfield-MCP** (Account mit Credits;
Tools `mcp__claude_ai_Higgsfield__*`). Vor jedem Run **Kosten checken** (`get_cost:true`) und kurz
nennen (harte Regel). Eine Bildgen kostet wenige Credits.

**Free-Modus:** Steht in der carousel-profil.md `higgsfield: nein`, wird NICHTS generiert. Nur
vorhandene Bibliotheks-Pieces nutzen (falls welche da sind) oder dem Aufrufer melden, dass das
Konzept ohne generierte Assets gebaut werden muss (HTML-Motive).

### Charaktere (das funktioniert)
Modell: `nano_banana_pro` (reference-driven character). Als Referenz ein bestehendes Charakter-PNG
aus `characters/` mitgeben (Rolle `image`) -> haelt den Stil. Aspekt: `1:1` fuer Einzel-Cutout.
**Leere Bibliothek (erster Lauf):** Es gibt noch keine Referenz — generiere den ERSTEN Charakter nur
aus dem Stil-Anker-Prompt (aus der carousel-profil.md des Nutzers: sein Illustrations-/Charakterstil),
lass ihn vom Nutzer abnicken, nimm ihn in die Bibliothek auf. Ab dann ist ER die Stil-Referenz fuer
alle weiteren.
Beispiel-Stil-Anker (der mitgelieferte Beispiel-Look — nur nutzen, wenn der Nutzer ihn gewaehlt hat):
> "small terracotta-orange blocky 3D mascot character, cube-ish stepped head, simple > < squint eyes,
> two short stubby legs, glossy soft-clay material, subtle white sticker outline, soft studio shadow,
> centered, plain neutral background. Distinct role: <ROLLE+PROP, z.B. 'wears round black glasses'>.
> No text, no logo, no watermark."

Distinct machen ueber EIN klares Prop/Mimik pro Charakter (Helm, Brille, Fernrohr, Herz, Kittel,
Krone, Lupe, Kopfhoerer, Kaffeetasse ...). Pro Carousel reichen meist 3-7 verschiedene.

### Cover-/Selfie-Szenen (jedes Mal eine NEUE Szene)
Modell: `nano_banana_pro`, Aspekt `3:4`, `resolution:2k`. Eine bestehende Szene als Referenz haelt den
Maskottchen-Look, aber **Setting + Komposition pro Thema variieren** (nicht immer dasselbe
City-Sunset-Gruppen-Selfie). Das Cover soll zum Thema passen: anderer Ort, andere Pose, anderes Motiv,
mal nur eine Figur, mal ein Objekt/Mockup. Negative space oben fuer den Text-Scrim, "no text". Kein
Background-Cut (full-bleed). Cover wird NIE vom letzten Post recycelt.

### Themen-Visuals, Mockups, nachgestellte Screenshots (kreativ nutzen)
Higgsfield/Nano Banana Pro (oder GPT Image 2) ist nicht nur fuer Maskottchen da. Nutze es kreativ fuer
themen-eigene Bilder: ein nachgestelltes Interface/Dashboard, ein App-/Produkt-Mockup, einen
stilisierten Screenshot (z.B. wie ein Agentic-OS-Cockpit aussehen koennte), eine abstrakte Szene zur
Metapher. Die kommen full-bleed oder in ein Fenster/Terminal im Slide. Prompt im Brand-Look halten
(warm, clean, kein Neon), **KEIN Text im Bild** (Text kommt als HTML). Aspekt passend zum Einsatz
(`3:4` Cover, `16:9`/`4:3` Fenster). Background-Cut nach Bedarf.

### Objekte (Terminal-Geraet, Telefon, Schild ...)
Einfache Objekte besser direkt als HTML bauen (Motiv-Bibliothek). Fotorealistische Objekte/Mockups
generieren (siehe Themen-Visuals).

## Background-Cut (Charaktere/Objekte -> transparentes PNG)

Nach der Generierung Hintergrund entfernen. Wege:
- `mcp__claude_ai_Higgsfield__remove_background` (wenn verfuegbar), ODER
- lokal `rembg` (`rembg i in.png out.png`) falls installiert, ODER
- `hyperframes-media` Skill (`remove-background`, u2net).
Ergebnis als `characters/<id>.png` (transparent) speichern.

**PFLICHT-Verify nach jedem Cut (sonst durchsichtige Brillen/Innenflaechen):** rembg/u2net und
Higgsfield-remove_background hoehlen helle, eingeschlossene Innenflaechen mit-aus, die der
Hintergrundfarbe aehneln - typisch Brillenglaeser, Lupen, Loecher im Charakter. Das faellt erst auf
einem hellen Slide-Hintergrund auf. Darum nach dem Cut die Alpha-Maske auf eingeschlossene Loecher
pruefen (`scipy.ndimage.binary_fill_holes(alpha>24) & ~(alpha>24)`, dann `label`): ECHTE Loecher
(Beinzwischenraum) transparent lassen, FALSCHE (Brillenglas, Augenschlitze) aus dem **Original** (mit
Hintergrund, deckungsgleich) zurueckfuellen (`out[hole]=orig[hole]; alpha[hole]=255`, +2-3px Dilation
in den umgebenden dunklen Rahmen gegen Saum). Visuell auf Papier-BG gegenpruefen. NIE neu matten - das
zerstoert den schon korrekten Rest (Outline, Body, Schatten); chirurgisch nur das Loch fuellen.
Den Fix auch an der **Bibliotheks-Master-Kopie** (`~/Documents/Projects/carousel-library/characters/`) machen,
nicht nur an der Projekt-Kopie, sonst kehrt der Bug beim naechsten Reuse zurueck.

## Upload-Referenz an Higgsfield (curl)
Lokale Referenz hochladen: `media_upload` (filename) -> liefert presigned URL -> `curl -X PUT
-H "Content-Type: image/jpeg" --data-binary @datei 'URL'` -> `media_confirm` -> media_id. Dann in
`generate_image` als `medias:[{role:"image", value:"<media_id>"}]`. (Referenz vorher mit `sips -Z 1100`
verkleinern = schneller.)

## In die Bibliothek aufnehmen (Pflicht nach jeder Generierung)

1. PNG in `~/Documents/Projects/carousel-library/<characters|objects|scenes>/<id>.png`
2. `catalog.json` ergaenzen (siehe scripts/catalog.py add) — Felder: `id, file, type, theme, tags,
   description, prompt, created`. Datum als String mitgeben (kein Date.now im Skript).
3. `LIBRARY.md`-Zeile ergaenzen, thematisch gruppiert: `- characters/<id>.png — <description> [theme]`
Nutze `python3 scripts/catalog.py add ...` damit catalog.json + LIBRARY.md konsistent bleiben.
`python3 scripts/catalog.py list [theme]` zeigt, was schon da ist (immer ZUERST aufrufen).

## Ins Projekt liefern
Gewaehlte Pieces nach `<projekt>/assets/cut/<name>.png` kopieren (der carousel-build-Skill erwartet
sie dort). Cover-Szene nach `<projekt>/assets/<name>.png`.

## Wichtig
- Bibliothek MUSS verstaendlich bleiben: sprechende IDs (`character_skeptiker_glasses`), thematische
  Gruppen in LIBRARY.md, eine Zeile Beschreibung pro Piece. Niemand soll raten muessen, was ein File ist.
- Kosten vor Higgsfield-Runs nennen. MCP-Verbindung kann droppen -> dann melden + ggf. retry.
- Keine smooth/Pixel-SVG-Charaktere selbst zeichnen. Echte Maskottchen via Higgsfield + Cutout (Voll-Modus).
