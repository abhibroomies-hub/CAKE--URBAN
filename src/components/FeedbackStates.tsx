import React from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Home, 
  Sparkles, 
  RefreshCw, 
  Compass, 
  ArrowLeft,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { playBtnTap } from '../lib/sound';

/* =========================================================
    1. SKELETON LOADING COMPONENTS
   ========================================================= */

export function SkeletonCard() {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 space-y-4 animate-pulse overflow-hidden relative">
      {/* Light shimmer gradient reflection */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full animate-glossy-sheen pointer-events-none" />
      
      {/* Product Image placeholder */}
      <div className="aspect-square w-full rounded-2xl bg-white/5" />
      
      {/* Title & Flavor line */}
      <div className="space-y-2">
        <div className="h-3 w-1/3 rounded bg-white/10" />
        <div className="h-4.5 w-3/4 rounded-md bg-white/10" />
      </div>

      {/* Description lines */}
      <div className="space-y-1.5 pt-1">
        <div className="h-2.5 w-full rounded bg-white/5" />
        <div className="h-2.5 w-5/6 rounded bg-white/5" />
      </div>

      {/* Footer / Price & Button */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="h-4 w-1/4 rounded bg-white/10" />
        <div className="h-8 w-24 rounded-xl bg-white/10" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
}


/* =========================================================
    2. PREMIUM EMPTY STATES
   ========================================================= */

interface EmptyStateProps {
  type: 'cart' | 'wishlist' | 'search';
  onCtaClick?: () => void;
  searchQuery?: string;
}

export function EmptyState({ type, onCtaClick, searchQuery }: EmptyStateProps) {
  const configs = {
    cart: {
      icon: ShoppingBag,
      title: "Your Cart is as Light as Meringue",
      desc: "Let's add some heavy chocolate layers, fresh strawberries, and premium gold brushstrokes to sweeten up your cart!",
      ctaText: "Explore Best Sellers",
      link: "/shop",
      colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/20"
    },
    wishlist: {
      icon: Heart,
      title: "Your Wishlist is Dreaming of Frosting",
      desc: "Save your favorite customized cakes, gourmet hampers, and single-slice treats here so they stay fresh in your memory.",
      ctaText: "Browse Collection",
      link: "/shop",
      colorClass: "text-pink-400 bg-pink-500/10 border-pink-500/20"
    },
    search: {
      icon: Search,
      title: "No Cakes Found in This Orbit",
      desc: searchQuery 
        ? `We couldn't locate any artisanal bakes matching "${searchQuery}". Our master pâtissiers are waiting to design it custom for you!`
        : "Our gourmet search radar couldn't find matches. Try adjusting your flavor filters or request a bespoke design.",
      ctaText: "Brief the Chef",
      link: "/custom-order",
      colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/20"
    }
  };

  const current = configs[type];
  const Icon = current.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-md mx-auto py-16 px-6 text-center space-y-6 bg-[#120806]/40 backdrop-blur-md border border-white/5 rounded-[36px] shadow-xl"
    >
      <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center border ${current.colorClass} shadow-lg`}>
        <Icon className="w-6 h-6 animate-pulse" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug">
          {current.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold">
          {current.desc}
        </p>
      </div>

      <div className="pt-2">
        <Link to={current.link} onClick={() => { playBtnTap(); if (onCtaClick) onCtaClick(); }}>
          <button className="h-11 px-8 rounded-xl bg-[#DFB15B] hover:bg-white text-[#140603] text-[9px] font-black uppercase tracking-widest shadow-md transition-colors flex items-center justify-center gap-2 mx-auto cursor-pointer">
            <Sparkles className="w-3.5 h-3.5 fill-[#140603]/10" />
            <span>{current.ctaText}</span>
          </button>
        </Link>
      </div>
    </motion.div>
  );
}


/* =========================================================
    3. PREMIUM 404 NOT FOUND ERROR VIEW
   ========================================================= */

export function NotFoundView() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[75vh] w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 relative overflow-hidden text-left">
      {/* Background radial soft light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none select-none" />
      
      <div className="max-w-2xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#120806]/60 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 sm:p-12 shadow-2xl relative z-10">
        
        {/* Left Column: Funny golden cookie crumbling vector */}
        <div className="md:col-span-5 flex justify-center relative">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-40 h-40 rounded-full bg-gradient-to-br from-[#DFB15B]/20 to-[#DE9088]/20 border border-[#DFB15B]/30 flex flex-col items-center justify-center p-4 shadow-xl text-center relative overflow-hidden"
          >
            {/* Soft inner glow */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/30 pointer-events-none" />
            
            {/* Giant cookie character face */}
            <span className="text-5xl select-none filter drop-shadow">🍪</span>
            <span className="text-[10px] uppercase font-black tracking-widest text-[#DFB15B] mt-2 block animate-pulse">Oh Crumbs!</span>
            <div className="absolute bottom-2 flex justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DFB15B]/50 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#DFB15B]/50 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#DFB15B]/50 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        </div>

        {/* Right Column: Text & Buttons */}
        <div className="md:col-span-7 space-y-5">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-pink-400">Error 404: Recipe Lost</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Oh Crumbs! This Page Has Crumbled.
            </h2>
          </div>
          
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold">
            It seems our digital oven couldn't locate this specific recipe, design, or path. The page may have been eaten, renamed, or never fully baked. Let's get you back to delicious safety!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link to="/" onClick={playBtnTap} className="flex-1">
              <button className="w-full h-11 rounded-xl bg-[#DFB15B] hover:bg-white text-[#140603] text-[9px] font-black uppercase tracking-widest shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                <Home className="w-3.5 h-3.5" />
                <span>Home Atelier</span>
              </button>
            </Link>
            
            <Link to="/shop" onClick={playBtnTap} className="flex-1">
              <button className="w-full h-11 rounded-xl border border-white/10 hover:border-[#DFB15B] text-slate-300 hover:text-white text-[9px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                <span>Explore Daily Bakes</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}


/* =========================================================
    4. PREMIUM 500 SERVER ERROR VIEW
   ========================================================= */

export function ServerErrorView() {
  const handleRetry = () => {
    playBtnTap();
    window.location.reload();
  };

  return (
    <div className="min-h-[75vh] w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 relative overflow-hidden text-left">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[100px] pointer-events-none select-none" />
      
      <div className="max-w-2xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#120806]/60 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 sm:p-12 shadow-2xl relative z-10">
        
        {/* Left Column: Drops cake emoji */}
        <div className="md:col-span-5 flex justify-center">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, -3, 3, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-40 h-40 rounded-full bg-gradient-to-br from-pink-500/10 to-red-500/10 border border-pink-500/20 flex flex-col items-center justify-center p-4 shadow-xl text-center relative overflow-hidden"
          >
            <span className="text-5xl select-none filter drop-shadow">🎂💥</span>
            <span className="text-[10px] uppercase font-black tracking-widest text-pink-400 mt-2 block animate-pulse">Chef Meltdown!</span>
          </motion.div>
        </div>

        {/* Right Column: Text & Buttons */}
        <div className="md:col-span-7 space-y-5">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Error 500: Molten Core
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Our Oven Faced a Molten Meltdown.
            </h2>
          </div>
          
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold">
            Oh dear! It appears our chef dropped the triple-layer chocolate cream frosting directly onto the server wiring. The kitchen is highly responsive, but we are cleaning up the molten crumbs swiftly. Please retry your connection.
          </p>

          <div className="pt-2">
            <button
              onClick={handleRetry}
              className="h-11 px-8 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 active:scale-[0.98] text-white text-[9px] font-black uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Retry Kitchen Connection</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
