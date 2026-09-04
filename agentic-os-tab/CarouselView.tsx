import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { homedir } from "os";
import { type App } from "obsidian";
import { ChatPane } from "./ChatDrawer";
import { loadCommands } from "./loadCommands";
import { loadFiles } from "./loadFiles";
import { type ChatTab } from "./loadChatTabs";
import {
	loadCarouselProjects,
	loadSlides,
	slidesSignature,
	makeBlobUrl,
	type CarouselProject,
	type CarouselSlide,
	type SlideAssetKind,
} from "./loadCarousel";

// View-Type für den ausgeklappten Carousel-Workspace als eigener Obsidian-Pane.
// Registriert in main.ts, gerendert von carouselLeaf.tsx. Nativer Pane = frei anordbar
// (rechts/links/zweites Fenster), genau der bewährte Weg wie beim Terminal-Pop-out.
export const VIEW_TYPE_CAROUSEL = "agentic-carousel";

/**
 * Fest an den carousel-producer gebundenes Terminal. Stabile id -> stabile Session
 * `chat-carousel-producer`, die über Plugin-Reloads hinweg dieselbe bleibt.
 * dangerous: damit der vollautonome Build-Agent ohne Permission-Stops durchläuft
 * (wie broll-ersteller). Modul-Konstante => stabile Referenz für ChatPane.
 */
const CAROUSEL_TAB: ChatTab = {
	id: "carousel-producer",
	name: "carousel-producer",
	type: "agent",
	agentName: "carousel-producer",
	workspace: "home",
	dangerous: true,
};

interface SlideAsset {
	url: string;
	kind: SlideAssetKind;
}

export function CarouselView({ inPane = false }: { inPane?: boolean } = {}): JSX.Element {
	const [projects, setProjects] = useState<CarouselProject[]>([]);
	const [activePath, setActivePath] = useState<string | null>(null);
	const [slides, setSlides] = useState<CarouselSlide[]>([]);
	const [blobUrls, setBlobUrls] = useState<Record<number, SlideAsset | null>>({});
	const [selected, setSelected] = useState<number | null>(null);
	const [lightboxN, setLightboxN] = useState<number | null>(null);

	const sigRef = useRef<string>("");
	const knownPathsRef = useRef<Set<string>>(new Set());
	const blobCacheRef = useRef<Map<number, { url: string; mtime: number }>>(new Map());
	// commands/files einmal laden — ChatPane braucht sie für Slash-/File-Picker.
	const commandsRef = useRef(loadCommands());
	const filesRef = useRef(loadFiles());

	const refreshProjects = useCallback((): void => {
		const ps = loadCarouselProjects();
		setProjects(ps);
		const known = knownPathsRef.current;
		const firstRun = known.size === 0;
		// Brandneue Ordner (vorher nie gesehen) = frisch vom Agent gebaut. Beim allerersten
		// Lauf zählt nichts als "neu" — sonst würde der Mount fälschlich springen.
		const fresh = firstRun ? undefined : ps.find((p) => !known.has(p.path));
		for (const p of ps) known.add(p.path);
		setActivePath((cur) => {
			if (cur === null) return ps.length > 0 && ps[0] !== undefined ? ps[0].path : null;
			// Aktuelles Projekt ist weg -> neuestes.
			if (!ps.some((p) => p.path === cur)) return ps.length > 0 && ps[0] !== undefined ? ps[0].path : null;
			// Agent hat einen neuen Ordner angelegt -> automatisch dorthin springen.
			if (fresh !== undefined && fresh.path !== cur) return fresh.path;
			return cur;  // sonst Auswahl behalten (Sebastian schaut bewusst ein Projekt an)
		});
	}, []);

	// Projektliste pollen, damit ein neues Carousel des Agents automatisch auftaucht + selektiert wird.
	useEffect(() => {
		refreshProjects();
		const id = window.setInterval(refreshProjects, 5000);
		return () => window.clearInterval(id);
	}, [refreshProjects]);

	// Slides des aktiven Projekts pollen — setState nur bei echter Änderung (Signatur).
	useEffect(() => {
		// Projektwechsel: Signatur invalidieren (Slides garantiert neu laden) + alte Auswahl/Lightbox lösen.
		sigRef.current = "";
		setSelected(null);
		setLightboxN(null);
		if (activePath === null) { setSlides([]); return; }
		const tick = (): void => {
			const next = loadSlides(activePath);
			const sig = slidesSignature(next);
			if (sig !== sigRef.current) {
				sigRef.current = sig;
				setSlides(next);
			}
		};
		tick();
		const id = window.setInterval(tick, 3000);
		return () => window.clearInterval(id);
	}, [activePath]);

	// Blob-URLs für die besten (animierten) Assets verwalten. Cache per Slide-Nr + mtime,
	// alte URLs revoken (sonst Memory-Leak im Renderer).
	useEffect(() => {
		const cache = blobCacheRef.current;
		const next: Record<number, SlideAsset | null> = {};
		const liveKeys = new Set<number>();
		for (const s of slides) {
			if (s.bestPath === undefined || s.best === "none" || s.best === "html") {
				next[s.n] = null;
				continue;
			}
			const cached = cache.get(s.n);
			if (cached !== undefined && cached.mtime === s.bestMtime) {
				next[s.n] = { url: cached.url, kind: s.best };
				liveKeys.add(s.n);
				continue;
			}
			if (cached !== undefined) URL.revokeObjectURL(cached.url);
			const url = makeBlobUrl(s.bestPath, s.best);
			if (url !== null) {
				cache.set(s.n, { url, mtime: s.bestMtime });
				next[s.n] = { url, kind: s.best };
				liveKeys.add(s.n);
			} else {
				next[s.n] = null;
			}
		}
		for (const [k, v] of cache) {
			if (!liveKeys.has(k)) { URL.revokeObjectURL(v.url); cache.delete(k); }
		}
		setBlobUrls(next);
	}, [slides]);

	// Unmount: alle Blob-URLs freigeben.
	useEffect(() => {
		const cache = blobCacheRef.current;
		return () => {
			for (const v of cache.values()) URL.revokeObjectURL(v.url);
			cache.clear();
		};
	}, []);

	const onSlideClick = useCallback((s: CarouselSlide): void => {
		setSelected(s.n);
		// Eindeutiger Pointer mit absolutem Projektordner (~-gekürzt). Der carousel-producer-Agent
		// kennt dieses Format und liest dann slide-N.html (Code) + export-static/slide-N.jpg (sieht die Slide).
		const dir = activePath !== null ? activePath.replace(homedir(), "~") : "";
		const ref = `Slide ${s.n} [${dir}/]: `;
	}, [activePath]);

	// Carousel-Workspace als eigenen Obsidian-Pane rechts aufklappen. Echter Leaf =
	// danach nativ frei anordbar (links/rechts/zweites Fenster), mehrere gleichzeitig offen.
	const openAsPane = useCallback((): void => {
		const app = (window as unknown as { app?: App }).app;
		if (app === undefined) return;
		const leaf = app.workspace.getLeaf("split", "vertical");
		void leaf.setViewState({ type: VIEW_TYPE_CAROUSEL, active: true });
		app.workspace.revealLeaf(leaf);
	}, []);

	// Lightbox-Navigation per Tastatur: ESC schließt, Pfeile blättern. capture=true,
	// damit es Vorrang vor den globalen Terminal-Key-Handlern hat solange die Lightbox offen ist.
	useEffect(() => {
		if (lightboxN === null) return;
		const onKey = (e: KeyboardEvent): void => {
			if (e.key === "Escape") { e.stopPropagation(); setLightboxN(null); return; }
			if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
				const idx = slides.findIndex((s) => s.n === lightboxN);
				if (idx < 0) return;
				e.stopPropagation();
				const nextIdx = e.key === "ArrowRight" ? Math.min(idx + 1, slides.length - 1) : Math.max(idx - 1, 0);
				const ns = slides[nextIdx];
				if (ns !== undefined) setLightboxN(ns.n);
			}
		};
		window.addEventListener("keydown", onKey, true);
		return () => window.removeEventListener("keydown", onKey, true);
	}, [lightboxN, slides]);

	return (
		<div className="carousel-view">
			<div className="carousel-toolbar">
				<span className="carousel-title mono small-caps">▦ carousel</span>
				<select
					className="carousel-select mono"
					value={activePath ?? ""}
					onChange={(e) => { setActivePath(e.target.value === "" ? null : e.target.value); setSelected(null); }}
				>
					{projects.length === 0 && <option value="">— kein Carousel-Projekt —</option>}
					{projects.map((p) => (
						<option key={p.path} value={p.path}>{p.name} · {p.slideCount} slides</option>
					))}
				</select>
				<button
					className="carousel-refresh mono"
					title="Projekte + Slides neu laden"
					onClick={() => { sigRef.current = ""; refreshProjects(); }}
				>
					⟳ refresh
				</button>
				{!inPane && (
					<button
						className="carousel-refresh mono"
						title="Als eigenen Pane rechts aufklappen — danach frei anordbar / zweites Fenster"
						onClick={openAsPane}
					>
						⇱ ausklappen
					</button>
				)}
				<span className="carousel-spacer" />
				{selected !== null
					? <span className="carousel-hint mono">Slide {selected} markiert → unten beschreiben</span>
					: <span className="carousel-hint dim mono">Slide anklicken → landet im Eingabefeld</span>}
			</div>

			<div className="carousel-grid-scroll">
				{activePath === null ? (
					<div className="carousel-empty mono">
						<div>Noch kein Carousel gefunden.</div>
						<div className="dim">Gib dem carousel-producer unten ein Thema — die Slides erscheinen hier automatisch.</div>
					</div>
				) : slides.length === 0 ? (
					<div className="carousel-empty mono">
						<div>Projekt erkannt, aber noch keine Slides.</div>
						<div className="dim">Sobald der Agent baut/rendert, tauchen sie hier auf.</div>
					</div>
				) : (
					<div className="carousel-grid">
						{slides.map((s) => {
							const asset = blobUrls[s.n] ?? null;
							const isSel = selected === s.n;
							return (
								<div
									key={s.n}
									className={"carousel-tile" + (isSel ? " selected" : "")}
									onClick={() => onSlideClick(s)}
									onDoubleClick={() => setLightboxN(s.n)}
								>
									<div className="carousel-tile-media">
										{asset !== null && asset.kind === "mp4" ? (
											<video src={asset.url} autoPlay loop muted playsInline />
										) : asset !== null ? (
											<img src={asset.url} alt={`Slide ${s.n}`} draggable={false} />
										) : (
											<div className="carousel-tile-empty mono dim">
												{s.best === "html" ? "nur HTML\nnoch nicht gerendert" : "kein Render"}
											</div>
										)}
										{s.stale && <span className="carousel-stale mono">⟳ veraltet</span>}
										<button
											className="carousel-zoom mono"
											title="Groß ansehen (oder Doppelklick)"
											onClick={(e) => { e.stopPropagation(); setLightboxN(s.n); }}
										>⛶</button>
									</div>
									<div className="carousel-tile-label mono">
										<span className="carousel-tile-n">{String(s.n).padStart(2, "0")}</span>
										<span className="carousel-tile-kind dim">{s.best}</span>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>

			<div className="carousel-terminal">
				<ChatPane
					tab={CAROUSEL_TAB}
					commands={commandsRef.current}
					files={filesRef.current}
					onDraftChange={() => { /* Carousel-Draft v1: nicht persistiert */ }}
					onTabPatch={() => { /* Status-Patches im Carousel-Tab nicht persistiert */ }}
				/>
			</div>

			{lightboxN !== null && (() => {
				const idx = slides.findIndex((x) => x.n === lightboxN);
				const s = idx >= 0 ? slides[idx] : undefined;
				const asset = s !== undefined ? blobUrls[s.n] ?? null : null;
				return (
					<div className="carousel-lightbox" onClick={() => setLightboxN(null)}>
						<div className="carousel-lightbox-head" onClick={(e) => e.stopPropagation()}>
							<span className="mono">Slide {lightboxN} / {slides.length}{s?.stale ? "  ·  ⟳ Render veraltet" : ""}</span>
							<button className="carousel-lb-close mono" onClick={() => setLightboxN(null)}>✕ schließen (ESC)</button>
						</div>

						{idx > 0 && (
							<button
								className="carousel-lb-nav prev mono"
								onClick={(e) => { e.stopPropagation(); const ns = slides[idx - 1]; if (ns !== undefined) setLightboxN(ns.n); }}
							>‹</button>
						)}

						<div className="carousel-lightbox-media" onClick={(e) => e.stopPropagation()}>
							{asset !== null && asset.kind === "mp4" ? (
								<video src={asset.url} autoPlay loop muted playsInline />
							) : asset !== null ? (
								<img src={asset.url} alt={`Slide ${lightboxN}`} draggable={false} />
							) : (
								<div className="carousel-tile-empty mono dim">kein Render vorhanden</div>
							)}
						</div>

						{idx < slides.length - 1 && (
							<button
								className="carousel-lb-nav next mono"
								onClick={(e) => { e.stopPropagation(); const ns = slides[idx + 1]; if (ns !== undefined) setLightboxN(ns.n); }}
							>›</button>
						)}

						<button
							className="carousel-lb-mark mono"
							onClick={(e) => { e.stopPropagation(); if (s !== undefined) { onSlideClick(s); setLightboxN(null); } }}
						>↓ diese Slide im Terminal markieren</button>
					</div>
				);
			})()}
		</div>
	);
}
