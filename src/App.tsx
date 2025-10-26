import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import logoWordmarkOrange from '../branding/wb-orange_1@4x.png';
import logoWordmarkWhite from '../branding/wb-white_1@4x.png';
import logoMarkWhite from '../branding/w-white_1@4x.png';

const NAV_ITEMS = [
  { label: 'Intro', href: '#intro' },
  { label: 'Showcase', href: '#showcase' },
  { label: 'Story', href: '#story' },
  { label: 'Type', href: '#type' },
  { label: 'Contact', href: '#contact' }
] as const;

const HERO_METRICS = [
  { label: 'Engagement lift', value: '+186%' },
  { label: 'Lifecycle programs', value: '27 tailored rituals' },
  { label: 'Delivery pace', value: 'Strategic biweekly' }
] as const;

const HERO_TILES = [
  { name: 'oranžinė', value: '#E8623F', tone: 'warm' },
  { name: 'pageltusi balta', value: '#DFDFD5', tone: 'soft' },
  { name: 'tamsiai ruda', value: '#281600', tone: 'deep' }
] as const;

const SHOWCASE_ITEMS = [
  {
    theme: 'theme-orbit',
    tag: 'Flow Sequencer',
    title: 'Orchestra OS',
    copy: 'A cross-team ritual manager delivering biweekly clarity and luminous decision boards.',
    bullets: ['Predictive cadence analytics', 'Accessible gradient surfaces', 'Premium interaction tokens']
  },
  {
    theme: 'theme-ember',
    tag: 'Clienteling',
    title: 'Patina Commerce',
    copy: 'Brand storytelling that glows with hospitality-grade personalization and calm motion.',
    bullets: ['Adaptive typography ladder', 'Immersive gradient canvases', 'Seamless ritual checkout']
  },
  {
    theme: 'theme-atelier',
    tag: 'Cultural OS',
    title: 'Residency Atlas',
    copy: 'A calm intranet built for mindful companies that protect focus and celebrate craft.',
    bullets: ['Story-driven dashboards', 'Signal to noise filtration', 'Wellness cadence loops']
  },
  {
    theme: 'theme-lucent',
    tag: 'Spatial product',
    title: 'Interval Studio',
    copy: 'Hybrid architecture linking physical installations with luminous spatial audio direction.',
    bullets: ['Sensorial gradient matrix', 'Tactile brand gestures', 'Premium service orchestration']
  }
] as const;

const PALETTE_ITEMS = [
  { name: 'oranžinė', value: '#E8623F', tone: 'orange' },
  { name: 'pageltusi balta', value: '#DFDFD5', tone: 'cream' },
  { name: 'baltų balta', value: '#FFFFFF', tone: 'white' },
  { name: 'tamsiai ruda', value: '#281600', tone: 'coal' }
] as const;

const TYPE_SPECS = [
  { label: 'H1', description: '34pt NB International Pro Bold', weight: 'h1' },
  { label: 'H2', description: '22pt NB International Pro Regular', weight: 'h2' },
  { label: 'H3', description: '18pt NB International Pro Light', weight: 'h3' },
  { label: 'Body', description: '14pt NB International Pro Mono', weight: 'body' }
] as const;

const TYPE_PREVIEW = [
  { tone: 'h1', text: 'Manage your work with patience' },
  { tone: 'h2', text: 'Manage your work with patience' },
  { tone: 'h3', text: 'Manage your work with patience' },
  { tone: 'body', text: 'Manage your work with patience' }
] as const;

function App() {
  const appRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const navListRef = useRef<HTMLUListElement | null>(null);
  const navToggleRef = useRef<HTMLButtonElement | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('#intro');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>();
  const pointerMoveRef = useRef<(event: PointerEvent) => void>();

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false
    });

    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };

    rafRef.current = requestAnimationFrame(raf);

    const setHeaderState = (scrollValue: number) => {
      if (!headerRef.current) return;
      headerRef.current.classList.toggle('is-scrolled', scrollValue > 24);
    };

    lenis.on('scroll', ({ scroll }: { scroll: number }) => {
      setHeaderState(scroll);
    });

    const handleAnchor = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
      if (!target) return;
      const hash = target.getAttribute('href');
      if (!hash || hash.length <= 1) return;
      const section = document.querySelector(hash);
      if (!section) return;
      event.preventDefault();
      setNavOpen(false);
      lenis.scrollTo(section as HTMLElement, { offset: -140 });
    };

    document.addEventListener('click', handleAnchor);

  let ctx: any = null;
  const pendingAdds: Array<() => void> = [];

  ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      gsap.utils.toArray<HTMLElement>('[data-animate]').forEach((node: HTMLElement) => {
        gsap.from(node, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: node,
            start: 'top 70%'
          }
        });
      });

      const sections = gsap.utils.toArray<HTMLElement>('section[data-section]');

      sections.forEach((section: HTMLElement) => {
        const id = `#${section.id}`;
        ScrollTrigger.create({
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveSection(id),
          onEnterBack: () => setActiveSection(id)
        });
      });

      if (sections[0]) setActiveSection(`#${sections[0].id}`);

      const panoramaTrack = document.querySelector('.panorama-track');
      const panoramaSection = document.querySelector('.section-panorama');

      if (panoramaTrack && panoramaSection) {
        const tween = gsap.to(panoramaTrack, {
          x: () => {
            const max = (panoramaTrack as HTMLElement).scrollWidth - window.innerWidth;
            return max > 0 ? -max : 0;
          },
          ease: 'none',
          scrollTrigger: {
            trigger: panoramaSection,
            start: 'top top',
            end: () => `+=${Math.max(1, (panoramaTrack as HTMLElement).scrollWidth - window.innerWidth)}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true
          }
        });

        const refreshHandler = () => tween.scrollTrigger?.refresh();
        window.addEventListener('resize', refreshHandler);

        ScrollTrigger.addEventListener('refreshInit', refreshHandler);

        pendingAdds.push(() => {
          window.removeEventListener('resize', refreshHandler);
          ScrollTrigger.removeEventListener('refreshInit', refreshHandler);
        });
      }

      if (!reduceMotion) {
        const heroTimeline = gsap.timeline({ delay: 0.2 });
        heroTimeline
          .from('[data-hero="badge"]', { y: 24, opacity: 0, duration: 0.6, ease: 'power3.out' })
          .from('[data-hero="title"]', { y: 28, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3')
          .from('[data-hero="lead"]', { y: 24, opacity: 0, duration: 0.65, ease: 'power3.out' }, '-=0.4')
          .from('[data-hero="actions"]', { y: 22, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
          .from('[data-hero="metrics"] div', { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out', stagger: 0.12 }, '-=0.4')
          .from('[data-hero="card"]', { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5');

        const marqueeTrack = document.querySelector('.hero-marquee .marquee-track');
        if (marqueeTrack) {
          gsap.to(marqueeTrack, {
            xPercent: -50,
            ease: 'none',
            duration: 24,
            repeat: -1
          });
        }

        const gradient = document.querySelector('.hero-gradient');
        if (gradient && window.matchMedia('(pointer: fine)').matches) {
          const handlePointerMove = (event: PointerEvent) => {
            const x = ((event.clientX / window.innerWidth) - 0.5) * 80;
            const y = ((event.clientY / window.innerHeight) - 0.5) * 60;
            gsap.to(gradient, { x, y, duration: 1.2, ease: 'power3.out' });
          };
          pointerMoveRef.current = handlePointerMove;
          window.addEventListener('pointermove', handlePointerMove, { passive: true });
        }
      }
  }, appRef.current ?? undefined);

  // attach any pending cleanup handlers into the GSAP context now it's available
  if (ctx && pendingAdds.length) {
    pendingAdds.forEach((fn) => ctx.add(fn));
  }

    const scrollTriggerRefresh = () => lenis.update();
    ScrollTrigger.addEventListener('refresh', scrollTriggerRefresh);

    return () => {
      document.removeEventListener('click', handleAnchor);
      pointerMoveRef.current && window.removeEventListener('pointermove', pointerMoveRef.current as EventListener);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (lenis) lenis.destroy();
      ctx.revert();
      ScrollTrigger.removeEventListener('refresh', scrollTriggerRefresh);
      ScrollTrigger.killAll();
    };
  }, []);

  useEffect(() => {
    if (!navOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const targetNode = event.target as Node;
      if (!navRef.current || !navToggleRef.current) return;
      if (navRef.current.contains(targetNode) || navToggleRef.current.contains(targetNode)) return;
      setNavOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [navOpen]);

  useEffect(() => {
    if (!navOpen) return;
    const focusable = navListRef.current?.querySelectorAll<HTMLAnchorElement>('a');
    focusable?.[0]?.focus();
  }, [navOpen]);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div ref={appRef}>
      <div className="global-backdrop" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <header ref={headerRef} className="site-header" data-scrolled="false">
        <div className="container header-row">
          <a className="brand" href="#intro" aria-label="Wunderbit home">
            <img src={logoWordmarkOrange} alt="Wunderbit" width={132} height={32} />
          </a>
          <nav ref={navRef} className={`primary-nav${navOpen ? ' open' : ''}`} aria-label="Primary">
            <button
              ref={navToggleRef}
              className="nav-toggle"
              aria-expanded={navOpen}
              aria-controls="nav-list"
              type="button"
              onClick={() => setNavOpen((prevOpen: boolean) => !prevOpen)}
            >
              <span className="sr-only">Menu</span>
              <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </button>
            <ul id="nav-list" ref={navListRef} className="nav-list">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a href={item.href} aria-current={activeSection === item.href ? 'true' : undefined}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a className="btn btn-outline" href="#contact">Start a project</a>
        </div>
      </header>

      <aside className="side-dots" aria-label="Section navigation">
        {NAV_ITEMS.map((item) => (
          <a
            key={`dot-${item.href}`}
            href={item.href}
            className={`dot${activeSection === item.href ? ' is-active' : ''}`}
            aria-label={item.label}
          />
        ))}
      </aside>

      <main id="smooth-wrapper">
        <div id="smooth-content">
          <section className="section hero" id="intro" data-section>
            <div className="hero-sheen" aria-hidden="true" />
            <div className="container hero-grid">
              <div className="hero-copy" data-animate>
                <span className="hero-badge" data-hero="badge">Premium workflow atelier</span>
                <h1 data-hero="title">Manage your work with patience</h1>
                <p data-hero="lead">
                  Wunderbit choreographs technology, design, and calm velocity. We develop luminous digital ecosystems
                  that let thoughtful teams move deliberately without losing momentum.
                </p>
                <div className="hero-actions" data-hero="actions">
                  <a className="btn btn-solid" href="#showcase">Explore showcase</a>
                  <a className="btn btn-ghost" href="#contact">Book a conversation</a>
                </div>
                <dl className="hero-metrics" data-hero="metrics">
                  {HERO_METRICS.map((metric) => (
                    <div key={metric.label}>
                      <dt>{metric.label}</dt>
                      <dd>{metric.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="hero-media" data-animate>
                <div className="hero-capsule">
                  <div className="hero-gradient" aria-hidden="true" />
                  <div className="hero-card" data-hero="card">
                    <span className="card-kicker">Calibrated flow</span>
                    <h3>Precision meets calm</h3>
                    <p>We frame each sprint as a ritual — research, orchestration, refinement. Momentum without rush.</p>
                    <ul className="card-list">
                      <li>Signal mapping dashboards</li>
                      <li>Persona aligned rituals</li>
                      <li>Real-time health telemetry</li>
                    </ul>
                    <div className="card-ribbon">
                      <img src={logoWordmarkWhite} alt="W mark" width={32} height={32} />
                      <span>Wunderbit premium atelier</span>
                    </div>
                  </div>
                  <div className="hero-pulses" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <div className="hero-stack" aria-hidden="true">
                  {HERO_TILES.map((tile) => (
                    <div key={tile.name} className={`hero-tile hero-tile--${tile.tone}`}>
                      <span>{tile.name}</span>
                      <strong>{tile.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="hero-marquee" aria-hidden="true">
              <div className="marquee-track">
                <span>Patient precision</span>
                <span>Premium rituals</span>
                <span>Calm collaboration</span>
                <span>Signature typography</span>
                <span>Patient precision</span>
                <span>Premium rituals</span>
                <span>Calm collaboration</span>
                <span>Signature typography</span>
              </div>
            </div>
          </section>

          <section className="section section-panorama" id="showcase" aria-label="Showcase" data-section>
            <div className="container section-head">
              <div data-animate>
                <span className="eyebrow">Showcase</span>
                <h2>Premium launches, grounded in ritual</h2>
              </div>
              <p data-animate>
                Every engagement is composed as a layered system. We balance patient craftsmanship with decisive execution
                so your teams inherit a confident rhythm.
              </p>
            </div>
            <div className="panorama">
              <div className="panorama-track">
                {SHOWCASE_ITEMS.map((item) => (
                  <article key={item.title} className={`panorama-card ${item.theme}`} data-animate>
                    <div className="card-inner">
                      <span className="card-tag">{item.tag}</span>
                      <h3>{item.title}</h3>
                      <p>{item.copy}</p>
                      <ul>
                        {item.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section section-story" id="story" data-section>
            <div className="container story-grid">
              <div className="story-intro" data-animate>
                <span className="eyebrow">Brand story</span>
                <h2>Quiet power, luminous contrast</h2>
                <p>
                  oranžinė <strong>#E8623F</strong> delivers warmth and determination. pageltusi balta <strong>#DFDFD5</strong> softens the
                  interface for long-form focus. tamsiai ruda <strong>#281600</strong> anchors every gradient with a confident base.
                </p>
              </div>
              <div className="story-columns">
                <article data-animate>
                  <h3>Ritual design</h3>
                  <p>
                    We choreograph interactions as rituals, creating signals that invite teams into patient flow. The result
                    is a calm, luxurious cadence.
                  </p>
                </article>
                <article data-animate>
                  <h3>Signature palette</h3>
                  <div className="palette">
                    {PALETTE_ITEMS.map((swatch) => (
                      <div key={swatch.value} className={`swatch swatch-${swatch.tone}`}>
                        <span>{swatch.name}</span>
                        <strong>{swatch.value}</strong>
                      </div>
                    ))}
                  </div>
                </article>
                <article data-animate>
                  <h3>Measured technology</h3>
                  <p>
                    From signal mapping to premium animations, we select tools that respect attention — GSAP, Lenis, and
                    bespoke data visualizations power our calm interfaces.
                  </p>
                </article>
              </div>
            </div>
          </section>

          <section className="section section-type" id="type" data-section>
            <div className="container type-grid">
              <div className="type-intro" data-animate>
                <span className="eyebrow">Typography</span>
                <h2>NB International Pro system</h2>
                <p>
                  Our typography is patient and precise. The hierarchy is clear, luxurious, and meticulously spaced for premium
                  editorial flows.
                </p>
              </div>
              <div className="type-spec" data-animate>
                <dl>
                  {TYPE_SPECS.map((spec) => (
                    <div key={spec.label}>
                      <dt>{spec.label}</dt>
                      <dd>{spec.description}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="type-preview" data-animate>
                {TYPE_PREVIEW.map((preview) => (
                  <div key={preview.tone} className={`type-block ${preview.tone}`}>
                    {preview.text}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="section section-contact" id="contact" aria-labelledby="contact-title" data-section>
            <div className="container contact-card" data-animate>
              <div className="contact-copy">
                <span className="eyebrow">Contact</span>
                <h2 id="contact-title">Invite Wunderbit into your ritual</h2>
                <p>
                  We begin with a patient diagnostic: aligning cadence, typography, and technology to your culture. Let’s orchestrate
                  a premium journey.
                </p>
              </div>
              <form className="contact-form" onSubmit={handleFormSubmit}>
                <label>
                  <span>Work email</span>
                  <input type="email" name="email" placeholder="you@company.com" required />
                </label>
                <label>
                  <span>What do you want to transform?</span>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Lifecycle rituals, internal tooling, premium commerce..."
                    required
                  />
                </label>
                <button className="btn btn-solid" type="submit" disabled={formSubmitted}>
                  {formSubmitted ? 'Request received' : 'Request a premium audit'}
                </button>
              </form>
              <div className="contact-meta" aria-hidden="true">
                <span>© {currentYear} Wunderbit</span>
                <span>Premium studio · Vilnius</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <img src={logoMarkWhite} alt="Wunderbit monogram" width={44} height={44} />
            <p>Premium rituals, crafted with patience.</p>
          </div>
          <ul className="footer-links">
            {NAV_ITEMS.map((item) => (
              <li key={`footer-${item.href}`}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default App;
