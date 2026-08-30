import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Emulate __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, "..", "public");

// Ensure public directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Data structures matching server.ts exactly
const CITIES = ["Delhi", "Noida", "Gurgaon", "Faridabad", "Ghaziabad"];

const LOCALITIES = [
  // Faridabad
  { name: "Sector 31", city: "Faridabad", slug: "sector-31" },
  { name: "Sector 15", city: "Faridabad", slug: "sector-15" },
  { name: "Sector 14", city: "Faridabad", slug: "sector-14" },
  { name: "Sector 21", city: "Faridabad", slug: "sector-21" },
  { name: "Greenfield Colony", city: "Faridabad", slug: "greenfield" },
  { name: "NIT Faridabad", city: "Faridabad", slug: "nit" },
  { name: "Sector 16", city: "Faridabad", slug: "sector-16" },
  { name: "Sector 17", city: "Faridabad", slug: "sector-17" },
  { name: "Sector 19", city: "Faridabad", slug: "sector-19" },
  { name: "Sector 28", city: "Faridabad", slug: "sector-28" },
  { name: "Sector 29", city: "Faridabad", slug: "sector-29" },
  { name: "Sector 35", city: "Faridabad", slug: "sector-35" },
  { name: "Sector 37", city: "Faridabad", slug: "sector-37" },
  { name: "Sector 46", city: "Faridabad", slug: "sector-46" },
  { name: "Sector 85", city: "Faridabad", slug: "sector-85" },
  { name: "Sector 86", city: "Faridabad", slug: "sector-86" },
  { name: "Sector 89", city: "Faridabad", slug: "sector-89" },
  { name: "Neharpar", city: "Faridabad", slug: "neharpar" },
  { name: "Ashoka Enclave", city: "Faridabad", slug: "ashoka-enclave" },
  { name: "Sarai Khawaja", city: "Faridabad", slug: "sarai" },
  { name: "Surajkund", city: "Faridabad", slug: "surajkund" },
  { name: "Charmwood", city: "Faridabad", slug: "charmwood" },

  // Noida
  { name: "Sector 62", city: "Noida", slug: "sector-62" },
  { name: "Sector 15", city: "Noida", slug: "sector-15-noida" },
  { name: "Sector 18", city: "Noida", slug: "sector-18" },
  { name: "Sector 50", city: "Noida", slug: "sector-50" },
  { name: "Sector 137", city: "Noida", slug: "sector-137" },
  { name: "Sector 150", city: "Noida", slug: "sector-150" },
  { name: "Sector 63", city: "Noida", slug: "sector-63" },
  { name: "Sector 75", city: "Noida", slug: "sector-75" },
  { name: "Sector 76", city: "Noida", slug: "sector-76" },
  { name: "Sector 78", city: "Noida", slug: "sector-78" },
  { name: "Noida Extension", city: "Noida", slug: "noida-extension" },
  { name: "Greater Noida", city: "Noida", slug: "greater-noida" },
  { name: "Gaur City", city: "Noida", slug: "gaur-city" },

  // Gurgaon
  { name: "DLF Phase 1-5", city: "Gurgaon", slug: "dlf-phase" },
  { name: "Golf Course Road", city: "Gurgaon", slug: "golf-course-road" },
  { name: "Sohna Road", city: "Gurgaon", slug: "sohna-road" },
  { name: "Cyber City", city: "Gurgaon", slug: "cyber-city" },
  { name: "Golf Course Ext", city: "Gurgaon", slug: "golf-course-ext" },
  { name: "MG Road", city: "Gurgaon", slug: "mg-road" },
  { name: "Sushant Lok", city: "Gurgaon", slug: "sushant-lok" },
  { name: "Sector 56", city: "Gurgaon", slug: "sector-56-gurgaon" },
  { name: "Sector 82", city: "Gurgaon", slug: "sector-82-gurgaon" },
  { name: "Sector 45", city: "Gurgaon", slug: "sector-45-gurgaon" },

  // Delhi
  { name: "Dwarka", city: "Delhi", slug: "dwarka" },
  { name: "South Delhi", city: "Delhi", slug: "south-delhi" },
  { name: "West Delhi", city: "Delhi", slug: "west-delhi" },
  { name: "Punjabi Bagh", city: "Delhi", slug: "punjabi-bagh" },
  { name: "Rohini", city: "Delhi", slug: "rohini" },
  { name: "Janakpuri", city: "Delhi", slug: "janakpuri" },
  { name: "Saket", city: "Delhi", slug: "saket" },
  { name: "Pitampura", city: "Delhi", slug: "pitampura" },
  { name: "Karol Bagh", city: "Delhi", slug: "karol-bagh" },
  { name: "Connaught Place", city: "Delhi", slug: "connaught-place" },
  { name: "Greater Kailash", city: "Delhi", slug: "greater-kailash" },
  { name: "Vasant Kunj", city: "Delhi", slug: "vasant-kunj" },
  { name: "Hauz Khas", city: "Delhi", slug: "hauz-khas" },
  { name: "Malviya Nagar", city: "Delhi", slug: "malviya-nagar" },
  { name: "Rajouri Garden", city: "Delhi", slug: "rajouri-garden" },
  { name: "Model Town", city: "Delhi", slug: "model-town" },
  { name: "Civil Lines", city: "Delhi", slug: "civil-lines" },
  { name: "Mayur Vihar", city: "Delhi", slug: "mayur-vihar" },
  { name: "Preet Vihar", city: "Delhi", slug: "preet-vihar" },
  { name: "Laxmi Nagar", city: "Delhi", slug: "laxmi-nagar" },

  // Ghaziabad
  { name: "Indirapuram", city: "Ghaziabad", slug: "indirapuram" },
  { name: "Vaishali", city: "Ghaziabad", slug: "vaishali" },
  { name: "Vasundhara", city: "Ghaziabad", slug: "vasundhara" },
  { name: "Kaushambi", city: "Ghaziabad", slug: "kaushambi" },
  { name: "Raj Nagar Ext", city: "Ghaziabad", slug: "raj-nagar" },
  { name: "Crossing Republik", city: "Ghaziabad", slug: "crossing-republik" }
];

const OCCASIONS = [
  { name: "Birthday", slug: "birthday" },
  { name: "Anniversary", slug: "anniversary" },
  { name: "Wedding", slug: "wedding" },
  { name: "Engagement", slug: "engagement" },
  { name: "Baby Shower", slug: "baby-shower" },
  { name: "Retirement", slug: "retirement" },
  { name: "Farewell", slug: "farewell" },
  { name: "Graduation", slug: "graduation" },
  { name: "Corporate Events", slug: "corporate" }
];

const FLAVORS = [
  { name: "Belgian Chocolate Truffle", slug: "belgian-chocolate" },
  { name: "Chocolate Hazelnut", slug: "chocolate-hazelnut" },
  { name: "Classic Chocolate Truffle", slug: "truffle" },
  { name: "Ferrero Rocher", slug: "ferrero-rocher" },
  { name: "Lotus Biscoff", slug: "lotus-biscoff" },
  { name: "Indian Rasmalai", slug: "rasmalai" },
  { name: "Red Velvet Deluxe", slug: "red-velvet" },
  { name: "Classic Black Forest", slug: "black-forest" },
  { name: "Crunchy Butterscotch", slug: "butterscotch" },
  { name: "Sunshine Pineapple", slug: "pineapple" },
  { name: "Alphonso Mango", slug: "mango" },
  { name: "Sweet Strawberry", slug: "strawberry" },
  { name: "Orchard Fresh Fruit", slug: "fruit" },
  { name: "Madagascar Vanilla", slug: "vanilla" }
];

const THEMES = [
  { name: "Bento Mini", slug: "bento" },
  { name: "Interactive Pinata", slug: "pinata" },
  { name: "Cascading Pull Me Up", slug: "pull-me-up" },
  { name: "Edible Photo Print", slug: "photo" },
  { name: "Artisan Customized", slug: "customized" },
  { name: "Premium Designer", slug: "designer" },
  { name: "Kids Birthday Cartoon", slug: "kids" },
  { name: "Artisanal Cupcake Pack", slug: "cupcake" },
  { name: "Healthy Sugar-Free", slug: "sugar-free" },
  { name: "Bespoke 3D Sculpted", slug: "3d" },
  { name: "Hand-sculpted Fondant", slug: "fondant" },
  { name: "Magical Unicorn", slug: "unicorn" },
  { name: "Royal Princess Tier", slug: "princess" },
  { name: "Action Superhero", slug: "superhero" },
  { name: "Cricket pitch sports", slug: "cricket" },
  { name: "Football stadium sports", slug: "football" },
  { name: "Fitness Gym themed", slug: "gym" },
  { name: "Classic Sports Car", slug: "car" },
  { name: "Superbike sports", slug: "bike" },
  { name: "Paris Cosmetics Makeup Box", slug: "makeup" },
  { name: "Doctor & Medical special", slug: "doctor" },
  { name: "Engineers theme design", slug: "engineer" },
  { name: "Guru Teacher Special", slug: "teacher" }
];

const HAMPERS = [
  { name: "Gourmet Luxury Gift Hamper", slug: "premium-luxury-hamper" },
  { name: "Bespoke Birthday Surprise Casket", slug: "birthday-surprise-casket" },
  { name: "High-Tea Scone & Cookie Basket", slug: "high-tea-scone-basket" },
  { name: "Sweet Celebration Assorted Cookie Tray", slug: "sweet-celebration-cookie-tray" },
  { name: "Chocolate Lover's Grand Hamper", slug: "chocolate-lovers-gift-hamper" },
  { name: "Handmade Luxury Praline Box", slug: "handmade-praline-box" },
  { name: "Bakers Special Breakfast Basket", slug: "bakers-breakfast-basket" }
];

const BAKERY_ITEMS = [
  { name: "Artisanal Sourdough Boule", slug: "sourdough-boule" },
  { name: "Garlic Butter Herbed Loaf", slug: "garlic-butter-bread" },
  { name: "Italian Black Olive Focaccia", slug: "olive-focaccia" },
  { name: "Buttery Brioche Burger Buns", slug: "brioche-buns" },
  { name: "Traditional French Baguette", slug: "french-baguette" },
  { name: "Assorted French Macarons Pack", slug: "macarons-pack" },
  { name: "English Sweet Scones Box", slug: "sweet-scones" },
  { name: "Premium Butter Croissants Pair", slug: "butter-croissants" }
];

console.log("Starting sitemap build-time generation...");

// 1. GENERATE sitemap_core.xml
{
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Core static pages
  const corePages = ["", "shop", "custom-order", "about", "contact", "blog", "legal", "seo-directory", "corporate-catering", "reviews-gallery", "rewards-loyalty", "ai-designer"];
  corePages.forEach(p => {
    xml += `  <url>\n    <loc>https://www.cakeurban.com/${p}</loc>\n    <lastmod>2026-07-06</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
  });

  // Regional hubs
  const hubs = [
    "bakery-in-delhi", 
    "bakery-in-noida", 
    "bakery-in-faridabad", 
    "bakery-in-gurgaon", 
    "bakery-in-ghaziabad",
    "midnight-cake-delivery-faridabad",
    "eggless-cake-delivery-faridabad",
    "pinata-cakes-faridabad",
    "photo-cakes-faridabad",
    "greater-faridabad-cake-delivery",
    "nit-faridabad-cake-delivery",
    "bento-mini-cakes-faridabad"
  ];
  hubs.forEach(h => {
    xml += `  <url>\n    <loc>https://www.cakeurban.com/${h}</loc>\n    <lastmod>2026-07-06</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.95</priority>\n  </url>\n`;
  });

  // Custom studios
  const studios = ["designer-cakes-in-noida", "custom-cakes-in-gurgaon", "photo-cakes-in-ghaziabad", "cake-delivery-in-faridabad"];
  studios.forEach(s => {
    xml += `  <url>\n    <loc>https://www.cakeurban.com/${s}</loc>\n    <lastmod>2026-07-06</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.90</priority>\n  </url>\n`;
  });

  xml += `</urlset>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap_core.xml"), xml, "utf-8");
  console.log("Generated sitemap_core.xml");
}

// 2. GENERATE sitemap_sectors.xml (Main Hubs & City Level ONLY - No micro-sectors)
{
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Curated Main Hubs that are index, follow
  const curatedMainHubs = [
    "midnight-cake-delivery-faridabad",
    "eggless-cake-delivery-faridabad",
    "pinata-cakes-faridabad",
    "photo-cakes-faridabad",
    "greater-faridabad-cake-delivery",
    "nit-faridabad-cake-delivery",
    "bento-mini-cakes-faridabad",
    "cake-delivery-in-faridabad",
    "cake-delivery-in-delhi",
    "cake-delivery-in-noida",
    "cake-delivery-in-gurgaon",
    "cake-delivery-in-ghaziabad",
    "best-cake-in-faridabad",
    "cake-shop-in-faridabad",
    "eggless-cake-in-faridabad",
    "birthday-cake-in-faridabad"
  ];
  curatedMainHubs.forEach(s => {
    xml += `  <url>\n    <loc>https://www.cakeurban.com/${s}</loc>\n    <lastmod>2026-07-06</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.90</priority>\n  </url>\n`;
  });

  xml += `</urlset>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap_sectors.xml"), xml, "utf-8");
  console.log("Generated sitemap_sectors.xml");
}

// 3. GENERATE sitemap_specialties.xml
{
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static primary specialty pages (Indexable)
  const staticSpecialties = [
    "belgian-chocolate-truffle-cake",
    "lotus-biscoff-cake",
    "chocolate-hazelnut-cake",
    "eggless-red-velvet-cake",
    "pinata-cake-with-hammer",
    "bento-cake-delivery",
    "edible-photo-print-cake",
    "pull-me-up-cake",
    "sugar-free-healthy-cake",
    "rasmalai-cake-delivery",
    "customized-theme-cakes",
    "cupcake-pack-delivery",
    "premium-designer-cakes",
    "kids-birthday-cartoon-cake",
    "3d-sculpted-cakes",
    "fondant-art-cakes",
    "unicorn-theme-cake",
    "princess-crown-cake",
    "superhero-avengers-cake",
    "cricket-pitch-cake",
    "gym-fitness-cake",
    "makeup-box-cosmetics-cake"
  ];
  staticSpecialties.forEach(s => {
    xml += `  <url>\n    <loc>https://www.cakeurban.com/${s}</loc>\n    <lastmod>2026-07-06</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.90</priority>\n  </url>\n`;
  });

  xml += `</urlset>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap_specialties.xml"), xml, "utf-8");
  console.log("Generated sitemap_specialties.xml");
}

// 4. GENERATE sitemap_combinations.xml (Curated Primary Hub Combos ONLY)
{
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static indexable primary combinations
  const staticCombinations = [
    "belgian-chocolate-birthday-cake-in-faridabad",
    "lotus-biscoff-anniversary-cake-in-faridabad",
    "chocolate-hazelnut-wedding-cake-in-faridabad",
    "eggless-red-velvet-engagement-cake-in-faridabad",
    "rasmalai-corporate-event-cake-in-faridabad",
    "bento-mini-birthday-cake-in-faridabad",
    "pinata-hammer-kids-cake-in-faridabad",
    "edible-photo-anniversary-cake-in-faridabad"
  ];
  staticCombinations.forEach(s => {
    xml += `  <url>\n    <loc>https://www.cakeurban.com/${s}</loc>\n    <lastmod>2026-07-06</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
  });

  xml += `</urlset>`;
  fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap_combinations.xml"), xml, "utf-8");
  console.log("Generated sitemap_combinations.xml");
}

// 5. GENERATE sitemap.xml (Sitemap Index)
{
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.cakeurban.com/sitemap_core.xml</loc>
    <lastmod>2026-07-06</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.cakeurban.com/sitemap_sectors.xml</loc>
    <lastmod>2026-07-06</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.cakeurban.com/sitemap_specialties.xml</loc>
    <lastmod>2026-07-06</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.cakeurban.com/sitemap_combinations.xml</loc>
    <lastmod>2026-07-06</lastmod>
  </sitemap>
</sitemapindex>
`;
  fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap.xml"), xml, "utf-8");
  console.log("Generated sitemap.xml index");
}

console.log("All sitemaps successfully pre-generated for build phase!");
