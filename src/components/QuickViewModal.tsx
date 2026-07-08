import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Plus, 
  Minus, 
  Check, 
  Clock, 
  Star, 
  Zap, 
  Volume2, 
  Info,
  DollarSign
} from 'lucide-react';
import { Product, CartItem } from '../types';
import { playBtnTap, playSlidePop, playSuccessChime } from '../lib/sound';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  wishlist: Product[];
  onToggleWishlist: (prod: Product, e?: React.MouseEvent) => void;
}

const FLAVORS_LIST = ["Chocolate Truffle", "Madagascar Vanilla", "Classic Red Velvet", "Fresh Strawberry", "Turkish Pistachio", "Wild Blueberry"];

export default function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  wishlist,
  onToggleWishlist
}: QuickViewModalProps) {
  const navigate = useNavigate();
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState(1.0);
  const [selectedFlavor, setSelectedFlavor] = useState("Chocolate Truffle");
  const [cakeMessage, setCakeMessage] = useState("");
  const [isEggless, setIsEggless] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Reset local states on product change
  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setSelectedWeight(product.weights?.[0] || 1.0);
      setSelectedFlavor(product.flavors?.[0] || "Chocolate Truffle");
      setCakeMessage("");
      setIsEggless(product.dietary?.includes("Eggless") !== false);
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  // Weight pricing multiplier helper
  const getMultiplier = (weight: number) => {
    if (weight <= 0.1) return 1.0;
    if (weight <= 0.2) return 1.0;
    if (weight === 0.5) return 1.0;
    if (weight === 1.0) return 1.8;
    if (weight === 1.5) return 2.5;
    if (weight === 2.0) return 3.2;
    if (weight === 2.5) return 3.9;
    if (weight === 3.0) return 4.5;
    return 1.0;
  };

  const basePrice = product.price;
  const weightMultiplier = getMultiplier(selectedWeight);
  const premiumAddon = isEggless ? 100 : 0; // eggless flaxseed culture addon fee
  const unitPrice = Math.round(basePrice * weightMultiplier) + premiumAddon;
  const totalPrice = unitPrice * quantity;

  const isSaved = wishlist.some(item => item.id === product.id);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    playBtnTap();
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.origin + `/product/${product.id}`
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.origin + `/product/${product.id}`);
      toast.success("Golden Link copied to clipboard! 📋");
    }
  };

  const handleConfirmAdd = (redirectToCheck = false) => {
    const item: CartItem = {
      ...product,
      price: unitPrice,
      quantity: quantity,
      selectedWeight: selectedWeight,
      selectedFlavor: selectedFlavor,
      cakeMessage: cakeMessage.trim() || undefined,
      eggless: isEggless
    };

    onAddToCart(item);
    playSuccessChime();

    if (redirectToCheck) {
      toast.success("Proceeding directly to luxury checkout! 🛍️");
      navigate('/checkout');
    } else {
      toast.success(`Added ${quantity}x ${product.name} to basket! 🧁`, {
        description: `${selectedWeight} KG • ${selectedFlavor} • ${isEggless ? '100% Eggless' : 'Premium standard'}`
      });
      onClose();
    }
  };

  const handleWishToggleClick = (e: React.MouseEvent) => {
    onToggleWishlist(product, e);
  };

  // List of available product images or defaults
  const galleryImages = product.images.length > 0 ? product.images : [
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80"
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
      
      {/* Outer Click Masks */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* MODAL MAIN CONTENT */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="bg-white/95 backdrop-blur-2xl border border-slate-100 rounded-[36px] shadow-2xl max-w-4xl w-full p-6 md:p-8 flex flex-col md:flex-row gap-8 relative z-10 text-left overflow-hidden max-h-[90vh] md:max-h-[85vh]"
      >
        {/* Absolute Top Close button for desktop */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Product Image Gallery */}
        <div className="w-full md:w-1/2 flex flex-col gap-3">
          
          {/* Main Large Visual Stage */}
          <div className="relative aspect-square w-full rounded-2xl bg-slate-50 overflow-hidden border border-slate-100">
            <motion.img
              key={activeImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={galleryImages[activeImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500 cursor-zoom-in"
            />
            
            {/* Wishlist toggle absolute */}
            <button
              onClick={handleWishToggleClick}
              className="absolute top-3 left-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-slate-500 hover:text-pink-600 transition-transform active:scale-90"
              title="Add to hearts"
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'text-pink-600 fill-current' : ''}`} />
            </button>
          </div>

          {/* Miniature Thumbnails strip */}
          {galleryImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto py-1 scrollbar-none">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onMouseEnter={() => { setActiveImageIndex(i); playSlidePop(); }}
                  onClick={() => setActiveImageIndex(i)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImageIndex === i ? 'border-pink-500 shadow' : 'border-slate-100 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details & Live Controls */}
        <div className="w-full md:w-1/2 flex flex-col justify-between overflow-y-auto pr-1 max-h-[70vh] md:max-h-none space-y-6">
          
          {/* Section 1: Name & Bio */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-pink-100 text-pink-700 text-[9px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full">
                {product.categories[0]}
              </span>
              <div className="flex items-center gap-0.5 text-amber-500 text-xs font-black">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{product.rating || '4.8'}</span>
              </div>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">{product.name}</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">{product.description}</p>
          </div>

          {/* Section 2: Weight Selection Chips */}
          {product.weights && product.weights.length > 0 && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Select Net Weight</label>
              <div className="flex flex-wrap gap-2">
                {product.weights.map(w => (
                  <button
                    key={w}
                    onClick={() => { setSelectedWeight(w); playBtnTap(); }}
                    className={`px-4 py-2 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                      selectedWeight === w 
                        ? 'bg-slate-900 border-slate-900 text-white shadow' 
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {w} KG
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Flavor Selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Select Custom Flavor</label>
            <div className="flex flex-wrap gap-1.5">
              {(product.flavors.length > 0 ? product.flavors : FLAVORS_LIST).map(fl => (
                <button
                  key={fl}
                  onClick={() => { setSelectedFlavor(fl); playBtnTap(); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    selectedFlavor === fl 
                      ? 'bg-purple-100 border-purple-400 text-purple-900' 
                      : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {fl}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Customized icing message input */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Message on Cake (Max 30 Chars)</label>
            <input
              type="text"
              maxLength={30}
              placeholder="e.g. Happy Birthday Mom! ❤️"
              value={cakeMessage}
              onChange={(e) => setCakeMessage(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:bg-white focus:border-pink-500 transition-all font-medium text-slate-800"
            />
          </div>

          {/* Section 5: Eggless Toggle Option */}
          <div className="flex justify-between items-center bg-slate-50/50 p-4 border border-slate-100 rounded-2xl">
            <div className="text-left">
              <span className="text-xs font-black text-slate-800 block">100% Chef Eggless Recipe</span>
              <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Baked using organic seed meal (+₹100)</span>
            </div>
            <button
              onClick={() => { setIsEggless(!isEggless); playSlidePop(); }}
              className={`w-12 h-6 rounded-full p-0.5 transition-all cursor-pointer ${
                isEggless ? 'bg-emerald-500 shadow-sm' : 'bg-slate-300'
              }`}
            >
              <div className={`bg-white w-5 h-5 rounded-full shadow transform transition-all duration-300 ${
                isEggless ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Section 6: Quantity Controls & Price Summary */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-5">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Calculated Total</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900 font-mono">₹{totalPrice}</span>
                {quantity > 1 && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    (₹{unitPrice} x {quantity})
                  </span>
                )}
              </div>
            </div>

            {/* Quantity counters */}
            <div className="flex items-center bg-slate-100 rounded-full p-1.5 gap-2 border border-slate-200">
              <button
                onClick={() => { if (quantity > 1) { setQuantity(q => q - 1); playBtnTap(); } }}
                className="w-7 h-7 rounded-full bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center shadow-sm"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-mono font-black text-slate-800 w-6 text-center">{quantity}</span>
              <button
                onClick={() => { setQuantity(q => q + 1); playBtnTap(); }}
                className="w-7 h-7 rounded-full bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Section 7: Action Buttons Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
            
            {/* Quick Add button with Ripple feedback */}
            <button
              onClick={() => handleConfirmAdd(false)}
              className="h-12 rounded-full border border-pink-200 bg-pink-50 hover:bg-pink-100 text-pink-600 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>

            {/* Buy Now button */}
            <button
              onClick={() => handleConfirmAdd(true)}
              className="h-12 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:brightness-110 text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-lg shadow-pink-500/20 active:scale-95"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Buy Now</span>
            </button>

          </div>

          {/* Utility Share / Info links */}
          <div className="flex items-center justify-center gap-6 pt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <button onClick={handleShare} className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Design</span>
            </button>
            <div className="flex items-center gap-1 text-slate-300">|</div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Ready in 2-4h</span>
            </div>
          </div>

        </div>

      </motion.div>
    </div>
  );
}
