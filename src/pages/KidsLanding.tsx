import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  Gift, 
  Smile, 
  Award, 
  Check, 
  Compass, 
  Heart, 
  Plus, 
  MessageCircle,
  Clock,
  Star,
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

export default function KidsLanding() {
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
          // Filter products where occasion includes Kids Special or Kids
          const filtered = prods.filter(p => 
            p.occasions?.some(occ => occ.toLowerCase() === 'kids special' || occ.toLowerCase() === 'kids') ||
            p.categories?.some(cat => cat.toLowerCase().includes('kids'))
          );
          setDbProducts(filtered);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching kids products:", err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Character selection states
  const [selectedCharacter, setSelectedCharacter] = useState('Unicorn');
  const [selectedColor, setSelectedColor] = useState('Pastel Pink');

  const characters = [
    { name: 'Unicorn', emoji: '🦄', title: 'Le Céleste Licorne', desc: 'A pastel magical unicorn featuring a gilded sugar horn, hand-sculpted buttercream mane, and marshmallow clouds.' },
    { name: 'Astronaut', emoji: '🧑‍🚀', title: 'Le Cosmos Étoilé', desc: 'A spectacular space landscape with custom hand-carved chocolate planets, edible stars, and a customized fondant astronaut.' },
    { name: 'Safari Lion', emoji: '🦁', title: 'Le Petit Safari', desc: 'A cute jungle landscape with baby lions, giraffes, and monkeys hand-molded from sweet almond marzipan.' },
    { name: 'Mermaid', emoji: '🧜‍♀️', title: 'La Reine Sirène', desc: 'An underwater castle of blue pastels, pink sugar coral, hand-brushed golden shells, and sparkling pearls.' }
  ];

  const colors = [
    { name: 'Pastel Pink', class: 'bg-rose-200 border-rose-400' },
    { name: 'Cloud Blue', class: 'bg-sky-200 border-sky-400' },
    { name: 'Mint Green', class: 'bg-emerald-100 border-emerald-300' },
    { name: 'Sunshine Yellow', class: 'bg-yellow-100 border-yellow-300' }
  ];

  // Kids Collections
  const kidsCollections = [
    {
      id: 'kids-disney',
      name: "Le Palais Disney",
      subtitle: "Magical Palace Theme",
      desc: "Delightful castles with edible spires, personalized sugar shields, and your favorite Disney characters hand-piped.",
      image: "https://images.unsplash.com/photo-1519340330287-268e351906a5?auto=format&fit=crop&q=80&w=600",
      theme: "DISNEY FANTASY",
      price: 4499
    },
    {
      id: 'kids-superhero',
      name: "Sovereign Avengers",
      subtitle: "Superhero Action Theme",
      desc: "Bespoke multi-tiered designs featuring action chocolate shields, edible skyscrapers, and golden light elements.",
      image: "https://images.unsplash.com/photo-1558961309-dbdf079115fd?auto=format&fit=crop&q=80&w=600",
      theme: "SUPERHERO ACTION",
      price: 3899
    },
    {
      id: 'kids-princess',
      name: "La Cour de Princesse",
      subtitle: "Princess Royal Tiara",
      desc: "An elegant, tiered blush pink cake topped with a hand-sculpted crystalline sugar tiara and delicate edible pearls.",
      image: "https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&q=80&w=600",
      theme: "ROYAL PRINCESS",
      price: 4999
    },
    {
      id: 'kids-safari',
      name: "Le Roi Lion Safari",
      subtitle: "Baby Safari Adventure",
      desc: "Sweet hand-painted edible forest foliage with miniature jungle animals handcrafted in organic almond marzipan.",
      image: "https://images.unsplash.com/photo-1511018556340-d16986a1c194?auto=format&fit=crop&q=80&w=600",
      theme: "ANIMAL SAFARI",
      price: 4299
    }
  ];

  // Kids Party Packages
  const partyPackages = [
    {
      id: 'pkg-royal',
      name: "The Sovereign Kid's Gala",
      badge: "ULTIMATE CHAMPION",
      desc: "Includes a grand 3kg customized double-tiered cake, 12 customized themed cupcakes, 12 vanilla fondant cookies, and 12 personalized royal birthday tags.",
      price: 9999,
      serves: "Serves 25-35 kids"
    },
    {
      id: 'pkg-midi',
      name: "La Petite Dream Box",
      badge: "MOST POPULAR",
      desc: "Includes a 1.5kg customized themed cake, 6 custom character cupcakes, and 6 customized sugar cookies with personalized gold lettering.",
      price: 5499,
      serves: "Serves 10-15 kids"
    }
  ];

  const handleOrderKids = (cake: any) => {
    addCartItem({
      id: cake.id,
      name: cake.name,
      description: cake.desc,
      price: cake.price,
      categories: ['Kids', 'Cakes'],
      occasions: ['Kids'],
      flavors: ['Classic Chocolate', 'Vanilla Rainbow Sprinkle'],
      images: [cake.image],
      stockStatus: 'in-stock',
      isCustomizable: true
    }, {
      selectedWeight: 1.5,
      selectedFlavor: 'Belgian Chocolate Cream',
      eggless: true
    });
    toast.success(`${cake.name} successfully tailored & added to your curation basket! ✨`);
  };

  const handleOrderPackage = (pkg: any) => {
    addCartItem({
      id: pkg.id,
      name: pkg.name,
      description: pkg.desc,
      price: pkg.price,
      categories: ['Kids', 'Packages'],
      occasions: ['Kids'],
      flavors: ['Mixed Chocolate & Berry'],
      images: ["https://images.unsplash.com/photo-1558961309-dbdf079115fd?auto=format&fit=crop&q=80&w=600"],
      stockStatus: 'in-stock',
      isCustomizable: true
    }, {
      selectedWeight: 4,
      selectedFlavor: 'Sprinkle Confetti Cake',
      eggless: true
    });
    toast.success(`${pkg.name} party package orchestrated for your child! ✨`);
  };

  // Get current active character details
  const activeChar = characters.find(c => c.name === selectedCharacter) || characters[0];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans relative select-none pb-16 md:pb-0">
      
      {/* Background Playful Glowing Lights */}
      <div className="absolute top-0 left-[-5%] w-[55%] h-[40%] bg-gradient-to-tr from-rose-200/25 via-sky-100/10 to-transparent blur-[160px] pointer-events-none" />
      <div className="absolute top-[25%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-bl from-yellow-200/15 via-emerald-100/10 to-transparent blur-[150px] pointer-events-none" />

      {/* Floating stars & clouds */}
      <div className="absolute top-[18%] left-[7%] text-2xl hidden md:block animate-bounce">🎈</div>
      <div className="absolute top-[32%] right-[12%] text-3xl hidden md:block animate-pulse text-yellow-400">⭐</div>
      <div className="absolute bottom-[35%] left-[4%] text-3xl hidden md:block animate-bounce text-pink-400">✨</div>
      <div className="absolute bottom-[20%] right-[8%] text-2xl hidden md:block animate-pulse">☁️</div>

      {/* =========================================================
          HERO SECTION (Disney Style Playful Luxury)
          ========================================================= */}
      <section className="relative pt-12 pb-24 md:py-32 max-w-[1320px] mx-auto px-4 md:px-8 xl:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Content (Left) */}
          <div className="lg:col-span-6 space-y-8 text-left z-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-3"
            >
              <span className="text-[#DFB15B] font-black text-[10px] tracking-[0.35em] uppercase block">
                MAISON DES ENFANTS
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 font-sans leading-none">
                Delightful Magical <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-sky-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
                  Kids Masterpieces
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold max-w-lg"
            >
              Orchestrate the ultimate fantasy birthday party for your children. From magical unicorns and cute safaris to galaxy cosmos landscapes, our lead character chefs sculpt your kid's dreams using organic French pastry techniques.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <button 
                onClick={() => setIsQuickOrderOpen(true)}
                className="bg-slate-950 hover:bg-slate-900 text-[#DFB15B] text-xs font-black uppercase tracking-[0.2em] py-4.5 px-8 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2"
              >
                <span>Reserve Party Package</span>
                <ArrowRight className="w-4 h-4 text-[#DFB15B]" />
              </button>
              
              <button 
                onClick={() => {
                  const picker = document.getElementById('package-studio');
                  if (picker) picker.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 text-xs font-black uppercase tracking-[0.2em] py-4.5 px-8 rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span>Design Custom Character</span>
                <Smile className="w-4 h-4 text-sky-500" />
              </button>
            </motion.div>

            {/* Same day shipping block */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-6 pt-6 border-t border-slate-200/60"
            >
              <div className="text-left">
                <span className="text-xl font-black text-slate-900 block">100%</span>
                <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase">Organic Colors</span>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="text-left">
                <span className="text-xl font-black text-slate-900 block">Eggless</span>
                <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase">Always Available</span>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="text-left">
                <span className="text-xl font-black text-slate-900 block">Midnight</span>
                <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase">Climate Hand-Ship</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Image (Right) */}
          <div className="lg:col-span-6 relative flex justify-center z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-full max-w-[440px] aspect-square rounded-[40px] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.06)] border-4 border-white"
            >
              <img 
                src="https://images.unsplash.com/photo-1519340330287-268e351906a5?auto=format&fit=crop&q=80&w=800" 
                className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[2000ms]" 
                alt="Magical Unicorn Pastel Kids Cake" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4.5 shadow-md text-left border border-white">
                <span className="text-sky-500 font-black text-[8px] uppercase tracking-widest block">CHILDREN'S ROYAL SELECTION</span>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mt-0.5">Le Palais Céleste</h4>
                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-0.5">Custom sculpted organic sugar unicorn resting on fluffy vanilla marshmallow clouds.</p>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* =========================================================
          KIDS COLLECTIONS GALLERY
          ========================================================= */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-0 space-y-16">
          
          <div className="text-center space-y-3">
            <span className="text-[#DFB15B] font-black text-[10px] tracking-[0.3em] uppercase block">PREMIUM DESIGN ATELIER</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight font-sans">
              Elite Children's Collections
            </h2>
            <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto">
              Choose from six high-end thematic worlds, custom sculpted with sweet almond marzipan and organic chocolate curls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kidsCollections.map((cake, idx) => (
              <motion.div
                key={cake.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-50 border border-slate-200/30 rounded-[32px] p-5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between text-left group"
              >
                <div className="space-y-4">
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-sm relative">
                    <img src={cake.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={cake.name} referrerPolicy="no-referrer" />
                    <span className="absolute bottom-3 left-3 bg-slate-950 text-white font-black text-[7px] uppercase tracking-widest px-2.5 py-1 rounded-full">
                      {cake.theme}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{cake.subtitle}</span>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">{cake.name}</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">{cake.desc}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/60 pt-4 mt-4">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 block">COUTURE PRICE</span>
                    <span className="text-sm font-black text-slate-950">₹{cake.price}</span>
                  </div>

                  <button 
                    onClick={() => handleOrderKids(cake)}
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

      {/* Dynamic Kids Cakes from Bakery */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/30">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-0 space-y-12">
          <div className="text-center md:text-left">
            <span className="text-[10px] font-black text-sky-500 tracking-[0.3em] uppercase block mb-1">ONLINE KIDS BAKERY</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight">
              Freshly Baked Kids Masterpieces
            </h2>
            <p className="text-xs text-slate-500 font-semibold max-w-sm mt-1">
              Fairy-tale unicorn, astronaut, and jungle safari theme cakes direct from our ovens, 100% organic colors.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
            </div>
          ) : dbProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8">
              <Sparkles className="w-8 h-8 text-sky-400 mx-auto mb-2 animate-bounce" />
              <p className="text-sm font-black text-slate-700">No kids database cakes yet.</p>
              <p className="text-xs text-slate-400 mt-1">Try our custom package studio below to design one!</p>
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
          CHARACTER & COLOR PICKER (THE DREAM PACKAGE STUDIO)
          ========================================================= */}
      <section id="package-studio" className="py-24 max-w-[1320px] mx-auto px-4 md:px-8 xl:px-0">
        <div className="bg-white rounded-[44px] border border-slate-200/50 p-8 md:p-14 shadow-sm text-left relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Picker Panel */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-2">
                <span className="bg-sky-50 border border-sky-100 text-sky-500 font-black text-[9px] uppercase tracking-[0.25em] px-3.5 py-1.5 rounded-full inline-block">
                  DREAM PACKAGE STUDIO
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  Design Your Character Package
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Personalize your child’s dream birthday cake. Choose their favorite theme character and color palette to render a tailored birthday cake, custom cupcakes, and sweet return gift boxes.
                </p>
              </div>

              {/* Character selection */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">1. SELECT THEME CHARACTER</label>
                <div className="grid grid-cols-2 gap-3 font-sans text-xs">
                  {characters.map((ch) => (
                    <button 
                      key={ch.name}
                      onClick={() => {
                        setSelectedCharacter(ch.name);
                        toast.info(`Character theme switched to ${ch.name}! 🦄`);
                      }}
                      className={`flex items-center gap-2.5 p-3.5 rounded-xl border text-left font-black transition-all ${
                        selectedCharacter === ch.name 
                          ? 'border-slate-900 bg-slate-950 text-white shadow-md' 
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-lg">{ch.emoji}</span>
                      <span>{ch.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color selection */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">2. CHOOSE PRIMARY PASTEL TONE</label>
                <div className="flex gap-4">
                  {colors.map((col) => (
                    <button 
                      key={col.name}
                      onClick={() => {
                        setSelectedColor(col.name);
                        toast.info(`Pastel palette configured to ${col.name}! 🎨`);
                      }}
                      className={`w-10 h-10 rounded-full border-2 transition-all relative ${col.class} ${
                        selectedColor === col.name ? 'scale-110 shadow-md ring-2 ring-slate-900/10' : 'hover:scale-105'
                      }`}
                      title={col.name}
                    >
                      {selectedColor === col.name && (
                        <span className="absolute inset-0 flex items-center justify-center text-xs text-slate-700">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Display Panel */}
            <div className="lg:col-span-7 h-full min-h-[400px] flex flex-col justify-between relative bg-slate-50 border border-slate-200/50 rounded-[36px] p-8 overflow-hidden text-left">
              
              <div className="space-y-5">
                <div className="border-b border-slate-200 pb-4 flex justify-between items-end">
                  <div>
                    <span className="text-[8px] font-black text-sky-500 tracking-[0.2em] uppercase block">TAILORED CHARACTER PACKAGE</span>
                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-wider mt-1">{activeChar.title}</h4>
                  </div>
                  <span className="bg-sky-100 text-sky-700 font-black text-[9px] tracking-wider px-3 py-1 rounded-full uppercase">{selectedColor}</span>
                </div>

                <div className="space-y-4 font-sans text-xs">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">BESPOKE CHARACTER STORY</span>
                    <p className="text-slate-600 font-medium leading-relaxed">{activeChar.desc}</p>
                  </div>

                  <div className="bg-white border border-slate-200/50 rounded-2xl p-4.5 space-y-2">
                    <span className="text-[#DFB15B] font-black text-[9px] tracking-wider uppercase block">COMPLETE KIDS PARTY INCLUSIONS</span>
                    <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-500 font-semibold">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>1.5kg Customized Theme Cake</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>6 Custom Themed Cupcakes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>6 Hand-Molded Sugar Cookies</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>12 Custom Return Gift Tags</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-1 border-t border-slate-200">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">COMPLETE PACKAGE COST</span>
                      <span className="text-base font-black text-slate-950">₹5,499</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">EGGLESS OPTION</span>
                      <span className="text-base font-black text-emerald-600">INCLUDED FREE</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-200/60 mt-4">
                <button 
                  onClick={() => {
                    addCartItem({
                      id: `custom-pkg-${selectedCharacter}-${selectedColor}`,
                      name: `Party: ${activeChar.title}`,
                      description: `${activeChar.desc} Color style: ${selectedColor}`,
                      price: 5499,
                      categories: ['Kids', 'Packages'],
                      occasions: ['Kids'],
                      flavors: ['Vanilla Sprinkle', 'Strawberry Cream'],
                      images: ["https://images.unsplash.com/photo-1519340330287-268e351906a5?auto=format&fit=crop&q=80&w=600"],
                      stockStatus: 'in-stock',
                      isCustomizable: true
                    }, {
                      selectedWeight: 3.5,
                      selectedFlavor: 'Confetti Rainbow',
                      cakeMessage: `Happy Birthday!`,
                      eggless: true
                    });
                    toast.success(`${activeChar.title} Dream Package added to your curation basket! ✨`);
                  }}
                  className="flex-1 bg-slate-950 hover:bg-slate-900 text-white font-black text-[10px] uppercase tracking-wider py-4.5 rounded-xl transition-all shadow-md"
                >
                  BOOK THIS CHARACTER PACKAGE
                </button>

                <button 
                  onClick={() => {
                    const text = encodeURIComponent(`Hi, I am interested in ordering the custom Kid's character package: "${activeChar.title}". Character: ${selectedCharacter}, Color Theme: ${selectedColor}`);
                    window.open(`https://wa.me/919999999999?text=${text}`, '_blank');
                  }}
                  className="px-5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-colors flex items-center justify-center"
                >
                  <MessageCircle className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          KIDS PARTY COMPLETE PACKAGES LIST
          ========================================================= */}
      <section className="py-20 bg-slate-100/50 border-t border-slate-200/60">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-0 space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black text-[#DFB15B] tracking-[0.3em] uppercase block">SAVVY PLANNING</span>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight font-sans">
              Complete Birthday Party Packages
            </h3>
            <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto">
              Everything you need for a stunning child’s celebration, boxed and shipped directly to your venue in Delhi NCR.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1000px] mx-auto">
            {partyPackages.map((pkg) => (
              <div 
                key={pkg.id}
                className="bg-white border border-slate-200/50 p-8 rounded-[36px] text-left space-y-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="bg-pink-100 text-pink-700 font-black text-[8px] tracking-widest px-3 py-1 rounded-full uppercase block">
                      {pkg.badge}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{pkg.serves}</span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-wider">{pkg.name}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">{pkg.desc}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-4">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 block">COMPLETE VALUE</span>
                    <span className="text-base font-black text-slate-950">₹{pkg.price}</span>
                  </div>

                  <button 
                    onClick={() => handleOrderPackage(pkg)}
                    className="bg-slate-950 hover:bg-slate-900 text-[#DFB15B] text-[10px] font-black uppercase tracking-widest py-3 px-6 rounded-xl transition-all active:scale-95"
                  >
                    SELECT PACKAGE
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================
          AI CAKE RECOMMENDATION WIZARD (L’Atelier AI)
          ========================================================= */}
      <section className="py-12 bg-slate-50/50">
        <AICakeRecommendation category="Kids Party" />
      </section>

      {/* =========================================================
          COMMON TESTIMONIALS & FOOTER BANNER
          ========================================================= */}
      <section className="py-20 bg-white border-t border-slate-100">
        <LuxuryTestimonials />
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-12 bg-slate-50/50">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 xl:px-0">
          <div className="bg-gradient-to-tr from-slate-950 to-slate-900 text-white rounded-[40px] p-8 md:p-12 text-center relative overflow-hidden flex flex-col items-center space-y-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 blur-[80px] pointer-events-none" />
            
            <span className="text-[#DFB15B] font-black text-[10px] tracking-[0.3em] uppercase block">PRE-ORDER INVITATION</span>
            <h3 className="text-3xl md:text-5xl font-black tracking-tight max-w-xl leading-tight">
              Reserve Party Package Today
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold max-w-sm">
              Custom character molding requires up to 24 hours of cooling. Guarantee your kid's big surprise by scheduling your white-glove shipment box today.
            </p>
            <button 
              onClick={() => setIsQuickOrderOpen(true)}
              className="bg-white hover:bg-slate-100 text-slate-950 font-black text-xs uppercase tracking-[0.2em] py-4.5 px-10 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
            >
              <span>INQUIRE PARTY COUTURE</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>
      </section>

      <PremiumFooterBanner />

      {/* Mobile Sticky CTA */}
      <StickyCTA onAction={() => setIsQuickOrderOpen(true)} label="RESERVE NOW" category="Kids Party" />
      <LuxuryConcierge />

      <QuickOrderModal 
        isOpen={isQuickOrderOpen} 
        onClose={() => setIsQuickOrderOpen(false)} 
        category="Kids" 
      />

    </div>
  );
}
