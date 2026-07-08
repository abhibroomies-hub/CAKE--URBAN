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
  Search, 
  MessageCircle,
  Eye,
  ShoppingBag,
  Candy,
  Flame
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

export default function CupcakesCollection() {
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState('popular');
  const addCartItem = useCart((state) => state.addItem);

  // Toggle Favorite
  const toggleFavorite = (id: string, name: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(f => f !== id));
      toast.info(`Removed ${name} from your wishlist.`);
    } else {
      setFavorites([...favorites, id]);
      toast.success(`Saved ${name} to your wishlist! 💖`);
    }
  };

  // 10 mandated categories
  const cupcakeCategories = [
    { id: 'chocolate', name: "Chocolate", emoji: "🧁", desc: "Dark chocolate sponge topped with Callebaut fudge frosting.", image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=600" },
    { id: 'vanilla', name: "Vanilla", emoji: "🍦", desc: "Madagascan vanilla bean crumb with velvety vanilla bean whip.", image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600" },
    { id: 'red-velvet', name: "Red Velvet", emoji: "🍒", desc: "Classic rich crimson sponge with a silky cream cheese swirl.", image: "https://images.unsplash.com/photo-1614707267537-b85acf00c4b8?auto=format&fit=crop&q=80&w=600" },
    { id: 'blueberry', name: "Blueberry", emoji: "🍇", desc: "Sponge baked with wild blueberries, finished with fruit whip.", image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=600" },
    { id: 'strawberry', name: "Strawberry", emoji: "🍓", desc: "Light sponge infused with organic strawberry coulis.", image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=600" },
    { id: 'lotus', name: "Lotus", emoji: "🍪", desc: "Biscoff sponge paired with Speculoos cookie buttercream.", image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=600" },
    { id: 'ferrero', name: "Ferrero", emoji: "🌰", desc: "Hazelnut sponge centered with Nutella, topped with Ferrero Rocher.", image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=600" },
    { id: 'mini-cupcakes', name: "Mini Cupcakes", emoji: "🍬", desc: "Bite-sized adorable cupcakes, perfect for high-society tea.", image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600" },
    { id: 'gift-box', name: "Gift Box", emoji: "🎁", desc: "Assorted premium cupcakes arranged in a luxury pastel ribbon box.", image: "https://images.unsplash.com/photo-1614707267537-b85acf00c4b8?auto=format&fit=crop&q=80&w=600" },
    { id: 'party-pack', name: "Party Pack", emoji: "🎈", desc: "A majestic array of 24 themed cupcakes tailored for celebrations.", image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=600" }
  ];

  // High quality products list
  const cupcakeProducts = [
    {
      id: 'cc-royal-velvet',
      name: "The Queen Elizabeth Red Velvet",
      category: "Red Velvet",
      price: 149,
      rating: 4.9,
      reviews: 189,
      desc: "Crimson cocoa sponge topped with a pristine swirl of Madagascan vanilla cream cheese and miniature ruby pearls.",
      image: "https://images.unsplash.com/photo-1614707267537-b85acf00c4b8?auto=format&fit=crop&q=80&w=600",
      eta: "20-25 mins",
      tag: "MOST LOVED",
      isBestseller: true
    },
    {
      id: 'cc-belgian-lava',
      name: "Belgian Liquid Lava Fudge",
      category: "Chocolate",
      price: 129,
      rating: 4.8,
      reviews: 245,
      desc: "Double chocolate sponge with a warm oozing chocolate core, topped with whipped Belgian ganache and chocolate curls.",
      image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=600",
      eta: "20-30 mins",
      tag: "LAVA CENTER"
    },
    {
      id: 'cc-wild-blueberry',
      name: "Wild Blueberry Crème Chiffon",
      category: "Blueberry",
      price: 139,
      rating: 4.7,
      reviews: 104,
      desc: "Fluffy sponge folded with wild blueberries, crowned with lavender-colored blueberry puree whip and sugar dust.",
      image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=600",
      eta: "25-35 mins",
      tag: "FRUITY LUXE"
    },
    {
      id: 'cc-vanilla-caviar',
      name: "Madagascan Vanilla Caviar",
      category: "Vanilla",
      price: 119,
      rating: 4.9,
      reviews: 161,
      desc: "Classic white sponge baked with pure vanilla bean caviar, topped with soft cloud buttercream and pastel confetti.",
      image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600",
      eta: "20-25 mins",
      tag: "PURE CLASSIC",
      isNew: true
    },
    {
      id: 'cc-ferrero-gilded',
      name: "Ferrero Rocher Royal Gilded",
      category: "Ferrero",
      price: 169,
      rating: 4.9,
      reviews: 213,
      desc: "Nutella-infused hazelnut sponge topped with a rich dark chocolate nest and a whole gold-dusted Ferrero Rocher.",
      image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=600",
      eta: "30-40 mins",
      tag: "COUTURE DELIGHT"
    },
    {
      id: 'cc-biscoff-lotus',
      name: "Biscoff Speculoos Crunch",
      category: "Lotus",
      price: 159,
      rating: 4.8,
      reviews: 134,
      desc: "Spiced cookie butter sponge, topped with caramelized Speculoos buttercream and a crunchy Lotus biscuit sliver.",
      image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=600",
      eta: "30-45 mins",
      tag: "TRENDING"
    },
    {
      id: 'cc-strawberry-cheesecake',
      name: "Fresh Strawberry Crème Swirl",
      category: "Strawberry",
      price: 139,
      rating: 4.7,
      reviews: 98,
      desc: "Light buttery sponge centered with real strawberry jam, topped with high-contrast pastel pink strawberry cream.",
      image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=600",
      eta: "25-30 mins",
      tag: "SUMMER PASTEL",
      isNew: true
    },
    {
      id: 'cc-party-pack-24',
      name: "The Sovereign Tea-Party Box",
      category: "Party Pack",
      price: 1199,
      rating: 5.0,
      reviews: 320,
      desc: "A glorious double-layered pastel box containing 12 of our signature miniature cupcakes. Customizable themes.",
      image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600",
      eta: "Same Day Dispatch",
      tag: "CELEBRATION GOLD"
    }
  ];

  const handleAddToCart = (cupcake: any) => {
    addCartItem({
      id: cupcake.id,
      name: cupcake.name,
      description: cupcake.desc,
      price: cupcake.price,
      categories: ['Cupcakes', cupcake.category],
      occasions: ['Birthday', 'Celebration'],
      flavors: [cupcake.category],
      images: [cupcake.image],
      stockStatus: 'in-stock',
      isCustomizable: true
    }, {
      selectedWeight: 0.1,
      eggless: true
    });
    toast.success(`${cupcake.name} added to your custom cupcake assortment! 🧁`);
  };

  // Filter and sort
  const filteredProducts = cupcakeProducts
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
    <div className="bg-[#FFF8FB] min-h-screen text-slate-800 font-sans relative select-none pb-24 md:pb-0 overflow-x-hidden">
      
      {/* Background soft pastel lights (Dior + Chanel Vibe) */}
      <div className="absolute top-0 left-0 w-full h-[120vh] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-15%] right-[-10%] w-[65%] h-[65%] bg-gradient-to-bl from-rose-200/15 via-[#FF4FA3]/5 to-transparent blur-[160px]" />
        <div className="absolute top-[25%] left-[-15%] w-[60%] h-[60%] bg-gradient-to-tr from-purple-200/15 via-[#8B5CF6]/5 to-transparent blur-[150px]" />
      </div>

      {/* Decorative floating cupcakes components */}
      <div className="absolute top-[18%] left-[8%] text-3xl animate-bounce hidden md:block select-none pointer-events-none opacity-80" style={{ animationDuration: '4.5s' }}>🧁</div>
      <div className="absolute top-[32%] right-[10%] text-4xl animate-pulse hidden md:block select-none pointer-events-none opacity-70" style={{ animationDuration: '5.5s' }}>🍒</div>
      <div className="absolute bottom-[40%] left-[5%] text-2xl animate-bounce hidden md:block select-none pointer-events-none opacity-60" style={{ animationDuration: '4s' }}>✨</div>
      <div className="absolute bottom-[18%] right-[6%] text-3xl animate-pulse hidden md:block select-none pointer-events-none opacity-80" style={{ animationDuration: '5s' }}>🍓</div>

      {/* =========================================================
          HERO SECTION (Pastel Dream Luxury Cupcakes)
          ========================================================= */}
      <section className="relative pt-16 pb-24 md:py-36 max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md border border-[#FF4FA3]/20 py-2 px-4 rounded-full shadow-sm">
                <Candy className="w-3.5 h-3.5 text-[#FF4FA3] animate-spin" style={{ animationDuration: '8s' }} />
                <span className="text-[#FF4FA3] font-black text-[10px] tracking-[0.3em] uppercase">
                  LA MAISON DE CUPCAKE
                </span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black tracking-tighter text-slate-900 leading-[0.95] font-sans">
                Handcrafted Cupcakes <br />
                <span className="bg-gradient-to-r from-[#FF4FA3] via-[#8B5CF6] to-[#FFD166] bg-clip-text text-transparent">
                  For Every Celebration
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
              className="text-slate-500 font-semibold text-sm sm:text-base md:text-lg leading-relaxed max-w-xl"
            >
              Indulge in our delicate, cloud-like gourmet cupcakes. Lovingly piped by master pâtissiers with silky creams, crowned with floating fresh cherries, and packaged in pastel jewelry-style gift boxes.
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
                <span>Reserve Party Box</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
              
              <button 
                onClick={() => {
                  const el = document.getElementById('cupcake-collection-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white/85 hover:bg-white text-slate-800 border border-slate-200 text-xs sm:text-sm font-black uppercase tracking-[0.2em] py-5 px-10 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span>Browse Menu</span>
              </button>
            </motion.div>

            {/* Premium details list */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.45 }}
              className="flex flex-wrap items-center gap-8 pt-8 border-t border-slate-200/60 max-w-lg"
            >
              <div>
                <span className="text-2xl font-black text-slate-900 block">Organic</span>
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Pastel Creams</span>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div>
                <span className="text-2xl font-black text-slate-900 block">Gluten-Free</span>
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Option Available</span>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div>
                <span className="text-2xl font-black text-slate-900 block">Delhi NCR</span>
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">White Glove Delivery</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Cupcake Illustration Photography */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[480px] aspect-square rounded-[48px] overflow-hidden shadow-[0_40px_90px_rgba(255,79,163,0.1)] border-8 border-white bg-slate-50 group"
            >
              {/* Product Photo */}
              <img 
                src="https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=800" 
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[4000ms] ease-out" 
                alt="Luxury Gourmet Cupcakes Assortment" 
                referrerPolicy="no-referrer"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

              {/* Floating Cupcake Tag */}
              <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-xl rounded-3xl p-5 shadow-[0_15px_35px_rgba(0,0,0,0.06)] border border-white flex justify-between items-center text-left">
                <div className="space-y-1">
                  <span className="text-[#FF4FA3] font-black text-[9px] uppercase tracking-widest block">L’ÉLITE CELEBRATION</span>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">The Sovereign Lavender Swirl</h4>
                  <p className="text-[10px] text-slate-500 font-semibold leading-normal">Infused with wild blueberries and premium organic cream swirls.</p>
                </div>
                <div className="bg-[#FF4FA3]/10 text-[#FF4FA3] p-3 rounded-2xl">
                  <Heart className="w-5 h-5 fill-current animate-pulse" />
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* =========================================================
          THE 10 MANDATED CATEGORIES GRID (Chocolate to Party Pack)
          ========================================================= */}
      <section className="py-24 bg-white border-y border-slate-100/80 relative z-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12 space-y-16">
          
          <div className="text-center space-y-3">
            <span className="text-[#FF4FA3] font-black text-[10px] tracking-[0.3em] uppercase block">PREMIUM DESIGN COUTURE</span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              Select Cupcake Theme
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-semibold max-w-md mx-auto">
              Sway through our 10 curated cupcake themes, meticulously crafted using organic dairy, premium imports, and custom toppings.
            </p>
          </div>

          {/* Swipeable Categories Grid (Responsive spacing and larger touch targets) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {cupcakeCategories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                onClick={() => {
                  setActiveCategory(cat.name);
                  const el = document.getElementById('cupcake-collection-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  toast.success(`Filter applied: ${cat.name}! 🧁`);
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
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF4FA3]/10 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#8B5CF6]/10 blur-[90px] pointer-events-none" />

          {/* Left Text */}
          <div className="space-y-6 max-w-xl relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 py-1.5 px-3.5 rounded-full text-[#FFD166] font-black text-[9px] uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE EXQUISITE CUPCAKE ATELIER</span>
            </div>

            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none font-sans">
              Chef's Signature <br />
              <span className="bg-gradient-to-r from-[#FFD166] to-[#FF4FA3] bg-clip-text text-transparent">
                Gourmet Cupcake Tower
              </span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-400 font-semibold leading-relaxed">
              We design premium customized cupcake towers and luxurious display structures for weddings, birthday galas, and corporate milestones. Completely tailored to match your theme.
            </p>

            <button 
              onClick={() => {
                const el = document.getElementById('cupcake-collection-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                toast.success("Navigating to signature cupcakes! 🧁");
              }}
              className="bg-white hover:bg-slate-100 text-slate-950 text-xs font-black uppercase tracking-[0.25em] py-4.5 px-8 rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg shadow-white/5"
            >
              <span>Explore Designs</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>

          {/* Right Product Photography */}
          <div className="relative z-10 w-full lg:max-w-[460px] aspect-video sm:aspect-square rounded-[36px] overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
            <img 
              src="https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=800" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms]" 
              alt="Signature Chocolate Cupcake Premium Photography" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent pointer-events-none" />
            
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div>
                <span className="text-[#FFD166] font-black text-[8px] uppercase tracking-widest block">ROYAL WEDDING COLLECTION</span>
                <h4 className="text-xs font-black text-white uppercase tracking-wider mt-0.5">The Sovereign Lavender Swirl</h4>
              </div>
              <span className="bg-white/10 backdrop-blur-md text-white font-black text-[9px] px-3 py-1 rounded-full border border-white/10">₹149</span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          THE DENSE LUXURY PRODUCT GRID (Desktop: 4, Tablet: 3, Mobile: 2)
          ========================================================= */}
      <section id="cupcake-collection-grid" className="py-24 max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12 space-y-12 relative z-10">
        
        {/* Search, Filter & Sort */}
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
              placeholder="Search designer cupcakes (e.g., Chocolate, Vanilla, Blueberry)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/60 focus:border-[#FF4FA3] focus:bg-white rounded-2xl pl-12 pr-4 py-3 text-xs font-medium focus:outline-none transition-all placeholder:text-slate-400 text-slate-800"
            />
          </div>

          <div className="flex items-center gap-4.5">
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
            {filteredProducts.map((cupcake) => (
              <motion.div
                key={cupcake.id}
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
                      src={cupcake.image} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      alt={cupcake.name} 
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Wishlist Heart */}
                    <button 
                      onClick={() => toggleFavorite(cupcake.id, cupcake.name)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all shadow-sm"
                    >
                      <Heart className={`w-4.5 h-4.5 ${favorites.includes(cupcake.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                    </button>

                    {/* Category badge */}
                    <span className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md text-[#FFD166] font-black text-[7px] uppercase tracking-widest px-2.5 py-1 rounded-full">
                      {cupcake.category}
                    </span>

                    {/* Bestseller or Custom tag */}
                    {cupcake.tag && (
                      <span className="absolute top-3 left-3 bg-[#FF4FA3] text-white font-black text-[7px] uppercase tracking-widest px-2.5 py-1 rounded-full">
                        {cupcake.tag}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{cupcake.rating}</span>
                      <span className="text-slate-400">({cupcake.reviews} elite reviews)</span>
                    </div>

                    <h3 className="text-sm font-black text-slate-900 group-hover:text-[#FF4FA3] transition-colors leading-tight line-clamp-1 uppercase tracking-wider">{cupcake.name}</h3>
                    <p className="text-[11px] text-slate-400 font-semibold leading-relaxed line-clamp-2 h-[34px]">{cupcake.desc}</p>
                  </div>
                </div>

                {/* Footer block with quick add */}
                <div className="border-t border-slate-100 pt-4 mt-2">
                  <div className="flex items-center justify-between text-[9px] text-slate-400 font-black uppercase tracking-widest mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" />
                      <span>ETA: {cupcake.eta}</span>
                    </span>
                    <span className="text-slate-500">Eggless 🌱 Included</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[8px] font-black text-slate-400 block">PRICE</span>
                      <span className="text-base font-black text-slate-950">₹{cupcake.price}</span>
                    </div>

                    <button 
                      onClick={() => handleAddToCart(cupcake)}
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
          AI CUPCAKE RECOMMENDATION
          ========================================================= */}
      <section className="py-12 bg-[#FFF8FB]/80">
        <AICakeRecommendation category="Cupcakes Tower Selection" />
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
              Book Gourmet Cupcake Towers
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold max-w-sm">
              Our spectacular hand-frosted cupcake assemblies require up to 4 hours of meticulous assembly and white glove shipment. Schedule your presentation slot today.
            </p>
            <button 
              onClick={() => setIsQuickOrderOpen(true)}
              className="bg-white hover:bg-slate-100 text-slate-950 font-black text-xs uppercase tracking-[0.2em] py-4.5 px-10 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
            >
              <span>INQUIRE CUPCAKE COUTURE</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>
      </section>

      <PremiumFooterBanner />

      {/* Mobile Sticky CTA & Concierge */}
      <StickyCTA onAction={() => setIsQuickOrderOpen(true)} label="RESERVE NOW" category="Cupcakes Celebration Box" />
      <LuxuryConcierge />

      <QuickOrderModal 
        isOpen={isQuickOrderOpen} 
        onClose={() => setIsQuickOrderOpen(false)} 
        category="Cupcakes" 
      />

    </div>
  );
}
