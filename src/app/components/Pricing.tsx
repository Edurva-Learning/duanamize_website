'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/* =====================================================================
   Pricing — "Flexible Engagement Models"
   Three plans: Floating Team Model, Dedicated Team Model,
   Technology Consulting.
   Light motion: cards rise in one by one, lift on hover, ticks pop in.
   Every className is on one line (avoids the Windows \r\n hydration error).
===================================================================== */

type Plan = {
  name: string;
  tagline: string;
  price: string;
  period: string;
  summary: string;
  included: string[];
  benefits: string[];
  idealFor: string;
  popular?: boolean;
};

const PLANS: Plan[] = [
  {
    name: 'Floating Team Model',
    tagline: 'Perfect for MVP & Growth Stage',
    price: '$10K - $20K',
    period: 'per month',
    summary: 'Fixed monthly cost with scalable team for evolving product needs',
    included: [
      'High-quality Dev + QA + DevOps team',
      'Fixed monthly costs',
      'Continuous product evolution',
      '3-6 months initial tenure',
      'Scalable complexity handling',
      'Milestone based deliveries',
      'Agile project management',
      'Quality assurance included',
    ],
    benefits: ['Predictable costs', 'Rapid development', 'Expert team access', 'Risk mitigation'],
    idealFor: 'Startups, MVP development, rapid prototyping',
    popular: true,
  },
  {
    name: 'Dedicated Team Model',
    tagline: 'Build-Operate-Transfer',
    price: 'Custom',
    period: '1-3 years',
    summary: 'Complete team building and product development with eventual transfer',
    included: [
      'Custom team size & composition',
      'Full product lifecycle management',
      'Build → Operate → Transfer process',
      'Dedicated project management',
      'Technology transfer included',
      'Team training & knowledge transfer',
      'Reduced product launch time',
      'Quality guarantee',
    ],
    benefits: ['Reduced risk', 'Faster time-to-market', 'Complete ownership transfer', 'Proven team performance'],
    idealFor: 'Enterprise, new product lines, technology expansion',
  },
  {
    name: 'Technology Consulting',
    tagline: 'Strategic Guidance & Architecture',
    price: '$5K - $15K',
    period: 'per month',
    summary: 'Strategic technology planning and architectural guidance',
    included: [
      'Technology roadmap development',
      'Architecture design & review',
      'Scalability planning',
      'Security implementation',
      'Performance optimization',
      'Technology stack evaluation',
      'Best practices implementation',
      'Ongoing strategic support',
    ],
    benefits: ['Strategic clarity', 'Risk reduction', 'Optimized architecture', 'Future-ready solutions'],
    idealFor: 'Technology planning, architecture review, strategic guidance',
  },
];

const useInView = <T extends HTMLElement>(threshold = 0.15) => {
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

const Pricing = () => {
  const { ref: headRef, inView: headIn } = useInView<HTMLDivElement>(0.3);
  const { ref: gridRef, inView: gridIn } = useInView<HTMLDivElement>(0.1);

  return (
    <section className="pr-root w-full bg-gradient-to-b from-[#f0f7ff] to-white py-24 px-5 md:px-12 flex justify-center border-t border-blue-50">
      <style>{STYLES}</style>

      <div className="max-w-[1280px] w-full flex flex-col items-center">
        {/* Heading */}
        <div ref={headRef} className={`pr-reveal ${headIn ? 'pr-in' : ''} flex flex-col items-center`}>
          <div className="bg-white border border-gray-200 text-slate-700 text-xs font-medium px-4 py-1.5 rounded-full mb-6 shadow-sm">
            Transparent Pricing
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f172a] mb-4 text-center">Flexible Engagement Models</h2>
          <p className="text-slate-600 text-center max-w-2xl text-sm md:text-base mb-16">
            Choose the engagement model that best fits your project requirements and budget. All our pricing includes quality assurance, project management, and ongoing support.
          </p>
        </div>

        {/* Plans */}
        <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-stretch">
          {PLANS.map((plan, i) => (
            <div key={plan.name} className={`pr-rise ${gridIn ? 'pr-in' : ''}`} style={{ transitionDelay: `${i * 130}ms` }}>
              <PlanCard plan={plan} show={gridIn} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PlanCard = ({ plan, show, index }: { plan: Plan; show: boolean; index: number }) => {
  const base = 300 + index * 130;

  return (
    <div className={`group relative flex h-full flex-col rounded-3xl bg-white p-7 md:p-8 transition duration-500 hover:-translate-y-2 ${plan.popular ? 'border-2 border-[#1D63D8] shadow-[0_24px_60px_-30px_rgba(29,99,216,0.45)] hover:shadow-[0_34px_70px_-30px_rgba(29,99,216,0.55)]' : 'border border-gray-200 shadow-sm hover:border-[#1D63D8]/30 hover:shadow-[0_30px_60px_-34px_rgba(15,23,42,0.35)]'}`}>
      {plan.popular && (
        <div className="absolute -top-px right-8 flex items-center gap-1.5 rounded-b-lg bg-[#1D63D8] px-4 py-1.5 text-xs font-semibold text-white">
          <StarIcon className="pr-star h-3.5 w-3.5" />
          Most Popular
        </div>
      )}

      {/* Header (centred, like the design) */}
      <div className="text-center">
        <h3 className="mt-2 text-[24px] md:text-[26px] font-bold text-[#0f172a]">{plan.name}</h3>
        <p className="mt-1.5 text-[15px] text-slate-500">{plan.tagline}</p>
        <div className="mt-4 text-[34px] md:text-[38px] font-bold leading-none text-[#1D63D8] transition-transform duration-500 group-hover:scale-105">{plan.price}</div>
        <p className="mt-2 text-[16px] text-slate-500">{plan.period}</p>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{plan.summary}</p>
      </div>

      {/* What's Included */}
      <div className="mt-8">
        <div className="flex items-center gap-2.5 text-[17px] font-semibold text-[#0f172a]">
          <ShieldIcon className="h-5 w-5 text-[#1D63D8]" />
          What&apos;s Included
        </div>
        <ul className="mt-4 flex flex-col gap-3">
          {plan.included.map((item, k) => (
            <li key={item} className={`pr-item ${show ? 'pr-in' : ''} flex items-start gap-3 text-[15px] text-slate-600`} style={{ animationDelay: `${base + k * 70}ms` }}>
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Key Benefits */}
      <div className="mt-8">
        <div className="flex items-center gap-2.5 text-[17px] font-semibold text-[#0f172a]">
          <TrendIcon className="h-5 w-5 text-[#1D63D8]" />
          Key Benefits
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {plan.benefits.map((b, k) => (
            <span key={b} className={`pr-chip ${show ? 'pr-in' : ''} rounded-full bg-gray-100 px-3.5 py-1.5 text-[13px] font-medium text-slate-800 transition hover:bg-[#1D63D8] hover:text-white`} style={{ animationDelay: `${base + 600 + k * 80}ms` }}>
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Ideal For */}
      <div className="mt-8 rounded-xl border border-[#1D63D8]/10 bg-[#f0f7ff] p-4">
        <div className="flex items-center gap-2 text-[16px] font-semibold text-[#1D63D8]">
          <TargetIcon className="pr-target h-5 w-5" />
          Ideal For
        </div>
        <p className="mt-1.5 text-[13px] text-slate-600">{plan.idealFor}</p>
      </div>

      {/* CTA */}
      <Link
        href="/contact"
        className={`group/btn relative mt-8 flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg py-3 text-sm font-medium transition-colors duration-300 ${plan.popular ? 'bg-[#1D63D8] text-white' : 'border border-gray-300 bg-white text-slate-800 hover:border-[#1D63D8] hover:text-white'}`}
      >
        <span className={`absolute inset-0 -translate-x-[101%] transition-transform duration-500 ease-out group-hover/btn:translate-x-0 ${plan.popular ? 'bg-[#0f4fb8]' : 'bg-[#1D63D8]'}`} />
        <span className="relative">Get Started</span>
        <ArrowRightIcon className="relative h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
      </Link>
    </div>
  );
};

// ==========================================
// ICONS
// ==========================================

type IconProps = { className?: string };

const CheckIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const ShieldIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
  </svg>
);

const StarIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
  </svg>
);

const TrendIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

const TargetIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const ArrowRightIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

// ==========================================
// STYLES
// ==========================================

const STYLES = `
  @keyframes pr-pop    { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: none; } }
  @keyframes pr-chip   { 0% { opacity: 0; transform: scale(.7); } 70% { opacity: 1; transform: scale(1.06); } 100% { opacity: 1; transform: scale(1); } }
  @keyframes pr-twinkle{ 0%,100% { transform: scale(1) rotate(0); } 50% { transform: scale(1.25) rotate(20deg); } }
  @keyframes pr-target { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15); } }

  .pr-root .pr-reveal { opacity: 0; transform: translateY(24px); transition: opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1); }
  .pr-root .pr-rise   { opacity: 0; transform: translateY(60px); transition: opacity .9s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1); }
  .pr-root .pr-reveal.pr-in, .pr-root .pr-rise.pr-in { opacity: 1; transform: none; }

  .pr-root .pr-item, .pr-root .pr-chip { opacity: 0; }
  .pr-root .pr-item.pr-in { animation: pr-pop .5s cubic-bezier(.22,1,.36,1) both; }
  .pr-root .pr-chip.pr-in { animation: pr-chip .45s cubic-bezier(.34,1.56,.64,1) both; }

  .pr-root .pr-star   { animation: pr-twinkle 2.4s ease-in-out infinite; }
  .pr-root .pr-target { animation: pr-target 2.4s ease-in-out infinite; }

  @media (prefers-reduced-motion: reduce) {
    .pr-root *, .pr-root *::before, .pr-root *::after { animation: none !important; transition: none !important; }
    .pr-root .pr-reveal, .pr-root .pr-rise, .pr-root .pr-item, .pr-root .pr-chip { opacity: 1 !important; transform: none !important; }
  }
`;

export default Pricing;