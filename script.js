// Modern scrollytelling with Lenis + GSAP
(function () {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.primary-nav');
  const list = document.getElementById('nav-list');
  if (toggle && nav && list) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    list.addEventListener('click', (e) => {
      if (e.target instanceof HTMLAnchorElement) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Current year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Smooth scroll with Lenis (if available)
  let lenis = null;
  try {
    // eslint-disable-next-line no-undef
    if (window.Lenis) {
      // eslint-disable-next-line no-undef
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false,
      });
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    }
  } catch (_) {}

  // Enhance anchor links to use Lenis scroll
  if (lenis) {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (a) {
        const id = a.getAttribute('href');
        if (id?.length > 1) {
          const el = document.querySelector(id);
          if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -70 }); }
        }
      }
    });
  }

  // GSAP animations
  // eslint-disable-next-line no-undef
  if (window.gsap) {
    // eslint-disable-next-line no-undef
    const gsap = window.gsap;
    // eslint-disable-next-line no-undef
    const ScrollTrigger = window.ScrollTrigger;
    if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    // Keep ScrollTrigger updated with Lenis
    if (lenis && ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
    }

    // Subtle parallax for the global plinth background
    if (ScrollTrigger) {
      gsap.to('.bg-plinth', {
        y: 60,
        ease: 'none',
        scrollTrigger: {
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        }
      });
    }

    // Hero entrance
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mqReduce.matches) {
      const heroTl = gsap.timeline({ delay: 0.1 });
      heroTl.from('.eyebrow', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' })
            .from('.display', { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3')
            .from('.sub', { y: 16, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
            .from('.actions', { y: 14, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.4')
            .from('.logo-plinth', { scale: 0.96, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3');

      // Orbs soft float
      gsap.to('.orb-1', { y: 16, x: -10, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.orb-2', { y: -12, x: 12, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.orb-3', { y: 18, x: -6, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }

    // Pinned horizontal showcase
    const track = document.querySelector('.h-track');
    const showcase = document.querySelector('#showcase');
    if (track && showcase && ScrollTrigger) {
      const horizontal = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: showcase,
          start: 'top top',
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        }
      });
      // Recalculate on resize
      window.addEventListener('resize', () => { if (horizontal.scrollTrigger) horizontal.scrollTrigger.refresh(); });
    }

    // Section fade/translate on enter
    gsap.utils.toArray('.panel').forEach((panel) => {
      if (panel.id === 'showcase') return; // handled by pin
      gsap.from(panel.querySelectorAll('h1,h2,p,.palette,.type-samples,.cta-card'), {
        y: 22, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: panel, start: 'top 70%', toggleActions: 'play none none reverse' }
      });
    });

    // Side dots active state
    const panels = gsap.utils.toArray('.panel');
    const dots = gsap.utils.toArray('.side-dots .dot');
    if (panels.length === dots.length && ScrollTrigger) {
      panels.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => dots[i].classList.add('is-active'),
          onEnterBack: () => dots[i].classList.add('is-active'),
          onLeave: () => dots[i].classList.remove('is-active'),
          onLeaveBack: () => dots[i].classList.remove('is-active')
        });
      });
    }

    // Make sure ScrollTrigger updates when Lenis animates
    if (lenis && ScrollTrigger) {
      const update = () => ScrollTrigger.update();
      lenis.on('scroll', update);
    }
  }
})();
