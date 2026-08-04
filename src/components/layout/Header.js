/**
 * Header Component
 * Beauty Store
 *
 * Renders the sticky header with:
 *  - Brand logo
 *  - Navigation links (auto-translated)
 *  - Icon action buttons (search, wishlist, cart)
 *  - Language toggle button (FR ↔ AR + RTL switch)
 *
 * Usage:
 *   import Header from './src/components/layout/Header.js';
 *   const header = new Header({ cartCount: 3 });
 *   document.body.prepend(header.render());
 */

import i18n from '../../context/i18n.js';

// ── SVG Icons (inline — no external dependency needed) ─────────────────────
const Icons = {
  logo: '💄',

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

  check: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
    <polyline points="20 6 9 17 4 12"/>
  </svg>`,

  menu: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>`,
};

// ── Nav links configuration ────────────────────────────────────────────────
const NAV_LINKS = [
  { key: 'nav.home',      href: '#',        id: 'nav-home'      },
  { key: 'nav.shop',      href: '#shop',    id: 'nav-shop'      },
  { key: 'nav.skincare',  href: '#skincare',id: 'nav-skincare'  },
  { key: 'nav.makeup',    href: '#makeup',  id: 'nav-makeup'    },
  { key: 'nav.perfumes',  href: '#perfumes',id: 'nav-perfumes'  },
  { key: 'nav.brands',    href: '#brands',  id: 'nav-brands'    },
  { key: 'nav.sale',      href: '#sale',    id: 'nav-sale', badge: true },
];

// ── Component ──────────────────────────────────────────────────────────────
class Header {
  /**
   * @param {{ cartCount?: number, wishlistCount?: number }} [options]
   */
  constructor({ cartCount = 0, wishlistCount = 0 } = {}) {
    this.cartCount      = cartCount;
    this.wishlistCount  = wishlistCount;
    this._el            = null; // cached DOM reference
  }

  // ── Build HTML string ────────────────────────────────────────────────────
  _buildHTML() {
    const locale = i18n.locale;

    const navLinks = NAV_LINKS.map(link => `
      <a
        href="${link.href}"
        id="${link.id}"
        class="header__nav-link${link.id === 'nav-home' ? ' active' : ''}"
        data-i18n="${link.key}"
        aria-label="${i18n.t(link.key)}"
      >${i18n.t(link.key)}</a>
    `).join('');

    const nextLang  = i18n.lang === 'fr' ? 'ar' : 'fr';
    const nextLocale = nextLang === 'fr'
      ? { flag: '🇫🇷', label: 'Français', code: 'FR' }
      : { flag: '🇸🇦', label: 'عربي',     code: 'AR' };

    return `
      <header class="header" id="site-header" role="banner">
        <div class="container">
          <div class="header__inner">

            <!-- ── Brand ──────────────────────────────────────── -->
            <a href="#" class="header__logo" aria-label="Beauty Store – Accueil">
              <div class="header__logo-icon" aria-hidden="true">${Icons.logo}</div>
              <span class="header__logo-text">Lumière</span>
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
              >
                ${Icons.search}
              </button>

              <!-- Wishlist -->
              <button
                class="header__icon-btn"
                id="btn-wishlist"
                aria-label="${i18n.t('actions.wishlist')}"
                title="${i18n.t('actions.wishlist')}"
              >
                ${Icons.heart}
                ${this.wishlistCount > 0
                  ? `<span class="header__badge" aria-label="${this.wishlistCount} articles">${this.wishlistCount}</span>`
                  : ''}
              </button>

              <!-- Cart -->
              <button
                class="header__icon-btn"
                id="btn-cart"
                aria-label="${i18n.t('actions.cart')}"
                title="${i18n.t('actions.cart')}"
              >
                ${Icons.cart}
                ${this.cartCount > 0
                  ? `<span class="header__badge" aria-label="${this.cartCount} articles">${this.cartCount}</span>`
                  : ''}
              </button>

              <!-- Account -->
              <button
                class="header__icon-btn"
                id="btn-account"
                aria-label="${i18n.t('actions.account')}"
                title="${i18n.t('actions.account')}"
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
                aria-label="Menu"
                aria-expanded="false"
                aria-controls="main-nav"
              >
                ${Icons.menu}
              </button>
            </div>
            <!-- /header__actions -->

          </div>
        </div>
      </header>
    `;
  }

  // ── Render ───────────────────────────────────────────────────────────────
  /**
   * Create and return the header DOM element.
   * Attaches event listeners for the language toggle.
   *
   * @returns {HTMLElement}
   */
  render() {
    const wrapper    = document.createElement('div');
    wrapper.innerHTML = this._buildHTML().trim();
    this._el          = wrapper.firstElementChild;

    this._bindEvents();
    return this._el;
  }

  // ── Event binding ────────────────────────────────────────────────────────
  _bindEvents() {
    const el = this._el;

    // Language toggle
    const toggleBtn = el.querySelector('#lang-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        i18n.toggle();
        this._refresh();
      });
    }

    // Scroll shadow effect
    window.addEventListener('scroll', () => {
      el.classList.toggle('header--scrolled', window.scrollY > 10);
    }, { passive: true });

    // Listen for external language changes (e.g. other components)
    document.addEventListener('langchange', () => this._refresh());
  }

  // ── Refresh after language change ────────────────────────────────────────
  _refresh() {
    if (!this._el) return;

    const parent   = this._el.parentNode;
    const next     = document.createElement('div');
    next.innerHTML  = this._buildHTML().trim();
    const newEl     = next.firstElementChild;

    parent.replaceChild(newEl, this._el);
    this._el = newEl;
    this._bindEvents();
  }

  // ── Update cart / wishlist count ─────────────────────────────────────────
  updateCounts({ cartCount, wishlistCount } = {}) {
    if (cartCount      !== undefined) this.cartCount      = cartCount;
    if (wishlistCount  !== undefined) this.wishlistCount  = wishlistCount;
    this._refresh();
  }
}

export default Header;
