// 'use client';

// import React, { useEffect, useRef, useState } from 'react';

// const ProcessAndCta = () => {
//   // which step's content is currently in the middle of the screen
//   const [activeStep, setActiveStep] = useState(0);
//   const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

//   useEffect(() => {
//     const io = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             setActiveStep(Number((entry.target as HTMLElement).dataset.step));
//           }
//         });
//       },
//       // a thin line at 45% of the screen height: the step crossing it is the active one
//       { rootMargin: '-45% 0px -55% 0px' }
//     );
//     stepRefs.current.forEach((el) => el && io.observe(el));
//     return () => io.disconnect();
//   }, []);

//   return (
//     <div className="w-full bg-white">
//       {/* ==========================================
//           SECTION 1: PROVEN METHODOLOGY (OUR PROCESS)
//       ========================================== */}
//       <section className="w-full py-24 px-6 md:px-12 flex justify-center">
//         <div className="max-w-[1000px] w-full">
          
//           {/* Top Label */}
//           <div className="inline-block px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-[#166ba8] text-xs font-semibold mb-4">
//             Our Process
//           </div>

//           {/* Heading */}
//           <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f172a] mb-4">
//             Proven Methodology for Success
//           </h2>

//           {/* Subheading */}
//           <p className="text-slate-600 text-sm md:text-base max-w-2xl mb-16">
//             Our battle-tested 4-phase approach ensures successful project delivery with clear timelines, measurable outcomes, and transparent communication at every step.
//           </p>

//           {/* Process Steps */}
//           <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
//             {/* Left: ONE graphic that stays in place and changes shape per step */}
//             <div className="w-full md:w-1/3 shrink-0 sticky top-16 z-10 bg-white/90 backdrop-blur-sm md:static md:self-stretch md:bg-transparent md:backdrop-blur-none">
//               <div className="flex justify-center md:justify-start py-3 md:py-0 md:sticky md:top-32">
//                 <MorphingGraphic active={activeStep} className="w-40 h-28 md:w-56 md:h-40 text-[#2b8fd9]" />
//               </div>
//             </div>

//             {/* Right: content scrolls */}
//             <div className="w-full md:w-2/3 flex flex-col gap-12">
//               {/* Step 1 */}
//               <div
//                 ref={(el) => {
//                   stepRefs.current[0] = el;
//                 }}
//                 data-step={0}
//                 className="flex flex-col border-b border-gray-200 pb-12"
//               >
//                 <h3 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-1">
//                   Discovery <span className="text-[#2b8fd9]">& Analysis</span>
//                 </h3>
//                 <p className="text-slate-800 font-semibold text-sm mb-4">1-2 weeks</p>
//                 <p className="text-slate-600 text-sm mb-6 leading-relaxed">
//                   Deep dive into your business processes, requirements, and existing technology stack.
//                 </p>

//                 {/* Tags */}
//                 <div className="flex flex-wrap gap-2 mb-6">
//                   {['Current state assessment', 'Gap analysis report', 'Technology audit', 'Stakeholder interviews'].map((tag) => (
//                     <span key={tag} className="border border-gray-300 text-slate-700 text-xs font-medium px-4 py-1.5 rounded-full bg-white">
//                       {tag}
//                     </span>
//                   ))}
//                 </div>

//                 {/* Key Outcome Box */}
//                 <div className="bg-[#f0f7ff] border border-blue-100 rounded-lg p-4">
//                   <p className="text-[#166ba8] font-semibold text-xs mb-1">Key Outcome</p>
//                   <p className="text-slate-700 text-sm">Clear understanding of project scope and requirements</p>
//                 </div>
//               </div>

//               {/* Step 2 (Duplicate for visual consistency as per screenshot) */}
//               <div
//                 ref={(el) => {
//                   stepRefs.current[1] = el;
//                 }}
//                 data-step={1}
//                 className="flex flex-col"
//               >
//                 <h3 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-1">
//                   Discovery <span className="text-[#2b8fd9]">& Analysis</span>
//                 </h3>
//                 <p className="text-slate-800 font-semibold text-sm mb-4">1-2 weeks</p>
//                 <p className="text-slate-600 text-sm mb-6 leading-relaxed">
//                   Deep dive into your business processes, requirements, and existing technology stack.
//                 </p>
//                 <div className="flex flex-wrap gap-2 mb-6">
//                   {['Current state assessment', 'Gap analysis report', 'Technology audit', 'Stakeholder interviews'].map((tag) => (
//                     <span key={tag} className="border border-gray-300 text-slate-700 text-xs font-medium px-4 py-1.5 rounded-full bg-white">
//                       {tag}
//                     </span>
//                   ))}
//                 </div>
//                 <div className="bg-[#f0f7ff] border border-blue-100 rounded-lg p-4">
//                   <p className="text-[#166ba8] font-semibold text-xs mb-1">Key Outcome</p>
//                   <p className="text-slate-700 text-sm">Clear understanding of project scope and requirements</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// // ==========================================
// // MORPHING GRAPHIC
// // ------------------------------------------
// // Built from 4 half-circle pieces + 1 dot. Each step has its own
// // arrangement of those pieces; when the active step changes, every
// // piece glides, turns and flips into its new place.
// //   Step 1 → stacked leaves (sprout)
// //   Step 2 → pinwheel
// //   Step 3 → four-petal flower
// //   Step 4 → wave
// // Add more steps and they cycle through the shapes.
// // ==========================================

// // A half circle in local coordinates: flat edge from (0,0) up to (0,-70.7), round side bulging left
// const PIECE_PATH = 'M0 0 C -47.13 0, -47.13 -70.7, 0 -70.7 Z';

// type Piece = { x: number; y: number; r: number; s: number; fx: number };
// type Dot = { x: number; y: number; r: number };
// type Pose = { pieces: Piece[]; dot: Dot };

// const SHAPES: Pose[] = [
//   // 1. Sprout: two stacked pairs of leaves, dot to the side
//   {
//     pieces: [
//       { x: 50, y: 50, r: -45, s: 1, fx: 1 },
//       { x: 50, y: 50, r: 45, s: 1, fx: -1 },
//       { x: 50, y: 100, r: 45, s: 1, fx: -1 },
//       { x: 50, y: 100, r: -45, s: 1, fx: 1 },
//     ],
//     dot: { x: 140, y: 62, r: 3.6 },
//   },
//   // 2. Pinwheel, dot below-right
//   {
//     pieces: [
//       { x: 52, y: 55, r: -28, s: 0.85, fx: -1 },
//       { x: 52, y: 55, r: 62, s: 0.85, fx: -1 },
//       { x: 52, y: 55, r: 152, s: 0.85, fx: -1 },
//       { x: 52, y: 55, r: 242, s: 0.85, fx: -1 },
//     ],
//     dot: { x: 128, y: 100, r: 4 },
//   },
//   // 3. Flower: half circles on the four sides of a square, dot grows to fill the middle
//   {
//     pieces: [
//       { x: 35, y: 32, r: 90, s: 0.566, fx: 1 },
//       { x: 75, y: 32, r: 180, s: 0.566, fx: 1 },
//       { x: 75, y: 72, r: 270, s: 0.566, fx: 1 },
//       { x: 35, y: 72, r: 0, s: 0.566, fx: 1 },
//     ],
//     dot: { x: 55, y: 52, r: 28.3 },
//   },
//   // 4. Wave: half circles in a row, alternating up and down, dot leading the way
//   {
//     pieces: [
//       { x: 8, y: 55, r: 90, s: 0.4243, fx: 1 },
//       { x: 38, y: 55, r: 90, s: 0.4243, fx: -1 },
//       { x: 68, y: 55, r: 90, s: 0.4243, fx: 1 },
//       { x: 98, y: 55, r: 90, s: 0.4243, fx: -1 },
//     ],
//     dot: { x: 144, y: 40, r: 5 },
//   },
// ];

// const MORPH_MS = 900;

// const clamp = (v: number) => Math.min(1, Math.max(0, v));
// const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
// const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
// const turn = (from: number, to: number) => ((((to - from) % 360) + 540) % 360) - 180; // shortest rotation

// const mixPose = (a: Pose, b: Pose, t: number): Pose => ({
//   pieces: a.pieces.map((p, i) => {
//     const q = b.pieces[i];
//     const k = ease(clamp((t - i * 0.06) / 0.82)); // pieces move one after another
//     return {
//       x: lerp(p.x, q.x, k),
//       y: lerp(p.y, q.y, k),
//       r: p.r + turn(p.r, q.r) * k,
//       s: lerp(p.s, q.s, k),
//       fx: lerp(p.fx, q.fx, k),
//     };
//   }),
//   dot: (() => {
//     const k = ease(clamp((t - 0.15) / 0.85));
//     return { x: lerp(a.dot.x, b.dot.x, k), y: lerp(a.dot.y, b.dot.y, k), r: lerp(a.dot.r, b.dot.r, k) };
//   })(),
// });

// const pieceTransform = (p: Piece) => `translate(${p.x} ${p.y}) rotate(${p.r}) scale(${p.fx * p.s} ${p.s})`;

// const MorphingGraphic = ({ active, className }: IconProps & { active: number }) => {
//   const groupRef = useRef<SVGGElement>(null);
//   const pieceRefs = useRef<(SVGPathElement | null)[]>([]);
//   const dotRef = useRef<SVGCircleElement>(null);
//   const poseRef = useRef<Pose>(SHAPES[0]);

//   useEffect(() => {
//     const target = SHAPES[active % SHAPES.length];
//     const from = poseRef.current;
//     const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
//     const start = performance.now();
//     let raf = 0;

//     const frame = (now: number) => {
//       const t = reduceMotion ? 1 : clamp((now - start) / MORPH_MS);
//       const pose = mixPose(from, target, t);
//       poseRef.current = pose;

//       pose.pieces.forEach((p, i) => pieceRefs.current[i]?.setAttribute('transform', pieceTransform(p)));
//       const dot = dotRef.current;
//       if (dot) {
//         dot.setAttribute('cx', String(pose.dot.x));
//         dot.setAttribute('cy', String(pose.dot.y));
//         dot.setAttribute('r', String(pose.dot.r));
//       }
//       // small "breath" of the whole graphic while it changes
//       const squeeze = 1 - 0.06 * Math.sin(Math.PI * t);
//       groupRef.current?.setAttribute('transform', `translate(70 55) scale(${squeeze}) translate(-70 -55)`);

//       if (t < 1) raf = requestAnimationFrame(frame);
//     };

//     raf = requestAnimationFrame(frame);
//     return () => cancelAnimationFrame(raf);
//   }, [active]);

//   const first = SHAPES[0];

//   return (
//     <svg viewBox="-14 -6 170 122" fill="currentColor" className={className} aria-hidden>
//       <g ref={groupRef}>
//         {first.pieces.map((p, i) => (
//           <path
//             key={i}
//             ref={(el) => {
//               pieceRefs.current[i] = el;
//             }}
//             d={PIECE_PATH}
//             transform={pieceTransform(p)}
//           />
//         ))}
//         <circle ref={dotRef} cx={first.dot.x} cy={first.dot.y} r={first.dot.r} />
//       </g>
//     </svg>
//   );
// };

// // ==========================================
// // REUSABLE ICONS & GRAPHICS
// // ==========================================

// type IconProps = {
//   className?: string;
// };

// // Custom SVG for the abstract "Leaves" graphic
// const AbstractLeafGraphic = ({ className }: IconProps) => (
//   <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
//     {/* Top Left Leaf */}
//     <path d="M45 10 C 30 10, 10 30, 10 50 C 30 50, 45 30, 45 10 Z" />
//     {/* Top Right Leaf */}
//     <path d="M55 10 C 70 10, 90 30, 90 50 C 70 50, 55 30, 55 10 Z" />
//     {/* Bottom Left Leaf */}
//     <path d="M45 55 C 30 55, 10 75, 10 95 C 30 95, 45 75, 45 55 Z" />
//     {/* Bottom Right Leaf */}
//     <path d="M55 55 C 70 55, 90 75, 90 95 C 70 95, 55 75, 55 55 Z" />
//   </svg>
// );

// const DownloadIcon = ({ className }: IconProps) => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
//     <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
//     <polyline points="7 10 12 15 17 10" />
//     <line x1="12" y1="15" x2="12" y2="3" />
//   </svg>
// );

// const BoltIcon = ({ className }: IconProps) => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
//     <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
//   </svg>
// );

// export default ProcessAndCta;

'use client';

import React, { useEffect, useRef, useState } from 'react';

/* =====================================================================
   OUR PROCESS — "Proven Methodology for Success"
   - Left: ONE big brand-blue graphic that stays in place (sticky) and
     morphs into a shape that matches each step as you scroll:
       1 Discovery & Analysis        → magnifying glass
       2 Solution Design             → design star (four-point spark)
       3 Development & Implementation → rocket
       4 Optimization & Transfer     → rising growth leaves
   - Under it: step counter + progress line + step name & duration
   - Right: the four steps scroll past with deliverables + key outcome
   - Works in light + dark mode
   NOTE: every className is on one line (avoids the Windows \r\n hydration error)
===================================================================== */

type Step = {
  title: [string, string]; // [dark part, blue part]
  duration: string;
  text: string;
  deliverables: string[];
  outcome: string;
  icon: 'search' | 'pen' | 'rocket' | 'chart';
};

const STEPS: Step[] = [
  {
    title: ['Discovery', '& Analysis'],
    duration: '1-2 weeks',
    text: 'Deep dive into your business processes, requirements, and existing technology stack.',
    deliverables: ['Current state assessment', 'Gap analysis report', 'Technology audit', 'Stakeholder interviews'],
    outcome: 'Clear understanding of project scope and requirements',
    icon: 'search',
  },
  {
    title: ['Solution', 'Design'],
    duration: '2-3 weeks',
    text: 'Custom solution architecture and detailed project roadmap tailored to your needs.',
    deliverables: ['Technical architecture', 'Project timeline', 'Resource allocation plan', 'Risk assessment'],
    outcome: 'Comprehensive project blueprint and implementation strategy',
    icon: 'pen',
  },
  {
    title: ['Development', '& Implementation'],
    duration: '8-16 weeks',
    text: 'Agile development with weekly sprints, continuous testing, and regular stakeholder updates.',
    deliverables: ['MVP development', 'Testing & QA', 'Documentation', 'Team training'],
    outcome: 'Fully functional solution with trained team',
    icon: 'rocket',
  },
  {
    title: ['Optimization', '& Transfer'],
    duration: '4-8 weeks',
    text: 'Performance monitoring, optimization, and knowledge transfer to your internal team.',
    deliverables: ['Performance optimization', 'Knowledge transfer', 'Handover documentation', 'Ongoing support plan'],
    outcome: 'Self-sustaining solution with internal team ownership',
    icon: 'chart',
  },
];

/* ------------------------------ helpers ------------------------------ */

function clamp(v: number) {
  return Math.min(1, Math.max(0, v));
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
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

/* -------------------------------- section ------------------------------ */

const ProcessAndCta = () => {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { ref: headRef, inView: headIn } = useInView<HTMLDivElement>(0.3);

  // the step crossing the middle of the screen is the active one
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveStep(Number((entry.target as HTMLElement).dataset.step));
        });
      },
      { rootMargin: '-45% 0px -55% 0px' }
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const current = STEPS[activeStep];

  return (
    <div className="pc-root w-full bg-white dark:bg-[#0B1220]">
      <style>{STYLES}</style>

      <section className="w-full py-24 px-6 md:px-12 flex justify-center">
        <div className="max-w-[1200px] w-full">
          {/* Heading */}
          <div ref={headRef} className={`pc-reveal ${headIn ? 'pc-in' : ''}`}>
            <div className="inline-block px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-[#166ba8] text-xs font-semibold mb-4 dark:border-white/10 dark:bg-[#238ED1]/10 dark:text-[#6CC4F5]">
              Our Process
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f172a] mb-4 dark:text-white">Proven Methodology for Success</h2>
            <p className="text-slate-600 text-sm md:text-base max-w-2xl mb-16 dark:text-slate-400">
              Our battle-tested 4-phase approach ensures successful project delivery with clear timelines, measurable outcomes, and transparent communication at every step.
            </p>
          </div>

          {/* Steps */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
            {/* Left: ONE big graphic that stays in place and changes shape per step */}
            <div className="w-full md:w-[40%] shrink-0 sticky top-16 z-10 bg-white/90 backdrop-blur-sm md:static md:self-stretch md:bg-transparent md:backdrop-blur-none dark:bg-[#0B1220]/90 md:dark:bg-transparent">
              <div className="flex flex-col items-center gap-5 py-3 md:items-start md:py-0 md:sticky md:top-28">
                <MorphingGraphic active={activeStep} className="h-36 w-52 md:h-[250px] md:w-[350px] text-[#238ED1]" />

                {/* counter + progress */}
                <div className="hidden w-full max-w-[350px] md:block">
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-semibold tabular-nums text-[#238ED1]">{String(activeStep + 1).padStart(2, '0')}</span>
                    <span className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                      <span className="absolute inset-y-0 left-0 rounded-full bg-[#238ED1] transition-all duration-700 ease-out" style={{ width: `${((activeStep + 1) / STEPS.length) * 100}%` }} />
                    </span>
                    <span className="text-[13px] font-medium tabular-nums text-slate-400">{String(STEPS.length).padStart(2, '0')}</span>
                  </div>
                  <div key={activeStep} className="pc-label mt-3">
                    <p className="text-[15px] font-semibold text-[#0f172a] dark:text-white">{current.title.join(' ')}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-slate-500 dark:text-slate-400">
                      <ClockIcon className="h-3.5 w-3.5" />
                      {current.duration}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: steps scroll past */}
            <div className="w-full md:w-[60%] flex flex-col">
              {STEPS.map((s, i) => (
                <div
                  key={s.title.join(' ')}
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                  data-step={i}
                  className={`py-12 md:py-16 ${i === 0 ? 'md:pt-0' : ''} ${i < STEPS.length - 1 ? 'border-b border-gray-200 dark:border-white/10' : ''}`}
                >
                  <StepContent s={s} index={i} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const StepContent = ({ s, index }: { s: Step; index: number }) => {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const d = (ms: number) => ({ animationDelay: `${ms}ms` });

  return (
    <div ref={ref} className={inView ? 'pc-in' : ''}>
      <div className="pc-up flex items-center gap-3" style={d(0)}>
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#238ED1] to-[#166ba8] text-white shadow-[0_10px_22px_-10px_rgba(35,142,209,0.8)]">
          <StepIcon name={s.icon} />
        </span>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-[12px] font-semibold text-[#166ba8] dark:bg-[#238ED1]/10 dark:text-[#6CC4F5]">Step {index + 1}</span>
        <span className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-700 dark:text-slate-300">
          <ClockIcon className="h-4 w-4" />
          {s.duration}
        </span>
      </div>

      <h3 className="pc-up mt-5 text-2xl md:text-3xl font-bold text-[#0f172a] dark:text-white" style={d(80)}>
        {s.title[0]} <span className="text-[#238ED1]">{s.title[1]}</span>
      </h3>
      <p className="pc-up mt-3 text-slate-600 text-[15px] leading-relaxed dark:text-slate-400" style={d(140)}>{s.text}</p>

      <h4 className="pc-up mt-6 flex items-center gap-2 text-[15px] font-semibold text-[#0f172a] dark:text-white" style={d(200)}>
        <TargetIcon className="h-4 w-4 text-[#238ED1]" />
        Deliverables
      </h4>
      <div className="mt-3 flex flex-wrap gap-2">
        {s.deliverables.map((t, k) => (
          <span key={t} className="pc-pop inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 py-1.5 text-xs font-medium text-slate-700 transition-colors duration-300 hover:border-[#238ED1] hover:text-[#238ED1] dark:border-white/15 dark:bg-white/5 dark:text-slate-300" style={d(260 + k * 70)}>
            <CheckIcon className="h-3.5 w-3.5 text-green-500" />
            {t}
          </span>
        ))}
      </div>

      <div className="pc-up mt-6 rounded-lg border border-blue-100 bg-[#f0f7ff] p-4 dark:border-white/10 dark:bg-[#238ED1]/10" style={d(540)}>
        <p className="mb-1 text-xs font-semibold text-[#166ba8] dark:text-[#6CC4F5]">Key Outcome</p>
        <p className="text-sm text-slate-700 dark:text-slate-300">{s.outcome}</p>
      </div>
    </div>
  );
};

/* =====================================================================
   MORPHING GRAPHIC — 4 pieces + 1 dot
   Each piece can be a pointed LEAF (k = 0) or a HALF CIRCLE (k = 1).
   Local piece: base at (0,0), tip at (0,-70.7); fx = 1 bulges left
   (half circle), fx = -1 bulges right.
===================================================================== */

const L = 70.7;

const piecePath = (k: number) => {
  const a = lerp(0.276, 0.6667, k) * L;
  const p = lerp(0.276, 0, k) * L;
  const b = lerp(0.276, 0, k) * L;
  const q = lerp(0.276, 0.333, k) * L;
  const f = (n: number) => n.toFixed(2);
  return `M0 0 C ${f(-a)} ${f(-p)}, ${f(-a)} ${f(-(L - p))}, 0 ${f(-L)} C ${f(b)} ${f(-(L - q))}, ${f(b)} ${f(-q)}, 0 0 Z`;
};

type Piece = { x: number; y: number; r: number; s: number; fx: number; k: number };
type Dot = { x: number; y: number; r: number; ring: number };
type Pose = { pieces: Piece[]; dot: Dot };

const SHAPES: Pose[] = [
  // 1. Discovery & Analysis → magnifying glass
  {
    pieces: [
      { x: 55, y: 80, r: 0, s: 0.99, fx: 1, k: 1 }, // lens, left half
      { x: 55, y: 10, r: 180, s: 0.99, fx: 1, k: 1 }, // lens, right half
      { x: 128, y: 112, r: -45, s: 0.9, fx: -1, k: 0 }, // handle
      { x: 120, y: 104, r: -45, s: 0.55, fx: -1, k: 0 }, // handle (inner)
    ],
    dot: { x: 42, y: 32, r: 7, ring: 3 }, // glint on the lens
  },
  // 2. Solution Design → four-point design star
  {
    pieces: [
      { x: 70, y: 55, r: 0, s: 0.72, fx: -1, k: 0 },
      { x: 70, y: 55, r: 90, s: 0.72, fx: -1, k: 0 },
      { x: 70, y: 55, r: 180, s: 0.72, fx: -1, k: 0 },
      { x: 70, y: 55, r: 270, s: 0.72, fx: -1, k: 0 },
    ],
    dot: { x: 70, y: 55, r: 7, ring: 2.5 },
  },
  // 3. Development & Implementation → rocket
  {
    pieces: [
      { x: 70, y: 96, r: 0, s: 1.22, fx: -1, k: 0 }, // body
      { x: 56, y: 100, r: 0, s: 0.42, fx: 1, k: 1 }, // left fin
      { x: 84, y: 100, r: 0, s: 0.42, fx: -1, k: 1 }, // right fin
      { x: 70, y: 92, r: 180, s: 0.32, fx: -1, k: 0 }, // flame
    ],
    dot: { x: 70, y: 48, r: 6.5, ring: 2.5 }, // window
  },
  // 4. Optimization & Transfer → rising growth leaves
  {
    pieces: [
      { x: 18, y: 106, r: 0, s: 0.45, fx: -1, k: 0 },
      { x: 50, y: 106, r: 0, s: 0.66, fx: -1, k: 0 },
      { x: 82, y: 106, r: 0, s: 0.87, fx: -1, k: 0 },
      { x: 114, y: 106, r: 0, s: 1.08, fx: -1, k: 0 },
    ],
    dot: { x: 142, y: 14, r: 6, ring: 0 }, // the peak
  },
];

const MORPH_MS = 950;
const turn = (from: number, to: number) => ((((to - from) % 360) + 540) % 360) - 180;

const mixPose = (a: Pose, b: Pose, t: number): Pose => ({
  pieces: a.pieces.map((p, i) => {
    const q = b.pieces[i];
    const e = ease(clamp((t - i * 0.06) / 0.82));
    return {
      x: lerp(p.x, q.x, e),
      y: lerp(p.y, q.y, e),
      r: p.r + turn(p.r, q.r) * e,
      s: lerp(p.s, q.s, e),
      fx: lerp(p.fx, q.fx, e),
      k: lerp(p.k, q.k, e),
    };
  }),
  dot: (() => {
    const e = ease(clamp((t - 0.15) / 0.85));
    return {
      x: lerp(a.dot.x, b.dot.x, e),
      y: lerp(a.dot.y, b.dot.y, e),
      r: lerp(a.dot.r, b.dot.r, e),
      ring: lerp(a.dot.ring, b.dot.ring, e),
    };
  })(),
});

const pieceTransform = (p: Piece) => `translate(${p.x} ${p.y}) rotate(${p.r}) scale(${p.fx * p.s} ${p.s})`;

const MorphingGraphic = ({ active, className }: { active: number; className?: string }) => {
  const groupRef = useRef<SVGGElement>(null);
  const pieceRefs = useRef<(SVGPathElement | null)[]>([]);
  const dotRef = useRef<SVGCircleElement>(null);
  const poseRef = useRef<Pose>(SHAPES[0]);

  useEffect(() => {
    const target = SHAPES[active % SHAPES.length];
    const from = poseRef.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const t = reduceMotion ? 1 : clamp((now - start) / MORPH_MS);
      const pose = mixPose(from, target, t);
      poseRef.current = pose;

      pose.pieces.forEach((p, i) => {
        const el = pieceRefs.current[i];
        if (!el) return;
        el.setAttribute('transform', pieceTransform(p));
        el.setAttribute('d', piecePath(p.k));
      });

      const dot = dotRef.current;
      if (dot) {
        dot.setAttribute('cx', String(pose.dot.x));
        dot.setAttribute('cy', String(pose.dot.y));
        dot.setAttribute('r', String(pose.dot.r));
        dot.setAttribute('stroke-width', String(pose.dot.ring));
      }

      // small "breath" of the whole graphic while it changes
      const squeeze = 1 - 0.06 * Math.sin(Math.PI * t);
      groupRef.current?.setAttribute('transform', `translate(70 55) scale(${squeeze}) translate(-70 -55)`);

      if (t < 1) raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  const first = SHAPES[0];

  return (
    <svg viewBox="-14 -6 170 124" fill="currentColor" className={className} aria-hidden>
      <g ref={groupRef}>
        {first.pieces.map((p, i) => (
          <path
            key={i}
            ref={(el) => {
              pieceRefs.current[i] = el;
            }}
            d={piecePath(p.k)}
            transform={pieceTransform(p)}
          />
        ))}
        <circle ref={dotRef} cx={first.dot.x} cy={first.dot.y} r={first.dot.r} stroke="#ffffff" strokeWidth={first.dot.ring} />
      </g>
    </svg>
  );
};

/* -------------------------------- icons ------------------------------- */

type IconProps = { className?: string };

const StepIcon = ({ name }: { name: Step['icon'] }) => {
  const p = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, className: 'h-5 w-5', 'aria-hidden': true };
  switch (name) {
    case 'search':
      return <svg {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>;
    case 'pen':
      return <svg {...p}><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.6 7.6" /><circle cx="11" cy="11" r="2" /></svg>;
    case 'rocket':
      return <svg {...p}><path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2" /><path d="M9 15l-3-3c1-4 4-8 11-9-1 7-5 10-9 11z" /><circle cx="14.5" cy="9.5" r="1.5" /></svg>;
    default:
      return <svg {...p}><path d="M3 3v18h18" /><path d="M8 17v-4M12 17V9M16 17v-6M20 17V5" /></svg>;
  }
};

const ClockIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const TargetIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" />
  </svg>
);

const CheckIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

/* -------------------------------- styles ------------------------------ */

const STYLES = `
  @keyframes pc-up    { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
  @keyframes pc-pop   { 0% { opacity: 0; transform: scale(.75); } 70% { opacity: 1; transform: scale(1.05); } 100% { opacity: 1; transform: scale(1); } }
  @keyframes pc-label { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

  .pc-root .pc-reveal { opacity: 0; transform: translateY(24px); transition: opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1); }
  .pc-root .pc-reveal.pc-in { opacity: 1; transform: none; }

  .pc-root .pc-up, .pc-root .pc-pop { opacity: 0; }
  .pc-root .pc-in .pc-up  { animation: pc-up .7s cubic-bezier(.22,1,.36,1) both; }
  .pc-root .pc-in .pc-pop { animation: pc-pop .5s cubic-bezier(.34,1.56,.64,1) both; }
  .pc-root .pc-label { animation: pc-label .5s ease-out both; }

  @media (prefers-reduced-motion: reduce) {
    .pc-root *, .pc-root *::before, .pc-root *::after { animation: none !important; transition: none !important; }
    .pc-root .pc-reveal, .pc-root .pc-up, .pc-root .pc-pop { opacity: 1 !important; transform: none !important; }
  }
`;

export default ProcessAndCta;