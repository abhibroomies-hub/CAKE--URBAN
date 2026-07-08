import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Heart, 
  Gift, 
  MapPin, 
  CreditCard, 
  Bell, 
  HelpCircle, 
  Users, 
  ChevronRight, 
  Sparkles, 
  Calendar, 
  Clock, 
  Plus, 
  ArrowRight, 
  Star, 
  Info, 
  Check, 
  LogOut,
  SlidersHorizontal,
  Flame,
  Award,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import SEO from '../components/SEO';
import { playBtnTap, playSuccessChime, playSlidePop } from '../lib/sound';

export default function PremiumDashboard() {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  
  // Interactive States
  const [activeCategory, setActiveCategory] = useState('All');
  const [wishlistItems, setWishlistItems] = useState<number[]>([1, 3]);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    rewardCoins: 0,
    wishlistCount: 0,
    customCakes: 0,
    savedCakes: 0,
    upcomingDeliveries: 0
  });

  // Sound play wrapper
  const playSound = (type: 'tap' | 'pop' | 'success') => {
    if (isMuted) return;
    try {
      if (type === 'tap') playBtnTap();
      if (type === 'pop') playSlidePop();
      if (type === 'success') playSuccessChime();
    } catch (e) {
      console.warn('Sound error:', e);
    }
  };

  // Simulating CRED / Stripe style number counter count-up effect
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setStats({
        totalOrders: Math.round((12 / steps) * step),
        rewardCoins: Math.round((2450 / steps) * step),
        wishlistCount: Math.round((8 / steps) * step),
        customCakes: Math.round((4 / steps) * step),
        savedCakes: Math.round((6 / steps) * step),
        upcomingDeliveries: Math.round((1 / steps) * step) === 0 && step < steps - 15 ? 0 : 1
      });

      if (step >= steps) {
        clearInterval(timer);
        setStats({
          totalOrders: 12,
          rewardCoins: 2450,
          wishlistCount: 8,
          customCakes: 4,
          savedCakes: 6,
          upcomingDeliveries: 1
        });
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  const handleToggleWishlist = (id: number) => {
    playSound('pop');
    if (wishlistItems.includes(id)) {
      setWishlistItems(prev => prev.filter(item => item !== id));
      toast.info('Removed from your private collection');
    } else {
      setWishlistItems(prev => [...prev, id]);
      toast.success('Saved to your private collection', {
        icon: '💖'
      });
    }
  };

  const handleAddToCart = (productName: string) => {
    playSound('success');
    toast.success(`${productName} added to celebration order!`, {
      description: 'Your premium selection is reserved.',
      action: {
        label: 'View Cart',
        onClick: () => navigate('/cart')
      }
    });
  };

  // AI Personalized premium products
  const RECOMMENDED_PRODUCTS = [
    {
      id: 1,
      name: 'Midnight Gold Ganache',
      category: 'Chocolate',
      price: '₹1,899',
      rating: '4.9',
      reviews: '124',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
      tag: 'Bestseller',
      desc: 'Double Belgian couverture infused with premium edible 24K gold leaves.'
    },
    {
      id: 2,
      name: 'Sicilian Pistachio Swirl',
      category: 'Luxury Collection',
      price: '₹2,499',
      rating: '5.0',
      reviews: '86',
      image: 'https://images.unsplash.com/photo-1511018556340-d16986a1c194?w=600&q=80',
      tag: 'Chef Exclusive',
      desc: 'Slow-roasted Bronte pistachio cream with delicate white chocolate frosting.'
    },
    {
      id: 3,
      name: 'Royal Lavande Rosé',
      category: 'Wedding',
      price: '₹3,200',
      rating: '4.8',
      reviews: '42',
      image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=600&q=80',
      tag: 'Trending',
      desc: 'Infused with fresh organic French lavender and organic Madagascar vanilla.'
    },
    {
      id: 4,
      name: 'Pastel Rainbow Spark',
      category: 'Kids',
      price: '₹1,650',
      rating: '4.9',
      reviews: '210',
      image: 'https://images.unsplash.com/photo-1514517604298-cf80e0fb7f1e?w=600&q=80',
      tag: 'Kids Favorite',
      desc: 'Fluffy sponge layers with luxury Swiss buttercream and magical sprinkles.'
    },
    {
      id: 5,
      name: 'Elysian Berry Cascade',
      category: 'Designer Cakes',
      price: '₹2,100',
      rating: '4.9',
      reviews: '98',
      image: 'https://images.unsplash.com/photo-1562266648-90e6e2e5df13?w=600&q=80',
      tag: 'Seasonal Special',
      desc: 'Rich organic berry compote layered with light velvet sponge.'
    }
  ];

  const filteredProducts = activeCategory === 'All' 
    ? RECOMMENDED_PRODUCTS 
    : RECOMMENDED_PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans relative overflow-hidden pb-24 selection:bg-pink-100 selection:text-pink-600">
      <SEO 
        title="Premium Member Dashboard | CakeUrban"
        description="Experience the ultimate luxury baking lounge. Check your reward progress, view custom milestone events, and configure concierge shipments."
      />

      {/* Modern Airbnb/Apple style fluid background blobs */}
      <div className="absolute top-0 left-0 right-0 h-[800px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[70%] bg-pink-200/30 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[60%] bg-purple-200/30 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '14s' }} />
        <div className="absolute top-[40%] left-[25%] w-[45%] h-[50%] bg-blue-200/20 rounded-full blur-[130px] animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 pt-8 space-y-10 relative">
        
        {/* TOP STATUS BAR & NOTIFICATION BOX */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/40 backdrop-blur-md border border-white/60 p-4 rounded-3xl shadow-[0_8px_32px_rgba(31,38,135,0.03)]">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-pink-500 animate-ping" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Gourmet Lounge Active</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { setIsMuted(!isMuted); playSound('tap'); }}
              className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200/60 text-[10px] font-black uppercase tracking-wider text-slate-500 hover:bg-slate-100/50 transition-all flex items-center gap-1.5"
            >
              {isMuted ? '🔇 Audio Off' : '🔊 Audio On'}
            </button>
            <div className="h-4 w-[1px] bg-slate-200" />
            <span className="text-xs font-bold text-slate-500">Local Time: 12:45 PM</span>
          </div>
        </div>

        {/* 1. TOP WELCOME SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Welcome User Block */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
            
            {/* Large User Avatar Container */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="relative shrink-0"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[32px] overflow-hidden bg-gradient-to-tr from-pink-400 via-purple-400 to-amber-300 p-1 shadow-[0_15px_30px_rgba(244,114,182,0.25)]">
                <div className="w-full h-full rounded-[28px] bg-white flex items-center justify-center text-4xl select-none">
                  🧑‍💻
                </div>
              </div>
              {/* Premium Floating Ring */}
              <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-2xl shadow-md border border-slate-100">
                <span className="bg-[#DFB15B]/10 border border-[#DFB15B]/30 px-2.5 py-1 rounded-xl text-[10px] font-black text-[#DFB15B] uppercase tracking-wider flex items-center gap-1">
                  👑 VIP
                </span>
              </div>
            </motion.div>

            {/* Greeting details */}
            <div className="space-y-3 flex-1 min-w-0">
              <div className="space-y-1">
                <span className="text-xs font-extrabold text-pink-500 uppercase tracking-[0.2em] block">Exclusive Member Since 2024</span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-none">
                  Good Morning,<br />
                  <span className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 bg-clip-text text-transparent">Abhishek 👋</span>
                </h1>
              </div>

              {/* Badges and tags */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
                <span className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-sm flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  Gold Member
                </span>
                <span className="bg-purple-100 text-purple-700 border border-purple-200/50 text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest">
                  850 Level Points
                </span>
                <button 
                  onClick={() => {
                    toast.success('Your gold membership secures same-day delivery priority!');
                    playSound('tap');
                  }}
                  className="p-1.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all text-slate-400 hover:text-slate-600"
                  title="Membership Details"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Progress Ring / Reward Card Block */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-slate-200/60 rounded-[36px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex items-center justify-between gap-6 relative overflow-hidden group"
            >
              {/* Abstract Glass card background lines */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-pink-300 to-purple-300 rounded-full blur-2xl opacity-10 pointer-events-none" />

              <div className="text-left space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Reward Points Balance</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl md:text-4xl font-black text-slate-900">{stats.rewardCoins}</span>
                  <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest bg-purple-50 px-2 py-0.5 rounded-md">Cake Coins</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium max-w-[180px]">
                  You are <span className="text-pink-500 font-extrabold">550 coins</span> away from unlocking Platinum tier.
                </p>
                <Link 
                  to="/rewards"
                  onClick={() => playSound('pop')}
                  className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-pink-500 hover:text-pink-600 group"
                >
                  <span>Redeem Now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* ANIMATED PROGRESS CIRCLE */}
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-95">
                  <circle 
                    cx="56" 
                    cy="56" 
                    r="46" 
                    className="stroke-slate-100" 
                    strokeWidth="8" 
                    fill="transparent" 
                  />
                  <motion.circle 
                    cx="56" 
                    cy="56" 
                    r="46" 
                    className="stroke-pink-500" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray="290"
                    initial={{ strokeDashoffset: 290 }}
                    animate={{ strokeDashoffset: 290 - (290 * 0.72) }} // 72% completed
                    transition={{ duration: 1.8, ease: 'easeOut' }}
                    strokeLinecap="round"
                  />
                </svg>
                {/* Central Circle label */}
                <div className="absolute flex flex-col items-center">
                  <span className="text-xs font-black text-slate-800">72%</span>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">To Platinum</span>
                </div>
              </div>

            </motion.div>
          </div>

        </div>

        {/* 2. QUICK STATISTICS ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6">
          {[
            { label: 'Total Orders', value: stats.totalOrders, icon: '🛍️', color: 'bg-pink-50 text-pink-600 border-pink-100/50' },
            { label: 'Cake Coins', value: stats.rewardCoins, icon: '🪙', color: 'bg-purple-50 text-purple-600 border-purple-100/50' },
            { label: 'Wishlist Cakes', value: stats.wishlistCount, icon: '💖', color: 'bg-rose-50 text-rose-600 border-rose-100/50' },
            { label: 'Custom Bakes', value: stats.customCakes, icon: '🧑‍🍳', color: 'bg-blue-50 text-blue-600 border-blue-100/50' },
            { label: 'Saved Cakes', value: stats.savedCakes, icon: '🍰', color: 'bg-amber-50 text-amber-600 border-amber-100/50' },
            { label: 'Upcoming Deliveries', value: stats.upcomingDeliveries, icon: '🚚', color: 'bg-emerald-50 text-emerald-600 border-emerald-100/50' }
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * idx }}
              className={`bg-white border border-slate-200/50 p-5 rounded-[28px] text-left flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.01)] group hover:border-pink-200 transition-all`}
            >
              <div className="flex items-center justify-between">
                <span className={`w-10 h-10 rounded-2xl ${stat.color} flex items-center justify-center text-lg shadow-sm border`}>
                  {stat.icon}
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Live</span>
              </div>
              <div className="space-y-1 mt-6">
                <span className="text-2xl font-black text-slate-950 tracking-tight block">
                  {stat.value}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
                  {stat.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 3. SHORTCUT GRID */}
        <div className="space-y-5">
          <div className="text-left">
            <h3 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-pink-500" />
              Lounge Shortcuts
            </h3>
            <p className="text-xs text-slate-400 font-medium">Click to navigate or access specialized support modules.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'My Orders', desc: 'Track, view, reorder receipts', icon: ShoppingBag, href: '/my-orders', bg: 'hover:bg-pink-50/20' },
              { label: 'Wishlist Collection', desc: 'Sponge formulations', icon: Heart, href: '/account?tab=wishlist', bg: 'hover:bg-rose-50/20' },
              { label: 'Rewards Program', desc: 'Redeem cake multipliers', icon: Gift, href: '/rewards', bg: 'hover:bg-purple-50/20' },
              { label: 'Saved Addresses', desc: 'Milestone shipping zones', icon: MapPin, href: '/account?tab=addresses', bg: 'hover:bg-blue-50/20' },
              { label: 'Saved Payments', desc: 'Stripe, Razorpay, Apple Pay', icon: CreditCard, href: '/account?tab=payments', bg: 'hover:bg-amber-50/20' },
              { label: 'Gourmet Support', desc: 'Direct chef ticket log', icon: HelpCircle, href: '/account?tab=support', bg: 'hover:bg-teal-50/20' },
              { label: 'Invite Friends', desc: 'Earn ₹200 sweet money', icon: Users, href: '/rewards#refer', bg: 'hover:bg-violet-50/20' },
              { label: 'Milestone Alerts', desc: 'Manage event calendars', icon: Bell, href: '/account?tab=alerts', bg: 'hover:bg-fuchsia-50/20' }
            ].map((shortcut, idx) => {
              const IconComp = shortcut.icon;
              return (
                <motion.div
                  key={shortcut.label}
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  onClick={() => {
                    playSound('tap');
                    navigate(shortcut.href);
                  }}
                  className={`bg-white/80 backdrop-blur-md border border-slate-200/60 p-6 rounded-[30px] text-left cursor-pointer transition-all shadow-[0_10px_35px_rgba(0,0,0,0.015)] relative overflow-hidden group ${shortcut.bg}`}
                >
                  {/* Subtle neon hover reflection circle */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-tr from-pink-500/10 via-purple-500/5 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-white group-hover:border-pink-200 group-hover:text-pink-500 transition-all">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-pink-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>

                  <div className="space-y-1 mt-6">
                    <h4 className="text-sm font-black text-slate-900 tracking-tight">{shortcut.label}</h4>
                    <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">{shortcut.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 4. UPCOMING CELEBRATIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Calendar Cards Left */}
          <div className="lg:col-span-8 space-y-5 text-left">
            <div>
              <h3 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-pink-500" />
                Celebration Calendar
              </h3>
              <p className="text-xs text-slate-400 font-medium">Automatic recipe pre-bookings for loved ones.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { name: 'Kavita’s Birthday', date: 'July 15', status: 'Baking Queue Confirmed', flavor: 'Double Berry Torte', emoji: '🎂', color: 'from-pink-50 to-rose-50/50 border-pink-100' },
                { name: 'Parents Anniversary', date: 'August 02', status: 'No Cake Saved Yet', flavor: 'Select Custom Recipe', emoji: '🥂', color: 'from-amber-50 to-yellow-50/50 border-amber-100' },
                { name: 'Diwali Celebration', date: 'November 08', status: 'Sponge Custom Drafted', flavor: 'Cardamom Saffron Swirl', emoji: '🪔', color: 'from-purple-50 to-indigo-50/50 border-purple-100' }
              ].map((cal) => (
                <div 
                  key={cal.name}
                  className={`bg-gradient-to-b ${cal.color} border p-5 rounded-[28px] space-y-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-all`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{cal.date}</span>
                      <h4 className="text-sm font-extrabold text-slate-800 tracking-tight">{cal.name}</h4>
                    </div>
                    <span className="text-2xl">{cal.emoji}</span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                      <span className="text-[10px] font-bold text-slate-600 truncate">{cal.flavor}</span>
                    </div>
                    <button 
                      onClick={() => {
                        playSound('tap');
                        toast.success(`Milestone setup initiated for ${cal.name}`);
                        navigate('/custom-order');
                      }}
                      className="w-full py-2 rounded-xl bg-white border border-slate-200/60 hover:bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-700 transition-all"
                    >
                      Manage Event
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active / Pending Shipments Right */}
          <div className="lg:col-span-4 space-y-5 text-left">
            <div>
              <h3 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500" />
                Active Deliveries
              </h3>
              <p className="text-xs text-slate-400 font-medium">Real-time baking telemetry link.</p>
            </div>

            <div className="bg-white border border-slate-200/60 rounded-[32px] p-6 shadow-sm flex flex-col justify-between h-[184px] relative group overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md">Baking & Decorating</span>
                  <h4 className="text-sm font-black text-slate-800 tracking-tight mt-1">Order #CKU10245</h4>
                  <p className="text-[11px] text-slate-400 font-bold">ETA: Today, 3:45 PM</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500">
                  <Clock className="w-4 h-4 animate-pulse" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full w-2/3" />
                </div>
                
                <Link 
                  to="/track-order/CKU10245"
                  onClick={() => playSound('success')}
                  className="w-full h-11 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Launch Live GPS Tracking</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* 5. FAVORITE CATEGORIES */}
        <div className="space-y-5 text-left">
          <div>
            <h3 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-500" />
              Signature Confections
            </h3>
            <p className="text-xs text-slate-400 font-medium">Filter AI personalized recomendations based on flavor classes.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {['All', 'Chocolate', 'Photo Cakes', 'Designer Cakes', 'Wedding', 'Kids', 'Luxury Collection'].map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    playSound('tap');
                    toast.info(`Showing curated suggestions for: ${cat}`);
                  }}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-pink-500 text-white shadow-[0_8px_20px_rgba(244,114,182,0.35)] scale-102' 
                      : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/60'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. RECOMMENDED FOR YOU */}
        <div className="space-y-6 text-left">
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeCategory}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProducts.map((prod) => {
                const isSaved = wishlistItems.includes(prod.id);
                return (
                  <div 
                    key={prod.id}
                    className="bg-white border border-slate-200/50 rounded-[36px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.015)] hover:shadow-lg hover:border-pink-200/80 transition-all flex flex-col justify-between group"
                  >
                    
                    {/* Image Top */}
                    <div className="aspect-[4/3] relative overflow-hidden bg-slate-100 border-b border-slate-100">
                      <img 
                        src={prod.image} 
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" 
                      />

                      {/* Favorite / Wishlist Overlay */}
                      <button 
                        onClick={() => handleToggleWishlist(prod.id)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md hover:bg-white flex items-center justify-center text-slate-500 hover:text-pink-500 transition-colors shadow-sm"
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-pink-500 text-pink-500' : ''}`} />
                      </button>

                      {/* Floating Badge Tag */}
                      <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                        ✨ {prod.tag}
                      </span>
                    </div>

                    {/* Meta info bottom */}
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-black text-pink-500 uppercase tracking-widest block">{prod.category}</span>
                          <h4 className="text-base font-black text-slate-800 tracking-tight leading-tight">{prod.name}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-black text-slate-900 block leading-none">{prod.price}</span>
                          <span className="text-[9px] text-slate-400 font-bold block mt-1">1.0 KG</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                        {prod.desc}
                      </p>

                      {/* Action trigger row */}
                      <div className="flex items-center gap-3 pt-2">
                        <button 
                          onClick={() => handleAddToCart(prod.name)}
                          className="flex-1 h-11 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Reserve Order</span>
                        </button>
                        
                        <button 
                          onClick={() => {
                            toast.success('Specifications copied! Ready for customized baking.');
                            playSound('tap');
                            navigate('/custom-order');
                          }}
                          className="w-11 h-11 rounded-2xl border border-slate-200/80 hover:bg-slate-50 flex items-center justify-center text-slate-500"
                          title="Custom Builder"
                        >
                          <SlidersHorizontal className="w-4 h-4 text-slate-600" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}
