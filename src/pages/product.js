/**
 * product.js — Luxury Product Detail Page (PDP) Controller
 * Lumière Beauty Store — src/pages/product.js
 *
 * Renders a complete, modern luxury product page for any catalog product
 * (`product.html?id=<product-id>`), defaulting to our flagship example
 * product (`the-ceel-rosemary-hair-mask`) when opened without parameters.
 */

import i18n               from '../context/i18n.js';
import cartStore          from '../context/cartStore.js';
import products           from '../data/products.data.js';
import Header             from '../components/layout/Header.js';
import CartDrawer, { showToast } from '../components/cart/CartDrawer.js';
import { formatPrice }    from '../utils/currency.js';
import { effectivePrice } from '../services/productService.js';

const DEFAULT_EXAMPLE_ID = 'the-ceel-rosemary-hair-mask';

// ── 1. Initialize i18n & Cart Drawer ─────────────────────────────────────────
i18n.init();

const cartDrawer = new CartDrawer();
cartDrawer.mount(document.body);

const headerRoot = document.getElementById('header-root');
if (headerRoot) {
  const header = new Header({ cartCount: cartStore.summary().count });
  headerRoot.replaceWith(header.render());

  document.addEventListener('click', e => {
    if (e.target.closest('#btn-cart')) {
      e.preventDefault();
      cartDrawer.toggle();
    }
  });
}

// Sync cart badge on change
document.addEventListener('cartchange', ({ detail }) => {
  const badge = document.querySelector('#btn-cart .header__badge');
  if (badge) {
    badge.textContent   = detail.count;
    badge.style.display = detail.count > 0 ? 'flex' : 'none';
  } else if (detail.count > 0) {
    const btn = document.getElementById('btn-cart');
    if (btn && !btn.querySelector('.header__badge')) {
      const b = document.createElement('span');
      b.className   = 'header__badge';
      b.textContent = detail.count;
      btn.appendChild(b);
    }
  }
});

// ── 2. Resolve Active Product ────────────────────────────────────────────────
function getActiveProduct() {
  const params = new URLSearchParams(window.location.search);
  const id     = params.get('id') || DEFAULT_EXAMPLE_ID;
  return products.find(p => p.id === id) || products[0];
}

let currentQty = 1;

// ── 3. Render Product Detail Page ────────────────────────────────────────────
function renderProductPage() {
  const root = document.getElementById('product-page-root');
  if (!root) return;

  const product  = getActiveProduct();
  const lang     = i18n.lang;
  const isAr     = lang === 'ar';
  const name     = product.title?.[lang] ?? product.name?.[lang] ?? product.title?.fr ?? product.name?.fr ?? '';
  const tagline  = product.snippet?.[lang] ?? product.tagline?.[lang] ?? product.snippet?.fr ?? product.tagline?.fr ?? '';
  const desc     = product.description?.[lang] ?? product.description?.fr ?? '';
  const price    = effectivePrice(product);
  const priceStr = formatPrice(price, lang);
  const totalStr = formatPrice(price * currentQty, lang);
  const rating   = product.rating?.average?.toFixed(1) ?? '4.9';
  const reviews  = product.rating?.count ?? 185;

  document.title = `${name} — ${i18n.t('footer.brand')}`;

  const catLabel = i18n.t(`categoryLabels.${product.category}`);

  const rawIngredients = product.ingredients?.[lang] ?? product.ingredients;
  const ingredients = (Array.isArray(rawIngredients) && rawIngredients.length)
    ? rawIngredients
    : (isAr
        ? ['خلاصة نباتية نقية', 'زبدة الشيا', 'مركب فيتامينات']
        : ['Extrait botanique pur', 'Beurre de karité', 'Complexe vitaminé']);

  const usageText = product.category === 'body'
    ? (isAr
        ? 'يُطبّق على بشرة رطبة بحركات دائرية لطيفة لمدة 2 إلى 3 دقائق لتنشيط الدورة الدموية وتقشير الخلايا الميتة، ثم يُشطف بالماء الفاتر. يُستخدم مرتين في الأسبوع.'
        : 'Appliquez sur peau humide en massant par mouvements circulaires doux pendant 2 à 3 minutes pour exfolier et stimuler la microcirculation, puis rincez à l’eau tiède. Utilisez 2 à 3 fois par semaine.')
    : (isAr
        ? 'وزّعي كمية مناسبة على الشعر المبلل من الجذور حتى الأطراف. اتركيه لمدة 5 إلى 10 دقائق لتتغلغل المكونات الفعّالة بعمق، ثم اشطفيه جيداً بالماء الفاتر.'
        : 'Répartissez généreusement sur cheveux lavés et essorés, des longueurs jusqu’aux pointes. Laissez agir 5 à 10 minutes pour une régénération profonde, puis rincez abondamment.');

  // Related products from same category (or other catalog items)
  const related = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const sampleReviews = isAr
    ? [
        { author: 'سلمى ك.', city: 'الدار البيضاء', date: 'منذ يومين', text: 'منتج رائع وأصلي 100%! لاحظت الفرق من أول أسبوع في النعومة واللمعان، والتوصيل كان سريعاً جداً.' },
        { author: 'ياسمين ب.', city: 'الرباط', date: 'منذ أسبوع', text: 'الرائحة خيالية والقوام غني جداً بدون أن يترك أي أثر دهني. سأطلبه مرة أخرى بالتأكيد.' },
        { author: 'كنزة م.', city: 'مراكش', date: 'منذ أسبوعين', text: 'تغليف فاخر وخدمة الدفع عند الاستلام مريحة جداً. أفضل متجر للمنتجات التركية في المغرب.' },
      ]
    : [
        { author: 'Salma K.', city: 'Casablanca', date: 'Il y a 2 jours', text: 'Produit 100% authentique et résultats bluffants dès la première semaine ! Texture ultra sensorielle et livraison rapide en 24h.' },
        { author: 'Yasmine B.', city: 'Rabat', date: 'Il y a 1 semaine', text: 'Le parfum est divin et la qualité est digne des meilleurs spas. Mes cheveux et ma peau ont retrouvé une douceur incroyable.' },
        { author: 'Kenza M.', city: 'Marrakech', date: 'Il y a 2 semaines', text: 'Emballage soigné, paiement à la livraison très pratique et service client irréprochable. Je recommande à 100%.' },
      ];

  root.innerHTML = `
    <div class="container">
      <!-- Breadcrumb -->
      <nav class="pdp-breadcrumb" aria-label="Breadcrumb">
        <a href="index.html">${isAr ? 'الرئيسية' : 'Accueil'}</a>
        <span class="pdp-breadcrumb__sep">›</span>
        <a href="index.html#shop">${isAr ? 'المتجر' : 'Boutique'}</a>
        <span class="pdp-breadcrumb__sep">›</span>
        <a href="index.html#${product.category}">${catLabel}</a>
        <span class="pdp-breadcrumb__sep">›</span>
        <span class="pdp-breadcrumb__current">${name}</span>
      </nav>

      <!-- Main 2-Column Product Hero -->
      <section class="pdp-main">

        <!-- Left Column: Sticky Visual Gallery -->
        <div class="pdp-gallery">
          <div class="pdp-gallery__stage">
            <div class="pdp-gallery__badges">
              <span class="pdp-badge pdp-badge--primary">${isAr ? 'الأكثر مبيعاً' : 'Best-Seller'}</span>
              <span class="pdp-badge pdp-badge--outline">${isAr ? 'أصلي 100%' : '100% Authentique'}</span>
            </div>

            <img
              id="pdp-main-img"
              src="${product.images.main}"
              alt="${name}"
              class="pdp-gallery__img"
              decoding="async"
              onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src=this.getAttribute('src').replace('/public/','/');}"
            />
          </div>

          <!-- Trust Highlights Below Image -->
          <div class="pdp-trust-grid">
            <div class="pdp-trust-card">
              <span class="pdp-trust-card__icon">🇲🇦</span>
              <div>
                <strong>${isAr ? 'توصيل سريع 24–48 ساعة' : 'Livraison 24–48h au Maroc'}</strong>
                <span>${isAr ? 'مجاني للطلبات فوق 500 درهم' : 'Gratuite dès 500 DH d’achat'}</span>
              </div>
            </div>
            <div class="pdp-trust-card">
              <span class="pdp-trust-card__icon">💵</span>
              <div>
                <strong>${isAr ? 'الدفع عند الاستلام' : 'Paiement à la livraison'}</strong>
                <span>${isAr ? 'افحصي طلبكِ وادفعي بأمان' : 'Payez à la réception en DH'}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Buy Box & Details -->
        <div class="pdp-info">
          <div class="pdp-info__top-meta">
            <span class="pdp-info__brand">${product.brand}</span>
            <span class="pdp-info__sku">SKU: ${product.sku}</span>
            <span class="pdp-info__stock">
              <span class="pdp-info__stock-dot"></span>
              ${isAr ? 'متوفر في المخزون' : 'En stock — Expédition immédiate'}
            </span>
          </div>

          <h1 class="pdp-info__title">${name}</h1>
          <p class="pdp-info__tagline">${tagline}</p>

          <!-- Rating & Price Row -->
          <div class="pdp-info__price-bar">
            <div class="pdp-info__price-block">
              <span class="pdp-info__price">${priceStr}</span>
              <span class="pdp-info__tax-note">${isAr ? 'شامل الضرائب • استيراد تركيا' : 'TTC • Importé directement de Turquie'}</span>
            </div>

            <a href="#pdp-reviews" class="pdp-info__rating-pill">
              <span class="pdp-info__stars">★★★★★</span>
              <strong>${rating}</strong>
              <span>(${reviews} ${isAr ? 'تقييم' : 'avis'})</span>
            </a>
          </div>

          <!-- Active Ingredients Pills -->
          <div class="pdp-ingredients">
            <span class="pdp-ingredients__label">${isAr ? 'المكونات الفعّالة الرئيسية:' : 'Actifs clés de la formule :'}</span>
            <div class="pdp-ingredients__list">
              ${ingredients.map(ing => `
                <span class="pdp-ingredient-pill">✦ ${ing}</span>
              `).join('')}
            </div>
          </div>

          <!-- Purchase Controls (Quantity + Add to Cart + Direct Buy) -->
          <div class="pdp-buy-box">
            <div class="pdp-buy-box__row">
              <div class="pdp-qty" aria-label="Quantity">
                <button type="button" class="pdp-qty__btn" id="pdp-qty-minus" aria-label="Decrease">−</button>
                <span class="pdp-qty__val" id="pdp-qty-val">${currentQty}</span>
                <button type="button" class="pdp-qty__btn" id="pdp-qty-plus" aria-label="Increase">+</button>
              </div>

              <button type="button" class="pdp-btn-cart" id="pdp-add-to-cart">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span>${isAr ? 'أضيفي إلى السلة' : 'Ajouter au panier'}</span>
                <span>—</span>
                <strong id="pdp-btn-total">${totalStr}</strong>
              </button>
            </div>

            <button type="button" class="pdp-btn-buy-now" id="pdp-buy-now">
              <span>⚡ ${isAr ? 'اطلبي الآن — الدفع عند الاستلام' : 'Commander maintenant — Paiement à la livraison'}</span>
            </button>
          </div>

          <!-- Luxury Accordions -->
          <div class="pdp-accordions">
            <details class="pdp-accordion" open>
              <summary class="pdp-accordion__summary">
                <span>${isAr ? 'الوصف والفوائد' : 'Description & Bienfaits'}</span>
                <span class="pdp-accordion__icon">+</span>
              </summary>
              <div class="pdp-accordion__body">
                <p>${desc}</p>
              </div>
            </details>

            <details class="pdp-accordion">
              <summary class="pdp-accordion__summary">
                <span>${isAr ? 'طريقة الاستعمال' : "Conseils d'Utilisation"}</span>
                <span class="pdp-accordion__icon">+</span>
              </summary>
              <div class="pdp-accordion__body">
                <p>${usageText}</p>
              </div>
            </details>

            <details class="pdp-accordion">
              <summary class="pdp-accordion__summary">
                <span>${isAr ? 'الشحن والتوصيل في المغرب' : 'Livraison & Garantie Lumière'}</span>
                <span class="pdp-accordion__icon">+</span>
              </summary>
              <div class="pdp-accordion__body">
                <p>
                  ${isAr
                    ? 'يتم شحن جميع الطلبات خلال 24 إلى 48 ساعة إلى جميع المدن المغربية. التوصيل مجاني للطلبات التي تتجاوز 500 درهم، مع الدفع نقداً عند الاستلام وضمان الأصالة 100%.'
                    : 'Expédition rapide en 24h à 48h partout au Maroc (Casablanca, Rabat, Marrakech, Tanger, Agadir, Fès…). Livraison offerte dès 500 DH d’achat et paiement sécurisé à la livraison.'}
                </p>
              </div>
            </details>
          </div>
        </div>

      </section>

      <!-- Verified Customer Reviews Section -->
      <section class="pdp-reviews" id="pdp-reviews">
        <div class="pdp-section-head">
          <span class="pdp-section-head__eyebrow">${isAr ? 'آراء الزبونات' : 'AVIS CLIENTS VÉRIFIÉS'}</span>
          <h2 class="pdp-section-head__title">
            ${isAr ? `تقييمات المنتج (${reviews} تقييم)` : `Note globale ${rating}/5 (${reviews} avis)`}
          </h2>
        </div>

        <div class="pdp-reviews__grid">
          ${sampleReviews.map(rev => `
            <article class="pdp-review-card">
              <div class="pdp-review-card__top">
                <span class="pdp-review-card__stars">★★★★★</span>
                <span class="pdp-review-card__verified">✓ ${isAr ? 'شراء موثّق' : 'Achat vérifié'}</span>
              </div>
              <p class="pdp-review-card__text">“${rev.text}”</p>
              <div class="pdp-review-card__footer">
                <strong>${rev.author}</strong>
                <span>• ${rev.city}</span>
                <span class="pdp-review-card__date">${rev.date}</span>
              </div>
            </article>
          `).join('')}
        </div>
      </section>

      <!-- Related Products Section -->
      <section class="pdp-related">
        <div class="pdp-section-head">
          <span class="pdp-section-head__eyebrow">${isAr ? 'أكملي روتينكِ' : 'COMPLÉTEZ VOTRE RITUEL'}</span>
          <h2 class="pdp-section-head__title">${isAr ? 'منتجات قد تعجبكِ أيضاً' : 'Vous aimerez aussi'}</h2>
        </div>

        <div class="pdp-related__grid">
          ${related.map(item => {
            const rName  = item.name?.[lang] ?? item.name?.fr ?? '';
            const rPrice = formatPrice(effectivePrice(item), lang);
            const rUrl   = `product.html?id=${encodeURIComponent(item.id)}`;
            return `
              <article class="pdp-rel-card" data-url="${rUrl}">
                <a href="${rUrl}" class="pdp-rel-card__media">
                  <img
                    src="${item.images.main}"
                    alt="${rName}"
                    loading="lazy"
                    decoding="async"
                    onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src=this.getAttribute('src').replace('/public/','/');}"
                  />
                </a>
                <div class="pdp-rel-card__body">
                  <span class="pdp-rel-card__brand">${item.brand}</span>
                  <a href="${rUrl}" class="pdp-rel-card__title">${rName}</a>
                  <div class="pdp-rel-card__bottom">
                    <span class="pdp-rel-card__price">${rPrice}</span>
                    <a href="${rUrl}" class="pdp-rel-card__link">${isAr ? 'عرض المنتج ←' : 'Voir →'}</a>
                  </div>
                </div>
              </article>
            `;
          }).join('')}
        </div>
      </section>
    </div>
  `;

  bindProductEvents(product);
}

// ── 4. Bind Interactive Events ───────────────────────────────────────────────
function bindProductEvents(product) {
  const lang  = i18n.lang;
  const isAr  = lang === 'ar';
  const price = effectivePrice(product);

  const minusBtn = document.getElementById('pdp-qty-minus');
  const plusBtn  = document.getElementById('pdp-qty-plus');
  const qtyVal   = document.getElementById('pdp-qty-val');
  const totalEl  = document.getElementById('pdp-btn-total');

  const updateQtyDisplay = () => {
    if (qtyVal)  qtyVal.textContent  = String(currentQty);
    if (totalEl) totalEl.textContent = formatPrice(price * currentQty, lang);
  };

  minusBtn?.addEventListener('click', () => {
    if (currentQty > 1) {
      currentQty -= 1;
      updateQtyDisplay();
    }
  });

  plusBtn?.addEventListener('click', () => {
    if (currentQty < 10) {
      currentQty += 1;
      updateQtyDisplay();
    }
  });

  // Add to Cart
  const addBtn = document.getElementById('pdp-add-to-cart');
  addBtn?.addEventListener('click', () => {
    cartStore.add(product, currentQty);
    const name = product.name?.[lang] ?? product.name?.fr ?? '';
    showToast(
      isAr ? `✓ "${name}" أضيف إلى السلة` : `✓ "${name}" ajouté au panier`,
      { type: 'success', icon: '🛒', duration: 2500 }
    );
    cartDrawer.open();
  });

  // Direct Buy Now → Add to Cart & Go to Checkout
  const buyNowBtn = document.getElementById('pdp-buy-now');
  buyNowBtn?.addEventListener('click', () => {
    cartStore.add(product, currentQty);
    window.location.href = 'checkout.html';
  });

  // Single-tap navigation on related product cards
  document.querySelectorAll('.pdp-rel-card[data-url]').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('a[href]')) return;
      const url = card.dataset.url;
      if (url) window.location.href = url;
    });
  });
}

// Initial render + re-render on language switch
renderProductPage();
document.addEventListener('langchange', () => {
  renderProductPage();
});
