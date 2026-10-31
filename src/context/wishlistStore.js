/**
 * wishlistStore.js — Reactive Wishlist State Manager (LocalStorage)
 * Lumière Beauty Store — src/context/wishlistStore.js
 *
 * Manages an array of liked product IDs in localStorage ('lumiere_wishlist')
 * and dispatches 'wishlistchange' events for automatic UI & Header badge updates.
 */

const STORAGE_KEY = 'lumiere_wishlist';
const LEGACY_KEY  = 'beauty-store:wishlist';

function _load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return [...new Set(parsed.filter(Boolean).map(String))];
    }
    return [];
  } catch {
    return [];
  }
}

let _ids = _load();

function _save() {
  try {
    const serialized = JSON.stringify(_ids);
    localStorage.setItem(STORAGE_KEY, serialized);
    localStorage.setItem(LEGACY_KEY, serialized);
  } catch {
    // Ignore storage quota errors in restricted environments
  }
}

function _notify(productId = null, liked = false) {
  document.dispatchEvent(new CustomEvent('wishlistchange', {
    detail: {
      ids: [..._ids],
      count: _ids.length,
      productId,
      liked,
    },
    bubbles: true,
  }));
}

const wishlistStore = {
  /** Return a defensive copy of all liked product IDs. */
  getIds() {
    _ids = _load();
    return [..._ids];
  },

  /** Check whether a product ID is currently liked. */
  has(productId) {
    if (!productId) return false;
    return _ids.includes(String(productId));
  },

  /** Return the total number of liked products. */
  count() {
    return _ids.length;
  },

  /**
   * Toggle a product ID in the wishlist.
   * @param {string} productId
   * @returns {boolean} true if now liked, false if removed
   */
  toggle(productId) {
    if (!productId) return false;
    const id = String(productId);
    const index = _ids.indexOf(id);
    let liked = false;

    if (index > -1) {
      _ids.splice(index, 1);
      liked = false;
    } else {
      _ids.push(id);
      liked = true;
    }

    _save();
    _notify(id, liked);
    return liked;
  },
};

export default wishlistStore;
