import { parse } from "yaml";
import {
  GeometryScene,
  ConstructionStep,
  ConfigDef,
  StyleDef,
  Vec2,
} from "./types";

const DEFAULT_CONFIG: ConfigDef = {
  grid: false,
  axes: false,
  width: 600,
  height: 400,
  scale: 50,
  interactive: true,
  presentation: false,
};

export function parseGeometry(source: string): GeometryScene {
  const trimmed = source.trim();
  if (!trimmed) {
    return {
      points: {},
      constructions: [],
      style: {},
      config: { ...DEFAULT_CONFIG },
    };
  }

  const raw = parse(trimmed);
  if (!raw || typeof raw !== "object") {
    return {
      points: {},
      constructions: [],
      style: {},
      config: { ...DEFAULT_CONFIG },
    };
  }

  const points = parsePoints(raw.points);
  const constructions = parseConstructions(raw.constructions);
  const style = parseStyles(raw.style);
  const config = { ...DEFAULT_CONFIG, ...(raw.config ?? {}) };

  return {
    title: raw.title ?? undefined,
    points,
    constructions,
    style,
    config,
  };
}

function parsePoints(raw: unknown): Record<string, Vec2> {
  if (!raw) return {};
  if (typeof raw !== "object") throw new Error("'points' must be an object");
  const result: Record<string, Vec2> = {};
  for (const [id, val] of Object.entries(raw as Record<string, unknown>)) {
    if (!Array.isArray(val) || val.length !== 2 || typeof val[0] !== "number" || typeof val[1] !== "number") {
      throw new Error(`Point '${id}' must be [x, y] with numeric coordinates`);
    }
    result[id] = [val[0], val[1]];
  }
  return result;
}

function parseConstructions(raw: unknown): ConstructionStep[] {
  if (!raw) return [];
  if (!Array.isArray(raw)) throw new Error("'constructions' must be a list");
  return raw.map((item, i) => parseOneConstruction(item, i));
}

function parseOneConstruction(item: unknown, index: number): ConstructionStep {
  if (!item || typeof item !== "object") {
    throw new Error(`Construction #${index + 1}: expected an object`);
  }
  const obj = item as Record<string, unknown>;

  // Extract optional slide number from the inner object
  const extractSlide = (raw: unknown): number | undefined => {
    if (raw && typeof raw === "object") {
      const s = (raw as Record<string, unknown>).slide;
      if (typeof s === "number") return s;
    }
    return undefined;
  };

  let step: ConstructionStep;

  if (obj.line) step = parseLineStep(obj.line);
  else if (obj.segment) step = parseSegmentStep(obj.segment);
  else if (obj.ray) step = parseRayStep(obj.ray);
  else if (obj.circle) step = parseCircleStep(obj.circle);
  else if (obj.intersect) step = parseIntersectStep(obj.intersect);
  else if (obj.midpoint) step = parseMidpointStep(obj.midpoint);
  else if (obj.perpendicular) step = parsePerpendicularStep(obj.perpendicular);
  else if (obj.parallel) step = parseParallelStep(obj.parallel);
  else if (obj.angle_bisector) step = parseAngleBisectorStep(obj.angle_bisector);
  else if (obj.text) step = parseTextStep(obj.text);
  else if (obj.polygon) step = parsePolygonStep(obj.polygon);
  else if (obj.arc) step = parseArcStep(obj.arc);
  else if (obj.angle_mark) step = parseAngleMarkStep(obj.angle_mark);
  else throw new Error(`Construction #${index + 1}: unknown type. Keys: ${Object.keys(obj).join(", ")}`);

  // Attach slide number if present
  const typeKey = Object.keys(obj).find(k => k !== "slide");
  const slide = extractSlide(typeKey ? obj[typeKey] : undefined);
  if (slide !== undefined) {
    step.slide = slide;
  }

  return step;
}

function parseLineStep(raw: unknown): ConstructionStep {
  const o = raw as Record<string, unknown>;
  const through = o.through as string[];
  if (!Array.isArray(through) || through.length !== 2) {
    throw new Error("line: 'through' must be [pointA, pointB]");
  }
  return { type: "line", through: [through[0], through[1]], id: str(o.id) };
}

function parseSegmentStep(raw: unknown): ConstructionStep {
  const o = raw as Record<string, unknown>;
  return { type: "segment", from: str(o.from), to: str(o.to), id: str(o.id) };
}

function parseRayStep(raw: unknown): ConstructionStep {
  const o = raw as Record<string, unknown>;
  return { type: "ray", from: str(o.from), through: str(o.through), id: str(o.id) };
}

function parseCircleStep(raw: unknown): ConstructionStep {
  const o = raw as Record<string, unknown>;
  const step: ConstructionStep = {
    type: "circle",
    center: str(o.center),
    id: str(o.id),
  };
  if (o.through !== undefined) (step as any).through = str(o.through);
  if (o.radius !== undefined) (step as any).radius = o.radius as number | string;
  return step;
}

function parseIntersectStep(raw: unknown): ConstructionStep {
  const o = raw as Record<string, unknown>;
  const of_ = o.of as string[];
  if (!Array.isArray(of_) || of_.length !== 2) {
    throw new Error("intersect: 'of' must be [objA, objB]");
  }
  const id = o.id;
  const step: ConstructionStep = {
    type: "intersect",
    of: [of_[0], of_[1]],
    id: Array.isArray(id) ? [str(id[0]), str(id[1])] : str(id),
  };
  if (o.which !== undefined) (step as any).which = o.which as number;
  return step;
}

function parseMidpointStep(raw: unknown): ConstructionStep {
  const o = raw as Record<string, unknown>;
  const of_ = o.of as string[];
  if (!Array.isArray(of_) || of_.length !== 2) {
    throw new Error("midpoint: 'of' must be [pointA, pointB]");
  }
  return { type: "midpoint", of: [of_[0], of_[1]], id: str(o.id) };
}

function parsePerpendicularStep(raw: unknown): ConstructionStep {
  const o = raw as Record<string, unknown>;
  return { type: "perpendicular", to: str(o.to), through: str(o.through), id: str(o.id) };
}

function parseParallelStep(raw: unknown): ConstructionStep {
  const o = raw as Record<string, unknown>;
  return { type: "parallel", to: str(o.to), through: str(o.through), id: str(o.id) };
}

function parseAngleBisectorStep(raw: unknown): ConstructionStep {
  const o = raw as Record<string, unknown>;
  const pts = o.points as string[];
  if (!Array.isArray(pts) || pts.length !== 3) {
    throw new Error("angle_bisector: 'points' must be [A, vertex, B]");
  }
  return { type: "angle_bisector", points: [pts[0], pts[1], pts[2]], id: str(o.id) };
}

function parseTextStep(raw: unknown): ConstructionStep {
  const o = raw as Record<string, unknown>;
  const step: any = { type: "text", content: str(o.content), id: str(o.id) };
  if (o.at !== undefined) step.at = str(o.at);
  if (o.pos !== undefined) {
    const pos = o.pos as number[];
    if (!Array.isArray(pos) || pos.length !== 2) throw new Error("text: 'pos' must be [x, y]");
    step.pos = [pos[0], pos[1]];
  }
  if (!step.at && !step.pos) throw new Error("text: need 'at' (point id) or 'pos' ([x, y])");
  return step;
}

function parsePolygonStep(raw: unknown): ConstructionStep {
  const o = raw as Record<string, unknown>;
  const vertices = o.vertices as string[];
  if (!Array.isArray(vertices) || vertices.length < 3) {
    throw new Error("polygon: 'vertices' must have at least 3 points");
  }
  return { type: "polygon", vertices, id: str(o.id) };
}

function parseAngleMarkStep(raw: unknown): ConstructionStep {
  const o = raw as Record<string, unknown>;
  const pts = o.points as string[];
  if (!Array.isArray(pts) || pts.length !== 3) {
    throw new Error("angle_mark: 'points' must be [A, vertex, B]");
  }
  return { type: "angle_mark", points: [pts[0], pts[1], pts[2]], id: str(o.id) };
}

function parseArcStep(raw: unknown): ConstructionStep {
  const o = raw as Record<string, unknown>;
  return { type: "arc", center: str(o.center), from: str(o.from), to: str(o.to), id: str(o.id) };
}

function parseStyles(raw: unknown): Record<string, StyleDef> {
  if (!raw) return {};
  if (typeof raw !== "object") throw new Error("'style' must be an object");
  const result: Record<string, StyleDef> = {};
  for (const [id, val] of Object.entries(raw as Record<string, unknown>)) {
    result[id] = val as StyleDef;
  }
  return result;
}

function str(val: unknown): string {
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  throw new Error(`Expected a string, got ${typeof val}: ${JSON.stringify(val)}`);
}
