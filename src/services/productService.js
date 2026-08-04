/**
 * productService.js — Product Repository & Query Layer
 * Beauty Store — src/services/productService.js
 *
 * A lightweight in-memory service that wraps the products catalogue
 * and exposes clean query methods used by page and component code.
 *
 * All methods are synchronous (in-memory), but use the same async-friendly
 * return shape { data, error } so they can be swapped for real API calls later.
 */

import products from '../data/products.data.js';
import { CATEGORIES, STOCK_STATUS, BADGES } from '../utils/productSchema.js';
import { applyDiscount } from '../utils/currency.js';

// Re-export constants so consumers only need one import
export { CATEGORIES, STOCK_STATUS, BADGES };

// ── Internal helpers ───────────────────────────────────────────────────────

/** Wrap a result in a consistent { data, error } envelope. */
const ok  = (data)  => ({ data, error: null });
const err = (msg)   => ({ data: null, error: msg });

/**
 * Compute the effective selling price for a product.
 * If a sale price exists, return it; otherwise return regular.
 */
export function effectivePrice(product) {
  return product.price.sale !== null
    ? product.price.sale
    : product.price.regular;
}

/**
 * Calculate the discount percentage of a product.
 * Returns 0 if no sale price is set.
 */
export function discountPercent(product) {
  if (!product.price.sale) return 0;
  return Math.round(
    ((product.price.regular - product.price.sale) / product.price.regular) * 100
  );
}

// ── Query methods ──────────────────────────────────────────────────────────

/**
 * Return all products.
 */
export function getAllProducts() {
  return ok([...products]);
}

/**
 * Find a single product by its id.
 *
 * @param {string} id
 */
export function getProductById(id) {
  const product = products.find(p => p.id === id);
  return product ? ok(product) : err(`Product not found: "${id}"`);
}

/**
 * Find a single product by its SKU.
 *
 * @param {string} sku
 */
export function getProductBySku(sku) {
  const product = products.find(p => p.sku === sku);
  return product ? ok(product) : err(`Product not found for SKU: "${sku}"`);
}

/**
 * Return products filtered by one or more criteria.
 *
 * @param {Object}   filters
 * @param {string}   [filters.category]       - Category slug
 * @param {string}   [filters.subcategory]    - Subcategory slug
 * @param {string}   [filters.brand]          - Brand name
 * @param {string[]} [filters.badges]         - Product must have ALL of these badges
 * @param {string}   [filters.stockStatus]    - STOCK_STATUS constant
 * @param {number}   [filters.minPrice]       - Minimum effective price (MAD)
 * @param {number}   [filters.maxPrice]       - Maximum effective price (MAD)
 * @param {number}   [filters.minRating]      - Minimum average rating
 * @param {string}   [filters.search]         - Text search on fr + ar name/description
 * @param {'fr'|'ar'} [filters.lang='fr']     - Language for text search
 *
 * @param {Object}   [sort]
 * @param {'price'|'rating'|'name'|'newest'} [sort.by='newest']
 * @param {'asc'|'desc'} [sort.dir='desc']
 *
 * @param {Object}   [pagination]
 * @param {number}   [pagination.page=1]
 * @param {number}   [pagination.perPage=12]
 *
 * @returns {{ data: { items: Product[], total: number, page: number, totalPages: number }, error: null }}
 */
export function queryProducts({
  filters     = {},
  sort        = { by: 'newest', dir: 'desc' },
  pagination  = { page: 1, perPage: 12 },
} = {}) {

  let results = [...products];

  // ── Apply filters ──────────────────────────────────────────────────────

  if (filters.category) {
    results = results.filter(p => p.category === filters.category);
  }

  if (filters.subcategory) {
    results = results.filter(p => p.subcategory === filters.subcategory);
  }

  if (filters.brand) {
    results = results.filter(p =>
      p.brand.toLowerCase() === filters.brand.toLowerCase()
    );
  }

  if (filters.badges?.length) {
    results = results.filter(p =>
      filters.badges.every(badge => p.badges.includes(badge))
    );
  }

  if (filters.stockStatus) {
    results = results.filter(p => p.stock.status === filters.stockStatus);
  }

  if (typeof filters.minPrice === 'number') {
    results = results.filter(p => effectivePrice(p) >= filters.minPrice);
  }

  if (typeof filters.maxPrice === 'number') {
    results = results.filter(p => effectivePrice(p) <= filters.maxPrice);
  }

  if (typeof filters.minRating === 'number') {
    results = results.filter(p => p.rating.average >= filters.minRating);
  }

  if (filters.search?.trim()) {
    const lang    = filters.lang ?? 'fr';
    const query   = filters.search.trim().toLowerCase();

    results = results.filter(p => {
      const name = (p.name[lang] ?? p.name.fr ?? '').toLowerCase();
      const desc = (p.description[lang] ?? p.description.fr ?? '').toLowerCase();
      const tags = p.tags.join(' ').toLowerCase();
      return name.includes(query) || desc.includes(query) || tags.includes(query);
    });
  }

  // ── Apply sort ─────────────────────────────────────────────────────────

  const sortDir = sort.dir === 'asc' ? 1 : -1;

  results.sort((a, b) => {
    switch (sort.by) {
      case 'price':
        return (effectivePrice(a) - effectivePrice(b)) * sortDir;

      case 'rating':
        return (a.rating.average - b.rating.average) * sortDir;

      case 'name': {
        const lang = filters.lang ?? 'fr';
        const na = (a.name[lang] ?? a.name.fr ?? '').toLowerCase();
        const nb = (b.name[lang] ?? b.name.fr ?? '').toLowerCase();
        return na.localeCompare(nb) * sortDir;
      }

      case 'newest':
      default:
        return (
          new Date(b.meta.createdAt) - new Date(a.meta.createdAt)
        ) * sortDir;
    }
  });

  // ── Paginate ───────────────────────────────────────────────────────────

  const { page = 1, perPage = 12 } = pagination;
  const total      = results.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage   = Math.min(Math.max(1, page), totalPages);
  const start      = (safePage - 1) * perPage;
  const items      = results.slice(start, start + perPage);

  return ok({ items, total, page: safePage, totalPages });
}

/**
 * Return products currently on sale (price.sale is not null).
 */
export function getSaleProducts(lang = 'fr') {
  return queryProducts({
    filters: { badges: [BADGES.SALE], lang },
    sort:    { by: 'rating', dir: 'desc' },
  });
}

/**
 * Return bestseller products.
 */
export function getBestsellers(limit = 8) {
  return queryProducts({
    filters:    { badges: [BADGES.BESTSELLER] },
    sort:       { by: 'rating', dir: 'desc' },
    pagination: { page: 1, perPage: limit },
  });
}

/**
 * Return new arrivals.
 */
export function getNewArrivals(limit = 8) {
  return queryProducts({
    filters:    { badges: [BADGES.NEW] },
    sort:       { by: 'newest', dir: 'desc' },
    pagination: { page: 1, perPage: limit },
  });
}

/**
 * Return products by category, sorted by rating descending.
 *
 * @param {string}    category  - CATEGORIES constant
 * @param {number}    [limit]
 * @param {'fr'|'ar'} [lang]
 */
export function getProductsByCategory(category, limit = 12, lang = 'fr') {
  return queryProducts({
    filters:    { category, lang },
    sort:       { by: 'rating', dir: 'desc' },
    pagination: { page: 1, perPage: limit },
  });
}

/**
 * Return products related to a given product
 * (same category, excluding itself, top-rated).
 *
 * @param {string} productId
 * @param {number} [limit=4]
 */
export function getRelatedProducts(productId, limit = 4) {
  const { data: product } = getProductById(productId);
  if (!product) return err(`Cannot find related products: "${productId}" not found`);

  const { data: result } = queryProducts({
    filters:    { category: product.category },
    sort:       { by: 'rating', dir: 'desc' },
    pagination: { page: 1, perPage: limit + 1 },
  });

  const items = result.items.filter(p => p.id !== productId).slice(0, limit);
  return ok({ items, total: items.length, page: 1, totalPages: 1 });
}

/**
 * Full-text search across name, description and tags.
 *
 * @param {string}    query
 * @param {'fr'|'ar'} [lang='fr']
 */
export function searchProducts(query, lang = 'fr') {
  return queryProducts({
    filters: { search: query, lang },
    sort:    { by: 'rating', dir: 'desc' },
  });
}

/**
 * Return a summary of the catalogue:
 * total product count, count per category, price range, in-stock count.
 */
export function getCatalogueSummary() {
  const byCategory = {};
  let minPrice = Infinity;
  let maxPrice = 0;
  let inStockCount = 0;

  for (const p of products) {
    byCategory[p.category] = (byCategory[p.category] ?? 0) + 1;
    const ep = effectivePrice(p);
    if (ep < minPrice) minPrice = ep;
    if (ep > maxPrice) maxPrice = ep;
    if (p.stock.status === STOCK_STATUS.IN_STOCK) inStockCount++;
  }

  return ok({
    total:       products.length,
    inStock:     inStockCount,
    byCategory,
    priceRange:  { min: minPrice, max: maxPrice, currency: 'MAD' },
  });
}

// ── Default export (object API for convenience) ────────────────────────────
const productService = {
  getAll:           getAllProducts,
  getById:          getProductById,
  getBySku:         getProductBySku,
  query:            queryProducts,
  getSale:          getSaleProducts,
  getBestsellers,
  getNewArrivals,
  getByCategory:    getProductsByCategory,
  getRelated:       getRelatedProducts,
  search:           searchProducts,
  getSummary:       getCatalogueSummary,
  effectivePrice,
  discountPercent,
};

export default productService;
