import { GeometryScene, ConstructionStep, Vec2 } from "./types";

/** Round to 2 decimal places to keep YAML clean */
function r(n: number): number {
  return Math.round(n * 100) / 100;
}

function vec(v: Vec2): string {
  return `[${r(v[0])}, ${r(v[1])}]`;
}

export function serializeScene(scene: GeometryScene): string {
  const lines: string[] = [];

  if (scene.title) {
    lines.push(`title: ${scene.title}`);
  }

  // Points
  const pointEntries = Object.entries(scene.points);
  if (pointEntries.length > 0) {
    lines.push("points:");
    for (const [id, coords] of pointEntries) {
      lines.push(`  ${id}: ${vec(coords)}`);
    }
  }

  // Constructions
  if (scene.constructions.length > 0) {
    lines.push("constructions:");
    for (const step of scene.constructions) {
      lines.push(`  - ${serializeStep(step)}`);
    }
  }

  // Style
  const styleEntries = Object.entries(scene.style);
  if (styleEntries.length > 0) {
    lines.push("style:");
    for (const [id, s] of styleEntries) {
      const props: string[] = [];
      if (s.color) props.push(`color: ${s.color}`);
      if (s.width !== undefined) props.push(`width: ${s.width}`);
      if (s.dash) props.push(`dash: true`);
      if (s.fill) props.push(`fill: "${s.fill}"`);
      if (s.size !== undefined) props.push(`size: ${s.size}`);
      if (s.label) props.push(`label: "${s.label}"`);
      if (s.show_length) props.push(`show_length: true`);
      lines.push(`  ${id}: {${props.join(", ")}}`);
    }
  }

  // Config (only non-default values)
  const cfgParts: string[] = [];
  if (scene.config.grid) cfgParts.push("grid: true");
  if (scene.config.axes) cfgParts.push("axes: true");
  if (scene.config.width !== 600) cfgParts.push(`width: ${scene.config.width}`);
  if (scene.config.height !== 400) cfgParts.push(`height: ${scene.config.height}`);
  if (scene.config.scale !== 50) cfgParts.push(`scale: ${scene.config.scale}`);
  if (!scene.config.interactive) cfgParts.push("interactive: false");
  if (scene.config.presentation) cfgParts.push("presentation: true");

  if (cfgParts.length > 0) {
    lines.push("config:");
    for (const p of cfgParts) {
      lines.push(`  ${p}`);
    }
  }

  return lines.join("\n") + "\n";
}

function serializeStep(step: ConstructionStep): string {
  let result: string;
  switch (step.type) {
    case "line":
      result = `line: {through: [${step.through[0]}, ${step.through[1]}], id: ${step.id}`;
      break;
    case "segment":
      result = `segment: {from: ${step.from}, to: ${step.to}, id: ${step.id}`;
      break;
    case "ray":
      result = `ray: {from: ${step.from}, through: ${step.through}, id: ${step.id}`;
      break;
    case "circle": {
      const parts = [`center: ${step.center}`];
      if (step.through) parts.push(`through: ${step.through}`);
      if (step.radius !== undefined) {
        parts.push(`radius: ${typeof step.radius === "string" ? `"${step.radius}"` : step.radius}`);
      }
      parts.push(`id: ${step.id}`);
      result = `circle: {${parts.join(", ")}`;
      break;
    }
    case "intersect": {
      const idStr = Array.isArray(step.id)
        ? `[${step.id[0]}, ${step.id[1]}]`
        : step.id;
      const parts = [`of: [${step.of[0]}, ${step.of[1]}]`, `id: ${idStr}`];
      if (step.which !== undefined) parts.push(`which: ${step.which}`);
      result = `intersect: {${parts.join(", ")}`;
      break;
    }
    case "midpoint":
      result = `midpoint: {of: [${step.of[0]}, ${step.of[1]}], id: ${step.id}`;
      break;
    case "perpendicular":
      result = `perpendicular: {to: ${step.to}, through: ${step.through}, id: ${step.id}`;
      break;
    case "parallel":
      result = `parallel: {to: ${step.to}, through: ${step.through}, id: ${step.id}`;
      break;
    case "angle_bisector":
      result = `angle_bisector: {points: [${step.points[0]}, ${step.points[1]}, ${step.points[2]}], id: ${step.id}`;
      break;
    case "text": {
      const parts = [`content: "${step.content}"`];
      if (step.at) parts.push(`at: ${step.at}`);
      if (step.pos) parts.push(`pos: ${vec(step.pos)}`);
      parts.push(`id: ${step.id}`);
      result = `text: {${parts.join(", ")}`;
      break;
    }
    case "polygon":
      result = `polygon: {vertices: [${step.vertices.join(", ")}], id: ${step.id}`;
      break;
    case "arc":
      result = `arc: {center: ${step.center}, from: ${step.from}, to: ${step.to}, id: ${step.id}`;
      break;
    case "angle_mark":
      result = `angle_mark: {points: [${step.points[0]}, ${step.points[1]}, ${step.points[2]}], id: ${step.id}`;
      break;
  }
  if (step.slide !== undefined) result += `, slide: ${step.slide}`;
  result += "}";
  return result;
}
