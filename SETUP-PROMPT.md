# Setup-Prompt

Diesen Prompt komplett kopieren und in Claude Code pasten. Claude installiert alles und richtet den Karussell-Producer per Interview auf DICH ein. Er funktioniert in zwei Modi: mit Higgsfield (eigene Charaktere, Cover-Szenen und Themen-Bilder, Mitgliedschaft nötig) oder komplett kostenlos nur mit HyperFrames (Code-Slides ohne generierte Bilder).

---

Installiere mir den Karussell-Producer aus diesem Repo und richte ihn auf MICH ein: https://github.com/sebaskauf/carousel-producer-plugin

SCHRITT 1 - INSTALLIEREN
1. `git clone https://github.com/sebaskauf/carousel-producer-plugin.git ~/Documents/Projects/carousel-producer-plugin` (falls der Ordner schon existiert: dort `git pull` statt clone).
2. Führ `./install.sh` im Repo aus. Das Script installiert den Agenten, die drei Carousel-Skills und zwei Helfer-Skills (vorhandene Versionen werden nicht überschrieben) und legt eine LEERE Asset-Bibliothek unter `~/Documents/Projects/carousel-library/` an. Eigene bestehende Dateien werden mit Timestamp gesichert.
3. Prüf die Voraussetzungen aus der Script-Ausgabe (node, npx, ffmpeg, python3) und hilf mir, Fehlendes zu installieren.

SCHRITT 2 - AUF MICH EINRICHTEN (das Interview)
Lies die installierte Agent-Datei (`~/.claude/agents/carousel-producer.md`, Abschnitt "Setup-Modus") und führe das Interview jetzt selbst mit mir durch, EINE Frage nach der anderen. Bei "weiß nicht" gibst du mir 2 bis 3 Vorschläge zur Auswahl.

Zuerst die Higgsfield-Weiche: prüf, ob eine Higgsfield-Verbindung existiert, und frag mich, ob ich Higgsfield nutze.
- Ja: hilf mir bei Bedarf mit der Einrichtung (Mitgliedschaft nötig), bevor wir weitermachen.
- Nein: dann läuft alles im kostenlosen Modus nur über HyperFrames. Sag mir ehrlich, was dann nicht geht (keine individuellen Charaktere und keine fotorealistischen Cover-Bilder), und bau die Slides entsprechend aus Code-Motiven.

Dann das Interview:
- DESIGN: falls es schon eine stil.md vom B-Roll-Agenten gibt, nimm sie als Basis und frag nur, was für Slides zusätzlich zählt. Sonst: Stil der Illustrationen und Charaktere (verspielt, clean, Pixel, realistisch), hell oder dunkel, oder "Beispiel-Look übernehmen".
- DER INHALT: meine Themen, meine Zielgruppe, und welcher Aufruf am Ende jedes Carousels steht (Keyword kommentieren, Link, folgen) und wie formuliert.
- DER AUFBAU: 6 bis 8 Slides; frag mich, ob ich eher neugierig machende oder direkte Hooks will, mit je einem Beispiel zum Aussuchen.

Schreib die Antworten als `~/Documents/Projects/carousel-library/carousel-profil.md` (inklusive higgsfield: ja/nein). Die leere Ressourcen-Bibliothek daneben füllt sich ab jetzt automatisch mit jedem Post.

SCHRITT 3 - BEWEIS
Erstell EINEN Beispiel-Slide (nur Slide 1, die Hook) zu einem Thema meiner Wahl, im gewählten Modus, gerendert, damit ich den Look prüfe. Im Higgsfield-Modus gehört dazu mein ERSTER eigener Charakter oder ein Cover in meinem Stil (Kosten vorher nennen und auf mein OK warten). Erst nach meinem OK ist das Setup fertig. Änderungen wandern in die carousel-profil.md, nicht nur in diesen einen Slide.

Sag mir zum Schluss, dass ich Claude Code einmal neu starten soll, und wie ich den Agenten ab dann benutze (ein Satz reicht: "carousel zu [THEMA]" — oder ich gebe ihm direkt ein Video-Skript zum Repurposen).

Wenn ein Schritt fehlschlägt, zeig mir die genaue Fehlermeldung, statt es als erledigt zu melden.

---
