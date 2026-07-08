import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  Heart, 
  Star, 
  Check, 
  Plus, 
  Clock, 
  Filter, 
  SlidersHorizontal, 
  Search, 
  MessageCircle,
  Eye,
  ShoppingBag,
  Flame,
  ArrowLeftRight
} from 'lucide-react';
import { useCart } from '../lib/store';
import { toast } from 'sonner';
import { 
  LuxuryConcierge, 
  QuickOrderModal, 
  StickyCTA, 
  AICakeRecommendation, 
  LuxuryTestimonials, 
  PremiumFooterBanner 
} from '../components/LuxuryShared';

export default function CookiesCollection() {
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('popular');
  const addCartItem = useCart((state) => state.addItem);

  // Toggle Favorite
  const toggleFavorite = (id: string, name: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(f => f !== id));
      toast.info(`Removed ${name} from your wishlist.`);
    } else {
      setFavorites([...favorites, id]);
      toast.success(`Saved ${name} to your wishlist! ❤️`);
    }
  };

  // Cookies Category List (The 10 mandated categories)
  const cookieCategories = [
    { id: 'classic', name: "Classic Cookies", emoji: "🍪", desc: "Traditional home-baked perfection with golden crisp edges.", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=600" },
    { id: 'chocolate', name: "Chocolate Cookies", emoji: "🍫", desc: "Dark and milk chocolate chunks folded into Belgian cocoa dough.", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600" },
    { id: 'double-chocolate', name: "Double Chocolate", emoji: "🍩", desc: "Decadent pure chocolate dough with pockets of melting fudge.", image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&q=80&w=600" },
    { id: 'red-velvet', name: "Red Velvet Cookies", emoji: "🍰", desc: "Crimson cocoa dough filled with velvety white chocolate.", image: "https://images.unsplash.com/photo-1618923850107-d1a234d7a73a?auto=format&fit=crop&q=80&w=600" },
    { id: 'nut', name: "Nut Cookies", emoji: "🌰", desc: "Packed with hand-roasted macadamias, pecans, and hazelnuts.", image: "https://images.unsplash.com/photo-1558961309-dbdf079115fd?auto=format&fit=crop&q=80&w=600" },
    { id: 'coffee', name: "Coffee Cookies", emoji: "☕", desc: "Infused with organic single-origin espresso and dark chocolate.", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600" },
    { id: 'healthy', name: "Healthy Cookies", emoji: "🌱", desc: "Wholesome gluten-free oats, chia seeds, and unrefined honey.", image: "https://images.unsplash.com/photo-1532499016263-f2c3e89df9cd?auto=format&fit=crop&q=80&w=600" },
    { id: 'sugar-free', name: "Sugar Free Cookies", emoji: "🍯", desc: "Naturally sweetened using high-grade monk fruit, no glycemic spike.", image: "https://images.unsplash.com/photo-1548365328-8c6db3220e4c?auto=format&fit=crop&q=80&w=600" },
    { id: 'luxury-box', name: "Luxury Cookie Box", emoji: "🎁", desc: "An architectural selection box hand-wrapped in signature silk.", image: "https://images.unsplash.com/photo-1511018556340-d16986a1c194?auto=format&fit=crop&q=80&w=600" },
    { id: 'festival', name: "Festival Cookies", emoji: "✨", desc: "Gold leaf dusted creations for premium celebrations and gifting.", image: "https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&q=80&w=600" }
  ];

  // Elite Products Array (Interactive and filterable)
  const cookieProducts = [
    {
      id: 'ck-gold-imperial',
      name: "The Imperial Gold Leaf Cookie",
      category: "Festival Cookies",
      price: 499,
      rating: 4.9,
      reviews: 142,
      desc: "Luxurious double-baked dark chocolate chunk cookie hand-gilded with 24-Karat French gold leaf.",
      image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&q=80&w=600",
      eta: "30-40 mins",
      tag: "SIGNATURE BESTSELLER",
      isBestseller: true
    },
    {
      id: 'ck-belgian-chunk',
      name: "Belgian Triple Dark Chunk",
      category: "Double Chocolate",
      price: 299,
      rating: 4.8,
      reviews: 218,
      desc: "Rich 70% Callebaut chocolate chunks inside a soft, fudge-centered chocolate dough.",
      image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=600",
      eta: "25-30 mins",
      tag: "CHEF'S PICK",
      isNew: true
    },
    {
      id: 'ck-macadamia-dream',
      name: "Salted Macadamia & White Velvet",
      category: "Nut Cookies",
      price: 349,
      rating: 4.9,
      reviews: 95,
      desc: "Slow-roasted Australian macadamia nuts paired with premium Swiss white chocolate and Maldon salt flakes.",
      image: "https://images.unsplash.com/photo-1558961309-dbdf079115fd?auto=format&fit=crop&q=80&w=600",
      eta: "30-45 mins",
      tag: "MOST POPULAR"
    },
    {
      id: 'ck-kashmiri-shortbread',
      name: "Kashmiri Pistachio Cardamom",
      category: "Classic Cookies",
      price: 399,
      rating: 4.7,
      reviews: 83,
      desc: "Exquisite melt-in-mouth organic butter shortbread infused with green cardamom and slivered Kashmiri pistachios.",
      image: "https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&q=80&w=600",
      eta: "40-50 mins",
      tag: "CRAFT CLASSIC"
    },
    {
      id: 'ck-velvet-dior',
      name: "Dior Crimson Red Velvet",
      category: "Red Velvet Cookies",
      price: 329,
      rating: 4.9,
      reviews: 167,
      desc: "Vibrant red velvet biscuit layered with organic cream cheese frosting centers and white chocolate buttons.",
      image: "https://images.unsplash.com/photo-1618923850107-d1a234d7a73a?auto=format&fit=crop&q=80&w=600",
      eta: "25-35 mins",
      tag: "NEW LUXURY",
      isNew: true
    },
    {
      id: 'ck-espresso-hazelnut',
      name: "Single-Origin Espresso Praline",
      category: "Coffee Cookies",
      price: 359,
      rating: 4.8,
      reviews: 112,
      desc: "Bold Madanapalle espresso roast cookie with a silky hazelnut praline center that oozes upon breaking.",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600",
      eta: "30-40 mins",
      tag: "DARK INDULGENCE"
    },
    {
      id: 'ck-monkfruit-oat',
      name: "Monk Fruit Oatmeal Granola",
      category: "Sugar Free Cookies",
      price: 289,
      rating: 4.6,
      reviews: 79,
      desc: "Low-carb grain-free oats cookie naturally sweetened with monk fruit, flax seeds, and dark sugar-free cocoa nibs.",
      image: "https://images.unsplash.com/photo-1532499016263-f2c3e89df9cd?auto=format&fit=crop&q=80&w=600",
      eta: "35-45 mins",
      tag: "SUGAR FREE HEALTHY"
    },
    {
      id: 'ck-royal-selection-box',
      name: "La Parisienne Assorted Box",
      category: "Luxury Cookie Box",
      price: 1599,
      rating: 5.0,
      reviews: 310,
      desc: "A collector's gift box housing 12 of our most prestigious hand-crafted cookies. Perfectly compartmentalized.",
      image: "https://images.unsplash.com/photo-1511018556340-d16986a1c194?auto=format&fit=crop&q=80&w=600",
      eta: "Same Day Delivery",
      tag: "EXQUISITE GIFTING"
    }
  ];

  const handleAddToCart = (cookie: any) => {
    addCartItem({
      id: cookie.id,
      name: cookie.name,
      description: cookie.desc,
      price: cookie.price,
      categories: ['Cookies', cookie.category],
      occasions: ['Gifting', 'Snack'],
      flavors: ['Standard Luxury Chocolate'],
      images: [cookie.image],
      stockStatus: 'in-stock',
      isCustomizable: false
    }, {
      selectedWeight: 0.5,
      eggless: true
    });
    toast.success(`${cookie.name} curated & safely secured in your basket! ✨`);
  };

  // Filtering and Sorting logic
  const filteredProducts = cookieProducts
    .filter(product => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (selectedSort === 'price-low') return a.price - b.price;
      if (selectedSort === 'price-high') return b.price - a.price;
      if (selectedSort === 'rating') return b.rating - a.rating;
      return b.reviews - a.reviews; // Default to popular
    });

  return (
    <div className="bg-[#FFF8FB] min-h-screen text-slate-800 font-sans relative select-none pb-24 md:pb-0 overflow-x-hidden">
      
      {/* =========================================================
          LUXURY EDITORIAL BACKGROUND EFFECTS (Parallax-ready)
          ========================================================= */}
      <div className="absolute top-0 left-0 w-full h-[120vh] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[60%] bg-gradient-to-br from-[#FF4FA3]/10 via-[#8B5CF6]/5 to-transparent blur-[160px]" />
        <div className="absolute top-[30%] right-[-10%] w-[55%] h-[55%] bg-gradient-to-bl from-[#FFD166]/10 via-[#FF4FA3]/5 to-transparent blur-[140px]" />
        
        {/* Animated Background Particles */}
        <div className="absolute top-[15%] left-[20%] w-2 h-2 rounded-full bg-[#FF4FA3]/35 animate-ping duration-1000" />
        <div className="absolute top-[40%] right-[25%] w-3 h-3 rounded-full bg-[#8B5CF6]/25 animate-pulse" />
        <div className="absolute top-[65%] left-[12%] w-1.5 h-1.5 rounded-full bg-[#FFD166]/60 animate-bounce" />
      </div>

      {/* Floating Emojis / Decorations */}
      <div className="absolute top-[14%] right-[8%] text-4xl animate-bounce hidden md:block select-none pointer-events-none opacity-80" style={{ animationDuration: '4s' }}>🍪</div>
      <div className="absolute top-[28%] left-[6%] text-3xl animate-pulse hidden md:block select-none pointer-events-none opacity-70" style={{ animationDuration: '5s' }}>☕</div>
      <div className="absolute bottom-[35%] right-[5%] text-2xl animate-bounce hidden md:block select-none pointer-events-none opacity-60" style={{ animationDuration: '3.5s' }}>🍫</div>
      <div className="absolute bottom-[15%] left-[4%] text-3xl animate-pulse hidden md:block select-none pointer-events-none opacity-80" style={{ animationDuration: '4.5s' }}>🥛</div>

      {/* =========================================================
          HERO SECTION (Luxury Editorial Full Width Banner)
          ========================================================= */}
      <section className="relative pt-16 pb-24 md:py-36 max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md border border-[#FF4FA3]/20 py-2 px-4 rounded-full shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#FF4FA3]" />
                <span className="text-[#FF4FA3] font-black text-[10px] tracking-[0.3em] uppercase">
                  LA SÉLECTION DE BISCUITS
                </span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black tracking-tighter text-slate-900 leading-[0.95] font-sans">
                Freshly Baked <br />
                <span className="bg-gradient-to-r from-[#FF4FA3] via-[#8B5CF6] to-[#FFD166] bg-clip-text text-transparent">
                  Premium Cookies
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
              className="text-slate-500 font-semibold text-sm sm:text-base md:text-lg leading-relaxed max-w-xl"
            >
              Savor the art of French-inspired luxury biscuits. Made every single day using imported butter from Normandy, single-origin organic cocoa, and traditional secret recipes. Perfected for elite sensory pleasure.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <button 
                onClick={() => setIsQuickOrderOpen(true)}
                className="bg-gradient-to-r from-[#FF4FA3] to-[#8B5CF6] hover:brightness-110 text-white text-xs sm:text-sm font-black uppercase tracking-[0.2em] py-5 px-10 rounded-full transition-all duration-300 hover:shadow-[0_15px_40px_rgba(255,79,163,0.35)] hover:scale-105 active:scale-95 flex items-center gap-2.5"
              >
                <span>Order Cookies</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
              
              <button 
                onClick={() => {
                  const el = document.getElementById('cookie-collection-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white/80 hover:bg-white text-slate-800 border border-slate-200 text-xs sm:text-sm font-black uppercase tracking-[0.2em] py-5 px-10 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span>Explore Collection</span>
              </button>
            </motion.div>

            {/* Premium Indicators */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.45 }}
              className="flex flex-wrap items-center gap-8 pt-8 border-t border-slate-200/60 max-w-lg"
            >
              <div>
                <span className="text-2xl font-black text-slate-900 block">Normandy</span>
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Imported Butter</span>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div>
                <span className="text-2xl font-black text-slate-900 block">Zero</span>
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Preservatives</span>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div>
                <span className="text-2xl font-black text-slate-900 block">3 Hour</span>
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Express Dispatch</span>
              </div>
            </motion.div>
          </div>

          {/* Right Hero Column: Floating Cookies & Chocolate Splash */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[480px] aspect-square rounded-[48px] overflow-hidden shadow-[0_40px_90px_rgba(255,79,163,0.12)] border-8 border-white bg-slate-50 group"
            >
              {/* Product Photo */}
              <img 
                src="https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=800" 
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[4000ms] ease-out" 
                alt="Luxury Gourmet Cookies Stack" 
                referrerPolicy="no-referrer"
              />
              
              {/* Splashes Overlay Graphic */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent pointer-events-none" />

              {/* Floating Cookie Tag Card */}
              <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-xl rounded-3xl p-5 shadow-[0_15px_35px_rgba(0,0,0,0.06)] border border-white flex justify-between items-center text-left">
                <div className="space-y-1">
                  <span className="text-[#FF4FA3] font-black text-[9px] uppercase tracking-widest block">L’ÉTOILE DES BISCUITS</span>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">Normandy Sea-Salt Fudge</h4>
                  <p className="text-[10px] text-slate-500 font-semibold leading-normal">Premium sea salt with slow-melting Belgian chocolate fudge.</p>
                </div>
                <div className="bg-[#FF4FA3]/10 text-[#FF4FA3] p-3 rounded-2xl">
                  <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* =========================================================
          THE 10 MANDATED CATEGORIES GRID
          ========================================================= */}
      <section className="py-24 bg-white border-y border-slate-100/80 relative z-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12 space-y-16">
          
          <div className="text-center space-y-3">
            <span className="text-[#FF4FA3] font-black text-[10px] tracking-[0.3em] uppercase block">PREMIUM ATELIER DE DESIGN</span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              Curate Your Cookie Experience
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-semibold max-w-md mx-auto">
              Select from our 10 exquisite master categories, baked with precision and packed in premium silk-lined containers.
            </p>
          </div>

          {/* Categories Grid (Touch targets 48px minimum) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {cookieCategories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06, duration: 0.5 }}
                onClick={() => {
                  setActiveCategory(cat.name);
                  const el = document.getElementById('cookie-collection-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  toast.success(`Filter applied: ${cat.name}! 🍪`);
                }}
                className={`group cursor-pointer rounded-[32px] p-5 border text-left flex flex-col justify-between h-[210px] transition-all duration-300 ${
                  activeCategory === cat.name 
                    ? 'border-[#FF4FA3] bg-[#FFF8FB] shadow-[0_15px_35px_rgba(255,79,163,0.1)] scale-[1.03]'
                    : 'border-slate-200/50 bg-slate-50 hover:border-[#FF4FA3]/40 hover:bg-white hover:shadow-[0_12px_30px_rgba(0,0,0,0.03)] hover:-translate-y-1'
                }`}
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden relative shadow-sm border border-white">
                    <img src={cat.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={cat.name} referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-slate-950/20 flex items-center justify-center text-xl">
                      {cat.emoji}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">{cat.name}</h3>
                    <p className="text-[10px] text-slate-400 font-semibold leading-relaxed line-clamp-3">{cat.desc}</p>
                  </div>
                </div>

                <span className="text-[9px] font-black text-[#FF4FA3] uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================
          FEATURED BANNER: Chef's Signature Collection
          ========================================================= */}
      <section className="py-24 max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12 relative z-10">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-[48px] border border-slate-800/80 p-8 md:p-16 text-left relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12 shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
          
          {/* Accent lighting glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF4FA3]/10 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#8B5CF6]/10 blur-[90px] pointer-events-none" />

          {/* Left Text */}
          <div className="space-y-6 max-w-xl relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 py-1.5 px-3.5 rounded-full text-[#FFD166] font-black text-[9px] uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE EXQUISITE CHEF COLLECTION</span>
            </div>

            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none font-sans">
              Chef's Signature <br />
              <span className="bg-gradient-to-r from-[#FFD166] to-[#FF4FA3] bg-clip-text text-transparent">
                Cookie Masterpieces
              </span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-400 font-semibold leading-relaxed">
              Every month, our chief pâtissier designs limited-edition luxury bakes with premium lighting ingredients, whole vanilla caviar from Madagascar, and delicate edible gold flakes.
            </p>

            <button 
              onClick={() => {
                const el = document.getElementById('cookie-collection-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                toast.success("Navigating to signature creations! ✨");
              }}
              className="bg-white hover:bg-slate-100 text-slate-950 text-xs font-black uppercase tracking-[0.25em] py-4.5 px-8 rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg shadow-white/5"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>

          {/* Right Product Photography */}
          <div className="relative z-10 w-full lg:max-w-[460px] aspect-video sm:aspect-square rounded-[36px] overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
            <img 
              src="https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&q=80&w=800" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms]" 
              alt="Signature Chocolate Chip Cookie Premium Photography" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent pointer-events-none" />
            
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div>
                <span className="text-[#FFD166] font-black text-[8px] uppercase tracking-widest block">LIMITED RUN</span>
                <h4 className="text-xs font-black text-white uppercase tracking-wider mt-0.5">Imperial Pistachio Gold</h4>
              </div>
              <span className="bg-white/10 backdrop-blur-md text-white font-black text-[9px] px-3 py-1 rounded-full border border-white/10">₹499</span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          THE DENSE LUXURY PRODUCT GRID
          ========================================================= */}
      <section id="cookie-collection-grid" className="py-24 max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12 space-y-12 relative z-10">
        
        {/* Sorting, Filtering & Search Controls */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6 bg-white/70 backdrop-blur-xl border border-slate-200/50 p-6 rounded-[32px] shadow-sm text-left">
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#FF4FA3]/10 text-[#FF4FA3] rounded-2xl">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Filtered Masterworks</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Currently showing: {activeCategory} Collections</p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search designer cookies (e.g., Gold, Red Velvet)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/60 focus:border-[#FF4FA3] focus:bg-white rounded-2xl pl-12 pr-4 py-3 text-xs font-medium focus:outline-none transition-all placeholder:text-slate-400 text-slate-800"
            />
          </div>

          <div className="flex items-center gap-4.5">
            {/* Category quick-clean reset */}
            {activeCategory !== 'All' && (
              <button 
                onClick={() => {
                  setActiveCategory('All');
                  toast.success("Reset filters to all premium collections!");
                }}
                className="text-xs font-black text-[#FF4FA3] uppercase tracking-widest hover:underline"
              >
                Reset Filter
              </button>
            )}

            {/* Sort Selector */}
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-black uppercase text-slate-700 focus:outline-none focus:border-[#FF4FA3] transition-colors"
            >
              <option value="popular">Popular Selection</option>
              <option value="rating">Top Rated Elite</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* Product Cards Grid: Desktop: 4, Laptop: 4, Tablet: 3, Mobile: 2 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((cookie) => (
              <motion.div
                key={cookie.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="bg-white/75 backdrop-blur-md border border-slate-200/30 rounded-[32px] p-5 shadow-sm hover:shadow-[0_25px_55px_rgba(255,79,163,0.06)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between text-left group h-[420px]"
              >
                {/* Image and badges */}
                <div className="space-y-4 relative">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-sm bg-slate-50 border border-slate-100">
                    <img 
                      src={cookie.image} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      alt={cookie.name} 
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Floating wishlist heart */}
                    <button 
                      onClick={() => toggleFavorite(cookie.id, cookie.name)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all shadow-sm"
                    >
                      <Heart className={`w-4.5 h-4.5 ${favorites.includes(cookie.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                    </button>

                    {/* Left category badge */}
                    <span className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md text-[#FFD166] font-black text-[7px] uppercase tracking-widest px-2.5 py-1 rounded-full">
                      {cookie.category}
                    </span>

                    {/* Top seller tag */}
                    {cookie.tag && (
                      <span className="absolute top-3 left-3 bg-[#FF4FA3] text-white font-black text-[7px] uppercase tracking-widest px-2.5 py-1 rounded-full">
                        {cookie.tag}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{cookie.rating}</span>
                      <span className="text-slate-400">({cookie.reviews} elite reviews)</span>
                    </div>

                    <h3 className="text-sm font-black text-slate-900 group-hover:text-[#FF4FA3] transition-colors leading-tight line-clamp-1 uppercase tracking-wider">{cookie.name}</h3>
                    <p className="text-[11px] text-slate-400 font-semibold leading-relaxed line-clamp-2 h-[34px]">{cookie.desc}</p>
                  </div>
                </div>

                {/* Footer block with details & quick add button */}
                <div className="border-t border-slate-100 pt-4 mt-2">
                  <div className="flex items-center justify-between text-[9px] text-slate-400 font-black uppercase tracking-widest mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" />
                      <span>ETA: {cookie.eta}</span>
                    </span>
                    <span className="text-slate-500">Eggless 🌱 Included</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[8px] font-black text-slate-400 block">PRICE</span>
                      <span className="text-base font-black text-slate-950">₹{cookie.price}</span>
                    </div>

                    <button 
                      onClick={() => handleAddToCart(cookie)}
                      className="bg-slate-950 hover:bg-[#FF4FA3] text-[#FFD166] hover:text-white text-[9px] font-black uppercase tracking-widest py-3 px-5 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-md flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>QUICK ADD</span>
                    </button>
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto text-[#FF4FA3]">
              <Search className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">No Gourmet Match Found</h4>
              <p className="text-xs text-slate-400 font-semibold">Try modifying your search or reset categories to browse our complete curation.</p>
            </div>
          </div>
        )}

      </section>

      {/* =========================================================
          AI CAKE & COOKIE RECOMMENDATION
          ========================================================= */}
      <section className="py-12 bg-[#FFF8FB]/80">
        <AICakeRecommendation category="Cookies Gift Hamper" />
      </section>

      {/* =========================================================
          COMMON TESTIMONIALS & FOOTER BANNER
          ========================================================= */}
      <section className="py-20 bg-white border-t border-slate-100">
        <LuxuryTestimonials />
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-12 bg-slate-50/50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12">
          <div className="bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 text-white rounded-[44px] p-8 md:p-14 text-center relative overflow-hidden flex flex-col items-center space-y-6 shadow-xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF4FA3]/10 blur-[90px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#8B5CF6]/10 blur-[90px] pointer-events-none" />
            
            <span className="text-[#FFD166] font-black text-[10px] tracking-[0.3em] uppercase block">PRE-ORDER INVITATION</span>
            <h3 className="text-3xl md:text-5xl font-black tracking-tight max-w-xl leading-tight font-sans">
              Order Fresh Cookie Hampers
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold max-w-sm">
              Our hand-rolled cookie baskets require 2 hours of slow tempering. Secure your luxury delivery slot today for the freshest crunch.
            </p>
            <button 
              onClick={() => setIsQuickOrderOpen(true)}
              className="bg-white hover:bg-slate-100 text-slate-950 font-black text-xs uppercase tracking-[0.2em] py-4.5 px-10 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
            >
              <span>INQUIRE COOKIE COUTURE</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>
      </section>

      <PremiumFooterBanner />

      {/* Mobile Sticky CTA & Concierge */}
      <StickyCTA onAction={() => setIsQuickOrderOpen(true)} label="RESERVE NOW" category="Cookies Gift Hamper" />
      <LuxuryConcierge />

      <QuickOrderModal 
        isOpen={isQuickOrderOpen} 
        onClose={() => setIsQuickOrderOpen(false)} 
        category="Cookies" 
      />

    </div>
  );
}
