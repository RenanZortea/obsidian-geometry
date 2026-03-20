import { ConfigDef, Vec2 } from "../types";

export class Transform {
  config: ConfigDef;
  scale: number;
  /** Camera offset in math-space coordinates */
  panX: number = 0;
  panY: number = 0;

  constructor(config: ConfigDef) {
    this.config = config;
    this.scale = config.scale;
  }

  get bounds() {
    const cx = this.config.width / 2;
    const cy = this.config.height / 2;
    return {
      minX: this.panX - cx / this.scale,
      maxX: this.panX + cx / this.scale,
      minY: this.panY - cy / this.scale,
      maxY: this.panY + cy / this.scale,
    };
  }

  toPixel([x, y]: Vec2): Vec2 {
    const cx = this.config.width / 2;
    const cy = this.config.height / 2;
    return [
      cx + (x - this.panX) * this.scale,
      cy - (y - this.panY) * this.scale,
    ];
  }

  toMath([px, py]: Vec2): Vec2 {
    const cx = this.config.width / 2;
    const cy = this.config.height / 2;
    return [
      (px - cx) / this.scale + this.panX,
      (cy - py) / this.scale + this.panY,
    ];
  }
}

export function createCanvas(
  container: HTMLElement,
  config: ConfigDef
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; transform: Transform } {
  const canvas = document.createElement("canvas");
  canvas.width = config.width;
  canvas.height = config.height;
  canvas.classList.add("geometry-canvas");
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d")!;
  const transform = new Transform(config);

  return { canvas, ctx, transform };
}
