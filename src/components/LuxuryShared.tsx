import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  MessageCircle, 
  PhoneCall, 
  Check, 
  X, 
  ArrowRight, 
  Star, 
  HelpCircle, 
  Clock, 
  Calendar, 
  User, 
  Phone,
  Compass,
  Wine,
  Gem,
  Volume2
} from 'lucide-react';
import { toast } from 'sonner';

// ==========================================
// 1. FLOATING CONCIERGE (WhatsApp & Call)
// ==========================================
export function LuxuryConcierge() {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsApp = () => {
    const text = encodeURIComponent("Hello CakeUrban Concierge, I would like to inquire about a luxury bespoke designer cake.");
    window.open(`https://wa.me/917318531953?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[99] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            className="absolute bottom-16 right-0 w-80 bg-white/90 backdrop-blur-xl border border-slate-200/50 rounded-[28px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] space-y-4 text-left"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black text-[#DFB15B] tracking-[0.2em] uppercase block">PERSONAL SERVICE</span>
                <h4 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">La Maison Concierge</h4>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-slate-100 transition-colors">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Welcome to CakeUrban’s private salon. Our master pâtissiers and luxury event planners are available to orchestrate your custom cake order.
            </p>

            <div className="space-y-2 pt-1">
              <button 
                onClick={handleWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold uppercase tracking-widest py-3.5 px-4 rounded-xl shadow-lg shadow-green-500/10 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Text on WhatsApp</span>
              </button>

              <a 
                href="tel:+917318531953"
                className="w-full bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-widest py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Private Line</span>
              </a>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-3">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ACTIVE CONCIERGE
              </span>
              <span>EST. RESPONSE: 3 MINS</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-slate-900 to-slate-800 flex items-center justify-center text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:scale-110 active:scale-95 transition-all relative border border-white/10 group"
      >
        <span className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300 origin-center" />
        <Sparkles className="w-6 h-6 text-[#DFB15B] animate-pulse" />
      </button>
    </div>
  );
}

// ==========================================
// 2. QUICK ORDER MODAL
// ==========================================
interface QuickOrderProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
}

export function QuickOrderModal({ isOpen, onClose, category }: QuickOrderProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    guests: '15',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      toast.success("Bespoke inquiry received! ✨ Our private designer will call you in 15 minutes.");
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl border border-slate-200/50 rounded-[32px] p-8 shadow-[0_30px_70px_rgba(0,0,0,0.15)] overflow-hidden text-left"
          >
            {/* Dior line element */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#DFB15B] via-amber-400 to-[#DFB15B]" />

            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-black text-[#DFB15B] tracking-[0.25em] uppercase block">PREMIUM RESERVATION</span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Bespoke {category} order</h3>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {submitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-[#DFB15B] animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Inquiry Orchestrated Successfully</h4>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Your luxury request is being routed to our executive event chef. Expect a direct call momentarily.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#DFB15B]" /> YOUR NAME *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Countess Aria Dev"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl px-4 py-3 text-xs font-medium focus:outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#DFB15B]" /> PHONE NUMBER *
                    </label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl px-4 py-3 text-xs font-medium focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#DFB15B]" /> EVENT DATE *
                    </label>
                    <input 
                      type="date" 
                      required
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl px-4 py-3 text-xs font-medium focus:outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#DFB15B]" /> NUMBER OF GUESTS
                    </label>
                    <select
                      value={formData.guests}
                      onChange={e => setFormData({...formData, guests: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl px-4 py-3 text-xs font-medium focus:outline-none transition-all"
                    >
                      <option value="10">10-15 Guests</option>
                      <option value="25">15-30 Guests</option>
                      <option value="50">30-70 Guests</option>
                      <option value="100">70-150 Guests</option>
                      <option value="200">150+ Royal Gala</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    ARTISAN THEME NOTES & CUSTOM FLAVOR CRAVING
                  </label>
                  <textarea 
                    rows={3}
                    placeholder="Describe your design aesthetics, flavor notes, or specific elements (e.g., gold foil drapery, pastel roses, eggless requests...)"
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl px-4 py-3 text-xs font-medium focus:outline-none transition-all resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-slate-950 hover:bg-slate-900 text-[#DFB15B] text-xs font-black uppercase tracking-[0.2em] py-4.5 px-6 rounded-xl shadow-xl transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 mt-2"
                >
                  <span>REQUEST BESPOKE PRESENTATION</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[9px] text-slate-400 text-center leading-relaxed font-semibold">
                  By clicking, you initiate a priority reservation sequence. CakeUrban guarantees strict privacy and elite, bespoke service.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ==========================================
// 3. STICKY BOTTOM CTA
// ==========================================
interface StickyCTAProps {
  onAction: () => void;
  label: string;
  category: string;
}

export function StickyCTA({ onAction, label, category }: StickyCTAProps) {
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-2xl border-t border-slate-100 z-40 py-4 px-6 shadow-[0_-10px_30px_rgba(0,0,0,0.04)] sm:hidden flex items-center justify-between"
    >
      <div className="text-left">
        <span className="text-[9px] font-black text-[#DFB15B] tracking-wider uppercase block">CAKEURBAN BESPOKE</span>
        <span className="text-xs font-extrabold text-slate-900 truncate max-w-[150px] block">{category} Masterwork</span>
      </div>
      <button 
        onClick={onAction}
        className="bg-slate-950 hover:bg-slate-900 text-[#DFB15B] text-[10px] font-black uppercase tracking-widest py-3 px-5 rounded-full transition-all active:scale-95 shadow-md"
      >
        {label}
      </button>
    </motion.div>
  );
}

// ==========================================
// 4. AI CAKE RECOMMENDATION WIZARD
// ==========================================
interface AIRecommendProps {
  category: string;
}

export function AICakeRecommendation({ category }: AIRecommendProps) {
  const [guests, setGuests] = useState('20');
  const [vibe, setVibe] = useState('Minimalist Gold Elegance');
  const [flavor, setFlavor] = useState('Dark Chocolate Belgian Hazelnut');
  const [budget, setBudget] = useState('5000');
  
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<any | null>(null);

  const triggerAI = async () => {
    setLoading(true);
    setRecommendation(null);
    try {
      const res = await fetch("/api/ai-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          guests,
          vibe,
          flavorPref: flavor,
          budget: `₹${budget}`
        })
      });
      const data = await res.json();
      setRecommendation(data);
    } catch (e) {
      toast.error("L’Atelier AI engine offline, serving our Chef Signature selection instead.");
      setRecommendation({
        name: `${category} Imperial Royale`,
        flavorCombo: `${flavor} infused with 24-Karat Edible Gold Leaf and salted butter caramel.`,
        tiersAndStructure: "A majestic dual-tier architectural silhouette.",
        artisanDetails: "Accented with custom-sculpted royal chocolate curls, French macaron nests, and subtle sugar dust filaments.",
        pairing: "Dom Pérignon Champagne or Grand Cru Oolong Tea.",
        price: `₹${budget}`,
        weight: "2.5 kg",
        designInspiration: "Inspired by Dior’s classic architectural structured tailoring and Apple's focus on seamless elegant minimalism."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 rounded-[40px] border border-slate-800/40 p-8 md:p-12 shadow-[0_30px_80px_rgba(0,0,0,0.3)] relative overflow-hidden text-left">
      {/* Absolute Ambient Background Lights */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="bg-amber-500/10 text-[#DFB15B] border border-amber-500/20 font-black text-[9px] uppercase tracking-[0.25em] px-3.5 py-1.5 rounded-full inline-block">
              L’ATELIER AI ENGINE
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight font-sans">
              AI-Powered Cake Couture
            </h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Design the most luxurious cake ever conceived. Select your event parameters and let our generative culinary engine orchestrate a custom masterwork.
            </p>
          </div>

          <div className="space-y-4 font-sans text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GUEST COUNT</label>
                <select 
                  value={guests} 
                  onChange={e => setGuests(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3.5 py-3 text-slate-200 focus:outline-none focus:border-[#DFB15B] transition-colors"
                >
                  <option value="15">10 - 20 Elite Guests</option>
                  <option value="40">20 - 50 Grand Gala</option>
                  <option value="100">50 - 150 Royal Ball</option>
                  <option value="250">150+ Sovereign Event</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ESTIMATED BUDGET</label>
                <select 
                  value={budget} 
                  onChange={e => setBudget(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3.5 py-3 text-slate-200 focus:outline-none focus:border-[#DFB15B] transition-colors"
                >
                  <option value="3500">₹3,500 - ₹5,000</option>
                  <option value="6500">₹5,000 - ₹8,000</option>
                  <option value="12000">₹8,000 - ₹15,000</option>
                  <option value="25000">₹15,000+ Couture Range</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AESTHETIC VIBE / STYLE</label>
              <select 
                value={vibe} 
                onChange={e => setVibe(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3.5 py-3 text-slate-200 focus:outline-none focus:border-[#DFB15B] transition-colors"
              >
                <option value="Minimalist Gold Elegance">Minimalist Luxury with 24K Edible Gold Leaf</option>
                <option value="Royal Baroque Extravaganza">Royal Baroque with complex hand-piped detailing</option>
                <option value="Futuristic Geometric Sculpt">Futuristic Geometric sculpture with ambient sugar filaments</option>
                <option value="Soft Romantic Botanical Charm">Soft Romantic Dream with hand-painted sugar flowers</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">FLAVOR PREFERENCE</label>
              <select 
                value={flavor} 
                onChange={e => setFlavor(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3.5 py-3 text-slate-200 focus:outline-none focus:border-[#DFB15B] transition-colors"
              >
                <option value="Dark Chocolate Belgian Hazelnut">Belgian Chocolate Feuilletine & Hazelnut Ganache</option>
                <option value="Madagascan Vanilla Bean & Fresh Berries">Madagascan Vanilla Bean Caviar & wild berries compote</option>
                <option value="Sicilian Pistachio & Salted Honey">Sicilian Roasted Pistachio, Cardamom, and organic honey</option>
                <option value="Imperial Saffron Almond Butter">Imperial Kashmiri Saffron & toasted almond paste</option>
              </select>
            </div>

            <button 
              onClick={triggerAI}
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-[#DFB15B] hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-[0.2em] py-4.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 shadow-xl shadow-amber-500/10 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>ORCHESTRATING DESIGN...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>GENERATE LUXURY CAKE RECOMENDATION</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Result Display */}
        <div className="lg:col-span-6 h-full min-h-[380px] flex flex-col items-center justify-center relative bg-slate-900/40 border border-slate-800/60 rounded-[32px] p-6 lg:p-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/10 to-slate-950/40" />
          
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-4 relative z-10"
              >
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-ping" />
                  <div className="absolute inset-2 rounded-full border border-amber-500/40 animate-pulse" />
                  <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#DFB15B] to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <Sparkles className="w-6 h-6 text-slate-950 animate-bounce" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-300 tracking-[0.2em]">Consulting Master Pâtissier</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Applying Apple + Dior Design Philosophy...</p>
                </div>
              </motion.div>
            ) : recommendation ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="space-y-4 text-left relative z-10 w-full"
              >
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-[9px] font-black text-[#DFB15B] tracking-[0.2em] uppercase block">EXCLUSIVELY CREATED BY AI</span>
                  <h4 className="text-xl font-black text-white tracking-tight mt-1 uppercase font-sans">
                    {recommendation.name}
                  </h4>
                </div>

                <div className="space-y-3 font-sans text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                      <Wine className="w-3.5 h-3.5 text-amber-500" /> CULINARY FLAVORS & LAYERS
                    </span>
                    <p className="text-slate-300 font-medium leading-relaxed text-[11px]">{recommendation.flavorCombo}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-amber-500" /> ARCHITECTURAL FORM
                    </span>
                    <p className="text-slate-300 font-medium leading-relaxed text-[11px]">{recommendation.tiersAndStructure}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                      <Gem className="w-3.5 h-3.5 text-amber-500" /> COUTURE DETAILED EMBELLISHMENTS
                    </span>
                    <p className="text-slate-300 font-medium leading-relaxed text-[11px]">{recommendation.artisanDetails}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-1 border-t border-slate-800/80">
                    <div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">ESTIMATED COST</span>
                      <span className="text-sm font-black text-[#DFB15B]">{recommendation.price || `₹${budget}`}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">PROPORTIONAL SCALE</span>
                      <span className="text-sm font-black text-slate-300">{recommendation.weight || "2.5 kg"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4.5 space-y-1 text-slate-400 text-[10px] leading-relaxed">
                  <span className="text-[#DFB15B] font-black uppercase tracking-widest block">DESIGN PHILOSOPHY</span>
                  <p className="font-semibold italic">{recommendation.designInspiration}</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => {
                      toast.success(`Exclusive order initialized for ${recommendation.name}!`);
                    }}
                    className="flex-1 bg-white hover:bg-slate-100 text-slate-950 font-black text-[10px] uppercase tracking-wider py-3 rounded-xl transition-all hover:scale-[1.01] text-center"
                  >
                    SELECT DESIGN
                  </button>
                  <button 
                    onClick={() => {
                      const text = encodeURIComponent(`Hi, I am interested in ordering the AI generated Bespoke cake: "${recommendation.name}". Details: ${recommendation.flavorCombo}`);
                      window.open(`https://wa.me/917318531953?text=${text}`, '_blank');
                    }}
                    className="px-4 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 rounded-xl transition-colors flex items-center justify-center"
                    title="Discuss with Event Planner"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-500 fill-emerald-500/10" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-4 relative z-10 p-6"
              >
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800/80 flex items-center justify-center mx-auto text-slate-400">
                  <Compass className="w-8 h-8 text-amber-500" />
                </div>
                <div className="space-y-1 max-w-xs mx-auto">
                  <h4 className="text-sm font-black text-slate-300 uppercase tracking-wider">Awaiting Culinary Design</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    Our AI Pastry Chef will materialize a luxury architectural cake recommendation based on your aesthetic vibe.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. PREMIUM TESTIMONIALS
// ==========================================
export function LuxuryTestimonials() {
  const reviews = [
    {
      name: "Sonia Sen",
      role: "Editor, Vogue India",
      text: "The 3-tier gold and rose wedding cake from CakeUrban didn't just meet our high aesthetic standards—it defined the visual layout of our entire gala reception. Architectural, breathtaking, and sumptuously rich.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100"
    },
    {
      name: "Rohan Kapoor",
      role: "Luxury Event Designer",
      text: "For anniversaries, CakeUrban’s romantic rose collection delivers unmatched Dior-level craftsmanship. The edible gold leaf detailing is placed with absolute precision, and the Belgian truffle melts like heaven.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100"
    },
    {
      name: "Tanya Duggal",
      role: "Awwwards Jury Member",
      text: "Ordering a customized cake should feel like purchasing custom luxury fashion. CakeUrban understands that. From their stunning 3D interactive wizard to their flawless climate-controlled white glove delivery.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
    }
  ];

  return (
    <div className="space-y-8 max-w-[1280px] mx-auto">
      <div className="text-center space-y-2">
        <span className="text-[10px] font-black text-[#DFB15B] tracking-[0.3em] uppercase block">THE SOCIAL CIRCLE</span>
        <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none font-sans">
          Acclaimed By Elite Tastemakers
        </h3>
        <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto">
          Celebrated by design directors, culinary critics, and high-fashion tastemakers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((rev, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15 }}
            className="bg-white border border-slate-200/40 p-8 rounded-[32px] shadow-[0_15px_40px_rgba(0,0,0,0.03)] space-y-5 text-left relative flex flex-col justify-between group hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex gap-1">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#DFB15B] fill-[#DFB15B]" />
                ))}
              </div>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed italic">
                "{rev.text}"
              </p>
            </div>

            <div className="flex items-center gap-4.5 border-t border-slate-100 pt-5">
              <img src={rev.avatar} className="w-11 h-11 rounded-full object-cover" alt={rev.name} referrerPolicy="no-referrer" />
              <div>
                <h4 className="text-xs font-black text-slate-900 tracking-wider uppercase">{rev.name}</h4>
                <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mt-0.5">{rev.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 6. PREMIUM PRE-FOOTER BANNER
// ==========================================
export function PremiumFooterBanner() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    toast.success("Welcome to L’Élite Salon. Check your inbox for private events.");
  };

  return (
    <div className="w-full max-w-[1320px] mx-auto bg-slate-950 rounded-[48px] border border-slate-800 p-8 md:p-16 relative overflow-hidden text-center select-none font-sans mt-12 mb-8">
      {/* Absolute Ambient Halo */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(223,177,91,0.07)_0%,transparent_70%]" />
      
      <div className="relative z-10 max-w-2xl mx-auto space-y-6">
        <span className="text-[10px] font-black text-[#DFB15B] tracking-[0.3em] uppercase block">L’ÉLITE SALON</span>
        
        <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
          Join CakeUrban Private Client List
        </h3>
        
        <p className="text-xs text-slate-400 leading-relaxed font-semibold max-w-md mx-auto">
          Gain exclusive access to seasonal designer showcases, private tasting events at our Delhi salon, and customized chef consultation priorities.
        </p>

        {subscribed ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-amber-500/10 border border-[#DFB15B]/20 text-[#DFB15B] text-xs font-black uppercase tracking-widest py-4 px-6 rounded-2xl inline-block"
          >
            ✨ MONSEIGNEUR INVITATION SENT
          </motion.div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input 
              type="email" 
              required
              placeholder="Enter your elite email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 focus:border-[#DFB15B] focus:bg-slate-900/80 rounded-2xl px-5 py-4 text-xs font-semibold text-white focus:outline-none placeholder-slate-500"
            />
            <button 
              type="submit"
              className="bg-[#DFB15B] hover:bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-widest py-4 px-8 rounded-2xl transition-colors shrink-0"
            >
              REQUEST INVITATION
            </button>
          </form>
        )}

        <div className="pt-4 flex items-center justify-center gap-6 text-[9px] text-slate-500 font-black uppercase tracking-widest">
          <span>PRIVATE SERVICES</span>
          <span>●</span>
          <span>WHITE GLOVE CLIMATE SHIP</span>
          <span>●</span>
          <span>BESPOKE CULINARY DESIGNS</span>
        </div>
      </div>
    </div>
  );
}
