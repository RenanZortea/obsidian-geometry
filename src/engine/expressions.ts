import { Vec2 } from "../types";
import { dist } from "./geo";

/**
 * Evaluate a radius expression. Can be:
 * - A number literal (returned as-is)
 * - A string like "distance(A, B)"
 */
export function evaluateExpression(
  expr: number | string,
  resolvedPoints: Map<string, Vec2>
): number {
  if (typeof expr === "number") return expr;

  const match = expr.match(/^distance\(\s*(\w+)\s*,\s*(\w+)\s*\)$/);
  if (match) {
    const p1 = resolvedPoints.get(match[1]);
    const p2 = resolvedPoints.get(match[2]);
    if (!p1) throw new Error(`distance(): unknown point '${match[1]}'`);
    if (!p2) throw new Error(`distance(): unknown point '${match[2]}'`);
    return dist(p1, p2);
  }

  throw new Error(`Unknown expression: '${expr}'`);
}
