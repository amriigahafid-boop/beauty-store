/**
 * CartDrawer.js — Slide-in Cart Drawer Component
 * Beauty Store — src/components/cart/CartDrawer.js
 */

import cartStore from '../../context/cartStore.js';
import i18n      from '../../context/i18n.js';
import { formatPrice } from '../../utils/currency.js';

// ── Icons ──────────────────────────────────────────────────────────────────
const Icons = {
  close:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  trash:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>`,
  arrow:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  lock:   `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  truck:  `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
};

class CartDrawer {
  constructor() {
    this._el       = null;
    this._overlay  = null;
    this._isOpen   = false;

    // Bind handlers once
    this._onCartChange = () => this._refresh();
    this._onLangChange = () => this._refresh();
  }

  // ── Mount ─────────────────────────────────────────────────────────────────
  mount(container) {
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
    // Focus trap: focus first focusable element
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
    const lang    = i18n.lang;
    const summary = cartStore.summary();
    const { items, count, subtotal, shipping, total, freeShipping, remaining } = summary;

    this._el.innerHTML = `
      <!-- Header -->
      <div class="cart-drawer__header">
        <div class="cart-drawer__title">
          <span class="cart-drawer__title-icon">🛒</span>
          <span data-i18n="cart.title">${i18n.t('cart.title')}</span>
          <span class="cart-drawer__count">${count}</span>
        </div>
        <button class="cart-drawer__close" id="cart-close-btn" aria-label="${i18n.t('ui.close')}">
          ${Icons.close}
        </button>
      </div>

      <!-- Free shipping bar -->
      ${items.length > 0 ? `
        <div class="cart-shipping-bar">
          <div class="cart-shipping-bar__text">
            ${freeShipping
              ? `<span>🎉 <strong>${i18n.t('cart.freeShipping')}</strong></span><span>✓</span>`
              : `<span>${lang === 'ar' ? 'أضيفي' : 'Ajoutez'} <strong>${formatPrice(remaining, lang)}</strong> ${lang === 'ar' ? 'للشحن المجاني' : 'pour la livraison offerte'}</span>
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
            <span>${i18n.t('cart.checkout')}</span>
            ${Icons.arrow}
          </a>

          <button class="cart-continue-btn" id="cart-continue-btn">
            ← ${i18n.t('cart.continueShopping')}
          </button>

          <div class="cart-security">
            <span>${Icons.lock} ${lang === 'ar' ? 'دفع آمن' : 'Paiement sécurisé'}</span>
            <span>${Icons.truck} ${lang === 'ar' ? 'تتبع الطلب' : 'Suivi de commande'}</span>
          </div>
        </div>
      ` : ''}
    `;

    this._bindInternalEvents();
  }

  _renderEmpty() {
    const lang = i18n.lang;
    return `
      <div class="cart-empty">
        <div class="cart-empty__icon">🛍️</div>
        <div class="cart-empty__title" data-i18n="cart.empty">${i18n.t('cart.empty')}</div>
        <div class="cart-empty__hint" data-i18n="cart.emptyHint">${i18n.t('cart.emptyHint')}</div>
        <button class="cart-empty__cta" id="cart-continue-empty">
          ${lang === 'ar' ? 'تصفحي المنتجات ✨' : 'Découvrir nos produits ✨'}
        </button>
      </div>
    `;
  }

  _renderItem(item, lang) {
    const name = item.name?.[lang] ?? item.name?.fr ?? '';
    return `
      <div class="cart-item" data-key="${item.key}">
        <div class="cart-item__image">${item.emoji}</div>
        <div class="cart-item__details">
          <div class="cart-item__brand">${item.brand}</div>
          <div class="cart-item__name" title="${name}">${name}</div>
          ${item.variantLabel ? `<div class="cart-item__variant">${item.variantLabel}</div>` : ''}
          <div class="cart-item__bottom">
            <div class="qty-stepper" data-key="${item.key}">
              <button class="qty-stepper__btn" data-action="dec" ${item.qty <= 1 ? 'title="Remove"' : ''}>
                ${item.qty <= 1 ? Icons.trash : '−'}
              </button>
              <span class="qty-stepper__value">${item.qty}</span>
              <button class="qty-stepper__btn" data-action="inc">+</button>
            </div>
            <div class="cart-item__price">${formatPrice(item.price * item.qty, lang)}</div>
            <button class="cart-item__remove" data-key="${item.key}" title="${i18n.t('cart.remove')}">
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
export function showToast(message, { type = 'info', icon = '✨', duration = 3000 } = {}) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `<span class="toast__icon">${icon}</span><span class="toast__text">${message}</span>`;
  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, duration);
}

export default CartDrawer;
