import { readdirSync, statSync, existsSync, readFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";

/**
 * Loader für die Carousel-Outputs des carousel-producer-Agents.
 * Projekte liegen unter ~/Downloads/<thema-slug>-carousel/ mit:
 *   slide-<n>.html          (Quelle, animiert aber GSAP paused -> nicht autonom)
 *   renders/slide-<n>.mp4    (gerendert, animiert — bevorzugte Vorschau)
 *   renders/slide-<n>.gif    (optional, ggf. -opt/-small)
 *   export-static/slide-<n>.jpg (letzter Frame, statischer Fallback)
 */

const DOWNLOADS = join(homedir(), "Downloads");

export interface CarouselProject {
	name: string;   // Ordnername, z.B. "skaile-carousel"
	path: string;   // absoluter Pfad
	mtime: number;  // jüngste Änderung im Ordner (für Sortierung "neuester zuerst")
	slideCount: number;
}

export type SlideAssetKind = "mp4" | "gif" | "jpg" | "html" | "none";

export interface CarouselSlide {
	n: number;
	htmlPath?: string;
	mp4Path?: string;
	gifPath?: string;
	jpgPath?: string;
	best: SlideAssetKind;  // bestes anzeigbares (animiertes) Asset
	bestPath?: string;     // absoluter Pfad zum besten Asset
	bestMtime: number;     // mtime des besten Assets (für Blob-Cache-Invalidierung)
	stale: boolean;        // HTML neuer als das beste Render -> "neu rendern nötig"
}

function safeMtime(p: string): number {
	try { return statSync(p).mtimeMs; } catch (_) { return 0; }
}

/** Listet Carousel-Projektordner unter ~/Downloads, neuester zuerst. */
export function loadCarouselProjects(): CarouselProject[] {
	let names: string[];
	try {
		names = readdirSync(DOWNLOADS);
	} catch (_) {
		return [];
	}
	const projects: CarouselProject[] = [];
	for (const name of names) {
		if (name.startsWith(".")) continue;
		// Heuristik: Ordnername enthält "carousel" UND es liegt mind. eine slide-*.html drin.
		if (!name.toLowerCase().includes("carousel")) continue;
		const path = join(DOWNLOADS, name);
		let isDir = false;
		try { isDir = statSync(path).isDirectory(); } catch (_) { /* */ }
		if (!isDir) continue;
		const slides = detectSlideNumbers(path);
		if (slides.length === 0) continue;
		projects.push({
			name,
			path,
			mtime: folderRecencyMtime(path),
			slideCount: slides.length,
		});
	}
	projects.sort((a, b) => b.mtime - a.mtime);
	return projects;
}

/**
 * "Aktualität" eines Projekts = jüngste mtime aus root + renders + export-static.
 * So rückt ein Projekt nach oben, sobald der Agent darin gerade rendert.
 */
function folderRecencyMtime(projectPath: string): number {
	let newest = safeMtime(projectPath);
	for (const sub of ["", "renders", "export-static"]) {
		const dir = sub === "" ? projectPath : join(projectPath, sub);
		try {
			for (const f of readdirSync(dir)) {
				if (!f.startsWith("slide-")) continue;
				const m = safeMtime(join(dir, f));
				if (m > newest) newest = m;
			}
		} catch (_) { /* dir fehlt -> ignorieren */ }
	}
	return newest;
}

/** Findet die vorhandenen Slide-Nummern anhand der slide-<n>.html im root. */
function detectSlideNumbers(projectPath: string): number[] {
	const nums = new Set<number>();
	try {
		for (const f of readdirSync(projectPath)) {
			const m = f.match(/^slide-(\d+)\.html$/);
			if (m && m[1] !== undefined) nums.add(parseInt(m[1], 10));
		}
	} catch (_) { /* */ }
	// Fallback: manche Projekte haben evtl. nur Renders, keine HTML -> aus renders/ ableiten.
	if (nums.size === 0) {
		try {
			for (const f of readdirSync(join(projectPath, "renders"))) {
				const m = f.match(/^slide-(\d+)\.mp4$/);
				if (m && m[1] !== undefined) nums.add(parseInt(m[1], 10));
			}
		} catch (_) { /* */ }
	}
	return Array.from(nums).sort((a, b) => a - b);
}

function firstExisting(...candidates: string[]): string | undefined {
	for (const c of candidates) {
		if (existsSync(c)) return c;
	}
	return undefined;
}

/** Lädt die Slides eines Projekts inkl. bestem anzeigbaren Asset + stale-Flag. */
export function loadSlides(projectPath: string): CarouselSlide[] {
	const numbers = detectSlideNumbers(projectPath);
	const renders = join(projectPath, "renders");
	const staticDir = join(projectPath, "export-static");

	return numbers.map((n) => {
		const htmlPath = firstExisting(join(projectPath, `slide-${n}.html`));
		const mp4Path = firstExisting(join(renders, `slide-${n}.mp4`));
		const gifPath = firstExisting(
			join(renders, `slide-${n}.gif`),
			join(renders, `slide-${n}-opt.gif`),
			join(renders, `slide-${n}-small.gif`),
		);
		const jpgPath = firstExisting(
			join(staticDir, `slide-${n}.jpg`),
			join(projectPath, `slide-${n}.jpg`),
		);

		// Bevorzugung: animiert vor statisch. MP4 > GIF > JPG > HTML.
		let best: SlideAssetKind = "none";
		let bestPath: string | undefined;
		if (mp4Path) { best = "mp4"; bestPath = mp4Path; }
		else if (gifPath) { best = "gif"; bestPath = gifPath; }
		else if (jpgPath) { best = "jpg"; bestPath = jpgPath; }
		else if (htmlPath) { best = "html"; bestPath = htmlPath; }

		const bestMtime = bestPath ? safeMtime(bestPath) : 0;
		const htmlMtime = htmlPath ? safeMtime(htmlPath) : 0;
		// stale = an der HTML wurde gearbeitet, aber das gezeigte Render ist älter.
		const stale = best !== "html" && best !== "none" && htmlMtime > bestMtime + 500;

		return { n, htmlPath, mp4Path, gifPath, jpgPath, best, bestPath, bestMtime, stale };
	});
}

/** Signatur über alle besten Assets — billiger Vergleich, um Re-Render nur bei Änderung zu triggern. */
export function slidesSignature(slides: CarouselSlide[]): string {
	return slides.map((s) => `${s.n}:${s.best}:${Math.round(s.bestMtime)}:${s.stale ? 1 : 0}`).join("|");
}

const MIME: Record<string, string> = {
	mp4: "video/mp4",
	gif: "image/gif",
	jpg: "image/jpeg",
	html: "text/html",
};

/** Liest eine Asset-Datei und gibt eine Blob-URL zurück (umgeht Electron file://-Sperre). */
export function makeBlobUrl(path: string, kind: SlideAssetKind): string | null {
	try {
		const buf = readFileSync(path);
		const blob = new Blob([new Uint8Array(buf)], { type: MIME[kind] ?? "application/octet-stream" });
		return URL.createObjectURL(blob);
	} catch (_) {
		return null;
	}
}
