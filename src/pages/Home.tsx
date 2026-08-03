import React, { useState, useEffect, useRef } from 'react';
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
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { playSuccessChime, playBtnTap } from '../lib/sound';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { Interactive3DTilt } from '../components/Interactive3DTilt';

import instagramImage1 from '../assets/images/regenerated_image_1783517220364.webp';
import instagramImage2 from '../assets/images/regenerated_image_1783517209820.webp';
import instagramImage3 from '../assets/images/regenerated_image_1783517212420.webp';
import instagramImage4 from '../assets/images/regenerated_image_1783517215080.webp';
import instagramImage5 from '../assets/images/regenerated_image_1783517217853.webp';

import heroImage from '../assets/images/regenerated_image_1783519200304.webp';
import heroBgImage from '../assets/images/regenerated_image_1783519203025.webp';
import flavorStrawberry from '../assets/images/regenerated_image_1783519206969.webp';
import flavorPistachio from '../assets/images/regenerated_image_1783519209426.webp';
import flavorMango from '../assets/images/regenerated_image_1783519211943.webp';
import flavorBlueberry from '../assets/images/regenerated_image_1783519214755.webp';
import flavorBlackForest from '../assets/images/regenerated_image_1783519217409.webp';
import midnightImage from '../assets/images/regenerated_image_1783520153768.webp';

// Newly regenerated category and flavor images
import categoryBirthday from '../assets/images/regenerated_image_1783601219648.webp';
import categoryAnniversary from '../assets/images/regenerated_image_1783601222157.webp';
import categoryPhoto from '../assets/images/regenerated_image_1783601224998.webp';
import categoryCustom from '../assets/images/regenerated_image_1783601227410.webp';
import categoryDessert from '../assets/images/regenerated_image_1783601230131.webp';
import categoryCupcakes from '../assets/images/regenerated_image_1783601232735.webp';
import flavorChocolate from '../assets/images/regenerated_image_1783601216873.webp';

// ---------------------------------------------------------
// FLOATING DECORATIONS WITH PARALLAX MOUSE EFFECT
// ---------------------------------------------------------
function InteractiveFloatingBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId: number;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        containerRef.current.style.setProperty('--mouse-x', `${x}px`);
        containerRef.current.style.setProperty('--mouse-y', `${y}px`);
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const elements = [
    { id: 1, type: 'heart', color: 'text-rose-400/20', size: 20, top: '15%', left: '10%', delay: 0, factor: 0.6 },
    { id: 2, type: 'sparkle', color: 'text-amber-400/25', size: 16, top: '25%', left: '80%', delay: 1, factor: -0.5 },
    { id: 3, type: 'sparkle', color: 'text-pink-400/20', size: 18, top: '60%', left: '12%', delay: 0.5, factor: 0.7 },
    { id: 4, type: 'heart', color: 'text-purple-400/15', size: 22, top: '75%', left: '85%', delay: 1.5, factor: -0.8 },
  ];

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className={`absolute ${el.color}`}
          style={{
            top: el.top,
            left: el.left,
            fontSize: `${el.size}px`,
            transform: `translate(calc(var(--mouse-x, 0px) * ${el.factor}), calc(var(--mouse-y, 0px) * ${el.factor}))`,
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
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 0,
      badge: "100% Eggless Artisan",
      titleLine1: "Every Cake",
      titleLine2: "Tells a",
      highlight: "Sweet",
      titleLine3: "Story",
      desc: "Handcrafted with love, baked with absolute perfection. Every slice is a premium masterpiece tailored for your special moments.",
      img: heroImage,
      bannerBg: heroBgImage,
      ctaText: "Order Now",
      ctaLink: "/shop",
      bgGrad: "from-slate-950 via-[#1E0905] to-slate-900",
      accentText: "text-amber-400",
      highlightGrad: "from-[#DFB15B] to-amber-300",
      isDark: true,
    },
    {
      id: 1,
      badge: "Midnight Surprise",
      titleLine1: "Midnight",
      titleLine2: "Cake",
      highlight: "Surprise",
      titleLine3: "Delivery",
      desc: "Create unforgettable memories! We deliver fresh gourmet cakes right when the clock strikes 12, securely and silently.",
      img: midnightImage,
      bannerBg: midnightImage,
      ctaText: "Explore Midnight Cakes",
      ctaLink: "/shop",
      bgGrad: "from-[#0F051D] via-[#1D0A35] to-[#0A0314]",
      accentText: "text-purple-300",
      highlightGrad: "from-purple-300 to-fuchsia-300",
      isDark: true,
    },
    {
      id: 2,
      badge: "Designer Studio",
      titleLine1: "Design Your",
      titleLine2: "Dream Cake",
      highlight: "In 3D",
      titleLine3: "",
      desc: "Unleash your culinary creativity! Choose shapes, flavors, toppings, and multi-tier adjustments in real-time.",
      img: categoryCustom,
      bannerBg: heroBgImage,
      ctaText: "Launch 3D Configurator",
      ctaLink: "/ai-designer",
      bgGrad: "from-[#190C05] via-[#2D1609] to-[#120803]",
      accentText: "text-amber-400",
      highlightGrad: "from-amber-400 to-yellow-300",
      isDark: true,
    }
  ];

  useEffect(() => {
    // Preload slide images for seamless transitions
    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.img;
    });

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

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
      <SEO 
        title="CakeUrban | 100% Eggless Cake Delivery in Faridabad | Express 2-Hr & Midnight Delivery"
        description="⚡ Order 100% Eggless Designer Cakes in Faridabad starting @ ₹499. Midnight Delivery & Express 2-Hour Delivery. 24K Gold Flake, Belgian Chocolate, Custom Photo Cakes. Get 10% OFF today!"
        keywords="cake delivery faridabad, eggless cake faridabad, midnight cake delivery faridabad, best cake shop faridabad, designer cake faridabad, birthday cake faridabad, photo cake faridabad, cake urban faridabad"
        schema={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Are all cakes at CakeUrban 100% eggless?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! All cakes and desserts at CakeUrban Faridabad are 100% pure vegetarian and eggless, baked with premium imported ingredients and pure butter."
              }
            },
            {
              "@type": "Question",
              "name": "Do you offer midnight cake delivery in Faridabad?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, CakeUrban provides guaranteed midnight cake delivery across all sectors of Faridabad between 11:30 PM and 12:15 AM."
              }
            },
            {
              "@type": "Question",
              "name": "How fast is express cake delivery in Faridabad?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "CakeUrban offers express delivery within 2 hours across Faridabad for select fresh designer cakes and pastries."
              }
            }
          ]
        }}
      />
      
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
          SECTION 1: HERO BANNER (Dynamic Interactive Carousel)
          --------------------------------------------------------- */}
      <section className="relative z-10 pt-4 pb-6 px-4 md:px-8 xl:px-12 2xl:px-16 max-w-[1720px] mx-auto select-none">
        <div className="rounded-[32px] md:rounded-[40px] overflow-hidden relative border border-[#DFB15B]/30 shadow-[0_25px_60px_rgba(0,0,0,0.4)] transition-all duration-700 bg-slate-950 text-white min-h-[380px] sm:min-h-[440px]">
          
          {/* Background Banner Image with Dark Translucent Backdrop Filter */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-105" 
            style={{ backgroundImage: `url(${slides[currentSlide].bannerBg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-900/70 backdrop-blur-[3px]" />

          {/* Confetti & Sprinkle background decorations */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-10">
            <div className="absolute top-[15%] left-[25%] w-4 h-4 rounded-full bg-amber-300 animate-bounce" />
            <div className="absolute top-[65%] left-[10%] w-3 h-3 rounded-full bg-pink-300 animate-pulse" />
            <div className="absolute top-[35%] left-[85%] w-5 h-5 rounded-full bg-amber-100/60" />
            <div className="absolute top-[75%] left-[65%] w-3.5 h-3.5 rounded-full bg-purple-200" />
            <div className="absolute top-[10%] left-[80%] w-6 h-6 rounded-full bg-yellow-100/50" />
          </div>

          {/* Carousel Slide Wrapper */}
          <div className="p-3 min-[360px]:p-4 min-[400px]:p-6 md:p-10 lg:p-14 xl:p-16 relative z-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="flex flex-row items-center justify-between gap-3 sm:gap-6 lg:gap-12"
              >
                {/* Left Side Content */}
                <div className="w-[58%] lg:w-[50%] space-y-2 sm:space-y-4 md:space-y-6 text-left relative z-10">
                  {/* Category Badge Sticker */}
                  <div className="inline-flex">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[9px] sm:text-[11px] md:text-xs font-black tracking-wider uppercase shadow-md bg-white/10 backdrop-blur-md border border-amber-400/30 text-amber-300">
                      <Star className="w-2.5 sm:w-3 md:w-3.5 h-2.5 sm:h-3 md:h-3.5 fill-amber-300 text-amber-300" />
                      <span>{slides[currentSlide].badge}</span>
                    </span>
                  </div>

                  <h1 className="text-[14px] min-[360px]:text-[16px] min-[400px]:text-[18px] sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-black leading-[1.15] sm:leading-[1.1] tracking-tight !text-white drop-shadow-md" style={{ color: '#FFFFFF' }}>
                    {slides[currentSlide].titleLine1} <br />
                    {slides[currentSlide].titleLine2} <span className={`bg-gradient-to-r ${slides[currentSlide].highlightGrad} bg-clip-text text-transparent`}>{slides[currentSlide].highlight}</span> <br />
                    {slides[currentSlide].titleLine3 && (
                      <>
                        <span className="font-display italic text-amber-300 font-normal tracking-wide text-xs min-[360px]:text-sm sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl">{slides[currentSlide].titleLine3}</span>
                      </>
                    )}
                  </h1>

                  <p className="text-[9px] min-[360px]:text-[10px] sm:text-xs md:text-sm lg:text-base font-medium max-w-[460px] leading-relaxed line-clamp-2 sm:line-clamp-none !text-slate-100 drop-shadow-sm" style={{ color: '#F1F5F9' }}>
                    {slides[currentSlide].desc}
                  </p>

                  <div className="pt-1 flex flex-row items-center gap-1.5 sm:gap-3">
                    <button 
                      onClick={() => { playBtnTap(); navigate(slides[currentSlide].ctaLink); }}
                      className="h-7 sm:h-11 md:h-13 px-3 sm:px-6 md:px-8 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider shadow-[0_10px_30px_rgba(223,177,91,0.4)] hover:scale-103 active:scale-95 transition-all duration-300 cursor-pointer"
                    >
                      {slides[currentSlide].ctaText}
                    </button>
                    <button 
                      onClick={() => { playBtnTap(); navigate('/shop'); }}
                      className="hidden sm:inline-flex h-11 md:h-13 px-6 md:px-8 rounded-full border border-white/25 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-black text-[10px] md:text-xs uppercase tracking-wider hover:scale-103 active:scale-95 transition-all duration-300 cursor-pointer"
                    >
                      Explore Cakes
                    </button>
                  </div>
                </div>

                {/* Right Side Visuals (Gourmet Image with 3D Interactive Tilt & Depth Glow) */}
                <div className="w-[38%] lg:w-[46%] relative flex justify-center z-10 shrink-0">
                  <Interactive3DTilt maxTilt={18} scaleHover={1.04} glare={true} glareOpacity={0.3} className="w-full max-w-[420px]">
                    <div className="relative w-full aspect-square rounded-xl min-[400px]:rounded-2xl md:rounded-3xl overflow-hidden border-2 md:border-4 border-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-slate-50" style={{ transformStyle: 'preserve-3d' }}>
                      <img 
                        src={slides[currentSlide].img} 
                        alt={slides[currentSlide].titleLine1} 
                        className="w-full h-full object-cover relative z-10 hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />

                      {/* 3D Floating Gold Sparkles pop-out */}
                      <motion.div 
                        animate={{ y: [-5, 5, -5], rotate: [0, 10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-3 left-3 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black text-[9px] sm:text-[11px] px-2.5 py-1 rounded-full shadow-lg border border-amber-200 z-30"
                        style={{ transform: 'translateZ(45px)' }}
                      >
                        ✦ 3D Artisan Bake
                      </motion.div>

                      {/* Dotted rotate badge in 3D perspective */}
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute right-1 bottom-1 sm:right-4 sm:bottom-4 w-7 h-7 sm:w-16 md:w-20 sm:h-16 md:h-20 rounded-full bg-white/95 backdrop-blur-md border border-dashed border-pink-200 shadow-md flex items-center justify-center p-0.5 z-20 scale-75 sm:scale-100"
                        style={{ transform: 'translateZ(35px)' }}
                      >
                        <div className="text-center">
                          <p className="text-[5px] sm:text-[7px] md:text-[8px] font-black uppercase text-pink-500 tracking-wider leading-none">Custom</p>
                          <p className="text-[5px] sm:text-[7px] md:text-[8px] font-black uppercase text-slate-700 tracking-wider leading-none mt-0.5">Cakes</p>
                          <p className="text-[4px] sm:text-[6px] md:text-[7px] font-bold text-slate-400 uppercase mt-1 leading-none">Available</p>
                        </div>
                      </motion.div>
                    </div>
                  </Interactive3DTilt>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slide Navigation Buttons (Only visible on hover/active or simple buttons on tablet/desktop) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4 z-20">
              <button
                onClick={() => {
                  playBtnTap();
                  setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
                }}
                className={`w-9 md:w-11 h-9 md:h-11 rounded-full flex items-center justify-center shadow-lg border backdrop-blur-md active:scale-90 transition-all ${
                  slides[currentSlide].isDark 
                    ? 'bg-white/10 hover:bg-white/20 border-white/10 text-white' 
                    : 'bg-white/80 hover:bg-white border-slate-100 text-slate-800'
                }`}
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-2 md:right-4 z-20">
              <button
                onClick={() => {
                  playBtnTap();
                  setCurrentSlide((prev) => (prev + 1) % slides.length);
                }}
                className={`w-9 md:w-11 h-9 md:h-11 rounded-full flex items-center justify-center shadow-lg border backdrop-blur-md active:scale-90 transition-all ${
                  slides[currentSlide].isDark 
                    ? 'bg-white/10 hover:bg-white/20 border-white/10 text-white' 
                    : 'bg-white/80 hover:bg-white border-slate-100 text-slate-800'
                }`}
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Bottom dot indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => { playBtnTap(); setCurrentSlide(idx); }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlide 
                      ? 'w-6 bg-pink-500' 
                      : `w-2 ${slides[currentSlide].isDark ? 'bg-white/30 hover:bg-white/50' : 'bg-slate-300 hover:bg-slate-400'}`
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------
          SECTION 2: HORIZONTAL FEATURE CAPSULES (Mockup Styling)
          --------------------------------------------------------- */}
      <section className="relative z-20 max-w-[1720px] mx-auto px-3 min-[380px]:px-4 md:px-8 xl:px-12 2xl:px-16 mb-8 select-none">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
          {[
            {
              title: "Same Day Delivery",
              desc: "On time, every time",
              icon: Truck,
              bg: "bg-pink-50/60 hover:bg-pink-100/80",
              text: "text-pink-500",
              border: "border-pink-50/80",
              shadow: "hover:shadow-pink-100/30"
            },
            {
              title: "Midnight Delivery",
              desc: "Because surprises matter",
              icon: Clock,
              bg: "bg-purple-50/60 hover:bg-purple-100/80",
              text: "text-purple-600",
              border: "border-purple-50/80",
              shadow: "hover:shadow-purple-100/30"
            },
            {
              title: "Fresh & Premium",
              desc: "Only the finest ingredients",
              icon: Sparkles,
              bg: "bg-amber-50/60 hover:bg-amber-100/80",
              text: "text-amber-500",
              border: "border-amber-50/80",
              shadow: "hover:shadow-amber-100/30"
            }
          ].map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <Interactive3DTilt key={idx} maxTilt={10} scaleHover={1.03} glare={true} glareOpacity={0.15}>
                <div
                  className={`flex flex-col md:flex-row items-center text-center md:text-left gap-1.5 sm:gap-3 md:gap-4 p-2.5 sm:p-4 md:px-6 md:py-5 rounded-[18px] sm:rounded-[24px] bg-white border ${item.border} shadow-[0_8px_25px_rgba(0,0,0,0.02)] hover:shadow-xl ${item.shadow} transition-all duration-300 w-full h-full`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div 
                    className={`w-9 h-9 min-[380px]:w-10 min-[380px]:h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${item.bg} flex items-center justify-center ${item.text} shrink-0 shadow-inner transition-colors duration-300`}
                    style={{ transform: 'translateZ(25px)' }}
                  >
                    <IconComponent className="w-4.5 h-4.5 sm:w-6 sm:h-6 stroke-[2.5]" />
                  </div>
                  <div className="min-w-0" style={{ transform: 'translateZ(15px)' }}>
                    <h4 className="text-[9px] min-[360px]:text-[10px] min-[400px]:text-[11px] sm:text-[13px] md:text-[14px] font-black text-slate-800 leading-tight tracking-tight">
                      {item.title}
                    </h4>
                    <p className="text-[7.5px] min-[360px]:text-[8.5px] sm:text-[10px] md:text-[11px] text-slate-400 font-extrabold mt-0.5 leading-none sm:leading-normal line-clamp-1">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </Interactive3DTilt>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------------
          SECTION 2.3: TRENDING FLAVORS (Mockup High-Fidelity)
          --------------------------------------------------------- */}
      <section className="relative z-10 py-10 px-4 md:px-8 xl:px-12 2xl:px-16 max-w-[1720px] mx-auto select-none">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
              Trending Flavors
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

        {/* Beautiful responsive grid on all devices */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6 md:gap-8 pt-2">
          {[
            { 
              name: "Chocolate", 
              img: flavorChocolate, 
              textColor: "text-[#4E2E1E]",
              bgGrad: "bg-gradient-to-br from-[#FFF8F2] via-[#EAD0C0] to-[#CBA289]",
              glowColor: "bg-amber-800",
              gemLeft: "from-amber-700 to-amber-950",
              gemRight: "from-pink-300 to-pink-500"
            },
            { 
              name: "Strawberry", 
              img: flavorStrawberry, 
              textColor: "text-[#FF4FA3]",
              bgGrad: "bg-gradient-to-br from-[#FFF0F3] via-[#FFD0DE] to-[#FFA1C2]",
              glowColor: "bg-pink-500",
              gemLeft: "from-pink-400 to-pink-600",
              gemRight: "from-pink-200 to-pink-400"
            },
            { 
              name: "Pistachio", 
              img: flavorPistachio, 
              textColor: "text-emerald-700",
              bgGrad: "bg-gradient-to-br from-[#F5FFFA] via-[#E2F5E2] to-[#BCD8BC]",
              glowColor: "bg-emerald-500",
              gemLeft: "from-emerald-400 to-emerald-600",
              gemRight: "from-yellow-300 to-amber-400"
            },
            { 
              name: "Mango", 
              img: flavorMango, 
              textColor: "text-amber-500 font-bold",
              bgGrad: "bg-gradient-to-br from-[#FFFFF0] via-[#FFF2CC] to-[#FFE082]",
              glowColor: "bg-amber-500",
              gemLeft: "from-amber-400 to-amber-600",
              gemRight: "from-orange-400 to-red-500"
            },
            { 
              name: "Blueberry", 
              img: flavorBlueberry, 
              textColor: "text-blue-900",
              bgGrad: "bg-gradient-to-br from-[#F0F8FF] via-[#DBE9FA] to-[#B2CFF7]",
              glowColor: "bg-blue-500",
              gemLeft: "from-blue-400 to-blue-700",
              gemRight: "from-purple-300 to-indigo-500"
            },
            { 
              name: "Black Forest", 
              img: flavorBlackForest, 
              textColor: "text-[#1A1A1A] font-black",
              bgGrad: "bg-gradient-to-br from-[#FFF5F5] via-[#FFD6D6] to-[#FFA3A3]",
              glowColor: "bg-red-500",
              gemLeft: "from-red-600 to-rose-950",
              gemRight: "from-pink-300 to-pink-500"
            }
          ].map((flav, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              onClick={() => { playBtnTap(); navigate(`/shop?flavor=${flav.name}`); }}
              className="flex flex-col items-center cursor-pointer select-none group w-full"
            >
              <div className={`relative w-20 h-20 min-[400px]:w-24 min-[400px]:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center ${flav.bgGrad} p-1 md:p-1.5 shadow-[0_8px_25px_rgba(0,0,0,0.06)] ring-1 ring-slate-100 transition-all duration-300 group-hover:shadow-[0_12px_35px_rgba(0,0,0,0.12)] group-hover:scale-105`}>
                <div className="w-[88%] h-[88%] rounded-full overflow-hidden shadow-inner relative z-10 bg-white">
                  <img src={flav.img} alt={flav.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/30 pointer-events-none rounded-full" />
                </div>
                
                <div className={`absolute -inset-0.5 rounded-full ${flav.glowColor} opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-sm`} />
                <div className={`absolute bottom-0.5 left-0.5 w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br ${flav.gemLeft} border border-white shadow-md z-20 transition-transform duration-300 group-hover:scale-110`} />
                <div className={`absolute bottom-1.5 right-0.5 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br ${flav.gemRight} border border-white shadow-md z-20 transition-transform duration-300 group-hover:scale-115`} />
              </div>
              <div className="text-center mt-3">
                <span className={`text-[11px] min-[400px]:text-[12px] sm:text-[13px] md:text-[14px] font-extrabold tracking-tight text-center transition-colors group-hover:text-pink-500 line-clamp-1 ${flav.textColor}`}>
                  {flav.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------
          SECTION 2.5: SHOP BY CATEGORIES (Mockup High-Fidelity)
          --------------------------------------------------------- */}
      <section className="relative z-10 py-10 px-4 md:px-8 xl:px-12 2xl:px-16 max-w-[1720px] mx-auto select-none">
        <div className="flex flex-col items-start mb-8 text-left">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
              Shop by Categories
            </h2>
            <span className="text-[#FF4FA3] text-xl font-bold">〰</span>
          </div>
        </div>

        {/* Beautiful responsive grid on all devices */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6 md:gap-8 pt-2">
          {[
            { 
              name: "Birthday Cakes", 
              img: categoryBirthday, 
              textColor: "text-[#C84B7C]",
              bgGrad: "bg-gradient-to-br from-[#FFF0F3] via-[#FFD0DE] to-[#FFA1C2]",
              glowColor: "bg-pink-500",
              gemLeft: "from-pink-400 to-pink-600",
              gemRight: "from-pink-200 to-pink-400",
              route: "/birthday-cakes" 
            },
            { 
              name: "Anniversary Cakes", 
              img: categoryAnniversary, 
              textColor: "text-[#B91C1C]",
              bgGrad: "bg-gradient-to-br from-[#FFF5F5] via-[#FFD6D6] to-[#FFA3A3]",
              glowColor: "bg-red-500",
              gemLeft: "from-red-600 to-rose-950",
              gemRight: "from-pink-300 to-pink-500",
              route: "/anniversary-cakes" 
            },
            { 
              name: "Photo Cakes", 
              img: categoryPhoto, 
              textColor: "text-[#0891B2]",
              bgGrad: "bg-gradient-to-br from-[#E6F8FA] via-[#BCEEF3] to-[#86E3EC]",
              glowColor: "bg-cyan-500",
              gemLeft: "from-cyan-400 to-cyan-600",
              gemRight: "from-blue-200 to-cyan-300",
              route: "/shop?category=photo" 
            },
            { 
              name: "Custom Cakes", 
              img: categoryCustom, 
              textColor: "text-[#D9822B] font-bold",
              bgGrad: "bg-gradient-to-br from-[#FFFFF0] via-[#FFF2CC] to-[#FFE082]",
              glowColor: "bg-amber-500",
              gemLeft: "from-amber-400 to-amber-600",
              gemRight: "from-orange-400 to-red-500",
              route: "/custom-order" 
            },
            { 
              name: "Dessert Boxes", 
              img: categoryDessert, 
              textColor: "text-[#C2410C]",
              bgGrad: "bg-gradient-to-br from-[#FFF7ED] via-[#FED7AA] to-[#FDBA74]",
              glowColor: "bg-orange-500",
              gemLeft: "from-orange-400 to-orange-600",
              gemRight: "from-yellow-200 to-orange-300",
              route: "/desserts" 
            },
            { 
              name: "Cupcakes", 
              img: categoryCupcakes, 
              textColor: "text-[#1D4ED8]",
              bgGrad: "bg-gradient-to-br from-[#EFF6FF] via-[#DBEAFE] to-[#BFDBFE]",
              glowColor: "bg-blue-500",
              gemLeft: "from-blue-400 to-blue-700",
              gemRight: "from-indigo-300 to-purple-500",
              route: "/cupcakes" 
            }
          ].map((cat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              onClick={() => { playBtnTap(); navigate(cat.route); }}
              className="flex flex-col items-center cursor-pointer select-none group w-full"
            >
              <div className={`relative w-20 h-20 min-[400px]:w-24 min-[400px]:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center ${cat.bgGrad} p-1 md:p-1.5 shadow-[0_8px_25px_rgba(0,0,0,0.06)] ring-1 ring-slate-100 transition-all duration-300 group-hover:shadow-[0_12px_35px_rgba(0,0,0,0.12)] group-hover:scale-105`}>
                <div className="w-[88%] h-[88%] rounded-full overflow-hidden shadow-inner relative z-10 bg-white">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/30 pointer-events-none rounded-full" />
                </div>
                
                <div className={`absolute -inset-0.5 rounded-full ${cat.glowColor} opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-sm`} />
                <div className={`absolute bottom-0.5 left-0.5 w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br ${cat.gemLeft} border border-white shadow-md z-20 transition-transform duration-300 group-hover:scale-110`} />
                <div className={`absolute bottom-1.5 right-0.5 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br ${cat.gemRight} border border-white shadow-md z-20 transition-transform duration-300 group-hover:scale-115`} />
              </div>
              <div className="text-center mt-3">
                <span className={`text-[11px] min-[400px]:text-[12px] sm:text-[13px] md:text-[14px] font-extrabold tracking-tight text-center transition-colors group-hover:text-pink-500 line-clamp-1 ${cat.textColor}`}>
                  {cat.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------
          SECTION 2.6: BEST SELLERS (Mockup High-Fidelity)
          --------------------------------------------------------- */}
      <section className="relative z-10 py-10 px-4 md:px-8 xl:px-12 2xl:px-16 max-w-[1720px] mx-auto select-none">
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

        {/* Beautiful 2-column grid on mobile, 5-column on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 pt-2">
          {[
            { 
              id: "bestseller-1", 
              name: "Chocolate Truffle", 
              price: 699, 
              rating: 4.9,
              img: flavorChocolate, 
              tag: "Bestseller",
              bg: "bg-amber-50/40"
            },
            { 
              id: "bestseller-2", 
              name: "Red Velvet Bliss", 
              price: 699, 
              rating: 4.9,
              img: flavorStrawberry, 
              tag: "Bestseller",
              bg: "bg-red-50/40"
            },
            { 
              id: "bestseller-3", 
              name: "Butterscotch Crunch", 
              price: 699, 
              rating: 4.8,
              img: flavorMango, 
              tag: "Bestseller",
              bg: "bg-yellow-50/40"
            },
            { 
              id: "bestseller-4", 
              name: "Blueberry Cheesecake", 
              price: 749, 
              rating: 4.9,
              img: flavorBlueberry, 
              tag: "Premium Choice",
              bg: "bg-blue-50/40"
            },
            { 
              id: "bestseller-5", 
              name: "Ferrero Rocher", 
              price: 799, 
              rating: 4.9,
              img: flavorBlackForest, 
              tag: "Chef Signature",
              bg: "bg-amber-100/20"
            }
          ].map((prod) => (
            <motion.div
              key={prod.id}
              whileHover={{ y: -8 }}
              onClick={() => { playBtnTap(); navigate(`/product/${prod.id}`); }}
              className={`w-full ${prod.bg} border border-slate-100 rounded-[20px] sm:rounded-[28px] overflow-hidden p-2.5 sm:p-3 shadow-sm hover:shadow-lg transition-all duration-300 text-left flex flex-col justify-between cursor-pointer`}
            >
              <div>
                <div className="relative aspect-square rounded-[16px] sm:rounded-[22px] overflow-hidden mb-2.5 sm:mb-3.5 bg-slate-100">
                  {prod.tag && (
                    <span className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold text-[7px] sm:text-[9px] uppercase tracking-wider px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-md z-10">
                      {prod.tag}
                    </span>
                  )}
                  <img src={prod.img} alt={prod.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>

                <div className="px-1">
                  <div className="flex items-center gap-1 text-amber-500 text-[10px] sm:text-[11px] font-black mb-0.5 sm:mb-1">
                    <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                    <span>{prod.rating}</span>
                  </div>
                  <h3 className="font-black text-[11px] sm:text-xs text-slate-800 uppercase tracking-wide line-clamp-1">{prod.name}</h3>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 sm:pt-3.5 px-1 mt-2 border-t border-slate-50/85">
                <span className="font-black text-xs sm:text-sm text-slate-900">₹{prod.price}</span>
                <button 
                  onClick={() => { playBtnTap(); navigate(`/product/1`); }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-white transition-all shadow-sm active:scale-90"
                >
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------
          SECTION 4: MIDNIGHT DELIVERY BANNER
          --------------------------------------------------------- */}
      <section className="relative z-10 py-4 sm:py-8 px-4 md:px-8 xl:px-12 2xl:px-16 max-w-[1720px] mx-auto select-none">
        <div className="rounded-[28px] md:rounded-[40px] text-white p-5 sm:p-8 md:p-12 overflow-hidden relative flex flex-row justify-between items-center gap-3 sm:gap-6 md:gap-12 shadow-2xl border border-purple-500/30">
          
          {/* Background Banner Image with Glass Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105"
            style={{ backgroundImage: `url(${midnightImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#17052C]/95 via-[#230A42]/90 to-[#100320]/80 backdrop-blur-[4px]" />

          {/* Sparkles, clock decor background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.12)_0%,transparent_75%)] opacity-30 pointer-events-none z-10" />

          <div className="w-[58%] text-left space-y-2 md:space-y-4 relative z-20">
            <h2 className="text-[14px] min-[360px]:text-[16px] min-[400px]:text-[18px] sm:text-2xl md:text-3xl lg:text-4xl font-black leading-tight tracking-tight !text-white drop-shadow-md" style={{ color: '#FFFFFF' }}>
              Surprise Your Loved Ones with <br className="hidden md:inline" />
              Midnight Delivery
            </h2>
            <p className="text-[9px] min-[360px]:text-[10px] sm:text-xs md:text-sm font-medium !text-purple-100 leading-relaxed max-w-md drop-shadow-sm" style={{ color: '#F3E8FF' }}>
              Create unforgettable memories! Fresh gourmet cakes delivered right when the clock strikes 12.
            </p>
            <div className="pt-1 flex justify-start">
              <button 
                onClick={() => { playBtnTap(); navigate('/shop'); }}
                className="h-7 sm:h-11 md:h-13 px-3 sm:px-8 rounded-full bg-gradient-to-r from-[#DFB15B] to-amber-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-[8px] sm:text-[11px] md:text-xs tracking-wider uppercase shadow-[0_8px_25px_rgba(223,177,91,0.4)] active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Order Now
              </button>
            </div>
          </div>

          <div className="w-[38%] relative z-10 shrink-0 flex justify-center items-center">
            {/* Elegant surprise cake on white tray / plate */}
            <img 
              src={midnightImage} 
              alt="Midnight surprise" 
              className="w-full max-w-[240px] aspect-square object-cover rounded-[14px] sm:rounded-[24px] shadow-2xl scale-103 -rotate-2 hover:rotate-0 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------
          SECTION 5: WHY CAKEURBAN? (Metrics with wavy decorator)
          --------------------------------------------------------- */}
      <section className="relative z-10 py-12 px-6 xl:px-12 2xl:px-16 max-w-[1720px] mx-auto select-none">
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
      <section className="relative z-10 py-12 px-6 xl:px-12 2xl:px-16 max-w-[1720px] mx-auto select-none">
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
                  <img src={item.avatar} alt={item.name} className="w-11 h-11 rounded-full object-cover border-2 border-pink-100" loading="lazy" />
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
      <section className="relative z-10 py-12 px-6 xl:px-12 2xl:px-16 max-w-[1720px] mx-auto select-none">
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
              <img src={url} alt={`Instagram cake ${idx}`} className="w-full h-full object-cover" loading="lazy" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------
          SECTION 8: SUBSCRIBE & GET 10% OFF (Drip Container Layout)
          --------------------------------------------------------- */}
      <section className="relative z-10 py-12 px-6 xl:px-12 2xl:px-16 max-w-[1720px] mx-auto select-none">
        <div className="rounded-[40px] p-8 md:p-12 relative overflow-hidden shadow-2xl border border-amber-500/30 text-white">
          
          {/* Background Banner Image with Glass Dark Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105"
            style={{ backgroundImage: `url(${heroBgImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-purple-950/90 to-slate-950/85 backdrop-blur-[5px]" />

          {/* Subtle melting icing drip effect on the top border */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-purple-200/20 rounded-b-full flex justify-between px-10 pointer-events-none z-10">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-6 h-6 bg-[#DFB15B]/30 rounded-full mt-[-12px]" />
            ))}
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 relative z-20">
            <div className="text-center lg:text-left space-y-2">
              <h2 className="text-3xl md:text-5xl font-black !text-white tracking-tight drop-shadow-md" style={{ color: '#FFFFFF' }}>
                Subscribe & Get <span className="text-[#DFB15B]" style={{ color: '#DFB15B' }}>10% OFF</span>
              </h2>
              <p className="text-sm md:text-base font-semibold !text-purple-200" style={{ color: '#E9D5FF' }}>
                Join our VIP Atelier Club for exclusive secret recipes & discounts on your first order
              </p>
            </div>

            <form onSubmit={handleJoinClub} className="w-full max-w-[450px] relative">
              <input 
                type="email" 
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email address" 
                className="w-full h-14 pl-6 pr-16 rounded-full bg-white/10 backdrop-blur-md text-white font-medium border border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#DFB15B]/50 transition-all shadow-inner"
              />
              <button 
                type="submit"
                className="absolute right-1.5 top-1.5 w-11 h-11 rounded-full bg-gradient-to-r from-[#DFB15B] to-amber-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 flex items-center justify-center transition-all shadow-lg active:scale-90 font-black"
              >
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------
          SECTION 9: LIGHT GOURMET FOOTER
          --------------------------------------------------------- */}
      <footer className="relative bg-[#FAF6F8] text-slate-700 border-t border-pink-100 pt-16 pb-12 overflow-hidden font-sans z-20">
        <div className="max-w-[1720px] mx-auto px-6 xl:px-12 2xl:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-pink-100/50">
          
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
              <li><button onClick={() => { playBtnTap(); navigate('/shop?tab=occasions'); }} className="hover:text-[#FF4FA3] transition-colors">Occasions</button></li>
              <li><button onClick={() => { playBtnTap(); navigate('/custom-order'); }} className="hover:text-[#FF4FA3] transition-colors">Custom Cakes</button></li>
              <li><button onClick={() => { playBtnTap(); navigate('/corporate-catering'); }} className="hover:text-[#FF4FA3] transition-colors text-pink-600">Corporate Orders 💼</button></li>
              <li><button onClick={() => { playBtnTap(); navigate('/seo-directory'); }} className="hover:text-amber-600 transition-colors font-bold flex items-center gap-1">SEO Map Directory 📍</button></li>
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
        <div className="max-w-[1720px] mx-auto px-6 xl:px-12 2xl:px-16 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-400 text-[11px] font-black gap-4">
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
