import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Maximize2, 
  Star, 
  ShoppingCart, 
  Plus, 
  Activity, 
  Check, 
  Flame, 
  Info, 
  Bookmark,
  Sparkles
} from 'lucide-react';
import { Product } from '../types';
import { getProductSpecs } from '../lib/shopData';
import { playBtnTap, playSuccessChime } from '../lib/sound';
import { toast } from 'sonner';

interface ProductComparisonProps {
  compareList: Product[];
  onRemoveCompare: (id: string, e?: React.MouseEvent) => void;
  onClearCompare: () => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  onQuickAdd: (prod: Product, e: React.MouseEvent) => void;
}

export default function ProductComparison({
  compareList,
  onRemoveCompare,
  onClearCompare,
  isOpen,
  setIsOpen,
  onQuickAdd
}: ProductComparisonProps) {

  if (compareList.length === 0) return null;

  return (
    <>
      {/* ---------------------------------------------------------
          FLOATING COMPARE BAR (Bottom Right, Glass Card)
          --------------------------------------------------------- */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ y: 100, scale: 0.9, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 100, scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-white/70 backdrop-blur-3xl border border-white/80 rounded-[28px] shadow-[0_20px_50px_rgba(131,56,236,0.15)] p-4 flex items-center gap-4 max-w-sm md:max-w-md"
          >
            {/* Circle Thumbnails Strip */}
            <div className="flex -space-x-3 overflow-hidden">
              {compareList.map((prod) => (
                <div key={prod.id} className="relative group flex-shrink-0">
                  <img 
                    src={prod.images[0]} 
                    alt={prod.name} 
                    className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-md transition-transform duration-300 group-hover:-translate-y-1" 
                  />
                  <button
                    onClick={(e) => onRemoveCompare(prod.id, e)}
                    className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-pink-600 shadow transition-colors"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Counts info */}
            <div className="text-left flex-1 min-w-0">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider leading-none">Contrasting Board</h4>
              <p className="text-[10px] text-purple-600 font-extrabold mt-1">{compareList.length} of 4 Luxury Choices</p>
            </div>

            {/* CTA Compare Button */}
            <button
              onClick={() => { setIsOpen(true); playSuccessChime(); }}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-md flex items-center gap-1 transition-all cursor-pointer"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Compare</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------------
          FULLSCREEN COMPARISON DIALOG MATRIX (Apple Spec Style)
          --------------------------------------------------------- */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 overflow-y-auto px-4 py-8 md:p-8 flex items-start justify-center">
            
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.97 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white rounded-[40px] border border-slate-100 shadow-2xl max-w-6xl w-full p-6 md:p-10 space-y-8 relative overflow-hidden"
            >
              {/* Close Button Top */}
              <button
                onClick={() => { setIsOpen(false); playBtnTap(); }}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title Header */}
              <div className="text-left space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 fill-indigo-100 animate-spin" />
                  Gourmet spec analysis
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Luxury Confection Contrast Board</h3>
                <p className="text-xs text-slate-400 font-medium">Contrasting technical parameters, botanical ingredients, and organic properties side by side.</p>
              </div>

              {/* Specs Comparison Table Scrollbox */}
              <div className="overflow-x-auto pb-4 scrollbar-thin">
                <table className="w-full min-w-[700px] border-collapse text-left">
                  
                  {/* Table Sticky Header Row (Main photos and title) */}
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="w-48 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 align-bottom">Specification Matrix</th>
                      {compareList.map((prod) => (
                        <th key={prod.id} className="p-4 w-60 min-w-[200px] align-bottom">
                          <div className="space-y-3 relative group">
                            
                            {/* Remove button */}
                            <button
                              onClick={(e) => onRemoveCompare(prod.id, e)}
                              className="absolute top-0 right-0 w-6 h-6 rounded-full bg-slate-100 hover:bg-rose-500 text-slate-500 hover:text-white flex items-center justify-center shadow-sm transition-colors cursor-pointer"
                              title="Remove from comparison"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>

                            <img 
                              src={prod.images[0]} 
                              alt={prod.name} 
                              className="w-full h-32 object-cover rounded-2xl shadow-sm border border-slate-100" 
                            />
                            
                            <div className="space-y-1">
                              <h4 className="text-xs font-black text-slate-900 line-clamp-1 leading-tight">{prod.name}</h4>
                              <div className="text-xs font-black text-slate-900 font-mono">₹{prod.price}</div>
                            </div>

                            <button
                              onClick={(e) => onQuickAdd(prod, e)}
                              className="w-full py-2 bg-pink-50 hover:bg-pink-100 border border-pink-100 text-pink-600 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>Quick Add</span>
                            </button>

                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* Specification Table Rows */}
                  <tbody className="divide-y divide-slate-100/60 text-xs text-slate-700 font-medium">
                    
                    {/* Row 1: Primary Flavor */}
                    <tr>
                      <td className="py-4 font-black text-slate-500 uppercase text-[10px] tracking-wider">Primary Flavor</td>
                      {compareList.map((prod) => (
                        <td key={prod.id} className="p-4 text-slate-800 font-bold">{prod.flavors.join(', ')}</td>
                      ))}
                    </tr>

                    {/* Row 2: Standard Rating */}
                    <tr>
                      <td className="py-4 font-black text-slate-500 uppercase text-[10px] tracking-wider">Atelier Rating</td>
                      {compareList.map((prod) => (
                        <td key={prod.id} className="p-4">
                          <div className="flex items-center gap-1 text-slate-800 font-black">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{prod.rating || '4.8'}</span>
                            <span className="text-[10px] text-slate-400 font-bold">({prod.reviewsCount || '120'} reviews)</span>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Row 3: Nutritional Energy (Calories) */}
                    <tr>
                      <td className="py-4 font-black text-slate-500 uppercase text-[10px] tracking-wider flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-rose-500" />
                        <span>Calories</span>
                      </td>
                      {compareList.map((prod) => (
                        <td key={prod.id} className="p-4 font-mono font-bold text-slate-800">
                          {getProductSpecs(prod).calories} kcal <span className="text-[10px] text-slate-400 font-normal">/ slice</span>
                        </td>
                      ))}
                    </tr>

                    {/* Row 4: Net Weight Options */}
                    <tr>
                      <td className="py-4 font-black text-slate-500 uppercase text-[10px] tracking-wider">Weight Options</td>
                      {compareList.map((prod) => (
                        <td key={prod.id} className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {prod.weights?.map(w => (
                              <span key={w} className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-600 font-mono">
                                {w} KG
                              </span>
                            )) || "Custom"}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Row 5: Dietary Suitability */}
                    <tr>
                      <td className="py-4 font-black text-slate-500 uppercase text-[10px] tracking-wider">Diet Suitability</td>
                      {compareList.map((prod) => (
                        <td key={prod.id} className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {prod.dietary?.map(d => (
                              <span key={d} className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 text-[9px] font-black text-emerald-700 uppercase tracking-wider">
                                {d}
                              </span>
                            )) || <span className="text-slate-400">Regular</span>}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Row 6: Ingredients Checklist */}
                    <tr>
                      <td className="py-4 font-black text-slate-500 uppercase text-[10px] tracking-wider">Premium Ingredients</td>
                      {compareList.map((prod) => (
                        <td key={prod.id} className="p-4 text-left">
                          <ul className="space-y-1 list-disc list-inside text-[11px] leading-tight text-slate-600">
                            {getProductSpecs(prod).ingredients.map((ing, i) => (
                              <li key={i}>{ing}</li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>

                    {/* Row 7: Shelf Life */}
                    <tr>
                      <td className="py-4 font-black text-slate-500 uppercase text-[10px] tracking-wider">Shelf Life</td>
                      {compareList.map((prod) => (
                        <td key={prod.id} className="p-4 text-slate-600 text-[11px] font-medium">
                          {getProductSpecs(prod).shelfLife}
                        </td>
                      ))}
                    </tr>

                    {/* Row 8: Prep Speed */}
                    <tr>
                      <td className="py-4 font-black text-slate-500 uppercase text-[10px] tracking-wider">Baking Lead-Time</td>
                      {compareList.map((prod) => (
                        <td key={prod.id} className="p-4 text-slate-800 font-bold">
                          {getProductSpecs(prod).prepTime}
                        </td>
                      ))}
                    </tr>

                    {/* Row 9: Customization Support */}
                    <tr>
                      <td className="py-4 font-black text-slate-500 uppercase text-[10px] tracking-wider">Atelier Customization</td>
                      {compareList.map((prod) => (
                        <td key={prod.id} className="p-4">
                          {prod.isCustomizable ? (
                            <span className="inline-flex items-center gap-1 text-purple-600 font-black">
                              <Check className="w-4 h-4" /> Full Support
                            </span>
                          ) : (
                            <span className="text-slate-400 font-bold">Standard Only</span>
                          )}
                        </td>
                      ))}
                    </tr>

                  </tbody>
                </table>
              </div>

              {/* Bottom control button */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => { onClearCompare(); setIsOpen(false); playBtnTap(); }}
                  className="px-6 py-2.5 rounded-full border border-slate-200 text-slate-500 hover:text-slate-800 text-xs font-black uppercase tracking-wider transition-colors"
                >
                  Clear Board
                </button>
                <button
                  onClick={() => { setIsOpen(false); playBtnTap(); }}
                  className="px-8 py-2.5 rounded-full bg-slate-900 text-white text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition-all"
                >
                  Back to Catalogue
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
