/**
 * HeroCarousel.js
 * Single full-width carousel for the hero section
 */

const ChevronLeft  = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>`;
const ChevronRight = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>`;

const BANNERS = [
  'public/images/banners/banner1.jpeg',
  'public/images/banners/banner2.jpeg',
  'public/images/banners/banner3.jpeg'
];

export default class HeroCarousel {
  constructor() {
    this._el = null;
    this._track = null;
    this._dots = [];
    this._current = 0;
    this._timer = null;
    this._autoplayMs = 5000;
  }

  mount(containerId = 'hero-carousel-root') {
    const root = document.getElementById(containerId);
    if (!root) return;

    this._el = document.createElement('div');
    this._el.className = 'carousel';

    this._el.innerHTML = `
      <div class="carousel__track">
        ${BANNERS.map(src => `
          <div class="carousel__slide" style="width: ${100 / BANNERS.length}%">
            <img src="${src}" alt="Banner" class="carousel__img" />
          </div>
        `).join('')}
      </div>
      <button class="carousel__arrow carousel__arrow--prev" aria-label="Précédent">${ChevronLeft}</button>
      <button class="carousel__arrow carousel__arrow--next" aria-label="Suivant">${ChevronRight}</button>
      <div class="carousel__dots">
        ${BANNERS.map((_, i) => `
          <button class="carousel__dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Slide ${i + 1}"></button>
        `).join('')}
      </div>
    `;

    root.appendChild(this._el);

    this._track = this._el.querySelector('.carousel__track');
    this._track.style.width = `${BANNERS.length * 100}%`;
    this._dots = this._el.querySelectorAll('.carousel__dot');

    this._bindEvents();
    this._startAutoplay();
  }

  _bindEvents() {
    this._el.querySelector('.carousel__arrow--prev').addEventListener('click', () => {
      this._step(-1);
      this._restartAutoplay();
    });
    this._el.querySelector('.carousel__arrow--next').addEventListener('click', () => {
      this._step(1);
      this._restartAutoplay();
    });

    this._dots.forEach(dot => {
      dot.addEventListener('click', () => {
        this._goTo(Number(dot.dataset.index));
        this._restartAutoplay();
      });
    });

    document.addEventListener('langchange', () => {
      this._goTo(this._current);
    });

    let touchStartX = 0;
    this._el.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this._el.addEventListener('touchend', e => {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      const isRtl = document.documentElement.dir === 'rtl' || document.documentElement.getAttribute('dir') === 'rtl';
      
      if (Math.abs(diff) > 40) {
        // Swipe left means next in LTR, prev in RTL
        if (diff < 0) {
          this._step(isRtl ? -1 : 1);
        } else {
          // Swipe right means prev in LTR, next in RTL
          this._step(isRtl ? 1 : -1);
        }
        this._restartAutoplay();
      }
    });
  }

  _step(dir) {
    let next = this._current + dir;
    if (next < 0) next = BANNERS.length - 1;
    if (next >= BANNERS.length) next = 0;
    this._goTo(next);
  }

  _goTo(index) {
    this._current = index;
    const isRtl = document.documentElement.dir === 'rtl' || document.documentElement.getAttribute('dir') === 'rtl';
    const sign = isRtl ? 1 : -1;
    // Track width is N * 100%. We move by 1 slide, which is 100 / N % of the track width.
    const pct = 100 / BANNERS.length;
    this._track.style.transform = `translateX(${sign * this._current * pct}%)`;
    this._dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  _startAutoplay() {
    this._timer = setInterval(() => this._step(1), this._autoplayMs);
  }

  _restartAutoplay() {
    clearInterval(this._timer);
    this._startAutoplay();
  }
}
