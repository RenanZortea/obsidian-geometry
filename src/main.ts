import { MarkdownPostProcessorContext, MarkdownView, Plugin } from "obsidian";
import { parseGeometry } from "./parser";
import { solve } from "./engine/solver";
import { createCanvas } from "./renderer/canvas";
import { renderScene } from "./renderer/draw";
import { getThemeColors } from "./renderer/theme";
import { setupInteraction, ToolType } from "./interaction/drag";
import { serializeScene } from "./serializer";
import { GeometryScene } from "./types";

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
