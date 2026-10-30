/**
 * Header Component
 * Lumière Beauty Store — src/components/layout/Header.js
 *
 * Renders the sticky header with:
 *  - Moving Announcement Bar (translated via i18n.t('announcement'))
 *  - Brand logo (translated via i18n.t('footer.brand'))
 *  - Navigation links (translated via i18n.t('nav.*'))
 *  - Icon action buttons (search, wishlist, cart, account)
 *  - Language toggle button (FR ↔ AR + immediate RTL/LTR switch)
 */

import i18n from '../../context/i18n.js';

// ── SVG Icons (inline — no external dependency needed) ─────────────────────
const Icons = {
  logoWordmark: `<svg class="header-logo-svg" viewBox="0 0 156 38" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Lumière" direction="ltr">
    <text
      x="50%"
      y="28"
      text-anchor="middle"
      fill="currentColor"
      font-family="Playfair Display, Didot, Georgia, serif"
      font-size="28"
      font-weight="600"
      letter-spacing="0.05em"
    >Lumière</text>
  </svg>`,

  search: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>`,

  heart: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>`,

  cart: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>`,

  user: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>`,

  globe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>`,

  truck: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>`,

  sparkle: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/></svg>`,

  menu: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>`,
};

// ── Nav links configuration ────────────────────────────────────────────────
const NAV_LINKS = [
  { key: 'nav.home',   href: '#',       id: 'nav-home'   },
  { key: 'nav.shop',   href: '#shop',   id: 'nav-shop'   },
  { key: 'nav.hair',   href: '#hair',   id: 'nav-hair'   },
  { key: 'nav.body',   href: '#body',   id: 'nav-body'   },
  { key: 'nav.brands', href: '#brands', id: 'nav-brands' },
  { key: 'nav.sale',   href: '#sale',   id: 'nav-sale', badge: true },
];

// ── Component ──────────────────────────────────────────────────────────────
class Header {
  /**
   * @param {{ cartCount?: number, wishlistCount?: number }} [options]
   */
  constructor({ cartCount = 0, wishlistCount = 0 } = {}) {
    this.cartCount     = cartCount;
    this.wishlistCount = wishlistCount;
    this._el           = null;
    this._globalBound  = false;

    this._onLangChange = () => this._refresh();
    this._onScroll     = () => {
      if (this._el) {
        this._el.classList.toggle('header--scrolled', window.scrollY > 10);
      }
    };
  }

  _resolveHref(hashHref) {
    const isHomePage =
      window.location.pathname.endsWith('/') ||
      window.location.pathname.endsWith('/index.html') ||
      Boolean(document.getElementById('shop-root'));
    if (isHomePage) return hashHref;
    return hashHref === '#' ? 'index.html' : `index.html${hashHref}`;
  }

  // ── Build HTML string ────────────────────────────────────────────────────
  _buildHTML() {
    const isAr = i18n.lang === 'ar';

    const navLinks = NAV_LINKS.map(link => {
      const label = i18n.t(link.key);
      const href  = this._resolveHref(link.href);
      return `
        <a
          href="${href}"
          id="${link.id}"
          class="header__nav-link${link.id === 'nav-home' ? ' active' : ''}"
          data-i18n="${link.key}"
          aria-label="${label}"
        >${label}</a>
      `;
    }).join('');

    const nextLocale = isAr
      ? { flag: '🇫🇷', label: i18n.t('langSwitcher.switchToFr'), code: 'FR' }
      : { flag: '🇲🇦', label: i18n.t('langSwitcher.switchToAr'), code: 'العربية' };

    const announcementText = i18n.t('announcement');
    const brandName        = i18n.t('footer.brand');

    return `
      <header class="header" id="site-header" role="banner">

        <!-- ── Top Moving Announcement Bar (Marquee) ─────── -->
        <div class="announcement-bar" role="region" aria-label="${announcementText}">
          <div class="announcement-bar__track">
            <div class="announcement-bar__items">
              <span class="announcement-bar__item">
                <span class="announcement-bar__icon" aria-hidden="true">${Icons.truck}</span>
                <span data-i18n="announcement">${announcementText}</span>
              </span>
              <span class="announcement-bar__sep" aria-hidden="true">✦</span>
              <span class="announcement-bar__item">
                <span class="announcement-bar__icon" aria-hidden="true">${Icons.sparkle}</span>
                <span data-i18n="announcement">${announcementText}</span>
              </span>
              <span class="announcement-bar__sep" aria-hidden="true">✦</span>
              <span class="announcement-bar__item">
                <span class="announcement-bar__icon" aria-hidden="true">${Icons.truck}</span>
                <span data-i18n="announcement">${announcementText}</span>
              </span>
              <span class="announcement-bar__sep" aria-hidden="true">✦</span>
            </div>
            <div class="announcement-bar__items" aria-hidden="true">
              <span class="announcement-bar__item">
                <span class="announcement-bar__icon" aria-hidden="true">${Icons.truck}</span>
                <span data-i18n="announcement">${announcementText}</span>
              </span>
              <span class="announcement-bar__sep" aria-hidden="true">✦</span>
              <span class="announcement-bar__item">
                <span class="announcement-bar__icon" aria-hidden="true">${Icons.sparkle}</span>
                <span data-i18n="announcement">${announcementText}</span>
              </span>
              <span class="announcement-bar__sep" aria-hidden="true">✦</span>
              <span class="announcement-bar__item">
                <span class="announcement-bar__icon" aria-hidden="true">${Icons.truck}</span>
                <span data-i18n="announcement">${announcementText}</span>
              </span>
              <span class="announcement-bar__sep" aria-hidden="true">✦</span>
            </div>
          </div>
        </div>

        <div class="header__main">
          <div class="container">
            <div class="header__inner">

              <!-- ── Brand Wordmark (Inline SVG) ────────────────── -->
              <a href="/" class="header-logo-link header__logo" aria-label="${brandName} – ${i18n.t('nav.home')}">
                ${Icons.logoWordmark}
              </a>

              <!-- ── Navigation ─────────────────────────────────── -->
              <nav class="header__nav" id="main-nav" role="navigation" aria-label="${i18n.t('nav.home')}">
                ${navLinks}
              </nav>

              <!-- ── Right actions ──────────────────────────────── -->
              <div class="header__actions">

                <!-- Search -->
                <button
                  class="header__icon-btn"
                  id="btn-search"
                  aria-label="${i18n.t('actions.search')}"
                  title="${i18n.t('actions.search')}"
                  type="button"
                >
                  ${Icons.search}
                </button>

                <!-- Wishlist -->
                <button
                  class="header__icon-btn"
                  id="btn-wishlist"
                  aria-label="${i18n.t('actions.wishlist')}"
                  title="${i18n.t('actions.wishlist')}"
                  type="button"
                >
                  ${Icons.heart}
                  ${this.wishlistCount > 0
                    ? `<span class="header__badge" aria-label="${i18n.t('actions.itemsCount', { count: this.wishlistCount })}">${this.wishlistCount}</span>`
                    : ''}
                </button>

                <!-- Cart -->
                <button
                  class="header__icon-btn"
                  id="btn-cart"
                  aria-label="${i18n.t('actions.cart')}"
                  title="${i18n.t('actions.cart')}"
                  type="button"
                >
                  ${Icons.cart}
                  ${this.cartCount > 0
                    ? `<span class="header__badge" aria-label="${i18n.t('actions.itemsCount', { count: this.cartCount })}">${this.cartCount}</span>`
                    : ''}
                </button>

                <!-- Account -->
                <button
                  class="header__icon-btn"
                  id="btn-account"
                  aria-label="${i18n.t('actions.account')}"
                  title="${i18n.t('actions.account')}"
                  type="button"
                >
                  ${Icons.user}
                </button>

                <!-- ── Language Toggle ───────────────────────────── -->
                <button
                  class="lang-toggle"
                  id="lang-toggle-btn"
                  data-lang="${i18n.lang}"
                  aria-label="${i18n.t('actions.toggleLang')}"
                  title="${i18n.t('actions.toggleLang')}"
                  type="button"
                >
                  <span class="lang-toggle__icon" aria-hidden="true">${Icons.globe}</span>
                  <span class="lang-toggle__flag" aria-hidden="true">${nextLocale.flag}</span>
                  <span class="lang-toggle__code">${nextLocale.code}</span>
                </button>

                <!-- Hamburger (mobile) -->
                <button
                  class="header__hamburger header__icon-btn"
                  id="btn-hamburger"
                  aria-label="${i18n.t('nav.menu')}"
                  aria-expanded="false"
                  aria-controls="main-nav"
                  type="button"
                >
                  ${Icons.menu}
                </button>
              </div>
              <!-- /header__actions -->

            </div>
          </div>
        </div>
      </header>
    `;
  }

  // ── Render ───────────────────────────────────────────────────────────────
  /**
   * Create and return the header DOM element.
   *
   * @returns {HTMLElement}
   */
  render() {
    const wrapper     = document.createElement('div');
    wrapper.innerHTML = this._buildHTML().trim();
    this._el          = wrapper.firstElementChild;

    this._bindElementEvents();

    if (!this._globalBound) {
      this._globalBound = true;
      document.addEventListener('langchange', this._onLangChange);
      window.addEventListener('scroll', this._onScroll, { passive: true });
    }

    return this._el;
  }

  // ── Element-level Event Binding ──────────────────────────────────────────
  _bindElementEvents() {
    const el = this._el;
    if (!el) return;

    // Language toggle: i18n.toggle() dispatches 'langchange', which triggers this._onLangChange once
    const toggleBtn = el.querySelector('#lang-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        i18n.toggle();
      });
    }

    // Mobile menu toggle
    const hamburger = el.querySelector('#btn-hamburger');
    const nav       = el.querySelector('#main-nav');
    if (hamburger && nav) {
      hamburger.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        hamburger.setAttribute('aria-expanded', String(isOpen));
      });

      // Close menu on link click
      nav.addEventListener('click', (e) => {
        if (e.target.closest('a')) {
          nav.classList.remove('is-open');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  // ── Refresh after language change ────────────────────────────────────────
  _refresh() {
    if (!this._el || !this._el.parentNode) return;

    const parent   = this._el.parentNode;
    const next     = document.createElement('div');
    next.innerHTML = this._buildHTML().trim();
    const newEl    = next.firstElementChild;

    if (window.scrollY > 10) {
      newEl.classList.add('header--scrolled');
    }

    parent.replaceChild(newEl, this._el);
    this._el = newEl;
    this._bindElementEvents();
  }

  // ── Update cart / wishlist count ─────────────────────────────────────────
  updateCounts({ cartCount, wishlistCount } = {}) {
    if (cartCount     !== undefined) this.cartCount     = cartCount;
    if (wishlistCount !== undefined) this.wishlistCount = wishlistCount;
    this._refresh();
  }
}

export default Header;
