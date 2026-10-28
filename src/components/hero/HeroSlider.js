/**
 * HeroSlider.js — Modern 2026 Luxury Editorial + Product Spotlight Hero
 * Lumière Beauty Store — src/components/hero/HeroSlider.js
 *
 * Strictly bound to active locale (`src/context/locales/`) and localized
 * product fields (`product.title[lang]` / `product.name[lang]`).
 * Listens to `langchange` and re-renders cleanly without losing slide state.
 */

import products           from '../../data/products.data.js';
import cartStore          from '../../context/cartStore.js';
import i18n               from '../../context/i18n.js';
import { formatPrice }    from '../../utils/currency.js';
import { effectivePrice } from '../../services/productService.js';
import { showToast }      from '../cart/CartDrawer.js';

const HERO_SLIDES = [
  {
    key: 'slide1',
    productId: 'the-ceel-rosemary-hair-mask',
    lifestyleImg: '/public/images/banners/lumiere-editorial-hair.jpg',
    collectionHref: '#shop',
    theme: 'amber',
  },
  {
    key: 'slide2',
    productId: 'the-bath-factory-sweet-vanilla-scrub',
    lifestyleImg: '/public/images/banners/lumiere-editorial-body.jpg',
    collectionHref: '#body',
    theme: 'rose',
  },
];

const AUTOPLAY_MS = 7000;

export default class HeroSlider {
  constructor({ cartDrawer = null } = {}) {
    this._cartDrawer   = cartDrawer;
    this._root         = null;
    this._index        = 0;
    this._timer        = null;
    this._touchStartX  = 0;
    this._touchStartY  = 0;
    this._langBound    = false;

    this._onLangChange = () => {
      this._render();
      this._startAutoplay();
    };
  }

  mount(target = '#hero-carousel-root') {
    this._root = typeof target === 'string' ? document.querySelector(target) : target;
    if (!this._root) return this;

    this._render();
    this._startAutoplay();

    if (!this._langBound) {
      this._langBound = true;
      document.addEventListener('langchange', this._onLangChange);
    }

    return this;
  }

  _render() {
    if (!this._root) return;

    const lang = i18n.lang;

    const trustItems = [
      i18n.t('hero.trust1'),
      i18n.t('hero.trust2'),
      i18n.t('hero.trust3'),
    ];

    const slidesHtml = HERO_SLIDES.map((slide, idx) => {
      const isActive    = idx === this._index;
      const prefix      = `hero.${slide.key}`;
      const proof       = i18n.t(`${prefix}.proof`);
      const eyebrow     = i18n.t(`${prefix}.eyebrow`);
      const titleMain   = i18n.t(`${prefix}.titleMain`);
      const titleAccent = i18n.t(`${prefix}.titleAccent`);
      const subtitle    = i18n.t(`${prefix}.subtitle`);
      const ctaPrimary  = i18n.t(`${prefix}.ctaPrimary`);
      const ctaProduct  = i18n.t(`${prefix}.ctaProduct`);
      const spotBadge   = i18n.t(`${prefix}.spotBadge`);

      const product = products.find(p => p.id === slide.productId) ?? products[0];
      const pTitle  = product.title?.[lang] ?? product.name?.[lang] ?? product.title?.fr ?? product.name?.fr ?? '';
      const pPrice  = formatPrice(effectivePrice(product), lang);
      const pRating = product.rating?.average?.toFixed(1) ?? '4.9';
      const pUrl    = `product.html?id=${encodeURIComponent(product.id)}`;
      const h1Id    = idx === 0 ? 'id="hero-heading"' : '';

      return `
        <article
          class="lux-bento__slide lux-bento__slide--${slide.theme}${isActive ? ' is-active' : ''}"
          data-slide-index="${idx}"
          aria-hidden="${!isActive}"
        >
          <div class="lux-bento__grid">

            <!-- Editorial Copy Column -->
            <div class="lux-bento__copy">
              <p class="lux-bento__eyebrow" data-i18n="${prefix}.eyebrow">${eyebrow}</p>

              <h1 class="lux-bento__title" ${h1Id}>
                <span data-i18n="${prefix}.titleMain">${titleMain}</span>
                <em class="lux-bento__title-italic" data-i18n="${prefix}.titleAccent">${titleAccent}</em>
              </h1>

              <p class="lux-bento__subtitle" data-i18n="${prefix}.subtitle">${subtitle}</p>

              <div class="lux-bento__cta-row">
                <a href="${slide.collectionHref}" class="lux-bento__btn-primary">
                  <span data-i18n="${prefix}.ctaPrimary">${ctaPrimary}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>
            </div>

            <!-- Visual Backdrop + Floating Product Spotlight Card -->
            <div class="lux-bento__visual">
              <div class="lux-bento__photo-frame">
                <img
                  src="${slide.lifestyleImg}"
                  alt="${titleMain} ${titleAccent}"
                  class="lux-bento__photo-crop"
                  loading="${idx === 0 ? 'eager' : 'lazy'}"
                  decoding="async"
                  onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src=this.getAttribute('src').replace('/public/','/');}"
                />
                <div class="lux-bento__photo-badge">
                  <span aria-hidden="true">✦</span>
                  <span data-i18n="hero.exclusiveBadge">${i18n.t('hero.exclusiveBadge')}</span>
                </div>
              </div>

              <!-- Interactive Product Spotlight Card -->
              <div class="lux-bento__spotlight">
                <a href="${pUrl}" class="lux-bento__spotlight-thumb" aria-label="${pTitle}">
                  <img
                    src="${product.images.main}"
                    alt="${pTitle}"
                    loading="lazy"
                    decoding="async"
                    onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src=this.getAttribute('src').replace('/public/','/');}"
                  />
                </a>

                <div class="lux-bento__spotlight-body">
                  <div class="lux-bento__spotlight-top">
                    <span class="lux-bento__spotlight-brand">${product.brand}</span>
                    <span class="lux-bento__spotlight-tag" data-i18n="${prefix}.spotBadge">${spotBadge}</span>
                  </div>

                  <a href="${pUrl}" class="lux-bento__spotlight-title" title="${pTitle}">${pTitle}</a>

                  <div class="lux-bento__spotlight-bottom">
                    <div class="lux-bento__spotlight-price-wrap">
                      <span class="lux-bento__spotlight-price">${pPrice}</span>
                      <span class="lux-bento__spotlight-rating">★ ${pRating}</span>
                    </div>

                    <div class="lux-bento__spotlight-actions">
                      <a href="${pUrl}" class="lux-bento__spotlight-view" title="${ctaProduct}" data-i18n="hero.viewDetails">
                        ${i18n.t('hero.viewDetails')}
                      </a>
                      <button
                        type="button"
                        class="lux-bento__spotlight-add"
                        data-hero-add="${product.id}"
                        aria-label="${i18n.t('product.addToCart')}: ${pTitle}"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        <span data-i18n="hero.quickAdd">${i18n.t('hero.quickAdd')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </article>
      `;
    }).join('');

    const dotsHtml = HERO_SLIDES.map((_, idx) => `
      <button
        type="button"
        class="lux-bento__dot${idx === this._index ? ' is-active' : ''}"
        data-slide-to="${idx}"
        aria-label="${i18n.t('hero.slideLabel', { num: idx + 1 })}"
        aria-current="${idx === this._index ? 'true' : 'false'}"
      ></button>
    `).join('');

    this._root.innerHTML = `
      <div class="lux-bento" role="region" aria-roledescription="carousel" aria-label="${i18n.t('hero.regionLabel')}">
        <div class="lux-bento__shell">
          <div class="lux-bento__viewport">
            <div class="lux-bento__track">
              ${slidesHtml}
            </div>
          </div>

          <!-- Controls Bar -->
          <div class="lux-bento__controls">
            <button
              type="button"
              class="lux-bento__arrow"
              data-hero-dir="-1"
              aria-label="${i18n.t('hero.prev')}"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <div class="lux-bento__dots" role="tablist">
              ${dotsHtml}
            </div>

            <button
              type="button"
              class="lux-bento__arrow"
              data-hero-dir="1"
              aria-label="${i18n.t('hero.next')}"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    this._syncPosition(false);
    this._bindEvents();
  }

  _bindEvents() {
    const root = this._root?.querySelector('.lux-bento');
    if (!root) return;

    root.querySelectorAll('[data-hero-dir]').forEach(btn => {
      btn.addEventListener('click', () => {
        const dir = Number(btn.getAttribute('data-hero-dir'));
        this.goTo(this._index + dir);
        this._restartAutoplay();
      });
    });

    root.querySelectorAll('[data-slide-to]').forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = Number(dot.getAttribute('data-slide-to'));
        this.goTo(idx);
        this._restartAutoplay();
      });
    });

    // Quick Add-to-Cart on Spotlight Card
    root.querySelectorAll('[data-hero-add]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute('data-hero-add');
        const product = products.find(p => p.id === id);
        if (!product) return;

        cartStore.add(product);

        const lang  = i18n.lang;
        const title = product.title?.[lang] ?? product.name?.[lang] ?? product.title?.fr ?? product.name?.fr ?? '';
        const original = btn.innerHTML;
        btn.classList.add('is-added');
        btn.innerHTML = `<span>✓</span>`;
        setTimeout(() => {
          btn.classList.remove('is-added');
          btn.innerHTML = original;
        }, 1500);

        showToast(
          i18n.t('product.addedToast', { name: title }),
          { type: 'success', icon: '✦', duration: 2400 }
        );

        if (this._cartDrawer) this._cartDrawer.open();
      });
    });

    // Touch swipe on mobile
    root.addEventListener('touchstart', e => {
      if (!e.touches || !e.touches.length) return;
      this._touchStartX = e.touches[0].clientX;
      this._touchStartY = e.touches[0].clientY;
      this._stopAutoplay();
    }, { passive: true });

    root.addEventListener('touchend', e => {
      if (!e.changedTouches || !e.changedTouches.length) return;
      const dx = e.changedTouches[0].clientX - this._touchStartX;
      const dy = e.changedTouches[0].clientY - this._touchStartY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        this.goTo(dx < 0 ? this._index + 1 : this._index - 1);
      }
      this._startAutoplay();
    }, { passive: true });

    root.addEventListener('mouseenter', () => this._stopAutoplay());
    root.addEventListener('mouseleave', () => this._startAutoplay());
    root.addEventListener('focusin',    () => this._stopAutoplay());
    root.addEventListener('focusout',   () => this._startAutoplay());
  }

  goTo(nextIndex) {
    const count = HERO_SLIDES.length;
    this._index = ((nextIndex % count) + count) % count;
    this._syncPosition(true);
  }

  _syncPosition(animate = true) {
    if (!this._root) return;
    const track = this._root.querySelector('.lux-bento__track');
    if (!track) return;

    track.style.transition = animate ? '' : 'none';
    track.style.transform  = `translate3d(-${this._index * 100}%, 0, 0)`;

    this._root.querySelectorAll('.lux-bento__slide').forEach((el, idx) => {
      const active = idx === this._index;
      el.classList.toggle('is-active', active);
      el.setAttribute('aria-hidden', String(!active));
    });

    this._root.querySelectorAll('.lux-bento__dot').forEach((el, idx) => {
      const active = idx === this._index;
      el.classList.toggle('is-active', active);
      el.setAttribute('aria-current', String(active));
    });
  }

  _startAutoplay() {
    this._stopAutoplay();
    this._timer = window.setInterval(() => {
      this.goTo(this._index + 1);
    }, AUTOPLAY_MS);
  }

  _stopAutoplay() {
    if (this._timer) {
      window.clearInterval(this._timer);
      this._timer = null;
    }
  }

  _restartAutoplay() {
    this._startAutoplay();
  }
}
