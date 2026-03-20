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
  | PolygonStep
  | ArcStep
  | AngleMarkStep;

export interface LineStep {
  type: "line";
  through: [string, string];
  id: string;
  slide?: number;
}

export interface SegmentStep {
  type: "segment";
  from: string;
  to: string;
  id: string;
  slide?: number;
}

export interface RayStep {
  type: "ray";
  from: string;
  through: string;
  id: string;
  slide?: number;
}

export interface CircleStep {
  type: "circle";
  center: string;
  through?: string;
  radius?: number | string;
  id: string;
  slide?: number;
}

export interface IntersectStep {
  type: "intersect";
  of: [string, string];
  id: string | [string, string];
  which?: number;
  slide?: number;
}

export interface MidpointStep {
  type: "midpoint";
  of: [string, string];
  id: string;
  slide?: number;
}

export interface PerpendicularStep {
  type: "perpendicular";
  to: string;
  through: string;
  id: string;
  slide?: number;
}

export interface ParallelStep {
  type: "parallel";
  to: string;
  through: string;
  id: string;
  slide?: number;
}

export interface AngleBisectorStep {
  type: "angle_bisector";
  points: [string, string, string];
  id: string;
  slide?: number;
}

export interface TextStep {
  type: "text";
  content: string;
  at?: string;
  pos?: Vec2;
  id: string;
  slide?: number;
}

export interface PolygonStep {
  type: "polygon";
  vertices: string[];
  id: string;
  slide?: number;
}

export interface AngleMarkStep {
  type: "angle_mark";
  points: [string, string, string];
  id: string;
  slide?: number;
}

export interface ArcStep {
  type: "arc";
  center: string;
  from: string;
  to: string;
  id: string;
  slide?: number;
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
  presentation: boolean;
}

// ── Resolved scene (output of solver) ──

export type ResolvedObject =
  | ResolvedPoint
  | ResolvedLine
  | ResolvedSegment
  | ResolvedRay
  | ResolvedCircle
  | ResolvedText
  | ResolvedPolygon
  | ResolvedArc
  | ResolvedAngleMark;

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

export interface ResolvedArc {
  type: "arc";
  id: string;
  center: Vec2;
  from: Vec2;
  to: Vec2;
  radius: number;
}

export interface ResolvedAngleMark {
  type: "angle_mark";
  id: string;
  vertex: Vec2;
  startAngle: number; // radians
  endAngle: number;   // radians
}

export interface ResolvedScene {
  objects: Map<string, ResolvedObject>;
  config: ConfigDef;
  style: Record<string, StyleDef>;
  title?: string;
  /** Maps object id → slide number. Points from `points:` section are slide 0. */
  slideMap: Map<string, number>;
  /** Total number of slides (0 if not in presentation mode) */
  totalSlides: number;
}
