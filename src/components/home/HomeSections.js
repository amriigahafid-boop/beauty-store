/**
 * HomeSections.js — Essential Luxury Store Homepage Sections
 * Lumière Beauty Store — src/components/home/HomeSections.js
 *
 * Strictly bound to active locale (`src/context/locales/`) and localized
 * product fields (`title[lang]` / `name[lang]`).
 * Listens to `langchange` and re-renders all 5 homepage sections cleanly.
 */

import products           from '../../data/products.data.js';
import cartStore          from '../../context/cartStore.js';
import i18n               from '../../context/i18n.js';
import { formatPrice }    from '../../utils/currency.js';
import { effectivePrice } from '../../services/productService.js';
import { showToast }      from '../cart/CartDrawer.js';

const FEATURED_BRANDS = [
  { name: 'Bioxcin',           origin: { fr: 'Laboratoire Dermatologique', ar: 'مختبر طبي للشعر' } },
  { name: 'The Bath Factory',  origin: { fr: 'Rituel Spa & Corps',         ar: 'طقوس السبا والجسم' } },
  { name: 'Morfose',           origin: { fr: 'Soin Professionnel',         ar: 'عناية احترافية للشعر' } },
  { name: 'The Ceel',          origin: { fr: 'Botanique Concentré',        ar: 'خلاصات نباتية مركزة' } },
  { name: 'Eyüp Sabri Tuncer', origin: { fr: 'Maison Fondée en 1923',      ar: 'تأسست عام 1923' } },
  { name: 'Dermokil',          origin: { fr: 'Dermo-Cosmétique',           ar: 'عناية طبية بالبشرة' } },
  { name: 'Bee Beauty',        origin: { fr: 'Beauté Sensorielle',         ar: 'جمال وعناية طبيعية' } },
  { name: "Let'scrub",         origin: { fr: 'Exfoliation Experte',        ar: 'تقشير وشد البشرة' } },
];

const DUO_BUNDLES = [
  {
    id: 'bundle-hair-anti-chute',
    productIds: ['bioxcin-collagen-biotin-shampoo', 'bioxcin-forte-anti-hair-loss-tonic'],
    discountPct: 15,
    badge: { fr: 'COFFRET ANTI-CHUTE • -15%', ar: 'باقة وقف التساقط • خصم 15%' },
    title: {
      fr: 'Protocole Intensif Anti-Chute & Volume Bioxcin',
      ar: 'البرنامج الطبي المكثف لوقف التساقط وتكثيف الشعر من Bioxcin',
    },
    desc: {
      fr: 'La synergie dermatologique complète : le Shampooing Volumateur Collagène & Biotine associé au Tonique Intensif Bioxcin Forte au complexe breveté B11 pour freiner la chute et stimuler la repousse.',
      ar: 'الثنائي الطبي المتكامل: شامبو الكولاجين والبيوتين لتكثيف الشعر مع بخاخ بيوكسين فورت المركز بمركب B11 لوقف التساقط الحاد وتحفيز إنبات البصيلات.',
    },
    saveBadge: { fr: 'Économisez 66,00 DH', ar: 'وفري 66,00 درهم' },
  },
  {
    id: 'bundle-body-vanilla-spa',
    productIds: ['the-bath-factory-sweet-vanilla-scrub', 'the-bath-factory-sweet-vanilla-mist'],
    discountPct: 15,
    badge: { fr: 'RITUEL SPA GOURMAND • -15%', ar: 'باقة السبا الفاخرة • خصم 15%' },
    title: {
      fr: 'Duo Corps & Cheveux Douce Vanille — The Bath Factory',
      ar: 'ثنائي الفانيليا الحلوة لتقشير وتعطير الجسم والشعر — The Bath Factory',
    },
    desc: {
      fr: 'Combinez le Gommage Corps au Beurre de Karité & Vanille avec la Brume Parfumée Corps & Cheveux assortie pour une peau divinement douce et un sillage gourmand longue durée.',
      ar: 'اجمعي بين مقشر الجسم بزبدة الشيا والفانيليا ومعطر الجسم والشعر من نفس المجموعة لنعومة مخملية فائقة وعطر دافئ وجذاب يدوم طوال اليوم.',
    },
    saveBadge: { fr: 'Économisez 55,00 DH', ar: 'وفري 55,00 درهم' },
  },
  {
    id: 'bundle-hair-repair-keratin',
    productIds: ['bioxcin-keratin-argan-shampoo', 'bioblas-kolajen-keratin-conditioner'],
    discountPct: 15,
    badge: { fr: 'RITUEL RÉPARATION • -15%', ar: 'روتين الترميم • -15%' },
    title: {
      fr: 'Duo Réparateur Kératine, Collagène & Argan',
      ar: 'ثنائي الترميم المكثف بالكيراتين والكولاجين والأركان',
    },
    desc: {
      fr: "L'alliance parfaite du Shampooing Réparateur Bioxcin à la Kératine & Argan et de l'Après-Shampooing Bioblas au Collagène pour nourrir, épaissir et réparer les cheveux abîmés dès le premier lavage.",
      ar: 'المزيج المثالي بين شامبو بيوكسين بالكيراتين والأركان وبلسم بيوبلاس بالكولاجين لتغذية وتكثيف وترميم الشعر التالف من أول غسلة.',
    },
    saveBadge: { fr: 'Économisez 42,00 DH', ar: 'وفري 42,00 درهم' },
  },
  {
    id: 'bundle-body-firming-brightening',
    productIds: ['letscrub-cold-effect-body-scrub', 'dermokil-kojic-acid-vitamin-c-lotion'],
    discountPct: 15,
    badge: { fr: 'RITUEL FERMETÉ & ÉCLAT • -15%', ar: 'روتين الشد والتفتيح • -15%' },
    title: {
      fr: 'Protocole Corps Fermeté & Éclat Unifié',
      ar: 'بروتوكول شد الجسم وتفتيح وتوحيد اللون',
    },
    desc: {
      fr: "Combinez l'effet cryo-raffermissant du Gommage Let'scrub au Menthol avec le Lait Éclaircissant Dermokil à l'Acide Kojique & Vitamine C pour une peau lisse, tonifiée et lumineuse.",
      ar: 'اجمعي بين قوة التبريد والشد لمقشر المنثول مع لوشن ديرموكيل بحمض الكوجيك وفيتامين C للحصول على بشرة مشدودة، ناعمة، وموحدة اللون.',
    },
    saveBadge: { fr: 'Économisez 60,00 DH', ar: 'وفري 60,00 درهم' },
  },
];

export default class HomeSections {
  constructor({ cartDrawer = null } = {}) {
    this._cartDrawer   = cartDrawer;
    this._topRoot      = null;
    this._bottomRoot   = null;
    this._langBound    = false;
    this._onLangChange = () => this._render();
  }

  mount({ topRoot, bottomRoot }) {
    this._topRoot    = typeof topRoot === 'string' ? document.querySelector(topRoot) : topRoot;
    this._bottomRoot = typeof bottomRoot === 'string' ? document.querySelector(bottomRoot) : bottomRoot;

    this._render();

    if (!this._langBound) {
      this._langBound = true;
      document.addEventListener('langchange', this._onLangChange);
    }

    return this;
  }

  _render() {
    const lang = i18n.lang;
    const isAr = lang === 'ar';

    if (this._topRoot) {
      this._topRoot.innerHTML = `
        ${this._renderConcernsSection(lang, isAr)}
        ${this._renderBrandsSection(lang)}
      `;
    }

    if (this._bottomRoot) {
      this._bottomRoot.innerHTML = `
        ${this._renderVideoSection()}
        ${this._renderBundlesSection(lang)}
        ${this._renderReviewsSection(isAr)}
        ${this._renderFaqSection()}
      `;
    }

    this._bindEvents();
  }

  // ── 1. Beauty Concerns / Ritual Finder ─────────────────────────────────────
  _renderConcernsSection(lang, isAr) {
    const concerns = i18n.t('homeSections.concerns.items') || [];
    const arrow    = isAr ? '←' : '→';

    return `
      <section class="hs-concerns" aria-label="${i18n.t('homeSections.concerns.ariaLabel')}">
        <div class="container">
          <div class="hs-head">
            <span class="hs-head__eyebrow" data-i18n="homeSections.concerns.eyebrow">${i18n.t('homeSections.concerns.eyebrow')}</span>
            <h2 class="hs-head__title" data-i18n="homeSections.concerns.title">${i18n.t('homeSections.concerns.title')}</h2>
          </div>

          <div class="hs-concerns__grid">
            ${(Array.isArray(concerns) ? concerns : []).map(c => `
              <a href="#${c.filter}" class="hs-concern-card" data-concern-filter="${c.filter}">
                <div class="hs-concern-card__thumb">
                  <img
                    src="${c.img}"
                    alt="${c.title}"
                    loading="lazy"
                    decoding="async"
                    onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src=this.getAttribute('src').replace('/public/','/');}"
                  />
                </div>
                <div class="hs-concern-card__body">
                  <span class="hs-concern-card__eyebrow">${c.eyebrow}</span>
                  <h3 class="hs-concern-card__title">${c.title}</h3>
                  <p class="hs-concern-card__desc">${c.desc}</p>
                  <span class="hs-concern-card__cta">${c.cta} ${arrow}</span>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // ── 2. Official Partner Brands Showcase (#brands) ──────────────────────────
  _renderBrandsSection(lang) {
    const singleUnit = i18n.t('homeSections.brands.itemSingle');
    const pluralUnit = i18n.t('homeSections.brands.itemPlural');

    return `
      <section class="hs-brands" id="brands" aria-label="${i18n.t('homeSections.brands.ariaLabel')}">
        <div class="container">
          <div class="hs-brands__box">
            <div class="hs-brands__header">
              <div>
                <span class="hs-head__eyebrow" data-i18n="homeSections.brands.eyebrow">${i18n.t('homeSections.brands.eyebrow')}</span>
                <h2 class="hs-head__title" data-i18n="homeSections.brands.title">${i18n.t('homeSections.brands.title')}</h2>
              </div>
              <p class="hs-brands__sub" data-i18n="homeSections.brands.subtitle">
                ${i18n.t('homeSections.brands.subtitle')}
              </p>
            </div>

            <div class="hs-brands__grid">
              ${FEATURED_BRANDS.map(b => {
                const count = products.filter(p => p.brand.toLowerCase() === b.name.toLowerCase()).length;
                const unit  = count > 1 ? pluralUnit : singleUnit;
                return `
                  <button
                    type="button"
                    class="hs-brand-pill"
                    data-brand-select="${b.name}"
                    aria-label="${b.name}"
                  >
                    <div class="hs-brand-pill__top">
                      <strong class="hs-brand-pill__name">${b.name}</strong>
                      <span class="hs-brand-pill__count">${count} ${unit}</span>
                    </div>
                    <span class="hs-brand-pill__origin">${b.origin[lang] ?? b.origin.fr}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ── 2b. Botanical Hair Ritual Promotional Video Section ────────────────────
  _renderVideoSection() {
    return `
      <section class="hs-video-ritual" aria-label="${i18n.t('homeSections.videoRitual.ariaLabel')}">
        <div class="container">
          <div class="hs-video-ritual__card">
            <div class="hs-video-ritual__header">
              <span class="hs-video-ritual__eyebrow" data-i18n="homeSections.videoRitual.eyebrow">${i18n.t('homeSections.videoRitual.eyebrow')}</span>
              <h2 class="hs-video-ritual__title" data-i18n="homeSections.videoRitual.title">${i18n.t('homeSections.videoRitual.title')}</h2>
              <p class="hs-video-ritual__subtitle" data-i18n="homeSections.videoRitual.subtitle">${i18n.t('homeSections.videoRitual.subtitle')}</p>
            </div>

            <div class="hs-video-ritual__frame" id="botanical-ritual-frame">
              <video
                id="botanical-ritual-video"
                class="hs-video-ritual__video"
                src="/videos/botanical-hair-ritual.mp4"
                autoplay
                muted
                loop
                playsinline
                webkit-playsinline
                preload="auto"
                disablePictureInPicture
              >
                <source src="/videos/botanical-hair-ritual.mp4" type="video/mp4" />
                <source src="public/videos/botanical-hair-ritual.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ── 3. Offres Privilèges & Coffrets Duo (#sale) ────────────────────────────
  _renderBundlesSection(lang) {
    const cardsHtml = DUO_BUNDLES.map(bundle => {
      const items = bundle.productIds
        .map(id => products.find(p => p.id === id))
        .filter(Boolean);

      if (items.length < 2) return '';

      const regularTotal = items.reduce((sum, p) => sum + effectivePrice(p), 0);
      const bundlePrice  = Math.round(regularTotal * (1 - bundle.discountPct / 100));
      const savedAmount  = regularTotal - bundlePrice;

      const t0 = items[0].title?.[lang] ?? items[0].name?.[lang] ?? items[0].title?.fr ?? items[0].name?.fr ?? '';
      const t1 = items[1].title?.[lang] ?? items[1].name?.[lang] ?? items[1].title?.fr ?? items[1].name?.fr ?? '';

      return `
        <article class="hs-bundle-card">
          <div class="hs-bundle-card__visuals">
            <span class="hs-bundle-card__badge">${bundle.badge[lang] ?? bundle.badge.fr}</span>

            <div class="hs-bundle-card__pair">
              <a href="product.html?id=${encodeURIComponent(items[0].id)}" class="hs-bundle-card__img-box">
                <img
                  src="${items[0].images.main}"
                  alt="${t0}"
                  loading="lazy"
                  decoding="async"
                  onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src=this.getAttribute('src').replace('/public/','/');}"
                />
              </a>
              <span class="hs-bundle-card__plus" aria-hidden="true">+</span>
              <a href="product.html?id=${encodeURIComponent(items[1].id)}" class="hs-bundle-card__img-box">
                <img
                  src="${items[1].images.main}"
                  alt="${t1}"
                  loading="lazy"
                  decoding="async"
                  onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src=this.getAttribute('src').replace('/public/','/');}"
                />
              </a>
            </div>
          </div>

          <div class="hs-bundle-card__content">
            <h3 class="hs-bundle-card__title">${bundle.title[lang] ?? bundle.title.fr}</h3>
            <p class="hs-bundle-card__desc">${bundle.desc[lang] ?? bundle.desc.fr}</p>

            <ul class="hs-bundle-card__included">
              ${items.map(item => {
                const iTitle = item.title?.[lang] ?? item.name?.[lang] ?? item.title?.fr ?? item.name?.fr ?? '';
                return `
                  <li>
                    <span aria-hidden="true">✓</span>
                    <a href="product.html?id=${encodeURIComponent(item.id)}">${iTitle}</a>
                  </li>
                `;
              }).join('')}
            </ul>

            <div class="hs-bundle-card__footer">
              <div class="hs-bundle-card__pricing">
                <div class="hs-bundle-card__price-row">
                  <span class="hs-bundle-card__price-now current-price">${formatPrice(bundlePrice, lang)}</span>
                  <span class="hs-bundle-card__price-old old-price">${formatPrice(regularTotal, lang)}</span>
                </div>
                <span class="hs-bundle-card__save">
                  ${bundle.saveBadge?.[lang] ?? i18n.t('homeSections.bundles.saveLabel', { amount: formatPrice(savedAmount, lang) })}
                </span>
              </div>

              <button
                type="button"
                class="hs-bundle-card__btn"
                data-bundle-id="${bundle.id}"
              >
                <span data-i18n="homeSections.bundles.addBundle">${i18n.t('homeSections.bundles.addBundle')}</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    return `
      <section class="hs-bundles" id="sale" aria-label="${i18n.t('homeSections.bundles.ariaLabel')}">
        <div class="container">
          <div class="hs-head">
            <span class="hs-head__eyebrow" data-i18n="homeSections.bundles.eyebrow">${i18n.t('homeSections.bundles.eyebrow')}</span>
            <h2 class="hs-head__title" data-i18n="homeSections.bundles.title">${i18n.t('homeSections.bundles.title')}</h2>
            <p class="hs-head__sub" data-i18n="homeSections.bundles.subtitle">
              ${i18n.t('homeSections.bundles.subtitle')}
            </p>
          </div>

          <div class="hs-bundles__grid">
            ${cardsHtml}
          </div>
        </div>
      </section>
    `;
  }

  // ── 4. Verified Moroccan Customer Reviews (#reviews) ───────────────────────
  _renderReviewsSection(isAr) {
    const reviews       = i18n.t('homeSections.reviews.items') || [];
    const verifiedLabel = i18n.t('homeSections.reviews.verifiedBadge');
    const arrow         = isAr ? '←' : '→';

    return `
      <section class="hs-reviews" id="reviews" aria-label="${i18n.t('homeSections.reviews.ariaLabel')}">
        <div class="container">
          <div class="hs-head">
            <span class="hs-head__eyebrow" data-i18n="homeSections.reviews.eyebrow">${i18n.t('homeSections.reviews.eyebrow')}</span>
            <h2 class="hs-head__title" data-i18n="homeSections.reviews.title">${i18n.t('homeSections.reviews.title')}</h2>
          </div>

          <div class="hs-reviews__grid">
            ${(Array.isArray(reviews) ? reviews : []).map(r => `
              <article class="hs-review-card">
                <div class="hs-review-card__top">
                  <span class="hs-review-card__stars" aria-hidden="true">★★★★★</span>
                  <span class="hs-review-card__badge">✓ <span data-i18n="homeSections.reviews.verifiedBadge">${verifiedLabel}</span></span>
                </div>
                <p class="hs-review-card__quote">“${r.quote}”</p>
                <div class="hs-review-card__meta">
                  <div class="hs-review-card__author">
                    <strong>${r.name}</strong>
                    <span>• ${r.city}</span>
                  </div>
                  <a href="product.html?id=${encodeURIComponent(r.productId)}" class="hs-review-card__product">
                    ${r.product} ${arrow}
                  </a>
                </div>
              </article>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // ── 5. Interactive FAQ Accordion (#faq) ────────────────────────────────────
  _renderFaqSection() {
    const faqs = i18n.t('homeSections.faq.items') || [];

    return `
      <section class="hs-faq" id="faq" aria-label="${i18n.t('homeSections.faq.ariaLabel')}">
        <div class="container">
          <div class="hs-faq__inner">
            <div class="hs-head">
              <span class="hs-head__eyebrow" data-i18n="homeSections.faq.eyebrow">${i18n.t('homeSections.faq.eyebrow')}</span>
              <h2 class="hs-head__title" data-i18n="homeSections.faq.title">${i18n.t('homeSections.faq.title')}</h2>
            </div>

            <div class="hs-faq__list">
              ${(Array.isArray(faqs) ? faqs : []).map((item, idx) => `
                <details class="hs-faq__item" ${idx === 0 ? 'open' : ''}>
                  <summary class="hs-faq__question">
                    <span>${item.q}</span>
                    <span class="hs-faq__icon" aria-hidden="true">+</span>
                  </summary>
                  <div class="hs-faq__answer">
                    <p>${item.a}</p>
                  </div>
                </details>
              `).join('')}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ── Bind Interactive Events ────────────────────────────────────────────────
  _bindEvents() {
    // Brand selection → dispatch custom 'brandfilter' event to ShopSection & scroll to #shop
    if (this._topRoot) {
      this._topRoot.querySelectorAll('[data-brand-select]').forEach(btn => {
        btn.addEventListener('click', () => {
          const brandName = btn.getAttribute('data-brand-select');
          document.dispatchEvent(new CustomEvent('brandfilter', { detail: { brand: brandName } }));
          document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
        });
      });
    }

    // Bundle Add-to-Cart (with 15% bundle discount applied)
    if (this._bottomRoot) {
      this._bottomRoot.querySelectorAll('[data-bundle-id]').forEach(btn => {
        btn.addEventListener('click', () => {
          const bundleId = btn.getAttribute('data-bundle-id');
          const bundle   = DUO_BUNDLES.find(b => b.id === bundleId);
          if (!bundle) return;

          const items = bundle.productIds
            .map(pid => products.find(item => item.id === pid))
            .filter(Boolean);

          if (items.length >= 2) {
            const r0           = effectivePrice(items[0]);
            const r1           = effectivePrice(items[1]);
            const regularTotal = r0 + r1;
            const bundlePrice  = Math.round(regularTotal * (1 - bundle.discountPct / 100));
            const price0       = Math.round(r0 * (1 - bundle.discountPct / 100));
            const price1       = bundlePrice - price0;

            cartStore.add(items[0], 1, null, { price: price0 });
            cartStore.add(items[1], 1, null, { price: price1 });
          } else {
            items.forEach(p => {
              const discounted = Math.round(effectivePrice(p) * (1 - bundle.discountPct / 100));
              cartStore.add(p, 1, null, { price: discounted });
            });
          }

          showToast(
            i18n.t('homeSections.bundles.addedToast'),
            { type: 'success', icon: '✦', duration: 2600 }
          );

          if (this._cartDrawer) this._cartDrawer.open();
        });
      });

      // Promotional Video: continuous ambient autoplay on iOS/Safari & Android/Desktop
      const videoEl = this._bottomRoot.querySelector('#botanical-ritual-video');

      if (videoEl) {
        const TRIM_START = 2.0;
        let initialTrimDone = false;

        // Programmatically enforce mute & inline attributes so iOS/Safari never blocks autoplay
        const enforceMutedInline = () => {
          videoEl.muted        = true;
          videoEl.defaultMuted = true;
          videoEl.volume       = 0;
          videoEl.playsInline  = true;
          videoEl.loop         = true;
          videoEl.autoplay     = true;
          videoEl.controls     = false;
          videoEl.setAttribute('muted', '');
          videoEl.setAttribute('autoplay', '');
          videoEl.setAttribute('loop', '');
          videoEl.setAttribute('playsinline', '');
          videoEl.setAttribute('webkit-playsinline', '');
          videoEl.removeAttribute('controls');
        };

        enforceMutedInline();

        const tryPlay = () => {
          enforceMutedInline();
          const playPromise = videoEl.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {});
          }
        };

        const startFromTrim = () => {
          enforceMutedInline();
          if (!initialTrimDone && videoEl.readyState >= 1) {
            initialTrimDone = true;
            try {
              if (Number.isFinite(videoEl.duration) && videoEl.duration > TRIM_START + 1) {
                videoEl.currentTime = TRIM_START;
              }
            } catch (_) {
              // Ignore if currentTime cannot be set yet
            }
          }
          tryPlay();
        };

        videoEl.addEventListener('loadedmetadata', startFromTrim);
        videoEl.addEventListener('loadeddata', startFromTrim);
        videoEl.addEventListener('canplay', startFromTrim);

        videoEl.addEventListener('play', () => {
          videoEl.muted  = true;
          videoEl.volume = 0;
        });

        videoEl.addEventListener('timeupdate', () => {
          if (
            Number.isFinite(videoEl.duration) &&
            videoEl.duration > TRIM_START &&
            videoEl.currentTime >= videoEl.duration - 0.12
          ) {
            try {
              videoEl.currentTime = TRIM_START;
            } catch (_) {}
            if (videoEl.paused) {
              tryPlay();
            }
          }
        });

        videoEl.addEventListener('ended', () => {
          try {
            videoEl.currentTime = TRIM_START;
          } catch (_) {}
          tryPlay();
        });

        videoEl.addEventListener('error', () => {
          if (!videoEl.dataset.fallbackTried) {
            videoEl.dataset.fallbackTried = '1';
            initialTrimDone = false;
            videoEl.src = 'public/videos/botanical-hair-ritual.mp4';
            videoEl.load();
            tryPlay();
          }
        });

        // IntersectionObserver ensures video autoplays immediately when scrolled into view
        if ('IntersectionObserver' in window) {
          const videoObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting && videoEl.paused) {
                tryPlay();
              }
            });
          }, { threshold: 0.1 });
          videoObserver.observe(videoEl);
        }

        // Fallback for strict iOS Low Power Mode / touch wakeup
        const unlockOnFirstInteraction = () => {
          if (videoEl.paused) {
            tryPlay();
          }
        };
        document.addEventListener('touchstart', unlockOnFirstInteraction, { once: true, passive: true });
        document.addEventListener('scroll', unlockOnFirstInteraction, { once: true, passive: true });

        if (videoEl.readyState >= 1) {
          startFromTrim();
        } else {
          tryPlay();
        }
      }
    }
  }
}
