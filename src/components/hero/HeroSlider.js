/**
 * HeroSlider.js — Interactive product image sliders for the hero section
 * Beauty Store — src/components/hero/HeroSlider.js
 *
 * Creates:
 *  • 1 large slider  (left)  — 5 featured products, autoplay 4 s
 *  • 2 small sliders (right) — 3 slides each, autoplay 3.2 s / 3.8 s
 */

import cartStore        from '../../context/cartStore.js';
import i18n             from '../../context/i18n.js';
import { showToast }    from '../cart/CartDrawer.js';

// ── Slide data ────────────────────────────────────────────────────────────────
//   All prices in MAD (Moroccan Dirham)
const LARGE_SLIDES = [
  {
    id:       'serum-eclat-rose',
    emoji:    '🧴',
    brand:    'Lumière Skincare',
    name:     { fr: 'Sérum Éclat Rose',              ar: 'سيروم توهج الورد'         },
    tagline:  { fr: 'Hydratation intense & éclat naturel', ar: 'ترطيب عميق وتوهج طبيعي' },
    price:    199,
    regular:  249,
    currency: 'DH',
    rating:   4.8,
    reviews:  1247,
    badge:    'sale',
    bg:       'linear-gradient(160deg, #fde8ef 0%, #f8e0f0 100%)',
  },
  {
    id:       'fond-teint-velours',
    emoji:    '💅',
    brand:    'Lumière Makeup',
    name:     { fr: 'Fond de Teint Velours',         ar: 'كريم أساس مخملي'          },
    tagline:  { fr: 'Tenue 24h, fini naturel airbrushed', ar: 'تثبيت 24 ساعة، نعومة لا مثيل لها' },
    price:    219,
    regular:  null,
    currency: 'DH',
    rating:   4.7,
    reviews:  1548,
    badge:    'bestseller',
    bg:       'linear-gradient(160deg, #f5e8ff 0%, #ecdefe 100%)',
  },
  {
    id:       'parfum-rose-orient',
    emoji:    '🌹',
    brand:    'Lumière Parfums',
    name:     { fr: 'Eau de Parfum Rose Orient',     ar: 'عطر وردة الشرق'            },
    tagline:  { fr: 'Une fragrance orientale envoûtante', ar: 'عطر شرقي ساحر لا يُنسى' },
    price:    599,
    regular:  null,
    currency: 'DH',
    rating:   4.9,
    reviews:  879,
    badge:    'exclusive',
    bg:       'linear-gradient(160deg, #fff0f5 0%, #ffe0ea 100%)',
  },
  {
    id:       'palette-yeux-sables-dores',
    emoji:    '🎨',
    brand:    'Lumière Makeup',
    name:     { fr: 'Palette Sables Dorés',          ar: 'باليت عيون الرمال الذهبية'  },
    tagline:  { fr: '18 teintes pigmentées, ultra-mixables', ar: '18 ظلال مكثفة قابلة للمزج' },
    price:    249,
    regular:  299,
    currency: 'DH',
    rating:   4.9,
    reviews:  3211,
    badge:    'sale',
    bg:       'linear-gradient(160deg, #fff8e1 0%, #fef3c0 100%)',
  },
  {
    id:       'masque-argile-rose',
    emoji:    '🌸',
    brand:    'Lumière Skincare',
    name:     { fr: 'Masque Purifiant Argile Rose',  ar: 'قناع تنقية بالطين الوردي'  },
    tagline:  { fr: 'Pores purifiés, peau veloutée', ar: 'مسام نقية وبشرة مخملية'    },
    price:    119,
    regular:  139,
    currency: 'DH',
    rating:   4.6,
    reviews:  634,
    badge:    'new',
    bg:       'linear-gradient(160deg, #fce4ec 0%, #f8bbd0 55%, #fde8ef 100%)',
  },
];

const SMALL_TOP_SLIDES = [
  {
    id:       'creme-argan',
    emoji:    '🫙',
    brand:    'Lumière Skincare',
    name:     { fr: "Crème Argan",                  ar: 'كريم الأرغان'              },
    price:    189,
    regular:  null,
    currency: 'DH',
    rating:   4.7,
    badge:    'natural',
    bg:       'linear-gradient(160deg, #e8f5e9 0%, #c8e6c9 100%)',
  },
  {
    id:       'huile-cheveux-5-huiles',
    emoji:    '🌺',
    brand:    'Lumière Haircare',
    name:     { fr: 'Huile Sublime 5 Précieuses',   ar: 'زيت فاخر بـ5 زيوت نفيسة'  },
    price:    199,
    regular:  null,
    currency: 'DH',
    rating:   4.9,
    badge:    'bestseller',
    bg:       'linear-gradient(160deg, #fff3e0 0%, #ffe0b2 100%)',
  },
  {
    id:       'gua-sha-quartz-rose',
    emoji:    '💎',
    brand:    'Lumière Tools',
    name:     { fr: 'Gua Sha Quartz Rose',          ar: 'حجر جوا شا الكوارتز الوردي' },
    price:    119,
    regular:  null,
    currency: 'DH',
    rating:   4.8,
    badge:    'new',
    bg:       'linear-gradient(160deg, #fce4ec 0%, #f8bbd0 100%)',
  },
];

const SMALL_BOT_SLIDES = [
  {
    id:       'rouge-levres-satin-rose',
    emoji:    '💋',
    brand:    'Lumière Makeup',
    name:     { fr: 'Rouge à Lèvres Satin',         ar: 'أحمر شفاه ساتان وردي'     },
    price:    129,
    regular:  null,
    currency: 'DH',
    rating:   4.5,
    badge:    'vegan',
    bg:       'linear-gradient(160deg, #fce4ec 0%, #ffcdd2 100%)',
  },
  {
    id:       'spf50-fluide',
    emoji:    '☀️',
    brand:    'Lumière Skincare',
    name:     { fr: 'Fluide SPF 50+',               ar: 'سائل واقي الشمس SPF 50+'  },
    price:    169,
    regular:  null,
    currency: 'DH',
    rating:   4.9,
    badge:    'new',
    bg:       'linear-gradient(160deg, #fffde7 0%, #fff9c4 100%)',
  },
  {
    id:       'rouleau-jade',
    emoji:    '🪩',
    brand:    'Lumière Tools',
    name:     { fr: 'Rouleau Facial Jade',          ar: 'بكرة الوجه من الجاد'      },
    price:    79,
    regular:  99,
    currency: 'DH',
    rating:   4.6,
    badge:    'sale',
    bg:       'linear-gradient(160deg, #e8f5e9 0%, #a5d6a7 100%)',
  },
];

// ── SVG icons ─────────────────────────────────────────────────────────────────
const ChevronLeft  = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>`;
const ChevronRight = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>`;

// ── Slider class ──────────────────────────────────────────────────────────────
class Slider {
  /**
   * @param {Object} opts
   * @param {HTMLElement} opts.container   — where to render
   * @param {string}      opts.size        — 'large' | 'small'
   * @param {Array}       opts.slides
   * @param {number}      opts.autoplayMs  — autoplay interval (ms)
   * @param {CartDrawer}  opts.cartDrawer
   * @param {number}      opts.enterDelay  — CSS animation delay (ms)
   */
  constructor({ container, size, slides, autoplayMs, cartDrawer, enterDelay = 0 }) {
    this._container   = container;
    this._size        = size;       // 'large' | 'small'
    this._slides      = slides;
    this._autoplayMs  = autoplayMs;
    this._cartDrawer  = cartDrawer;
    this._enterDelay  = enterDelay;
    this._current     = 0;
    this._timer       = null;
    this._wishlist    = new Set(JSON.parse(localStorage.getItem('beauty-store:wishlist') ?? '[]'));
    this._paused      = false;

    this._build();
    this._startAutoplay();

    // Refresh text on language change
    document.addEventListener('langchange', () => this._refreshText());
  }

  // ── Build DOM ───────────────────────────────────────────────────────────────
  _build() {
    const isLarge  = this._size === 'large';
    const cssClass = isLarge ? 'hs--large' : 'hs--small';

    this._el = document.createElement('div');
    this._el.className = `hs ${cssClass}`;
    this._el.style.animationDelay = `${this._enterDelay}ms`;

    this._el.innerHTML = `
      <!-- Track -->
      <div class="hs__track" id="hs-track-${this._id}">
        ${this._slides.map((s, i) => this._renderSlide(s, i)).join('')}
      </div>

      <!-- Progress bar -->
      <div class="hs__progress running" style="--autoplay-ms:${this._autoplayMs}ms;"></div>

      <!-- Arrow nav -->
      <button class="hs__arrow hs__arrow--prev" aria-label="Précédent">${ChevronLeft}</button>
      <button class="hs__arrow hs__arrow--next" aria-label="Suivant">${ChevronRight}</button>

      <!-- Dots -->
      <div class="hs__dots">
        ${this._slides.map((_, i) => `
          <button class="hs__dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Diapositive ${i+1}"></button>
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
    const lang       = i18n.lang;
    const name       = typeof s.name === 'object' ? (s.name[lang] ?? s.name.fr) : s.name;
    const tagline    = s.tagline ? (typeof s.tagline === 'object' ? (s.tagline[lang] ?? s.tagline.fr) : s.tagline) : '';
    const onSale     = s.regular && s.regular > s.price;
    const pct        = onSale ? Math.round((1 - s.price / s.regular) * 100) : 0;
    const isWished   = this._wishlist.has(s.id);

    const badgeMap = {
      new:        ['new',        '✨ Nouveau'],
      sale:       ['sale',       `−${pct}%`],
      bestseller: ['bestseller', '⭐ Top vente'],
      exclusive:  ['exclusive',  '💎 Exclusif'],
      natural:    ['new',        '🌿 Naturel'],
      vegan:      ['new',        '🌱 Vegan'],
    };
    const [badgeCls, badgeTxt] = badgeMap[s.badge] ?? ['new', ''];

    const addBtnLabel = i18n.t ? (i18n.t('product.addToCart') || 'Ajouter') : 'Ajouter';

    return `
      <div class="hs__slide" style="--slide-bg:${s.bg};" data-id="${s.id}" data-index="${i}">
        <!-- Badge -->
        ${s.badge ? `<span class="hs__badge-label hs__badge-label--${badgeCls}">${badgeTxt}</span>` : ''}

        <!-- Wishlist -->
        <button class="hs__wishlist ${isWished ? 'active' : ''}" data-id="${s.id}" aria-label="Favoris">
          ${isWished ? '❤️' : '🤍'}
        </button>

        <!-- Product emoji -->
        <div class="hs__emoji">${s.emoji}</div>

        <!-- Info overlay -->
        <div class="hs__info">
          <div>
            <div class="hs__brand">${s.brand}</div>
            <div class="hs__name" data-name="${s.id}">${name}</div>
            ${tagline ? `<div class="hs__tagline" data-tagline="${s.id}">${tagline}</div>` : ''}
          </div>

          <div class="hs__price-row">
            <span class="hs__price">${this._fmt(s.price, lang)}</span>
            ${onSale ? `<span class="hs__price-original">${this._fmt(s.regular, lang)}</span>` : ''}
            <span class="hs__currency">MAD</span>
          </div>

          <div class="hs__cta-row">
            <button class="hs__add-btn" data-id="${s.id}" data-slide-index="${i}">
              🛒 ${addBtnLabel}
            </button>
            <div class="hs__rating">
              <span class="hs__rating-stars">★★★★★</span>
              <span>${s.rating.toFixed(1)}</span>
              ${s.reviews ? `<span>(${s.reviews.toLocaleString()})</span>` : ''}
            </div>
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
      return `${price.toFixed(2)} DH`;
    }
  }

  // ── Events ──────────────────────────────────────────────────────────────────
  _bindEvents() {
    // Arrows
    this._el.querySelector('.hs__arrow--prev').addEventListener('click', () => this._step(-1));
    this._el.querySelector('.hs__arrow--next').addEventListener('click', () => this._step(1));

    // Dots
    this._dotsEls.forEach(dot => {
      dot.addEventListener('click', () => this._goTo(Number(dot.dataset.index)));
    });

    // Wishlist
    this._el.addEventListener('click', e => {
      const wl = e.target.closest('.hs__wishlist');
      if (!wl) return;
      const id = wl.dataset.id;
      if (this._wishlist.has(id)) {
        this._wishlist.delete(id);
        wl.textContent = '🤍';
        wl.classList.remove('active');
      } else {
        this._wishlist.add(id);
        wl.textContent = '❤️';
        wl.classList.add('active');
        showToast(i18n.lang === 'ar' ? 'أضيف إلى المفضلة ❤️' : 'Ajouté aux favoris ❤️', { type: 'info', icon: '❤️' });
      }
      localStorage.setItem('beauty-store:wishlist', JSON.stringify([...this._wishlist]));
    });

    // Add to cart
    this._el.addEventListener('click', e => {
      const btn = e.target.closest('.hs__add-btn');
      if (!btn) return;
      const id      = btn.dataset.id;
      const slide   = this._slides.find(s => s.id === id);
      if (!slide) return;

      // Construct minimal product for cartStore
      const product = {
        id:    slide.id,
        name:  slide.name,
        brand: slide.brand,
        price: { regular: slide.price, sale: null, currency: 'MAD' },
        stock: { status: 'in_stock' },
        images: { emoji: slide.emoji },
      };
      cartStore.add(product);

      // Feedback
      const lang = i18n.lang;
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

    // Pause on hover / touch
    this._el.addEventListener('mouseenter', () => { this._paused = true;  this._stopAutoplay(); });
    this._el.addEventListener('mouseleave', () => { this._paused = false; this._startAutoplay(); });

    // Touch / swipe
    let touchStartX = 0;
    this._el.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    this._el.addEventListener('touchend',   e => {
      const delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 40) this._step(delta < 0 ? 1 : -1);
    });
  }

  // ── Navigation ───────────────────────────────────────────────────────────────
  _step(dir) {
    const n = this._slides.length;
    this._goTo((this._current + dir + n) % n);
  }

  _goTo(index) {
    this._current = index;
    this._trackEl.style.transform = `translateX(-${index * 100}%)`;

    // Dots
    this._dotsEls.forEach((d, i) => d.classList.toggle('active', i === index));

    // Reset progress bar
    this._resetProgress();
    if (!this._paused) this._startAutoplay();
  }

  // ── Autoplay ─────────────────────────────────────────────────────────────────
  _startAutoplay() {
    this._stopAutoplay();
    this._timer = setInterval(() => this._step(1), this._autoplayMs);
    this._resetProgress();
  }

  _stopAutoplay() {
    clearInterval(this._timer);
    this._timer = null;
  }

  _resetProgress() {
    if (!this._progressEl) return;
    // Force reflow to restart animation
    this._progressEl.classList.remove('running');
    void this._progressEl.offsetWidth; // reflow
    this._progressEl.classList.add('running');
  }

  // ── i18n refresh ─────────────────────────────────────────────────────────────
  _refreshText() {
    const lang = i18n.lang;
    this._slides.forEach(s => {
      const nameEl    = this._el.querySelector(`[data-name="${s.id}"]`);
      const taglineEl = this._el.querySelector(`[data-tagline="${s.id}"]`);
      if (nameEl)    nameEl.textContent    = typeof s.name === 'object'    ? (s.name[lang]    ?? s.name.fr)    : s.name;
      if (taglineEl) taglineEl.textContent = typeof s.tagline === 'object' ? (s.tagline[lang] ?? s.tagline.fr) : s.tagline;
    });
  }

  // Unique ID for DOM (simple counter)
  get _id() {
    if (!this.__id) this.__id = `slider-${++Slider._counter}`;
    return this.__id;
  }
}

Slider._counter = 0;

// ── HeroSlider: mounts all three sliders ─────────────────────────────────────
class HeroSlider {
  constructor({ cartDrawer }) {
    this._cartDrawer = cartDrawer;
  }

  /**
   * Mount into #hero, replacing the old .hero__visual column entirely.
   * The hero HTML must contain:
   *   <div id="hero-slider-large"></div>
   *   <div id="hero-slider-small-wrap"></div>
   */
  mount() {
    const largeContainer    = document.getElementById('hero-slider-large');
    const smallWrapContainer= document.getElementById('hero-slider-small-wrap');

    if (!largeContainer || !smallWrapContainer) return;

    // Large slider
    new Slider({
      container:  largeContainer,
      size:       'large',
      slides:     LARGE_SLIDES,
      autoplayMs: 4000,
      cartDrawer: this._cartDrawer,
      enterDelay: 200,
    });

    // Small top
    new Slider({
      container:  smallWrapContainer,
      size:       'small',
      slides:     SMALL_TOP_SLIDES,
      autoplayMs: 3200,
      cartDrawer: this._cartDrawer,
      enterDelay: 340,
    });

    // Small bottom
    new Slider({
      container:  smallWrapContainer,
      size:       'small',
      slides:     SMALL_BOT_SLIDES,
      autoplayMs: 3800,
      cartDrawer: this._cartDrawer,
      enterDelay: 480,
    });

    return this;
  }
}

export default HeroSlider;
