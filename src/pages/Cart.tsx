import React, { useState, useEffect } from 'react';
import { useCart } from '../lib/store';
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  X, 
  Gift, 
  Heart, 
  Edit3, 
  Sliders, 
  Percent, 
  Check, 
  ChevronRight, 
  Info,
  Sparkle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { playSuccessChime, playBtnTap, playSlidePop } from '../lib/sound';
import SEO from '../components/SEO';
import { toast } from 'sonner';

// =========================================================
// CUSTOM ANIMATED COUNTER COMPONENT FOR STRIPE-STYLE TICKING
// =========================================================
function AnimatedCounter({ value, prefix = "₹" }: { value: number; prefix?: string }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let start: number | null = null;
    const initial = displayValue;
    const duration = 400; // ms

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = progress * (2 - progress); // Ease out Quad
      const current = Math.round(initial + (value - initial) * ease);
      setDisplayValue(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [value]);

  return (
    <span className="tabular-nums transition-all duration-300">
      {prefix}{displayValue.toLocaleString('en-IN')}
    </span>
  );
}

// =========================================================
// CART PAGE COMPONENT
// =========================================================
export default function Cart() {
  const { items, updateQuantity, removeItem, getTotal, clearCart, addItem } = useCart();
  const navigate = useNavigate();
  
  // ---------------------------------------------------------
  // COUPON SYSTEM
  // ---------------------------------------------------------
  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<string | null>(() => {
    return localStorage.getItem('cakeurban_active_coupon') || null;
  });
  
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; y: number; char: string }>>([]);

  // Available coupons: Birthday20 (20%), WELCOME10 (10%), FREESHIP (₹100 flat)
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      toast.error("Please enter a valid coupon code.");
      return;
    }

    try { playBtnTap(); } catch (e) {}

    if (cleanCode === 'BIRTHDAY20' || cleanCode === 'WELCOME10' || cleanCode === 'FREESHIP') {
      setActiveCoupon(cleanCode);
      localStorage.setItem('cakeurban_active_coupon', cleanCode);
      toast.success(`Coupon "${cleanCode}" successfully applied!`, {
        description: cleanCode === 'BIRTHDAY20' ? "Luxury 20% Discount unlocked." : cleanCode === 'WELCOME10' ? "Sweet 10% Welcome Discount unlocked." : "VIP ₹100 Shipping Credit applied."
      });
      triggerConfetti();
      try { playSuccessChime(); } catch (e) {}
    } else {
      toast.error("Invalid coupon code.", {
        description: "Please check the spelling and try again."
      });
    }
  };

  const removeCoupon = () => {
    try { playBtnTap(); } catch (e) {}
    setActiveCoupon(null);
    localStorage.removeItem('cakeurban_active_coupon');
    toast.info("Coupon removed.");
  };

  const triggerConfetti = () => {
    const chars = ['✨', '🎂', '💖', '🎉', '🍰', '🌸', '🧁'];
    const tempConfetti = Array.from({ length: 40 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: 100 + Math.random() * 20,
      char: chars[Math.floor(Math.random() * chars.length)]
    }));
    setConfetti(tempConfetti);
    setTimeout(() => setConfetti([]), 3000);
  };

  // ---------------------------------------------------------
  // PRICE MATHEMATICS
  // ---------------------------------------------------------
  const rawSubtotal = getTotal();
  
  let couponSavings = 0;
  if (activeCoupon === 'BIRTHDAY20') {
    couponSavings = Math.round(rawSubtotal * 0.20);
  } else if (activeCoupon === 'WELCOME10') {
    couponSavings = Math.round(rawSubtotal * 0.10);
  } else if (activeCoupon === 'FREESHIP') {
    couponSavings = rawSubtotal > 0 ? 100 : 0;
  }

  // Delivery Charges (complimentary, but can be formatted as 0)
  const deliveryCharges = 0;
  // Standard Taxes: luxury 5% gourmet tax
  const taxes = Math.round(rawSubtotal * 0.05);
  // Sweet instant boutique discount
  const boutiqueDiscount = Math.round(rawSubtotal * 0.08); // 8% instant standard discount

  const grandTotal = Math.max(0, rawSubtotal - boutiqueDiscount - couponSavings + deliveryCharges + taxes);

  // Synchronize grand total to localstorage for checkout page to pick up
  useEffect(() => {
    localStorage.setItem('cakeurban_checkout_subtotal', rawSubtotal.toString());
    localStorage.setItem('cakeurban_checkout_discount', (boutiqueDiscount + couponSavings).toString());
    localStorage.setItem('cakeurban_checkout_taxes', taxes.toString());
    localStorage.setItem('cakeurban_checkout_total', grandTotal.toString());
  }, [rawSubtotal, boutiqueDiscount, couponSavings, taxes, grandTotal]);

  const handleProceedToCheckout = () => {
    try { playSuccessChime(); } catch (e) {}
    navigate('/checkout');
  };

  const toggleWishlist = (item: any) => {
    try { playSuccessChime(); } catch (e) {}
    try {
      const saved = JSON.parse(localStorage.getItem('cakeurban_wishlist') || '[]');
      const isWishlisted = saved.some((p: any) => p.id === item.id);
      if (isWishlisted) {
        const fresh = saved.filter((p: any) => p.id !== item.id);
        localStorage.setItem('cakeurban_wishlist', JSON.stringify(fresh));
        toast.info(`"${item.name}" removed from Saved Treats.`);
      } else {
        saved.push(item);
        localStorage.setItem('cakeurban_wishlist', JSON.stringify(saved));
        toast.success(`"${item.name}" saved to Wishlist! ❤️`);
      }
      window.dispatchEvent(new Event('storage'));
    } catch(e) {}
  };

  const triggerCustomize = (item: any) => {
    try { playSlidePop(); } catch (e) {}
    toast.info(`Opening bespoke options for ${item.name}...`, {
      description: "Redirecting to artisan customization panel."
    });
    setTimeout(() => {
      navigate(`/product/${item.id}`);
    }, 600);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-transparent text-[#FFFDFB] flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
        <SEO 
          title="Bespoke Bag is Empty | CakeUrban" 
          description="Your premium CakeUrban cart is empty. Explore our luxury collection of custom cakes today."
        />
        {/* Floating gradient ambient background */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-[#DFB15B]/10 to-amber-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#DFB15B]/10 to-amber-500/10 blur-[120px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="relative z-10 max-w-md w-full bg-[#18191e]/90 backdrop-blur-xl border border-[#DFB15B]/30 p-12 rounded-[48px] shadow-2xl text-white"
        >
          <div className="w-24 h-24 bg-[#DFB15B]/10 rounded-[32px] flex items-center justify-center mx-auto mb-8 relative border border-[#DFB15B]/20">
            <ShoppingBag className="w-10 h-10 text-[#DFB15B]" strokeWidth={1.5} />
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }} 
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-[#DFB15B] rounded-full" 
            />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight mb-3">Your Bag is Empty</h2>
          <p className="text-slate-300 font-semibold italic text-sm mb-10 leading-relaxed">
            Your personal curation of luxury confections is waiting to be assembled. Let us curate your celebratory masterpiece.
          </p>
          <Link to="/shop" onClick={() => { try { playBtnTap(); } catch (e) {} }}>
            <motion.button 
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-14 bg-[#DFB15B] text-slate-950 font-black text-xs uppercase tracking-[0.25em] rounded-full shadow-lg hover:bg-amber-300 transition-all"
            >
              Explore Boutique
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-[#FFFDFB] font-sans selection:bg-[#DFB15B]/30 selection:text-[#DFB15B] py-12 px-4 sm:px-6 lg:px-8 relative overflow-x-hidden">
      <SEO 
        title="Your Bespoke Shopping Cart | CakeUrban" 
        description="Review your selected artisan confections, custom ingredients, luxury packaging, and custom weight configurations of CakeUrban."
      />

      {/* Confetti Explosion Layer */}
      <AnimatePresence>
        {confetti.map((c) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 1, x: `${c.x}vw`, y: '100vh', scale: 0.5, rotate: 0 }}
            animate={{ 
              opacity: [1, 1, 0], 
              y: '-20vh', 
              x: `${c.x + (Math.random() * 20 - 10)}vw`,
              scale: [0.5, 1.5, 1],
              rotate: 360 
            }}
            transition={{ duration: 2.2, ease: "easeOut" }}
            className="fixed text-3xl pointer-events-none z-50 select-none"
          >
            {c.char}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Premium Ambient Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-pink-300/10 to-purple-300/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-rose-300/10 to-indigo-300/10 blur-[130px] pointer-events-none" />

      {/* MAIN LAYOUT WRAPPER */}
      <div className="max-w-[1280px] mx-auto relative z-10">
        
        {/* =========================================================
            HEADER SECTION (Apple/Nike Premium Style)
            ========================================================= */}
        <header className="mb-14 text-left border-b border-pink-100/30 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-pink-500 rounded-full animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-500 italic">Bespoke Boutique Curation</span>
            </div>
            <h1 className="text-5xl sm:text-[60px] font-black text-slate-900 tracking-tighter leading-none">
              Shopping Cart
            </h1>
            <p className="text-slate-400 font-semibold italic text-sm">
              Review your delicious selections before checkout.
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-md border border-pink-100/50 px-5 py-3 rounded-full flex items-center gap-3 shadow-sm text-xs font-bold text-slate-500">
            <ShoppingBag className="w-4 h-4 text-pink-500" />
            <span>{items.reduce((sum, i) => sum + i.quantity, 0)} Items Curated</span>
            <div className="w-1 h-4 bg-pink-100" />
            <span className="text-pink-600 font-black">Free Delivery</span>
          </div>
        </header>

        {/* =========================================================
            12-COLUMN CORE GRID: LEFT 65% (8/12) | RIGHT 35% (4/12)
            ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
          
          {/* LEFT 65% - LUXURY CART CARDS */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => (
                <motion.div
                  key={`${item.id}-${item.selectedWeight || ''}-${item.selectedFlavor || ''}-${item.eggless ? 'eggless' : 'regular'}-${item.cakeMessage || ''}-${index}`}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
                  drag="x"
                  dragDirectionLock
                  dragConstraints={{ left: -140, right: 0 }}
                  dragElastic={{ left: 0.1, right: 0 }}
                  onDragEnd={(e, info) => {
                    if (info.offset.x < -100) {
                      try { playBtnTap(); } catch (err) {}
                      removeItem(item.id, item.selectedWeight);
                      toast.error(`Removed "${item.name}" from your bag.`, {
                        action: {
                          label: "Undo",
                          onClick: () => {
                            try { playSuccessChime(); } catch (err) {}
                            addItem(item, { quantity: item.quantity });
                          }
                        }
                      });
                    }
                  }}
                  className="group relative bg-white border border-pink-100/40 rounded-[32px] p-6 sm:p-8 shadow-[0_15px_45px_rgba(244,63,94,0.03)] hover:shadow-[0_25px_60px_rgba(244,63,94,0.07)] hover:translate-y-[-2px] transition-all duration-500 flex flex-col md:flex-row items-center gap-6 md:gap-8 overflow-hidden select-none"
                >
                  {/* Slide to Delete Indicator behind the card */}
                  <div className="absolute inset-y-0 right-0 w-[140px] bg-rose-500 rounded-r-[32px] flex items-center justify-center text-white font-black text-xs uppercase tracking-widest pointer-events-none translate-x-[140px] group-hover:translate-x-0 transition-transform duration-300">
                    <div className="flex flex-col items-center gap-1">
                      <Trash2 className="w-5 h-5 animate-bounce" />
                      <span>Release</span>
                    </div>
                  </div>

                  {/* Glass Card Shiny Reflection Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none rounded-[32px]" />

                  {/* 1. Large Cake Image (180x180, Rounded) */}
                  <div className="w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] rounded-3xl overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50 shrink-0 border border-pink-100/30 p-2 relative shadow-inner">
                    <img 
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400'} 
                      className="w-full h-full object-cover rounded-2xl" 
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                  </div>

                  {/* 2. Cake Details & Pills */}
                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <div>
                      <h3 className="font-sans font-black text-[#1E293B] text-xl sm:text-2xl tracking-tight leading-none group-hover:text-pink-600 transition-colors duration-300">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-semibold italic mt-1.5 line-clamp-1">
                        {item.description || "Freshly baked culinary masterpiece tailored to your palate."}
                      </p>
                    </div>

                    {/* Pill Badges Grid */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-1.5">
                      {item.selectedFlavor && (
                        <span className="px-3 py-1.5 bg-[#FAF3F7] text-pink-700 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm border border-pink-100/20">
                          🍫 {item.selectedFlavor}
                        </span>
                      )}
                      {item.selectedWeight && (
                        <span className="px-3 py-1.5 bg-[#F3F4FB] text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm border border-indigo-100/20">
                          ⚖️ {item.selectedWeight} kg
                        </span>
                      )}
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm border ${
                        item.eggless 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100/20' 
                          : 'bg-amber-50 text-amber-700 border-amber-100/20'
                      }`}>
                        {item.eggless ? '🟢 Eggless Only' : '🥚 Classic Egg'}
                      </span>
                      {/* Delivery defaults inside pills */}
                      <span className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm border border-rose-100/20">
                        📅 Tomorrow
                      </span>
                      <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm border border-purple-100/20">
                        ⏰ Twilight Evening
                      </span>
                    </div>

                    {/* Cake Message with handwritten calligraphy font effect */}
                    {item.cakeMessage && (
                      <div className="inline-flex items-center gap-2 bg-[#FEF3C7]/40 border border-[#FDE68A]/50 px-4 py-2 rounded-2xl">
                        <span className="text-amber-700 text-xs">✍️</span>
                        <p className="text-[11px] text-amber-900 font-bold italic">
                          Icing: <span className="font-serif font-black underline decoration-amber-400">"{item.cakeMessage}"</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 3. Stepper & Luxury Actions */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-center justify-between gap-6 w-full md:w-auto pt-6 md:pt-0 border-t md:border-none border-pink-100/10 shrink-0">
                    
                    {/* Stepper with spring effects */}
                    <div className="flex items-center bg-[#FDF9FB] border border-pink-200/30 rounded-2xl p-1.5 shadow-sm">
                      <motion.button 
                        whileTap={{ scale: 0.85 }}
                        onClick={() => { try { playBtnTap(); } catch(e){} updateQuantity(item.id, item.quantity - 1, item.selectedWeight); }}
                        className="h-9 w-9 rounded-xl text-slate-500 hover:text-pink-600 hover:bg-pink-500/5 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </motion.button>
                      <span className="w-10 text-center font-black text-slate-800 text-xs tabular-nums select-none">
                        {item.quantity}
                      </span>
                      <motion.button 
                        whileTap={{ scale: 0.85 }}
                        onClick={() => { try { playBtnTap(); } catch(e){} updateQuantity(item.id, item.quantity + 1, item.selectedWeight); }}
                        className="h-9 w-9 rounded-xl text-slate-500 hover:text-pink-600 hover:bg-pink-500/5 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>

                    {/* Subtotal Item Cost */}
                    <div className="text-center md:text-right">
                      <p className="text-2xl font-serif font-black text-slate-800 italic leading-none">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2">
                        ₹{item.price.toLocaleString('en-IN')} / item
                      </p>
                    </div>

                    {/* Elite Glass Action Ribbon */}
                    <div className="flex items-center gap-1 bg-slate-50/50 p-1 rounded-2xl border border-slate-100">
                      
                      {/* Customize Button */}
                      <button 
                        onClick={() => triggerCustomize(item)}
                        title="Artisan Customizations"
                        className="w-8 h-8 rounded-xl hover:bg-white hover:text-pink-500 text-slate-400 hover:shadow-sm transition-all flex items-center justify-center relative group/btn"
                      >
                        <Sliders className="w-4 h-4" />
                        <span className="absolute bottom-[-28px] left-1/2 -translate-x-1/2 bg-slate-900 text-white font-black text-[8px] uppercase tracking-wider px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                          Bespoke
                        </span>
                      </button>

                      {/* Edit Message Button */}
                      <button 
                        onClick={() => triggerCustomize(item)}
                        title="Edit Message"
                        className="w-8 h-8 rounded-xl hover:bg-white hover:text-indigo-500 text-slate-400 hover:shadow-sm transition-all flex items-center justify-center relative group/btn"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span className="absolute bottom-[-28px] left-1/2 -translate-x-1/2 bg-slate-900 text-white font-black text-[8px] uppercase tracking-wider px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                          Edit Note
                        </span>
                      </button>

                      {/* Saved Wishlist Toggle */}
                      <button 
                        onClick={() => toggleWishlist(item)}
                        title="Add to wishlist"
                        className="w-8 h-8 rounded-xl hover:bg-white hover:text-rose-500 text-slate-400 hover:shadow-sm transition-all flex items-center justify-center relative group/btn"
                      >
                        <Heart className="w-4 h-4 fill-transparent hover:fill-rose-500" />
                        <span className="absolute bottom-[-28px] left-1/2 -translate-x-1/2 bg-slate-900 text-white font-black text-[8px] uppercase tracking-wider px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                          Save List
                        </span>
                      </button>

                      <div className="w-[1px] h-6 bg-slate-200" />

                      {/* Remove Button */}
                      <button 
                        onClick={() => {
                          try { playBtnTap(); } catch(e){}
                          removeItem(item.id, item.selectedWeight);
                          toast.error(`Removed "${item.name}" from your bag.`);
                        }}
                        title="Remove Selection"
                        className="w-8 h-8 rounded-xl hover:bg-red-50 text-red-400 hover:text-red-600 hover:shadow-sm transition-all flex items-center justify-center relative group/btn"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="absolute bottom-[-28px] left-1/2 -translate-x-1/2 bg-red-600 text-white font-black text-[8px] uppercase tracking-wider px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                          Remove
                        </span>
                      </button>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Stepper Footer Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-6 select-none">
              <button 
                onClick={() => {
                  try { playBtnTap(); } catch(e){}
                  clearCart();
                  toast.success("Bag cleared successfully.");
                }} 
                className="text-slate-400 hover:text-rose-500 font-black text-[10px] uppercase tracking-[0.2em] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Dissolve Bag
              </button>
              <Link to="/shop" className="w-full sm:w-auto" onClick={() => { try { playBtnTap(); } catch(e){} }}>
                <button className="w-full sm:w-auto px-6 py-3.5 bg-pink-100/20 hover:bg-pink-100/45 border border-pink-200/20 rounded-2xl text-pink-600 font-black text-[10px] uppercase tracking-[0.2em] italic transition-all flex items-center justify-center gap-2">
                  Continue Browsing Boutique
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* =========================================================
              RIGHT SIDE 35% - STICKY ORDER SUMMARY GLASS CARD
              ========================================================= */}
          <div className="lg:col-span-4 lg:sticky lg:top-[120px]">
            <div className="bg-white/80 backdrop-blur-[35px] border border-pink-100/50 rounded-[36px] p-8 sm:p-10 shadow-[0_35px_80px_rgba(244,63,94,0.06)] flex flex-col gap-8 text-left relative overflow-hidden">
              
              {/* Premium shining linear light inside the card */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />

              <h2 className="text-3xl font-serif font-black text-[#1E293B] italic tracking-tight flex items-center gap-2">
                Order Summary
                <Sparkles className="w-5 h-5 text-pink-500 animate-pulse" />
              </h2>

              {/* Cost Calculations */}
              <div className="space-y-4 font-bold text-xs border-b border-pink-100/30 pb-6">
                
                <div className="flex justify-between text-slate-500">
                  <span className="uppercase tracking-[0.15em] text-[10px]">Artistic Value</span>
                  <span className="text-slate-800 font-black font-mono">
                    ₹{rawSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span className="uppercase tracking-[0.15em] text-[10px]">Boutique Discount (8%)</span>
                  <span className="text-emerald-600 font-black font-mono">
                    -₹{boutiqueDiscount.toLocaleString('en-IN')}
                  </span>
                </div>

                {activeCoupon && (
                  <div className="flex justify-between items-center text-pink-600">
                    <span className="uppercase tracking-[0.15em] text-[10px] flex items-center gap-1 bg-pink-100/40 px-2 py-0.5 rounded-full text-[9px] font-black">
                      🎟️ {activeCoupon} Applied
                    </span>
                    <span className="font-black font-mono">
                      -₹{couponSavings.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-slate-500">
                  <span className="uppercase tracking-[0.15em] text-[10px]">Logistics Charges</span>
                  <span className="text-pink-500 text-[10px] font-black uppercase tracking-[0.2em] italic">
                    COMPLIMENTARY
                  </span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span className="uppercase tracking-[0.15em] text-[10px] flex items-center gap-1">
                    Gourmet Custom Tax (5%)
                    <span title="Luxury confection standard VAT">
                      <Info className="w-3.5 h-3.5 text-slate-300 cursor-help" />
                    </span>
                  </span>
                  <span className="text-slate-800 font-black font-mono">
                    ₹{taxes.toLocaleString('en-IN')}
                  </span>
                </div>

              </div>

              {/* Coupon input form */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] block">
                  Promotional Coupon
                </label>
                <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 focus-within:border-pink-300 transition-colors">
                  <input 
                    type="text" 
                    placeholder="Enter Coupon Code" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none pl-3 text-xs font-bold text-slate-800 placeholder-slate-400 tracking-wider uppercase"
                  />
                  <button 
                    onClick={() => applyCoupon(couponCode)}
                    className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-md shadow-pink-500/10 hover:shadow-pink-500/20 transition-all cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                {activeCoupon && (
                  <button 
                    onClick={removeCoupon}
                    className="text-slate-400 hover:text-rose-500 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-1 transition-colors mt-2"
                  >
                    <X className="w-3 h-3" />
                    Remove active coupon
                  </button>
                )}
              </div>

              {/* Recommended Offers Grid Cards */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] block">
                  Curated Offers for You
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { code: 'Birthday20', discount: '20% Off', desc: 'Bespoke Celebration Offer', bg: 'from-pink-500/5 to-purple-500/5', border: 'border-pink-100/30' },
                    { code: 'WELCOME10', discount: '10% Off', desc: 'Elite Welcome Token', bg: 'from-purple-500/5 to-indigo-500/5', border: 'border-purple-100/30' },
                    { code: 'FREESHIP', discount: '₹100 Off', desc: 'Free Logistics Credit', bg: 'from-amber-500/5 to-orange-500/5', border: 'border-amber-100/30' }
                  ].map((offer) => {
                    const isApplied = activeCoupon === offer.code.toUpperCase();
                    return (
                      <button
                        key={offer.code}
                        onClick={() => applyCoupon(offer.code)}
                        className={`p-3 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between group relative overflow-hidden ${
                          isApplied 
                            ? 'border-pink-500 bg-pink-50/20 shadow-sm' 
                            : 'border-slate-100 bg-slate-50/40 hover:border-pink-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shadow-inner ${
                            isApplied ? 'bg-pink-500 text-white' : 'bg-white text-slate-500'
                          }`}>
                            <Percent className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-slate-800 uppercase tracking-wide">
                              {offer.code}
                            </p>
                            <p className="text-[9px] text-slate-400 font-medium italic mt-0.5">
                              {offer.desc}
                            </p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                          isApplied ? 'bg-pink-500 text-white' : 'bg-white text-pink-600 border border-pink-100/30'
                        }`}>
                          {isApplied ? 'Applied' : offer.discount}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grand Total Counter Box */}
              <div className="border-t border-pink-100/30 pt-6 flex justify-between items-baseline select-none">
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">
                  Grand Total
                </span>
                <span className="text-4xl font-serif font-black text-slate-900 italic leading-none flex items-center gap-1">
                  <AnimatedCounter value={grandTotal} />
                </span>
              </div>

              {/* Proceed to Checkout CTA */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProceedToCheckout}
                className="w-full h-[60px] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white text-xs font-black uppercase tracking-[0.3em] rounded-full shadow-[0_15px_40px_rgba(244,63,94,0.22)] hover:shadow-[0_20px_50px_rgba(244,63,94,0.35)] transition-all duration-300 relative overflow-hidden group/cta cursor-pointer"
              >
                {/* Glow layer */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 text-white/60 animate-pulse" />
                </span>
              </motion.button>

              <div className="text-center space-y-4">
                <p className="text-[8.5px] text-slate-400 font-black uppercase tracking-[0.25em] leading-loose">
                  🛡️ SSL Secure Gateway • Fresh Handcrafted Delivery • Elite Patisserie Standard
                </p>
                <div className="flex justify-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
