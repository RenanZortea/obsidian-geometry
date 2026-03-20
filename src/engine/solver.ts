import {
  GeometryScene,
  ConstructionStep,
  ResolvedObject,
  ResolvedScene,
  ResolvedPoint,
  ResolvedLine,
  ResolvedSegment,
  ResolvedRay,
  ResolvedCircle,
  ResolvedText,
  Vec2,
} from "../types";
import * as geo from "./geo";
import { evaluateExpression } from "./expressions";

export function solve(
  scene: GeometryScene,
  pointOverrides?: Map<string, Vec2>
): ResolvedScene {
  const objects = new Map<string, ResolvedObject>();

  // Helper: get all resolved point positions for expression evaluation
  const resolvedPoints = new Map<string, Vec2>();

  // Seed explicit points
  for (const [id, coords] of Object.entries(scene.points)) {
    const pos = pointOverrides?.get(id) ?? coords;
    const point: ResolvedPoint = { type: "point", id, pos, draggable: true };
    objects.set(id, point);
    resolvedPoints.set(id, pos);
  }

  // Process constructions in order
  for (const step of scene.constructions) {
    resolveStep(step, objects, resolvedPoints);
  }

  return {
    objects,
    config: scene.config,
    style: scene.style,
    title: scene.title,
  };
}

function resolveStep(
  step: ConstructionStep,
  objects: Map<string, ResolvedObject>,
  points: Map<string, Vec2>
): void {
  switch (step.type) {
    case "line":
      return resolveLine(step, objects, points);
    case "segment":
      return resolveSegment(step, objects, points);
    case "ray":
      return resolveRay(step, objects, points);
    case "circle":
      return resolveCircle(step, objects, points);
    case "intersect":
      return resolveIntersect(step, objects, points);
    case "midpoint":
      return resolveMidpoint(step, objects, points);
    case "perpendicular":
      return resolvePerpendicular(step, objects, points);
    case "parallel":
      return resolveParallel(step, objects, points);
    case "angle_bisector":
      return resolveAngleBisector(step, objects, points);
    case "text":
      return resolveText(step, objects, points);
    case "polygon":
      return resolvePolygon(step, objects, points);
  }
}

function getPoint(id: string, points: Map<string, Vec2>): Vec2 {
  const p = points.get(id);
  if (!p) throw new Error(`Unknown point '${id}'`);
  return p;
}

function getObject(id: string, objects: Map<string, ResolvedObject>): ResolvedObject {
  const obj = objects.get(id);
  if (!obj) throw new Error(`Unknown object '${id}'`);
  return obj;
}

function resolveLine(
  step: { through: [string, string]; id: string },
  objects: Map<string, ResolvedObject>,
  points: Map<string, Vec2>
): void {
  const p1 = getPoint(step.through[0], points);
  const p2 = getPoint(step.through[1], points);
  const line = geo.lineFromTwoPoints(p1, p2);
  objects.set(step.id, {
    type: "line",
    id: step.id,
    point: line.point,
    dir: line.dir,
  });
}

function resolveSegment(
  step: { from: string; to: string; id: string },
  objects: Map<string, ResolvedObject>,
  points: Map<string, Vec2>
): void {
  objects.set(step.id, {
    type: "segment",
    id: step.id,
    from: getPoint(step.from, points),
    to: getPoint(step.to, points),
  });
}

function resolveRay(
  step: { from: string; through: string; id: string },
  objects: Map<string, ResolvedObject>,
  points: Map<string, Vec2>
): void {
  const origin = getPoint(step.from, points);
  const through = getPoint(step.through, points);
  objects.set(step.id, {
    type: "ray",
    id: step.id,
    origin,
    dir: geo.normalize(geo.sub(through, origin)),
  });
}

function resolveCircle(
  step: { center: string; through?: string; radius?: number | string; id: string },
  objects: Map<string, ResolvedObject>,
  points: Map<string, Vec2>
): void {
  const center = getPoint(step.center, points);
  let radius: number;

  if (step.through) {
    radius = geo.dist(center, getPoint(step.through, points));
  } else if (step.radius !== undefined) {
    radius = evaluateExpression(step.radius, points);
  } else {
    throw new Error(`Circle '${step.id}': need 'through' or 'radius'`);
  }

  objects.set(step.id, { type: "circle", id: step.id, center, radius });
}

function resolveIntersect(
  step: { of: [string, string]; id: string | [string, string]; which?: number },
  objects: Map<string, ResolvedObject>,
  points: Map<string, Vec2>
): void {
  const obj1 = getObject(step.of[0], objects);
  const obj2 = getObject(step.of[1], objects);

  let rawPoints = computeIntersection(obj1, obj2);
  rawPoints = geo.sortIntersections(rawPoints);

  if (Array.isArray(step.id)) {
    // Two IDs: assign both intersection points
    for (let i = 0; i < step.id.length; i++) {
      const pos: Vec2 = i < rawPoints.length ? rawPoints[i] : [NaN, NaN];
      const pt: ResolvedPoint = { type: "point", id: step.id[i], pos, draggable: false };
      objects.set(step.id[i], pt);
      points.set(step.id[i], pos);
    }
  } else {
    // Single ID with optional 'which'
    const idx = (step.which ?? 1) - 1;
    const pos: Vec2 = idx < rawPoints.length ? rawPoints[idx] : [NaN, NaN];
    const pt: ResolvedPoint = { type: "point", id: step.id, pos, draggable: false };
    objects.set(step.id, pt);
    points.set(step.id, pos);
  }
}

function computeIntersection(a: ResolvedObject, b: ResolvedObject): Vec2[] {
  const aLine = toLineInfo(a);
  const bLine = toLineInfo(b);
  const aCircle = a.type === "circle" ? a : null;
  const bCircle = b.type === "circle" ? b : null;

  if (aLine && bLine) {
    const p = geo.lineLineIntersection(aLine.line, bLine.line);
    if (!p) return [];
    let pts = [p];
    pts = filterByKind(pts, a, aLine);
    pts = filterByKind(pts, b, bLine);
    return pts;
  }

  if (aLine && bCircle) {
    let pts = geo.lineCircleIntersection(aLine.line, bCircle.center, bCircle.radius);
    pts = filterByKind(pts, a, aLine);
    return pts;
  }

  if (aCircle && bLine) {
    let pts = geo.lineCircleIntersection(bLine.line, aCircle.center, aCircle.radius);
    pts = filterByKind(pts, b, bLine);
    return pts;
  }

  if (aCircle && bCircle) {
    return geo.circleCircleIntersection(aCircle.center, aCircle.radius, bCircle.center, bCircle.radius);
  }

  throw new Error(`Cannot intersect '${a.type}' with '${b.type}'`);
}

interface LineInfo {
  line: geo.Line;
}

function toLineInfo(obj: ResolvedObject): LineInfo | null {
  switch (obj.type) {
    case "line":
      return { line: { point: obj.point, dir: obj.dir } };
    case "segment":
      return { line: geo.lineFromTwoPoints(obj.from, obj.to) };
    case "ray":
      return { line: { point: obj.origin, dir: obj.dir } };
    default:
      return null;
  }
}

function filterByKind(pts: Vec2[], obj: ResolvedObject, _info: LineInfo): Vec2[] {
  if (obj.type === "segment") {
    return geo.filterSegment(pts, (obj as ResolvedSegment).from, (obj as ResolvedSegment).to);
  }
  if (obj.type === "ray") {
    return geo.filterRay(pts, (obj as ResolvedRay).origin, (obj as ResolvedRay).dir);
  }
  return pts; // infinite line — no filtering
}

function resolveMidpoint(
  step: { of: [string, string]; id: string },
  objects: Map<string, ResolvedObject>,
  points: Map<string, Vec2>
): void {
  const p1 = getPoint(step.of[0], points);
  const p2 = getPoint(step.of[1], points);
  const pos = geo.midpoint(p1, p2);
  objects.set(step.id, { type: "point", id: step.id, pos, draggable: false });
  points.set(step.id, pos);
}

function resolvePerpendicular(
  step: { to: string; through: string; id: string },
  objects: Map<string, ResolvedObject>,
  points: Map<string, Vec2>
): void {
  const lineObj = getObject(step.to, objects);
  const lineInfo = toLineInfo(lineObj);
  if (!lineInfo) throw new Error(`'${step.to}' is not a line-like object`);
  const throughPt = getPoint(step.through, points);
  const result = geo.perpendicularThrough(lineInfo.line, throughPt);
  objects.set(step.id, { type: "line", id: step.id, point: result.point, dir: result.dir });
}

function resolveParallel(
  step: { to: string; through: string; id: string },
  objects: Map<string, ResolvedObject>,
  points: Map<string, Vec2>
): void {
  const lineObj = getObject(step.to, objects);
  const lineInfo = toLineInfo(lineObj);
  if (!lineInfo) throw new Error(`'${step.to}' is not a line-like object`);
  const throughPt = getPoint(step.through, points);
  const result = geo.parallelThrough(lineInfo.line, throughPt);
  objects.set(step.id, { type: "line", id: step.id, point: result.point, dir: result.dir });
}

function resolveAngleBisector(
  step: { points: [string, string, string]; id: string },
  objects: Map<string, ResolvedObject>,
  points: Map<string, Vec2>
): void {
  const a = getPoint(step.points[0], points);
  const vertex = getPoint(step.points[1], points);
  const b = getPoint(step.points[2], points);
  const result = geo.angleBisectorThrough(a, vertex, b);
  objects.set(step.id, { type: "line", id: step.id, point: result.point, dir: result.dir });
}

function resolveText(
  step: { content: string; at?: string; pos?: Vec2; id: string },
  objects: Map<string, ResolvedObject>,
  points: Map<string, Vec2>
): void {
  let pos: Vec2;
  if (step.at) {
    pos = getPoint(step.at, points);
  } else if (step.pos) {
    pos = step.pos;
  } else {
    throw new Error(`Text '${step.id}': need 'at' or 'pos'`);
  }
  const resolved: ResolvedText = { type: "text", id: step.id, content: step.content, pos };
  objects.set(step.id, resolved);
}

function resolvePolygon(
  step: { vertices: string[]; id: string },
  objects: Map<string, ResolvedObject>,
  points: Map<string, Vec2>
): void {
  const verts = step.vertices.map((id) => getPoint(id, points));
  objects.set(step.id, { type: "polygon", id: step.id, vertices: verts });
}
