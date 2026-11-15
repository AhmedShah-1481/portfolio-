import { useEffect, useRef } from 'react';

// Decorative, client-only canvas: a small fixed graph, capped at 30fps and 1.5 DPR.
// The SVG underneath supplies a fallback if canvas is unavailable.
export default function NeuralField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return undefined;
    const parent = canvas.parentElement;
    const points = [
      [0.55, 0.18], [0.65, 0.28], [0.77, 0.18], [0.87, 0.34], [0.8, 0.5],
      [0.89, 0.66], [0.75, 0.77], [0.64, 0.6], [0.53, 0.67], [0.46, 0.49],
      [0.54, 0.37], [0.65, 0.46], [0.36, 0.19], [0.23, 0.79], [0.14, 0.41],
    ];
    const edges = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8],
      [8, 9], [9, 10], [10, 0], [10, 11], [11, 3], [11, 7], [7, 4], [1, 7], [1, 3], [0, 12]];
    const nodes = points.map(([x, y]) => ({ x, y, drawX: 0, drawY: 0 }));
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastPaint = 0;
    let inView = true;
    let disposed = false;
    const pointer = { x: -1000, y: -1000 };

    const resize = () => {
      const bounds = parent.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const draw = (time) => {
      frame = 0;
      if (disposed || !inView || document.hidden) return;
      frame = requestAnimationFrame(draw);
      if (time - lastPaint < 33) return;
      lastPaint = time;
      context.clearRect(0, 0, width, height);
      const clock = time * 0.00035;
      for (const [index, node] of nodes.entries()) {
        const baseX = node.x * width + Math.sin(clock + index * 1.3) * 5;
        const baseY = node.y * height + Math.cos(clock + index * 0.7) * 5;
        const dx = baseX - pointer.x;
        const dy = baseY - pointer.y;
        const distance = Math.hypot(dx, dy);
        const force = Math.max(0, 1 - distance / 180) * 24;
        node.drawX = baseX + (distance > 0 ? dx / distance * force : 0);
        node.drawY = baseY + (distance > 0 ? dy / distance * force : 0);
      }
      context.lineWidth = 0.8;
      for (const [index, [a, b]] of edges.entries()) {
        const start = nodes[a];
        const end = nodes[b];
        context.strokeStyle = index % 3 === 0 ? 'rgba(34,211,238,0.2)' : 'rgba(139,92,246,0.2)';
        context.beginPath();
        context.moveTo(start.drawX, start.drawY);
        context.lineTo(end.drawX, end.drawY);
        context.stroke();
        if (index % 3 === 0) {
          const progress = (time * 0.00012 + index * 0.17) % 1;
          context.fillStyle = 'rgba(103,232,249,0.65)';
          context.beginPath();
          context.arc(start.drawX + (end.drawX - start.drawX) * progress,
            start.drawY + (end.drawY - start.drawY) * progress, 1.7, 0, Math.PI * 2);
          context.fill();
        }
      }
      for (const [index, node] of nodes.entries()) {
        context.fillStyle = index % 3 === 0 ? 'rgba(34,211,238,0.65)' : 'rgba(167,139,250,0.65)';
        context.beginPath();
        context.arc(node.drawX, node.drawY, index < 12 ? 2.5 : 1.5, 0, Math.PI * 2);
        context.fill();
        if (index < 12) {
          context.strokeStyle = 'rgba(139,92,246,0.22)';
          context.beginPath();
          context.arc(node.drawX, node.drawY, 8, 0, Math.PI * 2);
          context.stroke();
        }
      }
    };
    const syncAnimation = () => {
      if (inView && !document.hidden && !frame) frame = requestAnimationFrame(draw);
      if ((!inView || document.hidden) && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };
    const movePointer = (event) => {
      const bounds = parent.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
    };
    const clearPointer = () => { pointer.x = -1000; pointer.y = -1000; };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncAnimation();
    });
    const resizeObserver = new ResizeObserver(resize);
    observer.observe(parent);
    resizeObserver.observe(parent);
    parent.addEventListener('pointermove', movePointer, { passive: true });
    parent.addEventListener('pointerleave', clearPointer);
    document.addEventListener('visibilitychange', syncAnimation);
    resize();
    syncAnimation();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      parent.removeEventListener('pointermove', movePointer);
      parent.removeEventListener('pointerleave', clearPointer);
      document.removeEventListener('visibilitychange', syncAnimation);
    };
  }, []);

  return <canvas ref={canvasRef} className="neural-canvas" aria-hidden="true" />;
}
