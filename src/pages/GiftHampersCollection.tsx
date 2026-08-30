import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  Heart, 
  Star, 
  Plus, 
  Gift, 
  Check, 
  Flower2, 
  ShoppingBag,
  HelpCircle,
  Truck,
  Flame,
  BadgePercent,
  Search,
  CheckCircle,
  FileText
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

// Interactivity Types
interface HamperConfig {
  boxSize: { name: string; price: number };
  cake: { name: string; price: number };
  chocolates: { name: string; price: number };
  flowers: { name: string; price: number };
  greetingCard: { name: string; text: string; price: number };
  softToys: { name: string; price: number };
  balloons: { name: string; price: number };
  addons: Array<{ name: string; price: number }>;
}

export default function GiftHampersCollection() {
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const addCartItem = useCart((state) => state.addItem);

  // Toggle Favorite
  const toggleFavorite = (id: string, name: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(f => f !== id));
      toast.info(`Removed ${name} from your curation board.`);
    } else {
      setFavorites([...favorites, id]);
      toast.success(`Pinned ${name} to your elite wishlist! ❤️`);
    }
  };

  // Build Your Own Hamper State
  const [boxSize, setBoxSize] = useState({ name: 'Premium Velvet Box', price: 999 });
  const [selectedCake, setSelectedCake] = useState({ name: 'Midnight Chocolate Truffle (0.5 Kg)', price: 899 });
  const [selectedChocolates, setSelectedChocolates] = useState({ name: 'Signature Belgian Pralines (6 Pcs)', price: 599 });
  const [selectedFlowers, setSelectedFlowers] = useState({ name: 'Premium Dutch Red Roses (10 Stems)', price: 799 });
  const [selectedCard, setSelectedCard] = useState({ name: 'Calligraphy Gold Foil Card', text: 'Wishing you standard luxury and sweet moments!', price: 249 });
  const [selectedToy, setSelectedToy] = useState({ name: 'None', price: 0 });
  const [selectedBalloons, setSelectedBalloons] = useState({ name: 'None', price: 0 });
  const [selectedAddons, setSelectedAddons] = useState<Array<{ name: string; price: number }>>([]);

  const boxSizeOptions = [
    { name: 'Standard Satin Box', price: 499, desc: 'Elegantly wrapped rigid pink-gold cardboard.' },
    { name: 'Premium Velvet Box', price: 999, desc: 'Luxury suede touch velvet casket with gold hot-stamping.' },
    { name: 'Royal Palace Wooden Chest', price: 1999, desc: 'Handcrafted premium pinewood chest with brass latches.' }
  ];

  const cakeOptions = [
    { name: 'None', price: 0, desc: 'No cake, focus on flowers and gourmet items.' },
    { name: 'Midnight Chocolate Truffle (0.5 Kg)', price: 899, desc: 'Rich Callebaut fudge glaze, single layer.' },
    { name: 'Dior Crimson Red Velvet (0.5 Kg)', price: 999, desc: 'Vibrant sponge layered with premium cream cheese.' },
    { name: 'Madagascan Vanilla Bean (0.5 Kg)', price: 849, desc: 'Moist standard sponge whipped with pure vanilla bean caviar.' }
  ];

  const chocolateOptions = [
    { name: 'None', price: 0, desc: 'Skip chocolates' },
    { name: 'Signature Belgian Pralines (6 Pcs)', price: 599, desc: 'Rich assorted hazelnut and dark caramel pralines.' },
    { name: 'Rose Petal Ivory White (100g)', price: 349, desc: 'White cocoa bar sprinkled with organic dried Damask roses.' },
    { name: 'Sea-Salt Dark Ganache Truffles', price: 499, desc: '70% dark velvet ganache rolled in pure cacao.' }
  ];

  const flowerOptions = [
    { name: 'None', price: 0, desc: 'Skip flowers' },
    { name: 'Premium Dutch Red Roses (10 Stems)', price: 799, desc: 'Handpicked fresh red roses in a silk-bound ribbon bouquet.' },
    { name: 'Elegance White Lilies Bunch', price: 1299, desc: 'Fragrant Casablanca white lilies beautifully bundled.' },
    { name: 'Pastel Orchid Treasure Box', price: 1499, desc: 'An elegant glass tray containing single stem orchids.' }
  ];

  const cardOptions = [
    { name: 'Minimalist Note Card', text: 'Happy Celebrations!', price: 99, desc: 'Simple ivory textured envelope card.' },
    { name: 'Calligraphy Gold Foil Card', text: 'Wishing you sweet moments!', price: 249, desc: 'Hand-lettered calligraphic card with luxury gold leaf emboss.' }
  ];

  const toyOptions = [
    { name: 'None', price: 0 },
    { name: 'Blush Pink Teddy Bear (Large)', price: 599 },
    { name: 'Classic Fluffy Brown Cub', price: 499 }
  ];

  const balloonOptions = [
    { name: 'None', price: 0 },
    { name: 'Heart-Shaped Red Foil Balloon (Helium)', price: 249 },
    { name: 'Sovereign Gold Star Helium Balloon', price: 299 }
  ];

  const addonOptions = [
    { name: 'Gilded Wax Pillar Candles (Set of 2)', price: 199 },
    { name: 'Sparkler Birthday Candle wand', price: 99 },
    { name: 'Personalized Chocolate Name Plaque', price: 149 }
  ];

  const toggleAddon = (addon: { name: string; price: number }) => {
    if (selectedAddons.some(a => a.name === addon.name)) {
      setSelectedAddons(selectedAddons.filter(a => a.name !== addon.name));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  // Calculate live dynamic price
  const basePrice = boxSize.price + selectedCake.price + selectedChocolates.price + selectedFlowers.price + selectedCard.price + selectedToy.price + selectedBalloons.price;
  const addonsTotal = selectedAddons.reduce((acc, curr) => acc + curr.price, 0);
  const totalPrice = basePrice + addonsTotal;

  const handleAddCustomHamperToCart = () => {
    const hamperDescription = `Custom Hamper: ${boxSize.name} holding [Cake: ${selectedCake.name}], [Chocolates: ${selectedChocolates.name}], [Flowers: ${selectedFlowers.name}], [Card: ${selectedCard.name}] and [${selectedAddons.length} Premium Addons].`;
    
    addCartItem({
      id: 'custom-hamper-' + Date.now(),
      name: "Your Bespoke Couture Hamper",
      description: hamperDescription,
      price: totalPrice,
      categories: ['Gift Hampers', 'Custom'],
      occasions: ['Birthday', 'Anniversary', 'Gifting'],
      flavors: ['Custom Assortment'],
      images: ["https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&q=80&w=600"],
      stockStatus: 'in-stock',
      isCustomizable: true
    }, {
      selectedWeight: 1.0,
      eggless: true,
      cakeMessage: selectedCard.text
    });
    
    toast.success("Bespoke luxury hamper generated and added to your shopping cart! 🎁");
  };

  // 8 mandated hamper categories
  const hamperCategories = [
    { name: "Birthday Hampers", emoji: "🎁", img: "https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&q=80&w=600", desc: "A whimsical luxury combination of designer cake, helium balloons, and custom gift note." },
    { name: "Wedding Hampers", emoji: "💍", img: "https://images.unsplash.com/photo-1511018556340-d16986a1c194?auto=format&fit=crop&q=80&w=600", desc: "Bespoke pine wood chests containing gold leaf cakes, Champagne-infused macarons, and white lilies." },
    { name: "Corporate Hampers", emoji: "💼", img: "https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&q=80&w=600", desc: "Sleek, branded minimalist gift boxes designed for executive clients and celebratory corporate milestones." },
    { name: "Luxury Chocolate Hampers", emoji: "🍫", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600", desc: "An opulent assortment of our finest dark sea-salt ganaches, French truffles, and gold leaf chocolate pralines." },
    { name: "Festival Hampers", emoji: "✨", img: "https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&q=80&w=600", desc: "Adorned with royal marigold petals, brass incense holder, silver foil cupcakes, and premium almonds." },
    { name: "Kids Gift Hampers", emoji: "🎈", img: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600", desc: "Fitted with organic cupcakes, colorful confetti, a blush pink teddy bear, and premium helium balloons." },
    { name: "Anniversary Hampers", emoji: "💖", img: "https://images.unsplash.com/photo-1614707267537-b85acf00c4b8?auto=format&fit=crop&q=80&w=600", desc: "Romance redefined: Premium crimson velvet cake, a gorgeous bouquet of Dutch red roses, and personalized message card." },
    { name: "Premium Gourmet Hampers", emoji: "🏆", img: "https://images.unsplash.com/photo-1511018556340-d16986a1c194?auto=format&fit=crop&q=80&w=600", desc: "A massive, tiered culinary masterpiece holding standard artisan cookies, standard cakes, cheese-wheels, and jams." }
  ];

  // Premium Pre-configured Hampers Array
  const preConfiguredHampers = [
    {
      id: 'hm-dior-majestic',
      name: "The Dior Majestic Anniversary Hamper",
      category: "Anniversary Hampers",
      price: 3499,
      rating: 4.9,
      reviews: 142,
      desc: "Vandana red velvet cake, velvet keepsake box, premium red roses bouquet, and 6 assorted gold-foil macarons.",
      image: "https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&q=80&w=600",
      tag: "MOST POPULAR",
      isBestseller: true
    },
    {
      id: 'hm-executive-noir',
      name: "Corporate Luxe Obsidian Chest",
      category: "Corporate Hampers",
      price: 4999,
      rating: 5.0,
      reviews: 95,
      desc: "Sleek wooden chest containing single-origin dark chocolates, premium roasted macadamias, and an organic drip coffee set.",
      image: "https://images.unsplash.com/photo-1511018556340-d16986a1c194?auto=format&fit=crop&q=80&w=600",
      tag: "EXECUTIVE PREMIER",
      isNew: true
    },
    {
      id: 'hm-royal-birthday',
      name: "The Sovereign Birthday Casket",
      category: "Birthday Hampers",
      price: 2999,
      rating: 4.8,
      reviews: 210,
      desc: "Midnight fudge cake, satin birthday banner, 2 floating gold helium star balloons, and artisan cookie collection.",
      image: "https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&q=80&w=600",
      tag: "BEST SELLER"
    },
    {
      id: 'hm-blooms-fudge',
      name: "Gourmet Blooms & Belgian Cocoa Box",
      category: "Premium Gourmet Hampers",
      price: 3999,
      rating: 4.9,
      reviews: 118,
      desc: "Stunning pink roses bunch paired with standard chocolate chip cookies, assorted Belgian ganache cups, and lavender wax candle.",
      image: "https://images.unsplash.com/photo-1511018556340-d16986a1c194?auto=format&fit=crop&q=80&w=600",
      tag: "EDITOR'S CHOICE"
    }
  ];

  const handleAddPreconfiguredToCart = (hamp: any) => {
    addCartItem({
      id: hamp.id,
      name: hamp.name,
      description: hamp.desc,
      price: hamp.price,
      categories: ['Gift Hampers', hamp.category],
      occasions: ['Gifting', 'Celebration'],
      flavors: ['Standard Assortment'],
      images: [hamp.image],
      stockStatus: 'in-stock',
      isCustomizable: false
    }, {
      selectedWeight: 1.0,
      eggless: true
    });
    toast.success(`${hamp.name} secured in your shipping slot! ✨`);
  };

  return (
    <div className="bg-transparent min-h-screen text-[#FFFDFB] font-sans relative select-none pb-24 md:pb-0 overflow-x-hidden">
      
      {/* Luxury Soft Lighting Overlays */}
      <div className="absolute top-0 left-0 w-full h-[120vh] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-bl from-[#DFB15B]/20 via-[#FF4FA3]/10 to-transparent blur-[160px]" />
        <div className="absolute top-[35%] left-[-15%] w-[55%] h-[55%] bg-gradient-to-tr from-purple-500/10 via-[#8B5CF6]/10 to-transparent blur-[140px]" />
      </div>

      {/* Floating Sparkles & Gift Boxes */}
      <div className="absolute top-[15%] left-[8%] text-3xl animate-bounce hidden md:block opacity-80 select-none pointer-events-none" style={{ animationDuration: '4s' }}>🎁</div>
      <div className="absolute top-[28%] right-[7%] text-4xl animate-pulse hidden md:block opacity-70 select-none pointer-events-none" style={{ animationDuration: '5.5s' }}>🌹</div>
      <div className="absolute bottom-[35%] left-[5%] text-2xl animate-bounce hidden md:block opacity-65 select-none pointer-events-none" style={{ animationDuration: '4.5s' }}>✨</div>
      <div className="absolute bottom-[18%] right-[5%] text-3xl animate-pulse hidden md:block opacity-80 select-none pointer-events-none" style={{ animationDuration: '5s' }}>🍫</div>

      {/* =========================================================
          HERO SECTION (Luxury Gift Box & Ribbon Animation)
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
              <div className="inline-flex items-center gap-2 bg-[#1E0B07]/80 backdrop-blur-md border border-[#DFB15B]/40 py-2 px-4 rounded-full shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#DFB15B] animate-pulse" />
                <span className="text-[#DFB15B] font-black text-[10px] tracking-[0.3em] uppercase">
                  LA SÉLECTION DE CADEAUX
                </span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black tracking-tighter text-white leading-[0.95] font-sans">
                Gift Happiness <br />
                <span className="bg-gradient-to-r from-[#DFB15B] via-pink-400 to-[#F3C87A] bg-clip-text text-transparent">
                  Beautifully Handcrafted
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
              className="text-slate-200 font-medium text-sm sm:text-base md:text-lg leading-relaxed max-w-xl"
            >
              Curate magnificent, silk-bound luxury gift hampers for birthdays, weddings, anniversaries, or corporate milestones. Completely customisable with premium cakes, fresh flowers, and imported delicacies.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <button 
                onClick={() => {
                  const el = document.getElementById('preconfigured-hampers-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gradient-to-r from-[#DFB15B] to-[#F3C87A] hover:brightness-110 text-[#0F0503] text-xs sm:text-sm font-black uppercase tracking-[0.2em] py-5 px-10 rounded-full transition-all duration-300 hover:shadow-[0_15px_40px_rgba(223,177,91,0.35)] hover:scale-105 active:scale-95 flex items-center gap-2.5 cursor-pointer"
              >
                <span>Shop Hampers</span>
                <ArrowRight className="w-4 h-4 text-[#0F0503]" />
              </button>
              
              <button 
                onClick={() => {
                  const el = document.getElementById('hamper-interactive-builder');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#1E0B07]/80 hover:bg-[#1E0B07] text-white border border-[#DFB15B]/40 text-xs sm:text-sm font-black uppercase tracking-[0.2em] py-5 px-10 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>Build Your Own Hamper</span>
              </button>
            </motion.div>

            {/* Premium flags list */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.45 }}
              className="flex flex-wrap items-center gap-8 pt-8 border-t border-white/20 max-w-lg"
            >
              <div>
                <span className="text-2xl font-black text-white block">Velvet</span>
                <span className="text-[10px] font-bold tracking-widest text-[#DFB15B] uppercase">Premium Packaging</span>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div>
                <span className="text-2xl font-black text-white block">Fresh</span>
                <span className="text-[10px] font-bold tracking-widest text-[#DFB15B] uppercase">Dutch Flowers</span>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div>
                <span className="text-2xl font-black text-white block">Golden</span>
                <span className="text-[10px] font-bold tracking-widest text-[#DFB15B] uppercase">Calligraphy Notes</span>
              </div>
            </motion.div>
          </div>

          {/* Right Product Banner */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[480px] aspect-square rounded-[48px] overflow-hidden shadow-2xl border-4 border-[#DFB15B]/40 bg-[#0F0503] group"
            >
              <img 
                src="https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&q=80&w=800" 
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[4000ms] ease-out" 
                alt="Luxury Gourmet Gift Box Packaging" 
                referrerPolicy="no-referrer"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0503]/80 via-transparent to-transparent pointer-events-none" />

              {/* Floating Hamper Tag Card */}
              <div className="absolute bottom-8 left-8 right-8 bg-[#1E0B07]/90 backdrop-blur-xl rounded-3xl p-5 shadow-2xl border border-[#DFB15B]/40 flex justify-between items-center text-left">
                <div className="space-y-1">
                  <span className="text-[#DFB15B] font-black text-[9px] uppercase tracking-widest block">L’ÉXQUISITE COLLECTION</span>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">The Sovereign Velvet Hamper</h4>
                  <p className="text-[10px] text-slate-300 font-medium leading-normal">Premium satin box featuring red roses, chocolate box & candles.</p>
                </div>
                <div className="bg-[#DFB15B]/20 text-[#DFB15B] p-3 rounded-2xl">
                  <Gift className="w-5 h-5 animate-pulse text-[#DFB15B]" />
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* =========================================================
          THE 8 MANDATED HAMPER CATEGORIES GRID
          ========================================================= */}
      <section className="py-24 bg-[#1E0B07]/60 border-y border-[#DFB15B]/20 backdrop-blur-md relative z-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12 space-y-16">
          
          <div className="text-center space-y-3">
            <span className="text-[#DFB15B] font-black text-[10px] tracking-[0.3em] uppercase block">PREMIUM DESIGN ATELIER</span>
            <h2 className="text-4xl font-black text-white tracking-tight leading-none uppercase">
              Hamper Master Collections
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-md mx-auto">
              Choose from our 8 signature hamper disciplines, built sequentially by luxury gifting experts and hand-delivered with white-glove courier dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {hamperCategories.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                className="group relative h-[320px] rounded-[32px] overflow-hidden border border-[#DFB15B]/30 shadow-xl hover:shadow-2xl hover:border-[#DFB15B] transition-all duration-300 text-left flex flex-col justify-end p-6 cursor-pointer"
                onClick={() => {
                  const builderEl = document.getElementById('hamper-interactive-builder');
                  if (builderEl) {
                    builderEl.scrollIntoView({ behavior: 'smooth' });
                    toast.success(`Theme Applied to Builder: ${cat.name}! 🎁`);
                  }
                }}
              >
                <img src={cat.img} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms]" alt={cat.name} referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0503] via-[#0F0503]/50 to-transparent pointer-events-none" />
                
                {/* Content Overlay */}
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{cat.emoji}</span>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">{cat.name}</h3>
                  </div>
                  <p className="text-[10px] text-slate-200 font-medium leading-relaxed line-clamp-3">{cat.desc}</p>
                  
                  <span className="text-[9px] font-black text-[#DFB15B] uppercase tracking-widest flex items-center gap-1 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>BUILD BESPOKE NOW</span>
                    <ArrowRight className="w-3 h-3 text-[#DFB15B]" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================
          BUILD YOUR OWN HAMPER (INTERACTIVE BUILDER CARD)
          ========================================================= */}
      <section id="hamper-interactive-builder" className="py-24 max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12 relative z-10 text-left">
        <div className="space-y-12">
          
          <div className="space-y-3">
            <span className="text-[#DFB15B] font-black text-[10px] tracking-[0.3em] uppercase block">THE INTERACTIVE GIFT DESIGNER</span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none uppercase">
              Bespoke Hamper Creator
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl">
              Design a gorgeous custom gift suite in real-time. Pick your casket box size, add freshly baked luxury cakes, chocolates, hand-tied Dutch flower bunches, calligraphy notes, and personalized candles.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Selection Steps - Columns (8/12) */}
            <div className="lg:col-span-8 space-y-10 bg-[#1E0B07]/80 backdrop-blur-xl border border-[#DFB15B]/30 rounded-[40px] p-6 md:p-10 shadow-2xl">
              
              {/* Step 1: Box Size */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <span className="w-6 h-6 rounded-full bg-[#DFB15B]/20 text-[#DFB15B] flex items-center justify-center font-black text-xs">1</span>
                  <h3 className="text-xs font-black text-white uppercase tracking-widest">Select Gift Casket Packaging</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {boxSizeOptions.map(box => (
                    <div 
                      key={box.name}
                      onClick={() => setBoxSize(box)}
                      className={`cursor-pointer rounded-2xl p-4 border flex flex-col justify-between h-[120px] transition-all ${
                        boxSize.name === box.name 
                          ? 'border-[#DFB15B] bg-[#DFB15B]/20 shadow-lg'
                          : 'border-white/10 bg-[#0F0503]/60 hover:bg-[#0F0503] hover:border-[#DFB15B]/40'
                      }`}
                    >
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">{box.name}</h4>
                        <p className="text-[10px] text-slate-300 font-medium leading-relaxed line-clamp-2">{box.desc}</p>
                      </div>
                      <span className="text-xs font-black text-[#DFB15B]">₹{box.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Fresh Cake Selection */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <span className="w-6 h-6 rounded-full bg-[#DFB15B]/20 text-[#DFB15B] flex items-center justify-center font-black text-xs">2</span>
                  <h3 className="text-xs font-black text-white uppercase tracking-widest">Add Freshly Baked Premium Cake</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cakeOptions.map(ck => (
                    <div 
                      key={ck.name}
                      onClick={() => setSelectedCake(ck)}
                      className={`cursor-pointer rounded-2xl p-4 border flex items-center justify-between transition-all ${
                        selectedCake.name === ck.name 
                          ? 'border-[#DFB15B] bg-[#DFB15B]/20 shadow-lg'
                          : 'border-white/10 bg-[#0F0503]/60 hover:bg-[#0F0503] hover:border-[#DFB15B]/40'
                      }`}
                    >
                      <div className="space-y-1 pr-4">
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">{ck.name}</h4>
                        <p className="text-[10px] text-slate-300 font-medium leading-relaxed line-clamp-1">{ck.desc}</p>
                      </div>
                      <span className="text-xs font-black text-[#DFB15B] flex-none">₹{ck.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 3: Premium Chocolates */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <span className="w-6 h-6 rounded-full bg-[#DFB15B]/20 text-[#DFB15B] flex items-center justify-center font-black text-xs">3</span>
                  <h3 className="text-xs font-black text-white uppercase tracking-widest">Add Imported Chocolates</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {chocolateOptions.map(choc => (
                    <div 
                      key={choc.name}
                      onClick={() => setSelectedChocolates(choc)}
                      className={`cursor-pointer rounded-2xl p-4 border flex items-center justify-between transition-all ${
                        selectedChocolates.name === choc.name 
                          ? 'border-[#DFB15B] bg-[#DFB15B]/20 shadow-lg'
                          : 'border-white/10 bg-[#0F0503]/60 hover:bg-[#0F0503] hover:border-[#DFB15B]/40'
                      }`}
                    >
                      <div className="space-y-1 pr-4">
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">{choc.name}</h4>
                        <p className="text-[10px] text-slate-300 font-medium leading-relaxed line-clamp-1">{choc.desc}</p>
                      </div>
                      <span className="text-xs font-black text-[#DFB15B] flex-none">₹{choc.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 4: Fresh Flowers */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <span className="w-6 h-6 rounded-full bg-[#DFB15B]/20 text-[#DFB15B] flex items-center justify-center font-black text-xs">4</span>
                  <h3 className="text-xs font-black text-white uppercase tracking-widest">Add Premium Fresh Flowers</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {flowerOptions.map(fl => (
                    <div 
                      key={fl.name}
                      onClick={() => setSelectedFlowers(fl)}
                      className={`cursor-pointer rounded-2xl p-4 border flex items-center justify-between transition-all ${
                        selectedFlowers.name === fl.name 
                          ? 'border-[#DFB15B] bg-[#DFB15B]/20 shadow-lg'
                          : 'border-white/10 bg-[#0F0503]/60 hover:bg-[#0F0503] hover:border-[#DFB15B]/40'
                      }`}
                    >
                      <div className="space-y-1 pr-4">
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">{fl.name}</h4>
                        <p className="text-[10px] text-slate-300 font-medium leading-relaxed line-clamp-1">{fl.desc}</p>
                      </div>
                      <span className="text-xs font-black text-[#DFB15B] flex-none">₹{fl.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 5: Handwriting Greeting Card */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <span className="w-6 h-6 rounded-full bg-[#DFB15B]/20 text-[#DFB15B] flex items-center justify-center font-black text-xs">5</span>
                  <h3 className="text-xs font-black text-white uppercase tracking-widest">Select Handwriting Greeting Card</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cardOptions.map(card => (
                    <div 
                      key={card.name}
                      onClick={() => setSelectedCard(card)}
                      className={`cursor-pointer rounded-2xl p-4 border flex flex-col justify-between h-[110px] transition-all ${
                        selectedCard.name === card.name 
                          ? 'border-[#DFB15B] bg-[#DFB15B]/20 shadow-lg'
                          : 'border-white/10 bg-[#0F0503]/60 hover:bg-[#0F0503] hover:border-[#DFB15B]/40'
                      }`}
                    >
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">{card.name}</h4>
                        <p className="text-[10px] text-slate-300 font-medium leading-relaxed">{card.desc}</p>
                      </div>
                      <span className="text-xs font-black text-[#DFB15B]">₹{card.price}</span>
                    </div>
                  ))}
                </div>

                {/* Card Message Input */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-[10px] font-black tracking-widest text-[#DFB15B] uppercase">Write handwritten custom message:</label>
                  <textarea 
                    value={selectedCard.text}
                    onChange={(e) => setSelectedCard({ ...selectedCard, text: e.target.value })}
                    placeholder="E.g., Wishing you standard luxury and sweet moments on your celebratory milestone!..."
                    className="w-full bg-[#0F0503]/80 border border-white/20 focus:border-[#DFB15B] rounded-2xl p-4 text-xs font-medium focus:outline-none transition-all placeholder:text-slate-500 text-white h-24 resize-none"
                  />
                </div>
              </div>

              {/* Step 6: Soft Toys & Helium Balloons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Toys */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black tracking-widest text-[#DFB15B] uppercase">Add Miniature Soft Toys:</label>
                  <select 
                    value={selectedToy.name}
                    onChange={(e) => {
                      const found = toyOptions.find(t => t.name === e.target.value);
                      if (found) setSelectedToy(found);
                    }}
                    className="w-full bg-[#0F0503] border border-white/20 rounded-2xl px-4 py-3 text-xs font-black uppercase text-white focus:outline-none focus:border-[#DFB15B]"
                  >
                    {toyOptions.map(t => (
                      <option key={t.name} value={t.name}>{t.name} {t.price > 0 ? `(+₹${t.price})` : ''}</option>
                    ))}
                  </select>
                </div>

                {/* Balloons */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black tracking-widest text-[#DFB15B] uppercase">Add Helium Balloons:</label>
                  <select 
                    value={selectedBalloons.name}
                    onChange={(e) => {
                      const found = balloonOptions.find(b => b.name === e.target.value);
                      if (found) setSelectedBalloons(found);
                    }}
                    className="w-full bg-[#0F0503] border border-white/20 rounded-2xl px-4 py-3 text-xs font-black uppercase text-white focus:outline-none focus:border-[#DFB15B]"
                  >
                    {balloonOptions.map(b => (
                      <option key={b.name} value={b.name}>{b.name} {b.price > 0 ? `(+₹${b.price})` : ''}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Step 7: Golden Add-ons */}
              <div className="space-y-3">
                <label className="text-[10px] font-black tracking-widest text-[#DFB15B] uppercase">Elite Add-ons & Celebration Essentials:</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {addonOptions.map(ad => {
                    const isSelected = selectedAddons.some(a => a.name === ad.name);
                    return (
                      <div 
                        key={ad.name}
                        onClick={() => toggleAddon(ad)}
                        className={`cursor-pointer rounded-xl p-3 border flex items-center justify-between text-left transition-all ${
                          isSelected 
                            ? 'border-[#DFB15B] bg-[#DFB15B]/20 text-[#DFB15B]'
                            : 'border-white/10 bg-[#0F0503]/60 hover:bg-[#0F0503] text-slate-300'
                        }`}
                      >
                        <span className="text-[11px] font-bold uppercase tracking-wider line-clamp-1">{ad.name}</span>
                        <span className="text-[11px] font-black">₹{ad.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Live Preview & Sticky Summary - Column (4/12) */}
            <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24 h-fit">
              
              <div className="bg-[#1E0B07]/90 backdrop-blur-xl text-white rounded-[36px] border border-[#DFB15B]/30 p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#DFB15B]/15 blur-[60px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#8B5CF6]/15 blur-[60px] pointer-events-none" />

                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-[#DFB15B] animate-pulse" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#DFB15B]">Bespoke Summary</h3>
                  </div>
                  <span className="bg-[#DFB15B]/20 border border-[#DFB15B]/40 text-[#DFB15B] text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">LIVE COUTURE</span>
                </div>

                {/* Items breakdown list */}
                <div className="space-y-4 text-xs font-medium text-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Box Style:</span>
                    <span className="text-white text-right max-w-[180px] line-clamp-1 uppercase tracking-wide">{boxSize.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Elite Cake:</span>
                    <span className="text-white text-right max-w-[180px] line-clamp-1 uppercase tracking-wide">{selectedCake.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Chocolates:</span>
                    <span className="text-white text-right max-w-[180px] line-clamp-1 uppercase tracking-wide">{selectedChocolates.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Flowers:</span>
                    <span className="text-white text-right max-w-[180px] line-clamp-1 uppercase tracking-wide">{selectedFlowers.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Calligraphy Card:</span>
                    <span className="text-white text-right max-w-[180px] line-clamp-1 uppercase tracking-wide">{selectedCard.name}</span>
                  </div>
                  {selectedToy.name !== 'None' && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Soft Toy:</span>
                      <span className="text-white text-right max-w-[180px] line-clamp-1 uppercase tracking-wide">{selectedToy.name}</span>
                    </div>
                  )}
                  {selectedBalloons.name !== 'None' && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Helium Balloons:</span>
                      <span className="text-white text-right max-w-[180px] line-clamp-1 uppercase tracking-wide">{selectedBalloons.name}</span>
                    </div>
                  )}
                  {selectedAddons.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Add-ons ({selectedAddons.length}):</span>
                      <span className="text-white text-right max-w-[180px] line-clamp-1 uppercase tracking-wide">{selectedAddons.map(a => a.name.split(' ')[0]).join(', ')}</span>
                    </div>
                  )}
                </div>

                {/* Handwritten card preview */}
                {selectedCard.text.trim() && (
                  <div className="bg-[#0F0503]/80 border border-white/10 rounded-2xl p-4 space-y-2 text-left">
                    <span className="text-[8px] font-black text-[#DFB15B] uppercase tracking-widest block">Envelope calligraphy preview:</span>
                    <p className="text-[11px] text-slate-200 italic font-medium leading-relaxed">"{selectedCard.text}"</p>
                  </div>
                )}

                <div className="border-t border-white/10 pt-5 space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[8px] font-black text-slate-400 block uppercase tracking-widest">Dynamic Price Estimate</span>
                      <span className="text-2xl font-black text-[#DFB15B]">₹{totalPrice}</span>
                    </div>
                    <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" />
                      <span>Free White-Glove Shipping</span>
                    </span>
                  </div>

                  <button 
                    onClick={handleAddCustomHamperToCart}
                    className="w-full bg-gradient-to-r from-[#DFB15B] to-[#F3C87A] text-[#0F0503] font-black text-xs uppercase tracking-[0.2em] py-5 px-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4.5 h-4.5" />
                    <span>Secure Hamper Basket</span>
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          THE PRE-CONFIGURED PREMIUM HAMPERS GRID
          ========================================================= */}
      <section id="preconfigured-hampers-grid" className="py-24 max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12 space-y-12 relative z-10 text-left">
        
        <div className="text-center space-y-3">
          <span className="text-[#DFB15B] font-black text-[10px] tracking-[0.3em] uppercase block">BEST SELLER GIFT SUITES</span>
          <h2 className="text-3xl font-black text-white tracking-tight leading-none uppercase">
            Signature Pre-configured Hampers
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-md mx-auto">
            Browse our pre-arranged collector gift packages, decorated beautifully with matching silk ribbons and standard packaging inserts.
          </p>
        </div>

        {/* 4 columns grid desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {preConfiguredHampers.map((hamp) => (
            <motion.div
              key={hamp.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-[#1E0B07]/80 border border-[#DFB15B]/30 backdrop-blur-md rounded-[32px] p-5 shadow-xl hover:shadow-2xl hover:border-[#DFB15B] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group h-[420px]"
            >
              <div className="space-y-4 relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden relative bg-[#0F0503] border border-white/10">
                  <img src={hamp.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={hamp.name} referrerPolicy="no-referrer" />
                  
                  {/* Heart wishlist */}
                  <button 
                    onClick={() => toggleFavorite(hamp.id, hamp.name)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#0F0503]/80 backdrop-blur-md flex items-center justify-center text-slate-300 hover:text-red-500 hover:scale-110 active:scale-95 transition-all shadow-sm border border-white/10"
                  >
                    <Heart className={`w-4.5 h-4.5 ${favorites.includes(hamp.id) ? 'fill-red-500 text-red-500' : 'text-slate-300'}`} />
                  </button>

                  <span className="absolute bottom-3 left-3 bg-[#0F0503]/90 backdrop-blur-md text-[#DFB15B] font-black text-[7px] uppercase tracking-widest px-2.5 py-1 rounded-full border border-[#DFB15B]/30">
                    {hamp.category}
                  </span>

                  {hamp.tag && (
                    <span className="absolute top-3 left-3 bg-[#DFB15B] text-[#0F0503] font-black text-[7px] uppercase tracking-widest px-2.5 py-1 rounded-full">
                      {hamp.tag}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1 text-[10px] text-amber-300 font-bold">
                    <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                    <span>{hamp.rating}</span>
                    <span className="text-slate-300">({hamp.reviews} ratings)</span>
                  </div>

                  <h3 className="text-sm font-black text-white group-hover:text-[#DFB15B] transition-colors leading-tight line-clamp-1 uppercase tracking-wider">{hamp.name}</h3>
                  <p className="text-[11px] text-slate-300 font-medium leading-relaxed line-clamp-2 h-[34px]">{hamp.desc}</p>
                </div>
              </div>

              {/* Price and Cart */}
              <div className="border-t border-white/10 pt-4 mt-2">
                <div className="flex items-center justify-between text-[9px] text-slate-300 font-black uppercase tracking-widest mb-3">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Free White-Glove Shipping</span>
                  </span>
                  <span className="text-[#DFB15B]">Silk Ribbon Box</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[8px] font-black text-slate-400 block">PRICE</span>
                    <span className="text-base font-black text-[#DFB15B]">₹{hamp.price}</span>
                  </div>

                  <button 
                    onClick={() => handleAddPreconfiguredToCart(hamp)}
                    className="bg-gradient-to-r from-[#DFB15B] to-[#F3C87A] text-[#0F0503] text-[9px] font-black uppercase tracking-widest py-3 px-5 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>QUICK ADD</span>
                  </button>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </section>

      {/* =========================================================
          AI GIFT CONFIGURATIONS & FOOTER
          ========================================================= */}
      <section className="py-12 bg-transparent">
        <AICakeRecommendation category="Hampers & Flowers combo" />
      </section>

      <section className="py-20 bg-transparent">
        <LuxuryTestimonials />
      </section>

      {/* GLOBAL CTA: Ready to Surprise Someone Special? */}
      <section className="py-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12">
          <div className="bg-[#1E0B07]/90 backdrop-blur-xl border border-[#DFB15B]/30 text-white rounded-[44px] p-8 md:p-14 text-center relative overflow-hidden flex flex-col items-center space-y-6 shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#DFB15B]/10 blur-[90px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#8B5CF6]/10 blur-[90px] pointer-events-none" />
            
            <span className="text-[#DFB15B] font-black text-[10px] tracking-[0.3em] uppercase block">PRE-ORDER INVITATION</span>
            <h3 className="text-3xl md:text-5xl font-black tracking-tight max-w-xl leading-tight font-sans">
              Ready To Surprise Someone Special?
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed font-medium max-w-sm">
              Create unforgettable moments with our freshly baked luxury cakes, standard sweet creations, and custom gourmet hampers.
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
      <StickyCTA onAction={() => setIsQuickOrderOpen(true)} label="RESERVE HAMPER" category="Luxury Gift Hamper" />
      <LuxuryConcierge />

      <QuickOrderModal 
        isOpen={isQuickOrderOpen} 
        onClose={() => setIsQuickOrderOpen(false)} 
        category="Hampers" 
      />

    </div>
  );
}
