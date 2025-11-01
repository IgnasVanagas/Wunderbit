import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import logoWordmarkOrange from '../branding/wb-orange_1@4x.png';
import logoWordmarkWhite from '../branding/wb-white_1@4x.png';
import logoMarkWhite from '../branding/w-white_1@4x.png';

type Language = 'en' | 'lt';

const LANGUAGES: Array<{ code: Language; label: string }> = [
  { code: 'en', label: 'EN' },
  { code: 'lt', label: 'LT' }
] as const;

const NAV_ITEMS = [
  { href: '#intro', label: { en: 'Overview', lt: 'Apžvalga' } },
  { href: '#showcase', label: { en: 'Client Wins', lt: 'Rezultatai' } },
  { href: '#story', label: { en: 'Offer', lt: 'Pasiūlymas' } },
  { href: '#type', label: { en: 'Method', lt: 'Metodika' } },
  { href: '#contact', label: { en: 'Contact', lt: 'Kontaktai' } }
] as const;

const HERO_CONTENT = {
  badge: { en: 'Private revenue atelier', lt: 'Privati pajamų studija' },
  title: {
    en: 'Elite digital experiences that convert decisive leads.',
    lt: 'Elitinės skaitmeninės patirtys, kurios paverčia apsisprendusius klientus.'
  },
  lead: {
    en: 'We partner with founders who treat attention as capital. Our team engineers premium funnels, sharpens messaging, and trains yours to sustain disciplined momentum.',
    lt: 'Dirbame su vadovais, kurie dėmesį laiko kapitalu. Kuriame premium piltuvus, aštriname žinutes ir apmokome jūsų komandą išlaikyti disciplinuotą tempą.'
  },
  actions: [
    {
      href: '#contact',
      label: {
        en: 'Start the executive diagnostic',
        lt: 'Pradėti vadovų diagnostiką'
      }
    },
    {
      href: '#showcase',
      label: {
        en: 'See recent wins',
        lt: 'Peržiūrėti laimėjimus'
      }
    }
  ],
  card: {
    kicker: { en: 'Reserved capacity', lt: 'Rezervuota galia' },
    title: { en: 'Conversion blueprints for the few', lt: 'Konversijų planai išrinktiesiems' },
    body: {
      en: 'Victory belongs to brands willing to choreograph every touchpoint.',
      lt: 'Pergalė priklauso prekių ženklams, kurie režisuoja kiekvieną sąlytį.'
    },
    list: [
      {
        en: 'Luxury positioning sprints',
        lt: 'Prabangos pozicionavimo sprintai'
      },
      {
        en: 'Executive enablement rituals',
        lt: 'Vadovų įgalinimo ritualai'
      },
      {
        en: 'Deal visibility dashboards',
        lt: 'Sandorių matomumo suvestinės'
      }
    ],
    ribbon: {
      en: 'Wunderbit private revenue lab',
      lt: 'Wunderbit privati pajamų laboratorija'
    }
  }
} as const;

const HERO_METRICS = [
  {
    label: {
      en: 'Qualified leads in 90 days',
      lt: 'Kvalifikuoti kontaktai per 90 dienų'
    },
    value: {
      en: '3.4x lift',
      lt: '3,4 karto augimas'
    }
  },
  {
    label: {
      en: 'Average deal size',
      lt: 'Vidutinė sandorio vertė'
    },
    value: {
      en: '+48% premium',
      lt: '+48 % aukštesnė vertė'
    }
  },
  {
    label: {
      en: 'Sales cycle reduction',
      lt: 'Pardavimų ciklo sutrumpėjimas'
    },
    value: {
      en: '-27 days',
      lt: '-27 dienos'
    }
  }
] as const;

const HERO_PILLARS = [
  {
    title: {
      en: 'Private funnel architecture',
      lt: 'Privati piltuvėlio architektūra'
    },
    description: {
      en: 'Bespoke lead journeys engineered for high-consideration purchases.',
      lt: 'Individualūs klientų keliai, sukurti didelės vertės sprendimams.'
    }
  },
  {
    title: { en: 'Executive enablement', lt: 'Vadovų įgalinimas' },
    description: {
      en: 'Playbooks, scripts, and rituals that keep senior teams accountable.',
      lt: 'Vadovų komandas laikantys atsakomybėje planai, skriptai ir ritualai.'
    }
  },
  {
    title: { en: 'Measurement with meaning', lt: 'Sąmoningas matavimas' },
    description: {
      en: 'North-star dashboards and weekly reviews tied to revenue outcomes.',
      lt: 'Svarbiausi rodiklių skydai ir savaitinės apžvalgos, susietos su pajamomis.'
    }
  }
] as const;

const HERO_MARQUEE = {
  en: ['Elite conversion', 'Private funnels', 'Luxury positioning', 'Vilnius excellence'],
  lt: ['Elitinė konversija', 'Privatūs piltuvai', 'Prabangos pozicionavimas', 'Vilniaus meistrystė']
} as const;

const HEADER_CTA = { en: 'Start a project', lt: 'Pradėti projektą' } as const;

const SHOWCASE_ITEMS = [
  {
    theme: 'theme-orbit',
    tag: { en: 'Wealth tech', lt: 'Finansų technologijos' },
    title: 'Siena Capital',
    copy: {
      en: 'Tripled UHNW consultations in eight weeks with a concierge-grade booking flow.',
      lt: 'Per aštuonias savaites tris kartus padidinome itin turtingų klientų konsultacijas sukūrę konsjeržo lygio registracijos procesą.'
    },
    bullets: [
      { en: 'Private scoring portal for advisors', lt: 'Privatus konsultantų vertinimo portalas' },
      { en: 'Luxury nurture journeys with scarcity cues', lt: 'Prabangūs išlaikymo keliai su išskirtinumo signalais' },
      { en: 'Executive dashboard for daily deal health', lt: 'Vadovų suvestinė kasdienei sandorių būklei' }
    ]
  },
  {
    theme: 'theme-ember',
    tag: { en: 'Luxury retail', lt: 'Prabangios mažmena' },
    title: 'Velvet Atelier',
    copy: {
      en: 'Grew premium conversion by 61% through narrative-led ecommerce and VIP care.',
      lt: 'Padidinome premium konversiją 61 %, sukūrę pasakojimu paremtą el. prekybą ir VIP aptarnavimą.'
    },
    bullets: [
      { en: 'High-touch clienteling CRM', lt: 'Asmeninis klientų CRM' },
      { en: 'Story-driven launch playbooks', lt: 'Pasakojimu paremti paleidimo scenarijai' },
      { en: 'Mobile-first VIP checkout', lt: 'Mobilus VIP atsiskaitymas' }
    ]
  },
  {
    theme: 'theme-atelier',
    tag: { en: 'B2B SaaS', lt: 'B2B SaaS' },
    title: 'Northwind Ops',
    copy: {
      en: 'Cut onboarding time in half by aligning product tours, coaching, and enablement.',
      lt: 'Perpus sutrumpinome įkėlimą suderinę produkto pristatymus, mokymus ir įgalinimą.'
    },
    bullets: [
      { en: 'Deal-desk workflow automation', lt: 'Sandorių vadybos automatizacija' },
      { en: 'Signals-based success coaching', lt: 'Signalais paremta sėkmės konsultacija' },
      { en: 'Executive KPI command center', lt: 'Vadovų KPI valdymo centras' }
    ]
  },
  {
    theme: 'theme-lucent',
    tag: { en: 'Hospitality', lt: 'Svetingumas' },
    title: 'Meridian Suites',
    copy: {
      en: 'Raised direct bookings 44% by mirroring the premium stay across every touchpoint.',
      lt: 'Padidinome tiesioginius užsakymus 44 %, visus kontaktus suderinę su premium viešnage.'
    },
    bullets: [
      { en: 'Personalized itinerary builder', lt: 'Personalizuotas maršrutų planuotojas' },
      { en: 'Real-time status messaging', lt: 'Pranešimai realiu laiku' },
      { en: 'Mobile concierge microsite', lt: 'Mobilus konsjeržo mikro puslapis' }
    ]
  }
] as const;

const OFFER_POINTS = [
  {
    heading: { en: 'Only for market shapers', lt: 'Tik rinkos formuotojams' },
    body: {
      en: 'We partner with leaders who protect their time, demand discretion, and invest in premium perception.',
      lt: 'Dirbame su lyderiais, kurie saugo savo laiką, vertina diskretiškumą ir investuoja į premium įvaizdį.'
    }
  },
  {
    heading: { en: 'Lead systems that close', lt: 'Uždarančios piltuvų sistemos' },
    body: {
      en: 'Positioning, paid, outbound, and nurture move in concert to convert high-consideration buyers.',
      lt: 'Pozicionavimas, reklama, outbound ir palaikymas veikia kartu, kad įtikintų aukštos vertės pirkėjus.'
    }
  },
  {
    heading: { en: 'Lithuanian roots, global reach', lt: 'Lietuviškos šaknys, pasaulinis mastas' },
    body: {
      en: 'Vilnius-based, trusted by international brands seeking discreet acceleration and measurable growth.',
      lt: 'Įsikūrę Vilniuje, dirbame su tarptautiniais prekių ženklais, siekiančiais diskretiško ir pamatuojamo augimo.'
    }
  }
] as const;

const METHOD_STEPS = [
  {
    phase: { en: '01. Evidence sprint', lt: '01. Įrodymų sprintas' },
    detail: {
      en: 'Within 14 days we audit funnels, messaging, and ops to surface the leaks blocking premium buyers.',
      lt: 'Per 14 dienų audituojame piltuvus, žinutes ir operacijas, kad rastume kliūtis, stabdančias premium pirkėjus.'
    }
  },
  {
    phase: { en: '02. Signature architecture', lt: '02. Parašas architektūroje' },
    detail: {
      en: 'We design scarcity-backed journeys, revenue dashboards, and enablement rituals for your team.',
      lt: 'Kuriame retumu paremtus kelius, pajamų suvestines ir komandos ritualus.'
    }
  },
  {
    phase: { en: '03. Launch and refine', lt: '03. Paleidimas ir tobulinimas' },
    detail: {
      en: 'Weekly partner sessions align experiments, track impact, and keep momentum disciplined.',
      lt: 'Savaitiniai partnerių susitikimai derina eksperimentus, matuoja poveikį ir išlaiko discipliną.'
    }
  },
  {
    phase: { en: '04. Scale with confidence', lt: '04. Skaluokite užtikrintai' },
    detail: {
      en: 'We coach internal teams to own the system while remaining on call for premium enhancements.',
      lt: 'Mokome vidines komandas valdyti sistemą ir liekame pasiekiami premium patobulinimams.'
    }
  }
] as const;

const METHOD_DELIVERABLES = [
  { en: 'Executive conversion dashboard', lt: 'Vadovų konversijų suvestinė' },
  { en: 'Premium messaging frameworks', lt: 'Premium žinučių struktūros' },
  { en: 'Revenue enablement scripts', lt: 'Pajamų įgalinimo skriptai' },
  { en: '90-day acceleration roadmap', lt: '90 dienų spartinimo planas' }
] as const;

const METHOD_CARD = {
  heading: { en: 'What you receive', lt: 'Ką gaunate' },
  note: {
    en: 'Guided by a senior partner each week.',
    lt: 'Kiekvieną savaitę dirbame su vyresniuoju partneriu.'
  }
} as const;

const SHOWCASE_COPY = {
  eyebrow: { en: 'Client wins', lt: 'Rezultatai' },
  heading: {
    en: 'Lead systems engineered for premium revenue',
    lt: 'Premium pajamoms sukurti piltuvai'
  },
  body: {
    en: 'We design, launch, and scale high-consideration funnels that protect brand equity while compounding pipeline.',
    lt: 'Kuriame, paleidžiame ir plečiame aukštos vertės piltuvus, kurie saugo prekės ženklo prestižą ir didina pardavimo vamzdyną.'
  }
} as const;

const OFFER_INTRO = {
  eyebrow: { en: 'Offer', lt: 'Pasiūlymas' },
  heading: {
    en: 'Premium growth reserved for committed teams',
    lt: 'Premium augimas skiriamas įsipareigojusioms komandoms'
  },
  body: {
    en: 'We collaborate with founders and marketing leaders prepared to invest in rare, defensible experiences.',
    lt: 'Dirbame su vadovais ir marketingo lyderiais, pasirengusiais investuoti į retas, apsaugomas patirtis.'
  },
  quote: {
    en: 'Victory favours brands who treat attention as an asset.',
    lt: 'Pergalė lydi ženklus, kurie dėmesį laiko turtu.'
  },
  note: {
    en: 'Sessions run in English or Lithuanian—your choice.',
    lt: 'Sesijas vedame anglų arba lietuvių kalba – pagal jūsų pasirinkimą.'
  }
} as const;

const OFFER_CTA = { en: 'Request a private proposal', lt: 'Paprašyti privataus pasiūlymo' } as const;

const METHOD_INTRO = {
  eyebrow: { en: 'Method', lt: 'Metodika' },
  heading: {
    en: 'Four disciplined moves to unlock premium demand',
    lt: 'Keturi disciplinuoti žingsniai premium paklausai atrakinti'
  },
  body: {
    en: 'Evidence, architecture, launch, and scale—each stage is accountable to measurable revenue.',
    lt: 'Įrodymai, architektūra, paleidimas ir mastelis – kiekvienas etapas siejamas su pamatuojamomis pajamomis.'
  }
} as const;

const CONTACT_COPY = {
  eyebrow: { en: 'Contact', lt: 'Kontaktai' },
  heading: {
    en: 'Request a private growth intensive',
    lt: 'Pateikite privačią augimo užklausą'
  },
  body: {
    en: 'Share goals, markets, and constraints—we respond with a discreet diagnostic and next steps.',
    lt: 'Papasakokite apie tikslus, rinkas ir ribojimus – atsiųsime diskretišką diagnostiką ir tolimesnius žingsnius.'
  },
  emailLabel: { en: 'Work email', lt: 'Darbo el. paštas' },
  emailPlaceholder: { en: 'growth@brand.com', lt: 'growth@brand.com' },
  messageLabel: { en: 'What do you want to transform?', lt: 'Ką norite transformuoti?' },
  messagePlaceholder: {
    en: 'Premium funnels, conversion messaging, executive enablement…',
    lt: 'Premium piltuvai, konversijų žinutės, vadovų įgalinimas…'
  },
  submit: {
    idle: { en: 'Request a premium audit', lt: 'Paprašyti premium audito' },
    success: { en: 'Request received', lt: 'Užklausa gauta' }
  },
  meta: { en: 'Premium studio · Vilnius', lt: 'Premium studija · Vilnius' }
} as const;

const FOOTER_COPY = {
  tagline: {
    en: 'Private revenue lab for premium brands.',
    lt: 'Privati pajamų laboratorija premium ženklams.'
  }
} as const;

function App() {
  const appRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const navListRef = useRef<HTMLUListElement | null>(null);
  const navToggleRef = useRef<HTMLButtonElement | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('#intro');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>();
  const pointerMoveRef = useRef<(event: PointerEvent) => void>();

  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const getText = <T extends Record<Language, string>>(value: T) => value[language];

  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false
    } as any);

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

    const scrollTriggerRefresh = () => {
      const updater = (lenis as any).update;
      if (typeof updater === 'function') {
        updater.call(lenis);
      }
    };
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
          <nav ref={navRef} className={`primary-nav${navOpen ? ' open' : ''}`} aria-label="Primary navigation">
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
                    {getText(item.label)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="header-controls">
            <div className="language-toggle" role="radiogroup" aria-label="Site language">
              {LANGUAGES.map(({ code, label }) => (
                <button
                  key={code}
                  type="button"
                  className={`language-toggle__btn${language === code ? ' is-active' : ''}`}
                  aria-pressed={language === code}
                  onClick={() => setLanguage(code)}
                >
                  {label}
                </button>
              ))}
            </div>
            <a className="btn btn-outline" href="#contact">{getText(HEADER_CTA)}</a>
          </div>
        </div>
      </header>

      <aside className="side-dots" aria-label="Section navigation">
        {NAV_ITEMS.map((item) => (
          <a
            key={`dot-${item.href}`}
            href={item.href}
            className={`dot${activeSection === item.href ? ' is-active' : ''}`}
            aria-label={getText(item.label)}
          />
        ))}
      </aside>

      <main id="smooth-wrapper">
        <div id="smooth-content">
          <section className="section hero" id="intro" data-section>
            <div className="hero-sheen" aria-hidden="true" />
            <div className="container hero-grid">
              <div className="hero-copy" data-animate>
                <span className="hero-badge" data-hero="badge">{getText(HERO_CONTENT.badge)}</span>
                <h1 data-hero="title">{getText(HERO_CONTENT.title)}</h1>
                <p data-hero="lead">{getText(HERO_CONTENT.lead)}</p>
                <div className="hero-actions" data-hero="actions">
                  {HERO_CONTENT.actions.map((action) => (
                    <a key={action.href} className={`btn ${action.href === '#contact' ? 'btn-solid' : 'btn-ghost'}`} href={action.href}>
                      {getText(action.label)}
                    </a>
                  ))}
                </div>
                <dl className="hero-metrics" data-hero="metrics">
                  {HERO_METRICS.map((metric) => (
                    <div key={metric.label.en}>
                      <dt>{getText(metric.label)}</dt>
                      <dd>{getText(metric.value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="hero-media" data-animate>
                <div className="hero-capsule">
                  <div className="hero-gradient" aria-hidden="true" />
                  <div className="hero-card" data-hero="card">
                    <span className="card-kicker">{getText(HERO_CONTENT.card.kicker)}</span>
                    <h3>{getText(HERO_CONTENT.card.title)}</h3>
                    <p>{getText(HERO_CONTENT.card.body)}</p>
                    <ul className="card-list">
                      {HERO_CONTENT.card.list.map((item) => (
                        <li key={item.en}>{getText(item)}</li>
                      ))}
                    </ul>
                    <div className="card-ribbon">
                      <img src={logoWordmarkWhite} alt="W mark" width={32} height={32} />
                      <span>{getText(HERO_CONTENT.card.ribbon)}</span>
                    </div>
                  </div>
                  <div className="hero-pulses" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <div className="hero-stack" data-animate>
                  {HERO_PILLARS.map((pillar) => (
                    <div key={pillar.title.en} className="hero-pill">
                      <strong>{getText(pillar.title)}</strong>
                      <p>{getText(pillar.description)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="hero-marquee" aria-hidden="true">
              <div className="marquee-track">
                {[...Array(2)]
                  .flatMap(() => HERO_MARQUEE[language])
                  .map((phrase, index) => (
                    <span key={`${phrase}-${index}`}>{phrase}</span>
                  ))}
              </div>
            </div>
          </section>

          <section className="section section-panorama" id="showcase" aria-label="Showcase" data-section>
            <div className="container section-head">
              <div data-animate>
                <span className="eyebrow">{getText(SHOWCASE_COPY.eyebrow)}</span>
                <h2>{getText(SHOWCASE_COPY.heading)}</h2>
              </div>
              <p data-animate>{getText(SHOWCASE_COPY.body)}</p>
            </div>
            <div className="panorama">
              <div className="panorama-track">
                {SHOWCASE_ITEMS.map((item) => (
                  <article key={item.title} className={`panorama-card ${item.theme}`} data-animate>
                    <div className="card-inner">
                      <span className="card-tag">{getText(item.tag)}</span>
                      <h3>{item.title}</h3>
                      <p>{getText(item.copy)}</p>
                      <ul>
                        {item.bullets.map((bullet) => (
                          <li key={bullet.en}>{getText(bullet)}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section section-offer" id="story" data-section>
            <div className="container offer-grid">
              <div className="offer-intro" data-animate>
                <span className="eyebrow">{getText(OFFER_INTRO.eyebrow)}</span>
                <h2>{getText(OFFER_INTRO.heading)}</h2>
                <p>{getText(OFFER_INTRO.body)}</p>
                <p className="offer-quote">{getText(OFFER_INTRO.quote)}</p>
              </div>
              <div className="offer-points">
                {OFFER_POINTS.map((point) => (
                  <article key={point.heading.en} data-animate>
                    <h3>{getText(point.heading)}</h3>
                    <p>{getText(point.body)}</p>
                  </article>
                ))}
                <div className="offer-cta" data-animate>
                  <a className="btn btn-solid" href="#contact">{getText(OFFER_CTA)}</a>
                  <p>{getText(OFFER_INTRO.note)}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="section section-method" id="type" data-section>
            <div className="container method-grid">
              <div className="method-intro" data-animate>
                <span className="eyebrow">{getText(METHOD_INTRO.eyebrow)}</span>
                <h2>{getText(METHOD_INTRO.heading)}</h2>
                <p>{getText(METHOD_INTRO.body)}</p>
              </div>
              <div className="method-steps" data-animate>
                <ol>
                  {METHOD_STEPS.map((step) => (
                    <li key={step.phase.en}>
                      <h3>{getText(step.phase)}</h3>
                      <p>{getText(step.detail)}</p>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="method-proof" data-animate>
                <div className="method-card">
                  <h3>{getText(METHOD_CARD.heading)}</h3>
                  <ul>
                    {METHOD_DELIVERABLES.map((deliverable) => (
                      <li key={deliverable.en}>{getText(deliverable)}</li>
                    ))}
                  </ul>
                  <p className="method-note">{getText(METHOD_CARD.note)}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="section section-contact" id="contact" aria-labelledby="contact-title" data-section>
            <div className="container contact-card" data-animate>
              <div className="contact-copy">
                <span className="eyebrow">{getText(CONTACT_COPY.eyebrow)}</span>
                <h2 id="contact-title">{getText(CONTACT_COPY.heading)}</h2>
                <p>{getText(CONTACT_COPY.body)}</p>
              </div>
              <form className="contact-form" onSubmit={handleFormSubmit}>
                <label>
                  <span>{getText(CONTACT_COPY.emailLabel)}</span>
                  <input
                    type="email"
                    name="email"
                    placeholder={getText(CONTACT_COPY.emailPlaceholder)}
                    required
                  />
                </label>
                <label>
                  <span>{getText(CONTACT_COPY.messageLabel)}</span>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder={getText(CONTACT_COPY.messagePlaceholder)}
                    required
                  />
                </label>
                <button className="btn btn-solid" type="submit" disabled={formSubmitted}>
                  {getText(formSubmitted ? CONTACT_COPY.submit.success : CONTACT_COPY.submit.idle)}
                </button>
              </form>
              <div className="contact-meta" aria-hidden="true">
                <span>© {currentYear} Wunderbit</span>
                <span>{getText(CONTACT_COPY.meta)}</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <img src={logoMarkWhite} alt="Wunderbit monogram" width={44} height={44} />
            <p>{getText(FOOTER_COPY.tagline)}</p>
          </div>
          <ul className="footer-links">
            {NAV_ITEMS.map((item) => (
              <li key={`footer-${item.href}`}>
                <a href={item.href}>{getText(item.label)}</a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default App;
