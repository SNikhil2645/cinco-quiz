export default function DecorativeBackground() {
  const euc = "rgba(205,212,177,";
  const pist = "rgba(235,236,204,";
  const peach = "rgba(238,204,208,";
  const clay = "rgba(220,162,120,";
  const ivory = "rgba(255,249,226,";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      {/* 1 — Large circle outline, top-left */}
      <div style={{
        position: "absolute", top: "4%", left: "3%",
        width: 120, height: 120, borderRadius: "50%",
        border: `2px solid ${euc}0.25)`,
        background: "none",
      }} />

      {/* 2 — Small solid circle, top-right */}
      <div style={{
        position: "absolute", top: "7%", right: "8%",
        width: 36, height: 36, borderRadius: "50%",
        background: `${peach}0.18)`,
        border: `1.5px solid ${peach}0.35)`,
      }} />

      {/* 3 — Medium circle outline, bottom-left */}
      <div style={{
        position: "absolute", bottom: "12%", left: "6%",
        width: 80, height: 80, borderRadius: "50%",
        border: `2px solid ${pist}0.30)`,
        background: "none",
      }} />

      {/* 4 — Tiny dot, center-right */}
      <div style={{
        position: "absolute", top: "35%", right: "5%",
        width: 14, height: 14, borderRadius: "50%",
        background: `${clay}0.30)`,
      }} />

      {/* 5 — Small circle, top-center */}
      <div style={{
        position: "absolute", top: "3%", left: "42%",
        width: 22, height: 22, borderRadius: "50%",
        background: `${ivory}0.22)`,
        border: `1px solid ${ivory}0.38)`,
      }} />

      {/* 6 — Large circle outline, bottom-right */}
      <div style={{
        position: "absolute", bottom: "6%", right: "4%",
        width: 140, height: 140, borderRadius: "50%",
        border: `2px solid ${peach}0.18)`,
        background: "none",
      }} />

      {/* 7 — Sphere (gradient fill), top-left quadrant */}
      <div style={{
        position: "absolute", top: "22%", left: "12%",
        width: 52, height: 52, borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.55), ${euc}0.30) 60%, ${euc}0.10))`,
        border: `1.5px solid ${euc}0.40)`,
      }} />

      {/* 8 — Hexagon (clip-path), center area */}
      <div style={{
        position: "absolute", top: "48%", left: "46%",
        width: 50, height: 50,
        clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
        background: `${pist}0.22)`,
        border: `1px solid ${pist}0.40)`,
        filter: "drop-shadow(0 0 1px rgba(235,236,204,0.3))",
      }} />

      {/* 9 — Capsule, right side */}
      <div style={{
        position: "absolute", top: "58%", right: "10%",
        width: 64, height: 24, borderRadius: 12,
        background: `linear-gradient(180deg, rgba(255,255,255,0.32), ${clay}0.14))`,
        border: `1.5px solid ${clay}0.32)`,
        transform: "rotate(-15deg)",
      }} />

      {/* 10 — Dot grid (4×4), top-left area */}
      <div style={{ position: "absolute", top: "14%", left: "28%", display: "grid", gridTemplateColumns: "repeat(4, 8px)", gap: 10 }}>
        {[...Array(16)].map((_, i) => (
          <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: `${euc}0.28)` }} />
        ))}
      </div>

      {/* 11 — Dot grid (3×3), bottom-right area */}
      <div style={{ position: "absolute", bottom: "22%", right: "14%", display: "grid", gridTemplateColumns: "repeat(3, 7px)", gap: 9 }}>
        {[...Array(9)].map((_, i) => (
          <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: `${peach}0.26)` }} />
        ))}
      </div>

      {/* 12 — Small dot cluster, center-left */}
      <div style={{ position: "absolute", top: "60%", left: "8%", display: "flex", gap: 6, flexWrap: "wrap", width: 28 }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: `${pist}0.30)` }} />
        ))}
      </div>

      {/* 13 — Tiny scattered dots, top-right */}
      <div style={{ position: "absolute", top: "18%", right: "18%", display: "flex", gap: 7, flexWrap: "wrap", width: 24 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: `${clay}0.28)` }} />
        ))}
      </div>

      {/* 14 — Sphere (gradient fill), bottom-left */}
      <div style={{
        position: "absolute", bottom: "28%", left: "18%",
        width: 42, height: 42, borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.50), ${peach}0.28) 55%, ${peach}0.08))`,
        border: `1.5px solid ${peach}0.38)`,
      }} />

      {/* 15 — Hexagon (clip-path), top-right */}
      <div style={{
        position: "absolute", top: "30%", right: "20%",
        width: 38, height: 38,
        clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
        background: `${clay}0.20)`,
        border: `1px solid ${clay}0.38)`,
        filter: "drop-shadow(0 0 1px rgba(220,162,120,0.25))",
      }} />

      {/* 16 — Capsule, left side */}
      <div style={{
        position: "absolute", top: "72%", left: "30%",
        width: 52, height: 20, borderRadius: 10,
        background: `linear-gradient(180deg, rgba(255,255,255,0.30), ${euc}0.12))`,
        border: `1.5px solid ${euc}0.28)`,
        transform: "rotate(20deg)",
      }} />

      {/* 17 — Curved arc (top-right) */}
      <svg
        style={{ position: "absolute", top: "10%", right: "2%", opacity: 0.18 }}
        width="100" height="100" viewBox="0 0 100 100"
      >
        <path d="M10,90 Q50,-10 90,50" fill="none" stroke={clay.slice(0, -1) + ",0.35)"} strokeWidth="2" />
      </svg>

      {/* 18 — Curved arc (bottom-left) */}
      <svg
        style={{ position: "absolute", bottom: "15%", left: "2%", opacity: 0.16 }}
        width="80" height="80" viewBox="0 0 80 80"
      >
        <path d="M5,10 Q40,80 75,20" fill="none" stroke={euc.slice(0, -1) + ",0.32)"} strokeWidth="2" />
      </svg>

      {/* 19 — Sphere, center-right */}
      <div style={{
        position: "absolute", top: "42%", right: "3%",
        width: 30, height: 30, borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.50), ${pist}0.25) 55%, ${pist}0.08))`,
        border: `1px solid ${pist}0.35)`,
      }} />

      {/* 20 — Hexagon, bottom-center */}
      <div style={{
        position: "absolute", bottom: "8%", left: "42%",
        width: 34, height: 34,
        clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
        background: `${euc}0.20)`,
        filter: "drop-shadow(0 0 1px rgba(205,212,177,0.25))",
      }} />

      {/* 21 — Dot, top-left of center */}
      <div style={{
        position: "absolute", top: "28%", left: "38%",
        width: 10, height: 10, borderRadius: "50%",
        background: `${pist}0.28)`,
      }} />

      {/* 22 — Large circle outline, center-left */}
      <div style={{
        position: "absolute", top: "50%", left: "2%",
        width: 70, height: 70, borderRadius: "50%",
        border: `1.5px solid ${peach}0.20)`,
        background: "none",
      }} />

      {/* 23 — Dot grid (2×4), bottom-left area */}
      <div style={{ position: "absolute", bottom: "30%", left: "40%", display: "grid", gridTemplateColumns: "repeat(4, 6px)", gap: 8 }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: `${clay}0.22)` }} />
        ))}
      </div>

      {/* 24 — Capsule, top-center */}
      <div style={{
        position: "absolute", top: "5%", left: "58%",
        width: 46, height: 18, borderRadius: 9,
        background: `linear-gradient(180deg, rgba(255,255,255,0.28), ${pist}0.12))`,
        border: `1px solid ${pist}0.28)`,
        transform: "rotate(35deg)",
      }} />

      {/* 25 — Small sphere, bottom-right */}
      <div style={{
        position: "absolute", bottom: "18%", right: "22%",
        width: 24, height: 24, borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.48), ${clay}0.22) 55%, ${clay}0.06))`,
        border: `1px solid ${clay}0.30)`,
      }} />

      {/* 26 — Isometric 3D cube, bottom-right */}
      <div style={{
        position: "absolute", bottom: "35%", right: "8%",
        width: 36, height: 36,
        transform: "rotateX(55deg) rotateZ(-45deg)",
        transformStyle: "preserve-3d",
      }}>
        {/* top face */}
        <div style={{
          position: "absolute", width: "100%", height: "100%",
          background: `${euc}0.22)`,
          border: `1px solid ${euc}0.38)`,
          transform: "translateZ(18px)",
        }} />
        {/* front face */}
        <div style={{
          position: "absolute", width: "100%", height: "100%",
          background: `${pist}0.16)`,
          border: `1px solid ${pist}0.30)`,
        }} />
        {/* right face */}
        <div style={{
          position: "absolute", width: "100%", height: "100%",
          background: `${peach}0.14)`,
          border: `1px solid ${peach}0.26)`,
          transform: "rotateY(90deg) translateZ(18px)",
        }} />
      </div>
    </div>
  );
}
