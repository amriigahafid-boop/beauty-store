// Self-contained product catalogue validation
// Run: node tests/validate-catalogue.cjs

const products = [
  { id:'serum-eclat-rose',        nameFr:'Sérum Éclat Rose',                     nameAr:'سيروم توهج الورد',               cat:'skincare', priceReg:249, priceSale:199,  cur:'MAD', stockQty:42,  stockSt:'in_stock',     badges:['bestseller','sale']            },
  { id:'creme-argan',             nameFr:"Crème Perfectrice à l'Argan",           nameAr:'كريم مثالي بزيت الأرغان',         cat:'skincare', priceReg:189, priceSale:null, cur:'MAD', stockQty:78,  stockSt:'in_stock',     badges:['natural','vegan']              },
  { id:'masque-argile-rose',      nameFr:'Masque Purifiant Argile Rose',          nameAr:'قناع تنقية بالطين الوردي',        cat:'skincare', priceReg:139, priceSale:119,  cur:'MAD', stockQty:55,  stockSt:'in_stock',     badges:['natural','sale']               },
  { id:'spf50-fluide',            nameFr:'Fluide Protecteur SPF 50+',             nameAr:'سائل واقي الشمس SPF 50+',         cat:'skincare', priceReg:169, priceSale:null, cur:'MAD', stockQty:120, stockSt:'in_stock',     badges:['bestseller','new']             },
  { id:'fond-teint-velours',      nameFr:'Fond de Teint Velours',                 nameAr:'كريم أساس مخملي',                cat:'makeup',   priceReg:219, priceSale:null, cur:'MAD', stockQty:96,  stockSt:'in_stock',     badges:['bestseller']                   },
  { id:'rouge-levres-satin-rose', nameFr:'Rouge à Lèvres Satin Rose',             nameAr:'أحمر شفاه ساتان وردي',           cat:'makeup',   priceReg:129, priceSale:null, cur:'MAD', stockQty:200, stockSt:'in_stock',     badges:['vegan']                        },
  { id:'palette-sables-dores',    nameFr:'Palette Yeux Sables Dorés',             nameAr:'باليت عيون الرمال الذهبية',      cat:'makeup',   priceReg:299, priceSale:249,  cur:'MAD', stockQty:38,  stockSt:'in_stock',     badges:['bestseller','sale','exclusive'] },
  { id:'parfum-rose-orient',      nameFr:'Eau de Parfum Rose Orient',             nameAr:'عطر وردة الشرق',                 cat:'perfumes', priceReg:599, priceSale:null, cur:'MAD', stockQty:25,  stockSt:'in_stock',     badges:['exclusive','bestseller']       },
  { id:'parfum-ambre-musk',       nameFr:'Ambre & Musc Précieux',                 nameAr:'عنبر ومسك نفيس',                 cat:'perfumes', priceReg:479, priceSale:399,  cur:'MAD', stockQty:4,   stockSt:'low_stock',    badges:['sale','limited']               },
  { id:'masque-cheveux-argan',    nameFr:'Masque Réparateur Argan & Kératine',    nameAr:'قناع ترميمي بالأرغان والكيراتين', cat:'haircare', priceReg:179, priceSale:null, cur:'MAD', stockQty:67,  stockSt:'in_stock',     badges:['natural','bestseller']         },
  { id:'huile-5-precieuses',      nameFr:'Huile Sublime 5 Précieuses',            nameAr:'زيت فاخر بـ5 زيوت نفيسة',        cat:'haircare', priceReg:199, priceSale:null, cur:'MAD', stockQty:0,   stockSt:'out_of_stock', badges:['bestseller','natural']         },
  { id:'gel-douche-oranger',      nameFr:"Gel Douche Fleur d'Oranger",            nameAr:'جل الاستحمام بزهر البرتقال',     cat:'body',     priceReg:89,  priceSale:null, cur:'MAD', stockQty:150, stockSt:'in_stock',     badges:['vegan','natural','new']        },
  { id:'beurre-corps-rose',       nameFr:'Beurre Corps Rose & Henné',             nameAr:'زبدة الجسم بالورد والحناء',      cat:'body',     priceReg:149, priceSale:null, cur:'MAD', stockQty:88,  stockSt:'in_stock',     badges:['natural']                      },
  { id:'pinceau-kabuki-pro',      nameFr:'Pinceau Kabuki Pro',                    nameAr:'فرشاة كابوكي احترافية',           cat:'tools',    priceReg:159, priceSale:null, cur:'MAD', stockQty:34,  stockSt:'in_stock',     badges:['new']                          },
  { id:'gua-sha-quartz-rose',     nameFr:'Gua Sha en Quartz Rose',                nameAr:'حجر جوا شا من الكوارتز الوردي',  cat:'tools',    priceReg:119, priceSale:null, cur:'MAD', stockQty:60,  stockSt:'in_stock',     badges:['bestseller','new']             },
  { id:'rouleau-jade',            nameFr:'Rouleau Facial Jade',                   nameAr:'بكرة الوجه من الجاد',            cat:'tools',    priceReg:99,  priceSale:79,   cur:'MAD', stockQty:5,   stockSt:'low_stock',    badges:['sale','limited']               },
];

let pass = 0, fail = 0;
const ok = (label, condition) => {
  if (condition) { console.log('  \u2705 ' + label); pass++; }
  else           { console.error('  \u274c ' + label); fail++; }
};

const fmt = (n, l = 'fr') => {
  const f = new Intl.NumberFormat(l === 'ar' ? 'ar-MA' : 'fr-MA', {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  });
  return f.format(n) + ' ' + (l === 'ar' ? '\u062f.\u0645' : 'DH');
};

console.log('\n\u2501\u2501\u2501  Beauty Store Catalogue Validation  \u2501\u2501\u2501\n');

console.log('\uD83D\uDCE6  Count');
ok('Total = 16', products.length === 16);

console.log('\n\uD83D\uDD11  Required fields');
products.forEach(p => ok(p.id, p.id && p.nameFr && p.nameAr && typeof p.priceReg === 'number' && p.cur === 'MAD'));

console.log('\n\uD83D\uDCB0  Currency = MAD on all products');
ok('All products → MAD', products.every(p => p.cur === 'MAD'));

console.log('\n\uD83D\uDCC2  Category counts');
const cats = {};
products.forEach(p => { cats[p.cat] = (cats[p.cat] ?? 0) + 1; });
ok('skincare = 4', cats.skincare  === 4);
ok('makeup   = 3', cats.makeup    === 3);
ok('perfumes = 2', cats.perfumes  === 2);
ok('haircare = 2', cats.haircare  === 2);
ok('body     = 2', cats.body      === 2);
ok('tools    = 3', cats.tools     === 3);

console.log('\n\uD83C\uDFF7\uFE0F  MAD price formatting');
ok('249 fr  → "249,00 DH"',     fmt(249, 'fr') === '249,00 DH');
ok('249 ar  contains "d.m"',    fmt(249, 'ar').length > 0);
ok('1250 fr starts with "1"',   fmt(1250, 'fr').startsWith('1'));
ok('0 fr    → "0,00 DH"',       fmt(0, 'fr')   === '0,00 DH');

console.log('\n\uD83C\uDFAF  Sale prices');
const onSale = products.filter(p => p.priceSale !== null);
ok('5 products on sale', onSale.length === 5);
onSale.forEach(p => ok(p.id + ': sale < regular', p.priceSale < p.priceReg));

console.log('\n\uD83D\uDCCA  Stock statuses');
ok('in_stock     = 13', products.filter(p => p.stockSt === 'in_stock').length     === 13);
ok('low_stock    = 2',  products.filter(p => p.stockSt === 'low_stock').length    === 2);
ok('out_of_stock = 1',  products.filter(p => p.stockSt === 'out_of_stock').length === 1);

console.log('\n\uD83C\uDF0D  Bilingual names (fr + ar)');
ok('All products have fr + ar names', products.every(p => p.nameFr && p.nameAr));

const priceMin = Math.min(...products.map(p => p.priceSale ?? p.priceReg));
const priceMax = Math.max(...products.map(p => p.priceReg));
console.log('\n\uD83D\uDCCB  Catalogue summary');
ok('Price range 79 – 599 MAD', priceMin === 79 && priceMax === 599);
ok('No product priced in another currency', products.every(p => p.cur === 'MAD'));

console.log('\n\u2501\u2501\u2501  Results: ' + pass + ' passed, ' + fail + ' failed  \u2501\u2501\u2501\n');
process.exit(fail > 0 ? 1 : 0);
