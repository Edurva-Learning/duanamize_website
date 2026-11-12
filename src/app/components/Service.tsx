'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/* =====================================================================
   Services page — STACKING CARDS
   - Each service is a big card that sticks near the top of the screen;
     the next card slides up over it, and the cards underneath shrink
     a little and dim — so they build a neat stack as you scroll
   - Every card has its own accent colour, an animated icon, a big faded
     number, and its content fades in when it arrives
   - Intro + closing "Ready to Transform Your Business?" card
   - Works in light + dark mode
   NOTE: every className is on one line (avoids the Windows \r\n hydration error)
===================================================================== */

type Service = {
  name: string;
  price: string;
  text: string;
  capabilities: string[];
  tech: string[];
  icon: 'brain' | 'database' | 'blocks' | 'gear' | 'trend' | 'cpu';
  from: string;
  to: string;
};

const SERVICES: Service[] = [
  {
    name: 'AI & Machine Learning',
    price: 'From $15K/month',
    text: 'Complete AI lifecycle management from data curation to model deployment and scaling.',
    capabilities: ['Data set gathering & curation', 'AI model training & optimization', 'Backend operations & infrastructure', 'MLOps & automated pipelines'],
    tech: ['TensorFlow', 'PyTorch', 'Kubernetes', 'AWS SageMaker'],
    icon: 'brain',
    from: '#3B82F6',
    to: '#06B6D4',
  },
  {
    name: 'Data Engineering & Analytics',
    price: 'From $12K/month',
    text: 'Large-scale data management pipelines and advanced analytics for business intelligence.',
    capabilities: ['Big data processing pipelines', 'Real-time data streaming', 'Data warehousing & lakes', 'Business intelligence dashboards'],
    tech: ['Apache Spark', 'Snowflake', 'Databricks', 'Power BI'],
    icon: 'database',
    from: '#6366F1',
    to: '#3B82F6',
  },
  {
    name: 'Blockchain & Web3',
    price: 'From $18K/month',
    text: 'End-to-end blockchain solutions including smart contracts, DeFi, and NFT platforms.',
    capabilities: ['Smart contract development', 'DeFi protocol design', 'NFT marketplace creation', 'Tokenomics & governance'],
    tech: ['Ethereum', 'Solidity', 'Web3.js', 'IPFS'],
    icon: 'blocks',
    from: '#A855F7',
    to: '#EC4899',
  },
  {
    name: 'Industry 4.0 Solutions',
    price: 'From $20K/month',
    text: 'IoT integration, digital twins, and smart manufacturing solutions for modern industries.',
    capabilities: ['IoT device integration', 'Digital twin modeling', 'Predictive maintenance', 'Smart factory automation'],
    tech: ['Azure IoT', 'Docker', 'Edge Computing', 'MQTT'],
    icon: 'gear',
    from: '#10B981',
    to: '#22C55E',
  },
  {
    name: 'Lean Six Sigma',
    price: 'From $8K/month',
    text: 'Process optimization and waste elimination strategies to streamline operations.',
    capabilities: ['Process mapping & analysis', 'Waste identification & elimination', 'Cost reduction strategies', 'Performance optimization'],
    tech: ['Minitab', 'Tableau', 'Process Mining', 'RPA'],
    icon: 'trend',
    from: '#F59E0B',
    to: '#F97316',
  },
  {
    name: 'Technology Consulting',
    price: 'From $10K/month',
    text: 'Strategic technology roadmaps and scalable architectures for millions of users.',
    capabilities: ['Technology architecture design', 'Scalability planning', 'Security implementation', 'Performance optimization'],
    // ✏️ add the remaining technologies for this service here
    tech: ['Microservices', 'Cloud Native'],
    icon: 'cpu',
    from: '#0EA5E9',
    to: '#238ED1',
  },
];

const STACK_TOP = 96; // px from the top where the first card sticks (below the header)
const STACK_STEP = 22; // each next card sticks this much lower, so the edges peek out

/* ------------------------------ helpers ------------------------------ */

const clamp = (v: number) => Math.min(1, Math.max(0, v));

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

const Reveal = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  return (
    <div ref={ref} className={`sv-reveal ${inView ? 'sv-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

/* -------------------------------- page ------------------------------- */

const ServicesPage = () => {
  const wrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const shadeRefs = useRef<(HTMLDivElement | null)[]>([]);

  // shrink + dim the cards that are being covered by later cards
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const n = SERVICES.length;

      for (let i = 0; i < n; i++) {
        let covered = 0;
        for (let j = i + 1; j < n; j++) {
          const wrap = wrapRefs.current[j];
          if (!wrap) continue;
          const top = wrap.getBoundingClientRect().top;
          const stick = STACK_TOP + j * STACK_STEP;
          covered += clamp((vh - top) / Math.max(1, vh - stick)); // 0 → 1 as card j slides into place
        }
        const card = cardRefs.current[i];
        const shade = shadeRefs.current[i];
        const c = reduce ? 0 : Math.min(covered, 4);
        if (card) card.style.transform = `scale(${1 - c * 0.04})`;
        if (shade) shade.style.opacity = String(Math.min(c, 3) * 0.12);
      }
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
    <main className="sv-root bg-[#F8FAFC] dark:bg-[#0B1220]">
      <style>{STYLES}</style>

      {/* ============================ INTRO ============================ */}
      <section className="relative overflow-hidden px-6 pb-12 pt-20 text-center md:px-12 md:pb-16 md:pt-24">
        <div aria-hidden className="sv-drift pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#238ED1]/15 blur-3xl" />
        <div aria-hidden className="sv-drift pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#A855F7]/10 blur-3xl" style={{ animationDelay: '-7s' }} />
        <div className="relative mx-auto max-w-[1000px]">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#238ED1]/10 px-5 py-2 text-[14px] font-semibold text-[#238ED1]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#238ED1]" />
              Our Core Services
            </span>
          </Reveal>
          <h1 className="mt-6 text-[34px] font-bold leading-[1.1] tracking-[-0.03em] text-[#0f172a] md:text-[54px] dark:text-white">
            <span className="block overflow-hidden"><span className="sv-word inline-block">Enterprise-Grade</span></span>
            <span className="block overflow-hidden"><span className="sv-word inline-block text-[#238ED1]" style={{ animationDelay: '120ms' }}>Technology Solutions</span></span>
          </h1>
          <Reveal delay={300}>
            <p className="mx-auto mt-6 max-w-[760px] text-[16px] leading-[1.7] text-slate-600 md:text-[18px] dark:text-slate-400">
              From AI and blockchain to process optimization, we deliver comprehensive technology solutions that scale with your business and drive measurable results.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===================== SERVICES (stacking cards) ===================== */}
      <section id="services" className="px-4 pb-16 md:px-12 md:pb-24">
        <div className="mx-auto max-w-[1200px]">
          {SERVICES.map((s, i) => (
            <div
              key={s.name}
              ref={(el) => {
                wrapRefs.current[i] = el;
              }}
              className="sticky pb-8 md:pb-10"
              style={{ top: `${STACK_TOP + i * STACK_STEP}px` }}
            >
              <ServiceCard
                s={s}
                index={i}
                cardRef={(el) => {
                  cardRefs.current[i] = el;
                }}
                shadeRef={(el) => {
                  shadeRefs.current[i] = el;
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ============================ CTA ============================ */}
      <section className="px-6 pb-24 md:px-12">
        <Reveal className="mx-auto max-w-[1200px]">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-[#F2F8FD] px-8 py-14 text-center shadow-[0_30px_70px_-45px_rgba(7,84,139,0.45)] md:px-16 md:py-16 dark:border-white/10 dark:from-[#111A2E] dark:to-[#0B1220]">
            <div aria-hidden className="sv-drift pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#238ED1]/10 blur-3xl" />
            <h2 className="relative text-[28px] font-bold leading-tight tracking-[-0.02em] text-[#0f172a] md:text-[36px] dark:text-white">Ready to Transform Your Business?</h2>
            <p className="relative mx-auto mt-4 max-w-[640px] text-[16px] leading-[1.7] text-slate-600 md:text-[18px] dark:text-slate-400">
              Our expert consultants will analyze your requirements and design a custom solution that integrates seamlessly with your existing processes.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link href="/contact" className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-[#1d8fe1] to-[#166ba8] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_14px_30px_-14px_rgba(29,143,225,0.8)] transition-transform duration-300 hover:-translate-y-0.5">
                <span aria-hidden className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/25 transition-transform duration-700 group-hover:translate-x-[420%]" />
                <span className="relative">Schedule Consultation</span>
                <ArrowIcon className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              {/* ✏️ put your brochure PDF in /public and update this path */}
              <a href="/duanamize-service-brochure.pdf" download className="group inline-flex items-center gap-2.5 rounded-xl border border-[#238ED1] px-7 py-3.5 text-[15px] font-semibold text-[#238ED1] transition-colors duration-300 hover:bg-[#238ED1] hover:text-white">
                <DownloadIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                Download Service Brochure
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
};

/* ----------------------------- service card ----------------------------- */

const ServiceCard = ({
  s,
  index,
  cardRef,
  shadeRef,
}: {
  s: Service;
  index: number;
  cardRef: (el: HTMLElement | null) => void;
  shadeRef: (el: HTMLDivElement | null) => void;
}) => {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const num = String(index + 1).padStart(2, '0');
  const d = (ms: number) => ({ animationDelay: `${ms}ms` });

  return (
    <article ref={cardRef} className="group relative origin-top overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_70px_-40px_rgba(15,23,42,0.45)] transition-[box-shadow] duration-500 dark:border-white/10 dark:bg-[#111A2E]" style={{ willChange: 'transform' }}>
      {/* accent bar + glow */}
      <span aria-hidden className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundImage: `linear-gradient(90deg, ${s.from}, ${s.to})` }} />
      <span aria-hidden className="sv-drift pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-20 blur-3xl" style={{ background: s.from }} />
      {/* big faded number */}
      <span aria-hidden className="pointer-events-none absolute -bottom-8 right-4 select-none text-[160px] font-black leading-none tracking-tighter opacity-[0.06] md:text-[220px]" style={{ color: s.from }}>{num}</span>

      <div ref={ref} className={`relative grid gap-8 p-7 md:min-h-[440px] md:grid-cols-[1.05fr_1fr] md:gap-12 md:p-12 ${inView ? 'sv-in' : ''}`}>
        {/* left */}
        <div className="flex flex-col">
          <div className="sv-up flex items-center justify-between gap-4" style={d(0)}>
            <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg" style={{ backgroundImage: `linear-gradient(135deg, ${s.from}, ${s.to})`, boxShadow: `0 14px 30px -14px ${s.from}` }}>
              <span className="sv-ring absolute inset-0 rounded-2xl" style={{ background: s.from }} />
              <ServiceIcon name={s.icon} />
            </span>
            <span className="rounded-full px-3.5 py-1.5 text-[13px] font-semibold" style={{ background: `${s.from}1a`, color: s.from }}>{s.price}</span>
          </div>

          <p className="sv-up mt-7 text-[13px] font-semibold uppercase tracking-[0.18em] text-slate-400" style={d(80)}>Service {num}</p>
          <h2 className="sv-up mt-2 text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-[#0f172a] md:text-[38px] dark:text-white" style={d(140)}>{s.name}</h2>
          <p className="sv-up mt-4 max-w-[460px] text-[16px] leading-[1.7] text-slate-600 md:text-[17px] dark:text-slate-400" style={d(200)}>{s.text}</p>

          <Link href="/contact" className="sv-up mt-auto inline-flex w-fit items-center gap-3 pt-8 text-[15px] font-semibold" style={{ ...d(260), color: s.from }}>
            <span className="relative">
              Learn More
              <span className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" style={{ background: s.from }} />
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 group-hover:translate-x-1" style={{ borderColor: s.from }}>
              <ArrowIcon className="h-4 w-4" />
            </span>
          </Link>
        </div>

        {/* right */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 md:p-8 dark:border-white/10 dark:bg-white/5">
          <h3 className="sv-up flex items-center gap-2.5 text-[16px] font-semibold text-[#0f172a] dark:text-white" style={d(200)}>
            <TargetIcon className="h-5 w-5" style={{ color: s.from }} />
            Key Capabilities
          </h3>
          <ul className="mt-4 space-y-3">
            {s.capabilities.map((c, k) => (
              <li key={c} className="sv-side flex items-start gap-2.5 text-[15px] text-slate-700 dark:text-slate-300" style={d(260 + k * 80)}>
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                {c}
              </li>
            ))}
          </ul>

          <h3 className="sv-up mt-7 flex items-center gap-2.5 text-[16px] font-semibold text-[#0f172a] dark:text-white" style={d(560)}>
            <BoltIcon className="h-5 w-5" style={{ color: s.from }} />
            Technologies
          </h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {s.tech.map((t, k) => (
              <span key={t} className="sv-pop cursor-default rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[13px] font-medium text-slate-800 transition-all duration-300 hover:-translate-y-0.5 hover:text-white dark:border-white/15 dark:bg-white/5 dark:text-slate-200" style={{ ...d(620 + k * 70), ['--chip' as string]: s.from }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* dim layer used while the card is covered */}
      <div ref={shadeRef} aria-hidden className="pointer-events-none absolute inset-0 bg-[#0f172a] opacity-0" />
    </article>
  );
};

/* -------------------------------- icons ------------------------------- */

type IconProps = { className?: string; style?: React.CSSProperties };

const ServiceIcon = ({ name }: { name: Service['icon'] }) => {
  const p = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, className: 'relative h-7 w-7', 'aria-hidden': true };
  switch (name) {
    case 'brain':
      return (
        <svg {...p} className="sv-pulse relative h-7 w-7">
          <path d="M12 5a3 3 0 0 0-5.6-1.5A3 3 0 0 0 4 7.5a3 3 0 0 0-.5 5 3.5 3.5 0 0 0 3 5.5A3 3 0 0 0 12 19z" />
          <path d="M12 5a3 3 0 0 1 5.6-1.5A3 3 0 0 1 20 7.5a3 3 0 0 1 .5 5 3.5 3.5 0 0 1-3 5.5A3 3 0 0 1 12 19z" />
          <path d="M12 5v14" />
        </svg>
      );
    case 'database':
      return (
        <svg {...p}>
          <ellipse cx="12" cy="5" rx="8" ry="3" />
          <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
          <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" className="sv-blink" />
        </svg>
      );
    case 'blocks':
      return (
        <svg {...p}>
          <rect x="3" y="11" width="10" height="10" rx="1.5" />
          <path d="M3 16h10M8 11v10" />
          <rect x="15" y="3" width="6" height="6" rx="1.5" className="sv-hop" />
        </svg>
      );
    case 'gear':
      return (
        <svg {...p} className="sv-spin relative h-7 w-7">
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 2v3M12 19v3M4.9 4.9L7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1" />
        </svg>
      );
    case 'trend':
      return (
        <svg {...p}>
          <path d="M3 17l6-6 4 4 8-8" className="sv-trend" />
          <path d="M15 7h6v6" />
        </svg>
      );
    default:
      return (
        <svg {...p}>
          <rect x="6" y="6" width="12" height="12" rx="2" />
          <rect x="9.5" y="9.5" width="5" height="5" rx="1" className="sv-blink" />
          <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
        </svg>
      );
  }
};

const TargetIcon = ({ className, style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" />
  </svg>
);

const BoltIcon = ({ className, style }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden>
    <path d="M13 2L4 14h7l-1 8 9-12h-7z" />
  </svg>
);

const CheckCircle = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.2l2.4 2.4 4.6-4.8" />
  </svg>
);

const ArrowIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const DownloadIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M12 3v12M7 10l5 5 5-5M4 20h16" />
  </svg>
);

/* -------------------------------- styles ------------------------------ */

const STYLES = `
  @keyframes sv-word  { from { transform: translateY(105%); opacity: 0; } to { transform: none; opacity: 1; } }
  @keyframes sv-drift { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-24px,18px); } }
  @keyframes sv-up    { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
  @keyframes sv-side  { from { opacity: 0; transform: translateX(-14px); } to { opacity: 1; transform: none; } }
  @keyframes sv-pop   { 0% { opacity: 0; transform: scale(.7); } 70% { opacity: 1; transform: scale(1.06); } 100% { opacity: 1; transform: scale(1); } }
  @keyframes sv-ring  { 0% { transform: scale(1); opacity: .45; } 100% { transform: scale(1.5); opacity: 0; } }
  @keyframes sv-spin  { to { transform: rotate(360deg); } }
  @keyframes sv-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
  @keyframes sv-blink { 0%,100% { opacity: 1; } 50% { opacity: .35; } }
  @keyframes sv-hop   { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
  @keyframes sv-trend { 0% { stroke-dashoffset: 24; } 60%,100% { stroke-dashoffset: 0; } }

  .sv-root .sv-word  { animation: sv-word .9s cubic-bezier(.22,1,.36,1) both; }
  .sv-root .sv-drift { animation: sv-drift 14s ease-in-out infinite; }
  .sv-root .sv-ring  { animation: sv-ring 2.6s ease-out infinite; }
  .sv-root .sv-spin  { animation: sv-spin 9s linear infinite; }
  .sv-root .sv-pulse { animation: sv-pulse 2.4s ease-in-out infinite; }
  .sv-root .sv-blink { animation: sv-blink 2s ease-in-out infinite; }
  .sv-root .sv-hop   { animation: sv-hop 1.8s ease-in-out infinite; }
  .sv-root .sv-trend { stroke-dasharray: 24; animation: sv-trend 2.6s ease-out infinite; }

  /* simple reveal */
  .sv-root .sv-reveal { opacity: 0; transform: translateY(24px); transition: opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1); }
  .sv-root .sv-reveal.sv-in { opacity: 1; transform: none; }

  /* card contents appear when the card arrives */
  .sv-root .sv-up, .sv-root .sv-side, .sv-root .sv-pop { opacity: 0; }
  .sv-root .sv-in .sv-up   { animation: sv-up .7s cubic-bezier(.22,1,.36,1) both; }
  .sv-root .sv-in .sv-side { animation: sv-side .6s cubic-bezier(.22,1,.36,1) both; }
  .sv-root .sv-in .sv-pop  { animation: sv-pop .5s cubic-bezier(.34,1.56,.64,1) both; }
  .sv-root .sv-pop:hover   { background: var(--chip); border-color: var(--chip); }

  @media (prefers-reduced-motion: reduce) {
    .sv-root *, .sv-root *::before, .sv-root *::after { animation: none !important; transition: none !important; }
    .sv-root .sv-reveal, .sv-root .sv-up, .sv-root .sv-side, .sv-root .sv-pop { opacity: 1 !important; transform: none !important; }
  }
`;

export default ServicesPage;