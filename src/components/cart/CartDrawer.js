/**
 * CartDrawer.js — Slide-in Cart Drawer Component
 * Lumière Beauty Store — src/components/cart/CartDrawer.js
 *
 * Strictly bound to active locale (`src/context/locales/`) and localized
 * product fields. Listens to `langchange` and `cartchange`.
 */

import cartStore       from '../../context/cartStore.js';
import i18n            from '../../context/i18n.js';
import products        from '../../data/products.data.js';
import { formatPrice } from '../../utils/currency.js';

// ── Icons ──────────────────────────────────────────────────────────────────
const Icons = {
  bag:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  close:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  trash:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>`,
  arrow:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  lock:   `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  truck:  `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
};

class CartDrawer {
  constructor() {
    this._el      = null;
    this._overlay = null;
    this._isOpen  = false;

    // Bind handlers once
    this._onCartChange = () => this._refresh();
    this._onLangChange = () => this._refresh();
  }

  // ── Mount ─────────────────────────────────────────────────────────────────
  mount() {
    // Overlay
    this._overlay = document.createElement('div');
    this._overlay.className = 'overlay';
    this._overlay.id = 'cart-overlay';
    this._overlay.addEventListener('click', () => this.close());
    document.body.appendChild(this._overlay);

    // Drawer
    this._el = document.createElement('div');
    this._el.className = 'cart-drawer';
    this._el.id = 'cart-drawer';
    this._el.setAttribute('role', 'dialog');
    this._el.setAttribute('aria-modal', 'true');
    this._el.setAttribute('aria-label', i18n.t('cart.title'));
    this._render();
    document.body.appendChild(this._el);

    // Toast container
    if (!document.getElementById('toast-container')) {
      const tc = document.createElement('div');
      tc.id = 'toast-container';
      document.body.appendChild(tc);
    }

    // Event listeners
    document.addEventListener('cartchange', this._onCartChange);
    document.addEventListener('langchange', this._onLangChange);

    return this;
  }

  // ── Open / close ──────────────────────────────────────────────────────────
  open() {
    this._isOpen = true;
    this._el.classList.add('open');
    this._overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    this._el.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
      const first = this._el.querySelector('button, a, input');
      if (first) first.focus();
    }, 300);
  }

  close() {
    this._isOpen = false;
    this._el.classList.remove('open');
    this._overlay.classList.remove('active');
    document.body.style.overflow = '';
    this._el.setAttribute('aria-hidden', 'true');
  }

  toggle() { this._isOpen ? this.close() : this.open(); }

  // ── Internal render ───────────────────────────────────────────────────────
  _render() {
    if (!this._el) return;
    const lang    = i18n.lang;
    const isAr    = lang === 'ar';
    const summary = cartStore.summary();
    const { items, count, subtotal, shipping, total, freeShipping, remaining } = summary;

    this._el.setAttribute('aria-label', i18n.t('cart.title'));

    const remainingFormatted = formatPrice(remaining, lang);
    const shippingHintText   = i18n.t('cart.addForFreeShipping', { amount: remainingFormatted });

    this._el.innerHTML = `
      <!-- Header -->
      <div class="cart-drawer__header">
        <div class="cart-drawer__title">
          <span class="cart-drawer__title-icon" aria-hidden="true">${Icons.bag}</span>
          <span data-i18n="cart.title">${i18n.t('cart.title')}</span>
          <span class="cart-drawer__count">${count}</span>
        </div>
        <button type="button" class="cart-drawer__close" id="cart-close-btn" aria-label="${i18n.t('ui.close')}">
          ${Icons.close}
        </button>
      </div>

      <!-- Free shipping bar -->
      ${items.length > 0 ? `
        <div class="cart-shipping-bar">
          <div class="cart-shipping-bar__text">
            ${freeShipping
              ? `<span>✦ <strong data-i18n="cart.freeShipping">${i18n.t('cart.freeShipping')}</strong></span><span>✓</span>`
              : `<span>${shippingHintText}</span>
                 <span>${Math.round((subtotal / cartStore.FREE_SHIPPING_THRESH) * 100)}%</span>`
            }
          </div>
          <div class="cart-shipping-bar__track">
            <div class="cart-shipping-bar__fill" style="width:${Math.min(100, (subtotal / cartStore.FREE_SHIPPING_THRESH) * 100)}%"></div>
          </div>
        </div>
      ` : ''}

      <!-- Items / Empty -->
      ${items.length === 0 ? this._renderEmpty() : `
        <div class="cart-drawer__items" id="cart-items-list">
          ${items.map(item => this._renderItem(item, lang)).join('')}
        </div>
      `}

      <!-- Footer (only when items exist) -->
      ${items.length > 0 ? `
        <div class="cart-drawer__footer">
          <div class="cart-totals">
            <div class="cart-totals__row">
              <span data-i18n="cart.subtotal">${i18n.t('cart.subtotal')}</span>
              <span>${formatPrice(subtotal, lang)}</span>
            </div>
            <div class="cart-totals__row">
              <span data-i18n="cart.shipping">${i18n.t('cart.shipping')}</span>
              <span class="${freeShipping ? 'cart-totals__free' : ''}">
                ${freeShipping ? i18n.t('cart.freeShipping') : formatPrice(shipping, lang)}
              </span>
            </div>
            <div class="cart-totals__row cart-totals__row--total">
              <span data-i18n="cart.total">${i18n.t('cart.total')}</span>
              <span class="cart-totals__amount">${formatPrice(total, lang)}</span>
            </div>
          </div>

          <a href="checkout.html" class="cart-checkout-btn" id="cart-checkout-btn">
            <span data-i18n="cart.checkout">${i18n.t('cart.checkout')}</span>
            ${Icons.arrow}
          </a>

          <button type="button" class="cart-continue-btn" id="cart-continue-btn">
            <span>${isAr ? '→' : '←'}</span>
            <span data-i18n="cart.continueShopping">${i18n.t('cart.continueShopping')}</span>
          </button>

          <div class="cart-security">
            <span>${Icons.lock} <span data-i18n="cart.securePayment">${i18n.t('cart.securePayment')}</span></span>
            <span>${Icons.truck} <span data-i18n="cart.orderTracking">${i18n.t('cart.orderTracking')}</span></span>
          </div>
        </div>
      ` : ''}
    `;

    this._bindInternalEvents();
  }

  _renderEmpty() {
    return `
      <div class="cart-empty">
        <div class="cart-empty__icon" aria-hidden="true">${Icons.bag}</div>
        <div class="cart-empty__title" data-i18n="cart.empty">${i18n.t('cart.empty')}</div>
        <div class="cart-empty__hint" data-i18n="cart.emptyHint">${i18n.t('cart.emptyHint')}</div>
        <button type="button" class="cart-empty__cta" id="cart-continue-empty" data-i18n="cart.discoverProducts">
          ${i18n.t('cart.discoverProducts')}
        </button>
      </div>
    `;
  }

  _renderItem(item, lang) {
    const catalogProd = products.find(p => p.id === item.productId);
    const title =
      catalogProd?.title?.[lang] ??
      catalogProd?.name?.[lang] ??
      item.title?.[lang] ??
      item.name?.[lang] ??
      item.title?.fr ??
      item.name?.fr ??
      '';
    const removeLabel = i18n.t('cart.remove');

    return `
      <div class="cart-item" data-key="${item.key}">
        ${(item.image || item.mainImage)
          ? `<img src="${item.image || item.mainImage}" alt="${title}" class="cart-item__image" loading="lazy" decoding="async" onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src=this.getAttribute('src').replace('/public/','/');}" />`
          : `<div class="cart-item__image">${item.emoji}</div>`}
        <div class="cart-item__details">
          <div class="cart-item__brand">${item.brand}</div>
          <div class="cart-item__name" title="${title}">${title}</div>
          ${item.variantLabel ? `<div class="cart-item__variant">${item.variantLabel}</div>` : ''}
          <div class="cart-item__bottom">
            <div class="qty-stepper" data-key="${item.key}">
              <button type="button" class="qty-stepper__btn" data-action="dec" ${item.qty <= 1 ? `title="${removeLabel}" aria-label="${removeLabel}"` : ''}>
                ${item.qty <= 1 ? Icons.trash : '−'}
              </button>
              <span class="qty-stepper__value">${item.qty}</span>
              <button type="button" class="qty-stepper__btn" data-action="inc">+</button>
            </div>
            <div class="cart-item__price">
              ${item.regularPrice && item.regularPrice > item.price
                ? `<span class="cart-item__price-old" style="font-size:0.74rem;color:var(--color-text-muted);text-decoration:line-through;margin-inline-end:6px;font-weight:500;">${formatPrice(item.regularPrice * item.qty, lang)}</span>`
                : ''
              }<span style="${item.regularPrice && item.regularPrice > item.price ? 'color:#9D3B5C;' : ''}">${formatPrice(item.price * item.qty, lang)}</span>
            </div>
            <button type="button" class="cart-item__remove" data-key="${item.key}" title="${removeLabel}" aria-label="${removeLabel}">
              ${Icons.trash}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ── Event binding ─────────────────────────────────────────────────────────
  _bindInternalEvents() {
    const el = this._el;

    // Close button
    el.querySelector('#cart-close-btn')?.addEventListener('click', () => this.close());

    // Continue shopping
    el.querySelector('#cart-continue-btn')?.addEventListener('click', () => this.close());
    el.querySelector('#cart-continue-empty')?.addEventListener('click', () => this.close());

    // Qty steppers
    el.querySelectorAll('.qty-stepper').forEach(stepper => {
      const key = stepper.dataset.key;
      stepper.querySelectorAll('.qty-stepper__btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const item = cartStore.items().find(i => i.key === key);
          if (!item) return;
          const action = btn.dataset.action;
          if (action === 'inc') cartStore.setQty(key, item.qty + 1);
          else                  cartStore.setQty(key, item.qty - 1);
        });
      });
    });

    // Remove buttons
    el.querySelectorAll('.cart-item__remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        const row = el.querySelector(`.cart-item[data-key="${key}"]`);
        if (row) {
          row.classList.add('removing');
          setTimeout(() => cartStore.remove(key), 250);
        } else {
          cartStore.remove(key);
        }
      });
    });
  }

  // ── Refresh ───────────────────────────────────────────────────────────────
  _refresh() {
    if (!this._el) return;
    this._render();
  }
}

// ── Toast helper (shared) ──────────────────────────────────────────────────
export function showToast(message, { type = 'info', icon = '✦', duration = 3000 } = {}) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `<span class="toast__icon">${icon}</span><span class="toast__text">${message}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, duration);
}

export default CartDrawer;
