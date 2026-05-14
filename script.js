/* ═══════════════════════════════════════════════════
   APEX DETAIL STUDIO — JavaScript
   ═══════════════════════════════════════════════════ */

'use strict';

/* ── DOM Ready ── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  initHero();
  initMobileMenu();
  initForm();
  initSmoothScroll();
});

/* ═══════════════════════════════════════════════════
   NAVIGATION — scroll behaviour
═══════════════════════════════════════════════════ */
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load
}

/* ═══════════════════════════════════════════════════
   MOBILE MENU
═══════════════════════════════════════════════════ */
function initMobileMenu() {
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('mobileMenu');
  const links  = document.querySelectorAll('.mobile-link');
  if (!burger || !menu) return;

  const toggle = (open) => {
    burger.classList.toggle('active', open);
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  burger.addEventListener('click', () => {
    toggle(!menu.classList.contains('open'));
  });

  links.forEach(link => {
    link.addEventListener('click', () => toggle(false));
  });
}

/* ═══════════════════════════════════════════════════
   HERO — subtle scale animation on load
═══════════════════════════════════════════════════ */
function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  // Slight delay so the CSS transition is visible
  requestAnimationFrame(() => {
    setTimeout(() => hero.classList.add('loaded'), 100);
  });
}

/* ═══════════════════════════════════════════════════
   REVEAL ON SCROLL — IntersectionObserver
═══════════════════════════════════════════════════ */
function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings in the same parent
          const siblings = Array.from(
            entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
          );
          const idx = siblings.indexOf(entry.target);
          const delay = Math.min(idx * 80, 400);

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  elements.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════════
   SMOOTH SCROLL — for anchor links
═══════════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('nav')?.offsetHeight || 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ═══════════════════════════════════════════════════
   CONTACT FORM — minimal UX
═══════════════════════════════════════════════════ */
function initForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn  = form.querySelector('button[type="submit"]');
    const span = btn.querySelector('span');
    const orig = span.textContent;

    // Loading state
    btn.disabled   = true;
    span.textContent = 'Wird gesendet …';

    // Simulate async send (replace with real fetch in production)
    setTimeout(() => {
      btn.disabled     = false;
      span.textContent = orig;
      form.reset();
      if (success) {
        success.classList.add('show');
        setTimeout(() => success.classList.remove('show'), 6000);
      }
    }, 1400);
  });

  // Live float-label feel — subtle border accent on focus
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
    });
  });
}

/* ═══════════════════════════════════════════════════
   PARALLAX — subtle hero image shift on scroll
═══════════════════════════════════════════════════ */
(function initParallax() {
  const heroImg = document.querySelector('.hero__img');
  if (!heroImg) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const offset = window.scrollY;
        const max    = window.innerHeight;
        if (offset < max) {
          const y = offset * 0.25;
          heroImg.style.transform = `scale(1) translateY(${y}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ═══════════════════════════════════════════════════
   NUMBER COUNTER — animates stats when visible
═══════════════════════════════════════════════════ */
(function initCounters() {
  const stats = document.querySelectorAll('.stat__num');
  if (!stats.length) return;

  const extractNumber = (el) => {
    const text = el.textContent;
    return parseInt(text.replace(/\D/g, ''), 10) || 0;
  };

  const getSuffix = (el) => {
    const sup = el.querySelector('sup');
    return sup ? sup.textContent : '';
  };

  const animateCount = (el, target, suffix) => {
    const duration = 1800;
    const start    = performance.now();

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current  = Math.round(ease * target);

      el.textContent = current;
      if (suffix) {
        const sup = document.createElement('sup');
        sup.textContent = suffix;
        el.appendChild(sup);
      }

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = extractNumber(el);
          const suffix = getSuffix(el);
          animateCount(el, target, suffix);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach(stat => observer.observe(stat));
})();
