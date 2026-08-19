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
      {/* ===== SOLID SPHERES — glossy radial gradients ===== */}

      {/* 1 — Large sphere, top-left */}
      <div style={{
        position: "absolute", top: "8%", left: "5%",
        width: 70, height: 70, borderRadius: "50%",
        background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.30) 22%, ${euc}0.55) 50%, ${euc}0.25) 80%, ${euc}0.08) 100%)`,
        border: `1.5px solid ${euc}0.55)`,
        boxShadow: `inset 0 -4px 8px ${euc}0.15), 0 2px 8px ${euc}0.12)`,
      }} />

      {/* 2 — Medium sphere, center-left */}
      <div style={{
        position: "absolute", top: "38%", left: "10%",
        width: 52, height: 52, borderRadius: "50%",
        background: `radial-gradient(circle at 30% 26%, rgba(255,255,255,0.80) 0%, rgba(255,255,255,0.25) 24%, ${peach}0.50) 52%, ${peach}0.20) 82%, ${peach}0.06) 100%)`,
        border: `1.5px solid ${peach}0.50)`,
        boxShadow: `inset 0 -3px 6px ${peach}0.12), 0 2px 6px ${peach}0.10)`,
      }} />

      {/* 3 — Small sphere, top-right */}
      <div style={{
        position: "absolute", top: "12%", right: "12%",
        width: 38, height: 38, borderRadius: "50%",
        background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.28) 22%, ${clay}0.48) 50%, ${clay}0.18) 80%, ${clay}0.05) 100%)`,
        border: `1.2px solid ${clay}0.45)`,
        boxShadow: `inset 0 -2px 5px ${clay}0.10), 0 1px 5px ${clay}0.08)`,
      }} />

      {/* 4 — Small sphere, bottom-left */}
      <div style={{
        position: "absolute", bottom: "22%", left: "16%",
        width: 44, height: 44, borderRadius: "50%",
        background: `radial-gradient(circle at 30% 26%, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.22) 25%, ${pist}0.48) 52%, ${pist}0.18) 82%, ${pist}0.05) 100%)`,
        border: `1.2px solid ${pist}0.48)`,
        boxShadow: `inset 0 -3px 6px ${pist}0.10), 0 2px 6px ${pist}0.08)`,
      }} />

      {/* 5 — Tiny sphere, center-right */}
      <div style={{
        position: "absolute", top: "52%", right: "6%",
        width: 28, height: 28, borderRadius: "50%",
        background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.80) 0%, rgba(255,255,255,0.25) 24%, ${euc}0.45) 52%, ${euc}0.15) 82%, transparent 100%)`,
        border: `1px solid ${euc}0.40)`,
      }} />

      {/* 6 — Sphere, bottom-right */}
      <div style={{
        position: "absolute", bottom: "14%", right: "18%",
        width: 34, height: 34, borderRadius: "50%",
        background: `radial-gradient(circle at 30% 26%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.20) 25%, ${clay}0.42) 52%, ${clay}0.12) 82%, transparent 100%)`,
        border: `1px solid ${clay}0.38)`,
      }} />

      {/* ===== HEXAGONS — filled + outline variants ===== */}

      {/* 7 — Hexagon filled, center */}
      <div style={{
        position: "absolute", top: "46%", left: "44%",
        width: 54, height: 54,
        clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
        background: `linear-gradient(160deg, ${pist}0.45), ${euc}0.25))`,
        filter: "drop-shadow(0 0 2px rgba(235,236,204,0.35))",
      }} />

      {/* 8 — Hexagon outline, top-right */}
      <svg
        style={{ position: "absolute", top: "24%", right: "22%", opacity: 0.30 }}
        width="46" height="46" viewBox="0 0 46 46"
      >
        <polygon
          points="23,1 42.5,12 42.5,34 23,45 3.5,34 3.5,12"
          fill="none"
          stroke={clay.slice(0, -1) + ",0.60)"}
          strokeWidth="1.5"
        />
      </svg>

      {/* 9 — Hexagon filled, bottom-center */}
      <div style={{
        position: "absolute", bottom: "10%", left: "40%",
        width: 40, height: 40,
        clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
        background: `linear-gradient(160deg, ${euc}0.40), ${peach}0.18))`,
        filter: "drop-shadow(0 0 2px rgba(205,212,177,0.30))",
      }} />

      {/* 10 — Hexagon outline, left side */}
      <svg
        style={{ position: "absolute", top: "62%", left: "3%", opacity: 0.25 }}
        width="38" height="38" viewBox="0 0 38 38"
      >
        <polygon
          points="19,1 35,10 35,28 19,37 3,28 3,10"
          fill="none"
          stroke={peach.slice(0, -1) + ",0.55)"}
          strokeWidth="1.5"
        />
      </svg>

      {/* ===== CIRCLE OUTLINES — 15-35% opacity ===== */}

      {/* 11 — Large circle outline, top-right */}
      <div style={{
        position: "absolute", top: "3%", right: "4%",
        width: 130, height: 130, borderRadius: "50%",
        border: `2px solid ${peach}0.28)`,
        background: "none",
      }} />

      {/* 12 — Medium circle outline, bottom-right */}
      <div style={{
        position: "absolute", bottom: "8%", right: "3%",
        width: 100, height: 100, borderRadius: "50%",
        border: `2px solid ${euc}0.22)`,
        background: "none",
      }} />

      {/* 13 — Small circle outline, center-left */}
      <div style={{
        position: "absolute", top: "55%", left: "2%",
        width: 60, height: 60, borderRadius: "50%",
        border: `1.5px solid ${pist}0.30)`,
        background: "none",
      }} />

      {/* ===== CIRCLE FILLS — solid at 70-95% ===== */}

      {/* 14 — Small solid dot, top-center */}
      <div style={{
        position: "absolute", top: "4%", left: "50%",
        width: 18, height: 18, borderRadius: "50%",
        background: `${ivory}0.35)`,
        border: `1px solid ${ivory}0.45)`,
      }} />

      {/* 15 — Solid dot, center-right */}
      <div style={{
        position: "absolute", top: "32%", right: "7%",
        width: 14, height: 14, borderRadius: "50%",
        background: `${clay}0.35)`,
      }} />

      {/* ===== CAPSULES ===== */}

      {/* 16 — Capsule right */}
      <div style={{
        position: "absolute", top: "70%", right: "8%",
        width: 60, height: 22, borderRadius: 11,
        background: `linear-gradient(180deg, rgba(255,255,255,0.45), ${clay}0.22))`,
        border: `1.5px solid ${clay}0.38)`,
        transform: "rotate(-18deg)",
      }} />

      {/* 17 — Capsule left */}
      <div style={{
        position: "absolute", top: "20%", left: "30%",
        width: 50, height: 18, borderRadius: 9,
        background: `linear-gradient(180deg, rgba(255,255,255,0.40), ${euc}0.18))`,
        border: `1.2px solid ${euc}0.32)`,
        transform: "rotate(30deg)",
      }} />

      {/* ===== DOT-GRID CLUSTERS — loose 6x4 white dots in corners ===== */}

      {/* 18 — Dot grid top-left (6 columns x 4 rows) */}
      <div style={{ position: "absolute", top: "6%", left: "18%", display: "grid", gridTemplateColumns: "repeat(6, 5px)", gap: 9 }}>
        {[...Array(24)].map((_, i) => (
          <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: `rgba(255,255,255,0.40)` }} />
        ))}
      </div>

      {/* 19 — Dot grid bottom-right (6 columns x 4 rows) */}
      <div style={{ position: "absolute", bottom: "8%", right: "10%", display: "grid", gridTemplateColumns: "repeat(6, 5px)", gap: 9 }}>
        {[...Array(24)].map((_, i) => (
          <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: `rgba(255,255,255,0.35)` }} />
        ))}
      </div>

      {/* 20 — Dot grid top-right (4x3) */}
      <div style={{ position: "absolute", top: "16%", right: "6%", display: "grid", gridTemplateColumns: "repeat(4, 5px)", gap: 8 }}>
        {[...Array(12)].map((_, i) => (
          <div key={i} style={{ width: 3.5, height: 3.5, borderRadius: "50%", background: `rgba(255,255,255,0.30)` }} />
        ))}
      </div>

      {/* 21 — Dot grid bottom-left (5x3) */}
      <div style={{ position: "absolute", bottom: "18%", left: "8%", display: "grid", gridTemplateColumns: "repeat(5, 5px)", gap: 8 }}>
        {[...Array(15)].map((_, i) => (
          <div key={i} style={{ width: 3.5, height: 3.5, borderRadius: "50%", background: `rgba(255,255,255,0.32)` }} />
        ))}
      </div>

      {/* ===== SCATTERED DOTS ===== */}

      {/* 22 — Dot cluster, center-left */}
      <div style={{ position: "absolute", top: "44%", left: "6%", display: "flex", gap: 7, flexWrap: "wrap", width: 26 }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: `${pist}0.35)` }} />
        ))}
      </div>

      {/* 23 — Scattered dots, bottom-center */}
      <div style={{ position: "absolute", bottom: "28%", left: "48%", display: "flex", gap: 8, flexWrap: "wrap", width: 28 }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: `${clay}0.30)` }} />
        ))}
      </div>

      {/* ===== CURVED ARCS ===== */}

      {/* 24 — Arc top-right */}
      <svg
        style={{ position: "absolute", top: "2%", right: "1%", opacity: 0.22 }}
        width="110" height="110" viewBox="0 0 110 110"
      >
        <path d="M10,100 Q55,-20 100,55" fill="none" stroke={clay.slice(0, -1) + ",0.40)"} strokeWidth="2" />
      </svg>

      {/* 25 — Arc bottom-left */}
      <svg
        style={{ position: "absolute", bottom: "12%", left: "1%", opacity: 0.20 }}
        width="90" height="90" viewBox="0 0 90 90"
      >
        <path d="M5,15 Q45,85 85,25" fill="none" stroke={euc.slice(0, -1) + ",0.38)"} strokeWidth="2" />
      </svg>

      {/* ===== ISOMETRIC 3D CUBE — 3 distinct shaded faces ===== */}

      {/* 26 — Isometric cube, bottom-right */}
      <div style={{
        position: "absolute", bottom: "32%", right: "10%",
        width: 44, height: 44,
        transformStyle: "preserve-3d",
        transform: "rotateX(55deg) rotateZ(-45deg)",
      }}>
        {/* Top face — lightest */}
        <div style={{
          position: "absolute", width: "100%", height: "100%",
          background: `linear-gradient(135deg, ${euc}0.50), ${euc}0.30))`,
          border: `1px solid ${euc}0.50)`,
          transform: "translateZ(22px)",
        }} />
        {/* Front face — medium */}
        <div style={{
          position: "absolute", width: "100%", height: "100%",
          background: `linear-gradient(180deg, ${pist}0.38), ${pist}0.18))`,
          border: `1px solid ${pist}0.40)`,
        }} />
        {/* Right face — darkest */}
        <div style={{
          position: "absolute", width: "100%", height: "100%",
          background: `linear-gradient(135deg, ${peach}0.35), ${peach}0.15))`,
          border: `1px solid ${peach}0.35)`,
          transform: "rotateY(90deg) translateZ(22px)",
        }} />
      </div>
    </div>
  );
}
