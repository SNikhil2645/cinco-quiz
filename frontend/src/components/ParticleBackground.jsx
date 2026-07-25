import { useEffect, useRef } from "react";

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let particles = [];
    const PARTICLE_COUNT = 65;
    const CONNECT_DIST = 130;
    const MOUSE_RADIUS = 160;
    const COLORS = [
      "rgba(226,137,90,",
      "rgba(148,163,184,",
      "rgba(251,191,36,",
      "rgba(241,245,249,",
    ];
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", (e) => {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    });

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 2 + 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.3 + 0.08,
        shape: Math.random() > 0.65 ? "diamond" : "circle",
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.02;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        p.vx *= 0.995;
        p.vy *= 0.995;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        ctx.fillStyle = p.color + p.alpha + ")";

        if (p.shape === "diamond") {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(Math.PI / 4);
          ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const ddx = p.x - q.x;
          const ddy = p.y - q.y;
          const d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < CONNECT_DIST) {
            const lineAlpha = 0.07 * (1 - d / CONNECT_DIST);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = p.color + lineAlpha + ")";
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        if (dist < MOUSE_RADIUS) {
          const glowAlpha = 0.12 * (1 - dist / MOUSE_RADIUS);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r + 4, 0, Math.PI * 2);
          ctx.fillStyle = p.color + glowAlpha + ")";
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
