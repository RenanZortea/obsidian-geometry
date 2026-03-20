import { Transform } from "./canvas";
import { ThemeColors } from "./theme";

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  transform: Transform,
  theme: ThemeColors
): void {
  const { bounds, config } = transform;

  ctx.save();

  if (config.grid) {
    ctx.strokeStyle = theme.gridLine;
    ctx.lineWidth = 0.5;

    const startX = Math.ceil(bounds.minX);
    const endX = Math.floor(bounds.maxX);
    const startY = Math.ceil(bounds.minY);
    const endY = Math.floor(bounds.maxY);

    for (let x = startX; x <= endX; x++) {
      const [px] = transform.toPixel([x, 0]);
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, config.height);
      ctx.stroke();
    }

    for (let y = startY; y <= endY; y++) {
      const [, py] = transform.toPixel([0, y]);
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(config.width, py);
      ctx.stroke();
    }
  }

  if (config.axes) {
    ctx.strokeStyle = theme.axis;
    ctx.lineWidth = 1.5;

    const [, yAxisPx] = transform.toPixel([0, 0]);
    ctx.beginPath();
    ctx.moveTo(0, yAxisPx);
    ctx.lineTo(config.width, yAxisPx);
    ctx.stroke();

    const [xAxisPx] = transform.toPixel([0, 0]);
    ctx.beginPath();
    ctx.moveTo(xAxisPx, 0);
    ctx.lineTo(xAxisPx, config.height);
    ctx.stroke();

    ctx.fillStyle = theme.tickLabel;
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    const startX = Math.ceil(bounds.minX);
    const endX = Math.floor(bounds.maxX);
    for (let x = startX; x <= endX; x++) {
      if (x === 0) continue;
      const [px] = transform.toPixel([x, 0]);
      ctx.beginPath();
      ctx.moveTo(px, yAxisPx - 3);
      ctx.lineTo(px, yAxisPx + 3);
      ctx.stroke();
      ctx.fillText(String(x), px, yAxisPx + 5);
    }

    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    const startY = Math.ceil(bounds.minY);
    const endY = Math.floor(bounds.maxY);
    for (let y = startY; y <= endY; y++) {
      if (y === 0) continue;
      const [, py] = transform.toPixel([0, y]);
      ctx.beginPath();
      ctx.moveTo(xAxisPx - 3, py);
      ctx.lineTo(xAxisPx + 3, py);
      ctx.stroke();
      ctx.fillText(String(y), xAxisPx - 6, py);
    }
  }

  ctx.restore();
}
