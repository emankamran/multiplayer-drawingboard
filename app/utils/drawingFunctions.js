// drawingFunctions.js

export function drawMarker(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2); // Example marker drawing
  ctx.fill();
}

export function drawRoller(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x - 5, y - 2, 10, 4); // Example roller drawing
}

export function drawPencil(ctx, x, y, color) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - 5, y);
  ctx.lineTo(x + 5, y);
  ctx.stroke(); // Example pencil drawing
}

// Add more functions as needed
