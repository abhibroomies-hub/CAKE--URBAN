import React, { useState, useEffect, useMemo, useRef } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Product, CartItem } from '../types';
import { useCart } from '../lib/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { SkeletonGrid, EmptyState } from '../components/FeedbackStates';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Sparkle,
  Heart, 
  ShoppingCart, 
  Plus, 
  X, 
  Check, 
  RotateCcw, 
  MessageSquare, 
  Eye, 
  Star, 
  Info, 
  Clock, 
  ChevronRight,
  Zap,
  Tag,
  Share2,
  Maximize2,
  ChevronLeft,
  Calendar,
  DollarSign,
  Users,
  Palette,
  Gift,
  AlertCircle,
  SlidersHorizontal
} from 'lucide-react';
import SEO from '../components/SEO';
import { toast } from 'sonner';
import { playSuccessChime, playSlidePop, playBtnTap } from '../lib/sound';

// Modular imports
import { PREMIUM_PRODUCTS_POOL, getProductSpecs } from '../lib/shopData';
import AiSearchBar from '../components/AiSearchBar';
import SmartFilterSidebar from '../components/SmartFilterSidebar';
import ProductComparison from '../components/ProductComparison';
import QuickViewModal from '../components/QuickViewModal';
import RecentlyViewedDrawer from '../components/RecentlyViewedDrawer';

export default function Shop() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem } = useCart();

  // 1. DATA HOOK STATE
  const [allProducts, setAllProducts] = useState<Product[]>(PREMIUM_PRODUCTS_POOL);
  const [loading, setLoading] = useState(true);

  // 2. SEARCH & FILTER PARAMS
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [selectedWeights, setSelectedWeights] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([200, 5000]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedPrepTimes, setSelectedPrepTimes] = useState<string[]>([]);
  const [selectedDeliveryTimes, setSelectedDeliveryTimes] = useState<string[]>([]);
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [selectedPremiumTiers, setSelectedPremiumTiers] = useState<string[]>([]);
  const [isPremiumOnly, setIsPremiumOnly] = useState(false);

  // Parse query parameters from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    const category = params.get('category');
    const occasion = params.get('occasion');
    const tab = params.get('tab');

    if (search) {
      setSearchQuery(decodeURIComponent(search));
    } else {
      setSearchQuery("");
    }

    if (category) {
      const cleanCat = decodeURIComponent(category).toLowerCase();
      if (cleanCat === 'combos' || cleanCat === 'hampers' || cleanCat === 'gift-hampers') {
        setSelectedCategories(['Gift Hampers']);
      } else if (cleanCat === 'photo' || cleanCat === 'photo-cakes') {
        setSelectedCategories(['Photo Cakes']);
      } else if (cleanCat === 'designer' || cleanCat === 'designer-cakes') {
        setSelectedCategories(['Designer Collection']);
      } else {
        const formatted = cleanCat.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        setSelectedCategories([formatted]);
      }
    } else {
      setSelectedCategories([]);
    }

    if (occasion) {
      const formattedOcc = decodeURIComponent(occasion).split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      setSelectedOccasions([formattedOcc]);
    } else {
      setSelectedOccasions([]);
    }

    if (tab === 'occasions') {
      setIsFilterDrawerOpen(true);
    }
  }, [location.search]);

  // Responsive Drawer/Modal states
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isRecentDrawerOpen, setIsRecentDrawerOpen] = useState(false);

  // 3. SPECIAL RECS ENGINE FLOW
  const [aiOccasion, setAiOccasion] = useState("Birthday");
  const [aiBudget, setAiBudget] = useState(2500);
  const [aiFlavor, setAiFlavor] = useState("Chocolate");
  const [aiPeopleCount, setAiPeopleCount] = useState("8");
  const [aiTheme, setAiTheme] = useState("Minimal");
  const [aiDeliverySlot, setAiDeliverySlot] = useState("Today");

  const [aiIsBaking, setAiIsBaking] = useState(false);
  const [aiProgressText, setAiProgressText] = useState("");
  const [aiHasGenerated, setAiHasGenerated] = useState(false);

  // 4. STORAGE COLLECTIONS
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);

  // 5. CHAT ASSISTANT BUBBLE
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantInput, setAssistantInput] = useState("");
  const [assistantMessages, setAssistantMessages] = useState<Array<{ sender: 'chef' | 'user'; text: string }>>([
    { sender: 'chef', text: 'Bonjour, gourmand! I am Chef Urban AI. Let me craft your custom recipe, suggest the perfect premium wedding layer, or explain our organic eggless process in Faridabad. How can I delight you?' }
  ]);

  // Carousel refs for Netflix rows
  const recommendedRowRef = useRef<HTMLDivElement>(null);
  const chocolateRowRef = useRef<HTMLDivElement>(null);
  const budgetRowRef = useRef<HTMLDivElement>(null);
  const trendingRowRef = useRef<HTMLDivElement>(null);
  const premiumRowRef = useRef<HTMLDivElement>(null);

  // ---------------------------------------------------------
  // FIRESTORE SYNC & FALLBACK
  // ---------------------------------------------------------
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
          setAllProducts(prods);
        } else {
          setAllProducts(PREMIUM_PRODUCTS_POOL);
        }
        setLoading(false);
      },
      (error) => {
        console.warn("Firestore subscription error. Using local backup: ", error);
        setAllProducts(PREMIUM_PRODUCTS_POOL);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // HYDRATE COLLECTIONS FROM STORAGE
  useEffect(() => {
    const savedWish = localStorage.getItem('cakeurban_wishlist');
    if (savedWish) {
      try { setWishlist(JSON.parse(savedWish)); } catch (e) {}
    } else {
      const defaultWish = [PREMIUM_PRODUCTS_POOL[0], PREMIUM_PRODUCTS_POOL[2]];
      setWishlist(defaultWish);
      localStorage.setItem('cakeurban_wishlist', JSON.stringify(defaultWish));
    }

    const savedRecent = localStorage.getItem('cakeurban_recently_viewed');
    if (savedRecent) {
      try { setRecentlyViewed(JSON.parse(savedRecent)); } catch (e) {}
    } else {
      const defaultRecent = [PREMIUM_PRODUCTS_POOL[1], PREMIUM_PRODUCTS_POOL[3]];
      setRecentlyViewed(defaultRecent);
      localStorage.setItem('cakeurban_recently_viewed', JSON.stringify(defaultRecent));
    }
  }, []);

  // ---------------------------------------------------------
  // CORE FUNCTIONS
  // ---------------------------------------------------------
  const handleToggleWishlist = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playBtnTap();
    const exists = wishlist.some(item => item.id === product.id);
    let updated;
    if (exists) {
      updated = wishlist.filter(item => item.id !== product.id);
      toast.info(`Removed "${product.name}" from your wishlist.`);
    } else {
      updated = [...wishlist, product];
      toast.success(`Saved "${product.name}" with love! ❤️`);
    }
    setWishlist(updated);
    localStorage.setItem('cakeurban_wishlist', JSON.stringify(updated));
  };

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
    playSlidePop();

    // Add to recently viewed
    const exists = recentlyViewed.some(p => p.id === product.id);
    if (!exists) {
      const updated = [product, ...recentlyViewed].slice(0, 8);
      setRecentlyViewed(updated);
      localStorage.setItem('cakeurban_recently_viewed', JSON.stringify(updated));
    }
  };

  const handleToggleCompare = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playBtnTap();
    const exists = compareList.some(item => item.id === product.id);
    if (exists) {
      setCompareList(prev => prev.filter(item => item.id !== product.id));
      toast.info(`Removed ${product.name} from comparison.`);
    } else {
      if (compareList.length >= 4) {
        toast.error("Can compare a maximum of 4 luxury cakes simultaneously.");
        return;
      }
      setCompareList(prev => [...prev, product]);
      setIsCompareOpen(true);
      toast.success(`Added ${product.name} to Comparative Board!`);
    }
  };

  const handleApplySpecialFilter = (filterType: string, value: any) => {
    if (filterType === 'category') {
      if (!selectedCategories.includes(value)) {
        setSelectedCategories([value]);
      }
    } else if (filterType === 'dietary') {
      if (!selectedDiets.includes(value)) {
        setSelectedDiets([value]);
      }
    } else if (filterType === 'occasion') {
      if (!selectedOccasions.includes(value)) {
        setSelectedOccasions([value]);
      }
    } else if (filterType === 'price') {
      setPriceRange([200, value]);
    }
    playSlidePop();
  };

  const handleClearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedOccasions([]);
    setSelectedFlavors([]);
    setSelectedWeights([]);
    setPriceRange([200, 5000]);
    setSelectedRatings([]);
    setSelectedPrepTimes([]);
    setSelectedDeliveryTimes([]);
    setSelectedDiets([]);
    setSelectedPremiumTiers([]);
    setIsPremiumOnly(false);
    setSearchQuery("");
    playBtnTap();
    toast.success("All filters cleared successfully.");
  };

  // ---------------------------------------------------------
  // AI RECS ENGINE SIMULATION
  // ---------------------------------------------------------
  const executeRecommendation = () => {
    setAiIsBaking(true);
    setAiProgressText("Scanning metropolitan bakeries...");
    playSlidePop();

    setTimeout(() => {
      setAiProgressText("Weighing cocoa moisture metrics...");
      setTimeout(() => {
        setAiProgressText("Stitch-modeling custom design assets...");
        setTimeout(() => {
          setAiIsBaking(false);
          setAiHasGenerated(true);
          playSuccessChime();
          
          // Auto filter search based on choice
          setSearchQuery(aiFlavor);
          handleApplySpecialFilter('category', 'Premium Collection');
          
          toast.success("AI Recommendation Generated! ✨", {
            description: `Curated ${aiFlavor} cakes perfect for your ${aiOccasion} of ${aiPeopleCount} pax.`
          });
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const handleAssistantSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assistantInput.trim()) return;
    const msg = assistantInput.trim();
    setAssistantMessages(prev => [...prev, { sender: 'user', text: msg }]);
    setAssistantInput("");
    playBtnTap();

    setTimeout(() => {
      let reply = "I am mapping your custom requirements to our Faridabad baker team now. We can design beautiful hand-gilded 2-Tier cakes with organic double cream. Use coupon 'CHEFMAGIC' to claim a free candle tray!";
      const lower = msg.toLowerCase();
      if (lower.includes("chocolate") || lower.includes("truffle")) {
        reply = "Ah! Our Belgian Chocolate Drip uses 72% dark couverture. It has an ultra-moist sponge, which our pastry chef can render 100% eggless. Would you like a heart shape?";
      } else if (lower.includes("eggless") || lower.includes("vegan")) {
        reply = "Absolutely. 95% of our client recipes in Faridabad are baked entirely egg-free using premium flaxseed meal and organic yogurt cultures to preserve fluffy elasticity. Standard custom pricing applies.";
      } else if (lower.includes("wedding") || lower.includes("anniversary") || lower.includes("tier")) {
        reply = "Marvelous celebration! For tiers, we recommend our Wild Strawberry Shimmer or Red Velvet Eclipse. We construct structural doweling to ensure transport safety.";
      }
      setAssistantMessages(prev => [...prev, { sender: 'chef', text: reply }]);
      playSuccessChime();
    }, 1200);
  };

  // Row scroll helper
  const scrollRow = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmt = direction === 'left' ? -340 : 340;
      ref.current.scrollBy({ left: scrollAmt, behavior: 'smooth' });
      playBtnTap();
    }
  };

  // ---------------------------------------------------------
  // FILTERING AND COMPILING DYNAMIC CATALOG
  // ---------------------------------------------------------
  const filteredProducts = useMemo(() => {
    return allProducts.filter(prod => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = prod.name.toLowerCase().includes(query);
        const matchesDesc = prod.description.toLowerCase().includes(query);
        const matchesCat = prod.categories.some(c => c.toLowerCase().includes(query));
        const matchesFlv = prod.flavors.some(f => f.toLowerCase().includes(query));
        const matchesOcc = prod.occasions?.some(o => o.toLowerCase().includes(query));
        
        if (!matchesName && !matchesDesc && !matchesCat && !matchesFlv && !matchesOcc) {
          return false;
        }
      }

      // 2. Premium Only Toggle
      if (isPremiumOnly) {
        if (!prod.categories.includes("Premium Collection") && prod.price < 1800) {
          return false;
        }
      }

      // 3. Selected Categories
      if (selectedCategories.length > 0) {
        const matchesCat = prod.categories.some(cat => selectedCategories.includes(cat));
        if (!matchesCat) return false;
      }

      // 4. Selected Occasions
      if (selectedOccasions.length > 0) {
        const matchesOcc = prod.occasions?.some(occ => selectedOccasions.includes(occ));
        if (!matchesOcc) return false;
      }

      // 5. Selected Flavors
      if (selectedFlavors.length > 0) {
        const matchesFlv = prod.flavors.some(flv => selectedFlavors.includes(flv));
        if (!matchesFlv) return false;
      }

      // 6. Selected Weights
      if (selectedWeights.length > 0) {
        const matchesWt = prod.weights?.some(w => selectedWeights.includes(w));
        if (!matchesWt) return false;
      }

      // 7. Price Range
      if (prod.price > priceRange[1]) {
        return false;
      }

      // 8. Selected Ratings
      if (selectedRatings.length > 0) {
        const minRating = Math.min(...selectedRatings);
        if ((prod.rating || 4.8) < minRating) return false;
      }

      // 9. Selected Diets (dietary options)
      if (selectedDiets.length > 0) {
        const matchesDiet = prod.dietary?.some(d => selectedDiets.includes(d));
        if (!matchesDiet) return false;
      }

      // 10. Selected Premium Tiers (badges)
      if (selectedPremiumTiers.length > 0) {
        const matchesTier = selectedPremiumTiers.some(tier => {
          if (tier === "Chef Special") return prod.rating && prod.rating >= 4.9;
          if (tier === "New Arrival") return prod.isNew;
          if (tier === "Trending") return prod.isBestseller && prod.rating && prod.rating >= 4.8;
          if (tier === "Best Seller") return prod.isBestseller;
          if (tier === "Limited Edition") return prod.categories.includes("Premium Collection");
          return false;
        });
        if (!matchesTier) return false;
      }

      return true;
    });
  }, [allProducts, searchQuery, isPremiumOnly, selectedCategories, selectedOccasions, selectedFlavors, selectedWeights, priceRange, selectedRatings, selectedDiets, selectedPremiumTiers]);

  // CAROUSEL DATA COMPILING
  const luxuryCakes = useMemo(() => allProducts.filter(p => p.categories.includes("Premium Collection") || p.price >= 1800), [allProducts]);
  const chefSpecials = useMemo(() => allProducts.filter(p => p.rating && p.rating >= 4.9), [allProducts]);
  const bestUnder999 = useMemo(() => allProducts.filter(p => p.price <= 999), [allProducts]);
  const birthdayCakes = useMemo(() => allProducts.filter(p => p.occasions?.includes("Birthday")), [allProducts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8FA] via-[#FDF5FF] to-[#F5F8FF] text-slate-800 font-sans selection:bg-pink-100 selection:text-pink-900 pb-20 relative">
      <SEO 
        title="AI Luxury Shop - CakeUrban Boutique"
        description="Experience luxury cake shopping with AI search, smart filters, spec contrast tables, and dynamic price configuration."
      />

      {/* Decorative Blur Backdrops */}
      <div className="absolute top-0 left-0 right-0 h-[800px] overflow-hidden pointer-events-none select-none z-0">
        <div className="absolute top-[-10%] left-[-15%] w-[50%] h-[60%] bg-pink-300/10 rounded-full blur-3xl" />
        <div className="absolute top-[15%] right-[-10%] w-[45%] h-[55%] bg-purple-300/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10 space-y-16">
        
        {/* =========================================================
            HEADER TITLE SUITE (Luxury Editorial)
            ========================================================= */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 bg-pink-500/5 border border-pink-500/10 px-4 py-1.5 rounded-full"
          >
            <Sparkle className="w-3.5 h-3.5 text-pink-500 fill-pink-100" />
            <span className="text-[10px] font-black uppercase tracking-wider text-pink-700 font-sans">Faridabad Atelier De Patisserie</span>
          </motion.div>
          
          <div className="max-w-2xl mx-auto space-y-2">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none font-sans">
              Boutique Confection Suite
            </h1>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-xl mx-auto font-medium">
              Formulated by world-class pastry chefs, hand-gilded in 24K gold leaf, and baked 100% eggless. Refined for your milestones.
            </p>
          </div>
        </div>

        {/* =========================================================
            SECTION 01: AI SEARCH EXPERIENCE
            ========================================================= */}
        <div className="space-y-4 text-center">
          <AiSearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onApplySpecialFilter={handleApplySpecialFilter}
            allProducts={allProducts}
            onQuickView={handleOpenQuickView}
          />
        </div>

        {/* =========================================================
            SECTION 02: MAIN CATALOG GRID (Sidebar + Product list)
            ========================================================= */}
        <div className="flex gap-8 items-start pt-4">
          
          {/* Smart Filter Sidebar component */}
          <SmartFilterSidebar 
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedOccasions={selectedOccasions}
            setSelectedOccasions={setSelectedOccasions}
            selectedFlavors={selectedFlavors}
            setSelectedFlavors={setSelectedFlavors}
            selectedWeights={selectedWeights}
            setSelectedWeights={setSelectedWeights}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedRatings={selectedRatings}
            setSelectedRatings={setSelectedRatings}
            selectedPrepTimes={selectedPrepTimes}
            setSelectedPrepTimes={setSelectedPrepTimes}
            selectedDeliveryTimes={selectedDeliveryTimes}
            setSelectedDeliveryTimes={setSelectedDeliveryTimes}
            selectedDiets={selectedDiets}
            setSelectedDiets={setSelectedDiets}
            selectedPremiumTiers={selectedPremiumTiers}
            setSelectedPremiumTiers={setSelectedPremiumTiers}
            isPremiumOnly={isPremiumOnly}
            setIsPremiumOnly={setIsPremiumOnly}
            isOpen={isFilterDrawerOpen}
            onClose={() => setIsFilterDrawerOpen(false)}
            totalCount={filteredProducts.length}
          />

          {/* Right Side: active filters bar + Product cards collection */}
          <div className="flex-1 space-y-6">
            
            {/* Mobile Filter Toggle and search summaries */}
            <div className="flex items-center justify-between gap-4">
              <div className="text-left">
                <span className="text-xs font-black text-slate-800 font-sans">
                  {filteredProducts.length} Culinary Concepts Found
                </span>
                {searchQuery && (
                  <span className="text-[10px] text-slate-400 font-bold block">
                    Filtering search of "{searchQuery}"
                  </span>
                )}
              </div>

              {/* Mobile Filter Pill trigger */}
              <button
                onClick={() => { setIsFilterDrawerOpen(true); playSlidePop(); }}
                className="lg:hidden flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-md cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Active filters chips strip */}
            {(selectedCategories.length > 0 || selectedOccasions.length > 0 || selectedFlavors.length > 0 || selectedWeights.length > 0 || selectedDiets.length > 0 || isPremiumOnly || searchQuery) && (
              <div className="flex flex-wrap items-center gap-1.5 py-1 text-left">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mr-1">Active:</span>
                
                {searchQuery && (
                  <span className="px-2.5 py-1 rounded-lg bg-pink-50 border border-pink-100 text-[10px] font-bold text-pink-700 flex items-center gap-1">
                    "{searchQuery}"
                    <X className="w-2.5 h-2.5 cursor-pointer" onClick={() => setSearchQuery("")} />
                  </span>
                )}

                {isPremiumOnly && (
                  <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-100 text-[10px] font-bold text-amber-700 flex items-center gap-1">
                    Premium Atelier Only
                    <X className="w-2.5 h-2.5 cursor-pointer" onClick={() => setIsPremiumOnly(false)} />
                  </span>
                )}

                {selectedCategories.map(cat => (
                  <span key={cat} className="px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-100 text-[10px] font-bold text-purple-700 flex items-center gap-1">
                    {cat}
                    <X className="w-2.5 h-2.5 cursor-pointer" onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== cat))} />
                  </span>
                ))}

                {selectedDiets.map(dt => (
                  <span key={dt} className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                    {dt} Choice
                    <X className="w-2.5 h-2.5 cursor-pointer" onClick={() => setSelectedDiets(selectedDiets.filter(d => d !== dt))} />
                  </span>
                ))}

                <button 
                  onClick={handleClearAllFilters}
                  className="text-[9px] font-black uppercase text-pink-600 hover:underline pl-1 cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Catalog Grid */}
            {loading ? (
              <SkeletonGrid count={6} />
            ) : filteredProducts.length === 0 ? (
              <div className="py-6">
                <EmptyState 
                  type="search" 
                  searchQuery={searchQuery} 
                  onCtaClick={handleClearAllFilters} 
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => {
                  const inWish = wishlist.some(w => w.id === prod.id);
                  const inCompare = compareList.some(c => c.id === prod.id);
                  return (
                    <motion.div
                      layout
                      key={prod.id}
                      onClick={() => handleOpenQuickView(prod)}
                      className="bg-white/50 backdrop-blur-md border border-white/80 rounded-[30px] overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative cursor-pointer text-left"
                    >
                      {/* Photo Header */}
                      <div className="relative h-48 overflow-hidden bg-slate-100 border-b border-slate-50">
                        <img 
                          src={prod.images[0]} 
                          alt={prod.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                        {/* Top corner actions */}
                        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
                          {/* Heart wishlist */}
                          <button
                            onClick={(e) => handleToggleWishlist(prod, e)}
                            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-slate-500 hover:text-pink-600 transition-transform active:scale-95"
                          >
                            <Heart className={`w-4.5 h-4.5 ${inWish ? 'text-pink-600 fill-current' : ''}`} />
                          </button>

                          {/* Spec Contrast */}
                          <button
                            onClick={(e) => handleToggleCompare(prod, e)}
                            className={`w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-transform active:scale-95 ${
                              inCompare ? 'bg-indigo-600 text-white' : 'bg-white/90 text-slate-500 hover:text-indigo-600'
                            }`}
                            title="Add to Contrast Table"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Special flags */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                          {prod.isNew && (
                            <span className="bg-purple-600 text-white text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md">
                              New
                            </span>
                          )}
                          {prod.isBestseller && (
                            <span className="bg-pink-600 text-white text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md">
                              Bestseller
                            </span>
                          )}
                        </div>

                        {/* Star indicators */}
                        <div className="absolute bottom-3 left-4 flex items-center gap-0.5 text-white z-10">
                          <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                          <span className="text-xs font-black">{prod.rating || '4.8'}</span>
                        </div>
                      </div>

                      {/* Info core */}
                      <div className="p-5 space-y-2">
                        <h3 className="font-black text-slate-800 text-sm group-hover:text-pink-600 transition-colors line-clamp-1">{prod.name}</h3>
                        <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2 h-8 font-medium">{prod.description}</p>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                          <div className="space-y-0.5 text-left">
                            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider leading-none">Net Cost</span>
                            <span className="text-sm font-mono font-black text-slate-900">₹{prod.price}</span>
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenQuickView(prod);
                            }}
                            className="px-4 py-2 bg-pink-50 hover:bg-pink-100 border border-pink-100 text-pink-600 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all"
                          >
                            <span>Quick Add</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

        {/* =========================================================
            SECTION 03: NETFLIX STYLE DYNAMIC RECOMMENDATION CAROUSELS
            ========================================================= */}
        <div className="pt-8 border-t border-slate-100 text-left space-y-16">
          
          <div className="space-y-2">
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 animate-spin fill-indigo-100" />
              Tailored Channels
            </span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Atelier Personalized Showcases</h3>
          </div>

          {/* Carousel Row 1: Chef Choice Selection */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                Chef's Choice Masterpieces (4.9★+)
              </h4>
              <div className="flex gap-1">
                <button onClick={() => scrollRow(recommendedRowRef, 'left')} className="w-8 h-8 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => scrollRow(recommendedRowRef, 'right')} className="w-8 h-8 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
            <div ref={recommendedRowRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
              {chefSpecials.map(prod => (
                <div key={prod.id} className="w-[280px] flex-shrink-0 snap-start">
                  <div 
                    onClick={() => handleOpenQuickView(prod)}
                    className="bg-white/60 border border-slate-100 rounded-[24px] overflow-hidden group hover:shadow-lg transition-all text-left cursor-pointer p-4 space-y-3"
                  >
                    <img src={prod.images[0]} alt={prod.name} className="w-full h-32 object-cover rounded-xl" />
                    <div className="space-y-1">
                      <h5 className="text-xs font-black text-slate-800 group-hover:text-pink-600 transition-colors truncate">{prod.name}</h5>
                      <div className="text-[10px] text-slate-400 font-bold font-mono">₹{prod.price} • {prod.rating} ★</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Row 2: Best Under ₹999 */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                Sweet Treats Under ₹999
              </h4>
              <div className="flex gap-1">
                <button onClick={() => scrollRow(budgetRowRef, 'left')} className="w-8 h-8 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => scrollRow(budgetRowRef, 'right')} className="w-8 h-8 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
            <div ref={budgetRowRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
              {bestUnder999.map(prod => (
                <div key={prod.id} className="w-[280px] flex-shrink-0 snap-start">
                  <div 
                    onClick={() => handleOpenQuickView(prod)}
                    className="bg-white/60 border border-slate-100 rounded-[24px] overflow-hidden group hover:shadow-lg transition-all text-left cursor-pointer p-4 space-y-3"
                  >
                    <img src={prod.images[0]} alt={prod.name} className="w-full h-32 object-cover rounded-xl" />
                    <div className="space-y-1">
                      <h5 className="text-xs font-black text-slate-800 group-hover:text-indigo-600 transition-colors truncate">{prod.name}</h5>
                      <div className="text-[10px] text-slate-400 font-bold font-mono">₹{prod.price} • {prod.rating} ★</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Row 3: Limited Premium Editions */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Bespoke & Premium Editions
              </h4>
              <div className="flex gap-1">
                <button onClick={() => scrollRow(premiumRowRef, 'left')} className="w-8 h-8 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => scrollRow(premiumRowRef, 'right')} className="w-8 h-8 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
            <div ref={premiumRowRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
              {luxuryCakes.map(prod => (
                <div key={prod.id} className="w-[280px] flex-shrink-0 snap-start">
                  <div 
                    onClick={() => handleOpenQuickView(prod)}
                    className="bg-white/60 border border-slate-100 rounded-[24px] overflow-hidden group hover:shadow-lg transition-all text-left cursor-pointer p-4 space-y-3"
                  >
                    <img src={prod.images[0]} alt={prod.name} className="w-full h-32 object-cover rounded-xl" />
                    <div className="space-y-1">
                      <h5 className="text-xs font-black text-slate-800 group-hover:text-amber-600 transition-colors truncate">{prod.name}</h5>
                      <div className="text-[10px] text-slate-400 font-bold font-mono">₹{prod.price} • {prod.rating} ★</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* =========================================================
          STITCHED FLOATING INTERACTORS & DRAWERS
          ========================================================= */}

      {/* Product Comparison spec matrix floating bar & popup */}
      <ProductComparison 
        compareList={compareList}
        onRemoveCompare={(id, e) => {
          if (e) e.stopPropagation();
          setCompareList(prev => prev.filter(p => p.id !== id));
        }}
        onClearCompare={() => setCompareList([])}
        isOpen={isCompareOpen}
        setIsOpen={setIsCompareOpen}
        onQuickAdd={(prod, e) => {
          e.stopPropagation();
          addItem({
            ...prod,
            price: prod.price,
            quantity: 1,
            selectedWeight: prod.weights?.[0] || 1.0,
            eggless: true
          } as CartItem);
          playSuccessChime();
          toast.success(`Added 1x ${prod.name} to basket! 🧁`);
        }}
      />

      {/* Recently Viewed History Strip with cross-sell suggestions */}
      <RecentlyViewedDrawer 
        recentlyViewed={recentlyViewed}
        onQuickView={handleOpenQuickView}
        onAddToCart={(item) => {
          addItem(item);
          playSuccessChime();
        }}
        isOpen={isRecentDrawerOpen}
        setIsOpen={setIsRecentDrawerOpen}
      />

      {/* Quick View Dialog with zoom gallery & dynamic pricing */}
      <AnimatePresence>
        {quickViewProduct && (
          <QuickViewModal 
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
            onAddToCart={(item) => {
              addItem(item);
              playSuccessChime();
            }}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        )}
      </AnimatePresence>

      {/* Floating AI Chef Assistant chat widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => { setIsAssistantOpen(!isAssistantOpen); playSlidePop(); }}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all relative cursor-pointer"
        >
          {isAssistantOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
          {!isAssistantOpen && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-600 text-white text-[9px] font-black flex items-center justify-center animate-bounce">
              1
            </span>
          )}
        </button>

        <AnimatePresence>
          {isAssistantOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="absolute bottom-16 right-0 w-[350px] md:w-[400px] h-[480px] bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-[32px] shadow-2xl flex flex-col overflow-hidden text-slate-800"
            >
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">👩‍🍳</div>
                <div className="text-left">
                  <div className="text-xs font-black uppercase tracking-widest opacity-80">Chef Urban Assistant</div>
                  <div className="text-sm font-black leading-none mt-0.5">Chef AI Confection Expert</div>
                </div>
              </div>

              {/* Chat panel logs */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin">
                {assistantMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed text-left ${
                      msg.sender === 'user' 
                        ? 'bg-purple-600 text-white font-medium rounded-tr-none' 
                        : 'bg-slate-100 text-slate-800 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleAssistantSend} className="p-3 border-t border-slate-100 flex gap-2 bg-slate-50">
                <input 
                  type="text"
                  value={assistantInput}
                  onChange={(e) => setAssistantInput(e.target.value)}
                  placeholder="Ask for custom tier pricing, eggless, etc..."
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 text-xs outline-none focus:border-purple-500 transition-colors"
                />
                <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold rounded-xl transition-colors">
                  Send
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Wishlist Button */}
      <div className="fixed bottom-24 right-6 z-40">
        <button 
          onClick={() => {
            handleApplySpecialFilter('category', 'Premium Collection');
            toast.info("Filtered to Premium Collections wishlist items!");
            playBtnTap();
          }}
          className="w-12 h-12 rounded-full bg-white border border-slate-200 text-pink-600 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all relative"
        >
          <Heart className="w-5 h-5 fill-current animate-pulse" />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink-600 text-white text-[10px] font-black flex items-center justify-center shadow-md">
            {wishlist.length}
          </span>
        </button>
      </div>

    </div>
  );
}
