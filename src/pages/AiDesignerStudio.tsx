import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Upload, 
  Check, 
  ShoppingBag, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  Heart, 
  Trash2, 
  Clock, 
  Calendar, 
  HelpCircle,
  Truck,
  Shield,
  Maximize2,
  Sliders,
  RotateCcw,
  Smile,
  Type,
  Palette,
  Mic,
  Brain,
  Camera,
  Crop,
  Layers,
  ArrowUpRight,
  Sparkle
} from 'lucide-react';
import { useCart } from '../lib/store';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { playSuccessChime, playSlidePop, playBtnTap } from '../lib/sound';

// Steps list
const STEPS = [
  { id: 'occasion', number: 1, total: 9, title: 'Celebration Occasion', desc: 'Define the aesthetic vibe of your celebration' },
  { id: 'shape', number: 2, total: 9, title: 'Cake Architecture', desc: 'Select the structure & tiered silhouette' },
  { id: 'weight', number: 3, total: 9, title: 'Bake Weight', desc: 'Determine the perfect mass for your guests' },
  { id: 'flavor', number: 4, total: 9, title: 'Flavor Profiling', desc: 'Gourmet fillings and sponge layers' },
  { id: 'creamColor', number: 5, total: 9, title: 'Glaze & Cream Palette', desc: 'Outer whipped icing base color' },
  { id: 'decoration', number: 6, total: 9, title: 'Artisan Decor & Toppings', desc: 'Drizzle custom organic additions' },
  { id: 'photo', number: 7, total: 9, title: 'Sugar-Wafer Photo Print', desc: 'Edible memory layout configuration' },
  { id: 'message', number: 8, total: 9, title: 'Script Inscription', desc: 'Write a heartfelt message on top' },
  { id: 'candles', number: 9, total: 9, title: 'Candles & Accessories', desc: 'Luxury finishing party utilities' }
];

const OCCASIONS = [
  { id: 'Birthday', label: 'Birthday 🎂', desc: 'Festive, vibrant, & full of smiles', color: 'from-pink-500/10 to-rose-500/5 border-pink-200/60' },
  { id: 'Anniversary', label: 'Anniversary 💖', desc: 'Elegant, romantic, with metallic lace', color: 'from-rose-500/10 to-red-500/5 border-rose-200/60' },
  { id: 'Wedding', label: 'Wedding 👑', desc: 'Grand, architectural royal tiers', color: 'from-amber-400/10 to-yellow-500/5 border-amber-200/60' },
  { id: 'Kids', label: 'Kids 🎉', desc: 'Whimsical pastel fantasy characters', color: 'from-sky-400/10 to-indigo-500/5 border-sky-200/60' },
  { id: 'Baby Shower', label: 'Baby Shower 👶', desc: 'Dreamy soft cloud frosting bakes', color: 'from-purple-400/10 to-pink-500/5 border-purple-200/60' },
  { id: 'Corporate', label: 'Corporate 🏢', desc: 'Sleek, minimalist branding logs', color: 'from-slate-500/10 to-zinc-600/5 border-slate-200/60' },
  { id: 'Festival', label: 'Festival 🏮', desc: 'Traditional design and spices', color: 'from-orange-500/10 to-yellow-600/5 border-orange-200/60' },
  { id: 'Graduation', label: 'Graduation 🎓', desc: 'Prestigious academic gold honor ribbons', color: 'from-blue-500/10 to-cyan-500/5 border-blue-200/60' }
];

const SHAPES = [
  { id: 'Round', label: 'Classic Round', desc: 'The pure geometry of elegance', icon: '⭕', addPrice: 0 },
  { id: 'Heart', label: 'Amour Heart', desc: 'Sensual hand-molded heart curvature', icon: '❤️', addPrice: 150 },
  { id: 'Square', label: 'Moderne Square', desc: 'Sharp luxury contemporary lines', icon: '⬜', addPrice: 100 },
  { id: 'Rectangle', label: 'Grand Landscape', desc: 'Spacious canvas for messages', icon: '█', addPrice: 150 },
  { id: 'Tall', label: 'Elite Tall Single', desc: 'Striking high-rise minimalist column', icon: '🗼', addPrice: 200 },
  { id: '2 Tier', label: 'Double Tier Sovereign', desc: 'Dramatic dual-tier architectural scale', icon: '🎂', addPrice: 600 },
  { id: '3 Tier', label: 'Imperial Triple Tier', desc: 'Majestic three-tier crown monument', icon: '👑', addPrice: 1200 }
];

const WEIGHTS = [
  { id: '0.5kg', label: '0.5 KG', desc: 'Serves 4-6 guests', addPrice: 0 },
  { id: '1kg', label: '1.0 KG', desc: 'Serves 8-12 guests', addPrice: 400 },
  { id: '2kg', label: '2.0 KG', desc: 'Serves 16-20 guests', addPrice: 850 },
  { id: '3kg', label: '3.0 KG', desc: 'Serves 25-30 guests', addPrice: 1300 },
  { id: '5kg', label: '5.0 KG', desc: 'Imperial Banquets (45+)', addPrice: 2200 }
];

const FLAVORS = [
  { id: 'Chocolate', label: 'Belgian Truffle 🍫', color: 'bg-[#3e2723]', addPrice: 150, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80', desc: 'Imported 70% dark cocoa velvet ganache' },
  { id: 'Red Velvet', label: 'Crimson Red Velvet 🍰', color: 'bg-[#b71c1c]', addPrice: 100, image: 'https://images.unsplash.com/photo-1616031037011-08ec0001d94f?w=300&q=80', desc: 'Rich velvet sponge paired with premium cream cheese' },
  { id: 'Blueberry', label: 'Zesty Blueberry 🫐', color: 'bg-[#1a237e]', addPrice: 100, image: 'https://images.unsplash.com/photo-1511018556340-d16986a1c194?w=300&q=80', desc: 'Wild mountain berry reduction compote' },
  { id: 'Pineapple', label: 'Royal Pineapple 🍍', color: 'bg-[#ffd600]', addPrice: 0, image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=300&q=80', desc: 'Slow caramelized golden pineapple layers' },
  { id: 'Butterscotch', label: 'Amber Butterscotch 🍯', color: 'bg-[#ff8f00]', addPrice: 50, image: 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?w=300&q=80', desc: 'Crunchy salted praline with house butterscotch drizzle' },
  { id: 'Lotus Biscoff', label: 'Lotus Biscoff Speculoos 🍪', color: 'bg-[#8d6e63]', addPrice: 200, image: 'https://images.unsplash.com/photo-1514517604298-cf80e0fb7f1e?w=300&q=80', desc: 'Decadent Biscoff glaze with fine crunchy cookie soil' },
  { id: 'Ferrero', label: 'Hazlenut Ferrero Rocher 🌰', color: 'bg-[#4e342e]', addPrice: 250, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&q=80', desc: 'Piedmont roasted hazelnuts folded in soft Nutella mousse' },
  { id: 'Mango', label: 'Alphonso Mango Nectar 🥭', color: 'bg-[#ffab00]', addPrice: 80, image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=300&q=80', desc: 'Savoury local high-grade summer mango layers' },
  { id: 'Vanilla', label: 'Madagascar Orchid Vanilla 🍦', color: 'bg-[#fffde7]', addPrice: 0, image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=300&q=80', desc: 'Pure organic orchid pod infused white sponge' }
];

const CREAM_COLORS = [
  { id: 'Pink', name: 'Petal Blush Pink', hex: '#FFB2C5', gradient: 'from-[#FFB2C5] to-[#FF8FA8]' },
  { id: 'Blue', name: 'Gourmet Sky Blue', hex: '#87CEEB', gradient: 'from-[#87CEEB] to-[#5CACEE]' },
  { id: 'White', name: 'Orchid Pure White', hex: '#FAFAFA', gradient: 'from-[#FAFAFA] to-[#E3E3E3]' },
  { id: 'Purple', name: 'Lavender Ethereal', hex: '#D1A3FF', gradient: 'from-[#D1A3FF] to-[#B07AFA]' },
  { id: 'Chocolate', name: 'Gourmet Cacao Brown', hex: '#6D4C41', gradient: 'from-[#6D4C41] to-[#4E342E]' },
  { id: 'Rainbow', name: 'Cosmic Pastel Rainbow', hex: '#FFDFD3', gradient: 'from-pink-300 via-purple-300 to-blue-300' },
  { id: 'Gold', name: 'Sovereign Metallic Gold', hex: '#ECC45C', gradient: 'from-[#FFD700] via-[#ECC45C] to-[#B8860B]' },
  { id: 'Rose Gold', name: 'Aura Rose Gold Metallic', hex: '#E0A9A5', gradient: 'from-[#FFC0CB] via-[#E0A9A5] to-[#C97A7E]' }
];

const DECORATIONS = [
  { id: 'Flowers', label: 'Organic Orchid Flowers 🌸', emoji: '🌸', desc: 'Handpicked fresh organic blossoms' },
  { id: 'Macarons', label: 'French Almond Macarons 🧁', emoji: '🧁', desc: 'Glazed pastel almond flour sandwiches' },
  { id: 'Sprinkles', label: 'Stardust Golden Confetti ✨', emoji: '✨', desc: 'Metallic edible star clusters' },
  { id: 'Chocolate Bars', label: 'Mini Couverture Blocks 🍫', emoji: '🍫', desc: 'Rich 74% single-origin dark tabs' },
  { id: 'Ferrero', label: 'Golden Hazelnut Truffles 🌰', emoji: '🌰', desc: 'Authentic gilded hazelnut spheres' },
  { id: 'Cookies', label: 'Speculoos Cookie Soil 🍪', emoji: '🍪', desc: 'Spiced ginger cinnamon dust' },
  { id: 'Blueberries', label: 'Glossy Indigo Berries 🫐', emoji: '🫐', desc: 'Zesty fresh garden blueberries' },
  { id: 'Gold Leaf', label: '24K Premium Gold Foils 🏆', emoji: '🏆', desc: 'Pure delicate luxury metallics' },
  { id: 'Butterflies', label: 'Wafer Ethereal Butterflies 🦋', emoji: '🦋', desc: 'Delicate edible sugar-wings' }
];

const CANDLES = [
  { id: 'Number Candles', label: 'Gilded Number Candle (0-9)', emoji: '🔟', price: 80 },
  { id: 'Sparkler', label: 'Volcanic Pyro Sparkler ✨', emoji: '🧨', price: 150 },
  { id: 'Cake Topper', label: 'Laser-Cut "Happy Birthday" Gold', emoji: '👑', price: 200 },
  { id: 'Greeting Card', label: 'Calligraphy Wax-Sealed Card ✉️', emoji: '✉️', price: 120 },
  { id: 'Gift Wrap', label: 'Premium Silk Ribbon Wrap 🎀', emoji: '🎀', price: 250 },
  { id: 'Balloons', label: 'Ambient Floating Helium Pack🎈', emoji: '🎈', price: 300 },
  { id: 'Flower Bouquet', label: 'Handcrafted Pastel Roses 💐', emoji: '💐', price: 750 },
  { id: 'Chocolate Bouquet', label: 'Luxury Swiss Truffle Box 🍫', emoji: '🎁', price: 900 }
];

export default function AiDesignerStudio() {
  const { addItem } = useCart();
  const navigate = useNavigate();

  // Selected State
  const [currentStep, setCurrentStep] = useState(0);
  const [occasion, setOccasion] = useState('Birthday');
  const [shape, setShape] = useState('Round');
  const [weight, setWeight] = useState('1kg');
  const [flavor, setFlavor] = useState('Chocolate');
  const [creamColor, setCreamColor] = useState('Pink');
  const [decorations, setDecorations] = useState<string[]>(['Sprinkles', 'Macarons']);
  const [customMessage, setCustomMessage] = useState('Happy Birthday Abhishek!');
  const [messageFont, setMessageFont] = useState('font-sans');
  const [messageColor, setMessageColor] = useState('#ffffff');
  const [selectedCandles, setSelectedCandles] = useState<string[]>(['Sparkler']);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);

  // Photo Crop/Rotate zoom simulator states
  const [photoZoom, setPhotoZoom] = useState(1);
  const [photoRotation, setPhotoRotation] = useState(0);
  const [isAiEnhanced, setIsAiEnhanced] = useState(false);
  const [isBgRemoved, setIsBgRemoved] = useState(false);

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

  // Pricing engine
  const getPrice = () => {
    let price = 1499; // base luxury cake price
    const shapeObj = SHAPES.find(s => s.id === shape);
    if (shapeObj) price += shapeObj.addPrice;

    const weightObj = WEIGHTS.find(w => w.id === weight);
    if (weightObj) price += weightObj.addPrice;

    const flavorObj = FLAVORS.find(f => f.id === flavor);
    if (flavorObj) price += flavorObj.addPrice;

    // Decorations add ₹75 each
    price += decorations.length * 75;

    // Photo adds ₹200 printing
    if (uploadedPhoto) price += 250;

    // Candles prices
    selectedCandles.forEach(cid => {
      const c = CANDLES.find(item => item.id === cid);
      if (c) price += c.price;
    });

    return price;
  };

  // Toggle decor selection
  const handleToggleDecor = (id: string) => {
    playSound('pop');
    setDecorations(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        if (prev.length >= 4) {
          toast.warning('Maximum 4 premium decorations recommended to keep structure pristine!');
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  // Toggle accessory candles
  const handleToggleCandle = (id: string) => {
    playSound('tap');
    setSelectedCandles(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Drag and Drop simulation
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedPhoto(event.target.result as string);
          playSound('success');
          toast.success('Edible memory wafer dropped successfully!', {
            description: 'AI is automatically centering your upload.'
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // AI Chef automated suggestions trigger
  const triggerAiSuggestion = (type: string) => {
    playSound('success');
    if (type === 'romantic') {
      setShape('Heart');
      setCreamColor('Pink');
      setDecorations(['Flowers', 'Gold Leaf', 'Macarons']);
      setFlavor('Red Velvet');
      toast.success('AI Confectioner: Romantic setup generated!', {
        description: 'Set to Crimson Red Velvet Heart with Pastel Rose & Gold leaf decorations.'
      });
    } else if (type === 'chocolate') {
      setFlavor('Ferrero');
      setCreamColor('Chocolate');
      setDecorations(['Chocolate Bars', 'Ferrero', 'Gold Leaf']);
      toast.success('AI Confectioner: Golden Rocher setup generated!', {
        description: 'Set to Ferrero Rocher sponge base, gourmet chocolate cream, and luxury gold leaf.'
      });
    } else if (type === 'kids') {
      setShape('Round');
      setCreamColor('Rainbow');
      setDecorations(['Sprinkles', 'Macarons', 'Butterflies']);
      setFlavor('Vanilla');
      toast.success('AI Confectioner: Whimsical Pastel Unicorn generated!', {
        description: 'Selected Vanilla sponge wrapped in pastel rainbow and butterfly decorations.'
      });
    }
  };

  const handleAddToCart = () => {
    playSound('success');
    
    // Construct fake product schema compatible with useCart
    const customCakeProduct = {
      id: `ai-custom-cake-${Date.now()}`,
      name: `AI Custom ${occasion} Masterpiece`,
      description: `Bespoke ${shape} Cake | ${flavor} Sponge | ${creamColor} Icing | Accents: ${decorations.join(', ')}`,
      price: getPrice(),
      categories: ['Custom Bakes'],
      occasions: [occasion],
      flavors: [flavor],
      images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80'],
      stockStatus: 'in-stock' as const,
      isCustomizable: true,
      rating: 5.0,
      reviewsCount: 1,
      isBestseller: true
    };

    addItem(customCakeProduct, {
      selectedWeight: parseFloat(weight),
      selectedFlavor: flavor,
      eggless: true,
      cakeMessage: customMessage
    });

    toast.success('AI Cake Studio: Added to your celebration cart!', {
      description: 'Head to checkout to book your bespoke slot.',
      action: {
        label: 'View Cart',
        onClick: () => navigate('/cart')
      }
    });
  };

  return (
    <div className="min-h-screen bg-transparent text-[#FFFDFB] font-sans pb-32 relative overflow-hidden selection:bg-[#DFB15B]/30 selection:text-[#DFB15B]">
      <SEO 
        title="AI Luxury Cake Designer Studio | CakeUrban"
        description="Design your dream celebration cake in real time with our luxury AI baking model. Select occasions, tiered shapes, organic toppings, and photo-sugar prints."
      />

      {/* Floating Abstract Luxury Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-100 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[30%] right-[-10%] w-[45%] h-[50%] bg-purple-100 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px]" />
        
        {/* Floating elements representing Macarons and chocolates */}
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="absolute top-[15%] left-[5%] text-4xl opacity-20 select-none hidden md:block"
        >
          🧁
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          className="absolute top-[45%] right-[5%] text-4xl opacity-25 select-none hidden md:block"
        >
          🍫
        </motion.div>
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className="absolute bottom-[20%] right-[15%] text-3xl opacity-20 select-none hidden md:block"
        >
          🌸
        </motion.div>
      </div>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10 text-left">
        
        {/* 1. HERO HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-[10px] uppercase tracking-[0.25em] px-4 py-1.5 rounded-full inline-block shadow-sm">
            AI-Powered Confectionery Craft
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-slate-900">
            Design Your <br />
            <span className="bg-gradient-to-r from-pink-500 via-purple-600 to-amber-500 bg-clip-text text-transparent">Dream Celebration Cake</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-xl mx-auto leading-relaxed">
            Configure tiered structures, organic berry fillings, personalized photo wafer printing, and candles. See your masterpiece update in photorealistic real time.
          </p>

          <div className="flex justify-center gap-4 pt-2">
            <button 
              onClick={() => { playSound('success'); navigate('/configurator'); }}
              className="px-5 py-2.5 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-md"
            >
              <span>Launch 3D Configurator</span>
              <ArrowUpRight className="w-4 h-4 text-pink-400" />
            </button>
          </div>
        </div>

        {/* 2. SPLIT WORKSPACE: STEPPER LEFT, REAL-TIME PREVIEW RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* STEPPER PANEL (7 COLS) */}
          <div className="lg:col-span-7 bg-white/80 backdrop-blur-xl border border-slate-200/60 p-6 md:p-8 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.02)] space-y-6">
            
            {/* Step navigation bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest">
                  Step {STEPS[currentStep].number} of {STEPS[currentStep].total}
                </span>
                <h2 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                  {STEPS[currentStep].title}
                </h2>
              </div>
              
              {/* Controls */}
              <div className="flex gap-2">
                <button
                  disabled={currentStep === 0}
                  onClick={() => { setCurrentStep(c => c - 1); playSound('tap'); }}
                  className="w-10 h-10 rounded-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 disabled:opacity-40"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  disabled={currentStep === STEPS.length - 1}
                  onClick={() => { setCurrentStep(c => c + 1); playSound('tap'); }}
                  className="w-10 h-10 rounded-full bg-slate-950 text-white hover:bg-slate-800 flex items-center justify-center disabled:opacity-40 shadow-sm"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stepper horizontal dots */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
              {STEPS.map((stepItem, idx) => {
                const isActive = idx === currentStep;
                const isPassed = idx < currentStep;
                return (
                  <button
                    key={stepItem.id}
                    onClick={() => { setCurrentStep(idx); playSound('tap'); }}
                    className={`h-2 rounded-full transition-all shrink-0 ${
                      isActive 
                        ? 'w-8 bg-pink-500' 
                        : isPassed 
                          ? 'w-3 bg-purple-400' 
                          : 'w-2 bg-slate-200'
                    }`}
                    title={stepItem.title}
                  />
                );
              })}
            </div>

            {/* STEP CONTAINER CONTROLLER */}
            <div className="min-h-[340px] pt-4">
              
              {/* STEP 1: OCCASION */}
              {currentStep === 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 gap-4"
                >
                  {OCCASIONS.map((occ) => {
                    const isSelected = occasion === occ.id;
                    return (
                      <button
                        key={occ.id}
                        onClick={() => { setOccasion(occ.id); playSound('pop'); }}
                        className={`bg-white border p-5 rounded-[28px] text-left transition-all relative overflow-hidden flex flex-col justify-between h-36 shadow-sm cursor-pointer group ${
                          isSelected 
                            ? 'border-pink-500 ring-1 ring-pink-500 shadow-md scale-102' 
                            : 'border-slate-200/60 hover:border-pink-200 hover:scale-[1.01]'
                        }`}
                      >
                        {/* selection circle */}
                        <div className="flex justify-between items-center w-full">
                          <span className="text-xl font-bold">{occ.label}</span>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                            isSelected ? 'bg-pink-500 border-pink-500 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-relaxed font-semibold mt-4 group-hover:text-slate-600 transition-colors">
                          {occ.desc}
                        </p>
                      </button>
                    );
                  })}
                </motion.div>
              )}

              {/* STEP 2: CAKE SHAPE */}
              {currentStep === 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {SHAPES.map((sh) => {
                    const isSelected = shape === sh.id;
                    return (
                      <button
                        key={sh.id}
                        onClick={() => { setShape(sh.id); playSound('pop'); }}
                        className={`bg-white border p-5 rounded-[28px] text-left transition-all flex items-center gap-4 cursor-pointer group ${
                          isSelected 
                            ? 'border-pink-500 ring-1 ring-pink-500 shadow-md' 
                            : 'border-slate-200/60 hover:border-pink-200'
                        }`}
                      >
                        <span className="text-3xl p-3 bg-slate-50 group-hover:bg-pink-50 rounded-2xl border border-slate-100 transition-all shrink-0">
                          {sh.icon}
                        </span>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-slate-900">{sh.label}</h4>
                            {sh.addPrice > 0 && (
                              <span className="text-[8px] font-black text-pink-500 uppercase bg-pink-50 px-1.5 py-0.5 rounded">
                                +₹{sh.addPrice}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 leading-tight font-semibold">{sh.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              )}

              {/* STEP 3: WEIGHT */}
              {currentStep === 2 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {WEIGHTS.map((wt) => {
                      const isSelected = weight === wt.id;
                      return (
                        <button
                          key={wt.id}
                          onClick={() => { setWeight(wt.id); playSound('pop'); }}
                          className={`bg-white border p-5 rounded-3xl text-center flex flex-col justify-center gap-1.5 transition-all cursor-pointer ${
                            isSelected 
                              ? 'border-pink-500 ring-1 ring-pink-500 bg-pink-50/5' 
                              : 'border-slate-200/60 hover:border-pink-100'
                          }`}
                        >
                          <span className="text-lg font-black text-slate-900 block">{wt.label}</span>
                          {wt.addPrice > 0 ? (
                            <span className="text-[9px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                              +₹{wt.addPrice}
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold text-slate-400">Included</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/80 flex items-start gap-3">
                    <span className="text-xl">💡</span>
                    <div className="space-y-0.5 text-xs">
                      <span className="font-bold text-slate-700 block">Chef’s Mass Recommendation</span>
                      <p className="text-slate-400 font-medium">For medium gatherings of 10 to 12 guests, a **1.0 KG** sponge ensures perfect balance and structure stability.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: FLAVOR */}
              {currentStep === 3 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                  {FLAVORS.map((flav) => {
                    const isSelected = flavor === flav.id;
                    return (
                      <button
                        key={flav.id}
                        onClick={() => { setFlavor(flav.id); playSound('pop'); }}
                        className={`bg-white border rounded-[30px] overflow-hidden text-left transition-all cursor-pointer group flex flex-col justify-between ${
                          isSelected 
                            ? 'border-pink-500 ring-1 ring-pink-500 shadow-md' 
                            : 'border-slate-200/60 hover:border-pink-200'
                        }`}
                      >
                        <div className="aspect-[4/3] w-full bg-slate-50 relative overflow-hidden">
                          <img 
                            src={flav.image} 
                            alt={flav.label}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full border border-white/60 bg-white flex items-center justify-center text-xs">
                            <span className={`w-2.5 h-2.5 rounded-full ${flav.color}`} />
                          </div>
                        </div>
                        
                        <div className="p-4 space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-black text-slate-800 truncate">{flav.label}</span>
                            {flav.addPrice > 0 && (
                              <span className="text-[8px] font-bold text-pink-500 bg-pink-50 px-1 rounded shrink-0">
                                +₹{flav.addPrice}
                              </span>
                            )}
                          </div>
                          <p className="text-[9px] text-slate-400 leading-tight font-semibold line-clamp-2">
                            {flav.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              )}

              {/* STEP 5: CREAM COLOR */}
              {currentStep === 4 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                >
                  {CREAM_COLORS.map((col) => {
                    const isSelected = creamColor === col.id;
                    return (
                      <button
                        key={col.id}
                        onClick={() => { setCreamColor(col.id); playSound('pop'); }}
                        className={`bg-white border p-4 rounded-[28px] text-center flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-pink-500 ring-1 ring-pink-500 shadow-md scale-102' 
                            : 'border-slate-200/60 hover:border-pink-100'
                        }`}
                      >
                        <div className={`w-14 h-14 rounded-full bg-gradient-to-tr ${col.gradient} shadow-inner border border-white flex items-center justify-center`}>
                          {isSelected && <Check className="w-5 h-5 text-white drop-shadow stroke-[3]" />}
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[11px] font-black text-slate-950 block leading-tight">{col.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              )}

              {/* STEP 6: DECORATION */}
              {currentStep === 5 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                  {DECORATIONS.map((decor) => {
                    const isSelected = decorations.includes(decor.id);
                    return (
                      <button
                        key={decor.id}
                        onClick={() => handleToggleDecor(decor.id)}
                        className={`bg-white border p-5 rounded-[28px] text-left transition-all cursor-pointer flex flex-col justify-between h-36 ${
                          isSelected 
                            ? 'border-pink-500 ring-1 ring-pink-500 bg-pink-50/5 shadow-sm' 
                            : 'border-slate-200/60 hover:border-pink-100'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-3xl p-2 bg-slate-50 rounded-2xl border border-slate-100">{decor.emoji}</span>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                            isSelected ? 'bg-pink-500 border-pink-500 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>

                        <div className="space-y-0.5 mt-4">
                          <h4 className="text-xs font-black text-slate-900 leading-tight">{decor.label}</h4>
                          <p className="text-[9px] text-slate-400 font-semibold leading-tight">{decor.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              )}

              {/* STEP 7: PHOTO UPLOAD */}
              {currentStep === 6 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-6"
                >
                  {/* Upload box */}
                  <div className="md:col-span-6 space-y-4">
                    <div 
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className="border-2 border-dashed border-slate-200 hover:border-pink-400 rounded-[32px] p-6 text-center bg-slate-50/50 hover:bg-pink-50/5 cursor-pointer transition-all"
                    >
                      <input 
                        type="file" 
                        id="cake-photo-upload" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                setUploadedPhoto(event.target.result as string);
                                playSound('success');
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label htmlFor="cake-photo-upload" className="cursor-pointer space-y-3 block">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mx-auto text-slate-400 shadow-sm">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-black text-slate-700 block">Drag & Drop Image</span>
                          <span className="text-[10px] text-slate-400 font-bold block">or click to browse local files (max 3MB)</span>
                        </div>
                      </label>
                    </div>

                    {/* AI Enhancement utilities */}
                    <div className="flex gap-2.5">
                      <button 
                        onClick={() => {
                          if (!uploadedPhoto) return toast.error('Upload photo first!');
                          setIsBgRemoved(!isBgRemoved);
                          playSound('tap');
                          toast.success('AI background remove toggle successful!');
                        }}
                        className={`flex-1 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${
                          isBgRemoved 
                            ? 'bg-purple-100 border-purple-200 text-purple-700' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Remove Background
                      </button>
                      <button 
                        onClick={() => {
                          if (!uploadedPhoto) return toast.error('Upload photo first!');
                          setIsAiEnhanced(!isAiEnhanced);
                          playSound('success');
                          toast.success('AI Face & Glow Enhancement activated!');
                        }}
                        className={`flex-1 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${
                          isAiEnhanced 
                            ? 'bg-pink-100 border-pink-200 text-pink-700' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        AI Auto-Enhance
                      </button>
                    </div>
                  </div>

                  {/* Preview controls */}
                  <div className="md:col-span-6 bg-slate-50 border border-slate-100 p-5 rounded-[32px] flex flex-col justify-between">
                    {uploadedPhoto ? (
                      <div className="space-y-4">
                        <div className="aspect-[4/3] rounded-2xl bg-white border border-slate-200/60 overflow-hidden relative flex items-center justify-center">
                          <img 
                            src={uploadedPhoto} 
                            alt="Uploaded memory" 
                            className="object-cover transition-transform"
                            style={{ 
                              transform: `scale(${photoZoom}) rotate(${photoRotation}deg)`,
                              filter: isAiEnhanced ? 'brightness(1.1) contrast(1.05) saturate(1.1)' : 'none' 
                            }} 
                          />
                        </div>

                        {/* Adjusters slider */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <span>Wafer Zoom ({photoZoom}x)</span>
                            <input 
                              type="range" 
                              min="0.5" 
                              max="2.5" 
                              step="0.1" 
                              value={photoZoom} 
                              onChange={(e) => setPhotoZoom(parseFloat(e.target.value))}
                              className="w-2/3 accent-pink-500" 
                            />
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <span>Rotate Angle</span>
                            <input 
                              type="range" 
                              min="0" 
                              max="360" 
                              value={photoRotation} 
                              onChange={(e) => setPhotoRotation(parseInt(e.target.value))}
                              className="w-2/3 accent-pink-500" 
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 text-slate-400">
                        <span className="text-4xl">📸</span>
                        <span className="text-xs font-bold">No edible photo uploaded yet</span>
                        <p className="text-[10px] text-slate-400 leading-tight max-w-[160px] font-semibold">Your image prints on sweet sugar-wafer sheet.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* STEP 8: CAKE MESSAGE */}
              {currentStep === 7 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Message Engraved on Wafer/Cream</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        maxLength={40}
                        value={customMessage} 
                        onChange={(e) => setCustomMessage(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-black focus:border-pink-500 focus:outline-none"
                        placeholder="e.g. Happy Anniversary Mom & Dad"
                      />
                      <span className="absolute right-4 top-4 text-[10px] font-bold text-slate-400">
                        {customMessage.length}/40
                      </span>
                    </div>
                  </div>

                  {/* Fonts selector & color */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Calligraphy Style</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'font-sans', label: 'Moderne' },
                          { id: 'font-serif', label: 'Elegance' },
                          { id: 'font-mono', label: 'Minimal' }
                        ].map(f => (
                          <button
                            key={f.id}
                            onClick={() => { setMessageFont(f.id); playSound('tap'); }}
                            className={`py-2 rounded-xl border text-xs font-black transition-all ${
                              messageFont === f.id 
                                ? 'bg-pink-50 border-pink-500 text-pink-600' 
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Ink/Cream Color</label>
                      <div className="flex gap-2">
                        {['#ffffff', '#ff4081', '#ffffff', '#3e2723', '#ffd600', '#000000'].map(c => (
                          <button
                            key={c}
                            onClick={() => setMessageColor(c)}
                            className={`w-8 h-8 rounded-full border-2 transition-transform ${
                              messageColor === c ? 'border-pink-500 scale-110 shadow-sm' : 'border-white'
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Emoji Quick addition */}
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider mr-2">Quick Emojis:</span>
                    {['❤️', '🎉', '✨', '🎂', '👑', '🥂', '🌸', '👶'].map(em => (
                      <button
                        key={em}
                        onClick={() => {
                          setCustomMessage(prev => (prev + ' ' + em).substring(0, 40));
                          playSound('tap');
                        }}
                        className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 hover:bg-pink-50 hover:border-pink-100 flex items-center justify-center transition-all text-sm"
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 9: CANDLES & ACCESSORIES */}
              {currentStep === 8 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {CANDLES.map((cand) => {
                    const isSelected = selectedCandles.includes(cand.id);
                    return (
                      <button
                        key={cand.id}
                        onClick={() => handleToggleCandle(cand.id)}
                        className={`bg-white border p-4 rounded-[28px] text-left cursor-pointer transition-all flex items-center justify-between group ${
                          isSelected 
                            ? 'border-pink-500 ring-1 ring-pink-500 bg-pink-50/5 shadow-sm' 
                            : 'border-slate-200/60 hover:border-pink-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl p-2 bg-slate-50 group-hover:bg-pink-50 rounded-xl transition-all">{cand.emoji}</span>
                          <div>
                            <h4 className="text-xs font-black text-slate-800 leading-none">{cand.label}</h4>
                            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mt-1">₹{cand.price}</span>
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                          isSelected ? 'bg-pink-500 border-pink-500 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              )}

            </div>

            {/* Stepper bottom row buttons */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-6">
              <div className="text-left">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Estimated Total</span>
                <span className="text-xl font-black text-slate-900 block leading-tight">₹{getPrice()}</span>
              </div>

              <div className="flex gap-3">
                {currentStep > 0 && (
                  <button
                    onClick={() => { setCurrentStep(c => c - 1); playSound('tap'); }}
                    className="h-12 px-6 rounded-2xl border border-slate-200 hover:bg-slate-50 text-xs font-black uppercase tracking-widest text-slate-600 transition-colors"
                  >
                    Back
                  </button>
                )}

                {currentStep < STEPS.length - 1 ? (
                  <button
                    onClick={() => { setCurrentStep(c => c + 1); playSound('tap'); }}
                    className="h-12 px-8 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 text-xs font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="h-12 px-8 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-amber-500 hover:brightness-110 text-white text-xs font-black uppercase tracking-widest transition-all shadow-md flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Custom Cake to Cart</span>
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* REAL-TIME PREVIEW PANEL (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Elegant live render glass wrapper */}
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-6 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.01)] text-center space-y-6 relative overflow-hidden group">
              <div className="absolute top-3 right-3 bg-slate-100 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md text-slate-400">
                Live AI Render
              </div>

              {/* Dynamic layered cake vector illustration */}
              <div className="h-[280px] w-full bg-gradient-to-b from-slate-50 to-slate-100/50 rounded-3xl relative flex items-center justify-center overflow-hidden border border-slate-100">
                {/* Abstract grid lines representing Vision Pro aesthetic */}
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />
                
                {/* Actual customized responsive cake box */}
                <motion.div 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                  className="relative flex flex-col items-center justify-center"
                >
                  {/* Layered custom cake illustration based on shape, tiers, and colors */}
                  <div className="space-y-1 relative">
                    
                    {/* Tier 3 (only shown for 3 Tier) */}
                    {shape === '3 Tier' && (
                      <div className="flex justify-center">
                        <div 
                          className="w-16 h-8 rounded-t-xl shadow-md border-b border-white/20 relative"
                          style={{ backgroundColor: CREAM_COLORS.find(c => c.id === creamColor)?.hex || '#FFB2C5' }}
                        >
                          {/* Drizzle layer */}
                          <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/10 rounded-b-md" />
                        </div>
                      </div>
                    )}

                    {/* Tier 2 (shown for 2 Tier or 3 Tier) */}
                    {(shape === '2 Tier' || shape === '3 Tier') && (
                      <div className="flex justify-center">
                        <div 
                          className="w-24 h-11 rounded-t-xl shadow-md border-b border-white/20 relative"
                          style={{ backgroundColor: CREAM_COLORS.find(c => c.id === creamColor)?.hex || '#FFB2C5' }}
                        >
                          <div className="absolute bottom-0 left-0 right-0 h-3 bg-black/10 rounded-b-md" />
                        </div>
                      </div>
                    )}

                    {/* Primary base tier (always shown) */}
                    <div 
                      className={`h-20 shadow-xl border-b border-white/30 relative ${
                        shape === 'Heart' ? 'w-32 rounded-t-[30px]' : 'w-36 rounded-t-2xl'
                      }`}
                      style={{ backgroundColor: CREAM_COLORS.find(c => c.id === creamColor)?.hex || '#FFB2C5' }}
                    >
                      {/* Interactive decorations layout */}
                      <div className="absolute -top-3 left-0 right-0 flex justify-center gap-1">
                        {decorations.map((d, i) => {
                          const iconObj = DECORATIONS.find(item => item.id === d);
                          return (
                            <span key={d} className="text-base select-none animate-bounce" style={{ animationDelay: `${i * 150}ms` }}>
                              {iconObj?.emoji}
                            </span>
                          );
                        })}
                      </div>

                      {/* Customized printed photo wafer on cake front */}
                      {uploadedPhoto && (
                        <div className="absolute inset-x-6 top-4 bottom-4 rounded-lg overflow-hidden border border-white/40 shadow-inner flex items-center justify-center bg-white/10 backdrop-blur-sm">
                          <img 
                            src={uploadedPhoto} 
                            alt="Sugar print" 
                            className="w-full h-full object-cover opacity-80" 
                            style={{ filter: isAiEnhanced ? 'brightness(1.1)' : 'none' }}
                          />
                        </div>
                      )}

                      {/* Custom Inscribed message */}
                      {customMessage && (
                        <div className="absolute inset-x-2 bottom-3 text-center">
                          <span 
                            className={`text-[9px] font-black tracking-wider uppercase inline-block drop-shadow-md truncate max-w-full ${messageFont}`}
                            style={{ color: messageColor }}
                          >
                            {customMessage}
                          </span>
                        </div>
                      )}

                      {/* Glaze shadow */}
                      <div className="absolute bottom-0 left-0 right-0 h-4 bg-black/10 rounded-b-md" />
                    </div>

                    {/* Cake Golden Stand Tray bottom */}
                    <div className="w-44 h-2 bg-gradient-to-r from-[#DFB15B] via-[#FFEBB3] to-[#B58C3D] rounded-full shadow-lg border border-white/20" />
                  </div>

                  {/* Candles accessories row */}
                  <div className="absolute -top-12 inset-x-0 flex justify-center gap-1">
                    {selectedCandles.map((cId) => {
                      const candleObj = CANDLES.find(c => c.id === cId);
                      return (
                        <motion.span 
                          key={cId}
                          animate={{ y: [0, -3, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="text-xl select-none"
                        >
                          {candleObj?.emoji}
                        </motion.span>
                      );
                    })}
                  </div>

                </motion.div>
              </div>

              {/* Specs meta box */}
              <div className="p-4 bg-slate-50 rounded-2xl text-left text-xs font-semibold space-y-1.5 text-slate-500">
                <div className="flex justify-between border-b border-slate-200/50 pb-1.5 text-slate-800">
                  <span className="font-extrabold uppercase text-[10px] tracking-wider">Specifications Summary</span>
                  <span>Active Spec</span>
                </div>
                <div className="flex justify-between">
                  <span>Cake Silhouette:</span>
                  <span className="text-slate-800 font-extrabold">{shape} ({occasion})</span>
                </div>
                <div className="flex justify-between">
                  <span>Flavor / Weight:</span>
                  <span className="text-slate-800 font-extrabold">{flavor} / {weight}</span>
                </div>
                <div className="flex justify-between">
                  <span>Icing Color:</span>
                  <span className="text-slate-800 font-extrabold">{creamColor}</span>
                </div>
                {decorations.length > 0 && (
                  <div className="flex justify-between">
                    <span>Selected Toppings:</span>
                    <span className="text-slate-800 font-extrabold truncate max-w-[150px]">
                      {decorations.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* AI ASSISTANT CONFICTIONER CARD */}
            <div className="bg-gradient-to-tr from-[#1E122A] to-[#11091C] text-white p-6 rounded-[36px] shadow-xl text-left relative overflow-hidden group border border-purple-500/15">
              {/* Purple glowing orb */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg text-lg">
                  🤖
                </div>
                <div className="space-y-3 flex-1">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-pink-400 uppercase tracking-widest block">AI Confectioner Assistant</span>
                    <h4 className="text-sm font-black tracking-tight text-white leading-none">Gourmet Pairing AI</h4>
                  </div>

                  <p className="text-[11px] text-purple-200 leading-relaxed font-semibold">
                    "I analyzed your selection of **{flavor}** sponge. To make it a visual marvel, I recommend wrapping it with **Sovereign Metallic Gold** icing and crowning it with **French Macarons** & **Gold Leaf**."
                  </p>

                  {/* Automated presets quick applies */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-purple-900/40">
                    <button 
                      onClick={() => triggerAiSuggestion('romantic')}
                      className="px-3 py-1.5 rounded-lg bg-purple-950 hover:bg-purple-900 text-[9px] font-black uppercase tracking-wider text-purple-300"
                    >
                      ❤️ Apply Romantic Aura
                    </button>
                    <button 
                      onClick={() => triggerAiSuggestion('chocolate')}
                      className="px-3 py-1.5 rounded-lg bg-purple-950 hover:bg-purple-900 text-[9px] font-black uppercase tracking-wider text-purple-300"
                    >
                      🍫 Apply Rocher Gold
                    </button>
                    <button 
                      onClick={() => triggerAiSuggestion('kids')}
                      className="px-3 py-1.5 rounded-lg bg-purple-950 hover:bg-purple-900 text-[9px] font-black uppercase tracking-wider text-purple-300"
                    >
                      🦄 Apply Rainbow Unicorn
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
