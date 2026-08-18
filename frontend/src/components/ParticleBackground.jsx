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

    const PALETTE = {
      accent: [226, 137, 90],
      slate: [100, 116, 139],
      amber: [245, 158, 11],
      soft: [203, 213, 225],
      indigo: [99, 102, 241],
    };

    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let elapsed = 0;
    let lastTime = performance.now();

    const lerp = (a, b, t) => a + (b - a) * t;

    function makeParticle() {
      const colorKeys = Object.keys(PALETTE);
      const ck = colorKeys[Math.floor(Math.random() * colorKeys.length)];
      const c = PALETTE[ck];
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        baseX: 0,
        baseY: 0,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2.5 + 0.8,
        cr: c[0],
        cg: c[1],
        cb: c[2],
        alpha: Math.random() * 0.22 + 0.08,
        shape: Math.random() > 0.6 ? "diamond" : "circle",
        bobSpeed: Math.random() * 1.5 + 0.5,
        bobAmp: Math.random() * 8 + 3,
        bobOffset: Math.random() * Math.PI * 2,
        layer: 2,
      };
    }

    function makeGeoShape(layer) {
      const shapes = ["hexagon", "triangle", "ring", "pill"];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const colorKeys = ["accent", "slate", "amber", "soft", "indigo"];
      const ck = colorKeys[Math.floor(Math.random() * colorKeys.length)];
      const c = PALETTE[ck];
      const scale = layer === 0 ? 2.5 + Math.random() * 1.5 : 1 + Math.random() * 0.8;
      const alpha =
        layer === 0
          ? Math.random() * 0.06 + 0.03
          : Math.random() * 0.1 + 0.05;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * (layer === 0 ? 0.12 : 0.2),
        vy: (Math.random() - 0.5) * (layer === 0 ? 0.12 : 0.2),
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.008,
        scale,
        cr: c[0],
        cg: c[1],
        cb: c[2],
        alpha,
        shape,
        layer,
        bobSpeed: Math.random() * 1 + 0.3,
        bobAmp: Math.random() * 12 + 5,
        bobOffset: Math.random() * Math.PI * 2,
        w: shape === "pill" ? 20 + Math.random() * 14 : 0,
        h: shape === "pill" ? 8 + Math.random() * 6 : 0,
        hexRadius: shape === "hexagon" ? 14 + Math.random() * 10 : 0,
        triSize: shape === "triangle" ? 12 + Math.random() * 10 : 0,
        ringRadius: shape === "ring" ? 10 + Math.random() * 14 : 0,
      };
    }

    let particles = [];
    let geoShapes = [];
    const PARTICLE_COUNT = isMobile ? 40 : 65;
    const CONNECT_DIST = 120;
    const MOUSE_RADIUS = 200;
    const MOUSE_PULL = 0.015;
    const GEO_MOUSE_RADIUS = 280;
    const GEO_MOUSE_PULL = 0.004;
    const GEO_MOUSE_ROTATE = 0.025;

    function init() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(makeParticle());
      }

      geoShapes = [];
      const backCount = isMobile ? 3 : 5;
      const midCount = isMobile ? 3 : 5;
      for (let i = 0; i < backCount; i++) geoShapes.push(makeGeoShape(0));
      for (let i = 0; i < midCount; i++) geoShapes.push(makeGeoShape(1));
    }
    init();

    window.addEventListener("resize", () => {
      init();
    });

    const onMouseMove = (e) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };
    const onTouchMove = (e) => {
      mouse.tx = e.touches[0].clientX;
      mouse.ty = e.touches[0].clientY;
    };
    const onMouseLeave = () => {
      mouse.tx = -9999;
      mouse.ty = -9999;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);

    function drawHexagon(cx, cy, radius, rotation) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = rotation + (Math.PI / 3) * i;
        const px = cx + radius * Math.cos(angle);
        const py = cy + radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    }

    function drawTriangle(cx, cy, size, rotation) {
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const angle = rotation + ((Math.PI * 2) / 3) * i - Math.PI / 2;
        const px = cx + size * Math.cos(angle);
        const py = cy + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    }

    function drawRing(cx, cy, radius) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    }

    function drawPill(cx, cy, pw, ph, rotation) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      const r = ph / 2;
      ctx.beginPath();
      ctx.moveTo(-pw / 2 + r, -ph / 2);
      ctx.lineTo(pw / 2 - r, -ph / 2);
      ctx.arc(pw / 2 - r, 0, r, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(-pw / 2 + r, ph / 2);
      ctx.arc(-pw / 2 + r, 0, r, Math.PI / 2, -Math.PI / 2);
      ctx.closePath();
      ctx.restore();
    }

    function draw(now) {
      const dt = Math.min((now - lastTime) / 16.667, 3);
      lastTime = now;
      elapsed += dt * 0.02;

      mouse.x = lerp(mouse.x, mouse.tx, 0.08);
      mouse.y = lerp(mouse.y, mouse.ty, 0.08);

      ctx.clearRect(0, 0, w, h);

      const cursorGlow = mouse.x > -9000;
      if (cursorGlow) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 320);
        grad.addColorStop(0, "rgba(226,137,90,0.04)");
        grad.addColorStop(0.4, "rgba(99,102,241,0.02)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      for (let i = 0; i < geoShapes.length; i++) {
        const g = geoShapes[i];
        const layerSpeed = g.layer === 0 ? 0.15 : 0.3;

        const bobY = Math.sin(elapsed * g.bobSpeed + g.bobOffset) * g.bobAmp;

        g.x += g.vx * dt;
        g.y += g.vy * dt;
        g.rotation += g.rotSpeed * dt;

        if (g.x < -60) g.x = w + 60;
        if (g.x > w + 60) g.x = -60;
        if (g.y < -60) g.y = h + 60;
        if (g.y > h + 60) g.y = -60;

        if (cursorGlow) {
          const dx = mouse.x - g.x;
          const dy = mouse.y - g.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < GEO_MOUSE_RADIUS && dist > 0) {
            const pull = ((GEO_MOUSE_RADIUS - dist) / GEO_MOUSE_RADIUS) * GEO_MOUSE_PULL;
            g.vx += (dx / dist) * pull * dt;
            g.vy += (dy / dist) * pull * dt;

            const targetRot = Math.atan2(dy, dx);
            let angleDiff = targetRot - g.rotation;
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            g.rotSpeed += angleDiff * GEO_MOUSE_ROTATE * ((GEO_MOUSE_RADIUS - dist) / GEO_MOUSE_RADIUS) * 0.05;
          }
        }

        g.vx *= 0.998;
        g.vy *= 0.998;
        g.rotSpeed *= 0.995;
        g.rotSpeed = Math.max(-0.03, Math.min(0.03, g.rotSpeed));

        const drawY = g.y + bobY;
        const drawX = g.x;

        ctx.save();
        ctx.globalAlpha = g.alpha;
        ctx.strokeStyle = `rgba(${g.cr},${g.cg},${g.cb},1)`;
        ctx.lineWidth = g.layer === 0 ? 1.2 : 1.5;
        ctx.fillStyle = `rgba(${g.cr},${g.cg},${g.cb},0.12)`;

        if (g.shape === "hexagon") {
          drawHexagon(drawX, drawY, g.hexRadius * g.scale, g.rotation);
          ctx.fill();
          ctx.stroke();
        } else if (g.shape === "triangle") {
          drawTriangle(drawX, drawY, g.triSize * g.scale, g.rotation);
          ctx.fill();
          ctx.stroke();
        } else if (g.shape === "ring") {
          drawRing(drawX, drawY, g.ringRadius * g.scale);
          ctx.stroke();
        } else if (g.shape === "pill") {
          drawPill(drawX, drawY, g.w * g.scale, g.h * g.scale, g.rotation);
          ctx.fill();
          ctx.stroke();
        }

        ctx.restore();
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const bobOffset = Math.sin(elapsed * p.bobSpeed + p.bobOffset) * p.bobAmp;

        const dx = mouse.x - p.x;
        const dy = mouse.y - (p.y + bobOffset);
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS && dist > 0) {
          const pull = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * MOUSE_PULL;
          p.vx += (dx / dist) * pull * dt;
          p.vy += (dy / dist) * pull * dt;
        }

        p.vx *= 0.992;
        p.vy *= 0.992;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        const drawX = p.x;
        const drawY = p.y + bobOffset;

        if (p.shape === "diamond") {
          ctx.save();
          ctx.translate(drawX, drawY);
          ctx.rotate(Math.PI / 4 + elapsed * 0.3);
          ctx.fillStyle = `rgba(${p.cr},${p.cg},${p.cb},${p.alpha})`;
          ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(drawX, drawY, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.cr},${p.cg},${p.cb},${p.alpha})`;
          ctx.fill();
        }

        if (dist < MOUSE_RADIUS && cursorGlow) {
          const glowAlpha = 0.15 * (1 - dist / MOUSE_RADIUS);
          ctx.beginPath();
          ctx.arc(drawX, drawY, p.r + 5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.cr},${p.cg},${p.cb},${glowAlpha})`;
          ctx.fill();
        }

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const qBobY = Math.sin(elapsed * q.bobSpeed + q.bobOffset) * q.bobAmp;
          const ddx = p.x - q.x;
          const ddy = (p.y + bobOffset) - (q.y + qBobY);
          const d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < CONNECT_DIST) {
            const fade = 1 - d / CONNECT_DIST;
            const lineAlpha = 0.08 * fade * fade;
            ctx.beginPath();
            ctx.moveTo(drawX, drawY);
            ctx.lineTo(q.x, q.y + qBobY);
            ctx.strokeStyle = `rgba(${p.cr},${p.cg},${p.cb},${lineAlpha})`;
            ctx.lineWidth = 0.5 + fade * 0.4;
            ctx.stroke();
          }
        }
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
