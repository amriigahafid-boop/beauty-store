/**
 * HeroSlider.js — Static Luxury Editorial Banner (Mobile-First & Bilingual)
 * Lumière Beauty Store — src/components/hero/HeroSlider.js
 *
 * Renders a clean, static luxury banner without carousel mechanics,
 * pagination dots, navigation arrows, or overlapping cards.
 * Strictly bound to active locale (`src/context/locales/`) and listens
 * to `langchange` for instant FR / AR (RTL) switching.
 */

import i18n from '../../context/i18n.js';

const HERO_BANNER = {
  key: 'slide1',
  lifestyleImg: '/public/images/banners/lumiere-editorial-hair.jpg',
  collectionHref: '#shop',
};

export default class HeroSlider {
  constructor() {
    this._root      = null;
    this._langBound = false;

    this._onLangChange = () => {
      this._render();
    };
  }

  mount(target = '#hero-carousel-root') {
    this._root = typeof target === 'string' ? document.querySelector(target) : target;
    if (!this._root) return this;

    this._render();

    if (!this._langBound) {
      this._langBound = true;
      document.addEventListener('langchange', this._onLangChange);
    }

    return this;
  }

  _render() {
    if (!this._root) return;

    const prefix      = `hero.${HERO_BANNER.key}`;
    const eyebrow     = i18n.t(`${prefix}.eyebrow`);
    const titleMain   = i18n.t(`${prefix}.titleMain`);
    const titleAccent = i18n.t(`${prefix}.titleAccent`);
    const subtitle    = i18n.t(`${prefix}.subtitle`);
    const ctaPrimary  = i18n.t(`${prefix}.ctaPrimary`);

    this._root.innerHTML = `
      <div class="lux-bento" role="region" aria-label="${i18n.t('hero.regionLabel')}">
        <div class="lux-bento__shell">
          <article class="lux-bento__banner">
            <div class="lux-bento__grid">

              <!-- Editorial Copy & Single CTA -->
              <div class="lux-bento__copy">
                <p class="lux-bento__eyebrow" data-i18n="${prefix}.eyebrow">${eyebrow}</p>

                <h1 class="lux-bento__title" id="hero-heading">
                  <span data-i18n="${prefix}.titleMain">${titleMain}</span>
                  <em class="lux-bento__title-italic" data-i18n="${prefix}.titleAccent">${titleAccent}</em>
                </h1>

                <p class="lux-bento__subtitle" data-i18n="${prefix}.subtitle">${subtitle}</p>

                <div class="lux-bento__cta-row">
                  <a href="${HERO_BANNER.collectionHref}" class="lux-bento__btn-primary">
                    <span data-i18n="${prefix}.ctaPrimary">${ctaPrimary}</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </a>
                </div>
              </div>

              <!-- Clean Static Luxury Editorial Image -->
              <div class="lux-bento__visual">
                <div class="lux-bento__photo-frame">
                  <img
                    src="${HERO_BANNER.lifestyleImg}"
                    alt="${titleMain} ${titleAccent}"
                    class="lux-bento__photo-crop"
                    loading="eager"
                    decoding="async"
                    onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src=this.getAttribute('src').replace('/public/','/');}"
                  />
                </div>
              </div>

            </div>
          </article>
        </div>
      </div>
    `;
  }
}
