/**
 * checkout.js — Streamlined & Mobile-Optimized Checkout Page Logic
 * Lumière Beauty Store — src/pages/checkout.js
 */

import i18n         from '../context/i18n.js';
import cartStore    from '../context/cartStore.js';
import products     from '../data/products.data.js';
import Header       from '../components/layout/Header.js';
import CartDrawer, { showToast } from '../components/cart/CartDrawer.js';
import { formatPrice } from '../utils/currency.js';

// ── Moroccan Cities List ───────────────────────────────────────────────────────
const MOROCCO_CITIES = [
  { value: 'casablanca', fr: 'Casablanca', ar: 'الدار البيضاء' },
  { value: 'rabat', fr: 'Rabat - Salé - Kénitra', ar: 'الرباط - سلا - القنيطرة' },
  { value: 'marrakech', fr: 'Marrakech', ar: 'مراكش' },
  { value: 'tanger', fr: 'Tanger - Tétouan', ar: 'طنجة - تطوان' },
  { value: 'fes', fr: 'Fès - Meknès', ar: 'فاس - مكناس' },
  { value: 'agadir', fr: 'Agadir', ar: 'أكادير' },
  { value: 'oujda', fr: 'Oujda - Nador', ar: 'وجدة - الناظور' },
  { value: 'mohammedia', fr: 'Mohammedia', ar: 'المحمدية' },
  { value: 'el-jadida', fr: 'El Jadida', ar: 'الجديدة' },
  { value: 'kenitra', fr: 'Kénitra', ar: 'القنيطرة' },
  { value: 'tetouan', fr: 'Tétouan', ar: 'تطوان' },
  { value: 'safi', fr: 'Safi', ar: 'آسفي' },
  { value: 'nador', fr: 'Nador', ar: 'الناظور' },
  { value: 'beni-mellal', fr: 'Béni Mellal', ar: 'بني ملال' },
  { value: 'other', fr: 'Autre ville au Maroc', ar: 'مدينة أخرى بالمغرب' },
];

// ── Bootstrap & Setup ─────────────────────────────────────────────────────────
i18n.init();

// Toast container ensurement
if (!document.getElementById('toast-container')) {
  const tc = document.createElement('div');
  tc.id = 'toast-container';
  document.body.appendChild(tc);
}

// Cart Drawer instance (opens via Header cart icon)
const cartDrawer = new CartDrawer();
cartDrawer.mount(document.body);

// Header mount
const headerRoot = document.getElementById('header-root');
if (headerRoot) {
  const { count } = cartStore.summary();
  const header = new Header({ cartCount: count });
  headerRoot.replaceWith(header.render());

  document.addEventListener('click', e => {
    if (e.target.closest('#btn-cart')) {
      e.preventDefault();
      cartDrawer.toggle();
    }
  });
}

// ── Page State ────────────────────────────────────────────────────────────────
let currentStep = 1; // 1 = checkout, 2 = confirmed
let lastOrderId = '';
let isMobileSummaryOpen = false;

// ── Helper: Form Data Preservation ────────────────────────────────────────────
function getFormData() {
  return {
    fullname: document.getElementById('field-fullname')?.value ?? '',
    phone:    document.getElementById('field-phone')?.value ?? '',
    city:     document.getElementById('field-city-select')?.value ?? '',
  };
}

function restoreFormData(data) {
  if (!data) return;
  const fn = document.getElementById('field-fullname');
  if (fn && data.fullname) {
    fn.value = data.fullname;
    fn.closest('.form-field')?.classList.add('has-value');
  }
  const ph = document.getElementById('field-phone');
  if (ph && data.phone) {
    ph.value = data.phone;
    ph.closest('.form-field')?.classList.add('has-value');
  }
  const ct = document.getElementById('field-city-select');
  if (ct && data.city) {
    ct.value = data.city;
    ct.closest('.form-field')?.classList.add('has-value');
  }
}

// ── Render Checkout Page ──────────────────────────────────────────────────────
function renderCheckout() {
  const lang    = i18n.lang;
  const summary = cartStore.summary();

  if (currentStep === 2) {
    renderConfirmation();
    return;
  }

  const root = document.getElementById('checkout-root');
  if (!root) return;

  const isFreeShipping = summary.freeShipping;
  const shippingCost   = isFreeShipping ? 0 : 29;
  const grandTotal     = summary.subtotal + shippingCost;

  root.innerHTML = `
    <!-- Progress bar -->
    <div class="checkout-progress">
      <div class="checkout-progress__inner">
        <div class="checkout-step active">
          <div class="checkout-step__num">1</div>
          <div class="checkout-step__label">${lang === 'ar' ? 'معلومات التوصيل' : 'Livraison'}</div>
        </div>
        <div class="checkout-step">
          <div class="checkout-step__num">2</div>
          <div class="checkout-step__label">${lang === 'ar' ? 'تأكيد الطلب' : 'Confirmation'}</div>
        </div>
      </div>
    </div>

    <!-- Main grid -->
    <div class="container">
      <!-- Breadcrumb -->
      <div class="checkout-breadcrumb">
        <a href="index.html">${lang === 'ar' ? 'الرئيسية' : 'Accueil'}</a>
        <span class="checkout-breadcrumb__sep">›</span>
        <a href="index.html#shop">${lang === 'ar' ? 'المتجر' : 'Boutique'}</a>
        <span class="checkout-breadcrumb__sep">›</span>
        <span class="checkout-breadcrumb__current">${lang === 'ar' ? 'إتمام الطلب' : 'Finaliser la commande'}</span>
      </div>

      ${summary.items.length > 0 ? `
        <!-- Mobile Top Collapsible Order Summary Accordion (Shopify style) -->
        <div class="checkout-mobile-summary ${isMobileSummaryOpen ? 'is-open' : ''}" id="checkout-mobile-summary">
          <button type="button" class="checkout-mobile-summary__toggle" id="btn-toggle-mobile-summary" aria-expanded="${isMobileSummaryOpen ? 'true' : 'false'}">
            <div class="checkout-mobile-summary__toggle-left">
              <span class="checkout-mobile-summary__icon">🛍️</span>
              <span class="checkout-mobile-summary__text">
                <span id="mobile-summary-toggle-label">${isMobileSummaryOpen ? (lang === 'ar' ? 'إخفاء تفاصيل الطلب' : 'Masquer le récapitulatif') : (lang === 'ar' ? 'عرض تفاصيل الطلب' : 'Afficher le récapitulatif')}</span>
                <span class="checkout-mobile-summary__count">(${summary.count})</span>
              </span>
              <span class="checkout-mobile-summary__arrow">▾</span>
            </div>
            <div class="checkout-mobile-summary__toggle-total">
              ${formatPrice(grandTotal, lang)}
            </div>
          </button>

          <div class="checkout-mobile-summary__content" id="mobile-summary-content" style="${isMobileSummaryOpen ? 'display:block;' : 'display:none;'}">
            <div class="checkout-mobile-summary__items">
              ${summary.items.map(item => {
                const prod = products.find(p => p.id === item.productId);
                const name = item.name?.[lang] ?? prod?.name?.[lang] ?? item.name?.fr ?? prod?.name?.fr ?? '';
                const imgUrl = item.image || item.mainImage || prod?.images?.main || null;

                return `
                  <div class="summary-item">
                    <div class="summary-item__image">
                      ${imgUrl
                        ? `<img src="${imgUrl}" alt="${name}" loading="lazy" decoding="async" onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src=this.getAttribute('src').replace('/public/','/');}" />`
                        : (item.emoji || '🧴')
                      }
                      <span class="summary-item__qty-badge">${item.qty}</span>
                    </div>
                    <div class="summary-item__details">
                      <div class="summary-item__name">${name}</div>
                      ${item.variantLabel ? `<div class="summary-item__variant">${item.variantLabel}</div>` : ''}
                    </div>
                    <div class="summary-item__price">${formatPrice(item.price * item.qty, lang)}</div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Free shipping reminder in mobile accordion -->
            <div style="padding:var(--sp-2) 0;border-top:1px solid var(--color-border);font-size:var(--fs-xs);">
              ${isFreeShipping
                ? `<span style="color:#2e7d55;font-weight:600;">✦ ${lang === 'ar' ? 'مبروك! استفدتِ من الشحن المجاني' : 'Félicitations ! Livraison gratuite offerte'}</span>`
                : `<span>🚚 ${lang === 'ar' ? `أضيفي ${formatPrice(summary.remaining, lang)} للاستفادة من التوصيل المجاني!` : `Ajoutez ${formatPrice(summary.remaining, lang)} pour la livraison gratuite !`}</span>`
              }
            </div>

            <!-- Totals inside mobile accordion -->
            <div class="checkout-summary__totals" style="padding:var(--sp-3) 0 0;border-top:1px solid var(--color-border);">
              <div class="summary-row">
                <span>${lang === 'ar' ? 'المجموع الفرعي' : 'Sous-total'}</span>
                <span>${formatPrice(summary.subtotal, lang)}</span>
              </div>
              <div class="summary-row">
                <span>${lang === 'ar' ? 'الشحن' : 'Livraison'}</span>
                <span class="${isFreeShipping ? 'summary-free' : ''}">
                  ${isFreeShipping
                    ? (lang === 'ar' ? 'مجاني' : 'Gratuit')
                    : formatPrice(29, lang)
                  }
                </span>
              </div>
              <div class="summary-row summary-row--total">
                <span>${lang === 'ar' ? 'الإجمالي' : 'Total'}</span>
                <span class="summary-amount">${formatPrice(grandTotal, lang)}</span>
              </div>
            </div>
          </div>
        </div>
      ` : ''}

      <div class="checkout-grid">
        <!-- ── LEFT: Form ── -->
        <div class="checkout-form-panel">

          ${summary.items.length === 0 ? `
            <div class="checkout-card" style="text-align:center;padding:var(--sp-12);">
              <div style="font-size:3rem;margin-bottom:var(--sp-4);">🛒</div>
              <h3>${lang === 'ar' ? 'سلة التسوق فارغة' : 'Votre panier est vide'}</h3>
              <p style="color:var(--color-text-muted);margin-top:var(--sp-2);">
                ${lang === 'ar' ? 'اختاري منتجاتكِ المفضلة وتابعي إتمام الطلب بكل سهولة.' : 'Sélectionnez vos soins préférés pour finaliser votre commande.'}
              </p>
              <a href="index.html" class="checkout-submit" style="margin-top:var(--sp-6);text-decoration:none;max-width:260px;margin-inline:auto;">
                ${lang === 'ar' ? 'تصفح المنتجات' : 'Découvrir la boutique'}
              </a>
            </div>
          ` : `

          <!-- 1. Simplified Shipping Address -->
          <div class="checkout-card" id="card-shipping">
            <div class="checkout-card__header">
              <div class="checkout-card__icon">📍</div>
              <div>
                <div class="checkout-card__title">${lang === 'ar' ? 'معلومات التوصيل' : 'Adresse de livraison'}</div>
                <div class="checkout-card__subtitle">${lang === 'ar' ? 'أين ترغبين في استلام طلبيتكِ؟' : 'Où souhaitez-vous recevoir votre commande ?'}</div>
              </div>
            </div>

            <!-- Single Full Name Input (width: 100%, min-height: 50px, 16px font) -->
            <div class="form-field">
              <input type="text" id="field-fullname" class="form-field__input" placeholder=" " autocomplete="name" required />
              <label for="field-fullname" class="form-field__label">${lang === 'ar' ? 'الاسم الكامل *' : 'Nom et Prénom *'}</label>
              <span class="form-field__error">${lang === 'ar' ? 'يرجى إدخال الاسم واللقب' : 'Veuillez saisir votre nom et prénom'}</span>
            </div>

            <!-- Mandatory Phone Input (width: 100%, min-height: 50px, 16px font) -->
            <div class="form-field">
              <input type="tel" id="field-phone" class="form-field__input" placeholder=" " autocomplete="tel" required />
              <label for="field-phone" class="form-field__label">${lang === 'ar' ? 'رقم الهاتف (للتواصل والتوصيل) *' : 'Numéro de téléphone *'}</label>
              <span class="form-field__error">${lang === 'ar' ? 'يرجى إدخال رقم هاتف صحيح' : 'Numéro de téléphone requis'}</span>
            </div>

            <!-- City Dropdown Selector (width: 100%, min-height: 50px, 16px font) -->
            <div class="form-field has-value">
              <select id="field-city-select" class="form-field__select" required>
                <option value="" disabled selected>${lang === 'ar' ? '-- اختاري مدينتكِ --' : '-- Sélectionnez votre ville --'}</option>
                ${MOROCCO_CITIES.map(c => `
                  <option value="${c.value}">${lang === 'ar' ? c.ar : c.fr}</option>
                `).join('')}
              </select>
              <label for="field-city-select" class="form-field__label">${lang === 'ar' ? 'المدينة / الجهة الرئيسية *' : 'Région / Ville principale *'}</label>
              <span class="form-field__error">${lang === 'ar' ? 'يرجى اختيار مدينتكِ' : 'Veuillez sélectionner une ville'}</span>
            </div>
          </div>

          <!-- 2. Streamlined Shipping Method (Single Dynamic Option) -->
          <div class="checkout-card" id="card-delivery">
            <div class="checkout-card__header">
              <div class="checkout-card__icon">🚚</div>
              <div>
                <div class="checkout-card__title">${lang === 'ar' ? 'طريقة التوصيل' : 'Mode de livraison'}</div>
                <div class="checkout-card__subtitle">${lang === 'ar' ? 'توصيل موثوق إلى باب منزلك' : 'Livraison rapide à votre adresse'}</div>
              </div>
            </div>

            <div class="shipping-options">
              <label class="radio-card selected" id="ship-standard" style="cursor:default;">
                <input type="radio" name="shipping" value="standard" checked />
                <div class="radio-card__dot"></div>
                <div class="radio-card__body">
                  <div class="radio-card__title">🚚 ${lang === 'ar' ? 'توصيل قياسي إلى باب المنزل' : 'Livraison Standard à domicile'}</div>
                  <div class="radio-card__desc">${lang === 'ar' ? 'خلال 3 – 5 أيام عمل في جميع مدن المغرب' : 'Partout au Maroc en 3 – 5 jours ouvrés'}</div>
                </div>
                <div class="radio-card__price">
                  ${isFreeShipping
                    ? `<span style="color:#2e7d55;font-weight:700;">${lang === 'ar' ? 'مجاني' : 'Gratuit'}</span>`
                    : formatPrice(29, lang)
                  }
                </div>
              </label>
            </div>
          </div>

          <!-- 3. Payment Method (Cash on Delivery) -->
          <div class="checkout-card" id="card-payment">
            <div class="checkout-card__header">
              <div class="checkout-card__icon">💵</div>
              <div>
                <div class="checkout-card__title">${lang === 'ar' ? 'طريقة الدفع' : 'Mode de paiement'}</div>
                <div class="checkout-card__subtitle">${lang === 'ar' ? 'الدفع الآمن والمريح عند الاستلام' : 'Paiement simple et sécurisé'}</div>
              </div>
            </div>

            <div class="shipping-options">
              <label class="radio-card selected" id="pay-cod" style="cursor:default;">
                <input type="radio" name="payment" value="cod" checked />
                <div class="radio-card__dot"></div>
                <div class="radio-card__body">
                  <div class="radio-card__title">💵 ${lang === 'ar' ? 'الدفع عند الاستلام (نقداً)' : 'Paiement à la livraison (Cash on Delivery)'}</div>
                  <div class="radio-card__desc">${lang === 'ar' ? 'ادفعي نقداً لمندوب التوصيل بعد معاينة واستلام طلبيتكِ' : 'Réglez en espèces au livreur lors de la réception de votre colis'}</div>
                </div>
                <div class="radio-card__price" style="color:#2e7d55;font-weight:700;">
                  ${lang === 'ar' ? 'متاح' : 'Inclus'}
                </div>
              </label>
            </div>
          </div>

          <!-- Submit Order Button (100% width, min-height: 52px, ample bottom spacing) -->
          <button class="checkout-submit" id="checkout-submit-btn">
            <span>🔒</span>
            <span>${lang === 'ar' ? 'تأكيد الطلب (الدفع عند الاستلام)' : 'Confirmer ma commande'}</span>
          </button>

          <p id="checkout-security-note">
            🔒 ${lang === 'ar' ? 'بياناتكِ محمية بالكامل · الدفع نقداً عند استلام الشحنة' : 'Vos informations sont protégées · Paiement 100% sécurisé à la livraison'}
          </p>
          `}
        </div>

        <!-- ── RIGHT: Order Summary (reordered after delivery on mobile) ── -->
        <aside class="checkout-summary">
          <div class="checkout-summary__card">
            <div class="checkout-summary__header">
              🧾 ${lang === 'ar' ? 'ملخص الطلب' : 'Récapitulatif de la commande'} · ${summary.count} ${lang === 'ar' ? 'منتج' : 'article(s)'}
            </div>

            <!-- Items List -->
            <div class="checkout-summary__items">
              ${summary.items.map(item => {
                const prod = products.find(p => p.id === item.productId);
                const name = item.name?.[lang] ?? prod?.name?.[lang] ?? item.name?.fr ?? prod?.name?.fr ?? '';
                const imgUrl = item.image || item.mainImage || prod?.images?.main || null;

                return `
                  <div class="summary-item">
                    <div class="summary-item__image">
                      ${imgUrl
                        ? `<img src="${imgUrl}" alt="${name}" loading="lazy" decoding="async" onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src=this.getAttribute('src').replace('/public/','/');}" />`
                        : (item.emoji || '🧴')
                      }
                      <span class="summary-item__qty-badge">${item.qty}</span>
                    </div>
                    <div class="summary-item__details">
                      <div class="summary-item__name">${name}</div>
                      ${item.variantLabel ? `<div class="summary-item__variant">${item.variantLabel}</div>` : ''}
                    </div>
                    <div class="summary-item__price">${formatPrice(item.price * item.qty, lang)}</div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Free shipping banner -->
            ${summary.items.length > 0 ? `
              <div style="padding:var(--sp-3) var(--sp-6);background:${isFreeShipping ? 'rgba(46,125,85,0.08)' : 'var(--color-surface-2)'};border-top:1px solid var(--color-border);font-size:var(--fs-xs);display:flex;align-items:center;gap:var(--sp-2);">
                ${isFreeShipping
                  ? `<span style="color:#2e7d55;font-weight:600;">✦ ${lang === 'ar' ? 'مبروك! استفدتِ من الشحن المجاني' : 'Félicitations ! Livraison gratuite offerte'}</span>`
                  : `<span>🚚 ${lang === 'ar' ? `أضيفي ${formatPrice(summary.remaining, lang)} للاستفادة من التوصيل المجاني!` : `Ajoutez ${formatPrice(summary.remaining, lang)} pour la livraison gratuite !`}</span>`
                }
              </div>
            ` : ''}

            <!-- Totals -->
            <div class="checkout-summary__totals">
              <div class="summary-row">
                <span>${lang === 'ar' ? 'المجموع الفرعي' : 'Sous-total'}</span>
                <span>${formatPrice(summary.subtotal, lang)}</span>
              </div>
              <div class="summary-row">
                <span>${lang === 'ar' ? 'الشحن' : 'Livraison'}</span>
                <span class="${isFreeShipping ? 'summary-free' : ''}">
                  ${isFreeShipping
                    ? (lang === 'ar' ? 'مجاني' : 'Gratuit')
                    : formatPrice(29, lang)
                  }
                </span>
              </div>
              <div class="summary-row summary-row--total">
                <span>${lang === 'ar' ? 'الإجمالي' : 'Total'}</span>
                <span class="summary-amount">${formatPrice(grandTotal, lang)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  `;

  _bindCheckoutEvents(lang, summary);
}

// ── Form Validation & Events ──────────────────────────────────────────────────
function _bindCheckoutEvents(lang, summary) {
  // Mobile accordion toggle
  const summaryToggle = document.getElementById('btn-toggle-mobile-summary');
  const summaryContent = document.getElementById('mobile-summary-content');
  const summaryLabel = document.getElementById('mobile-summary-toggle-label');

  if (summaryToggle && summaryContent) {
    summaryToggle.addEventListener('click', () => {
      isMobileSummaryOpen = summaryContent.style.display === 'none';
      if (isMobileSummaryOpen) {
        summaryContent.style.display = 'block';
        summaryToggle.closest('.checkout-mobile-summary')?.classList.add('is-open');
        summaryToggle.setAttribute('aria-expanded', 'true');
        if (summaryLabel) {
          summaryLabel.textContent = lang === 'ar' ? 'إخفاء تفاصيل الطلب' : 'Masquer le récapitulatif';
        }
      } else {
        summaryContent.style.display = 'none';
        summaryToggle.closest('.checkout-mobile-summary')?.classList.remove('is-open');
        summaryToggle.setAttribute('aria-expanded', 'false');
        if (summaryLabel) {
          summaryLabel.textContent = lang === 'ar' ? 'عرض تفاصيل الطلب' : 'Afficher le récapitulatif';
        }
      }
    });
  }

  // Floating label helper for select
  const citySelect = document.getElementById('field-city-select');
  if (citySelect) {
    citySelect.closest('.form-field')?.classList.add('has-value');
    citySelect.addEventListener('change', () => {
      citySelect.closest('.form-field')?.classList.add('has-value');
      citySelect.classList.remove('error');
    });
  }

  // Floating label & error reset on user input
  document.querySelectorAll('.form-field__input').forEach(input => {
    input.addEventListener('input', () => {
      const field = input.closest('.form-field');
      field?.classList.toggle('has-value', input.value.trim() !== '');
      if (input.classList.contains('error')) {
        input.classList.remove('error');
      }
    });

    if (input.value.trim()) {
      input.closest('.form-field')?.classList.add('has-value');
    }
  });

  // Submit Handler
  document.getElementById('checkout-submit-btn')?.addEventListener('click', () => {
    if (summary.items.length === 0) return;

    const requiredFields = [
      {
        id: 'field-fullname',
        test: v => v.trim().length >= 3,
      },
      {
        id: 'field-phone',
        test: v => v.replace(/\D/g, '').length >= 9,
      },
      {
        id: 'field-city-select',
        test: v => v && v.trim().length > 0,
      },
    ];

    let firstInvalid = null;
    requiredFields.forEach(({ id, test }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const ok = test(el.value);
      el.classList.toggle('error', !ok);
      if (!ok && !firstInvalid) {
        firstInvalid = el;
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
      showToast(
        lang === 'ar'
          ? '⚠ يرجى إدخال جميع معلومات التوصيل المطلوبة'
          : '⚠ Veuillez remplir tous les champs obligatoires',
        { type: 'error', icon: '⚠️' }
      );
      return;
    }

    // Place order simulation
    const btn = document.getElementById('checkout-submit-btn');
    btn.disabled = true;
    btn.classList.add('checkout-submit--loading');
    btn.innerHTML = `
      <span class="spinner" style="display:inline-block;width:18px;height:18px;border:2.5px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.8s linear infinite;"></span>
      <span>${lang === 'ar' ? 'جارٍ تسجيل طلبكِ…' : 'Validation de votre commande…'}</span>
    `;

    if (!document.getElementById('spin-style')) {
      const s = document.createElement('style');
      s.id = 'spin-style';
      s.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
      document.head.appendChild(s);
    }

    setTimeout(() => {
      lastOrderId = `LUM-${Date.now().toString(36).toUpperCase().slice(-8)}`;
      cartStore.clear();
      currentStep = 2;
      renderConfirmation();
    }, 1200);
  });
}

// ── Confirmation Screen ───────────────────────────────────────────────────────
function renderConfirmation() {
  const lang = i18n.lang;
  const root = document.getElementById('checkout-root');
  if (!root) return;

  const orderNum = lastOrderId || `LUM-${Date.now().toString(36).toUpperCase().slice(-8)}`;

  root.innerHTML = `
    <!-- Progress bar -->
    <div class="checkout-progress">
      <div class="checkout-progress__inner">
        <div class="checkout-step done">
          <div class="checkout-step__num">✓</div>
          <div class="checkout-step__label">${lang === 'ar' ? 'معلومات التوصيل' : 'Livraison'}</div>
        </div>
        <div class="checkout-step active">
          <div class="checkout-step__num">2</div>
          <div class="checkout-step__label">${lang === 'ar' ? 'تأكيد الطلب' : 'Confirmation'}</div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="order-confirmed">
        <div class="order-confirmed__checkmark">✓</div>
        <h1 class="order-confirmed__title">
          ${lang === 'ar' ? 'تم تأكيد طلبكِ بنجاح! 🎉' : 'Commande confirmée ! 🎉'}
        </h1>
        <div class="order-confirmed__number">
          ${lang === 'ar' ? 'رقم الطلب:' : 'Numéro de commande :'} <strong>${orderNum}</strong>
        </div>
        <p class="order-confirmed__message">
          ${lang === 'ar'
            ? 'شكراً لتسوقكِ معنا! سيتصل بكِ فريقنا هاتفياً لتأكيد وتنسيق موعد تسليم شحنتكِ والدفع عند الاستلام.'
            : 'Merci pour votre commande ! Notre équipe vous contactera par téléphone pour confirmer et coordonner la livraison de votre colis en paiement à la livraison.'
          }
        </p>
        <div class="order-confirmed__ctas">
          <a href="index.html" class="btn btn--primary">
            ${lang === 'ar' ? 'مواصلة التسوق' : 'Continuer mes achats'}
          </a>
          <a href="index.html" class="btn btn--ghost">
            ${lang === 'ar' ? 'العودة للرئيسية' : 'Retour à l\'accueil'}
          </a>
        </div>

        <!-- Confetti effect -->
        <div id="confetti-wrap" aria-hidden="true" style="position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:9999;"></div>
      </div>
    </div>
  `;

  _launchConfetti();
}

function _launchConfetti() {
  const wrap = document.getElementById('confetti-wrap');
  if (!wrap) return;
  const colors = ['#c8607a','#7c5cbf','#f5c842','#4caf84','#e8a0b0','#b09de0'];
  for (let i = 0; i < 80; i++) {
    const dot = document.createElement('div');
    const size = Math.random() * 10 + 6;
    dot.style.cssText = `
      position:absolute;
      top:-20px;
      left:${Math.random()*100}%;
      width:${size}px;
      height:${size}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      opacity:${Math.random()*0.8+0.2};
      animation:confettiFall ${Math.random()*2+1.5}s ${Math.random()*1.5}s ease-in forwards;
      transform:rotate(${Math.random()*360}deg);
    `;
    wrap.appendChild(dot);
  }
  if (!document.getElementById('confetti-style')) {
    const s = document.createElement('style');
    s.id = 'confetti-style';
    s.textContent = `@keyframes confettiFall{to{top:110vh;transform:rotate(${Math.random()*720}deg);opacity:0;}}`;
    document.head.appendChild(s);
  }
  setTimeout(() => wrap?.remove(), 4000);
}

// ── Global Reactive Listeners ─────────────────────────────────────────────────
document.addEventListener('langchange', () => {
  if (currentStep === 1) {
    const saved = getFormData();
    renderCheckout();
    restoreFormData(saved);
  } else if (currentStep === 2) {
    renderConfirmation();
  }
});

document.addEventListener('cartchange', ({ detail }) => {
  // Update header cart badge
  const badge = document.querySelector('#btn-cart .header__badge') || document.querySelector('.header__badge');
  if (badge) {
    const count = detail?.count ?? cartStore.summary().count;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }

  // Dynamically update checkout page & totals if currently on step 1
  if (currentStep === 1) {
    const saved = getFormData();
    renderCheckout();
    restoreFormData(saved);
  }
});

// ── Initial Render ────────────────────────────────────────────────────────────
renderCheckout();
