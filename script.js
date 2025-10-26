// Premium scrollytelling experience powered by Lenis + GSAP
(function () {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.primary-nav');
  const navList = document.getElementById('nav-list');
  const navLinks = navList ? Array.from(navList.querySelectorAll('a')) : [];

  if (toggle && nav && navList) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    navList.addEventListener('click', (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target) && event.target !== toggle) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const setHeaderState = (scrollY) => {
    if (!header) return;
    if (scrollY > 24) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };

  let lenis = null;
  try {
    if (window.Lenis) {
      lenis = new window.Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false
      });

      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  } catch (_) {}

  const handleAnchor = (event) => {
    const target = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
    if (!target) return;
    const hash = target.getAttribute('href');
    if (!hash || hash.length <= 1) return;
    const section = document.querySelector(hash);
    if (!section) return;
    event.preventDefault();

    if (lenis) {
      lenis.scrollTo(section, { offset: -140 });
    } else {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.scrollBy({ top: -140, behavior: 'smooth' });
    }
  };

  document.addEventListener('click', handleAnchor);

  if (lenis) {
    lenis.on('scroll', ({ scroll }) => setHeaderState(scroll));
  } else {
    setHeaderState(window.scrollY);
    window.addEventListener('scroll', () => setHeaderState(window.scrollY), { passive: true });
  }

  const contactForm = document.querySelector('.contact-form');
  if (contactForm instanceof HTMLFormElement) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const submit = contactForm.querySelector('button[type="submit"]');
      if (submit) {
        submit.setAttribute('disabled', 'true');
        submit.textContent = 'Request received';
      }
    });
  }

  const dotLinks = Array.from(document.querySelectorAll('.side-dots .dot'));

  if (window.gsap) {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    if (lenis && ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
      const heroTl = gsap.timeline({ delay: 0.2 });
      heroTl.from('[data-hero="badge"]', { y: 24, opacity: 0, duration: 0.6, ease: 'power3.out' })
            .from('[data-hero="title"]', { y: 28, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3')
            .from('[data-hero="lead"]', { y: 24, opacity: 0, duration: 0.65, ease: 'power3.out' }, '-=0.4')
            .from('[data-hero="actions"]', { y: 22, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
            .from('[data-hero="metrics"] div', { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out', stagger: 0.12 }, '-=0.4')
            .from('[data-hero="card"]', { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5');

      const gradient = document.querySelector('.hero-gradient');
      if (gradient && window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('pointermove', (event) => {
          const x = (event.clientX / window.innerWidth - 0.5) * 80;
          const y = (event.clientY / window.innerHeight - 0.5) * 60;
          gsap.to(gradient, { x, y, duration: 1.2, ease: 'power3.out' });
        }, { passive: true });
      }
    }

    if (ScrollTrigger) {
      gsap.utils.toArray('[data-animate]').forEach((element) => {
        gsap.from(element, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 70%'
          }
        });
      });
    }

    const panoramaTrack = document.querySelector('.panorama-track');
    const panoramaSection = document.querySelector('.section-panorama');
    if (panoramaTrack && panoramaSection && ScrollTrigger) {
      const pin = gsap.to(panoramaTrack, {
        x: () => {
          const max = panoramaTrack.scrollWidth - window.innerWidth;
          return max > 0 ? -max : 0;
        },
        ease: 'none',
        scrollTrigger: {
          trigger: panoramaSection,
          start: 'top top',
          end: () => `+=${Math.max(1, panoramaTrack.scrollWidth - window.innerWidth)}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true
        }
      });

      window.addEventListener('resize', () => {
        if (pin.scrollTrigger) pin.scrollTrigger.refresh();
      });
    }

  const sections = gsap.utils.toArray('section[id]');

    const setActiveNav = (id) => {
      navLinks.forEach((link) => {
        if (link.hash === id) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
      dotLinks.forEach((dot) => {
        if (dot.getAttribute('href') === id) dot.classList.add('is-active');
        else dot.classList.remove('is-active');
      });
    };

    if (ScrollTrigger) {
      sections.forEach((section) => {
        const id = `#${section.id}`;
        ScrollTrigger.create({
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveNav(id),
          onEnterBack: () => setActiveNav(id)
        });
      });
      if (sections[0]) setActiveNav(`#${sections[0].id}`);
    }

    if (!reduceMotion) {
      const marqueeTrack = document.querySelector('.hero-marquee .marquee-track');
      if (marqueeTrack) {
        marqueeTrack.style.animation = 'none';
        gsap.to(marqueeTrack, {
          xPercent: -50,
          ease: 'none',
          duration: 24,
          repeat: -1
        });
      }
    }
  }
})();
