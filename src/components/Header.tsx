import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Heart, 
  ChevronDown, 
  MapPin, 
  ShoppingBag, 
  Gift,
  ArrowRight,
  Smile,
  Bell,
  Truck,
  Share2,
  HelpCircle,
  Ticket,
  Mic,
  SlidersHorizontal,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  Check,
  LayoutDashboard,
  LogOut,
  Settings,
  Flame,
  Award,
  Compass,
  Star,
  Home,
  Grid,
  Palette,
  Mail,
  Lock,
  Smartphone,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { useUI, useCart } from '../lib/store';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth } from '../lib/firebase';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { toast } from 'sonner';
import { playSuccessChime, playBtnTap, playSlidePop } from '../lib/sound';
import { useTheme, THEME_PRESETS } from '../lib/theme';
import { CategoryCollection } from '../types';

// ---------------------------------------------------------
// TYPING PLACEHOLDER ANIMATION FOR SEARCH BAR
// ---------------------------------------------------------
const SEARCH_PLACEHOLDERS = [
  "Search Cakes, Flavours, Occasions...",
  "Try 'Belgian Hazelnut Truffle'",
  "Try 'Heart Shaped Red Velvet'",
  "Search 'Eggless Blue Berry'",
  "Try 'Custom 3-Tier Wedding Cake'"
];

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, isAdmin } = useAuth();
  
  // Cart state from Zustand
  const cartItems = useCart((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const updateQuantity = useCart((state) => state.updateQuantity);
  const removeItem = useCart((state) => state.removeItem);
  const cartTotal = useCart((state) => state.getTotal());

  // Component UI States
  const { activeTheme, setTheme, setGlobalTheme } = useTheme();
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  
  // Interactive search state
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Red Velvet", "Bento Cake", "Eggless Truffle"
  ]);
  const [voiceActive, setVoiceActive] = useState(false);
  const [typingPlaceholder, setTypingPlaceholder] = useState('');
  
  // Load products dynamically for search suggestions
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [liveCategories, setLiveCategories] = useState<CategoryCollection[]>([]);

  // Real-time categories listener for Dynamic MegaMenu & Mobile Navigation
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        if (!snapshot.empty) {
          const cats = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as CategoryCollection));
          cats.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
          setLiveCategories(cats);
        } else {
          setLiveCategories([]);
        }
      },
      (err) => {
        console.warn("Real-time header categories snapshot warning:", err);
      }
    );
    return () => unsub();
  }, []);

  const birthdayCategories = React.useMemo(() => {
    return liveCategories.filter(c => c.group === 'birthday' || (!c.group && (c.title.toLowerCase().includes('birthday') || c.title.toLowerCase().includes('chocolate') || c.title.toLowerCase().includes('forest') || c.title.toLowerCase().includes('velvet') || c.title.toLowerCase().includes('butterscotch') || c.title.toLowerCase().includes('fruit') || c.title.toLowerCase().includes('eggless'))));
  }, [liveCategories]);

  const designerCategories = React.useMemo(() => {
    return liveCategories.filter(c => c.group === 'designer' || (!c.group && (c.title.toLowerCase().includes('designer') || c.title.toLowerCase().includes('wedding') || c.title.toLowerCase().includes('anniversary') || c.title.toLowerCase().includes('kids') || c.title.toLowerCase().includes('photo') || c.title.toLowerCase().includes('custom') || c.title.toLowerCase().includes('corporate') || c.title.toLowerCase().includes('theme'))));
  }, [liveCategories]);

  const trendingCategories = React.useMemo(() => {
    return liveCategories.filter(c => c.group === 'trending' || (!c.group && (c.title.toLowerCase().includes('trend') || c.title.toLowerCase().includes('hamper') || c.title.toLowerCase().includes('bento') || c.title.toLowerCase().includes('special') || c.title.toLowerCase().includes('cupcake') || c.title.toLowerCase().includes('cookie') || c.title.toLowerCase().includes('dessert') || c.title.toLowerCase().includes('top'))));
  }, [liveCategories]);

  const otherCategories = React.useMemo(() => {
    return liveCategories.filter(c => 
      !birthdayCategories.some(b => b.id === c.id) &&
      !designerCategories.some(d => d.id === c.id) &&
      !trendingCategories.some(t => t.id === c.id)
    );
  }, [liveCategories, birthdayCategories, designerCategories, trendingCategories]);

  const featuredBannerCollection = React.useMemo(() => {
    return liveCategories.find(c => c.isFeatured) || liveCategories[0];
  }, [liveCategories]);

  const getCategoryDestination = (cat: CategoryCollection) => {
    const name = cat.title.toLowerCase();
    if (name.includes('wedding')) return '/wedding-cakes';
    if (name.includes('anniversary')) return '/anniversary-cakes';
    if (name.includes('birthday')) return '/birthday-cakes';
    if (name.includes('kids')) return '/kids-cakes';
    if (name.includes('cookies')) return '/cookies';
    if (name.includes('cupcakes')) return '/cupcakes';
    if (name.includes('desserts')) return '/desserts';
    if (name.includes('hampers')) return '/gift-hampers';
    if (name.includes('custom') || name.includes('bespoke')) return '/custom-order';
    return `/shop?category=${encodeURIComponent(cat.title)}`;
  };

  // Mini Login / Signup states inside the profile popover
  const [miniAuthMode, setMiniAuthMode] = useState<'login' | 'signup'>('login');
  const [miniEmail, setMiniEmail] = useState('');
  const [miniPassword, setMiniPassword] = useState('');
  const [miniFullName, setMiniFullName] = useState('');
  const [miniPhone, setMiniPhone] = useState('');
  const [miniLoading, setMiniLoading] = useState(false);
  const [showMiniPass, setShowMiniPass] = useState(false);

  const handleMiniLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (miniLoading) return;
    if (!miniEmail || !miniPassword) {
      toast.error("Please fill in all fields.");
      return;
    }
    setMiniLoading(true);
    playBtnTap();
    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      await signInWithEmailAndPassword(auth, miniEmail.trim(), miniPassword);
      playSuccessChime();
      toast.success("Successfully logged in!");
      setProfileDropdownOpen(false);
      // Clear fields
      setMiniEmail('');
      setMiniPassword('');
    } catch (err: any) {
      console.error(err);
      let errMsg = "Login failed. Please verify email and password.";
      if (err.code === 'auth/user-not-found') {
        errMsg = "User account not found. Please sign up.";
      } else if (err.code === 'auth/wrong-password') {
        errMsg = "Incorrect password. Please try again.";
      } else if (err.code === 'auth/invalid-email') {
        errMsg = "Please enter a valid email address.";
      }
      toast.error(errMsg);
    } finally {
      setMiniLoading(false);
    }
  };

  const handleMiniSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (miniLoading) return;
    if (!miniEmail || !miniPassword || !miniFullName || !miniPhone) {
      toast.error("All fields are compulsory.");
      return;
    }
    if (miniPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    const cleaned = miniPhone.replace(/\D/g, '');
    if (cleaned.length < 10 || cleaned.length > 13) {
      toast.error("Please enter a valid phone number (10-13 digits).");
      return;
    }
    setMiniLoading(true);
    playBtnTap();
    try {
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      const { doc, setDoc } = await import('firebase/firestore');
      const userCred = await createUserWithEmailAndPassword(auth, miniEmail.trim(), miniPassword);
      const u = userCred.user;

      // Save user details to Firestore
      const userRef = doc(db, 'users', u.uid);
      await setDoc(userRef, {
        uid: u.uid,
        email: miniEmail.trim(),
        displayName: miniFullName.trim(),
        phoneNumber: miniPhone.trim(),
        role: 'customer',
        createdAt: new Date().toISOString()
      });

      playSuccessChime();
      toast.success("Account created successfully!");
      setProfileDropdownOpen(false);
      // Clear fields
      setMiniEmail('');
      setMiniPassword('');
      setMiniFullName('');
      setMiniPhone('');
    } catch (err: any) {
      console.error(err);
      let errMsg = "Failed to create account.";
      if (err.code === 'auth/email-already-in-use') {
        errMsg = "This email is already registered.";
      } else if (err.code === 'auth/invalid-email') {
        errMsg = "Please enter a valid email address.";
      }
      toast.error(errMsg);
    } finally {
      setMiniLoading(false);
    }
  };

  // 1. Typing animation loop
  useEffect(() => {
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId: any;

    const tick = () => {
      const currentWord = SEARCH_PLACEHOLDERS[wordIndex];
      if (isDeleting) {
        setTypingPlaceholder(currentWord.substring(0, charIndex - 1));
        charIndex--;
      } else {
        setTypingPlaceholder(currentWord.substring(0, charIndex + 1));
        charIndex++;
      }

      let speed = isDeleting ? 30 : 80;

      if (!isDeleting && charIndex === currentWord.length) {
        speed = 1800; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % SEARCH_PLACEHOLDERS.length;
        speed = 300; // Delay before typing next word
      }

      timeoutId = setTimeout(tick, speed);
    };

    tick();
    return () => clearTimeout(timeoutId);
  }, []);

  // Fetch db products on mount to populate live search suggestions
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(collection(db, 'products'));
        setDbProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        // Fallback demo list
        setDbProducts([
          { id: '1', name: 'Belgian Chocolate Feuilletine', price: 1499, images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=200'] },
          { id: '2', name: 'Royal Red Velvet Rose', price: 1299, images: ['https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&q=80&w=200'] },
          { id: '3', name: 'Sicilian Pistachio Blossom', price: 1699, images: ['https://images.unsplash.com/photo-1511018556340-d16986a1c194?auto=format&fit=crop&q=80&w=200'] }
        ]);
      }
    };
    fetchProducts();
    
    // Sync wishlist from localstorage
    const syncWishlist = () => {
      try {
        const items = localStorage.getItem('cakeurban_wishlist') || '[]';
        setWishlistItems(JSON.parse(items));
      } catch (e) {
        setWishlistItems([]);
      }
    };
    syncWishlist();
    window.addEventListener('storage', syncWishlist);
    return () => window.removeEventListener('storage', syncWishlist);
  }, []);

  // Audio helper wrappers
  const triggerBtnSound = () => {
    try { playBtnTap(); } catch (e) {}
  };
  const triggerSlideSound = () => {
    try { playSlidePop(); } catch (e) {}
  };
  const triggerSuccessSound = () => {
    try { playSuccessChime(); } catch (e) {}
  };

  // Simulated Voice Activation
  const handleVoiceSearch = () => {
    triggerBtnSound();
    setVoiceActive(true);
    toast.info("Listening for cake craving... 🎙️", {
      description: "Say flavor or cake type (e.g. 'Eggless chocolate cake')"
    });
    setTimeout(() => {
      setVoiceActive(false);
      setSearchQuery("Belgian Chocolate");
      toast.success("Voice recognized: 'Belgian Chocolate' ✨");
      triggerSuccessSound();
    }, 2500);
  };

  // Filter products live
  const searchResults = searchQuery.trim() 
    ? dbProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <>
      {/* =========================================================
          DESKTOP HEADER (Deep Slate, Champagne Gold & Rich Cream Luxury Theme)
          ========================================================= */}
      <header className="sticky top-0 z-[80] w-full bg-[#10141C]/85 backdrop-blur-[24px] border-b border-[#DFB15B]/20 shadow-[0_10px_40px_rgba(0,0,0,0.3)] h-[88px] transition-all duration-300">
        <div className="max-w-[1720px] mx-auto h-full px-4 md:px-8 xl:px-12 2xl:px-16 flex items-center justify-between relative">
          
          {/* 1. BRAND LOGO (Left) */}
          <Link 
            to="/" 
            onClick={triggerBtnSound}
            className="flex items-center gap-2.5 group select-none shrink-0"
          >
            {/* Champagne Gold Icon */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#DFB15B] via-[#F3D389] to-[#C99738] flex items-center justify-center shadow-[0_8px_20px_rgba(223,177,91,0.25)] group-hover:scale-105 group-hover:rotate-3 group-hover:shadow-[0_10px_25px_rgba(223,177,91,0.4)] transition-all duration-300">
              <Sparkles className="w-5.5 h-5.5 text-[#10141C] fill-[#10141C]/20" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[24px] font-black tracking-tight leading-none text-[#FFFDFB] group-hover:text-[#DFB15B] transition-colors duration-200">
                Cake<span className="bg-gradient-to-r from-[#DFB15B] to-[#F3D389] bg-clip-text text-transparent">Urban</span>
              </span>
              <span className="text-[9px] font-bold tracking-[0.22em] uppercase text-[#DFB15B]/70 mt-1">
                Artisan Confectionery
              </span>
            </div>
          </Link>

          {/* 2. NAVIGATION LINKS (Center - Rich Cream Text with Champagne Gold Accents) */}
          <nav className="hidden lg:flex items-center gap-[24px] xl:gap-[32px] h-full z-25">
            {/* Home link */}
            <div className="relative h-full flex items-center">
              <Link 
                to="/" 
                onClick={triggerBtnSound}
                className={`text-[15px] font-medium transition-colors duration-250 py-6 ${location.pathname === '/' ? 'text-[#DFB15B] font-semibold' : 'text-[#FFFDFB]/80 hover:text-[#DFB15B]'}`}
              >
                Home
              </Link>
              {location.pathname === '/' && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#DFB15B] rounded-full shadow-[0_0_10px_rgba(223,177,91,0.6)]" />
              )}
            </div>

            {/* Cakes trigger link with mega menu interaction */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => { setMegaMenuOpen(true); triggerSlideSound(); }}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button className={`text-[15px] font-medium transition-colors duration-250 flex items-center gap-1 py-6 ${location.pathname.startsWith('/shop') || megaMenuOpen ? 'text-[#DFB15B]' : 'text-[#FFFDFB]/80 hover:text-[#DFB15B]'}`}>
                Cakes
                <ChevronDown className={`w-4 h-4 text-[#DFB15B]/70 transition-transform duration-300 ${megaMenuOpen ? 'rotate-180 text-[#DFB15B]' : ''}`} />
              </button>
              <div className={`absolute bottom-0 left-0 right-0 h-[3px] bg-[#DFB15B] rounded-full shadow-[0_0_10px_rgba(223,177,91,0.6)] transition-all duration-300 origin-left ${megaMenuOpen ? 'scale-x-100' : 'scale-x-0'}`} />
            </div>

            {/* Occasions, Custom Cakes, Combos, About Us */}
            {[
              { label: 'Occasions', href: '/shop?tab=occasions' },
              { label: 'Custom Cakes', href: '/custom-order' },
              { label: 'Combos', href: '/shop?category=combos' },
              { label: 'About Us', href: '/about' }
            ].map((link) => {
              const isActive = location.pathname + location.search === link.href || location.pathname === link.href;
              return (
                <div key={link.label} className="relative h-full flex items-center">
                  <Link 
                    to={link.href}
                    onClick={triggerBtnSound}
                    className={`text-[15px] font-medium transition-colors duration-250 py-6 ${isActive ? 'text-[#DFB15B] font-semibold' : 'text-[#FFFDFB]/80 hover:text-[#DFB15B]'}`}
                  >
                    {link.label}
                  </Link>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#DFB15B] rounded-full shadow-[0_0_10px_rgba(223,177,91,0.6)]" />
                  )}
                  {!isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#DFB15B] rounded-full scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-left shadow-[0_0_10px_rgba(223,177,91,0.6)]" />
                  )}
                </div>
              );
            })}
          </nav>

          {/* 3. SEARCH CONTAINER & ACTIONS (Right) */}
          <div className="flex items-center gap-4">
            
            {/* Live Search Capsule */}
            <div className="relative hidden xl:block">
              <div className={`flex items-center bg-[#181F2B]/90 border transition-all duration-300 rounded-full px-4 h-12 w-[340px] ${searchFocused ? 'w-[420px] bg-[#1E2636] border-[#DFB15B]/60 shadow-[0_0_20px_rgba(223,177,91,0.15)]' : 'border-[#DFB15B]/20'}`}>
                <Search className="w-5 h-5 text-[#DFB15B] shrink-0" />
                <input 
                  type="text" 
                  placeholder={typingPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => { setSearchFocused(true); triggerSlideSound(); }}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
                  className="w-full bg-transparent border-none text-[14px] text-[#FFFDFB] placeholder-[#FFFDFB]/40 focus:outline-none focus:ring-0 px-2.5 h-full"
                />
                
                {/* Mic & Filter Action Icons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button 
                    onClick={handleVoiceSearch}
                    className={`p-1.5 rounded-full hover:bg-white/10 text-[#DFB15B] transition-colors ${voiceActive ? 'text-[#DFB15B] animate-pulse bg-[#DFB15B]/20' : ''}`}
                    title="Voice Search"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => navigate('/shop')}
                    className="p-1.5 rounded-full hover:bg-white/10 text-[#DFB15B] transition-colors"
                    title="Filters"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* SEARCH DROPDOWN SEARCH SUGGESTIONS */}
              <AnimatePresence>
                {searchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute top-14 right-0 w-[420px] bg-[#141923]/98 backdrop-blur-xl border border-[#DFB15B]/25 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-3xl p-5 z-50 text-left space-y-5"
                  >
                    {/* Live Results */}
                    {searchQuery.trim() ? (
                      <div className="space-y-3">
                        <span className="text-[10px] font-black text-[#DFB15B] uppercase tracking-widest block">MATCHING CAKES</span>
                        {searchResults.length > 0 ? (
                          <div className="space-y-2 max-h-[250px] overflow-y-auto">
                            {searchResults.map((p) => (
                              <Link 
                                key={p.id} 
                                to={`/product/${p.id}`}
                                className="flex items-center gap-3 p-2 rounded-2xl hover:bg-[#DFB15B]/10 transition-colors group"
                              >
                                <img src={p.images?.[0]} className="w-12 h-12 rounded-xl object-cover" />
                                <div>
                                  <h4 className="text-xs font-black text-[#FFFDFB] group-hover:text-[#DFB15B]">{p.name}</h4>
                                  <p className="text-[10px] font-bold text-[#DFB15B]">₹{p.price}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-[#FFFDFB]/50 font-medium italic">No direct matches. Try looking for "Chocolate" or "Velvet"</p>
                        )}
                      </div>
                    ) : (
                      <>
                        {/* Recent Searches */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-black text-[#DFB15B]/70 uppercase tracking-widest block">RECENT SEARCHES</span>
                          <div className="flex flex-wrap gap-2">
                            {recentSearches.map((tag) => (
                              <button 
                                key={tag} 
                                onClick={() => setSearchQuery(tag)}
                                className="bg-[#1C2330] hover:bg-[#DFB15B]/20 hover:text-[#DFB15B] text-[#FFFDFB]/80 font-semibold text-xs px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1 border border-white/5"
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Popular Searches */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-black text-[#DFB15B]/70 uppercase tracking-widest block">TRENDING CAKES</span>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {["Bespoke Wedding Cakes", "Pinata Hammer Cakes", "Fresh Fruit Gateaux", "Minimal Bento Desserts"].map((item) => (
                              <button 
                                key={item} 
                                onClick={() => setSearchQuery(item.split(' ')[0])}
                                className="text-left py-1.5 px-3 rounded-xl hover:bg-[#DFB15B]/10 text-[#FFFDFB]/80 hover:text-[#DFB15B] font-medium transition-colors flex items-center gap-1.5"
                              >
                                <Flame className="w-3.5 h-3.5 text-[#DFB15B] fill-[#DFB15B]/20" />
                                {item}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ACTION ICONS (48x48 Glass Circles in Slate & Champagne Gold) */}
            
            {/* Search Trigger for smaller screens */}
            <button 
              onClick={() => { setSearchFocused(!searchFocused); triggerSlideSound(); }}
              className="xl:hidden w-12 h-12 rounded-full bg-[#181F2B] border border-[#DFB15B]/20 flex items-center justify-center text-[#DFB15B] hover:bg-[#DFB15B]/20 transition-all shadow-sm hover:scale-105"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* 0. Luxury Theme Switcher trigger */}
            <div className="relative">
              <button 
                onClick={() => { setThemeDropdownOpen(!themeDropdownOpen); triggerSlideSound(); }}
                className="w-12 h-12 rounded-full bg-[#181F2B] border border-[#DFB15B]/20 flex items-center justify-center text-[#DFB15B] hover:bg-[#DFB15B]/20 transition-all shadow-sm relative hover:scale-105"
                title="Change Luxury Theme"
              >
                <Palette className="w-5 h-5" />
                <span className="absolute -bottom-0.5 right-1 text-[10px]">{activeTheme.icon}</span>
              </button>

              <AnimatePresence>
                {themeDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 bg-[#141923]/98 backdrop-blur-xl border border-[#DFB15B]/25 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-3xl p-4 z-50 text-left space-y-3"
                  >
                    <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                      <div>
                        <span className="text-xs font-black text-[#FFFDFB] uppercase tracking-wider block">LUXURY THEMES</span>
                        <span className="text-[10px] text-[#DFB15B] font-medium">5 Curated Color Palettes</span>
                      </div>
                      <button 
                        onClick={() => setThemeDropdownOpen(false)}
                        className="text-white/40 hover:text-white text-xs"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                      {THEME_PRESETS.map((preset) => {
                        const isCurrent = activeTheme.id === preset.id;
                        return (
                          <button
                            key={preset.id}
                            onClick={() => {
                              setTheme(preset.id);
                              playBtnTap();
                              toast.success(`Theme switched to: ${preset.name}!`, { icon: preset.icon });
                              setThemeDropdownOpen(false);
                            }}
                            className={`w-full p-3 rounded-2xl border transition-all text-left flex items-center justify-between gap-3 cursor-pointer ${
                              isCurrent
                                ? 'border-[#DFB15B] bg-[#DFB15B]/15 shadow-sm'
                                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-xl">{preset.icon}</span>
                              <div>
                                <div className="text-xs font-bold text-[#FFFDFB] flex items-center gap-1.5">
                                  {preset.name}
                                  {isCurrent && <span className="text-[8px] bg-[#DFB15B] text-[#10141C] font-black px-1.5 py-0.2 rounded-full uppercase">Active</span>}
                                </div>
                                <span className="text-[10px] text-white/50 block line-clamp-1">{preset.description}</span>
                              </div>
                            </div>
                            {/* Palette preview dots */}
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: preset.bg }} />
                              <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: preset.accent }} />
                              <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: preset.text }} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 1. Wishlist trigger */}
            <button 
              onClick={() => { setWishlistOpen(true); triggerSlideSound(); }}
              className="w-12 h-12 rounded-full bg-[#181F2B] border border-[#DFB15B]/20 flex items-center justify-center text-[#DFB15B] hover:bg-[#DFB15B]/20 transition-all shadow-sm relative hover:scale-105"
              title="Saved Cakes"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#DFB15B] text-[#10141C] text-[9px] font-black rounded-full h-4.5 w-4.5 flex items-center justify-center border-2 border-[#10141C] animate-scale-up">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* 2. Notifications Trigger */}
            <div className="relative">
              <button 
                onClick={() => { setNotificationsOpen(!notificationsOpen); triggerSlideSound(); }}
                className="w-12 h-12 rounded-full bg-[#181F2B] border border-[#DFB15B]/20 flex items-center justify-center text-[#DFB15B] hover:bg-[#DFB15B]/20 transition-all shadow-sm relative hover:scale-105"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 bg-[#DFB15B] text-[#10141C] text-[8px] font-black rounded-full h-3 w-3 flex items-center justify-center" />
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute right-0 mt-3 w-80 bg-[#141923]/98 backdrop-blur-xl border border-[#DFB15B]/25 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-3xl p-5 z-50 text-left space-y-4"
                  >
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-xs font-black text-[#FFFDFB] uppercase tracking-wider">NOTIFICATIONS</span>
                      <span className="text-[10px] font-bold text-[#DFB15B]">2 New</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex gap-2.5 text-xs">
                        <div className="w-8 h-8 rounded-full bg-[#DFB15B]/20 flex items-center justify-center text-[#DFB15B] shrink-0 mt-0.5">
                          <Gift className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-extrabold text-[#FFFDFB]">Your Birthday Code Active!</p>
                          <p className="text-[10.5px] text-[#FFFDFB]/60 mt-0.5 font-medium">Use code <strong className="text-[#DFB15B]">BIRTHDAY20</strong> to claim 20% off your custom cake.</p>
                        </div>
                      </div>
                      <div className="flex gap-2.5 text-xs">
                        <div className="w-8 h-8 rounded-full bg-[#DFB15B]/20 flex items-center justify-center text-[#DFB15B] shrink-0 mt-0.5">
                          <Truck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-extrabold text-[#FFFDFB]">Premium Delivery Dispatch</p>
                          <p className="text-[10.5px] text-[#FFFDFB]/60 mt-0.5 font-medium">Standard orders now ship in climate-locked premium boxes across NCR.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. Cart Trigger (Champagne Gold Capsule) */}
            <button 
              onClick={() => { setCartDrawerOpen(true); triggerSlideSound(); }}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#DFB15B] to-[#C99738] flex items-center justify-center text-[#10141C] hover:brightness-110 transition-all shadow-[0_5px_15px_rgba(223,177,91,0.35)] relative hover:scale-105 cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#10141C] text-[#DFB15B] text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border border-[#DFB15B] shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* 4. User Profile with Premium Dropdown */}
            <div className="relative">
              <button 
                onClick={() => { setProfileDropdownOpen(!profileDropdownOpen); triggerSlideSound(); }}
                className="w-12 h-12 rounded-full overflow-hidden border border-[#DFB15B]/25 hover:border-[#DFB15B] shadow-sm hover:scale-105 transition-all flex items-center justify-center bg-[#181F2B]"
              >
                {user ? (
                  <img 
                    src={(profile as any)?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"} 
                    className="w-full h-full object-cover" 
                    alt="Profile"
                  />
                ) : (
                  <User className="w-5 h-5 text-[#DFB15B] hover:text-[#FFFDFB] transition-colors" />
                )}
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  user ? (
                    /* Authenticated Dropdown */
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="absolute right-0 mt-3 w-64 bg-[#141923]/98 backdrop-blur-xl border border-[#DFB15B]/25 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-3xl p-2 z-50 text-left font-sans"
                    >
                      <div className="p-4 border-b border-white/10 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#DFB15B] to-[#C99738] text-[#10141C] font-black flex items-center justify-center text-sm shadow">
                          {profile?.displayName ? profile.displayName.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-black text-[#FFFDFB] uppercase tracking-wider truncate">
                            {profile?.displayName || "Verified User"}
                          </h4>
                          <p className="text-[10px] text-[#DFB15B]/80 truncate">{user?.email}</p>
                        </div>
                      </div>

                      <div className="p-2 space-y-0.5">
                        {[
                          { label: 'My Orders', icon: ShoppingBag, href: '/my-orders' },
                          { label: 'Wishlist', icon: Heart, href: '/profile' },
                          { label: 'Saved Addresses', icon: MapPin, href: '/profile' },
                          { label: 'Rewards & Offers', icon: Ticket, href: '/rewards' },
                          { label: 'My Profile', icon: User, href: '/profile' },
                          { label: 'Settings', icon: Settings, href: '/profile' },
                        ].map((item) => (
                          <Link 
                            key={item.label}
                            to={item.href}
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-black uppercase tracking-widest text-[#FFFDFB]/80 hover:bg-[#DFB15B]/15 hover:text-[#DFB15B] rounded-2xl transition-all"
                          >
                            <item.icon className="w-4 h-4 text-[#DFB15B]" />
                            <span>{item.label}</span>
                          </Link>
                        ))}

                        {isAdmin && (
                          <Link 
                            to="/admin"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-black uppercase tracking-widest text-[#DFB15B] hover:bg-[#DFB15B]/20 rounded-2xl transition-all"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}

                        <div className="h-px bg-white/10 my-1" />

                        <button 
                          onClick={async () => {
                            setProfileDropdownOpen(false);
                            try { await signOut(auth); } catch (e) {}
                            toast.success("Successfully logged out from Cake Urban");
                            navigate('/');
                          }}
                          className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 rounded-2xl transition-all text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    /* Beautiful responsive mini auth form inside the dropdown */
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-[32px] p-5 z-50 text-left font-sans"
                    >
                      <div className="mb-4 pb-3 border-b border-slate-100 flex justify-between items-center">
                        <div>
                          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                            {miniAuthMode === 'login' ? 'Gourmet Login' : 'Create Account'}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-medium">CakeUrban Security Portal</p>
                        </div>
                        <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
                      </div>

                      <form onSubmit={miniAuthMode === 'login' ? handleMiniLogin : handleMiniSignup} className="space-y-3">
                        {miniAuthMode === 'signup' && (
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500 block">Full Name</label>
                            <div className="relative flex items-center">
                              <User className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
                              <input
                                type="text"
                                required
                                placeholder="Your Name"
                                value={miniFullName}
                                onChange={(e) => setMiniFullName(e.target.value)}
                                className="w-full h-10 rounded-xl border border-slate-100 pl-9 pr-3 bg-slate-50 text-xs font-semibold focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-slate-800"
                              />
                            </div>
                          </div>
                        )}

                        {miniAuthMode === 'signup' && (
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500 block">Phone Number</label>
                            <div className="relative flex items-center">
                              <Smartphone className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
                              <input
                                type="tel"
                                required
                                placeholder="Phone Number"
                                maxLength={15}
                                value={miniPhone}
                                onChange={(e) => setMiniPhone(e.target.value.replace(/[^\d+]/g, ''))}
                                className="w-full h-10 rounded-xl border border-slate-100 pl-9 pr-3 bg-slate-50 text-xs font-semibold focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-slate-800 font-mono"
                              />
                            </div>
                          </div>
                        )}

                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500 block">Email Address</label>
                          <div className="relative flex items-center">
                            <Mail className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
                            <input
                              type="email"
                              required
                              placeholder="your.email@example.com"
                              value={miniEmail}
                              onChange={(e) => setMiniEmail(e.target.value)}
                              className="w-full h-10 rounded-xl border border-slate-100 pl-9 pr-3 bg-slate-50 text-xs font-semibold focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-slate-800"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500 block">Password</label>
                          <div className="relative flex items-center">
                            <Lock className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
                            <input
                              type={showMiniPass ? "text" : "password"}
                              required
                              placeholder="••••••"
                              value={miniPassword}
                              onChange={(e) => setMiniPassword(e.target.value)}
                              className="w-full h-10 rounded-xl border border-slate-100 pl-9 pr-9 bg-slate-50 text-xs font-semibold focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-slate-800"
                            />
                            <button
                              type="button"
                              onClick={() => setShowMiniPass(!showMiniPass)}
                              className="absolute right-3 text-slate-400 hover:text-slate-600"
                            >
                              {showMiniPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={miniLoading}
                          className="w-full h-11 mt-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 text-white font-black tracking-[0.15em] text-[10px] uppercase flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all"
                        >
                          {miniLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : (miniAuthMode === 'login' ? 'SECURE LOG IN' : 'CREATE ACCOUNT')}
                        </button>
                      </form>

                      <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                        <p className="text-[11px] text-slate-500 font-medium">
                          {miniAuthMode === 'login' ? "Don't have an account?" : "Already registered?"}{' '}
                          <button
                            type="button"
                            onClick={() => setMiniAuthMode(miniAuthMode === 'login' ? 'signup' : 'login')}
                            className="text-pink-600 font-black uppercase tracking-wider hover:underline ml-1"
                          >
                            {miniAuthMode === 'login' ? 'Sign Up' : 'Log In'}
                          </button>
                        </p>

                        <div className="mt-3 flex justify-center">
                          <Link
                            to={miniAuthMode === 'login' ? '/login' : '/signup'}
                            onClick={() => setProfileDropdownOpen(false)}
                            className="text-[9px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-[0.15em] underline"
                          >
                            Or open full screen portal ↗
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Hamburger Trigger */}
            <button 
              onClick={() => { setMobileMenuOpen(true); triggerSlideSound(); }}
              className="lg:hidden w-12 h-12 rounded-full bg-slate-50 border border-slate-100/50 flex items-center justify-center text-slate-600 hover:bg-pink-50 hover:text-pink-600 transition-all shadow-sm"
            >
              <Menu className="w-6 h-6" />
            </button>

          </div>
        </div>
      </header>

      {/* =========================================================
          LUXURY MEGA MENU (When Hovering "Cakes") - 100% Dynamic & Shopify-like
          ========================================================= */}
      <AnimatePresence>
        {megaMenuOpen && (
          <div 
            className="fixed left-0 right-0 top-[88px] z-50 pointer-events-none"
            onMouseEnter={() => setMegaMenuOpen(true)}
            onMouseLeave={() => setMegaMenuOpen(false)}
          >
            {/* Blurry dim backing layer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-10 pointer-events-auto"
            />

            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} // Tesla ease curve
              className="relative max-w-[1180px] mx-auto bg-white/95 backdrop-blur-[20px] border border-slate-100 shadow-[0_30px_70px_rgba(0,0,0,0.12)] rounded-[32px] p-10 z-20 pointer-events-auto mt-4 grid grid-cols-12 gap-8 text-left"
            >
              {liveCategories.length === 0 ? (
                /* Dynamic Empty / Fresh State with 1-click discovery */
                <div className="col-span-12 py-10 px-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-pink-50 border border-pink-100 flex items-center justify-center mx-auto text-pink-500 shadow-sm">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800">
                    Boutique Collections Studio
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto font-medium">
                    No custom collections added yet. Add collections from the Admin Dashboard or seed luxury presets in one click!
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <Link
                      to="/shop"
                      onClick={() => setMegaMenuOpen(false)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider py-3 px-6 rounded-2xl transition-all"
                    >
                      Browse All Pastries
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMegaMenuOpen(false)}
                        className="bg-pink-500 hover:bg-pink-600 text-white font-black text-xs uppercase tracking-wider py-3 px-6 rounded-2xl shadow-lg transition-all"
                      >
                        + Manage Collections in Admin
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Column 1: Birthday & Classic Collections */}
                  <div className="col-span-3 space-y-4">
                    <span className="text-xs font-black text-pink-500 uppercase tracking-widest block border-b border-slate-50 pb-2">
                      BIRTHDAY & CLASSICS ({birthdayCategories.length})
                    </span>
                    <ul className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                      {(birthdayCategories.length > 0 ? birthdayCategories : liveCategories.slice(0, 6)).map((cat) => {
                        const destination = getCategoryDestination(cat);
                        return (
                          <li key={cat.id || cat.slug || cat.title}>
                            <Link 
                              to={destination}
                              onClick={() => { setMegaMenuOpen(false); playBtnTap(); }}
                              className="group flex items-center justify-between py-1.5 px-2 rounded-xl hover:bg-pink-50/50 text-[14px] font-semibold text-slate-700 hover:text-pink-600 transition-colors"
                            >
                              <span className="flex items-center gap-2 truncate">
                                <span>{cat.icon || '🎂'}</span>
                                <span className="truncate">{cat.title}</span>
                              </span>
                              {cat.badge ? (
                                <span className="text-[9px] font-black uppercase tracking-wider bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">
                                  {cat.badge}
                                </span>
                              ) : (
                                <ArrowRight className="w-3.5 h-3.5 text-pink-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Column 2: Designer & Occasion Collections */}
                  <div className="col-span-3 space-y-4">
                    <span className="text-xs font-black text-purple-600 uppercase tracking-widest block border-b border-slate-50 pb-2">
                      DESIGNER & OCCASIONS ({designerCategories.length})
                    </span>
                    <ul className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                      {(designerCategories.length > 0 ? designerCategories : liveCategories.slice(6, 12)).map((cat) => {
                        const destination = getCategoryDestination(cat);
                        return (
                          <li key={cat.id || cat.slug || cat.title}>
                            <Link 
                              to={destination}
                              onClick={() => { setMegaMenuOpen(false); playBtnTap(); }}
                              className="group flex items-center justify-between py-1.5 px-2 rounded-xl hover:bg-purple-50/50 text-[14px] font-semibold text-slate-700 hover:text-purple-600 transition-colors"
                            >
                              <span className="flex items-center gap-2 truncate">
                                <span>{cat.icon || '✨'}</span>
                                <span className="truncate">{cat.title}</span>
                              </span>
                              {cat.badge ? (
                                <span className="text-[9px] font-black uppercase tracking-wider bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                                  {cat.badge}
                                </span>
                              ) : (
                                <ArrowRight className="w-3.5 h-3.5 text-purple-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Column 3: Large Dynamic Featured Collection Banner */}
                  <div className="col-span-3">
                    <div className="relative rounded-[24px] overflow-hidden bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 h-full min-h-[280px] p-6 text-white flex flex-col justify-between group shadow-md">
                      {/* Subtle background cake image */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 group-hover:scale-105 transition-transform duration-700" 
                        style={{ backgroundImage: `url(${featuredBannerCollection?.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400'})` }}
                      />
                      
                      <div className="space-y-2 relative z-10">
                        <span className="bg-white/20 text-white font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full inline-block backdrop-blur-md">
                          {featuredBannerCollection?.badge || 'FEATURED COLLECTION'}
                        </span>
                        <h4 className="text-2xl font-black tracking-tight leading-tight pt-1 line-clamp-2">
                          {featuredBannerCollection?.title || 'Luxury Artisan Cakes'}
                        </h4>
                        <p className="text-[11px] text-pink-100 font-semibold leading-relaxed line-clamp-2">
                          {featuredBannerCollection?.description || 'Handcrafted bespoke confectionary baked fresh with gourmet single-origin ingredients.'}
                        </p>
                      </div>

                      <Link 
                        to={featuredBannerCollection ? getCategoryDestination(featuredBannerCollection) : '/shop'}
                        onClick={() => { setMegaMenuOpen(false); playBtnTap(); }}
                        className="bg-white hover:bg-pink-50 text-pink-600 font-black text-xs uppercase tracking-wider py-3.5 px-5 rounded-2xl shadow-lg relative z-10 transition-all text-center flex items-center justify-center gap-1.5"
                      >
                        <span>Explore {featuredBannerCollection?.title || 'Collection'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Column 4: Trending Now & Specials */}
                  <div className="col-span-3 space-y-4">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-widest block border-b border-slate-50 pb-2">
                      TRENDING & SPECIALS ({trendingCategories.length + otherCategories.length})
                    </span>
                    <ul className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                      {[...trendingCategories, ...otherCategories].map((item) => {
                        const destination = getCategoryDestination(item);
                        return (
                          <li key={item.id || item.slug || item.title}>
                            <Link 
                              to={destination}
                              onClick={() => { setMegaMenuOpen(false); playBtnTap(); }}
                              className="flex items-center justify-between py-1.5 px-2.5 rounded-xl hover:bg-slate-50 text-[14px] font-semibold text-slate-700 hover:text-slate-900 transition-all group"
                            >
                              <span className="flex items-center gap-2 truncate">
                                <span>{item.icon || '🔥'}</span>
                                <span className="truncate">{item.title}</span>
                              </span>
                              {item.badge ? (
                                <span className="bg-amber-100 text-amber-800 font-black text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full scale-90">
                                  {item.badge}
                                </span>
                              ) : (
                                <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================
          WISHLIST DRAWER (Saved Treats Panel)
          ========================================================= */}
      <AnimatePresence>
        {wishlistOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setWishlistOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-[440px] bg-white border-l border-slate-100 h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10"
            >
              <div>
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                    <h3 className="font-black text-lg text-slate-800">Saved Treats</h3>
                  </div>
                  <button onClick={() => setWishlistOpen(false)} className="p-1.5 rounded-full hover:bg-slate-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  {wishlistItems.length > 0 ? (
                    <div className="space-y-4">
                      {wishlistItems.map((item: any, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-3xl relative group hover:border-pink-300 transition-colors text-left"
                        >
                          <img src={item.images?.[0]} className="w-16 h-16 rounded-2xl object-cover" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-black text-slate-800 truncate uppercase tracking-wider">{item.name}</h4>
                            <p className="text-[11px] font-black text-pink-600 mt-1">₹{item.price}</p>
                            <Link 
                              to={`/product/${item.id}`}
                              onClick={() => setWishlistOpen(false)}
                              className="text-[9px] font-black uppercase tracking-wider mt-2 inline-flex items-center gap-1 text-pink-500"
                            >
                              Order Bespoke <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                          <button 
                            onClick={() => {
                              const fresh = wishlistItems.filter((_, fIdx) => fIdx !== idx);
                              localStorage.setItem('cakeurban_wishlist', JSON.stringify(fresh));
                              setWishlistItems(fresh);
                              toast.success("Savour block deleted!");
                            }}
                            className="p-1 text-slate-400 hover:text-rose-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center space-y-4">
                      <Heart className="w-12 h-12 text-slate-300 mx-auto" />
                      <p className="text-xs text-slate-400 font-bold max-w-xs mx-auto leading-relaxed">
                        No treats saved! Heart bakes in the catalog to prepare your luxury celebration list.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================
          CART DRAWER (Slide Right, Luxury Stripe-like layout)
          ========================================================= */}
      <AnimatePresence>
        {cartDrawerOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-[480px] bg-white border-l border-slate-100 h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10"
            >
              {/* Drawer Header */}
              <div>
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-pink-500" />
                    <h3 className="font-black text-lg text-slate-800">Your Cake Basket</h3>
                  </div>
                  <button onClick={() => setCartDrawerOpen(false)} className="p-1.5 rounded-full hover:bg-slate-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Cart Items List */}
                <div className="p-6 space-y-4">
                  {cartItems.length > 0 ? (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div 
                          key={`${item.id}-${item.selectedWeight}`} 
                          className="flex gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100 text-left relative group"
                        >
                          <img 
                            src={item.images?.[0] || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=150"} 
                            className="w-20 h-20 rounded-2xl object-cover border border-slate-200"
                            alt={item.name}
                          />
                          <div className="flex-1 min-w-0 space-y-1">
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider truncate">{item.name}</h4>
                            <p className="text-[11px] font-bold text-slate-400">
                              Weight: {item.selectedWeight || 1}kg • {item.selectedFlavor || "Classic Vanilla"}
                            </p>
                            
                            {item.cakeMessage && (
                              <p className="text-[10px] bg-pink-100/30 text-pink-600 font-extrabold px-2.5 py-1 rounded-xl inline-block">
                                Message: "{item.cakeMessage}"
                              </p>
                            )}

                            <div className="flex items-center justify-between pt-2">
                              {/* Quantity Stepper */}
                              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full p-1 shadow-sm">
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedWeight)}
                                  className="w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-xs font-black px-1.5">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedWeight)}
                                  className="w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <span className="text-xs font-black text-slate-800">
                                ₹{(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <button 
                            onClick={() => removeItem(item.id, item.selectedWeight)}
                            className="absolute top-2 right-2 p-1 text-slate-300 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-24 text-center space-y-5">
                      <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto" />
                      <div className="space-y-1 px-4">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Basket is Empty</h4>
                        <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed italic">
                          Explore our gorgeous cake gallery to add premium delicacies to your celebrations.
                        </p>
                      </div>
                      <Link 
                        to="/shop" 
                        onClick={() => setCartDrawerOpen(false)}
                        className="inline-block px-6 py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] uppercase tracking-widest font-black rounded-full transition-all shadow-md hover:brightness-110"
                      >
                        Browse Cakes Now
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Drawer Sticky Bottom Summary & Checkout */}
              {cartItems.length > 0 && (
                <div className="border-t border-slate-100 p-6 bg-slate-50/80 backdrop-blur-md space-y-4">
                  {/* Promo Input */}
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="ENTER COUPON CODE..."
                      className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-2 text-xs font-black placeholder-slate-400 focus:outline-none focus:border-pink-300 text-slate-800"
                    />
                    <button className="bg-slate-800 hover:bg-slate-900 text-white font-black text-[10px] uppercase tracking-wider px-5 rounded-2xl">
                      Apply
                    </button>
                  </div>

                  {/* Pricing lines */}
                  <div className="space-y-2 text-xs text-slate-500 font-semibold text-left">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-slate-800 font-bold">₹{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Premium Climate Delivery</span>
                      <span className="text-emerald-600 font-black">FREE</span>
                    </div>
                    <div className="h-px bg-slate-200 my-2" />
                    <div className="flex justify-between text-sm text-slate-800 font-black uppercase tracking-wider">
                      <span>Estimated Total</span>
                      <span className="text-pink-600">₹{cartTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <Link 
                    to="/checkout"
                    onClick={() => { setCartDrawerOpen(false); triggerBtnSound(); }}
                    className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-widest py-4.5 rounded-2xl text-center shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <span>Proceed To Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================
          MOBILE MENU (Slide out Left Category panel)
          ========================================================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden flex">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-[320px] bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 p-6 text-left"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black tracking-tight text-slate-800">
                    Cake<span className="text-pink-500">Urban</span>
                  </span>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-full hover:bg-slate-100">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Animated Navigation Items */}
                <div className="space-y-1">
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Link 
                      to="/"
                      onClick={() => { setMobileMenuOpen(false); triggerBtnSound(); }}
                      className="block py-2.5 text-[15px] font-bold text-slate-700 hover:text-pink-600 transition-colors"
                    >
                      Home
                    </Link>
                  </motion.div>

                  {/* Dynamic Collections if added */}
                  {liveCategories.map((cat, index) => {
                    const href = getCategoryDestination(cat);
                    return (
                      <motion.div 
                        key={cat.id || cat.title}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index + 1) * 0.03 }}
                      >
                        <Link 
                          to={href}
                          onClick={() => { setMobileMenuOpen(false); triggerBtnSound(); }}
                          className="flex items-center justify-between py-2.5 text-[15px] font-semibold text-slate-600 hover:text-pink-600 transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <span>{cat.icon || '🍰'}</span>
                            <span>{cat.title}</span>
                          </span>
                          {cat.badge && (
                            <span className="text-[9px] font-black uppercase tracking-wider bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">
                              {cat.badge}
                            </span>
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}

                  {/* Core Fallback Items if no categories yet */}
                  {liveCategories.length === 0 && (
                    <>
                      <Link to="/birthday-cakes" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-[15px] font-semibold text-slate-600 hover:text-pink-600">🎂 Birthday Cakes</Link>
                      <Link to="/anniversary-cakes" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-[15px] font-semibold text-slate-600 hover:text-pink-600">💖 Anniversary Cakes</Link>
                      <Link to="/wedding-cakes" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-[15px] font-semibold text-slate-600 hover:text-pink-600">👰 Wedding Cakes</Link>
                      <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-[15px] font-semibold text-slate-600 hover:text-pink-600">🍰 Explore All Bakes</Link>
                    </>
                  )}

                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link 
                      to="/custom-order"
                      onClick={() => { setMobileMenuOpen(false); triggerBtnSound(); }}
                      className="block py-2.5 text-[15px] font-bold text-slate-700 hover:text-pink-600 transition-colors border-t border-slate-100 mt-2 pt-3"
                    >
                      🎨 Custom Bespoke Cake Studio
                    </Link>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <Link 
                      to="/shop?tab=offers"
                      onClick={() => { setMobileMenuOpen(false); triggerBtnSound(); }}
                      className="block py-2.5 text-[15px] font-bold text-pink-600 hover:text-pink-700 transition-colors"
                    >
                      🏷️ Exclusive Offers & Scratch Cards
                    </Link>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link 
                      to="/contact"
                      onClick={() => { setMobileMenuOpen(false); triggerBtnSound(); }}
                      className="block py-2.5 text-[15px] font-bold text-slate-600 hover:text-pink-600 transition-colors"
                    >
                      📞 Contact & Support
                    </Link>
                  </motion.div>
                </div>
              </div>

              {/* Quick info inside mobile sidebar footer */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <p className="text-[10px] font-bold text-slate-400 tracking-[1.5px] uppercase">
                  DELIVERING DELIGHTS DAILY
                </p>
                <div className="flex gap-2">
                  <Link 
                    to="/shop" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-black text-[10px] uppercase tracking-wider py-3 rounded-xl text-center shadow"
                  >
                    Bake Studio
                  </Link>
                  <Link 
                    to="/contact" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-[10px] uppercase tracking-wider py-3 rounded-xl text-center"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================
          MOBILE BOTTOM STICKY NAVIGATION (Mockup matching design)
          ========================================================= */}
      <div className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-[90] w-[92%] select-none">
        <nav className="relative bg-white border border-slate-100 rounded-[28px] px-4 py-2 flex items-center justify-between shadow-[0_12px_35px_rgba(0,0,0,0.12)]">
          {[
            { label: 'Home', icon: Home, href: '/' },
            { label: 'Categories', icon: Grid, href: '/shop' },
            { label: 'Custom', icon: Palette, href: '/custom-order' },
            { label: 'Orders', icon: ShoppingBag, href: '/my-orders', badge: cartCount },
            { label: 'Profile', icon: User, href: '/profile' }
          ].map((item, index) => {
            const isActive = item.href ? location.pathname === item.href : false;
            
            const btnContent = (
              <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-2xl relative transition-all duration-300 ${isActive ? 'text-pink-500 font-extrabold' : 'text-slate-400 font-medium'}`}>
                <item.icon className={`w-5.5 h-5.5 mb-1 transition-transform ${isActive ? 'scale-110 text-pink-500' : ''}`} />
                <span className="text-[9px] tracking-tight uppercase">{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="absolute top-0 right-1 bg-pink-500 text-white text-[9px] font-black rounded-full h-4.5 w-4.5 flex items-center justify-center border border-white shadow-sm">
                    {item.badge}
                  </span>
                ) : null}
              </div>
            );

            return (
              <Link key={index} to={item.href} onClick={triggerBtnSound} className="focus:outline-none flex-1 flex justify-center">
                {btnContent}
              </Link>
            );
          })}
        </nav>
      </div>

    </>
  );
}

// Keep a backward compatible empty export to make sure search modal import doesn't crash existing code
export function AISearchModal() {
  return null;
}
