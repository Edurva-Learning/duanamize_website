'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type FooterLink = { label: string; href: string; id?: string };

const SERVICE_LINKS: FooterLink[] = [
  { label: 'AI & Machine Learning', href: '/service', id: 'ai-ml' },
  { label: 'Data Engineering', href: '/service', id: 'data-engineering' },
  { label: 'Blockchain Development', href: '/service', id: 'blockchain' },
  { label: 'Industry 4.0 Solutions', href: '/service', id: 'industry-4' },
  { label: 'Lean Six Sigma', href: '/service', id: 'lean-six-sigma' },
  { label: 'Technology Consulting', href: '/service', id: 'technology-consulting' },
];

const COMPANY_LINKS: FooterLink[] = [
  { label: 'About Us', href: '/aboutus', id: 'about' },
  { label: 'Our Team', href: '/aboutus', id: 'team' },
  { label: 'Careers', href: '/careers' }, // ✏️ page not built yet
  { label: 'Success Stories', href: '/successstory', id: 'success-stories' },
  { label: 'Blog', href: '/aboutus', id: 'blog' }, // ✏️ page not built yet
  { label: 'Contact', href: '/contact', id: 'contact' },
];

// ✏️ these pages aren't built yet — update the paths when they exist
const RESOURCE_LINKS: FooterLink[] = [
  { label: 'Documentation', href: '/docs' },
  { label: 'API Reference', href: '/api-reference' },
  { label: 'Support Center', href: '/support' },
  { label: 'Service Status', href: '/status' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

/* --------------------------- smooth scrolling --------------------------- */

let scrollRaf = 0;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const smoothScrollTo = (targetY: number) => {
  cancelAnimationFrame(scrollRaf);
  const start = window.scrollY;
  const maxY = document.documentElement.scrollHeight - window.innerHeight;
  const end = Math.max(0, Math.min(targetY, maxY));
  const diff = end - start;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || Math.abs(diff) < 2) {
    window.scrollTo({ top: end, behavior: 'instant' as ScrollBehavior });
    return;
  }

  // longer trips (footer → top of page) get a bit more time
  const duration = Math.min(1600, Math.max(600, Math.abs(diff) * 0.4));
  const t0 = performance.now();

  const stop = () => {
    window.removeEventListener('wheel', cancel);
    window.removeEventListener('touchstart', cancel);
  };
  const cancel = () => {
    cancelAnimationFrame(scrollRaf);
    stop();
  };
  window.addEventListener('wheel', cancel, { passive: true });
  window.addEventListener('touchstart', cancel, { passive: true });

  const step = (now: number) => {
    const t = Math.min(1, (now - t0) / duration);
    window.scrollTo({ top: start + diff * easeInOutCubic(t), behavior: 'instant' as ScrollBehavior });
    if (t < 1) scrollRaf = requestAnimationFrame(step);
    else stop();
  };
  scrollRaf = requestAnimationFrame(step);
};

const headerHeight = () => (document.querySelector('header') as HTMLElement | null)?.offsetHeight ?? 80;

/* -------------------------------- Footer -------------------------------- */

const Footer = () => {
  const pathname = usePathname();

  const go = (e: React.MouseEvent<HTMLAnchorElement>, link: FooterLink) => {
    // section is on this page → animated scroll to it
    if (link.id) {
      const el = document.getElementById(link.id);
      if (el) {
        e.preventDefault();
        smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - headerHeight() - 8);
        window.history.replaceState(null, '', `${pathname}#${link.id}`);
        return;
      }
    }
    // already on that page (no section) → glide to the top
    if (pathname === link.href) {
      e.preventDefault();
      smoothScrollTo(0);
    }
    // otherwise the Link opens the page at the section
  };

  const linkHref = (link: FooterLink) => (link.id ? `${link.href}#${link.id}` : link.href);

  const LinkList = ({ links }: { links: FooterLink[] }) => (
    <ul className="flex flex-col gap-4 text-sm">
      {links.map((link) => (
        <li key={link.label}>
          <Link href={linkHref(link)} onClick={(e) => go(e, link)} className="group inline-flex items-center gap-1.5 transition-colors hover:text-blue-600">
            <span className="h-[2px] w-0 rounded-full bg-blue-600 transition-all duration-300 group-hover:w-3" />
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <footer className="relative w-full overflow-hidden bg-[#E1EDFF] text-slate-600 px-4 md:px-8 lg:px-12 pt-56 md:pt-72 pb-6 md:pb-10">
      {/* Ball pool behind everything (SuperHi style) */}
      <BallPool />

      {/* Frosted card that holds the footer content */}
      <div data-footer-card className="relative z-10 max-w-[1400px] mx-auto rounded-3xl bg-white/90 backdrop-blur-[4px] px-6 py-12 md:px-12 lg:px-16 shadow-[0_20px_60px_-30px_rgba(39,39,230,0.35)]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1: Brand & Contact Info */}
          <div className="flex flex-col gap-6 pr-4">
            {/* Logo Area — scrolls to top if you're already on the home page */}
            <Link href="/" onClick={(e) => go(e, { label: 'Home', href: '/' })} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-900 font-bold text-xl leading-tight tracking-tight">Duanamize</span>
                <span className="text-slate-500 text-xs font-medium">Global Services</span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-slate-500">
              Leading technology and management consulting firm specializing in AI, Blockchain, Industry 4.0, and process optimization for global enterprises.
            </p>

            {/* Contact List */}
            <ul className="flex flex-col gap-4 mt-2 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
                <span>Duanamize Global Services Private Limited</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <a href="mailto:contact@duanamize.com" className="hover:text-blue-600 transition-colors">contact@duanamize.com</a>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.25-3.95-6.846-6.846l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <a href="tel:+15551234567" className="hover:text-blue-600 transition-colors">+1 (555) 123-4567</a>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>24/7 Global Support</span>
              </li>
            </ul>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="text-slate-900 font-bold text-lg mb-6">Services</h3>
            <LinkList links={SERVICE_LINKS} />
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="text-slate-900 font-bold text-lg mb-6">Company</h3>
            <LinkList links={COMPANY_LINKS} />
          </div>

          {/* Column 4: Newsletter & Resources */}
          <div className="flex flex-col gap-8">
            {/* Newsletter Section */}
            <div>
              <h3 className="text-slate-900 font-bold text-lg mb-4">Stay Updated</h3>
              <p className="text-sm mb-4 text-slate-500">Get the latest insights on technology trends and best practices.</p>
              <form className="flex items-center gap-2">
                <input type="email" placeholder="Enter your email" className="w-full bg-white border border-gray-300 text-slate-900 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-400" required />
                <button type="submit" className="bg-[#2b5bf0] hover:bg-blue-700 text-white p-2.5 rounded-lg flex items-center justify-center shrink-0 transition-colors" aria-label="Subscribe">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Resources Section */}
            <div>
              <h3 className="text-slate-900 font-bold text-lg mb-4">Resources</h3>
              <LinkList links={RESOURCE_LINKS} />
            </div>
          </div>
        </div>

        {/* bottom bar: back to top */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row">
          <span>© {new Date().getFullYear()} Duanamize Global Services Private Limited. All rights reserved.</span>
          <button type="button" onClick={() => smoothScrollTo(0)} className="group inline-flex items-center gap-2 font-medium text-slate-600 transition-colors hover:text-blue-600">
            Back to top
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-blue-600">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M6 11l6-6 6 6" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};

/* =====================================================================
   BallPool (SuperHi-style)
   ---------------------------------------------------------------------
   - Big flat-colour balls (SuperHi palette) with little white faces.
   - When the footer scrolls into view they drop in one by one, roll
     and pile up across the whole footer, behind the frosted card.
   - Faces turn as the balls roll.
   - Move the mouse to push them; click a ball in the open area to pop
     it (a new one drops in from the top).
   Plain canvas + small custom physics — no libraries.
===================================================================== */

// SuperHi colours. Swap in your brand colours here if you like.
const COLORS = ['#FF4141', '#FFBAC4', '#2727E6', '#16AB59', '#FFDA00'];

const GRAVITY = 2400; // px/s²
const FLOOR_BOUNCE = 0.3;
const BALL_BOUNCE = 0.12;
const STEP = 1 / 120;
const DROP_GAP_MS = 120; // time between balls dropping in
const FILL = 0.8; // how much of the footer height the pile fills

type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  m: number;
  c: string;
  angle: number;
  faceX: number; // face offset on the ball (fraction of radius)
  faceY: number;
  faceRot: number;
  at: number; // drop time (ms after start)
  live: boolean;
  pop: number; // -1 = not popping, 0..1 = popping progress
};

const BallPool = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = 0;
    let H = 0;
    let base = 60;
    let balls: Ball[] = [];
    let started = false;
    let startTime = 0;
    let visible = false;
    let raf = 0;
    let last = 0;
    let acc = 0;
    const mouse = { x: -9999, y: -9999, vx: 0, vy: 0, on: false, t: 0 };

    /* ---------- sizing ---------- */

    const sizeCanvas = () => {
      W = host.clientWidth;
      H = host.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      // lock the CSS size to the same numbers so balls are never stretched
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const newBall = (k: number): Ball => {
      const r = base * (0.88 + Math.random() * 0.24);
      const fa = Math.random() * Math.PI * 2;
      const fd = 0.2 + Math.random() * 0.45;
      return {
        x: r + Math.random() * Math.max(1, W - 2 * r),
        y: -r - 10,
        vx: (Math.random() - 0.5) * 120,
        vy: 0,
        r,
        m: r * r,
        c: COLORS[k % COLORS.length],
        angle: Math.random() * Math.PI * 2,
        faceX: Math.cos(fa) * fd,
        faceY: Math.sin(fa) * fd,
        faceRot: (Math.random() - 0.5) * 1.2,
        at: k * DROP_GAP_MS,
        live: false,
        pop: -1,
      };
    };

    const build = () => {
      sizeCanvas();
      base = Math.max(40, Math.min(112, W / 17));
      const target = W * H * FILL * 0.72; // area to fill (0.72 ≈ how tightly balls pack)
      balls = [];
      let area = 0;
      let k = 0;
      while (area < target && balls.length < 90) {
        const b = newBall(k);
        balls.push(b);
        area += Math.PI * b.r * b.r;
        k++;
      }
      // mix colours so neighbours differ
      for (let i = balls.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [balls[i].c, balls[j].c] = [balls[j].c, balls[i].c];
      }
    };

    /* ---------- physics ---------- */

    const respawn = (b: Ball) => {
      const fresh = newBall(Math.floor(Math.random() * COLORS.length));
      Object.assign(b, fresh, { live: true, at: 0, y: -fresh.r - 10 });
    };

    const step = (dt: number, elapsed: number) => {
      for (const b of balls) {
        if (!b.live) {
          if (elapsed < b.at) continue;
          b.live = true;
          b.y = -b.r - 10;
        }
        if (b.pop >= 0) {
          b.pop += dt / 0.22;
          if (b.pop >= 1) respawn(b);
          continue;
        }

        b.vy += GRAVITY * dt;
        b.vx *= 0.998;
        b.vy *= 0.998;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.angle += (b.vx / b.r) * dt; // roll

        if (b.x < b.r) {
          b.x = b.r;
          b.vx = -b.vx * FLOOR_BOUNCE;
        } else if (b.x > W - b.r) {
          b.x = W - b.r;
          b.vx = -b.vx * FLOOR_BOUNCE;
        }
        if (b.y > H - b.r) {
          b.y = H - b.r;
          b.vy = Math.abs(b.vy) < 60 ? 0 : -b.vy * FLOOR_BOUNCE;
          b.vx *= 0.96;
        }
      }

      // ball ↔ ball (a few passes keeps the pile stable)
      for (let pass = 0; pass < 5; pass++) {
        for (let i = 0; i < balls.length; i++) {
          const a = balls[i];
          if (!a.live || a.pop >= 0) continue;
          for (let j = i + 1; j < balls.length; j++) {
            const b = balls[j];
            if (!b.live || b.pop >= 0) continue;
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const rs = a.r + b.r;
            const d2 = dx * dx + dy * dy;
            if (d2 >= rs * rs || d2 === 0) continue;

            const d = Math.sqrt(d2);
            const nx = dx / d;
            const ny = dy / d;
            const overlap = rs - d;
            const total = a.m + b.m;
            a.x -= nx * overlap * (b.m / total);
            a.y -= ny * overlap * (b.m / total);
            b.x += nx * overlap * (a.m / total);
            b.y += ny * overlap * (a.m / total);

            const vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
            if (vn < 0) {
              const imp = (-(1 + BALL_BOUNCE) * vn) / (1 / a.m + 1 / b.m);
              a.vx -= (imp * nx) / a.m;
              a.vy -= (imp * ny) / a.m;
              b.vx += (imp * nx) / b.m;
              b.vy += (imp * ny) / b.m;
            }
          }
        }
      }

      // settle: kill tiny jitter
      for (const b of balls) {
        if (Math.abs(b.vx) < 6) b.vx *= 0.8;
        if (Math.abs(b.vy) < 6) b.vy *= 0.8;
      }

      // mouse pushes balls
      if (mouse.on) {
        const R = 36;
        for (const b of balls) {
          if (!b.live || b.pop >= 0) continue;
          const dx = b.x - mouse.x;
          const dy = b.y - mouse.y;
          const rs = R + b.r;
          const d2 = dx * dx + dy * dy;
          if (d2 >= rs * rs || d2 === 0) continue;
          const d = Math.sqrt(d2);
          const nx = dx / d;
          const ny = dy / d;
          const push = rs - d;
          b.x += nx * push * 0.5;
          b.y += ny * push * 0.5;
          b.vx += nx * 140 + mouse.vx * 0.25;
          b.vy += ny * 140 + mouse.vy * 0.25;
        }
      }
    };

    /* ---------- drawing ---------- */

    const drawFace = (b: Ball, r: number) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.rotate(b.angle);
      ctx.translate(b.faceX * r, b.faceY * r);
      ctx.rotate(b.faceRot);

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = r * 0.055;
      ctx.lineCap = 'round';

      // eyes (rings)
      ctx.beginPath();
      ctx.arc(-r * 0.2, -r * 0.08, r * 0.08, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(r * 0.2, -r * 0.08, r * 0.08, 0, Math.PI * 2);
      ctx.stroke();

      // brows
      ctx.beginPath();
      ctx.moveTo(-r * 0.3, -r * 0.27);
      ctx.lineTo(-r * 0.14, -r * 0.23);
      ctx.moveTo(r * 0.14, -r * 0.23);
      ctx.lineTo(r * 0.3, -r * 0.27);
      ctx.stroke();

      // smile
      ctx.beginPath();
      ctx.arc(0, r * 0.02, r * 0.32, Math.PI * 0.2, Math.PI * 0.8);
      ctx.stroke();

      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const b of balls) {
        if (!b.live) continue;
        let r = b.r;
        let alpha = 1;
        if (b.pop >= 0) {
          r = b.r * (1 + b.pop * 0.35);
          alpha = 1 - b.pop;
        }
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(b.x, b.y);
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = b.c;
        ctx.fill();
        drawFace(b, r);
        ctx.restore();
      }
    };

    /* ---------- loop ---------- */

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      acc += dt;
      const elapsed = now - startTime;
      let n = 0;
      while (acc >= STEP && n < 6) {
        step(STEP, elapsed);
        acc -= STEP;
        n++;
      }
      mouse.vx *= 0.85;
      mouse.vy *= 0.85;
      draw();
      if (visible) raf = requestAnimationFrame(frame);
    };

    const startLoop = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      acc = 0;
      raf = requestAnimationFrame(frame);
    };

    // Reduced motion: build the settled pile instantly and draw it once
    const settleInstantly = () => {
      balls.forEach((b, i) => {
        b.live = true;
        b.y = H - b.r - (i % 6) * b.r * 1.6;
      });
      for (let k = 0; k < 1500; k++) step(STEP, Infinity);
      draw();
    };

    const begin = () => {
      started = true;
      startTime = performance.now();
      if (reduceMotion) settleInstantly();
      else startLoop();
    };

    /* ---------- observers & events ---------- */

    build();

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!visible) {
          cancelAnimationFrame(raf);
          return;
        }
        if (!started) begin();
        else if (!reduceMotion) startLoop();
      },
      { threshold: 0.15 }
    );
    io.observe(host);

    let lastWidth = host.clientWidth;
    const ro = new ResizeObserver(() => {
      if (Math.abs(host.clientWidth - lastWidth) < 2) {
        sizeCanvas(); // height-only change
        if (reduceMotion && started) draw();
        return;
      }
      lastWidth = host.clientWidth;
      build();
      if (started) {
        startTime = performance.now();
        if (reduceMotion) settleInstantly();
      }
    });
    ro.observe(host);

    const local = (e: PointerEvent | MouseEvent) => {
      const rect = host.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const overContent = (t: EventTarget | null) => t instanceof Element && !!t.closest('[data-footer-card], a, button, input, form');
    const ballAt = (x: number, y: number) => balls.find((b) => b.live && b.pop < 0 && (b.x - x) ** 2 + (b.y - y) ** 2 < b.r * b.r);

    const onMove = (e: PointerEvent) => {
      if (reduceMotion || e.pointerType !== 'mouse') return;
      const { x, y } = local(e);
      const now = performance.now();
      if (mouse.on && now > mouse.t) {
        const s = (now - mouse.t) / 1000;
        mouse.vx = (x - mouse.x) / s;
        mouse.vy = (y - mouse.y) / s;
      }
      mouse.x = x;
      mouse.y = y;
      mouse.t = now;
      mouse.on = true;
      host.style.cursor = !overContent(e.target) && ballAt(x, y) ? 'pointer' : '';
    };
    const onLeave = () => {
      mouse.on = false;
      host.style.cursor = '';
    };
    const onClick = (e: MouseEvent) => {
      if (reduceMotion || overContent(e.target)) return;
      const { x, y } = local(e);
      const b = ballAt(x, y);
      if (b) b.pop = 0;
    };

    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    host.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      host.removeEventListener('click', onClick);
      host.style.cursor = '';
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute left-0 top-0 z-0" />;
};

export default Footer;