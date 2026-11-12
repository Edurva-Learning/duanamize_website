'use client';

import React, { useEffect, useRef, useState } from 'react';

/* =====================================================================
   "Our Core Methodologies", SuperHi course-card style
   - Big colour panels with large headlines, side by side
   - Each panel is slightly tilted and gently rocks/tilts as you scroll
   - Hover straightens + lifts the panel
   - Panels rise in one by one, bullet ticks pop in
   - Animated graphics: sprint calendar cells light up in turn,
     clock hands turn + money floats, report lines write themselves
   (Pricing now lives in Pricing.tsx)
===================================================================== */

const SECTION_BG = '#FFE3E9'; // SuperHi-style soft pink band behind the panels

const METHODS = [
  {
    title: ['Agile', 'Development'],
    desc: '2-week sprints with continuous delivery and feedback loops',
    points: ['Faster time to market', 'Regular stakeholder feedback', 'Adaptive planning'],
    bg: '#E1EDFF',
    text: '#0B1B3A',
    soft: 'rgba(11,27,58,0.75)',
    tick: '#238ED1',
    graphic: 'calendar',
    base: -1.4, // resting tilt (deg)
    amp: 2.6, // how much it rocks while scrolling
  },
  {
    title: ['DevOps', 'Integration'],
    desc: 'CI/CD pipelines for automated testing and deployment',
    points: ['99.9% uptime', 'Automated quality assurance', 'Rapid deployment'],
    bg: '#238ED1',
    text: '#FFFFFF',
    soft: 'rgba(255,255,255,0.88)',
    tick: '#FFFFFF',
    graphic: 'clock',
    base: 1.1,
    amp: -2.2,
  },
  {
    title: ['Risk', 'Management'],
    desc: 'Proactive risk identification and mitigation strategies',
    points: ['Reduced project risks', 'Contingency planning', 'Quality assurance'],
    bg: '#FF7A1A',
    text: '#0B1B3A',
    soft: 'rgba(11,27,58,0.8)',
    tick: '#0B1B3A',
    graphic: 'doc',
    base: -0.8,
    amp: 2,
  },
] as const;

const clamp = (v: number, lo = -1, hi = 1) => Math.min(hi, Math.max(lo, v));

const useInView = <T extends HTMLElement>(threshold = 0.2) => {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
};

const CoreMethodologies = () => {
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const { ref: headRef, inView: headIn } = useInView<HTMLHeadingElement>(0.4);
  const { ref: gridRef, inView: gridIn } = useInView<HTMLDivElement>(0.15);

  // scroll-linked tilt (SuperHi-style rocking panels)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const mobile = window.innerWidth < 768;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const m = METHODS[i];
        const r = el.getBoundingClientRect();
        // -1 (card below centre) … 0 (centred) … 1 (card above centre)
        const p = reduce ? 0 : clamp((vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2));
        const k = mobile ? 0.5 : 1;
        el.style.setProperty('--rz', `${(m.base + p * m.amp) * k}deg`);
        el.style.setProperty('--rx', `${p * 5 * k}deg`);
        el.style.setProperty('--ry', `${(i - 1) * -p * 7 * k}deg`);
        el.style.setProperty('--ty', `${p * (i === 1 ? -26 : 26) * k}px`);
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="w-full bg-white">
      <style>{STYLES}</style>

      <section className="mc-root w-full overflow-hidden py-20 md:py-28 px-4 md:px-8" style={{ background: SECTION_BG }}>
        <div className="max-w-[1400px] mx-auto w-full">
          {/* Section Heading */}
          <h2
            ref={headRef}
            className={`mc-reveal ${headIn ? 'mc-in' : ''} text-[30px] md:text-[42px] lg:text-[52px] font-semibold leading-[1] tracking-[-0.04em] text-[#0B1B3A] mb-12 md:mb-16 text-center md:text-left`}
          >
            Our Core <br className="hidden md:block" />
            Methodologies
          </h2>

          {/* Cards */}
          <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-4">
            {METHODS.map((m, i) => (
              <div key={i} className={`mc-rise ${gridIn ? 'mc-in' : ''}`} style={{ transitionDelay: `${i * 140}ms` }}>
                <article
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="mc-card group relative flex h-full min-h-[500px] lg:min-h-[560px] flex-col overflow-hidden rounded-[6px] p-6 md:p-8"
                  style={{ background: m.bg, color: m.text }}
                >
                  {/* soft glow */}
                  <span aria-hidden className="mc-drift pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />

                  <h3 className="relative text-[34px] md:text-[40px] lg:text-[clamp(32px,2.9vw,46px)] font-semibold leading-[1] tracking-[-0.045em]">
                    {m.title[0]}
                    <br />
                    {m.title[1]}
                  </h3>

                  <p className="relative mt-5 text-[16px] md:text-[17px] leading-[1.45] tracking-[-0.01em]" style={{ color: m.soft }}>
                    {m.desc}
                  </p>

                  <ul className="relative mt-7 flex flex-col gap-3">
                    {m.points.map((pt, k) => (
                      <li
                        key={pt}
                        className={`mc-item ${gridIn ? 'mc-in' : ''} flex items-center gap-3 text-[14px] md:text-[15px] font-medium`}
                        style={{ animationDelay: `${500 + i * 140 + k * 120}ms` }}
                      >
                        <span
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                          style={{ background: m.tick === '#FFFFFF' ? 'rgba(255,255,255,0.22)' : `${m.tick}1f`, color: m.tick }}
                        >
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12.5l4.5 4.5L19 7.5" />
                          </svg>
                        </span>
                        {pt}
                      </li>
                    ))}
                  </ul>

                  {/* animated graphic */}
                  <div className="relative mt-auto flex justify-center pt-10 pb-8">
                    {m.graphic === 'calendar' && <CalendarGraphic />}
                    {m.graphic === 'clock' && <ClockGraphic />}
                    {m.graphic === 'doc' && <DocGraphic />}
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// ==========================================
// ANIMATED GRAPHICS
// ==========================================

// Sprint calendar: cells light up one after another, like sprint days ticking by
const CalendarGraphic = () => (
  <div className="mc-bob relative w-52 rounded-3xl bg-white shadow-[0_24px_40px_-18px_rgba(7,84,139,0.45)] overflow-hidden">
    <div className="flex h-9 items-center justify-between bg-[#238ED1] px-4">
      <div className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/90" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/60" />
      </div>
      <span className="text-[11px] font-semibold tracking-wide text-white">SPRINT</span>
    </div>
    <div className="grid grid-cols-5 gap-2 p-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <span key={i} className="mc-cell h-6 rounded-md bg-[#D6E7FB]" style={{ animationDelay: `${i * 0.4}s` }} />
      ))}
    </div>
    <div className="mx-4 mb-4 h-1.5 overflow-hidden rounded-full bg-[#E8F1FC]">
      <span className="mc-progress block h-full rounded-full bg-[#238ED1]" />
    </div>
  </div>
);

// Clock with turning hands + floating money
const ClockGraphic = () => (
  <div className="relative h-44 w-60">
    {/* back bill */}
    <div className="mc-bill-2 absolute right-2 bottom-12 flex h-14 w-24 items-center justify-center rounded-lg border-2 border-white/50 bg-gradient-to-br from-emerald-300 to-emerald-500 shadow-lg">
      <span className="text-lg font-bold text-white">$</span>
    </div>
    {/* clock */}
    <div className="mc-bob absolute bottom-0 left-4 z-10 h-36 w-36 rounded-full border-[6px] border-white/70 bg-white shadow-[0_24px_40px_-16px_rgba(4,34,58,0.55)]">
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} className="absolute left-1/2 top-1/2 h-[calc(50%-6px)] w-[2px] origin-top" style={{ transform: `rotate(${i * 30}deg)` }}>
          <span className={`absolute bottom-0 left-0 w-full rounded-full ${i % 3 === 0 ? 'h-3 bg-slate-400' : 'h-1.5 bg-slate-300'}`} />
        </span>
      ))}
      <span className="mc-hand-h absolute bottom-1/2 left-[calc(50%-3px)] h-8 w-1.5 origin-bottom rounded-full bg-slate-800" />
      <span className="mc-hand-m absolute bottom-1/2 left-[calc(50%-2px)] h-11 w-1 origin-bottom rounded-full bg-[#238ED1]" />
      <span className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-800" />
    </div>
    {/* front bill */}
    <div className="mc-bill absolute bottom-3 right-0 z-20 flex h-16 w-28 items-center justify-center rounded-lg border-2 border-white/60 bg-gradient-to-br from-green-400 to-green-600 shadow-xl">
      <span className="text-2xl font-bold text-white">$</span>
    </div>
  </div>
);

// Report sheet: lines write themselves, $ bounces, shield badge pulses
const DocGraphic = () => (
  <div className="relative">
    <div className="mc-bob relative flex h-44 w-36 flex-col rounded-xl bg-white p-4 shadow-[0_24px_40px_-16px_rgba(120,40,0,0.45)]">
      <div className="absolute right-0 top-0 h-7 w-7 rounded-bl-xl border-b border-l border-gray-200 bg-gray-100" />
      <div className="mc-dollar mb-3 mt-1 text-2xl font-bold text-green-500">$</div>
      {['100%', '100%', '66%', '100%', '80%'].map((w, i) => (
        <span key={i} className="mc-line mb-2 block h-1.5 rounded bg-gray-200" style={{ width: w, animationDelay: `${i * 0.25}s` }} />
      ))}
      <div
        className="absolute bottom-0 left-0 right-0 h-3 bg-[#FF7A1A]"
        style={{ clipPath: 'polygon(0 100%, 10% 0, 20% 100%, 30% 0, 40% 100%, 50% 0, 60% 100%, 70% 0, 80% 100%, 90% 0, 100% 100%)' }}
      />
    </div>
    {/* shield badge */}
    <div className="absolute -bottom-3 -right-5 flex h-14 w-14 items-center justify-center">
      <span className="mc-ring absolute inset-0 rounded-full bg-emerald-400/50" />
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
          <path d="M8.8 12l2.2 2.2 4.2-4.4" className="mc-tick" />
        </svg>
      </span>
    </div>
  </div>
);

// ==========================================
// STYLES
// ==========================================

const STYLES = `
  @keyframes mc-bob      { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  @keyframes mc-drift    { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-24px,18px); } }
  @keyframes mc-cell     { 0% { background: #238ED1; transform: scale(1.12); } 10% { background: #D6E7FB; transform: scale(1); } 100% { background: #D6E7FB; transform: scale(1); } }
  @keyframes mc-progress { 0% { width: 0%; } 90% { width: 100%; } 100% { width: 100%; } }
  @keyframes mc-spin     { to { transform: rotate(360deg); } }
  @keyframes mc-bill     { 0%,100% { transform: rotate(-12deg) translateY(0); } 50% { transform: rotate(-5deg) translateY(-10px); } }
  @keyframes mc-bill-2   { 0%,100% { transform: rotate(10deg) translateY(0); } 50% { transform: rotate(16deg) translateY(-6px); } }
  @keyframes mc-line     { 0% { transform: scaleX(0); opacity: 1; } 18% { transform: scaleX(1); } 85% { transform: scaleX(1); opacity: 1; } 100% { transform: scaleX(1); opacity: 0; } }
  @keyframes mc-dollar   { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-4px) scale(1.15); } }
  @keyframes mc-ring     { 0% { transform: scale(1); opacity: .8; } 100% { transform: scale(1.6); opacity: 0; } }
  @keyframes mc-tick     { 0%,15% { stroke-dashoffset: 12; } 35%,100% { stroke-dashoffset: 0; } }
  @keyframes mc-pop      { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: none; } }

  /* panels: resting tilt + scroll-driven rocking (vars set from JS) */
  .mc-root .mc-card {
    transform: perspective(1400px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) rotate(var(--rz, 0deg)) translateY(var(--ty, 0px));
    transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .4s ease;
    box-shadow: 0 30px 60px -40px rgba(11,27,58,.45);
    will-change: transform;
  }
  .mc-root .mc-card:hover {
    transform: perspective(1400px) rotate(0deg) translateY(-14px) scale(1.01) !important;
    box-shadow: 0 40px 80px -40px rgba(11,27,58,.55);
  }

  /* entrance */
  .mc-root .mc-reveal { opacity: 0; transform: translateY(30px); transition: opacity .9s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1); }
  .mc-root .mc-rise   { opacity: 0; transform: translateY(90px); transition: opacity 1s cubic-bezier(.22,1,.36,1), transform 1s cubic-bezier(.22,1,.36,1); }
  .mc-root .mc-reveal.mc-in, .mc-root .mc-rise.mc-in { opacity: 1; transform: none; }
  .mc-root .mc-item { opacity: 0; }
  .mc-root .mc-item.mc-in { animation: mc-pop .6s cubic-bezier(.22,1,.36,1) both; }

  /* graphics */
  .mc-root .mc-bob      { animation: mc-bob 4s ease-in-out infinite; }
  .mc-root .mc-drift    { animation: mc-drift 14s ease-in-out infinite; }
  .mc-root .mc-cell     { animation: mc-cell 4s ease-out infinite; }
  .mc-root .mc-progress { animation: mc-progress 4s linear infinite; }
  .mc-root .mc-hand-h   { animation: mc-spin 24s linear infinite; }
  .mc-root .mc-hand-m   { animation: mc-spin 4s linear infinite; }
  .mc-root .mc-bill     { animation: mc-bill 3.4s ease-in-out infinite; }
  .mc-root .mc-bill-2   { animation: mc-bill-2 4.2s ease-in-out infinite; }
  .mc-root .mc-line     { transform-origin: left center; animation: mc-line 3.5s ease-out infinite; }
  .mc-root .mc-dollar   { animation: mc-dollar 2s ease-in-out infinite; }
  .mc-root .mc-ring     { animation: mc-ring 2.4s ease-out infinite; }
  .mc-root .mc-tick     { stroke-dasharray: 12; animation: mc-tick 3.5s ease-out infinite; }

  @media (prefers-reduced-motion: reduce) {
    .mc-root *, .mc-root *::before, .mc-root *::after { animation: none !important; transition: none !important; }
    .mc-root .mc-reveal, .mc-root .mc-rise, .mc-root .mc-item { opacity: 1 !important; transform: none !important; }
  }
`;

export default CoreMethodologies;