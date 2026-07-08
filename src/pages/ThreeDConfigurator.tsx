import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  RotateCw, 
  Grid, 
  ShoppingBag, 
  Sliders, 
  Trash2, 
  Heart, 
  Share2, 
  Download, 
  Camera, 
  HelpCircle,
  TrendingUp,
  Award,
  Zap,
  Check,
  ChevronRight,
  Info,
  Layers,
  Sparkle,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { useCart } from '../lib/store';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { playSuccessChime, playSlidePop, playBtnTap } from '../lib/sound';

export default function ThreeDConfigurator() {
  const { addItem } = useCart();
  const navigate = useNavigate();

  // Navigation and Layout Control
  const [activeTab, setActiveTab] = useState<'shape' | 'cream' | 'decor' | 'flavor' | 'text' | 'photo' | 'candles' | 'accessories'>('shape');
  const [arModeActive, setArModeActive] = useState(false);

  // 3D Cake configuration states
  const [shape, setShape] = useState<'Round' | 'Heart' | 'Square' | '2-Tier' | '3-Tier'>('Round');
  const [creamColor, setCreamColor] = useState('Vanilla White');
  const [decorations, setDecorations] = useState<string[]>(['Flowers', 'Gold Leaves']);
  const [flavor, setFlavor] = useState('Classic Vanilla');
  const [weight, setWeight] = useState('1.5 KG');
  const [message, setMessage] = useState('Happy Celebration!');
  const [candles, setCandles] = useState('Sparklers');
  const [accessory, setAccessory] = useState('Greeting Card');
  
  // Interactive 3D Orbiting States
  const [rotation, setRotation] = useState(45);
  const [pitch, setPitch] = useState(15);
  const [zoom, setZoom] = useState(1.1);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Sound play wrapper
  const playSound = (type: 'tap' | 'pop' | 'success') => {
    try {
      if (type === 'tap') playBtnTap();
      if (type === 'pop') playSlidePop();
      if (type === 'success') playSuccessChime();
    } catch (e) {
      console.warn('Audio feedback inactive:', e);
    }
  };

  // Color mapping dictionary
  const CREAM_COLOR_MAP: Record<string, string> = {
    'Vanilla White': '#FAF9F6',
    'Strawberry Pink': '#FFA8B6',
    'Blueberry Blue': '#A4C3FF',
    'Lavender Purple': '#E4BFFF',
    'Dark Chocolate': '#4E342E',
    'Mint Green': '#A7F1D1',
    'Sovereign Gold': '#ECC45C'
  };

  // Pricing calculator
  const calculateTotal = () => {
    let total = 1499; // base price

    // Shape pricing
    if (shape === 'Heart') total += 150;
    if (shape === 'Square') total += 100;
    if (shape === '2-Tier') total += 600;
    if (shape === '3-Tier') total += 1200;

    // Weight pricing
    if (weight === '1.0 KG') total += 200;
    if (weight === '1.5 KG') total += 450;
    if (weight === '2.0 KG') total += 800;
    if (weight === '3.0 KG') total += 1400;

    // Decoration modifiers
    total += decorations.length * 80;

    return total;
  };

  // Auto rotation effect
  useEffect(() => {
    if (!isAutoRotating || isDragging) return;
    const interval = setInterval(() => {
      setRotation(r => (r + 0.4) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, [isAutoRotating, isDragging]);

  // Orbit rotation drag logic
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    
    setRotation(r => (r + deltaX * 0.5) % 360);
    setPitch(p => Math.max(-5, Math.min(45, p - deltaY * 0.4)));
    
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile viewport
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - dragStartRef.current.x;
    const deltaY = e.touches[0].clientY - dragStartRef.current.y;
    
    setRotation(r => (r + deltaX * 0.5) % 360);
    setPitch(p => Math.max(-5, Math.min(45, p - deltaY * 0.4)));
    
    dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  // Toggle selections helper
  const handleToggleDecor = (id: string) => {
    playSound('pop');
    setDecorations(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        if (prev.length >= 3) {
          toast.warning('Maximum 3 complex decoration assets suggested for photorealistic balance.');
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const triggerDownload = () => {
    playSound('success');
    toast.success('Gourmet Render Exported!', {
      description: 'Your high-fidelity 3D cake composition was compiled as CAD-cake.png.'
    });
  };

  const handleSaveDesign = () => {
    playSound('success');
    toast.success('Bespoke design committed successfully!', {
      description: 'Saved as signature formulation in your premium member dashboard.'
    });
  };

  const handleAddToCart = () => {
    playSound('success');
    
    const configuredProduct = {
      id: `3d-config-cake-${Date.now()}`,
      name: `Signature ${shape} 3D Confection`,
      description: `Gourmet 3D ${shape} | ${flavor} sponge | ${creamColor} | Toppings: ${decorations.join(', ')}`,
      price: calculateTotal(),
      categories: ['Custom Bakes'],
      occasions: ['Celebration'],
      flavors: [flavor],
      images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80'],
      stockStatus: 'in-stock' as const,
      isCustomizable: true,
      rating: 5.0,
      reviewsCount: 1,
      isBestseller: true
    };

    addItem(configuredProduct, {
      selectedWeight: parseFloat(weight),
      selectedFlavor: flavor,
      eggless: true,
      cakeMessage: message
    });

    toast.success('3D Configurator: Masterwork added to cart!', {
      description: 'Check out to launch the bespoke baking process.',
      action: {
        label: 'Checkout',
        onClick: () => navigate('/checkout')
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans relative overflow-hidden pb-12 select-none selection:bg-purple-900/50 selection:text-pink-300">
      <SEO 
        title="3D Premium Interactive Cake Configurator | CakeUrban"
        description="Interact with our real-time photorealistic 3D baking tool. Rotate 360 degrees, select custom weights, edit luxury cake text and preview in AR mode."
      />

      {/* Retro-futuristic luxury ambient stars and grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none -z-10" />
      <div className="absolute top-0 left-0 right-0 h-[600px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-30%] left-[20%] w-[60%] h-[70%] bg-pink-500/10 rounded-full blur-[160px]" />
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[60%] bg-purple-500/10 rounded-full blur-[160px]" />
      </div>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 text-left">
        
        {/* HEADER BRANDING WITH TOGGLES */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-300">3D Interactive CAD Studio</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { setIsAutoRotating(!isAutoRotating); playSound('tap'); }}
              className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                isAutoRotating 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-white/5 border-white/10 text-slate-400'
              }`}
            >
              {isAutoRotating ? '● Auto Rotate ON' : '⏸ Auto Rotate PAUSED'}
            </button>
            <div className="h-4 w-[1px] bg-white/15" />
            <button 
              onClick={() => { playSound('success'); navigate('/custom-order'); }}
              className="px-4 py-1.5 rounded-2xl bg-white/10 hover:bg-white/15 text-[9px] font-black uppercase tracking-widest text-white border border-white/10"
            >
              Back to Stepper
            </button>
          </div>
        </div>

        {/* 3D CONFIGURATOR LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* A. LEFT TOOLBAR PANEL (3 COLS) */}
          <div className="lg:col-span-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[36px] p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Toolbar Console</span>
                <h3 className="text-base font-black text-white tracking-tight">Select Component</h3>
              </div>

              {/* Sidebar navigation tabs */}
              <div className="space-y-2">
                {[
                  { id: 'shape', label: 'Cake Shape', icon: '📐' },
                  { id: 'cream', label: 'Icing Glaze', icon: '🎨' },
                  { id: 'decor', label: 'Topping assets', icon: '🌸' },
                  { id: 'flavor', label: 'Base Flavor', icon: '🍫' },
                  { id: 'text', label: 'Engraved Text', icon: '📝' },
                  { id: 'candles', label: 'Party Candles', icon: '🧨' },
                  { id: 'accessories', label: 'Gift wrap', icon: '🎁' }
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id as any); playSound('tap'); }}
                      className={`w-full py-3 px-4 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-between transition-all ${
                        isActive 
                          ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border border-pink-500/30' 
                          : 'bg-white/5 border border-transparent hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="text-base">{tab.icon}</span>
                        <span>{tab.label}</span>
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'rotate-90 text-pink-400' : 'text-slate-500'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick calibration status */}
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[11px] text-slate-400 leading-tight">
              <span className="font-bold text-slate-200 block mb-1">Calibration Status</span>
              <p>Pitch angle: {pitch.toFixed(0)}° | Rotation: {rotation.toFixed(0)}°</p>
            </div>
          </div>

          {/* B. CENTRAL 3D INTERACTIVE VIEWPORT (5 COLS) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Viewport frame */}
            <div 
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
              className="bg-black/40 border border-white/10 rounded-[40px] h-[480px] relative flex flex-col justify-between p-6 overflow-hidden cursor-grab active:cursor-grabbing group shadow-2xl"
            >
              
              {/* Top Viewport overlays */}
              <div className="flex justify-between items-center z-10 w-full">
                <div className="space-y-0.5 text-left">
                  <span className="text-[9px] font-black uppercase text-pink-400 tracking-wider">Viewport Alpha</span>
                  <span className="text-xs font-bold text-slate-300 block">Photorealistic 360° Rotatable</span>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => { setZoom(z => Math.max(0.8, z - 0.1)); playSound('tap'); }}
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white"
                    title="Zoom Out"
                  >
                    -
                  </button>
                  <button 
                    onClick={() => { setZoom(z => Math.min(1.6, z + 0.1)); playSound('tap'); }}
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white"
                    title="Zoom In"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => { setRotation(45); setPitch(15); setZoom(1.1); playSound('tap'); }}
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white"
                    title="Reset Camera"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* THE 3D INTERACTIVE CAKE MODEL WITH CSS 3D ROTATION */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                
                {arModeActive ? (
                  // Augmented reality simulator screen
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-slate-950 flex flex-col justify-between p-6 text-center"
                  >
                    <div className="space-y-1 mt-6">
                      <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">AR Camera Simulation</span>
                      <h4 className="text-base font-black text-white">Projecting Cake on Table</h4>
                    </div>

                    {/* Camera simulation screen with live filter */}
                    <div className="flex-1 relative my-4 rounded-2xl overflow-hidden border border-white/10 bg-slate-900 flex items-center justify-center">
                      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:12px_12px] opacity-20" />
                      <div className="text-center space-y-4">
                        <span className="text-5xl animate-bounce inline-block">📲</span>
                        <p className="text-[10px] text-emerald-400 font-mono tracking-wider">WALK AROUND TABLE TO SCAN HEIGHT</p>
                      </div>

                      {/* Small floating cake on table representation */}
                      <div className="absolute bottom-6 flex justify-center">
                        <div className="w-24 h-12 bg-pink-500/40 rounded-full blur-md" />
                        <span className="absolute bottom-2 text-3xl">🍰</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setArModeActive(false)}
                      className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-black uppercase tracking-wider"
                    >
                      Exit AR Mode
                    </button>
                  </motion.div>
                ) : (
                  // High fidelity CSS 3D representation
                  <div 
                    style={{ 
                      perspective: '1000px',
                      transform: `scale(${zoom})`,
                      transition: isDragging ? 'none' : 'transform 0.5s ease-out'
                    }}
                    className="relative"
                  >
                    <div 
                      style={{ 
                        transformStyle: 'preserve-3d',
                        transform: `rotateX(${pitch}deg) rotateY(${rotation}deg)`,
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                      }}
                      className="w-48 h-48 relative flex items-center justify-center"
                    >
                      {/* Top Surface representing icing cream */}
                      <div 
                        style={{ 
                          transform: 'rotateX(90deg) translateZ(36px)',
                          backgroundColor: CREAM_COLOR_MAP[creamColor] || '#FAF9F6',
                          transformStyle: 'preserve-3d'
                        }}
                        className={`absolute w-36 h-36 ${shape === 'Heart' ? 'rounded-[40px]' : 'rounded-full'} border border-white/20 shadow-inner flex items-center justify-center`}
                      >
                        {/* Selected text message inside the cake icing surface */}
                        {message && (
                          <div className="absolute inset-x-4 text-center select-none">
                            <span className="text-[8px] font-black text-purple-700/80 tracking-wider uppercase font-serif block drop-shadow-sm">
                              {message}
                            </span>
                          </div>
                        )}

                        {/* Top sprinkles and gold leaf floating decorations */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          {decorations.map((d, i) => {
                            const icons: Record<string, string> = { 'Flowers': '🌸', 'Gold Leaves': '🏆', 'Chocolate Bars': '🍫', 'French Macarons': '🧁' };
                            return (
                              <span 
                                key={d} 
                                className="text-base select-none absolute"
                                style={{
                                  transform: `rotate(${i * 120}deg) translateY(32px)`
                                }}
                              >
                                {icons[d] || '✨'}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Side Curved Surface Wrapper */}
                      <div 
                        style={{ 
                          transform: 'translateZ(0px)',
                          transformStyle: 'preserve-3d'
                        }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        {/* 3D Cylindrical Ring representation */}
                        <div 
                          style={{ 
                            backgroundColor: CREAM_COLOR_MAP[creamColor] || '#FAF9F6',
                            transform: 'translateY(16px)'
                          }}
                          className={`w-36 h-20 ${shape === 'Heart' ? 'rounded-[30px]' : 'rounded-[20px]'} border-b-2 border-black/20 shadow-2xl relative overflow-hidden`}
                        >
                          {/* Inner Chocolate Sponge filling strip shown from front */}
                          <div className="absolute inset-x-0 bottom-4 h-3 bg-amber-950/20" />
                          <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/15" />
                        </div>
                      </div>

                      {/* Golden presentation stand bottom plate */}
                      <div 
                        style={{ 
                          transform: 'rotateX(90deg) translateZ(-44px)' 
                        }}
                        className="absolute w-44 h-44 rounded-full bg-gradient-to-r from-yellow-600 via-amber-400 to-yellow-700 border border-white/10 shadow-lg"
                      />

                    </div>
                  </div>
                )}

              </div>

              {/* Bottom control row */}
              <div className="flex justify-between items-center z-10 w-full">
                <span className="text-[10px] font-bold text-slate-400">
                  {isDragging ? 'Drag to Rotate 3D Space' : 'Drag mouse to spin cake'}
                </span>

                <button 
                  onClick={() => { setArModeActive(true); playSound('success'); }}
                  className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-[10px] font-black uppercase tracking-widest text-white transition-all flex items-center gap-1.5 shadow-md"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Launch AR Mode</span>
                </button>
              </div>

            </div>

            {/* TAB CONTAINER CONTENT CONTROLLER */}
            <div className="bg-white/5 border border-white/10 p-5 rounded-3xl min-h-[140px] text-left">
              
              {/* TAB 1: SHAPE */}
              {activeTab === 'shape' && (
                <div className="space-y-3">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Silhouettes</span>
                  <div className="flex flex-wrap gap-2">
                    {['Round', 'Heart', 'Square', '2-Tier', '3-Tier'].map((sh) => {
                      const isSelected = shape === sh;
                      return (
                        <button
                          key={sh}
                          onClick={() => { setShape(sh as any); playSound('pop'); }}
                          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            isSelected 
                              ? 'bg-pink-500 text-white shadow-md' 
                              : 'bg-white/5 hover:bg-white/10 text-slate-300'
                          }`}
                        >
                          {sh}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: CREAM */}
              {activeTab === 'cream' && (
                <div className="space-y-3">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Cream Frostings</span>
                  <div className="flex flex-wrap gap-2">
                    {['Vanilla White', 'Strawberry Pink', 'Blueberry Blue', 'Lavender Purple', 'Dark Chocolate', 'Mint Green', 'Sovereign Gold'].map((col) => {
                      const isSelected = creamColor === col;
                      return (
                        <button
                          key={col}
                          onClick={() => { setCreamColor(col); playSound('pop'); }}
                          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                            isSelected 
                              ? 'bg-purple-600 text-white shadow-md' 
                              : 'bg-white/5 hover:bg-white/10 text-slate-300'
                          }`}
                        >
                          <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: CREAM_COLOR_MAP[col] }} />
                          <span>{col}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: DECOR */}
              {activeTab === 'decor' && (
                <div className="space-y-3">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Topping Assets</span>
                  <div className="flex flex-wrap gap-2">
                    {['Flowers', 'Gold Leaves', 'Chocolate Bars', 'French Macarons'].map((dec) => {
                      const isSelected = decorations.includes(dec);
                      return (
                        <button
                          key={dec}
                          onClick={() => handleToggleDecor(dec)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                            isSelected 
                              ? 'bg-pink-500 text-white' 
                              : 'bg-white/5 hover:bg-white/10 text-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                          <span>{dec}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: FLAVOR */}
              {activeTab === 'flavor' && (
                <div className="space-y-3">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Core Sponge Flavors</span>
                  <div className="flex flex-wrap gap-2">
                    {['Classic Vanilla', 'Belgian Chocolate', 'Crimson Red Velvet', 'Fresh Blueberry Swirl', 'Amber Butterscotch'].map((f) => {
                      const isSelected = flavor === f;
                      return (
                        <button
                          key={f}
                          onClick={() => { setFlavor(f); playSound('pop'); }}
                          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            isSelected 
                              ? 'bg-amber-500 text-white shadow-md' 
                              : 'bg-white/5 hover:bg-white/10 text-slate-300'
                          }`}
                        >
                          {f}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 5: TEXT */}
              {activeTab === 'text' && (
                <div className="space-y-3">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Engraved Cake Inscription</span>
                  <input 
                    type="text" 
                    maxLength={30}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-black text-white focus:outline-none focus:border-pink-500"
                    placeholder="Enter message..." 
                  />
                </div>
              )}

              {/* TAB 6: CANDLES */}
              {activeTab === 'candles' && (
                <div className="space-y-3">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Party Candles</span>
                  <div className="flex flex-wrap gap-2">
                    {['Sparklers', 'Gold Number Candle', 'Gilded Crown Topper'].map((c) => {
                      const isSelected = candles === c;
                      return (
                        <button
                          key={c}
                          onClick={() => { setCandles(c); playSound('tap'); }}
                          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            isSelected 
                              ? 'bg-pink-500 text-white shadow-md' 
                              : 'bg-white/5 hover:bg-white/10 text-slate-300'
                          }`}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 7: ACCESSORIES */}
              {activeTab === 'accessories' && (
                <div className="space-y-3">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Gourmet Packing Extras</span>
                  <div className="flex flex-wrap gap-2">
                    {['Greeting Card', 'Silk Gift Wrap Ribbon', 'Pastel Balloons Bouquet'].map((ac) => {
                      const isSelected = accessory === ac;
                      return (
                        <button
                          key={ac}
                          onClick={() => { setAccessory(ac); playSound('tap'); }}
                          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            isSelected 
                              ? 'bg-purple-600 text-white shadow-md' 
                              : 'bg-white/5 hover:bg-white/10 text-slate-300'
                          }`}
                        >
                          {ac}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* C. RIGHT CONSOLE PANEL: LIVE SUMMARY & BREAKDOWN (4 COLS) */}
          <div className="lg:col-span-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[38px] p-6 space-y-6 flex flex-col justify-between">
            
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Gourmet Invoice</span>
                <h3 className="text-base font-black text-white tracking-tight">Active Summary</h3>
              </div>

              {/* Specifications table */}
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-xs font-bold text-slate-300 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-white/15">
                  <span className="text-[10px] font-black uppercase text-pink-400">Spec Node</span>
                  <span>Value</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Architecture:</span>
                  <span>{shape}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Icing Base:</span>
                  <span className="truncate max-w-[120px]">{creamColor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Flavors:</span>
                  <span>{flavor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Dimension (Weight):</span>
                  <div className="flex items-center gap-1.5">
                    {['1.0 KG', '1.5 KG', '2.0 KG'].map((wt) => (
                      <button
                        key={wt}
                        onClick={() => { setWeight(wt); playSound('tap'); }}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                          weight === wt ? 'bg-pink-500 text-white' : 'bg-white/10 text-slate-400'
                        }`}
                      >
                        {wt}
                      </button>
                    ))}
                  </div>
                </div>
                {decorations.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-semibold">Toppings:</span>
                    <span className="text-pink-300 truncate max-w-[130px]">{decorations.join(', ')}</span>
                  </div>
                )}
                {message && (
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-semibold">Inscription:</span>
                    <span className="italic truncate max-w-[130px]">"{message}"</span>
                  </div>
                )}
              </div>

              {/* Real-time Estimated Logistics */}
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Standard Baking:</span>
                  <span className="text-slate-200">2.5 Hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Custom Hand Decorating:</span>
                  <span className="text-slate-200">1.0 Hour</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-400 mt-1">
                  <span>Guaranteed Fresh ETA:</span>
                  <span>Today, 5:30 PM</span>
                </div>
              </div>
            </div>

            {/* LIVE PRICE BREAKDOWN */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Price (Instantly Updated)</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl md:text-4xl font-black text-white">₹{calculateTotal()}</span>
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    Taxes Included
                  </span>
                </div>
              </div>

              {/* BOTTOM ACTION BUTTONS */}
              <div className="grid grid-cols-2 gap-2.5">
                <button 
                  onClick={handleSaveDesign}
                  className="h-11 rounded-2xl border border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 text-pink-500" />
                  <span>Save Design</span>
                </button>
                <button 
                  onClick={triggerDownload}
                  className="h-11 rounded-2xl border border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Spec</span>
                </button>
              </div>

              <button 
                onClick={handleAddToCart}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-amber-500 hover:brightness-110 text-white font-black uppercase tracking-widest text-xs transition-all shadow-[0_4px_20px_rgba(244,114,182,0.3)] flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Reserve Custom Cake</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
