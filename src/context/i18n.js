/**
 * i18n.js — Internationalization Engine
 * Beauty Store
 *
 * Features:
 *  - French (fr) as default language
 *  - Arabic (ar) with automatic RTL switching
 *  - Dot-notation key lookup with fallback
 *  - Variable interpolation via {{key}} syntax
 *  - Persists language preference to localStorage
 *  - Dispatches a custom 'langchange' event for reactive components
 *  - Automatically updates <html dir>, <html lang>, and re-renders all [data-i18n] nodes
 */

import fr from './locales/fr.js';
import ar from './locales/ar.js';

// ── Supported locales registry ─────────────────────────────────────────────
const LOCALES = { fr, ar };
const DEFAULT_LANG   = 'fr';
const STORAGE_KEY    = 'beauty-store:lang';
const I18N_ATTR      = 'data-i18n';       // for text content
const I18N_ATTR_ATTR = 'data-i18n-attr';  // for element attributes e.g. placeholder
const I18N_ATTR_HTML = 'data-i18n-html';  // for innerHTML

// ── Internal state ─────────────────────────────────────────────────────────
let _currentLang   = DEFAULT_LANG;
let _translations  = LOCALES[DEFAULT_LANG];

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Resolve a dot-notation key against the current translations.
 * Falls back to the key string itself so the UI never shows undefined.
 *
 * @param {string} key  - e.g. "nav.home", "hero.heading"
 * @param {Record<string, string>} [vars] - interpolation variables
 * @returns {string}
 */
function resolve(key, vars = {}) {
  const segments = key.split('.');
  let value = _translations;

  for (const seg of segments) {
    if (value == null || typeof value !== 'object') {
      console.warn(`[i18n] Missing key: "${key}" (lang: ${_currentLang})`);
      return key; // graceful fallback
    }
    value = value[seg];
  }

  if (typeof value !== 'string') {
    console.warn(`[i18n] Key "${key}" is not a string (lang: ${_currentLang})`);
    return key;
  }

  // Interpolate {{variable}} tokens
  return value.replace(/\{\{(\w+)\}\}/g, (_, token) =>
    Object.prototype.hasOwnProperty.call(vars, token) ? String(vars[token]) : `{{${token}}}`
  );
}

// ── DOM updater ────────────────────────────────────────────────────────────

/**
 * Walk the DOM and update every element that carries an i18n data attribute.
 */
function applyTranslations() {
  // 1. Text content  →  <span data-i18n="nav.home"></span>
  document.querySelectorAll(`[${I18N_ATTR}]`).forEach(el => {
    const key = el.getAttribute(I18N_ATTR);
    el.textContent = resolve(key);
  });

  // 2. InnerHTML  →  <p data-i18n-html="hero.subheading"></p>
  document.querySelectorAll(`[${I18N_ATTR_HTML}]`).forEach(el => {
    const key = el.getAttribute(I18N_ATTR_HTML);
    el.innerHTML = resolve(key).replace(/\n/g, '<br>');
  });

  // 3. Element attributes  →  <input data-i18n-attr='{"placeholder":"footer.newsletterPlaceholder"}'>
  document.querySelectorAll(`[${I18N_ATTR_ATTR}]`).forEach(el => {
    try {
      const map = JSON.parse(el.getAttribute(I18N_ATTR_ATTR));
      for (const [attr, key] of Object.entries(map)) {
        el.setAttribute(attr, resolve(key));
      }
    } catch (e) {
      console.warn('[i18n] Invalid data-i18n-attr JSON on', el, e);
    }
  });
}

// ── Direction & <html> attributes ─────────────────────────────────────────

function applyDirection(locale) {
  const htmlEl = document.documentElement;
  const dir    = locale.dir || 'ltr';

  htmlEl.setAttribute('dir',  dir);
  htmlEl.setAttribute('lang', locale.lang);

  // Body also carries dir so CSS selectors like [dir="rtl"] body work
  if (document.body) {
    document.body.setAttribute('dir', dir);
  }
}

// ── Public API ─────────────────────────────────────────────────────────────

const i18n = {
  /**
   * Initialise i18n. Call once after DOMContentLoaded.
   * Reads persisted preference from localStorage, falls back to DEFAULT_LANG.
   */
  init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const lang  = (saved && LOCALES[saved]) ? saved : DEFAULT_LANG;
    this.setLang(lang, { persist: false }); // already persisted or default
  },

  /**
   * Switch the active language.
   *
   * @param {'fr'|'ar'} lang
   * @param {{ persist?: boolean }} [options]
   */
  setLang(lang, { persist = true } = {}) {
    if (!LOCALES[lang]) {
      console.error(`[i18n] Unknown language: "${lang}". Available: ${Object.keys(LOCALES).join(', ')}`);
      return;
    }

    _currentLang  = lang;
    _translations = LOCALES[lang];

    // Update DOM
    applyDirection(_translations);
    applyTranslations();

    // Persist
    if (persist) {
      localStorage.setItem(STORAGE_KEY, lang);
    }

    // Notify the rest of the app
    document.dispatchEvent(new CustomEvent('langchange', {
      detail: { lang, dir: _translations.dir, locale: _translations },
      bubbles: true,
    }));
  },

  /**
   * Toggle between French and Arabic.
   */
  toggle() {
    this.setLang(_currentLang === 'fr' ? 'ar' : 'fr');
  },

  /**
   * Translate a key.
   *
   * @param {string} key
   * @param {Record<string, string>} [vars]
   * @returns {string}
   */
  t(key, vars) {
    return resolve(key, vars);
  },

  /** Currently active language code */
  get lang()   { return _currentLang; },

  /** Current text direction */
  get dir()    { return _translations.dir; },

  /** Current locale object */
  get locale() { return _translations; },

  /** All supported language codes */
  get langs()  { return Object.keys(LOCALES); },
};

export default i18n;
