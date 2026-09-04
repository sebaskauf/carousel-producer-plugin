# CAROUSEL-Tab ins Agentic OS einbauen

Diese Anleitung richtet sich an Claude, nicht an den Nutzer. Sie baut den
CAROUSEL-Tab in ein bestehendes Agentic OS ein: Projektliste, Slide-Vorschau,
und der `carousel-producer`-Agent als fest verbundenes Terminal daneben.

Der Tab lässt sich zusätzlich als eigener Obsidian-Pane aufklappen, frei
anordbar neben dem Cockpit. Dafür registriert er einen eigenen View-Type -
deshalb wird hier auch `main.ts` angefasst, nicht nur `App.tsx`.

Er greift **nicht** in bestehende Tabs ein und braucht keine neuere
Plugin-Fassung. Wer ihn nicht will, baut ihn nicht ein - alles andere bleibt
wie es ist.

## Voraussetzungen prüfen

Bevor du irgendetwas anfasst:

- **Node und npm** vorhanden (`node --version`, `npm --version`). Fehlt das, brich ab und sag dem Nutzer, dass er Node braucht (nodejs.org, LTS). Ohne Node lässt sich das Plugin nicht bauen.
- **Der Vault des Nutzers.** Rate den Pfad nicht. Unter macOS steht in `~/Library/Application Support/obsidian/obsidian.json`, welche Vaults es gibt. Gibt es mehrere, frag welcher. Das Plugin liegt unter `<vault>/.obsidian/plugins/agentic-os/`.
- **Der Tab ist noch nicht da:** `grep -c carousel-view <vault>/.obsidian/plugins/agentic-os/main.js` muss 0 ergeben. Ist er schon drin, bist du fertig.

## Ablauf

### 1. Quellcode holen

Das Plugin im Vault ist nur das fertige Bundle, dort lässt sich nichts einbauen.

```
git clone https://github.com/sebaskauf/agentic-os.git ~/Documents/Projects/agentic-os
cd ~/Documents/Projects/agentic-os
npm install
```

Existiert der Ordner schon, dort `git pull`.

**Der Tab läuft ab Plugin-Version v0.2.0 ohne jede Kern-Änderung** - getestet
gegen den unveränderten öffentlichen Stand. Du fasst nur `App.tsx`, `main.ts`
und `styles.css` an, sonst nichts.

**Versionsabgleich trotzdem:** Vergleich `manifest.json` im geklonten Repo mit
der im Vault des Nutzers. Ist die Version im Vault **neuer** als im Repo, brich
ab und sag es ihm - ein Build aus älterem Quellcode würde ihm neuere Tabs
wegnehmen.

### 2. Dateien kopieren

Aus diesem Ordner nach `src/`:

```
cp agentic-os-tab/CarouselView.tsx  ~/Documents/Projects/agentic-os/src/
cp agentic-os-tab/carouselLeaf.tsx  ~/Documents/Projects/agentic-os/src/
cp agentic-os-tab/loadCarousel.ts   ~/Documents/Projects/agentic-os/src/
cat agentic-os-tab/carousel.css >> ~/Documents/Projects/agentic-os/styles.css
```

### 3. Vier Stellen in `src/App.tsx`

Such die Stellen über den Inhalt, nicht über Zeilennummern - die Datei ändert sich.

**a) Import**, direkt nach dem Import von `CutterView`:

```tsx
import { CarouselView } from "./CarouselView";
```

**b) Der Typ `TabId`** - `"CAROUSEL"` ergänzen:

```tsx
type TabId = "OVERVIEW" | "RESEARCH" | "CUTTER" | "CAROUSEL";
```

Heißt der Typ anders oder ist `tab` ein `string`, entfällt das. Prüf es, statt
blind zu ersetzen.

**c) Die Tab-Leiste** - einen Eintrag ergänzen:

```tsx
const TABS: Array<[TabId, string]> = [..., ["CAROUSEL", "CAROUSEL"]];
```

Ist das ein mehrzeiliges Array, füg `["CAROUSEL", "CAROUSEL"],` als eigene Zeile ein.

**d) Das Rendering** - in die Verzweigung einhängen, die schon `CUTTER` abfängt:

```tsx
{tab === "CUTTER" ? (
    <CutterView />
) : tab === "CAROUSEL" ? (
    <CarouselView />
) : (
```

### 4. Vier Stellen in `src/main.ts`

Der Tab kann sich als eigener Obsidian-Pane öffnen. Ohne diese vier Änderungen
läuft der Tab zwar, aber das Aufklappen fehlt.

**a) Zwei Imports**, oben zu den anderen:

```ts
import { CarouselLeafView } from "./carouselLeaf";
import { VIEW_TYPE_CAROUSEL } from "./CarouselView";
```

Prüf, dass `WorkspaceLeaf` aus `"obsidian"` importiert ist - wird unten gebraucht.

**b) View registrieren**, in `onload()` bei den anderen `registerView`-Aufrufen:

```ts
this.registerView(
    VIEW_TYPE_CAROUSEL,
    (leaf: WorkspaceLeaf) => new CarouselLeafView(leaf),
);
```

**c) Befehl ergänzen**, bei den anderen `addCommand`-Aufrufen:

```ts
this.addCommand({
    id: "open-carousel-pane",
    name: "Carousel-Workspace als Pane öffnen",
    callback: () => {
        void this.openCarouselPane();
    },
});
```

**d) Die Methode** in der Plugin-Klasse ergänzen, neben den anderen privaten Methoden:

```ts
private async openCarouselPane(): Promise<void> {
    const leaf = this.app.workspace.getLeaf("split", "vertical");
    await leaf.setViewState({
        type: VIEW_TYPE_CAROUSEL,
        active: true,
    });
    this.app.workspace.revealLeaf(leaf);
}
```

### 5. Bauen und prüfen

```
cd ~/Documents/Projects/agentic-os
npx tsc --noEmit --skipLibCheck    # muss fehlerfrei durchlaufen
npm run build
```

Danach im Bundle nachsehen (esbuild minifiziert Funktionsnamen, deshalb nach
CSS-Klassen und Strings suchen, nicht nach `CarouselView`):

```
grep -c carousel-view main.js          # muss mindestens 1 sein
grep -c agentic-carousel main.js       # der View-Type, muss 1 sein
grep -c "Carousel-Workspace" main.js   # der Befehlsname, muss 1 sein
```

### 6. Ins Vault kopieren

**Sicher erst das Alte:**

```
cp <vault>/.obsidian/plugins/agentic-os/main.js    <vault>/.obsidian/plugins/agentic-os/main.js.bak
cp <vault>/.obsidian/plugins/agentic-os/styles.css <vault>/.obsidian/plugins/agentic-os/styles.css.bak
```

Dann die neuen Dateien hinüber:

```
cp main.js styles.css <vault>/.obsidian/plugins/agentic-os/
```

Sag dem Nutzer, dass Obsidian das Plugin jetzt neu lädt und **offene Terminals
im Cockpit dabei geschlossen werden**. Läuft deine eigene Sitzung in so einem
Terminal, sag ihm das vorher - sie wird mit beendet.

### 7. Was der Nutzer danach hat

Ein CAROUSEL-Tab im Cockpit mit seinen Projekten und Slides, und daneben der
`carousel-producer` als festes Terminal. Über die Befehlspalette
("Carousel-Workspace als Pane öffnen") lässt sich das Ganze als eigener Pane
aufklappen und frei neben das Cockpit legen.

Der Tab liest die Projekte aus dem Downloads-Ordner, dort legt der Agent sie ab.

## Wenn etwas schiefgeht

Der Tab erscheint nicht oder das Cockpit bleibt leer: Spiel die Sicherung
zurück (`main.js.bak`, `styles.css.bak`), lade Obsidian neu, und sag dem Nutzer,
was du versucht hast. Ein kaputtes Cockpit ist schlimmer als ein fehlender Tab.
