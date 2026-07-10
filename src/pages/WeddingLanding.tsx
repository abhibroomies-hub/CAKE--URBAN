import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  Heart, 
  Award, 
  User, 
  Phone, 
  Calendar, 
  Mail, 
  Clock, 
  Compass, 
  Check, 
  Info, 
  Users,
  MessageSquare,
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

export default function WeddingLanding() {
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const addItem = useCart((state) => state.items);
  const addCartItem = useCart((state) => state.addItem);
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
          // Filter products where occasion includes Wedding
          const filtered = prods.filter(p => 
            p.occasions?.some(occ => occ.toLowerCase() === 'wedding') ||
            p.categories?.some(cat => cat.toLowerCase().includes('wedding'))
          );
          setDbProducts(filtered);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching wedding products:", err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Form states for Wedding Consultation Form
  const [consultationSubmitted, setConsultationSubmitted] = useState(false);
  const [consultForm, setConsultForm] = useState({
    name: '',
    phone: '',
    date: '',
    tastingRequired: 'yes',
    tierPreference: '3-tier'
  });

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultForm.name || !consultForm.phone || !consultForm.date) {
      toast.error("Please provide mandatory details to schedule a private designer tasting.");
      return;
    }
    setConsultationSubmitted(true);
    setTimeout(() => {
      toast.success("Royal Wedding Consultation Scheduled! ✨ Our Lead Wedding Designer will reach out within 15 minutes.");
      setConsultationSubmitted(false);
      setIsConsultationModalOpen(false);
    }, 1500);
  };

  // Wedding Collections
  const weddingCollections = [
    {
      id: 'wed-classic',
      name: "La Dentelle Blanche",
      subtitle: "Classic Ivory Collection",
      desc: "Delicate hand-piped buttercream lace reminiscent of Parisian couture, paired with edible sugar pearls.",
      image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=600",
      tiers: "3-Tier Majestic",
      price: 14999
    },
    {
      id: 'wed-royal',
      name: "Or Gilded Dynastie",
      subtitle: "Royal Gold Collection",
      desc: "A breathtaking 5-tier architecture adorned with hand-placed 24K pure gold leaf, cascading gold fondant drapes, and organic orchids.",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600",
      tiers: "5-Tier Sovereign",
      price: 29999
    },
    {
      id: 'wed-luxury',
      name: "Le Jardin Étoilé",
      subtitle: "Floral Luxury Collection",
      desc: "An immersive sensory garden of hand-crafted sugar roses, rose-gold dusted foliage, and organic lavender infusions.",
      image: "https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&q=80&w=600",
      tiers: "4-Tier Grandeur",
      price: 19999
    },
    {
      id: 'wed-minimal',
      name: "Sleek Crème Pureté",
      subtitle: "Modern Minimalist",
      desc: "Ultra-clean sharp-edged white chocolate fondant cylinder pillars accented with simple geometric gold wire lines.",
      image: "https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&q=80&w=600",
      tiers: "2-Tier Sleek",
      price: 8999
    },
    {
      id: 'wed-modern',
      name: "L'Aube de Rose-Or",
      subtitle: "Rose Gold Modernist",
      desc: "Abstract hand-sculpted rose gold sugar structures draped seamlessly over rich Belgian white chocolate feuilletine.",
      image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=600",
      tiers: "3-Tier Elegance",
      price: 12999
    },
    {
      id: 'wed-premium',
      name: "Symphonie Impériale",
      subtitle: "Premium Masterwork",
      desc: "An elite creation pairing customized monograms, edible lace, floating floral platforms, and warm, safe ambient LED candle integration.",
      image: "https://images.unsplash.com/photo-1519340330287-268e351906a5?auto=format&fit=crop&q=80&w=600",
      tiers: "7-Tier Cathedral",
      price: 49999
    }
  ];

  // Gallery of Weddings
  const weddingGallery = [
    { url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400", title: "Amira & Kabir’s Palace Banquet" },
    { url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=400", title: "Tanya & Sam’s Ivory Courtyard" },
    { url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=400", title: "Couture Floral Detailing" }
  ];

  const handleOrderWedding = (cake: any) => {
    addCartItem({
      id: cake.id,
      name: cake.name,
      description: cake.desc,
      price: cake.price,
      categories: ['Wedding', 'Cakes'],
      occasions: ['Wedding'],
      flavors: ['Madagascan Vanilla Caviar', 'Belgian Chocolate Truffle'],
      images: [cake.image],
      stockStatus: 'in-stock',
      isCustomizable: true
    }, {
      selectedWeight: 4,
      selectedFlavor: 'White Truffle Berry',
      eggless: true
    });
    toast.success(`${cake.name} successfully tailored for your wedding & added to your basket! ✨`);
  };

  return (
    <div className="bg-white min-h-screen text-slate-800 font-sans relative select-none pb-16 md:pb-0">
      
      {/* Absolute Luxury Gold/Ivory Backing Light */}
      <div className="absolute top-0 right-0 w-[60%] h-[40%] bg-gradient-to-l from-amber-100/30 via-transparent to-transparent blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-rose-100/20 via-transparent to-transparent blur-[150px] pointer-events-none" />

      {/* =========================================================
          HERO SECTION (Pure White, Gold & Ivory Luxury)
          ========================================================= */}
      <section className="relative pt-12 pb-24 md:py-32 max-w-[1320px] mx-auto px-4 md:px-8 xl:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Content (Left) */}
          <div className="lg:col-span-7 space-y-8 text-left z-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-3"
            >
              <span className="text-[#DFB15B] font-black text-[10px] tracking-[0.4em] uppercase block">
                MAISON DE MARIAGE
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 font-sans leading-tight">
                Luxury Wedding Cakes <br />
                <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-[#DFB15B] bg-clip-text text-transparent">
                  Crafted With Love
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold max-w-xl"
            >
              Every wedding is an architectural love story waiting to be told. Our master chefs sculpt each grand multi-tiered wedding cake with organic sugar lace, 24K edible gold leaves, hand-crafted ivory floral designs, and custom monogram embellishments.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <button 
                onClick={() => setIsConsultationModalOpen(true)}
                className="bg-slate-950 hover:bg-slate-900 text-[#DFB15B] text-xs font-black uppercase tracking-[0.2em] py-4.5 px-9 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2"
              >
                <span>Book Designer Consultation</span>
                <ArrowRight className="w-4 h-4 text-[#DFB15B]" />
              </button>
              
              <button 
                onClick={() => {
                  const colls = document.getElementById('wedding-collections-sec');
                  if (colls) colls.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-black uppercase tracking-[0.2em] py-4.5 px-8 rounded-full transition-all hover:scale-105 active:scale-95"
              >
                <span>Explore Creations</span>
              </button>
            </motion.div>

            {/* Feature Bullet Points */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-100"
            >
              <div className="flex items-start gap-3 text-left">
                <div className="w-6 h-6 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-[#DFB15B] shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase">Complimentary Tasting</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Custom flavor boxes delivered to your salon.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-left">
                <div className="w-6 h-6 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-[#DFB15B] shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase">White Glove Delivery</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Climate-controlled transport & structural set-up.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-left">
                <div className="w-6 h-6 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-[#DFB15B] shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase">Bespoke Design Renders</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Stunning 3D sketches before we start baking.</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Hero Image (Right) */}
          <div className="lg:col-span-5 relative flex justify-center z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-full max-w-[420px] aspect-[4/5] rounded-[48px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.08)] border-8 border-slate-100"
            >
              <img 
                src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=800" 
                className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[2000ms]" 
                alt="Luxury 3 Tier Wedding Cake" 
                referrerPolicy="no-referrer"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-white text-left">
                <span className="text-[#DFB15B] font-black text-[9px] uppercase tracking-widest block">ROYAL WEDDING SELECTION</span>
                <h4 className="text-sm font-black text-slate-900 tracking-tight mt-1 uppercase">La Dentelle Blanche</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">3-tier customized ivory, finished with fresh seasonal white gardenias.</p>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* =========================================================
          WEDDING COLLECTIONS GALLERY
          ========================================================= */}
      <section id="wedding-collections-sec" className="py-24 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-0 space-y-16">
          
          <div className="text-center space-y-3">
            <span className="text-[#DFB15B] font-black text-[10px] tracking-[0.3em] uppercase block">PREMIUM ATELIER</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight font-sans">
              Royal Wedding Cake Collections
            </h2>
            <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto">
              Breathtaking multi-tiered architectures custom crafted by our lead event pâtissiers in Delhi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {weddingCollections.map((cake, idx) => (
              <motion.div
                key={cake.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-slate-200/40 rounded-[36px] overflow-hidden shadow-sm hover:shadow-[0_25px_60px_rgba(223,177,91,0.06)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between text-left group"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={cake.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={cake.name} referrerPolicy="no-referrer" />
                  <span className="absolute top-4 left-4 bg-slate-950 text-white font-black text-[8px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                    {cake.tiers}
                  </span>
                </div>

                <div className="p-6.5 space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black text-[#DFB15B] uppercase tracking-widest block">{cake.subtitle}</span>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider">{cake.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">{cake.desc}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">COUTURE DEPOSIT</span>
                      <span className="text-sm font-black text-slate-950">₹{cake.price.toLocaleString()}</span>
                    </div>
                    
                    <button 
                      onClick={() => handleOrderWedding(cake)}
                      className="bg-slate-950 hover:bg-slate-900 text-[#DFB15B] text-[10px] font-black uppercase tracking-widest py-3 px-5 rounded-xl transition-all active:scale-95"
                    >
                      TAILOR & BOOK
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Dynamic Wedding Cakes from Bakery */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/30">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-0 space-y-12">
          <div className="text-center md:text-left">
            <span className="text-[10px] font-black text-[#DFB15B] tracking-[0.3em] uppercase block mb-1">ONLINE PATISSERIE ARCHIVE</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight">
              Gourmet Wedding Cakes & Silhouettes
            </h2>
            <p className="text-xs text-slate-500 font-semibold max-w-sm mt-1">
              Freshly crafted by our master artists, custom tailored to your guest headcount and floral preferences.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-[#DFB15B] animate-spin" />
            </div>
          ) : dbProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8">
              <Sparkles className="w-8 h-8 text-[#DFB15B] mx-auto mb-2 animate-bounce" />
              <p className="text-sm font-black text-slate-700">No wedding database cakes yet.</p>
              <p className="text-xs text-slate-400 mt-1">Schedule a custom tasting to manifest your visual masterpiece!</p>
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

      {/* =========================================================
          WEDDING CONSULTATION & TASTING SCHEDULER
          ========================================================= */}
      <section className="py-24 max-w-[1100px] mx-auto px-4 md:px-8">
        <div className="bg-slate-950 text-white rounded-[48px] overflow-hidden border border-slate-800/80 shadow-2xl relative grid grid-cols-1 lg:grid-cols-12">
          
          {/* Ambient Background Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-amber-500/10 blur-[90px] pointer-events-none" />

          {/* Left Block: Call Out */}
          <div className="lg:col-span-5 p-8 md:p-12 xl:p-16 text-left space-y-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
            <div className="space-y-4">
              <span className="text-[#DFB15B] font-black text-[10px] tracking-[0.3em] uppercase block">ATELIER EXPERIENCE</span>
              <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                Private Designer Consultation
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Design the centerpiece of your wedding alongside our Award-Winning Head Pastry Chef. Includes custom 3D sketch rendering, private color board selections, and an exclusive luxury tasting presentation box.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <Check className="w-4 h-4 text-[#DFB15B]" />
                <span>Complimentary Private Tasting</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <Check className="w-4 h-4 text-[#DFB15B]" />
                <span>Custom 3D Digital Architectural Sketch</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <Check className="w-4 h-4 text-[#DFB15B]" />
                <span>Direct 1-on-1 Designer Cell Line</span>
              </div>
            </div>
          </div>

          {/* Right Block: Interactive Form */}
          <div className="lg:col-span-7 p-8 md:p-12 xl:p-16 text-left">
            {consultationSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-[#DFB15B]/30 flex items-center justify-center text-[#DFB15B] animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black text-white">Private Salon Sequence Initiated</h4>
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                  Our private client concierge will call you on your cell momentarily to organize delivery of your complimentary Wedding Tasting Presentation Box.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConsultationSubmit} className="space-y-5">
                <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase block">SCHEDULE PRIVATE TASTING</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">YOUR FULL NAME</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Lady Aria Dev"
                      value={consultForm.name}
                      onChange={e => setConsultForm({...consultForm, name: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#DFB15B]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PHONE NUMBER</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+91 XXXXX XXXXX"
                      value={consultForm.phone}
                      onChange={e => setConsultForm({...consultForm, phone: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#DFB15B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WEDDING DATE</label>
                    <input 
                      type="date" 
                      required
                      value={consultForm.date}
                      onChange={e => setConsultForm({...consultForm, date: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#DFB15B]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TASTING PRESENTATION REQUIRED?</label>
                    <select
                      value={consultForm.tastingRequired}
                      onChange={e => setConsultForm({...consultForm, tastingRequired: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#DFB15B]"
                    >
                      <option value="yes">Yes - Complimentary tasting box</option>
                      <option value="no">No - Design rendering only</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#DFB15B] hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-[0.2em] py-4.5 rounded-xl transition-all hover:scale-[1.01] active:scale-95 shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 mt-4"
                >
                  <span>SCHEDULE ROYAL WEDDING CALL</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* =========================================================
          AI CAKE RECOMMENDATION WIZARD (L’Atelier AI)
          ========================================================= */}
      <section className="py-12 bg-slate-50/50">
        <AICakeRecommendation category="Wedding" />
      </section>

      {/* =========================================================
          WEDDING GALLERY (Luxury Photography Showcase)
          ========================================================= */}
      <section className="py-24 bg-white">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-0 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-[#DFB15B] font-black text-[10px] tracking-[0.3em] uppercase block">VISUAL LOOKBOOK</span>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight font-sans">
              Royal Wedding Cake Gallery
            </h3>
            <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto">
              Bespoke masterpieces designed, staged, and delivered by CakeUrban at Delhi's premium wedding venues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {weddingGallery.map((gal, idx) => (
              <div 
                key={idx}
                className="rounded-[32px] overflow-hidden relative group aspect-[4/3] shadow-sm border border-slate-100"
              >
                <img src={gal.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={gal.title} referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-left text-white space-y-1">
                  <span className="text-[#DFB15B] font-black text-[8px] uppercase tracking-widest">LUXURY STAGING</span>
                  <h4 className="text-sm font-black uppercase tracking-wider">{gal.title}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">White Glove Event delivery by CakeUrban.</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================
          COMMON TESTIMONIALS & FOOTER BANNER
          ========================================================= */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <LuxuryTestimonials />
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-12 bg-white">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-0">
          <div className="bg-gradient-to-tr from-slate-950 to-slate-900 text-white rounded-[40px] p-8 md:p-16 text-center relative overflow-hidden flex flex-col items-center space-y-6 shadow-xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[100px] pointer-events-none" />
            
            <span className="text-[#DFB15B] font-black text-[10px] tracking-[0.3em] uppercase block">PREMIUM MARIAGE</span>
            <h3 className="text-3xl md:text-5xl font-black tracking-tight max-w-xl leading-tight">
              Book Wedding Consultation
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold max-w-md">
              Secure your wedding date in our calendar. Due to the high craftsmanship required, we only accept up to five grand custom wedding cakes per weekend.
            </p>
            <button 
              onClick={() => setIsConsultationModalOpen(true)}
              className="bg-[#DFB15B] hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-[0.2em] py-4.5 px-10 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/10 flex items-center gap-2"
            >
              <span>INQUIRE ROYAL WEDDING CAKE</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>
      </section>

      <PremiumFooterBanner />

      {/* Mobile Sticky CTA */}
      <StickyCTA onAction={() => setIsConsultationModalOpen(true)} label="BOOK CONSULTATION" category="Wedding" />
      <LuxuryConcierge />

      <QuickOrderModal 
        isOpen={isQuickOrderOpen} 
        onClose={() => setIsQuickOrderOpen(false)} 
        category="Wedding" 
      />

      {/* Consultation Modal Backdrop and Container */}
      {isConsultationModalOpen && (
        <div className="fixed inset-0 z-[115] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={() => setIsConsultationModalOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] border border-slate-100 p-8 w-full max-w-lg shadow-2xl relative z-10 text-left"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[#DFB15B] font-black text-[10px] tracking-[0.25em] uppercase block">PRIVATE RESERVATION</span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Wedding Consultation</h3>
              </div>
              <button onClick={() => setIsConsultationModalOpen(false)} className="p-1.5 rounded-full hover:bg-slate-100">
                <Check className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleConsultationSubmit} className="space-y-4 font-sans text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">BRIDE / GROOM NAME *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Countess Sonia Sen"
                  value={consultForm.name}
                  onChange={e => setConsultForm({...consultForm, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PHONE NUMBER *</label>
                <input 
                  type="tel" 
                  required
                  placeholder="+91 XXXXX XXXXX"
                  value={consultForm.phone}
                  onChange={e => setConsultForm({...consultForm, phone: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">WEDDING DATE *</label>
                  <input 
                    type="date" 
                    required
                    value={consultForm.date}
                    onChange={e => setConsultForm({...consultForm, date: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">TIER PREFERENCE</label>
                  <select
                    value={consultForm.tierPreference}
                    onChange={e => setConsultForm({...consultForm, tierPreference: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none transition-all"
                  >
                    <option value="2-tier">2-Tier Pillars</option>
                    <option value="3-tier">3-Tier Majestic</option>
                    <option value="4-tier">4-Tier Grandeur</option>
                    <option value="5-tier">5-Tier Sovereign</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-slate-950 hover:bg-slate-900 text-[#DFB15B] text-xs font-black uppercase tracking-[0.2em] py-4.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>SUBMIT CONSULTATION REQUEST</span>
                <ArrowRight className="w-4 h-4 text-[#DFB15B]" />
              </button>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
