import {
  ResolvedObject,
  ResolvedScene,
  StyleDef,
  Vec2,
} from "../types";
import { Transform } from "./canvas";
import { drawGrid } from "./grid";
import { ThemeColors } from "./theme";

const DEFAULT_POINT_SIZE = 4;
const DEFAULT_LINE_WIDTH = 1.5;
const LABEL_OFFSET = 10;

export function renderScene(
  ctx: CanvasRenderingContext2D,
  scene: ResolvedScene,
  transform: Transform,
  theme: ThemeColors
): void {
  const { width, height } = scene.config;

  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, width, height);

  drawGrid(ctx, transform, theme);

  if (scene.title) {
    ctx.save();
    ctx.fillStyle = theme.text;
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(scene.title, 8, 8);
    ctx.restore();
  }

  const ordered = sortByZOrder([...scene.objects.values()]);

  for (const obj of ordered) {
    const style = scene.style[obj.id] ?? {};
    drawObject(ctx, obj, style, transform, theme);
  }
}

const Z_ORDER: Record<string, number> = {
  polygon: 0,
  circle: 1,
  line: 2,
  segment: 2,
  ray: 2,
  point: 3,
};

function sortByZOrder(objects: ResolvedObject[]): ResolvedObject[] {
  return objects.sort((a, b) => (Z_ORDER[a.type] ?? 2) - (Z_ORDER[b.type] ?? 2));
}

function drawObject(
  ctx: CanvasRenderingContext2D,
  obj: ResolvedObject,
  style: StyleDef,
  transform: Transform,
  theme: ThemeColors
): void {
  switch (obj.type) {
    case "point":
      return drawPoint(ctx, obj.pos, obj.id, style, transform, theme);
    case "segment":
      return drawSegment(ctx, obj.from, obj.to, style, transform, theme);
    case "line":
      return drawLine(ctx, obj.point, obj.dir, style, transform, theme);
    case "ray":
      return drawRay(ctx, obj.origin, obj.dir, style, transform, theme);
    case "circle":
      return drawCircle(ctx, obj.center, obj.radius, style, transform, theme);
    case "polygon":
      return drawPolygon(ctx, obj.vertices, style, transform, theme);
  }
}

function applyStroke(ctx: CanvasRenderingContext2D, style: StyleDef, theme: ThemeColors): void {
  ctx.strokeStyle = style.color ?? theme.text;
  ctx.lineWidth = style.width ?? DEFAULT_LINE_WIDTH;
  ctx.setLineDash(style.dash ? [6, 4] : []);
}

function drawPoint(
  ctx: CanvasRenderingContext2D,
  pos: Vec2,
  id: string,
  style: StyleDef,
  transform: Transform,
  theme: ThemeColors
): void {
  if (isNaN(pos[0]) || isNaN(pos[1])) return;

  const [px, py] = transform.toPixel(pos);
  const r = style.size ?? DEFAULT_POINT_SIZE;

  ctx.save();
  ctx.fillStyle = style.color ?? theme.text;
  ctx.beginPath();
  ctx.arc(px, py, r, 0, Math.PI * 2);
  ctx.fill();

  const label = style.label ?? id;
  ctx.fillStyle = style.color ?? theme.text;
  ctx.font = "12px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillText(label, px + LABEL_OFFSET, py - LABEL_OFFSET / 2);

  ctx.restore();
}

function drawSegment(
  ctx: CanvasRenderingContext2D,
  from: Vec2,
  to: Vec2,
  style: StyleDef,
  transform: Transform,
  theme: ThemeColors
): void {
  const [x1, y1] = transform.toPixel(from);
  const [x2, y2] = transform.toPixel(to);

  ctx.save();
  applyStroke(ctx, style, theme);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  point: Vec2,
  dir: Vec2,
  style: StyleDef,
  transform: Transform,
  theme: ThemeColors
): void {
  const { width, height } = transform.config;
  const diagonal = Math.sqrt(width * width + height * height) / transform.scale;
  const t1 = -diagonal * 2;
  const t2 = diagonal * 2;

  const p1: Vec2 = [point[0] + dir[0] * t1, point[1] + dir[1] * t1];
  const p2: Vec2 = [point[0] + dir[0] * t2, point[1] + dir[1] * t2];

  const [x1, y1] = transform.toPixel(p1);
  const [x2, y2] = transform.toPixel(p2);

  ctx.save();
  applyStroke(ctx, style, theme);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function drawRay(
  ctx: CanvasRenderingContext2D,
  origin: Vec2,
  dir: Vec2,
  style: StyleDef,
  transform: Transform,
  theme: ThemeColors
): void {
  const { width, height } = transform.config;
  const diagonal = Math.sqrt(width * width + height * height) / transform.scale;
  const farPoint: Vec2 = [origin[0] + dir[0] * diagonal * 2, origin[1] + dir[1] * diagonal * 2];

  const [x1, y1] = transform.toPixel(origin);
  const [x2, y2] = transform.toPixel(farPoint);

  ctx.save();
  applyStroke(ctx, style, theme);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function drawCircle(
  ctx: CanvasRenderingContext2D,
  center: Vec2,
  radius: number,
  style: StyleDef,
  transform: Transform,
  theme: ThemeColors
): void {
  const [cx, cy] = transform.toPixel(center);
  const rPx = radius * transform.scale;

  ctx.save();

  if (style.fill) {
    ctx.fillStyle = style.fill;
    ctx.beginPath();
    ctx.arc(cx, cy, rPx, 0, Math.PI * 2);
    ctx.fill();
  }

  applyStroke(ctx, style, theme);
  ctx.beginPath();
  ctx.arc(cx, cy, rPx, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawPolygon(
  ctx: CanvasRenderingContext2D,
  vertices: Vec2[],
  style: StyleDef,
  transform: Transform,
  theme: ThemeColors
): void {
  if (vertices.length < 3) return;

  const pixelVerts = vertices.map((v) => transform.toPixel(v));

  ctx.save();

  ctx.beginPath();
  ctx.moveTo(pixelVerts[0][0], pixelVerts[0][1]);
  for (let i = 1; i < pixelVerts.length; i++) {
    ctx.lineTo(pixelVerts[i][0], pixelVerts[i][1]);
  }
  ctx.closePath();

  if (style.fill) {
    ctx.fillStyle = style.fill;
    ctx.fill();
  }

  applyStroke(ctx, style, theme);
  ctx.stroke();

  ctx.restore();
}
