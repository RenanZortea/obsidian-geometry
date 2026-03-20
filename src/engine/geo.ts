import { Vec2 } from "../types";

const EPSILON = 1e-10;

// ── Vector operations ──

export function add(a: Vec2, b: Vec2): Vec2 {
  return [a[0] + b[0], a[1] + b[1]];
}

export function sub(a: Vec2, b: Vec2): Vec2 {
  return [a[0] - b[0], a[1] - b[1]];
}

export function scale(v: Vec2, s: number): Vec2 {
  return [v[0] * s, v[1] * s];
}

export function dot(a: Vec2, b: Vec2): number {
  return a[0] * b[0] + a[1] * b[1];
}

export function cross(a: Vec2, b: Vec2): number {
  return a[0] * b[1] - a[1] * b[0];
}

export function length(v: Vec2): number {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}

export function dist(a: Vec2, b: Vec2): number {
  return length(sub(b, a));
}

export function normalize(v: Vec2): Vec2 {
  const len = length(v);
  if (len < EPSILON) return [0, 0];
  return [v[0] / len, v[1] / len];
}

export function perpVec(v: Vec2): Vec2 {
  return [-v[1], v[0]];
}

export function midpoint(a: Vec2, b: Vec2): Vec2 {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
}

// ── Line representation: point + direction ──

export interface Line {
  point: Vec2;
  dir: Vec2; // unit direction
}

export function lineFromTwoPoints(p1: Vec2, p2: Vec2): Line {
  return { point: p1, dir: normalize(sub(p2, p1)) };
}

// ── Intersections ──

export function lineLineIntersection(l1: Line, l2: Line): Vec2 | null {
  const d = cross(l1.dir, l2.dir);
  if (Math.abs(d) < EPSILON) return null; // parallel
  const diff = sub(l2.point, l1.point);
  const t = cross(diff, l2.dir) / d;
  return add(l1.point, scale(l1.dir, t));
}

export function lineCircleIntersection(
  line: Line,
  center: Vec2,
  radius: number
): Vec2[] {
  // Solve |line.point + t * line.dir - center|^2 = radius^2
  const oc = sub(line.point, center);
  const a = dot(line.dir, line.dir); // should be 1 if normalized
  const b = 2 * dot(oc, line.dir);
  const c = dot(oc, oc) - radius * radius;
  const disc = b * b - 4 * a * c;

  if (disc < -EPSILON) return [];
  if (disc < EPSILON) {
    const t = -b / (2 * a);
    return [add(line.point, scale(line.dir, t))];
  }

  const sqrtDisc = Math.sqrt(disc);
  const t1 = (-b - sqrtDisc) / (2 * a);
  const t2 = (-b + sqrtDisc) / (2 * a);
  return [
    add(line.point, scale(line.dir, t1)),
    add(line.point, scale(line.dir, t2)),
  ];
}

export function circleCircleIntersection(
  c1: Vec2,
  r1: number,
  c2: Vec2,
  r2: number
): Vec2[] {
  const d = dist(c1, c2);
  if (d < EPSILON) return []; // concentric
  if (d > r1 + r2 + EPSILON) return []; // too far apart
  if (d < Math.abs(r1 - r2) - EPSILON) return []; // one inside the other

  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const hSq = r1 * r1 - a * a;
  if (hSq < -EPSILON) return [];

  const h = hSq < 0 ? 0 : Math.sqrt(hSq);
  const dir = normalize(sub(c2, c1));
  const p = add(c1, scale(dir, a));

  if (h < EPSILON) return [p]; // tangent

  const perp = perpVec(dir);
  return [
    add(p, scale(perp, h)),
    add(p, scale(perp, -h)),
  ];
}

// ── Parameter utilities (for filtering segment/ray intersections) ──

/** Get the parameter t for a point along a line: p = line.point + t * line.dir */
export function paramOnLine(line: Line, point: Vec2): number {
  const diff = sub(point, line.point);
  // Project onto direction
  return dot(diff, line.dir);
}

/** Filter intersection points to those within a segment (t in [0, segmentLength]) */
export function filterSegment(
  points: Vec2[],
  from: Vec2,
  to: Vec2
): Vec2[] {
  const line = lineFromTwoPoints(from, to);
  const len = dist(from, to);
  return points.filter((p) => {
    const t = paramOnLine(line, p);
    return t >= -EPSILON && t <= len + EPSILON;
  });
}

/** Filter intersection points to those on a ray (t >= 0) */
export function filterRay(
  points: Vec2[],
  origin: Vec2,
  dir: Vec2
): Vec2[] {
  const line: Line = { point: origin, dir: normalize(dir) };
  return points.filter((p) => paramOnLine(line, p) >= -EPSILON);
}

// ── Sorting convention for intersection points ──

export function sortIntersections(points: Vec2[]): Vec2[] {
  return [...points].sort((a, b) => {
    if (Math.abs(a[0] - b[0]) > EPSILON) return a[0] - b[0];
    return a[1] - b[1];
  });
}

// ── Construction helpers ──

export function perpendicularThrough(line: Line, point: Vec2): Line {
  return { point, dir: normalize(perpVec(line.dir)) };
}

export function parallelThrough(line: Line, point: Vec2): Line {
  return { point, dir: line.dir };
}

/** Angle bisector: given points A, V (vertex), B, returns a line through V
 *  that bisects the angle AVB. */
export function angleBisectorThrough(a: Vec2, vertex: Vec2, b: Vec2): Line {
  const da = normalize(sub(a, vertex));
  const db = normalize(sub(b, vertex));
  // Bisector direction is the sum of unit vectors from vertex to A and B
  let bisDir = add(da, db);
  // If da + db ≈ zero (angle is ~180°), use perpendicular of da
  if (length(bisDir) < 1e-10) {
    bisDir = perpVec(da);
  }
  return { point: vertex, dir: normalize(bisDir) };
}
