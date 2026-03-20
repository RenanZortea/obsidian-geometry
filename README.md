# Geometry Plugin for Obsidian
<img width="780" height="515" alt="image" src="https://github.com/user-attachments/assets/64074969-62c3-455c-a0c8-5e31d9c1e83f" />

An interactive compass-and-straightedge geometry plugin for [Obsidian](https://obsidian.md). Write YAML inside `geometry` code blocks to define constructions, or open a blank canvas and draw with Euclidea-style tools.

## Features

- **YAML-driven constructions** — define points, lines, segments, rays, circles, polygons, intersections, midpoints, perpendiculars, parallels, and angle bisectors
- **Interactive canvas** — pan (click-drag), zoom (scroll wheel), and drag points in real time
- **Euclidea-style toolbar** with 11 tools:
  - **Pointer** — select, drag points, pan the view
  - **Point** — place a free point
  - **Line** — infinite line through two points
  - **Segment** — segment between two points
  - **Circle** — circle by center and point on circumference
  - **Midpoint** — midpoint of two points
  - **Perpendicular Bisector** — perpendicular bisector of a segment
  - **Perpendicular** — line perpendicular to a chosen line through a point
  - **Parallel** — line parallel to a chosen line through a point
  - **Angle Bisector** — bisector of an angle defined by three points
  - **Compass** — circle with radius copied from two points, placed at a third
- **Snap to points and implicit intersections** — detects all pairwise intersections between objects automatically
- **Undo / Redo** — `Ctrl+Z` / `Ctrl+Y` (internal stack, won't interfere with Obsidian's editor undo)
- **Theme-aware** — adapts to Obsidian's light and dark themes
- **Persistent** — every drawing action syncs back to the YAML code block

## Usage

Create a `geometry` code block in any note:

````markdown
```geometry
```
````

This opens a blank interactive canvas. Use the toolbar (appears on hover at the bottom of the canvas) to draw.

You can also define constructions in YAML:

````markdown
```geometry
points:
  A: [0, 0]
  B: [3, 0]
  C: [1.5, 2.5]

constructions:
  - segment: {from: A, to: B, id: AB}
  - segment: {from: B, to: C, id: BC}
  - segment: {from: C, to: A, id: CA}
  - midpoint: {of: [A, B], id: M}
  - circle: {center: A, through: B, id: c1}

config:
  grid: true
  axes: true
```
````

### Config options

| Option        | Default | Description                      |
|---------------|---------|----------------------------------|
| `width`       | 600     | Canvas width in pixels           |
| `height`      | 400     | Canvas height in pixels          |
| `scale`       | 50      | Pixels per unit                  |
| `grid`        | false   | Show grid lines                  |
| `axes`        | false   | Show coordinate axes             |
| `interactive` | true    | Enable toolbar and interactions  |

### Construction types

| Type                 | Fields                                                  |
|----------------------|---------------------------------------------------------|
| `line`               | `through: [P1, P2]`, `id`                              |
| `segment`            | `from`, `to`, `id`                                     |
| `ray`                | `from`, `through`, `id`                                |
| `circle`             | `center`, `through` or `radius`, `id`                  |
| `intersect`          | `of: [obj1, obj2]`, `id` (or `[id1, id2]`), `which`   |
| `midpoint`           | `of: [P1, P2]`, `id`                                   |
| `perpendicular`      | `to` (line id), `through` (point id), `id`             |
| `parallel`           | `to` (line id), `through` (point id), `id`             |
| `angle_bisector`     | `points: [A, vertex, B]`, `id`                         |
| `polygon`            | `vertices: [P1, P2, ...]`, `id`                        |

### Styling

```yaml
style:
  AB: {color: "#e74c3c", width: 2, dash: true}
  c1: {color: "#3498db"}
  A: {size: 6, label: "A"}
```

## Installation

### From Community Plugins (once accepted)

1. Open **Settings > Community Plugins > Browse**
2. Search for **Geometry**
3. Click **Install**, then **Enable**

### Manual

1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/RenanZortea/obsidian-geometry/releases)
2. Create a folder `geometry` inside your vault's `.obsidian/plugins/` directory
3. Place the three files inside it
4. Restart Obsidian and enable the plugin in **Settings > Community Plugins**

## Development

```bash
npm install
npm run build    # one-time build
npm run dev      # watch mode
```

## License

[MIT](LICENSE)
