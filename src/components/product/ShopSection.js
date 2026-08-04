/**
 * ShopSection.js — Product Grid + Filter Tabs Component
 * Beauty Store — src/components/product/ShopSection.js
 */

import products            from '../../data/products.data.js';
import cartStore           from '../../context/cartStore.js';
import i18n                from '../../context/i18n.js';
import { formatPrice, applyDiscount } from '../../utils/currency.js';
import { effectivePrice, discountPercent } from '../../services/productService.js';
import { showToast }       from '../cart/CartDrawer.js';

// Map product category → emoji
const CAT_EMOJI = {
  skincare: '🌿', makeup: '💄', perfumes: '🌸', haircare: '✨', body: '🫧', tools: '💎',
};

// Map product id → display emoji (richer than a single category icon)
const PRODUCT_EMOJI = {
  'serum-eclat-rose':          '🧴',
  'creme-perfectrice-argan':   '🫙',
  'masque-argile-rose':        '🌹',
  'spf50-fluide-protecteur':   '☀️',
  'fond-teint-velours':        '💅',
  'rouge-levres-satin-rose':   '💋',
  'palette-yeux-sables-dores': '🎨',
  'parfum-rose-orient':        '🌹',
  'parfum-ambre-musk':         '🪷',
  'masque-cheveux-argan-keratin':'💆',
  'huile-cheveux-5-huiles':    '🌺',
  'gel-douche-fleur-oranger':  '🍊',
  'beurre-corps-rose-henne':   '🌸',
  'pinceau-kabuki-pro':        '🖌️',
  'galet-massage-gua-sha-rose':'💎',
  'roll-on-jade-facial':       '🪩',
};

// Enrich products with emoji for display
products.forEach(p => {
  p.images = p.images ?? {};
  p.images.emoji = PRODUCT_EMOJI[p.id] ?? CAT_EMOJI[p.category] ?? '🧴';
});

// Category filter config
const FILTERS = [
  { key: 'all',      icon: '✨' },
  { key: 'skincare', icon: '🌿' },
  { key: 'makeup',   icon: '💄' },
  { key: 'perfumes', icon: '🌸' },
  { key: 'haircare', icon: '✨' },
  { key: 'body',     icon: '🫧' },
  { key: 'tools',    icon: '💎' },
];

class ShopSection {
  constructor({ cartDrawer }) {
    this._cartDrawer   = cartDrawer;
    this._activeFilter = 'all';
    this._wishlist     = new Set(JSON.parse(localStorage.getItem('beauty-store:wishlist') ?? '[]'));
    this._el           = null;

    document.addEventListener('langchange', () => this._refresh());
  }

  // ── Mount ──────────────────────────────────────────────────────────────
  mount(container) {
    this._el = container;
    this._render();
    this._initIntersectionObserver();
    return this;
  }

  // ── Render ─────────────────────────────────────────────────────────────
  _render() {
    const lang = i18n.lang;
    const filtered = this._getFiltered();

    this._el.innerHTML = `
      <section class="shop-section" id="shop" aria-label="${lang === 'ar' ? 'المتجر' : 'Boutique'}">
        <div class="container">

          <!-- Section header -->
          <div class="section-header">
            <span class="section-header__eyebrow" data-i18n="categories.title">${i18n.t('categories.title')}</span>
            <h2 class="section-header__title" data-i18n="categories.subtitle">${i18n.t('categories.subtitle')}</h2>
            <p class="section-header__subtitle">
              ${lang === 'ar'
                ? 'مجموعة مختارة بعناية من أفضل منتجات التجميل بسعر الدرهم المغربي'
                : 'Une sélection soignée de produits de beauté premium, tous en Dirhams marocains'}
            </p>
          </div>

          <!-- Filter tabs -->
          <div class="filter-tabs" id="filter-tabs" role="tablist">
            ${FILTERS.map(f => {
              const count = f.key === 'all' ? products.length : products.filter(p => p.category === f.key).length;
              const label = f.key === 'all'
                ? (lang === 'ar' ? 'الكل' : 'Tout')
                : i18n.t(`categoryLabels.${f.key}`);
              return `
                <button
                  class="filter-tab ${this._activeFilter === f.key ? 'active' : ''}"
                  data-filter="${f.key}"
                  role="tab"
                  aria-selected="${this._activeFilter === f.key}"
                >
                  <span class="filter-tab__icon">${f.icon}</span>
                  ${label}
                  <span class="filter-tab__count">${count}</span>
                </button>
              `;
            }).join('')}
          </div>

          <!-- Product grid -->
          <div class="product-grid" id="product-grid">
            ${filtered.map(p => this._renderCard(p, lang)).join('')}
          </div>

          <!-- Footer -->
          <div class="shop-section__footer">
            <a href="#shop" class="btn--outline">
              ${lang === 'ar' ? 'عرض كل المنتجات' : 'Voir tous les produits'} →
            </a>
          </div>
        </div>
      </section>

      <!-- Trust strip -->
      <div class="trust-strip">
        <div class="container">
          <div class="trust-strip__inner">
            <div class="trust-item">
              <div class="trust-item__icon">🚚</div>
              <div>
                <div class="trust-item__title">${lang === 'ar' ? 'شحن مجاني' : 'Livraison offerte'}</div>
                <div class="trust-item__desc">${lang === 'ar' ? 'من 500 د.م' : 'Dès 500 DH d\'achat'}</div>
              </div>
            </div>
            <div class="trust-item">
              <div class="trust-item__icon">🔒</div>
              <div>
                <div class="trust-item__title">${lang === 'ar' ? 'دفع آمن 100%' : 'Paiement 100% sécurisé'}</div>
                <div class="trust-item__desc">${lang === 'ar' ? 'بروتوكول SSL معتمد' : 'Protocole SSL certifié'}</div>
              </div>
            </div>
            <div class="trust-item">
              <div class="trust-item__icon">↩️</div>
              <div>
                <div class="trust-item__title">${lang === 'ar' ? 'إرجاع مجاني 30 يوماً' : 'Retours gratuits 30 jours'}</div>
                <div class="trust-item__desc">${lang === 'ar' ? 'بدون شروط' : 'Sans condition'}</div>
              </div>
            </div>
            <div class="trust-item">
              <div class="trust-item__icon">💬</div>
              <div>
                <div class="trust-item__title">${lang === 'ar' ? 'دعم العملاء 7/7' : 'Support 7j/7'}</div>
                <div class="trust-item__desc">${lang === 'ar' ? 'فريق متوفر دائماً' : 'Équipe disponible'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this._bindTabEvents();
    this._bindCardEvents();
  }

  _renderCard(product, lang) {
    const name      = product.name?.[lang] ?? product.name?.fr ?? '';
    const tagline   = product.tagline?.[lang] ?? product.tagline?.fr ?? '';
    const price     = effectivePrice(product);
    const regular   = product.price.regular;
    const onSale    = product.price.sale !== null;
    const pct       = discountPercent(product);
    const isOOS     = product.stock.status === 'out_of_stock';
    const isWished  = this._wishlist.has(product.id);
    const emoji     = product.images?.emoji ?? '🧴';

    // Render stars
    const stars = this._renderStars(product.rating.average);

    // Build badges (max 2)
    const badgeMap = {
      new:        `<span class="badge badge--new">${i18n.t('product.new')}</span>`,
      bestseller: `<span class="badge badge--bestseller">${i18n.t('product.bestseller')}</span>`,
      sale:       `<span class="badge badge--sale">${i18n.t('product.sale')}</span>`,
      limited:    `<span class="badge badge--limited">${i18n.t('product.limited')}</span>`,
      exclusive:  `<span class="badge badge--exclusive">${i18n.t('product.exclusive')}</span>`,
      vegan:      `<span class="badge badge--vegan">${i18n.t('product.vegan')}</span>`,
      natural:    `<span class="badge badge--natural">${i18n.t('product.natural')}</span>`,
    };
    const badges = product.badges.slice(0, 2).map(b => badgeMap[b] ?? '').join('');

    return `
      <article
        class="product-card"
        data-id="${product.id}"
        data-category="${product.category}"
        aria-label="${name}"
      >
        <!-- Image -->
        <div class="product-card__image-wrap">
          <div class="product-card__image">${emoji}</div>

          ${badges ? `<div class="product-card__badges">${badges}</div>` : ''}

          <button
            class="product-card__wishlist ${isWished ? 'active' : ''}"
            data-id="${product.id}"
            aria-label="${i18n.t('product.addToWishlist')}"
            title="${i18n.t('product.addToWishlist')}"
          >${isWished ? '❤️' : '🤍'}</button>

          ${isOOS ? `<div class="product-card__oos-overlay">${i18n.t('product.outOfStock')}</div>` : ''}
          ${product.stock.status === 'low_stock' ? `<div class="product-card__badges" style="bottom:var(--sp-3);top:auto;left:var(--sp-3)"><span class="badge badge--low-stock">⚠ ${i18n.t('product.lowStock')}</span></div>` : ''}
        </div>

        <!-- Body -->
        <div class="product-card__body">
          <div class="product-card__brand">${product.brand}</div>
          <div class="product-card__name">${name}</div>
          <div class="product-card__tagline">${tagline}</div>

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
            class="product-card__cta"
            data-id="${product.id}"
            ${isOOS ? 'disabled' : ''}
            aria-label="${i18n.t('product.addToCart')}: ${name}"
          >
            <span class="product-card__cta-icon">🛒</span>
            <span>${isOOS ? i18n.t('product.outOfStock') : i18n.t('product.addToCart')}</span>
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
        this._render();
        this._initIntersectionObserver();
      });
    });
  }

  _bindCardEvents() {
    // Add to cart
    this._el.querySelectorAll('.product-card__cta').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const product = products.find(p => p.id === id);
        if (!product || product.stock.status === 'out_of_stock') return;

        cartStore.add(product);

        // Visual feedback
        const original = btn.innerHTML;
        btn.classList.add('added');
        btn.innerHTML = `<span>✓</span><span>${i18n.lang === 'ar' ? 'تمت الإضافة!' : 'Ajouté !'}</span>`;
        setTimeout(() => {
          btn.classList.remove('added');
          btn.innerHTML = original;
        }, 1800);

        const lang = i18n.lang;
        const name = product.name?.[lang] ?? product.name?.fr;
        showToast(
          lang === 'ar' ? `✓ "${name}" أضيف للسلة` : `✓ "${name}" ajouté au panier`,
          { type: 'success', icon: '🛒', duration: 2500 }
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
          btn.textContent = '🤍';
          btn.classList.remove('active');
        } else {
          this._wishlist.add(id);
          btn.textContent = '❤️';
          btn.classList.add('active');
          showToast(i18n.lang === 'ar' ? 'أضيف إلى المفضلة ❤️' : 'Ajouté aux favoris ❤️', { type: 'info', icon: '❤️' });
        }
        localStorage.setItem('beauty-store:wishlist', JSON.stringify([...this._wishlist]));
      });
    });
  }

  // ── Intersection observer (animate cards in) ───────────────────────────
  _initIntersectionObserver() {
    const cards = this._el.querySelectorAll('.product-card');
    const obs = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 60);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });
    cards.forEach(c => obs.observe(c));
  }

  // ── Filtering ──────────────────────────────────────────────────────────
  _getFiltered() {
    if (this._activeFilter === 'all') return products;
    return products.filter(p => p.category === this._activeFilter);
  }

  _refresh() { if (this._el) this._render(); this._initIntersectionObserver(); }
}

export default ShopSection;
