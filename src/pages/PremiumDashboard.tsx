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
    <div className="min-h-screen bg-transparent text-[#FFFDFB] font-sans relative overflow-hidden pb-24 selection:bg-[#DFB15B]/30 selection:text-[#DFB15B]">
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 luxury-glass-tile p-4 rounded-3xl">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#DFB15B] animate-ping" />
            <span className="text-xs font-bold text-[#DFB15B] uppercase tracking-widest">Gourmet Lounge Active</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { setIsMuted(!isMuted); playSound('tap'); }}
              className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-wider text-slate-200 hover:bg-white/20 hover:text-white transition-all flex items-center gap-1.5"
            >
              {isMuted ? '🔇 Audio Off' : '🔊 Audio On'}
            </button>
            <div className="h-4 w-[1px] bg-white/20" />
            <span className="text-xs font-bold text-slate-300">Local Time: 12:45 PM</span>
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
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[32px] overflow-hidden bg-gradient-to-tr from-[#DFB15B] via-pink-500 to-purple-600 p-1 shadow-[0_15px_30px_rgba(223,177,91,0.3)]">
                <div className="w-full h-full rounded-[28px] bg-[#141414] flex items-center justify-center text-4xl select-none">
                  🧑‍💻
                </div>
              </div>
              {/* Premium Floating Ring */}
              <div className="absolute -bottom-1 -right-1 bg-[#181818] p-1 rounded-2xl shadow-md border border-[#DFB15B]/40">
                <span className="bg-[#DFB15B]/20 border border-[#DFB15B]/50 px-2.5 py-1 rounded-xl text-[10px] font-black text-[#DFB15B] uppercase tracking-wider flex items-center gap-1">
                  👑 VIP
                </span>
              </div>
            </motion.div>

            {/* Greeting details */}
            <div className="space-y-3 flex-1 min-w-0">
              <div className="space-y-1">
                <span className="text-xs font-extrabold text-[#DFB15B] uppercase tracking-[0.2em] block">Exclusive Member Since 2024</span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-none">
                  Good Morning,<br />
                  <span className="bg-gradient-to-r from-[#DFB15B] via-[#F3CE85] to-pink-400 bg-clip-text text-transparent">Abhishek 👋</span>
                </h1>
              </div>

              {/* Badges and tags */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
                <span className="bg-gradient-to-r from-amber-500/30 to-yellow-600/30 border border-[#DFB15B]/60 text-[#DFB15B] text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-sm flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  Gold Member
                </span>
                <span className="bg-purple-500/20 text-purple-200 border border-purple-500/40 text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest">
                  850 Level Points
                </span>
                <button 
                  onClick={() => {
                    toast.success('Your gold membership secures same-day delivery priority!');
                    playSound('tap');
                  }}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-slate-300 hover:text-white"
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
              className="luxury-glass-tile rounded-[36px] p-6 flex items-center justify-between gap-6 relative overflow-hidden group"
            >
              {/* Abstract Glass card background lines */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-tr from-[#DFB15B]/25 to-pink-500/20 rounded-full blur-2xl opacity-40 pointer-events-none" />

              <div className="text-left space-y-2 relative z-10">
                <span className="text-[11px] font-bold uppercase text-slate-300 tracking-wider">Reward Points Balance</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl md:text-4xl font-black text-white">{stats.rewardCoins}</span>
                  <span className="text-[10px] font-black text-[#DFB15B] uppercase tracking-widest bg-[#DFB15B]/20 border border-[#DFB15B]/40 px-2.5 py-0.5 rounded-md">Cake Coins</span>
                </div>
                <p className="text-xs text-slate-300 font-normal max-w-[190px] leading-relaxed">
                  You are <span className="text-[#DFB15B] font-bold">550 coins</span> away from unlocking Platinum tier.
                </p>
                <Link 
                  to="/rewards"
                  onClick={() => playSound('pop')}
                  className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#DFB15B] hover:text-[#F3CE85] group pt-1"
                >
                  <span>Redeem Now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* ANIMATED PROGRESS CIRCLE */}
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center z-10">
                <svg className="w-full h-full transform -rotate-95">
                  <circle 
                    cx="56" 
                    cy="56" 
                    r="46" 
                    className="stroke-white/10" 
                    strokeWidth="8" 
                    fill="transparent" 
                  />
                  <motion.circle 
                    cx="56" 
                    cy="56" 
                    r="46" 
                    className="stroke-[#DFB15B]" 
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
                  <span className="text-sm font-black text-white">72%</span>
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">To Platinum</span>
                </div>
              </div>

            </motion.div>
          </div>

        </div>

        {/* 2. QUICK STATISTICS ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6">
          {[
            { label: 'Total Orders', value: stats.totalOrders, icon: '🛍️', color: 'bg-pink-500/20 text-pink-300 border-pink-500/40' },
            { label: 'Cake Coins', value: stats.rewardCoins, icon: '🪙', color: 'bg-[#DFB15B]/20 text-[#DFB15B] border-[#DFB15B]/40' },
            { label: 'Wishlist Cakes', value: stats.wishlistCount, icon: '💖', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
            { label: 'Custom Bakes', value: stats.customCakes, icon: '🧑‍🍳', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
            { label: 'Saved Cakes', value: stats.savedCakes, icon: '🍰', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
            { label: 'Upcoming Deliveries', value: stats.upcomingDeliveries, icon: '🚚', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' }
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * idx }}
              className="luxury-glass-tile p-5 rounded-[28px] text-left flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className={`w-11 h-11 rounded-2xl ${stat.color} flex items-center justify-center text-xl shadow-sm border`}>
                  {stat.icon}
                </span>
                <span className="text-[10px] font-black text-[#DFB15B] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Live</span>
              </div>
              <div className="space-y-1 mt-6">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight block">
                  {stat.value}
                </span>
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block leading-tight">
                  {stat.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 3. SHORTCUT GRID (EXACT FROSTED GLASS CARDS FROM USER SPECIFICATION) */}
        <div className="space-y-5">
          <div className="text-left">
            <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-[#DFB15B]" />
              Lounge Shortcuts
            </h3>
            <p className="text-sm text-slate-300 font-normal">Click to navigate or access specialized support modules.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { 
                label: 'My Orders', 
                desc: 'Track, view, reorder receipts', 
                href: '/my-orders',
                customIcon: (
                  <svg className="w-12 h-12 text-[#DFB15B]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 28C12 24 16 22 24 22C32 22 36 24 36 28V36C36 38.2 30.6 40 24 40C17.4 40 12 38.2 12 36V28Z" />
                    <path d="M12 32C15 34 20 34.5 24 34.5C28 34.5 33 34 36 32" />
                    <path d="M16 22V16C16 14.5 19.5 13 24 13C28.5 13 32 14.5 32 16V22" />
                    <circle cx="24" cy="9" r="2.5" />
                    <path d="M34 34L42 42" strokeWidth="2.5" />
                    <circle cx="35" cy="35" r="5" fill="#181818" strokeWidth="2" />
                  </svg>
                )
              },
              { 
                label: 'Milestone Alerts', 
                desc: 'Automatic recipe pre-bookings for loved ones', 
                href: '/account?tab=alerts',
                customIcon: (
                  <svg className="w-12 h-12 text-[#DFB15B]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="8" y="14" width="32" height="24" rx="4" />
                    <path d="M8 18L24 29L40 18" />
                    <polygon points="24,6 26.5,11.5 32.5,12.3 28,16.5 29.2,22.5 24,19.5 18.8,22.5 20,16.5 15.5,12.3 21.5,11.5" fill="#DFB15B" stroke="#DFB15B" strokeWidth="1" />
                  </svg>
                )
              },
              { 
                label: 'Rewards Program', 
                desc: 'Redeem cake multipliers and coin perks', 
                href: '/rewards',
                customIcon: (
                  <svg className="w-12 h-12 text-[#DFB15B]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="8" y="20" width="32" height="20" rx="3" />
                    <rect x="6" y="14" width="36" height="6" rx="2" />
                    <line x1="24" y1="14" x2="24" y2="40" />
                    <path d="M24 14C24 14 20 8 16 8C13 8 11 10 11 12C11 15 24 14 24 14Z" />
                    <path d="M24 14C24 14 28 8 32 8C35 8 37 10 37 12C37 15 24 14 24 14Z" />
                  </svg>
                )
              },
              { 
                label: 'Saved Addresses', 
                desc: 'Milestone shipping zones & quick checkout', 
                href: '/account?tab=addresses',
                customIcon: (
                  <svg className="w-12 h-12 text-[#DFB15B]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M24 4C15.2 4 8 11.2 8 20C8 31 24 44 24 44C24 44 40 31 40 20C40 11.2 32.8 4 24 4Z" />
                    <circle cx="24" cy="20" r="5" />
                  </svg>
                )
              },
              { 
                label: 'Wishlist Collection', 
                desc: 'Curated sponge formulations & tasteboards', 
                href: '/account?tab=wishlist',
                customIcon: (
                  <svg className="w-12 h-12 text-[#DFB15B]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M24 40S8 28 8 16A9 9 0 0 1 24 11A9 9 0 0 1 40 16C40 28 24 40 24 40Z" />
                    <path d="M24 18V26M20 22H28" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )
              },
              { 
                label: 'Saved Payments', 
                desc: 'Stripe, Razorpay, Apple Pay & Wallet', 
                href: '/account?tab=payments',
                customIcon: (
                  <svg className="w-12 h-12 text-[#DFB15B]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="12" width="36" height="24" rx="4" />
                    <line x1="6" y1="20" x2="42" y2="20" strokeWidth="2.5" />
                    <rect x="12" y="27" width="8" height="4" rx="1" fill="#DFB15B" />
                  </svg>
                )
              },
              { 
                label: 'Gourmet Support', 
                desc: 'Direct chef ticket log & concierge chat', 
                href: '/account?tab=support',
                customIcon: (
                  <svg className="w-12 h-12 text-[#DFB15B]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="24" cy="24" r="18" />
                    <path d="M18 19C18 15.5 20.5 13 24 13C27.5 13 30 15.5 30 19C30 22.5 27 24 24 26V28" strokeWidth="2.5" />
                    <circle cx="24" cy="34" r="1.5" fill="#DFB15B" />
                  </svg>
                )
              },
              { 
                label: 'Invite Friends', 
                desc: 'Earn ₹200 sweet money per gourmet invite', 
                href: '/rewards#refer',
                customIcon: (
                  <svg className="w-12 h-12 text-[#DFB15B]" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="18" r="7" />
                    <path d="M6 38C6 31.5 11.5 27 18 27C24.5 27 30 31.5 30 38" />
                    <circle cx="34" cy="16" r="5" />
                    <path d="M30 36C30.5 32 34 29 39 29C42 29 44 30.5 44 34" />
                  </svg>
                )
              }
            ].map((shortcut) => {
              return (
                <motion.div
                  key={shortcut.label}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  onClick={() => {
                    playSound('tap');
                    navigate(shortcut.href);
                  }}
                  className="luxury-glass-tile p-7 rounded-[30px] flex flex-col items-center justify-between text-center cursor-pointer min-h-[260px] group select-none"
                >
                  {/* Subtle Background Golden Waves Decoration */}
                  <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 200 240" fill="none">
                    <path d="M-20 80 Q 100 30 220 120" stroke="#DFB15B" strokeWidth="0.8" strokeDasharray="3 3" />
                    <path d="M-20 140 Q 100 90 220 180" stroke="#DFB15B" strokeWidth="0.8" strokeDasharray="4 4" />
                    <path d="M-20 200 Q 100 150 220 240" stroke="#DFB15B" strokeWidth="0.6" />
                  </svg>
                  
                  {/* Big Gold Outline Icon in Center */}
                  <div className="w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/10 group-hover:border-[#DFB15B]/50 group-hover:bg-[#DFB15B]/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-inner relative z-10 mt-2">
                    {shortcut.customIcon}
                  </div>

                  {/* Title and Clear Description */}
                  <div className="space-y-2 mt-4 relative z-10 w-full">
                    <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-[#F3CE85] transition-colors tracking-wide leading-tight">
                      {shortcut.label}
                    </h4>
                    <p className="text-xs sm:text-[13px] text-slate-300 font-normal leading-relaxed">
                      {shortcut.desc}
                    </p>
                  </div>

                  {/* Bottom subtle indicator line */}
                  <div className="w-8 h-1 rounded-full bg-white/10 group-hover:w-16 group-hover:bg-[#DFB15B] transition-all duration-300 mt-4 relative z-10" />
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
              <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#DFB15B]" />
                Celebration Calendar
              </h3>
              <p className="text-sm text-slate-300 font-normal">Automatic recipe pre-bookings for loved ones.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { name: 'Kavita’s Birthday', date: 'July 15', status: 'Baking Queue Confirmed', flavor: 'Double Berry Torte', emoji: '🎂' },
                { name: 'Parents Anniversary', date: 'August 02', status: 'No Cake Saved Yet', flavor: 'Select Custom Recipe', emoji: '🥂' },
                { name: 'Diwali Celebration', date: 'November 08', status: 'Sponge Custom Drafted', flavor: 'Cardamom Saffron Swirl', emoji: '🪔' }
              ].map((cal) => (
                <div 
                  key={cal.name}
                  className="luxury-glass-tile p-6 rounded-[28px] space-y-4 flex flex-col justify-between group"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-[#DFB15B] uppercase tracking-widest block">{cal.date}</span>
                      <h4 className="text-base font-bold text-white tracking-tight">{cal.name}</h4>
                    </div>
                    <span className="text-3xl">{cal.emoji}</span>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#DFB15B]" />
                      <span className="text-xs font-medium text-slate-300 truncate">{cal.flavor}</span>
                    </div>
                    <button 
                      onClick={() => {
                        playSound('tap');
                        toast.success(`Milestone setup initiated for ${cal.name}`);
                        navigate('/custom-order');
                      }}
                      className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#DFB15B]/50 text-xs font-black uppercase tracking-widest text-[#DFB15B] hover:text-white transition-all shadow-sm"
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
              <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" />
                Active Deliveries
              </h3>
              <p className="text-sm text-slate-300 font-normal">Real-time baking telemetry link.</p>
            </div>

            <div className="luxury-glass-tile rounded-[32px] p-6 flex flex-col justify-between h-[210px] group">
              <div className="flex justify-between items-start">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1 rounded-md inline-block">Baking & Decorating</span>
                  <h4 className="text-base font-bold text-white tracking-tight mt-1">Order #CKU10245</h4>
                  <p className="text-xs text-slate-300 font-medium">ETA: Today, 3:45 PM</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Clock className="w-5 h-5 animate-pulse" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full w-2/3" />
                </div>
                
                <Link 
                  to="/track-order/CKU10245"
                  onClick={() => playSound('success')}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all shadow-md"
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
            <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#DFB15B]" />
              Signature Confections
            </h3>
            <p className="text-sm text-slate-300 font-normal">Filter AI personalized recommendations based on flavor classes.</p>
          </div>

          <div className="flex flex-wrap gap-2.5">
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
                      ? 'bg-gradient-to-r from-[#DFB15B] to-[#E8B869] text-slate-950 shadow-[0_8px_20px_rgba(223,177,91,0.35)] scale-102 font-black' 
                      : 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 hover:border-white/30'
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
                    className="luxury-glass-tile rounded-[32px] overflow-hidden flex flex-col justify-between group"
                  >
                    
                    {/* Image Top */}
                    <div className="aspect-[4/3] relative overflow-hidden bg-white/5 border-b border-white/10">
                      <img 
                        src={prod.image} 
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" 
                      />

                      {/* Favorite / Wishlist Overlay */}
                      <button 
                        onClick={() => handleToggleWishlist(prod.id)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 border border-white/20 flex items-center justify-center text-slate-300 hover:text-pink-400 transition-colors shadow-md"
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-pink-500 text-pink-500' : ''}`} />
                      </button>

                      {/* Floating Badge Tag */}
                      <span className="absolute top-4 left-4 bg-black/70 backdrop-blur-md border border-[#DFB15B]/40 text-[#DFB15B] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                        ✨ {prod.tag}
                      </span>
                    </div>

                    {/* Meta info bottom */}
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-[#DFB15B] uppercase tracking-widest block">{prod.category}</span>
                          <h4 className="text-base font-bold text-white tracking-tight leading-tight">{prod.name}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-black text-[#DFB15B] block leading-none">{prod.price}</span>
                          <span className="text-[10px] text-slate-300 font-medium block mt-1">1.0 KG</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 font-normal leading-relaxed">
                        {prod.desc}
                      </p>

                      {/* Action trigger row */}
                      <div className="flex items-center gap-3 pt-2">
                        <button 
                          onClick={() => handleAddToCart(prod.name)}
                          className="flex-1 h-11 rounded-2xl bg-gradient-to-r from-[#DFB15B] to-[#E8B869] text-slate-950 hover:brightness-110 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>Reserve Order</span>
                        </button>
                        
                        <button 
                          onClick={() => {
                            toast.success('Specifications copied! Ready for customized baking.');
                            playSound('tap');
                            navigate('/custom-order');
                          }}
                          className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/20 hover:border-[#DFB15B]/50 flex items-center justify-center text-slate-200 hover:text-white transition-all"
                          title="Custom Builder"
                        >
                          <SlidersHorizontal className="w-4 h-4" />
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
