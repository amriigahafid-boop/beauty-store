/**
 * checkout.js — Checkout Page Logic
 * Beauty Store — src/pages/checkout.js
 */

import i18n      from '../context/i18n.js';
import cartStore from '../context/cartStore.js';
import Header    from '../components/layout/Header.js';
import { formatPrice } from '../utils/currency.js';
import { showToast }   from '../components/cart/CartDrawer.js';

// ── Bootstrap ────────────────────────────────────────────────────────────────
i18n.init();

const headerRoot = document.getElementById('header-root');
if (headerRoot) {
  const { count } = cartStore.summary();
  const header = new Header({ cartCount: count });
  headerRoot.replaceWith(header.render());
}

// ── Toast container ───────────────────────────────────────────────────────────
if (!document.getElementById('toast-container')) {
  const tc = document.createElement('div');
  tc.id = 'toast-container';
  document.body.appendChild(tc);
}

// ── Step state ────────────────────────────────────────────────────────────────
let currentStep = 1; // 1 = shipping, 2 = confirmed

// ── Render the checkout page ──────────────────────────────────────────────────
function renderCheckout() {
  const lang    = i18n.lang;
  const summary = cartStore.summary();

  if (currentStep === 2) {
    renderConfirmation();
    return;
  }

  const root = document.getElementById('checkout-root');
  if (!root) return;

  root.innerHTML = `
    <!-- Progress bar -->
    <div class="checkout-progress">
      <div class="checkout-progress__inner">
        <div class="checkout-step active">
          <div class="checkout-step__num">1</div>
          <div class="checkout-step__label">${lang === 'ar' ? 'معلومات الشحن' : 'Livraison'}</div>
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
        <span class="checkout-breadcrumb__current">${lang === 'ar' ? 'الدفع' : 'Commande'}</span>
      </div>

      <div class="checkout-grid">
        <!-- ── LEFT: Form ── -->
        <div class="checkout-form-panel">

          ${summary.items.length === 0 ? `
            <div class="checkout-card" style="text-align:center;padding:var(--sp-12);">
              <div style="font-size:3rem;margin-bottom:var(--sp-4);">🛒</div>
              <h3>${lang === 'ar' ? 'سلة التسوق فارغة' : 'Votre panier est vide'}</h3>
              <a href="index.html" class="cart-checkout-btn" style="margin-top:var(--sp-6);text-decoration:none;max-width:240px;margin-inline:auto;">
                ${lang === 'ar' ? 'تصفح المنتجات' : 'Voir les produits'}
              </a>
            </div>
          ` : `

          <!-- Contact -->
          <div class="checkout-card" id="card-contact">
            <div class="checkout-card__header">
              <div class="checkout-card__icon">📧</div>
              <div>
                <div class="checkout-card__title">${lang === 'ar' ? 'معلومات الاتصال' : 'Informations de contact'}</div>
                <div class="checkout-card__subtitle">${lang === 'ar' ? 'سنرسل تأكيد الطلب على بريدك' : 'Nous vous enverrons la confirmation par email'}</div>
              </div>
            </div>
            <div class="form-field">
              <input type="email" id="field-email" class="form-field__input" placeholder=" " autocomplete="email" required />
              <label for="field-email" class="form-field__label">${lang === 'ar' ? 'البريد الإلكتروني *' : 'Adresse e-mail *'}</label>
              <span class="form-field__error">${lang === 'ar' ? 'بريد إلكتروني غير صالح' : 'Adresse e-mail invalide'}</span>
            </div>
            <div class="form-field">
              <input type="tel" id="field-phone" class="form-field__input" placeholder=" " autocomplete="tel" />
              <label for="field-phone" class="form-field__label">${lang === 'ar' ? 'رقم الهاتف' : 'Téléphone (optionnel)'}</label>
            </div>
          </div>

          <!-- Shipping address -->
          <div class="checkout-card" id="card-shipping">
            <div class="checkout-card__header">
              <div class="checkout-card__icon">📍</div>
              <div>
                <div class="checkout-card__title">${lang === 'ar' ? 'عنوان التسليم' : 'Adresse de livraison'}</div>
                <div class="checkout-card__subtitle">${lang === 'ar' ? 'أين تريدين استلام طلبك؟' : 'Où souhaitez-vous recevoir votre commande ?'}</div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-field">
                <input type="text" id="field-firstname" class="form-field__input" placeholder=" " autocomplete="given-name" required />
                <label for="field-firstname" class="form-field__label">${lang === 'ar' ? 'الاسم الأول *' : 'Prénom *'}</label>
                <span class="form-field__error">${lang === 'ar' ? 'الاسم مطلوب' : 'Prénom requis'}</span>
              </div>
              <div class="form-field">
                <input type="text" id="field-lastname" class="form-field__input" placeholder=" " autocomplete="family-name" required />
                <label for="field-lastname" class="form-field__label">${lang === 'ar' ? 'اسم العائلة *' : 'Nom *'}</label>
                <span class="form-field__error">${lang === 'ar' ? 'الاسم مطلوب' : 'Nom requis'}</span>
              </div>
            </div>

            <div class="form-field form-row--full">
              <input type="text" id="field-address" class="form-field__input" placeholder=" " autocomplete="street-address" required />
              <label for="field-address" class="form-field__label">${lang === 'ar' ? 'العنوان *' : 'Adresse *'}</label>
              <span class="form-field__error">${lang === 'ar' ? 'العنوان مطلوب' : 'Adresse requise'}</span>
            </div>

            <div class="form-field form-row--full">
              <input type="text" id="field-address2" class="form-field__input" placeholder=" " autocomplete="address-line2" />
              <label for="field-address2" class="form-field__label">${lang === 'ar' ? 'تكملة العنوان (اختياري)' : 'Complément d\'adresse (optionnel)'}</label>
            </div>

            <div class="form-row">
              <div class="form-field">
                <input type="text" id="field-city" class="form-field__input" placeholder=" " autocomplete="address-level2" required />
                <label for="field-city" class="form-field__label">${lang === 'ar' ? 'المدينة *' : 'Ville *'}</label>
                <span class="form-field__error">${lang === 'ar' ? 'المدينة مطلوبة' : 'Ville requise'}</span>
              </div>
              <div class="form-field">
                <input type="text" id="field-zip" class="form-field__input" placeholder=" " autocomplete="postal-code" />
                <label for="field-zip" class="form-field__label">${lang === 'ar' ? 'الرمز البريدي' : 'Code postal'}</label>
              </div>
            </div>

            <div class="form-field">
              <select id="field-city-select" class="form-field__select">
                <option value="casablanca">${lang === 'ar' ? 'الدار البيضاء' : 'Casablanca'}</option>
                <option value="rabat">${lang === 'ar' ? 'الرباط' : 'Rabat'}</option>
                <option value="marrakech">${lang === 'ar' ? 'مراكش' : 'Marrakech'}</option>
                <option value="fes">${lang === 'ar' ? 'فاس' : 'Fès'}</option>
                <option value="tanger">${lang === 'ar' ? 'طنجة' : 'Tanger'}</option>
                <option value="agadir">${lang === 'ar' ? 'أكادير' : 'Agadir'}</option>
                <option value="meknes">${lang === 'ar' ? 'مكناس' : 'Meknès'}</option>
                <option value="oujda">${lang === 'ar' ? 'وجدة' : 'Oujda'}</option>
                <option value="other">${lang === 'ar' ? 'مدينة أخرى' : 'Autre ville'}</option>
              </select>
              <label for="field-city-select" class="form-field__label">${lang === 'ar' ? 'الولاية / الجهة' : 'Région / Ville principale'}</label>
            </div>

            <div class="form-field form-row--full">
              <textarea id="field-notes" class="form-field__textarea" placeholder=" " rows="3"></textarea>
              <label for="field-notes" class="form-field__label">${lang === 'ar' ? 'ملاحظات للتوصيل (اختياري)' : 'Notes pour la livraison (optionnel)'}</label>
            </div>
          </div>

          <!-- Shipping method -->
          <div class="checkout-card" id="card-delivery">
            <div class="checkout-card__header">
              <div class="checkout-card__icon">🚚</div>
              <div>
                <div class="checkout-card__title">${lang === 'ar' ? 'طريقة التوصيل' : 'Mode de livraison'}</div>
              </div>
            </div>

            <div class="shipping-options">
              <label class="radio-card selected" id="ship-standard">
                <input type="radio" name="shipping" value="standard" checked />
                <div class="radio-card__dot"></div>
                <div class="radio-card__body">
                  <div class="radio-card__title">🚚 ${lang === 'ar' ? 'توصيل قياسي' : 'Livraison standard'}</div>
                  <div class="radio-card__desc">${lang === 'ar' ? '3 – 5 أيام عمل' : '3 – 5 jours ouvrés'}</div>
                </div>
                <div class="radio-card__price">
                  ${summary.freeShipping ? `<span style="color:#2e7d55;">${lang === 'ar' ? 'مجاني' : 'Gratuit'}</span>` : formatPrice(39, lang)}
                </div>
              </label>

              <label class="radio-card" id="ship-express">
                <input type="radio" name="shipping" value="express" />
                <div class="radio-card__dot"></div>
                <div class="radio-card__body">
                  <div class="radio-card__title">⚡ ${lang === 'ar' ? 'توصيل سريع' : 'Livraison express'}</div>
                  <div class="radio-card__desc">${lang === 'ar' ? '24 – 48 ساعة' : '24 – 48 heures'}</div>
                </div>
                <div class="radio-card__price">${formatPrice(79, lang)}</div>
              </label>

              <label class="radio-card" id="ship-pickup">
                <input type="radio" name="shipping" value="pickup" />
                <div class="radio-card__dot"></div>
                <div class="radio-card__body">
                  <div class="radio-card__title">🏪 ${lang === 'ar' ? 'استلام من المتجر' : 'Retrait en boutique'}</div>
                  <div class="radio-card__desc">${lang === 'ar' ? 'الدار البيضاء – مراكش – الرباط' : 'Casablanca · Marrakech · Rabat'}</div>
                </div>
                <div class="radio-card__price" style="color:#2e7d55;">${lang === 'ar' ? 'مجاني' : 'Gratuit'}</div>
              </label>
            </div>
          </div>

          <!-- Submit -->
          <button class="checkout-submit" id="checkout-submit-btn">
            <span>🔒</span>
            <span>${lang === 'ar' ? 'تأكيد الطلب' : 'Confirmer ma commande'}</span>
          </button>

          <p style="text-align:center;font-size:var(--fs-xs);color:var(--color-text-muted);margin-top:var(--sp-3);">
            🔒 ${lang === 'ar' ? 'بياناتك محمية ومشفرة بالكامل' : 'Vos données sont protégées et chiffrées'}
          </p>
          `}
        </div>

        <!-- ── RIGHT: Summary ── -->
        <aside class="checkout-summary">
          <div class="checkout-summary__card">
            <div class="checkout-summary__header">
              🧾 ${lang === 'ar' ? 'ملخص الطلب' : 'Récapitulatif'} · ${summary.count} ${lang === 'ar' ? 'منتج' : 'article(s)'}
            </div>

            <div class="checkout-summary__items">
              ${summary.items.map(item => {
                const name = item.name?.[lang] ?? item.name?.fr ?? '';
                return `
                  <div class="summary-item">
                    <div class="summary-item__image">
                      ${item.emoji}
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

            <!-- Promo code -->
            <div class="promo-row">
              <input type="text" class="promo-row__input" id="promo-input"
                placeholder="${lang === 'ar' ? 'كود الخصم' : 'Code promo'}" />
              <button class="promo-row__btn" id="promo-btn">
                ${lang === 'ar' ? 'تطبيق' : 'Appliquer'}
              </button>
            </div>

            <div class="checkout-summary__totals">
              <div class="summary-row">
                <span>${lang === 'ar' ? 'المجموع الفرعي' : 'Sous-total'}</span>
                <span>${formatPrice(summary.subtotal, lang)}</span>
              </div>
              <div class="summary-row">
                <span>${lang === 'ar' ? 'الشحن' : 'Livraison'}</span>
                <span class="${summary.freeShipping ? 'summary-free' : ''}">
                  ${summary.freeShipping ? (lang === 'ar' ? 'مجاني' : 'Gratuit') : formatPrice(summary.shipping, lang)}
                </span>
              </div>
              <div class="summary-row summary-row--total">
                <span>${lang === 'ar' ? 'الإجمالي' : 'Total'}</span>
                <span class="summary-amount">${formatPrice(summary.total, lang)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  `;

  _bindCheckoutEvents(lang, summary);
}

// ── Form validation & events ──────────────────────────────────────────────────
function _bindCheckoutEvents(lang, summary) {
  // Shipping method radio cards
  document.querySelectorAll('.radio-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // Floating label helper for selects
  document.querySelectorAll('.form-field__select').forEach(sel => {
    sel.closest('.form-field')?.classList.add('has-value');
  });

  // Input float-label "has-value" on blur
  document.querySelectorAll('.form-field__input, .form-field__textarea').forEach(input => {
    input.addEventListener('input', () => {
      const field = input.closest('.form-field');
      field?.classList.toggle('has-value', input.value.trim() !== '');
    });
    // Restore on load
    if (input.value.trim()) {
      input.closest('.form-field')?.classList.add('has-value');
    }
  });

  // Promo code
  document.getElementById('promo-btn')?.addEventListener('click', () => {
    const code = document.getElementById('promo-input')?.value.trim().toUpperCase();
    if (code === 'LUMIERE10') {
      showToast(lang === 'ar' ? '🎉 تم تطبيق خصم 10%!' : '🎉 Réduction de 10% appliquée !', { type: 'success', icon: '🎉' });
    } else if (code) {
      showToast(lang === 'ar' ? '❌ كود غير صالح' : '❌ Code invalide', { type: 'error', icon: '❌' });
    }
  });

  // Submit
  document.getElementById('checkout-submit-btn')?.addEventListener('click', () => {
    if (summary.items.length === 0) return;

    const requiredFields = [
      { id: 'field-email',     test: v => /\S+@\S+\.\S+/.test(v) },
      { id: 'field-firstname', test: v => v.trim().length >= 2     },
      { id: 'field-lastname',  test: v => v.trim().length >= 2     },
      { id: 'field-address',   test: v => v.trim().length >= 5     },
      { id: 'field-city',      test: v => v.trim().length >= 2     },
    ];

    let valid = true;
    requiredFields.forEach(({ id, test }) => {
      const input = document.getElementById(id);
      if (!input) return;
      const ok = test(input.value);
      input.classList.toggle('error', !ok);
      if (!ok) { valid = false; input.focus(); }
    });

    if (!valid) {
      showToast(
        lang === 'ar' ? '⚠ يرجى ملء جميع الحقول المطلوبة' : '⚠ Veuillez remplir tous les champs requis',
        { type: 'error', icon: '⚠️' }
      );
      return;
    }

    // Simulate placing order
    const btn = document.getElementById('checkout-submit-btn');
    btn.disabled = true;
    btn.classList.add('checkout-submit--loading');
    btn.innerHTML = `<span class="spinner" style="display:inline-block;width:18px;height:18px;border:2.5px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.8s linear infinite;"></span> ${lang === 'ar' ? 'جارٍ المعالجة…' : 'Traitement…'}`;

    if (!document.getElementById('spin-style')) {
      const s = document.createElement('style');
      s.id = 'spin-style';
      s.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
      document.head.appendChild(s);
    }

    setTimeout(() => {
      cartStore.clear();
      currentStep = 2;
      renderConfirmation();
    }, 1800);
  });
}

// ── Confirmation screen ───────────────────────────────────────────────────────
function renderConfirmation() {
  const lang  = i18n.lang;
  const root  = document.getElementById('checkout-root');
  const order = `LUM-${Date.now().toString(36).toUpperCase().slice(-8)}`;

  // Update progress steps
  root.innerHTML = `
    <!-- Progress bar -->
    <div class="checkout-progress">
      <div class="checkout-progress__inner">
        <div class="checkout-step done">
          <div class="checkout-step__num">✓</div>
          <div class="checkout-step__label">${lang === 'ar' ? 'معلومات الشحن' : 'Livraison'}</div>
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
          ${lang === 'ar' ? 'تم تأكيد طلبك! 🎉' : 'Commande confirmée ! 🎉'}
        </h1>
        <div class="order-confirmed__number">
          ${lang === 'ar' ? 'رقم الطلب:' : 'Numéro de commande :'} <strong>${order}</strong>
        </div>
        <p class="order-confirmed__message">
          ${lang === 'ar'
            ? 'شكراً لتسوقك معنا! سنرسل لك تأكيداً على بريدك الإلكتروني مع تفاصيل تتبع شحنتك في أقرب وقت.'
            : 'Merci pour votre commande ! Vous recevrez un email de confirmation avec les détails de suivi de votre colis sous peu.'}
        </p>
        <div class="order-confirmed__ctas">
          <a href="index.html" class="btn btn--primary">
            ${lang === 'ar' ? 'مواصلة التسوق' : 'Continuer mes achats'}
          </a>
          <a href="index.html" class="btn btn--ghost">
            ${lang === 'ar' ? 'الرئيسية' : 'Retour à l\'accueil'}
          </a>
        </div>

        <!-- Confetti effect -->
        <div id="confetti-wrap" aria-hidden="true" style="position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:9999;"></div>
      </div>
    </div>
  `;

  // Confetti burst
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
  setTimeout(() => wrap.remove(), 4000);
}

// ── React to language change ──────────────────────────────────────────────────
document.addEventListener('langchange', () => renderCheckout());
document.addEventListener('cartchange', () => {
  // Update header cart count
  const badge = document.querySelector('.header__badge');
  if (badge) badge.textContent = cartStore.summary().count;
});

// ── Initial render ────────────────────────────────────────────────────────────
renderCheckout();
