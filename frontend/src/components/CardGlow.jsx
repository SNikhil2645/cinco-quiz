import { useEffect, useRef } from "react";

export default function CardGlow() {
  const rafRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const activeCardRef = useRef(null);

  useEffect(() => {
    function updateGlow(e) {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const cards = document.querySelectorAll(".glass-card");
        let closest = null;
        let minDist = Infinity;

        for (let i = 0; i < cards.length; i++) {
          const card = cards[i];
          const r = card.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dx = mouseRef.current.x - cx;
          const dy = mouseRef.current.y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (mouseRef.current.x >= r.left - 60 &&
              mouseRef.current.x <= r.right + 60 &&
              mouseRef.current.y >= r.top - 60 &&
              mouseRef.current.y <= r.bottom + 60) {
            if (dist < minDist) {
              minDist = dist;
              closest = card;
            }
          }
        }

        for (let i = 0; i < cards.length; i++) {
          const card = cards[i];
          const r = card.getBoundingClientRect();
          const px = mouseRef.current.x - r.left;
          const py = mouseRef.current.y - r.top;

          card.style.setProperty("--glow-x", px + "px");
          card.style.setProperty("--glow-y", py + "px");

          if (card === closest) {
            card.style.setProperty("--glow-opacity", "1");
          } else {
            const cur = parseFloat(card.style.getPropertyValue("--glow-opacity")) || 0;
            if (cur > 0.01) {
              card.style.setProperty("--glow-opacity", String(cur * 0.88));
            } else {
              card.style.setProperty("--glow-opacity", "0");
            }
          }
        }
      });
    }

    function handleLeave() {
      const cards = document.querySelectorAll(".glass-card");
      function fadeAll() {
        let any = false;
        for (let i = 0; i < cards.length; i++) {
          const cur = parseFloat(cards[i].style.getPropertyValue("--glow-opacity")) || 0;
          if (cur > 0.01) {
            cards[i].style.setProperty("--glow-opacity", String(cur * 0.85));
            any = true;
          } else {
            cards[i].style.setProperty("--glow-opacity", "0");
          }
        }
        if (any) requestAnimationFrame(fadeAll);
      }
      fadeAll();
    }

    document.addEventListener("mousemove", updateGlow, { passive: true });
    document.addEventListener("mouseleave", handleLeave);

    return () => {
      document.removeEventListener("mousemove", updateGlow);
      document.removeEventListener("mouseleave", handleLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return null;
}
