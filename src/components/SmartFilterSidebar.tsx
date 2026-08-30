import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  RotateCcw, 
  ChevronDown, 
  Star, 
  SlidersHorizontal,
  Flame,
  Award,
  Zap,
  Tag,
  Clock,
  Activity,
  Award as Crown,
  Bookmark,
  CheckCircle2
} from 'lucide-react';
import { playBtnTap, playSlidePop } from '../lib/sound';

interface SmartFilterSidebarProps {
  // Category
  categoriesList?: string[];
  selectedCategories: string[];
  setSelectedCategories: (cats: string[]) => void;
  // Occasion
  selectedOccasions: string[];
  setSelectedOccasions: (occs: string[]) => void;
  // Flavor
  selectedFlavors: string[];
  setSelectedFlavors: (flvs: string[]) => void;
  // Weight
  selectedWeights: number[];
  setSelectedWeights: (wts: number[]) => void;
  // Price
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  // Rating
  selectedRatings: number[];
  setSelectedRatings: (rats: number[]) => void;
  // Prep
  selectedPrepTimes: string[];
  setSelectedPrepTimes: (times: string[]) => void;
  // Delivery
  selectedDeliveryTimes: string[];
  setSelectedDeliveryTimes: (deliv: string[]) => void;
  // Diet
  selectedDiets: string[];
  setSelectedDiets: (diets: string[]) => void;
  // Premium
  selectedPremiumTiers: string[];
  setSelectedPremiumTiers: (tiers: string[]) => void;
  // Gold Premium toggle
  isPremiumOnly: boolean;
  setIsPremiumOnly: (val: boolean) => void;
  
  // Responsive Drawer props
  isOpen?: boolean;
  onClose?: () => void;
  totalCount: number;
}

const CATEGORIES = ["Cakes", "Cupcakes", "Desserts", "Gift Hampers", "Bento & Mini Cakes", "Premium Collection", "Regular Cakes", "Pinata Cakes"];
const OCCASIONS = ["Birthday", "Anniversary", "Wedding", "Kids", "Festival", "Corporate"];
const FLAVORS = [
  { name: "Chocolate", hex: "#4A2c11" },
  { name: "Red Velvet", hex: "#900A22" },
  { name: "Blueberry", hex: "#415A77" },
  { name: "Vanilla", hex: "#F3E9DC" },
  { name: "Butterscotch", hex: "#C68B59" },
  { name: "Strawberry", hex: "#FF8FA3" },
  { name: "Ferrero", hex: "#5C3D2E" },
  { name: "Mango", hex: "#FFB703" }
];
const WEIGHTS = [0.1, 0.2, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0];
const RATINGS = [5.0, 4.8, 4.5, 4.0];
const PREP_TIMES = ["Express (1-2h)", "Standard (3-4h)", "Designer (6-12h)"];
const DELIVERY_OPTIONS = ["Same Day", "Midnight", "Express"];
const DIET_OPTIONS = ["Eggless", "Sugar Free", "Gluten Free", "Vegan"];
const PREMIUM_TIERS = ["Chef Special", "New Arrival", "Trending", "Best Seller", "Limited Edition"];

export default function SmartFilterSidebar({
  categoriesList,
  selectedCategories, setSelectedCategories,
  selectedOccasions, setSelectedOccasions,
  selectedFlavors, setSelectedFlavors,
  selectedWeights, setSelectedWeights,
  priceRange, setPriceRange,
  selectedRatings, setSelectedRatings,
  selectedPrepTimes, setSelectedPrepTimes,
  selectedDeliveryTimes, setSelectedDeliveryTimes,
  selectedDiets, setSelectedDiets,
  selectedPremiumTiers, setSelectedPremiumTiers,
  isPremiumOnly, setIsPremiumOnly,
  isOpen = false,
  onClose,
  totalCount
}: SmartFilterSidebarProps) {

  const effectiveCategories = categoriesList && categoriesList.length > 0 ? categoriesList : CATEGORIES;

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedOccasions([]);
    setSelectedFlavors([]);
    setSelectedWeights([]);
    setPriceRange([500, 5000]);
    setSelectedRatings([]);
    setSelectedPrepTimes([]);
    setSelectedDeliveryTimes([]);
    setSelectedDiets([]);
    setSelectedPremiumTiers([]);
    setIsPremiumOnly(false);
    playBtnTap();
  };

  const toggleArrayItem = <T,>(arr: T[], setArr: (items: T[]) => void, item: T) => {
    playSlidePop();
    if (arr.includes(item)) {
      setArr(arr.filter(x => x !== item));
    } else {
      setArr([...arr, item]);
    }
  };

  const renderFilterContent = () => (
    <div className="space-y-8 pb-12 pr-1">
      
      {/* Reset Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-800" />
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Refine Options</h3>
        </div>
        <button
          onClick={handleResetFilters}
          className="text-[10px] font-black uppercase text-pink-600 hover:text-pink-800 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* STRIPE-STYLE GOLD LUXURY PREMIUM TOGGLE */}
      <div className="p-4 bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/20 rounded-2xl flex items-center justify-between shadow-sm">
        <div className="text-left">
          <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider flex items-center gap-1">
            <Crown className="w-3.5 h-3.5 fill-amber-100 animate-pulse" />
            Bespoke Atelier
          </span>
          <span className="text-xs font-black text-slate-800 block mt-0.5">Premium Collections</span>
        </div>
        <button
          onClick={() => { setIsPremiumOnly(!isPremiumOnly); playSlidePop(); }}
          className={`w-12 h-6 rounded-full p-0.5 transition-all cursor-pointer ${
            isPremiumOnly ? 'bg-amber-500 shadow-md shadow-amber-500/30' : 'bg-slate-200'
          }`}
        >
          <div className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-all duration-300 ${
            isPremiumOnly ? 'translate-x-6' : 'translate-x-0'
          }`} />
        </button>
      </div>

      {/* FILTER GROUP: Categories */}
      <div className="space-y-3 text-left">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Category Suite</label>
        <div className="flex flex-wrap gap-1.5">
          {effectiveCategories.map(cat => {
            const active = selectedCategories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleArrayItem(selectedCategories, setSelectedCategories, cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  active 
                    ? 'bg-purple-600 border-purple-600 text-white shadow-sm shadow-purple-600/10' 
                    : 'bg-white border-slate-100 hover:border-purple-300 text-slate-600 hover:text-purple-600'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTER GROUP: Occasions (Icon Style Pill) */}
      <div className="space-y-3 text-left">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Celebrate Occasion</label>
        <div className="grid grid-cols-2 gap-2">
          {OCCASIONS.map(occ => {
            const active = selectedOccasions.includes(occ);
            return (
              <button
                key={occ}
                onClick={() => toggleArrayItem(selectedOccasions, setSelectedOccasions, occ)}
                className={`py-2 px-3 border rounded-xl text-xs font-black text-left flex items-center justify-between transition-all ${
                  active 
                    ? 'bg-slate-950 border-slate-950 text-white shadow-md' 
                    : 'bg-white border-slate-100 hover:border-slate-300 text-slate-700'
                }`}
              >
                <span>{occ}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTER GROUP: Flavor Color Chips with Ripple Hover */}
      <div className="space-y-3 text-left">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Flavors Palette</label>
        <div className="grid grid-cols-2 gap-2">
          {FLAVORS.map(flv => {
            const active = selectedFlavors.includes(flv.name);
            return (
              <button
                key={flv.name}
                onClick={() => toggleArrayItem(selectedFlavors, setSelectedFlavors, flv.name)}
                className={`p-2 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                  active 
                    ? 'bg-pink-50 border-pink-400 text-pink-900 shadow-sm' 
                    : 'bg-white border-slate-100 hover:border-slate-300 text-slate-600'
                }`}
              >
                <span 
                  className="w-3.5 h-3.5 rounded-full border border-black/5 block flex-shrink-0" 
                  style={{ backgroundColor: flv.hex }} 
                />
                <span className="truncate">{flv.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTER GROUP: Range Slider */}
      <div className="space-y-3 text-left bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Budget Limit</label>
          <span className="text-xs font-mono font-black text-pink-600 bg-white px-2 py-0.5 rounded-md border border-slate-100 shadow-sm">
            Max ₹{priceRange[1]}
          </span>
        </div>
        <div className="pt-2">
          <input 
            type="range"
            min="200"
            max="5000"
            step="100"
            value={priceRange[1]}
            onChange={(e) => {
              setPriceRange([priceRange[0], Number(e.target.value)]);
              // playSlidePop();
            }}
            className="w-full accent-pink-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-bold text-slate-400 mt-1.5">
            <span>₹200</span>
            <span>₹2500</span>
            <span>₹5000+</span>
          </div>
        </div>
      </div>

      {/* FILTER GROUP: Diets (Eggless / Sugar Free / Gluten Free / Vegan) */}
      <div className="space-y-3 text-left">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Dietary Options</label>
        <div className="space-y-2">
          {DIET_OPTIONS.map(diet => {
            const active = selectedDiets.includes(diet);
            return (
              <button
                key={diet}
                onClick={() => toggleArrayItem(selectedDiets, setSelectedDiets, diet)}
                className="w-full flex items-center justify-between text-left cursor-pointer group"
              >
                <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900">{diet} Choice</span>
                
                {/* Custom animated checkbox */}
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                  active ? 'bg-emerald-500 border-emerald-500 text-white scale-105' : 'bg-white border-slate-200 hover:border-slate-400'
                }`}>
                  {active && (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTER GROUP: Premium Badges (Chef Special, Limited, Bestsellers) */}
      <div className="space-y-3 text-left">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Premium Badges</label>
        <div className="grid grid-cols-2 gap-2">
          {PREMIUM_TIERS.map(tier => {
            const active = selectedPremiumTiers.includes(tier);
            return (
              <button
                key={tier}
                onClick={() => toggleArrayItem(selectedPremiumTiers, setSelectedPremiumTiers, tier)}
                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between h-14 relative overflow-hidden transition-all group ${
                  active 
                    ? 'bg-purple-600 border-purple-600 text-white shadow-md' 
                    : 'bg-white border-slate-100 hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="text-[10px] font-black uppercase tracking-wide truncate">{tier}</div>
                <div className={`text-[8px] ${active ? 'text-purple-200' : 'text-slate-400'}`}>Official Tag</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTER GROUP: Weights (Pills Grid) */}
      <div className="space-y-3 text-left">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Net Weights</label>
        <div className="grid grid-cols-4 gap-1.5">
          {WEIGHTS.map(w => {
            const active = selectedWeights.includes(w);
            return (
              <button
                key={w}
                onClick={() => toggleArrayItem(selectedWeights, setSelectedWeights, w)}
                className={`py-1.5 rounded-lg text-xs font-mono font-black border text-center transition-all ${
                  active 
                    ? 'bg-pink-600 border-pink-600 text-white shadow-inner scale-95' 
                    : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                }`}
              >
                {w}kg
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTER GROUP: Rating Star Chips */}
      <div className="space-y-3 text-left">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Rating Threshold</label>
        <div className="space-y-1.5">
          {RATINGS.map(rate => {
            const active = selectedRatings.includes(rate);
            return (
              <button
                key={rate}
                onClick={() => toggleArrayItem(selectedRatings, setSelectedRatings, rate)}
                className={`w-full p-2 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                  active 
                    ? 'bg-amber-500/10 border-amber-500 text-amber-900 shadow-sm' 
                    : 'bg-white border-slate-100 hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{rate.toFixed(1)}+ Luxury Rating</span>
                </div>
                {active && <CheckCircle2 className="w-4 h-4 text-amber-500 fill-current" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTER GROUP: Preparation Time Speed */}
      <div className="space-y-3 text-left">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Baking Preparation</label>
        <div className="space-y-1.5">
          {PREP_TIMES.map(time => {
            const active = selectedPrepTimes.includes(time.split(' ')[0]);
            return (
              <button
                key={time}
                onClick={() => toggleArrayItem(selectedPrepTimes, setSelectedPrepTimes, time.split(' ')[0])}
                className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                  active 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                    : 'bg-white border-slate-100 hover:border-slate-300 text-slate-600'
                }`}
              >
                <span>{time}</span>
                <Clock className="w-3.5 h-3.5 opacity-60" />
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTER GROUP: Delivery Schedule Option */}
      <div className="space-y-3 text-left">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Delivery Speeds</label>
        <div className="grid grid-cols-3 gap-2">
          {DELIVERY_OPTIONS.map(opt => {
            const active = selectedDeliveryTimes.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => toggleArrayItem(selectedDeliveryTimes, setSelectedDeliveryTimes, opt)}
                className={`py-2 px-1 border rounded-xl text-[10px] font-black text-center transition-all ${
                  active 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                    : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* DESKTOP STICKY SIDEBAR (320px) */}
      <div className="hidden lg:block w-[320px] flex-shrink-0 h-fit sticky top-28 bg-white/40 backdrop-blur-md p-6 rounded-[32px] border border-white/60 shadow-lg">
        {renderFilterContent()}
      </div>

      {/* TABLET DRAWER & MOBILE BOTTOM SHEET OVERLAYS */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark Mask Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black z-50 lg:hidden"
            />

            {/* Mobile Bottom Sheet (slides up) or Tablet Left Drawer */}
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 top-[20%] bg-white rounded-t-[40px] shadow-2xl z-50 overflow-hidden flex flex-col lg:hidden border-t border-slate-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="text-left">
                  <h4 className="text-base font-black text-slate-900 tracking-tight">Atelier Filters</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{totalCount} Matching Masterpieces</p>
                </div>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Filters */}
              <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
                {renderFilterContent()}
              </div>

              {/* Bottom Fixed Action Button */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/80 backdrop-blur-md flex gap-3">
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-3 rounded-full border border-slate-200 bg-white text-slate-600 text-xs font-black uppercase tracking-wider hover:bg-slate-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full text-xs font-black uppercase tracking-widest hover:brightness-105 transition-all shadow-md shadow-pink-500/20"
                >
                  Show {totalCount} Confections
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
