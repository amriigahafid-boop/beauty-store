/**
 * Product Schema & Factory — Beauty Store
 * src/utils/productSchema.js
 *
 * Defines the canonical shape of a product object and provides
 * a validated factory function so every product in the catalogue
 * is guaranteed to have every field the UI expects.
 *
 * ┌───────────────────────────────────────────────────────────┐
 * │  PRODUCT SHAPE                                             │
 * │                                                            │
 * │  id            string   Unique slug  e.g. "serum-rose-01" │
 * │  sku           string   Stock-keeping unit                 │
 * │  name          object   { fr, ar }  Localised names       │
 * │  tagline       object   { fr, ar }  Short marketing line  │
 * │  description   object   { fr, ar }  Long description      │
 * │  category      string   slug  e.g. "skincare"             │
 * │  subcategory   string   slug  e.g. "serums"               │
 * │  brand         string   Brand name                        │
 * │  images        object   { main, gallery[], alt }          │
 * │  price         object   { regular, sale?, currency }      │
 * │  stock         object   { qty, status }                   │
 * │  rating        object   { average, count }                │
 * │  tags          string[]                                    │
 * │  badges        string[]  e.g. ["new","bestseller"]        │
 * │  ingredients   string[]  Key active ingredients           │
 * │  variants      Variant[] Shade / size / volume options    │
 * │  meta          object   { createdAt, updatedAt }          │
 * └───────────────────────────────────────────────────────────┘
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
  BODY:     'body',
  TOOLS:    'tools',
});

// ── Variant factory ────────────────────────────────────────────────────────

/**
 * @typedef {Object} ProductVariant
 * @property {string}  id         - Unique variant id, e.g. "shade-01"
 * @property {string}  label      - Display label, e.g. "Rose Naturel"
 * @property {string}  [color]    - CSS hex/hsl for swatch rendering
 * @property {string}  [size]     - e.g. "30ml"
 * @property {number}  [price]    - Override price; falls back to product price
 * @property {boolean} [available]
 */

/**
 * @param {Partial<ProductVariant>} data
 * @returns {ProductVariant}
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

// ── Product factory ────────────────────────────────────────────────────────

/**
 * @typedef {Object} LocalisedString
 * @property {string} fr
 * @property {string} ar
 */

/**
 * @typedef {Object} Product
 * @property {string}          id
 * @property {string}          sku
 * @property {LocalisedString} name
 * @property {LocalisedString} tagline
 * @property {LocalisedString} description
 * @property {string}          category
 * @property {string}          subcategory
 * @property {string}          brand
 * @property {{ main: string, gallery: string[], alt: LocalisedString }} images
 * @property {{ regular: number, sale: number|null, currency: string }} price
 * @property {{ qty: number, status: string }} stock
 * @property {{ average: number, count: number }} rating
 * @property {string[]}        tags
 * @property {string[]}        badges
 * @property {string[]}        ingredients
 * @property {ProductVariant[]} variants
 * @property {{ createdAt: string, updatedAt: string }} meta
 */

/**
 * Validate and normalise a raw product object.
 * Throws if required fields are missing or malformed.
 *
 * @param {Partial<Product>} data
 * @returns {Product}
 */
export function createProduct(data = {}) {
  // ── Required field guards ──────────────────────────────────────────────
  if (!data.id)              throw new Error('[Product] "id" is required');
  if (!data.name?.fr)        throw new Error(`[Product:${data.id}] "name.fr" is required`);
  if (!data.name?.ar)        throw new Error(`[Product:${data.id}] "name.ar" is required`);
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

  return {
    // Identity
    id:          data.id,
    sku:         data.sku         ?? data.id.toUpperCase().replace(/-/g, '_'),

    // Localised content
    name:        { fr: data.name.fr,        ar: data.name.ar        },
    tagline:     { fr: data.tagline?.fr ?? '', ar: data.tagline?.ar ?? '' },
    description: { fr: data.description?.fr ?? '', ar: data.description?.ar ?? '' },

    // Taxonomy
    category:    data.category    ?? CATEGORIES.SKINCARE,
    subcategory: data.subcategory ?? '',
    brand:       data.brand       ?? 'Lumière',

    // Media
    images: {
      main:    data.images?.main    ?? '',
      gallery: data.images?.gallery ?? [],
      alt:     {
        fr: data.images?.alt?.fr ?? data.name.fr,
        ar: data.images?.alt?.ar ?? data.name.ar,
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
    ingredients: data.ingredients ?? [],

    // Variants (shades, sizes, volumes)
    variants: (data.variants ?? []).map(createVariant),

    // Audit
    meta: {
      createdAt: data.meta?.createdAt ?? now,
      updatedAt: data.meta?.updatedAt ?? now,
    },
  };
}
