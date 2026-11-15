import { useEffect, useRef } from "react";
import { cn } from "./ui";

export function CosmicWaltzMesh({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;
    const dpr = window.devicePixelRatio || 1;

    let mouseX = 0.5;
    let mouseY = 0.5;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = (e.clientY - rect.top) / rect.height;
    };
    canvas.addEventListener("mousemove", onMouseMove);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      // Render 22 topographic wave lines representing the "Cosmic Waltz" of Earth's crust
      const lines = 18;
      const points = 36;
      const stepY = (h * 0.75) / lines;
      const startY = h * 0.2;

      for (let i = 0; i < lines; i++) {
        const baseY = startY + i * stepY;
        const progress = i / lines;

        ctx.beginPath();
        for (let j = 0; j <= points; j++) {
          const px = (j / points) * w;
          const distFromMouse = Math.hypot(px / w - mouseX, baseY / h - mouseY);
          const mouseDisplace = Math.sin(distFromMouse * 8 - t * 2) * 16 * Math.max(0, 1 - distFromMouse * 2);

          // Harmonic multi-frequency wave calculation (Earth elevation oscillations)
          const elevation =
            Math.sin(j * 0.28 + t * 0.9 + i * 0.35) * 14 * (1 - progress * 0.3) +
            Math.cos(j * 0.15 - t * 0.6 + i * 0.5) * 10 +
            mouseDisplace;

          const py = baseY + elevation;

          if (j === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }

        // Color gradient from Pale Sage to Muted Forest Green
        const alpha = 0.15 + (1 - progress) * 0.35;
        ctx.strokeStyle = `rgba(120, 149, 117, ${alpha})`;
        ctx.lineWidth = 1.2 + (1 - progress) * 0.8;
        ctx.stroke();
      }

      ctx.restore();
      t += 0.014;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className={cn("pointer-events-auto relative h-full w-full overflow-hidden", className)}>
      <canvas ref={canvasRef} className="h-full w-full block" />
    </div>
  );
}
