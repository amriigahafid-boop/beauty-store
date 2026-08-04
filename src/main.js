/**
 * main.js — Application Entry Point
 * Beauty Store
 *
 * Bootstraps i18n, renders the header, and wires up global UI behaviour.
 */

import i18n  from './context/i18n.js';
import Header from './components/layout/Header.js';

// ── 1. Initialise i18n (reads localStorage → defaults to 'fr') ─────────────
i18n.init();

// ── 2. Mount the header ────────────────────────────────────────────────────
const headerRoot = document.getElementById('header-root');
if (headerRoot) {
  const header = new Header({ cartCount: 3, wishlistCount: 1 });
  headerRoot.replaceWith(header.render());
}

// ── 3. React to language changes globally ──────────────────────────────────
document.addEventListener('langchange', ({ detail }) => {
  console.info(`[App] Language changed → ${detail.lang} (${detail.dir})`);

  // Update <title> for screen readers
  document.title = detail.lang === 'ar'
    ? 'لوميير — الجمال الفاخر'
    : 'Lumière — Beauté Premium';

  // Animate the page on direction flip (cross-fade effect)
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 200ms ease';
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 50);
  });
});

// ── 4. Scroll-to-top on logo click ────────────────────────────────────────
document.addEventListener('click', e => {
  if (e.target.closest('.header__logo')) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// ── 5. Highlight active nav link on scroll ─────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.header__nav-link');

if (sections.length && navLinks.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(s => observer.observe(s));
}
