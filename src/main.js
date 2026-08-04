/**
 * main.js — Application Entry Point
 * Beauty Store
 *
 * Bootstraps: i18n → Header → CartDrawer → ShopSection
 */

import i18n        from './context/i18n.js';
import cartStore   from './context/cartStore.js';
import Header      from './components/layout/Header.js';
import CartDrawer  from './components/cart/CartDrawer.js';
import ShopSection from './components/product/ShopSection.js';

// ── 1. i18n init ──────────────────────────────────────────────────────────────
i18n.init();

// ── 2. Cart drawer ────────────────────────────────────────────────────────────
const cartDrawer = new CartDrawer();
cartDrawer.mount(document.body);

// ── 3. Header ─────────────────────────────────────────────────────────────────
const headerRoot = document.getElementById('header-root');
if (headerRoot) {
  const { count, items } = cartStore.summary();
  const header = new Header({ cartCount: count });
  const headerEl = header.render();
  headerRoot.replaceWith(headerEl);

  // Wire the cart icon in the header to open the drawer
  document.addEventListener('click', e => {
    if (e.target.closest('#btn-cart')) {
      e.preventDefault();
      cartDrawer.toggle();
    }
  });
}

// ── 4. Shop section ───────────────────────────────────────────────────────────
const shopRoot = document.getElementById('shop-root');
if (shopRoot) {
  const shop = new ShopSection({ cartDrawer });
  shop.mount(shopRoot);
}

// ── 5. Update header cart badge on cart change ────────────────────────────────
document.addEventListener('cartchange', ({ detail }) => {
  const badge = document.querySelector('#btn-cart .header__badge');
  if (badge) {
    badge.textContent = detail.count;
    badge.style.display = detail.count > 0 ? 'flex' : 'none';
  } else if (detail.count > 0) {
    // Badge doesn't exist yet — re-render header
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

// ── 6. Global lang change ─────────────────────────────────────────────────────
document.addEventListener('langchange', ({ detail }) => {
  // Update page <title>
  document.title = detail.lang === 'ar'
    ? 'لوميير — الجمال الفاخر'
    : 'Lumière — Beauté Premium';

  // Cross-fade animation
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 200ms ease';
  requestAnimationFrame(() => {
    setTimeout(() => { document.body.style.opacity = '1'; }, 60);
  });
});

// ── 7. Logo → scroll to top ───────────────────────────────────────────────────
document.addEventListener('click', e => {
  if (e.target.closest('.header__logo')) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// ── 8. Keyboard: close cart on Escape ────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') cartDrawer.close();
});

// ── 9. Active nav on scroll ───────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = () => document.querySelectorAll('.header__nav-link');

if (sections.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks().forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  sections.forEach(s => observer.observe(s));
}
