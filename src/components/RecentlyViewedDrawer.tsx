import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Eye, 
  Plus, 
  Gift, 
  Sparkle, 
  ChevronRight, 
  Check, 
  ChevronUp, 
  ChevronDown, 
  Volume2,
  Sparkles
} from 'lucide-react';
import { Product, CartItem } from '../types';
import { PREMIUM_ACCESSORIES } from '../lib/shopData';
import { playBtnTap, playSuccessChime } from '../lib/sound';
import { toast } from 'sonner';

interface RecentlyViewedDrawerProps {
  recentlyViewed: Product[];
  onQuickView: (prod: Product) => void;
  onAddToCart: (item: CartItem) => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export default function RecentlyViewedDrawer({
  recentlyViewed,
  onQuickView,
  onAddToCart,
  isOpen,
  setIsOpen
}: RecentlyViewedDrawerProps) {

  if (recentlyViewed.length === 0) return null;

  const handleAddAccessory = (acc: typeof PREMIUM_ACCESSORIES[0]) => {
    const item: CartItem = {
      id: acc.id,
      name: acc.name,
      price: acc.price,
      description: "Companion luxury celebration accessory",
      categories: ["Accessories"],
      images: [acc.image],
      stockStatus: "in-stock",
      isCustomizable: false,
      quantity: 1,
      flavors: [],
      occasions: [],
      eggless: false
    };

    onAddToCart(item);
    playSuccessChime();
    toast.success(`Celebration Accessory Added: ${acc.name}! 🎂`);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      
      {/* ---------------------------------------------------------
          COLLAPSED MINI DRAWER PILL TRIGGER
          --------------------------------------------------------- */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={() => { setIsOpen(true); playBtnTap(); }}
            className="px-4 py-3 bg-white/70 backdrop-blur-3xl border border-white/80 rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.06)] flex items-center gap-2.5 hover:bg-white hover:shadow-[0_20px_45px_rgba(244,63,94,0.08)] transition-all cursor-pointer text-slate-700"
          >
            <div className="relative">
              <Eye className="w-4 h-4 text-pink-500 animate-pulse" />
              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-pink-500 text-[8px] font-black text-white flex items-center justify-center font-mono">
                {recentlyViewed.length}
              </span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider">Recently Opened</span>
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------------
          EXPANDED DETAILED DRAWER SCREEN
          --------------------------------------------------------- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 280, damping: 20 }}
            className="bg-white/85 backdrop-blur-3xl border border-white/80 rounded-[32px] shadow-[0_25px_60px_-10px_rgba(0,0,0,0.12)] p-4 max-w-xs md:max-w-md w-80 md:w-96 text-left space-y-4 overflow-hidden relative"
          >
            {/* Header with Close */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-pink-500" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 leading-none">Your View History</h4>
              </div>
              <button 
                onClick={() => { setIsOpen(false); playBtnTap(); }}
                className="w-6 h-6 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Horizontal Filmstrip List */}
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
              {recentlyViewed.map((prod) => (
                <div 
                  key={prod.id}
                  onClick={() => { onQuickView(prod); playBtnTap(); }}
                  className="w-14 h-14 rounded-xl overflow-hidden relative group cursor-pointer border border-slate-100 flex-shrink-0 shadow-sm"
                  title={`View details of ${prod.name}`}
                >
                  <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>

            {/* AI COMPANION CELEBRATION CROSS-SELL OPTIONS */}
            <div className="border-t border-slate-100/60 pt-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-indigo-100 animate-pulse" />
                  AI Event Matcher
                </span>
                <span className="text-[8px] text-slate-400 font-bold uppercase">Add Celebration Essentials</span>
              </div>

              {/* Accessories Grid List */}
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-1 scrollbar-thin">
                {PREMIUM_ACCESSORIES.map((acc) => (
                  <div 
                    key={acc.id}
                    className="p-1.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all flex items-center gap-2 relative group"
                  >
                    <img src={acc.image} alt={acc.name} className="w-7 h-7 object-cover rounded-lg shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[9px] font-black text-slate-700 truncate leading-tight">{acc.name}</div>
                      <div className="text-[8px] font-mono text-purple-600 font-extrabold mt-0.5">₹{acc.price}</div>
                    </div>
                    
                    {/* Tiny inline Add Button */}
                    <button
                      onClick={() => handleAddAccessory(acc)}
                      className="w-5 h-5 rounded-md bg-purple-50 hover:bg-purple-600 text-purple-600 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                      title={`Add ${acc.name} to order`}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
