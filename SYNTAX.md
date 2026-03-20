# Geometry Plugin — YAML Syntax Design

## Overview

Inside Obsidian, you write a fenced code block with language `geometry`:

````
```geometry
title: Perpendicular Bisector
points:
  A: [0, 0]
  B: [4, 0]
constructions:
  - circle: {center: A, through: B, id: c1}
  - circle: {center: B, through: A, id: c2}
  - intersect: {of: [c1, c2], id: [P, Q]}
  - line: {through: [P, Q], id: bisector}
style:
  bisector: {color: red, dash: true}
```
````

## Primitives

### Points
Defined explicitly by coordinates, or implicitly by construction.

```yaml
points:
  A: [2, 3]          # explicit coordinates
  B: [5, 1]
  Origin: [0, 0]
```

### Lines, Rays, Segments
```yaml
constructions:
  - line: {through: [A, B], id: L1}          # infinite line
  - segment: {from: A, to: B, id: s1}        # finite segment
  - ray: {from: A, through: B, id: r1}       # ray from A through B
```

### Circles
```yaml
constructions:
  - circle: {center: A, through: B, id: c1}              # circle by center + point on circle
  - circle: {center: A, radius: 3, id: c2}                # circle by center + numeric radius
  - circle: {center: A, radius: distance(A, B), id: c3}   # circle by center + distance expression
```

### Arcs
```yaml
constructions:
  - arc: {center: A, from: B, to: C, id: a1}        # arc from B to C around A (counterclockwise)
```

## Constructions (derived objects)

### Intersection
Two ways to pick which intersection point you want:

```yaml
constructions:
  # Option 1: get both points, named in order (first = smaller x, ties broken by y)
  - intersect: {of: [c1, c2], id: [P, Q]}

  # Option 2: pick a specific intersection by index (1-based)
  - intersect: {of: [c1, c2], which: 1, id: P}    # first intersection
  - intersect: {of: [c1, c2], which: 2, id: Q}    # second intersection

  # Line-line always gives a single point
  - intersect: {of: [L1, L2], id: Z}
```

Convention for ordering: intersections are sorted by x-coordinate ascending, ties broken by y-coordinate ascending.

### Midpoint
```yaml
constructions:
  - midpoint: {of: [A, B], id: M}
```

### Perpendicular
```yaml
constructions:
  - perpendicular: {to: L1, through: P, id: perp1}
```

### Parallel
```yaml
constructions:
  - parallel: {to: L1, through: P, id: par1}
```

### Angle Bisector
```yaml
constructions:
  - angle_bisector: {points: [A, B, C], id: ab1}   # bisector of angle ABC
```

### Polygon
```yaml
constructions:
  - polygon: {vertices: [A, B, C], id: tri1}       # triangle
  - polygon: {vertices: [A, B, C, D], id: quad1}   # quadrilateral
```

### Tangent
```yaml
constructions:
  - tangent: {to: c1, through: P, id: [t1, t2]}    # tangent lines from external point
  - tangent: {to: c1, at: P, id: t1}                # tangent at point on circle
```

## Expressions

For any numeric field (radius, etc.), you can use:

| Expression | Meaning |
|---|---|
| `3` | literal number |
| `distance(A, B)` | distance between two points |
| `angle(A, B, C)` | angle ABC in degrees |

> **TODO:** Support radians via `angle_rad(A, B, C)` in a future version.

## Styling

```yaml
style:
  L1: {color: blue, width: 2}
  c1: {color: green, fill: "rgba(0,255,0,0.1)"}
  A: {color: red, size: 5, label: "Point A"}
  s1: {dash: true, color: gray}
```

### Global Defaults
```yaml
config:
  grid: true
  axes: true
  width: 600
  height: 400
  scale: 50          # pixels per unit
  interactive: false  # if true, points can be dragged
```

## Labels and Annotations

```yaml
labels:
  A: {text: "A", offset: [-10, 5]}
  angle_ABC: {points: [A, B, C], show: true, label: "α"}
```

## Measurements (display only)

```yaml
measure:
  - distance: {from: A, to: B, label: "d = "}
  - angle: {points: [A, B, C], label: "θ = "}
```

---

## Full Example: Equilateral Triangle Construction

```geometry
title: Equilateral Triangle
points:
  A: [1, 2]
  B: [5, 2]
constructions:
  - circle: {center: A, through: B, id: c1}
  - circle: {center: B, through: A, id: c2}
  - intersect: {of: [c1, c2], which: 1, id: C}
  - segment: {from: A, to: B, id: ab}
  - segment: {from: B, to: C, id: bc}
  - segment: {from: C, to: A, id: ca}
  - polygon: {vertices: [A, B, C], id: triangle}
style:
  c1: {color: gray, dash: true, width: 1}
  c2: {color: gray, dash: true, width: 1}
  triangle: {fill: "rgba(100,150,255,0.15)"}
  ab: {color: blue, width: 2}
  bc: {color: blue, width: 2}
  ca: {color: blue, width: 2}
config:
  grid: true
  interactive: true
```

---

## Interactive Mode

When `config.interactive: true`, the rendered figure becomes a mini Euclidea-like canvas:

- **Drag points** — explicitly placed points can be dragged; all constructions update live
- **Tool palette** — a small toolbar appears with:
  - Point tool (click to place)
  - Line/Segment tool (click two points)
  - Circle tool (click center, click radius point)
  - Intersect tool (click two objects)
- **Export** — button to copy the current state as YAML back into the code block
- **Snap** — points snap to grid, intersections, and other notable positions

This means the interactive canvas is also an **authoring tool**: you draw, then export to YAML.

---

## MVP Scope

What's in the first version:
- [x] Points (explicit coordinates)
- [x] Segments, Lines, Rays
- [x] Circles (center + through, center + radius)
- [x] Intersections (with `which` selector)
- [x] Midpoint
- [x] Perpendicular, Parallel
- [x] Polygon (fill + stroke)
- [x] Styling (color, width, dash, fill, label)
- [x] Config (grid, axes, scale, dimensions)
- [x] `distance()` expression for radius
- [x] Degrees for all angle values
- [x] Basic interactive mode (drag points, live update)

## TODO (post-MVP)
- [ ] Arcs
- [ ] Tangent lines
- [ ] Angle bisector
- [ ] `angle()` expression
- [ ] Radian support (`angle_rad()`)
- [ ] Step-by-step construction animation
- [ ] Full interactive tool palette (point, line, circle, intersect tools)
- [ ] Export from canvas back to YAML
- [ ] Measurements overlay
- [ ] Labels with custom offsets
- [ ] Snap to grid/intersections in interactive mode
