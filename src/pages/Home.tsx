import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, limit } from 'firebase/firestore';
import { Product } from '../types';
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
import flavorChocolate from '../assets/images/regenerated_image_1788086166531.png';
import flavorStrawberry from '../assets/images/regenerated_image_1788086170422.png';
import flavorPistachio from '../assets/images/regenerated_image_1788086173650.png';
import flavorMango from '../assets/images/regenerated_image_1788086176809.png';
import flavorBlueberry from '../assets/images/regenerated_image_1788086179379.png';
import flavorBlackForest from '../assets/images/regenerated_image_1788086182460.png';
import midnightImage from '../assets/images/regenerated_image_1783520153768.webp';

// Newly regenerated category and flavor images
import categoryBirthday from '../assets/images/regenerated_image_1788086185992.png';
import categoryAnniversary from '../assets/images/regenerated_image_1788086188653.png';
import categoryPhoto from '../assets/images/regenerated_image_1788086191498.png';
import categoryCustom from '../assets/images/regenerated_image_1788086194036.png';
import categoryDessert from '../assets/images/regenerated_image_1788086196717.png';
import categoryCupcakes from '../assets/images/regenerated_image_1788086199869.png';

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
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);

  // Real-time Firestore products listener for homepage bestsellers
  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'products'), limit(10)),
      (snapshot) => {
        const prods = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
        setLiveProducts(prods);
      },
      (err) => {
        console.warn("Home products listener warning:", err);
      }
    );
    return () => unsub();
  }, []);

  const slides = [
    {
      id: 0,
      badge: "MIDNIGHT SURPRISE",
      titleLine1: "Midnight",
      titleLine2: "Cake Surprise",
      highlight: "",
      titleLine3: "Delivery",
      desc: "Create unforgettable memories! We deliver fresh gourmet cakes right when the clock strikes 12, securely and silently.",
      img: midnightImage,
      bannerBg: heroBgImage,
      ctaText: "EXPLORE MIDNIGHT CAKES",
      ctaLink: "/shop",
      bgGrad: "from-[#0D0D0D] via-[#141414] to-[#0A0A0A]",
      accentText: "text-[#DFB15B]",
      highlightGrad: "from-[#DFB15B] via-[#F3D389] to-[#C99738]",
      isDark: true,
    },
    {
      id: 1,
      badge: "100% EGGLESS ARTISAN",
      titleLine1: "Every Cake",
      titleLine2: "Tells a Sweet",
      highlight: "",
      titleLine3: "Story",
      desc: "Handcrafted with love, baked with absolute perfection. Every slice is a premium masterpiece tailored for your special moments.",
      img: heroImage,
      bannerBg: heroBgImage,
      ctaText: "EXPLORE CAKES",
      ctaLink: "/shop",
      bgGrad: "from-[#0D0D0D] via-[#171717] to-[#080808]",
      accentText: "text-[#DFB15B]",
      highlightGrad: "from-[#DFB15B] to-[#F3D389]",
      isDark: true,
    },
    {
      id: 2,
      badge: "3D DESIGNER STUDIO",
      titleLine1: "Design Your",
      titleLine2: "Dream Cake",
      highlight: "",
      titleLine3: "In 3D",
      desc: "Unleash your culinary creativity! Choose shapes, flavors, toppings, and multi-tier adjustments in real-time.",
      img: categoryCustom,
      bannerBg: heroBgImage,
      ctaText: "LAUNCH 3D STUDIO",
      ctaLink: "/ai-designer",
      bgGrad: "from-[#0D0D0D] via-[#161616] to-[#090909]",
      accentText: "text-[#DFB15B]",
      highlightGrad: "from-[#DFB15B] to-[#F3D389]",
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
    <div className="relative min-h-screen bg-transparent overflow-hidden font-sans text-[#FFFDFB]">
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
        <div className="rounded-[32px] md:rounded-[40px] overflow-hidden relative border border-[#DFB15B]/35 shadow-[0_25px_60px_rgba(0,0,0,0.5)] transition-all duration-700 bg-[#0D0D0D] text-[#FFFDFB] min-h-[400px] sm:min-h-[460px]">
          
          {/* Subtle Translucent Backdrop Atmosphere */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-105 opacity-20" 
            style={{ backgroundImage: `url(${slides[currentSlide].bannerBg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D] via-[#121212]/95 to-[#0D0D0D]/90" />

          {/* Carousel Slide Wrapper */}
          <div className="p-4 sm:p-8 md:p-12 lg:p-16 relative z-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-14"
              >
                {/* Left Side Content */}
                <div className="w-full lg:w-[52%] space-y-3 sm:space-y-5 md:space-y-6 text-left relative z-10">
                  {/* Category Badge Sticker */}
                  <div className="inline-flex">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase bg-black/40 border border-[#DFB15B]/50 text-[#F5EFE0] shadow-sm">
                      <Star className="w-3 h-3 fill-[#DFB15B] text-[#DFB15B]" />
                      <span>{slides[currentSlide].badge}</span>
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black leading-[1.12] tracking-tight !text-[#F5EFE0] drop-shadow-md">
                    {slides[currentSlide].titleLine1} <br />
                    {slides[currentSlide].titleLine2} {slides[currentSlide].highlight} <br />
                    {slides[currentSlide].titleLine3 && (
                      <span className="font-serif italic text-[#DFB15B] font-normal tracking-wide text-2xl sm:text-3xl md:text-5xl lg:text-6xl">
                        {slides[currentSlide].titleLine3}
                      </span>
                    )}
                  </h1>

                  <p className="text-xs sm:text-sm md:text-base font-normal max-w-[480px] leading-relaxed text-[#F5EFE0]/80 drop-shadow-sm">
                    {slides[currentSlide].desc}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                    <button 
                      onClick={() => { playBtnTap(); navigate(slides[currentSlide].ctaLink); }}
                      className="h-11 sm:h-13 px-6 sm:px-8 rounded-full bg-gradient-to-r from-[#DFB15B] via-[#E5C578] to-[#C99738] hover:brightness-110 text-[#0D0D0D] font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_10px_30px_rgba(223,177,91,0.35)] hover:scale-103 active:scale-95 transition-all duration-300 cursor-pointer"
                    >
                      {slides[currentSlide].ctaText}
                    </button>
                    <button 
                      onClick={() => { playBtnTap(); navigate('/shop'); }}
                      className="h-11 sm:h-13 px-6 sm:px-8 rounded-full border border-[#DFB15B]/50 bg-transparent hover:bg-[#DFB15B]/15 text-[#F5EFE0] font-bold text-xs sm:text-sm uppercase tracking-wider hover:scale-103 active:scale-95 transition-all duration-300 cursor-pointer"
                    >
                      EXPLORE CAKES
                    </button>
                  </div>
                </div>

                {/* Right Side Visuals (White Card with 3D Artisan Cake) */}
                <div className="w-full lg:w-[46%] relative flex justify-center z-10 shrink-0">
                  <Interactive3DTilt maxTilt={14} scaleHover={1.03} glare={true} glareOpacity={0.2} className="w-full max-w-[460px]">
                    <div className="relative w-full aspect-square rounded-[32px] md:rounded-[36px] overflow-hidden border border-[#DFB15B]/25 shadow-[0_25px_60px_rgba(0,0,0,0.45)] bg-white p-4 sm:p-6 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
                      
                      {/* Top-Left Gold Badge */}
                      <div 
                        className="absolute top-4 left-4 bg-gradient-to-r from-[#DFB15B] to-[#C99738] text-[#0D0D0D] font-black text-[10px] sm:text-xs px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 z-30"
                        style={{ transform: 'translateZ(30px)' }}
                      >
                        <span>★</span>
                        <span>3D Artisan Bake</span>
                      </div>

                      {/* Cake Image */}
                      <img 
                        src={slides[currentSlide].img} 
                        alt={slides[currentSlide].titleLine1} 
                        className="w-[88%] h-[88%] object-contain relative z-10 hover:scale-105 transition-transform duration-700 drop-shadow-xl"
                        referrerPolicy="no-referrer"
                      />

                      {/* Bottom-Right Gold & Cream Branding Coin */}
                      <div 
                        className="absolute right-4 bottom-4 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FFFDFB] border-2 border-[#DFB15B] shadow-lg flex items-center justify-center p-1 z-20 rotate-[-12deg]"
                        style={{ transform: 'translateZ(35px)' }}
                      >
                        <div className="text-center">
                          <p className="text-[6px] sm:text-[7px] font-black uppercase text-[#C99738] tracking-tight leading-none">CakeUrban</p>
                          <p className="text-[5px] sm:text-[6px] font-extrabold uppercase text-[#0D0D0D] tracking-tighter leading-none mt-0.5">100% Quality</p>
                          <p className="text-[4px] sm:text-[5px] font-bold text-[#C99738]/80 uppercase mt-0.5 leading-none">Guaranteed</p>
                        </div>
                      </div>
                    </div>
                  </Interactive3DTilt>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom dot indicators */}
            <div className="flex items-center justify-center gap-2 pt-6">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => { playBtnTap(); setCurrentSlide(idx); }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlide 
                      ? 'w-6 bg-[#DFB15B]' 
                      : 'w-2 bg-[#DFB15B]/30 hover:bg-[#DFB15B]/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------
          SECTION 2: HORIZONTAL FEATURE CAPSULES (Deep Charcoal & Gold Wireframe)
          --------------------------------------------------------- */}
      <section className="relative z-20 max-w-[1720px] mx-auto px-4 md:px-8 xl:px-12 2xl:px-16 mb-8 select-none">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              title: "Same Day Delivery",
              desc: "On time, every time",
              icon: Truck,
              glow: false
            },
            {
              title: "Midnight Delivery",
              desc: "Because surprises matter",
              icon: Clock,
              glow: true
            },
            {
              title: "Fresh & Premium",
              desc: "Only the finest ingredients",
              icon: Sparkles,
              glow: false
            }
          ].map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <Interactive3DTilt key={idx} maxTilt={8} scaleHover={1.02} glare={true} glareOpacity={0.12}>
                <div
                  className={`flex items-center gap-4 p-5 sm:p-6 rounded-[22px] bg-[#0D0D0D] border border-[#DFB15B]/30 shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:border-[#DFB15B]/60 transition-all duration-300 w-full h-full text-[#F5EFE0] relative overflow-hidden`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {item.glow && (
                    <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-[#DFB15B]/70 to-transparent pointer-events-none" />
                  )}
                  <div 
                    className="w-13 h-13 rounded-full border border-[#DFB15B]/40 bg-[#DFB15B]/10 flex items-center justify-center text-[#DFB15B] shrink-0 shadow-inner"
                    style={{ transform: 'translateZ(20px)' }}
                  >
                    <IconComponent className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div className="min-w-0" style={{ transform: 'translateZ(15px)' }}>
                    <h4 className="text-base sm:text-lg font-bold text-[#F5EFE0] leading-tight tracking-tight">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#F5EFE0]/65 font-medium mt-1 leading-normal">
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
      <section className="relative z-10 py-8 px-4 md:px-8 xl:px-12 2xl:px-16 max-w-[1720px] mx-auto select-none">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl md:text-3xl font-black text-[#F5EFE0] tracking-tight">
              Trending Flavors
            </h2>
            <span className="text-[#DFB15B] text-xl font-bold">〰</span>
          </div>
          <div className="relative">
            <button 
              onClick={() => { playBtnTap(); navigate('/shop'); }}
              className="text-[#DFB15B] hover:text-[#F5EFE0] font-black text-xs uppercase tracking-wider transition-colors border border-[#DFB15B]/40 hover:border-[#DFB15B] px-6 py-2.5 rounded-full bg-[#0D0D0D] shadow-sm flex items-center gap-1.5"
            >
              <span>VIEW ALL</span>
            </button>
            <Sparkles className="w-5 h-5 text-[#DFB15B] fill-[#DFB15B]/30 absolute -top-3 -right-2 pointer-events-none animate-pulse" />
          </div>
        </div>

        {/* Beautiful responsive grid on all devices */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6 md:gap-8 pt-2">
          {[
            { 
              name: "Chocolate", 
              img: flavorChocolate, 
              textColor: "text-amber-200",
              bgGrad: "bg-gradient-to-br from-[#2D1609] via-[#1E0905] to-[#120502]",
              glowColor: "bg-amber-800",
              gemLeft: "from-amber-700 to-amber-950",
              gemRight: "from-pink-300 to-pink-500"
            },
            { 
              name: "Strawberry", 
              img: flavorStrawberry, 
              textColor: "text-pink-300",
              bgGrad: "bg-gradient-to-br from-[#380E1C] via-[#240812] to-[#15040B]",
              glowColor: "bg-pink-500",
              gemLeft: "from-pink-400 to-pink-600",
              gemRight: "from-pink-200 to-pink-400"
            },
            { 
              name: "Pistachio", 
              img: flavorPistachio, 
              textColor: "text-emerald-300",
              bgGrad: "bg-gradient-to-br from-[#0C2D1C] via-[#071F13] to-[#03110A]",
              glowColor: "bg-emerald-500",
              gemLeft: "from-emerald-400 to-emerald-600",
              gemRight: "from-yellow-300 to-amber-400"
            },
            { 
              name: "Mango", 
              img: flavorMango, 
              textColor: "text-amber-300 font-bold",
              bgGrad: "bg-gradient-to-br from-[#332200] via-[#221600] to-[#110B00]",
              glowColor: "bg-amber-500",
              gemLeft: "from-amber-400 to-amber-600",
              gemRight: "from-orange-400 to-red-500"
            },
            { 
              name: "Blueberry", 
              img: flavorBlueberry, 
              textColor: "text-blue-300",
              bgGrad: "bg-gradient-to-br from-[#0B1E3B] via-[#061226] to-[#030914]",
              glowColor: "bg-blue-500",
              gemLeft: "from-blue-400 to-blue-700",
              gemRight: "from-purple-300 to-indigo-500"
            },
            { 
              name: "Black Forest", 
              img: flavorBlackForest, 
              textColor: "text-rose-300 font-black",
              bgGrad: "bg-gradient-to-br from-[#3A0F14] via-[#24080B] to-[#130305]",
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
              <div className={`relative w-20 h-20 min-[400px]:w-24 min-[400px]:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center ${flav.bgGrad} p-1 md:p-1.5 shadow-[0_8px_25px_rgba(0,0,0,0.5)] ring-1 ring-[#DFB15B]/30 transition-all duration-300 group-hover:shadow-[0_12px_35px_rgba(223,177,91,0.3)] group-hover:scale-105`}>
                <div className="w-[88%] h-[88%] rounded-full overflow-hidden shadow-inner relative z-10 bg-[#18191e]">
                  <img src={flav.img} alt={flav.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none rounded-full" />
                </div>
                
                <div className={`absolute -inset-0.5 rounded-full ${flav.glowColor} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm`} />
                <div className={`absolute bottom-0.5 left-0.5 w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br ${flav.gemLeft} border border-white/20 shadow-md z-20 transition-transform duration-300 group-hover:scale-110`} />
                <div className={`absolute bottom-1.5 right-0.5 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br ${flav.gemRight} border border-white/20 shadow-md z-20 transition-transform duration-300 group-hover:scale-115`} />
              </div>
              <div className="text-center mt-3">
                <span className={`text-[11px] min-[400px]:text-[12px] sm:text-[13px] md:text-[14px] font-extrabold tracking-tight text-center transition-colors group-hover:text-[#DFB15B] line-clamp-1 ${flav.textColor}`}>
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
            <h2 className="text-2xl md:text-3xl font-black text-[#FFFDFB] tracking-tight">
              Shop by Categories
            </h2>
            <span className="text-[#DFB15B] text-xl font-bold">〰</span>
          </div>
        </div>

        {/* Beautiful responsive grid on all devices */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6 md:gap-8 pt-2">
          {[
            { 
              name: "Birthday Cakes", 
              img: categoryBirthday, 
              textColor: "text-pink-300",
              bgGrad: "bg-gradient-to-br from-[#380E1C] via-[#240812] to-[#15040B]",
              glowColor: "bg-pink-500",
              gemLeft: "from-pink-400 to-pink-600",
              gemRight: "from-pink-200 to-pink-400",
              route: "/birthday-cakes" 
            },
            { 
              name: "Anniversary Cakes", 
              img: categoryAnniversary, 
              textColor: "text-rose-300",
              bgGrad: "bg-gradient-to-br from-[#3A0F14] via-[#24080B] to-[#130305]",
              glowColor: "bg-red-500",
              gemLeft: "from-red-600 to-rose-950",
              gemRight: "from-pink-300 to-pink-500",
              route: "/anniversary-cakes" 
            },
            { 
              name: "Photo Cakes", 
              img: categoryPhoto, 
              textColor: "text-cyan-300",
              bgGrad: "bg-gradient-to-br from-[#092B30] via-[#051B1F] to-[#020E10]",
              glowColor: "bg-cyan-500",
              gemLeft: "from-cyan-400 to-cyan-600",
              gemRight: "from-blue-200 to-cyan-300",
              route: "/shop?category=photo" 
            },
            { 
              name: "Custom Cakes", 
              img: categoryCustom, 
              textColor: "text-amber-300 font-bold",
              bgGrad: "bg-gradient-to-br from-[#332200] via-[#221600] to-[#110B00]",
              glowColor: "bg-amber-500",
              gemLeft: "from-amber-400 to-amber-600",
              gemRight: "from-orange-400 to-red-500",
              route: "/custom-order" 
            },
            { 
              name: "Dessert Boxes", 
              img: categoryDessert, 
              textColor: "text-orange-300",
              bgGrad: "bg-gradient-to-br from-[#331808] via-[#210E04] to-[#120701]",
              glowColor: "bg-orange-500",
              gemLeft: "from-orange-400 to-orange-600",
              gemRight: "from-yellow-200 to-orange-300",
              route: "/desserts" 
            },
            { 
              name: "Cupcakes", 
              img: categoryCupcakes, 
              textColor: "text-blue-300",
              bgGrad: "bg-gradient-to-br from-[#0B1E3B] via-[#061226] to-[#030914]",
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
              <div className={`relative w-20 h-20 min-[400px]:w-24 min-[400px]:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center ${cat.bgGrad} p-1 md:p-1.5 shadow-[0_8px_25px_rgba(0,0,0,0.5)] ring-1 ring-[#DFB15B]/30 transition-all duration-300 group-hover:shadow-[0_12px_35px_rgba(223,177,91,0.3)] group-hover:scale-105`}>
                <div className="w-[88%] h-[88%] rounded-full overflow-hidden shadow-inner relative z-10 bg-[#18191e]">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none rounded-full" />
                </div>
                
                <div className={`absolute -inset-0.5 rounded-full ${cat.glowColor} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm`} />
                <div className={`absolute bottom-0.5 left-0.5 w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br ${cat.gemLeft} border border-white/20 shadow-md z-20 transition-transform duration-300 group-hover:scale-110`} />
                <div className={`absolute bottom-1.5 right-0.5 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br ${cat.gemRight} border border-white/20 shadow-md z-20 transition-transform duration-300 group-hover:scale-115`} />
              </div>
              <div className="text-center mt-3">
                <span className={`text-[11px] min-[400px]:text-[12px] sm:text-[13px] md:text-[14px] font-extrabold tracking-tight text-center transition-colors group-hover:text-[#DFB15B] line-clamp-1 ${cat.textColor}`}>
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
            <h2 className="text-2xl md:text-3xl font-black text-[#FFFDFB] tracking-tight">
              Best Sellers
            </h2>
            <span className="text-[#DFB15B] text-xl font-bold">〰</span>
          </div>
          <button 
            onClick={() => { playBtnTap(); navigate('/shop'); }}
            className="text-[#DFB15B] hover:text-amber-300 font-extrabold text-[14px] uppercase tracking-wider transition-colors border border-[#DFB15B]/30 hover:border-[#DFB15B]/60 px-5 py-2 rounded-full bg-[#18191e]/80 backdrop-blur-sm"
          >
            View All
          </button>
        </div>

        {/* Dynamic Responsive grid for Best Sellers */}
        {liveProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 pt-2">
            {liveProducts.slice(0, 5).map((prod) => (
              <motion.div
                key={prod.id}
                whileHover={{ y: -8 }}
                onClick={() => { playBtnTap(); navigate(`/product/${prod.id}`); }}
                className="w-full bg-[#18191e]/90 backdrop-blur-md border border-[#DFB15B]/20 rounded-[20px] sm:rounded-[28px] overflow-hidden p-2.5 sm:p-3 shadow-lg hover:shadow-2xl hover:border-[#DFB15B]/50 transition-all duration-300 text-left flex flex-col justify-between cursor-pointer text-white"
              >
                <div>
                  <div className="relative aspect-square rounded-[16px] sm:rounded-[22px] overflow-hidden mb-2.5 sm:mb-3.5 bg-slate-900">
                    <span className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 bg-gradient-to-r from-[#DFB15B] to-amber-500 text-slate-950 font-extrabold text-[7px] sm:text-[9px] uppercase tracking-wider px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-md z-10">
                      {prod.isBestseller ? 'Bestseller' : 'Fresh Baked'}
                    </span>
                    <img 
                      src={prod.images?.[0] || flavorChocolate} 
                      alt={prod.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                      loading="lazy" 
                    />
                  </div>

                  <div className="px-1">
                    <div className="flex items-center gap-1 text-[#DFB15B] text-[10px] sm:text-[11px] font-black mb-0.5 sm:mb-1">
                      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                      <span>{prod.rating || 4.9}</span>
                    </div>
                    <h3 className="font-black text-[11px] sm:text-xs text-white uppercase tracking-wide line-clamp-1">{prod.name}</h3>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 sm:pt-3.5 px-1 mt-2 border-t border-white/10">
                  <span className="font-black text-xs sm:text-sm text-[#DFB15B]">₹{prod.price}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); playBtnTap(); navigate(`/product/${prod.id}`); }}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#DFB15B] text-slate-950 font-bold flex items-center justify-center hover:bg-amber-300 transition-all shadow-sm active:scale-90"
                  >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 pt-2">
            {[
              { 
                id: "bestseller-1", 
                name: "Chocolate Truffle", 
                price: 699, 
                rating: 4.9,
                img: flavorChocolate, 
                tag: "Bestseller",
              },
              { 
                id: "bestseller-2", 
                name: "Red Velvet Bliss", 
                price: 699, 
                rating: 4.9,
                img: flavorStrawberry, 
                tag: "Bestseller",
              },
              { 
                id: "bestseller-3", 
                name: "Butterscotch Crunch", 
                price: 699, 
                rating: 4.8,
                img: flavorMango, 
                tag: "Bestseller",
              },
              { 
                id: "bestseller-4", 
                name: "Blueberry Cheesecake", 
                price: 749, 
                rating: 4.9,
                img: flavorBlueberry, 
                tag: "Premium Choice",
              },
              { 
                id: "bestseller-5", 
                name: "Ferrero Rocher", 
                price: 799, 
                rating: 4.9,
                img: flavorBlackForest, 
                tag: "Chef Signature",
              }
            ].map((prod) => (
              <motion.div
                key={prod.id}
                whileHover={{ y: -8 }}
                onClick={() => { playBtnTap(); navigate(`/shop`); }}
                className="w-full bg-[#18191e]/90 backdrop-blur-md border border-[#DFB15B]/20 rounded-[20px] sm:rounded-[28px] overflow-hidden p-2.5 sm:p-3 shadow-lg hover:shadow-2xl hover:border-[#DFB15B]/50 transition-all duration-300 text-left flex flex-col justify-between cursor-pointer text-white"
              >
                <div>
                  <div className="relative aspect-square rounded-[16px] sm:rounded-[22px] overflow-hidden mb-2.5 sm:mb-3.5 bg-slate-900">
                    {prod.tag && (
                      <span className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 bg-gradient-to-r from-[#DFB15B] to-amber-500 text-slate-950 font-extrabold text-[7px] sm:text-[9px] uppercase tracking-wider px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-md z-10">
                        {prod.tag}
                      </span>
                    )}
                    <img src={prod.img} alt={prod.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>

                  <div className="px-1">
                    <div className="flex items-center gap-1 text-[#DFB15B] text-[10px] sm:text-[11px] font-black mb-0.5 sm:mb-1">
                      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                      <span>{prod.rating}</span>
                    </div>
                    <h3 className="font-black text-[11px] sm:text-xs text-white uppercase tracking-wide line-clamp-1">{prod.name}</h3>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 sm:pt-3.5 px-1 mt-2 border-t border-white/10">
                  <span className="font-black text-xs sm:text-sm text-[#DFB15B]">₹{prod.price}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); playBtnTap(); navigate(`/shop`); }}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#DFB15B] text-slate-950 font-bold flex items-center justify-center hover:bg-amber-300 transition-all shadow-sm active:scale-90"
                  >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
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
            <h2 className="text-3xl md:text-4xl font-black text-[#FFFDFB] tracking-tight">
              Why CakeUrban?
            </h2>
            {/* Wavy line decorator symbol */}
            <span className="text-[#DFB15B] text-2xl md:text-3xl font-bold font-sans">〰</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 justify-center">
          {[
            { title: "Premium Ingredients", icon: Leaf, color: "bg-emerald-500/20 text-emerald-400" },
            { title: "Hygienically Prepared", icon: ShieldCheck, color: "bg-purple-500/20 text-purple-400" },
            { title: "Loved by Thousands", icon: Star, color: "bg-amber-500/20 text-amber-400" },
            { title: "Made with Passion", icon: Heart, color: "bg-pink-500/20 text-pink-400" },
            { title: "Secure Payments", icon: Lock, color: "bg-blue-500/20 text-blue-400" }
          ].map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className={`rounded-3xl bg-[#18191e]/90 backdrop-blur-md border border-[#DFB15B]/20 p-6 shadow-lg hover:shadow-xl hover:border-[#DFB15B]/50 transition-all duration-300 flex flex-col items-center text-center space-y-4 text-white ${index === 4 ? 'col-span-2 md:col-span-1' : ''}`}
              >
                <div className={`w-14 h-14 rounded-2xl ${metric.color} flex items-center justify-center shrink-0 shadow-inner`}>
                  <IconComponent className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h4 className="text-[14px] md:text-[15px] font-black text-white tracking-tight leading-snug">
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
          <h2 className="text-3xl md:text-4xl font-black text-[#FFFDFB] tracking-tight">
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
              className="bg-[#18191e]/90 backdrop-blur-md rounded-[24px] p-6 border border-[#DFB15B]/20 shadow-lg hover:shadow-2xl hover:border-[#DFB15B]/50 flex flex-col justify-between text-left h-full transition-all duration-300 text-white"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img src={item.avatar} alt={item.name} className="w-11 h-11 rounded-full object-cover border-2 border-[#DFB15B]/40" loading="lazy" />
                  <h4 className="text-[15px] font-black text-white tracking-tight">{item.name}</h4>
                </div>
                <p className="text-sm text-slate-300 font-semibold leading-relaxed">
                  "{item.text}"
                </p>
              </div>

              <div className="flex items-center gap-1 text-[#DFB15B] pt-4 border-t border-white/10 mt-4">
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
          <h2 className="text-3xl md:text-4xl font-black text-[#FFFDFB] tracking-tight">
            Follow Us On Instagram
          </h2>
          <p className="text-sm font-black text-[#DFB15B] tracking-wide">
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
              className="rounded-2xl overflow-hidden aspect-square shadow-md bg-slate-900 border border-[#DFB15B]/20 cursor-pointer"
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
          SECTION 9: DARK LUXURY GOURMET FOOTER
          --------------------------------------------------------- */}
      <footer className="relative bg-[#0b0c0f] text-slate-300 border-t border-[#DFB15B]/20 pt-16 pb-12 overflow-hidden font-sans z-20">
        <div className="max-w-[1720px] mx-auto px-6 xl:px-12 2xl:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/10">
          
          {/* Column 1: Brand details */}
          <div className="space-y-5 text-left">
            <div className="flex items-center gap-2">
              <span className="font-serif italic text-2xl font-bold text-[#DFB15B] tracking-tight">CakeUrban</span>
            </div>
            <p className="text-sm text-slate-400 font-semibold leading-relaxed">
              Made with love, delivered with happiness. Handcrafted confections made to light up your special moments.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4 text-left">
            <h4 className="text-[13px] font-black uppercase tracking-[2px] text-[#DFB15B]">Quick Links</h4>
            <ul className="space-y-2.5 text-xs font-black text-slate-300">
              <li><button onClick={() => { playBtnTap(); navigate('/'); }} className="hover:text-[#DFB15B] transition-colors">Home</button></li>
              <li><button onClick={() => { playBtnTap(); navigate('/shop'); }} className="hover:text-[#DFB15B] transition-colors">Cakes</button></li>
              <li><button onClick={() => { playBtnTap(); navigate('/shop?tab=occasions'); }} className="hover:text-[#DFB15B] transition-colors">Occasions</button></li>
              <li><button onClick={() => { playBtnTap(); navigate('/custom-order'); }} className="hover:text-[#DFB15B] transition-colors">Custom Cakes</button></li>
              <li><button onClick={() => { playBtnTap(); navigate('/corporate-catering'); }} className="hover:text-[#DFB15B] transition-colors text-amber-400">Corporate Orders 💼</button></li>
              <li><button onClick={() => { playBtnTap(); navigate('/seo-directory'); }} className="hover:text-amber-400 transition-colors font-bold flex items-center gap-1">SEO Map Directory 📍</button></li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="space-y-4 text-left">
            <h4 className="text-[13px] font-black uppercase tracking-[2px] text-[#DFB15B]">Customer Service</h4>
            <ul className="space-y-2.5 text-xs font-black text-slate-300">
              <li><button onClick={() => { playBtnTap(); navigate('/contact'); }} className="hover:text-[#DFB15B] transition-colors">Contact Us</button></li>
              <li><button onClick={() => { playBtnTap(); navigate('/contact'); }} className="hover:text-[#DFB15B] transition-colors">FAQ</button></li>
              <li><button onClick={() => { playBtnTap(); navigate('/contact'); }} className="hover:text-[#DFB15B] transition-colors">Delivery Info</button></li>
              <li><button onClick={() => { playBtnTap(); navigate('/contact'); }} className="hover:text-[#DFB15B] transition-colors">Return Policy</button></li>
              <li><button onClick={() => { playBtnTap(); navigate('/contact'); }} className="hover:text-[#DFB15B] transition-colors">Terms & Conditions</button></li>
            </ul>
          </div>

          {/* Column 4: Connect With Us & Socials */}
          <div className="space-y-5 text-left">
            <h4 className="text-[13px] font-black uppercase tracking-[2px] text-[#DFB15B]">Connect With Us</h4>
            
            {/* Socials row */}
            <div className="flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#DFB15B]/20 text-[#DFB15B] hover:bg-[#DFB15B] hover:text-slate-950 flex items-center justify-center transition-all">
                <Instagram className="w-4.5 h-4.5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#DFB15B]/20 text-[#DFB15B] hover:bg-[#DFB15B] hover:text-slate-950 flex items-center justify-center transition-all">
                <Heart className="w-4.5 h-4.5" />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#DFB15B]/20 text-[#DFB15B] hover:bg-[#DFB15B] hover:text-slate-950 flex items-center justify-center transition-all">
                <Sparkles className="w-4.5 h-4.5" />
              </a>
            </div>

            <div className="space-y-2 text-xs font-black text-slate-400 pt-1">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#DFB15B]" />
                <span>+91 123 456 7890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#DFB15B]" />
                <span>hello@cakeurban.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Sub bottom with Pay brands logos */}
        <div className="max-w-[1720px] mx-auto px-6 xl:px-12 2xl:px-16 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-[11px] font-black gap-4">
          <span>&copy; 2024 CakeUrban. All Rights Reserved.</span>
          <div className="flex items-center gap-3">
            <span className="bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded font-black text-[9px] tracking-widest">VISA</span>
            <span className="bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded font-black text-[9px] tracking-widest">MC</span>
            <span className="bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded font-black text-[9px] tracking-widest">UPI</span>
            <span className="bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded font-black text-[9px] tracking-widest">RUPAY</span>
            <span className="bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded font-black text-[9px] tracking-widest">PAYPAL</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
