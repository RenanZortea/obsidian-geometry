import { ConstructionStep, GeometryScene, ResolvedObject, ResolvedScene, Vec2 } from "../types";
import { solve } from "../engine/solver";
import { Transform } from "../renderer/canvas";
import { renderScene } from "../renderer/draw";
import { ThemeColors, getThemeColors } from "../renderer/theme";
import * as geo from "../engine/geo";

const HIT_RADIUS_PX = 10;
const ZOOM_FACTOR = 1.1;
const MIN_SCALE = 5;
const MAX_SCALE = 500;
const SNAP_RADIUS_PX = 14;
const SNAP_RING_RADIUS = 8;
const LINE_HIT_PX = 8;
const MAX_UNDO = 100;

export type ToolType =
  | "pointer" | "point" | "line" | "segment" | "circle"
  | "midpoint" | "perp_bisector" | "perpendicular" | "parallel"
  | "angle_bisector" | "compass" | "text";

type DragMode =
  | { kind: "point"; id: string }
  | { kind: "pan"; lastPx: Vec2 }
  | null;

interface SnapTarget {
  pos: Vec2;
  pointId: string | null;
}

interface SceneSnapshot {
  points: Record<string, Vec2>;
  constructions: ConstructionStep[];
}

/** Flexible pending state for multi-click tools */
interface PendingState {
  pointIds: string[];      // accumulated point clicks
  lineId: string | null;   // accumulated line click (for perp/parallel)
}

export function setupInteraction(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  scene: GeometryScene,
  transform: Transform,
  initialTheme: ThemeColors,
  onToolChange?: (tool: ToolType) => void,
  onSceneChange?: () => void
): { setTool: (t: ToolType) => void } {
  const pointOverrides = new Map<string, Vec2>();
  let drag: DragMode = null;
  let activeTool: ToolType = "pointer";
  let pending: PendingState = { pointIds: [], lineId: null };
  let counters = recalcCounters(scene);
  let resolved: ResolvedScene = solve(scene, pointOverrides);
  let theme = initialTheme;

  let ghostPos: Vec2 | null = null;
  let currentSnap: SnapTarget | null = null;
  let highlightLineId: string | null = null; // line highlighted for perp/parallel

  // ── Undo / Redo stack ──
  const undoStack: SceneSnapshot[] = [];
  const redoStack: SceneSnapshot[] = [];

  function takeSnapshot(): SceneSnapshot {
    return {
      points: { ...scene.points },
      constructions: scene.constructions.map((c) => ({ ...c })),
    };
  }

  function pushUndo(): void {
    undoStack.push(takeSnapshot());
    if (undoStack.length > MAX_UNDO) undoStack.shift();
    redoStack.length = 0;
  }

  function restoreSnapshot(snap: SceneSnapshot): void {
    scene.points = { ...snap.points };
    scene.constructions = snap.constructions.map((c) => ({ ...c }));
    counters = recalcCounters(scene);
    pointOverrides.clear();
    resetPending();
  }

  function undo(): void {
    if (undoStack.length === 0) return;
    redoStack.push(takeSnapshot());
    restoreSnapshot(undoStack.pop()!);
    rerender();
    notifyChange();
  }

  function redo(): void {
    if (redoStack.length === 0) return;
    undoStack.push(takeSnapshot());
    restoreSnapshot(redoStack.pop()!);
    rerender();
    notifyChange();
  }

  function resetPending(): void {
    pending = { pointIds: [], lineId: null };
    ghostPos = null;
    currentSnap = null;
    highlightLineId = null;
  }

  // ── Rendering ──

  function refreshTheme(): void {
    theme = getThemeColors();
  }

  function rerender(): void {
    resolved = solve(scene, pointOverrides);
    renderScene(ctx, resolved, transform, theme);

    // Draw highlighted line
    if (highlightLineId) {
      drawLineHighlight(ctx, transform, resolved, highlightLineId);
    }

    // Draw snap ring
    if (currentSnap && activeTool !== "pointer") {
      drawSnapRing(ctx, transform, currentSnap.pos);
    }

    // Draw ghost preview
    drawGhostForTool(ctx, transform, resolved, activeTool, pending, ghostPos, currentSnap);
  }

  function setTool(t: ToolType): void {
    activeTool = t;
    resetPending();
    refreshTheme();
    rerender();
    onToolChange?.(t);
  }

  // ── Snap: points + implicit intersections ──

  function findSnapTarget(pxPos: Vec2): SnapTarget | null {
    const mathPos = transform.toMath(pxPos);
    const snapRadius = SNAP_RADIUS_PX / transform.scale;
    let best: SnapTarget | null = null;
    let bestDist = Infinity;

    for (const [, obj] of resolved.objects) {
      if (obj.type !== "point") continue;
      const d = geo.dist(mathPos, obj.pos);
      if (d < snapRadius && d < bestDist) {
        best = { pos: obj.pos, pointId: obj.id };
        bestDist = d;
      }
    }

    if (best && bestDist < snapRadius * 0.6) return best;

    const intersections = computeAllIntersections(resolved);
    for (const pos of intersections) {
      const d = geo.dist(mathPos, pos);
      if (d < snapRadius && d < bestDist) {
        best = { pos, pointId: null };
        bestDist = d;
      }
    }

    return best;
  }

  /** Hit-test for line-like objects (line, segment, ray). Returns object id. */
  function hitTestLine(pxPos: Vec2): string | null {
    const mathPos = transform.toMath(pxPos);
    const hitRadius = LINE_HIT_PX / transform.scale;
    let closest: string | null = null;
    let closestDist = Infinity;

    for (const [, obj] of resolved.objects) {
      const d = distToObject(mathPos, obj);
      if (d !== null && d < hitRadius && d < closestDist) {
        closest = obj.id;
        closestDist = d;
      }
    }
    return closest;
  }

  function hitTestDraggable(px: Vec2): string | null {
    const mathPos = transform.toMath(px);
    const hitRadius = HIT_RADIUS_PX / transform.scale;
    let closest: string | null = null;
    let closestDist = Infinity;

    for (const [, obj] of resolved.objects) {
      if (obj.type !== "point" || !obj.draggable) continue;
      const d = geo.dist(mathPos, obj.pos);
      if (d < hitRadius && d < closestDist) {
        closest = obj.id;
        closestDist = d;
      }
    }
    return closest;
  }

  function getEventPos(e: MouseEvent | TouchEvent | WheelEvent): Vec2 {
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      const touch = (e as TouchEvent).touches[0] ?? (e as TouchEvent).changedTouches[0];
      return [touch.clientX - rect.left, touch.clientY - rect.top];
    }
    return [(e as MouseEvent).clientX - rect.left, (e as MouseEvent).clientY - rect.top];
  }

  function getOrCreatePoint(pxPos: Vec2): string {
    const snap = findSnapTarget(pxPos);
    if (snap) {
      if (snap.pointId) return snap.pointId;
      const id = `P${counters.point++}`;
      scene.points[id] = snap.pos;
      return id;
    }
    const mathPos = transform.toMath(pxPos);
    const id = `P${counters.point++}`;
    scene.points[id] = mathPos;
    return id;
  }

  function notifyChange(): void {
    onSceneChange?.();
  }

  /** Check if tool expects a line click as its next input */
  function toolNeedsLineNext(): boolean {
    if (activeTool === "perpendicular" || activeTool === "parallel") {
      return pending.lineId === null;
    }
    return false;
  }

  /** How many point clicks does this tool need total? */
  function toolPointCount(): number {
    switch (activeTool) {
      case "point": case "text": return 1;
      case "line": case "segment": case "circle": case "midpoint": case "perp_bisector": return 2;
      case "perpendicular": case "parallel": return 1; // 1 point (after line click)
      case "angle_bisector": return 3;
      case "compass": return 3;
      default: return 0;
    }
  }

  // ── Generic tool click dispatch ──

  function handleToolClick(pxPos: Vec2): void {
    // Text tool: place text at coordinates without creating a point
    if (activeTool === "text") {
      const snap = findSnapTarget(pxPos);
      const mathPos: Vec2 = snap ? snap.pos : transform.toMath(pxPos);
      showTextInput(pxPos, (content: string) => {
        pushUndo();
        scene.constructions.push({
          type: "text",
          content,
          pos: mathPos,
          id: `T${counters.text++}`,
        });
        rerender();
        notifyChange();
      });
      return;
    }

    // Tools that need a line first
    if (toolNeedsLineNext()) {
      const lineId = hitTestLine(pxPos);
      if (!lineId) return; // must click a line
      pushUndo();
      pending.lineId = lineId;
      rerender();
      return;
    }

    // Point-collecting tools
    const needed = toolPointCount();
    const have = pending.pointIds.length;

    if (have === 0) pushUndo();

    const ptId = getOrCreatePoint(pxPos);

    // Don't allow same point twice in a row
    if (pending.pointIds.length > 0 && pending.pointIds[pending.pointIds.length - 1] === ptId) return;

    pending.pointIds.push(ptId);

    if (pending.pointIds.length < needed) {
      // Still collecting
      rerender();
      notifyChange();
      return;
    }

    // All points collected — execute the construction
    executeConstruction();
    resetPending();
    rerender();
    notifyChange();
  }

  function executeConstruction(): void {
    const pts = pending.pointIds;

    switch (activeTool) {
      case "point":
        // Point was already created by getOrCreatePoint
        break;

      case "line":
        scene.constructions.push({
          type: "line",
          through: [pts[0], pts[1]],
          id: `L${counters.line++}`,
        });
        break;

      case "segment":
        scene.constructions.push({
          type: "segment",
          from: pts[0],
          to: pts[1],
          id: `S${counters.segment++}`,
        });
        break;

      case "circle":
        scene.constructions.push({
          type: "circle",
          center: pts[0],
          through: pts[1],
          id: `C${counters.circle++}`,
        });
        break;

      case "midpoint":
        scene.constructions.push({
          type: "midpoint",
          of: [pts[0], pts[1]],
          id: `M${counters.midpoint++}`,
        });
        break;

      case "perp_bisector": {
        // Create midpoint + perpendicular bisector line
        const midId = `M${counters.midpoint++}`;
        const lineId = `PB${counters.perpBisector++}`;
        scene.constructions.push({
          type: "midpoint",
          of: [pts[0], pts[1]],
          id: midId,
        });
        // The perp bisector is a line perpendicular to the segment through the midpoint
        // We need a temp segment to reference. Create a hidden line, then perpendicular to it.
        // Simpler: add the segment, then perpendicular through midpoint
        const tempLineId = `_pb_ref_${lineId}`;
        scene.constructions.push({
          type: "line",
          through: [pts[0], pts[1]],
          id: tempLineId,
        });
        scene.constructions.push({
          type: "perpendicular",
          to: tempLineId,
          through: midId,
          id: lineId,
        });
        // Hide the reference line
        scene.style[tempLineId] = { color: "transparent", width: 0 };
        break;
      }

      case "perpendicular":
        scene.constructions.push({
          type: "perpendicular",
          to: pending.lineId!,
          through: pts[0],
          id: `Perp${counters.perpendicular++}`,
        });
        break;

      case "parallel":
        scene.constructions.push({
          type: "parallel",
          to: pending.lineId!,
          through: pts[0],
          id: `Par${counters.parallel++}`,
        });
        break;

      case "angle_bisector":
        scene.constructions.push({
          type: "angle_bisector",
          points: [pts[0], pts[1], pts[2]],
          id: `AB${counters.angleBisector++}`,
        });
        break;

      case "compass": {
        // pts[0], pts[1] define the radius; pts[2] is the center
        const radiusExpr = `distance(${pts[0]}, ${pts[1]})`;
        scene.constructions.push({
          type: "circle",
          center: pts[2],
          radius: radiusExpr,
          id: `C${counters.circle++}`,
        });
        break;
      }

      case "text":
        // Handled directly in handleToolClick — should not reach here
        break;
    }
  }

  // ── Event handlers ──

  function onDown(e: MouseEvent | TouchEvent): void {
    const pos = getEventPos(e);

    if (activeTool === "pointer") {
      const pointId = hitTestDraggable(pos);
      if (pointId) {
        pushUndo();
        drag = { kind: "point", id: pointId };
        canvas.style.cursor = "grabbing";
      } else {
        drag = { kind: "pan", lastPx: pos };
        canvas.style.cursor = "move";
      }
      e.preventDefault();
      return;
    }

    handleToolClick(pos);
    e.preventDefault();
  }

  function onMove(e: MouseEvent | TouchEvent): void {
    const pos = getEventPos(e);

    if (activeTool === "pointer") {
      if (!drag) {
        const hoverId = hitTestDraggable(pos);
        canvas.style.cursor = hoverId ? "grab" : "default";
        return;
      }

      if (drag.kind === "point") {
        const mathPos = transform.toMath(pos);
        pointOverrides.set(drag.id, mathPos);
        rerender();
      } else {
        const dx = (pos[0] - drag.lastPx[0]) / transform.scale;
        const dy = (pos[1] - drag.lastPx[1]) / transform.scale;
        transform.panX -= dx;
        transform.panY += dy;
        drag.lastPx = pos;
        rerender();
      }
      e.preventDefault();
      return;
    }

    canvas.style.cursor = "crosshair";

    // Update highlights based on what tool expects next
    if (toolNeedsLineNext()) {
      highlightLineId = hitTestLine(pos);
      currentSnap = null;
    } else {
      highlightLineId = null;
      currentSnap = findSnapTarget(pos);
    }

    ghostPos = transform.toMath(pos);
    rerender();
  }

  function onUp(): void {
    if (drag) {
      if (drag.kind === "point") {
        const override = pointOverrides.get(drag.id);
        if (override) {
          scene.points[drag.id] = override;
          pointOverrides.delete(drag.id);
          notifyChange();
        } else {
          undoStack.pop();
        }
      }
      canvas.style.cursor = drag.kind === "point" ? "grab" : "default";
      drag = null;
    }
  }

  function onWheel(e: WheelEvent): void {
    e.preventDefault();
    const direction = e.deltaY < 0 ? 1 : -1;
    const factor = direction > 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, transform.scale * factor));

    const pos = getEventPos(e);
    const mathBefore = transform.toMath(pos);
    transform.scale = newScale;
    const mathAfter = transform.toMath(pos);

    transform.panX -= mathAfter[0] - mathBefore[0];
    transform.panY -= mathAfter[1] - mathBefore[1];

    rerender();
  }

  function onKeyDown(e: KeyboardEvent): void {
    if (e.key === "Escape") {
      if (pending.pointIds.length > 0 || pending.lineId) {
        // Cancel partial construction — undo the snapshot we pushed
        if (undoStack.length > 0) {
          restoreSnapshot(undoStack.pop()!);
        }
        resetPending();
        rerender();
        notifyChange();
      } else {
        setTool("pointer");
      }
      return;
    }

    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === "z") {
      e.preventDefault();
      e.stopPropagation();
      undo();
      return;
    }

    if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "z") ||
        ((e.ctrlKey || e.metaKey) && e.key === "y")) {
      e.preventDefault();
      e.stopPropagation();
      redo();
      return;
    }
  }

  function showTextInput(pxPos: Vec2, onCommit: (text: string) => void): void {
    const rect = canvas.getBoundingClientRect();
    const container = canvas.parentElement;
    if (!container) return;

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Label...";
    input.className = "geometry-text-input";
    input.style.position = "absolute";
    input.style.left = `${pxPos[0] - 50}px`;
    input.style.top = `${pxPos[1] - 16}px`;
    input.style.width = "100px";
    input.style.zIndex = "100";

    const commit = () => {
      const value = input.value.trim();
      if (input.parentElement) input.remove();
      if (value) onCommit(value);
    };

    input.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter") { e.preventDefault(); commit(); }
      if (e.key === "Escape") { e.preventDefault(); input.remove(); }
      e.stopPropagation();
    });
    input.addEventListener("blur", commit);

    container.appendChild(input);
    input.focus();
  }

  canvas.addEventListener("mousedown", onDown);
  canvas.addEventListener("mousemove", onMove);
  canvas.addEventListener("mouseup", onUp);
  canvas.addEventListener("mouseleave", () => {
    onUp();
    currentSnap = null;
    ghostPos = null;
    highlightLineId = null;
    if (activeTool !== "pointer") rerender();
  });
  canvas.addEventListener("wheel", onWheel, { passive: false });
  canvas.addEventListener("touchstart", onDown, { passive: false });
  canvas.addEventListener("touchmove", onMove, { passive: false });
  canvas.addEventListener("touchend", onUp);

  canvas.tabIndex = 0;
  canvas.addEventListener("keydown", onKeyDown);

  return { setTool };
}

// ── Distance from a point to a resolved object (for line hit-testing) ──

function distToObject(p: Vec2, obj: ResolvedObject): number | null {
  switch (obj.type) {
    case "line": {
      const line: geo.Line = { point: obj.point, dir: obj.dir };
      return distPointToLine(p, line);
    }
    case "segment": {
      return distPointToSegment(p, obj.from, obj.to);
    }
    case "ray": {
      return distPointToRay(p, obj.origin, obj.dir);
    }
    case "circle": {
      // Distance to the circle's edge
      const dCenter = geo.dist(p, obj.center);
      return Math.abs(dCenter - obj.radius);
    }
    default:
      return null;
  }
}

function distPointToLine(p: Vec2, line: geo.Line): number {
  const v = geo.sub(p, line.point);
  const proj = geo.dot(v, line.dir);
  const closest = geo.add(line.point, geo.scale(line.dir, proj));
  return geo.dist(p, closest);
}

function distPointToSegment(p: Vec2, a: Vec2, b: Vec2): number {
  const line = geo.lineFromTwoPoints(a, b);
  const len = geo.dist(a, b);
  const v = geo.sub(p, a);
  const t = Math.max(0, Math.min(len, geo.dot(v, line.dir)));
  const closest = geo.add(a, geo.scale(line.dir, t));
  return geo.dist(p, closest);
}

function distPointToRay(p: Vec2, origin: Vec2, dir: Vec2): number {
  const normDir = geo.normalize(dir);
  const v = geo.sub(p, origin);
  const t = Math.max(0, geo.dot(v, normDir));
  const closest = geo.add(origin, geo.scale(normDir, t));
  return geo.dist(p, closest);
}

// ── Compute all implicit intersections ──

function computeAllIntersections(resolved: ResolvedScene): Vec2[] {
  const intersectables: ResolvedObject[] = [];
  for (const [, obj] of resolved.objects) {
    if (obj.type === "line" || obj.type === "segment" || obj.type === "ray" || obj.type === "circle") {
      intersectables.push(obj);
    }
  }

  const results: Vec2[] = [];

  for (let i = 0; i < intersectables.length; i++) {
    for (let j = i + 1; j < intersectables.length; j++) {
      const pts = intersectPair(intersectables[i], intersectables[j]);
      for (const p of pts) {
        if (!isNaN(p[0]) && !isNaN(p[1])) {
          results.push(p);
        }
      }
    }
  }

  return results;
}

function toGeoLine(obj: ResolvedObject): geo.Line | null {
  switch (obj.type) {
    case "line": return { point: obj.point, dir: obj.dir };
    case "segment": return geo.lineFromTwoPoints(obj.from, obj.to);
    case "ray": return { point: obj.origin, dir: obj.dir };
    default: return null;
  }
}

function intersectPair(a: ResolvedObject, b: ResolvedObject): Vec2[] {
  const aLine = toGeoLine(a);
  const bLine = toGeoLine(b);
  const aCircle = a.type === "circle" ? a : null;
  const bCircle = b.type === "circle" ? b : null;

  let pts: Vec2[] = [];

  if (aLine && bLine) {
    const p = geo.lineLineIntersection(aLine, bLine);
    if (p) pts = [p];
  } else if (aLine && bCircle) {
    pts = geo.lineCircleIntersection(aLine, bCircle.center, bCircle.radius);
  } else if (aCircle && bLine) {
    pts = geo.lineCircleIntersection(bLine, aCircle.center, aCircle.radius);
  } else if (aCircle && bCircle) {
    pts = geo.circleCircleIntersection(aCircle.center, aCircle.radius, bCircle.center, bCircle.radius);
  }

  pts = filterByBounds(pts, a);
  pts = filterByBounds(pts, b);
  return pts;
}

function filterByBounds(pts: Vec2[], obj: ResolvedObject): Vec2[] {
  if (obj.type === "segment") return geo.filterSegment(pts, obj.from, obj.to);
  if (obj.type === "ray") return geo.filterRay(pts, obj.origin, obj.dir);
  return pts;
}

// ── Drawing helpers ──

function drawSnapRing(ctx: CanvasRenderingContext2D, transform: Transform, pos: Vec2): void {
  const [px, py] = transform.toPixel(pos);
  ctx.save();
  ctx.strokeStyle = "rgba(70, 130, 240, 0.8)";
  ctx.lineWidth = 2;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.arc(px, py, SNAP_RING_RADIUS, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(70, 130, 240, 0.12)";
  ctx.fill();
  ctx.restore();
}

function drawLineHighlight(
  ctx: CanvasRenderingContext2D,
  transform: Transform,
  resolved: ResolvedScene,
  lineId: string
): void {
  const obj = resolved.objects.get(lineId);
  if (!obj) return;

  ctx.save();
  ctx.strokeStyle = "rgba(70, 130, 240, 0.4)";
  ctx.lineWidth = 6;
  ctx.setLineDash([]);

  if (obj.type === "line") {
    const { width, height } = transform.config;
    const diag = Math.sqrt(width * width + height * height) / transform.scale * 2;
    const p1 = transform.toPixel([obj.point[0] + obj.dir[0] * -diag, obj.point[1] + obj.dir[1] * -diag]);
    const p2 = transform.toPixel([obj.point[0] + obj.dir[0] * diag, obj.point[1] + obj.dir[1] * diag]);
    ctx.beginPath();
    ctx.moveTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.stroke();
  } else if (obj.type === "segment") {
    const p1 = transform.toPixel(obj.from);
    const p2 = transform.toPixel(obj.to);
    ctx.beginPath();
    ctx.moveTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.stroke();
  } else if (obj.type === "ray") {
    const { width, height } = transform.config;
    const diag = Math.sqrt(width * width + height * height) / transform.scale * 2;
    const p1 = transform.toPixel(obj.origin);
    const p2 = transform.toPixel([obj.origin[0] + obj.dir[0] * diag, obj.origin[1] + obj.dir[1] * diag]);
    ctx.beginPath();
    ctx.moveTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.stroke();
  } else if (obj.type === "circle") {
    const [cx, cy] = transform.toPixel(obj.center);
    const rPx = obj.radius * transform.scale;
    ctx.beginPath();
    ctx.arc(cx, cy, rPx, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawGhostForTool(
  ctx: CanvasRenderingContext2D,
  transform: Transform,
  resolved: ResolvedScene,
  tool: ToolType,
  pending: PendingState,
  ghostPos: Vec2 | null,
  snap: SnapTarget | null
): void {
  if (!ghostPos || pending.pointIds.length === 0) return;

  const targetPos = snap ? snap.pos : ghostPos;

  ctx.save();
  ctx.strokeStyle = "rgba(70, 130, 240, 0.5)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 4]);

  const firstPt = getResolvedPos(resolved, pending.pointIds[0]);
  if (!firstPt) { ctx.restore(); return; }

  const [x1, y1] = transform.toPixel(firstPt);
  const [x2, y2] = transform.toPixel(targetPos);

  switch (tool) {
    case "line":
    case "segment":
    case "perp_bisector": {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      if (tool === "perp_bisector") {
        // Show midpoint indicator
        const mid = transform.toPixel(geo.midpoint(firstPt, targetPos));
        ctx.beginPath();
        ctx.arc(mid[0], mid[1], 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(70, 130, 240, 0.6)";
        ctx.fill();
      }
      break;
    }
    case "circle": {
      const r = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      ctx.beginPath();
      ctx.arc(x1, y1, r, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case "midpoint": {
      // Show line between points and midpoint dot
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      const mid = transform.toPixel(geo.midpoint(firstPt, targetPos));
      ctx.beginPath();
      ctx.arc(mid[0], mid[1], 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(70, 130, 240, 0.6)";
      ctx.fill();
      break;
    }
    case "compass": {
      if (pending.pointIds.length === 1) {
        // Showing the radius line
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      } else if (pending.pointIds.length === 2) {
        // Showing the circle at cursor with captured radius
        const p0 = getResolvedPos(resolved, pending.pointIds[0]);
        const p1 = getResolvedPos(resolved, pending.pointIds[1]);
        if (p0 && p1) {
          const r = geo.dist(p0, p1) * transform.scale;
          ctx.beginPath();
          ctx.arc(x2, y2, r, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      break;
    }
    case "angle_bisector": {
      if (pending.pointIds.length === 1) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      } else if (pending.pointIds.length === 2) {
        const secondPt = getResolvedPos(resolved, pending.pointIds[1]);
        if (secondPt) {
          const [sx, sy] = transform.toPixel(secondPt);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(sx, sy);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }
      break;
    }
    case "perpendicular":
    case "parallel": {
      // Ghost is just a dot at the point — the line from construction will show after
      ctx.beginPath();
      ctx.arc(x2, y2, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(70, 130, 240, 0.6)";
      ctx.fill();
      break;
    }
  }

  ctx.restore();
}

function getResolvedPos(resolved: ResolvedScene, id: string): Vec2 | null {
  const obj = resolved.objects.get(id);
  if (!obj || obj.type !== "point") return null;
  return obj.pos;
}

// ── Counters ──

interface Counters {
  point: number;
  line: number;
  segment: number;
  circle: number;
  midpoint: number;
  perpBisector: number;
  perpendicular: number;
  parallel: number;
  angleBisector: number;
  text: number;
}

function recalcCounters(scene: GeometryScene): Counters {
  return {
    point: Object.keys(scene.points).length + 1,
    line: scene.constructions.filter((c) => c.type === "line").length + 1,
    segment: scene.constructions.filter((c) => c.type === "segment").length + 1,
    circle: scene.constructions.filter((c) => c.type === "circle").length + 1,
    midpoint: scene.constructions.filter((c) => c.type === "midpoint").length + 1,
    perpBisector: scene.constructions.filter((c) => c.type === "perpendicular").length + 1,
    perpendicular: scene.constructions.filter((c) => c.type === "perpendicular").length + 1,
    parallel: scene.constructions.filter((c) => c.type === "parallel").length + 1,
    angleBisector: scene.constructions.filter((c) => c.type === "angle_bisector").length + 1,
    text: scene.constructions.filter((c) => c.type === "text").length + 1,
  };
}
