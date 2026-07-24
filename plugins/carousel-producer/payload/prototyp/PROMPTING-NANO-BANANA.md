# Nano Banana Pro (Gemini 3 Pro Image) — Prompting für 1:1-Charakter-Konsistenz

Recherche-Stand Juni 2026. Für den Carousel-Skill/-Agent wiederverwendbar.

## Kernprinzip
**Das Referenzbild macht die Identität, der Prompt macht NUR die Veränderung.**
Die Figur NICHT in Worten nachbeschreiben — das überschreibt das Bild und driftet die Form.

## Prompt-Struktur (Reihenfolge — frühe Tokens zählen mehr)
1. **Bild-Referenz + Identity-Lock** — `"Using the [object] from image 1, keep its exact silhouette, proportions, colour & face markings identical."`
2. **Aktion / Anzahl** (bei Gruppen)
3. **Szene / Location**
4. **Kamera / Komposition** (eigener Block: `"0.5x ultra-wide selfie"`, `"mirror selfie 0.5x angle"`, `"fisheye"`, `"worm's-eye view"`)
5. **Stil / Light / Medium** (`"glossy 3D render"`, `"cinematic"`)
6. **Text in "Quotes"** + Font explizit (für Cover/Logo)

## Bild-Referenz-Syntax (verifiziert, offiziell)
- `"the character from image 1"` / `"the subject from the first image"` — bewährt.
- Bei mehreren Charakteren: **benennen** — `"Terra" (the mascot in image 1)`, danach nur noch "Terra".
- Mehrere Referenzen mit Rollen: `image 1 = identity`, `image 2 = pose`, `image 3 = background`.
- Higgsfield: pro Input-Bild Influence/Weight setzbar → Identitäts-Referenz hoch gewichten. Bis 14 Refs, bis 5 Charaktere konsistent.

## DO
1. Identität ZUERST referenzieren, Szene/Stil danach.
2. Positiv: "keep the exact same shape/colour" statt "don't change".
3. Pro Generation nur EINE Variable (Stil ODER Szene ODER Pose ODER Kamera).
4. Charakter benennen bei Gruppen, konsistent durchziehen.
5. Kamera/Stil als kurze eigene Blöcke. Bei Drift: neue Session vom Originalbild.

## DON'T
1. Figur NICHT lang nachbeschreiben (Hauptfehler — driftet die Form).
2. Keine Negationsketten ("nicht rund, nicht größer, keine anderen Augen").
3. Kein Keyword-Spam ("4k, masterpiece, trending") — bei NB Pro nutzlos.
4. Nicht Stil+Szene+Pose+Kamera in einem Mega-Prompt mischen.
5. Bild-Referenz nie weglassen — sonst Text-to-Image, Form wird neu erfunden.

## Quellen
Google DeepMind Prompt-Guide · Google Blog (Nano Banana Pro tips) · Google Cloud Ultimate Guide · Gemini API Docs · Higgsfield Prompt-Guide + Review · Atlabs · Laozhang Face-Consistency · CyberLink.
