import React, { useState } from 'react';
import { 
  Instagram, 
  Facebook, 
  Mail, 
  MapPin, 
  Phone, 
  Heart, 
  Sparkles, 
  ChevronRight, 
  Compass, 
  Clock, 
  ShieldCheck, 
  Lock, 
  Youtube, 
  Linkedin, 
  Send,
  HelpCircle,
  TrendingUp,
  FileText,
  RotateCcw,
  Truck,
  MessageSquare,
  Map,
  ChevronDown,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { playBtnTap, playSuccessChime } from '../lib/sound';

export function Footer() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setSubmitting(true);
    playBtnTap();
    
    setTimeout(() => {
      setSubmitting(false);
      setEmail('');
      playSuccessChime();
      toast.success('Welcome to the elite club! ✨', {
        description: 'You are now subscribed to our luxury special releases & hampers.'
      });
    }, 1200);
  };

  return (
    <footer className="relative bg-gradient-to-br from-[#0b051a] via-[#040816] to-[#010103] text-[#f3ddd6]/80 border-t border-white/5 overflow-hidden font-sans z-20">
      
      {/* Aesthetic Mesh Gradient Glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none select-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-pink-600/5 rounded-full blur-[140px] pointer-events-none select-none" />

      {/* =========================================================
          NEWSLETTER & BRAND STORY UPPER PRE-FOOTER
          ========================================================= */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 border-b border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 text-left space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-pink-400 fill-pink-400/20 animate-pulse" />
              <span className="text-[9px] uppercase font-black tracking-wider text-pink-300">CakeUrban Elite Experience</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
              Subscribe for Chef's Special Releases & Weekend Hampers
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md font-medium">
              Join our gourmet mailing list to receive complimentary surprise candles, private recipes, and limited edition seasonal pre-access passes.
            </p>
          </div>

          <div className="lg:col-span-7">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your premium email address..." 
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 h-12 px-5 rounded-2xl text-xs font-semibold focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/20 transition-all duration-300 shadow-inner" 
                />
              </div>
              <button 
                type="submit"
                disabled={submitting}
                className="relative overflow-hidden group h-12 px-8 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-pink-500/10 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Join Elite Club</span>
                    <Send className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* =========================================================
          MAIN MULTI-COLUMN SECTIONS (Columns 01 to 05)
          ========================================================= */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-10">
        
        {/* Column 01: Brand Story & Mission */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-4 text-left space-y-6">
          <Link to="/" className="inline-block" onClick={playBtnTap}>
            <h4 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">CakeUrban</span>
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
            </h4>
          </Link>
          <p className="text-slate-400 leading-relaxed text-xs sm:text-sm font-medium">
            We are dedicated to elevating metropolitan dessert experiences. Handcrafting 100% eggless, pure-dairy Belgian chocolate cakes, luxury tiered wedding monuments, and artisanal gift caskets delivered immaculate across Faridabad, Gurgaon, Noida, and Delhi.
          </p>
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block leading-none">Our Core Manifesto</span>
            <p className="text-xs italic text-pink-400 font-semibold flex items-center gap-1">
              "Pure Dairy. Pure Vegetarian. No chemical fillers. Flawless transit."
            </p>
          </div>
        </div>

        {/* Column 02: Quick Links */}
        <div className="lg:col-span-2 text-left space-y-4">
          <h5 className="text-[10px] font-black uppercase tracking-widest text-pink-400 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" /> Quick Links
          </h5>
          <div className="space-y-2.5 text-xs text-slate-400 font-bold">
            <Link to="/" className="block hover:text-white hover:translate-x-1 transition-all duration-200">Home Atelier</Link>
            <Link to="/shop" className="block hover:text-white hover:translate-x-1 transition-all duration-200">Shop Boutique</Link>
            <Link to="/birthday-cakes" className="block hover:text-white hover:translate-x-1 transition-all duration-200">Birthday Cakes</Link>
            <Link to="/wedding-cakes" className="block hover:text-white hover:translate-x-1 transition-all duration-200">Wedding Tiers</Link>
            <Link to="/cupcakes" className="block hover:text-white hover:translate-x-1 transition-all duration-200">Gourmet Cupcakes</Link>
            <Link to="/desserts" className="block hover:text-white hover:translate-x-1 transition-all duration-200">French Desserts</Link>
            <Link to="/custom-order" className="block hover:text-pink-400 hover:translate-x-1 transition-all duration-200 text-pink-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-pink-500 fill-pink-500/20" /> Custom Cakes
            </Link>
          </div>
        </div>

        {/* Column 03: Customer Service */}
        <div className="lg:col-span-2 text-left space-y-4">
          <h5 className="text-[10px] font-black uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" /> Customer Service
          </h5>
          <div className="space-y-2.5 text-xs text-slate-400 font-bold">
            <Link to="/track-order" className="block hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-1">
              <Truck className="w-3 h-3 text-purple-400" /> Track Live Order
            </Link>
            <Link to="/shop" className="block hover:text-white hover:translate-x-1 transition-all duration-200">FAQs & Help</Link>
            <Link to="/legal" className="block hover:text-white hover:translate-x-1 transition-all duration-200">Return & Refunds</Link>
            <Link to="/legal" className="block hover:text-white hover:translate-x-1 transition-all duration-200">Shipping Policies</Link>
            <Link to="/legal" className="block hover:text-white hover:translate-x-1 transition-all duration-200">Privacy Policy</Link>
            <Link to="/legal" className="block hover:text-white hover:translate-x-1 transition-all duration-200">Terms of Use</Link>
            <Link to="/reviews" className="block text-amber-400 hover:text-amber-300 hover:translate-x-1 transition-all duration-200 flex items-center gap-1">
              ❤️ Guest Reviews
            </Link>
          </div>
        </div>

        {/* Column 04: Contact Details */}
        <div className="lg:col-span-2 text-left space-y-4">
          <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Contact Atelier
          </h5>
          <div className="space-y-3.5 text-xs text-slate-400 font-bold">
            <div className="flex items-start gap-2">
              <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <a href="tel:+917318531953" className="block hover:text-white text-white font-mono">+91 73185 31953</a>
                <span className="text-[10px] text-slate-500 font-medium block">Oven Hotline Desk</span>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <a href="mailto:hello@cakeurban.com" className="block hover:text-white font-mono truncate">hello@cakeurban.com</a>
                <span className="text-[10px] text-slate-500 font-medium block">Corporate & Support</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[11px] font-medium leading-relaxed">
                  Sector 16, Faridabad, Haryana, 121002
                </p>
                <a 
                  href="https://maps.google.com/?q=Sector+16,+Faridabad" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] text-pink-400 hover:underline"
                >
                  <Map className="w-3 h-3" /> Find on Google Map
                </a>
              </div>
            </div>

            <div className="pt-1 text-[10px] text-slate-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Ovens hot 9:00 AM - Midnight</span>
            </div>
          </div>
        </div>

        {/* Column 05: Follow Us Social Icons */}
        <div className="lg:col-span-2 text-left space-y-4">
          <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Follow Us
          </h5>
          <p className="text-slate-500 text-xs font-semibold">
            Watch live baking reels, glaze cascades, and fondant carving on our social portfolios:
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { icon: Instagram, href: 'https://instagram.com', color: 'hover:bg-gradient-to-tr hover:from-yellow-500 hover:via-pink-500 hover:to-purple-500' },
              { icon: Facebook, href: 'https://facebook.com', color: 'hover:bg-blue-600' },
              { icon: Youtube, href: 'https://youtube.com', color: 'hover:bg-red-600' },
              { icon: Linkedin, href: 'https://linkedin.com', color: 'hover:bg-blue-700' },
              { icon: MessageSquare, href: 'https://wa.me/917318531953', color: 'hover:bg-emerald-600', isWa: true },
            ].map((social, idx) => {
              const Icon = social.icon;
              return (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={playBtnTap}
                  className={`w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:scale-115 hover:shadow-lg transition-all duration-300 ${social.color}`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>

      </div>

      {/* =========================================================
          COLLAPSIBLE GOOGLE SEO LOCATIONS MAP AND CRAWL DATA DIRECTORY
          ========================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 border-t border-white/5 pt-6">
        <button
          onClick={() => { setSeoOpen(!seoOpen); playBtnTap(); }}
          className="w-full flex items-center justify-between text-left py-2 hover:text-white transition-colors cursor-pointer group"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#DFB15B] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#DFB15B] animate-pulse" />
            Culinary SEO & Local Sector Directories (National Indexing)
          </span>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 group-hover:text-[#DFB15B]">
            <span>{seoOpen ? 'Hide Directory' : 'Expand Directory'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${seoOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        <AnimatePresence>
          {seoOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="py-6 border-t border-white/5 mt-4 text-left space-y-6">
                
                {/* 4 columns of micro-sectors */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-[11px] font-semibold italic text-slate-400">
                  <div className="space-y-1.5">
                    <span className="font-black text-white text-[10px] block not-italic uppercase tracking-wider text-pink-400">Faridabad Sectors</span>
                    <Link to="/cake-delivery-faridabad-sector-31" className="block hover:text-pink-400 transition">Sector 31 & NIT (15km radius)</Link>
                    <Link to="/cake-delivery-faridabad-sector-15" className="block hover:text-pink-400 transition">Sector 15 Faridabad</Link>
                    <Link to="/bakery-in-faridabad" className="block hover:text-pink-400 transition">Sector 14 & 21 Faridabad</Link>
                    <Link to="/best-cake-in-greenfield-faridabad" className="block hover:text-pink-400 transition font-bold text-pink-400">Best Cake in Greenfield</Link>
                  </div>
                  <div className="space-y-1.5">
                    <span className="font-black text-white text-[10px] block not-italic uppercase tracking-wider text-purple-400">Noida Sectors</span>
                    <Link to="/cake-delivery-noida-sector-62" className="block hover:text-purple-400 transition">Noida Sector 62</Link>
                    <Link to="/bakery-in-noida" className="block hover:text-purple-400 transition">Noida Sector 15 & 18</Link>
                    <Link to="/designer-cakes-in-noida" className="block hover:text-purple-400 transition">Noida Sector 137 & 150</Link>
                  </div>
                  <div className="space-y-1.5">
                    <span className="font-black text-white text-[10px] block not-italic uppercase tracking-wider text-indigo-400">Gurgaon Sectors</span>
                    <Link to="/cake-delivery-gurgaon-dlf" className="block hover:text-indigo-400 transition">DLF Phase 1-5 Gurgaon</Link>
                    <Link to="/custom-cakes-in-gurgaon" className="block hover:text-indigo-400 transition">Golf Course Road</Link>
                    <Link to="/bakery-in-gurgaon" className="block hover:text-indigo-400 transition">Sohna Road Gurgaon</Link>
                  </div>
                  <div className="space-y-1.5">
                    <span className="font-black text-white text-[10px] block not-italic uppercase tracking-wider text-amber-400">Delhi Areas</span>
                    <Link to="/cake-delivery-delhi-dwarka" className="block hover:text-amber-400 transition">Dwarka Delhi</Link>
                    <Link to="/bakery-in-delhi" className="block hover:text-amber-400 transition">South Delhi (Saket, GK)</Link>
                    <Link to="/birthday-cakes-delhi" className="block hover:text-amber-400 transition">West Delhi (Punjabi Bagh)</Link>
                  </div>
                </div>

                {/* Micro keyword clouds */}
                <div className="border-t border-white/5 pt-6 space-y-2">
                  <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest block">Metropolitan Indexing Keywords</span>
                  <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] text-slate-500 font-semibold leading-relaxed">
                    <Link to="/online-cake-delivery-in-faridabad" className="hover:text-[#DE9088] transition">Online Cake Delivery in Faridabad</Link> |
                    <Link to="/best-cake-shop-in-faridabad" className="hover:text-[#DE9088] transition text-pink-400 font-bold">Best Cake Shop in Faridabad</Link> |
                    <Link to="/designer-cakes-in-faridabad" className="hover:text-[#DE9088] transition">Designer Cakes in Faridabad</Link> |
                    <Link to="/customized-cakes-faridabad" className="hover:text-[#DE9088] transition text-amber-400 font-bold">Customized Cakes Faridabad</Link> |
                    <Link to="/midnight-cake-delivery-in-faridabad" className="hover:text-[#DE9088] transition">Midnight Cake Delivery in Faridabad</Link> |
                    <Link to="/eggless-cake-delivery-faridabad" className="hover:text-[#DE9088] transition">Eggless Cake Delivery Faridabad</Link> |
                    <Link to="/birthday-cake-in-faridabad" className="hover:text-[#DE9088] transition">Birthday Cake in Faridabad</Link> |
                    <Link to="/bento-cake-in-faridabad" className="hover:text-[#DE9088] transition text-pink-400 font-bold">Bento Cake in Faridabad</Link> |
                    <Link to="/chocolate-truffle-cake-faridabad" className="hover:text-[#DE9088] transition">Chocolate Truffle Cake Faridabad</Link> |
                    <Link to="/pinata-cake-with-hammer-faridabad" className="hover:text-[#DE9088] transition font-bold text-indigo-400">Pinata Cake with Hammer Faridabad</Link> |
                    <Link to="/2-tier-wedding-cake-faridabad" className="hover:text-[#DE9088] transition">2 Tier Wedding Cake Faridabad</Link> |
                    <Link to="/kids-birthday-cake-faridabad" className="hover:text-[#DE9088] transition">Kids Birthday Cake Faridabad</Link> |
                    <Link to="/customized-theme-cakes-faridabad" className="hover:text-[#DE9088] transition font-semibold text-[#DFB15B]">Customized Theme Cakes Faridabad</Link> |
                    <Link to="/live-cake-studio-faridabad" className="hover:text-[#DE9088] transition text-[#DFB15B] font-bold">Live Cake Studio Faridabad</Link> |
                    <Link to="/urgent-cake-delivery-faridabad" className="hover:text-amber-200 transition font-bold text-amber-200">Urgent Cake Delivery Faridabad</Link> |
                    <Link to="/sugar-free-cake-faridabad" className="hover:text-[#DE9088] transition">Sugar Free Cake Faridabad</Link> |
                    <Link to="/seo-directory" className="hover:text-white text-white font-bold underline">Gourmet SEO Map Directory</Link>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* =========================================================
          BOTTOM STRIP: PAYMENTS, BADGES & COPYRIGHT
          ========================================================= */}
      <div className="bg-black/60 py-8 border-t border-white/5 text-[10px] text-slate-500 font-semibold relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="space-y-1.5 text-center md:text-left">
            <p>© 2026 CakeUrban Confections. Elite Pastry Group. All rights reserved.</p>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-[9px] uppercase tracking-wider text-slate-600 font-black">
              <Link to="/legal" className="hover:text-white transition">Terms & Conditions</Link>
              <span>•</span>
              <Link to="/legal" className="hover:text-white transition">Privacy Policy</Link>
              <span>•</span>
              <Link to="/legal" className="hover:text-white transition">Delivery & Refund Policies</Link>
            </div>
          </div>

          {/* Secure SSL Badges */}
          <div className="flex items-center gap-4 text-slate-400 bg-white/5 border border-white/10 px-4 py-1.5 rounded-xl">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[9px] uppercase tracking-wider font-bold">FSSAI Certified</span>
            </div>
            <div className="w-px h-3.5 bg-white/10" />
            <div className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-[9px] uppercase tracking-wider font-bold">256-Bit SSL Encrypted</span>
            </div>
          </div>

          {/* Custom vector-styled Payment icons */}
          <div className="space-y-2 text-center md:text-right">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Safe Checkout Gateway</span>
            <div className="flex items-center gap-1.5 flex-wrap justify-center md:justify-end">
              {['Visa', 'Mastercard', 'UPI', 'PhonePe', 'Google Pay', 'Paytm'].map((pay) => (
                <span 
                  key={pay} 
                  className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[9px] font-black uppercase text-slate-300 tracking-wider hover:bg-white/10 hover:text-white hover:border-pink-500/30 transition-all cursor-default"
                >
                  {pay}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

    </footer>
  );
}
