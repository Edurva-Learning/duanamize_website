'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HERO_ILLUSTRATION = '/images/a3.png';
const CTA_MEDIA = '/images/aboutus.png'; // image inside the sliding window (swap for any photo)
const CTA_BG = '#FCC21B'; // 300FeetOut yellow — use '#238ED1' for brand blue

/* ------------------------------ content ------------------------------ */

const HERO_BADGES = ['Proven Methodologies', 'Measurable ROI', 'Industry Leadership'];

const STATS = [
  { icon: 'award', value: '75+', label: 'Total Projects Delivered' },
  { icon: 'trend', value: '420%', label: 'Average ROI Delivered' },
  { icon: 'users', value: '98.7%', label: 'Client Satisfaction Rate' },
  { icon: 'target', value: '5+', label: 'Industries Served' },
];

type CaseStudy = {
  tag: string;
  title: string;
  icon: string;
  from: string;
  to: string;
  roi: string;
  duration: string;
  techCount: string;
  challenge: string;
  solution: string;
  results: string[];
  tech: string[];
};

const CASES: CaseStudy[] = [
  {
    tag: 'Healthcare',
    title: 'Global Healthcare Network Transformation',
    icon: 'brain',
    from: '#3B82F6',
    to: '#06B6D4',
    roi: '340%',
    duration: '8 months',
    techCount: '4',
    challenge: 'Fragmented patient data across 50+ facilities causing treatment delays and increased costs',
    solution: 'Implemented AI-driven patient data unification with real-time analytics and predictive care models',
    results: ['78% reduction in patient readmission rates', '45% decrease in average treatment time', '$12M annual cost savings', '99.9% data accuracy across all facilities'],
    tech: ['AI/ML', 'Data Engineering', 'IoT', 'Lean Six Sigma'],
  },
  {
    tag: 'Financial Technology',
    title: 'FinTech Trading Platform Scale-Up',
    icon: 'blocks',
    from: '#A855F7',
    to: '#EC4899',
    roi: '520%',
    duration: '6 months',
    techCount: '4',
    challenge: "Platform couldn't handle rapid user growth, facing daily outages during peak trading hours",
    solution: 'Rebuilt architecture using microservices, implemented blockchain-based settlement layer, and deployed ML-driven fraud detection',
    results: ['10x increase in transaction throughput', '99.99% uptime during peak periods', '85% reduction in fraudulent transactions', '2.5M+ concurrent users supported'],
    tech: ['Blockchain', 'AI/ML', 'Microservices', 'Data Analytics'],
  },
  {
    tag: 'Automotive',
    title: 'Smart Manufacturing Revolution',
    icon: 'gear',
    from: '#22C55E',
    to: '#10B981',
    roi: '280%',
    duration: '12 months',
    techCount: '4',
    challenge: 'Inefficient production lines with 23% waste rate and unpredictable maintenance downtime',
    solution: 'Deployed Industry 4.0 IoT sensors, digital twins for predictive maintenance, and Lean Six Sigma process optimization',
    results: ['89% reduction in unplanned downtime', '67% decrease in material waste', '$45M annual operational savings', '35% improvement in overall equipment effectiveness'],
    tech: ['Industry 4.0', 'IoT', 'Digital Twins', 'Lean Six Sigma'],
  },
  {
    tag: 'Logistics & Supply Chain',
    title: 'Supply Chain Intelligence Platform',
    icon: 'database',
    from: '#F97316',
    to: '#EF4444',
    roi: '450%',
    duration: '10 months',
    techCount: '4',
    challenge: 'Poor visibility across multi-modal logistics network causing delays and inventory inefficiencies',
    solution: 'Built real-time supply chain visibility platform with predictive analytics and automated optimization algorithms',
    results: ['92% improvement in on-time deliveries', '38% reduction in inventory holding costs', '$28M savings in logistics optimization', 'Real-time tracking across 150+ countries'],
    tech: ['Data Engineering', 'AI/ML', 'IoT', 'Process Optimization'],
  },
  {
    tag: 'Education Technology',
    title: 'EdTech Learning Transformation',
    icon: 'globe',
    from: '#6366F1',
    to: '#3B82F6',
    roi: '385%',
    duration: '9 months',
    techCount: '4',
    challenge: 'Declining student engagement and outdated learning management systems across 25 universities',
    solution: 'Developed AI-powered personalized learning platform with adaptive content delivery and blockchain-verified credentials',
    results: ['156% increase in student engagement', '74% improvement in learning outcomes', 'Served 500K+ students globally', '42% reduction in administrative overhead'],
    tech: ['AI/ML', 'Blockchain', 'Data Analytics', 'Process Design'],
  },
  {
    tag: 'Gaming & Entertainment',
    title: 'Gaming Platform Optimization',
    icon: 'zap',
    from: '#EAB308',
    to: '#F97316',
    roi: '600%',
    duration: '7 months',
    techCount: '4',
    challenge: 'High latency, poor user experience, and scalability issues affecting 10M+ daily active users',
    solution: 'Implemented edge computing architecture, real-time analytics, and AI-driven personalization engine',
    results: ['83% reduction in average latency', '245% increase in user retention', '$18M revenue increase from improved UX', '99.95% platform availability'],
    tech: ['Edge Computing', 'AI/ML', 'Real-time Analytics', 'Architecture Design'],
  },
];

/* ------------------------------ helpers ------------------------------ */

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

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
    <div ref={ref} className={`ss-reveal ${inView ? 'ss-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

const CountUp = ({ value, start }: { value: string; start: boolean }) => {
  const match = value.match(/^(\D*?)(\d[\d,]*\.?\d*)(.*)$/);
  const [shown, setShown] = useState(match ? `${match[1]}0${match[3]}` : value);

  useEffect(() => {
    if (!start || !match) return;
    const [, prefix, num, suffix] = match;
    const target = parseFloat(num.replace(/,/g, ''));
    const decimals = num.includes('.') ? num.split('.')[1].length : 0;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t0 = performance.now();
    const dur = reduce ? 0 : 1500;
    let raf = 0;
    const tick = (now: number) => {
      const t = dur ? Math.min(1, (now - t0) / dur) : 1;
      const e = 1 - Math.pow(1 - t, 3);
      const n = target * e;
      setShown(`${prefix}${decimals ? n.toFixed(decimals) : Math.round(n)}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, value]);

  return <>{shown}</>;
};

// letters rise in one by one (Nacreous-style headline)
const Letters = ({ text, start, className = '' }: { text: string; start: number; className?: string }) => (
  <span className={className}>
    {text.split(' ').map((word, w, words) => {
      const before = words.slice(0, w).join(' ').length + (w ? 1 : 0);
      return (
        <span key={w} className="inline-block whitespace-nowrap">
          {word.split('').map((ch, c) => (
            <span key={c} className="inline-block overflow-hidden align-bottom">
              <span className="ss-letter inline-block" style={{ animationDelay: `${start + (before + c) * 28}ms` }}>
                {ch}
              </span>
            </span>
          ))}
          {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      );
    })}
  </span>
);

/* -------------------------------- page ------------------------------- */

const SuccessStoriesPage = () => (
  <main className="ss-root bg-[#FCFBF8] dark:bg-[#0B1220]">
    <style>{STYLES}</style>
    <Hero />
    <Stats />
    <CaseStudies />
    <CtaReveal />
  </main>
);

/* ------------------------------- hero -------------------------------- */

const Hero = () => (
  <section className="relative overflow-hidden px-6 pb-16 pt-16 md:px-12 md:pb-24 md:pt-24">
    {/* soft drifting glows */}
    <div aria-hidden className="ss-drift pointer-events-none absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-[#F9C9E0]/50 blur-[110px] dark:bg-[#EC4899]/15" />
    <div aria-hidden className="ss-drift pointer-events-none absolute -right-32 top-24 h-[480px] w-[480px] rounded-full bg-[#9FD3F5]/60 blur-[110px] dark:bg-[#238ED1]/20" style={{ animationDelay: '-8s' }} />

    <div className="relative mx-auto grid max-w-[1280px] items-center gap-12 md:grid-cols-2">
      {/* text */}
      <div>
        <p className="ss-fade text-[15px] font-medium text-[#0f172a] dark:text-slate-200">— Success Stories</p>
        <h1 className="mt-5 text-[40px] font-medium leading-[1.08] tracking-[-0.02em] text-[#0f172a] md:text-[58px] dark:text-white">
          <Letters text="Real Transformations," start={150} />
          <br />
          <Letters text="Measurable" start={750} /> <Letters text="Results" start={1060} className="font-serif italic text-[#1D63D8] dark:text-[#6CC4F5]" />
          <span className="ss-letter-dot inline-block">.</span>
        </h1>
        <p className="ss-fade mt-6 max-w-[540px] text-[16px] leading-[1.7] text-slate-600 md:text-[18px] dark:text-slate-400" style={{ animationDelay: '1300ms' }}>
          Discover how we&apos;ve helped industry leaders achieve breakthrough business outcomes through our holistic technology and management solutions.
        </p>
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
          {HERO_BADGES.map((b, i) => (
            <span key={b} className="ss-fade flex items-center gap-2 text-[14px] font-medium text-slate-700 dark:text-slate-300" style={{ animationDelay: `${1450 + i * 120}ms` }}>
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              {b}
            </span>
          ))}
        </div>
        <Link href="/contact" className="ss-fade group mt-9 inline-flex items-center gap-3 bg-[#1D63D8] px-7 py-4 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-[#0f172a] dark:hover:bg-white dark:hover:text-[#0f172a]" style={{ animationDelay: '1800ms' }}>
          Schedule Free Consultation
          <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* illustration */}
      <div className="ss-pop-in relative mx-auto w-full max-w-[560px]" style={{ animationDelay: '400ms' }}>
        <div className="ss-float relative aspect-[803/648] w-full">
          <Image src={HERO_ILLUSTRATION} alt="Team member carrying a growth chart" fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-contain" />
        </div>
      </div>
    </div>
  </section>
);

/* ------------------------------- stats ------------------------------- */

const Stats = () => {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  return (
    <section className="px-6 pb-20 md:px-12">
      <div ref={ref} className="mx-auto grid max-w-[1280px] gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 110}>
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-28px_rgba(35,142,209,0.55)] dark:border-white/10 dark:bg-[#111A2E]">
              <span className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-[#07548B] via-[#238ED1] to-[#22B5E8] transition-transform duration-500 group-hover:scale-x-100" />
              <div className="relative mx-auto flex h-14 w-14 items-center justify-center">
                <span className="ss-ring absolute inset-0 rounded-full bg-[#238ED1]/15" style={{ animationDelay: `${i * 0.4}s` }} />
                <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF4FD] text-[#238ED1] transition-transform duration-500 group-hover:rotate-[10deg] group-hover:scale-110 dark:bg-[#238ED1]/15">
                  <Icon name={s.icon} className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4 text-[34px] font-bold tracking-tight text-[#1D63D8] dark:text-[#6CC4F5]">
                <CountUp value={s.value} start={inView} />
              </div>
              <div className="mt-1 text-[15px] text-slate-600 dark:text-slate-400">{s.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

/* ---------------------------- case studies --------------------------- */

const CaseStudies = () => (
  <section className="px-6 pb-24 md:px-12 md:pb-32">
    <div className="mx-auto max-w-[1280px]">
      <Reveal className="mx-auto max-w-[900px] text-center">
        <h2 className="text-[30px] font-bold tracking-[-0.02em] text-[#1D63D8] md:text-[46px] dark:text-[#6CC4F5]">Transformations That Deliver Results</h2>
        <p className="mx-auto mt-4 max-w-[780px] text-[15px] leading-[1.7] text-slate-600 md:text-[18px] dark:text-slate-400">
          Each project represents a unique challenge solved through our proven methodology combining technology excellence with strategic business transformation.
        </p>
      </Reveal>

      <div className="mt-14 space-y-8 md:space-y-10">
        {CASES.map((c, i) => (
          <CaseRow key={c.title} c={c} reverse={i % 2 === 1} />
        ))}
      </div>
    </div>
  </section>
);

const CaseRow = ({ c, reverse }: { c: CaseStudy; reverse: boolean }) => {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const d = (ms: number) => ({ animationDelay: `${ms}ms` });

  return (
    <div ref={ref} className={`group grid overflow-hidden rounded-3xl md:grid-cols-2 ${inView ? 'ss-in' : ''}`}>
      {/* coloured panel — wipes open from its outer edge */}
      <div className={`relative flex min-h-[340px] flex-col justify-center overflow-hidden px-8 py-12 text-white md:px-12 ${reverse ? 'ss-wipe-r md:order-2' : 'ss-wipe-l'}`} style={{ backgroundImage: `linear-gradient(135deg, ${c.from}, ${c.to})` }}>
        <span aria-hidden className="ss-drift absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/15 blur-2xl" />
        <span aria-hidden className="ss-drift absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-black/10 blur-3xl" style={{ animationDelay: '-6s' }} />
        <span aria-hidden className="ss-sheen pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/15" />

        <div className="relative">
          <div className="ss-up flex items-center gap-3" style={d(350)}>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
              <Icon name={c.icon} className="h-6 w-6" />
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1 text-[12px] font-semibold">{c.tag}</span>
          </div>
          <h3 className="ss-up mt-6 max-w-[460px] text-[26px] font-bold leading-snug md:text-[32px]" style={d(450)}>{c.title}</h3>
          <div className="ss-up mt-8 grid max-w-[460px] grid-cols-3 gap-4" style={d(550)}>
            {[
              { v: c.roi, l: 'ROI' },
              { v: c.duration, l: 'Duration' },
              { v: c.techCount, l: 'Technologies' },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-[24px] font-bold md:text-[28px]">
                  <CountUp value={s.v} start={inView} />
                </div>
                <div className="text-[13px] text-white/85">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* details */}
      <div className={`border border-slate-200 bg-white px-8 py-10 md:px-12 md:py-12 dark:border-white/10 dark:bg-[#111A2E] ${reverse ? 'rounded-b-3xl md:order-1 md:rounded-l-3xl md:rounded-br-none md:border-r-0' : 'rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none md:border-l-0'}`}>
        <Block title="Challenge" icon="target" delay={500}>{c.challenge}</Block>
        <Block title="Our Solution" icon="bolt" delay={600}>{c.solution}</Block>

        <div className="ss-up" style={d(700)}>
          <h4 className="mb-3 flex items-center gap-2.5 text-[17px] font-semibold text-[#1D63D8] dark:text-[#6CC4F5]">
            <Icon name="trend" className="h-5 w-5" />
            Key Results
          </h4>
        </div>
        <ul className="space-y-2.5">
          {c.results.map((r, k) => (
            <li key={r} className="ss-side flex items-start gap-2.5 text-[15px] text-slate-600 dark:text-slate-300" style={d(780 + k * 90)}>
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
              {r}
            </li>
          ))}
        </ul>

        <div className="ss-up mt-7" style={d(1150)}>
          <h4 className="text-[17px] font-semibold text-[#1D63D8] dark:text-[#6CC4F5]">Technologies Used</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {c.tech.map((t) => (
              <span key={t} className="rounded-full border border-slate-200 px-3.5 py-1 text-[13px] font-medium text-slate-800 transition-colors duration-300 hover:border-transparent hover:text-white dark:border-white/15 dark:text-slate-200" style={{ ['--chip' as string]: c.from }} onMouseEnter={(e) => (e.currentTarget.style.background = c.from)} onMouseLeave={(e) => (e.currentTarget.style.background = '')}>
                {t}
              </span>
            ))}
          </div>
        </div>

        <Link href="/contact" className="ss-up group/link mt-8 inline-flex items-center gap-2 border-b pb-1 text-[15px] font-medium transition-colors duration-300" style={{ ...d(1250), color: c.from, borderColor: c.from }}>
          View Detailed Case Study
          <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1.5" />
        </Link>
      </div>
    </div>
  );
};

const Block = ({ title, icon, delay, children }: { title: string; icon: string; delay: number; children: React.ReactNode }) => (
  <div className="ss-up mb-6" style={{ animationDelay: `${delay}ms` }}>
    <h4 className="mb-2 flex items-center gap-2.5 text-[17px] font-semibold text-[#1D63D8] dark:text-[#6CC4F5]">
      <Icon name={icon} className="h-5 w-5" />
      {title}
    </h4>
    <p className="text-[15px] leading-[1.7] text-slate-600 dark:text-slate-400">{children}</p>
  </div>
);

/* ------------------------- CTA (300FeetOut style) -------------------- */

const CtaReveal = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const winRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;

    const update = () => {
      raf = 0;
      const sec = sectionRef.current;
      const stage = stageRef.current;
      const win = winRef.current;
      if (!sec || !stage || !win) return;

      const r = sec.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = reduce ? 0.6 : clamp((vh - r.top) / (vh + r.height * 0.7));

      const maxX = Math.max(0, stage.clientWidth - win.offsetWidth);
      const x = lerp(maxX * 0.08, maxX, ease(p)); // window glides to the right
      const s = lerp(0.85, 1, clamp(p * 2.2));
      win.style.transform = `translate3d(${x}px, -50%, 0) scale(${s})`;
      if (imgRef.current) imgRef.current.style.transform = `scale(1.15) translateX(${lerp(5, -5, p)}%)`;
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
    <section ref={sectionRef} className="relative overflow-hidden px-6 pb-20 pt-28 md:px-12 md:pb-28 md:pt-40" style={{ background: CTA_BG }}>
      <div className="relative mx-auto max-w-[1500px]">
        <div ref={stageRef} className="relative">
          <h2 className="text-[10.5vw] font-extrabold leading-[1] tracking-[-0.05em] md:text-[7.4vw]">
            <span className="block text-black">Ready to Write</span>
            <span className="block pt-[0.18em] text-white">Your Success Story?</span>
          </h2>

          <div ref={winRef} className="absolute left-0 top-1/2 z-10 aspect-[2/1] w-[52vw] origin-center overflow-hidden bg-black md:w-[40vw]" style={{ transform: 'translate3d(0, -50%, 0)', willChange: 'transform' }}>
            <div ref={imgRef} className="absolute inset-0" style={{ willChange: 'transform' }}>
              <Image src={CTA_MEDIA} alt="" fill sizes="(min-width: 768px) 40vw, 52vw" className="object-cover" />
            </div>
          </div>
        </div>

        <Reveal className="mt-14 flex flex-col gap-8 md:mt-20 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[620px] text-[16px] leading-[1.7] text-black/80 md:text-[19px]">
            Join the ranks of industry leaders who have transformed their businesses with our proven methodologies. Let&apos;s discuss how we can deliver similar breakthrough results for your organization.
          </p>
        </Reveal>

        <Reveal className="mt-8">
          <Link href="/contact" className="group flex w-full max-w-[700px] items-center justify-between rounded-full bg-white/35 px-8 py-5 text-[18px] font-semibold text-black transition-colors duration-300 hover:bg-white/60 md:text-[22px]">
            Schedule Free Consultation
            <Icon name="arrow" className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-2" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

/* ------------------------------- icons ------------------------------- */

const CheckCircle = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.2l2.4 2.4 4.6-4.8" />
  </svg>
);

const Icon = ({ name, className = 'h-5 w-5' }: { name: string; className?: string }) => {
  const p = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, className, 'aria-hidden': true };
  switch (name) {
    case 'award':
      return <svg {...p}><circle cx="12" cy="9" r="5.5" /><path d="M9 14l-1 7 4-2 4 2-1-7" /></svg>;
    case 'trend':
      return <svg {...p}><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></svg>;
    case 'users':
      return <svg {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18.5 20a6.5 6.5 0 0 0-3-5.5" /></svg>;
    case 'target':
      return <svg {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></svg>;
    case 'bolt':
      return <svg {...p}><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></svg>;
    case 'brain':
      return <svg {...p}><path d="M12 5a3 3 0 0 0-5.6-1.5A3 3 0 0 0 4 7.5a3 3 0 0 0-.5 5 3.5 3.5 0 0 0 3 5.5A3 3 0 0 0 12 19z" /><path d="M12 5a3 3 0 0 1 5.6-1.5A3 3 0 0 1 20 7.5a3 3 0 0 1 .5 5 3.5 3.5 0 0 1-3 5.5A3 3 0 0 1 12 19z" /><path d="M12 5v14" /></svg>;
    case 'blocks':
      return <svg {...p}><rect x="3" y="11" width="10" height="10" rx="1.5" /><path d="M3 16h10M8 11v10" /><rect x="15" y="3" width="6" height="6" rx="1.5" /></svg>;
    case 'gear':
      return <svg {...p} className={`${className} ss-spin`}><circle cx="12" cy="12" r="3.5" /><path d="M12 2v3M12 19v3M4.9 4.9L7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1" /></svg>;
    case 'database':
      return <svg {...p}><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></svg>;
    case 'globe':
      return <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><ellipse cx="12" cy="12" rx="4" ry="9" /></svg>;
    case 'zap':
      return <svg {...p}><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></svg>;
    case 'arrow':
      return <svg {...p} strokeWidth={2.2}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    default:
      return null;
  }
};

/* ------------------------------- styles ------------------------------ */

const STYLES = `
  @keyframes ss-letter { from { transform: translateY(110%); opacity: 0; } to { transform: none; opacity: 1; } }
  @keyframes ss-fade   { from { transform: translateY(16px); opacity: 0; } to { transform: none; opacity: 1; } }
  @keyframes ss-pop-in { from { transform: translateX(40px) scale(.96); opacity: 0; } to { transform: none; opacity: 1; } }
  @keyframes ss-float  { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
  @keyframes ss-drift  { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,-24px) scale(1.06); } }
  @keyframes ss-ring   { 0% { transform: scale(1); opacity: .7; } 100% { transform: scale(1.55); opacity: 0; } }
  @keyframes ss-spin   { to { transform: rotate(360deg); } }
  @keyframes ss-up     { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
  @keyframes ss-side   { from { opacity: 0; transform: translateX(-14px); } to { opacity: 1; transform: none; } }
  @keyframes ss-wipe-l { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
  @keyframes ss-wipe-r { from { clip-path: inset(0 0 0 100%); } to { clip-path: inset(0 0 0 0); } }
  @keyframes ss-sheen  { 0%, 70% { transform: translateX(0) skewX(-12deg); } 100% { transform: translateX(450%) skewX(-12deg); } }

  .ss-root .ss-letter     { animation: ss-letter .8s cubic-bezier(.22,1,.36,1) both; }
  .ss-root .ss-letter-dot { animation: ss-fade .6s ease-out 1.35s both; }
  .ss-root .ss-fade       { animation: ss-fade .8s cubic-bezier(.22,1,.36,1) both; }
  .ss-root .ss-pop-in     { animation: ss-pop-in 1s cubic-bezier(.22,1,.36,1) both; }
  .ss-root .ss-float      { animation: ss-float 6s ease-in-out infinite; }
  .ss-root .ss-drift      { animation: ss-drift 16s ease-in-out infinite; }
  .ss-root .ss-ring       { animation: ss-ring 2.8s ease-out infinite; }
  .ss-root .ss-spin       { animation: ss-spin 10s linear infinite; }

  .ss-root .ss-reveal { opacity: 0; transform: translateY(26px); transition: opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1); }
  .ss-root .ss-reveal.ss-in { opacity: 1; transform: none; }

  /* case rows */
  .ss-root .ss-wipe-l { clip-path: inset(0 100% 0 0); }
  .ss-root .ss-wipe-r { clip-path: inset(0 0 0 100%); }
  .ss-root .ss-in .ss-wipe-l { animation: ss-wipe-l 1s cubic-bezier(.77,0,.18,1) forwards; }
  .ss-root .ss-in .ss-wipe-r { animation: ss-wipe-r 1s cubic-bezier(.77,0,.18,1) forwards; }
  .ss-root .ss-in .ss-sheen  { animation: ss-sheen 6s ease-in-out 1.4s infinite; }

  .ss-root .ss-up, .ss-root .ss-side { opacity: 0; }
  .ss-root .ss-in .ss-up   { animation: ss-up .7s cubic-bezier(.22,1,.36,1) both; }
  .ss-root .ss-in .ss-side { animation: ss-side .6s cubic-bezier(.22,1,.36,1) both; }

  @media (prefers-reduced-motion: reduce) {
    .ss-root *, .ss-root *::before, .ss-root *::after { animation: none !important; transition: none !important; }
    .ss-root .ss-reveal, .ss-root .ss-up, .ss-root .ss-side { opacity: 1 !important; transform: none !important; }
    .ss-root .ss-wipe-l, .ss-root .ss-wipe-r { clip-path: none !important; }
  }
`;

export default SuccessStoriesPage;