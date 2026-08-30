import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Gift, 
  Award, 
  ChevronRight, 
  Copy, 
  Share2, 
  QrCode, 
  ShieldCheck, 
  Clock, 
  CheckCircle, 
  Smartphone, 
  Zap, 
  Heart, 
  HelpCircle,
  TrendingUp,
  Coins,
  Smile,
  Flame,
  Volume2,
  VolumeX,
  Play,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import SEO from '../components/SEO';
import { playBtnTap, playSuccessChime, playSlidePop } from '../lib/sound';

export default function RewardsLoyalty() {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Rewards Balance State
  const [coinBalance, setCoinBalance] = useState(0);

  // VIP Levels
  const VIP_LEVELS = [
    { id: 'bronze', label: 'Bronze', threshold: '0 pts', desc: 'Entry-level sweet lover', active: false, color: 'from-amber-600 to-amber-800' },
    { id: 'silver', label: 'Silver', threshold: '500 pts', desc: 'Gourmet enthusiast', active: false, color: 'from-slate-400 to-slate-600' },
    { id: 'gold', label: 'Gold', threshold: '2000 pts', desc: 'Confectionery royalty', active: true, color: 'from-yellow-400 via-[#DFB15B] to-amber-600' },
    { id: 'platinum', label: 'Platinum', threshold: '5000 pts', desc: 'Imperial tasting salon access', active: false, color: 'from-pink-400 via-purple-500 to-indigo-600' },
    { id: 'diamond', label: 'Diamond', threshold: '15000 pts', desc: 'Bespoke personal chef concierge', active: false, color: 'from-cyan-400 via-blue-500 to-indigo-700' }
  ];

  // Benefits
  const BENEFITS = [
    { label: 'Priority Delivery', desc: 'Direct same-day dispatch routing', icon: '🚀' },
    { label: 'Free Midnight Delivery', desc: 'Zero delivery fee between 11PM-1AM', icon: '🌙' },
    { label: 'Birthday Gift', desc: 'Complimentary double gold tartlet', icon: '🎁' },
    { label: 'Free Sparkler Candles', desc: 'Gilded premium celebration sparklers', icon: '✨' },
    { label: 'Exclusive Cakes', desc: 'Secret access to seasonal white-truffle bakes', icon: '🍰' },
    { label: 'Special Discounts', desc: '15% persistent discount on signature boxes', icon: '🏷️' },
    { label: 'Early Access', desc: 'Book Alphonso mango collections 48h early', icon: '🔥' },
    { label: 'Premium Support', desc: 'Direct WhatsApp hotline with lead decor chef', icon: '☎️' }
  ];

  // Achievements list
  const ACHIEVEMENTS = [
    { id: 'first_order', label: 'First Bite', desc: 'Ordered your first masterwork cake', icon: '🥇', unlocked: true, progress: '1/1' },
    { id: 'ten_orders', label: 'Sweet Decade', desc: 'Completed 10 gourmet orders', icon: '🎂', unlocked: false, progress: '4/10' },
    { id: 'birthday_champ', label: 'Party Sovereign', desc: 'Hosted 3 birthday events in a year', icon: '👑', unlocked: true, progress: '3/3' },
    { id: 'choc_lover', label: 'The Chocolatier', desc: 'Ordered 5 double Belgian truffle recipes', icon: '🍫', unlocked: true, progress: '5/5' },
    { id: 'designer_fan', label: 'Avant-Garde Taste', desc: 'Saved 3 bespoke custom-built structural cakes', icon: '🎨', unlocked: false, progress: '1/3' }
  ];

  // Interactive Games States
  const [spinDegree, setSpinDegree] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  // Scratch card state
  const [isScratched, setIsScratched] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const scratchCanvasRef = useRef<HTMLCanvasElement>(null);

  // sound play wrapper
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

  // Count up reward balance
  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const interval = setInterval(() => {
        current += 50;
        if (current >= 2450) {
          setCoinBalance(2450);
          clearInterval(interval);
        } else {
          setCoinBalance(current);
        }
      }, 20);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Initialize Scratch Canvas
  useEffect(() => {
    const canvas = scratchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and draw gold coating
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create gold metallic gradient
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#E8B869');
    grad.addColorStop(0.5, '#DFB15B');
    grad.addColorStop(1, '#B18632');
    
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Write elegant text overlay
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH WITH CURSOR', canvas.width / 2, canvas.height / 2);
  }, [isScratched]);

  // Handle Scratch logic
  const handleScratchMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (isScratched) return;
    const canvas = scratchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Erase portion of canvas
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    // Increment scratch count to trigger automatic reveal at 40% scratched
    setScratchPercent(prev => {
      const next = prev + 1;
      if (next > 40) {
        setIsScratched(true);
        playSound('success');
        toast.success('Scratch Card Revealed!', {
          description: 'You won 250 Bonus Cake Coins!'
        });
        setCoinBalance(c => c + 250);
      }
      return next;
    });
  };

  // Spin & Win logic
  const spinWheel = () => {
    if (isSpinning) return;
    playSound('tap');
    setIsSpinning(true);
    setSpinResult(null);

    // Random spin angle (at least 5 full rotations + random slice offset)
    const newDegree = spinDegree + 1800 + Math.floor(Math.random() * 360);
    setSpinDegree(newDegree);

    // Wait for transition animation (3s)
    setTimeout(() => {
      setIsSpinning(false);
      playSound('success');
      
      const prizes = [
        'Free Midnight Delivery',
        '150 Bonus Coins',
        'Free Gold Candle Pack',
        'Secret Recipe Coupon',
        '₹100 Cashback',
        'Complimentary Tartlet'
      ];
      // Map final landing angle back to slice
      const landingAngle = (newDegree % 360);
      const prizeIndex = Math.floor(landingAngle / 60) % prizes.length;
      const result = prizes[prizeIndex];
      setSpinResult(result);
      
      toast.success(`Congratulations! You won: ${result}`, {
        icon: '🎡'
      });
    }, 3200);
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText('CAKE-ABHISHEK-7241');
    setCopied(true);
    playSound('success');
    toast.success('Referral link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-transparent text-white font-sans relative overflow-hidden pb-24 selection:bg-purple-900 selection:text-white">
      <SEO 
        title="Royal Cake Coins Rewards Lounge | CakeUrban"
        description="Scratch cards, spin the wheel, explore achievements, and share gourmet invites for active cashback. Level up your status with Gold Membership."
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 pt-8 space-y-12 relative">
        
        {/* PREMIUM LEVEL CONTROLS UTILITIES */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1E0B07]/80 backdrop-blur-md border border-[#DFB15B]/30 p-4 rounded-3xl shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DFB15B] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-[#DFB15B]">Loyalty Level: Gold Sovereign</span>
          </div>
          <button 
            onClick={() => { setIsMuted(!isMuted); playSound('tap'); }}
            className="px-4 py-2 rounded-2xl bg-[#1E0B07] border border-[#DFB15B]/40 text-xs font-black uppercase text-[#DFB15B] hover:bg-[#2A100B] transition-all cursor-pointer"
          >
            {isMuted ? '🔇 Mute' : '🔊 Sound'}
          </button>
        </div>

        {/* 1. HERO BANNER */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-tr from-[#1E0B07] via-[#2D120B] to-[#3D1A10] border border-[#DFB15B]/40 rounded-[48px] p-8 md:p-14 text-white text-center md:text-left relative overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.5)] group"
        >
          {/* Glowing ambient ring */}
          <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-[#DFB15B]/10 rounded-full blur-3xl pointer-events-none translate-x-1/3" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <span className="bg-[#DFB15B]/20 backdrop-blur-md border border-[#DFB15B]/40 text-[#DFB15B] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] inline-block">
                Royal Confectionery Club
              </span>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
                Earn Sweet Rewards <br />
                <span className="text-[#DFB15B]">Every Single Order</span>
              </h1>
              
              <p className="text-slate-200 text-xs md:text-sm font-semibold max-w-lg leading-relaxed">
                Scratch magical coupon blocks, level up with structural cake orders, and invite friends to split ₹200 VIP sweet credits instantly.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button 
                  onClick={() => {
                    playSound('success');
                    const target = document.getElementById('scratch-section');
                    target?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#DFB15B] to-[#B88E3D] text-[#1E0B07] font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-lg cursor-pointer"
                >
                  Play Scratch Cards
                </button>
                <button 
                  onClick={() => {
                    playSound('pop');
                    const target = document.getElementById('benefits-section');
                    target?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-[#DFB15B]/40 text-white font-black uppercase tracking-widest text-xs transition-colors cursor-pointer"
                >
                  View Tier Benefits
                </button>
              </div>
            </div>

            {/* Float premium illustrations block */}
            <div className="lg:col-span-5 flex justify-center relative">
              <motion.div 
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center select-none text-8xl md:text-9xl bg-[#1E0B07]/80 backdrop-blur-xl rounded-[40px] border border-[#DFB15B]/40 shadow-2xl"
              >
                🪙
                <span className="absolute -top-4 -right-4 text-4xl animate-bounce" style={{ animationDuration: '2.5s' }}>🎁</span>
                <span className="absolute -bottom-4 -left-4 text-4xl animate-bounce" style={{ animationDuration: '3s' }}>✨</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* 2. REWARD BALANCE BOX */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 luxury-glass-tile p-8 rounded-[36px] text-left space-y-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#DFB15B]/20 rounded-full blur-2xl opacity-40 pointer-events-none" />
            <span className="text-[11px] font-bold uppercase text-[#DFB15B] tracking-wider">Active Coin Balance</span>
            
            <div className="flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-black text-white">{coinBalance}</span>
              <span className="text-xs font-black uppercase tracking-widest text-[#DFB15B] bg-[#DFB15B]/20 border border-[#DFB15B]/40 px-2.5 py-0.5 rounded-lg">Cake Coins</span>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs font-semibold text-slate-300">
              <div className="flex justify-between">
                <span>Value in INR</span>
                <span className="text-white font-black text-sm">₹{(coinBalance / 10).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Multiplier</span>
                <span className="text-[#DFB15B] font-black">1.5x Gold Tier boost</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 text-left space-y-4">
            <span className="text-xs font-black uppercase text-[#DFB15B] tracking-[0.2em] block">How It Works</span>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              10 Cake Coins = ₹1 Cash Value
            </h2>
            <p className="text-slate-300 text-xs md:text-sm font-normal leading-relaxed">
              Earn coins automatically on checkout, review submissions, Custom Cake creation, or successful referral invite claims. Your coins never expire as long as you maintain an active celebratory schedule.
            </p>
          </div>

        </div>

        {/* 3. VIP LEVELS */}
        <div className="space-y-6 text-left">
          <div>
            <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#DFB15B]" />
              Sovereign VIP Tiers
            </h3>
            <p className="text-sm text-slate-300 font-normal">Progress your level by choosing custom cake recipes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {VIP_LEVELS.map((level) => {
              return (
                <div 
                  key={level.id}
                  className={`luxury-glass-tile rounded-[30px] p-6 text-left relative overflow-hidden transition-all duration-300 ${
                    level.active 
                      ? 'border-[#DFB15B] scale-102 shadow-[0_15px_35px_rgba(223,177,91,0.3)] ring-1 ring-[#DFB15B]' 
                      : 'opacity-85 hover:opacity-100'
                  }`}
                >
                  {/* Current Active Ribbon */}
                  {level.active && (
                    <div className="absolute top-3 right-3 bg-[#DFB15B]/20 border border-[#DFB15B]/50 px-2 py-0.5 rounded-full">
                      <span className="text-[8px] font-black uppercase tracking-widest text-[#DFB15B]">Current</span>
                    </div>
                  )}

                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${level.color} shrink-0 mb-6 flex items-center justify-center text-white text-sm font-black shadow-md`}>
                    {level.label.substring(0, 2)}
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-base font-bold text-white tracking-tight">{level.label}</h4>
                    <span className="text-[10px] font-bold text-[#DFB15B] uppercase block tracking-wider">{level.threshold}</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal pt-1">
                      {level.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. BENEFITS */}
        <div id="benefits-section" className="space-y-6 text-left">
          <div>
            <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#DFB15B]" />
              Exclusive Gold Perks
            </h3>
            <p className="text-sm text-slate-300 font-normal">Unlocked automatically for your active VIP tier status.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {BENEFITS.map((b) => (
              <div 
                key={b.label}
                className="luxury-glass-tile p-6 rounded-[30px] text-left group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl border border-white/20 group-hover:border-[#DFB15B]/50 group-hover:scale-105 transition-all mb-4">
                  {b.icon}
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-base font-bold text-white tracking-tight">{b.label}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. PLAYABLE Scratch cards & Spin coupon sections */}
        <div id="scratch-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
          
          {/* Scratch cards left (Col 6) */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                🎁 Scratch & Reveal Coupons
              </h3>
              <p className="text-sm text-slate-300 font-normal">Use your mouse/touch on the card to peel away the cover.</p>
            </div>

            <div className="luxury-glass-tile p-6 rounded-[36px] flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
              {/* Actual Playable Scratch Block */}
              <div className="relative w-48 h-28 bg-[#121212] rounded-2xl overflow-hidden shrink-0 shadow-lg border border-[#DFB15B]/50">
                {/* Underneath coupon code */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3 bg-gradient-to-tr from-[#DFB15B]/25 to-purple-500/15">
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest block mb-1">Coupon Unlocked</span>
                  <span className="text-xs font-black text-[#DFB15B] tracking-widest bg-[#181818] border border-[#DFB15B]/50 px-3 py-1.5 rounded-lg shadow-sm">
                    GOLD-SPONGE-250
                  </span>
                  <span className="text-[8px] text-emerald-400 font-black uppercase mt-1.5 tracking-wider">Active now</span>
                </div>

                {/* Canvas scratching cover layer */}
                <canvas 
                  ref={scratchCanvasRef}
                  width="192"
                  height="112"
                  onMouseMove={handleScratchMove}
                  onTouchMove={handleScratchMove}
                  className="absolute inset-0 cursor-crosshair transition-opacity duration-500"
                  style={{ opacity: isScratched ? 0 : 1, pointerEvents: isScratched ? 'none' : 'auto' }}
                />
              </div>

              <div className="space-y-2 flex-1">
                <span className="text-[10px] font-black text-[#DFB15B] uppercase tracking-widest">Scratch To Claim</span>
                <h4 className="text-base font-bold text-white tracking-tight">Weekly Confection Bonus</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Melt the gold cover to receive up to 500 bonus points or complimentary toppings coupons.
                </p>
                {isScratched ? (
                  <span className="text-[10px] font-extrabold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full inline-block uppercase tracking-wider">
                    Claimed +250 Coins
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-[#DFB15B] uppercase tracking-wider block">
                    {Math.round(scratchPercent * 2.5)}% scratched
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Spin and win right (Col 6) */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                🎡 Royal Fortune Spin Wheel
              </h3>
              <p className="text-sm text-slate-300 font-normal">Claim your persistent daily reward.</p>
            </div>

            <div className="luxury-glass-tile p-6 rounded-[36px] flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
              
              {/* Wheel Graphic Container */}
              <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
                
                {/* Pointer Indicator */}
                <div className="absolute top-0 z-20 -mt-1 select-none">
                  <div className="w-4 h-4 bg-[#DFB15B] transform rotate-45 border-r border-b border-black" />
                </div>

                {/* Main Wheel */}
                <div 
                  className="w-full h-full rounded-full border-4 border-[#DFB15B] bg-gradient-to-r from-[#222222] via-[#2a241c] to-[#181818] relative shadow-md transition-transform duration-[3000ms] ease-out flex items-center justify-center overflow-hidden"
                  style={{ 
                    transform: `rotate(${spinDegree}deg)`,
                    transitionTimingFunction: 'cubic-bezier(0.1, 0.8, 0.1, 1)' 
                  }}
                >
                  {/* Wheel lines representing slices */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-[#DFB15B]/40 transform rotate-0" />
                    <div className="w-full h-0.5 bg-[#DFB15B]/40 transform rotate-60" />
                    <div className="w-full h-0.5 bg-[#DFB15B]/40 transform rotate-120" />
                  </div>

                  {/* central pin */}
                  <div className="w-8 h-8 rounded-full bg-[#181818] border border-[#DFB15B] z-10 flex items-center justify-center shadow-lg">
                    <span className="text-[10px] text-white">🍰</span>
                  </div>
                </div>
              </div>

              {/* Spin Details and Action */}
              <div className="space-y-3 flex-1">
                <span className="text-[10px] font-black text-[#DFB15B] uppercase tracking-widest">Persistent Daily Sweep</span>
                <h4 className="text-base font-bold text-white tracking-tight">Fortune Confection</h4>
                
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Spin to win cake coins, free shipping coupons, or complimentary design consults.
                </p>

                {spinResult ? (
                  <div className="p-2 bg-[#DFB15B]/20 rounded-xl border border-[#DFB15B]/40 text-[10px] font-black text-[#DFB15B] uppercase tracking-wider text-center">
                    Won: {spinResult}
                  </div>
                ) : null}

                <button 
                  onClick={spinWheel}
                  disabled={isSpinning}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#DFB15B] to-[#B88E3D] text-slate-950 font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-colors disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {isSpinning ? 'SPINNING WHEEL...' : 'SPIN THE WHEEL'}
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* 6. REFERRAL PROGRAM */}
        <div id="refer" className="luxury-glass-tile rounded-[38px] p-8 md:p-12 text-left relative overflow-hidden group">
          {/* Glowing purple ambient reflection */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#DFB15B]/15 rounded-full blur-3xl pointer-events-none opacity-55" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <span className="bg-[#DFB15B]/20 text-[#DFB15B] border border-[#DFB15B]/40 text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest inline-block">
                Invite Friends & Family
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none">
                Give ₹200, Get ₹200
              </h2>
              <p className="text-slate-300 text-xs md:text-sm font-normal leading-relaxed">
                Send your unique confectionery code. When they order their first Belgian gold or design-custom cake, you both secure ₹200 sweet credits instantly in your wallet balance.
              </p>

              {/* Copy Share Code Capsule */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-black/40 border border-white/15 p-2 rounded-2xl max-w-lg">
                <div className="flex-1 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                  <span className="text-xs font-mono font-black text-[#DFB15B] tracking-widest">
                    CAKE-ABHISHEK-7241
                  </span>
                  {copied ? (
                    <span className="text-[10px] font-black text-emerald-400 uppercase">Copied!</span>
                  ) : null}
                </div>
                <button 
                  onClick={copyReferralCode}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#DFB15B] to-[#B88E3D] text-slate-950 hover:brightness-110 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Copy className="w-4 h-4" />
                  Copy Code
                </button>
              </div>
            </div>

            {/* QR Code and Social actions Right (Col 5) */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row items-center gap-6 justify-center bg-white/5 border border-white/10 p-6 rounded-3xl">
              {/* Mock QR design */}
              <div className="w-28 h-28 bg-white border border-[#DFB15B]/40 p-2.5 rounded-2xl shadow-sm flex items-center justify-center">
                <QrCode className="w-full h-full text-slate-900" />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Scan QR Code</h4>
                <p className="text-[10px] text-slate-300 font-medium max-w-[150px] leading-relaxed">
                  Let your guests scan and unlock immediate cake-coins instantly.
                </p>
                <button 
                  onClick={() => {
                    toast.info('Share sheet opened!');
                    playSound('tap');
                  }}
                  className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#DFB15B] hover:underline cursor-pointer"
                >
                  <Share2 className="w-3 h-3" />
                  Quick Share
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 7. ACHIEVEMENTS SYSTEM */}
        <div className="space-y-6 text-left">
          <div>
            <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#DFB15B] animate-pulse" />
              Gourmet Achievements
            </h3>
            <p className="text-sm text-slate-300 font-normal">Unlocks extra coin multipliers and chef level flags.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {ACHIEVEMENTS.map((ach) => (
              <div 
                key={ach.id}
                onClick={() => {
                  toast.info(`${ach.label}: ${ach.desc}`);
                  playSound('tap');
                }}
                className={`luxury-glass-tile rounded-[30px] p-6 text-left cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between group ${
                  ach.unlocked ? 'border-[#DFB15B]/60' : 'opacity-70'
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 shadow-sm flex items-center justify-center text-2xl group-hover:border-[#DFB15B]/50 group-hover:scale-105 transition-all mb-4">
                    {ach.icon}
                  </div>
                  <h4 className="text-base font-bold text-white tracking-tight">{ach.label}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal mt-1">
                    {ach.desc}
                  </p>
                </div>

                <div className="mt-6 flex justify-between items-center text-[10px] font-bold text-slate-400 border-t border-white/10 pt-3">
                  <span>{ach.progress}</span>
                  <span className={ach.unlocked ? 'text-[#DFB15B] font-extrabold uppercase tracking-wide' : 'uppercase'}>
                    {ach.unlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. BOTTOM CTA */}
        <motion.div 
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-tr from-[#1E0B07] to-[#3D1A10] border border-[#DFB15B]/40 text-white rounded-[40px] p-8 md:p-12 text-center md:text-left relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl"
        >
          {/* subtle glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#DFB15B]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 max-w-2xl relative z-10">
            <span className="bg-[#DFB15B]/20 text-[#DFB15B] border border-[#DFB15B]/40 font-black text-[10px] uppercase tracking-[0.2em] px-3.5 py-1 rounded-full inline-block">
              Premium Tier Upgrade
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-none text-white">
              Ready to Upgrade to Platinum?
            </h2>
            <p className="text-slate-300 text-xs md:text-sm font-semibold leading-relaxed">
              Unlock direct personalized consultation streams, zero-fee midnight courier dispatches, and free gold toppers on every cake. Reach 5000 Cake Coins or speed upgrade instantly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full md:w-auto shrink-0">
            <button 
              onClick={() => {
                toast.success('Gourmet Platinum concierge welcome package initiated!');
                playSound('success');
              }}
              className="h-12 px-8 rounded-2xl bg-gradient-to-r from-[#DFB15B] to-[#B88E3D] text-[#1E0B07] font-black uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Upgrade To Platinum
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
