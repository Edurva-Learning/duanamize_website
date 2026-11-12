'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';


type NavItem = { name: string; href: string; id?: string };

// `id` → section on the home page (scrolls). No `id` → separate page.
const NAV: NavItem[] = [
  { name: 'Home', href: '/', id: 'home' },
  { name: 'Service', href: '/', id: 'services' },
  { name: 'Success Stories', href: '/successstory' },
  { name: 'Pricing', href: '/', id: 'pricing' },
  { name: 'About Us', href: '/aboutus' },
  { name: 'Contact Us', href: '/', id: 'contact' },
];

const HOME = '/';
const keyOf = (item: NavItem) => item.id ?? item.href;
const linkHref = (item: NavItem) => (item.id && item.id !== 'home' ? `${HOME}#${item.id}` : item.href);

// which link is active when you land on a page
const initialActive = (pathname: string) => {
  if (pathname === HOME) return 'home';
  return NAV.find((n) => !n.id && n.href === pathname)?.href ?? '';
};

/* --------------------------- smooth scrolling --------------------------- */

let scrollRaf = 0;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const smoothScrollTo = (targetY: number, onDone?: () => void) => {
  cancelAnimationFrame(scrollRaf);
  const start = window.scrollY;
  const maxY = document.documentElement.scrollHeight - window.innerHeight;
  const end = Math.max(0, Math.min(targetY, maxY));
  const diff = end - start;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || Math.abs(diff) < 2) {
    window.scrollTo({ top: end, behavior: 'instant' as ScrollBehavior });
    onDone?.();
    return;
  }

  const duration = Math.min(1300, Math.max(550, Math.abs(diff) * 0.45));
  const t0 = performance.now();

  const stop = () => {
    window.removeEventListener('wheel', cancel);
    window.removeEventListener('touchstart', cancel);
  };
  const cancel = () => {
    cancelAnimationFrame(scrollRaf);
    stop();
    onDone?.();
  };
  window.addEventListener('wheel', cancel, { passive: true });
  window.addEventListener('touchstart', cancel, { passive: true });

  const step = (now: number) => {
    const t = Math.min(1, (now - t0) / duration);
    window.scrollTo({ top: start + diff * easeInOutCubic(t), behavior: 'instant' as ScrollBehavior });
    if (t < 1) {
      scrollRaf = requestAnimationFrame(step);
    } else {
      stop();
      onDone?.();
    }
  };
  scrollRaf = requestAnimationFrame(step);
};

/* -------------------------------- Header -------------------------------- */

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string>(() => initialActive(pathname));
  const [hovered, setHovered] = useState<string | null>(null);
  const [line, setLine] = useState({ left: 0, width: 0, visible: false });

  const headerRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const autoScrolling = useRef(false);

  /* scroll: background + progress line */
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 10);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
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

  /* animated scroll to a home-page section */
  const scrollToId = useCallback((id: string) => {
    const headerH = headerRef.current?.offsetHeight ?? 72;
    const el = document.getElementById(id);
    const y = id === 'home' || !el ? 0 : el.getBoundingClientRect().top + window.scrollY - headerH - 8;
    autoScrolling.current = true;
    smoothScrollTo(y, () => {
      autoScrolling.current = false;
    });
  }, []);

  /* page change: reset, close menu; if we arrived at /#section → glide to it */
  useEffect(() => {
    setActive(initialActive(pathname));
    setMenuOpen(false);

    const hash = window.location.hash.slice(1);
    if (pathname !== HOME || !hash) return;

    // wait until the section has rendered, then scroll from the top
    let tries = 0;
    let raf = 0;
    const wait = () => {
      const el = document.getElementById(hash);
      if (el) {
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        setActive(hash);
        window.setTimeout(() => scrollToId(hash), 80);
        return;
      }
      if (tries++ < 60) raf = requestAnimationFrame(wait);
    };
    raf = requestAnimationFrame(wait);
    return () => cancelAnimationFrame(raf);
  }, [pathname, scrollToId]);

  /* scroll-spy (only on the home page) */
  useEffect(() => {
    if (pathname !== HOME) return;
    const sections = NAV.filter((n) => n.id).map((n) => document.getElementById(n.id as string)).filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (autoScrolling.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [pathname]);

  /* sliding underline */
  useEffect(() => {
    const place = () => {
      const el = linkRefs.current[hovered ?? active];
      if (!el) {
        setLine((l) => ({ ...l, visible: false }));
        return;
      }
      setLine({ left: el.offsetLeft, width: el.offsetWidth, visible: true });
    };
    place();
    window.addEventListener('resize', place);
    document.fonts?.ready.then(place).catch(() => {});
    return () => window.removeEventListener('resize', place);
  }, [active, hovered]);

  /* Escape closes the mobile menu */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    setMenuOpen(false);

    // separate pages (Success Stories, About Us): normal navigation
    if (!item.id) {
      if (pathname === item.href) {
        e.preventDefault();
        smoothScrollTo(0); // already there → glide to top
      }
      return;
    }

    e.preventDefault();
    const id = item.id;

    // already on the home page → animated scroll to the section
    if (pathname === HOME) {
      setActive(id);
      scrollToId(id);
      window.history.replaceState(null, '', id === 'home' ? HOME : `${HOME}#${id}`);
      return;
    }

    // on another page → go home, then glide to the section
    if (id === 'home') {
      router.push(HOME);
    } else {
      router.push(`${HOME}#${id}`, { scroll: false });
    }
  };

  const solid = scrolled || menuOpen;

  return (
    <header ref={headerRef} className={`hd-root sticky top-0 z-50 w-full transition-colors duration-500 ${solid ? 'border-b border-slate-200/70 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-[#0B1220]/85' : 'border-b border-transparent bg-transparent'}`}>
      <style>{STYLES}</style>

      {/* reading progress */}
      <div ref={progressRef} className="pointer-events-none absolute bottom-[-1px] left-0 h-[2px] w-full origin-left bg-gradient-to-r from-[#22B5E8] to-[#166ba8]" style={{ transform: 'scaleX(0)' }} />

      <div className={`mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-5 transition-all duration-500 md:px-8 ${scrolled ? 'h-[64px]' : 'h-[76px]'}`}>
        {/* Logo */}
        <Link href="/" onClick={(e) => handleNav(e, NAV[0])} className="group flex shrink-0 items-center gap-2.5">
          <Image src="/logos/duanalogo1.png" alt="Duanamize Global Service Logo" width={36} height={32} className="object-contain transition-transform duration-500 group-hover:rotate-[-8deg]" priority />
          <span className="flex flex-col leading-none">
            <span className="text-[18px] font-bold tracking-tight text-[#0f172a] dark:text-white">Duanamize</span>
            <span className="mt-1 text-[11px] font-medium text-[#238ED1]">Global Service</span>
          </span>
        </Link>

        {/* Desktop nav with sliding underline */}
        <nav onMouseLeave={() => setHovered(null)} className="relative hidden items-center gap-8 lg:flex" aria-label="Main">
          {NAV.map((item) => {
            const key = keyOf(item);
            const isActive = active === key;
            return (
              <Link
                key={item.name}
                href={linkHref(item)}
                scroll={!item.id}
                ref={(el) => {
                  linkRefs.current[key] = el;
                }}
                onClick={(e) => handleNav(e, item)}
                onMouseEnter={() => setHovered(key)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-2 text-[15px] font-medium transition-colors duration-300 ${isActive ? 'text-[#0f172a] dark:text-white' : 'text-slate-500 hover:text-[#0f172a] dark:text-slate-400 dark:hover:text-white'}`}
              >
                {item.name}
              </Link>
            );
          })}
          <span aria-hidden className="absolute -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-[#22B5E8] to-[#166ba8] transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]" style={{ left: line.left, width: line.width, opacity: line.visible ? 1 : 0 }} />
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link href="/book-call" className="group hidden items-center gap-2 rounded-full bg-[#0f172a] py-2 pl-5 pr-2 text-[14px] font-medium text-white transition-colors duration-300 hover:bg-[#166ba8] lg:inline-flex dark:bg-white dark:text-[#0f172a] dark:hover:bg-[#6CC4F5]">
            Book a Discovery Call
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#238ED1] text-white transition-transform duration-300 group-hover:rotate-[-45deg]">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </Link>

          {/* Mobile menu button */}
          <button type="button" onClick={() => setMenuOpen((o) => !o)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#0f172a] transition-colors hover:bg-slate-100 lg:hidden dark:text-white dark:hover:bg-white/10">
            <span className={`absolute h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${menuOpen ? 'rotate-45' : '-translate-y-[5px]'}`} />
            <span className={`absolute h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${menuOpen ? '-rotate-45' : 'translate-y-[5px]'}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`grid transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] lg:hidden ${menuOpen ? 'grid-rows-[1fr] opacity-100' : 'pointer-events-none grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <nav className="mx-auto max-w-[1280px] px-5 pb-6 pt-2 md:px-8" aria-label="Mobile">
            {NAV.map((item, i) => {
              const isActive = active === keyOf(item);
              return (
                <Link
                  key={item.name}
                  href={linkHref(item)}
                  scroll={!item.id}
                  onClick={(e) => handleNav(e, item)}
                  className={`flex items-center justify-between border-b border-slate-100 py-4 text-[20px] font-medium transition-all duration-500 dark:border-white/10 ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'} ${isActive ? 'text-[#238ED1] dark:text-[#6CC4F5]' : 'text-[#0f172a] dark:text-white'}`}
                  style={{ transitionDelay: menuOpen ? `${60 + i * 45}ms` : '0ms' }}
                >
                  {item.name}
                  <svg viewBox="0 0 24 24" className="h-4 w-4 opacity-40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              );
            })}
            <Link href="/book-call" onClick={() => setMenuOpen(false)} className="mt-6 flex w-full items-center justify-center rounded-full bg-[#0f172a] py-3.5 text-[15px] font-medium text-white dark:bg-white dark:text-[#0f172a]">
              Book a Discovery Call
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

/* ----------------------------- Theme toggle ----------------------------- */

const ThemeToggle = () => {
  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const root = document.documentElement;
    const goDark = !root.classList.contains('dark');

    const apply = () => {
      root.classList.toggle('dark', goDark);
      root.style.colorScheme = goDark ? 'dark' : 'light';
      try {
        localStorage.setItem('theme', goDark ? 'dark' : 'light');
      } catch {}
    };

    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (doc.startViewTransition && !reduce) {
      root.style.setProperty('--hd-x', `${e.clientX}px`);
      root.style.setProperty('--hd-y', `${e.clientY}px`);
      doc.startViewTransition(apply);
    } else {
      apply();
    }
  };

  return (
    <button type="button" onClick={toggle} aria-label="Switch between light and dark theme" title="Switch theme" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-amber-500 transition-colors duration-300 hover:bg-slate-50 dark:border-white/15 dark:text-sky-200 dark:hover:bg-white/10">
      <svg viewBox="0 0 24 24" className="hd-sunmoon h-5 w-5" aria-hidden>
        <mask id="hd-moon-mask">
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <circle className="hd-mask-dot" cx="24" cy="10" r="6" fill="black" />
        </mask>
        <circle className="hd-core" cx="12" cy="12" r="5" fill="currentColor" mask="url(#hd-moon-mask)" />
        <g className="hd-rays" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 1.5v2M12 20.5v2M1.5 12h2M20.5 12h2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M4.6 19.4L6 18M18 6l1.4-1.4" />
        </g>
      </svg>
    </button>
  );
};

/* -------------------------------- Styles -------------------------------- */

const STYLES = `
  /* sun → moon morph */
  .hd-sunmoon { transition: transform .6s cubic-bezier(.34,1.56,.64,1); }
  .hd-core { transform-box: fill-box; transform-origin: center; transition: transform .5s cubic-bezier(.34,1.56,.64,1); }
  .hd-mask-dot { transition: transform .5s cubic-bezier(.22,1,.36,1); }
  .hd-rays { transform-box: view-box; transform-origin: 12px 12px; transition: transform .5s cubic-bezier(.22,1,.36,1), opacity .35s ease; }
  .dark .hd-sunmoon { transform: rotate(-40deg); }
  .dark .hd-core { transform: scale(1.6); }
  .dark .hd-mask-dot { transform: translate(-7px, -2px); }
  .dark .hd-rays { transform: rotate(45deg) scale(0); opacity: 0; }

  /* circular reveal when switching theme */
  @keyframes hd-reveal { from { clip-path: circle(0 at var(--hd-x, 100%) var(--hd-y, 0)); } to { clip-path: circle(150% at var(--hd-x, 100%) var(--hd-y, 0)); } }
  ::view-transition-old(root) { animation: none; }
  ::view-transition-new(root) { animation: hd-reveal .6s cubic-bezier(.22,1,.36,1); }

  @media (prefers-reduced-motion: reduce) {
    .hd-root *, .hd-root *::before, .hd-root *::after { animation: none !important; transition: none !important; }
  }
`;

export default Header;