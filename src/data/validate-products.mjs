/**
 * validate-products.mjs
 * Quick smoke-test for the product catalogue and currency formatter.
 * Run with: node src/data/validate-products.mjs
 */

// ── Inline minimal productSchema (no bundler needed) ──────────────────────

const CURRENCY_CODE   = 'MAD';
const STOCK_STATUS = { IN_STOCK:'in_stock', LOW_STOCK:'low_stock', OUT_OF_STOCK:'out_of_stock' };
const BADGES       = { NEW:'new', BESTSELLER:'bestseller', SALE:'sale', LIMITED:'limited', VEGAN:'vegan', NATURAL:'natural', EXCLUSIVE:'exclusive' };
const CATEGORIES   = { SKINCARE:'skincare', MAKEUP:'makeup', PERFUMES:'perfumes', HAIRCARE:'haircare', BODY:'body', TOOLS:'tools' };

function formatPrice(amount, lang = 'fr') {
  const formatters = {
    fr: new Intl.NumberFormat('fr-MA', { minimumFractionDigits:2, maximumFractionDigits:2 }),
    ar: new Intl.NumberFormat('ar-MA', { minimumFractionDigits:2, maximumFractionDigits:2, numberingSystem:'latn' }),
  };
  const symbol = lang === 'ar' ? 'د.م' : 'DH';
  return `${formatters[lang].format(amount)} ${symbol}`;
}

// ── Inline minimal sample (no module import in this plain .mjs) ───────────

const SAMPLE_PRODUCTS = [
  { id:'serum-eclat-rose',        name:{ fr:'Sérum Éclat Rose',                     ar:'سيروم توهج الورد'              }, category:'skincare', price:{ regular:249, sale:199,  currency:'MAD' }, stock:{ qty:42,  status:'in_stock'     }, rating:{ average:4.8, count:1247 }, badges:['bestseller','sale']      },
  { id:'creme-argan',             name:{ fr:"Crème Perfectrice à l'Argan",           ar:'كريم مثالي بزيت الأرغان'        }, category:'skincare', price:{ regular:189, sale:null, currency:'MAD' }, stock:{ qty:78,  status:'in_stock'     }, rating:{ average:4.7, count:892  }, badges:['natural','vegan']        },
  { id:'masque-argile-rose',      name:{ fr:'Masque Purifiant Argile Rose',          ar:'قناع تنقية بالطين الوردي'       }, category:'skincare', price:{ regular:139, sale:119,  currency:'MAD' }, stock:{ qty:55,  status:'in_stock'     }, rating:{ average:4.6, count:634  }, badges:['natural','sale']         },
  { id:'spf50-fluide',            name:{ fr:'Fluide Protecteur SPF 50+',             ar:'سائل واقي الشمس SPF 50+'        }, category:'skincare', price:{ regular:169, sale:null, currency:'MAD' }, stock:{ qty:120, status:'in_stock'     }, rating:{ average:4.9, count:2103 }, badges:['bestseller','new']       },
  { id:'fond-teint-velours',      name:{ fr:'Fond de Teint Velours Longue Tenue',    ar:'كريم أساس مخملي طويل الثبات'   }, category:'makeup',   price:{ regular:219, sale:null, currency:'MAD' }, stock:{ qty:96,  status:'in_stock'     }, rating:{ average:4.7, count:1548 }, badges:['bestseller']             },
  { id:'rouge-levres-satin-rose', name:{ fr:'Rouge à Lèvres Satin Rose',             ar:'أحمر شفاه ساتان وردي'          }, category:'makeup',   price:{ regular:129, sale:null, currency:'MAD' }, stock:{ qty:200, status:'in_stock'     }, rating:{ average:4.5, count:987  }, badges:['vegan']                  },
  { id:'palette-sables-dores',    name:{ fr:'Palette Yeux Sables Dorés',             ar:'باليت عيون الرمال الذهبية'     }, category:'makeup',   price:{ regular:299, sale:249,  currency:'MAD' }, stock:{ qty:38,  status:'in_stock'     }, rating:{ average:4.9, count:3211 }, badges:['bestseller','sale','exclusive'] },
  { id:'parfum-rose-orient',      name:{ fr:'Eau de Parfum Rose Orient',             ar:'عطر وردة الشرق'                }, category:'perfumes', price:{ regular:599, sale:null, currency:'MAD' }, stock:{ qty:25,  status:'in_stock'     }, rating:{ average:4.9, count:879  }, badges:['exclusive','bestseller'] },
  { id:'parfum-ambre-musk',       name:{ fr:'Ambre & Musc Précieux',                 ar:'عنبر ومسك نفيس'                }, category:'perfumes', price:{ regular:479, sale:399,  currency:'MAD' }, stock:{ qty:4,   status:'low_stock'    }, rating:{ average:4.8, count:651  }, badges:['sale','limited']         },
  { id:'masque-cheveux-argan',    name:{ fr:'Masque Réparateur Argan & Kératine',    ar:'قناع ترميمي بالأرغان والكيراتين'}, category:'haircare', price:{ regular:179, sale:null, currency:'MAD' }, stock:{ qty:67,  status:'in_stock'     }, rating:{ average:4.7, count:1023 }, badges:['natural','bestseller']   },
  { id:'huile-cheveux-5-huiles',  name:{ fr:'Huile Sublime 5 Précieuses',            ar:'زيت فاخر بـ5 زيوت نفيسة'       }, category:'haircare', price:{ regular:199, sale:null, currency:'MAD' }, stock:{ qty:0,   status:'out_of_stock' }, rating:{ average:4.9, count:2766 }, badges:['bestseller','natural']   },
  { id:'gel-douche-oranger',      name:{ fr:"Gel Douche Fleur d'Oranger",            ar:'جل الاستحمام بزهر البرتقال'     }, category:'body',     price:{ regular:89,  sale:null, currency:'MAD' }, stock:{ qty:150, status:'in_stock'     }, rating:{ average:4.6, count:543  }, badges:['vegan','natural','new']  },
  { id:'beurre-corps-rose',       name:{ fr:'Beurre Corps Rose & Henné',             ar:'زبدة الجسم بالورد والحناء'     }, category:'body',     price:{ regular:149, sale:null, currency:'MAD' }, stock:{ qty:88,  status:'in_stock'     }, rating:{ average:4.8, count:712  }, badges:['natural']                },
  { id:'pinceau-kabuki-pro',      name:{ fr:'Pinceau Kabuki Pro',                    ar:'فرشاة كابوكي احترافية'          }, category:'tools',    price:{ regular:159, sale:null, currency:'MAD' }, stock:{ qty:34,  status:'in_stock'     }, rating:{ average:4.7, count:421  }, badges:['new']                    },
  { id:'gua-sha-quartz-rose',     name:{ fr:'Gua Sha en Quartz Rose',                ar:'حجر جوا شا من الكوارتز الوردي' }, category:'tools',    price:{ regular:119, sale:null, currency:'MAD' }, stock:{ qty:60,  status:'in_stock'     }, rating:{ average:4.8, count:856  }, badges:['bestseller','new']       },
  { id:'rouleau-jade',            name:{ fr:'Rouleau Facial Jade',                   ar:'بكرة الوجه من الجاد'           }, category:'tools',    price:{ regular:99,  sale:79,   currency:'MAD' }, stock:{ qty:5,   status:'low_stock'    }, rating:{ average:4.6, count:1134 }, badges:['sale','limited']         },
];

// ── Tests ──────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) {
    console.log(`  ✅  ${label}`);
    passed++;
  } else {
    console.error(`  ❌  ${label}`);
    failed++;
  }
}

console.log('\n━━━  Beauty Store — Product Catalogue Validation  ━━━\n');

// 1. Total count
console.log('📦  Catalogue');
assert(`Total products = 16`, SAMPLE_PRODUCTS.length === 16);

// 2. All products have required fields
console.log('\n🔑  Required fields (id, name.fr, name.ar, price.regular, price.currency)');
for (const p of SAMPLE_PRODUCTS) {
  assert(
    `${p.id}`,
    p.id &&
    p.name?.fr &&
    p.name?.ar &&
    typeof p.price?.regular === 'number' &&
    p.price?.currency === 'MAD'
  );
}

// 3. Currency is always MAD
console.log('\n💰  Currency = MAD on every product');
const allMAD = SAMPLE_PRODUCTS.every(p => p.price.currency === 'MAD');
assert('All products priced in MAD', allMAD);

// 4. Category distribution
console.log('\n📂  Category distribution');
const cats = {};
for (const p of SAMPLE_PRODUCTS) cats[p.category] = (cats[p.category] ?? 0) + 1;
assert('skincare  = 4', cats.skincare  === 4);
assert('makeup    = 3', cats.makeup    === 3);
assert('perfumes  = 2', cats.perfumes  === 2);
assert('haircare  = 2', cats.haircare  === 2);
assert('body      = 2', cats.body      === 2);
assert('tools     = 3', cats.tools     === 3);

// 5. Price formatting
console.log('\n🏷️   MAD price formatting');
assert('249 → fr: "249,00 DH"',        formatPrice(249, 'fr')    === '249,00 DH');
assert('1250 → fr: "1\u202f250,00 DH"',    formatPrice(1250, 'fr').replace(/\s/g, '\u202f') === '1\u202f250,00 DH');
assert('249 → ar contains "د.م"',      formatPrice(249, 'ar').includes('د.م'));
assert('0 → fr: "0,00 DH"',           formatPrice(0, 'fr')      === '0,00 DH');

// 6. Sale & discount
console.log('\n🏷️   Sale prices');
const onSale = SAMPLE_PRODUCTS.filter(p => p.price.sale !== null);
assert(`${onSale.length} products on sale`, onSale.length === 5);
for (const p of onSale) {
  assert(`${p.id}: sale < regular`, p.price.sale < p.price.regular);
}

// 7. Stock statuses
console.log('\n📊  Stock statuses');
const inStock    = SAMPLE_PRODUCTS.filter(p => p.stock.status === 'in_stock').length;
const lowStock   = SAMPLE_PRODUCTS.filter(p => p.stock.status === 'low_stock').length;
const outOfStock = SAMPLE_PRODUCTS.filter(p => p.stock.status === 'out_of_stock').length;
assert(`in_stock     = ${inStock}`,    inStock    === 13);
assert(`low_stock    = ${lowStock}`,   lowStock   === 2);
assert(`out_of_stock = ${outOfStock}`, outOfStock === 1);

// 8. Bilingual names
console.log('\n🌍  Bilingual names (fr + ar)');
const allBilingual = SAMPLE_PRODUCTS.every(p => p.name.fr && p.name.ar);
assert('All products have both fr and ar names', allBilingual);

// ── Summary ────────────────────────────────────────────────────────────────
console.log(`\n━━━  Results: ${passed} passed, ${failed} failed  ━━━\n`);
process.exit(failed > 0 ? 1 : 0);
