import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Upload, 
  Check, 
  ShoppingCart, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  Heart, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  Sparkle, 
  Camera, 
  Eye, 
  Calendar, 
  HelpCircle,
  Truck,
  Shield,
  Palette
} from 'lucide-react';
import { useCart } from '../lib/store';
import { toast } from 'sonner';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firebase';
import SEO from '../components/SEO';
import { useAuth } from '../hooks/useAuth';
import { playSuccessChime, playSlidePop, playBtnTap } from '../lib/sound';

// Steps list
const STEPS = [
  { id: 'occasion', number: 1, total: 8, title: 'Choose Occasion', desc: 'Select the vibe of your event' },
  { id: 'shape', number: 2, total: 8, title: 'Cake Architecture & Shape', desc: 'Pick your canvas silhouette' },
  { id: 'size', number: 3, total: 8, title: 'Cake Dimension & Weight', desc: 'How many foodies are gathering?' },
  { id: 'flavor', number: 4, total: 8, title: 'Artisan Flavor Profiling', desc: 'Savour the finest organic bakes' },
  { id: 'color', number: 5, total: 8, title: 'Velvet Cream Color', desc: 'Select the outer icing palette' },
  { id: 'decoration', number: 6, total: 8, title: 'Bespoke Toppings & Decor', desc: 'Layer delicious accessories' },
  { id: 'photo', number: 7, total: 8, title: 'Edible Photo Artistry', desc: 'Incorporate memories or templates' },
  { id: 'message', number: 8, total: 8, title: 'Script Inscription', desc: 'Write a beautiful message onto the cake' },
];

const OCCASIONS = [
  { id: 'Birthday', label: 'Birthday 🎂', desc: 'Joyful, bright, & full of sprinkles', color: 'from-pink-500/20 to-rose-500/10 border-pink-200' },
  { id: 'Anniversary', label: 'Anniversary 💖', desc: 'Elegant, romantic, & gold accents', color: 'from-rose-500/20 to-red-500/10 border-rose-200' },
  { id: 'Wedding', label: 'Wedding 👑', desc: 'Grand, floral, architectural tiers', color: 'from-amber-400/20 to-yellow-500/10 border-amber-200' },
  { id: 'Kids', label: 'Kids 🎈', desc: 'Whimsical, colorful, & playful toys', color: 'from-sky-400/20 to-indigo-500/10 border-sky-200' },
  { id: 'Baby Shower', label: 'Baby Shower 👶', desc: 'Soft pastels & cloud decorations', color: 'from-purple-400/20 to-pink-500/10 border-purple-200' },
  { id: 'Corporate', label: 'Corporate 🏢', desc: 'Sleek, minimalist, custom branding', color: 'from-slate-500/20 to-zinc-600/10 border-slate-200' },
  { id: 'Graduation', label: 'Graduation 🎓', desc: 'Prestigious black & gold honors', color: 'from-blue-500/20 to-cyan-500/10 border-blue-200' },
  { id: 'Festival', label: 'Festival 🏮', desc: 'Traditional flavors & celebration themes', color: 'from-orange-500/20 to-yellow-600/10 border-orange-200' }
];

const SHAPES = [
  { id: 'Round', label: 'Classic Round', desc: 'The absolute standard of elegance', icon: '⭕', addPrice: 0 },
  { id: 'Heart', label: 'Artisan Heart', desc: 'Romantic and hand-molded curves', icon: '❤️', addPrice: 150 },
  { id: 'Square', label: 'Modern Square', desc: 'Sharp edges for contemporary style', icon: '⬜', addPrice: 100 },
  { id: 'Rectangle', label: 'Grand Rectangle', desc: 'Spacious flatbed for large inscriptions', icon: '█', addPrice: 150 },
  { id: 'Tall', label: 'Elite Tall (1 Tier)', desc: 'Striking high-rise profile with side glaze', icon: '🗼', addPrice: 250 },
  { id: '2 Tier', label: 'Architectural Dual Tier', desc: 'Grand double-tier celebration centerpiece', icon: '🎂', addPrice: 600 },
  { id: '3 Tier', label: 'Royal Triple Tier', desc: 'Majestic three-tier culinary masterwork', icon: '👑', addPrice: 1200 },
];

const SIZES = [
  { id: '0.5 KG', label: '0.5 KG', desc: 'Serves 4-6 Foodies', addPrice: 0 },
  { id: '1.0 KG', label: '1.0 KG', desc: 'Serves 8-12 Foodies', addPrice: 500 },
  { id: '1.5 KG', label: '1.5 KG', desc: 'Serves 12-16 Foodies', addPrice: 900 },
  { id: '2.0 KG', label: '2.0 KG', desc: 'Serves 16-22 Foodies', addPrice: 1300 },
  { id: '3.0 KG', label: '3.0 KG', desc: 'Serves 25-30 Foodies', addPrice: 2200 },
  { id: '5.0 KG', label: '5.0 KG', desc: 'Grand Feast (35+ Foodies)', addPrice: 4000 },
];

const FLAVORS = [
  { id: 'Belgian Chocolate', label: 'Belgian Chocolate 🍫', desc: '70% pure imported cocoa and silky mousse', addPrice: 200 },
  { id: 'Red Velvet', label: 'Red Velvet 🍰', desc: 'Traditional velvety cake with cream cheese', addPrice: 150 },
  { id: 'Butterscotch', label: 'Classic Butterscotch 🍯', desc: 'Crunchy home-made praline and caramel', addPrice: 50 },
  { id: 'Black Forest', label: 'Black Forest 🍒', desc: 'Dark cherry layers with whipped European cream', addPrice: 100 },
  { id: 'Blueberry', label: 'Zesty Blueberry 🫐', desc: 'Fresh mountain berry compote and citrus tang', addPrice: 150 },
  { id: 'Pineapple', label: 'Royal Pineapple 🍍', desc: 'Slow-caramelized sweet golden pineapple chunks', addPrice: 0 },
  { id: 'Strawberry', label: 'Wild Strawberry 🍓', desc: 'Handpicked farm strawberries and velvet cream', addPrice: 100 },
  { id: 'Lotus Biscoff', label: 'Lotus Biscoff 🍪', desc: 'Premium Biscoff spread and cookie crumbs', addPrice: 300 },
  { id: 'Ferrero Rocher', label: 'Ferrero Rocher 🌰', desc: 'Crispy hazelnut crunch and rich Nutella cream', addPrice: 350 },
  { id: 'Mango', label: 'Alphonso Mango 🥭', desc: 'Seasonal fresh sweet mango puree and pulp', addPrice: 100 }
];

const CREAM_COLORS = [
  { id: 'Pink', hex: '#FF9EB7', darkerHex: '#E25979', name: 'Pastel Pink 🌸', desc: 'Playful blush icing' },
  { id: 'White', hex: '#FFFBF5', darkerHex: '#E5D6C5', name: 'Cream White 🤍', desc: 'Madagascar vanilla shine' },
  { id: 'Blue', hex: '#63B3FF', darkerHex: '#2574C4', name: 'Sky Blue 💙', desc: 'Gourmet ocean tone' },
  { id: 'Purple', hex: '#D29FFF', darkerHex: '#8C46CE', name: 'Lavender Purple 💜', desc: 'Ethereal royal velvet' },
  { id: 'Yellow', hex: '#FFE073', darkerHex: '#CFA411', name: 'Sunshine Yellow 💛', desc: 'Zesty bright cream' },
  { id: 'Chocolate', hex: '#795548', darkerHex: '#4E342E', name: 'Rich Fudge Brown 🟫', desc: 'Double chocolate ganache' },
  { id: 'Mint', hex: '#87E5C3', darkerHex: '#39A981', name: 'Fresh Mint Green 💚', desc: 'Aromatic herb essence' },
  { id: 'Sky Blue', hex: '#8FE9FF', darkerHex: '#1BA7CE', name: 'Tiffany Cyan 💎', desc: 'Tiffany style luxury hue' }
];

const DECORATIONS = [
  { id: 'Fresh Flowers', label: 'Fresh Flowers 🌸', emoji: '🌸', desc: 'Organic edible rose & orchid petals' },
  { id: 'Macarons', label: 'French Macarons 🧁', emoji: '🧁', desc: 'Pastel strawberry & blueberry cookies' },
  { id: 'Chocolate Bars', label: 'Gourmet Chocolate Bars 🍫', emoji: '🍫', desc: 'Mini dark chocolate blocks & flakes' },
  { id: 'Ferrero', label: 'Golden Ferrero Truffles 🌰', emoji: '🌰', desc: 'Luxury gold foil hazelnut truffles' },
  { id: 'Blueberries', label: 'Glossy Blueberries 🫐', emoji: '🫐', desc: 'Fresh local forest wild blueberries' },
  { id: 'Sprinkles', label: 'Stardust Sprinkles ✨', emoji: '✨', desc: 'Glimmering colorful sugar confetti' },
  { id: 'Gold Leaf', label: '24K Gold Leaves 🏆', emoji: '🏆', desc: 'Pure premium edible 24 karat gold foils' },
  { id: 'Candy', label: 'Peppermint Candy Swirls 🍬', emoji: '🍬', desc: 'Sweet candy sticks & lollipops' },
  { id: 'Mini Donuts', label: 'Glazed Mini Donuts 🍩', emoji: '🍩', desc: 'Little delicious rings of colorful sugar' },
  { id: 'Cookies', label: 'Choco-Chip Cookies 🍪', emoji: '🍪', desc: 'Crispy premium hand-baked cookies' }
];

// Presets of edible image art templates if the user does not upload their own
const EDIBLE_TEMPLATES = [
  { id: 'gold_frame', label: 'Royal Gold Frame 👑', url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=300' },
  { id: 'comic_art', label: 'Retro Comic Vibe 🎨', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300' },
  { id: 'floral_bloom', label: 'Watercolor Bouquet 💐', url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=300' }
];

export default function CustomOrder() {
  const { addItem } = useCart();
  const { profile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // SECTION STATES (Tesla Configurator style)
  const [currentStep, setCurrentStep] = useState(0);
  const [occasion, setOccasion] = useState('Birthday');
  const [shape, setShape] = useState('Round');
  const [size, setSize] = useState('1.0 KG');
  const [flavor, setFlavor] = useState('Belgian Chocolate');
  const [creamColor, setCreamColor] = useState('Pink');
  const [selectedDecors, setSelectedDecors] = useState<string[]>(['Sprinkles', 'Macarons']);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [isNormalEgg, setIsNormalEgg] = useState(true);

  // Parallax mouse position
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width) * 2 - 1;
    const y = ((clientY - top) / height) * 2 - 1;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Image Upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        toast.error('Gourmet warning: Edible file must be under 3MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedPhoto(event.target.result as string);
          playSuccessChime();
          toast.success('Memory uploaded! Ready for edible sugar printing.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        toast.error('File exceeds 3MB limit');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedPhoto(event.target.result as string);
          playSuccessChime();
          toast.success('Sugar wafer image drop successful!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate pricing
  const basePrice = 1199;
  const currentShapeObj = SHAPES.find(s => s.id === shape) || SHAPES[0];
  const currentSizeObj = SIZES.find(s => s.id === size) || SIZES[0];
  const currentFlavorObj = FLAVORS.find(f => f.id === flavor) || FLAVORS[0];
  
  const shapePrice = currentShapeObj.addPrice;
  const sizePrice = currentSizeObj.addPrice;
  const flavorPrice = currentFlavorObj.addPrice;
  const decorPrice = selectedDecors.length * 100;
  const photoPrice = uploadedPhoto ? 250 : 0;
  const egglessPrice = isNormalEgg ? 0 : 150;

  const rawSubtotal = basePrice + shapePrice + sizePrice + flavorPrice + decorPrice + photoPrice + egglessPrice;
  const gstTax = Math.round(rawSubtotal * 0.18);
  const deliveryCharge = 150; // Premium express
  const discountAmount = Math.round(rawSubtotal * 0.10); // 10% builder introductory rebate
  const finalPrice = rawSubtotal + gstTax + deliveryCharge - discountAmount;

  // Decor helper
  const toggleDecor = (id: string) => {
    playBtnTap();
    if (selectedDecors.includes(id)) {
      setSelectedDecors(selectedDecors.filter(d => d !== id));
    } else {
      setSelectedDecors([...selectedDecors, id]);
    }
  };

  // Add customized cake to Zustand cart
  const handleAddToCart = () => {
    playSuccessChime();
    const mockProduct = {
      id: `custom-cake-${Date.now()}`,
      name: `${occasion} Custom ${shape} Cake`,
      description: `Bespoke artisanal design. Flavor: ${flavor}, Size: ${size}, Cream Hue: ${creamColor}, Toppings: ${selectedDecors.join(', ') || 'Minimalist'}.${customMessage ? ` Message: "${customMessage}"` : ''}`,
      price: finalPrice,
      categories: ['Custom'],
      occasions: [occasion],
      flavors: [flavor],
      images: [uploadedPhoto || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400'],
      stockStatus: 'in-stock' as const,
      isCustomizable: true,
      selectedWeight: parseFloat(size),
      selectedFlavor: flavor,
      cakeMessage: customMessage,
      eggless: !isNormalEgg,
    };

    addItem(mockProduct, {
      selectedWeight: parseFloat(size),
      selectedFlavor: flavor,
      cakeMessage: customMessage,
      eggless: !isNormalEgg,
    });

    toast.success('Bespoke masterwork added to your gourmet cart!', {
      description: `Preparing your ${size} ${flavor} cake.`,
      duration: 5000,
    });
  };

  // Order Now (direct Checkout)
  const handleOrderNow = async () => {
    playSuccessChime();
    const orderData = {
      type: 'custom_builder',
      occasion,
      shape,
      size,
      flavor,
      creamColor,
      decorations: selectedDecors,
      photo: uploadedPhoto ? 'uploaded_base64_structure' : 'none',
      message: customMessage,
      isEggless: !isNormalEgg,
      calculatedCost: finalPrice,
      status: 'pending_review',
      createdAt: serverTimestamp(),
      userEmail: profile?.email || 'guest@cakeurban.com',
      userName: profile?.displayName || 'Gourmet Builder Patron',
    };

    try {
      await addDoc(collection(db, 'custom_orders'), orderData);
      toast.success('Gourmet custom requisition logged successfully!', {
        description: 'Our lead pastry chef is reviewing your architectural cake layout. Redirecting to billing...',
      });
      
      // Also add to cart so they can purchase directly
      handleAddToCart();

      setTimeout(() => {
        window.location.href = '/checkout';
      }, 1500);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'custom_orders');
    }
  };

  const activeColorObj = CREAM_COLORS.find(c => c.id === creamColor) || CREAM_COLORS[0];

  return (
    <div 
      className="relative min-h-screen bg-transparent text-[#FFFDFB] overflow-hidden py-16 md:py-24"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <SEO 
        title="Custom 3D Cake Customizer Studio - Cake Urban"
        description="Design your own premium customized cake in 3D perspective with Cake Urban. Choose occasion, shapes, velvet cream color schemes, toppings, and sugar printed photos."
        keywords="custom cake builder, luxury cake creator, customized cake delhi, organic eggless customized bakery"
      />

      {/* Floating abstract luxury pastel glowing blobs */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full bg-pink-100/40 blur-3xl -top-40 -left-40 transition-transform duration-700 ease-out pointer-events-none"
        style={{ transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)` }}
      />
      <div 
        className="absolute w-[500px] h-[500px] rounded-full bg-blue-100/30 blur-3xl bottom-10 -right-20 transition-transform duration-700 ease-out pointer-events-none"
        style={{ transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)` }}
      />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-purple-100/20 blur-3xl top-1/2 left-1/3 pointer-events-none" />

      {/* SECTION CONTAINER */}
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-10 space-y-12 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center md:text-left space-y-3 max-w-4xl">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span className="text-[14px] font-black tracking-[0.25em] text-[#FF4FA3] uppercase flex items-center gap-1">
              <Sparkles className="w-4 h-4 fill-pink-500 text-pink-500 animate-pulse" />
              CakeUrban Bespoke Studio
            </span>
          </div>
          <h1 className="text-[44px] md:text-[68px] font-black text-slate-900 tracking-tighter leading-[1.05]">
            Design Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 font-black">Dream Cake</span>
          </h1>
          <p className="text-slate-600 text-[18px] md:text-[20px] font-medium leading-relaxed max-w-2xl">
            Create a completely personalized masterwork for your special moments. Choose flavor, size, shape, velvet color, luxury toppings, and messages with our live simulator.
          </p>
        </div>

        {/* MAIN LAYOUT: Desktop Left 45% (Preview) & Right 55% (Glass Configurator) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* LEFT SIDE: 45% Live Cake Visualizer Preview */}
          <div className="lg:col-span-5 sticky top-24 space-y-6 w-full flex flex-col items-center">
            
            {/* The Floating Canvas (Nike/Tesla style) */}
            <div className="relative w-full aspect-square md:aspect-[4/5] rounded-[40px] bg-[#18191e]/90 border border-[#DFB15B]/30 shadow-[0_30px_90px_rgba(0,0,0,0.5)] flex flex-col justify-center items-center overflow-hidden p-6 text-white">
              
              {/* Internal abstract studio glow circle based on selected cream color */}
              <div 
                className="absolute w-72 h-72 rounded-full blur-3xl opacity-40 transition-colors duration-500"
                style={{ backgroundColor: activeColorObj.hex }}
              />

              {/* Floating Emojis / Toppings relative positions */}
              <div className="absolute inset-0 pointer-events-none z-20">
                <AnimatePresence>
                  {selectedDecors.map((decorId, index) => {
                    const decor = DECORATIONS.find(d => d.id === decorId);
                    if (!decor) return null;
                    
                    // Specific floating coordinates for each topping around the cake
                    const positions = [
                      { top: '15%', left: '20%', delay: 0 },
                      { top: '22%', right: '22%', delay: 0.3 },
                      { bottom: '25%', left: '15%', delay: 0.6 },
                      { bottom: '28%', right: '18%', delay: 0.9 },
                      { top: '45%', right: '12%', delay: 1.2 },
                      { top: '50%', left: '10%', delay: 1.5 },
                      { top: '10%', right: '45%', delay: 1.8 }
                    ];
                    
                    const pos = positions[index % positions.length];

                    return (
                      <motion.div
                        key={decorId}
                        initial={{ scale: 0, opacity: 0, y: 30 }}
                        animate={{ 
                          scale: 1, 
                          opacity: 1, 
                          y: [0, -12, 0],
                          rotate: [0, 8, -8, 0]
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                          y: { duration: 3 + index, repeat: Infinity, ease: 'easeInOut', delay: pos.delay },
                          rotate: { duration: 4 + index, repeat: Infinity, ease: 'easeInOut', delay: pos.delay },
                          scale: { type: 'spring', damping: 15 }
                        }}
                        className="absolute text-4xl select-none"
                        style={{ top: pos.top, left: pos.left, right: pos.right }}
                      >
                        {decor.emoji}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Ambient sprinkles falling very subtly if Sprinkles selected */}
                {selectedDecors.includes('Sprinkles') && (
                  <div className="absolute inset-x-0 top-10 h-1/2 opacity-60">
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          y: [0, 160, 0], 
                          x: [0, (i % 2 === 0 ? 15 : -15), 0],
                          opacity: [0, 1, 0] 
                        }}
                        transition={{ 
                          duration: 4 + (i % 3), 
                          repeat: Infinity, 
                          ease: 'linear', 
                          delay: i * 0.4 
                        }}
                        className="absolute w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: ['#FF60B5', '#60AFFF', '#FFD860', '#C660FF'][i % 4],
                          left: `${8 + i * 8}%`,
                          top: `${i * 2}px`
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* CORE CAKE LAYOUT VISUALIZER (High quality shaded SVG vector rendering) */}
              <div 
                className="relative w-full max-w-[280px] h-[280px] flex items-center justify-center transition-transform duration-500"
                style={{ transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 12}px) rotateX(${mousePos.y * -5}deg) rotateY(${mousePos.x * 5}deg)` }}
              >
                {/* 3D Soft Shadow underneath the base cake structure */}
                <div className="absolute bottom-2 w-[240px] h-6 bg-black/[0.08] rounded-full blur-lg" />

                {/* SVG render base */}
                <svg viewBox="0 0 300 300" className="w-full h-full z-10 overflow-visible">
                  <defs>
                    {/* Cream Color Gradient definition */}
                    <linearGradient id="creamGradTop" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={activeColorObj.hex} />
                      <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.5" />
                    </linearGradient>
                    
                    <linearGradient id="creamGradSide" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={activeColorObj.hex} />
                      <stop offset="100%" stopColor={activeColorObj.darkerHex} />
                    </linearGradient>

                    {/* Chocolate Drip Gradient (For choc flavor) */}
                    <linearGradient id="chocDrip" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#4E342E" />
                      <stop offset="100%" stopColor="#2D1510" />
                    </linearGradient>

                    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FCD34D" />
                      <stop offset="50%" stopColor="#FBBF24" />
                      <stop offset="100%" stopColor="#D97706" />
                    </linearGradient>
                  </defs>

                  {/* CAKE BASE GRAPHICS */}
                  {/* Round Cylinder rendering */}
                  {shape === 'Round' && (
                    <g>
                      {/* Side cylinder body */}
                      <path d="M 50,150 A 100,30 0 0,0 250,150 L 250,220 A 100,30 0 0,1 50,220 Z" fill="url(#creamGradSide)" />
                      {/* Top surface */}
                      <ellipse cx="150" cy="150" rx="100" ry="30" fill="url(#creamGradTop)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                      {/* Base stand ring */}
                      <ellipse cx="150" cy="221" rx="104" ry="31" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="3" />
                    </g>
                  )}

                  {/* Heart Shape 3D rendering */}
                  {shape === 'Heart' && (
                    <g>
                      {/* Heart Side Extrusion */}
                      <path d="M 150,135 C 100,85 40,115 50,165 C 55,190 100,215 150,235 C 200,215 245,190 250,165 C 260,115 200,85 150,135 Z" fill="url(#creamGradSide)" transform="translate(0, 20)" />
                      {/* Heart Top Plate */}
                      <path d="M 150,135 C 100,85 40,115 50,165 C 55,190 100,215 150,235 C 200,215 245,190 250,165 C 260,115 200,85 150,135 Z" fill="url(#creamGradTop)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                    </g>
                  )}

                  {/* Square Cube rendering */}
                  {shape === 'Square' && (
                    <g>
                      {/* Left face */}
                      <path d="M 50,150 L 150,190 L 150,250 L 50,210 Z" fill="url(#creamGradSide)" opacity="0.9" />
                      {/* Right face */}
                      <path d="M 150,190 L 250,150 L 250,210 L 150,250 Z" fill="url(#creamGradSide)" />
                      {/* Top rhombus */}
                      <path d="M 150,130 L 250,150 L 150,190 L 50,150 Z" fill="url(#creamGradTop)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                    </g>
                  )}

                  {/* Rectangle block */}
                  {shape === 'Rectangle' && (
                    <g>
                      <path d="M 30,160 L 150,200 L 150,250 L 30,210 Z" fill="url(#creamGradSide)" opacity="0.95" />
                      <path d="M 150,200 L 270,150 L 270,200 L 150,250 Z" fill="url(#creamGradSide)" />
                      <path d="M 150,135 L 270,150 L 150,200 L 30,160 Z" fill="url(#creamGradTop)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                    </g>
                  )}

                  {/* Tall (Single but high aspect cylinder) */}
                  {shape === 'Tall' && (
                    <g>
                      {/* High cylinder side */}
                      <path d="M 60,110 A 90,26 0 0,0 240,110 L 240,230 A 90,26 0 0,1 60,230 Z" fill="url(#creamGradSide)" />
                      {/* Cream Top */}
                      <ellipse cx="150" cy="110" rx="90" ry="26" fill="url(#creamGradTop)" stroke="rgba(255,255,255,0.4)" />
                      
                      {/* Custom drip effects for tall luxury look */}
                      <path d="M 60,110 Q 70,135 80,115 Q 90,145 100,112 Q 120,155 130,115 Q 160,160 170,115 Q 210,140 220,112" fill="none" stroke="url(#chocDrip)" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
                    </g>
                  )}

                  {/* 2 Tier Stacked Cylinders */}
                  {shape === '2 Tier' && (
                    <g>
                      {/* Bottom Tier Side */}
                      <path d="M 50,175 A 100,28 0 0,0 250,175 L 250,240 A 100,28 0 0,1 50,240 Z" fill="url(#creamGradSide)" />
                      {/* Bottom Tier Top */}
                      <ellipse cx="150" cy="175" rx="100" ry="28" fill="url(#creamGradTop)" />
                      
                      {/* Top Tier Side */}
                      <path d="M 80,125 A 70,20 0 0,0 220,125 L 220,175 A 70,20 0 0,1 80,175 Z" fill="url(#creamGradSide)" />
                      {/* Top Tier Top */}
                      <ellipse cx="150" cy="125" rx="70" ry="20" fill="url(#creamGradTop)" stroke="rgba(255,255,255,0.5)" />
                    </g>
                  )}

                  {/* 3 Tier stacked cylinders */}
                  {shape === '3 Tier' && (
                    <g>
                      {/* Bottom Tier */}
                      <path d="M 50,200 A 100,26 0 0,0 250,200 L 250,250 A 100,26 0 0,1 50,250 Z" fill="url(#creamGradSide)" />
                      <ellipse cx="150" cy="200" rx="100" ry="26" fill="url(#creamGradTop)" />
                      
                      {/* Middle Tier */}
                      <path d="M 75,150 A 75,20 0 0,0 225,150 L 225,200 A 75,20 0 0,1 75,200 Z" fill="url(#creamGradSide)" />
                      <ellipse cx="150" cy="150" rx="75" ry="20" fill="url(#creamGradTop)" />

                      {/* Top Tier */}
                      <path d="M 100,105 A 50,14 0 0,0 200,105 L 200,150 A 50,14 0 0,1 100,150 Z" fill="url(#creamGradSide)" />
                      <ellipse cx="150" cy="105" rx="50" ry="14" fill="url(#creamGradTop)" stroke="rgba(255,255,255,0.5)" />
                    </g>
                  )}

                  {/* FLAVOR VISUAL ACCENTS (Fudge glaze / chocolate shavings / crumbs) */}
                  {flavor === 'Belgian Chocolate' && (
                    <g transform="translate(0, -5)">
                      {/* Chocolate ganache swirl on top */}
                      <ellipse cx="150" cy={shape === 'Tall' ? 110 : shape === '3 Tier' ? 105 : shape === '2 Tier' ? 125 : 150} rx={shape === '3 Tier' ? 35 : shape === '2 Tier' ? 50 : 75} ry={shape === '3 Tier' ? 10 : shape === '2 Tier' ? 15 : 22} fill="none" stroke="url(#chocDrip)" strokeWidth="6" opacity="0.9" />
                      {/* Chocolate flakes */}
                      <circle cx="130" cy={shape === 'Round' ? 145 : 140} r="4" fill="#3E2723" />
                      <circle cx="170" cy={shape === 'Round' ? 152 : 142} r="5" fill="#5D4037" />
                      <circle cx="150" cy={shape === 'Round' ? 138 : 132} r="3" fill="#27120F" />
                    </g>
                  )}

                  {flavor === 'Red Velvet' && (
                    <g transform="translate(0, -2)">
                      {/* Red crumbs dust */}
                      <circle cx="120" cy={shape === 'Round' ? 148 : 142} r="2.5" fill="#900C3F" />
                      <circle cx="140" cy={shape === 'Round' ? 155 : 145} r="3" fill="#C70039" />
                      <circle cx="180" cy={shape === 'Round' ? 142 : 138} r="2.5" fill="#900C3F" />
                      <circle cx="160" cy={shape === 'Round' ? 150 : 144} r="3.5" fill="#FF5733" />
                    </g>
                  )}

                  {flavor === 'Mango' && (
                    <ellipse cx="150" cy={shape === 'Tall' ? 110 : shape === '3 Tier' ? 105 : shape === '2 Tier' ? 125 : 150} rx={shape === '3 Tier' ? 40 : shape === '2 Tier' ? 55 : 80} ry={shape === '3 Tier' ? 12 : shape === '2 Tier' ? 16 : 24} fill="none" stroke="#FBBF24" strokeWidth="4" opacity="0.7" />
                  )}

                  {/* MEMORY WAFER SCREEN (Step 7 Edible Photo representation) */}
                  {uploadedPhoto && (
                    <g transform="translate(115, 175) scale(0.45)" className="cursor-pointer">
                      {/* Small printed wafer border */}
                      <rect x="0" y="0" width="160" height="110" rx="12" fill="white" stroke="rgba(0,0,0,0.1)" strokeWidth="4" />
                      {/* Image Clip path */}
                      <clipPath id="waferClip">
                        <rect x="6" y="6" width="148" height="98" rx="8" />
                      </clipPath>
                      {/* edbile image wafer preview */}
                      <image href={uploadedPhoto} x="6" y="6" width="148" height="98" clipPath="url(#waferClip)" preserveAspectRatio="xMidYMid slice" />
                      {/* edible sugar seal tag */}
                      <circle cx="144" cy="16" r="12" fill="url(#goldGrad)" />
                      <text x="144" y="20" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">★</text>
                    </g>
                  )}

                  {/* WRITTEN CUSTOM INSCRIPTION ON THE CAKE */}
                  {customMessage && (
                    <g transform={`translate(150, ${shape === 'Tall' ? 110 : shape === '3 Tier' ? 105 : shape === '2 Tier' ? 125 : 150}) rotate(-8)`}>
                      <text
                        x="0"
                        y="0"
                        textAnchor="middle"
                        className="font-serif italic font-extrabold text-[15px] select-none tracking-tight fill-[#8C062F] drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]"
                        style={{ fontFamily: 'Cinzel, Georgia, serif' }}
                      >
                        {customMessage.length > 20 ? `${customMessage.slice(0, 18)}...` : customMessage}
                      </text>
                    </g>
                  )}
                </svg>
              </div>

              {/* Status Info Badge */}
              <div className="absolute bottom-5 bg-slate-900/90 text-white border border-white/10 shadow-lg px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 z-30">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Real-Time Simulator
              </div>
            </div>

            {/* Quick configuration review pill */}
            <div className="w-full flex justify-between bg-[#18191e]/80 backdrop-blur-md border border-[#DFB15B]/30 p-4 rounded-3xl shadow-sm text-[12px] text-slate-300 font-bold">
              <span className="flex items-center gap-1">🍰 {shape}</span>
              <span className="flex items-center gap-1">⚖️ {size}</span>
              <span className="flex items-center gap-1">🍓 {flavor.slice(0,10)}..</span>
              <span className="flex items-center gap-1">🎨 {creamColor}</span>
            </div>
          </div>

          {/* RIGHT SIDE: 55% Glass Configurator Card */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            
            {/* LARGE CONFIGURATOR CONTAINER */}
            <div className="bg-[#18191e]/90 backdrop-blur-xl border border-[#DFB15B]/30 shadow-[0_30px_90px_rgba(0,0,0,0.5)] rounded-[32px] p-6 md:p-10 flex flex-col justify-between min-h-[600px] relative text-white">
              
              {/* HEADER STEP INDICATOR & PROGRESS BAR */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[12px] font-extrabold uppercase tracking-widest text-slate-400">
                  <span>Configuration step {STEPS[currentStep].number} of 8</span>
                  <span className="text-[#FF4FA3] font-black">{Math.round((STEPS[currentStep].number / 8) * 100)}% COMPLETED</span>
                </div>
                
                {/* Advanced Gradient Animated Progress Bar */}
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative">
                  <motion.div 
                    initial={{ width: '0%' }}
                    animate={{ width: `${(STEPS[currentStep].number / 8) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 140, damping: 20 }}
                    className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 rounded-full"
                  />
                </div>

                {/* Current step title */}
                <div className="pt-2 text-left">
                  <h3 className="text-[28px] font-black text-slate-800 leading-tight">
                    {STEPS[currentStep].title}
                  </h3>
                  <p className="text-sm font-semibold text-slate-500">
                    {STEPS[currentStep].desc}
                  </p>
                </div>
              </div>

              {/* DYNAMIC CONTENT PER STEP */}
              <div className="flex-1 py-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="h-full"
                  >
                    
                    {/* STEP 1: OCCASION */}
                    {currentStep === 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        {OCCASIONS.map((occ) => (
                          <button
                            key={occ.id}
                            onClick={() => { playBtnTap(); setOccasion(occ.id); }}
                            className={`p-4 rounded-2xl border text-left transition-all duration-300 relative group flex flex-col justify-between h-[120px] ${
                              occasion === occ.id 
                                ? 'bg-gradient-to-tr ' + occ.color + ' border-pink-500 shadow-lg ring-2 ring-pink-500/10' 
                                : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-xl font-bold">{occ.label}</span>
                            <span className="text-[11px] text-slate-500 leading-normal font-medium mt-1">
                              {occ.desc}
                            </span>
                            {occasion === occ.id && (
                              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center">
                                <Check className="w-3 h-3 stroke-[3px]" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* STEP 2: SHAPE */}
                    {currentStep === 1 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {SHAPES.map((sh) => (
                          <button
                            key={sh.id}
                            onClick={() => { playBtnTap(); setShape(sh.id); }}
                            className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-[110px] ${
                              shape === sh.id 
                                ? 'bg-pink-50/50 border-pink-500 shadow-lg ring-2 ring-pink-500/10' 
                                : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex justify-between items-center w-full">
                              <span className="text-lg font-black text-slate-800">{sh.label}</span>
                              <span className="text-2xl">{sh.icon}</span>
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold leading-normal mt-0.5">{sh.desc}</p>
                              <p className="text-[11px] font-black text-pink-600 mt-1">
                                {sh.addPrice === 0 ? 'Classic Cost' : `+ ₹${sh.addPrice}`}
                              </p>
                            </div>
                            {shape === sh.id && (
                              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center">
                                <Check className="w-3 h-3 stroke-[3px]" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* STEP 3: SIZE (KG) */}
                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                          {SIZES.map((sz) => (
                            <button
                              key={sz.id}
                              onClick={() => { playBtnTap(); setSize(sz.id); }}
                              className={`py-4 rounded-2xl border text-center font-black text-sm transition-all flex flex-col justify-center items-center h-[90px] ${
                                size === sz.id 
                                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-transparent shadow-lg scale-105' 
                                  : 'bg-slate-50/50 border-slate-100 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span className="text-[15px] font-black">{sz.label}</span>
                              <span className={`text-[9px] font-bold mt-1 ${size === sz.id ? 'text-pink-100' : 'text-slate-400'}`}>
                                {sz.addPrice === 0 ? 'Standard' : `+₹${sz.addPrice}`}
                              </span>
                            </button>
                          ))}
                        </div>

                        {/* Dietary Choice (Normal Vegetarian vs Eggless toggle) */}
                        <div className="bg-emerald-50/60 p-4 rounded-3xl border border-emerald-100 flex items-center justify-between">
                          <div className="text-left">
                            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest block">Dietary Safety</span>
                            <h4 className="text-slate-800 font-bold text-sm mt-0.5">Prepare with 100% Chef Eggless bind?</h4>
                            <p className="text-xs text-slate-500">Pure organic egg-free baking is prepared in dedicated non-egg lines.</p>
                          </div>
                          <button
                            onClick={() => { playBtnTap(); setIsNormalEgg(!isNormalEgg); }}
                            className={`w-14 h-8 rounded-full p-1 transition-all duration-300 relative ${!isNormalEgg ? 'bg-emerald-600' : 'bg-slate-200'}`}
                          >
                            <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${!isNormalEgg ? 'translate-x-6' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 4: FLAVOR */}
                    {currentStep === 3 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-2 custom-scrollbar">
                        {FLAVORS.map((flav) => (
                          <button
                            key={flav.id}
                            onClick={() => { playBtnTap(); setFlavor(flav.id); }}
                            className={`p-4 rounded-2xl border text-left transition-all relative flex items-center gap-4 ${
                              flavor === flav.id 
                                ? 'bg-pink-50/50 border-pink-500 shadow-md ring-2 ring-pink-500/10' 
                                : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex-1 text-left">
                              <span className="text-[15px] font-black text-slate-800 block">{flav.label}</span>
                              <span className="text-[11px] text-slate-400 font-medium block mt-0.5 leading-normal">{flav.desc}</span>
                              <span className="text-[11px] font-black text-pink-600 block mt-1">
                                {flav.addPrice === 0 ? 'Included Base Cost' : `+ ₹${flav.addPrice}`}
                              </span>
                            </div>
                            {flavor === flav.id && (
                              <div className="w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 stroke-[3px]" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* STEP 5: CREAM COLORS */}
                    {currentStep === 4 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {CREAM_COLORS.map((col) => (
                          <button
                            key={col.id}
                            onClick={() => { playBtnTap(); setCreamColor(col.id); }}
                            className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-[110px] ${
                              creamColor === col.id 
                                ? 'bg-slate-50 border-pink-500 shadow-lg' 
                                : 'bg-slate-50/30 border-slate-100 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex justify-between items-center w-full">
                              {/* Color Orb Preview with specular gradient gloss */}
                              <div 
                                className="w-8 h-8 rounded-full shadow-inner border border-black/10 relative overflow-hidden"
                                style={{ backgroundColor: col.hex }}
                              >
                                <div className="absolute top-0.5 left-1 w-3 h-1.5 bg-white/40 rounded-full blur-[0.5px]" />
                              </div>
                              {creamColor === col.id && (
                                <div className="w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center">
                                  <Check className="w-3 h-3 stroke-[3px]" />
                                </div>
                              )}
                            </div>
                            <div>
                              <span className="text-[13px] font-black text-slate-800 block">{col.name}</span>
                              <span className="text-[10px] text-slate-400 font-bold leading-none">{col.desc}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* STEP 6: BESPOKE DECORATIONS */}
                    {currentStep === 5 && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-[12px] font-black text-slate-400 uppercase tracking-widest px-1">
                          <span>Select Multiple Toppings</span>
                          <span>₹100 Per Topping Selection</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[290px] overflow-y-auto pr-2 custom-scrollbar">
                          {DECORATIONS.map((dec) => {
                            const isSelected = selectedDecors.includes(dec.id);
                            return (
                              <button
                                key={dec.id}
                                onClick={() => toggleDecor(dec.id)}
                                className={`p-3.5 rounded-2xl border text-left transition-all relative flex items-center justify-between ${
                                  isSelected 
                                    ? 'bg-pink-50/40 border-pink-500 shadow-md' 
                                    : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50'
                                }`}
                              >
                                <div className="flex items-center gap-3 text-left">
                                  <span className="text-2xl">{dec.emoji}</span>
                                  <div>
                                    <span className="text-sm font-black text-slate-800 block">{dec.label}</span>
                                    <span className="text-[10px] text-slate-400 font-bold leading-normal">{dec.desc}</span>
                                  </div>
                                </div>
                                <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                                  isSelected ? 'bg-pink-500 border-pink-500 text-white' : 'border-slate-200 bg-white'
                                }`}>
                                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[4px]" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* STEP 7: PHOTO WAFER ART */}
                    {currentStep === 6 && (
                      <div className="space-y-6 text-left">
                        {/* Drag & Drop Area */}
                        <div 
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-200 hover:border-pink-500/60 rounded-3xl p-8 text-center bg-slate-50/50 hover:bg-pink-50/10 transition-all cursor-pointer relative overflow-hidden group flex flex-col items-center justify-center min-h-[160px]"
                        >
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handlePhotoUpload} 
                            accept="image/*" 
                            className="hidden" 
                          />
                          <Upload className="w-10 h-10 text-slate-400 group-hover:text-pink-500 group-hover:scale-110 transition-all mb-3" />
                          <span className="text-sm font-black text-slate-700">Drag & Drop Memorial Portrait</span>
                          <p className="text-xs text-slate-400 mt-1">Supports PNG, JPG, WEBP (Max 3MB for high res sugar print)</p>
                        </div>

                        {/* Presets and uploaded view side-by-side */}
                        {uploadedPhoto ? (
                          <div className="bg-pink-50/40 border border-pink-100 p-4 rounded-3xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <img 
                                src={uploadedPhoto} 
                                alt="Custom printed wafer preview" 
                                className="w-16 h-16 object-cover rounded-xl border border-pink-200" 
                              />
                              <div>
                                <span className="text-xs font-black text-pink-600 uppercase tracking-widest block">Active printed photo</span>
                                <span className="text-sm font-bold text-slate-800">Your custom image sugar wafer</span>
                              </div>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); setUploadedPhoto(null); }}
                              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Or Pick Edible Art Template (+₹250)</h4>
                            <div className="grid grid-cols-3 gap-2">
                              {EDIBLE_TEMPLATES.map((tmpl) => (
                                <button
                                  key={tmpl.id}
                                  onClick={() => { playBtnTap(); setUploadedPhoto(tmpl.url); }}
                                  className="rounded-2xl border border-slate-100 bg-slate-50/50 overflow-hidden text-left p-2 hover:border-pink-300 transition-all"
                                >
                                  <img src={tmpl.url} alt={tmpl.label} className="w-full h-16 object-cover rounded-xl mb-2" />
                                  <span className="text-[10px] font-black text-slate-700 block text-center truncate">{tmpl.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* STEP 8: SCRIPT INSCRIPTION */}
                    {currentStep === 7 && (
                      <div className="space-y-6 text-left">
                        <div className="space-y-2">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">
                            Cake surface inscription
                          </label>
                          <input 
                            type="text"
                            placeholder="Write inscription (e.g., Happy Birthday Aarav! ❤️)"
                            maxLength={35}
                            value={customMessage}
                            onChange={(e) => setCustomMessage(e.target.value)}
                            className="w-full h-16 px-6 rounded-2xl bg-slate-50 border border-slate-200 text-lg font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all duration-300"
                          />
                        </div>

                        {/* Interactive prompt message review */}
                        {customMessage ? (
                          <div className="bg-pink-50/50 p-4 rounded-3xl border border-pink-100 flex items-center gap-3">
                            <span className="text-3xl">🖋️</span>
                            <div className="text-left">
                              <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest block">Simulation review</span>
                              <p className="text-sm font-extrabold italic text-pink-900 font-serif">"{customMessage}"</p>
                              <p className="text-xs text-slate-400 leading-normal mt-0.5">This text is piped live onto the cake top face in gourmet raspberry jam piping.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 rounded-3xl border border-slate-100 bg-slate-50/50 text-slate-400 flex items-center gap-3">
                            <span className="text-3xl">⌨️</span>
                            <span className="text-xs font-semibold leading-relaxed">
                              Add a lovely text above to witness it dynamically overlay onto the cake top plate in handwriting script!
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                  </motion.div>
                </AnimatePresence>
              </div>

              {/* STICKY BOTTOM CARD PANEL CONTROLS AND PRICE CALCULATION */}
              <div className="pt-6 border-t border-slate-100 flex flex-col space-y-6">
                
                {/* Micro calculations expand panel */}
                <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-50/70 p-4 rounded-3xl border border-slate-100/50">
                  <div className="flex items-center gap-1.5 text-slate-600 text-xs font-bold">
                    <Truck className="w-4 h-4 text-pink-500 shrink-0" />
                    <span>2-Hour Faridabad Express Delivery</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 text-xs font-bold">
                    <Shield className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>Pure Organic Quality Assured</span>
                  </div>
                </div>

                {/* Subtotals & Main Total Area */}
                <div className="flex justify-between items-center">
                  <div className="text-left space-y-0.5">
                    <span className="text-xs font-semibold text-slate-400 block uppercase tracking-widest leading-none">Artisan Investment</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-[#FF4FA3] tracking-tighter">
                        ₹{finalPrice}
                      </span>
                      <span className="text-xs font-bold text-slate-400 line-through">
                        ₹{Math.round(finalPrice * 1.12)}
                      </span>
                      <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full border border-emerald-100 uppercase tracking-widest leading-none">
                        Intro 10% Off
                      </span>
                    </div>
                  </div>

                  {/* STEP ACTION CONTROLLERS */}
                  <div className="flex gap-2">
                    {currentStep > 0 && (
                      <button
                        onClick={() => { playSlidePop(); setCurrentStep(prev => prev - 1); }}
                        className="w-12 h-12 rounded-full border border-slate-200 hover:border-pink-500 text-slate-400 hover:text-pink-500 bg-white flex items-center justify-center transition-all shadow-sm"
                      >
                        <ChevronLeft className="w-5 h-5 stroke-[2.5px]" />
                      </button>
                    )}
                    
                    {currentStep < 7 ? (
                      <button
                        onClick={() => { playSlidePop(); setCurrentStep(prev => prev + 1); }}
                        className="h-12 px-6 rounded-full bg-slate-900 hover:bg-pink-600 text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-md active:scale-95"
                      >
                        Next step
                        <ChevronRight className="w-4.5 h-4.5 stroke-[2.5px]" />
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        {/* Buy Now / Order directly */}
                        <button
                          onClick={handleOrderNow}
                          className="h-12 px-5 rounded-full bg-white border-2 border-slate-900 text-slate-800 font-extrabold text-[11px] uppercase tracking-widest hover:border-pink-500 hover:text-pink-500 transition-all"
                        >
                          Order Now
                        </button>
                        
                        {/* Primary Add To Basket */}
                        <button
                          onClick={handleAddToCart}
                          className="h-12 px-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-pink-500/20 hover:scale-[1.03] active:scale-95 transition-all duration-200"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>

            {/* Quick customization helper tips */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white/40 p-4 rounded-3xl border border-white text-[11px] font-bold text-slate-500">
              <span className="flex items-center gap-1">✨ Belgian imports & hand-molded frosting</span>
              <span className="flex items-center gap-1">⏰ Real-time baker assignment in 2 hours</span>
              <span className="flex items-center gap-1">🔒 Full security billing</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
