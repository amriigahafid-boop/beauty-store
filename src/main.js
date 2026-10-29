/**
 * main.js — Application Entry Point
 * Lumière Beauty Store — src/main.js
 *
 * Boot order (all inside DOMContentLoaded):
 *  1. i18n.init()        — load persisted language, apply dir/lang/translations
 *  2. CartDrawer         — mounts overlay + drawer into document.body
 *  3. Header             — replaces #header-root with rendered header
 *  4. ShopSection        — renders product grid & guarantees into #shop-root
 *  5. HomeSections       — renders concerns, brands, bundles, reviews, FAQ
 *  6. Global listeners   — cart badge, langchange title sync, Escape key, scroll nav
 */

import i18n         from './context/i18n.js';
import cartStore    from './context/cartStore.js';
import Header       from './components/layout/Header.js';
import CartDrawer   from './components/cart/CartDrawer.js';
import ShopSection  from './components/product/ShopSection.js';
import HomeSections from './components/home/HomeSections.js';

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. i18n (single source of truth) ───────────────────────────────────────
  i18n.init();
  document.title = i18n.t('meta.title');

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

  // ── 4. Shop section ────────────────────────────────────────────────────────
  const shopRoot = document.getElementById('shop-root');
  if (shopRoot) {
    new ShopSection({ cartDrawer }).mount(shopRoot);
  }

  // ── 5. Additional Homepage Sections (Concerns, Brands, Bundles, Reviews, FAQ)
  new HomeSections({ cartDrawer }).mount({
    topRoot:    '#home-top-sections',
    bottomRoot: '#home-bottom-sections',
  });

  // Ensure all [data-i18n] nodes (including Static Hero & Footer) match the active locale
  i18n.applyTranslations();

  // ── 7. Global listeners ────────────────────────────────────────────────────

  // Cart badge update
  document.addEventListener('cartchange', ({ detail }) => {
    const badge = document.querySelector('#btn-cart .header__badge');
    if (badge) {
      badge.textContent   = detail.count;
      badge.style.display = detail.count > 0 ? 'flex' : 'none';
      badge.setAttribute('aria-label', i18n.t('actions.itemsCount', { count: detail.count }));
    } else if (detail.count > 0) {
      const btn = document.getElementById('btn-cart');
      if (btn && !btn.querySelector('.header__badge')) {
        const b = document.createElement('span');
        b.className = 'header__badge';
        b.setAttribute('aria-label', i18n.t('actions.itemsCount', { count: detail.count }));
        b.textContent = detail.count;
        btn.appendChild(b);
      }
    }
  });

  // Language change → update document title & re-observe sections
  document.addEventListener('langchange', () => {
    document.title = i18n.t('meta.title');
    document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));
  });

  // Logo → scroll to top
  document.addEventListener('click', e => {
    if (e.target.closest('.header__logo')) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Category and section links (#hair, #body, #shop, #brands, #sale) → switch tab or scroll
    const link = e.target.closest('a[href^="#"]');
    if (link) {
      const cat    = link.getAttribute('href').slice(1);
      const tabBtn = document.querySelector(`.filter-tab[data-filter="${cat}"]`);
      if (tabBtn) {
        e.preventDefault();
        tabBtn.click();
        document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
      } else if (cat) {
        const targetEl = document.getElementById(cat);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
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

});
