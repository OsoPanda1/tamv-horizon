import { useEffect, useRef, memo } from "react";

const CHARS = "タムヴ01アイサベラ◈☀⬡✧ΩΔΣΨξζ𐂀𐂃TAMV";

function MatrixRainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const fontSize = 14;
    let columns: number;
    let drops: number[];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * -100);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.fillStyle = "rgba(5, 12, 30, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Gradient from metallic blue to ivory
        const brightness = Math.random();
        if (brightness > 0.95) {
          ctx.fillStyle = "rgba(230, 220, 200, 0.9)";
          ctx.font = `bold ${fontSize}px monospace`;
        } else if (brightness > 0.7) {
          ctx.fillStyle = "rgba(80, 140, 220, 0.8)";
          ctx.font = `${fontSize}px monospace`;
        } else {
          ctx.fillStyle = "rgba(60, 120, 200, 0.3)";
          ctx.font = `${fontSize}px monospace`;
        }

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.5 + Math.random() * 0.5;
      }

      animId = requestAnimationFrame(draw);
    };

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReducedMotion) {
      draw();
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ opacity: 0.15 }}
      aria-hidden="true"
    />
  );
}

export default memo(MatrixRainCanvas);
