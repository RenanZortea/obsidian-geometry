import { MarkdownPostProcessorContext, MarkdownView, Plugin } from "obsidian";
import { parseGeometry } from "./parser";
import { solve } from "./engine/solver";
import { createCanvas } from "./renderer/canvas";
import { renderScene } from "./renderer/draw";
import { getThemeColors } from "./renderer/theme";
import { setupInteraction, ToolType } from "./interaction/drag";
import { serializeScene } from "./serializer";
import { GeometryScene, ResolvedScene, Vec2 } from "./types";

const TOOLS: { id: ToolType; label: string; icon: string }[] = [
  { id: "pointer", label: "Select / Pan", icon: "↖" },
  { id: "point", label: "Point", icon: "•" },
  { id: "line", label: "Line", icon: "╱" },
  { id: "segment", label: "Segment", icon: "—" },
  { id: "circle", label: "Circle", icon: "○" },
  { id: "midpoint", label: "Midpoint", icon: "◦" },
  { id: "perp_bisector", label: "Perpendicular Bisector", icon: "⊥" },
  { id: "perpendicular", label: "Perpendicular", icon: "∟" },
  { id: "parallel", label: "Parallel", icon: "∥" },
  { id: "angle_bisector", label: "Angle Bisector", icon: "∠" },
  { id: "compass", label: "Compass", icon: "⊙" },
  { id: "text", label: "Text Label", icon: "A" },
];

export default class GeometryPlugin extends Plugin {
  async onload() {
    this.registerMarkdownCodeBlockProcessor(
      "geometry",
      (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
        try {
          this.renderGeometry(source, el, ctx);
        } catch (err) {
          this.renderError(el, err);
        }
      }
    );
  }

  private renderGeometry(
    source: string,
    el: HTMLElement,
    mdCtx: MarkdownPostProcessorContext
  ): void {
    const scene = parseGeometry(source);
    const resolved = solve(scene);

    const container = el.createDiv({ cls: "geometry-container" });

    // Canvas
    const { canvas, ctx, transform } = createCanvas(container, scene.config);

    // Read theme from Obsidian's body classes + CSS variables
    const theme = getThemeColors();

    // ── Presentation mode ──
    if (scene.config.presentation && resolved.totalSlides > 0) {
      this.setupPresentation(container, canvas, ctx, resolved, transform, theme);
      return; // presentation mode is non-interactive
    }

    renderScene(ctx, resolved, transform, theme);

    if (!scene.config.interactive) return;

    // Toolbar (overlaid)
    const toolbar = container.createDiv({ cls: "geometry-toolbar" });
    const buttons = new Map<ToolType, HTMLButtonElement>();

    for (const tool of TOOLS) {
      const btn = toolbar.createEl("button", {
        cls: "geometry-tool-btn",
        attr: { title: tool.label },
      });
      btn.createSpan({ cls: "geometry-tool-icon", text: tool.icon });
      if (tool.id === "pointer") btn.classList.add("is-active");
      buttons.set(tool.id, btn);
    }

    // Sync callback: write scene back to the code block
    const syncToSource = () => {
      this.updateCodeBlock(scene, el, mdCtx);
    };

    const { setTool } = setupInteraction(
      canvas,
      ctx,
      scene,
      transform,
      theme,
      (t) => {
        for (const [id, btn] of buttons) {
          btn.classList.toggle("is-active", id === t);
        }
      },
      syncToSource
    );

    for (const [id, btn] of buttons) {
      btn.addEventListener("click", () => setTool(id));
    }
  }

  private setupPresentation(
    container: HTMLElement,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    resolved: ResolvedScene,
    transform: ReturnType<typeof createCanvas>["transform"],
    theme: ReturnType<typeof getThemeColors>
  ): void {
    const ZOOM_FACTOR = 1.1;
    const MIN_SCALE = 5;
    const MAX_SCALE = 500;

    let currentSlide = 0;
    const totalSlides = resolved.totalSlides;

    const redraw = () => {
      renderScene(ctx, resolved, transform, theme, currentSlide);
    };

    redraw();

    // ── Navigation bar ──
    const nav = container.createDiv({ cls: "geometry-presentation-nav" });

    const prevBtn = nav.createEl("button", {
      cls: "geometry-nav-btn",
      attr: { title: "Previous step" },
    });
    prevBtn.setText("◀");

    const counter = nav.createSpan({ cls: "geometry-nav-counter" });

    const nextBtn = nav.createEl("button", {
      cls: "geometry-nav-btn",
      attr: { title: "Next step" },
    });
    nextBtn.setText("▶");

    const updateCounter = () => {
      counter.setText(`${currentSlide} / ${totalSlides}`);
      prevBtn.toggleClass("is-disabled", currentSlide <= 0);
      nextBtn.toggleClass("is-disabled", currentSlide >= totalSlides);
    };
    updateCounter();

    prevBtn.addEventListener("click", () => {
      if (currentSlide > 0) {
        currentSlide--;
        updateCounter();
        redraw();
      }
    });

    nextBtn.addEventListener("click", () => {
      if (currentSlide < totalSlides) {
        currentSlide++;
        updateCounter();
        redraw();
      }
    });

    // ── Pan (mouse drag) ──
    let panning = false;
    let lastPan: Vec2 = [0, 0];

    canvas.addEventListener("mousedown", (e: MouseEvent) => {
      panning = true;
      lastPan = [e.clientX, e.clientY];
      canvas.style.cursor = "move";
      e.preventDefault();
    });

    canvas.addEventListener("mousemove", (e: MouseEvent) => {
      if (!panning) return;
      const dx = (e.clientX - lastPan[0]) / transform.scale;
      const dy = (e.clientY - lastPan[1]) / transform.scale;
      transform.panX -= dx;
      transform.panY += dy;
      lastPan = [e.clientX, e.clientY];
      redraw();
    });

    const stopPan = () => {
      panning = false;
      canvas.style.cursor = "default";
    };
    canvas.addEventListener("mouseup", stopPan);
    canvas.addEventListener("mouseleave", stopPan);

    // ── Touch pan ──
    let lastTouch: Vec2 | null = null;

    canvas.addEventListener("touchstart", (e: TouchEvent) => {
      if (e.touches.length === 1) {
        lastTouch = [e.touches[0].clientX, e.touches[0].clientY];
        e.preventDefault();
      }
    }, { passive: false });

    canvas.addEventListener("touchmove", (e: TouchEvent) => {
      if (e.touches.length === 1 && lastTouch) {
        const dx = (e.touches[0].clientX - lastTouch[0]) / transform.scale;
        const dy = (e.touches[0].clientY - lastTouch[1]) / transform.scale;
        transform.panX -= dx;
        transform.panY += dy;
        lastTouch = [e.touches[0].clientX, e.touches[0].clientY];
        redraw();
        e.preventDefault();
      }
    }, { passive: false });

    canvas.addEventListener("touchend", () => { lastTouch = null; });

    // ── Zoom (mouse wheel) ──
    canvas.addEventListener("wheel", (e: WheelEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const pxPos: Vec2 = [e.clientX - rect.left, e.clientY - rect.top];

      const direction = e.deltaY < 0 ? 1 : -1;
      const factor = direction > 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, transform.scale * factor));

      const mathBefore = transform.toMath(pxPos);
      transform.scale = newScale;
      const mathAfter = transform.toMath(pxPos);

      transform.panX -= mathAfter[0] - mathBefore[0];
      transform.panY -= mathAfter[1] - mathBefore[1];

      redraw();
    }, { passive: false });

    // ── Keyboard: slides + pan ──
    container.tabIndex = 0;
    container.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        if (currentSlide < totalSlides) {
          currentSlide++;
          updateCounter();
          redraw();
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (currentSlide > 0) {
          currentSlide--;
          updateCounter();
          redraw();
        }
      }
    });
  }

  private updateCodeBlock(
    scene: GeometryScene,
    el: HTMLElement,
    mdCtx: MarkdownPostProcessorContext
  ): void {
    const sectionInfo = mdCtx.getSectionInfo(el);
    if (!sectionInfo) return;

    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) return;

    const editor = view.editor;
    const { lineStart, lineEnd } = sectionInfo;

    const newYaml = serializeScene(scene);
    const from = { line: lineStart + 1, ch: 0 };
    const to = { line: lineEnd, ch: 0 };
    editor.replaceRange(newYaml, from, to);
  }

  private renderError(el: HTMLElement, err: unknown): void {
    const msg = err instanceof Error ? err.message : String(err);
    const pre = el.createEl("pre", { cls: "geometry-error" });
    pre.setText(`Geometry Error: ${msg}`);
  }
}
