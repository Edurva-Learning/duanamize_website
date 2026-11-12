'use client';

import React, { useEffect, useRef, useState } from 'react';

/* =====================================================================
   HeroAnimation
   ---------------------------------------------------------------------
   Three rows of cards drift left → right. Left of the centre beam they
   are grey "skeleton" placeholders; as each card crosses the beam it is
   revealed (clip-path wipe) as a filled result card. The top and bottom
   rows bend along a curve so they fan out from the centre icon.
   Positions are written straight to the DOM in a rAF loop (no React
   re-renders per frame), so it stays smooth.
===================================================================== */

/* ---------------------------- Config ------------------------------- */

const CARD_W = 380; // card size at desktop scale
const CARD_H = 92;
const GAP = 40; // horizontal gap between cards
const SPEED = 42; // px per second at desktop scale

const ROWS = [
  { y: 0.23, curve: -1, offset: 0.15 }, // top row: rises toward the edges
  { y: 0.5, curve: 0, offset: 0.6 }, // middle row: straight, passes behind the icon
  { y: 0.77, curve: 1, offset: 0.35 }, // bottom row: drops toward the edges
];

type IconName =
  | 'invoice'
  | 'cash'
  | 'quality'
  | 'warehouse'
  | 'claims'
  | 'changeover'
  | 'procure'
  | 'support';

type Item = {
  title: string;
  sub: string;
  value: string;
  label: string;
  delta: string;
  icon: IconName;
};

// Placeholder figures: swap in real client outcomes before going live.
const ITEMS: Item[] = [
  { title: 'Invoice Processing', sub: 'Cycle time 1.8 days', value: '$248,320', label: 'Savings', delta: '32.5%', icon: 'invoice' },
  { title: 'Order-to-Cash', sub: 'DSO cut to 28 days', value: '$1,104,700', label: 'Unlocked', delta: '24.6%', icon: 'cash' },
  { title: 'Quality Control', sub: 'Sigma level 5.4', value: '$612,450', label: 'Savings', delta: '12.4%', icon: 'quality' },
  { title: 'Warehouse Picking', sub: 'Lead time −41%', value: '$384,920', label: 'Impact', delta: '18.4%', icon: 'warehouse' },
  { title: 'Claims Handling', sub: 'First-pass yield 96%', value: '$143,180', label: 'Savings', delta: '9.3%', icon: 'claims' },
  { title: 'Line Changeover', sub: 'SMED: 22 min', value: '$279,600', label: 'Capacity', delta: '11.5%', icon: 'changeover' },
  { title: 'Procurement', sub: 'PO cycle 2.1 days', value: '$918,240', label: 'Savings', delta: '15.2%', icon: 'procure' },
  { title: 'Support Desk', sub: 'Handle time 4.2 min', value: '$156,910', label: 'Impact', delta: '7.8%', icon: 'support' },
];

/* --------------------------- Component ----------------------------- */

const HeroAnimation = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[][]>(ROWS.map(() => []));
  const dims = useRef({ w: 1200, h: 430, s: 1 });
  const timeRef = useRef(0);
  const [perRow, setPerRow] = useState(8);

  /* Measure container, pick a scale, and work out how many cards a row needs */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const measure = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const s = w < 640 ? 0.68 : w < 1024 ? 0.82 : 1;
      dims.current = { w, h, s };
      const step = (CARD_W + GAP) * s;
      setPerRow(Math.ceil((w + CARD_W * s * 2) / step) + 1);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Animation loop */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let last = performance.now();
    let visible = true;

    const render = () => {
      const { w, h, s } = dims.current;
      const cw = CARD_W * s;
      const step = (CARD_W + GAP) * s;
      const track = perRow * step;
      const half = w / 2;
      const amp = Math.min(w * 0.045, 80); // how strongly the outer rows bend
      const dist = timeRef.current * SPEED * s;

      ROWS.forEach((row, r) => {
        const baseY = h * row.y;

        cardRefs.current[r].forEach((card, i) => {
          if (!card) return;

          // Horizontal position, wrapping around the track
          const raw = (i * step + dist + row.offset * step) % track;
          const left = raw - cw;
          const cx = left + cw / 2;

          // Normalised distance from centre (-1 … 1)
          const d = (cx - half) / half;

          // Curve + tangent rotation
          const y = baseY + row.curve * amp * d * d;
          const slope = (2 * row.curve * amp * d) / half;
          const rot = (Math.atan(slope) * 180) / Math.PI;

          // Fade toward the edges, and keep the skeleton side a bit softer
          const ad = Math.abs(d);
          let opacity = ad < 0.5 ? 1 : Math.max(0.15, 1 - (ad - 0.5) * 1.5);
          if (d < 0) opacity *= 0.85;

          card.style.transform = `translate3d(${cx - CARD_W / 2}px, ${y - CARD_H / 2}px, 0) rotate(${rot}deg) scale(${s})`;
          card.style.opacity = String(opacity);

          // Wipe from skeleton to filled where the card crosses the beam
          const cross = (half - cx) / s + CARD_W / 2;
          const reveal = Math.max(0, Math.min(CARD_W, cross));
          const skeleton = card.children[0] as HTMLElement;
          const filled = card.children[1] as HTMLElement;

          skeleton.style.visibility = reveal <= 0 ? 'hidden' : 'visible';
          skeleton.style.clipPath = `inset(-30px ${CARD_W - reveal}px -30px -30px)`;
          filled.style.visibility = reveal >= CARD_W ? 'hidden' : 'visible';
          filled.style.clipPath = `inset(-30px -30px -30px ${reveal}px)`;
        });
      });
    };

    const tick = (now: number) => {
      const dt = Math.min(now - last, 64) / 1000; // cap so tab switches don't jump
      last = now;
      if (!reduceMotion) timeRef.current += dt;
      render();
      if (visible && !reduceMotion) raf = requestAnimationFrame(tick);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    // Pause when the hero is scrolled out of view
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else cancelAnimationFrame(raf);
    });
    io.observe(el);
    start();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [perRow]);

  const edgeMask =
    'linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%)';

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="relative h-full w-full select-none"
      style={{ maskImage: edgeMask, WebkitMaskImage: edgeMask }}
    >
      <style>{`
        @keyframes ha-glint {
          0%   { transform: translateY(-100%); opacity: 0; }
          15%  { opacity: 1; }
          100% { transform: translateY(400%); opacity: 0; }
        }
        @keyframes ha-pulse {
          0%   { transform: scale(1);    opacity: .55; }
          100% { transform: scale(1.45); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ha-anim { animation: none !important; }
        }
      `}</style>

      {/* Cards */}
      {ROWS.map((_, r) =>
        Array.from({ length: perRow }).map((__, i) => {
          const item = ITEMS[(i + r * 3) % ITEMS.length];
          return (
            <div
              key={`${r}-${i}`}
              ref={(node) => {
                cardRefs.current[r][i] = node;
              }}
              className="absolute left-0 top-0 z-10 will-change-transform"
              style={{ width: CARD_W, height: CARD_H, opacity: 0 }}
            >
              <SkeletonCard />
              <ResultCard item={item} />
            </div>
          );
        })
      )}

      <Beam />
    </div>
  );
};

/* ---------------------------- Cards -------------------------------- */

const SkeletonCard = () => (
  <div className="absolute inset-0 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 shadow-[0_10px_28px_-16px_rgba(15,23,42,0.14)]">
    <div className="h-14 w-14 shrink-0 rounded-xl bg-[#EDEFF2]" />
    <div className="flex-1 space-y-2.5">
      <div className="h-4 w-[85%] rounded-md bg-[#EDEFF2]" />
      <div className="h-3 w-[55%] rounded-md bg-[#EDEFF2]" />
    </div>
    <div className="h-12 w-px shrink-0 bg-gray-100" />
    <div className="w-[96px] shrink-0 space-y-2.5">
      <div className="h-4 w-full rounded-md bg-[#EDEFF2]" />
      <div className="flex gap-2">
        <div className="h-3 w-[60%] rounded-md bg-[#EDEFF2]" />
        <div className="h-3 flex-1 rounded-md bg-[#EDEFF2]" />
      </div>
    </div>
  </div>
);

const ResultCard = ({ item }: { item: Item }) => (
  <div
    className="absolute inset-0 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 shadow-[0_12px_32px_-14px_rgba(15,23,42,0.22)]"
    style={{ clipPath: 'inset(0 0 0 100%)', visibility: 'hidden' }}
  >
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#EEF6FC] text-[#238ED1]">
      <CardIcon name={item.icon} />
    </div>

    <div className="min-w-0 flex-1 text-left">
      <div className="truncate text-[16px] font-semibold tracking-[-0.2px] text-gray-900">
        {item.title}
      </div>
      <div className="mt-0.5 truncate text-[12.5px] text-gray-500">{item.sub}</div>
    </div>

    <div className="h-12 w-px shrink-0 bg-gray-200" />

    <div className="shrink-0 text-left">
      <div className="text-[18px] font-semibold tracking-[-0.3px] text-[#238ED1]">
        {item.value}
      </div>
      <div className="mt-0.5 flex items-center gap-1.5">
        <span className="text-[12px] text-gray-600">{item.label}</span>
        <span className="flex items-center gap-0.5 rounded border border-[#238ED1]/30 bg-[#238ED1]/5 px-1 py-px text-[9.5px] font-medium text-[#238ED1]">
          <svg viewBox="0 0 11 9" className="h-2 w-2.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 7l3-3 2 2 4-4M7 2h3v3" />
          </svg>
          {item.delta}
        </span>
      </div>
    </div>
  </div>
);

const ICON_PATHS: Record<IconName, React.ReactNode> = {
  invoice: (
    <>
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M9 10h6M9 14h6M9 18h4" />
    </>
  ),
  cash: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6.5 9h.01M17.5 15h.01" />
    </>
  ),
  quality: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-4.5-4.5" />
      <path d="M8.5 11l1.8 1.8L14 9.2" />
    </>
  ),
  warehouse: (
    <>
      <path d="M3 21V9l9-5 9 5v12" />
      <path d="M7 21v-7h10v7M7 17.5h10" />
    </>
  ),
  claims: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3h6v1" />
      <path d="M9 12.5l2 2 4-4" />
    </>
  ),
  changeover: (
    <>
      <path d="M4 12a8 8 0 0 1 13.7-5.7L20 8" />
      <path d="M20 4v4h-4" />
      <path d="M20 12a8 8 0 0 1-13.7 5.7L4 16" />
      <path d="M4 20v-4h4" />
    </>
  ),
  procure: (
    <>
      <path d="M3 4h2l2.5 11h11L21 7H6.2" />
      <circle cx="9" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
    </>
  ),
  support: (
    <>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
      <path d="M19 19c0 1.5-2 2-5 2" />
    </>
  ),
};

const CardIcon = ({ name }: { name: IconName }) => (
  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {ICON_PATHS[name]}
  </svg>
);

/* ------------------------- Centre beam ----------------------------- */

const Beam = () => (
  <div className="pointer-events-none absolute inset-0 z-20">
    {/* soft glow behind the icon */}
    <div className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#238ED1]/15 blur-3xl" />

    {/* top stem with a light glint travelling down */}
    <div
      className="absolute left-1/2 top-0 h-1/2 w-[10px] -translate-x-1/2 overflow-hidden sm:w-[14px]"
      style={{
        background:
          'linear-gradient(to bottom, rgba(35,142,209,0) 0%, rgba(35,142,209,0.35) 25%, #238ED1 100%)',
      }}
    >
      <div
        className="ha-anim absolute inset-x-0 top-0 h-1/4"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.85), rgba(255,255,255,0))',
          animation: 'ha-glint 2.6s ease-in infinite',
        }}
      />
    </div>

    {/* bottom flare */}
    <svg
      className="absolute left-1/2 top-1/2 h-1/2 w-[120px] -translate-x-1/2 sm:w-[170px]"
      viewBox="0 0 170 200"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="ha-flare" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#238ED1" />
          <stop offset="100%" stopColor="#1B78B8" />
        </linearGradient>
      </defs>
      <path d="M78 0 H92 C92 110 100 168 170 200 H0 C70 168 78 110 78 0 Z" fill="url(#ha-flare)" />
    </svg>

    {/* icon tile */}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <span
        className="ha-anim absolute inset-0 rounded-[26px] border-2 border-[#238ED1]/50 sm:rounded-[32px]"
        style={{ animation: 'ha-pulse 2.6s ease-out infinite' }}
      />
      <div
        className="relative flex h-[92px] w-[92px] items-center justify-center rounded-[26px] sm:h-[120px] sm:w-[120px] sm:rounded-[32px]"
        style={{
          background: 'linear-gradient(145deg, #5BBBF2 0%, #238ED1 55%, #1A74B3 100%)',
          boxShadow:
            '0 22px 50px -12px rgba(35,142,209,0.65), inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -6px 16px rgba(7,84,139,0.35)',
        }}
      >
        {/* hexagon + upward trend: swap for your own logo mark if you like */}
        <svg viewBox="0 0 52 54" className="h-[44px] w-[44px] sm:h-[56px] sm:w-[56px]" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M26 4 46 15.5v23L26 50 6 38.5v-23Z" />
          <path d="M15 34l7-7 6 4 9-10" />
          <path d="M31 21h6v6" />
        </svg>
      </div>
    </div>
  </div>
);

export default HeroAnimation;