/**
 * Product Schema & Factory — Beauty Store
 * src/utils/productSchema.js
 *
 * Defines the canonical shape of a product object and provides
 * a validated factory function so every product in the catalogue
 * is guaranteed to have every field the UI expects, including
 * full bilingual support (`fr` / `ar`) for `title`/`name`,
 * `snippet`/`tagline`, `description`, and `ingredients`.
 */

import { CURRENCY_CODE } from './currency.js';

// ── Stock status constants ─────────────────────────────────────────────────
export const STOCK_STATUS = Object.freeze({
  IN_STOCK:     'in_stock',
  LOW_STOCK:    'low_stock',    // qty ≤ 5
  OUT_OF_STOCK: 'out_of_stock',
  PRE_ORDER:    'pre_order',
});

// ── Badge constants ────────────────────────────────────────────────────────
export const BADGES = Object.freeze({
  NEW:         'new',
  BESTSELLER:  'bestseller',
  SALE:        'sale',
  LIMITED:     'limited',
  VEGAN:       'vegan',
  NATURAL:     'natural',
  EXCLUSIVE:   'exclusive',
});

// ── Category slugs ─────────────────────────────────────────────────────────
export const CATEGORIES = Object.freeze({
  SKINCARE: 'skincare',
  MAKEUP:   'makeup',
  PERFUMES: 'perfumes',
  HAIRCARE: 'haircare',
  HAIR:     'hair',
  BODY:     'body',
  TOOLS:    'tools',
});

// ── Variant factory ────────────────────────────────────────────────────────

/**
 * @param {Partial<Object>} data
 * @returns {Object}
 */
export function createVariant(data = {}) {
  return {
    id:        data.id        ?? `variant-${Date.now()}`,
    label:     data.label     ?? '',
    color:     data.color     ?? null,
    size:      data.size      ?? null,
    price:     data.price     ?? null,   // null = inherits product price
    available: data.available ?? true,
  };
}

/**
 * Normalise ingredients so it works both as an Array (`product.ingredients.map(...)`)
 * and as a localized lookup (`product.ingredients[lang]`).
 */
function normaliseIngredients(raw) {
  let frList = [];
  let arList = [];

  if (Array.isArray(raw)) {
    frList = [...raw];
    arList = [...raw];
  } else if (raw && typeof raw === 'object') {
    frList = Array.isArray(raw.fr) ? [...raw.fr] : [];
    arList = Array.isArray(raw.ar) ? [...raw.ar] : [...frList];
  }

  const hybrid = [...frList];
  Object.defineProperty(hybrid, 'fr', { value: frList, enumerable: false });
  Object.defineProperty(hybrid, 'ar', { value: arList, enumerable: false });
  return hybrid;
}

// ── Product factory ────────────────────────────────────────────────────────

/**
 * Validate and normalise a raw product object.
 * Guarantees both `title[lang]`/`name[lang]`, `snippet[lang]`/`tagline[lang]`,
 * and `description[lang]` are present for `'fr'` and `'ar'`.
 *
 * @param {Partial<Object>} data
 * @returns {Object}
 */
export function createProduct(data = {}) {
  const frName = data.title?.fr ?? data.name?.fr;
  const arName = data.title?.ar ?? data.name?.ar;

  // ── Required field guards ──────────────────────────────────────────────
  if (!data.id)       throw new Error('[Product] "id" is required');
  if (!frName)        throw new Error(`[Product:${data.id}] "name.fr" / "title.fr" is required`);
  if (!arName)        throw new Error(`[Product:${data.id}] "name.ar" / "title.ar" is required`);
  if (typeof data.price?.regular !== 'number')
    throw new Error(`[Product:${data.id}] "price.regular" must be a number`);

  // ── Derive stock status from qty if not explicitly provided ───────────
  const qty = data.stock?.qty ?? 0;
  let stockStatus = data.stock?.status;
  if (!stockStatus) {
    if (qty === 0)      stockStatus = STOCK_STATUS.OUT_OF_STOCK;
    else if (qty <= 5)  stockStatus = STOCK_STATUS.LOW_STOCK;
    else                stockStatus = STOCK_STATUS.IN_STOCK;
  }

  const now = new Date().toISOString();

  const titleObj = {
    fr: frName,
    ar: arName,
  };

  const snippetObj = {
    fr: data.snippet?.fr ?? data.tagline?.fr ?? '',
    ar: data.snippet?.ar ?? data.tagline?.ar ?? '',
  };

  const descriptionObj = {
    fr: data.description?.fr ?? '',
    ar: data.description?.ar ?? '',
  };

  const ingredients = normaliseIngredients(data.ingredients);

  return {
    // Identity
    id:          data.id,
    sku:         data.sku         ?? data.id.toUpperCase().replace(/-/g, '_'),

    // Localised content (supports both title/snippet and name/tagline)
    title:       titleObj,
    name:        titleObj,
    snippet:     snippetObj,
    tagline:     snippetObj,
    description: descriptionObj,

    // Taxonomy
    category:    data.category    ?? CATEGORIES.SKINCARE,
    subcategory: data.subcategory ?? '',
    brand:       data.brand       ?? 'Lumière',

    // Media
    images: {
      main:    data.images?.main    ?? '',
      gallery: data.images?.gallery ?? [],
      emoji:   data.images?.emoji   ?? '🧴',
      alt:     {
        fr: data.images?.alt?.fr ?? frName,
        ar: data.images?.alt?.ar ?? arName,
      },
    },

    // Pricing (MAD only)
    price: {
      regular:  data.price.regular,
      sale:     data.price.sale     ?? null,   // null = no active promotion
      currency: CURRENCY_CODE,                  // Always 'MAD'
    },

    // Inventory
    stock: {
      qty:    qty,
      status: stockStatus,
    },

    // Social proof
    rating: {
      average: data.rating?.average ?? 0,
      count:   data.rating?.count   ?? 0,
    },

    // Discovery
    tags:        data.tags        ?? [],
    badges:      data.badges      ?? [],
    ingredients,

    // Variants (shades, sizes, volumes)
    variants: (data.variants ?? []).map(createVariant),

    // Audit
    meta: {
      createdAt: data.meta?.createdAt ?? now,
      updatedAt: data.meta?.updatedAt ?? now,
    },
  };
}
