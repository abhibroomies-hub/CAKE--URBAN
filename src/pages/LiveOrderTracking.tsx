import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Truck, 
  MapPin, 
  Phone, 
  MessageSquare, 
  X, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  HelpCircle, 
  ChevronRight, 
  Smile, 
  Calendar, 
  Flame, 
  Star, 
  Bell, 
  Maximize2,
  Navigation,
  ExternalLink,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import SEO from '../components/SEO';
import { playBtnTap, playSuccessChime, playSlidePop } from '../lib/sound';

// Steps list for Live progress timeline
const TRACKING_STEPS = [
  { id: 'confirmed', label: 'Order Confirmed', time: '12:30 PM', desc: 'Securely received and queued for the chef.' },
  { id: 'baking', label: 'Cake Being Baked', time: '12:45 PM', desc: 'Artisanal sponge and premium icing in oven.' },
  { id: 'quality', label: 'Quality Check', time: '01:15 PM', desc: 'Inspected for perfection & gilded accents.' },
  { id: 'packed', label: 'Packed', time: '01:25 PM', desc: 'Preserved in shock-absorbing thermal boxes.' },
  { id: 'delivery', label: 'Out For Delivery', time: '01:30 PM', desc: 'Dispatched with climate-controlled safety.' },
  { id: 'delivered', label: 'Delivered', time: '01:55 PM', desc: 'Arrived beautifully at your celebration!' }
];

export default function LiveOrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const orderId = id || 'CKU10245';

  // 1. Core States for tracker simulation
  const [currentStepIndex, setCurrentStepIndex] = useState(1); // Defaults to "Cake Being Baked"
  const [scooterProgress, setScooterProgress] = useState(0.2); // Map marker position along path (0 to 1)
  const [isMuted, setIsMuted] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'driver', text: 'Hi! I am Chef Urban specialist Rohan. I am handling your Belgian gold-leaf cake with extreme care. The custom ice gel pack is active. Do you have any special gate pass instructions?' }
  ]);

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

  // 2. Simulate order steps and scooter position movement over time
  useEffect(() => {
    // Increment tracker steps dynamically every 20 seconds for interactive feel
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < TRACKING_STEPS.length - 1) {
          const next = prev + 1;
          toast.success(`Order Status Updated: ${TRACKING_STEPS[next].label}!`, {
            description: TRACKING_STEPS[next].desc,
            icon: <Bell className="w-5 h-5 text-[#DFB15B] fill-[#DFB15B]/10" />
          });
          playSound('success');
          return next;
        }
        return prev;
      });
    }, 25000);

    // Progress delivery scooter on map
    const scooterInterval = setInterval(() => {
      setScooterProgress((prev) => {
        if (prev < 0.95) {
          return prev + 0.05;
        }
        return prev;
      });
    }, 4000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(scooterInterval);
    };
  }, [isMuted]);

  // Handle live chat sending
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    playSound('tap');
    const userMsg = chatMessage.trim();
    setChatHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatMessage('');

    setTimeout(() => {
      playSound('success');
      setChatHistory(prev => [...prev, { 
        sender: 'driver', 
        text: 'Understood perfectly! I will arrive carefully within the timeline. See you soon!' 
      }]);
    }, 1500);
  };

  // 3. Simulated Map coordinate tracing (SVG math)
  // We'll calculate a path on an elegant cyber-map
  const getScooterCoords = () => {
    // Follows an elegant S-curve route
    // Start (Bakery) = (100, 300), End (Home) = (700, 100)
    const t = scooterProgress;
    const x = 100 + (700 - 100) * t;
    const y = 300 - 200 * t + Math.sin(t * Math.PI * 3) * 50;
    return { x, y };
  };

  const scooterPos = getScooterCoords();

  return (
    <div className="min-h-screen bg-transparent text-[#FFFDFB] font-sans selection:bg-[#DFB15B]/30 selection:text-[#DFB15B] pb-24 overflow-hidden relative">
      <SEO 
        title="Live Sweet Order Tracking | CakeUrban"
        description="Follow your handcrafted celebration cake in real time. Experience our luxury live map, real-time baking coordinates, and delivery specialist dispatch status."
      />

      {/* Futuristic Background Mesh */}
      <div className="absolute top-0 left-0 right-0 h-[600px] pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-pink-500/5 rounded-full blur-3xl animate-wave-slow" />
        <div className="absolute top-[10%] right-[-15%] w-[60%] h-[80%] bg-[#DFB15B]/5 rounded-full blur-3xl animate-wave-secondary" />
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 pt-12 relative z-10 space-y-12">
        
        {/* TOP HEADER */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-[#DFB15B]/10 border border-[#DFB15B]/30 px-4 py-1.5 rounded-full"
          >
            <span className="w-2 h-2 rounded-full bg-[#DFB15B] animate-ping" />
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#DFB15B]">Live Tracking Active</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white"
          >
            Track Your <span className="bg-gradient-to-r from-[#DFB15B] via-[#E8B869] to-[#FFF] bg-clip-text text-transparent">Sweet Order</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-sm md:text-base font-semibold max-w-2xl mx-auto"
          >
            Follow your cake in real time from our climate-locked boutique bakery to your doorstep.
          </motion.p>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: Live status timeline & Map details (Col 7) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* TOP SUMMARY GLASS CARD (Rounded 36px) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] rounded-[36px] p-6 md:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group"
            >
              {/* Glossy ambient reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] pointer-events-none" />

              {/* Cake Image (Large) */}
              <div className="w-32 h-32 md:w-36 md:h-36 rounded-3xl overflow-hidden relative border border-white/10 shrink-0 shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Belgian Chocolate gold-leaf cake"
                />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full text-[#DFB15B]">
                  1.5 KG
                </div>
              </div>

              {/* Order Info Fields */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Order Reference</span>
                    <h2 className="text-xl font-extrabold text-[#DFB15B] tracking-tight">{orderId}</h2>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="inline-flex self-center md:self-auto items-center gap-1.5 bg-[#DFB15B]/10 border border-[#DFB15B]/30 px-3.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DFB15B] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#DFB15B]">
                      {TRACKING_STEPS[currentStepIndex].label}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-white/5">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">ETA</span>
                    <span className="text-xs font-black text-white flex items-center justify-center md:justify-start gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" />
                      45 Mins
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Delivery</span>
                    <span className="text-xs font-black text-white">Same Day</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Payment</span>
                    <span className="text-xs font-black text-emerald-400 flex items-center justify-center md:justify-start gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Paid
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Flavor</span>
                    <span className="text-xs font-black text-white truncate max-w-[80px] block">Belgian Chocolate</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* LIVE INTERACTIVE MAP CAROUSEL SECTION */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-black/40 border border-white/[0.08] rounded-[36px] overflow-hidden shadow-2xl relative h-[400px] group"
            >
              {/* Pure SVG Animated High-Fidelity Tactical Map Layout */}
              <div className="absolute inset-0 z-0 bg-[#110503]">
                <svg className="w-full h-full object-cover opacity-80" viewBox="0 0 800 400" fill="none">
                  <defs>
                    <linearGradient id="cyber-grid" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B1F17" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#DFB15B" stopOpacity="0.05" />
                    </linearGradient>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                    </pattern>
                  </defs>

                  {/* Grid overlay */}
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  <rect width="100%" height="100%" fill="url(#cyber-grid)" />

                  {/* Secondary Cyber Road Networks */}
                  <path d="M 50,150 Q 150,100 250,200 T 450,150 T 650,250" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" strokeDasharray="5,5" />
                  <path d="M 100,50 L 700,350" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="6" />
                  <path d="M 200,380 L 600,20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="4" />

                  {/* MAIN COURIER ROUTE LINE */}
                  {/* Start (Bakery) = (100, 300) to End (Home) = (700, 100) with custom S-curve */}
                  <path 
                    id="deliveryPath"
                    d="M 100,300 C 250,380 400,100 550,250 C 600,300 650,200 700,100" 
                    fill="none" 
                    stroke="rgba(255, 255, 255, 0.1)" 
                    strokeWidth="8" 
                    strokeLinecap="round"
                  />

                  {/* Dynamic Traveled Green Path */}
                  <path 
                    d="M 100,300 C 250,380 400,100 550,250 C 600,300 650,200 700,100" 
                    fill="none" 
                    stroke="#DFB15B" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    strokeDasharray="800"
                    strokeDashoffset={800 * (1 - scooterProgress)}
                    className="transition-all duration-1000 ease-out"
                  />

                  {/* START MARKER (Boutique Bakery) */}
                  <g transform="translate(100, 300)">
                    <circle r="18" fill="rgba(223, 177, 91, 0.15)" className="animate-ping" />
                    <circle r="12" fill="#DFB15B" />
                    <text y="5" textAnchor="middle" fill="#140603" className="text-[10px] font-black">🧑‍🍳</text>
                  </g>

                  {/* DESTINATION MARKER (Customer Villa) */}
                  <g transform="translate(700, 100)">
                    <circle r="18" fill="rgba(239, 68, 68, 0.15)" className="animate-pulse" />
                    <circle r="12" fill="#EF4444" />
                    <text y="4" textAnchor="middle" fill="white" className="text-[9px] font-black">📍</text>
                  </g>

                  {/* ANIMATED SCOOTER MARKER */}
                  <g transform={`translate(${scooterPos.x}, ${scooterPos.y})`} className="cursor-pointer">
                    <circle r="16" fill="#140603" stroke="#DFB15B" strokeWidth="2" className="shadow-lg" />
                    <text y="4" textAnchor="middle" className="text-xs animate-bounce" style={{ animationDuration: '2s' }}>🛵</text>
                    
                    {/* Live ETA Floating Bubble */}
                    <g transform="translate(0, -32)">
                      <rect x="-35" y="-12" width="70" height="22" rx="8" fill="#DFB15B" />
                      <polygon points="0,15 -5,10 5,10" fill="#DFB15B" />
                      <text y="2" textAnchor="middle" fill="#140603" className="text-[8px] font-extrabold tracking-wider uppercase">
                        {Math.max(1, Math.round(45 * (1 - scooterProgress)))} MINS
                      </text>
                    </g>
                  </g>
                </svg>
              </div>

              {/* Map Widgets & Controls */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">Tracking GPS Active</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setIsMuted(!isMuted); playSound('tap'); }}
                    className="w-10 h-10 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/80 transition-all text-white"
                  >
                    <span className="text-sm">{isMuted ? '🔇' : '🔊'}</span>
                  </button>
                  <button 
                    onClick={() => {
                      setScooterProgress(0.2);
                      toast.info("Simulated route re-centered!");
                      playSound('pop');
                    }}
                    className="w-10 h-10 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/80 transition-all text-white"
                    title="Reset Journey"
                  >
                    <RotateCcw className="w-4 h-4 text-[#DFB15B]" />
                  </button>
                </div>
              </div>

              {/* Bottom ETA Details Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-md border border-white/10 p-4 rounded-3xl z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#DFB15B]/10 flex items-center justify-center text-[#DFB15B]">
                    <Navigation className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] font-bold uppercase text-slate-400 block">Current Location</span>
                    <span className="text-xs font-black text-white">En route via Sector 15 Express Highway</span>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <span className="text-[9px] font-bold uppercase text-slate-400 block">Distance Remaining</span>
                  <span className="text-xs font-black text-[#DFB15B]">
                    {(5.8 * (1 - scooterProgress)).toFixed(1)} km / 6.0 km total
                  </span>
                </div>
              </div>
            </motion.div>

            {/* PROGRESS TIMELINE: Horizontal on Desktop, Vertical on Mobile */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-[36px] p-6 md:p-8 space-y-6"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#DFB15B]" />
                  Bespoke Baking & Dispatch Logs
                </h3>
                <span className="text-[10px] font-black uppercase text-slate-400">Standard Delivery</span>
              </div>

              {/* Desktop Horizontal Progress Tracker */}
              <div className="hidden md:block relative pt-6 pb-4">
                {/* Connecting Line Backer */}
                <div className="absolute top-[38px] left-8 right-8 h-1 bg-slate-800 rounded-full z-0" />
                
                {/* Active connecting glow line */}
                <div 
                  className="absolute top-[38px] left-8 h-1 bg-gradient-to-r from-emerald-500 to-[#DFB15B] rounded-full z-0 transition-all duration-[1000ms] ease-out" 
                  style={{ width: `${(currentStepIndex / (TRACKING_STEPS.length - 1)) * 90}%` }}
                />

                <div className="grid grid-cols-6 relative z-10">
                  {TRACKING_STEPS.map((step, idx) => {
                    const isCompleted = idx < currentStepIndex;
                    const isActive = idx === currentStepIndex;
                    const isUpcoming = idx > currentStepIndex;

                    return (
                      <div key={step.id} className="flex flex-col items-center text-center space-y-3 px-1">
                        {/* Progress Sphere */}
                        <div 
                          onClick={() => { setCurrentStepIndex(idx); playSound('tap'); }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                            isActive 
                              ? 'bg-[#DFB15B] text-[#140603] scale-110 shadow-[0_0_20px_rgba(223,177,91,0.6)]' 
                              : isCompleted 
                                ? 'bg-emerald-500 text-white' 
                                : 'bg-slate-900 border border-slate-800 text-slate-500 hover:border-slate-600'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 font-black" />
                          ) : (
                            <span className="text-xs font-black">{idx + 1}</span>
                          )}
                        </div>

                        {/* Title & Desc */}
                        <div className="space-y-1">
                          <span className={`text-[10px] font-black block tracking-tight ${isActive ? 'text-[#DFB15B]' : isCompleted ? 'text-slate-200' : 'text-slate-500'}`}>
                            {step.label}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 block">{step.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Vertical Timeline */}
              <div className="md:hidden space-y-6">
                {TRACKING_STEPS.map((step, idx) => {
                  const isCompleted = idx < currentStepIndex;
                  const isActive = idx === currentStepIndex;
                  const isUpcoming = idx > currentStepIndex;

                  return (
                    <div key={step.id} className="flex gap-4 relative">
                      {/* Vertical line connector */}
                      {idx < TRACKING_STEPS.length - 1 && (
                        <div 
                          className={`absolute left-4 top-8 w-0.5 h-12 -ml-[1px] ${
                            isCompleted ? 'bg-emerald-500' : 'bg-slate-800'
                          }`} 
                        />
                      )}

                      {/* Sphere Icon */}
                      <div 
                        onClick={() => { setCurrentStepIndex(idx); playSound('tap'); }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                          isActive 
                            ? 'bg-[#DFB15B] text-[#140603] scale-110 shadow-[0_0_15px_rgba(223,177,91,0.5)]' 
                            : isCompleted 
                              ? 'bg-emerald-500 text-white' 
                              : 'bg-slate-900 border border-slate-800 text-slate-500'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-[10px] font-black">{idx + 1}</span>
                        )}
                      </div>

                      {/* Info block */}
                      <div className="text-left space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-black uppercase tracking-wider ${isActive ? 'text-[#DFB15B]' : isCompleted ? 'text-slate-200' : 'text-slate-500'}`}>
                            {step.label}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400">{step.time}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </motion.div>

          </div>

          {/* RIGHT PANEL: Courier details & Help controls (Col 5) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* DELIVERY PARTNER CARD */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] rounded-[36px] p-6 md:p-8 space-y-6 text-left relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#DFB15B]/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#DFB15B]">Cake Urban Specialist</span>
                <span className="text-xs font-bold text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-full">Active Courier</span>
              </div>

              {/* Driver Details */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden relative border border-white/10 shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80" 
                    className="w-full h-full object-cover" 
                    alt="Rohan Singh - Delivery Driver"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-black text-white">Rohan Singh</h4>
                  <p className="text-xs font-bold text-slate-400 mt-0.5">Specialist Carrier • Faridabad South</p>
                  
                  {/* Rating stars */}
                  <div className="flex items-center gap-1 mt-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-[#DFB15B] text-[#DFB15B]" />
                    ))}
                    <span className="text-[10px] font-black text-[#DFB15B] ml-1">4.9 (428 trips)</span>
                  </div>
                </div>
              </div>

              {/* Vehicle & Health Info */}
              <div className="grid grid-cols-2 gap-4 bg-white/[0.01] border border-white/[0.05] p-4 rounded-2xl">
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Vehicle Number</span>
                  <span className="text-xs font-black text-white tracking-widest">HR-51-BM-7241</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Safety Standards</span>
                  <span className="text-xs font-black text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Double Sanitized
                  </span>
                </div>
              </div>

              {/* Call / Chat Action Circles */}
              <div className="grid grid-cols-2 gap-4">
                <a 
                  href="tel:+919876543210"
                  onClick={() => playSound('tap')}
                  className="flex items-center justify-center gap-2.5 h-12 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-extrabold uppercase tracking-wider text-xs transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#DFB15B]" />
                  <span>Call Rohan</span>
                </a>
                <button 
                  onClick={() => { setChatOpen(!chatOpen); playSound('pop'); }}
                  className="flex items-center justify-center gap-2.5 h-12 rounded-2xl bg-[#DFB15B] hover:brightness-110 text-[#140603] font-black uppercase tracking-wider text-xs transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat Support</span>
                </button>
              </div>

            </motion.div>

            {/* CHAT SUPPORT DRAWER */}
            <AnimatePresence>
              {chatOpen && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white/[0.02] border border-white/[0.08] rounded-[36px] overflow-hidden text-left"
                >
                  <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#DFB15B] animate-pulse" />
                      <span className="text-xs font-black uppercase tracking-wider text-white">Direct Chat with Rohan</span>
                    </div>
                    <button onClick={() => { setChatOpen(false); playSound('pop'); }}>
                      <X className="w-4 h-4 text-slate-400 hover:text-white" />
                    </button>
                  </div>

                  {/* Chat logs */}
                  <div className="p-4 h-48 overflow-y-auto space-y-3 scrollbar-none bg-[#1c0c0a]/40">
                    {chatHistory.map((msg, index) => (
                      <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-2xl text-xs max-w-[80%] ${
                          msg.sender === 'user' 
                            ? 'bg-[#DFB15B] text-[#140603] font-extrabold rounded-tr-none' 
                            : 'bg-white/5 text-slate-100 rounded-tl-none border border-white/5'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message input */}
                  <form onSubmit={handleSendMessage} className="p-3 bg-white/[0.02] border-t border-white/5 flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Type a response or gate instructions..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="flex-1 bg-white/5 border-none rounded-xl px-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#DFB15B]/50"
                    />
                    <button 
                      type="submit"
                      className="bg-[#DFB15B] text-[#140603] font-black text-xs px-4 py-2 rounded-xl uppercase tracking-wider"
                    >
                      Send
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* NEED HELP & ACTION BUTTONS BLOCK */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-[36px] p-6 md:p-8 space-y-6 text-left"
            >
              <div>
                <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#DFB15B]" />
                  Need Gourmet Assistance?
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-semibold">Our luxury baking concierge is available 24/7 for you.</p>
              </div>

              <div className="space-y-3">
                
                {/* 1. Call Boutique Bakery */}
                <a 
                  href="tel:+918888888888"
                  onClick={() => playSound('tap')}
                  className="flex items-center justify-between w-full p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🛎️</span>
                    <div>
                      <span className="text-xs font-black uppercase text-white block">Call Bakery Direct</span>
                      <span className="text-[10px] text-slate-500 font-semibold">Sector 15 Faridabad Studio</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>

                {/* 2. Chat with Lead Chef */}
                <button 
                  onClick={() => {
                    toast.info("Chef is decorating your gold leaf frosting! Chat will open shortly.");
                    playSound('tap');
                  }}
                  className="flex items-center justify-between w-full p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🧑‍🍳</span>
                    <div>
                      <span className="text-xs font-black uppercase text-white block">Concierge Lead Chef</span>
                      <span className="text-[10px] text-slate-500 font-semibold">Special custom cake decor queries</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* 3. Reorder cake */}
                <button 
                  onClick={() => {
                    toast.success("Golden cake recipes added to your basket!");
                    playSound('success');
                    navigate('/cart');
                  }}
                  className="flex items-center justify-between w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 hover:bg-emerald-500/15 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🔁</span>
                    <div>
                      <span className="text-xs font-black uppercase text-emerald-400 block">Reorder Recipe</span>
                      <span className="text-[10px] text-slate-500 font-semibold">Bake this exact masterwork again</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-400" />
                </button>

                {/* 4. Cancel Order with safety confirmation */}
                <div className="pt-2">
                  <button 
                    onClick={() => { setShowCancelConfirm(!showCancelConfirm); playSound('pop'); }}
                    className="w-full h-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 font-extrabold uppercase tracking-wider text-xs transition-colors"
                  >
                    Cancel Order
                  </button>

                  <AnimatePresence>
                    {showCancelConfirm && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="bg-rose-500/5 border border-rose-500/15 p-4 rounded-2xl mt-3 space-y-3 text-left"
                      >
                        <p className="text-[11px] text-rose-200 leading-relaxed font-semibold">
                          🍰 Our chefs have already gilded the premium Belgian chocolate. Cancelling now will consume precious organic sponge. Are you sure you wish to cancel?
                        </p>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              toast.info("Thank you for choosing gourmet quality!");
                              setShowCancelConfirm(false);
                              playSound('success');
                            }}
                            className="bg-white/10 hover:bg-white/15 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-wider"
                          >
                            Keep Order
                          </button>
                          <button 
                            onClick={() => {
                              toast.error("Order Cancelled. Funds will return to your source account.");
                              setShowCancelConfirm(false);
                              setCurrentStepIndex(5); // Delivered or cancelled indicator
                              playSound('tap');
                            }}
                            className="bg-rose-500 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-wider"
                          >
                            Yes, Cancel
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>

            </motion.div>

          </div>

        </div>

      </div>
    </div>
  );
}
