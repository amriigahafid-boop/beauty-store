/**
 * main.js — Application Entry Point
 * Beauty Store
 *
 * Boot order (all inside DOMContentLoaded):
 *  1. i18n.init()        — load persisted language, apply dir/translations
 *  2. CartDrawer         — mounts overlay + drawer into document.body
 *  3. Header             — replaces #header-root with rendered header
 *  4. HeroSlider         — injects full hero section into #hero-root,
 *                          then creates the three interactive sliders
 *  5. ShopSection        — renders product grid into #shop-root
 *  6. Global listeners   — cart badge, lang fade, Escape key, scroll nav
 */

import i18n        from './context/i18n.js';
import cartStore   from './context/cartStore.js';
import Header      from './components/layout/Header.js';
import CartDrawer  from './components/cart/CartDrawer.js';
import HeroSlider  from './components/hero/HeroSlider.js';
import ShopSection from './components/product/ShopSection.js';

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. i18n ────────────────────────────────────────────────────────────────
  i18n.init();

  // ── 2. Cart drawer ─────────────────────────────────────────────────────────
  const cartDrawer = new CartDrawer();
  cartDrawer.mount(document.body);

  // ── 3. Header ──────────────────────────────────────────────────────────────
  const headerRoot = document.getElementById('header-root');
  if (headerRoot) {
    const header   = new Header({ cartCount: cartStore.summary().count });
    const headerEl = header.render();
    headerRoot.replaceWith(headerEl);

    // Wire cart icon → toggle drawer
    document.addEventListener('click', e => {
      if (e.target.closest('#btn-cart')) {
        e.preventDefault();
        cartDrawer.toggle();
      }
    });
  }

  // ── 4. Hero sliders ────────────────────────────────────────────────────────
  new HeroSlider({ cartDrawer }).mount();

  // ── 5. Shop section ────────────────────────────────────────────────────────
  const shopRoot = document.getElementById('shop-root');
  if (shopRoot) {
    new ShopSection({ cartDrawer }).mount(shopRoot);
  }

  // ── 6. Global listeners ────────────────────────────────────────────────────

  // Cart badge update
  document.addEventListener('cartchange', ({ detail }) => {
    const badge = document.querySelector('#btn-cart .header__badge');
    if (badge) {
      badge.textContent    = detail.count;
      badge.style.display  = detail.count > 0 ? 'flex' : 'none';
    } else if (detail.count > 0) {
      const btn = document.getElementById('btn-cart');
      if (btn && !btn.querySelector('.header__badge')) {
        const b = document.createElement('span');
        b.className = 'header__badge';
        b.setAttribute('aria-label', `${detail.count} articles`);
        b.textContent = detail.count;
        btn.appendChild(b);
      }
    }
  });

  // Language change → page title + cross-fade
  document.addEventListener('langchange', ({ detail }) => {
    document.title = detail.lang === 'ar'
      ? 'لوميير — الجمال الفاخر'
      : 'Lumière — Beauté & Cosmétiques Premium';

    document.body.style.opacity   = '0';
    document.body.style.transition = 'opacity 200ms ease';
    requestAnimationFrame(() => {
      setTimeout(() => { document.body.style.opacity = '1'; }, 60);
    });
  });

  // Logo → scroll to top
  document.addEventListener('click', e => {
    if (e.target.closest('.header__logo')) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // Escape → close cart
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') cartDrawer.close();
  });

  // Active nav link on scroll
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.header__nav-link').forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));
  // Re-observe after hero is injected (hero section is created after DOMContentLoaded)
  document.addEventListener('langchange', () => {
    document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));
  });

});
