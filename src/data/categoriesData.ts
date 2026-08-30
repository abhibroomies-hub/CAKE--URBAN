import { CategoryCollection } from '../types';

export const PRESET_LUXURY_COLLECTIONS: Omit<CategoryCollection, 'id'>[] = [
  // 🎂 Column 1: Birthday & Classics
  {
    title: "Birthday Cakes",
    slug: "birthday-cakes",
    group: "birthday",
    icon: "🎂",
    badge: "POPULAR",
    description: "Multi-flavor artisanal birthday sponge and layer cakes.",
    image: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=800&q=80",
    isFeatured: true,
    sortOrder: 1
  },
  {
    title: "Chocolate Cakes",
    slug: "chocolate-cakes",
    group: "birthday",
    icon: "🍫",
    badge: "HOT",
    description: "72% Belgian dark couverture and hazelnut praline ganache.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
    isFeatured: false,
    sortOrder: 2
  },
  {
    title: "Red Velvet Fantasy",
    slug: "red-velvet-fantasy",
    group: "birthday",
    icon: "❤️",
    badge: "BESTSELLER",
    description: "Classic scarlet velvet sponge with organic Madagascar vanilla cream cheese.",
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=800&q=80",
    isFeatured: false,
    sortOrder: 3
  },
  {
    title: "Classic Black Forest",
    slug: "classic-black-forest",
    group: "birthday",
    icon: "🍒",
    badge: "",
    description: "German chocolate layers with tart sour cherries and whipped double cream.",
    image: "https://images.unsplash.com/photo-1511018556340-d16986a1c194?w=800&q=80",
    isFeatured: false,
    sortOrder: 4
  },
  {
    title: "Golden Butterscotch",
    slug: "golden-butterscotch",
    group: "birthday",
    icon: "🍯",
    badge: "",
    description: "Salted caramel drizzle with crunchy praline bits and brown butter frosting.",
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80",
    isFeatured: false,
    sortOrder: 5
  },
  {
    title: "Fresh Fruit Gateaux",
    slug: "fresh-fruit-gateaux",
    group: "birthday",
    icon: "🍓",
    badge: "FRESH",
    description: "Seasonal handpicked berries, kiwi, and dragonfruit on light vanilla chiffon.",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
    isFeatured: false,
    sortOrder: 6
  },
  {
    title: "Eggless Celebrations",
    slug: "eggless-celebrations",
    group: "birthday",
    icon: "🌱",
    badge: "100% VEG",
    description: "100% pure vegetarian cakes baked without eggs, ultra-moist and fluffy.",
    image: "https://images.unsplash.com/photo-1586985289688-ca9cf4993ec0?w=800&q=80",
    isFeatured: false,
    sortOrder: 7
  },
  {
    title: "Premium Royal Collection",
    slug: "premium-royal-collection",
    group: "birthday",
    icon: "👑",
    badge: "LUXURY",
    description: "24k edible gold leaf, French macarons, and hand-sculpted sugar florals.",
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=800&q=80",
    isFeatured: true,
    sortOrder: 8
  },

  // 👰 Column 2: Designer Class
  {
    title: "Grand Wedding Cakes",
    slug: "grand-wedding-cakes",
    group: "designer",
    icon: "👰",
    badge: "TIERED",
    description: "Breathtaking multi-tiered architectural centerpieces with custom doweling.",
    image: "https://images.unsplash.com/photo-1519222970733-f546218fa6d7?w=800&q=80",
    isFeatured: true,
    sortOrder: 9
  },
  {
    title: "Romantic Anniversary",
    slug: "romantic-anniversary",
    group: "designer",
    icon: "💖",
    badge: "ROMANTIC",
    description: "Heart-shaped couture silhouettes and rose-infused buttercreams.",
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80",
    isFeatured: false,
    sortOrder: 10
  },
  {
    title: "Playful Kids Fantasy",
    slug: "playful-kids-fantasy",
    group: "designer",
    icon: "🎈",
    badge: "THEME",
    description: "Animated cartoon, superhero, jungle safari, and rainbow pinata cakes.",
    image: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=800&q=80",
    isFeatured: false,
    sortOrder: 11
  },
  {
    title: "High-Def Photo Cakes",
    slug: "high-def-photo-cakes",
    group: "designer",
    icon: "📸",
    badge: "HD PRINT",
    description: "Ultra-sharp edible sugar sheet prints with personalized memories.",
    image: "https://images.unsplash.com/photo-1586985289688-ca9cf4993ec0?w=800&q=80",
    isFeatured: false,
    sortOrder: 12
  },
  {
    title: "Bespoke Theme Cakes",
    slug: "bespoke-theme-cakes",
    group: "designer",
    icon: "🎨",
    badge: "CUSTOM",
    description: "Custom sculpted 3D fondant characters, hobby motifs, and gravity-defying cakes.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
    isFeatured: false,
    sortOrder: 13
  },
  {
    title: "Architectural Designer Cakes",
    slug: "architectural-designer-cakes",
    group: "designer",
    icon: "🏛️",
    badge: "ATELIER",
    description: "Modern geometric, floating tier, and minimalist contemporary cakes.",
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=800&q=80",
    isFeatured: false,
    sortOrder: 14
  },
  {
    title: "Corporate Milestone Cakes",
    slug: "corporate-milestone-cakes",
    group: "designer",
    icon: "💼",
    badge: "BUSINESS",
    description: "Company logo edible branding, foundation anniversaries, and launch parties.",
    image: "https://images.unsplash.com/photo-1511018556340-d16986a1c194?w=800&q=80",
    isFeatured: false,
    sortOrder: 15
  },

  // 🔥 Column 4: Trending & Specials
  {
    title: "Top Rated Collections",
    slug: "top-rated-collections",
    group: "trending",
    icon: "⭐",
    badge: "4.9★",
    description: "Highest rated pastry chef creations with 5-star customer ratings.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
    isFeatured: true,
    sortOrder: 16
  },
  {
    title: "Best Selling Bentos",
    slug: "best-selling-bentos",
    group: "trending",
    icon: "🍱",
    badge: "HOT",
    description: "Korean aesthetic mini lunchbox cakes for intimate celebrations.",
    image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=800&q=80",
    isFeatured: false,
    sortOrder: 17
  },
  {
    title: "Chef Signature Specials",
    slug: "chef-signature-specials",
    group: "trending",
    icon: "👨‍🍳",
    badge: "CHEF",
    description: "Limited batch artisan recipes developed exclusively by our master pâtissier.",
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80",
    isFeatured: false,
    sortOrder: 18
  },
  {
    title: "New Pastel Arrivals",
    slug: "new-pastel-arrivals",
    group: "trending",
    icon: "🌸",
    badge: "NEW",
    description: "Soft pastel tones with French buttercream and edible dried botanicals.",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
    isFeatured: false,
    sortOrder: 19
  },
  {
    title: "Curated Hampers & Treats",
    slug: "curated-hampers-and-treats",
    group: "trending",
    icon: "🎁",
    badge: "RARE",
    description: "Luxury gift boxes with macarons, gourmet cookies, cake jars, and sparkling cider.",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80",
    isFeatured: false,
    sortOrder: 20
  }
];
