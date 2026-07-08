import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  Heart, 
  Instagram, 
  Sparkles, 
  ArrowRight,
  Clock,
  Leaf,
  ShieldCheck,
  Lock,
  Phone,
  Mail,
  Truck,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { playSuccessChime, playBtnTap } from '../lib/sound';
import { useNavigate } from 'react-router-dom';

import instagramImage1 from '../assets/images/regenerated_image_1783517220364.png';
import instagramImage2 from '../assets/images/regenerated_image_1783517209820.png';
import instagramImage3 from '../assets/images/regenerated_image_1783517212420.png';
import instagramImage4 from '../assets/images/regenerated_image_1783517215080.png';
import instagramImage5 from '../assets/images/regenerated_image_1783517217853.png';

import heroImage from '../assets/images/regenerated_image_1783519200304.png';
import heroBgImage from '../assets/images/regenerated_image_1783519203025.png';
import flavorStrawberry from '../assets/images/regenerated_image_1783519206969.png';
import flavorPistachio from '../assets/images/regenerated_image_1783519209426.png';
import flavorMango from '../assets/images/regenerated_image_1783519211943.png';
import flavorBlueberry from '../assets/images/regenerated_image_1783519214755.png';
import flavorBlackForest from '../assets/images/regenerated_image_1783519217409.png';
import midnightImage from '../assets/images/regenerated_image_1783520153768.png';

// ---------------------------------------------------------
// FLOATING DECORATIONS WITH PARALLAX MOUSE EFFECT
// ---------------------------------------------------------
function InteractiveFloatingBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const elements = [
    { id: 1, type: 'heart', color: 'text-rose-400/20', size: 20, top: '15%', left: '10%', delay: 0, factor: 0.6 },
    { id: 2, type: 'sparkle', color: 'text-amber-400/25', size: 16, top: '25%', left: '80%', delay: 1, factor: -0.5 },
    { id: 3, type: 'sparkle', color: 'text-pink-400/20', size: 18, top: '60%', left: '12%', delay: 0.5, factor: 0.7 },
    { id: 4, type: 'heart', color: 'text-purple-400/15', size: 22, top: '75%', left: '85%', delay: 1.5, factor: -0.8 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className={`absolute ${el.color}`}
          style={{
            top: el.top,
            left: el.left,
            fontSize: `${el.size}px`,
            transform: `translate(${mousePos.x * el.factor}px, ${mousePos.y * el.factor}px)`,
          }}
          animate={{
            y: [0, 10, 0],
            rotate: [0, 8, -8, 0],
          }}
          transition={{
            duration: 5 + el.id,
            repeat: Infinity,
            ease: "easeInOut",
            delay: el.delay,
          }}
        >
          {el.type === 'heart' ? (
            <Heart className="fill-current w-5 h-5 opacity-30" />
          ) : (
            <Sparkles className="fill-current w-5 h-5 opacity-30" />
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [emailInput, setEmailInput] = useState('');
  const [screenHearts, setScreenHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleJoinClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      toast.error('Gourmet error: Please provide a valid email address');
      return;
    }
    playSuccessChime();
    toast.success('Welcome to the CakeUrban Elite Club! 💫', {
      description: 'You will receive premium secret chef recipes & priority milestone invitations.'
    });
    setEmailInput('');
  };

  return (
    <div className="relative min-h-screen bg-[#FFF9FC] overflow-hidden font-sans">
      
      {/* Background Interactive Elements */}
      <InteractiveFloatingBackground />

      {/* Floating Interactive Hearts Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <AnimatePresence>
          {screenHearts.map((h) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 1, scale: 0.5, x: h.x - 20, y: h.y - 20 }}
              animate={{ opacity: 0, scale: 2, y: h.y - 120, x: h.x + (Math.random() * 60 - 30) }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute text-rose-500 drop-shadow-lg"
            >
              <Heart className="w-10 h-10 fill-rose-500 text-rose-500" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ---------------------------------------------------------
          SECTION 1: HERO BANNER (Every Cake Tells a Sweet Story)
          --------------------------------------------------------- */}
      <section className="relative z-10 pt-4 pb-6 px-4 md:px-8 max-w-[1280px] mx-auto select-none">
        <div className="rounded-[40px] overflow-hidden relative bg-white border border-pink-50/50 p-6 md:p-10 lg:p-14 xl:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 shadow-[0_15px_45px_rgba(255,79,163,0.03)]">
          {/* Confetti & Sprinkle circles in background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
            <div className="absolute top-[15%] left-[25%] w-4 h-4 rounded-full bg-yellow-300 animate-bounce" />
            <div className="absolute top-[65%] left-[10%] w-3 h-3 rounded-full bg-blue-300 animate-pulse" />
            <div className="absolute top-[35%] left-[85%] w-5 h-5 rounded-full bg-pink-100/60" />
            <div className="absolute top-[75%] left-[65%] w-3.5 h-3.5 rounded-full bg-purple-200" />
            <div className="absolute top-[10%] left-[80%] w-6 h-6 rounded-full bg-yellow-100/50" />
          </div>

          {/* Left Side Content */}
          <div className="w-full lg:w-[50%] space-y-6 text-left relative z-10">
            {/* Eggless Badge tag */}
            <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase shadow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>100% Eggless</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 leading-[1.1] tracking-tight">
              Every Cake <br />
              Tells a <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Sweet</span> <br />
              <span className="font-display italic text-pink-500 font-normal tracking-wide">Story</span>
            </h1>

            <p className="text-sm md:text-base text-slate-500 font-semibold max-w-[440px] leading-relaxed">
              Handcrafted with love, baked with perfection.
            </p>

            <div className="pt-2 flex flex-row items-center gap-3">
              <button 
                onClick={() => { playBtnTap(); navigate('/shop'); }}
                className="h-13 px-8 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-black text-xs uppercase tracking-wider shadow-[0_10px_25px_rgba(236,72,153,0.3)] hover:scale-103 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                Order Now
              </button>
              <button 
                onClick={() => { playBtnTap(); navigate('/shop'); }}
                className="h-13 px-8 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-pink-600 hover:border-pink-300 font-black text-xs uppercase tracking-wider hover:scale-103 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                Explore Cakes
              </button>
            </div>
          </div>

          {/* Right Side Visuals (Gorgeous Pedestal Base Cake) */}
          <div className="w-full lg:w-[45%] relative flex justify-center z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative w-full max-w-[380px] aspect-square flex items-center justify-center rounded-full bg-gradient-to-tr from-pink-100/50 to-purple-100/30 p-4 shadow-[0_15px_40px_rgba(0,0,0,0.03)]"
            >
              {/* Pedestal Stand behind the cake */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400')] bg-cover bg-center rounded-full mix-blend-multiply opacity-20" />
              
              <img 
                src={heroImage} 
                alt="Perfect Celebration Cake" 
                className="w-[90%] h-[90%] object-contain relative z-10 hover:scale-105 transition-transform duration-500 drop-shadow-[0_25px_40px_rgba(0,0,0,0.12)]"
              />

              {/* Dotted rotate "Custom Cakes Available" badge */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -right-4 bottom-10 w-24 h-24 rounded-full bg-white border-2 border-dashed border-pink-200 shadow-lg flex items-center justify-center p-1.5 z-20"
              >
                <div className="text-center">
                  <p className="text-[8px] font-black uppercase text-pink-500 tracking-wider leading-none">Custom</p>
                  <p className="text-[8px] font-black uppercase text-slate-700 tracking-wider leading-none mt-0.5">Cakes</p>
                  <p className="text-[7px] font-bold text-slate-400 uppercase mt-1 leading-none">Available</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------
          SECTION 2: HORIZONTAL FEATURE CAPSULES (Mockup Styling)
          --------------------------------------------------------- */}
      <section className="relative z-20 max-w-[1280px] mx-auto px-4 md:px-8 mb-8 select-none">
        <div className="bg-white border border-slate-50 rounded-[28px] py-4 px-6 md:px-8 shadow-[0_10px_35px_rgba(0,0,0,0.03)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            
            <div className="flex items-center gap-4 py-2 md:py-0 md:px-4 justify-start">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500 shrink-0 shadow-sm">
                <Truck className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="text-left">
                <h4 className="text-[13px] font-black text-slate-800 leading-tight">Same Day Delivery</h4>
                <p className="text-[10.5px] text-slate-400 font-bold mt-0.5">On time, every time</p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-3 md:py-0 md:px-6 justify-start">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0 shadow-sm">
                <Clock className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="text-left">
                <h4 className="text-[13px] font-black text-slate-800 leading-tight">Midnight Delivery</h4>
                <p className="text-[10.5px] text-slate-400 font-bold mt-0.5">Because surprises matter</p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-2 md:py-0 md:px-6 justify-start">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0 shadow-sm">
                <Sparkles className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="text-left">
                <h4 className="text-[13px] font-black text-slate-800 leading-tight">Fresh & Premium</h4>
                <p className="text-[10.5px] text-slate-400 font-bold mt-0.5">Only the finest ingredients</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------
          SECTION 2.5: SHOP BY CATEGORIES (Mockup High-Fidelity)
          --------------------------------------------------------- */}
      <section className="relative z-10 py-10 px-4 md:px-8 max-w-[1280px] mx-auto select-none">
        <div className="flex flex-col items-start mb-8 text-left">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
              Shop by Categories
            </h2>
            <span className="text-[#FF4FA3] text-xl font-bold">〰</span>
          </div>
        </div>

        {/* Scrollable list on mobile, clean grid on desktop */}
        <div className="flex overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-6 gap-5 no-scrollbar snap-x scroll-smooth">
          {[
            { 
              name: "Birthday Cakes", 
              desc: "Celebrate life's milestones",
              img: "https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=200&h=200&fit=crop", 
              bg: "bg-[#FFF0F5]", 
              border: "border-pink-100",
              route: "/birthday-cakes" 
            },
            { 
              name: "Anniversary Cakes", 
              desc: "Baked with romance",
              img: "https://images.unsplash.com/photo-1513135065346-a098a63a71ee?w=200&h=200&fit=crop", 
              bg: "bg-[#FFEBEB]", 
              border: "border-red-100",
              route: "/anniversary-cakes" 
            },
            { 
              name: "Photo Cakes", 
              desc: "Print your memories",
              img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop", 
              bg: "bg-[#E6F8FA]", 
              border: "border-cyan-100",
              route: "/shop?category=photo" 
            },
            { 
              name: "Custom Cakes", 
              desc: "Unleash your mind",
              img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop", 
              bg: "bg-[#FFF9E6]", 
              border: "border-yellow-100",
              route: "/custom-order" 
            },
            { 
              name: "Dessert Boxes", 
              desc: "Curated treat boxes",
              img: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?w=200&h=200&fit=crop", 
              bg: "bg-[#FFF0E6]", 
              border: "border-orange-100",
              route: "/desserts" 
            },
            { 
              name: "Cupcakes", 
              desc: "Tiny frosted delights",
              img: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=200&h=200&fit=crop", 
              bg: "bg-[#EBF3FF]", 
              border: "border-blue-100",
              route: "/cupcakes" 
            }
          ].map((cat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => { playBtnTap(); navigate(cat.route); }}
              className={`snap-center shrink-0 min-w-[150px] w-[160px] md:w-auto ${cat.bg} border ${cat.border} rounded-[24px] p-4 flex flex-col items-center justify-between cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 text-center relative overflow-hidden group`}
            >
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-sm mb-3">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-xs font-black text-slate-800 leading-tight uppercase tracking-wider mb-1.5">{cat.name}</h3>
              <p className="text-[10px] text-slate-500 font-bold hidden md:block">{cat.desc}</p>
              
              <div className="mt-3 w-7 h-7 rounded-full bg-white flex items-center justify-center text-pink-500 shadow-sm border border-slate-50 group-hover:bg-pink-500 group-hover:text-white transition-all">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------
          SECTION 2.6: BEST SELLERS (Mockup High-Fidelity)
          --------------------------------------------------------- */}
      <section className="relative z-10 py-10 px-4 md:px-8 max-w-[1280px] mx-auto select-none">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
              Best Sellers
            </h2>
            <span className="text-[#FF4FA3] text-xl font-bold">〰</span>
          </div>
          <button 
            onClick={() => { playBtnTap(); navigate('/shop'); }}
            className="text-pink-500 hover:text-pink-600 font-extrabold text-[14px] uppercase tracking-wider transition-colors border border-pink-100 hover:border-pink-300 px-5 py-2 rounded-full bg-white/50 backdrop-blur-sm"
          >
            View All
          </button>
        </div>

        {/* Scrollable list on mobile, clean grid on desktop */}
        <div className="flex overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-5 gap-6 no-scrollbar snap-x scroll-smooth">
          {[
            { 
              id: "bestseller-1", 
              name: "Chocolate Truffle", 
              price: 699, 
              rating: 4.9,
              img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop", 
              tag: "Bestseller",
              bg: "bg-amber-50/40"
            },
            { 
              id: "bestseller-2", 
              name: "Red Velvet Bliss", 
              price: 699, 
              rating: 4.9,
              img: "https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=400&h=400&fit=crop", 
              tag: "Bestseller",
              bg: "bg-red-50/40"
            },
            { 
              id: "bestseller-3", 
              name: "Butterscotch Crunch", 
              price: 699, 
              rating: 4.8,
              img: "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?w=400&h=400&fit=crop", 
              tag: "Bestseller",
              bg: "bg-yellow-50/40"
            },
            { 
              id: "bestseller-4", 
              name: "Blueberry Cheesecake", 
              price: 749, 
              rating: 4.9,
              img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=400&fit=crop", 
              tag: "Premium Choice",
              bg: "bg-blue-50/40"
            },
            { 
              id: "bestseller-5", 
              name: "Ferrero Rocher", 
              price: 799, 
              rating: 4.9,
              img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop", 
              tag: "Chef Signature",
              bg: "bg-amber-100/20"
            }
          ].map((prod) => (
            <motion.div
              key={prod.id}
              whileHover={{ y: -8 }}
              className={`snap-center shrink-0 min-w-[200px] w-[220px] md:w-auto ${prod.bg} border border-slate-100 rounded-[28px] overflow-hidden p-3 shadow-sm hover:shadow-lg transition-all duration-300 text-left flex flex-col justify-between`}
            >
              <div>
                <div className="relative aspect-square rounded-[22px] overflow-hidden mb-3.5 bg-slate-100">
                  {prod.tag && (
                    <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold text-[9px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md z-10">
                      {prod.tag}
                    </span>
                  )}
                  <img src={prod.img} alt={prod.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>

                <div className="px-1.5">
                  <div className="flex items-center gap-1 text-amber-500 text-[11px] font-black mb-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{prod.rating}</span>
                  </div>
                  <h3 className="font-black text-xs text-slate-800 uppercase tracking-wide line-clamp-1">{prod.name}</h3>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3.5 px-1.5 mt-2 border-t border-slate-50/85">
                <span className="font-black text-sm text-slate-900">₹{prod.price}</span>
                <button 
                  onClick={() => { playBtnTap(); navigate(`/product/1`); }}
                  className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-white transition-all shadow-sm active:scale-90"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------
          SECTION 3: TRENDING FLAVORS
          --------------------------------------------------------- */}
      <section className="relative z-10 py-10 px-6 max-w-[1280px] mx-auto select-none">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111111] tracking-tight">
            Trending Flavors
          </h2>
          <button 
            onClick={() => { playBtnTap(); navigate('/shop'); }}
            className="text-pink-500 hover:text-pink-600 font-extrabold text-[14px] uppercase tracking-wider transition-colors"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 justify-center">
          {[
            { name: "Chocolate", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop", color: "ring-amber-800/10 hover:ring-amber-800 text-[#4E2E1E]" },
            { name: "Strawberry", img: flavorStrawberry, color: "ring-pink-100 hover:ring-[#FF4FA3] text-[#FF4FA3]" },
            { name: "Pistachio", img: flavorPistachio, color: "ring-emerald-100 hover:ring-emerald-600 text-emerald-700" },
            { name: "Mango", img: flavorMango, color: "ring-amber-100 hover:ring-amber-500 text-amber-600" },
            { name: "Blueberry", img: flavorBlueberry, color: "ring-blue-100 hover:ring-blue-600 text-blue-700" },
            { name: "Black Forest", img: flavorBlackForest, color: "ring-slate-100 hover:ring-slate-800 text-slate-800" }
          ].map((flav, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              onClick={() => { playBtnTap(); navigate(`/shop?flavor=${flav.name}`); }}
              className="flex flex-col items-center space-y-3 cursor-pointer select-none"
            >
              <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden ring-4 ${flav.color} shadow-md transition-all duration-300 bg-white p-1`}>
                <img src={flav.img} alt={flav.name} className="w-full h-full object-cover rounded-full" />
              </div>
              <span className={`text-[14px] md:text-[15px] font-black tracking-tight ${flav.color.split(' ').pop()}`}>
                {flav.name}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------
          SECTION 4: MIDNIGHT DELIVERY BANNER
          --------------------------------------------------------- */}
      <section className="relative z-10 py-8 px-6 max-w-[1280px] mx-auto select-none">
        <div className="rounded-[32px] md:rounded-[40px] bg-gradient-to-r from-[#4E148C] via-[#6130B0] to-[#8C34C0] text-white p-8 md:p-12 overflow-hidden relative flex flex-col lg:flex-row justify-between items-center gap-8 shadow-xl">
          {/* Sparkles, clock decor background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.12)_0%,transparent_75%)] opacity-30 pointer-events-none" />

          <div className="max-w-[480px] text-center lg:text-left space-y-4 relative z-10">
            <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-white">
              Surprise Your Loved Ones with <br className="hidden md:inline" />
              Midnight Delivery
            </h2>
            <div className="pt-2 flex justify-center lg:justify-start">
              <button 
                onClick={() => { playBtnTap(); navigate('/shop'); }}
                className="h-12 px-8 rounded-full bg-[#FFC72C] hover:bg-[#E2B120] text-slate-900 font-extrabold text-[14px] tracking-wider uppercase shadow-[0_8px_20px_rgba(255,199,44,0.3)] active:scale-95 transition-all duration-200"
              >
                Order Now
              </button>
            </div>
          </div>

          <div className="relative z-10 w-full lg:w-auto shrink-0 flex justify-center items-center">
            {/* Elegant surprise cake on white tray / plate */}
            <img 
              src={midnightImage} 
              alt="Midnight surprise" 
              className="w-52 h-52 md:w-64 md:h-64 object-cover rounded-[24px] shadow-2xl scale-103 -rotate-2 hover:rotate-0 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------
          SECTION 5: WHY CAKEURBAN? (Metrics with wavy decorator)
          --------------------------------------------------------- */}
      <section className="relative z-10 py-12 px-6 max-w-[1280px] mx-auto select-none">
        <div className="flex flex-col items-center space-y-2 mb-12">
          <div className="flex items-center gap-2.5">
            <h2 className="text-3xl md:text-4xl font-black text-[#111111] tracking-tight">
              Why CakeUrban?
            </h2>
            {/* Pink wavy line decorator symbol */}
            <span className="text-[#FF4FA3] text-2xl md:text-3xl font-bold font-sans">〰</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 justify-center">
          {[
            { title: "Premium Ingredients", icon: Leaf, color: "bg-emerald-50 text-emerald-500 ring-emerald-100" },
            { title: "Hygienically Prepared", icon: ShieldCheck, color: "bg-purple-50 text-purple-500 ring-purple-100" },
            { title: "Loved by Thousands", icon: Star, color: "bg-amber-50 text-amber-500 ring-amber-100" },
            { title: "Made with Passion", icon: Heart, color: "bg-pink-50 text-pink-500 ring-pink-100" },
            { title: "Secure Payments", icon: Lock, color: "bg-blue-50 text-blue-500 ring-blue-100" }
          ].map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className={`rounded-3xl bg-white border border-slate-50 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center space-y-4 ${index === 4 ? 'col-span-2 md:col-span-1' : ''}`}
              >
                <div className={`w-14 h-14 rounded-2xl ${metric.color.split(' ')[0]} ${metric.color.split(' ')[1]} flex items-center justify-center shrink-0 shadow-inner`}>
                  <IconComponent className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h4 className="text-[14px] md:text-[15px] font-black text-slate-800 tracking-tight leading-snug">
                  {metric.title}
                </h4>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------------
          SECTION 6: WHAT OUR CUSTOMERS SAY (Testimonials)
          --------------------------------------------------------- */}
      <section className="relative z-10 py-12 px-6 max-w-[1280px] mx-auto select-none">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-[#111111] tracking-tight">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              name: "Neha Sharma", 
              avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop", 
              text: "The cake was beyond amazing! Super fresh and so beautiful." 
            },
            { 
              name: "Rohit Verma", 
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop", 
              text: "On-time delivery and great taste. Highly recommended!" 
            },
            { 
              name: "Ananya Iyer", 
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop", 
              text: "The customization is just wow! Exactly how I imagined." 
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4 }}
              className="bg-white rounded-[24px] p-6 border border-pink-50 shadow-[0_12px_30px_rgba(255,79,163,0.03)] hover:shadow-[0_20px_45px_rgba(255,79,163,0.08)] flex flex-col justify-between text-left h-full transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img src={item.avatar} alt={item.name} className="w-11 h-11 rounded-full object-cover border-2 border-pink-100" />
                  <h4 className="text-[15px] font-black text-slate-800 tracking-tight">{item.name}</h4>
                </div>
                <p className="text-sm text-slate-500 font-semibold leading-relaxed">
                  "{item.text}"
                </p>
              </div>

              <div className="flex items-center gap-1 text-amber-400 pt-4 border-t border-slate-50 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------
          SECTION 7: FOLLOW US ON INSTAGRAM
          --------------------------------------------------------- */}
      <section className="relative z-10 py-12 px-6 max-w-[1280px] mx-auto select-none">
        <div className="text-center mb-8 space-y-1.5">
          <h2 className="text-3xl md:text-4xl font-black text-[#111111] tracking-tight">
            Follow Us On Instagram
          </h2>
          <p className="text-sm font-black text-[#FF4FA3] tracking-wide">
            @cakeurban_official
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            instagramImage1,
            instagramImage2,
            instagramImage3,
            instagramImage4,
            instagramImage5
          ].map((url, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03 }}
              className="rounded-2xl overflow-hidden aspect-square shadow-sm bg-slate-50 border border-slate-100 cursor-pointer"
            >
              <img src={url} alt={`Instagram cake ${idx}`} className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------
          SECTION 8: SUBSCRIBE & GET 10% OFF (Drip Container Layout)
          --------------------------------------------------------- */}
      <section className="relative z-10 py-12 px-6 max-w-[1280px] mx-auto select-none">
        <div className="rounded-[40px] bg-[#EED4FC] border border-[#E5B7F8] p-8 md:p-12 relative overflow-hidden">
          {/* Subtle melting icing drip effect on the top border (we can simulate this elegantly with simple round elements or a stylish gradient overlay) */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-purple-200/40 rounded-b-full flex justify-between px-10 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-6 h-6 bg-[#FFF9FC] rounded-full mt-[-12px]" />
            ))}
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 relative z-10">
            <div className="text-center lg:text-left space-y-1">
              <h2 className="text-3xl md:text-4xl font-black text-purple-950 tracking-tight">
                Subscribe & Get 10% OFF
              </h2>
              <p className="text-sm md:text-base font-black text-purple-800/80">
                on your first order
              </p>
            </div>

            <form onSubmit={handleJoinClub} className="w-full max-w-[450px] relative">
              <input 
                type="email" 
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email" 
                className="w-full h-14 pl-6 pr-16 rounded-full bg-white text-slate-800 font-medium border border-[#E5B7F8] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF4FA3]/30 transition-all shadow-sm"
              />
              <button 
                type="submit"
                className="absolute right-1.5 top-1.5 w-11 h-11 rounded-full bg-[#FFA17A] hover:bg-[#FF8A5E] text-white flex items-center justify-center transition-all shadow-md active:scale-90"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------
          SECTION 9: LIGHT GOURMET FOOTER
          --------------------------------------------------------- */}
      <footer className="relative bg-[#FAF6F8] text-slate-700 border-t border-pink-100 pt-16 pb-12 overflow-hidden font-sans z-20">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-pink-100/50">
          
          {/* Column 1: Brand details */}
          <div className="space-y-5 text-left">
            <div className="flex items-center gap-2">
              <span className="font-serif italic text-2xl font-bold text-[#FF4FA3] tracking-tight">CakeUrban</span>
            </div>
            <p className="text-sm text-slate-500 font-semibold leading-relaxed">
              Made with love, delivered with happiness. Handcrafted confections made to light up your special moments.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4 text-left">
            <h4 className="text-[13px] font-black uppercase tracking-[2px] text-slate-800">Quick Links</h4>
            <ul className="space-y-2.5 text-xs font-black text-slate-500">
              <li><button onClick={() => { playBtnTap(); navigate('/'); }} className="hover:text-[#FF4FA3] transition-colors">Home</button></li>
              <li><button onClick={() => { playBtnTap(); navigate('/shop'); }} className="hover:text-[#FF4FA3] transition-colors">Cakes</button></li>
              <li><button onClick={() => { playBtnTap(); navigate('/occasions'); }} className="hover:text-[#FF4FA3] transition-colors">Occasions</button></li>
              <li><button onClick={() => { playBtnTap(); navigate('/custom-order'); }} className="hover:text-[#FF4FA3] transition-colors">Custom Cakes</button></li>
              <li><button onClick={() => { playBtnTap(); navigate('/corporate-catering'); }} className="hover:text-[#FF4FA3] transition-colors text-pink-600">Corporate Orders 💼</button></li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="space-y-4 text-left">
            <h4 className="text-[13px] font-black uppercase tracking-[2px] text-slate-800">Customer Service</h4>
            <ul className="space-y-2.5 text-xs font-black text-slate-500">
              <li><button onClick={() => { playBtnTap(); navigate('/contact'); }} className="hover:text-[#FF4FA3] transition-colors">Contact Us</button></li>
              <li><button onClick={() => { playBtnTap(); navigate('/contact'); }} className="hover:text-[#FF4FA3] transition-colors">FAQ</button></li>
              <li><button onClick={() => { playBtnTap(); navigate('/contact'); }} className="hover:text-[#FF4FA3] transition-colors">Delivery Info</button></li>
              <li><button onClick={() => { playBtnTap(); navigate('/contact'); }} className="hover:text-[#FF4FA3] transition-colors">Return Policy</button></li>
              <li><button onClick={() => { playBtnTap(); navigate('/contact'); }} className="hover:text-[#FF4FA3] transition-colors">Terms & Conditions</button></li>
            </ul>
          </div>

          {/* Column 4: Connect With Us & Cupcake illustration */}
          <div className="space-y-5 text-left">
            <h4 className="text-[13px] font-black uppercase tracking-[2px] text-slate-800">Connect With Us</h4>
            
            {/* Socials row */}
            <div className="flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-pink-100 text-[#FF4FA3] hover:bg-[#FF4FA3] hover:text-white flex items-center justify-center transition-all">
                <Instagram className="w-4.5 h-4.5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-pink-100 text-[#FF4FA3] hover:bg-[#FF4FA3] hover:text-white flex items-center justify-center transition-all">
                <Heart className="w-4.5 h-4.5" />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-pink-100 text-[#FF4FA3] hover:bg-[#FF4FA3] hover:text-white flex items-center justify-center transition-all">
                <Sparkles className="w-4.5 h-4.5" />
              </a>
            </div>

            <div className="space-y-2 text-xs font-black text-slate-500 pt-1">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-pink-400" />
                <span>+91 123 456 7890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-pink-400" />
                <span>hello@cakeurban.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Sub bottom with Pay brands logos */}
        <div className="max-w-[1280px] mx-auto px-6 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-400 text-[11px] font-black gap-4">
          <span>&copy; 2024 CakeUrban. All Rights Reserved.</span>
          <div className="flex items-center gap-3">
            {/* Simplified inline visual representations of payment badges matching the mockup */}
            <span className="bg-slate-100 border border-slate-200 text-slate-500 px-2 py-0.5 rounded font-black text-[9px] tracking-widest">VISA</span>
            <span className="bg-slate-100 border border-slate-200 text-slate-500 px-2 py-0.5 rounded font-black text-[9px] tracking-widest">MC</span>
            <span className="bg-slate-100 border border-slate-200 text-slate-500 px-2 py-0.5 rounded font-black text-[9px] tracking-widest">UPI</span>
            <span className="bg-slate-100 border border-slate-200 text-slate-500 px-2 py-0.5 rounded font-black text-[9px] tracking-widest">RUPAY</span>
            <span className="bg-slate-100 border border-slate-200 text-slate-500 px-2 py-0.5 rounded font-black text-[9px] tracking-widest">PAYPAL</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
