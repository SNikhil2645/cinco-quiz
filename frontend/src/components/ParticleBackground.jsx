import { useEffect, useRef } from "react";

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let w, h;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const isMobile = window.innerWidth < 768;

    const COLORS = {
      eucalyptus: { r: 205, g: 212, b: 177 },
      pistachio:  { r: 235, g: 236, b: 204 },
      peach:      { r: 238, g: 204, b: 208 },
      clay:       { r: 220, g: 162, b: 120 },
      ivory:      { r: 255, g: 249, b: 226 },
    };
    const COLOR_KEYS = Object.keys(COLORS);

    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let elapsed = 0;
    let lastTime = performance.now();
    const lerp = (a, b, t) => a + (b - a) * t;
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const SHAPE_TYPES = ["sphere", "hexagon", "capsule", "dot"];
    const DEPTH_LAYERS = [
      { z: 0.3, blur: 3,  count: isMobile ? 3 : 5,  alphaRange: [0.06, 0.12], sizeRange: [30, 55],  speed: 0.08 },
      { z: 0.6, blur: 1.5, count: isMobile ? 4 : 6,  alphaRange: [0.08, 0.18], sizeRange: [18, 38],  speed: 0.14 },
      { z: 1.0, blur: 0,   count: isMobile ? 14 : 22, alphaRange: [0.12, 0.32], sizeRange: [2, 10],   speed: 0.22 },
    ];

    let shapes = [];

    function createShape(layer) {
      const c = COLORS[pick(COLOR_KEYS)];
      const type = pick(SHAPE_TYPES);
      const alpha = layer.alphaRange[0] + Math.random() * (layer.alphaRange[1] - layer.alphaRange[0]);
      const baseSize = layer.sizeRange[0] + Math.random() * (layer.sizeRange[1] - layer.sizeRange[0]);

      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * layer.speed,
        vy: (Math.random() - 0.5) * layer.speed,
        r: c.r, g: c.g, b: c.b,
        alpha,
        type,
        z: layer.z,
        blur: layer.blur,
        size: baseSize,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.004,
        bobPhase: Math.random() * Math.PI * 2,
        bobSpeed: 0.3 + Math.random() * 0.7,
        bobAmp: 6 + Math.random() * 14,
        highlightOffset: 0.25 + Math.random() * 0.15,
      };
    }

    function init() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      shapes = [];
      for (const layer of DEPTH_LAYERS) {
        for (let i = 0; i < layer.count; i++) {
          shapes.push(createShape(layer));
        }
      }
    }
    init();

    window.addEventListener("resize", init);

    const onMouseMove = (e) => { mouse.tx = e.clientX; mouse.ty = e.clientY; };
    const onTouchMove = (e) => { mouse.tx = e.touches[0].clientX; mouse.ty = e.touches[0].clientY; };
    const onMouseLeave = () => { mouse.tx = -9999; mouse.ty = -9999; };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);

    function drawSphere(s, dx, dy, scale) {
      const r = s.size * scale;
      if (r < 0.5) return;
      ctx.save();
      ctx.translate(dx, dy);

      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.r},${s.g},${s.b},0.18)`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${s.r},${s.g},${s.b},0.55)`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      const hlX = -r * s.highlightOffset;
      const hlY = -r * s.highlightOffset;
      const hlGrad = ctx.createRadialGradient(hlX, hlY, 0, hlX, hlY, r * 0.7);
      hlGrad.addColorStop(0, `rgba(255,255,255,0.45)`);
      hlGrad.addColorStop(0.5, `rgba(255,255,255,0.12)`);
      hlGrad.addColorStop(1, `rgba(255,255,255,0)`);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = hlGrad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, r * 0.7, r * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.r},${s.g},${s.b},0.06)`;
      ctx.fill();

      ctx.restore();
    }

    function drawHexagonShape(s, dx, dy, scale) {
      const r = s.size * scale;
      if (r < 0.5) return;
      ctx.save();
      ctx.translate(dx, dy);
      ctx.rotate(s.rot);

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        const px = r * Math.cos(a);
        const py = r * Math.sin(a);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(${s.r},${s.g},${s.b},0.14)`;
      ctx.fill();

      ctx.strokeStyle = `rgba(${s.r},${s.g},${s.b},0.50)`;
      ctx.lineWidth = 1.0;
      ctx.stroke();

      const hlGrad = ctx.createLinearGradient(-r * 0.5, -r * 0.5, r * 0.3, r * 0.3);
      hlGrad.addColorStop(0, `rgba(255,255,255,0.30)`);
      hlGrad.addColorStop(1, `rgba(255,255,255,0)`);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        const px = r * Math.cos(a);
        const py = r * Math.sin(a);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = hlGrad;
      ctx.fill();

      ctx.restore();
    }

    function drawCapsule(s, dx, dy, scale) {
      const pw = s.size * 1.8 * scale;
      const ph = s.size * 0.55 * scale;
      if (pw < 1) return;
      ctx.save();
      ctx.translate(dx, dy);
      ctx.rotate(s.rot);
      const hr = ph / 2;

      ctx.beginPath();
      ctx.moveTo(-pw / 2 + hr, -ph / 2);
      ctx.lineTo(pw / 2 - hr, -ph / 2);
      ctx.arc(pw / 2 - hr, 0, hr, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(-pw / 2 + hr, ph / 2);
      ctx.arc(-pw / 2 + hr, 0, hr, Math.PI / 2, -Math.PI / 2);
      ctx.closePath();
      ctx.fillStyle = `rgba(${s.r},${s.g},${s.b},0.16)`;
      ctx.fill();

      ctx.strokeStyle = `rgba(${s.r},${s.g},${s.b},0.48)`;
      ctx.lineWidth = 1.0;
      ctx.stroke();

      const hlGrad = ctx.createLinearGradient(0, -ph / 2, 0, ph / 2);
      hlGrad.addColorStop(0, `rgba(255,255,255,0.28)`);
      hlGrad.addColorStop(0.4, `rgba(255,255,255,0.06)`);
      hlGrad.addColorStop(1, `rgba(255,255,255,0)`);
      ctx.beginPath();
      ctx.moveTo(-pw / 2 + hr, -ph / 2);
      ctx.lineTo(pw / 2 - hr, -ph / 2);
      ctx.arc(pw / 2 - hr, 0, hr, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(-pw / 2 + hr, ph / 2);
      ctx.arc(-pw / 2 + hr, 0, hr, Math.PI / 2, -Math.PI / 2);
      ctx.closePath();
      ctx.fillStyle = hlGrad;
      ctx.fill();

      ctx.restore();
    }

    function drawDot(s, dx, dy, scale) {
      const r = s.size * scale;
      if (r < 0.3) return;
      ctx.beginPath();
      ctx.arc(dx, dy, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.r},${s.g},${s.b},${s.alpha})`;
      ctx.fill();
    }

    function draw(now) {
      const dt = Math.min((now - lastTime) / 16.667, 3);
      lastTime = now;
      elapsed += dt * 0.015;

      mouse.x = lerp(mouse.x, mouse.tx, 0.05);
      mouse.y = lerp(mouse.y, mouse.ty, 0.05);

      ctx.clearRect(0, 0, w, h);

      const centerX = w / 2;
      const centerY = h / 2;
      const parallaxX = (mouse.x - centerX) / centerX;
      const parallaxY = (mouse.y - centerY) / centerY;

      if (mouse.x > -9000) {
        const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 380);
        glow.addColorStop(0, "rgba(205,212,177,0.08)");
        glow.addColorStop(0.25, "rgba(238,204,208,0.05)");
        glow.addColorStop(0.5, "rgba(220,162,120,0.03)");
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);
      }

      const sorted = shapes.slice().sort((a, b) => a.z - b.z);

      for (const s of sorted) {
        const bobY = Math.sin(elapsed * s.bobSpeed + s.bobPhase) * s.bobAmp;
        const px = parallaxX * s.z * 18;
        const py = parallaxY * s.z * 14;

        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.rot += s.rotSpeed * dt;

        if (s.x < -80) s.x = w + 80;
        if (s.x > w + 80) s.x = -80;
        if (s.y < -80) s.y = h + 80;
        if (s.y > h + 80) s.y = -80;

        if (mouse.x > -9000) {
          const dx = mouse.x - s.x;
          const dy = mouse.y - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 300 && dist > 0) {
            const pull = ((300 - dist) / 300) * 0.003 * s.z;
            s.vx += (dx / dist) * pull * dt;
            s.vy += (dy / dist) * pull * dt;
          }
        }

        s.vx *= 0.999;
        s.vy *= 0.999;
        s.rotSpeed *= 0.998;
        s.rotSpeed = Math.max(-0.015, Math.min(0.015, s.rotSpeed));

        const dx = s.x + px;
        const dy = s.y + bobY + py;
        const scale = 0.7 + s.z * 0.3;

        ctx.save();
        ctx.globalAlpha = s.alpha * (0.6 + s.z * 0.4);
        if (s.blur > 0) ctx.filter = `blur(${s.blur}px)`;

        if (s.type === "sphere") drawSphere(s, dx, dy, scale);
        else if (s.type === "hexagon") drawHexagonShape(s, dx, dy, scale);
        else if (s.type === "capsule") drawCapsule(s, dx, dy, scale);
        else drawDot(s, dx, dy, scale);

        ctx.restore();
      }

      animId = requestAnimationFrame(draw);
    }
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseleave", onMouseLeave);
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
