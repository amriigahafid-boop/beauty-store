/**
 * ShopSection.js — Product Grid + Filter Tabs + Guarantees Component
 * Lumière Beauty Store — src/components/product/ShopSection.js
 *
 * Strictly bound to active locale (`src/context/locales/`) and localized
 * product fields (`title[lang]`, `snippet[lang]`, `description[lang]`).
 * Listens to `langchange` and re-renders all items cleanly in the selected language.
 */

import products                             from '../../data/products.data.js';
import cartStore                            from '../../context/cartStore.js';
import i18n                                 from '../../context/i18n.js';
import { formatPrice }                      from '../../utils/currency.js';
import { effectivePrice, discountPercent }  from '../../services/productService.js';
import { showToast }                        from '../cart/CartDrawer.js';

// Category filter config with minimalist SVG icons
const FILTERS = [
  {
    key: 'all',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect></svg>`,
  },
  {
    key: 'hair',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>`,
  },
  {
    key: 'body',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>`,
  },
];

const HEART_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
const HEART_FILLED_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="#9D3B5C" stroke="#9D3B5C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;

class ShopSection {
  constructor({ cartDrawer } = {}) {
    this._cartDrawer   = cartDrawer;
    this._activeFilter = 'all';
    this._activeBrand  = null;
    this._wishlist     = new Set(JSON.parse(localStorage.getItem('beauty-store:wishlist') ?? '[]'));
    this._el           = null;
    this._obs          = null;

    this._onLangChange = () => this._refresh(true);
    this._onBrandFilter = ({ detail }) => {
      if (detail?.brand) {
        this._activeBrand  = detail.brand;
        this._activeFilter = 'all';
        this._refresh(true);
      }
    };

    document.addEventListener('langchange', this._onLangChange);
    document.addEventListener('brandfilter', this._onBrandFilter);
  }

  // ── Mount ──────────────────────────────────────────────────────────────
  mount(container) {
    this._el = typeof container === 'string' ? document.querySelector(container) : container;
    if (!this._el) return this;
    this._render(true);
    return this;
  }

  // ── Render ─────────────────────────────────────────────────────────────
  _render(immediateVisible = true) {
    if (!this._el) return;
    const lang     = i18n.lang;
    const filtered = this._getFiltered();

    this._el.innerHTML = `
      <section class="shop-section" id="shop" aria-label="${i18n.t('nav.shop')}">
        <div class="container">

          <!-- Section header -->
          <div class="section-header">
            <span class="section-header__eyebrow" data-i18n="categories.title">${i18n.t('categories.title')}</span>
            <h2 class="section-header__title" data-i18n="categories.subtitle">${i18n.t('categories.subtitle')}</h2>
            <p class="section-header__subtitle" data-i18n="categories.description">
              ${i18n.t('categories.description')}
            </p>
          </div>

          <!-- Filter tabs -->
          <div class="filter-tabs" id="filter-tabs" role="tablist">
            ${FILTERS.map(f => {
              const count = f.key === 'all' ? products.length : products.filter(p => p.category === f.key).length;
              const labelKey = `categoryLabels.${f.key}`;
              const label    = i18n.t(labelKey);
              const isActive = this._activeFilter === f.key && !this._activeBrand;
              return `
                <button
                  type="button"
                  class="filter-tab ${isActive ? 'active' : ''}"
                  data-filter="${f.key}"
                  role="tab"
                  aria-selected="${isActive}"
                >
                  <span class="filter-tab__icon">${f.icon}</span>
                  <span data-i18n="${labelKey}">${label}</span>
                  <span class="filter-tab__count">${count}</span>
                </button>
              `;
            }).join('')}
          </div>

          ${this._activeBrand ? `
            <div class="shop-brand-banner">
              <span class="shop-brand-banner__pill">
                <span><span data-i18n="categories.brandFilterLabel">${i18n.t('categories.brandFilterLabel')}</span> <strong>${this._activeBrand}</strong></span>
                <button type="button" class="shop-brand-banner__clear" id="btn-clear-brand" aria-label="${i18n.t('categories.clearBrandFilter')}">✕</button>
              </span>
            </div>
          ` : ''}

          <!-- Product grid -->
          <div class="product-grid" id="product-grid">
            ${filtered.map(p => this._renderCard(p, lang, immediateVisible)).join('')}
          </div>

        </div>
      </section>

      <!-- Luxury 4-Pillar Service & Guarantee Strip -->
      <section class="lux-guarantees" aria-label="${i18n.t('guarantees.sectionLabel')}">
        <div class="container">
          <div class="lux-guarantees__grid">

            <div class="lux-guarantee-card">
              <div class="lux-guarantee-card__icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
              </div>
              <div class="lux-guarantee-card__body">
                <h3 class="lux-guarantee-card__title" data-i18n="guarantees.authentic.title">${i18n.t('guarantees.authentic.title')}</h3>
                <p class="lux-guarantee-card__desc" data-i18n="guarantees.authentic.desc">${i18n.t('guarantees.authentic.desc')}</p>
              </div>
            </div>

            <div class="lux-guarantee-card">
              <div class="lux-guarantee-card__icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              </div>
              <div class="lux-guarantee-card__body">
                <h3 class="lux-guarantee-card__title" data-i18n="guarantees.shipping.title">${i18n.t('guarantees.shipping.title')}</h3>
                <p class="lux-guarantee-card__desc" data-i18n="guarantees.shipping.desc">${i18n.t('guarantees.shipping.desc')}</p>
              </div>
            </div>

            <div class="lux-guarantee-card">
              <div class="lux-guarantee-card__icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
              </div>
              <div class="lux-guarantee-card__body">
                <h3 class="lux-guarantee-card__title" data-i18n="guarantees.cod.title">${i18n.t('guarantees.cod.title')}</h3>
                <p class="lux-guarantee-card__desc" data-i18n="guarantees.cod.desc">${i18n.t('guarantees.cod.desc')}</p>
              </div>
            </div>

            <div class="lux-guarantee-card">
              <div class="lux-guarantee-card__icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <div class="lux-guarantee-card__body">
                <h3 class="lux-guarantee-card__title" data-i18n="guarantees.advisor.title">${i18n.t('guarantees.advisor.title')}</h3>
                <p class="lux-guarantee-card__desc" data-i18n="guarantees.advisor.desc">${i18n.t('guarantees.advisor.desc')}</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    `;

    this._bindTabEvents();
    this._bindCardEvents();
  }

  _renderCard(product, lang, immediateVisible = false) {
    const title     = product.title?.[lang]       ?? product.name?.[lang]    ?? product.title?.fr   ?? product.name?.fr    ?? '';
    const snippet   = product.snippet?.[lang]     ?? product.tagline?.[lang] ?? product.snippet?.fr ?? product.tagline?.fr ?? '';
    const desc      = product.description?.[lang] ?? product.description?.fr ?? '';
    const price     = effectivePrice(product);
    const regular   = product.price.regular;
    const onSale    = product.price.sale !== null;
    const pct       = discountPercent(product);
    const isOOS     = product.stock.status === 'out_of_stock';
    const isWished  = this._wishlist.has(product.id);
    const emoji     = product.images?.emoji ?? '🧴';
    const stars     = this._renderStars(product.rating.average);

    const primaryBadge = product.badges?.includes('bestseller')
      ? 'bestseller'
      : product.badges?.includes('vegan')
      ? 'vegan'
      : product.badges?.[0] || null;

    return `
      <article
        class="product-card${immediateVisible ? ' visible' : ''}"
        data-id="${product.id}"
        data-category="${product.category}"
        aria-label="${title}"
      >
        <!-- Image -->
        <div class="product-card__image-wrap">
          ${primaryBadge ? `
            <div class="product-card__badges">
              <span class="badge badge--${primaryBadge}" data-i18n="product.${primaryBadge}">${i18n.t(`product.${primaryBadge}`)}</span>
            </div>
          ` : ''}

          <a href="product.html?id=${encodeURIComponent(product.id)}" class="product-card__image-link" aria-label="${title}">
            ${product.images?.main
              ? `<img src="${product.images.main}" alt="${title}" class="product-card__image" loading="lazy" decoding="async" onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src=this.getAttribute('src').replace('/public/','/');}" />`
              : `<div class="product-card__image">${emoji}</div>`}
          </a>

          <button
            type="button"
            class="product-card__wishlist ${isWished ? 'active' : ''}"
            data-id="${product.id}"
            aria-label="${i18n.t('product.addToWishlist')}"
            title="${i18n.t('product.addToWishlist')}"
          >${isWished ? HEART_FILLED_SVG : HEART_SVG}</button>

          ${isOOS ? `<div class="product-card__oos-overlay" data-i18n="product.outOfStock">${i18n.t('product.outOfStock')}</div>` : ''}
        </div>

        <!-- Body -->
        <div class="product-card__body">
          <div class="product-card__brand">${product.brand}</div>
          <a href="product.html?id=${encodeURIComponent(product.id)}" class="product-card__name" style="text-decoration:none;color:inherit;display:block;">${title}</a>
          <div class="product-card__tagline">${snippet}</div>
          <details class="product-card__quick-view">
            <summary data-i18n="product.viewDescription">${i18n.t('product.viewDescription')}</summary>
            <div class="product-card__quick-view-content">${desc}</div>
          </details>

          <div class="product-card__rating">
            ${stars}
            <span style="font-size:var(--fs-xs);color:var(--color-text-muted);margin-inline-start:4px;">(${product.rating.count.toLocaleString()})</span>
          </div>

          <div class="product-card__price-row">
            <span class="product-card__price ${onSale ? 'product-card__price--sale' : ''}">
              ${formatPrice(price, lang)}
            </span>
            ${onSale ? `
              <span class="product-card__price-original">${formatPrice(regular, lang)}</span>
              <span class="product-card__discount-pct">-${pct}%</span>
            ` : ''}
          </div>

          <button
            type="button"
            class="product-card__cta"
            data-id="${product.id}"
            ${isOOS ? 'disabled' : ''}
            aria-label="${i18n.t('product.addToCart')}: ${title}"
          >
            <span class="product-card__cta-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cart-icon"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            </span>
            <span data-i18n="${isOOS ? 'product.outOfStock' : 'product.addToCart'}">${isOOS ? i18n.t('product.outOfStock') : i18n.t('product.addToCart')}</span>
          </button>
        </div>
      </article>
    `;
  }

  _renderStars(avg) {
    const full  = Math.floor(avg);
    const half  = avg - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return `
      <div class="star-rating">
        <div class="star-rating__stars">
          ${'<span class="star-rating__star">★</span>'.repeat(full)}
          ${half ? '<span class="star-rating__star">★</span>' : ''}
          ${'<span class="star-rating__star star-rating__star--empty">★</span>'.repeat(empty)}
        </div>
        <span class="star-rating__count">${avg.toFixed(1)}</span>
      </div>
    `;
  }

  // ── Event binding ──────────────────────────────────────────────────────
  _bindTabEvents() {
    this._el.querySelectorAll('.filter-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        this._activeFilter = btn.dataset.filter;
        this._activeBrand  = null;
        this._refresh(true);
      });
    });

    const clearBrandBtn = this._el.querySelector('#btn-clear-brand');
    clearBrandBtn?.addEventListener('click', () => {
      this._activeBrand = null;
      this._refresh(true);
    });
  }

  _bindCardEvents() {
    // Single-tap navigation on the entire product card (mobile & desktop)
    this._el.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Ignore clicks on interactive controls (Add to Cart, Wishlist, Quick View accordion, or direct anchor links)
        if (
          e.target.closest('.product-card__cta') ||
          e.target.closest('.product-card__wishlist') ||
          e.target.closest('.product-card__quick-view') ||
          e.target.closest('a[href]')
        ) {
          return;
        }
        const id = card.dataset.id;
        if (id) {
          window.location.href = `product.html?id=${encodeURIComponent(id)}`;
        }
      });
    });

    // Add to cart
    this._el.querySelectorAll('.product-card__cta').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id      = btn.dataset.id;
        const product = products.find(p => p.id === id);
        if (!product || product.stock.status === 'out_of_stock') return;

        cartStore.add(product);

        const lang  = i18n.lang;
        const title = product.title?.[lang] ?? product.name?.[lang] ?? product.title?.fr ?? product.name?.fr ?? '';

        // Visual feedback
        const original = btn.innerHTML;
        btn.classList.add('added');
        btn.innerHTML = `<span>✓</span><span>${i18n.t('product.added')}</span>`;
        setTimeout(() => {
          btn.classList.remove('added');
          btn.innerHTML = original;
        }, 1800);

        showToast(
          i18n.t('product.addedToast', { name: title }),
          { type: 'success', icon: '✦', duration: 2500 }
        );

        // Open cart
        if (this._cartDrawer) this._cartDrawer.open();
      });
    });

    // Wishlist toggle
    this._el.querySelectorAll('.product-card__wishlist').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        if (this._wishlist.has(id)) {
          this._wishlist.delete(id);
          btn.innerHTML = HEART_SVG;
          btn.classList.remove('active');
        } else {
          this._wishlist.add(id);
          btn.innerHTML = HEART_FILLED_SVG;
          btn.classList.add('active');
          showToast(i18n.t('product.wishlistAdded'), { type: 'info', icon: '✦' });
        }
        localStorage.setItem('beauty-store:wishlist', JSON.stringify([...this._wishlist]));
      });
    });
  }

  // ── Intersection observer (animate cards in) ───────────────────────────
  _initIntersectionObserver() {
    if (!this._el) return;
    if (this._obs) this._obs.disconnect();

    const cards = this._el.querySelectorAll('.product-card:not(.visible)');
    if (!cards.length) return;

    this._obs = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), Math.min(i * 35, 250));
          this._obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    cards.forEach(c => this._obs.observe(c));
  }

  // ── Filtering ──────────────────────────────────────────────────────────
  _getFiltered() {
    if (this._activeBrand) {
      return products.filter(p => p.brand.toLowerCase() === this._activeBrand.toLowerCase());
    }
    if (this._activeFilter === 'all') return products;
    return products.filter(p => p.category === this._activeFilter);
  }

  _refresh(immediateVisible = true) {
    if (!this._el) return;
    this._render(immediateVisible);
    if (!immediateVisible) {
      this._initIntersectionObserver();
    }
  }
}

export default ShopSection;
