'use client';

import React, { useEffect, useRef, useState } from 'react';

/* =====================================================================
   ContactSection — colourful version with animated icons
   ---------------------------------------------------------------------
   Colour + motion added:
   - drifting colour blobs + faint dot grid in the background
   - gradient-border badge with a spinning sparkle
   - animated gradient headline text
   - six colourful floating icon tiles, each with its own idle motion
   - 3 feature pills (ticking clock, bouncing gift, unlocking padlock)
   - animated rainbow border around the form card
   - live colourful "form progress" bar
   - every field has its own colour, icon tile and focus animation
   - colour-coded project-type chips with hover animations
   - animated gradient send button with a paper plane that takes off
   - confetti burst + drawn check on success
   No extra dependencies: plain SVG + CSS keyframes.
===================================================================== */

/* ----------------------------- Data -------------------------------- */

type ChipDef = {
  label: string;
  from: string;
  to: string;
  icon: (p: IconProps) => React.ReactElement;
  hover: string;
};

const PROJECT_TYPES: ChipDef[] = [
  { label: 'AI/ML Implementation', from: '#238ED1', to: '#0EA5E9', icon: (p) => <CpuIcon {...p} />, hover: 'ci-h-pulse' },
  { label: 'Process Optimization', from: '#10B981', to: '#14B8A6', icon: (p) => <GearIcon {...p} />, hover: 'ci-h-spin' },
  { label: 'Lean Six Sigma Training', from: '#F59E0B', to: '#F97316', icon: (p) => <CapIcon {...p} />, hover: 'ci-h-bounce' },
  { label: 'Automation & RPA', from: '#8B5CF6', to: '#A855F7', icon: (p) => <BotIcon {...p} />, hover: 'ci-h-wiggle' },
  { label: 'Data & Analytics', from: '#EC4899', to: '#F43F5E', icon: (p) => <ChartIcon {...p} />, hover: 'ci-h-bounce' },
  { label: 'Digital Transformation', from: '#6366F1', to: '#8B5CF6', icon: (p) => <ZapIcon {...p} />, hover: 'ci-h-flash' },
  { label: 'Operating Model Design', from: '#06B6D4', to: '#0EA5E9', icon: (p) => <LayersIcon {...p} />, hover: 'ci-h-bounce' },
  { label: 'Other', from: '#F97316', to: '#EF4444', icon: (p) => <SparklesIcon {...p} />, hover: 'ci-h-spin' },
];

const BUDGETS = ['Under $10k', '$10k to $15k', '$15k to $50k', '$50k to $100k', '$100k+'];
const TIMELINES = ['Less than 1 month', '1-3 months', '3-6 months', '6-12 months', '12+ months'];

const FEATURES = [
  { title: 'Reply in 2 hours', sub: 'During business hours', color: '#F59E0B', bg: '#FEF3C7', icon: <ClockIcon className="h-5 w-5" /> },
  { title: 'Free consultation', sub: 'No commitment needed', color: '#10B981', bg: '#D1FAE5', icon: <span className="ci-i-bounce block"><GiftIcon className="h-5 w-5" /></span> },
  { title: '100% confidential', sub: 'Your data stays private', color: '#8B5CF6', bg: '#EDE9FE', icon: <LockIcon className="h-5 w-5" /> },
];

const FLOATERS = [
  { pos: 'left-0 top-0', from: '#238ED1', to: '#06B6D4', icon: <SparklesIcon className="h-full w-full" />, anim: 'ci-i-twinkle', delay: 0, rotate: -8, size: 'lg' },
  { pos: 'left-16 top-32', from: '#8B5CF6', to: '#EC4899', icon: <ChartIcon className="h-full w-full" />, anim: 'ci-i-pulse', delay: 1.2, rotate: 6, size: 'sm' },
  { pos: '-left-6 top-60', from: '#F59E0B', to: '#F97316', icon: <ZapIcon className="h-full w-full" />, anim: 'ci-i-flash', delay: 2.1, rotate: -4, size: 'sm' },
  { pos: 'right-0 top-2', from: '#10B981', to: '#14B8A6', icon: <CpuIcon className="h-full w-full" />, anim: 'ci-i-pulse', delay: 0.6, rotate: 8, size: 'lg' },
  { pos: 'right-16 top-32', from: '#EC4899', to: '#F43F5E', icon: <TargetIcon className="h-full w-full" />, anim: 'ci-i-spin', delay: 1.8, rotate: -6, size: 'sm' },
  { pos: '-right-6 top-60', from: '#6366F1', to: '#8B5CF6', icon: <GlobeIcon className="h-full w-full" />, anim: 'ci-i-spin', delay: 0.9, rotate: 5, size: 'sm' },
] as const;

/* ---------------------------- Form state --------------------------- */

type FormState = {
  name: string;
  email: string;
  company: string;
  phone: string;
  types: string[];
  description: string;
  budget: string;
  timeline: string;
};

type Errors = Partial<Record<'name' | 'email' | 'types' | 'description', string>>;

const EMPTY: FormState = {
  name: '',
  email: '',
  company: '',
  phone: '',
  types: [],
  description: '',
  budget: '',
  timeline: '',
};

const validate = (f: FormState): Errors => {
  const e: Errors = {};
  if (!f.name.trim()) e.name = 'Please enter your full name.';
  if (!f.email.trim()) e.email = 'Please enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Please enter a valid email address.';
  if (f.types.length === 0) e.types = 'Select at least one project type.';
  if (!f.description.trim()) e.description = 'Tell us a little about your project.';
  return e;
};

/* ----------------------------- Helpers ----------------------------- */

const soft = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

const cssVars = (o: Record<string, string>) => o as React.CSSProperties;

const useInView = <T extends HTMLElement>() => {
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
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
};

/* --------------------------- Component ----------------------------- */

const ContactSection = () => {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const { ref, inView } = useInView<HTMLElement>();

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const toggleType = (t: string) =>
    set('types', form.types.includes(t) ? form.types.filter((x) => x !== t) : [...form.types, t]);

  const filled =
    [form.name, form.email, form.company, form.phone, form.description, form.budget, form.timeline].filter((v) => v.trim())
      .length + (form.types.length ? 1 : 0);
  const progress = Math.round((filled / 8) * 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    setAttempt((a) => a + 1);
    if (Object.keys(errs).length) return;

    setStatus('sending');
    try {
      // TODO: replace with your real endpoint, e.g.
      // await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      await new Promise((r) => setTimeout(r, 1400));
      setStatus('sent');
    } catch {
      setStatus('idle');
    }
  };

  const reveal = (delay: number) =>
    inView
      ? { className: 'ci-fade-up', style: { animationDelay: `${delay}ms` } as React.CSSProperties }
      : { className: 'opacity-0', style: {} as React.CSSProperties };

  return (
    <section ref={ref} id="contact" className="ci-root relative overflow-hidden bg-white px-5 py-20 md:px-8 md:py-24">
      <style>{STYLES}</style>

      {/* =====================================================
          BACKGROUND
      ===================================================== */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          // fade the coloured background in/out so there is no hard line where the section starts or ends
          maskImage: 'linear-gradient(to bottom, transparent 0%, #000 220px, #000 calc(100% - 220px), transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 220px, #000 calc(100% - 220px), transparent 100%)',
        }}
      >
        <div className="ci-blob absolute -left-24 top-10 h-[380px] w-[380px] rounded-full bg-[#238ED1] opacity-[0.18] blur-[100px]" />
        <div className="ci-blob absolute -right-24 top-40 h-[400px] w-[400px] rounded-full bg-[#8B5CF6] opacity-[0.16] blur-[110px]" style={{ animationDelay: '-5s' }} />
        <div className="ci-blob absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full bg-[#EC4899] opacity-[0.12] blur-[110px]" style={{ animationDelay: '-10s' }} />
        <div className="ci-blob absolute bottom-40 right-1/4 h-[260px] w-[260px] rounded-full bg-[#F59E0B] opacity-[0.10] blur-[100px]" style={{ animationDelay: '-3s' }} />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(#238ED1 1px, transparent 1px)',
            backgroundSize: '22px 22px',
            maskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 75%)',
          }}
        />
      </div>

      {/* =====================================================
          HEADING
      ===================================================== */}
      <div className="relative mx-auto max-w-[1140px] text-center">
        {FLOATERS.map((f, i) => (
          <div
            key={i}
            aria-hidden
            className={`ci-float pointer-events-none absolute hidden items-center justify-center rounded-2xl text-white lg:flex ${f.pos} ${
              f.size === 'lg' ? 'h-14 w-14' : 'h-11 w-11'
            }`}
            style={{
              background: `linear-gradient(135deg, ${f.from}, ${f.to})`,
              boxShadow: `0 14px 30px -10px ${soft(f.from, 0.55)}, inset 0 1px 0 rgba(255,255,255,0.35)`,
              animationDelay: `${f.delay}s`,
              ...cssVars({ '--r': `${f.rotate}deg` }),
            }}
          >
            <span className={`block ${f.size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} ${f.anim}`}>{f.icon}</span>
          </div>
        ))}

        {/* Badge */}
        <div {...reveal(0)}>
          <span className="ci-border inline-flex rounded-full p-px" style={{ backgroundImage: RAINBOW }}>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold text-gray-700">
              <span className="ci-i-spin block text-[#8B5CF6]">
                <SparklesIcon className="h-3.5 w-3.5" />
              </span>
              Get in touch
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
            </span>
          </span>
        </div>

        {/* Headline */}
        <h2
          className={`mt-4 text-[32px] font-semibold leading-[1.1] tracking-[-1.2px] text-black sm:text-[40px] md:text-[46px] ${reveal(100).className}`}
          style={reveal(100).style}
        >
          Ready to Transform{' '}
          <span
            className="ci-text-gradient bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(90deg, #238ED1, #8B5CF6, #EC4899, #F59E0B, #238ED1)' }}
          >
            Your Business?
          </span>
        </h2>

        <p
          className={`mx-auto mt-3 max-w-[460px] text-[13px] leading-[1.6] text-gray-600 md:text-[14px] ${reveal(200).className}`}
          style={reveal(200).style}
        >
          Schedule a free consultation with our experts. We&apos;ll analyze your requirements and provide a
          customized solution roadmap within 24 hours.
        </p>

        {/* Feature pills */}
        <div
          className={`mx-auto mt-8 grid max-w-[680px] gap-3 sm:grid-cols-3 ${reveal(300).className}`}
          style={reveal(300).style}
        >
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex items-center gap-3 rounded-2xl border bg-white/80 px-4 py-3 text-left backdrop-blur transition duration-300 hover:-translate-y-1"
              style={{ borderColor: soft(f.color, 0.25), boxShadow: `0 10px 26px -16px ${soft(f.color, 0.6)}` }}
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: f.bg, color: f.color }}
              >
                {f.icon}
              </span>
              <span>
                <span className="block text-[13px] font-semibold text-gray-900">{f.title}</span>
                <span className="block text-[11px] text-gray-500">{f.sub}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================
          CARD (animated rainbow border)
      ===================================================== */}
      <div
        className={`ci-border relative mx-auto mt-12 max-w-[1140px] rounded-[28px] p-[1.5px] shadow-[0_30px_70px_-30px_rgba(99,102,241,0.45)] ${reveal(400).className}`}
        style={{ ...reveal(400).style, backgroundImage: RAINBOW }}
      >
        <div className="relative overflow-hidden rounded-[27px] bg-gradient-to-b from-[#F1F8FE] via-white to-[#FBF7FF] p-6 md:p-8">
          {/* decorative corner glows */}
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#8B5CF6]/10 blur-2xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-[#238ED1]/10 blur-2xl" />

          {status === 'sent' ? (
            <SuccessPanel
              name={form.name}
              onReset={() => {
                setForm(EMPTY);
                setErrors({});
                setStatus('idle');
              }}
            />
          ) : (
            <form onSubmit={handleSubmit} noValidate className="relative">
              {/* Card header + progress */}
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
                    style={{
                      background: 'linear-gradient(135deg, #238ED1, #8B5CF6)',
                      boxShadow: '0 10px 22px -8px rgba(139,92,246,0.6)',
                    }}
                  >
                    <span className="ci-rocket block">
                      <RocketIcon className="h-5 w-5" />
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[17px] font-semibold text-gray-900">Start Your Project Today</h3>
                    <p className="mt-0.5 text-[13px] text-gray-600">
                      Tell us about your project requirements and we&apos;ll get back to you within 2 hours.
                    </p>
                  </div>
                </div>

                <div className="w-full shrink-0 md:w-[170px]">
                  <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium">
                    <span className="text-gray-500">Form progress</span>
                    <span className="text-[#6366F1]">{progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="ci-border h-full rounded-full transition-[width] duration-500 ease-out"
                      style={{ width: `${progress}%`, backgroundImage: RAINBOW }}
                    />
                  </div>
                </div>
              </div>

              {/* Contact details */}
              <div className="mt-7 grid gap-x-10 gap-y-5 md:grid-cols-2">
                <Field id="ci-name" label="Full Name" required color="#238ED1" icon={<UserIcon />} anim="ci-a-bounce" error={errors.name} attempt={attempt}>
                  <input id="ci-name" type="text" autoComplete="name" placeholder="John Doe" value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls(!!errors.name)} />
                </Field>

                <Field id="ci-email" label="Email Address" required color="#8B5CF6" icon={<MailIcon />} anim="ci-a-fly" error={errors.email} attempt={attempt}>
                  <input id="ci-email" type="email" autoComplete="email" placeholder="john@company.com" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputCls(!!errors.email)} />
                </Field>

                <Field id="ci-company" label="Company Name" color="#F59E0B" icon={<BuildingIcon />} anim="ci-a-bounce">
                  <input id="ci-company" type="text" autoComplete="organization" placeholder="Your Company" value={form.company} onChange={(e) => set('company', e.target.value)} className={inputCls(false)} />
                </Field>

                <Field id="ci-phone" label="Phone Number" color="#10B981" icon={<PhoneIcon />} anim="ci-a-ring">
                  <input id="ci-phone" type="tel" autoComplete="tel" placeholder="+1 (555) 123-4567" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls(false)} />
                </Field>
              </div>

              {/* Project type chips */}
              <fieldset className="mt-6">
                <legend className="mb-3 text-[13px] font-semibold text-gray-800">
                  Project Type * <span className="font-medium text-gray-500">(Select all that apply)</span>
                </legend>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                  {PROJECT_TYPES.map((c) => {
                    const active = form.types.includes(c.label);
                    const Icon = c.icon;
                    return (
                      <button
                        key={c.label}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleType(c.label)}
                        className={`ci-chip group flex items-center justify-center gap-1.5 rounded-full border px-3 py-2.5 text-[11.5px] font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                          active ? 'text-white' : 'bg-white text-gray-800'
                        }`}
                        style={
                          active
                            ? {
                                background: `linear-gradient(135deg, ${c.from}, ${c.to})`,
                                borderColor: 'transparent',
                                boxShadow: `0 10px 22px -10px ${c.from}`,
                              }
                            : { borderColor: soft(c.from, 0.3) }
                        }
                      >
                        {active ? (
                          <CheckIcon className="ci-pop h-3.5 w-3.5 shrink-0" />
                        ) : (
                          <span className={`block shrink-0 ${c.hover}`} style={{ color: c.from }}>
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                        )}
                        <span className="truncate">{c.label}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.types && <ErrorText key={`types-${attempt}`} text={errors.types} />}
              </fieldset>

              {/* Description */}
              <div className="mt-6">
                <Field id="ci-desc" label="Project Description" required color="#EC4899" icon={<MessageIcon />} anim="ci-a-bounce" iconTop error={errors.description} attempt={attempt}>
                  <textarea
                    id="ci-desc"
                    rows={5}
                    maxLength={1000}
                    placeholder="Tell us about your project requirements, timeline, budget range, and specific goals..."
                    value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                    className={`${inputCls(!!errors.description)} resize-none`}
                  />
                  <span className="pointer-events-none absolute bottom-2.5 right-3 text-[11px] font-medium" style={{ color: form.description.length > 900 ? '#EF4444' : '#EC4899' }}>
                    {form.description.length}/1000
                  </span>
                </Field>
              </div>

              {/* Budget + timeline */}
              <div className="mt-6 grid gap-x-10 gap-y-5 md:grid-cols-2">
                <Field id="ci-budget" label="Budget Range" color="#F97316" icon={<WalletIcon />} anim="ci-a-bounce" select>
                  <select id="ci-budget" value={form.budget} onChange={(e) => set('budget', e.target.value)} className={`${inputCls(false)} appearance-none pr-10 ${form.budget ? '' : 'text-gray-400'}`}>
                    <option value="" disabled>Select budget range</option>
                    {BUDGETS.map((b) => (
                      <option key={b} value={b} className="text-gray-800">{b}</option>
                    ))}
                  </select>
                </Field>

                <Field id="ci-timeline" label="Timeline" color="#06B6D4" icon={<CalendarIcon />} anim="ci-a-bounce" select>
                  <select id="ci-timeline" value={form.timeline} onChange={(e) => set('timeline', e.target.value)} className={`${inputCls(false)} appearance-none pr-10 ${form.timeline ? '' : 'text-gray-400'}`}>
                    <option value="" disabled>Select timeline</option>
                    {TIMELINES.map((t) => (
                      <option key={t} value={t} className="text-gray-800">{t}</option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* Consent note */}
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-cyan-50 to-sky-50 px-4 py-3.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  <ShieldCheckIcon className="h-4 w-4" />
                </span>
                <p className="text-[12px] leading-[1.6] text-gray-700">
                  By submitting this form, you agree to our{' '}
                  <a href="/privacy" className="font-semibold text-[#238ED1] underline-offset-2 hover:underline">Privacy Policy</a> and{' '}
                  <a href="/terms" className="font-semibold text-[#8B5CF6] underline-offset-2 hover:underline">Terms of Service</a>.
                  We&apos;ll respond within 2 hours during business hours.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'sending'}
                className={`ci-btn group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl py-3.5 text-[13px] font-semibold text-white shadow-lg shadow-[#8B5CF6]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8B5CF6]/40 disabled:cursor-wait ${
                  status === 'sending' ? 'ci-sending' : ''
                }`}
                style={{ backgroundImage: 'linear-gradient(90deg, #238ED1, #6366F1, #8B5CF6, #EC4899, #238ED1)' }}
              >
                <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/25 transition-transform duration-700 group-hover:translate-x-[400%]" />
                {status === 'sending' ? 'Sending your details…' : 'Send Project Details'}
                <span className="ci-plane-icon block">
                  <PlaneIcon className="h-4 w-4" />
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

const RAINBOW = 'linear-gradient(120deg, #238ED1, #8B5CF6, #EC4899, #F59E0B, #10B981, #238ED1)';

/* ---------------------------- Pieces ------------------------------- */

const inputCls = (hasError: boolean) =>
  `ci-input w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-[13.5px] text-gray-800 outline-none transition-all duration-300 placeholder:text-gray-400 hover:border-gray-300 ${
    hasError ? 'ci-err' : ''
  }`;

const Field = ({
  id,
  label,
  required,
  color,
  icon,
  anim,
  iconTop,
  select,
  error,
  attempt,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  color: string;
  icon: React.ReactNode;
  anim: string;
  iconTop?: boolean;
  select?: boolean;
  error?: string;
  attempt?: number;
  children: React.ReactNode;
}) => (
  <div style={cssVars({ '--c': color, '--c-soft': soft(color, 0.14) })}>
    <label htmlFor={id} className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-gray-800">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {label}
      {required && ' *'}
    </label>
    <div className="ci-field group relative">
      <span
        className={`pointer-events-none absolute left-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-lg transition-transform duration-300 group-focus-within:scale-110 ${
          iconTop ? 'top-2.5' : 'top-1/2 -translate-y-1/2'
        }`}
        style={{ background: 'var(--c-soft)', color: 'var(--c)' }}
      >
        <span className={`block ${anim}`}>{icon}</span>
      </span>
      {children}
      {select && (
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 transition-transform duration-300 group-focus-within:rotate-180" style={{ color: 'var(--c)' }}>
          <ChevronDownIcon className="h-4 w-4" />
        </span>
      )}
    </div>
    {error && <ErrorText key={`${id}-${attempt}`} text={error} />}
  </div>
);

const ErrorText = ({ text }: { text: string }) => (
  <p role="alert" className="ci-shake mt-1.5 flex items-center gap-1 text-[12px] text-red-500">
    <AlertIcon className="h-3.5 w-3.5 shrink-0" />
    {text}
  </p>
);

const CONFETTI_COLORS = ['#238ED1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#06B6D4', '#F97316'];

const SuccessPanel = ({ name, onReset }: { name: string; onReset: () => void }) => (
  <div className="ci-fade-up relative flex flex-col items-center px-4 py-14 text-center">
    <div className="relative flex h-24 w-24 items-center justify-center">
      {/* confetti burst */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const dist = 70 + (i % 3) * 18;
        return (
          <span
            key={i}
            className="ci-confetti absolute left-1/2 top-1/2 block"
            style={{
              width: i % 2 ? 8 : 6,
              height: i % 2 ? 8 : 12,
              borderRadius: i % 3 === 0 ? '9999px' : '2px',
              background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
              animationDelay: `${(i % 4) * 40}ms`,
              ...cssVars({ '--x': `${Math.cos(angle) * dist}px`, '--y': `${Math.sin(angle) * dist}px` }),
            }}
          />
        );
      })}
      <span className="absolute inset-2 animate-ping rounded-full bg-emerald-400/20" />
      <span className="absolute inset-2 rounded-full bg-gradient-to-br from-emerald-50 to-cyan-50" />
      <svg viewBox="0 0 52 52" className="relative h-20 w-20" fill="none">
        <circle cx="26" cy="26" r="24" stroke="url(#ci-ok)" strokeWidth="2.5" className="ci-draw" style={{ strokeDasharray: 151, strokeDashoffset: 151 }} />
        <path d="M16 27l7 7 13-14" stroke="url(#ci-ok)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="ci-draw" style={{ strokeDasharray: 36, strokeDashoffset: 36, animationDelay: '0.45s' }} />
        <defs>
          <linearGradient id="ci-ok" x1="0" y1="0" x2="52" y2="52" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10B981" />
            <stop offset="1" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    <h3 className="mt-6 text-[22px] font-semibold text-gray-900">
      Thanks{name ? `, ${name.split(' ')[0]}` : ''}!{' '}
      <span className="ci-text-gradient bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #10B981, #06B6D4, #238ED1, #10B981)' }}>
        We&apos;ve got your details.
      </span>
    </h3>
    <p className="mt-2 max-w-[420px] text-[13.5px] leading-[1.6] text-gray-600">
      One of our experts will reach out within 2 hours during business hours with next steps and a tailored roadmap.
    </p>
    <button
      type="button"
      onClick={onReset}
      className="mt-6 rounded-xl border border-[#8B5CF6]/30 bg-white px-5 py-2.5 text-[12px] font-semibold text-[#6366F1] transition hover:-translate-y-0.5 hover:bg-[#F5F3FF]"
    >
      Send another request
    </button>
  </div>
);

/* ----------------------------- Icons ------------------------------- */

type IconProps = { className?: string };

const Svg = ({ className = 'h-4 w-4', children }: IconProps & { children: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    {children}
  </svg>
);

function UserIcon(p: IconProps) { return <Svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></Svg>; }
function MailIcon(p: IconProps) { return <Svg {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></Svg>; }
function BuildingIcon(p: IconProps) { return <Svg {...p}><path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16" /><path d="M15 9h4a1 1 0 0 1 1 1v11" /><path d="M8 8h3M8 12h3M8 16h3M3 21h18" /></Svg>; }
function PhoneIcon(p: IconProps) { return <Svg {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></Svg>; }
function MessageIcon(p: IconProps) { return <Svg {...p}><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9h8M8 12h5" /></Svg>; }
function WalletIcon(p: IconProps) { return <Svg {...p}><path d="M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1z" /><path d="M4 7l11-3v3" /><circle cx="16" cy="13.5" r="1.2" /></Svg>; }
function CalendarIcon(p: IconProps) { return <Svg {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></Svg>; }
function ChevronDownIcon(p: IconProps) { return <Svg {...p}><path d="M6 9l6 6 6-6" /></Svg>; }
function CheckIcon(p: IconProps) { return <Svg {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></Svg>; }
function AlertIcon(p: IconProps) { return <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8v4.5M12 16h.01" /></Svg>; }
function PlaneIcon(p: IconProps) { return <Svg {...p}><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4z" /></Svg>; }
function RocketIcon(p: IconProps) { return <Svg {...p}><path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2" /><path d="M9 15l-3-3c1-4 4-8 11-9-1 7-5 10-9 11z" /><circle cx="14.5" cy="9.5" r="1.5" /></Svg>; }
function SparklesIcon(p: IconProps) { return <Svg {...p}><path d="M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8z" /><path d="M19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z" /></Svg>; }
function ChartIcon(p: IconProps) { return <Svg {...p}><path d="M3 20h18" /><path d="M6 16v-3M11 16v-6M16 16v-4" /><path d="M5 9l5-4 4 3 5-4" /></Svg>; }
function CpuIcon(p: IconProps) { return <Svg {...p}><rect x="6" y="6" width="12" height="12" rx="2" /><rect x="9.5" y="9.5" width="5" height="5" rx="1" /><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" /></Svg>; }
function TargetIcon(p: IconProps) { return <Svg {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></Svg>; }
function GlobeIcon(p: IconProps) { return <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></Svg>; }
function ZapIcon(p: IconProps) { return <Svg {...p}><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></Svg>; }
function GearIcon(p: IconProps) { return <Svg {...p}><circle cx="12" cy="12" r="3.5" /><path d="M12 2v3M12 19v3M4.9 4.9L7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1" /></Svg>; }
function CapIcon(p: IconProps) { return <Svg {...p}><path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11v5c3 2 9 2 12 0v-5" /><path d="M22 9v5" /></Svg>; }
function BotIcon(p: IconProps) { return <Svg {...p}><rect x="4" y="8" width="16" height="12" rx="3" /><path d="M12 4v4M9 13h.01M15 13h.01M9 17h6" /><circle cx="12" cy="3" r="1" /></Svg>; }
function LayersIcon(p: IconProps) { return <Svg {...p}><path d="M12 3l9 5-9 5-9-5z" /><path d="M3 13l9 5 9-5" /></Svg>; }
function GiftIcon(p: IconProps) { return <Svg {...p}><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M5 12v8h14v-8M12 8v12" /><path d="M12 8c-2 0-4-1-4-3 0-1.5 2-2 4 3 2-5 4-4.5 4-3 0 2-2 3-4 3z" /></Svg>; }
function ClockIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 12V7.5" className="ci-hand-h" />
      <path d="M12 12h3.5" className="ci-hand-m" />
    </Svg>
  );
}
function LockIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" className="ci-shackle" />
      <path d="M12 15v2" />
    </Svg>
  );
}
function ShieldCheckIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" className="ci-draw" style={{ strokeDasharray: 12, strokeDashoffset: 12, animationDelay: '0.8s' }} />
    </Svg>
  );
}

/* ----------------------------- Styles ------------------------------ */

const STYLES = `
  @keyframes ci-float   { 0%,100% { transform: translateY(0) rotate(var(--r,0deg)); } 50% { transform: translateY(-12px) rotate(var(--r,0deg)); } }
  @keyframes ci-blob    { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(40px,-30px) scale(1.1); } 66% { transform: translate(-30px,20px) scale(.92); } }
  @keyframes ci-gradient{ 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
  @keyframes ci-spin    { to { transform: rotate(360deg); } }
  @keyframes ci-bounce  { 0%,100% { transform: translateY(0) scale(1); } 40% { transform: translateY(-4px) scale(1.18); } 70% { transform: translateY(1px) scale(.96); } }
  @keyframes ci-ring    { 0%,100% { transform: rotate(0); } 15% { transform: rotate(-18deg); } 30% { transform: rotate(14deg); } 45% { transform: rotate(-10deg); } 60% { transform: rotate(6deg); } 75% { transform: rotate(-3deg); } }
  @keyframes ci-fly     { 0% { transform: translateX(0); opacity: 1; } 40% { transform: translate(8px,-3px); opacity: 0; } 41% { transform: translateX(-8px); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
  @keyframes ci-pop     { 0% { transform: scale(0) rotate(-45deg); } 70% { transform: scale(1.3) rotate(0); } 100% { transform: scale(1); } }
  @keyframes ci-rocket  { 0%,100% { transform: translate(0,0) rotate(0); } 50% { transform: translate(2px,-3px) rotate(-4deg); } }
  @keyframes ci-shake   { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-5px); } 40% { transform: translateX(5px); } 60% { transform: translateX(-3px); } 80% { transform: translateX(3px); } }
  @keyframes ci-draw    { to { stroke-dashoffset: 0; } }
  @keyframes ci-fade-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes ci-twinkle { 0%,100% { transform: scale(1) rotate(0); opacity: 1; } 50% { transform: scale(.78) rotate(25deg); opacity: .75; } }
  @keyframes ci-wiggle  { 0%,100% { transform: rotate(0); } 25% { transform: rotate(-12deg); } 75% { transform: rotate(12deg); } }
  @keyframes ci-pulse   { 0%,100% { transform: scale(1); } 50% { transform: scale(1.14); } }
  @keyframes ci-flash   { 0%,40%,100% { opacity: 1; transform: scale(1); } 45% { opacity: .35; } 50% { opacity: 1; transform: scale(1.15); } 55% { opacity: .4; } 60% { opacity: 1; transform: scale(1); } }
  @keyframes ci-shackle { 0%,35%,100% { transform: translateY(0); } 50%,70% { transform: translateY(-2.5px); } }
  @keyframes ci-plane   { 0% { transform: translate(0,0); opacity: 1; } 45% { transform: translate(14px,-14px); opacity: 0; } 46% { transform: translate(-14px,14px); opacity: 0; } 100% { transform: translate(0,0); opacity: 1; } }
  @keyframes ci-confetti{ 0% { transform: translate(-50%,-50%) scale(.3); opacity: 1; } 100% { transform: translate(-50%,-50%) translate(var(--x),var(--y)) rotate(220deg) scale(1); opacity: 0; } }

  .ci-root .ci-float         { animation: ci-float 6s ease-in-out infinite; }
  .ci-root .ci-blob          { animation: ci-blob 18s ease-in-out infinite; }
  .ci-root .ci-border        { background-size: 300% 300%; animation: ci-gradient 8s ease infinite; }
  .ci-root .ci-text-gradient { background-size: 300% 100%; animation: ci-gradient 6s ease infinite; }
  .ci-root .ci-btn           { background-size: 300% 100%; animation: ci-gradient 6s ease infinite; }
  .ci-root .ci-rocket        { animation: ci-rocket 2.4s ease-in-out infinite; }
  .ci-root .ci-pop           { animation: ci-pop .4s cubic-bezier(.34,1.56,.64,1) both; }
  .ci-root .ci-shake         { animation: ci-shake .45s ease; }
  .ci-root .ci-draw          { animation: ci-draw .6s ease-out forwards; }
  .ci-root .ci-fade-up       { animation: ci-fade-up .7s cubic-bezier(.22,1,.36,1) both; }
  .ci-root .ci-confetti      { animation: ci-confetti 1.1s cubic-bezier(.2,.7,.3,1) forwards; }

  /* idle icon motions */
  .ci-root .ci-i-twinkle { animation: ci-twinkle 2.4s ease-in-out infinite; }
  .ci-root .ci-i-spin    { animation: ci-spin 8s linear infinite; }
  .ci-root .ci-i-pulse   { animation: ci-pulse 2s ease-in-out infinite; }
  .ci-root .ci-i-flash   { animation: ci-flash 3s linear infinite; }
  .ci-root .ci-i-bounce  { animation: ci-bounce 2.2s ease-in-out infinite; }
  .ci-root .ci-hand-h    { transform-origin: 12px 12px; animation: ci-spin 12s linear infinite; }
  .ci-root .ci-hand-m    { transform-origin: 12px 12px; animation: ci-spin 2s linear infinite; }
  .ci-root .ci-shackle   { animation: ci-shackle 2.6s ease-in-out infinite; }

  /* chip hover motions */
  .ci-root .ci-chip:hover .ci-h-spin   { animation: ci-spin 1.2s linear infinite; }
  .ci-root .ci-chip:hover .ci-h-wiggle { animation: ci-wiggle .5s ease-in-out 2; }
  .ci-root .ci-chip:hover .ci-h-bounce { animation: ci-bounce .6s ease; }
  .ci-root .ci-chip:hover .ci-h-pulse  { animation: ci-pulse .8s ease-in-out infinite; }
  .ci-root .ci-chip:hover .ci-h-flash  { animation: ci-flash 1.2s linear infinite; }

  /* coloured focus per field */
  .ci-root .ci-field:focus-within .ci-input        { border-color: var(--c); box-shadow: 0 0 0 4px var(--c-soft); }
  .ci-root .ci-input.ci-err                        { border-color: #FCA5A5; }
  .ci-root .ci-field:focus-within .ci-input.ci-err { border-color: #F87171; box-shadow: 0 0 0 4px rgba(248,113,113,.15); }
  .ci-root .ci-field:focus-within .ci-a-bounce     { animation: ci-bounce .6s ease; }
  .ci-root .ci-field:focus-within .ci-a-ring       { animation: ci-ring .8s ease; }
  .ci-root .ci-field:focus-within .ci-a-fly        { animation: ci-fly .6s ease; }

  /* send button plane */
  .ci-root .ci-btn:hover .ci-plane-icon     { animation: ci-plane .7s ease; }
  .ci-root .ci-sending .ci-plane-icon       { animation: ci-plane 1s ease-in-out infinite; }

  @media (prefers-reduced-motion: reduce) {
    .ci-root *, .ci-root *::before, .ci-root *::after { animation: none !important; transition: none !important; }
    .ci-root .ci-draw { stroke-dashoffset: 0 !important; }
    .ci-root .opacity-0 { opacity: 1 !important; }
  }
`;

export default ContactSection;