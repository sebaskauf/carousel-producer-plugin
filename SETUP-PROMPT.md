# Setup-Prompt

Diesen Prompt komplett kopieren und in Claude Code pasten. Claude installiert alles und richtet den Karussell-Producer per Interview auf DICH ein. Dieser Producer generiert eigene Charaktere, Cover-Szenen und Themen-Bilder über Higgsfield (Mitgliedschaft nötig). Ohne Higgsfield: nimm die HyperFrames-Variante (https://github.com/sebaskauf/carousel-producer-free).

---

Installiere mir den Karussell-Producer aus diesem Repo und richte ihn auf MICH ein: https://github.com/sebaskauf/carousel-producer-plugin

SCHRITT 1 - INSTALLIEREN
1. `git clone https://github.com/sebaskauf/carousel-producer-plugin.git ~/Documents/Projects/carousel-producer-plugin` (falls der Ordner schon existiert: dort `git pull` statt clone).
2. Führ `./install.sh` im Repo aus. Das Script installiert den Agenten, die drei Carousel-Skills und zwei Helfer-Skills (vorhandene Versionen werden nicht überschrieben) und legt eine LEERE Asset-Bibliothek unter `~/Documents/Projects/carousel-library/` an. Eigene bestehende Dateien werden mit Timestamp gesichert.
3. Prüf die Voraussetzungen aus der Script-Ausgabe (node, npx, ffmpeg, python3) und hilf mir, Fehlendes zu installieren.

SCHRITT 2 - AUF MICH EINRICHTEN (das Interview)
Lies die installierte Agent-Datei (`~/.claude/agents/carousel-producer.md`, Abschnitt "Setup-Modus") und führe das Interview jetzt selbst mit mir durch, EINE Frage nach der anderen. Bei "weiß nicht" gibst du mir 2 bis 3 Vorschläge zur Auswahl.

Zuerst Higgsfield (Voraussetzung): prüf, ob eine Higgsfield-Verbindung existiert, und hilf mir bei Bedarf mit der Einrichtung (claude.ai → Settings → Connectors → Higgsfield, Mitgliedschaft nötig), bevor wir weitermachen.

Dann das Interview:
- DESIGN: falls es schon eine stil.md vom B-Roll-Agenten gibt, nimm sie als Basis und frag nur, was für Slides zusätzlich zählt. Sonst: Stil der Illustrationen und Charaktere (verspielt, clean, Pixel, realistisch), hell oder dunkel, oder "Beispiel-Look übernehmen".
- DER INHALT: meine Themen, meine Zielgruppe, und welcher Aufruf am Ende jedes Carousels steht (Keyword kommentieren, Link, folgen) und wie formuliert.
- DER AUFBAU: 6 bis 8 Slides; frag mich, ob ich eher neugierig machende oder direkte Hooks will, mit je einem Beispiel zum Aussuchen.

Schreib die Antworten als `~/Documents/Projects/carousel-library/carousel-profil.md`. Die leere Ressourcen-Bibliothek daneben füllt sich ab jetzt automatisch mit jedem Post.

SCHRITT 3 - BEWEIS
Erstell EINEN Beispiel-Slide (nur Slide 1, die Hook) zu einem Thema meiner Wahl, gerendert, damit ich den Look prüfe — inklusive meinem ERSTEN eigenen Charakter oder einem Cover in meinem Stil (Kosten vorher nennen und auf mein OK warten). Erst nach meinem OK ist das Setup fertig. Änderungen wandern in die carousel-profil.md, nicht nur in diesen einen Slide.

Sag mir zum Schluss, dass ich Claude Code einmal neu starten soll, und wie ich den Agenten ab dann benutze (ein Satz reicht: "carousel zu [THEMA]", oder ich gebe ihm direkt ein Video-Skript zum Repurposen).

Wenn ein Schritt fehlschlägt, zeig mir die genaue Fehlermeldung, statt es als erledigt zu melden.

---

---

# Zusatz: nur wenn du das Agentic OS nutzt

Dann kannst du deine Carousels im Cockpit sehen statt im Ordner: Projektliste,
Slide-Vorschau, und der `carousel-producer` als festes Terminal daneben. Auf
Wunsch als eigener Pane, frei neben das Cockpit gelegt.

**Der Tab ist optional.** Wer ihn nicht will, baut ihn nicht ein - am
bestehenden Cockpit ändert sich dadurch nichts. Er läuft ab Plugin-Version
v0.2.0 und braucht kein Update.

Was du brauchst: **Node.js** (nodejs.org, LTS) und ein paar Minuten. Beim
letzten Schritt lädt Obsidian das Plugin neu und schließt dabei offene
Terminals im Cockpit.

Kopier diesen Block **zusätzlich** in dieselbe Claude-Code-Session, nachdem der
Prompt oben durchgelaufen ist.

---

Ich nutze das Agentic OS und will meine Carousels dort als eigenen Tab sehen.

Im Repo, das du vorhin geklont hast, liegt `agentic-os-tab/` mit den drei Dateien, dem CSS und einer Anleitung: `agentic-os-tab/EINBAU.md`. **Lies die Anleitung komplett und arbeite sie ab.** Sie beschreibt, welche Stellen in `src/App.tsx` und `src/main.ts` zu ändern sind, wie geprüft wird und wie das Ergebnis in mein Vault kommt.

Drei Dinge, auf die ich Wert lege:

1. **Prüf zuerst die Voraussetzungen**, bevor du etwas kopierst: Node vorhanden, mein Vault gefunden (rat den Pfad nicht, schau in `~/Library/Application Support/obsidian/obsidian.json` und frag mich, wenn es mehrere gibt), und ob der Tab schon drin ist.
2. **Fass nichts an ausser App.tsx, main.ts und styles.css.** Der Tab braucht keine Änderung am übrigen Plugin. Musst du doch an eine andere Datei, brich ab und sag es mir - dann stimmt etwas nicht.
3. **Sicher mein altes `main.js` und `styles.css`**, bevor du sie ersetzt. Geht etwas schief, spielst du die Sicherung zurück, statt mich mit einem kaputten Cockpit sitzen zu lassen.

Sag mir vor dem letzten Schritt Bescheid, dass Obsidian gleich neu lädt und offene Cockpit-Terminals dabei geschlossen werden - auch deins, falls du in einem läufst.

