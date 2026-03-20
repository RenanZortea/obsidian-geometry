export type Vec2 = [number, number];

// ── Parsed scene (output of parser) ──

export interface GeometryScene {
  title?: string;
  points: Record<string, Vec2>;
  constructions: ConstructionStep[];
  style: Record<string, StyleDef>;
  config: ConfigDef;
}

export type ConstructionStep =
  | LineStep
  | SegmentStep
  | RayStep
  | CircleStep
  | IntersectStep
  | MidpointStep
  | PerpendicularStep
  | ParallelStep
  | AngleBisectorStep
  | TextStep
  | PolygonStep;

export interface LineStep {
  type: "line";
  through: [string, string];
  id: string;
}

export interface SegmentStep {
  type: "segment";
  from: string;
  to: string;
  id: string;
}

export interface RayStep {
  type: "ray";
  from: string;
  through: string;
  id: string;
}

export interface CircleStep {
  type: "circle";
  center: string;
  through?: string;
  radius?: number | string; // number literal or expression like "distance(A, B)"
  id: string;
}

export interface IntersectStep {
  type: "intersect";
  of: [string, string];
  id: string | [string, string];
  which?: number; // 1-based index
}

export interface MidpointStep {
  type: "midpoint";
  of: [string, string];
  id: string;
}

export interface PerpendicularStep {
  type: "perpendicular";
  to: string;
  through: string;
  id: string;
}

export interface ParallelStep {
  type: "parallel";
  to: string;
  through: string;
  id: string;
}

export interface AngleBisectorStep {
  type: "angle_bisector";
  points: [string, string, string]; // [A, vertex, B] — bisects angle AVB
  id: string;
}

export interface TextStep {
  type: "text";
  content: string;
  at?: string;   // position at a point id
  pos?: Vec2;    // or explicit [x, y] coordinates
  id: string;
}

export interface PolygonStep {
  type: "polygon";
  vertices: string[];
  id: string;
}

export interface StyleDef {
  color?: string;
  width?: number;
  dash?: boolean;
  fill?: string;
  size?: number;
  label?: string;
  show_length?: boolean;
}

export interface ConfigDef {
  grid: boolean;
  axes: boolean;
  width: number;
  height: number;
  scale: number;
  interactive: boolean;
}

// ── Resolved scene (output of solver) ──

export type ResolvedObject =
  | ResolvedPoint
  | ResolvedLine
  | ResolvedSegment
  | ResolvedRay
  | ResolvedCircle
  | ResolvedText
  | ResolvedPolygon;

export interface ResolvedPoint {
  type: "point";
  id: string;
  pos: Vec2;
  draggable: boolean;
}

export interface ResolvedLine {
  type: "line";
  id: string;
  point: Vec2;
  dir: Vec2; // unit direction vector
}

export interface ResolvedSegment {
  type: "segment";
  id: string;
  from: Vec2;
  to: Vec2;
}

export interface ResolvedRay {
  type: "ray";
  id: string;
  origin: Vec2;
  dir: Vec2;
}

export interface ResolvedCircle {
  type: "circle";
  id: string;
  center: Vec2;
  radius: number;
}

export interface ResolvedText {
  type: "text";
  id: string;
  content: string;
  pos: Vec2;
}

export interface ResolvedPolygon {
  type: "polygon";
  id: string;
  vertices: Vec2[];
}

export interface ResolvedScene {
  objects: Map<string, ResolvedObject>;
  config: ConfigDef;
  style: Record<string, StyleDef>;
  title?: string;
}
