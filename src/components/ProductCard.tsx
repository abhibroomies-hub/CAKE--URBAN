import React, { useState, useEffect } from 'react';
import { ShoppingCart, Eye, Star, X, Check, ArrowRight, Sparkles, Heart, Sparkle, Pencil } from 'lucide-react';
import { useCart } from '../lib/store';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { playSuccessChime, playSlidePop, playBtnTap } from '../lib/sound';
import { toast } from 'sonner';
import { handleImageError } from '../lib/utils';

export function ProductCard({ product, onEdit }: { product: Product; onEdit?: () => void }) {
  const { addItem } = useCart();
  const navigate = useNavigate();

  // Local state for heart liked status
  const [isLiked, setIsLiked] = useState(false);
  
  // Customization state for interactive weight panel
  const [selectedWeight, setSelectedWeight] = useState(0.5);
  const [isEggless, setIsEggless] = useState(true);
  const [isWeightSelecting, setIsWeightSelecting] = useState(false);
  const [pendingAction, setPendingAction] = useState<'add_to_cart' | 'buy_now' | null>(null);

  // Price calculations
  const basePrice = product.price || 699;
  const oldPrice = Math.round(basePrice * 1.25);
  const weightMultiplier = selectedWeight === 0.5 ? 1 : selectedWeight === 1 ? 1.8 : selectedWeight === 2 ? 3.4 : 5;
  const calculatedPrice = Math.round(basePrice * weightMultiplier);

  // Random Premium Badges matching deterministic product tags or IDs
  const getPremiumBadge = () => {
    if (product.isBestseller) return { text: 'BESTSELLER', grad: 'from-pink-500 to-purple-600' };
    if (product.isNew) return { text: 'NEW', grad: 'from-orange-500 to-amber-500' };
    
    // Choose based on product ID to make it feel custom and organic
    const idNum = product.id.charCodeAt(0) || 0;
    if (idNum % 4 === 0) return { text: 'CHEF SPECIAL', grad: 'from-rose-500 to-pink-600' };
    if (idNum % 4 === 1) return { text: 'LIMITED', grad: 'from-purple-600 to-indigo-600' };
    if (idNum % 4 === 2) return { text: 'PREMIUM', grad: 'from-cyan-500 to-blue-600' };
    return { text: 'EGGLESS', grad: 'from-teal-400 to-emerald-500' };
  };

  const badge = getPremiumBadge();

  // Handle direct cart addition
  const handleAddToCart = () => {
    const customizedItem = {
      ...product,
      price: calculatedPrice,
      selectedWeight,
      eggless: isEggless,
    };
    
    addItem(customizedItem);
    playSuccessChime();
    toast.success(`Savoury choice! Added ${product.name} (${selectedWeight} KG) to basket.`);
  };

  const openDirectWeightSelector = (action: 'add_to_cart' | 'buy_now') => {
    setPendingAction(action);
    setIsWeightSelecting(true);
  };

  const handleConfirmWeight = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const customizedItem = {
      ...product,
      price: calculatedPrice,
      selectedWeight,
      eggless: isEggless,
    };

    addItem(customizedItem);
    playSuccessChime();
    setIsWeightSelecting(false);
    
    if (pendingAction === 'buy_now') {
      toast.success(`Success! Preparing checkout for ${product.name}...`);
      setTimeout(() => {
        window.location.href = '/checkout';
      }, 600);
    } else {
      toast.success(`Selected! ${product.name} (${selectedWeight} KG) added to basket.`);
    }
  };

  // Safe Fallback image picker
  const imgUrl = product.images?.[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600';

  return (
    <>
      {/* 
        PREMIUM PRODUCT CARD 
        Width: 320px
        Height: 540px
        Radius: 32px
        Background: Pure White with Glassmorphism
        Border: 1px solid rgba(255,255,255,0.5)
        Shadow: 0 25px 80px rgba(0,0,0,0.08)
        Hover: Lift 12px, Shadow increase, Buttons slide up, everything animated smoothly
      */}
      <div 
        id={`product-card-${product.id}`}
        onClick={() => { playSlidePop(); navigate(`/product/${product.id}`); }}
        className="group relative w-[320px] h-[540px] rounded-[32px] bg-white border border-white/50 shadow-[0_25px_80px_rgba(0,0,0,0.08)] hover:shadow-[0_40px_90px_rgba(0,0,0,0.12)] p-6 overflow-hidden flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-3 cursor-pointer select-none"
      >
        {/* Subtle, luxurious background visual details */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-pink-50/20 to-blue-50/25 z-0 pointer-events-none" />
        {/* Soft floating blurred glow circles */}
        <div className="absolute top-[25%] left-[5%] w-36 h-36 rounded-full bg-pink-300/10 blur-2xl group-hover:bg-pink-400/15 transition-all duration-500 pointer-events-none" />
        <div className="absolute bottom-[20%] right-[5%] w-28 h-28 rounded-full bg-blue-300/10 blur-2xl group-hover:bg-blue-400/15 transition-all duration-500 pointer-events-none" />

        {/* Tiny minimal floating confetti */}
        <div className="absolute inset-0 opacity-15 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-12 left-[15%] w-1.5 h-1.5 bg-pink-400 rounded-full" />
          <div className="absolute top-28 right-[20%] w-1.5 h-1.5 bg-purple-400 rotate-45 transform" />
          <div className="absolute bottom-36 left-[12%] w-1 h-1 bg-yellow-400 rounded-full" />
          <div className="absolute bottom-24 right-[15%] w-1 h-1 bg-cyan-400" />
        </div>

        {/* TOP ROW: BADGES & WISHLIST ACTION */}
        <div className="relative z-20 flex justify-between items-center h-[48px] w-full">
          {/* Top Left Gradient Capsule Badge */}
          <div className={`h-[34px] px-[18px] rounded-full bg-gradient-to-r ${badge.grad} text-[10px] font-black text-white uppercase tracking-wider flex items-center justify-center shadow-md shadow-pink-500/10 group-hover:shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all duration-300`}>
            {badge.text}
          </div>

          {/* Top Right Wishlist & Actions */}
          <div className="flex gap-2">
            {onEdit && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  playBtnTap();
                  onEdit();
                }}
                className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-md border border-white/60 shadow-md flex items-center justify-center text-slate-500 hover:text-pink-600 transition-all duration-300 hover:scale-110 active:scale-95"
                title="Edit Product Details"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
            {/* Wishlist Glass Button (48x48) */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                playBtnTap();
                setIsLiked(!isLiked);
                if (!isLiked) {
                  toast.success(`Saved ${product.name} to your gourmet desires!`);
                } else {
                  toast.info(`Removed ${product.name} from favourites`);
                }
              }}
              className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-md border border-white/60 shadow-md flex items-center justify-center text-slate-400 hover:text-pink-600 transition-all duration-300 hover:scale-[1.15] hover:rotate-[8deg] active:scale-95"
            >
              <Heart className={`w-5 h-5 transition-all duration-300 ${isLiked ? 'fill-[#FF4FA3] text-[#FF4FA3]' : ''}`} />
            </button>
          </div>
        </div>

        {/* MID PORTION: PRODUCT FLOATING IMAGE */}
        <div className="relative h-[220px] w-full flex items-center justify-center z-10 overflow-visible mt-2">
          {/* Glow behind cake */}
          <div className="absolute w-44 h-44 rounded-full bg-pink-200/40 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          {/* Realistic shadow under cake */}
          <div className="absolute bottom-1 w-36 h-3.5 bg-black/[0.06] rounded-full blur-md group-hover:scale-110 group-hover:opacity-50 transition-all duration-300" />

          {/* Core floating illustration container */}
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <img 
              src={imgUrl} 
              alt={product.name} 
              onError={handleImageError}
              className="h-[210px] w-auto max-w-[210px] object-cover rounded-2xl shadow-xl transform transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-1"
            />
          </motion.div>

          {/* Quick View Button (Appears on Image Hover) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                playSlidePop();
                // Simulates details trigger or direct details page routing
                navigate(`/product/${product.id}`);
              }}
              className="px-4 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-lg text-slate-800 font-extrabold text-[12px] uppercase tracking-wider flex items-center gap-1.5 hover:scale-105 hover:bg-white/85 transition-all"
            >
              <Eye className="w-4 h-4 text-pink-500" />
              Quick View
            </button>
          </div>
        </div>

        {/* BOTTOM PORTION: PRODUCT INFO & ACTION SLIDE */}
        <div className="relative z-20 flex-1 flex flex-col justify-between pt-2">
          
          {/* Name & Short Description */}
          <div className="space-y-1">
            {/* Title - Max 2 Lines */}
            <h3 className="text-[24px] font-black tracking-tight text-[#111111] leading-tight line-clamp-2 min-h-[56px] group-hover:text-[#FF4FA3] transition-colors duration-300">
              {product.name}
            </h3>

            {/* Rating Row */}
            <div className="flex items-center gap-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current stroke-[1.5px]" />
                ))}
              </div>
              <span className="text-[13px] font-black text-slate-800 ml-1">4.9</span>
              <span className="text-[12px] text-slate-400 font-semibold">({product.reviewsCount || '2,435'})</span>
            </div>

            {/* Description - Max 2 Lines, Font 16px, Line Height 28px */}
            <p className="text-[15px] text-[#666666] leading-[24px] font-medium line-clamp-2 min-h-[48px] pt-1">
              {product.description || 'Rich Belgian chocolate cake layered with silky chocolate mousse and premium cocoa.'}
            </p>
          </div>

          {/* SLIDEOUT DRAWER FOR ACTION BUTTONS */}
          <div className="relative overflow-hidden h-[124px] mt-4 flex flex-col justify-end">
            
            {/* 1. Default View: Price and Delivery Pills (fades/slides up out of screen on hover) */}
            <div className="absolute inset-0 flex flex-col justify-end transition-all duration-350 ease-out group-hover:opacity-0 group-hover:-translate-y-8 pointer-events-auto group-hover:pointer-events-none">
              
              {/* Price Row */}
              <div className="flex items-center gap-2">
                <span className="text-[32px] font-black text-[#FF4FA3] tracking-tighter leading-none">
                  ₹{product.price}
                </span>
                <span className="text-[15px] text-slate-400 line-through font-semibold leading-none">
                  ₹{oldPrice}
                </span>
                <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider leading-none">
                  20% OFF
                </span>
              </div>

              {/* Delivery Tags / Pills Row */}
              <div className="flex gap-1.5 flex-wrap mt-3 overflow-hidden max-h-[34px]">
                {[
                  { icon: '🚚', label: 'Same Day' },
                  { icon: '🌙', label: 'Midnight' },
                  { icon: '🥚', label: 'Eggless' }
                ].map((pill, idx) => (
                  <span key={idx} className="bg-slate-50 border border-slate-100 shadow-sm px-2.5 py-1 rounded-full text-[11px] font-extrabold text-slate-600 flex items-center gap-1 shrink-0">
                    <span>{pill.icon}</span>
                    <span>{pill.label}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* 2. Hover Actions View: Slides up from bottom of card */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
              
              {/* Primary: Add To Cart Button (Height 58px, Gradient Pink->Purple, Rounded-full, Glow) */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  playSlidePop();
                  openDirectWeightSelector('add_to_cart');
                }}
                className="h-[58px] w-full rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-[14px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 hover:shadow-[0_8px_25px_rgba(236,72,153,0.4)] hover:scale-[1.02] active:scale-95 transition-all duration-200"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
              
              {/* Secondary: Buy Now (White, Border 2px, Hover Pink Border, Pink Text) */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  playSlidePop();
                  openDirectWeightSelector('buy_now');
                }}
                className="h-[44px] w-full rounded-full bg-white border-2 border-slate-200 hover:border-[#FF4FA3] text-slate-700 hover:text-[#FF4FA3] font-extrabold text-[12px] uppercase tracking-wider transition-all duration-200"
              >
                Buy Now
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* DETAILED INTERACTIVE WEIGHT SELECTION PANEL OVERLAY */}
      <AnimatePresence>
        {isWeightSelecting && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 24 }}
            className="fixed inset-0 md:absolute inset-0 bg-[#25120E]/95 backdrop-blur-2xl z-50 p-6 flex flex-col justify-between rounded-[32px] border border-pink-400/20 shadow-[0_-15px_40px_rgba(0,0,0,0.6)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-black tracking-[0.2em] text-[#FF4FA3]">
                  Select Cake Weight
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); playSlidePop(); setIsWeightSelecting(false); }}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Product preview line */}
              <div className="text-left space-y-0.5">
                <p className="text-sm font-black text-white truncate">{product.name}</p>
                <p className="text-[11px] text-emerald-400 font-bold block">✓ Eggless available</p>
              </div>

              {/* Weight Options Grid */}
              <div className="grid grid-cols-4 gap-1.5">
                {[0.5, 1.0, 2.0, 3.0].map((weight) => (
                  <button
                    key={weight}
                    onClick={(e) => {
                      e.stopPropagation();
                      playBtnTap();
                      setSelectedWeight(weight);
                    }}
                    className={`py-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                      selectedWeight === weight 
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-transparent shadow-md font-black scale-105' 
                        : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-pink-500/10'
                    }`}
                  >
                    <span className="text-xs font-black tracking-tighter">{weight} KG</span>
                    <span className={`text-[7px] font-black uppercase tracking-wider ${selectedWeight === weight ? 'opacity-100' : 'opacity-60'}`}>
                      {weight === 0.5 ? 'Classic' : weight === 1.0 ? 'Premium' : weight === 2.0 ? 'Party' : 'Grand'}
                    </span>
                  </button>
                ))}
              </div>

              {/* Vegetarian dietary choice switch */}
              <button
                onClick={(e) => { e.stopPropagation(); playBtnTap(); setIsEggless(!isEggless); }}
                className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2.5 rounded-xl text-left transition-colors"
              >
                <div>
                  <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest leading-none">Dietary Choice</p>
                  <p className="text-[11px] font-black text-white mt-1">{isEggless ? '100% Chef Eggless' : 'Normal Vegetarian'}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                  isEggless 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'bg-white/5 text-zinc-300 border border-white/10'
                }`}>
                  {isEggless ? '✓ Active Eggless' : 'Vegetarian Only'}
                </span>
              </button>
            </div>

            {/* Price & Confirmation */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2.5">
              <div className="text-left">
                <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest block leading-none mb-0.5">Calculated Rate</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-[#FF4FA3]">
                    ₹{calculatedPrice}
                  </span>
                  <span className="text-[8px] font-black text-zinc-400 uppercase">
                    ({selectedWeight} KG)
                  </span>
                </div>
              </div>

              <button
                onClick={handleConfirmWeight}
                className="flex-grow h-11 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110"
              >
                {pendingAction === 'buy_now' ? '⚡ Buy Now' : '✓ Add To Basket'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
