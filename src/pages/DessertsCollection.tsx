import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  Heart, 
  Star, 
  Plus, 
  Clock, 
  Search, 
  Flame, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen,
  ShoppingBag,
  SlidersHorizontal,
  ThumbsUp
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

export default function DessertsCollection() {
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState('popular');
  const addCartItem = useCart((state) => state.addItem);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Toggle Favorite
  const toggleFavorite = (id: string, name: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(f => f !== id));
      toast.info(`Removed ${name} from your curation board.`);
    } else {
      setFavorites([...favorites, id]);
      toast.success(`Pinned ${name} to your elite wishlist! 💖`);
    }
  };

  // 10 mandated dessert categories
  const categories = [
    { name: "Cheesecake", emoji: "🍰", img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=400" },
    { name: "Brownies", emoji: "🍫", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400" },
    { name: "Pastries", emoji: "🧁", img: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=400" },
    { name: "Mousse", emoji: "🍧", img: "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&q=80&w=400" },
    { name: "Tiramisu", emoji: "☕", img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=400" },
    { name: "Donuts", emoji: "🍩", img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=400" },
    { name: "Croissants", emoji: "🥐", img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=400" },
    { name: "Macarons", emoji: "🍬", img: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=400" },
    { name: "Pudding", emoji: "🍮", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400" },
    { name: "Chocolate Cups", emoji: "☕", img: "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=400" }
  ];

  // Professional premium products
  const products = [
    {
      id: 'ds-nyc-blueberry',
      name: "The New York Gold Cheesecake",
      category: "Cheesecake",
      price: 1299,
      rating: 4.9,
      reviews: 240,
      calories: "320 kcal",
      prepTime: "15 mins",
      eta: "30-40 mins",
      desc: "Creamy, dense signature New York-style cheesecake topped with single-origin wild blueberry glaze and delicate edible gold curls.",
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=600",
      tag: "SIGNATURE BESTSELLER",
      isBestseller: true
    },
    {
      id: 'ds-fudge-box',
      name: "Belgian Triple Chocolate Fudge Brownies",
      category: "Brownies",
      price: 699,
      rating: 4.8,
      reviews: 184,
      calories: "280 kcal",
      prepTime: "10 mins",
      eta: "25-30 mins",
      desc: "Indulgent pure chocolate fudge brownies layered with Callebaut dark chocolate chips and finished with a hot sea-salt caramel drizzle.",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600",
      tag: "HOT SELLER"
    },
    {
      id: 'ds-tiramisu-classico',
      name: "Imperial Espresso Tiramisu Coupe",
      category: "Tiramisu",
      price: 849,
      rating: 5.0,
      reviews: 312,
      calories: "240 kcal",
      prepTime: "5 mins",
      eta: "20-30 mins",
      desc: "Traditional Italian ladyfingers soaked in premium Coorg espresso roast, layered with airy organic mascarpone and dark cocoa powder.",
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=600",
      tag: "CONCIERGE CHOICE",
      isNew: true
    },
    {
      id: 'ds-choc-mousse',
      name: "Symphony Dark Chocolate Mousse",
      category: "Mousse",
      price: 549,
      rating: 4.7,
      reviews: 96,
      calories: "190 kcal",
      prepTime: "5 mins",
      eta: "15-20 mins",
      desc: "A velvety whipped 70% dark Belgian chocolate mousse with a hidden raspberry core, served in hand-sculpted chocolate cups.",
      image: "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&q=80&w=600",
      tag: "LIGHT DELIGHT"
    },
    {
      id: 'ds-macaron-jewelry',
      name: "Royal Pastel Macarons (6 Pcs)",
      category: "Macarons",
      price: 799,
      rating: 4.9,
      reviews: 153,
      calories: "90 kcal/pc",
      prepTime: "10 mins",
      eta: "20-35 mins",
      desc: "An assortment of delicate Parisian almond macarons filled with Madagascan vanilla, rich pistachio, and raspberry chocolate ganache.",
      image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=600",
      tag: "PARISIAN LUXURY",
      isNew: true
    },
    {
      id: 'ds-caramel-pudding',
      name: "Normandy Crème Caramel Pudding",
      category: "Pudding",
      price: 499,
      rating: 4.8,
      reviews: 82,
      calories: "210 kcal",
      prepTime: "8 mins",
      eta: "25-35 mins",
      desc: "Silky French-style eggless custard pudding coated in dark, slow-melted amber caramel sauce. Melt-in-your-mouth perfection.",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600",
      tag: "ELEGANT FINISH"
    },
    {
      id: 'ds-croissant-luxe',
      name: "Gilded Almond Croissant",
      category: "Croissants",
      price: 349,
      rating: 4.7,
      reviews: 74,
      calories: "340 kcal",
      prepTime: "12 mins",
      eta: "30-40 mins",
      desc: "Layered, flaky Normandy butter croissant filled with slow-cooked sweet almond paste, topped with sliced toasted almonds.",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=600",
      tag: "BREAKFAST ROYALTY"
    },
    {
      id: 'ds-gold-donut',
      name: "The Sovereign Velvet Donut",
      category: "Donuts",
      price: 299,
      rating: 4.9,
      reviews: 145,
      calories: "260 kcal",
      prepTime: "10 mins",
      eta: "20-30 mins",
      desc: "Signature yeast-raised fluffy donut dipped in white chocolate pastel pink glaze and adorned with silver leaf sprinkles.",
      image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600",
      tag: "POPULAR DELIGHT"
    }
  ];

  const handleAddToCart = (ds: any) => {
    addCartItem({
      id: ds.id,
      name: ds.name,
      description: ds.desc,
      price: ds.price,
      categories: ['Desserts', ds.category],
      occasions: ['Celebration', 'Party'],
      flavors: ['Classic Premium Flavor'],
      images: [ds.image],
      stockStatus: 'in-stock',
      isCustomizable: false
    }, {
      selectedWeight: 0.5,
      eggless: true
    });
    toast.success(`${ds.name} safely added to your dessert curation basket! 🍰`);
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Filter and sort
  const filteredProducts = products
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
      return b.reviews - a.reviews;
    });

  return (
    <div className="bg-transparent min-h-screen text-[#FFFDFB] font-sans relative select-none pb-24 md:pb-0 overflow-x-hidden">
      
      {/* Luxury Gradient Lights */}
      <div className="absolute top-0 left-0 w-full h-[120vh] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-tr from-pink-500/10 via-[#FF4FA3]/10 to-transparent blur-[160px]" />
        <div className="absolute top-[30%] right-[-10%] w-[55%] h-[55%] bg-gradient-to-bl from-amber-500/10 via-[#DFB15B]/10 to-transparent blur-[150px]" />
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-[18%] right-[8%] text-4xl animate-bounce hidden md:block opacity-75 select-none pointer-events-none" style={{ animationDuration: '5s' }}>🧁</div>
      <div className="absolute top-[32%] left-[6%] text-3xl animate-pulse hidden md:block opacity-65 select-none pointer-events-none" style={{ animationDuration: '6s' }}>🍬</div>
      <div className="absolute bottom-[35%] right-[5%] text-2xl animate-bounce hidden md:block opacity-70 select-none pointer-events-none" style={{ animationDuration: '4.5s' }}>🍫</div>
      <div className="absolute bottom-[15%] left-[4%] text-3xl animate-pulse hidden md:block opacity-85 select-none pointer-events-none" style={{ animationDuration: '5.5s' }}>☕</div>

      {/* =========================================================
          HERO SECTION (Luxury Dessert Boutique)
          ========================================================= */}
      <section className="relative pt-16 pb-24 md:py-36 max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 bg-[#1E0B07]/80 backdrop-blur-md border border-[#DFB15B]/30 py-2 px-4 rounded-full shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-[#DFB15B] animate-pulse" />
                <span className="text-[#DFB15B] font-black text-[10px] tracking-[0.3em] uppercase">
                  LA BOUTIQUE DE DESSERTS
                </span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black tracking-tighter text-white leading-[0.95] font-sans">
                Luxury Desserts <br />
                <span className="bg-gradient-to-r from-[#DFB15B] via-pink-400 to-[#F3C87A] bg-clip-text text-transparent">
                  Crafted Fresh Every Day
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
              className="text-slate-200 font-medium text-sm sm:text-base md:text-lg leading-relaxed max-w-xl"
            >
              Discover our spectacular assortment of handcrafted cheesecakes, rich brownies, delicate pastries, dark chocolate mousse, and authentic French tiramisu. Baked incrementally to preserve sensory divinity.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <button 
                onClick={() => {
                  const el = document.getElementById('dessert-collection-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gradient-to-r from-[#DFB15B] to-[#F3C87A] text-[#0F0503] text-xs sm:text-sm font-black uppercase tracking-[0.2em] py-5 px-10 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2.5 cursor-pointer shadow-lg"
              >
                <span>Explore Desserts</span>
                <ArrowRight className="w-4 h-4 text-[#0F0503]" />
              </button>
              
              <button 
                onClick={() => setIsQuickOrderOpen(true)}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md text-xs sm:text-sm font-black uppercase tracking-[0.2em] py-5 px-10 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>Order Now</span>
              </button>
            </motion.div>

            {/* Premium details list */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.45 }}
              className="flex flex-wrap items-center gap-8 pt-8 border-t border-white/10 max-w-lg"
            >
              <div>
                <span className="text-2xl font-black text-white block">Freshly</span>
                <span className="text-[10px] font-black tracking-widest text-[#DFB15B] uppercase">Chilled Deliveries</span>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div>
                <span className="text-2xl font-black text-white block">Premium</span>
                <span className="text-[10px] font-black tracking-widest text-[#DFB15B] uppercase">Belgian Imports</span>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div>
                <span className="text-2xl font-black text-white block">Express</span>
                <span className="text-[10px] font-black tracking-widest text-[#DFB15B] uppercase">White Glove Delivery</span>
              </div>
            </motion.div>
          </div>

          {/* Right Product Plate */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[480px] aspect-square rounded-[48px] overflow-hidden shadow-2xl border-4 border-[#DFB15B]/40 bg-[#1E0B07] group"
            >
              <img 
                src="https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800" 
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[4000ms] ease-out" 
                alt="Luxury Gourmet Desserts Stack" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0503]/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-8 left-8 right-8 bg-[#1E0B07]/90 backdrop-blur-xl rounded-3xl p-5 shadow-2xl border border-[#DFB15B]/40 flex justify-between items-center text-left">
                <div className="space-y-1">
                  <span className="text-[#DFB15B] font-black text-[9px] uppercase tracking-widest block">LA BOUTIQUE DE SIGNATURE</span>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">The Gold Velvet Cheesecake</h4>
                  <p className="text-[10px] text-slate-300 font-medium leading-normal">Our cloud-airy standard cheesecake with Normandy butter crumbs.</p>
                </div>
                <div className="bg-[#DFB15B]/20 text-[#DFB15B] p-3 rounded-2xl border border-[#DFB15B]/30">
                  <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* CATEGORY CAROUSEL */}
      <section className="py-12 bg-transparent border-y border-white/10 relative z-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12 space-y-6 text-left">
          
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[#DFB15B] font-black text-[10px] tracking-[0.25em] uppercase block">EXPLORE BY TASTE</span>
              <h3 className="text-xl font-black text-white uppercase tracking-wider">Curate Desserts Selection</h3>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => scrollCarousel('left')}
                className="w-10 h-10 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="Previous categories"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scrollCarousel('right')}
                className="w-10 h-10 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="Next categories"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Horizontal scrollable carousel */}
          <div 
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* All Category Card */}
            <div 
              onClick={() => {
                setActiveCategory('All');
                toast.success("Showing all premium desserts!");
              }}
              className={`flex-none w-[160px] sm:w-[180px] snap-start cursor-pointer rounded-2xl p-4 border text-center space-y-3 transition-all ${
                activeCategory === 'All'
                  ? 'border-[#DFB15B] bg-[#DFB15B]/20 shadow-lg scale-105'
                  : 'border-white/15 bg-[#1E0B07]/80 hover:border-[#DFB15B]/40 hover:-translate-y-0.5'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#DFB15B] to-[#F3C87A] text-[#0F0503] flex items-center justify-center text-xl mx-auto shadow-sm">
                🌟
              </div>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">All Desserts</h4>
                <p className="text-[10px] text-slate-300 font-semibold mt-0.5">Explore entire menu</p>
              </div>
            </div>

            {categories.map((cat) => (
              <div 
                key={cat.name}
                onClick={() => {
                  setActiveCategory(cat.name);
                  toast.success(`Filter applied: ${cat.name}! ✨`);
                }}
                className={`flex-none w-[160px] sm:w-[180px] snap-start cursor-pointer rounded-2xl p-4 border text-center space-y-3 transition-all ${
                  activeCategory === cat.name
                    ? 'border-[#DFB15B] bg-[#DFB15B]/20 shadow-lg scale-105'
                    : 'border-white/15 bg-[#1E0B07]/80 hover:border-[#DFB15B]/40 hover:-translate-y-0.5'
                }`}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden relative mx-auto shadow-sm">
                  <img src={cat.img} className="w-full h-full object-cover" alt={cat.name} referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-slate-950/20 flex items-center justify-center text-lg">
                    {cat.emoji}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider line-clamp-1">{cat.name}</h4>
                  <p className="text-[10px] text-slate-300 font-semibold mt-0.5">Custom bakes</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* EDITORIAL FEATURE */}
      <section className="py-24 max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12 relative z-10 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#1E0B07]/80 backdrop-blur-md rounded-[44px] border border-[#DFB15B]/30 p-8 md:p-16 shadow-2xl overflow-hidden">
          
          {/* Left Large Dessert Image */}
          <div className="lg:col-span-6 relative aspect-square sm:aspect-video lg:aspect-square rounded-[32px] overflow-hidden bg-slate-900 group">
            <img 
              src="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms]" 
              alt="Artisanal Dessert Story Photography" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0503]/80 to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[#DFB15B] font-black text-[8px] uppercase tracking-widest block">L’ART DE LA CUISINE</span>
              <h4 className="text-sm font-black text-white uppercase tracking-wider mt-0.5">The Pure Sensation Series</h4>
            </div>
          </div>

          {/* Right Story Section */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1 bg-[#DFB15B]/20 border border-[#DFB15B]/30 py-1 px-3 rounded-full text-[#DFB15B] font-black text-[9px] uppercase tracking-widest">
              <BookOpen className="w-3.5 h-3.5" />
              <span>OUR STORY & PHILOSOPHY</span>
            </div>

            <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight uppercase font-sans">
              Every Dessert <br />
              Tells A Story
            </h3>

            <p className="text-slate-200 font-medium text-xs sm:text-sm leading-relaxed">
              At CakeUrban, we reject mass production. Our master pastry chefs hand-whip and bake every single item using Normandy butter, whole Madagascan vanilla pods, and premier Belgian chocolate. Every creation is designed to spark a rich, emotional taste memory.
            </p>

            <button 
              onClick={() => {
                const el = document.getElementById('dessert-collection-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                toast.success("Ready to create your dessert story! ✨");
              }}
              className="bg-gradient-to-r from-[#DFB15B] to-[#F3C87A] text-[#0F0503] text-xs font-black uppercase tracking-[0.2em] py-4.5 px-8 rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-md cursor-pointer"
            >
              <span>Read More</span>
              <ArrowRight className="w-4 h-4 text-[#0F0503]" />
            </button>
          </div>

        </div>
      </section>

      {/* PRODUCT GRID */}
      <section id="dessert-collection-grid" className="py-24 max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12 space-y-12 relative z-10">
        
        {/* Controls block */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6 bg-[#1E0B07]/80 backdrop-blur-xl border border-[#DFB15B]/30 p-6 rounded-[32px] shadow-2xl text-left">
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#DFB15B]/20 text-[#DFB15B] rounded-2xl border border-[#DFB15B]/30">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Filtered Masterworks</h3>
              <p className="text-[10px] text-[#DFB15B] font-bold uppercase tracking-widest">Showing: {activeCategory} Collections</p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search designer cheesecakes, tiramisu, pudding..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0F0503]/80 border border-white/20 focus:border-[#DFB15B] focus:bg-[#0F0503] rounded-2xl pl-12 pr-4 py-3 text-xs font-medium focus:outline-none transition-all placeholder:text-slate-400 text-white"
            />
          </div>

          <div className="flex items-center gap-4.5">
            {activeCategory !== 'All' && (
              <button 
                onClick={() => {
                  setActiveCategory('All');
                  toast.success("Reset filters to all gourmet desserts!");
                }}
                className="text-xs font-black text-[#DFB15B] uppercase tracking-widest hover:underline cursor-pointer"
              >
                Reset Filter
              </button>
            )}

            {/* Sort Selector */}
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-[#0F0503] border border-white/20 rounded-2xl px-4 py-3 text-xs font-black uppercase text-white focus:outline-none focus:border-[#DFB15B] transition-colors"
            >
              <option value="popular">Popular Selection</option>
              <option value="rating">Top Rated Elite</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((ds) => (
              <motion.div
                key={ds.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="bg-[#1E0B07]/80 backdrop-blur-md border border-[#DFB15B]/30 rounded-[30px] p-5 shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between text-left group h-[420px]"
              >
                {/* Image & tags */}
                <div className="space-y-4 relative">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-sm bg-black/40 border border-white/10">
                    <img 
                      src={ds.image} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      alt={ds.name} 
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Floating wishlist */}
                    <button 
                      onClick={() => toggleFavorite(ds.id, ds.name)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-red-500 hover:scale-110 active:scale-95 transition-all shadow-sm"
                    >
                      <Heart className={`w-4.5 h-4.5 ${favorites.includes(ds.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                    </button>

                    {/* Category badge */}
                    <span className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md text-[#DFB15B] border border-[#DFB15B]/40 font-black text-[7px] uppercase tracking-widest px-2.5 py-1 rounded-full">
                      {ds.category}
                    </span>

                    {/* Tag badge */}
                    {ds.tag && (
                      <span className="absolute top-3 left-3 bg-[#DFB15B] text-[#0F0503] font-black text-[7px] uppercase tracking-widest px-2.5 py-1 rounded-full">
                        {ds.tag}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] text-amber-300 font-bold">
                      <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                      <span>{ds.rating}</span>
                      <span className="text-slate-400">({ds.reviews} reviews)</span>
                      <span className="text-slate-600">|</span>
                      <span className="text-[#DFB15B] flex items-center gap-0.5 font-black">
                        <Flame className="w-3 h-3 text-[#DFB15B]" />
                        <span>{ds.calories}</span>
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-white group-hover:text-[#DFB15B] transition-colors leading-tight line-clamp-1 uppercase tracking-wider">{ds.name}</h3>
                    <p className="text-[11px] text-slate-300 font-normal leading-relaxed line-clamp-2 h-[34px]">{ds.desc}</p>
                  </div>
                </div>

                {/* Footer and Cart */}
                <div className="border-t border-white/10 pt-4 mt-2">
                  <div className="flex items-center justify-between text-[9px] text-slate-300 font-black uppercase tracking-widest mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Prep: {ds.prepTime} ({ds.eta})</span>
                    </span>
                    <span className="text-[#DFB15B]">Eggless 🌱</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[8px] font-black text-slate-400 block">PRICE</span>
                      <span className="text-base font-black text-[#DFB15B]">₹{ds.price}</span>
                    </div>

                    <button 
                      onClick={() => handleAddToCart(ds)}
                      className="bg-gradient-to-r from-[#DFB15B] to-[#F3C87A] text-[#0F0503] text-[9px] font-black uppercase tracking-widest py-3 px-5 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer"
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

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#DFB15B]/20 flex items-center justify-center mx-auto text-[#DFB15B]">
              <Search className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider">No Desserts Match</h4>
              <p className="text-xs text-slate-300 font-medium">Try modifying your search or reset categories to browse our complete collection.</p>
            </div>
          </div>
        )}

      </section>

      {/* AI RECOMMENDATIONS & FOOTER */}
      <section className="py-12 bg-transparent">
        <AICakeRecommendation category="Desserts & Cheesecakes" />
      </section>

      <section className="py-20 bg-transparent border-t border-white/10">
        <LuxuryTestimonials />
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="py-12 bg-transparent">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12">
          <div className="bg-gradient-to-tr from-[#1E0B07] to-[#2E120B] text-white rounded-[44px] p-8 md:p-14 text-center relative overflow-hidden flex flex-col items-center space-y-6 shadow-2xl border border-[#DFB15B]/30">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#DFB15B]/10 blur-[90px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500/10 blur-[90px] pointer-events-none" />
            
            <span className="text-[#DFB15B] font-black text-[10px] tracking-[0.3em] uppercase block">PRE-ORDER INVITATION</span>
            <h3 className="text-3xl md:text-5xl font-black tracking-tight max-w-xl leading-tight font-sans text-white">
              Ready To Surprise Someone Special?
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed font-medium max-w-sm">
              Create unforgettable culinary moments with our standard handcrafted cakes, gourmet cheesecakes, and luxury gift hampers.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={() => setIsQuickOrderOpen(true)}
                className="bg-gradient-to-r from-[#DFB15B] to-[#F3C87A] text-[#0F0503] font-black text-xs uppercase tracking-[0.2em] py-4.5 px-10 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>ORDER NOW</span>
                <ArrowRight className="w-4 h-4 text-[#0F0503]" />
              </button>
              <button 
                onClick={() => {
                  window.location.href = '/custom-order';
                }}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-black text-xs uppercase tracking-[0.2em] py-4.5 px-10 rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>CUSTOMIZE CAKE</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <PremiumFooterBanner />

      {/* Mobile Sticky CTA & Concierge */}
      <StickyCTA onAction={() => setIsQuickOrderOpen(true)} label="RESERVE NOW" category="Gourmet Desserts" />
      <LuxuryConcierge />

      <QuickOrderModal 
        isOpen={isQuickOrderOpen} 
        onClose={() => setIsQuickOrderOpen(false)} 
        category="Desserts" 
      />

    </div>
  );
}
