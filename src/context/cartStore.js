/**
 * cartStore.js — Reactive Cart State Manager
 * Beauty Store — src/context/cartStore.js
 *
 * Features:
 *  - Add / remove / update quantity
 *  - Persists to localStorage
 *  - Dispatches 'cartchange' custom event
 *  - Free shipping threshold (500 MAD)
 *  - Derives totals from items
 */

import { effectivePrice } from '../services/productService.js';

const STORAGE_KEY          = 'beauty-store:cart';
const FREE_SHIPPING_THRESH = 500;   // MAD
const SHIPPING_COST        = 39;    // MAD

// ── Internal state ─────────────────────────────────────────────────────────
let _items = _load();

// ── Persistence ────────────────────────────────────────────────────────────
function _load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function _save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(_items));
}

// ── Event dispatch ─────────────────────────────────────────────────────────
function _notify() {
  document.dispatchEvent(new CustomEvent('cartchange', {
    detail: cartStore.summary(),
    bubbles: true,
  }));
}

// ── Public API ─────────────────────────────────────────────────────────────
const cartStore = {

  /** Return a snapshot of the current items array (defensive copy). */
  items() {
    return [..._items];
  },

  /**
   * Add a product to the cart, or increment its quantity.
   *
   * @param {Object} product     - Full product object from the catalogue
   * @param {number} [qty=1]
   * @param {Object|null} [variant] - Selected variant (or null)
   */
  add(product, qty = 1, variant = null) {
    const key = _itemKey(product.id, variant?.id ?? null);
    const existing = _items.find(i => i.key === key);

    if (existing) {
      existing.qty = Math.min(existing.qty + qty, 99);
    } else {
      _items.push({
        key,
        productId:   product.id,
        variantId:   variant?.id   ?? null,
        name:        product.name,          // { fr, ar }
        brand:       product.brand,
        emoji:       product.images?.emoji ?? '🧴',
        price:       effectivePrice(product),
        regularPrice:product.price.regular,
        variantLabel:variant?.label ?? null,
        qty,
      });
    }

    _save();
    _notify();
  },

  /**
   * Remove an item by its composite key.
   * @param {string} key
   */
  remove(key) {
    _items = _items.filter(i => i.key !== key);
    _save();
    _notify();
  },

  /**
   * Update the quantity of an item.
   * Removes the item if qty drops to 0.
   *
   * @param {string} key
   * @param {number} qty
   */
  setQty(key, qty) {
    if (qty <= 0) { this.remove(key); return; }
    const item = _items.find(i => i.key === key);
    if (item) {
      item.qty = Math.min(qty, 99);
      _save();
      _notify();
    }
  },

  /** Remove all items. */
  clear() {
    _items = [];
    _save();
    _notify();
  },

  /**
   * Derive all totals from the current items.
   * @returns {{ items, count, subtotal, shipping, total, freeShipping, remaining }}
   */
  summary() {
    const items    = this.items();
    const count    = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const freeShipping = subtotal >= FREE_SHIPPING_THRESH;
    const shipping = freeShipping ? 0 : SHIPPING_COST;
    const total    = subtotal + shipping;
    const remaining = Math.max(0, FREE_SHIPPING_THRESH - subtotal);

    return { items, count, subtotal, shipping, total, freeShipping, remaining };
  },

  /** Constants */
  FREE_SHIPPING_THRESH,
  SHIPPING_COST,
};

// ── Helpers ────────────────────────────────────────────────────────────────
function _itemKey(productId, variantId) {
  return variantId ? `${productId}::${variantId}` : productId;
}

export default cartStore;
