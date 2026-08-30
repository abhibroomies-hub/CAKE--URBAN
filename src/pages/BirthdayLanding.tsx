import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  Gift, 
  Cake, 
  Check, 
  Star, 
  Instagram, 
  Share2, 
  Heart, 
  Flame, 
  Info,
  Loader2
} from 'lucide-react';
import { useCart } from '../lib/store';
import { toast } from 'sonner';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { 
  LuxuryConcierge, 
  QuickOrderModal, 
  StickyCTA, 
  AICakeRecommendation, 
  LuxuryTestimonials, 
  PremiumFooterBanner 
} from '../components/LuxuryShared';

export default function BirthdayLanding() {
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
  const addItem = useCart((state) => state.addItem);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, 'products'),
      (snap) => {
        if (!snap.empty) {
          const prods = snap.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name || "",
              description: data.description || "",
              price: Number(data.price) || 0,
              categories: data.categories || [],
              occasions: data.occasions || [],
              flavors: data.flavors || [],
              images: data.images || [],
              stockStatus: data.stockStatus || 'in-stock',
              isCustomizable: data.isCustomizable !== false,
              isBestseller: !!data.isBestseller,
              isNew: !!data.isNew,
              weights: data.weights || [0.5, 1.0, 2.0],
              dietary: data.dietary || ["Eggless"],
              rating: data.rating || 4.8,
              reviewsCount: data.reviewsCount || Math.floor(Math.random() * 80) + 20,
            } as Product;
          });
          // Filter products where occasion includes Birthday
          const filtered = prods.filter(p => 
            p.occasions?.some(occ => occ.toLowerCase() === 'birthday') ||
            p.categories?.some(cat => cat.toLowerCase().includes('birthday'))
          );
          setDbProducts(filtered);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching birthday products:", err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Floating objects configuration
  const floatingItems = [
    { type: 'macaron', text: '🍬', top: '15%', left: '8%', delay: 0 },
    { type: 'balloon', text: '🎈', top: '22%', left: '82%', delay: 1.5 },
    { type: 'gift', text: '🎁', top: '65%', left: '5%', delay: 3 },
    { type: 'candle', text: '🕯️', top: '45%', left: '88%', delay: 0.8 },
    { type: 'macaron', text: '🧁', top: '75%', left: '84%', delay: 2.2 }
  ];

  // Birthday Collections
  const collections = [
    {
      id: 'bday-kids',
      name: "Chéris Enfants",
      subtitle: "Kids Fantasy Collection",
      desc: "Whimsical pastel fantasy tiers featuring custom sculpted organic sugar clouds, soft rainbows, and chocolate characters.",
      image: "https://images.unsplash.com/photo-1558961309-dbdf079115fd?auto=format&fit=crop&q=80&w=600",
      price: 2499,
      tag: "KIDS FAVORITE"
    },
    {
      id: 'bday-adults',
      name: "L’Adulte Moderne",
      subtitle: "Sophisticated Adult Collection",
      desc: "Avant-garde visual palettes dressed in dark velvet sprays, organic botanicals, and hand-painted metallic edges.",
      image: "https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&q=80&w=600",
      price: 3499,
      tag: "TRENDING NOW"
    },
    {
      id: 'bday-luxury',
      name: "Or Gilded Imperial",
      subtitle: "Ultra Luxury Collection",
      desc: "Spectacular multi-tiered architectures gilded with pure 24K edible gold leaf, spun sugar filaments, and fresh orchids.",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600",
      price: 6999,
      tag: "COUTURE CLASS"
    },
    {
      id: 'bday-minimal',
      name: "Bento Pureté",
      subtitle: "Minimalist Pastel Bento",
      desc: "Clean Swiss-modern circular silhouettes featuring hand-brushed lettering and sleek buttercream borders.",
      image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=600",
      price: 1299,
      tag: "MINIMALIST"
    },
    {
      id: 'bday-photo',
      name: "Studio Impressionist",
      subtitle: "High-Definition Photo Cakes",
      desc: "Your treasured memories printed on premium Madagascan sugar paper with organic vegetable dyes on Belgian truffle.",
      image: "https://images.unsplash.com/photo-1562266563-fa14c7ec83df?auto=format&fit=crop&q=80&w=600",
      price: 1899,
      tag: "CUSTOM PRINT"
    },
    {
      id: 'bday-trending',
      name: "Le Splash Cascade",
      subtitle: "Trending Cream Splash",
      desc: "Dynamic whipped cream splashes paired with gourmet chocolate shards, fresh berries, and neon glow accents.",
      image: "https://images.unsplash.com/photo-1511018556340-d16986a1c194?auto=format&fit=crop&q=80&w=600",
      price: 2199,
      tag: "POPULAR NOW"
    }
  ];

  // Offers
  const offers = [
    {
      title: "Couture Duo Match",
      badge: "BUY 1 GET 1",
      desc: "Purchase any 1.5kg+ signature cake and receive a matching custom bento surprise cake for your private salon.",
      action: "Claim Duo Match"
    },
    {
      title: "Sculpted Luminaries",
      badge: "FREE CANDLES",
      desc: "Every birthday masterwork includes a set of our hand-dipped natural beeswax spiral candles in elegant rose gold.",
      action: "View Luminary Catalog"
    },
    {
      title: "La Lettre d'Or",
      badge: "FREE GREETING CARD",
      desc: "A hand-pressed heavy card printed on textured botanical cotton paper, featuring custom gold-leaf calligraphy.",
      action: "Add Custom Letter"
    }
  ];

  // Masonry layout images
  const galleryImages = [
    { url: "https://images.unsplash.com/photo-1464349172961-10442a8a1732?auto=format&fit=crop&q=80&w=400", size: "col-span-2 row-span-2", title: "Céleste Pastel Sparkle" },
    { url: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=400", size: "col-span-1 row-span-1", title: "Gilded Macaron Cascade" },
    { url: "https://images.unsplash.com/photo-1504113888839-1c8003680495?auto=format&fit=crop&q=80&w=400", size: "col-span-1 row-span-2", title: "Pure Belgian Truffle Glow" },
    { url: "https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&q=80&w=400", size: "col-span-1 row-span-1", title: "Pink Botanical Crown" },
    { url: "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?auto=format&fit=crop&q=80&w=400", size: "col-span-2 row-span-1", title: "Gourmet Birthday Banquet" }
  ];

  const handleOrder = (cake: any) => {
    addItem({
      id: cake.id,
      name: cake.name,
      description: cake.desc,
      price: cake.price,
      categories: ['Birthday', 'Cakes'],
      occasions: ['Birthday'],
      flavors: ['Belgian Chocolate', 'Vanilla'],
      images: [cake.image],
      stockStatus: 'in-stock',
      isCustomizable: true
    }, {
      selectedWeight: 1.5,
      selectedFlavor: 'Belgian Truffle',
      eggless: true
    });
    toast.success(`${cake.name} successfully tailored & added to your curation basket! ✨`);
  };

  return (
    <div className="bg-transparent min-h-screen text-[#FFFDFB] overflow-x-hidden font-sans relative pb-16 md:pb-0 select-none">
      
      {/* Background Lighting Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-pink-500/10 via-purple-500/5 to-transparent blur-[160px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[45%] h-[45%] bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent blur-[150px] pointer-events-none" />
      
      {/* Dynamic Floating Confetti Elements */}
      {floatingItems.map((item, idx) => (
        <motion.div
          key={idx}
          style={{ top: item.top, left: item.left }}
          className="absolute text-2xl hidden md:block z-10 select-none pointer-events-none filter drop-shadow-md"
          animate={{
            y: [0, -25, 0],
            rotate: [0, 15, -15, 0],
            scale: [1, 1.05, 0.95, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut"
          }}
        >
          {item.text}
        </motion.div>
      ))}

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 md:py-32 max-w-[1320px] mx-auto px-4 md:px-8 xl:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Content (Left) */}
          <div className="lg:col-span-6 space-y-8 text-left z-20">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-3"
            >
              <span className="text-[#DFB15B] font-black text-[10px] tracking-[0.35em] uppercase block">
                MAISON DE CONFECTIO
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-sans leading-none">
                Celebrate Every <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-pink-400 via-amber-300 to-rose-400 bg-clip-text text-transparent">
                  Birthday Beautifully
                </span>
              </h1>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium max-w-lg"
            >
              Where high fashion meets master pâtisserie. Orchestrated with hand-painted sugar sculptures, premium French macarons, rich chocolate cascades, and animated candles. Every creation is custom-tailored for your private celebration.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <button 
                onClick={() => setIsQuickOrderOpen(true)}
                className="bg-gradient-to-r from-[#DFB15B] to-[#F3C87A] hover:from-[#c99c48] hover:to-[#dfb15b] text-[#0F0503] text-xs font-black uppercase tracking-[0.2em] py-4.5 px-8 rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(223,177,91,0.3)] flex items-center gap-2 cursor-pointer"
              >
                <span>Order Birthday Cake</span>
                <ArrowRight className="w-4 h-4 text-[#0F0503]" />
              </button>
              
              <button 
                onClick={() => {
                  const aiWidget = document.getElementById('ai-recommender');
                  if (aiWidget) aiWidget.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md text-xs font-black uppercase tracking-[0.2em] py-4.5 px-8 rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>Customize Cake</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex items-center gap-6 border-t border-white/15 pt-8"
            >
              <div className="text-left">
                <span className="text-2xl font-black text-white block">4.9★</span>
                <span className="text-[9px] font-black tracking-wider text-[#DFB15B] uppercase">20k+ Tastemakers</span>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-left">
                <span className="text-2xl font-black text-white block">100%</span>
                <span className="text-[9px] font-black tracking-wider text-[#DFB15B] uppercase">Eggless Tailored</span>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-left">
                <span className="text-2xl font-black text-white block">Same Day</span>
                <span className="text-[9px] font-black tracking-wider text-[#DFB15B] uppercase">White Glove Ship</span>
              </div>
            </motion.div>
          </div>

          {/* Hero 3D / Imagery Stack (Right) */}
          <div className="lg:col-span-6 relative flex justify-center z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-full max-w-[480px] aspect-square rounded-[40px] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.5)] border border-[#DFB15B]/40"
            >
              {/* Premium image representing majestic birthday cake */}
              <img 
                src="https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&q=80&w=800" 
                className="w-full h-full object-cover select-none scale-105 hover:scale-100 transition-transform duration-[2000ms]" 
                alt="Majestic Birthday Cake Couture" 
                referrerPolicy="no-referrer"
              />

              {/* Glowing overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0503]/80 via-transparent to-transparent pointer-events-none" />

              {/* Floating micro-badges */}
              <div className="absolute top-6 left-6 bg-[#1E0B07]/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl text-left max-w-[180px] border border-[#DFB15B]/40">
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 font-black text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full inline-block">HOT IN REVELRY</span>
                <h4 className="text-xs font-black text-white tracking-tight mt-1.5 uppercase">L’Or Macaron Dream</h4>
                <p className="text-[9px] text-[#DFB15B] mt-0.5 font-bold">₹2,499 / 1.5 kg</p>
              </div>

              <div className="absolute bottom-6 right-6 bg-[#0F0503]/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl text-left max-w-[180px] border border-[#DFB15B]/30">
                <span className="text-[#DFB15B] font-black text-[8px] uppercase tracking-widest block">CHEF SIGNATURE</span>
                <p className="text-[10px] font-semibold text-slate-200 leading-relaxed mt-1">"Infused with grand Cru Belgian Cocoa & Saffron spray."</p>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* COLLECTIONS GALLERY */}
      <section className="py-20 bg-transparent border-y border-white/10">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-0 space-y-12">
          
          <div className="text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-black text-[#DFB15B] tracking-[0.3em] uppercase block">PREMIUM SELECTION</span>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Curated Birthday Collections
              </h2>
              <p className="text-xs text-slate-300 font-medium max-w-sm">
                Each category represents a completely unique aesthetic philosophy, custom designed for discerning hosts.
              </p>
            </div>
            <button 
              onClick={() => setIsQuickOrderOpen(true)}
              className="text-[#DFB15B] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 self-center md:self-end border-b border-[#DFB15B] pb-1 cursor-pointer"
            >
              <span>Explore All Tastes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((cake, index) => (
              <motion.div
                key={cake.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1E0B07]/80 backdrop-blur-md border border-[#DFB15B]/30 rounded-[32px] overflow-hidden shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between text-left group"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img src={cake.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={cake.name} referrerPolicy="no-referrer" />
                  <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-[#DFB15B] border border-[#DFB15B]/40 font-black text-[8px] uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                    {cake.tag}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-[#DFB15B] uppercase tracking-widest block">{cake.subtitle}</span>
                    <h3 className="text-lg font-black text-white uppercase tracking-wider">{cake.name}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">{cake.desc}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">TAILORED PRICE</span>
                      <span className="text-sm font-black text-[#DFB15B]">₹{cake.price}</span>
                    </div>
                    
                    <button 
                      onClick={() => handleOrder(cake)}
                      className="bg-gradient-to-r from-[#DFB15B] to-[#F3C87A] text-[#0F0503] text-[10px] font-black uppercase tracking-widest py-3 px-5 rounded-xl transition-all active:scale-95 cursor-pointer shadow-md"
                    >
                      TAILOR & ADD
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Dynamic Birthday Cakes from Bakery */}
      <section className="py-20 bg-transparent border-b border-white/10">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-0 space-y-12">
          <div className="text-center md:text-left">
            <span className="text-[10px] font-black text-[#DFB15B] tracking-[0.3em] uppercase block mb-1">ONLINE BAKERY COLLECTION</span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Freshly Baked Birthday Masterpieces
            </h2>
            <p className="text-xs text-slate-300 font-medium max-w-sm mt-1">
              Direct from our gourmet kitchens, customizable for weight, flavor, and eggless preference.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-[#DFB15B] animate-spin" />
            </div>
          ) : dbProducts.length === 0 ? (
            <div className="text-center py-16 bg-[#1E0B07]/80 rounded-3xl border border-[#DFB15B]/30 p-8">
              <Sparkles className="w-8 h-8 text-[#DFB15B] mx-auto mb-2 animate-bounce" />
              <p className="text-sm font-black text-white">No custom database cakes yet.</p>
              <p className="text-xs text-slate-400 mt-1">Our chefs are preparing new creative receipts!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {dbProducts.slice(0, 12).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BIRTHDAY OFFERS SECTION */}
      <section className="py-20 max-w-[1320px] mx-auto px-4 md:px-8 xl:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-4 text-left space-y-4">
            <span className="text-[#DFB15B] font-black text-[10px] tracking-[0.3em] uppercase block">EXQUISITE INDULGENCE</span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Exclusive Birthday Offerings
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Tailored enhancements provided with each celebration order to craft an unforgettable, high-end sensory event.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {offers.map((off, idx) => (
              <div 
                key={idx}
                className="bg-[#1E0B07]/80 border border-[#DFB15B]/30 p-6 rounded-3xl text-left space-y-4 shadow-2xl relative group hover:border-[#DFB15B] transition-colors"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#DFB15B]/20 border border-[#DFB15B]/40 flex items-center justify-center text-[#DFB15B]">
                  <Gift className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <span className="bg-[#DFB15B]/20 text-[#DFB15B] font-black text-[8px] tracking-widest px-2 py-0.5 rounded-full inline-block border border-[#DFB15B]/30">
                    {off.badge}
                  </span>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">{off.title}</h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-normal">{off.desc}</p>
                </div>
                <button 
                  onClick={() => setIsQuickOrderOpen(true)}
                  className="text-xs font-black text-[#DFB15B] group-hover:text-amber-300 transition-colors flex items-center gap-1 mt-2 uppercase tracking-wider cursor-pointer"
                >
                  <span>{off.action}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* AI RECOMMENDATION WIZARD */}
      <section id="ai-recommender" className="py-12 bg-transparent">
        <AICakeRecommendation category="Birthday" />
      </section>

      {/* INSTAGRAM MASONRY GALLERY */}
      <section className="py-20 bg-transparent">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-0 space-y-10">
          
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black text-[#DFB15B] tracking-[0.3em] uppercase block">SOCIETY LOOKBOOK</span>
            <h3 className="text-3xl font-black text-white tracking-tight font-sans">
              Captured Moments of Grandeur
            </h3>
            <p className="text-xs text-slate-300 font-medium max-w-sm mx-auto">
              Follow our aesthetic feed and tag <strong className="text-[#DFB15B]">#CakeCouture</strong> to be included in our elite circle.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {galleryImages.map((img, idx) => (
              <div 
                key={idx}
                className={`${img.size} rounded-3xl overflow-hidden relative group shadow-2xl border border-[#DFB15B]/30`}
              >
                <img src={img.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={img.title} referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0503]/90 via-[#0F0503]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-left text-white space-y-1">
                  <span className="text-[#DFB15B] font-black text-[8px] uppercase tracking-widest">INSTAGRAM REVELRY</span>
                  <h4 className="text-xs font-black uppercase tracking-wider">{img.title}</h4>
                  <div className="flex items-center gap-1.5 text-[9px] text-slate-300 pt-1.5 border-t border-white/10">
                    <Instagram className="w-3 h-3 text-[#DFB15B]" />
                    <span>@cakeurban_celebrations</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* TESTIMONIALS & FOOTER BANNER */}
      <section className="py-20 bg-transparent border-t border-white/10">
        <LuxuryTestimonials />
      </section>

      {/* Pre-Footer Action Block */}
      <section className="py-12 bg-transparent">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-0">
          <div className="bg-gradient-to-tr from-[#1E0B07] to-[#2E120B] text-white rounded-[40px] p-8 md:p-12 text-center relative overflow-hidden flex flex-col items-center space-y-6 border border-[#DFB15B]/40 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#DFB15B]/10 blur-[80px] pointer-events-none" />
            
            <span className="text-[#DFB15B] font-black text-[10px] tracking-[0.3em] uppercase block">PRE-ORDER INVITATION</span>
            <h3 className="text-3xl md:text-5xl font-black tracking-tight max-w-xl leading-tight text-white">
              Book Birthday Cake Today
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed font-medium max-w-sm">
              Tailor-designed birthday cakes take 12-24 hours to orchestrate. Initiate your luxury booking sequences today to secure the date.
            </p>
            <button 
              onClick={() => setIsQuickOrderOpen(true)}
              className="bg-gradient-to-r from-[#DFB15B] to-[#F3C87A] text-[#0F0503] font-black text-xs uppercase tracking-[0.2em] py-4.5 px-10 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2 cursor-pointer"
            >
              <span>INITIATE RESERVATION</span>
              <ArrowRight className="w-4 h-4 text-[#0F0503]" />
            </button>
          </div>
        </div>
      </section>

      <PremiumFooterBanner />

      {/* Sticky mobile CTA and helper */}
      <StickyCTA onAction={() => setIsQuickOrderOpen(true)} label="PRE-ORDER NOW" category="Birthday" />
      <LuxuryConcierge />

      <QuickOrderModal 
        isOpen={isQuickOrderOpen} 
        onClose={() => setIsQuickOrderOpen(false)} 
        category="Birthday" 
      />

    </div>
  );
}
