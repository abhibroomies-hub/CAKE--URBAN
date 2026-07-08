import React, { useState, useEffect } from 'react';
import { useCart } from '../lib/store';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  CreditCard, 
  MapPin, 
  Truck, 
  ChevronRight, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Edit3, 
  Sparkles, 
  X, 
  Check, 
  ArrowLeft, 
  Copy, 
  Search, 
  Map, 
  Plus, 
  Gift, 
  Heart, 
  Compass, 
  Grid, 
  HelpCircle,
  QrCode,
  Smartphone,
  PartyPopper,
  Flame,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import SEO from '../components/SEO';
import { playSuccessChime, playBtnTap, playSlidePop } from '../lib/sound';

// Pre-defined luxury addresses for CakeUrban elite clients
const SAVED_ADDRESSES = [
  {
    id: 'addr-home',
    type: 'home' as const,
    name: 'Home Sanctuary',
    line1: 'B-702, Grand Royale Enclave',
    sector: 'Sector 15',
    city: 'Faridabad',
    pincode: '121001',
    isDefault: true
  },
  {
    id: 'addr-office',
    type: 'work' as const,
    name: 'Atelier Headquarter',
    line1: 'Suite 44, Omaxe World Street',
    sector: 'Sector 79',
    city: 'Faridabad',
    pincode: '121002',
    isDefault: false
  }
];

// Special celebration upgrade items
const SPECIAL_UPGRADES = [
  { id: 'upgrade-greeting', name: 'Premium Calligraphy Card', price: 99, icon: '✉️', desc: 'Handwritten gold ink scroll' },
  { id: 'upgrade-wrap', name: 'Luxury Silk Bow Wrapping', price: 199, icon: '🎀', desc: 'Luxury velvet box & satin ties' },
  { id: 'upgrade-sparkler', name: 'Elite Ice Fountain Candle', price: 149, icon: '🔥', desc: 'Therapeutic cold-spark fountain' },
  { id: 'upgrade-flowers', name: 'Fresh Parisian Rose Bouquet', price: 699, icon: '💐', desc: 'Bunch of handpicked pastel roses' },
];

export default function Checkout() {
  const { items, getTotal, clearCart } = useCart();
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // ---------------------------------------------------------
  // CHRONOLOGICAL STEPS SYSTEM
  // Steps: 1: Cart Review (done), 2: Address Pinning, 3: Scheduling, 4: Celebration Upgrades, 5: Settlement
  // ---------------------------------------------------------
  const [step, setStep] = useState(2); 

  // Address State
  const [selectedAddressId, setSelectedAddressId] = useState('addr-home');
  const [customAddress, setCustomAddress] = useState({
    line1: '',
    sector: '',
    city: 'Faridabad',
    pincode: '121001'
  });
  const [useCustomAddress, setUseCustomAddress] = useState(false);
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [isMapSearching, setIsMapSearching] = useState(false);
  const [pinnedCoordinates, setPinnedCoordinates] = useState({ lat: 28.4089, lng: 77.3178 });

  // Delivery Scheduling State
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().substring(0, 10);
  });
  
  const [selectedSlot, setSelectedSlot] = useState('06:00 PM - 09:00 PM (Sunset Twilight)');

  // Celebration Addons State
  const [selectedUpgrades, setSelectedUpgrades] = useState<string[]>([]);
  const [cakeInstructions, setCakeInstructions] = useState('');

  // Payment Options State
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi'); // upi | card | wallet | cod
  const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvc: '' });
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');

  // Transaction States
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  // Enforce authentication
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Authentication required to access checkout.", {
        description: "Redirecting to our secure guest & user registry."
      });
      navigate('/login?redirect=/checkout');
    }
  }, [user, authLoading, navigate]);

  // Handle address changes
  const activeAddress = useCustomAddress 
    ? { ...customAddress, id: 'addr-custom', type: 'other' as const }
    : (SAVED_ADDRESSES.find(a => a.id === selectedAddressId) || SAVED_ADDRESSES[0]);

  // Pricing calculations
  const cartSubtotal = getTotal();
  const boutiqueDiscount = Number(localStorage.getItem('cakeurban_checkout_discount') || Math.round(cartSubtotal * 0.08));
  const taxes = Number(localStorage.getItem('cakeurban_checkout_taxes') || Math.round(cartSubtotal * 0.05));
  
  // Upgrade costs
  const upgradeCost = selectedUpgrades.reduce((sum, upgradeId) => {
    const matched = SPECIAL_UPGRADES.find(u => u.id === upgradeId);
    return sum + (matched?.price || 0);
  }, 0);

  const finalTotal = Math.max(0, cartSubtotal - boutiqueDiscount + taxes + upgradeCost);

  // Address Geocode Simulation
  const simulateMapSearch = () => {
    if (!mapSearchQuery) return;
    setIsMapSearching(true);
    setTimeout(() => {
      setIsMapSearching(false);
      setCustomAddress(prev => ({
        ...prev,
        line1: mapSearchQuery,
        sector: 'Sector 15',
        pincode: '121001'
      }));
      setPinnedCoordinates({
        lat: 28.4089 + (Math.random() * 0.02 - 0.01),
        lng: 77.3178 + (Math.random() * 0.02 - 0.01)
      });
      toast.success("Location pinned successfully!", {
        description: `Verified within CakeUrban's premium Faridabad delivery zone.`
      });
      try { playSuccessChime(); } catch(e){}
    }, 1200);
  };

  const validateStep = (currentStep: number) => {
    if (currentStep === 2) {
      if (useCustomAddress && (!customAddress.line1 || !customAddress.sector)) {
        toast.error("Please provide a complete delivery address.");
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (!validateStep(step)) return;
    try { playSlidePop(); } catch(e){}
    setStep(s => Math.min(s + 1, 5));
  };

  const handlePrevStep = () => {
    try { playSlidePop(); } catch(e){}
    setStep(s => Math.max(s - 1, 2));
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try { playBtnTap(); } catch(e){}

    // Simulate luxury transaction transmission (Stripe-like feedback delay)
    await new Promise(resolve => setTimeout(resolve, 2500));

    const path = 'orders';
    try {
      const generatedId = 'CU-' + Math.floor(100000 + Math.random() * 900000);
      
      const orderData = {
        id: generatedId,
        userId: user?.uid || null,
        guestEmail: user?.email || null,
        phoneNumber: profile?.phoneNumber || null,
        items,
        total: finalTotal,
        status: 'new',
        paymentStatus: 'paid',
        shippingAddress: activeAddress,
        deliveryDate: selectedDate,
        deliverySlot: selectedSlot,
        cakeInstructions: cakeInstructions,
        upgrades: selectedUpgrades,
        paymentMethod: selectedPaymentMethod,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, path), orderData);

      // Trigger automatic transactional auto-reply email via SMTP route
      try {
        const orderEmail = user?.email || profile?.email || null;
        if (orderEmail) {
          await fetch('/api/email/send-auto-reply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: orderEmail,
              type: 'order_completion',
              details: {
                total: finalTotal,
                deliveryDate: selectedDate,
                deliverySlot: selectedSlot,
                instructions: cakeInstructions || 'None',
                items: items.map(item => `${item.quantity}x ${item.name}`).join(', ')
              }
            })
          });
        }
      } catch (e) {
        console.error("Auto-reply trigger failed gracefully:", e);
      }

      setPlacedOrderId(generatedId);
      setOrderComplete(true);
      clearCart();
      try { playSuccessChime(); } catch(e){}
      toast.success("Your masterpiece reservation is verified!", {
        description: `Order ID ${generatedId} is active in our baking queue.`
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    } finally {
      setLoading(false);
    }
  };

  const toggleUpgrade = (id: string) => {
    try { playBtnTap(); } catch(e){}
    setSelectedUpgrades(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9FC] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-pink-500/50 italic">
          Decrypting Secure Session...
        </p>
      </div>
    );
  }

  // =========================================================
  // SUCCESS CELEBRATION VIEW
  // =========================================================
  if (orderComplete) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-[#FFF9FC] py-20 px-4 relative overflow-hidden flex flex-col items-center justify-center text-center select-none"
      >
        <SEO 
          title="Reservation Perfected | CakeUrban" 
          description="Your artisanal cake reservation is complete. Experience luxury hand-delivery in Faridabad."
        />
        
        {/* Floating background blobs */}
        <div className="absolute top-[-20%] left-[-25%] w-[70%] h-[70%] rounded-full bg-gradient-to-tr from-pink-300/20 to-purple-300/20 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-25%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-rose-300/20 to-indigo-300/20 blur-[130px] pointer-events-none" />

        {/* 3D-Look Rotating Celebratory Card */}
        <motion.div 
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="relative z-10 max-w-2xl w-full bg-white/75 backdrop-blur-2xl border border-pink-100/50 p-10 sm:p-14 rounded-[54px] shadow-[0_45px_100px_rgba(244,63,94,0.08)] space-y-8"
        >
          {/* Animated Large Celebration Icon */}
          <div className="relative w-40 h-40 mx-auto">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-tr from-pink-400 to-purple-600 rounded-[48px] opacity-15 blur-xl"
            />
            <motion.div 
              initial={{ rotate: -15, scale: 0.9 }}
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.05, 0.98, 1] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="w-40 h-40 bg-white border border-pink-100 rounded-[48px] flex items-center justify-center shadow-lg relative"
            >
              <PartyPopper className="w-16 h-16 text-pink-500" strokeWidth={1} />
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                Verified
              </div>
            </motion.div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter leading-none">
              Your Masterpiece is <span className="italic font-serif font-light text-pink-500">Commencing.</span>
            </h1>
            <p className="text-slate-500 font-semibold italic text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Our master pâtissiers have initiated the baking ritual for Order <span className="text-pink-600 font-black not-italic font-mono">#{placedOrderId}</span>. A text confirmation has been dispatched to your registry.
            </p>
          </div>

          {/* Copy Order ID block */}
          <div className="bg-[#FAF6F8] p-4 rounded-3xl border border-pink-100/30 flex items-center justify-between max-w-sm mx-auto">
            <div className="text-left">
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Secure Order ID</p>
              <p className="text-xs font-mono font-black text-slate-800">{placedOrderId}</p>
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(placedOrderId);
                toast.success("Order ID copied to clipboard!");
              }}
              className="w-9 h-9 rounded-xl bg-white hover:bg-pink-50 text-slate-500 hover:text-pink-600 shadow-sm transition-all flex items-center justify-center cursor-pointer"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          {/* Track estimated details */}
          <div className="grid grid-cols-2 gap-4 border-t border-pink-100/30 pt-8 text-left">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Scheduled Arrival</p>
              <p className="text-xs font-black text-slate-800 mt-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-pink-500" />
                {new Date(selectedDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', weekday: 'short' })}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Time Window</p>
              <p className="text-xs font-black text-slate-800 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-purple-500" />
                {selectedSlot.split(' ')[0]} PM Slot
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/account')}
              className="px-8 h-14 bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.25em] rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              Track in Account Chronology
            </button>
            <button 
              onClick={() => navigate('/shop')}
              className="px-8 h-14 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-black text-[10px] uppercase tracking-[0.25em] rounded-full transition-all cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>

        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9FC] text-slate-800 py-12 px-4 sm:px-6 lg:px-8 relative overflow-x-hidden">
      <SEO 
        title="Secure Confection checkout | CakeUrban" 
        description="Verify your delivery logistics, customize your packaging, and finalise your luxury order."
      />

      {/* Floating Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-pink-300/10 to-purple-300/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-rose-300/10 to-indigo-300/10 blur-[130px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto relative z-10">
        
        {/* =========================================================
            TOP HEADER NAVIGATION & WIZARD STEPS
            ========================================================= */}
        <header className="mb-14 flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-pink-100/30 pb-8">
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/cart')}
              className="text-slate-400 hover:text-pink-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Bag
            </button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
              Bespoke Settlement
            </h1>
          </div>

          {/* Stepper visual tracking */}
          <div className="flex items-center gap-4 overflow-x-auto pb-4 lg:pb-0 no-scrollbar">
            {[
              { num: 2, label: 'Address' },
              { num: 3, label: 'Schedule' },
              { num: 4, label: 'Upgrades' },
              { num: 5, label: 'Payment' }
            ].map((s) => {
              const isCurrent = step === s.num;
              const isPassed = step > s.num;
              return (
                <div key={s.num} className="flex items-center gap-3 shrink-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black border transition-all duration-300 ${
                    isCurrent 
                      ? 'bg-pink-500 border-pink-500 text-white shadow-md shadow-pink-500/10' 
                      : isPassed 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    {isPassed ? <Check className="w-4 h-4" /> : s.num - 1}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    isCurrent ? 'text-pink-600' : isPassed ? 'text-emerald-600' : 'text-slate-400'
                  }`}>
                    {s.label}
                  </span>
                  {s.num < 5 && <div className="w-6 h-[1px] bg-slate-200" />}
                </div>
              );
            })}
          </div>
        </header>

        {/* =========================================================
            CORE 12-COLUMN CHEKOUT LAYOUT (LEFT 65% | RIGHT 35%)
            ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          
          {/* LEFT 65% - ACTIVE STEPS CONSOLE */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              
              {/* =========================================================
                  STEP 2: ADDRESS PINNING & SAVED CARDS
                  ========================================================= */}
              {step === 2 && (
                <motion.div 
                  key="step-address"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-pink-100/50 rounded-[40px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(244,63,94,0.03)] space-y-8 text-left"
                >
                  <div className="flex items-center gap-4 border-b border-pink-100/20 pb-5">
                    <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500">
                      <MapPin className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif font-black text-slate-800 italic">Delivery Destination</h2>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Pin your enclave location for safe transport</p>
                    </div>
                  </div>

                  {/* Saved Addresses Toggle Cards */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                      Select Saved Location
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {SAVED_ADDRESSES.map((addr) => {
                        const isSelected = selectedAddressId === addr.id && !useCustomAddress;
                        return (
                          <button
                            key={addr.id}
                            type="button"
                            onClick={() => {
                              try { playBtnTap(); } catch(e){}
                              setSelectedAddressId(addr.id);
                              setUseCustomAddress(false);
                            }}
                            className={`p-5 rounded-3xl border text-left transition-all relative overflow-hidden flex flex-col justify-between h-40 ${
                              isSelected 
                                ? 'border-pink-500 bg-pink-50/10 shadow-sm' 
                                : 'border-slate-100 bg-slate-50/40 hover:border-pink-300'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-[11px] font-black uppercase tracking-widest text-pink-600 bg-pink-100/50 px-2.5 py-1 rounded-lg">
                                {addr.type === 'home' ? '🏠 Home' : '💼 Office'}
                              </span>
                              {isSelected && <CheckCircle2 className="w-5 h-5 text-pink-500" />}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-sm leading-tight mt-3">{addr.name}</p>
                              <p className="text-[11px] text-slate-400 font-medium italic mt-1 line-clamp-2 leading-relaxed">
                                {addr.line1}, {addr.sector}, {addr.city}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add New Address with simulated custom Google Map preview */}
                  <div className="pt-6 border-t border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                        Deliver to a New Enclave
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          try { playBtnTap(); } catch(e){}
                          setUseCustomAddress(!useCustomAddress);
                        }}
                        className={`text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all ${
                          useCustomAddress 
                            ? 'bg-pink-500 text-white border-pink-500' 
                            : 'bg-white text-slate-600 hover:border-pink-300'
                        }`}
                      >
                        {useCustomAddress ? 'Using custom' : 'Configure Custom'}
                      </button>
                    </div>

                    {useCustomAddress && (
                      <div className="space-y-6">
                        {/* Map input search bar */}
                        <div className="flex gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 focus-within:border-pink-300 transition-colors">
                          <Search className="w-4 h-4 text-slate-400 self-center ml-2 shrink-0" />
                          <input 
                            type="text" 
                            placeholder="Search area, society, or sector in Faridabad" 
                            value={mapSearchQuery}
                            onChange={(e) => setMapSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && simulateMapSearch()}
                            className="flex-1 bg-transparent border-none outline-none text-xs font-semibold text-slate-800"
                          />
                          <button 
                            type="button"
                            onClick={simulateMapSearch}
                            className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-pink-600 transition-all cursor-pointer"
                          >
                            {isMapSearching ? 'Locating...' : 'Search'}
                          </button>
                        </div>

                        {/* Gorgeous simulated Google Map interface styled like Tesla Map */}
                        <div className="relative h-60 rounded-[28px] overflow-hidden border border-slate-100 bg-[#E5E9EC] flex items-center justify-center group shadow-inner">
                          {/* Map abstract graphics using pure SVG vectors for gorgeous presentation */}
                          <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="100%" height="100%" fill="#F1F3F4" />
                            {/* Grids / Highways */}
                            <path d="M 0,100 L 800,200 M 100,0 L 200,600 M 0,400 L 800,250 M 400,0 L 450,600" stroke="#FFF" strokeWidth="8" />
                            <path d="M 0,100 L 800,200 M 100,0 L 200,600 M 0,400 L 800,250 M 400,0 L 450,600" stroke="#E0E0E0" strokeWidth="4" />
                            {/* Water element */}
                            <path d="M 50,50 Q 150,150 100,300 T 50,450" fill="none" stroke="#C5E1A5" strokeWidth="20" opacity="0.3" />
                            <path d="M 600,0 C 700,200 500,400 800,500" fill="none" stroke="#B3E5FC" strokeWidth="40" opacity="0.5" />
                          </svg>

                          {/* Map safe delivery zone circles */}
                          <div className="absolute w-36 h-36 rounded-full border border-pink-500/30 bg-pink-500/5 animate-pulse flex items-center justify-center">
                            <span className="text-[8px] font-black text-pink-500 uppercase tracking-widest opacity-40">Delivery Orbit</span>
                          </div>

                          {/* Pulsing Coordinates Pin */}
                          <motion.div 
                            animate={{ y: [0, -8, 0] }}
                            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                            className="relative z-10 flex flex-col items-center"
                          >
                            <MapPin className="w-10 h-10 text-pink-500 fill-white" />
                            <div className="w-3 h-1 bg-black/10 rounded-full blur-[1px] mt-1" />
                          </motion.div>

                          {/* Apple Maps GPS Location HUD */}
                          <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-white flex items-center justify-between text-xs font-bold text-slate-700 shadow-lg">
                            <div className="flex items-center gap-2">
                              <Compass className="w-4 h-4 text-pink-500 animate-spin" />
                              <span>Lat: {pinnedCoordinates.lat.toFixed(4)}°N, Lng: {pinnedCoordinates.lng.toFixed(4)}°E</span>
                            </div>
                            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">Verified Zone</span>
                          </div>
                        </div>

                        {/* Input Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Door / Villa / Residence</label>
                            <Input 
                              placeholder="e.g. Flat 304, Emerald Tower" 
                              value={customAddress.line1}
                              onChange={(e) => setCustomAddress({...customAddress, line1: e.target.value})}
                              className="rounded-xl border-slate-100 bg-slate-50/50"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Sector (Faridabad Only)</label>
                            <Input 
                              placeholder="e.g. Sector 15" 
                              value={customAddress.sector}
                              onChange={(e) => setCustomAddress({...customAddress, sector: e.target.value})}
                              className="rounded-xl border-slate-100 bg-slate-50/50"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex justify-end">
                    <Button 
                      onClick={handleNextStep}
                      className="h-14 px-8 rounded-full bg-slate-900 hover:bg-pink-600 text-white text-xs font-black uppercase tracking-widest flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
                    >
                      Configure Timing
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* =========================================================
                  STEP 3: CALENDAR & HANDPICKED TIME SLOTS
                  ========================================================= */}
              {step === 3 && (
                <motion.div 
                  key="step-schedule"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white border border-pink-100/50 rounded-[40px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(244,63,94,0.03)] space-y-8 text-left"
                >
                  <div className="flex items-center gap-4 border-b border-pink-100/20 pb-5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                      <Calendar className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif font-black text-slate-800 italic">Temporal Scheduling</h2>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Select your desired cake arrival timeline</p>
                    </div>
                  </div>

                  {/* Airbnb style calendar blocks */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                      Choose Delivery Date
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {Array.from({ length: 4 }).map((_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() + i + 1);
                        const isoStr = date.toISOString().substring(0, 10);
                        const isSelected = selectedDate === isoStr;
                        return (
                          <button
                            key={isoStr}
                            type="button"
                            onClick={() => {
                              try { playBtnTap(); } catch(e){}
                              setSelectedDate(isoStr);
                            }}
                            className={`p-4 rounded-2xl border text-center transition-all ${
                              isSelected 
                                ? 'border-pink-500 bg-pink-50/10 shadow-sm' 
                                : 'border-slate-100 bg-slate-50/40 hover:border-pink-300'
                            }`}
                          >
                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                              {i === 0 ? 'Tomorrow' : date.toLocaleDateString('en-IN', { weekday: 'short' })}
                            </p>
                            <p className="text-2xl font-serif font-black text-slate-800 mt-1">{date.getDate()}</p>
                            <p className="text-[10px] font-semibold text-slate-500 italic mt-0.5">
                              {date.toLocaleDateString('en-IN', { month: 'short' })}
                            </p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Standard date input fallback for custom dates */}
                    <div className="space-y-1 pt-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block pl-1">Or Pick a Custom Future Date</label>
                      <input 
                        type="date"
                        min={new Date().toISOString().substring(0, 10)}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full h-12 rounded-xl border border-slate-100 bg-slate-50/50 text-xs font-bold px-4 text-slate-700 outline-none focus:border-pink-300"
                      />
                    </div>
                  </div>

                  {/* Elegant Time Slots Selectors */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                      Select Delivery Slot
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {[
                        { label: '🌅 09:00 AM - 12:00 PM', name: 'Morning Premium', charge: 'Complimentary' },
                        { label: '☀️ 12:00 PM - 03:00 PM', name: 'Afternoon Matinee', charge: 'Complimentary' },
                        { label: '🌆 03:00 PM - 06:00 PM', name: 'Sunset Twilight', charge: 'Complimentary' },
                        { label: '🌃 06:00 PM - 09:00 PM', name: 'Midnight Prelude', charge: 'Complimentary' },
                        { label: '🌌 11:30 PM - 12:15 AM', name: 'Elite Midnight Supreme', charge: 'Complimentary' },
                        { label: '⚡ 02-Hour Express', name: 'VIP Rush Delivery', charge: 'Complimentary' },
                      ].map((slot) => {
                        const fullSlotName = `${slot.label} (${slot.name})`;
                        const isSelected = selectedSlot === fullSlotName;
                        return (
                          <button
                            key={slot.label}
                            type="button"
                            onClick={() => {
                              try { playBtnTap(); } catch(e){}
                              setSelectedSlot(fullSlotName);
                            }}
                            className={`p-4 rounded-2xl border text-left transition-all flex justify-between items-center ${
                              isSelected 
                                ? 'border-pink-500 bg-pink-50/10 shadow-sm' 
                                : 'border-slate-100 bg-slate-50/40 hover:border-pink-300'
                            }`}
                          >
                            <div>
                              <p className="text-xs font-black text-slate-800 tracking-tight">{slot.label}</p>
                              <p className="text-[10px] font-semibold text-slate-400 italic mt-0.5">{slot.name}</p>
                            </div>
                            <span className="text-[8px] font-black text-pink-600 uppercase tracking-widest bg-pink-50 px-2 py-1 rounded-md">
                              {slot.charge}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex justify-between">
                    <button 
                      onClick={handlePrevStep}
                      className="h-14 px-8 rounded-full border border-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      Back
                    </button>
                    <Button 
                      onClick={handleNextStep}
                      className="h-14 px-8 rounded-full bg-slate-900 hover:bg-pink-600 text-white text-xs font-black uppercase tracking-widest flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
                    >
                      Bespoke Upgrades
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* =========================================================
                  STEP 4: SPECIAL REQUEST & PACKAGING UPGRADES
                  ========================================================= */}
              {step === 4 && (
                <motion.div 
                  key="step-upgrades"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white border border-pink-100/50 rounded-[40px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(244,63,94,0.03)] space-y-8 text-left"
                >
                  <div className="flex items-center gap-4 border-b border-pink-100/20 pb-5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                      <Gift className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif font-black text-slate-800 italic">Bespoke Celebration Upgrades</h2>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Upgrade your sensory experience with gourmet extras</p>
                    </div>
                  </div>

                  {/* Gorgeous celebration upgrade checkboxes */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                      Select Upgrades (Will be added to final totals)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {SPECIAL_UPGRADES.map((upgrade) => {
                        const isSelected = selectedUpgrades.includes(upgrade.id);
                        return (
                          <button
                            key={upgrade.id}
                            type="button"
                            onClick={() => toggleUpgrade(upgrade.id)}
                            className={`p-5 rounded-3xl border text-left transition-all duration-300 flex items-center gap-4 relative overflow-hidden ${
                              isSelected 
                                ? 'border-pink-500 bg-pink-50/10 shadow-sm' 
                                : 'border-slate-100 bg-slate-50/40 hover:border-pink-300'
                            }`}
                          >
                            <div className="w-12 h-12 rounded-2xl bg-[#FAF6F8] border border-pink-100/20 flex items-center justify-center text-2xl shadow-inner shrink-0">
                              {upgrade.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-slate-800 text-sm truncate">{upgrade.name}</p>
                              <p className="text-[10px] text-slate-400 font-semibold italic truncate mt-0.5">{upgrade.desc}</p>
                              <p className="text-xs font-mono font-black text-pink-600 mt-1">₹{upgrade.price}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-pink-500 border-pink-500 text-white' : 'border-slate-200 bg-white'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Hand-written custom directions note box */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                      Bespoke Workhop Instructions / Calligraphy Note
                    </label>
                    <div className="relative bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <Edit3 className="absolute right-4 top-4 w-4 h-4 text-slate-400" />
                      <textarea 
                        placeholder="Ex. Please write 'Happy Birthday Papa' in elegant gold frosting, omit any plastic wrapping. Ring doorbell upon arrival." 
                        value={cakeInstructions}
                        onChange={(e) => setCakeInstructions(e.target.value)}
                        className="w-full h-24 bg-transparent border-none outline-none text-xs font-semibold text-slate-700 resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex justify-between">
                    <button 
                      onClick={handlePrevStep}
                      className="h-14 px-8 rounded-full border border-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      Back
                    </button>
                    <Button 
                      onClick={handleNextStep}
                      className="h-14 px-8 rounded-full bg-slate-900 hover:bg-pink-600 text-white text-xs font-black uppercase tracking-widest flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
                    >
                      Secure settlement
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* =========================================================
                  STEP 5: SECURE SETTLEMENT GATEWAY
                  ========================================================= */}
              {step === 5 && (
                <motion.div 
                  key="step-payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white border border-pink-100/50 rounded-[40px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(244,63,94,0.03)] space-y-8 text-left"
                >
                  <div className="flex items-center gap-4 border-b border-pink-100/20 pb-5">
                    <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-lg">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif font-black text-slate-800 italic">Secure Settlement Gateway</h2>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Stripe-certified unified value transaction</p>
                    </div>
                  </div>

                  {/* Payment Methods Chips Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'upi', name: 'UPI Gateway', icon: <Smartphone className="w-4 h-4" />, desc: 'GPay, PhonePe, UPI ID' },
                      { id: 'card', name: 'Credit / Debit', icon: <CreditCard className="w-4 h-4" />, desc: 'Visa, MasterCard' },
                      { id: 'wallet', name: 'Net Banking', icon: <QrCode className="w-4 h-4" />, desc: 'Corporate / Bank accounts' },
                      { id: 'cod', name: 'Cash On Delivery', icon: <CheckCircle2 className="w-4 h-4" />, desc: 'At your doorstep' }
                    ].map((m) => {
                      const isSelected = selectedPaymentMethod === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            try { playBtnTap(); } catch(e){}
                            setSelectedPaymentMethod(m.id);
                          }}
                          className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 h-28 ${
                            isSelected 
                              ? 'border-pink-500 bg-pink-50/10 shadow-sm' 
                              : 'border-slate-100 bg-slate-50/40 hover:border-pink-300'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-pink-500 text-white' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {m.icon}
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-800 tracking-tight leading-none">{m.name}</p>
                            <p className="text-[8px] text-slate-400 font-medium italic mt-1 leading-none">{m.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Conditional subforms */}
                  <AnimatePresence mode="wait">
                    
                    {/* UPI form */}
                    {selectedPaymentMethod === 'upi' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-4"
                      >
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Choose UPI Application</p>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { id: 'gpay', name: 'Google Pay' },
                            { id: 'phonepe', name: 'PhonePe' },
                            { id: 'paytm', name: 'Paytm' }
                          ].map((app) => (
                            <button
                              key={app.id}
                              type="button"
                              onClick={() => { try { playBtnTap(); } catch(e){} setSelectedUpiApp(app.id); }}
                              className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                                selectedUpiApp === app.id 
                                  ? 'border-pink-500 bg-pink-100/10 text-pink-600' 
                                  : 'border-slate-100 bg-white text-slate-600 hover:border-pink-300'
                              }`}
                            >
                              {app.name}
                            </button>
                          ))}
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block pl-1">Or Enter UPI ID</label>
                          <Input placeholder="e.g. yourname@okaxis" className="rounded-xl border-slate-100 bg-white" />
                        </div>
                      </motion.div>
                    )}

                    {/* Card form */}
                    {selectedPaymentMethod === 'card' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-4"
                      >
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Card Number</label>
                          <Input 
                            placeholder="💳 0000 0000 0000 0000" 
                            value={cardDetails.number}
                            onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                            className="rounded-xl border-slate-100 bg-white font-mono"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Expiry Date</label>
                            <Input 
                              placeholder="MM/YY" 
                              value={cardDetails.expiry}
                              onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                              className="rounded-xl border-slate-100 bg-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">CVC Secure Code</label>
                            <Input 
                              placeholder="000" 
                              value={cardDetails.cvc}
                              onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                              className="rounded-xl border-slate-100 bg-white"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* COD Terms */}
                    {selectedPaymentMethod === 'cod' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 bg-pink-500/5 rounded-3xl border border-pink-100/20 text-xs font-semibold italic text-slate-500 leading-relaxed"
                      >
                        🌟 <span className="text-pink-600 font-bold">Premium COD Enabled:</span> Pay cash or scan UPI code on delivery. Please note that our delivery agents are certified for hygienic contact-free exchange.
                      </motion.div>
                    )}

                  </AnimatePresence>

                  <div className="pt-6 border-t border-slate-100 flex justify-between">
                    <button 
                      onClick={handlePrevStep}
                      className="h-14 px-8 rounded-full border border-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      Back
                    </button>
                    <Button 
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="h-14 px-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-pink-500/20 text-white text-xs font-black uppercase tracking-widest flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
                    >
                      {loading ? 'Transmitting transaction details...' : 'Place Order'}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* RIGHT SIDE 35% - STICKY ORDER SUMMARY PANEL */}
          <div className="lg:col-span-4 lg:sticky lg:top-[120px] space-y-6">
            
            {/* Gallery selected list */}
            <div className="bg-white border border-pink-100/50 rounded-[36px] p-8 shadow-[0_20px_50px_rgba(244,63,94,0.03)] space-y-6 text-left relative overflow-hidden">
              <h3 className="font-serif font-black text-slate-800 text-xl tracking-tight flex items-center gap-2 border-b border-pink-100/20 pb-4">
                <Grid className="w-4.5 h-4.5 text-pink-500" />
                Artisanal Selections
              </h3>

              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-4 items-center border-b border-slate-50 pb-3 last:border-none">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                      <img src={item.images?.[0]} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-xs text-slate-800 truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-semibold italic mt-0.5">{item.quantity} x {item.selectedWeight}kg</p>
                    </div>
                    <span className="text-xs font-serif font-black text-slate-700 whitespace-nowrap">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* Delivery info HUD */}
              <div className="p-4 bg-slate-50 rounded-2xl space-y-2 border border-slate-100 text-[11px] font-bold text-slate-600">
                <p className="text-[8px] font-black uppercase tracking-widest text-pink-600">Secure Destination Reservation</p>
                <div className="flex items-center gap-1.5 text-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                  <span className="truncate">{activeAddress.line1}, {activeAddress.sector}, Faridabad</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-800">
                  <Calendar className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  <span>{new Date(selectedDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-800">
                  <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="truncate">{selectedSlot.split(' ')[0]} PM Delivery Slot</span>
                </div>
              </div>

              {/* Cost ledger */}
              <div className="space-y-3 font-bold text-xs border-t border-pink-100/20 pt-5">
                <div className="flex justify-between text-slate-400">
                  <span>Cart Subtotal</span>
                  <span className="text-slate-800">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Standard Boutique Discount</span>
                  <span className="text-emerald-600">-₹{boutiqueDiscount.toLocaleString('en-IN')}</span>
                </div>
                {upgradeCost > 0 && (
                  <div className="flex justify-between text-slate-400">
                    <span>Celebration Upgrades</span>
                    <span className="text-pink-600">+₹{upgradeCost.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Gourmet VAT (5%)</span>
                  <span className="text-slate-800">₹{taxes.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Logistics Transport</span>
                  <span className="text-pink-500 uppercase tracking-widest text-[9px]">COMPLIMENTARY</span>
                </div>
                
                <div className="flex justify-between items-baseline pt-4 border-t border-slate-100 text-sm">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Bespoke total</span>
                  <span className="text-3xl font-serif font-black text-pink-600 italic leading-none">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

            </div>

            {/* Satisfaction validation credit badge */}
            <div className="p-6 rounded-[28px] bg-slate-900 text-white flex flex-col gap-3 shadow-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-pink-500/20 transition-all duration-500" />
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-pink-400 shadow-sm shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-pink-400 italic">Unmatched Assurance</p>
                <p className="text-[11px] text-white/70 leading-relaxed font-semibold italic mt-1.5">
                  Every CakeUrban creation is guaranteed 100% fresh, baked fresh-to-order at our Faridabad culinary atelier under strict luxury standards. 🎂✨
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
