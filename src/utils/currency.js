/**
 * currency.js — MAD (Moroccan Dirham) Formatter
 * Beauty Store
 *
 * The store operates exclusively in Moroccan Dirhams (MAD / DH).
 * This module provides consistent formatting, parsing and comparison
 * utilities for all price values across the application.
 *
 * Design decisions:
 *  - All prices are stored internally as plain Numbers (centimes-free MAD).
 *  - Formatting adapts to the active locale (French: "1 250,00 DH" / Arabic: "١٬٢٥٠٫٠٠ د.م").
 *  - No floating-point rounding surprises: we use toFixed(2) before display.
 */

// ── Constants ──────────────────────────────────────────────────────────────
export const CURRENCY_CODE   = 'MAD';
export const CURRENCY_SYMBOL = 'DH';          // Arabic: "د.م" shown separately
export const CURRENCY_SYMBOL_AR = 'د.م';

/**
 * Intl.NumberFormat instances cached per locale to avoid re-creating them
 * on every render tick.
 */
const _formatters = {
  fr: new Intl.NumberFormat('fr-MA', {
    style:                 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
  ar: new Intl.NumberFormat('ar-MA', {
    style:                 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    numberingSystem:       'latn',   // Keep Western digits for readability
  }),
};

// ── Formatting ─────────────────────────────────────────────────────────────

/**
 * Format a numeric price value as a MAD string.
 *
 * @param {number} amount          - e.g. 249.00
 * @param {'fr'|'ar'} [lang='fr']  - Active locale (affects separators & symbol)
 * @param {{ showCode?: boolean }}  - If true, appends "MAD" instead of "DH"
 * @returns {string}               - e.g. "249,00 DH" / "249.00 د.م"
 *
 * @example
 * formatPrice(1250, 'fr')  // → "1 250,00 DH"
 * formatPrice(1250, 'ar')  // → "1,250.00 د.م"
 */
export function formatPrice(amount, lang = 'fr', { showCode = false } = {}) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    console.warn('[currency] formatPrice received non-numeric value:', amount);
    return '—';
  }

  const formatter = _formatters[lang] ?? _formatters.fr;
  const formatted = formatter.format(amount);
  const symbol    = showCode
    ? CURRENCY_CODE
    : (lang === 'ar' ? CURRENCY_SYMBOL_AR : CURRENCY_SYMBOL);

  // French convention: amount then symbol, space-separated
  // Arabic convention: amount then symbol (both LTR inside RTL context)
  return lang === 'ar'
    ? `${formatted} ${symbol}`
    : `${formatted} ${symbol}`;
}

/**
 * Format a price range (e.g. for product variants).
 *
 * @param {number} min
 * @param {number} max
 * @param {'fr'|'ar'} [lang='fr']
 * @returns {string}  e.g. "89,00 – 249,00 DH"
 */
export function formatPriceRange(min, max, lang = 'fr') {
  if (min === max) return formatPrice(min, lang);
  const formatter = _formatters[lang] ?? _formatters.fr;
  const symbol    = lang === 'ar' ? CURRENCY_SYMBOL_AR : CURRENCY_SYMBOL;
  return `${formatter.format(min)} – ${formatter.format(max)} ${symbol}`;
}

/**
 * Calculate the discounted price.
 *
 * @param {number} originalPrice
 * @param {number} discountPercent  - 0–100
 * @returns {number}
 */
export function applyDiscount(originalPrice, discountPercent) {
  if (discountPercent <= 0 || discountPercent >= 100) return originalPrice;
  return Math.round(originalPrice * (1 - discountPercent / 100) * 100) / 100;
}

/**
 * Parse a MAD-formatted string back to a number.
 * Handles both "1 250,00 DH" and "1,250.00 د.م" styles.
 *
 * @param {string} str
 * @returns {number}
 */
export function parsePrice(str) {
  // Strip currency symbols and whitespace
  const cleaned = str
    .replace(/DH|MAD|د\.م\.?/gu, '')
    .replace(/\s/g, '')
    .replace(/,/g, '.')           // normalise decimal comma
    .replace(/\.(?=\d{3})/g, ''); // remove thousands dots
  const value = parseFloat(cleaned);
  return isNaN(value) ? 0 : value;
}

// ── Default export as a convenience object ─────────────────────────────────
const currency = {
  code:            CURRENCY_CODE,
  symbol:          CURRENCY_SYMBOL,
  symbolAr:        CURRENCY_SYMBOL_AR,
  format:          formatPrice,
  formatRange:     formatPriceRange,
  applyDiscount,
  parse:           parsePrice,
};

export default currency;
