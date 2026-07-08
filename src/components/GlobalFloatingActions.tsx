import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  History, 
  Phone, 
  ArrowUp,
  MessageSquare,
  X,
  Trash2,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../lib/store';
import { playBtnTap, playSuccessChime } from '../lib/sound';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  flavor?: string;
}

export function GlobalFloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isRecentOpen, setIsRecentOpen] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  
  const cart = useCart();
  const cartCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  const navigate = useNavigate();

  // Load wishlist count and recently viewed history
  const loadData = () => {
    try {
      // Wishlist
      const wishlistRaw = localStorage.getItem('cakeurban_wishlist');
      const wishlist = wishlistRaw ? JSON.parse(wishlistRaw) : [];
      setWishlistCount(Array.isArray(wishlist) ? wishlist.length : 0);

      // Recently viewed
      const recentRaw = localStorage.getItem('cakeurban_recently_viewed');
      const recent = recentRaw ? JSON.parse(recentRaw) : [];
      setRecentlyViewed(Array.isArray(recent) ? recent : []);
    } catch (e) {
      console.warn("Failed to load floating actions data", e);
    }
  };

  useEffect(() => {
    loadData();

    // Listen to local storage changes to keep count in sync across route changes
    window.addEventListener('storage', loadData);
    
    // Poll briefly to handle local React modifications that do not trigger the 'storage' event in same window
    const interval = setInterval(loadData, 1000);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('storage', loadData);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const scrollToTop = () => {
    playBtnTap();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearRecentlyViewed = () => {
    playBtnTap();
    localStorage.removeItem('cakeurban_recently_viewed');
    setRecentlyViewed([]);
    toast.success("Recently viewed history cleared! 🧹");
  };

  return (
    <>
      {/* =========================================================
          DESKTOP RIGHT RAIL FLOATING ACTIONS
          ========================================================= */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3.5 select-none">
        
        {/* Rail Capsule wrapper */}
        <div className="bg-[#120806]/80 backdrop-blur-md border border-white/10 p-2.5 rounded-3xl flex flex-col gap-3 shadow-2xl shadow-black/50">
          
          {/* Wishlist Button */}
          <Link to="/shop?collection=wishlist" onClick={playBtnTap} className="relative group">
            <div className="w-11 h-11 rounded-xl bg-white/5 hover:bg-pink-600/10 hover:border-pink-500/30 border border-white/5 flex items-center justify-center text-slate-300 hover:text-pink-400 transition-all duration-300 cursor-pointer">
              <Heart className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1.5 rounded-full bg-pink-500 border border-[#120806] text-white text-[9px] font-black flex items-center justify-center animate-bounce">
                  {wishlistCount}
                </span>
              )}
            </div>
            {/* Premium Tooltip */}
            <div className="absolute right-14 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#140603] border border-white/10 text-[10px] font-black uppercase tracking-wider text-white opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap shadow-xl">
              My Wishlist
            </div>
          </Link>

          {/* Cart Button */}
          <Link to="/cart" onClick={playBtnTap} className="relative group">
            <div className="w-11 h-11 rounded-xl bg-white/5 hover:bg-amber-600/10 hover:border-amber-500/30 border border-white/5 flex items-center justify-center text-slate-300 hover:text-amber-400 transition-all duration-300 cursor-pointer">
              <ShoppingBag className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1.5 rounded-full bg-amber-500 border border-[#120806] text-white text-[9px] font-black flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="absolute right-14 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#140603] border border-white/10 text-[10px] font-black uppercase tracking-wider text-white opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap shadow-xl">
              Shopping Cart
            </div>
          </Link>

          {/* Recently Viewed Button */}
          <button 
            onClick={() => {
              setIsRecentOpen(true);
              playBtnTap();
            }}
            className="relative group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-xl bg-white/5 hover:bg-purple-600/10 hover:border-purple-500/30 border border-white/5 flex items-center justify-center text-slate-300 hover:text-purple-400 transition-all duration-300 cursor-pointer">
              <History className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
              {recentlyViewed.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-purple-500 border border-[#120806]" />
              )}
            </div>
            <div className="absolute right-14 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#140603] border border-white/10 text-[10px] font-black uppercase tracking-wider text-white opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap shadow-xl">
              Recently Viewed
            </div>
          </button>

          {/* Divider */}
          <div className="w-full h-px bg-white/10" />

          {/* WhatsApp Direct Care */}
          <a 
            href="https://wa.me/917318531953?text=Hi%20CakeUrban,%20I%20would%20like%20to%20order%20a%20luxury%20cake."
            target="_blank"
            rel="noreferrer"
            onClick={playBtnTap}
            className="relative group"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/30 border border-emerald-500/20 flex items-center justify-center text-emerald-400 transition-all duration-300 cursor-pointer">
              <MessageSquare className="w-4.5 h-4.5" />
            </div>
            <div className="absolute right-14 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#140603] border border-white/10 text-[10px] font-black uppercase tracking-wider text-white opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap shadow-xl">
              WhatsApp Support
            </div>
          </a>

          {/* Hotline Call */}
          <a 
            href="tel:+917318531953"
            onClick={playBtnTap}
            className="relative group"
          >
            <div className="w-11 h-11 rounded-xl bg-indigo-600/15 hover:bg-indigo-600/30 border border-indigo-500/20 flex items-center justify-center text-indigo-400 transition-all duration-300 cursor-pointer">
              <Phone className="w-4.5 h-4.5" />
            </div>
            <div className="absolute right-14 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#140603] border border-white/10 text-[10px] font-black uppercase tracking-wider text-white opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap shadow-xl">
              Call Hotline Desk
            </div>
          </a>

        </div>

        {/* Scroll To Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={scrollToTop}
              className="w-11 h-11 rounded-xl bg-[#DFB15B] hover:bg-white text-[#140603] flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer focus:outline-none"
            >
              <ArrowUp className="w-4.5 h-4.5" />
            </motion.button>
          )}
        </AnimatePresence>

      </div>

      {/* =========================================================
          RECENTLY VIEWED GLASS SLIDE-OUT DRAWER
          ========================================================= */}
      <AnimatePresence>
        {isRecentOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRecentOpen(false)}
              className="fixed inset-0 bg-black z-50 pointer-events-auto"
            />

            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] bg-[#120806]/98 backdrop-blur-3xl border-l border-white/10 z-50 flex flex-col text-left shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-purple-400" />
                  <h4 className="text-base font-black text-white uppercase tracking-wider">Browsing History</h4>
                </div>
                <button 
                  onClick={() => setIsRecentOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {recentlyViewed.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/5 flex items-center justify-center">
                      <History className="w-6 h-6 text-slate-500" />
                    </div>
                    <div>
                      <h5 className="text-sm font-black text-slate-300">History is empty</h5>
                      <p className="text-xs text-slate-500 max-w-xs mt-1">
                        Any luxurious cakes or desserts you view will appear here for seamless comparison.
                      </p>
                    </div>
                    <Link to="/shop" onClick={() => setIsRecentOpen(false)}>
                      <button className="h-10 px-5 rounded-xl bg-[#DFB15B] text-[#140603] text-[9px] font-black uppercase tracking-wider hover:bg-white transition-colors cursor-pointer">
                        Explore Shop
                      </button>
                    </Link>
                  </div>
                ) : (
                  recentlyViewed.map((item, idx) => (
                    <div key={idx} className="group relative flex items-center gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 hover:bg-white/[0.04] transition-all">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-16 rounded-xl object-cover" 
                      />
                      <div className="flex-1 space-y-1 overflow-hidden">
                        <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest block">{item.flavor || 'Artisanal Flavor'}</span>
                        <h5 className="text-xs sm:text-sm font-black text-white truncate">{item.name}</h5>
                        <p className="text-xs font-black text-[#DFB15B] font-mono">₹{item.price}</p>
                      </div>
                      <Link 
                        to={`/product/${item.id}`}
                        onClick={() => setIsRecentOpen(false)}
                        className="opacity-0 group-hover:opacity-100 p-2 rounded-xl bg-purple-600/25 border border-purple-500/30 text-purple-400 hover:text-white transition-all cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              {recentlyViewed.length > 0 && (
                <div className="p-6 border-t border-white/5 bg-white/[0.01] space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                    <span>Total items: {recentlyViewed.length}</span>
                    <button 
                      onClick={handleClearRecentlyViewed}
                      className="text-pink-400 hover:text-pink-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All</span>
                    </button>
                  </div>
                  <Link to="/shop" onClick={() => setIsRecentOpen(false)} className="block">
                    <button className="w-full h-11 rounded-xl border border-white/10 hover:border-purple-500/40 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                      <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                      <span>Compare More Cakes</span>
                    </button>
                  </Link>
                </div>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
