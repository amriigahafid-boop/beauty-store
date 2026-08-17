/**
 * HeroSlider.js — Interactive image sliders for the hero section
 * Beauty Store — src/components/hero/HeroSlider.js
 *
 * Images (public/images/banners/):
 *  • banner1.jpeg → large slider (full-bleed, all 5 slides share the image,
 *                   each slide tints with a unique translucent colour overlay)
 *  • banner2.jpeg → small top slider (all 3 slides, focus: center-right)
 *  • banner3.jpeg → small bottom slider (all 3 slides, focus: center)
 */

import cartStore     from '../../context/cartStore.js';
import i18n          from '../../context/i18n.js';
import { showToast } from '../cart/CartDrawer.js';

// ── Image paths ───────────────────────────────────────────────────────────────
const IMG = {
  banner1: 'public/images/banners/banner1.jpeg',
  banner2: 'public/images/banners/banner2.jpeg',
  banner3: 'public/images/banners/banner3.jpeg',
};

// ── Slide data ────────────────────────────────────────────────────────────────
//   All prices in MAD (Moroccan Dirham).
//   `tint` — semi-transparent colour overlaid on the banner per slide
//   `imgPos` — CSS object-position to frame the best part of the image
const LARGE_SLIDES = [
  {
    id:       'serum-eclat-rose',
    img:      IMG.banner1,
    imgPos:   'center right',
    tint:     'rgba(253, 220, 230, 0.18)',
    brand:    'Lumière Skincare',
    name:     { fr: 'Sérum Éclat Rose',                ar: 'سيروم توهج الورد'              },
    tagline:  { fr: 'Hydratation intense & éclat naturel', ar: 'ترطيب عميق وتوهج طبيعي'   },
    price:    199,
    regular:  249,
    currency: 'DH',
    rating:   4.8,
    reviews:  1247,
    badge:    'sale',
  },
  {
    id:       'fond-teint-velours',
    img:      IMG.banner1,
    imgPos:   'center right',
    tint:     'rgba(235, 210, 255, 0.15)',
    brand:    'Lumière Makeup',
    name:     { fr: 'Fond de Teint Velours',           ar: 'كريم أساس مخملي'               },
    tagline:  { fr: 'Tenue 24h, fini naturel airbrushed', ar: 'تثبيت 24 ساعة، نعومة فائقة' },
    price:    219,
    regular:  null,
    currency: 'DH',
    rating:   4.7,
    reviews:  1548,
    badge:    'bestseller',
  },
  {
    id:       'parfum-rose-orient',
    img:      IMG.banner1,
    imgPos:   'center right',
    tint:     'rgba(255, 235, 215, 0.18)',
    brand:    'Lumière Parfums',
    name:     { fr: 'Eau de Parfum Rose Orient',       ar: 'عطر وردة الشرق'                },
    tagline:  { fr: 'Une fragrance orientale envoûtante', ar: 'عطر شرقي ساحر لا يُنسى'    },
    price:    599,
    regular:  null,
    currency: 'DH',
    rating:   4.9,
    reviews:  879,
    badge:    'exclusive',
  },
  {
    id:       'palette-yeux-sables-dores',
    img:      IMG.banner1,
    imgPos:   'center right',
    tint:     'rgba(255, 248, 210, 0.18)',
    brand:    'Lumière Makeup',
    name:     { fr: 'Palette Sables Dorés',            ar: 'باليت عيون الرمال الذهبية'    },
    tagline:  { fr: '18 teintes pigmentées ultra-mixables', ar: '18 ظلال مكثفة قابلة للمزج' },
    price:    249,
    regular:  299,
    currency: 'DH',
    rating:   4.9,
    reviews:  3211,
    badge:    'sale',
  },
  {
    id:       'masque-argile-rose',
    img:      IMG.banner1,
    imgPos:   'center right',
    tint:     'rgba(220, 245, 220, 0.15)',
    brand:    'Lumière Skincare',
    name:     { fr: 'Masque Purifiant Argile Rose',    ar: 'قناع تنقية بالطين الوردي'     },
    tagline:  { fr: 'Pores purifiés, peau veloutée',   ar: 'مسام نقية وبشرة مخملية'        },
    price:    119,
    regular:  139,
    currency: 'DH',
    rating:   4.6,
    reviews:  634,
    badge:    'new',
  },
];

const SMALL_TOP_SLIDES = [
  {
    id:       'creme-argan',
    img:      IMG.banner2,
    imgPos:   '70% center',
    tint:     'rgba(255, 248, 230, 0.10)',
    brand:    'Lumière Skincare',
    name:     { fr: 'Crème Argan Divine',              ar: 'كريم الأرغان الإلهي'           },
    price:    189,
    regular:  null,
    currency: 'DH',
    rating:   4.7,
    badge:    'natural',
  },
  {
    id:       'huile-cheveux-5-huiles',
    img:      IMG.banner2,
    imgPos:   '65% center',
    tint:     'rgba(255, 240, 210, 0.12)',
    brand:    'Lumière Haircare',
    name:     { fr: 'Huile Sublime 5 Précieuses',      ar: 'زيت فاخر بـ5 زيوت نفيسة'     },
    price:    199,
    regular:  null,
    currency: 'DH',
    rating:   4.9,
    badge:    'bestseller',
  },
  {
    id:       'night-serum',
    img:      IMG.banner2,
    imgPos:   '60% center',
    tint:     'rgba(250, 228, 220, 0.12)',
    brand:    'Lumière Skincare',
    name:     { fr: 'Night Serum Restorative',         ar: 'سيروم الليل الترميمي'          },
    price:    279,
    regular:  319,
    currency: 'DH',
    rating:   4.8,
    badge:    'sale',
  },
];

const SMALL_BOT_SLIDES = [
  {
    id:       'rouge-levres-satin-rose',
    img:      IMG.banner3,
    imgPos:   'center center',
    tint:     'rgba(250, 220, 230, 0.10)',
    brand:    'Lumière Makeup',
    name:     { fr: 'Rouge à Lèvres Satin',            ar: 'أحمر شفاه ساتان وردي'         },
    price:    129,
    regular:  null,
    currency: 'DH',
    rating:   4.5,
    badge:    'vegan',
  },
  {
    id:       'nuit-renouveau',
    img:      IMG.banner3,
    imgPos:   'center center',
    tint:     'rgba(220, 215, 250, 0.10)',
    brand:    'Lumière Skincare',
    name:     { fr: 'Nuit Renouveau — Sérum',          ar: 'سيروم تجديد الليل'             },
    price:    349,
    regular:  399,
    currency: 'DH',
    rating:   4.8,
    badge:    'exclusive',
  },
  {
    id:       'brume-divine',
    img:      IMG.banner3,
    imgPos:   'center center',
    tint:     'rgba(210, 240, 235, 0.10)',
    brand:    'Lumière Skincare',
    name:     { fr: 'Brume Divine — Facial Mist',      ar: 'رذاذ الوجه الإلهي'             },
    price:    159,
    regular:  189,
    currency: 'DH',
    rating:   4.7,
    badge:    'sale',
  },
];

// ── SVG icons ─────────────────────────────────────────────────────────────────
const ChevronLeft  = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>`;
const ChevronRight = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>`;

// ── Slider class ──────────────────────────────────────────────────────────────
class Slider {
  constructor({ container, size, slides, autoplayMs, cartDrawer, enterDelay = 0 }) {
    this._container  = container;
    this._size       = size;       // 'large' | 'small'
    this._slides     = slides;
    this._autoplayMs = autoplayMs;
    this._cartDrawer = cartDrawer;
    this._enterDelay = enterDelay;
    this._current    = 0;
    this._timer      = null;
    this._wishlist   = new Set(JSON.parse(localStorage.getItem('beauty-store:wishlist') ?? '[]'));
    this._paused     = false;

    this._build();
    this._startAutoplay();

    document.addEventListener('langchange', () => this._refreshText());
  }

  // ── Build ───────────────────────────────────────────────────────────────────
  _build() {
    const cssClass = this._size === 'large' ? 'hs--large' : 'hs--small';

    this._el = document.createElement('div');
    this._el.className = `hs ${cssClass}`;
    this._el.style.animationDelay = `${this._enterDelay}ms`;

    this._el.innerHTML = `
      <div class="hs__track">
        ${this._slides.map((s, i) => this._renderSlide(s, i)).join('')}
      </div>
      <div class="hs__progress running" style="--autoplay-ms:${this._autoplayMs}ms;"></div>
      <button class="hs__arrow hs__arrow--prev" aria-label="Précédent">${ChevronLeft}</button>
      <button class="hs__arrow hs__arrow--next" aria-label="Suivant">${ChevronRight}</button>
      <div class="hs__dots">
        ${this._slides.map((_, i) => `
          <button class="hs__dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Diapositive ${i + 1}"></button>
        `).join('')}
      </div>
    `;

    this._container.appendChild(this._el);
    this._trackEl    = this._el.querySelector('.hs__track');
    this._progressEl = this._el.querySelector('.hs__progress');
    this._dotsEls    = this._el.querySelectorAll('.hs__dot');

    this._bindEvents();
  }

  _renderSlide(s, i) {
    const lang     = i18n.lang;
    const name     = typeof s.name === 'object' ? (s.name[lang] ?? s.name.fr) : s.name;
    const tagline  = s.tagline ? (typeof s.tagline === 'object' ? (s.tagline[lang] ?? s.tagline.fr) : s.tagline) : '';
    const onSale   = s.regular && s.regular > s.price;
    const pct      = onSale ? Math.round((1 - s.price / s.regular) * 100) : 0;
    const isWished = this._wishlist.has(s.id);

    const badgeMap = {
      new:        ['new',        '✨ Nouveau'],
      sale:       ['sale',       `−${pct}%`],
      bestseller: ['bestseller', '⭐ Top vente'],
      exclusive:  ['exclusive',  '💎 Exclusif'],
      natural:    ['new',        '🌿 Naturel'],
      vegan:      ['new',        '🌱 Vegan'],
    };
    const [badgeCls, badgeTxt] = badgeMap[s.badge] ?? ['new', ''];
    const addLabel = (i18n.t && i18n.t('product.addToCart')) || (lang === 'ar' ? 'أضيفي للسلة' : 'Ajouter au panier');

    return `
      <div class="hs__slide" data-id="${s.id}" data-index="${i}">

        <!-- Full-bleed banner image -->
        <img
          class="hs__bg-img"
          src="${s.img}"
          alt="${name}"
          loading="${i === 0 ? 'eager' : 'lazy'}"
          style="object-position: ${s.imgPos ?? 'center center'};"
          draggable="false"
        />

        <!-- Per-slide tint overlay -->
        <div class="hs__tint" style="background:${s.tint ?? 'transparent'};"></div>

        <!-- Top badges & wishlist -->
        ${s.badge ? `<span class="hs__badge-label hs__badge-label--${badgeCls}">${badgeTxt}</span>` : ''}
        <button class="hs__wishlist ${isWished ? 'active' : ''}" data-id="${s.id}" aria-label="Favoris">
          ${isWished ? '❤️' : '🤍'}
        </button>

        <!-- Info card overlay -->
        <div class="hs__info">
          <div class="hs__info-meta">
            <div class="hs__brand">${s.brand}</div>
            <div class="hs__rating">
              <span class="hs__rating-stars">★★★★★</span>
              <span>${s.rating.toFixed(1)}</span>
              ${s.reviews ? `<span>(${Number(s.reviews).toLocaleString()})</span>` : ''}
            </div>
          </div>

          <div class="hs__name" data-name="${s.id}">${name}</div>
          ${tagline ? `<div class="hs__tagline" data-tagline="${s.id}">${tagline}</div>` : ''}

          <div class="hs__info-bottom">
            <div class="hs__price-row">
              <span class="hs__price">${this._fmt(s.price, lang)}</span>
              ${onSale ? `<span class="hs__price-original">${this._fmt(s.regular, lang)}</span>` : ''}
              <span class="hs__currency">MAD</span>
            </div>
            <button class="hs__add-btn" data-id="${s.id}">
              🛒 ${addLabel}
            </button>
          </div>
        </div>

      </div>
    `;
  }

  _fmt(price, lang) {
    try {
      const locale = lang === 'ar' ? 'ar-MA' : 'fr-MA';
      return new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price) + ' DH';
    } catch {
      return `${Number(price).toFixed(2)} DH`;
    }
  }

  // ── Events ──────────────────────────────────────────────────────────────────
  _bindEvents() {
    this._el.querySelector('.hs__arrow--prev').addEventListener('click', () => this._step(-1));
    this._el.querySelector('.hs__arrow--next').addEventListener('click', () => this._step(1));

    this._dotsEls.forEach(dot => {
      dot.addEventListener('click', () => this._goTo(Number(dot.dataset.index)));
    });

    // Wishlist
    this._el.addEventListener('click', e => {
      const wl = e.target.closest('.hs__wishlist');
      if (!wl) return;
      const id = wl.dataset.id;
      if (this._wishlist.has(id)) {
        this._wishlist.delete(id); wl.textContent = '🤍'; wl.classList.remove('active');
      } else {
        this._wishlist.add(id); wl.textContent = '❤️'; wl.classList.add('active');
        showToast(i18n.lang === 'ar' ? 'أضيف إلى المفضلة ❤️' : 'Ajouté aux favoris ❤️', { type: 'info', icon: '❤️' });
      }
      localStorage.setItem('beauty-store:wishlist', JSON.stringify([...this._wishlist]));
    });

    // Add to cart
    this._el.addEventListener('click', e => {
      const btn = e.target.closest('.hs__add-btn');
      if (!btn) return;
      const id    = btn.dataset.id;
      const slide = this._slides.find(s => s.id === id);
      if (!slide) return;

      cartStore.add({
        id:    slide.id,
        name:  slide.name,
        brand: slide.brand,
        price: { regular: slide.price, sale: null, currency: 'MAD' },
        stock: { status: 'in_stock' },
        images: { emoji: '🧴' },
      });

      const lang     = i18n.lang;
      const original = btn.innerHTML;
      btn.classList.add('added');
      btn.innerHTML = `✓ ${lang === 'ar' ? 'تمت الإضافة!' : 'Ajouté !'}`;
      setTimeout(() => { btn.classList.remove('added'); btn.innerHTML = original; }, 2000);

      const name = typeof slide.name === 'object' ? (slide.name[lang] ?? slide.name.fr) : slide.name;
      showToast(
        lang === 'ar' ? `✓ "${name}" أضيف للسلة` : `✓ "${name}" ajouté au panier`,
        { type: 'success', icon: '🛒', duration: 2500 }
      );
      if (this._cartDrawer) this._cartDrawer.open();
    });

    // Pause on hover
    this._el.addEventListener('mouseenter', () => { this._paused = true;  this._stopAutoplay(); });
    this._el.addEventListener('mouseleave', () => { this._paused = false; this._startAutoplay(); });

    // Swipe / touch
    let tx = 0;
    this._el.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    this._el.addEventListener('touchend',   e => {
      const delta = e.changedTouches[0].clientX - tx;
      if (Math.abs(delta) > 40) this._step(delta < 0 ? 1 : -1);
    });
  }

  // ── Navigation ──────────────────────────────────────────────────────────────
  _step(dir) {
    const n = this._slides.length;
    this._goTo((this._current + dir + n) % n);
  }

  _goTo(index) {
    this._current = index;
    this._trackEl.style.transform = `translateX(-${index * 100}%)`;
    this._dotsEls.forEach((d, i) => d.classList.toggle('active', i === index));
    this._resetProgress();
    if (!this._paused) this._startAutoplay();
  }

  // ── Autoplay ─────────────────────────────────────────────────────────────────
  _startAutoplay() {
    this._stopAutoplay();
    this._timer = setInterval(() => this._step(1), this._autoplayMs);
    this._resetProgress();
  }

  _stopAutoplay() { clearInterval(this._timer); this._timer = null; }

  _resetProgress() {
    if (!this._progressEl) return;
    this._progressEl.classList.remove('running');
    void this._progressEl.offsetWidth;
    this._progressEl.classList.add('running');
  }

  // ── i18n ─────────────────────────────────────────────────────────────────────
  _refreshText() {
    const lang = i18n.lang;
    this._slides.forEach(s => {
      const nameEl    = this._el.querySelector(`[data-name="${s.id}"]`);
      const taglineEl = this._el.querySelector(`[data-tagline="${s.id}"]`);
      if (nameEl)    nameEl.textContent    = typeof s.name    === 'object' ? (s.name[lang]    ?? s.name.fr)    : s.name;
      if (taglineEl) taglineEl.textContent = typeof s.tagline === 'object' ? (s.tagline[lang] ?? s.tagline.fr) : s.tagline;
    });
  }

  get _id() {
    if (!this.__id) this.__id = `slider-${++Slider._counter}`;
    return this.__id;
  }
}
Slider._counter = 0;

// ── HeroSlider: builds & mounts the full hero section ────────────────────────
class HeroSlider {
  constructor({ cartDrawer }) { this._cartDrawer = cartDrawer; }

  mount() {
    const root = document.getElementById('hero-root');
    if (!root) {
      console.warn('[HeroSlider] #hero-root not found — hero will not render.');
      return this;
    }

    const lang = i18n.lang;

    // ── 1. Inject full hero section HTML ───────────────────────────────────
    root.innerHTML = `
      <section class="hero" id="hero" aria-labelledby="hero-heading">

        <!-- Decorative blobs -->
        <div class="hero__blob hero__blob--1" aria-hidden="true"></div>
        <div class="hero__blob hero__blob--2" aria-hidden="true"></div>
        <div class="hero__blob hero__blob--3" aria-hidden="true"></div>

        <div class="container">

          <!-- Text band -->
          <div class="hero__text-band">
            <span class="hero__badge" data-i18n="hero.badge">
              ${i18n.t('hero.badge')}
            </span>

            <h1 class="hero__heading" id="hero-heading">
              ${i18n.t('hero.heading').replace(/\n/g, '<br>')}
            </h1>

            <p class="hero__subheading">
              ${i18n.t('hero.subheading')}
              — <strong>${lang === 'ar' ? 'جميع الأسعار بالدرهم المغربي (DH)' : 'Tous les prix en Dirhams marocains (DH / MAD)'}</strong>.
            </p>

            <div class="hero__ctas">
              <a href="#shop" class="btn btn--primary" id="cta-primary">
                ${i18n.t('hero.ctaPrimary')}
              </a>
              <a href="#shop" class="btn btn--ghost" id="cta-secondary">
                ${i18n.t('hero.ctaSecondary')}
              </a>
            </div>

            <div class="hero__trust">
              <div class="hero__trust-item">
                <span>🌿</span>
                <span class="hero__trust-label">${lang === 'ar' ? '100% طبيعي' : '100% Naturel'}</span>
              </div>
              <div class="hero__trust-item">
                <span>🚚</span>
                <span class="hero__trust-label">${i18n.t('cart.freeShipping')}</span>
              </div>
              <div class="hero__trust-item">
                <span>🇲🇦</span>
                <span class="hero__trust-label">${lang === 'ar' ? 'أسعار بالدرهم (MAD)' : 'Prix en DH (MAD)'}</span>
              </div>
              <div class="hero__trust-item">
                <span>💎</span>
                <span class="hero__trust-label">Premium</span>
              </div>
            </div>
          </div>

          <!-- Slider grid -->
          <div class="hero__slider-grid">
            <div id="hero-slider-large"      class="hero__slider-large"></div>
            <div id="hero-slider-small-wrap" class="hero__slider-small-wrap"></div>
          </div>

        </div>

        <!-- Scroll hint -->
        <div class="hero__scroll-hint">
          <span>${i18n.t('hero.scrollHint')}</span>
          <div class="hero__scroll-arrow"></div>
        </div>

      </section>
    `;

    // ── 2. Refresh hero text on language change ────────────────────────────
    document.addEventListener('langchange', () => {
      const l = i18n.lang;
      const badge   = root.querySelector('.hero__badge');
      const heading = root.querySelector('.hero__heading');
      const sub     = root.querySelector('.hero__subheading');
      const ctaP    = root.querySelector('#cta-primary');
      const ctaS    = root.querySelector('#cta-secondary');
      const scroll  = root.querySelector('.hero__scroll-hint span');

      if (badge)   badge.textContent   = i18n.t('hero.badge');
      if (heading) heading.innerHTML   = i18n.t('hero.heading').replace(/\n/g, '<br>');
      if (sub)     sub.innerHTML       = `${i18n.t('hero.subheading')} — <strong>${l === 'ar' ? 'جميع الأسعار بالدرهم المغربي (DH)' : 'Tous les prix en Dirhams marocains (DH / MAD)'}</strong>.`;
      if (ctaP)    ctaP.textContent    = i18n.t('hero.ctaPrimary');
      if (ctaS)    ctaS.textContent    = i18n.t('hero.ctaSecondary');
      if (scroll)  scroll.textContent  = i18n.t('hero.scrollHint');
    });

    // ── 3. Mount the three sliders ─────────────────────────────────────────
    const largeContainer = document.getElementById('hero-slider-large');
    const smallWrap      = document.getElementById('hero-slider-small-wrap');

    if (!largeContainer || !smallWrap) {
      console.warn('[HeroSlider] Slider mount points missing after hero HTML injection.');
      return this;
    }

    new Slider({ container: largeContainer, size: 'large', slides: LARGE_SLIDES,    autoplayMs: 4500, cartDrawer: this._cartDrawer, enterDelay: 200 });
    new Slider({ container: smallWrap,      size: 'small', slides: SMALL_TOP_SLIDES, autoplayMs: 3400, cartDrawer: this._cartDrawer, enterDelay: 360 });
    new Slider({ container: smallWrap,      size: 'small', slides: SMALL_BOT_SLIDES, autoplayMs: 4000, cartDrawer: this._cartDrawer, enterDelay: 520 });

    return this;
  }
}

export default HeroSlider;

