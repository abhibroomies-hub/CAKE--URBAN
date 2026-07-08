import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Mic, 
  Sparkles, 
  Camera, 
  X, 
  Clock, 
  TrendingUp, 
  Star, 
  Coffee, 
  CheckCircle, 
  Tag, 
  ArrowRight,
  Sparkle,
  Upload,
  Zap
} from 'lucide-react';
import { Product } from '../types';
import { playBtnTap, playSlidePop, playSuccessChime } from '../lib/sound';
import { toast } from 'sonner';

interface AiSearchBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onApplySpecialFilter: (filterType: string, value: any) => void;
  allProducts: Product[];
  onQuickView: (prod: Product) => void;
}

const PLACEHOLDERS = [
  "Search Cakes...",
  "Search Cupcakes...",
  "Search Desserts...",
  "Search Gift Hampers...",
  "Search Wedding Occasions...",
  "Search Red Velvet...",
  "Search Eggless Treats..."
];

export default function AiSearchBar({ 
  searchQuery, 
  setSearchQuery, 
  onApplySpecialFilter, 
  allProducts,
  onQuickView 
}: AiSearchBarProps) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);

  // Typewriter rotate placeholders
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Hydrate recents
  useEffect(() => {
    const saved = localStorage.getItem('cakeurban_recent_searches');
    if (saved) {
      try { setRecentSearches(JSON.parse(saved)); } catch (e) {}
    } else {
      const defaultRecents = ["Eggless chocolate drip", "Anniversary cakes", "2-Tier Truffle"];
      setRecentSearches(defaultRecents);
      localStorage.setItem('cakeurban_recent_searches', JSON.stringify(defaultRecents));
    }
  }, []);

  const addToRecentSearches = (query: string) => {
    if (!query.trim()) return;
    const clean = query.trim();
    const updated = [clean, ...recentSearches.filter(q => q !== clean)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('cakeurban_recent_searches', JSON.stringify(updated));
  };

  const removeRecentSearch = (e: React.MouseEvent, query: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter(q => q !== query);
    setRecentSearches(updated);
    localStorage.setItem('cakeurban_recent_searches', JSON.stringify(updated));
    playBtnTap();
  };

  // AI Sparkle query enhancer
  const triggerAiSparkle = () => {
    playSuccessChime();
    let enhanced = searchQuery;
    if (!searchQuery.trim()) {
      enhanced = "Premium double-gilded chocolate macaron tier cake";
    } else {
      enhanced = `Premium organic ${searchQuery} custom chef special`;
    }
    setSearchQuery(enhanced);
    addToRecentSearches(enhanced);
    
    // Auto trigger filters
    onApplySpecialFilter('dietary', 'Eggless');
    onApplySpecialFilter('category', 'Premium Collection');
    
    toast.success("Query Enhanced with Chef AI Gastronomic parameters! ✨", {
      description: `Optimized to: "${enhanced}" (Eggless + Premium)`,
      duration: 4000
    });
  };

  // Voice Search (HTML5 Web Speech API integration)
  const toggleVoiceSearch = () => {
    playBtnTap();
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      // Simulate voice input for browsers without Web Speech
      setIsListening(true);
      toast.info("Calibrating voice sensor...");
      setTimeout(() => {
        setIsListening(false);
        const voiceMockQuery = "Eggless red velvet anniversary tier";
        setSearchQuery(voiceMockQuery);
        addToRecentSearches(voiceMockQuery);
        playSuccessChime();
        toast.success(`Voice Captured: "${voiceMockQuery}"`);
      }, 2500);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-IN';

    rec.onresult = (event: any) => {
      const resultText = event.results[0][0].transcript;
      setSearchQuery(resultText);
      addToRecentSearches(resultText);
      playSuccessChime();
      toast.success(`Speech captured: "${resultText}"`);
    };

    rec.onerror = (err: any) => {
      console.warn("Speech API error", err);
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = rec;
    rec.start();
  };

  // Camera Search Trigger
  const handleCameraScanSelect = (sketchName: string, categoryMatch: string) => {
    setIsScanning(true);
    setScannedResult(null);
    playSlidePop();

    setTimeout(() => {
      setIsScanning(false);
      setScannedResult(sketchName);
      playSuccessChime();
      
      // Apply filters
      if (categoryMatch === "Premium") {
        onApplySpecialFilter('category', 'Premium Collection');
        setSearchQuery("Golden Empress");
      } else if (categoryMatch === "Kids") {
        onApplySpecialFilter('category', 'Bento & Mini Cakes');
        setSearchQuery("Pinata");
      } else {
        onApplySpecialFilter('category', 'Regular Cakes');
        setSearchQuery("Chocolate");
      }

      toast.success(`AI Vision scanned successfully! Filtered to: "${sketchName}" coordinates.`);
      setTimeout(() => {
        setIsCameraModalOpen(false);
        setScannedResult(null);
      }, 1500);
    }, 2500);
  };

  // Quick suggestions logic
  const popularCakes = allProducts.slice(0, 3);

  return (
    <div className="relative w-full z-40">
      
      {/* ---------------------------------------------------------
          TOP STICKY SEARCH BAR (720px, Height 72px, Glass)
          --------------------------------------------------------- */}
      <div className="max-w-[720px] mx-auto h-[72px] rounded-full bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_25px_60px_-15px_rgba(244,63,94,0.08)] flex items-center px-6 gap-3 transition-all duration-500 hover:bg-white/65 hover:shadow-[0_30px_70px_-10px_rgba(131,56,236,0.1)] relative">
        
        {/* Left Icon: Search */}
        <Search className="w-6 h-6 text-slate-400" />

        {/* Input center field */}
        <div className="flex-1 relative h-full">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value) {
                // playBtnTap();
              }
            }}
            onFocus={() => {
              setIsFocused(true);
              playSlidePop();
            }}
            onBlur={() => {
              // Wait slightly for click interactions in dropdown list
              setTimeout(() => setIsFocused(false), 200);
            }}
            className="w-full h-full bg-transparent border-none outline-none text-slate-800 font-sans text-sm md:text-base font-medium placeholder-slate-400 pr-4"
          />

          {/* Typewriter Floating Label placeholder when input is empty */}
          {!searchQuery && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400/80 text-sm md:text-base font-medium select-none flex items-center gap-1 animate-fade-in">
              <span>{PLACEHOLDERS[placeholderIndex]}</span>
            </div>
          )}
        </div>

        {/* Right Buttons: Voice, Sparkle, Camera */}
        <div className="flex items-center gap-1 md:gap-2">
          {searchQuery && (
            <button 
              onClick={() => { setSearchQuery(""); playBtnTap(); }}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Voice Search Icon Button */}
          <button
            onClick={toggleVoiceSearch}
            className={`p-2.5 rounded-full transition-all cursor-pointer relative ${
              isListening 
                ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30' 
                : 'hover:bg-slate-100 text-slate-500 hover:text-rose-500'
            }`}
            title="Voice Search via AI"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* AI Sparkle Enhancer */}
          <button
            onClick={triggerAiSparkle}
            className="p-2.5 rounded-full hover:bg-purple-50 hover:scale-105 active:scale-95 text-purple-600 hover:text-purple-700 transition-all cursor-pointer relative"
            title="Enhance Query with AI Sparkle"
          >
            <Sparkles className="w-4 h-4 fill-purple-100 animate-pulse" />
          </button>

          {/* Camera Visual Search */}
          <button
            onClick={() => { setIsCameraModalOpen(true); playSlidePop(); }}
            className="p-2.5 rounded-full hover:bg-indigo-50 hover:scale-105 active:scale-95 text-indigo-600 hover:text-indigo-700 transition-all cursor-pointer"
            title="Camera Designer Visual Scan"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------------
          LIVE SEARCH SUGGESTIONS DROP PANEL (Stretches elegantly)
          --------------------------------------------------------- */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 8, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute left-1/2 -translate-x-1/2 w-full max-w-[720px] bg-white/95 backdrop-blur-3xl border border-slate-100 rounded-[32px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.12)] p-6 z-50 text-left overflow-hidden mt-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Trending, Recents & Suggs */}
              <div className="space-y-4">
                
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Recent Explorations
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {recentSearches.map((q) => (
                        <span 
                          key={q}
                          onMouseDown={() => {
                            setSearchQuery(q);
                            addToRecentSearches(q);
                          }}
                          className="pl-3.5 pr-2 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-xs font-bold text-slate-600 hover:bg-pink-50 hover:border-pink-200 hover:text-pink-600 flex items-center gap-1 cursor-pointer group transition-all"
                        >
                          {q}
                          <button 
                            onMouseDown={(e) => removeRecentSearch(e, q)}
                            className="w-4 h-4 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 group-hover:text-pink-700"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Queries */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-pink-500" />
                    Trending Near You
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { text: "Gold Leaf Drip", label: "Premium" },
                      { text: "Eggless", label: "Diet" },
                      { text: "Unicorn Pinata", label: "Kids" },
                      { text: "Midnight Delivery", label: "Express" }
                    ].map((trend) => (
                      <button
                        key={trend.text}
                        onMouseDown={() => {
                          setSearchQuery(trend.text);
                          addToRecentSearches(trend.text);
                          playBtnTap();
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-pink-500/5 hover:bg-pink-500/10 border border-pink-500/10 text-xs font-black text-slate-700 hover:text-pink-600 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkle className="w-3 h-3 text-pink-500 animate-pulse" />
                        <span>{trend.text}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Occasion & Budget Fast Suggestions */}
                <div className="pt-2 grid grid-cols-2 gap-2">
                  <div className="p-3 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 text-left">
                    <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest block mb-1">Budget Fast-Link</span>
                    <button 
                      onMouseDown={() => {
                        onApplySpecialFilter('price', 999);
                        setSearchQuery("Under ₹999");
                        playBtnTap();
                      }}
                      className="text-xs font-bold text-indigo-700 hover:underline flex items-center gap-1"
                    >
                      Bestsellers Under ₹999 <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="p-3 bg-purple-500/5 rounded-2xl border border-purple-500/10 text-left">
                    <span className="text-[9px] font-black text-purple-500 uppercase tracking-widest block mb-1">Occasion Hub</span>
                    <button 
                      onMouseDown={() => {
                        onApplySpecialFilter('occasion', 'Birthday');
                        setSearchQuery("Birthday");
                        playBtnTap();
                      }}
                      className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
                    >
                      Celebrate Birthdays <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Column: Popular Cakes & Chef Spotlight */}
              <div className="space-y-4 border-l border-slate-50 pl-0 md:pl-6">
                <div className="space-y-2.5">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    Popular Cakes Spotlight
                  </h4>
                  <div className="space-y-2">
                    {popularCakes.map((prod) => (
                      <div 
                        key={prod.id}
                        onMouseDown={() => onQuickView(prod)}
                        className="flex gap-3 items-center p-1.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group"
                      >
                        <img src={prod.images[0]} alt={prod.name} className="w-10 h-10 object-cover rounded-lg shadow-sm" />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-slate-800 group-hover:text-pink-600 transition-colors truncate">{prod.name}</h5>
                          <div className="text-[10px] text-slate-400 font-mono">₹{prod.price} • {prod.rating || '4.8'} ★</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-pink-500 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-[#FFF8FA] to-[#FAF5FF] border border-pink-100 rounded-2xl flex gap-3 items-center text-left">
                  <div className="text-2xl">👩‍🍳</div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-black text-purple-900 uppercase tracking-wider leading-none">Chef Recommends</h5>
                    <p className="text-[10px] text-purple-700/80 mt-1 line-clamp-2">"Try our exotic Saffron Cardamom Heritage Cake for traditional summer wedding surprises."</p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------------
          VOICE LISTENING WAVEFORM OVERLAY SCREEN
          --------------------------------------------------------- */}
      <AnimatePresence>
        {isListening && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-white">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="text-center space-y-8"
            >
              <div className="w-20 h-20 rounded-full bg-rose-500 text-white flex items-center justify-center mx-auto shadow-2xl shadow-rose-500/40 animate-pulse">
                <Mic className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight">Listening to your appetite...</h3>
                <p className="text-xs text-slate-300 font-medium">Speak now, e.g. "chocolate cupcakes" or "eggless mango dessert"</p>
              </div>

              {/* Pulsing visual wave */}
              <div className="flex justify-center items-center gap-1 h-8">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => (
                  <span 
                    key={bar}
                    className="w-1 bg-rose-400 rounded-full animate-bounce"
                    style={{ 
                      height: `${Math.floor(Math.random() * 24) + 8}px`,
                      animationDelay: `${bar * 0.1}s`,
                      animationDuration: '0.6s'
                    }}
                  />
                ))}
              </div>

              <button 
                onClick={() => setIsListening(false)}
                className="px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 text-xs font-bold tracking-wider uppercase"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------------
          CAMERA DESIGNER VISUAL SCAN MODAL
          --------------------------------------------------------- */}
      <AnimatePresence>
        {isCameraModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white rounded-[36px] max-w-md w-full p-6 border border-slate-100 shadow-2xl text-slate-800 space-y-6 relative"
            >
              <button
                onClick={() => setIsCameraModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                  <Camera className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-lg font-black tracking-tight text-slate-900">AI Vision Design Scanner</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">Select a luxury designer drawing or concept style to trigger corresponding filter results instantly.</p>
              </div>

              {isScanning ? (
                <div className="py-8 space-y-4 text-center">
                  <div className="relative w-48 h-32 mx-auto bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-200">
                    <Zap className="w-8 h-8 text-indigo-500 animate-spin" />
                    {/* Laser green sweeping line */}
                    <div className="absolute left-0 right-0 h-1.5 bg-emerald-500 shadow-[0_0_10px_#10B981] animate-[bounce_2s_infinite] top-0" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-indigo-600 animate-pulse">Running Neural Grid Scan...</p>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Checking chocolate & frosting contours</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { 
                        name: "Minimal Rose Gold", 
                        emoji: "🌸", 
                        cat: "Premium",
                        img: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=300&q=80" 
                      },
                      { 
                        name: "Unicorn Pinata", 
                        emoji: "🦄", 
                        cat: "Kids",
                        img: "https://images.unsplash.com/photo-1557925923-cd4648e21187?w=300&q=80" 
                      },
                      { 
                        name: "Chocolate Ganache", 
                        emoji: "🍫", 
                        cat: "Regular",
                        img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80" 
                      }
                    ].map((concept) => (
                      <button
                        key={concept.name}
                        onClick={() => handleCameraScanSelect(concept.name, concept.cat)}
                        className="p-2 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-md transition-all group text-left cursor-pointer"
                      >
                        <img src={concept.img} alt={concept.name} className="w-full h-16 object-cover rounded-xl mb-2 opacity-80 group-hover:opacity-100 transition-opacity" />
                        <span className="text-[10px] font-black text-slate-700 block truncate leading-tight">{concept.emoji} {concept.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="border border-dashed border-slate-200 rounded-2xl p-5 text-center bg-slate-50/30 hover:bg-slate-50 transition-colors flex flex-col items-center justify-center cursor-pointer">
                    <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
                    <span className="text-xs font-bold text-slate-600">Drag or Upload your own sketch</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">Supports JPG, PNG up to 5MB</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
