import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  Heart, 
  Gift, 
  Calendar, 
  Flame, 
  Check, 
  User, 
  Compass, 
  Gem, 
  Volume2, 
  Wine, 
  Plus, 
  Minus,
  MessageCircle,
  Clock,
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

export default function AnniversaryLanding() {
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
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
          // Filter products where occasion includes Anniversary
          const filtered = prods.filter(p => 
            p.occasions?.some(occ => occ.toLowerCase() === 'anniversary') ||
            p.categories?.some(cat => cat.toLowerCase().includes('anniversary'))
          );
          setDbProducts(filtered);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching anniversary products:", err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Love Story Atelier builder state
  const [partner1, setPartner1] = useState('');
  const [partner2, setPartner2] = useState('');
  const [years, setYears] = useState('5');
  const [themeColor, setThemeColor] = useState('Rose Gold & Blush');
  const [storySubmitted, setStorySubmitted] = useState(false);
  const [generatedStoryCake, setGeneratedStoryCake] = useState<any | null>(null);
  const [storyLoading, setStoryLoading] = useState(false);

  // Anniversary Collections
  const anniversaryCollections = [
    {
      id: 'ann-silver',
      name: "Le Jubilé d'Argent",
      subtitle: "25th Silver Jubilee",
      desc: "An architectural masterpiece coated in sterling-silver leaf, hand-carved circular tiers, and white sugar lilies.",
      image: "https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&q=80&w=600",
      milestone: "SILVER JUBILEE (25th)",
      price: 5499
    },
    {
      id: 'ann-gold',
      name: "Le Jubilé d'Or Royale",
      subtitle: "50th Golden Jubilee",
      desc: "Stunning 3-tier gilded design incorporating hand-piped 24K gold borders, premium white orchids, and vanilla bean caviar.",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600",
      milestone: "GOLDEN JUBILEE (50th)",
      price: 8999
    },
    {
      id: 'ann-diamond',
      name: "Symphonie de Diamant",
      subtitle: "60th Diamond Jubilee",
      desc: "Spectacular crystalline sugar structures cascading down white velvet layers, reflecting light like premium solitaire gems.",
      image: "https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&q=80&w=600",
      milestone: "DIAMOND JUBILEE (60th)",
      price: 12499
    },
    {
      id: 'ann-first',
      name: "L'Aube de l'Amour",
      subtitle: "1st Anniversary Bento Set",
      desc: "A romantic bento cake paired with custom matching macarons, hand-painted gold hearts, and luxury raspberry coulis.",
      image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=600",
      milestone: "PROMISE INITIATE (1st)",
      price: 1899
    }
  ];

  // Gift Combos
  const [combos, setCombos] = useState([
    {
      id: 'combo-roses',
      name: "Le Bouquet de Roses",
      desc: "A luxurious bunch of 24 fresh, stem-cut premium Parisian red roses in bespoke matte black wrapping.",
      price: 1899,
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=200",
      added: false
    },
    {
      id: 'combo-truffles',
      name: "Chocolat d'Élite Box",
      desc: "A hand-crafted drawer box of 12 artisan dark chocolate truffles infused with sea-salt caramel and cognac.",
      price: 999,
      image: "https://images.unsplash.com/photo-1504113888839-1c8003680495?auto=format&fit=crop&q=80&w=200",
      added: false
    },
    {
      id: 'combo-glasses',
      name: "Or Gilded Flutes",
      desc: "A pair of lead-free, crystal champagne flutes finished with hand-brushed 24K gold rim styling.",
      price: 2499,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=200",
      added: false
    }
  ]);

  const handleToggleCombo = (id: string) => {
    setCombos(combos.map(c => {
      if (c.id === id) {
        if (!c.added) {
          addCartItem({
            id: c.id,
            name: c.name,
            description: c.desc,
            price: c.price,
            categories: ['Anniversary', 'Combos'],
            occasions: ['Anniversary'],
            flavors: [],
            images: [c.image],
            stockStatus: 'in-stock',
            isCustomizable: false
          });
          toast.success(`${c.name} successfully paired & added to your curation basket! ✨`);
        } else {
          toast.info(`${c.name} removed from your selection.`);
        }
        return { ...c, added: !c.added };
      }
      return c;
    }));
  };

  const generateLoveStoryCake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner1 || !partner2) {
      toast.error("Please enter both partner names to weave your love story.");
      return;
    }
    setStoryLoading(true);
    setGeneratedStoryCake(null);

    // Call server API for AI recommendation specifically for love story
    setTimeout(async () => {
      try {
        const response = await fetch('/api/ai-recommendation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: "Anniversary Love Story",
            guests: "30",
            vibe: `Romantic ${themeColor} with customized script writing of names ${partner1} & ${partner2}`,
            flavorPref: "Red Velvet & Belgian Chocolate Truffle with rich cream cheese",
            budget: "₹8500"
          })
        });
        const data = await response.json();
        setGeneratedStoryCake(data);
      } catch (err) {
        setGeneratedStoryCake({
          name: `L'Épopée de ${partner1} & ${partner2}`,
          flavorCombo: "Velvet Red Sponge layered with luxurious white chocolate cream cheese and freshly crushed strawberries.",
          tiersAndStructure: "A majestic two-tier silhouette finished with seamless hand-draped blush pink fondant folds.",
          artisanDetails: `A delicate edible golden sugar ribbon scroll wrapping around the tiers, elegantly inscribed with the calligraphy of your names and the milestone of ${years} years.`,
          pairing: "Chilled Rosé Champagne or Organic Rose Petal Tea.",
          price: "₹6,499",
          weight: "3.0 kg",
          designInspiration: "Inspired by Dior’s fluid drape silhouettes and Apple's focus on seamless elegant integration of personalization."
        });
      } finally {
        setStoryLoading(false);
        setStorySubmitted(true);
      }
    }, 1500);
  };

  const handleOrderAnniversary = (cake: any) => {
    addCartItem({
      id: cake.id,
      name: cake.name,
      description: cake.desc,
      price: cake.price,
      categories: ['Anniversary', 'Cakes'],
      occasions: ['Anniversary'],
      flavors: ['Red Velvet', 'Belgian Chocolate'],
      images: [cake.image],
      stockStatus: 'in-stock',
      isCustomizable: true
    }, {
      selectedWeight: 2,
      selectedFlavor: 'Red Velvet White Truffle',
      eggless: true
    });
    toast.success(`${cake.name} successfully added to your basket! ✨`);
  };

  return (
    <div className="bg-transparent min-h-screen text-[#FFFDFB] font-sans relative select-none pb-16 md:pb-0">
      
      {/* Soft romantic glowing gradient backgrounds */}
      <div className="absolute top-0 left-0 w-[55%] h-[40%] bg-gradient-to-br from-pink-200/30 via-rose-100/10 to-transparent blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tl from-amber-100/20 via-transparent to-transparent blur-[150px] pointer-events-none" />

      {/* Floating hearts / roses */}
      <div className="absolute top-[15%] left-[8%] text-3xl hidden md:block animate-pulse delay-500">🌸</div>
      <div className="absolute top-[28%] right-[10%] text-3xl hidden md:block animate-bounce delay-300">💛</div>
      <div className="absolute bottom-[40%] left-[5%] text-2xl hidden md:block animate-pulse">🥀</div>
      <div className="absolute bottom-[15%] right-[12%] text-3xl hidden md:block animate-bounce">💖</div>

      {/* =========================================================
          HERO SECTION
          ========================================================= */}
      <section className="relative pt-12 pb-24 md:py-32 max-w-[1320px] mx-auto px-4 md:px-8 xl:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Content */}
          <div className="lg:col-span-6 space-y-8 text-left z-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-3"
            >
              <span className="text-[#DFB15B] font-black text-[10px] tracking-[0.35em] uppercase block">
                MAISON DE ROMANCE
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 font-sans leading-none">
                Celebrate Your <br />
                <span className="bg-gradient-to-r from-rose-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                  Love Story
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold max-w-lg"
            >
              Time spent together is a luxury. Celebrate your milestone anniversaries with romantic rose and gold creations, featuring customizable calligraphic ribbons, fresh Parisian floral sprays, and custom gift combos.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-4 pt-1"
            >
              <button 
                onClick={() => setIsQuickOrderOpen(true)}
                className="bg-slate-950 hover:bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] py-4.5 px-8 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2"
              >
                <span>Surprise Your Partner</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
              
              <button 
                onClick={() => {
                  const timeline = document.getElementById('story-atelier');
                  if (timeline) timeline.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 text-xs font-black uppercase tracking-[0.2em] py-4.5 px-8 rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span>Love Story Atelier</span>
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex items-center gap-8 border-t border-rose-100 pt-8"
            >
              <div className="text-left">
                <span className="text-xl font-black text-slate-900 block">10,000+</span>
                <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase">Love Milestones</span>
              </div>
              <div className="w-px h-10 bg-rose-200/60" />
              <div className="text-left">
                <span className="text-xl font-black text-slate-900 block">Rose-Or</span>
                <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase">Dior Signature Vibe</span>
              </div>
              <div className="w-px h-10 bg-rose-200/60" />
              <div className="text-left">
                <span className="text-xl font-black text-slate-900 block">Same Day</span>
                <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase">Delhi NCR Shipping</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Image (Right) */}
          <div className="lg:col-span-6 relative flex justify-center z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-full max-w-[450px] aspect-square rounded-[40px] overflow-hidden shadow-[0_30px_70px_rgba(223,177,91,0.08)] border-4 border-white"
            >
              <img 
                src="https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&q=80&w=800" 
                className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[2000ms]" 
                alt="Romantic Blush Pink Rose Anniversary Cake" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4.5 shadow-md text-left">
                <span className="text-rose-500 font-black text-[8px] uppercase tracking-widest block">ANNIVERSARY HIGHLIGHT</span>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mt-0.5">Le Jubilé d'Argent</h4>
                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-0.5">Hand-brushed silver leafing layered with rich, fresh Madagascan vanilla.</p>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* =========================================================
          ANNIVERSARY MILESTONES GALLERY
          ========================================================= */}
      <section className="py-24 bg-white border-y border-rose-100/30">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-0 space-y-12">
          
          <div className="text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-black text-[#DFB15B] tracking-[0.3em] uppercase block">COMMEMORATIVE DESIGN</span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Anniversary Milestone Collection
              </h2>
              <p className="text-xs text-slate-400 font-semibold max-w-sm">
                Each masterpiece represents a unique milestone of your life's beautiful, shared journey.
              </p>
            </div>
            <button 
              onClick={() => setIsQuickOrderOpen(true)}
              className="text-rose-500 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 self-center md:self-end border-b border-rose-300 pb-1"
            >
              <span>Explore All Milestones</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {anniversaryCollections.map((cake, idx) => (
              <motion.div
                key={cake.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#FFF9FC] border border-rose-100/50 p-5 rounded-[32px] hover:shadow-[0_20px_50px_rgba(244,63,94,0.04)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between text-left group"
              >
                <div className="space-y-4">
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-inner">
                    <img src={cake.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={cake.name} referrerPolicy="no-referrer" />
                    <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-slate-900 font-black text-[7px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                      {cake.milestone}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest block">{cake.subtitle}</span>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">{cake.name}</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">{cake.desc}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-rose-100/50 pt-4 mt-4">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 block">TAILORED COST</span>
                    <span className="text-sm font-black text-slate-950">₹{cake.price}</span>
                  </div>
                  <button 
                    onClick={() => handleOrderAnniversary(cake)}
                    className="bg-slate-950 hover:bg-slate-900 text-[#DFB15B] text-[9px] font-black uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all active:scale-95"
                  >
                    SELECT
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Dynamic Anniversary Cakes from Bakery */}
      <section className="py-20 bg-white border-b border-rose-100/30">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-0 space-y-12">
          <div className="text-center md:text-left">
            <span className="text-[10px] font-black text-rose-500 tracking-[0.3em] uppercase block mb-1">PREMIUM ROMANTIC ARCHIVE</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight">
              Freshly Baked Anniversary Creations
            </h2>
            <p className="text-xs text-slate-500 font-semibold max-w-sm mt-1">
              Hand-crafted red-velvet and chocolate masterpieces, customizable for eggless and weight options.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
            </div>
          ) : dbProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-rose-100 p-8">
              <Sparkles className="w-8 h-8 text-rose-400 mx-auto mb-2 animate-bounce" />
              <p className="text-sm font-black text-slate-700">No anniversary database cakes yet.</p>
              <p className="text-xs text-slate-400 mt-1">Enter your names below to design a custom Story Cake!</p>
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
          LOVE STORY ATELIER - INTERACTIVE CREATIVE SECTION
          ========================================================= */}
      <section id="story-atelier" className="py-24 max-w-[1320px] mx-auto px-4 md:px-8 xl:px-0">
        <div className="bg-white rounded-[44px] border border-rose-100 p-8 md:p-14 shadow-md text-left relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Interactive Builder Form */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="bg-rose-50 border border-rose-100 text-rose-500 font-black text-[9px] uppercase tracking-[0.25em] px-3.5 py-1.5 rounded-full inline-block">
                  LOVE STORY ATELIER
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  Design Your Story Cake
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Every shared year has its own flavor and colors. Weave your names, years together, and favorite palette to generate an ultra-personalized, calligraphy-wrapped masterwork.
                </p>
              </div>

              <form onSubmit={generateLoveStoryCake} className="space-y-4 font-sans text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PARTNER ONE NAME</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Kabir"
                      value={partner1}
                      onChange={e => setPartner1(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-rose-400 focus:bg-white rounded-xl px-4 py-3 text-xs focus:outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PARTNER TWO NAME</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Aria"
                      value={partner2}
                      onChange={e => setPartner2(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-rose-400 focus:bg-white rounded-xl px-4 py-3 text-xs focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">YEARS TOGETHER</label>
                    <select
                      value={years}
                      onChange={e => setYears(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-rose-400 focus:bg-white rounded-xl px-4 py-3 text-xs focus:outline-none transition-all"
                    >
                      <option value="1">1st Sweet Promise</option>
                      <option value="5">5 Years of Glow</option>
                      <option value="10">10 Year Rose-Or</option>
                      <option value="25">25 Year Silver Jubilé</option>
                      <option value="50">50 Year Sovereign Gold</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AESTHETIC COLOR PALETTE</label>
                    <select
                      value={themeColor}
                      onChange={e => setThemeColor(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-rose-400 focus:bg-white rounded-xl px-4 py-3 text-xs focus:outline-none transition-all"
                    >
                      <option value="Rose Gold & Blush">Rose Gold & Blush Pink</option>
                      <option value="Sterling Silver & Ivory">Sterling Silver & Ivory</option>
                      <option value="Royal Burgundy & Gold">Royal Burgundy & 24K Gold</option>
                      <option value="Lavender Mist & Pearl">Lavender Mist & Sugar Pearl</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={storyLoading}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:brightness-105 text-white font-black text-xs uppercase tracking-[0.2em] py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 shadow-md shadow-rose-500/10"
                >
                  {storyLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>WEAVING YOUR STORY...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>VISUALIZE STORY CAKE</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Interactive Render Display */}
            <div className="lg:col-span-7 h-full min-h-[400px] flex flex-col items-center justify-center relative bg-slate-50 border border-slate-200/50 rounded-[32px] p-6 md:p-8 overflow-hidden text-left">
              <AnimatePresence mode="wait">
                {storyLoading ? (
                  <motion.div 
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-4"
                  >
                    <div className="relative w-16 h-16 mx-auto">
                      <div className="absolute inset-0 rounded-full border-2 border-rose-500/20 animate-ping" />
                      <div className="absolute inset-4 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
                        <Heart className="w-5 h-5 animate-bounce fill-white text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-700 tracking-[0.2em]">CRAFTING BESPOKE TIMELINE</h4>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Orchestrating script lines & Rose gold ribboning...</p>
                    </div>
                  </motion.div>
                ) : generatedStoryCake ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 w-full"
                  >
                    <div className="border-b border-rose-100 pb-3 flex justify-between items-end">
                      <div>
                        <span className="text-[8px] font-black text-rose-500 tracking-[0.2em] uppercase block">WEAVED SPECIALLY FOR YOU</span>
                        <h4 className="text-xl font-black text-slate-900 uppercase tracking-wider mt-1">{generatedStoryCake.name}</h4>
                      </div>
                      <span className="bg-rose-100 text-rose-700 font-black text-[9px] tracking-wider px-3 py-1 rounded-full">{years} YEARS</span>
                    </div>

                    <div className="space-y-3 font-sans text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Wine className="w-3.5 h-3.5 text-rose-500" /> FLAVOR COMPOSITION
                        </span>
                        <p className="text-slate-600 font-medium leading-relaxed">{generatedStoryCake.flavorCombo}</p>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Compass className="w-3.5 h-3.5 text-rose-500" /> SILHOUETTE & TIERS
                        </span>
                        <p className="text-slate-600 font-medium leading-relaxed">{generatedStoryCake.tiersAndStructure}</p>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Gem className="w-3.5 h-3.5 text-rose-500" /> STORYBOOK CALLIGRAPHY SCROLL
                        </span>
                        <p className="text-slate-600 font-medium leading-relaxed">{generatedStoryCake.artisanDetails}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-rose-100">
                        <div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">ESTIMATED PRICE</span>
                          <span className="text-sm font-black text-rose-600">{generatedStoryCake.price || "₹6,499"}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">PROPORTIONAL SCALE</span>
                          <span className="text-sm font-black text-slate-700">{generatedStoryCake.weight || "3.0 kg"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={() => {
                          addCartItem({
                            id: `story-cake-${partner1}-${partner2}`,
                            name: generatedStoryCake.name,
                            description: generatedStoryCake.flavorCombo,
                            price: 6499,
                            categories: ['Anniversary', 'Bespoke'],
                            occasions: ['Anniversary'],
                            flavors: ['Red Velvet'],
                            images: ["https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&q=80&w=600"],
                            stockStatus: 'in-stock',
                            isCustomizable: true
                          }, {
                            selectedWeight: 3.0,
                            selectedFlavor: 'Red Velvet',
                            cakeMessage: `${partner1} & ${partner2} - ${years} Years`,
                            eggless: true
                          });
                          toast.success(`Love story cake initialized and added to your basket! ✨`);
                        }}
                        className="flex-1 bg-slate-950 hover:bg-slate-900 text-white font-black text-[10px] uppercase tracking-wider py-3.5 rounded-xl transition-all"
                      >
                        BOOK BESPOKE STORY CAKE
                      </button>
                      
                      <button 
                        onClick={() => {
                          const text = encodeURIComponent(`Hi, I am interested in ordering the custom Love Story cake generated in the atelier for ${partner1} & ${partner2}. Details: ${generatedStoryCake.flavorCombo}`);
                          window.open(`https://wa.me/917318531953?text=${text}`, '_blank');
                        }}
                        className="px-4.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-xl transition-colors flex items-center justify-center"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-500 fill-emerald-500/10" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    className="text-center space-y-4 max-w-sm mx-auto"
                  >
                    <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-400">
                      <Heart className="w-8 h-8 text-rose-500 animate-pulse fill-rose-500/10" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Awaiting Story Thread</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                        Input your names, milestones, and shared colors to have our master pâtissier render your customized story cake.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          SURPRISE GIFT COMBOS
          ========================================================= */}
      <section className="py-20 bg-slate-50 border-t border-rose-100/40">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-0 space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black text-[#DFB15B] tracking-[0.3em] uppercase block">PREMIUM GESTURE</span>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight font-sans">
              Curated Surprise Gift Combos
            </h3>
            <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto">
              Elevate your romantic surprise. Pair your anniversary cake selection with Parisian roses, fine chocolates, or gilded crystal flutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {combos.map((cb) => (
              <div 
                key={cb.id}
                className="bg-white border border-rose-100/40 p-6 rounded-[32px] text-left space-y-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-inner">
                    <img src={cb.image} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" alt={cb.name} referrerPolicy="no-referrer" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">{cb.name}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">{cb.desc}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 block">COMBO PRICE</span>
                    <span className="text-sm font-black text-slate-950">₹{cb.price}</span>
                  </div>

                  <button 
                    onClick={() => handleToggleCombo(cb.id)}
                    className={`text-[9px] font-black uppercase tracking-wider py-2.5 px-5 rounded-xl transition-all ${
                      cb.added 
                        ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                        : 'bg-slate-950 hover:bg-slate-900 text-[#DFB15B]'
                    }`}
                  >
                    {cb.added ? 'PAIRED & ADDED' : 'ADD COMBO PAIR'}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================
          COMMON TESTIMONIALS & FOOTER BANNER
          ========================================================= */}
      <section className="py-20 bg-white">
        <LuxuryTestimonials />
      </section>

      {/* Pre-Footer Action Block */}
      <section className="py-12 bg-slate-50 border-t border-rose-100/30">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-0">
          <div className="bg-gradient-to-tr from-slate-950 to-slate-900 text-white rounded-[40px] p-8 md:p-12 text-center relative overflow-hidden flex flex-col items-center space-y-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[80px] pointer-events-none" />
            
            <span className="text-[#DFB15B] font-black text-[10px] tracking-[0.3em] uppercase block">ATELIER DU COEUR</span>
            <h3 className="text-3xl md:text-5xl font-black tracking-tight max-w-xl leading-tight">
              Surprise Your Partner
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold max-w-sm">
              Schedule a romantic midnight delivery or a surprise setup. Every event is managed by our dedicated white-glove climate-controlled delivery cars.
            </p>
            <button 
              onClick={() => setIsQuickOrderOpen(true)}
              className="bg-white hover:bg-slate-100 text-slate-950 font-black text-xs uppercase tracking-[0.2em] py-4.5 px-10 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
            >
              <span>INQUIRE MIDNIGHT COUTURE</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>
      </section>

      <PremiumFooterBanner />

      {/* Mobile Sticky CTA */}
      <StickyCTA onAction={() => setIsQuickOrderOpen(true)} label="SURPRISE NOW" category="Anniversary" />
      <LuxuryConcierge />

      <QuickOrderModal 
        isOpen={isQuickOrderOpen} 
        onClose={() => setIsQuickOrderOpen(false)} 
        category="Anniversary" 
      />

    </div>
  );
}
