/**
 * i18n.js — Internationalization Engine (Single Source of Truth)
 * Lumière Beauty Store — src/context/i18n.js
 *
 * Features:
 *  - Single source of truth for active language ('fr' | 'ar')
 *  - Persists to localStorage ('beauty-store:lang' and 'lang')
 *  - Immediately updates document.documentElement.lang & document.documentElement.dir ('ltr' | 'rtl')
 *  - Dot-notation key lookup + {{variable}} interpolation
 *  - Dispatches 'langchange' CustomEvent and re-applies [data-i18n] attributes
 */

import fr from './locales/fr.js';
import ar from './locales/ar.js';

// ── Supported locales registry ─────────────────────────────────────────────
const LOCALES        = { fr, ar };
const DEFAULT_LANG   = 'fr';
const STORAGE_KEY    = 'beauty-store:lang';
const LEGACY_KEY     = 'lang';
const I18N_ATTR      = 'data-i18n';
const I18N_ATTR_ATTR = 'data-i18n-attr';
const I18N_ATTR_HTML = 'data-i18n-html';

// ── Storage helpers ────────────────────────────────────────────────────────
function readPersistedLang() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY) || '';
    const norm = raw.trim().toLowerCase();
    if (norm && LOCALES[norm]) return norm;
  } catch {
    // Ignore storage read errors in restricted environments
  }
  return DEFAULT_LANG;
}

function writePersistedLang(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
    localStorage.setItem(LEGACY_KEY, lang);
  } catch {
    // Ignore storage write errors
  }
}

// ── Internal state (hydrated immediately on module load) ───────────────────
let _currentLang  = readPersistedLang();
let _translations = LOCALES[_currentLang];
const _subscribers = new Set();

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Resolve a dot-notation key against the current translations.
 * Falls back to French if missing in active locale, then to key string.
 *
 * @param {string} key  - e.g. "nav.home", "hero.slide1.titleMain"
 * @param {Record<string, string|number>} [vars] - interpolation variables
 * @returns {any}
 */
function resolve(key, vars = {}) {
  if (!key) return '';
  const segments = String(key).split('.');

  let value = _translations;
  for (const seg of segments) {
    if (value == null || typeof value !== 'object') {
      value = undefined;
      break;
    }
    value = value[seg];
  }

  // Fallback to default locale if missing
  if (value === undefined && _currentLang !== DEFAULT_LANG) {
    value = LOCALES[DEFAULT_LANG];
    for (const seg of segments) {
      if (value == null || typeof value !== 'object') {
        value = undefined;
        break;
      }
      value = value[seg];
    }
  }

  if (value === undefined || value === null) {
    return key;
  }

  // Allow resolving structured arrays/objects from locale when needed
  if (typeof value !== 'string') {
    return value;
  }

  // Interpolate {{variable}} tokens
  return value.replace(/\{\{(\w+)\}\}/g, (_, token) =>
    Object.prototype.hasOwnProperty.call(vars, token) ? String(vars[token]) : `{{${token}}}`
  );
}

// ── Direction & <html> attributes ─────────────────────────────────────────

function applyDirection(locale) {
  if (typeof document === 'undefined') return;

  const htmlEl = document.documentElement;
  const lang   = locale.lang || DEFAULT_LANG;
  const dir    = locale.dir  || (lang === 'ar' ? 'rtl' : 'ltr');

  htmlEl.lang = lang;
  htmlEl.dir  = dir;
  htmlEl.setAttribute('lang', lang);
  htmlEl.setAttribute('dir',  dir);
  htmlEl.setAttribute('data-lang', lang);

  if (document.body) {
    document.body.dir = dir;
    document.body.setAttribute('dir', dir);
    document.body.setAttribute('data-lang', lang);
  }
}

// ── DOM updater ────────────────────────────────────────────────────────────

/**
 * Walk the DOM and update every element that carries an i18n data attribute.
 */
function applyTranslations(root = document) {
  if (typeof document === 'undefined' || !root) return;

  // 1. Text content  →  <span data-i18n="nav.home"></span>
  root.querySelectorAll(`[${I18N_ATTR}]`).forEach(el => {
    const key = el.getAttribute(I18N_ATTR);
    const val = resolve(key);
    if (typeof val === 'string') {
      el.textContent = val;
    }
  });

  // 2. InnerHTML  →  <p data-i18n-html="hero.subheading"></p>
  root.querySelectorAll(`[${I18N_ATTR_HTML}]`).forEach(el => {
    const key = el.getAttribute(I18N_ATTR_HTML);
    const val = resolve(key);
    if (typeof val === 'string') {
      el.innerHTML = val.replace(/\n/g, '<br>');
    }
  });

  // 3. Element attributes  →  <input data-i18n-attr='{"placeholder":"footer.newsletterPlaceholder"}'>
  root.querySelectorAll(`[${I18N_ATTR_ATTR}]`).forEach(el => {
    try {
      const map = JSON.parse(el.getAttribute(I18N_ATTR_ATTR));
      for (const [attr, key] of Object.entries(map)) {
        const val = resolve(key);
        if (typeof val === 'string') {
          el.setAttribute(attr, val);
        }
      }
    } catch (e) {
      console.warn('[i18n] Invalid data-i18n-attr JSON on', el, e);
    }
  });
}

// Apply direction immediately on script evaluation to prevent LTR/RTL flash
applyDirection(_translations);

// Sync across browser tabs if localStorage changes
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if ((e.key === STORAGE_KEY || e.key === LEGACY_KEY) && e.newValue && LOCALES[e.newValue]) {
      if (e.newValue !== _currentLang) {
        i18n.setLang(e.newValue, { persist: false });
      }
    }
  });
}

// ── Public API ─────────────────────────────────────────────────────────────

const i18n = {
  /**
   * Initialise i18n. Reads persisted preference from localStorage,
   * persists it as the single source of truth, and applies direction & translations.
   */
  init() {
    const lang = readPersistedLang();
    this.setLang(lang, { persist: true });
    return this;
  },

  /**
   * Switch the active language immediately without page reload.
   *
   * @param {'fr'|'ar'} lang
   * @param {{ persist?: boolean }} [options]
   */
  setLang(lang, { persist = true } = {}) {
    const norm = String(lang || '').trim().toLowerCase();
    if (!LOCALES[norm]) {
      console.error(`[i18n] Unknown language: "${lang}". Available: ${Object.keys(LOCALES).join(', ')}`);
      return;
    }

    _currentLang  = norm;
    _translations = LOCALES[norm];

    // 1. Persist immediately so any listener reading localStorage sees the updated value
    if (persist) {
      writePersistedLang(norm);
    }

    // 2. Update <html lang> and <html dir> ('rtl' for ar, 'ltr' for fr)
    applyDirection(_translations);

    // 3. Update static [data-i18n] nodes in DOM
    applyTranslations();

    // 4. Notify subscribed callbacks
    const payload = { lang: norm, dir: _translations.dir, locale: _translations };
    _subscribers.forEach(fn => {
      try { fn(payload); } catch (err) { console.error('[i18n] Subscriber error:', err); }
    });

    // 5. Dispatch 'langchange' event for all reactive components
    if (typeof document !== 'undefined') {
      document.dispatchEvent(new CustomEvent('langchange', {
        detail: payload,
        bubbles: true,
      }));
    }

    // 6. Re-apply [data-i18n] translations on any newly rendered component DOM
    applyTranslations();
  },

  /**
   * Toggle between French ('fr') and Arabic ('ar').
   */
  toggle() {
    this.setLang(_currentLang === 'fr' ? 'ar' : 'fr');
  },

  /**
   * Subscribe a callback to language changes. Returns an unsubscribe function.
   * @param {(detail: { lang: string, dir: string, locale: object }) => void} fn
   */
  subscribe(fn) {
    if (typeof fn === 'function') _subscribers.add(fn);
    return () => _subscribers.delete(fn);
  },

  /**
   * Translate a key (or retrieve a localized array/object).
   *
   * @param {string} key
   * @param {Record<string, string|number>} [vars]
   * @returns {any}
   */
  t(key, vars) {
    return resolve(key, vars);
  },

  /** Manually re-apply [data-i18n] translations on the DOM */
  applyTranslations,

  /** Currently active language code ('fr' | 'ar') */
  get lang()   { return _currentLang; },

  /** Current text direction ('ltr' | 'rtl') */
  get dir()    { return _translations.dir; },

  /** Current locale dictionary object */
  get locale() { return _translations; },

  /** All supported language codes */
  get langs()  { return Object.keys(LOCALES); },
};

export default i18n;
