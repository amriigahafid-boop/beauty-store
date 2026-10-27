/**
 * products.data.js — Beauty Product Catalogue
 * Lumière Beauty Store — src/data/products.data.js
 *
 * 19 Luxury Turkish & International Care Products
 * High-End Short Titles: Brand + Care Type + Key Active
 * Bilingual (FR / AR) with localized subtitles/snippets and rich editorial descriptions.
 */

import { createProduct } from '../utils/productSchema.js';

// ── 1. Eyüp Sabri Tuncer Framboise (189 DH) ──────────────────────────────────
const vinaigreFramboise = createProduct({
  id:          'vinaigre-framboise-eyup-sabri',
  sku:         'HC-VF-017',
  name:        { fr: 'Vinaigre Capillaire Framboise — EST', ar: 'خل الشعر بالتوت البري — EST' },
  tagline:     { fr: 'Éclat & brillance miroir instantanée.', ar: 'لمعان فوري وإشراقة طبيعية للشعر الباهت.' },
  description: {
    fr: "Le secret d'une brillance éclatante et de cheveux sublimes par Eyüp Sabri Tuncer. Enrichi en extrait naturel de framboise et vitamine C, ce soin tonique purifie le cuir chevelu, élimine les pellicules et démêle instantanément sans alourdir. Vos cheveux retrouvent douceur, légèreté et un éclat miroir avec un parfum fruité irrésistible.",
    ar: 'سر اللمعان الحريري والشعر الصحي من العلامة التركية الشهيرة Eyüp Sabri Tuncer. تركيبة طبيعية غنية بخلاصة التوت البري وفيتامين C تعمل على تنقية فروة الرأس من القشرة والترسبات، وتمنح شعرك نعومة فورية ولمعاناً لا يقاوم دون إثقاله، مع رائحة توت جذابة تدوم طويلاً. مناسب لجميع أنواع الشعر.'
  },
  category:    'hair',
  subcategory: 'hair-treatment',
  brand:       'Eyüp Sabri Tuncer',
  images: {
    main:    '/public/images/products/vinaigre-framboise.jpg',
    gallery: [],
    emoji:   '🍇',
    alt:     { fr: 'Vinaigre Capillaire Framboise — EST', ar: 'خل الشعر بالتوت البري — EST' },
  },
  price:       { regular: 189 },
  stock:       { qty: 150, status: 'in_stock' },
  rating:      { average: 4.9, count: 485 },
  tags:        ['cheveux', 'vinaigre', 'framboise', 'brillance', 'pellicules', 'eyup sabri tuncer', 'est'],
  badges:      ['new', 'bestseller'],
  ingredients: {
    fr: ['Extrait de framboise', 'Vitamine C', 'Vinaigre naturel'],
    ar: ['خلاصة التوت البري', 'فيتامين C', 'خل طبيعي منقٍّ'],
  },
});

// ── 2. Morfose Milk Therapy Sérum (149 DH) ────────────────────────────────────
const morfoseMilkSerum = createProduct({
  id:          'morfose-milk-therapy-serum',
  sku:         'HC-MMS-018',
  name:        { fr: 'Sérum Milk Therapy — Morfose', ar: 'سيروم ميلك ثيرابي — Morfose' },
  tagline:     { fr: 'Nutrition et réparation aux protéines de lait.', ar: 'تغذية وترميم عميق ببروتينات الحليب.' },
  description: {
    fr: "Le soin d'exception pour cheveux secs et abîmés par Morfose. Formulé à base de protéines de lait, 12 acides aminés et huile d'avocat, ce sérum onctueux répare la fibre capillaire en profondeur. Il discipline les frisottis, scelle les pointes fourchues et redonne à vos cheveux une brillance miroir et un toucher soyeux, enveloppés d'un délicieux parfum gourmand.",
    ar: 'علاج مكثف وفوري للشعر الجاف والتالف من العلامة الاحترافية Morfose. تركيبة كريمية مبتكرة غنية ببروتين الحليب و12 حمضاً أمينياً مع زيت الأفوكادو المغذي. يعيد بناء ألياف الشعر، يقضي على التقصف والهيشان، ويمنح خصلاتك نعومة فائقة ولمعاناً حريرياً مع تسهيل التسريح برائحة الفانيليا والحليب الجذابة.'
  },
  category:    'hair',
  subcategory: 'hair-treatment',
  brand:       'Morfose',
  images: {
    main:    '/public/images/products/morfose-milk-serum.jpg',
    gallery: [],
    emoji:   '🥛',
    alt:     { fr: 'Sérum Milk Therapy — Morfose', ar: 'سيروم ميلك ثيرابي — Morfose' },
  },
  price:       { regular: 149 },
  stock:       { qty: 150, status: 'in_stock' },
  rating:      { average: 4.8, count: 320 },
  tags:        ['cheveux', 'serum', 'lait', 'morfose', 'reparation'],
  badges:      ['new'],
  ingredients: {
    fr: ['Protéines de lait', '12 Acides aminés', "Huile d'avocat"],
    ar: ['بروتين الحليب', '12 حمضاً أمينياً', 'زيت الأفوكادو المغذي'],
  },
});

// ── 3. Bee Beauty Vinaigre Fruits Rouges (179 DH) ─────────────────────────────
const beeBeautyTonique = createProduct({
  id:          'bee-beauty-orman-meyveli-sirke',
  sku:         'HC-BB-019',
  name:        { fr: 'Vinaigre Capillaire Fruits Rouges — Bee Beauty', ar: 'خل الفواكه للشعر — Bee Beauty' },
  tagline:     { fr: 'Élixir détox pour purifier et lustrer la fibre.', ar: 'تنقية عميقة ولمعان حريري للشعر.' },
  description: {
    fr: "Un soin revitalisant aux extraits de fruits des bois et vinaigre balsamique signé Bee Beauty. Il purifie le cuir chevelu, élimine les pellicules et dompte les frisottis tout en apportant une douceur soyeuse et une brillance éclatante aux cheveux, sublimés d'un parfum fruité irrésistible.",
    ar: 'تركيبة منعشة بخلاصة فواكه الغابة الطبيعية والخل البلسمي من Bee Beauty للعناية المتكاملة بفروة الرأس والشعر. يزيل الرواسب والقشرة بفعالية، يقضي على تطاير الشعر والكهرباء الساكنة، ويمنح الخصلات نعومة فائقة ولمعاناً مشرقاً مع رائحة فواكه تدوم طويلاً.'
  },
  category:    'hair',
  subcategory: 'hair-treatment',
  brand:       'Bee Beauty',
  images: {
    main:    '/public/images/products/bee-beauty-tonique.jpg',
    gallery: [],
    emoji:   '🍓',
    alt:     { fr: 'Vinaigre Capillaire Fruits Rouges — Bee Beauty', ar: 'خل الفواكه للشعر — Bee Beauty' },
  },
  price:       { regular: 179 },
  stock:       { qty: 150, status: 'in_stock' },
  rating:      { average: 4.6, count: 190 },
  tags:        ['cheveux', 'vinaigre', 'fruits', 'bee beauty', 'anti-pelliculaire'],
  badges:      ['new'],
  ingredients: {
    fr: ['Extraits de fruits des bois', 'Vinaigre balsamique'],
    ar: ['خلاصة فواكه الغابة', 'خل بلسمي طبيعي'],
  },
});

// ── 4. Morfose Milk Therapy Mousse (129 DH) ───────────────────────────────────
const morfoseMilkMousse = createProduct({
  id:          'morfose-milk-therapy-mousse',
  sku:         'HC-MMM-020',
  name:        { fr: 'Mousse Milk Therapy — Morfose', ar: 'موس ميلك ثيرابي — Morfose' },
  tagline:     { fr: 'Soin texturisant et adoucissant sans rinçage.', ar: 'رغوة ترطيب وتنعيم الشعر ببروتين الحليب.' },
  description: {
    fr: "Une mousse crémeuse thermo-protectrice et réparatrice d'exception signée Morfose. Enrichie en protéines de lait et 12 acides aminés, elle nourrit intensément les cheveux secs et cassants, discipline les mèches rebelles et redonne souplesse, force et brillance éclatante tout en laissant un sillage gourmand irrésistible.",
    ar: 'رغوة كريمية مبتكرة ومكثفة للعناية بالشعر الجاف والتالف من Morfose. تركيبة غنية ببروتين الحليب و12 حمضاً أمينياً توفر ترطيباً عميقاً وحماية متكاملة من العوامل الخارجية، وتصلح بنية الشعر التالف لتعيد إليه الحيوية واللمعان الفائق والملمس الحريري دون أي ثقل، مع رائحة الحليب الشهية التي تدوم طويلاً.'
  },
  category:    'hair',
  subcategory: 'hair-treatment',
  brand:       'Morfose',
  images: {
    main:    '/public/images/products/morfose-milk-mousse.jpg',
    gallery: [],
    emoji:   '🥛',
    alt:     { fr: 'Mousse Milk Therapy — Morfose', ar: 'موس ميلك ثيرابي — Morfose' },
  },
  price:       { regular: 129 },
  stock:       { qty: 150, status: 'in_stock' },
  rating:      { average: 4.8, count: 215 },
  tags:        ['cheveux', 'mousse', 'lait', 'morfose', 'reparation'],
  badges:      ['new'],
  ingredients: {
    fr: ['Protéines de lait', '12 Acides aminés'],
    ar: ['بروتين الحليب المركز', '12 حمضاً أمينياً'],
  },
});

// ── 5. Hoito Superfood Masque (119 DH) ────────────────────────────────────────
const hoitoSuperfoodMask = createProduct({
  id:          'hoito-superfood-leave-in-mask',
  sku:         'HC-HSM-021',
  name:        { fr: 'Masque Superfood Sans Rinçage — Hoito', ar: 'ماسك سوبرفود المكثف — Hoito' },
  tagline:     { fr: 'Soin nutritionnel intense pour pointes sèches.', ar: 'عناية مغذية بدون شطف للأطراف التالفة.' },
  description: {
    fr: "Un soin d'exception sans rinçage signé Hoito, enrichi en caféine, biotine et complexe superfood. Il nourrit la fibre en profondeur, répare les pointes abîmées et protège efficacement de la chaleur et des agressions chimiques. Il dompte les frisottis, facilite le coiffage et redonne une douceur soyeuse et une brillance éclatante.",
    ar: 'علاج مكثف يُترك على الشعر من علامة Hoito بتركيبة السوبر فود المعززة بالكافيين والبيوتين. يغذي ألياف الشعر بعمق ويصلح التلف والتقصف، ويوفر حماية فائقة من حرارة التصفيف والعمليات الكيميائية. يمنع تطاير الشعر ويمنحه نعومة حريرية ولمعاناً صحياً مع تسهيل التسريح دون الحاجة لغسله بالماء.'
  },
  category:    'hair',
  subcategory: 'hair-treatment',
  brand:       'Hoito',
  images: {
    main:    '/public/images/products/hoito-superfood-mask.jpg',
    gallery: [],
    emoji:   '🌿',
    alt:     { fr: 'Masque Superfood Sans Rinçage — Hoito', ar: 'ماسك سوبرفود المكثف — Hoito' },
  },
  price:       { regular: 119 },
  stock:       { qty: 150, status: 'in_stock' },
  rating:      { average: 4.7, count: 160 },
  tags:        ['cheveux', 'masque', 'sans rincage', 'cafeine', 'biotine', 'hoito'],
  badges:      ['new'],
  ingredients: {
    fr: ['Caféine', 'Biotine', 'Complexe Superfood'],
    ar: ['الكافيين المنشط', 'البيوتين المقوي', 'مركب السوبر فود النباتي'],
  },
});

// ── 6. The Ceel Romarin Masque (179 DH) ───────────────────────────────────────
const theCeelRosemaryMask = createProduct({
  id:          'the-ceel-rosemary-hair-mask',
  sku:         'HC-TCM-022',
  name:        { fr: 'Masque Romarin & Karité — The Ceel', ar: 'ماسك إكليل الجبل والكركديه — The Ceel' },
  tagline:     { fr: 'Soin revitalisant fortifiant aux extraits purs.', ar: 'تغذية وتقوية الشعر بخلاصة الروزماري والشيا.' },
  description: {
    fr: "Un masque d'exception signé The Ceel combinant la puissance de l'extrait de romarin, du beurre de karité et de l'huile d'argan pour régénérer la fibre capillaire. Il renforce les cheveux fragilisés, scelle les pointes sèches et apporte une hydratation intense, révélant une brillance miroir et une douceur incomparable.",
    ar: 'ماسك علاجي فاخر من The Ceel بتركيبة مكثفة تجمع بين خلاصة إكليل الجبل (الروزماري)، زبدة الشيا، وزيت الأركان لترميم الشعر التالف والضعيف بعمق. يعزز قوة بصيلات الشعر، يحارب التقصف والتساقط، ويمنح الخصلات نعومة حريرية ولمعاناً كثيفاً مع ترطيب فائق يدوم طويلاً.'
  },
  category:    'hair',
  subcategory: 'hair-treatment',
  brand:       'The Ceel',
  images: {
    main:    '/public/images/products/the-ceel-rosemary-mask.jpg',
    gallery: [],
    emoji:   '🌿',
    alt:     { fr: 'Masque Romarin & Karité — The Ceel', ar: 'ماسك إكليل الجبل والكركديه — The Ceel' },
  },
  price:       { regular: 179 },
  stock:       { qty: 150, status: 'in_stock' },
  rating:      { average: 4.9, count: 185 },
  tags:        ['cheveux', 'masque', 'romarin', 'karite', 'the ceel', 'reparation'],
  badges:      ['new', 'bestseller'],
  ingredients: {
    fr: ['Extrait de romarin', 'Beurre de karité', "Huile d'argan"],
    ar: ['خلاصة إكليل الجبل (الروزماري)', 'زبدة الشيا النقية', 'زيت الأركان الطبيعي'],
  },
});

// ── 7. Bioxcin Collagen Shampooing (219 DH) ───────────────────────────────────
const bioxcinCollagenShampoo = createProduct({
  id:          'bioxcin-collagen-biotin-shampoo',
  sku:         'HC-BCS-023',
  name:        { fr: 'Shampooing Collagène & Biotine — Bioxcin', ar: 'شامبو الكولاجين والبيوتين — Bioxcin' },
  tagline:     { fr: 'Volumateur ciblé pour cheveux fins et clairsemés.', ar: 'عناية مركزة لتكثيف وتقوية الشعر الخفيف.' },
  description: {
    fr: "Une formule dermatologique avancée signée Bioxcin spécialement conçue pour les cheveux fins, clairsemés et fragiles. Enrichi en collagène hydrolysé, biotine, peptides bio-actifs et le complexe breveté Biocomplex B11, ce shampooing fortifie la racine, freine la chute et apporte une densité et un volume spectaculaires dès les premiers lavages. Hypoallergénique et sans paraben, idéal pour les cuirs chevelus sensibles.",
    ar: 'تركيبة طبية علاجية متطورة من Bioxcin للشعر الرقيق والضعيف. معززة بالكولاجين المتحلل، البيوتين، والببتيدات النشطة حيوياً، بالإضافة إلى مركب Biocomplex B11 الحاصل على براءة اختراع لمنع تساقط الشعر وزيادة كثافته بشكل ملحوظ. تمنح الشعر حجماً وامتلاءً طبيعياً، وتغذي البصيلات وفروة الرأس الحساسة بأمان مع تركيبة خالية تماماً من البارابين ومسببات الحساسية.'
  },
  category:    'hair',
  subcategory: 'hair-treatment',
  brand:       'Bioxcin',
  images: {
    main:    '/public/images/products/bioxcin-collagen-shampoo.jpg',
    gallery: [],
    emoji:   '🧴',
    alt:     { fr: 'Shampooing Collagène & Biotine — Bioxcin', ar: 'شامبو الكولاجين والبيوتين — Bioxcin' },
  },
  price:       { regular: 219 },
  stock:       { qty: 150, status: 'in_stock' },
  rating:      { average: 4.8, count: 145 },
  tags:        ['cheveux', 'shampooing', 'anti-chute', 'collagene', 'biotine', 'bioxcin'],
  badges:      ['new', 'bestseller'],
  ingredients: {
    fr: ['Collagène hydrolysé', 'Biotine', 'Biocomplex B11'],
    ar: ['الكولاجين المتحلل', 'البيوتين', 'مركب Biocomplex B11 الطبي'],
  },
});

// ── 8. Bioxcin Kératine & Argan Shampooing (149 DH) ───────────────────────────
const bioxcinKeratinArganShampoo = createProduct({
  id:          'bioxcin-keratin-argan-shampoo',
  sku:         'HC-BKAS-024',
  name:        { fr: 'Shampooing Kératine & Argan — Bioxcin', ar: 'شامبو الكيراتين والأركان — Bioxcin' },
  tagline:     { fr: 'Réparation profonde de la fibre capillaire.', ar: 'ترميم مكثف للشعر المتضرر بالأركان والكيراتين.' },
  description: {
    fr: "Une formule experte signée Bioxcin conçue pour réparer les cheveux abîmés, ternes et déshydratés. Enrichi en kératine hydrolysée, en huile d'argan nourrissante et en complexe breveté Biocomplex B11, ce soin lave en douceur tout en renforçant la fibre et en freinant la chute de cheveux. Il redonne souplesse, éclat soyeux et vitalité sans alourdir. Formule hypoallergénique, testée dermatologiquement et sans paraben.",
    ar: 'تركيبة علاجية متطورة من Bioxcin للشعر التالف والفاقد للمعان والرطوبة. تجمع بين الكيراتين المتحلل وزيت الأركان لتغذية ألياف الشعر وترميمها بعمق، مع مركب Biocomplex B11 الحاصل على براءة اختراع للحد من تساقط الشعر وتعزيز قوته. يعيد النعومة والبريق الطبيعي، مناسب لفروة الرأس الحساسة وخالٍ تماماً من البارابين ومسببات الحساسية.'
  },
  category:    'hair',
  subcategory: 'hair-treatment',
  brand:       'Bioxcin',
  images: {
    main:    '/public/images/products/bioxcin-keratin-argan-shampoo.jpg',
    gallery: [],
    emoji:   '🧴',
    alt:     { fr: 'Shampooing Kératine & Argan — Bioxcin', ar: 'شامبو الكيراتين والأركان — Bioxcin' },
  },
  price:       { regular: 149 },
  stock:       { qty: 150, status: 'in_stock' },
  rating:      { average: 4.8, count: 130 },
  tags:        ['cheveux', 'shampooing', 'anti-chute', 'keratine', 'argan', 'bioxcin'],
  badges:      ['new'],
  ingredients: {
    fr: ['Kératine hydrolysée', "Huile d'argan", 'Biocomplex B11'],
    ar: ['الكيراتين المتحلل', 'زيت الأركان المغذي', 'مركب Biocomplex B11'],
  },
});

// ── 9. Bioblas Kératine Après-Shampooing (129 DH) ──────────────────────────────
const bioblasKolajenConditioner = createProduct({
  id:          'bioblas-kolajen-keratin-conditioner',
  sku:         'HC-BKC-025',
  name:        { fr: 'Après-Shampooing Kératine — Bioblas', ar: 'بلسم الكيراتين والكولاجين — Bioblas' },
  tagline:     { fr: 'Démêlage soyeux et complexe végétal B19.', ar: 'تنعيم وتسهيل تمشيط الشعر بمركب B19.' },
  description: {
    fr: "Un après-shampooing réparateur expert signé Bioblas pour cheveux fins, plats et fragilisés. Grâce à l'action combinée du collagène et de la kératine, il épaissit la fibre capillaire, renforce la structure du cheveu et aide à prévenir la chute. Il démêle instantanément, apporte un volume naturel et laisse la chevelure douce, brillante et souple sans l'alourdir.",
    ar: 'بلسم علاجي مكثف من Bioblas مصمم خصيصاً للشعر التالف، الخفيف، والفاقد للحيوية. يجمع بين قوة الكولاجين والكيراتين لتغذية ألياف الشعر وتسميكها ومنحها حجماً وامتلاءً طبيعياً، مع محاربة تساقط الشعر بفعالية. يفك التشابك فورياً ويمنح خصلاتك نعومة حريرية ولمعاناً فائقاً يدوم طوال اليوم دون أن يثقل الشعر.'
  },
  category:    'hair',
  subcategory: 'hair-treatment',
  brand:       'Bioblas',
  images: {
    main:    '/public/images/products/bioblas-kolajen-conditioner.jpg',
    gallery: [],
    emoji:   '🧴',
    alt:     { fr: 'Après-Shampooing Kératine — Bioblas', ar: 'بلسم الكيراتين والكولاجين — Bioblas' },
  },
  price:       { regular: 129 },
  stock:       { qty: 150, status: 'in_stock' },
  rating:      { average: 4.8, count: 115 },
  tags:        ['cheveux', 'apres-shampooing', 'anti-chute', 'collagene', 'keratine', 'bioblas'],
  badges:      ['new'],
  ingredients: {
    fr: ['Collagène', 'Kératine', 'Complexe végétal'],
    ar: ['الكولاجين المكثف', 'الكيراتين المرمم', 'المركب النباتي المقوي'],
  },
});

// ── 10. The Bath Factory Gommage Vanille (189 DH) ─────────────────────────────
const theBathFactoryVanillaScrub = createProduct({
  id:          'the-bath-factory-sweet-vanilla-scrub',
  sku:         'BC-TBS-026',
  name:        { fr: 'Gommage Douce Vanille — The Bath Factory', ar: 'مقشر الفانيليا وزبدة الشيا — The Bath Factory' },
  tagline:     { fr: 'Exfoliation au beurre de karité et sucre fin.', ar: 'تقشير ناعم ومخملي للجسم بنفحات الفانيليا.' },
  description: {
    fr: "Un gommage d'exception signé The Bath Factory, formulé à 100% d'ingrédients végans et enrichi en beurre de karité, huiles de jojoba, d'avocat et de ricin. Il exfolie la peau en douceur, élimine les peaux mortes et nourrit intensément l'épiderme. Il révèle une peau veloutée, lumineuse et délicatement sublimée d'une fragrance chaleureuse et gourmande de vanille douce.",
    ar: 'مقشر فاخر للجسم من The Bath Factory بتركيبة نباتية 100% غنية بزبدة الشيا الطبيعية ومزيج من زيوت الجوجوبا، الأفوكادو، والخروع. يزيل خلايا الجلد الميتة بلطف، يجدد ملمس البشرة، ويمنح ترطيباً وتغذية عميقة دون ترك أثر دهني. يترك الجسم بنعومة فائقة ولمعان حريري مع رائحة الفانيليا الدافئة والجذابة التي تدوم طويلاً.'
  },
  category:    'body',
  subcategory: 'body-scrub',
  brand:       'The Bath Factory',
  images: {
    main:    '/public/images/products/the-bath-factory-vanilla-scrub.jpg',
    gallery: [],
    emoji:   '✨',
    alt:     { fr: 'Gommage Douce Vanille — The Bath Factory', ar: 'مقشر الفانيليا وزبدة الشيا — The Bath Factory' },
  },
  price:       { regular: 189 },
  stock:       { qty: 150, status: 'in_stock' },
  rating:      { average: 4.9, count: 95 },
  tags:        ['corps', 'gommage', 'vanille', 'karite', 'the bath factory', 'vegan'],
  badges:      ['new', 'vegan'],
  ingredients: {
    fr: ['Beurre de karité', 'Huile de jojoba', "Huile d'avocat", 'Extrait de vanille'],
    ar: ['زبدة الشيا الطبيعية', 'زيت الجوجوبا', 'زيت الأفوكادو', 'خلاصة الفانيليا الحلوة'],
  },
});

// ── 11. Let's Scrub Cryo Gommage (229 DH) ─────────────────────────────────────
const letscrubColdScrub = createProduct({
  id:          'letscrub-cold-effect-body-scrub',
  sku:         'BC-LCS-027',
  name:        { fr: "Gommage Cryo-Fermeté — Let's Scrub", ar: "مقشر التبريد وشد الجسم — Let'scrub" },
  tagline:     { fr: 'Action tonifiante effet froid au menthol pur.', ar: 'شد ونحت ملمس البشرة بالمنثول المنعش.' },
  description: {
    fr: "Un gommage exfoliant innovant à effet froid signé Let'scrub. Formulé à base de menthol rafraîchissant et d'un complexe exclusif de 10 huiles végétales naturelles, il élimine efficacement les cellules mortes, stimule la microcirculation et aide à raffermir la peau tout en ciblant l'aspect de la cellulite. Il nourrit en profondeur pour un grain de peau lisse, tonifié et soyeux.",
    ar: "مقشر مبتكر للجسم بتأثير التبريد الفوري من Let'scrub. تركيبة فريدة غنية بالمنثول ومزيج من 10 زيوت طبيعية خاصة تعمل على تقشير الجلد الميت بلطف وتنشيط الدورة الدموية لمكافحة السيلوليت وشد ترهلات الجسم. يغذي البشرة بعمق، يمنحها نعومة فائقة ومظهراً مشدوداً وحريرياً مع إحساس بالانتعاش يدوم طويلاً."
  },
  category:    'body',
  subcategory: 'body-scrub',
  brand:       "Let'scrub",
  images: {
    main:    '/public/images/products/letscrub-cold-scrub.jpg',
    gallery: [],
    emoji:   '❄️',
    alt:     { fr: "Gommage Cryo-Fermeté — Let's Scrub", ar: "مقشر التبريد وشد الجسم — Let'scrub" },
  },
  price:       { regular: 229 },
  stock:       { qty: 150, status: 'in_stock' },
  rating:      { average: 4.9, count: 110 },
  tags:        ['corps', 'gommage', 'menthol', 'effet froid', 'raffermissant', "let'scrub"],
  badges:      ['new'],
  ingredients: {
    fr: ['Menthol', 'Complexe 10 huiles végétales'],
    ar: ['المنثول المنعش', 'مركب 10 زيوت نباتية طبيعية'],
  },
});

// ── 12. The Bath Factory Gel Douche Ambre (159 DH) ────────────────────────────
const theBathFactoryDarkAmber = createProduct({
  id:          'the-bath-factory-dark-amber-shower-gel',
  sku:         'BC-TBD-028',
  name:        { fr: 'Gel Douche Dark Amber — The Bath Factory', ar: 'جل استحمام دارك أمبر — The Bath Factory' },
  tagline:     { fr: 'Nettoyage sensoriel aux notes ambrées précieuses.', ar: 'ترطيب وانتعاش فاخر بنفحات العنبر الدافئة.' },
  description: {
    fr: "Un rituel de douche d'exception signé The Bath Factory. Enrichi en extrait d'ambre précieux et en glycérine hydratante, ce gel douche nettoie délicatement l'épiderme tout en préservant son film hydrolipidique. Il laisse la peau soyeuse, souple et subtilement enveloppée d'un sillage chaud et captivant d'ambre sombre, de vanille et de bois de cèdre.",
    ar: 'تجربة استحمام استثنائية من The Bath Factory بتركيبة غنية بخلاصة العنبر والجلسرين الطبيعي لتنظيف البشرة بعمق ولطف دون تجفيفها. يحافظ على توازن رطوبة الجلد الطبيعي، ويمنحه نعومة فائقة وملمساً حريرياً مع نفحات شرقية دافئة وساحرة تمزج بين العنبر، الفانيليا، وخشب الأرز لتدوم طوال اليوم.'
  },
  category:    'body',
  subcategory: 'shower-gel',
  brand:       'The Bath Factory',
  images: {
    main:    '/public/images/products/the-bath-factory-dark-amber.jpg',
    gallery: [],
    emoji:   '✨',
    alt:     { fr: 'Gel Douche Dark Amber — The Bath Factory', ar: 'جل استحمام دارك أمبر — The Bath Factory' },
  },
  price:       { regular: 159 },
  stock:       { qty: 150, status: 'in_stock' },
  rating:      { average: 4.8, count: 85 },
  tags:        ['corps', 'gel douche', 'ambre', 'vanille', 'hydratant', 'the bath factory'],
  badges:      ['new'],
  ingredients: {
    fr: ["Extrait d'ambre", 'Glycérine', 'Bois de cèdre'],
    ar: ['خلاصة العنبر الداكن', 'جلسرين نباتي مرطب', 'خشب الأرز والفانيليا'],
  },
});

// ── 13. Dermokil Lait Kojic & Vitamine C (169 DH) ─────────────────────────────
const dermokilKojicLotion = createProduct({
  id:          'dermokil-kojic-acid-vitamin-c-lotion',
  sku:         'BC-DKL-029',
  name:        { fr: 'Lait Corps Éclaircissant — Dermokil', ar: 'لوشن التفتيح بالكوجيك وفيتامين C — Dermokil' },
  tagline:     { fr: 'Acide kojique et vitamine C pour unifier le teint.', ar: 'توحيد لون الجسم وإشراقة طبيعية ومكثفة.' },
  description: {
    fr: "Un soin corporel innovant signé Dermokil combinant la puissance de l'acide kojique et de la vitamine C pour unifier et illuminer le teint. Il estompe visiblement les taches pigmentaires, prévient l'hyperpigmentation et hydrate intensément sans fini gras, révélant une peau douce, éclatante et satinée.",
    ar: 'لوشن علاجي مبتكر للجسم من Dermokil بتركيبة متطورة تجمع بين حمض الكوجيك وفيتامين C لتفتيح البشرة وتوحيد لونها بفعالية. يعمل على تقليل التصبغات والبقع الداكنة الناتجة عن الشمس، مع ترطيب عميق يدوم طويلاً ليمنح بشرتك إشراقة طبيعية وملمساً ناعماً كالحرير دون أي أثر دهني.'
  },
  category:    'body',
  subcategory: 'body-lotion',
  brand:       'Dermokil',
  images: {
    main:    '/public/images/products/dermokil-kojic-lotion.jpg',
    gallery: [],
    emoji:   '🍊',
    alt:     { fr: 'Lait Corps Éclaircissant — Dermokil', ar: 'لوشن التفتيح بالكوجيك وفيتامين C — Dermokil' },
  },
  price:       { regular: 169 },
  stock:       { qty: 150, status: 'in_stock' },
  rating:      { average: 4.8, count: 95 },
  tags:        ['corps', 'lait corps', 'lotion', 'acide kojique', 'vitamine c', 'éclaircissant', 'dermokil'],
  badges:      ['new'],
  ingredients: {
    fr: ['Acide kojique', 'Vitamine C'],
    ar: ['حمض الكوجيك الموحّد للون', 'فيتامين C المشرق'],
  },
});

// ── 14. Bee Beauty Beurre Corporel 7 Huiles (139 DH) ──────────────────────────
const beeBeautyBodySevenButter = createProduct({
  id:          'bee-beauty-body-seven-butter',
  sku:         'BC-BBY-030',
  name:        { fr: 'Beurre Corporel 7 Huiles — Bee Beauty', ar: 'زبدة الجسم بـ 7 زيوت — Bee Beauty' },
  tagline:     { fr: 'Nutrition absolue pour peau sèche et déshydratée.', ar: 'تغذية فائقة وترطيب عميق للبشرة الجافة.' },
  description: {
    fr: "Un soin ultra-nourrissant signé Bee Beauty alliant le beurre de karité à un complexe de 7 huiles précieuses (coco, avocat, jojoba, amande, germe de blé et olive) et enrichi en vitamines vitales. Il réconforte instantanément les peaux sèches, restaure la souplesse cutanée et protège l'épiderme sans laisser de film collant. Votre peau retrouve une douceur infinie et un fini satiné délicatement parfumé.",
    ar: 'علاج مكثف وفائق الترطيب من Bee Beauty بتركيبة غنية تجمع بين زبدة الشيا و7 زيوت نباتية طبيعية (جوز الهند، الأفوكادو، الجوجوبا، اللوز، جنين القمح، والزيتون) المعززة بالفيتامينات A وB3 وC وD وE. يغذي البشرة شديدة الجفاف بعمق، يعيد إليها مرونتها ونضارتها، ويحميها من الجفاف والتصبغات ليمنحك جسماً ناعماً كالحرير برائحة استوائية ناعمة تدوم طويلاً.'
  },
  category:    'body',
  subcategory: 'body-butter',
  brand:       'Bee Beauty',
  images: {
    main:    '/public/images/products/bee-beauty-seven-butter.jpg',
    gallery: [],
    emoji:   '🥥',
    alt:     { fr: 'Beurre Corporel 7 Huiles — Bee Beauty', ar: 'زبدة الجسم بـ 7 زيوت — Bee Beauty' },
  },
  price:       { regular: 139 },
  stock:       { qty: 150, status: 'in_stock' },
  rating:      { average: 4.8, count: 94 },
  tags:        ['corps', 'beurre corporel', 'karité', 'huiles précieuses', 'nutrition', 'bee beauty'],
  badges:      ['new'],
  ingredients: {
    fr: ["Beurre de karité", "Huile de coco", "Huile d'avocat", "Huile de jojoba", "Vitamines A, B3, C, D, E"],
    ar: ['زبدة الشيا', 'زيت جوز الهند', 'زيت الأفوكادو والجوجوبا', 'فيتامينات A وB3 وC وD وE'],
  },
});

// ── 15. The Bath Factory Brume Vanille (179 DH) ───────────────────────────────
const theBathFactoryVanillaMist = createProduct({
  id:          'the-bath-factory-sweet-vanilla-mist',
  sku:         'BC-TBD-031',
  name:        { fr: 'Brume Corps & Cheveux Vanille — The Bath Factory', ar: 'معطر الجسم والشعر بالفانيليا — The Bath Factory' },
  tagline:     { fr: 'Voile parfumé gourmand haute rémanence.', ar: 'عطر خفيف وجذاب يدوم لساعات طويلة.' },
  description: {
    fr: "Une brume parfumée envoûtante pour le corps et les cheveux signée The Bath Factory. Formulée avec des notes gourmandes et chaleureuses de vanille douce, elle offre une sensation de fraîcheur instantanée tout au long de la journée. Idéale après la douche pour prolonger le sillage captivant de votre rituel de soin, sans assécher la peau ni les cheveux.",
    ar: 'رذاذ عطري فاخر للجسم والشعر من The Bath Factory بنفحات الفانيليا الحلوة الدافئة والجذابة. تركيبة خفيفة ومنعشة صُممت للاستخدام اليومي بعد الاستحمام أو في أي وقت لمنح بشرتك وشعرك انتعاشاً فورياً ورائحة آسرة وساحرة تدوم لساعات طويلة، ليتكامل تماماً مع مقشر الفانيليا الخاص بنفس المجموعة.'
  },
  category:    'body',
  subcategory: 'body-mist',
  brand:       'The Bath Factory',
  images: {
    main:    '/public/images/products/the-bath-factory-vanilla-mist.jpg',
    gallery: [],
    emoji:   '✨',
    alt:     { fr: 'Brume Corps & Cheveux Vanille — The Bath Factory', ar: 'معطر الجسم والشعر بالفانيليا — The Bath Factory' },
  },
  price:       { regular: 179 },
  stock:       { qty: 150, status: 'in_stock' },
  rating:      { average: 4.8, count: 90 },
  tags:        ['corps', 'brume parfumée', 'corps et cheveux', 'vanille', 'the bath factory'],
  badges:      ['new'],
  ingredients: {
    fr: ['Extrait de vanille', 'Glycérine végétale', 'Notes gourmandes'],
    ar: ['خلاصة الفانيليا الدافئة', 'جلسرين نباتي مرطب', 'نفحات عطرية منعشة'],
  },
});

// ── 16. Bioxcin Forte Tonique (219 DH) ────────────────────────────────────────
const bioxcinForteTonic = createProduct({
  id:          'bioxcin-forte-anti-hair-loss-tonic',
  sku:         'HC-BXF-032',
  name:        { fr: 'Tonique Anti-Chute Forte — Bioxcin', ar: 'تونك بيوكسين فورت المكثف — Bioxcin' },
  tagline:     { fr: 'Concentré B11 pour stopper la chute et stimuler la repousse.', ar: 'تركيبة عيادية لعلاج التساقط الشديد وإعادة الإنبات.' },
  description: {
    fr: "Un traitement intensif en spray signé Bioxcin, hautement concentré en complexe breveté Biocomplex B11, conçu spécifiquement pour freiner la chute de cheveux sévère et stimuler la repousse. Il cible directement la racine, fortifie les follicules affaiblis et favorise la pousse d'une chevelure plus dense, résistante et saine. Texture non grasse à pénétration rapide, sans rinçage et sans paraben.",
    ar: 'علاج بخاخ طبي مكثف من Bioxcin بتركيبة Forte المدعمة بأعلى تركيز من مركب Biocomplex B11 الحاصل على براءة اختراع، مخصص لحالات تساقط الشعر الشديد والوراثي. يغذي جذور الشعر وينشط الدورة الدموية في فروة الرأس، ويقوي البصيلات الضعيفة لتحفيز نمو شعر جديد أكثر كثافة وسماكة، مع تركيبة خفيفة غير دهنية سريعة الامتصاص وخالية من البارابين.'
  },
  category:    'hair',
  subcategory: 'tonic',
  brand:       'Bioxcin',
  images: {
    main:    '/public/images/products/bioxcin-forte-tonic.jpg',
    gallery: [],
    emoji:   '🌿',
    alt:     { fr: 'Tonique Anti-Chute Forte — Bioxcin', ar: 'تونك بيوكسين فورت المكثف — Bioxcin' },
  },
  price:       { regular: 219 },
  stock:       { qty: 150, status: 'in_stock' },
  rating:      { average: 4.9, count: 175 },
  tags:        ['cheveux', 'anti-chute', 'tonique', 'repousse', 'bioxcin forte', 'b11'],
  badges:      ['new'],
  ingredients: {
    fr: ['Biocomplex B11', 'Flavonoïdes', 'Acides aminés', 'Minéraux'],
    ar: ['مركب Biocomplex B11 المركز', 'الفلافونويدات', 'الأحماض الأمينية والمعادن'],
  },
});

// ── 17. Maybelline Anti-Cernes Instant Eraser (259 DH) ────────────────────────
const maybellineInstantAntiAgeEraser = createProduct({
  id:          'maybelline-instant-anti-age-eraser-01-light',
  sku:         'MK-MAY-033',
  name:        { fr: 'Anti-Cernes Instant Eraser — Maybelline', ar: 'خافي عيوب إنستانت إريزر — Maybelline' },
  tagline:     { fr: 'Correction et éclat contour des yeux, teinte 01 Light.', ar: 'تغطية فورية للهالات والتجاعيد الدقيقة (درجة 01).' },
  description: {
    fr: "Le correcteur multi-usage culte de Maybelline enrichi aux baies de goji énergisantes pour masquer instantanément les cernes, estomper les ridules et illuminer le contour de l'œil. Son embout applicateur en micro-mousse permet une application ultra-précise et homogène sans marquer les plis, offrant une couvrance modulable au fini naturel et impeccable.",
    ar: 'كونسيلر علاجي متعدد الاستخدامات بتركيبة غنية بخلاصة توت الغوجي ومضادات الأكسدة لتغطية الهالات السوداء والخطوط الدقيقة والانتفاخات فورياً. يمنح لمسة نهائية ناعمة ومشرقة توحد لون البشرة وتخفي العيوب بدقة بفضل إسفنجة التطبيق الدائرية الأيقونية وسهلة الاستخدام.'
  },
  category:    'body',
  subcategory: 'concealer',
  brand:       'Maybelline',
  images: {
    main:    '/public/images/products/maybelline-anti-age-eraser-01.jpg',
    gallery: [],
    emoji:   '✨',
    alt:     { fr: 'Anti-Cernes Instant Eraser — Maybelline', ar: 'خافي عيوب إنستانت إريزر — Maybelline' },
  },
  price:       { regular: 259 },
  stock:       { qty: 150, status: 'in_stock' },
  rating:      { average: 4.8, count: 320 },
  tags:        ['maquillage', 'anti-cernes', 'correcteur', 'concealer', 'maybelline', 'baies de goji'],
  badges:      ['new', 'bestseller'],
  ingredients: {
    fr: ['Baies de goji', 'Haloxyl', 'Pigments minéraux'],
    ar: ['خلاصة توت الغوجي', 'مركب هالوكسيل المفتح', 'أصباغ معدنية ناعمة'],
  },
});

// ── 18. Dermokil Chaussettes Peeling Pieds (169 DH) ───────────────────────────
const dermokilExfoliatingFootMask = createProduct({
  id:          'dermokil-exfoliating-foot-mask',
  sku:         'BC-DKL-034',
  name:        { fr: 'Chaussettes Peeling Pieds — Dermokil', ar: 'جوارب تقشير وتنعيم القدمين — Dermokil' },
  tagline:     { fr: 'Élimination des callosités pour talons lisses.', ar: 'تقشير لطيف وفعال لإزالة الجلد الميت واستعادة النعومة.' },
  description: {
    fr: "Un soin peeling novateur sous forme de chaussettes exfoliantes signé Dermokil, hautement concentré en acides exfoliants (lactique, glycolique et salicylique). Il élimine efficacement les callosités tenaces, les peaux mortes et les talons fendillés en 4 à 8 jours de manière naturelle et indolore. Il régénère l'épiderme en profondeur pour révéler des pieds doux, lisses et neufs comme ceux d'un bébé.",
    ar: 'ماسك تقشير مبتكر للقدمين على شكل جوارب من Dermokil، مصمم بتركيبة أحماض الفواكه المركزة (حمض اللاكتيك، حمض الجليكوليك، وحمض الساليسيليك). يقشر طبقات الجلد السميكة والخشنة والتشققات المتراكمة على الكعبين في غضون 4 إلى 8 أيام بشكل طبيعي دون تهيج، ليعيد لقدميك نعومة فائقة ونضارة كاملة كأقدام الأطفال.'
  },
  category:    'body',
  subcategory: 'foot-care',
  brand:       'Dermokil',
  images: {
    main:    '/public/images/products/dermokil-foot-mask.jpg',
    gallery: [],
    emoji:   '👣',
    alt:     { fr: 'Chaussettes Peeling Pieds — Dermokil', ar: 'جوارب تقشير وتنعيم القدمين — Dermokil' },
  },
  price:       { regular: 169 },
  stock:       { qty: 150, status: 'in_stock' },
  rating:      { average: 4.8, count: 65 },
  tags:        ['corps', 'soin des pieds', 'peeling', 'exfoliant', 'acides de fruits', 'dermokil'],
  badges:      ['new'],
  ingredients: {
    fr: ['Acide lactique', 'Acide glycolique', 'Acide salicylique', 'Extraits botaniques'],
    ar: ['حمض اللاكتيك', 'حمض الجليكوليك', 'حمض الساليسيليك', 'خلاصات نباتية ملطفة'],
  },
});

// ── 19. Bio-Oil Lait Hydratant Riche (149 DH) ─────────────────────────────────
const bioOilMoisturizingBodyLotion = createProduct({
  id:          'bio-oil-moisturizing-body-lotion',
  sku:         'BC-BIO-035',
  name:        { fr: 'Lait Hydratant Riche — Bio-Oil', ar: 'لوشن الترطيب المكثف — Bio-Oil' },
  tagline:     { fr: 'Formule biphasique ultra-pénétrante riche en huiles.', ar: 'ترطيب يومي عميق للبشرة الجافة بالزيوت النقية.' },
  description: {
    fr: "Un lait corporel hydratant expert signé Bio-Oil, formulé avec 42% d'huiles pour nourrir et hydrater l'épiderme en profondeur. Sa formule ultra-légère pénètre instantanément sans fini gras ni collant. Sans parfum et hypoallergénique, il convient parfaitement aux peaux sensibles pour restaurer souplesse, douceur et éclat.",
    ar: 'لوشن مرطب ومغذٍ للجسم من Bio-Oil بتركيبة طبية رائدة تتكون بنسبة 42% من الزيوت الطبيعية الفعالة لترطيب وتغذية البشرة بعمق. يتميز بقوام خفيف فائق الامتصاص وغير دهني، ومناسب للبشرة الحساسة وخالٍ تماماً من العطور. يعيد للبشرة نضارتها وليونتها ويقضي على الجفاف والبهتان من أول استخدام.'
  },
  category:    'body',
  subcategory: 'body-lotion',
  brand:       'Bio-Oil',
  images: {
    main:    '/public/images/products/bio-oil-body-lotion.jpg',
    gallery: [],
    emoji:   '💧',
    alt:     { fr: 'Lait Hydratant Riche — Bio-Oil', ar: 'لوشن الترطيب المكثف — Bio-Oil' },
  },
  price:       { regular: 149 },
  stock:       { qty: 150, status: 'in_stock' },
  rating:      { average: 4.8, count: 90 },
  tags:        ['corps', 'lait corps', 'lotion', 'hydratant', 'bio-oil', 'sans parfum'],
  badges:      ['new'],
  ingredients: {
    fr: ["42% Complexe d'huiles", 'PurCellin Oil', 'Vitamine E'],
    ar: ['42% زيوت طبيعية مغذية', 'زيت PurCellin المبتكر', 'فيتامين E المضاد للأكسدة'],
  },
});

// ── Catalogue Array (19 Products) ─────────────────────────────────────────────
const products = [
  vinaigreFramboise,
  morfoseMilkSerum,
  beeBeautyTonique,
  morfoseMilkMousse,
  hoitoSuperfoodMask,
  theCeelRosemaryMask,
  bioxcinCollagenShampoo,
  bioxcinKeratinArganShampoo,
  bioblasKolajenConditioner,
  theBathFactoryVanillaScrub,
  letscrubColdScrub,
  theBathFactoryDarkAmber,
  dermokilKojicLotion,
  beeBeautyBodySevenButter,
  theBathFactoryVanillaMist,
  bioxcinForteTonic,
  maybellineInstantAntiAgeEraser,
  dermokilExfoliatingFootMask,
  bioOilMoisturizingBodyLotion,
];

export default products;
