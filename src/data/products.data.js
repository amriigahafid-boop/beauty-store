/**
 * products.data.js — Sample Beauty Product Catalogue
 * Beauty Store — src/data/products.data.js
 *
 * 16 hand-crafted sample products across Skincare, Makeup,
 * Perfumes, Haircare, Body and Tools categories.
 *
 * All prices are in MAD (Moroccan Dirham).
 * All names / descriptions are bilingual (fr + ar).
 */

import {
  createProduct,
  CATEGORIES,
  BADGES,
  STOCK_STATUS,
} from '../utils/productSchema.js';

// ─────────────────────────────────────────────────────────────────────────────
// SKINCARE
// ─────────────────────────────────────────────────────────────────────────────

const serumEclat = createProduct({
  id:          'serum-eclat-rose',
  sku:         'SK-SER-001',
  name:        { fr: 'Sérum Éclat Rose',      ar: 'سيروم توهج الورد' },
  tagline:     { fr: 'Luminosité instantanée', ar: 'إشراق فوري' },
  description: {
    fr: 'Un sérum concentré en vitamine C et extrait de rose du Maroc qui unifie le teint, estompe les taches et révèle un éclat naturel dès la première application. Texture sérum légère, non grasse, convient à tous les types de peau.',
    ar: 'سيروم مركّز بفيتامين C ومستخلص الورد المغربي يوحّد لون البشرة ويُخفّف البقع ويكشف الإشراق الطبيعي منذ التطبيق الأول. قوام خفيف غير دهني، مناسب لجميع أنواع البشرة.',
  },
  category:    CATEGORIES.SKINCARE,
  subcategory: 'serums',
  brand:       'Lumière',
  images: {
    main:    'public/images/products/serum-eclat-rose.jpg',
    gallery: [
      'public/images/products/serum-eclat-rose-2.jpg',
      'public/images/products/serum-eclat-rose-texture.jpg',
    ],
    alt: { fr: 'Sérum Éclat Rose – flacon 30 ml', ar: 'سيروم توهج الورد – زجاجة 30 مل' },
  },
  price:       { regular: 249, sale: 199 },
  stock:       { qty: 42, status: STOCK_STATUS.IN_STOCK },
  rating:      { average: 4.8, count: 1247 },
  tags:        ['vitamine-c', 'eclat', 'rose', 'anti-taches', 'soin-quotidien'],
  badges:      [BADGES.BESTSELLER, BADGES.SALE],
  ingredients: ['Vitamine C (15%)', 'Extrait de Rose de Damas', 'Acide Hyaluronique', 'Niacinamide'],
  variants:    [{ id: 'size-30', label: '30 ml', size: '30ml', price: 249 },
                { id: 'size-50', label: '50 ml', size: '50ml', price: 369 }],
});

const cremePerfecting = createProduct({
  id:          'creme-perfectrice-argan',
  sku:         'SK-CRM-002',
  name:        { fr: 'Crème Perfectrice à l\'Argan',  ar: 'كريم مثالي بزيت الأرغان' },
  tagline:     { fr: 'Hydratation intense 72h',        ar: 'ترطيب مكثف 72 ساعة' },
  description: {
    fr: 'Enrichie en huile d\'argan bio du Maroc et en beurre de karité, cette crème prodige nourrit en profondeur, lisse les ridules et offre une hydratation longue durée de 72 heures. Fini satiné, sans effet gras.',
    ar: 'مُخصَّبة بزيت الأرغان العضوي المغربي وزبدة الشيا، تغذّي هذه الكريمة المعجزة البشرة في العمق وتُنعّم الخطوط الدقيقة وتوفر ترطيباً طويل الأمد لمدة 72 ساعة. إنهاء ساتان دون أثر دهني.',
  },
  category:    CATEGORIES.SKINCARE,
  subcategory: 'moisturisers',
  brand:       'Lumière',
  images: {
    main:    'public/images/products/creme-argan.jpg',
    gallery: ['public/images/products/creme-argan-2.jpg'],
    alt: { fr: 'Crème Argan – pot 50 ml', ar: 'كريم الأرغان – وعاء 50 مل' },
  },
  price:       { regular: 189 },
  stock:       { qty: 78, status: STOCK_STATUS.IN_STOCK },
  rating:      { average: 4.7, count: 892 },
  tags:        ['argan', 'hydratation', 'bio', 'marocain', 'anti-age'],
  badges:      [BADGES.NATURAL, BADGES.VEGAN],
  ingredients: ['Huile d\'Argan BIO (8%)', 'Beurre de Karité', 'Squalane végétal', 'Bêta-glucane'],
});

const masqueArgile = createProduct({
  id:          'masque-argile-rose',
  sku:         'SK-MSK-003',
  name:        { fr: 'Masque Purifiant Argile Rose',   ar: 'قناع تنقية بالطين الوردي' },
  tagline:     { fr: 'Pores resserrés, teint net',     ar: 'مسام مضيّقة وبشرة نقية' },
  description: {
    fr: 'Formulé avec l\'argile ghassoul du Maroc et la rose de Damas, ce masque purifie en douceur, resserre les pores dilatés et absorbe l\'excès de sébum. Idéal pour les peaux mixtes à grasses. Utiliser 1 à 2 fois par semaine.',
    ar: 'مُركَّب بطين الغاسول المغربي وورد الدمشق، يُنقّي هذا القناع البشرة بلطف ويُضيّق المسام المتوسّعة ويمتص الزهم الزائد. مثالي للبشرة المختلطة إلى الدهنية. يُستخدم مرة إلى مرتين أسبوعياً.',
  },
  category:    CATEGORIES.SKINCARE,
  subcategory: 'masks',
  brand:       'Lumière',
  images: {
    main:    'public/images/products/masque-argile.jpg',
    gallery: ['public/images/products/masque-argile-2.jpg'],
    alt: { fr: 'Masque Argile Rose – tube 75 ml', ar: 'قناع الطين الوردي – أنبوب 75 مل' },
  },
  price:       { regular: 139, sale: 119 },
  stock:       { qty: 55, status: STOCK_STATUS.IN_STOCK },
  rating:      { average: 4.6, count: 634 },
  tags:        ['ghassoul', 'argile', 'purification', 'pores', 'soin-hebdomadaire'],
  badges:      [BADGES.NATURAL, BADGES.SALE],
  ingredients: ['Argile Ghassoul (25%)', 'Extrait de Rose', 'Kaolin', 'Eau Florale de Rose'],
});

const spfProtecteur = createProduct({
  id:          'spf50-fluide-protecteur',
  sku:         'SK-SPF-004',
  name:        { fr: 'Fluide Protecteur SPF 50+',    ar: 'سائل واقي الشمس SPF 50+' },
  tagline:     { fr: 'Protection solaire invisible',  ar: 'حماية شمسية غير مرئية' },
  description: {
    fr: 'Une protection solaire très haute indice SPF 50+ à la texture ultra-légère et invisible. Formule résistante à l\'eau, enrichie en antioxydants, protège contre les UVA/UVB et la pollution. Fini mat, idéal sous le maquillage.',
    ar: 'واقٍ شمسي عالي الدرجة SPF 50+ بقوام خفيف للغاية وغير مرئي. تركيبة مقاومة للماء، مخصَّبة بمضادات الأكسدة، تحمي من الأشعة فوق البنفسجية UVA/UVB والتلوث. إنهاء مطفّي، مثالي تحت المكياج.',
  },
  category:    CATEGORIES.SKINCARE,
  subcategory: 'sun-care',
  brand:       'Lumière',
  images: {
    main:    'public/images/products/spf50-fluide.jpg',
    gallery: [],
    alt: { fr: 'Fluide SPF 50+ – 40 ml', ar: 'سائل SPF 50+ – 40 مل' },
  },
  price:       { regular: 169 },
  stock:       { qty: 120, status: STOCK_STATUS.IN_STOCK },
  rating:      { average: 4.9, count: 2103 },
  tags:        ['spf', 'solaire', 'protection', 'anti-pollution', 'quotidien'],
  badges:      [BADGES.BESTSELLER, BADGES.NEW],
  ingredients: ['Filtre UV Organique SPF 50+', 'Niacinamide', 'Vitamine E', 'Extrait de Thé Vert'],
});

// ─────────────────────────────────────────────────────────────────────────────
// MAKEUP
// ─────────────────────────────────────────────────────────────────────────────

const fondTeint = createProduct({
  id:          'fond-teint-velours',
  sku:         'MK-FDT-005',
  name:        { fr: 'Fond de Teint Velours Longue Tenue', ar: 'كريم أساس مخملي طويل الثبات' },
  tagline:     { fr: '24h de perfection mat',              ar: '24 ساعة من الكمال المطفّي' },
  description: {
    fr: 'Ce fond de teint couvrance modulable offre un fini velours mat impeccable pendant 24 heures. Sa formule légère aux pigments fins s\'adapte à tous les types de peau et résiste à la chaleur et à l\'humidité. Disponible en 10 teintes.',
    ar: 'يمنح كريم الأساس هذا القابل للتعديل في التغطية إنهاءً مخملياً ومطفّياً لمدة 24 ساعة. تركيبته الخفيفة بالأصباغ الدقيقة تتكيّف مع جميع أنواع البشرة وتقاوم الحرارة والرطوبة. متوفر بـ 10 درجات لونية.',
  },
  category:    CATEGORIES.MAKEUP,
  subcategory: 'face',
  brand:       'Lumière',
  images: {
    main:    'public/images/products/fond-teint-velours.jpg',
    gallery: ['public/images/products/fond-teint-velours-shades.jpg'],
    alt: { fr: 'Fond de Teint Velours – 30 ml', ar: 'كريم الأساس المخملي – 30 مل' },
  },
  price:       { regular: 219 },
  stock:       { qty: 96, status: STOCK_STATUS.IN_STOCK },
  rating:      { average: 4.7, count: 1548 },
  tags:        ['fond-de-teint', 'mat', 'longue-tenue', 'couvrance'],
  badges:      [BADGES.BESTSELLER],
  ingredients: ['Pigments minéraux', 'Poudre de soie', 'SPF 15'],
  variants: [
    { id: 'n10', label: 'N10 – Ivoire',    color: '#F5E6D3' },
    { id: 'n20', label: 'N20 – Naturel',   color: '#EDD5B3' },
    { id: 'n30', label: 'N30 – Beige',     color: '#D4A574' },
    { id: 'n40', label: 'N40 – Caramel',   color: '#C68642' },
    { id: 'n50', label: 'N50 – Moka',      color: '#8D5524' },
    { id: 'n60', label: 'N60 – Chocolat',  color: '#5C3317' },
  ],
});

const rougeLevre = createProduct({
  id:          'rouge-levres-satin-rose',
  sku:         'MK-RGL-006',
  name:        { fr: 'Rouge à Lèvres Satin Rose',  ar: 'أحمر شفاه ساتان وردي' },
  tagline:     { fr: 'Couleur intense, confort total', ar: 'لون مكثف وراحة تامة' },
  description: {
    fr: 'Un rouge à lèvres satiné à la texture crémeuse et fondante enrichi en huile de rose et en vitamine E. Tenue confortable jusqu\'à 8 heures, ne dessèche pas les lèvres. Formule végane, sans paraben.',
    ar: 'أحمر شفاه ساتان بقوام كريمي ناعم مخصَّب بزيت الورد وفيتامين E. ثبات مريح حتى 8 ساعات دون تجفيف الشفتين. تركيبة نباتية خالية من البارابين.',
  },
  category:    CATEGORIES.MAKEUP,
  subcategory: 'lips',
  brand:       'Lumière',
  images: {
    main:    'public/images/products/rouge-levres-rose.jpg',
    gallery: [],
    alt: { fr: 'Rouge à Lèvres Satin – 3.5 g', ar: 'أحمر الشفاه الساتان – 3.5 غ' },
  },
  price:       { regular: 129 },
  stock:       { qty: 200, status: STOCK_STATUS.IN_STOCK },
  rating:      { average: 4.5, count: 987 },
  tags:        ['rouge-a-levres', 'satin', 'vegan', 'rose', 'levres'],
  badges:      [BADGES.VEGAN],
  ingredients: ['Huile de Rose', 'Vitamine E', 'Cire de Carnauba'],
  variants: [
    { id: 'rose-nude',     label: 'Rose Nude',     color: '#C4927A' },
    { id: 'rose-tendre',   label: 'Rose Tendre',   color: '#E8A0A0' },
    { id: 'rose-framboise',label: 'Framboise',     color: '#C0306E' },
    { id: 'rouge-cerise',  label: 'Rouge Cerise',  color: '#C0143C' },
    { id: 'rose-mauve',    label: 'Rose Mauve',    color: '#916B8A' },
  ],
});

const paletteFards = createProduct({
  id:          'palette-yeux-sables-dores',
  sku:         'MK-PLT-007',
  name:        { fr: 'Palette Yeux Sables Dorés',    ar: 'باليت عيون الرمال الذهبية' },
  tagline:     { fr: '12 teintes chaudes & dorées',   ar: '12 درجة دافئة وذهبية' },
  description: {
    fr: 'Une palette de 12 ombres à paupières aux teintes chaudes et dorées inspirées des sables du Sahara marocain. Textures variées — mat, satiné et pailleté — pour des looks du quotidien au sophistiqué. Pigmentation intense, longue tenue.',
    ar: 'باليت من 12 ظلاً للجفون بدرجات دافئة وذهبية مستوحاة من رمال الصحراء المغربية. ملمس متنوع — مطفّي، ساتان ومُلمّع — لإطلالات تتراوح بين اليومية والراقية. تلوين مكثف وثبات طويل.',
  },
  category:    CATEGORIES.MAKEUP,
  subcategory: 'eyes',
  brand:       'Lumière',
  images: {
    main:    'public/images/products/palette-sables.jpg',
    gallery: ['public/images/products/palette-sables-open.jpg'],
    alt: { fr: 'Palette Sables Dorés – 12 teintes', ar: 'باليت الرمال الذهبية – 12 درجة' },
  },
  price:       { regular: 299, sale: 249 },
  stock:       { qty: 38, status: STOCK_STATUS.IN_STOCK },
  rating:      { average: 4.9, count: 3211 },
  tags:        ['palette', 'yeux', 'dores', 'sahara', 'smoky'],
  badges:      [BADGES.BESTSELLER, BADGES.SALE, BADGES.EXCLUSIVE],
  ingredients: ['Talc', 'Mica', 'Pigments minéraux', 'Triisononanoïne'],
});

// ─────────────────────────────────────────────────────────────────────────────
// PERFUMES
// ─────────────────────────────────────────────────────────────────────────────

const parfumRose = createProduct({
  id:          'parfum-rose-orient',
  sku:         'PF-EDP-008',
  name:        { fr: 'Eau de Parfum Rose Orient',   ar: 'عطر وردة الشرق' },
  tagline:     { fr: 'L\'essence de la Médina',    ar: 'عبق المدينة العتيقة' },
  description: {
    fr: 'Un voyage olfactif au cœur de Marrakech. Cette eau de parfum ouvre sur des notes pétillantes de bergamote et d\'orange amère, avant de dévoiler un cœur envoûtant de rose de Damas et de jasmin. Le fond boisé de oud marocain et de musc blanc laisse une sillage inoubliable.',
    ar: 'رحلة عطرية في قلب مراكش. يفتح هذا العطر بنوتات منعشة من البرغموت والبرتقال المرّ، قبل أن يكشف عن قلب ساحر من الورد الدمشقي والياسمين. القاعدة الخشبية من العود المغربي والمسك الأبيض تترك أثراً لا يُنسى.',
  },
  category:    CATEGORIES.PERFUMES,
  subcategory: 'eau-de-parfum',
  brand:       'Lumière',
  images: {
    main:    'public/images/products/parfum-rose-orient.jpg',
    gallery: ['public/images/products/parfum-rose-orient-2.jpg'],
    alt: { fr: 'Eau de Parfum Rose Orient – 50 ml', ar: 'عطر وردة الشرق – 50 مل' },
  },
  price:       { regular: 599 },
  stock:       { qty: 25, status: STOCK_STATUS.IN_STOCK },
  rating:      { average: 4.9, count: 879 },
  tags:        ['parfum', 'rose', 'oud', 'oriental', 'marrakech', 'luxe'],
  badges:      [BADGES.EXCLUSIVE, BADGES.BESTSELLER],
  ingredients: ['Bergamote', 'Orange Amère', 'Rose de Damas', 'Jasmin', 'Oud Marocain', 'Musc Blanc'],
  variants: [
    { id: 'edp-30',  label: '30 ml',  size: '30ml',  price: 349 },
    { id: 'edp-50',  label: '50 ml',  size: '50ml',  price: 599 },
    { id: 'edp-100', label: '100 ml', size: '100ml', price: 899 },
  ],
});

const parfumAmbre = createProduct({
  id:          'parfum-ambre-musk',
  sku:         'PF-EDP-009',
  name:        { fr: 'Ambre & Musc Précieux',        ar: 'عنبر ومسك نفيس' },
  tagline:     { fr: 'Chaleur sensuelle, sillage envoûtant', ar: 'دفء حسّي وأثر ساحر' },
  description: {
    fr: 'Un parfum oriental généreux et enveloppant qui allie l\'ambre chaud aux notes crémeuses de musc blanc et de vanille du Madagascar. Un accord boisé de cèdre et de santal en fond apporte profondeur et élégance. Convient aussi bien aux femmes qu\'aux hommes.',
    ar: 'عطر شرقي كريم ومُلفِّف يجمع بين العنبر الدافئ ونوتات كريمية من المسك الأبيض والفانيليا الغنية. قاعدة خشبية من خشب الأرز والصندل تضفي عمقاً وأناقة. مناسب للمرأة والرجل على حدٍّ سواء.',
  },
  category:    CATEGORIES.PERFUMES,
  subcategory: 'eau-de-parfum',
  brand:       'Lumière',
  images: {
    main:    'public/images/products/parfum-ambre.jpg',
    gallery: [],
    alt: { fr: 'Ambre & Musc – 75 ml', ar: 'عنبر ومسك – 75 مل' },
  },
  price:       { regular: 479, sale: 399 },
  stock:       { qty: 4, status: STOCK_STATUS.LOW_STOCK },
  rating:      { average: 4.8, count: 651 },
  tags:        ['ambre', 'musc', 'oriental', 'mixte', 'vanille', 'boise'],
  badges:      [BADGES.SALE, BADGES.LIMITED],
  ingredients: ['Ambre Gris', 'Musc Blanc', 'Vanille de Madagascar', 'Cèdre de l\'Atlas', 'Santal'],
  variants: [
    { id: 'edp-30',  label: '30 ml',  size: '30ml',  price: 299 },
    { id: 'edp-75',  label: '75 ml',  size: '75ml',  price: 479 },
  ],
});

// ─────────────────────────────────────────────────────────────────────────────
// HAIRCARE
// ─────────────────────────────────────────────────────────────────────────────

const masqueCheveux = createProduct({
  id:          'masque-cheveux-argan-keratin',
  sku:         'HC-MSK-010',
  name:        { fr: 'Masque Réparateur Argan & Kératine', ar: 'قناع ترميمي بالأرغان والكيراتين' },
  tagline:     { fr: 'Cheveux transformés en une application', ar: 'شعر متحوّل بتطبيق واحد' },
  description: {
    fr: 'Un masque capillaire intensif enrichi en huile d\'argan du Maroc et en kératine végétale qui répare en profondeur les cheveux abîmés, élimine le frisottis et restaure la brillance. Résultat lissant et soyeux dès la première utilisation. Idéal pour cheveux colorés ou traités.',
    ar: 'قناع للشعر مكثف مخصَّب بزيت الأرغان المغربي والكيراتين النباتي يُرمّم الشعر التالف في العمق ويُزيل التجعّد ويُعيد البريق. نتيجة مُمَلِّسة وحريرية منذ الاستخدام الأول. مثالي للشعر المصبوغ أو المعالَج.',
  },
  category:    CATEGORIES.HAIRCARE,
  subcategory: 'masks',
  brand:       'Lumière',
  images: {
    main:    'public/images/products/masque-cheveux-argan.jpg',
    gallery: [],
    alt: { fr: 'Masque Cheveux Argan – 200 ml', ar: 'قناع شعر الأرغان – 200 مل' },
  },
  price:       { regular: 179 },
  stock:       { qty: 67, status: STOCK_STATUS.IN_STOCK },
  rating:      { average: 4.7, count: 1023 },
  tags:        ['masque-capillaire', 'argan', 'keratine', 'cheveux-abimes', 'lissant'],
  badges:      [BADGES.NATURAL, BADGES.BESTSELLER],
  ingredients: ['Huile d\'Argan BIO', 'Kératine Végétale', 'Protéines de Soie', 'Panthénol'],
  variants: [
    { id: 'hc-200', label: '200 ml', size: '200ml', price: 179 },
    { id: 'hc-500', label: '500 ml', size: '500ml', price: 349 },
  ],
});

const huileSublime = createProduct({
  id:          'huile-cheveux-5-huiles',
  sku:         'HC-OIL-011',
  name:        { fr: 'Huile Sublime 5 Précieuses',   ar: 'زيت فاخر بـ5 زيوت نفيسة' },
  tagline:     { fr: 'Brillance & légèreté absolues',ar: 'بريق وخفة مطلقة' },
  description: {
    fr: 'Un cocktail luxueux de 5 huiles précieuses — argan, rose musquée, jojoba, amande douce et baobab — qui nourrit, protège et sublime chaque type de cheveux. S\'utilise avant ou après le shampooing, sur cheveux secs ou humides.',
    ar: 'خليط فاخر من 5 زيوت نفيسة — الأرغان، الورد المسكي، الجوجوبا، اللوز الحلو والبابايا — يغذّي ويحمي ويُجمّل كل أنواع الشعر. يُستخدم قبل الشامبو أو بعده، على الشعر الجاف أو الرطب.',
  },
  category:    CATEGORIES.HAIRCARE,
  subcategory: 'oils',
  brand:       'Lumière',
  images: {
    main:    'public/images/products/huile-sublime.jpg',
    gallery: [],
    alt: { fr: 'Huile Sublime – 100 ml', ar: 'زيت فاخر – 100 مل' },
  },
  price:       { regular: 199 },
  stock:       { qty: 0, status: STOCK_STATUS.OUT_OF_STOCK },
  rating:      { average: 4.9, count: 2766 },
  tags:        ['huile-capillaire', 'argan', 'brillance', 'multi-usage', 'luxe'],
  badges:      [BADGES.BESTSELLER, BADGES.NATURAL],
  ingredients: ['Huile d\'Argan', 'Huile de Rose Musquée', 'Huile de Jojoba', 'Huile de Baobab'],
});

// ─────────────────────────────────────────────────────────────────────────────
// BODY
// ─────────────────────────────────────────────────────────────────────────────

const gelDouche = createProduct({
  id:          'gel-douche-fleur-oranger',
  sku:         'BD-GDC-012',
  name:        { fr: 'Gel Douche Fleur d\'Oranger',   ar: 'جل الاستحمام بزهر البرتقال' },
  tagline:     { fr: 'Un bain de fleurs chaque matin', ar: 'حمام من الزهور كل صباح' },
  description: {
    fr: 'Un gel douche onctueux parfumé à la fleur d\'oranger de Marrakech, enrichi en eau florale biologique. Sa mousse généreuse nettoie en douceur, nourrit et laisse la peau délicatement parfumée et veloutée. Sans sulfates agressifs, pH équilibré.',
    ar: 'جل استحمام كريمي بعطر زهر البرتقال من مراكش، مخصَّب بالماء الزهري العضوي. رغوته الغنية تنظّف بلطف وتغذّي وتترك البشرة معطّرة بنعومة وناعمة. خالٍ من الكبريتات القاسية، بـ pH متوازن.',
  },
  category:    CATEGORIES.BODY,
  subcategory: 'shower',
  brand:       'Lumière',
  images: {
    main:    'public/images/products/gel-douche-oranger.jpg',
    gallery: [],
    alt: { fr: 'Gel Douche Fleur d\'Oranger – 250 ml', ar: 'جل زهر البرتقال – 250 مل' },
  },
  price:       { regular: 89 },
  stock:       { qty: 150, status: STOCK_STATUS.IN_STOCK },
  rating:      { average: 4.6, count: 543 },
  tags:        ['gel-douche', 'fleur-oranger', 'marrakech', 'sans-sulfates', 'vegan'],
  badges:      [BADGES.VEGAN, BADGES.NATURAL, BADGES.NEW],
  ingredients: ['Eau Florale de Fleur d\'Oranger BIO', 'Glycérine végétale', 'Aloe vera'],
  variants: [
    { id: 'bd-250',  label: '250 ml', size: '250ml', price: 89  },
    { id: 'bd-500',  label: '500 ml', size: '500ml', price: 149 },
  ],
});

const beurreCorps = createProduct({
  id:          'beurre-corps-rose-henne',
  sku:         'BD-BCO-013',
  name:        { fr: 'Beurre Corps Rose & Henné',   ar: 'زبدة الجسم بالورد والحناء' },
  tagline:     { fr: 'Peau nourrie, parfumée & satinée', ar: 'بشرة مغذّاة ومعطّرة وناعمة' },
  description: {
    fr: 'Un beurre corps riche et enveloppant inspiré des rituels de hammam marocain. Formulé avec de l\'extrait de rose de Damas et de l\'huile de henné, il nourrit intensément la peau sèche, renforce sa barrière cutanée et la parfume délicatement. Texture fondante, absorption rapide.',
    ar: 'زبدة جسم غنية وملفّفة مستوحاة من طقوس الحمام المغربي. مُركَّبة بمستخلص الورد الدمشقي وزيت الحناء، تغذّي البشرة الجافة بعمق وتُقوّي حاجزها الجلدي وتعطّرها بلطف. قوام منصهر وامتصاص سريع.',
  },
  category:    CATEGORIES.BODY,
  subcategory: 'moisturisers',
  brand:       'Lumière',
  images: {
    main:    'public/images/products/beurre-corps-rose.jpg',
    gallery: [],
    alt: { fr: 'Beurre Corps Rose & Henné – 200 ml', ar: 'زبدة الجسم بالورد والحناء – 200 مل' },
  },
  price:       { regular: 149 },
  stock:       { qty: 88, status: STOCK_STATUS.IN_STOCK },
  rating:      { average: 4.8, count: 712 },
  tags:        ['beurre-corps', 'hammam', 'rose', 'henne', 'peau-seche'],
  badges:      [BADGES.NATURAL],
  ingredients: ['Extrait de Rose de Damas', 'Huile de Henné', 'Beurre de Karité', 'Beurre de Mangue'],
});

// ─────────────────────────────────────────────────────────────────────────────
// TOOLS & ACCESSORIES
// ─────────────────────────────────────────────────────────────────────────────

const pinceauKabuki = createProduct({
  id:          'pinceau-kabuki-pro',
  sku:         'TL-BRS-014',
  name:        { fr: 'Pinceau Kabuki Pro',        ar: 'فرشاة كابوكي احترافية' },
  tagline:     { fr: 'Application parfaite, fini professionnel', ar: 'تطبيق مثالي وإنهاء احترافي' },
  description: {
    fr: 'Un pinceau kabuki professionnel aux poils synthétiques ultra-doux, conçu pour une application fluide et homogène de la poudre, du fond de teint et du contouring. Manche ergonomique en bois naturel huilé. Poils résistants à la déformation, faciles à nettoyer.',
    ar: 'فرشاة كابوكي احترافية بألياف اصطناعية ناعمة للغاية، مُصمَّمة لتطبيق سلس ومتجانس للبودر وكريم الأساس والكونتور. مقبض مريح من الخشب الطبيعي المزيَّت. ألياف مقاومة للتشوّه وسهلة التنظيف.',
  },
  category:    CATEGORIES.TOOLS,
  subcategory: 'brushes',
  brand:       'Lumière',
  images: {
    main:    'public/images/products/pinceau-kabuki.jpg',
    gallery: [],
    alt: { fr: 'Pinceau Kabuki Pro', ar: 'فرشاة كابوكي احترافية' },
  },
  price:       { regular: 159 },
  stock:       { qty: 34, status: STOCK_STATUS.IN_STOCK },
  rating:      { average: 4.7, count: 421 },
  tags:        ['pinceau', 'kabuki', 'maquillage', 'professionnel', 'bois'],
  badges:      [BADGES.NEW],
  ingredients: [],
});

const galetMassage = createProduct({
  id:          'galet-massage-gua-sha-rose',
  sku:         'TL-GSH-015',
  name:        { fr: 'Gua Sha en Quartz Rose',    ar: 'حجر جوا شا من الكوارتز الوردي' },
  tagline:     { fr: 'Rituel sculptant anti-âge',  ar: 'طقس نحت مضاد للشيخوخة' },
  description: {
    fr: 'Un gua sha sculpté dans du quartz rose naturel pour drainer, décontracter et redessiner les contours du visage. Ce rituel ancestral stimule la microcirculation, atténue les poches et les tensions musculaires. Livré avec un guide de massage illustré.',
    ar: 'حجر جوا شا منحوت من الكوارتز الوردي الطبيعي لتصريف السموم والاسترخاء وإعادة رسم ملامح الوجه. يُحفّز هذا الطقس العريق الدورة الدموية الدقيقة ويُخفّف الانتفاخ والتوترات العضلية. يأتي مع دليل مصوَّر للتدليك.',
  },
  category:    CATEGORIES.TOOLS,
  subcategory: 'facial-tools',
  brand:       'Lumière',
  images: {
    main:    'public/images/products/gua-sha-rose.jpg',
    gallery: [],
    alt: { fr: 'Gua Sha Quartz Rose', ar: 'حجر جوا شا الكوارتز الوردي' },
  },
  price:       { regular: 119 },
  stock:       { qty: 60, status: STOCK_STATUS.IN_STOCK },
  rating:      { average: 4.8, count: 856 },
  tags:        ['gua-sha', 'quartz-rose', 'massage', 'drainage', 'rituel'],
  badges:      [BADGES.BESTSELLER, BADGES.NEW],
  ingredients: [],
});

const rollOrFeicial = createProduct({
  id:          'roll-on-jade-facial',
  sku:         'TL-JRL-016',
  name:        { fr: 'Rouleau Facial Jade',            ar: 'بكرة الوجه من الجاد' },
  tagline:     { fr: 'Détente & luminosité en 5 min',  ar: 'استرخاء وإشراق في 5 دقائق' },
  description: {
    fr: 'Un rouleau facial en pierre de jade véritable, idéal pour masser le sérum et la crème en profondeur, dégonfler le visage le matin et stimuler l\'éclat naturel. Double tête (grande & petite) pour s\'adapter à toutes les zones du visage. Effet froid apaisant.',
    ar: 'بكرة للوجه من حجر الجاد الأصيل، مثالية لتدليك السيروم والكريم في العمق وتخفيف انتفاخ الوجه صباحاً وتحفيز الإشراق الطبيعي. رأس مزدوج (كبير وصغير) للتكيّف مع جميع مناطق الوجه. تأثير بارد مهدئ.',
  },
  category:    CATEGORIES.TOOLS,
  subcategory: 'facial-tools',
  brand:       'Lumière',
  images: {
    main:    'public/images/products/rouleau-jade.jpg',
    gallery: [],
    alt: { fr: 'Rouleau Facial Jade', ar: 'بكرة الوجه من الجاد' },
  },
  price:       { regular: 99, sale: 79 },
  stock:       { qty: 5, status: STOCK_STATUS.LOW_STOCK },
  rating:      { average: 4.6, count: 1134 },
  tags:        ['rouleau', 'jade', 'facial', 'massage', 'serum'],
  badges:      [BADGES.SALE, BADGES.LIMITED],
  ingredients: [],
});

// ─────────────────────────────────────────────────────────────────────────────
// CATALOGUE EXPORT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The complete product catalogue.
 * Import this array wherever you need to display, filter or search products.
 */
const products = [
  // Skincare
  serumEclat,
  cremePerfecting,
  masqueArgile,
  spfProtecteur,

  // Makeup
  fondTeint,
  rougeLevre,
  paletteFards,

  // Perfumes
  parfumRose,
  parfumAmbre,

  // Haircare
  masqueCheveux,
  huileSublime,

  // Body
  gelDouche,
  beurreCorps,

  // Tools
  pinceauKabuki,
  galetMassage,
  rollOrFeicial,
];

export default products;
