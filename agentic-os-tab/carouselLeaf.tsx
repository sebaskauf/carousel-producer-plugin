import { ItemView, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import { createRoot, type Root } from "react-dom/client";
import { CarouselView, VIEW_TYPE_CAROUSEL } from "./CarouselView";

/**
 * Rendert den kompletten Carousel-Workspace (Slide-Grid + carousel-producer-Terminal)
 * als eigenständigen Obsidian-Pane/Leaf. Dadurch greift Obsidians natives Pane-System:
 * frei anordnen, nach rechts/links splitten, "Open in new window" auf zweiten Bildschirm,
 * mehrere Sachen gleichzeitig offen. Additiv — der CAROUSEL-Tab im Cockpit bleibt unberührt.
 */
export class CarouselLeafView extends ItemView {
	private root: Root | null = null;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType(): string {
		return VIEW_TYPE_CAROUSEL;
	}

	getDisplayText(): string {
		return "Carousel";
	}

	getIcon(): string {
		return "layout-grid";
	}

	async onOpen(): Promise<void> {
		this.contentEl.addClass("agentic-os-root");
		this.contentEl.addClass("agentic-carousel-leaf");
		this.root = createRoot(this.contentEl);
		this.root.render(<CarouselView inPane={true} />);
	}

	async onClose(): Promise<void> {
		if (this.root !== null) {
			this.root.unmount();
			this.root = null;
		}
		// Bewusst KEIN killSession: die carousel-producer-Session (chat-carousel-producer)
		// lebt im Modul-Singleton weiter und re-attached beim nächsten Öffnen (Ring-Buffer-Replay).
	}
}
