type DrawLineProps = Draw & {
    color: string,
    lineWidth: number; // Add this property
  }
  const drawLine = ({ prevPoint, currentPoint, ctx, color, lineWidth }: DrawLineProps) => {
    const { x: currX, y: currY } = currentPoint;
    const lineColor = color;
    const lineThickness = lineWidth; // Use the dynamic lineWidth property
  
    let startPoint = prevPoint ?? currentPoint;
    ctx.beginPath();
    ctx.lineWidth = lineThickness; // Apply the dynamic lineWidth
    ctx.strokeStyle = lineColor;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();
  
    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  };
  
  export default drawLine;
  