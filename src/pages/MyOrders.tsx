import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  Star, 
  RotateCcw, 
  Search, 
  Download, 
  Share2, 
  Tag, 
  Award, 
  Sparkles, 
  Gift, 
  X, 
  Filter, 
  CheckCircle2, 
  Info,
  SlidersHorizontal,
  PartyPopper,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import SEO from '../components/SEO';
import { playBtnTap, playSuccessChime, playSlidePop } from '../lib/sound';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';

// 1. Mock Order History data mirroring the realistic schema
const MOCK_ORDERS = [
  {
    id: 'CKU10245',
    date: 'July 08, 2026',
    time: '12:30 PM',
    occasion: 'Birthday',
    status: 'processing',
    statusLabel: 'Chef Baking Sponge',
    totalPrice: 1499,
    paymentMethod: 'UPI (Stripe Secure)',
    weight: 1.5,
    flavor: 'Belgian Chocolate Truffle',
    message: 'Happy Birthday Dev!',
    eggless: true,
    extras: ['Sparkling Candle', 'Golden Cake Topper'],
    instructions: 'Please deliver strictly before 4:00 PM.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80',
    address: 'Sector 15, Near Crown Plaza, Faridabad, 121002'
  },
  {
    id: 'CKU09812',
    date: 'June 28, 2026',
    time: '07:15 PM',
    occasion: 'Anniversary',
    status: 'delivered',
    statusLabel: 'Delivered in Cold-Box',
    totalPrice: 2899,
    paymentMethod: 'Credit Card (Apple Pay)',
    weight: 2.0,
    flavor: 'Sicilian Pistachio Swirl',
    message: 'Together Forever ❤️',
    eggless: false,
    extras: ['Organic Lavender Sprig'],
    instructions: 'Keep in refrigerator immediately.',
    image: 'https://images.unsplash.com/photo-1511018556340-d16986a1c194?w=500&q=80',
    address: 'Villas Row No. 12, Greenfields, Faridabad, 121003'
  },
  {
    id: 'CKU08541',
    date: 'May 14, 2026',
    time: '03:40 PM',
    occasion: 'Wedding',
    status: 'delivered',
    statusLabel: 'Hand-Delivered by Lead Courier',
    totalPrice: 8499,
    paymentMethod: 'Net Banking',
    weight: 5.0,
    flavor: 'Royal Red Velvet Rose',
    message: 'Wishing Love & Joy',
    eggless: true,
    extras: ['Heavy-Duty Premium Base', 'Dry-Ice Ambient Smoke Effect'],
    instructions: 'Ensure setup on the central cake table.',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=500&q=80',
    address: 'Grand Royale Banquet, Sector 21-C, Faridabad, 121001'
  },
  {
    id: 'CKU07412',
    date: 'April 02, 2026',
    time: '11:00 AM',
    occasion: 'Kids Party',
    status: 'cancelled',
    statusLabel: 'Cancelled by Customer',
    totalPrice: 1899,
    paymentMethod: 'UPI (Paytm)',
    weight: 1.0,
    flavor: 'Pastel Rainbow Confetti',
    message: 'Happy 5th Kabir!',
    eggless: false,
    extras: ['Pack of 5 Sparklers'],
    instructions: 'Make it extra colorful.',
    image: 'https://images.unsplash.com/photo-1514517604298-cf80e0fb7f1e?w=500&q=80',
    address: 'Apartment 402, Charmwood Plaza, Faridabad, 121009'
  },
  {
    id: 'CKU06934',
    date: 'March 18, 2026',
    time: '04:15 PM',
    occasion: 'Corporate',
    status: 'delivered',
    statusLabel: 'Delivered',
    totalPrice: 5600,
    paymentMethod: 'Corporate Invoice',
    weight: 3.5,
    flavor: 'Classic Roasted Almond Mocha',
    message: 'Happy 10th Anniversary UrbanTech!',
    eggless: true,
    extras: ['Custom Logo Printed Plate'],
    instructions: 'Require tax invoice copy.',
    image: 'https://images.unsplash.com/photo-1562266648-90e6e2e5df13?w=500&q=80',
    address: 'UrbanTech Hub, Sector 12-A, Faridabad, 121007'
  }
];

// Quick statistics counters
const STATS_DATA = [
  { label: 'Total Orders', value: '14', icon: '🛍️', color: 'from-[#DFB15B]/20 to-amber-500/5', textColor: 'text-[#DFB15B]' },
  { label: 'Saved Money', value: '₹4,250', icon: '💸', color: 'from-emerald-500/20 to-teal-500/5', textColor: 'text-emerald-400' },
  { label: 'Reward Points', value: '850 pts', icon: '👑', color: 'from-purple-500/20 to-pink-500/5', textColor: 'text-purple-400' },
  { label: 'Active Bakes', value: '1 Active', icon: '🧑‍🍳', color: 'from-blue-500/20 to-cyan-500/5', textColor: 'text-blue-400' }
];

export default function MyOrders() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // 2. Filter & Tab states
  const [activeTab, setActiveTab] = useState<'all' | 'delivered' | 'processing' | 'cancelled'>('all');
  const [activeOccasionFilter, setActiveOccasionFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  
  // Rating modal simulator state
  const [ratingModalOrderId, setRatingModalOrderId] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  // Real-time listener for Firestore orders
  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveOrders: any[] = [];
      snapshot.docs.forEach((docSnap) => {
        const d = docSnap.data();
        // If logged in, filter or display all for guest preview
        const isMatch = !user || !d.userId || d.userId === user.uid || d.guestEmail === user.email;
        if (isMatch) {
          liveOrders.push({
            id: d.id || docSnap.id,
            date: d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Today',
            time: d.createdAt ? new Date(d.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '12:00 PM',
            occasion: d.occasion || 'Celebration',
            status: d.status === 'delivered' ? 'delivered' : (d.status === 'cancelled' ? 'cancelled' : 'processing'),
            statusLabel: d.status === 'delivered' ? 'Delivered' : (d.status === 'cancelled' ? 'Cancelled' : 'Chef Baking Sponge'),
            totalPrice: d.total || 1499,
            paymentMethod: d.paymentMethod ? d.paymentMethod.toUpperCase() : 'UPI',
            weight: d.items?.[0]?.weight || 1.0,
            flavor: d.items?.[0]?.flavor || d.items?.[0]?.name || 'Belgian Chocolate Truffle',
            message: d.cakeInstructions || 'Sweet Celebrations!',
            eggless: true,
            extras: d.upgrades || ['Sparkling Candle'],
            instructions: d.cakeInstructions || '',
            image: d.items?.[0]?.images?.[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80',
            address: d.shippingAddress?.line1 ? `${d.shippingAddress.line1}, ${d.shippingAddress.sector || ''}, ${d.shippingAddress.city || 'Faridabad'}` : 'Faridabad, Delhi NCR'
          });
        }
      });

      setOrders(liveOrders);
    }, (error) => {
      console.warn("Real-time my orders warning:", error);
      setOrders([]);
    });

    return () => unsubscribe();
  }, [user]);

  // Audio helper wrapper
  const playSound = (type: 'tap' | 'pop' | 'success') => {
    if (isMuted) return;
    try {
      if (type === 'tap') playBtnTap();
      if (type === 'pop') playSlidePop();
      if (type === 'success') playSuccessChime();
    } catch (e) {
      console.warn("Sound play error:", e);
    }
  };

  const handleOpenRatingModal = (orderId: string) => {
    playSound('pop');
    setRatingModalOrderId(orderId);
  };

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('success');
    toast.success("Thank you for your valuable feedback!", {
      description: "Our gourmet chefs have received your review."
    });
    setRatingModalOrderId(null);
    setRatingComment('');
    setSelectedRating(5);
  };

  // 3. Filter orders based on tabs, search and tags
  const filteredOrders = orders.filter((order) => {
    // 1. Tab status match
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    // 2. Search query match (id, flavor, message)
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.flavor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.message && order.message.toLowerCase().includes(searchQuery.toLowerCase()));
    // 3. Occasion chip match
    const matchesOccasion = activeOccasionFilter === 'All' || order.occasion.toLowerCase() === activeOccasionFilter.toLowerCase();

    return matchesTab && matchesSearch && matchesOccasion;
  });

  return (
    <div className="min-h-screen bg-transparent text-[#FFFDFB] font-sans selection:bg-[#DFB15B]/30 selection:text-[#DFB15B] pb-24 overflow-hidden relative">
      <SEO 
        title="My Orders Dashboard | CakeUrban"
        description="View your past handcrafted treats, track active custom orders in real-time, and manage delivery specifications."
      />

      {/* Cybernetic Glowing Circles */}
      <div className="absolute top-0 left-0 right-0 h-[600px] pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[60%] bg-purple-500/5 rounded-full blur-3xl animate-wave-slow" />
        <div className="absolute top-[30%] left-[-10%] w-[55%] h-[70%] bg-[#DFB15B]/5 rounded-full blur-3xl animate-wave-third" />
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 pt-12 relative z-10 space-y-12">
        
        {/* TOP TITLE HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div className="text-left space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#DFB15B]/10 border border-[#DFB15B]/30 px-3.5 py-1 rounded-full">
              <Sparkles className="w-4 h-4 text-[#DFB15B]" />
              <span className="text-[10px] font-black uppercase tracking-wider text-[#DFB15B]">Vip Gourmet Lounge</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
              My <span className="bg-gradient-to-r from-[#DFB15B] via-[#E8B869] to-[#FFF] bg-clip-text text-transparent">Orders</span>
            </h1>
            <p className="text-slate-400 text-xs md:text-sm font-semibold max-w-xl">
              Manage your handcrafted selections, access active baking streams, and download tax receipts.
            </p>
          </div>

          {/* Sound toggle utility */}
          <button 
            onClick={() => { setIsMuted(!isMuted); playSound('tap'); }}
            className="self-start md:self-auto px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all text-slate-300"
          >
            {isMuted ? '🔇 Mute Off' : '🔊 Sound On'}
          </button>
        </div>

        {/* METRIC STATISTICS ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {STATS_DATA.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="luxury-glass-tile p-5 md:p-6 rounded-[28px] text-left flex items-center justify-between shadow-lg relative overflow-hidden group"
            >
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">{stat.label}</span>
                <span className={`text-2xl md:text-3xl font-black tracking-tight ${stat.textColor}`}>{stat.value}</span>
              </div>
              <span className="text-3xl md:text-4xl opacity-90 group-hover:scale-110 transition-transform duration-300">{stat.icon}</span>
            </motion.div>
          ))}
        </div>

        {/* SEARCH & FILTERS CONTROLS */}
        <div className="luxury-glass-tile p-4 md:p-6 rounded-[32px] space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search Capsule */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search orders by Order ID, flavor, or custom icing message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 bg-white/5 hover:bg-white/10 focus:bg-white/10 rounded-2xl pl-11 pr-4 text-xs font-semibold text-white placeholder-slate-400 border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#DFB15B]/50 transition-colors"
              />
            </div>

            {/* Quick Tabs list */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Orders' },
                { id: 'processing', label: 'Processing' },
                { id: 'delivered', label: 'Delivered' },
                { id: 'cancelled', label: 'Cancelled' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as any); playSound('tap'); }}
                  className={`h-11 px-5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-r from-[#DFB15B] to-[#B88E3D] text-slate-950 shadow-[0_4px_15px_rgba(223,177,91,0.35)]' 
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

          </div>

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10 text-left">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Occasions:
            </span>
            {['All', 'Birthday', 'Anniversary', 'Wedding', 'Kids', 'Corporate'].map((tag) => (
              <button
                key={tag}
                onClick={() => { setActiveOccasionFilter(tag); playSound('tap'); }}
                className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeOccasionFilter === tag 
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50' 
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* ORDERS DASHBOARD CARDS LIST */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, idx) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="luxury-glass-tile rounded-[36px] overflow-hidden shadow-2xl relative group"
                >
                  {/* Glossy line effect */}
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#DFB15B]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* CARD INNER LAYOUT */}
                  <div className="p-6 md:p-8 flex flex-col xl:flex-row gap-8 text-left">
                    
                    {/* Part 1: Product Cake Image & Status indicator */}
                    <div className="w-full xl:w-56 space-y-4 shrink-0">
                      <div className="aspect-square w-full rounded-3xl overflow-hidden relative border border-white/10 shadow-md">
                        <img 
                          src={order.image} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                          alt={order.flavor}
                        />
                        
                        {/* Occasion Label Tag */}
                        <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-[#DFB15B] flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {order.occasion}
                        </div>
                      </div>

                      {/* Status timeline link widget */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold text-slate-500 uppercase block tracking-wider">LATEST LOG</span>
                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${order.status === 'processing' ? 'bg-[#DFB15B] animate-ping' : order.status === 'cancelled' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wide max-w-[120px] truncate">{order.statusLabel}</span>
                          </div>
                          {order.status === 'processing' && (
                            <Link 
                              to={`/track-order/${order.id}`}
                              onClick={() => playSound('pop')}
                              className="text-[9px] font-black uppercase tracking-widest text-[#DFB15B] hover:underline"
                            >
                              Live Map
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Part 2: Product specifics / details */}
                    <div className="flex-1 space-y-6">
                      
                      {/* Top Order header (Reference & Date) */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                        <div>
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Order ID</span>
                          <h3 className="text-xl font-extrabold text-white tracking-tight">{order.id}</h3>
                        </div>
                        <div className="sm:text-right">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Ordered On</span>
                          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 sm:justify-end">
                            <Calendar className="w-3.5 h-3.5 text-[#DFB15B]" />
                            {order.date} • {order.time}
                          </span>
                        </div>
                      </div>

                      {/* Specs details Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs font-semibold text-slate-300">
                        <div>
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Gourmet Recipe</span>
                          <span className="text-white font-extrabold">{order.flavor}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Dimensions</span>
                          <span className="text-white font-extrabold">{order.weight} Kilograms</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Dietary Spec</span>
                          <span className={`${order.eggless ? 'text-emerald-400' : 'text-slate-400'} font-extrabold flex items-center gap-1`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {order.eggless ? 'Eggless Certified' : 'Traditional Egg Sponge'}
                          </span>
                        </div>

                        {order.message && (
                          <div className="col-span-2 sm:col-span-3 bg-[#DFB15B]/5 border border-[#DFB15B]/10 p-3.5 rounded-2xl">
                            <span className="text-[9px] font-bold text-[#DFB15B] uppercase tracking-wider block mb-0.5">Custom Icing Message</span>
                            <span className="text-white font-black text-sm italic">"{order.message}"</span>
                          </div>
                        )}

                        <div className="col-span-2 sm:col-span-3 space-y-1">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Gourmet Add-ons</span>
                          <div className="flex flex-wrap gap-2">
                            {order.extras.map((ex) => (
                              <span key={ex} className="bg-white/5 border border-white/5 text-[10px] text-slate-300 px-3 py-1 rounded-xl">
                                ✨ {ex}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="col-span-2 sm:col-span-3 text-left">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Bespoke Instructions</span>
                          <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">
                            "{order.instructions || "None"}"
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Part 3: Address / Price breakdown / Actions */}
                    <div className="w-full xl:w-72 bg-white/[0.01] border-t xl:border-t-0 xl:border-l border-white/5 pt-6 xl:pt-0 xl:pl-6 space-y-6 flex flex-col justify-between shrink-0">
                      
                      {/* Price & Payment Breakdown */}
                      <div className="space-y-4">
                        <div>
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Total Amount</span>
                          <span className="text-2xl font-black text-[#DFB15B] tracking-tight">₹{order.totalPrice.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">via {order.paymentMethod}</span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Shipment Location</span>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                            {order.address}
                          </p>
                        </div>
                      </div>

                      {/* Operational buttons */}
                      <div className="space-y-3">
                        {order.status === 'processing' ? (
                          <Link
                            to={`/track-order/${order.id}`}
                            onClick={() => playSound('pop')}
                            className="flex items-center justify-center gap-2 h-11 w-full rounded-2xl bg-[#DFB15B] hover:brightness-110 text-[#140603] font-black uppercase tracking-wider text-xs transition-colors"
                          >
                            <span>Live Map Tracker</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        ) : (
                          <button
                            onClick={() => {
                              toast.success("Belgian gold recipe added back to basket!");
                              playSound('success');
                              navigate('/cart');
                            }}
                            className="flex items-center justify-center gap-2 h-11 w-full rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-extrabold uppercase tracking-wider text-xs transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-4 h-4 text-[#DFB15B]" />
                            <span>Reorder Recipe</span>
                          </button>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => {
                              toast.info("Gourmet Tax Invoice PDF download initiated.");
                              playSound('tap');
                            }}
                            className="h-10 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 text-[10px] text-slate-300 font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5 text-[#DFB15B]" />
                            Invoice
                          </button>

                          {order.status === 'delivered' ? (
                            <button
                              onClick={() => handleOpenRatingModal(order.id)}
                              className="h-10 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 text-[10px] text-slate-300 font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                            >
                              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                              Rate Cake
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                toast.info("Link copied! Share this tracker with guests.");
                                playSound('tap');
                              }}
                              className="h-10 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 text-[10px] text-slate-300 font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                            >
                              <Share2 className="w-3.5 h-3.5 text-blue-400" />
                              Share
                            </button>
                          )}
                        </div>
                      </div>

                    </div>

                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-24 bg-white/[0.01] border border-white/[0.05] rounded-[36px] text-center space-y-6"
              >
                <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto animate-pulse" />
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-xl font-extrabold text-white">No matching recipes found</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                    We couldn't find any orders matching your filters. Try shifting tabs or searching another keyword.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('all');
                    setActiveOccasionFilter('All');
                    setSearchQuery('');
                    playSound('tap');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#DFB15B] text-[#140603] font-black text-xs uppercase tracking-wider"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BOTTOM MOTIVATION BANNER: Need Another Cake? */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-tr from-purple-900/40 via-pink-900/20 to-amber-950/20 border border-purple-500/15 rounded-[36px] p-8 md:p-12 text-center md:text-left relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Glowing ambient backing */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 max-w-2xl relative z-10">
            <span className="bg-purple-500/10 border border-purple-500/30 text-purple-400 font-extrabold text-[10px] uppercase tracking-widest px-3.5 py-1 rounded-full inline-block">
              Upcoming Celebration?
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none">
              Need Another Masterpiece?
            </h2>
            <p className="text-slate-300 text-xs md:text-sm font-semibold leading-relaxed">
              Plan your next milestone event early. Command a custom-tier luxury cake with gold accents, customized flavors, and precision climate carriage.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full md:w-auto shrink-0">
            <Link
              to="/custom-order"
              onClick={() => playSound('tap')}
              className="h-12 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-extrabold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-1.5"
            >
              Custom Cake Builder
            </Link>
            <Link
              to="/shop"
              onClick={() => playSound('tap')}
              className="h-12 px-6 rounded-2xl bg-[#DFB15B] hover:brightness-110 text-[#140603] font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <span>Shop Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* FEEDBACK RATING DIALOG MODAL SIMULATOR */}
        <AnimatePresence>
          {ratingModalOrderId && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setRatingModalOrderId(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />

              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative bg-[#1c0c0a] border border-white/10 rounded-[36px] max-w-md w-full p-6 md:p-8 shadow-2xl z-10 text-left space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    Rate Your Experience
                  </h3>
                  <button onClick={() => setRatingModalOrderId(null)} className="p-1.5 rounded-full hover:bg-white/5 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Gourmet Order ID</span>
                  <p className="text-xs font-black text-[#DFB15B]">{ratingModalOrderId}</p>
                </div>

                <form onSubmit={handleSubmitRating} className="space-y-4">
                  {/* Stars select */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Overall Score</span>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => { setSelectedRating(star); playSound('tap'); }}
                          className="p-1 group transition-transform hover:scale-110 cursor-pointer"
                        >
                          <Star className={`w-8 h-8 ${star <= selectedRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment block */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Chef Feedback</span>
                    <textarea 
                      placeholder="Comment on sponge softness, icing balance, floral details, or delivery promptness..."
                      value={ratingComment}
                      onChange={(e) => setRatingComment(e.target.value)}
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#DFB15B]/50 focus:border-[#DFB15B]/50 transition-all font-semibold"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setRatingModalOrderId(null)}
                      className="h-11 px-5 rounded-xl bg-white/5 text-slate-300 font-extrabold text-xs uppercase tracking-wider hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="h-11 px-5 rounded-xl bg-[#DFB15B] text-[#140603] font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
