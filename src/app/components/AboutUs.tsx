'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

/* ------------------------------ Content ------------------------------ */

const VALUES = [
  { title: 'Global Reach', text: 'Serving clients across all geographies with local expertise', icon: 'globe' },
  { title: 'Holistic Solutions', text: 'Technology + Management = Complete business transformation', icon: 'target' },
  { title: 'Innovation First', text: 'Turn-around strategies that eliminate waste and drive efficiency', icon: 'bulb' },
  { title: 'Proven Results', text: 'Measurable business outcomes with end-to-end digital transformation', icon: 'shield' },
] as const;

const ADVANTAGES = [
  { title: 'Business-First Approach:', text: 'Solutions designed around your business goals, not technology limitations.' },
  { title: 'Waste Elimination:', text: 'Specialized in identifying and removing inefficiencies that drain resources.' },
  { title: 'Multi-Technology Integration:', text: 'Seamlessly combining diverse technologies for unified solutions.' },
  { title: 'Proven Methodology:', text: 'From Value Stream Mapping to DMAIC - driven by Lean Six Sigma and human-centered design.' },
];

const SELVAN = {
  name: 'Dr. Selvan C',
  role: 'Managing Director',
  tags: ['Doctorate in Lean Six Sigma', 'Data Science Expert', 'Master Black Belt', 'Global Leader'],
  bio: 'Dr. Selvan is a globally recognized transformation leader with over 26 years of experience guiding Fortune 100 organizations across Africa, Middle East, Europe, North America, and India. He brings a unique blend of expertise in Lean Six Sigma, Data Science, Analytics, Business Transformation, and Operational Excellence.',
  stats: [
    { icon: 'award', value: '4', label: 'Patents Submitted' },
    { icon: 'users', value: '5,000+', label: 'Professionals Trained' },
    { icon: 'trend', value: '15%', label: 'Efficiency Gains' },
    { icon: 'book', value: '600+', label: 'Programs Delivered' },
  ],
  listTitle: 'Key Accomplishments',
  list: [
    'Designed R3P Governance Framework impacting 30,000+ FTEs',
    'Delivered "as-a-Service" excellence models across 50+ clients',
    'Mentored 300+ Black Belts and 1,000+ Green Belts',
    'Pioneered People Innovation Practice with patent submissions',
  ],
};

const KALPANA = {
  name: 'Kalpanadevi Sridharan',
  role: 'Director',
  tags: ['15+ Years Experience', 'Lean Six Sigma Expert', 'Healthcare Specialist'],
  bio: 'With over 15+ years of experience in leading and executing Lean Six Sigma and continuous improvement programs, Kalpana Devi is an accomplished executive with a proven track record of delivering results in diverse industries, particularly in healthcare.',
  stats: [
    { icon: 'trend', value: 'INR 6.5 Cr', label: 'Savings' },
    { icon: 'users', value: '150+', label: 'Projects Mentored' },
    { icon: 'award', value: '20+', label: 'Training Sessions' },
    { icon: 'book', value: '100+', label: 'Professionals Impacted' },
  ],
  listTitle: 'Core Expertise',
  list: [
    'Lean Six Sigma Implementation & Continuous Improvement',
    'Change Management & Program Management',
    'Mentorship & Training in Six Sigma Methodologies',
    'CARES Framework & Ambulance Management Systems',
  ],
};

type Leader = typeof SELVAN;

/* ------------------------------ Hooks -------------------------------- */

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

/* ---------------------------- Primitives ----------------------------- */

const Reveal = ({
  children,
  delay = 0,
  from = 'up',
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  from?: 'up' | 'left' | 'right' | 'scale';
  className?: string;
}) => {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  return (
    <div
      ref={ref}
      className={`ab-reveal ab-from-${from} ${inView ? 'ab-in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
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
    const commas = num.includes(',');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t0 = performance.now();
    const dur = reduce ? 0 : 1600;
    let raf = 0;

    const fmt = (n: number) =>
      decimals ? n.toFixed(decimals) : commas ? Math.round(n).toLocaleString('en-US') : String(Math.round(n));

    const tick = (now: number) => {
      const t = dur ? Math.min(1, (now - t0) / dur) : 1;
      const e = 1 - Math.pow(1 - t, 3);
      setShown(`${prefix}${fmt(target * e)}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, value]);

  return <>{shown}</>;
};

const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  const gid = `ab-u-${React.useId().replace(/:/g, '')}`;

  return (
  <Reveal className="mx-auto max-w-[900px] text-center">
    <h2 className="ab-gradient-text inline-block bg-clip-text pb-1 text-[30px] font-bold tracking-[-0.8px] text-transparent md:text-[44px]">
      {title}
    </h2>
    {/* underline that draws itself */}
    <svg viewBox="0 0 220 12" className="mx-auto mt-1 h-3 w-[180px]" fill="none" aria-hidden>
      <path
        d="M2 8 C 50 2, 110 2, 218 7"
        stroke={`url(#${gid})`}
        strokeWidth="3"
        strokeLinecap="round"
        className="ab-draw-on"
        style={{ strokeDasharray: 230, strokeDashoffset: 230 }}
      />
      <defs>
        <linearGradient id={gid} x1="0" x2="220" y1="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#07548B" />
          <stop offset="1" stopColor="#22B5E8" />
        </linearGradient>
      </defs>
    </svg>
    {subtitle && <p className="mx-auto mt-4 max-w-[760px] text-[15px] leading-[1.7] text-slate-600 md:text-[17px]">{subtitle}</p>}
  </Reveal>
  );
};

/* ------------------------------- Page -------------------------------- */

const AboutPage = () => {
  return (
    <main className="ab-root overflow-hidden bg-white">
      <style>{STYLES}</style>
      <Hero />
      <Leaders />
      <Different />
      <Team />
    </main>
  );
};

/* ------------------------------- Hero -------------------------------- */

const Hero = () => (
  <section className="relative flex h-[400px] items-center justify-center overflow-hidden md:h-[460px]">
    {/* background image with slow zoom */}
    <div className="ab-kenburns absolute inset-0">
      <Image src="/images/aboutus.png" alt="" fill priority sizes="100vw" className="object-cover" />
    </div>

    {/* colour wash */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#031b30]/85 via-[#07548B]/55 to-[#031b30]/85" />

    {/* drifting light */}
    <div aria-hidden className="ab-drift absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#22B5E8]/25 blur-3xl" />
    <div aria-hidden className="ab-drift absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[#238ED1]/25 blur-3xl" style={{ animationDelay: '-6s' }} />

    {/* fine grid */}
    <div
      aria-hidden
      className="absolute inset-0 opacity-[0.08]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
        backgroundSize: '56px 56px',
        maskImage: 'radial-gradient(ellipse at center, #000 20%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, #000 20%, transparent 70%)',
      }}
    />

    <div className="relative z-10 px-5 text-center">
      <h1 className="text-[40px] font-bold leading-[1.05] tracking-[-1.5px] text-white sm:text-[54px] md:text-[64px]">
        <span className="inline-block overflow-hidden align-bottom">
          <span className="ab-word inline-block">About</span>
        </span>{' '}
        <span className="inline-block overflow-hidden align-bottom">
          <span
            className="ab-word inline-block bg-clip-text pb-1 text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #ffffff, #9fdcff, #ffffff)',
              animationDelay: '150ms',
            }}
          >
            Duanamize
          </span>
        </span>
      </h1>

      <p
        className="ab-hero-fade mx-auto mt-5 max-w-[760px] text-[15px] leading-[1.6] text-white/85 md:text-[19px]"
        style={{ animationDelay: '450ms' }}
      >
        Transforming businesses through holistic solutions that combine technology with strategic management excellence
      </p>
    </div>

    {/* scroll cue */}
    <div className="absolute bottom-16 left-1/2 z-10 hidden -translate-x-1/2 md:block">
      <div className="ab-hero-fade" style={{ animationDelay: '900ms' }}>
        <div className="flex h-9 w-[22px] justify-center rounded-full border-2 border-white/50 pt-1.5">
          <span className="ab-scroll-dot block h-2 w-1 rounded-full bg-white" />
        </div>
      </div>
    </div>

    {/* soft curve into the next section */}
    <svg aria-hidden className="absolute -bottom-px left-0 h-[50px] w-full md:h-[70px]" viewBox="0 0 1440 70" preserveAspectRatio="none">
      <path d="M0 70 V40 C 360 0, 1080 0, 1440 40 V70 Z" fill="#F7FAFD" />
    </svg>
  </section>
);

/* ------------------------ Leaders in Digital ------------------------- */

const Leaders = () => (
  <section className="relative bg-[#F7FAFD] px-5 pb-20 pt-14 md:pb-24 md:pt-16">
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.06]"
      style={{ backgroundImage: 'radial-gradient(#238ED1 1px, transparent 1px)', backgroundSize: '24px 24px' }}
    />

    <div className="relative mx-auto max-w-[1180px]">
      <SectionTitle
        title="Leaders in Digital Transformation"
        subtitle="We are pioneers in the Digital Transformation space, serving clients across Healthcare, FinTech, Supply Chain, Logistics, Automotive and EdTech industries. From innovative startups to CMM Level-5 enterprises, our customers consistently find our services exceed their expectations with custom solutions tailored to meet their unique business needs."
      />

      {/* industries marquee */}
      <Reveal delay={150} className="mx-auto mt-8 max-w-[760px]">
        <div
          className="relative overflow-hidden"
          style={{
            maskImage: 'linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent)',
          }}
        >
        </div>
      </Reveal>

      {/* value cards */}
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((v, i) => (
          <Reveal key={v.title} delay={i * 120}>
            <ValueCard {...v} />
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const ValueCard = ({ title, text, icon }: (typeof VALUES)[number]) => {
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <div
      onMouseMove={onMove}
      className="ab-card group relative h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white px-6 pb-8 pt-9 text-center transition duration-500 hover:-translate-y-1.5 hover:border-[#238ED1]/30 hover:shadow-[0_24px_50px_-24px_rgba(7,84,139,0.35)]"
    >
      {/* cursor spotlight */}
      <div className="ab-spot pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {/* accent bar */}
      <span className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-[#07548B] via-[#238ED1] to-[#22B5E8] transition-transform duration-500 group-hover:scale-x-100" />

      <div className="relative mx-auto flex h-[76px] w-[76px] items-center justify-center">
        <span className="ab-ring absolute inset-0 rounded-full bg-[#238ED1]/15" />
        <span className="relative flex h-[76px] w-[76px] items-center justify-center rounded-full bg-gradient-to-br from-[#EAF5FD] to-[#D6ECFB] text-[#238ED1] transition-transform duration-500 group-hover:scale-110">
          <ValueIcon name={icon} />
        </span>
      </div>

      <h3 className="relative mt-6 text-[19px] font-semibold text-[#07548B] transition-colors group-hover:text-[#238ED1]">{title}</h3>
      <p className="relative mt-3 text-[14.5px] leading-[1.65] text-slate-600">{text}</p>
    </div>
  );
};

/* ------------------------ What Makes Us Different -------------------- */

const Different = () => (
  <section className="relative bg-gradient-to-b from-[#F7FAFD] to-white px-5 pb-24">
    <Reveal from="scale" className="mx-auto max-w-[1180px]">
      <div className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-7 shadow-[0_30px_70px_-40px_rgba(7,84,139,0.35)] md:p-12">
        {/* soft corner glows */}
        <div aria-hidden className="ab-drift pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#238ED1]/10 blur-3xl" />
        <div aria-hidden className="ab-drift pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#22B5E8]/10 blur-3xl" style={{ animationDelay: '-8s' }} />

        <SectionTitle title="What Makes Us Different" />

        <div className="relative mt-10 grid gap-12 md:grid-cols-2 md:gap-14">
          {/* Beyond Technology */}
          <Reveal from="left" className="relative pl-6">
            <span className="ab-line absolute left-0 top-1 h-[calc(100%-8px)] w-[3px] origin-top rounded-full bg-gradient-to-b from-[#238ED1] to-[#22B5E8]/0" />
            <h3 className="text-[20px] font-semibold text-[#238ED1]">Beyond Technology</h3>
            <p className="mt-5 text-[16px] leading-[1.8] text-slate-600">
              Unlike traditional service providers who offer typical technology solutions, we deliver{' '}
              <strong className="font-semibold text-slate-800">holistic business solutions</strong> that strategically combine
              technology with managerial excellence. We do not just build technology products - we use technology to solve
              complex business challenges.
            </p>
            <p className="mt-5 text-[16px] leading-[1.8] text-slate-600">
              Our solutions are driven by business needs and often integrate multiple technologies working in harmony to
              address specific business problems with precision and efficiency.
            </p>
          </Reveal>

          {/* Competitive Advantage */}
          <div>
            <Reveal from="right">
              <h3 className="text-[20px] font-semibold text-[#238ED1]">Competitive Advantage</h3>
            </Reveal>
            <ul className="mt-5 space-y-4">
              {ADVANTAGES.map((a, i) => (
                <li key={a.title}>
                  <Reveal from="right" delay={150 + i * 130}>
                    <div className="group flex gap-3 rounded-xl p-2 transition hover:bg-[#F2F8FD]">
                      <CheckBadge delay={350 + i * 130} />
                      <p className="text-[16px] leading-[1.7] text-slate-600">
                        <strong className="font-semibold text-slate-800">{a.title}</strong> {a.text}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Reveal>
  </section>
);

const CheckBadge = ({ delay }: { delay: number }) => (
  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#238ED1]/10 text-[#238ED1] transition-transform duration-300 group-hover:scale-110">
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7.5" className="ab-draw-on" style={{ strokeDasharray: 24, strokeDashoffset: 24, animationDelay: `${delay}ms` }} />
    </svg>
  </span>
);

/* ----------------------------- Leadership ---------------------------- */

const Team = () => (
  <section className="relative bg-white px-5 pb-24 pt-6">
    <div className="mx-auto max-w-[1180px]">
      <SectionTitle
        title="Our Leadership Team"
        subtitle="Meet the visionary leaders who drive innovation, transformation, and excellence across every aspect of our business operations"
      />

      <div className="mt-14 space-y-10">
        <LeaderCard leader={SELVAN} visual={<FounderPhoto />} />
        <LeaderCard leader={KALPANA} reverse visual={<InitialsAvatar />} />
      </div>
    </div>
  </section>
);

const LeaderCard = ({ leader, visual, reverse }: { leader: Leader; visual: React.ReactNode; reverse?: boolean }) => {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);

  return (
    <Reveal from="up">
      <div
        ref={ref}
        className="group grid overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_30px_70px_-45px_rgba(7,84,139,0.4)] transition duration-500 hover:shadow-[0_40px_80px_-40px_rgba(7,84,139,0.45)] md:grid-cols-2"
      >
        {/* visual side */}
        <div
          className={`relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#F2F8FD] via-white to-[#EAF5FD] px-6 py-12 ${
            reverse ? 'md:order-2' : ''
          }`}
        >
          <div aria-hidden className="ab-drift absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#238ED1]/10 blur-3xl" />
          <Reveal from="scale" delay={100}>
            {visual}
          </Reveal>
          {!reverse ? (
            <Reveal delay={250} className="mt-8 text-center">
              <h3 className="text-[30px] font-bold tracking-[-0.6px] text-[#238ED1] md:text-[36px]">{leader.name}</h3>
              <p className="mt-1 text-[18px] font-medium text-slate-600">{leader.role}</p>
            </Reveal>
          ) : (
            <Reveal delay={250} className="mt-8 text-center">
              <p className="text-[19px] font-semibold text-[#238ED1]">Driving Excellence</p>
              <p className="mt-1 text-[16px] text-slate-600">Through Lean Six Sigma</p>
            </Reveal>
          )}
        </div>

        {/* content side */}
        <div className={`px-7 py-10 md:px-10 md:py-12 ${reverse ? 'md:order-1' : ''}`}>
          {reverse && (
            <Reveal from="left">
              <h3 className="text-[30px] font-bold tracking-[-0.6px] text-[#238ED1] md:text-[36px]">{leader.name}</h3>
              <p className="mt-1 text-[18px] font-medium text-slate-600">{leader.role}</p>
            </Reveal>
          )}

          <div className={`flex flex-wrap gap-2 ${reverse ? 'mt-5' : ''}`}>
            {leader.tags.map((t, i) => (
              <Reveal key={t} from="scale" delay={150 + i * 90}>
                <span className="inline-block rounded-full border border-[#238ED1]/15 bg-[#F2F8FD] px-3.5 py-1 text-[12.5px] font-semibold text-[#07548B] transition hover:-translate-y-0.5 hover:bg-[#238ED1] hover:text-white">
                  {t}
                </span>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <p className="mt-6 text-[16px] leading-[1.8] text-slate-600">{leader.bio}</p>
          </Reveal>

          {/* stats */}
          <div className="mt-7 grid grid-cols-2 gap-3">
            {leader.stats.map((s, i) => (
              <Reveal key={s.label} delay={250 + i * 100}>
                <div className="flex h-full items-center gap-3 rounded-xl border border-slate-100 bg-[#FAFCFE] px-3.5 py-3 transition hover:-translate-y-0.5 hover:border-[#238ED1]/25 hover:bg-white hover:shadow-sm">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#238ED1]/10 text-[#238ED1]">
                    <StatIcon name={s.icon} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[17px] font-bold leading-tight text-[#07548B]">
                      <CountUp value={s.value} start={inView} />
                    </span>
                    <span className="block text-[12.5px] leading-tight text-slate-500">{s.label}</span>
                  </span>
                </div>
              </Reveal>
            ))}
          </div>

          {/* list */}
          <Reveal delay={300}>
            <h4 className="mt-8 text-[19px] font-semibold text-[#238ED1]">{leader.listTitle}</h4>
          </Reveal>
          <ul className="mt-4 space-y-2.5">
            {leader.list.map((item, i) => (
              <li key={item}>
                <Reveal from="right" delay={350 + i * 110}>
                  <div className="flex items-start gap-2.5 text-[15px] leading-[1.6] text-slate-600">
                    <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#238ED1]" />
                    {item}
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
};

const FounderPhoto = () => (
  <div className="relative h-[250px] w-[250px] md:h-[300px] md:w-[300px]">
    {/* turning gradient ring */}
    <div
      className="ab-spin absolute -inset-2 rounded-full"
      style={{ background: 'conic-gradient(from 0deg, #07548B, #238ED1, #22B5E8, transparent 70%, #07548B)' }}
    />
    <div className="absolute -inset-[3px] rounded-full bg-white" />
    {/* orbiting dot */}
    <div className="ab-orbit absolute -inset-6">
      <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-[#22B5E8] shadow-[0_0_12px_rgba(34,181,232,0.8)]" />
    </div>
    <div className="relative h-full w-full overflow-hidden rounded-full bg-slate-100 shadow-[0_20px_40px_-20px_rgba(7,84,139,0.5)]">
      <Image src="/images/a2.png" alt="Dr. Selvan C, Managing Director" fill sizes="300px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
    </div>
    {/* floating badge */}
    <div className="ab-float absolute -right-4 bottom-6 rounded-2xl border border-slate-100 bg-white px-3.5 py-2 shadow-lg">
      <span className="block text-[18px] font-bold leading-none text-[#238ED1]">26+</span>
      <span className="block text-[11px] text-slate-500">years</span>
    </div>
  </div>
);

const InitialsAvatar = () => (
  <div className="relative flex h-[240px] w-[240px] items-center justify-center md:h-[280px] md:w-[280px]">
    <span className="ab-spin absolute inset-0 rounded-full border-2 border-dashed border-[#238ED1]/25" style={{ animationDuration: '40s' }} />
    <span className="ab-spin-rev absolute inset-6 rounded-full border border-[#238ED1]/20" />
    <div className="ab-orbit absolute inset-0" style={{ animationDuration: '14s' }}>
      <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#238ED1]" />
    </div>
    <div className="ab-orbit absolute inset-6" style={{ animationDuration: '9s', animationDirection: 'reverse' }}>
      <span className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#22B5E8]" />
    </div>
    <div className="relative flex h-[150px] w-[150px] items-center justify-center rounded-full bg-gradient-to-br from-[#07548B] via-[#238ED1] to-[#22B5E8] text-[48px] font-bold tracking-tight text-white shadow-[0_24px_50px_-20px_rgba(35,142,209,0.7)] md:h-[170px] md:w-[170px]">
      KS
    </div>
  </div>
);

/* ------------------------------- Icons ------------------------------- */

const Svg = ({ className = 'h-5 w-5', children }: { className?: string; children: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    {children}
  </svg>
);

const ValueIcon = ({ name }: { name: (typeof VALUES)[number]['icon'] }) => {
  const cls = 'h-9 w-9';
  switch (name) {
    case 'globe':
      return (
        <Svg className={cls}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <ellipse cx="12" cy="12" rx="4" ry="9" className="ab-globe" />
        </Svg>
      );
    case 'target':
      return (
        <Svg className={cls}>
          <circle cx="12" cy="12" r="9" className="ab-target-1" />
          <circle cx="12" cy="12" r="5.5" className="ab-target-2" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </Svg>
      );
    case 'bulb':
      return (
        <Svg className={cls}>
          <path d="M9 18h6M10 21h4" />
          <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" className="ab-bulb" />
          <path d="M12 0.5v1M4 4l.8.8M20 4l-.8.8" className="ab-rays" />
        </Svg>
      );
    default:
      return (
        <Svg className={cls}>
          <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
          <path d="M8.8 12l2.2 2.2 4.2-4.4" className="ab-draw-on" style={{ strokeDasharray: 12, strokeDashoffset: 12, animationDelay: '600ms' }} />
        </Svg>
      );
  }
};

const StatIcon = ({ name }: { name: string }) => {
  switch (name) {
    case 'award':
      return <Svg><circle cx="12" cy="9" r="5" /><path d="M9 13.5L8 21l4-2 4 2-1-7.5" /></Svg>;
    case 'users':
      return <Svg><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18.5 20a6.5 6.5 0 0 0-3-5.5" /></Svg>;
    case 'trend':
      return <Svg><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></Svg>;
    default:
      return <Svg><path d="M2 5.5C4 4.5 7 4.5 12 6.5c5-2 8-2 10-1V19c-2-1-5-1-10 1-5-2-8-2-10-1z" /><path d="M12 6.5V20" /></Svg>;
  }
};

/* ------------------------------- Styles ------------------------------ */

const STYLES = `
  @keyframes ab-kenburns { from { transform: scale(1.05) translate(0,0); } to { transform: scale(1.16) translate(-1.5%, -1%); } }
  @keyframes ab-word     { from { transform: translateY(105%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes ab-hero-fade{ from { transform: translateY(14px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes ab-drift    { 0%,100% { transform: translate(0,0); } 50% { transform: translate(30px,-20px); } }
  @keyframes ab-scroll   { 0% { transform: translateY(0); opacity: 1; } 70% { transform: translateY(12px); opacity: 0; } 100% { opacity: 0; } }
  @keyframes ab-marquee  { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes ab-draw     { to { stroke-dashoffset: 0; } }
  @keyframes ab-ring     { 0% { transform: scale(1); opacity: .7; } 100% { transform: scale(1.45); opacity: 0; } }
  @keyframes ab-spin     { to { transform: rotate(360deg); } }
  @keyframes ab-float    { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  @keyframes ab-globe    { 0%,100% { transform: scaleX(1); } 50% { transform: scaleX(.15); } }
  @keyframes ab-target   { 0%,100% { opacity: 1; } 50% { opacity: .35; } }
  @keyframes ab-bulb     { 0%,100% { fill: transparent; } 50% { fill: rgba(35,142,209,.18); } }
  @keyframes ab-rays     { 0%,100% { opacity: .2; } 50% { opacity: 1; } }
  @keyframes ab-shimmer  { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
  @keyframes ab-line     { from { transform: scaleY(0); } to { transform: scaleY(1); } }

  .ab-root .ab-kenburns  { animation: ab-kenburns 24s ease-in-out infinite alternate; }
  .ab-root .ab-word      { animation: ab-word .9s cubic-bezier(.22,1,.36,1) both; }
  .ab-root .ab-hero-fade { animation: ab-hero-fade .9s cubic-bezier(.22,1,.36,1) both; }
  .ab-root .ab-drift     { animation: ab-drift 16s ease-in-out infinite; }
  .ab-root .ab-scroll-dot{ animation: ab-scroll 1.8s ease-in-out infinite; }
  .ab-root .ab-marquee   { animation: ab-marquee 26s linear infinite; }
  .ab-root .ab-marquee:hover { animation-play-state: paused; }
  .ab-root .ab-ring      { animation: ab-ring 2.8s ease-out infinite; }
  .ab-root .ab-spin      { animation: ab-spin 12s linear infinite; }
  .ab-root .ab-spin-rev  { animation: ab-spin 20s linear infinite reverse; }
  .ab-root .ab-orbit     { animation: ab-spin 10s linear infinite; }
  .ab-root .ab-float     { animation: ab-float 4s ease-in-out infinite; }
  .ab-root .ab-globe     { transform-origin: 12px 12px; animation: ab-globe 4s ease-in-out infinite; }
  .ab-root .ab-target-1  { animation: ab-target 2.4s ease-in-out infinite; }
  .ab-root .ab-target-2  { animation: ab-target 2.4s ease-in-out .6s infinite; }
  .ab-root .ab-bulb      { animation: ab-bulb 2.6s ease-in-out infinite; }
  .ab-root .ab-rays      { animation: ab-rays 2.6s ease-in-out infinite; }

  .ab-root .ab-gradient-text {
    background-image: linear-gradient(90deg, #07548B, #238ED1, #22B5E8, #238ED1, #07548B);
    background-size: 200% 100%;
    animation: ab-shimmer 8s linear infinite;
  }

  .ab-root .ab-spot {
    background: radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(35,142,209,.09), transparent 70%);
  }

  /* scroll reveal */
  .ab-root .ab-reveal { opacity: 0; transition: opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1); }
  .ab-root .ab-from-up    { transform: translateY(28px); }
  .ab-root .ab-from-left  { transform: translateX(-32px); }
  .ab-root .ab-from-right { transform: translateX(32px); }
  .ab-root .ab-from-scale { transform: scale(.95); }
  .ab-root .ab-reveal.ab-in { opacity: 1; transform: none; }

  /* things that draw / grow once revealed */
  .ab-root .ab-in .ab-draw-on { animation: ab-draw .9s ease-out forwards; }
  .ab-root .ab-line { transform: scaleY(0); }
  .ab-root .ab-in .ab-line, .ab-root .ab-in.ab-reveal .ab-line { animation: ab-line 1.1s cubic-bezier(.22,1,.36,1) .2s forwards; }

  @media (prefers-reduced-motion: reduce) {
    .ab-root *, .ab-root *::before, .ab-root *::after { animation: none !important; transition: none !important; }
    .ab-root .ab-reveal { opacity: 1 !important; transform: none !important; }
    .ab-root .ab-draw-on { stroke-dashoffset: 0 !important; }
    .ab-root .ab-line { transform: none !important; }
  }
`;

export default AboutPage;