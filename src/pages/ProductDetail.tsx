import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, collection, query, where, orderBy, getDocs, addDoc, serverTimestamp, limit } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Product, Review } from '../types';
import { useCart } from '../lib/store';
import { useAuth } from '../hooks/useAuth';
import { 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Clock, 
  Minus, 
  Plus, 
  MessageSquare, 
  Send, 
  Sparkles, 
  ArrowRight, 
  Heart, 
  Share2, 
  Copy, 
  Check, 
  Upload, 
  AlertCircle, 
  HelpCircle, 
  ChevronDown, 
  SlidersHorizontal,
  ChevronRight,
  Sparkle,
  Gift,
  ShoppingBag,
  Maximize2,
  Play
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import SEO from '../components/SEO';
import { playSuccessChime, playBtnTap, playSlidePop } from '../lib/sound';
import { handleImageError } from '../lib/utils';
import { PREMIUM_PRODUCTS_POOL } from '../lib/shopData';

// =========================================================
// FALLBACK STATIC MASTERPIECE PRODUCT (IF FIRESTORE IS EMPTY)
// =========================================================
const DEFAULT_LUXURY_CAKE: Product = {
  id: 'belgian-chocolate-supreme',
  name: 'Belgian Chocolate Supreme',
  description: 'A structural masterpiece of single-origin Belgian chocolate ganache, layered between micro-crumb moist dark chocolate sponge layers, finished with hand-burnished 24-karat edible gold leaf and a velvet cacao dust spray. Curated to perfection for discerning culinary elites.',
  price: 799,
  categories: ['Cakes', 'Birthday Cakes', 'Luxury Collection'],
  occasions: ['Birthday', 'Anniversary', 'Gala'],
  flavors: ['Belgian Chocolate', 'Ferrero Rocher Hazelnut', 'Lotus Biscoff Crumble', 'Royal Red Velvet', 'Sicilian Pistachio', 'Wild Blueberry Bloom'],
  images: [
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1511018556340-d16986a1c194?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1505976378723-9726be53e2c0?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&q=80&w=800'
  ],
  stockStatus: 'in-stock',
  isCustomizable: true,
  isBestseller: true,
  weights: [0.5, 1.0, 1.5, 2.0, 3.0]
};

// =========================================================
// CUSTOM SPRINGY ANIMATED HOOK FOR VALUES (TICKING EFFECTS)
// =========================================================
function useAnimatedValue(target: number, duration: number = 400) {
  const [current, setCurrent] = useState(target);
  useEffect(() => {
    let start: number | null = null;
    const initial = current;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = progress * (2 - progress); // Ease out Quad
      setCurrent(Math.round(initial + (target - initial) * ease));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [target]);
  return current;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  // ---------------------------------------------------------
  // FIREBASE / AUTH STATES
  // ---------------------------------------------------------
  const [user, setUser] = useState<any>(null);
  const [product, setProduct] = useState<Product>(DEFAULT_LUXURY_CAKE);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [userWishlisted, setUserWishlisted] = useState(false);

  // ---------------------------------------------------------
  // INTERACTIVE USER CONFIGURATIONS
  // ---------------------------------------------------------
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState<number>(0.5);
  const [selectedFlavor, setSelectedFlavor] = useState<string>('Belgian Chocolate');
  const [eggless, setEggless] = useState(true);
  const [cakeMessage, setCakeMessage] = useState('');
  const [candles, setCandles] = useState<boolean>(false);
  const [knifeIncluded, setKnifeIncluded] = useState<boolean>(true);
  const [greetingCard, setGreetingCard] = useState<string>('None');

  // New elegant add-on checkboxes matching the hifi visual reference
  const [addonGiftBox, setAddonGiftBox] = useState<boolean>(false);
  const [addonGreetingCard, setAddonGreetingCard] = useState<boolean>(false);
  const [addonExtraChocolate, setAddonExtraChocolate] = useState<boolean>(false);

  // Live countdown timer state for delivery panel
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 14, seconds: 32 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 2, minutes: 15, seconds: 0 }; // Loops nicely
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ---------------------------------------------------------
  // GALLERY STATES
  // ---------------------------------------------------------
  const [activeTab, setActiveTab] = useState<'images' | '360' | 'layers' | 'video' | 'photos'>('images');
  const [activeImage, setActiveImage] = useState<string>(DEFAULT_LUXURY_CAKE.images[0]);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: 'none' });
  const [rotationIndex, setRotationIndex] = useState(0); // For 360 view simulation
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // ---------------------------------------------------------
  // DELIVERY CHECKER STATES
  // ---------------------------------------------------------
  const [pincode, setPincode] = useState('');
  const [checkingDelivery, setCheckingDelivery] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState<{
    sameDay: boolean;
    midnight: boolean;
    express: boolean;
    eta: string;
  } | null>(null);

  // ---------------------------------------------------------
  // SCROLL SPY TABS STATE
  // ---------------------------------------------------------
  const [activeStickyTab, setActiveStickyTab] = useState('description');
  const [isTabsSticky, setIsTabsSticky] = useState(false);

  // Refs for Scroll Spy
  const tabsRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const ingredientsRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const deliveryRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const relatedRef = useRef<HTMLDivElement>(null);

  // ---------------------------------------------------------
  // NEW REVIEWS INPUT STATE
  // ---------------------------------------------------------
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedReviewImage, setUploadedReviewImage] = useState<string | null>(null);

  // ---------------------------------------------------------
  // AUDIO EFFECTS
  // ---------------------------------------------------------
  const triggerBtnSound = () => { try { playBtnTap(); } catch (e) {} };
  const triggerSlideSound = () => { try { playSlidePop(); } catch (e) {} };
  const triggerSuccessSound = () => { try { playSuccessChime(); } catch (e) {} };

  // ---------------------------------------------------------
  // INITIALIZATION & FETCH DATA
  // ---------------------------------------------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    
    // Read wishlist state from localstorage
    try {
      const saved = JSON.parse(localStorage.getItem('cakeurban_wishlist') || '[]');
      setUserWishlisted(saved.some((item: any) => item.id === (id || 'belgian-chocolate-supreme')));
    } catch(e) {}

    return unsub;
  }, [id]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        let loadedProduct = DEFAULT_LUXURY_CAKE;
        
        if (id) {
          // 1. Check local static pool first for instant loading
          const foundPoolItem = PREMIUM_PRODUCTS_POOL.find(
            p => p.id === id || String(p.id) === String(id) || (p.id && id.includes(p.id)) || (p.id && p.id.includes(id))
          );
          if (foundPoolItem) {
            loadedProduct = foundPoolItem;
          }

          // 2. Check Firestore in case custom/dynamic item exists
          try {
            const docRef = doc(db, 'products', id);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
              loadedProduct = { id: snap.id, ...snap.data() } as Product;
            }
          } catch (fsErr) {
            console.log("Firestore lookup skipped/using pool:", fsErr);
          }
        }

        setProduct(loadedProduct);
        if (loadedProduct.images?.length) {
          setActiveImage(loadedProduct.images[0]);
        }
        if (loadedProduct.weights?.length) {
          setSelectedWeight(loadedProduct.weights[0]);
        }
        if (loadedProduct.flavors?.length) {
          setSelectedFlavor(loadedProduct.flavors[0]);
        }

        // Fetch Mock/DB Reviews
        const rPath = 'reviews';
        try {
          const q = query(collection(db, rPath), where('productId', '==', loadedProduct.id));
          const rSnap = await getDocs(q);
          const dbReviews = rSnap.docs.map(d => ({ id: d.id, ...d.data() } as Review));
          
          // Prepend default gorgeous reviews if empty to keep presentation premium
          const premiumDefaultReviews: Review[] = [
            {
              id: 'rev-1',
              productId: loadedProduct.id,
              userId: 'user-1',
              userName: 'Ahana Sen',
              rating: 5,
              comment: 'Absolutely breathtaking! The single-origin chocolate is intensely dark yet velvety smooth. The edible gold leaf adds such an incredible royal touch. Highly recommend CakeUrban.',
              createdAt: { seconds: 1783305600 }
            },
            {
              id: 'rev-2',
              productId: loadedProduct.id,
              userId: 'user-2',
              userName: 'Kabir Malhotra',
              rating: 5,
              comment: 'My family was stunned by how pristine the packaging was. Inside, the cake was flawless, chilled, and moist. The 2-hour express delivery is absolutely life-saving.',
              createdAt: { seconds: 1783219200 }
            }
          ];
          setReviews([...dbReviews, ...premiumDefaultReviews]);
        } catch (e) {
          // Fallback static premium reviews
          setReviews([
            {
              id: 'rev-1',
              productId: loadedProduct.id,
              userId: 'user-1',
              userName: 'Ananya Roy',
              rating: 5,
              comment: 'Stunning luxury. The layers are perfectly defined. Chocolate ganache is premium class.',
              createdAt: { seconds: 1783305600 }
            },
            {
              id: 'rev-2',
              productId: loadedProduct.id,
              userId: 'user-2',
              userName: 'Vikram Seth',
              rating: 5,
              comment: 'Beautiful presentation. Tastes like fine European boutique cakes. 10/10.',
              createdAt: { seconds: 1783219200 }
            }
          ]);
        }

        // Fetch Related Products
        try {
          const snap = await getDocs(collection(db, 'products'));
          const list = snap.docs
            .map(d => ({ id: d.id, ...d.data() } as Product))
            .filter(p => p.id !== loadedProduct.id);
          setSuggestions(list.slice(0, 4));
        } catch (err) {
          // Fallback static luxury recommendations
          setSuggestions([
            {
              id: 'royal-red-velvet',
              name: 'Royal Red Velvet Rose',
              description: 'Velvety sponge layered with Madagascan vanilla cheese frosting.',
              price: 899,
              images: ['https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&q=80&w=400'],
              categories: ['Luxury'],
              occasions: ['Birthday'],
              flavors: ['Classic Red Velvet'],
              stockStatus: 'in-stock',
              isCustomizable: true,
              isBestseller: true
            },
            {
              id: 'pistachio-blossom',
              name: 'Sicilian Pistachio Dream',
              description: 'Handcrafted cake with roasted Bronte pistachio cream and rose dust.',
              price: 1199,
              images: ['https://images.unsplash.com/photo-1511018556340-d16986a1c194?auto=format&fit=crop&q=80&w=400'],
              categories: ['Luxury'],
              occasions: ['Anniversary'],
              flavors: ['Pistachio'],
              stockStatus: 'in-stock',
              isCustomizable: true
            },
            {
              id: 'biscoff-crown',
              name: 'Lotus Biscoff Crown',
              description: 'Premium spiced cookie butter mousse with caramelized biscuit crumbles.',
              price: 949,
              images: ['https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&q=80&w=400'],
              categories: ['Trending'],
              occasions: ['Celebration'],
              flavors: ['Lotus Biscoff'],
              stockStatus: 'in-stock',
              isCustomizable: true
            }
          ]);
        }

      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  // ---------------------------------------------------------
  // SCROLL LISTENER FOR STICKY TABS & ACTIVE SPY
  // ---------------------------------------------------------
  useEffect(() => {
    const handleScroll = () => {
      if (!tabsRef.current) return;
      const tabsTop = tabsRef.current.getBoundingClientRect().top + window.scrollY;
      const currentScroll = window.scrollY;

      // Sticky toggle
      setIsTabsSticky(currentScroll >= tabsTop - 88);

      // Scroll Spy detection
      const offset = 180;
      const descTop = descRef.current?.getBoundingClientRect().top + currentScroll - offset;
      const ingTop = ingredientsRef.current?.getBoundingClientRect().top + currentScroll - offset;
      const revTop = reviewsRef.current?.getBoundingClientRect().top + currentScroll - offset;
      const delTop = deliveryRef.current?.getBoundingClientRect().top + currentScroll - offset;
      const faqTop = faqRef.current?.getBoundingClientRect().top + currentScroll - offset;
      const relTop = relatedRef.current?.getBoundingClientRect().top + currentScroll - offset;

      if (relTop && currentScroll >= relTop) {
        setActiveStickyTab('related');
      } else if (faqTop && currentScroll >= faqTop) {
        setActiveStickyTab('faq');
      } else if (delTop && currentScroll >= delTop) {
        setActiveStickyTab('delivery');
      } else if (revTop && currentScroll >= revTop) {
        setActiveStickyTab('reviews');
      } else if (ingTop && currentScroll >= ingTop) {
        setActiveStickyTab('ingredients');
      } else if (descTop && currentScroll >= descTop) {
        setActiveStickyTab('description');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (elementRef: React.RefObject<HTMLDivElement>, tabName: string) => {
    triggerBtnSound();
    setActiveStickyTab(tabName);
    if (elementRef.current) {
      const elementTop = elementRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementTop - 140,
        behavior: 'smooth'
      });
    }
  };

  // ---------------------------------------------------------
  // PRICE CALCULATION & ANIMATED VALUE BINDINGS
  // ---------------------------------------------------------
  const baseProductPrice = product.price || 799; // 799
  
  // Dynamic weight multipliers: 250g (0.65x), 500g (1.0x), 1kg (1.8x), 2kg (3.3x)
  const weightMultiplier = selectedWeight === 0.25 ? 0.65
                         : selectedWeight === 0.5 ? 1.00
                         : selectedWeight === 1.0 ? 1.80
                         : selectedWeight === 2.0 ? 3.30
                         : 1.00;

  const weightAdjustedPrice = baseProductPrice * weightMultiplier;
  const flavorSurcharge = selectedFlavor.includes('Ferrero') || selectedFlavor.includes('Lotus') || selectedFlavor.includes('Pistachio') || selectedFlavor.includes('Biscoff') || selectedFlavor.includes('Hazelnut') ? 150 : 0;
  
  // High-fidelity customization add-ons matching reference design
  const giftBoxCost = addonGiftBox ? 49 : 0;
  const greetingCardCost = addonGreetingCard ? 29 : 0;
  const extraChocolateCost = addonExtraChocolate ? 39 : 0;

  const totalSubtotal = (weightAdjustedPrice + flavorSurcharge + giftBoxCost + greetingCardCost + extraChocolateCost) * quantity;
  const rawDiscount = Math.round(totalSubtotal * 0.20); // 20% off
  const rawFinalPrice = totalSubtotal - rawDiscount;

  // Animated ticking states
  const animatedSubtotal = useAnimatedValue(totalSubtotal);
  const animatedDiscount = useAnimatedValue(rawDiscount);
  const animatedFinalPrice = useAnimatedValue(rawFinalPrice);

  // ---------------------------------------------------------
  // MOUSE MOVE INTERACTIVE ZOOM LENS (Apple/Dyson Style)
  // ---------------------------------------------------------
  const handleMainImageHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${activeImage})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '240%'
    });
  };

  const handleMainImageLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  // ---------------------------------------------------------
  // PINCODE DELIVERY AVAILABILITY SYSTEM
  // ---------------------------------------------------------
  const checkPincodeDelivery = () => {
    triggerBtnSound();
    if (!pincode || pincode.length < 6) {
      toast.error("Please enter a valid 6-digit Pincode (e.g., 110001)");
      return;
    }
    setCheckingDelivery(true);
    setDeliveryResult(null);

    setTimeout(() => {
      setCheckingDelivery(false);
      setDeliveryResult({
        sameDay: true,
        midnight: true,
        express: parseInt(pincode) % 2 === 0, // Mock condition based on code
        eta: "6:00 PM Today"
      });
      triggerSuccessSound();
      toast.success("Delivery options verified successfully for your area!");
    }, 1200);
  };

  // ---------------------------------------------------------
  // CART / BUY NOW PIPELINE
  // ---------------------------------------------------------
  const handleAddToCart = () => {
    triggerSuccessSound();
    addItem({
      ...product,
      price: Math.round(weightAdjustedPrice + flavorSurcharge)
    }, {
      quantity,
      selectedWeight,
      selectedFlavor,
      cakeMessage,
      eggless,
      extras: [
        ...(addonGiftBox ? ['Premium Gift Box'] : []),
        ...(addonGreetingCard ? ['Handwritten Greeting Card'] : []),
        ...(addonExtraChocolate ? ['Extra Melted Chocolate Drip'] : []),
        ...(candles ? ['Artisan Candles'] : []),
        ...(knifeIncluded ? ['Premium Knife Included'] : []),
        ...(greetingCard !== 'None' ? [`Greeting Card Style: ${greetingCard}`] : [])
      ]
    });
    toast.success("Added to Reservation Basket!", {
      description: `${product.name} with your bespoke selections.`,
      action: {
        label: "View Basket",
        onClick: () => navigate('/cart')
      }
    });
  };

  const handleBuyNow = () => {
    triggerSuccessSound();
    addItem({
      ...product,
      price: Math.round(weightAdjustedPrice + flavorSurcharge)
    }, {
      quantity,
      selectedWeight,
      selectedFlavor,
      cakeMessage,
      eggless,
      extras: [
        ...(addonGiftBox ? ['Premium Gift Box'] : []),
        ...(addonGreetingCard ? ['Handwritten Greeting Card'] : []),
        ...(addonExtraChocolate ? ['Extra Melted Chocolate Drip'] : []),
        ...(candles ? ['Artisan Candles'] : []),
        ...(knifeIncluded ? ['Premium Knife Included'] : []),
        ...(greetingCard !== 'None' ? [`Greeting Card Style: ${greetingCard}`] : [])
      ]
    });
    toast.success("Proceeding directly to premium checkout...");
    setTimeout(() => {
      navigate('/cart');
    }, 500);
  };

  // ---------------------------------------------------------
  // WISHLIST TENDER
  // ---------------------------------------------------------
  const toggleWishlist = () => {
    triggerBtnSound();
    try {
      const saved = JSON.parse(localStorage.getItem('cakeurban_wishlist') || '[]');
      if (userWishlisted) {
        const fresh = saved.filter((item: any) => item.id !== product.id);
        localStorage.setItem('cakeurban_wishlist', JSON.stringify(fresh));
        setUserWishlisted(false);
        toast.info("Removed from Saved Treats");
      } else {
        saved.push(product);
        localStorage.setItem('cakeurban_wishlist', JSON.stringify(saved));
        setUserWishlisted(true);
        triggerSuccessSound();
        toast.success("Saved to Your Cake Cravings list! ❤️");
      }
      window.dispatchEvent(new Event('storage'));
    } catch(e) {}
  };

  // ---------------------------------------------------------
  // SOCIAL SHARE PIPELINE
  // ---------------------------------------------------------
  const handleShare = () => {
    triggerBtnSound();
    navigator.clipboard.writeText(window.location.href);
    toast.success("Luxury Link copied to clipboard! ✨ Share with your loved ones.");
  };

  // ---------------------------------------------------------
  // LIVE IMAGE UPLOAD SIMULATION FOR REVIEWS
  // ---------------------------------------------------------
  const handleReviewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    triggerBtnSound();
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedReviewImage(reader.result as string);
      setUploadingImage(false);
      toast.success("Review snapshot uploaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("Please add your expert culinary observation.");
      return;
    }
    
    triggerSuccessSound();
    const brandNewReview: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      userId: 'user-custom',
      userName: user?.displayName || 'Gourmet Critic',
      rating: newRating,
      comment: newComment,
      createdAt: new Date()
    };

    // If there is an uploaded image, we can store it in custom reviews state
    // For visual demo we can inject it as a property
    (brandNewReview as any).image = uploadedReviewImage;

    setReviews([brandNewReview, ...reviews]);
    setNewComment('');
    setUploadedReviewImage(null);
    toast.success("Your critique has been successfully broadcasted!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9FC] flex flex-col items-center justify-center space-y-6 py-20">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-pink-500/20 border-t-pink-600 rounded-full animate-spin" />
          <Sparkle className="w-6 h-6 text-pink-500 animate-pulse absolute" />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-pink-600/70 italic">
          Bespoke curation in progress...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FFF9FC] text-slate-800 font-sans selection:bg-pink-100 selection:text-pink-900 overflow-x-hidden relative">
      <SEO 
        title={`${product.name} | Premium Custom Celebration Cake - CakeUrban`} 
        description={`Order CakeUrban's luxury ${product.name}. Baked fresh by elite chefs, customizable weight and organic flavor profiles, climate-sealed box delivery.`}
      />

      {/* =========================================================
          TOP SECTION: BREADCRUMBS
          ========================================================= */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 xl:px-12 2xl:px-16 pt-8">
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 select-none">
          <Link to="/" onClick={triggerBtnSound} className="hover:text-pink-600 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/shop" onClick={triggerBtnSound} className="hover:text-pink-600 transition-colors">Cakes</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-pink-600 transition-colors cursor-pointer">Birthday Cakes</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-800 font-black tracking-wide border-b border-pink-200/50 pb-0.5">{product.name}</span>
        </nav>
      </div>

      {/* =========================================================
          MAIN CONTAINER: 55% LEFT | 45% RIGHT
          ========================================================= */}
      <main className="max-w-[1720px] mx-auto px-4 sm:px-8 xl:px-12 2xl:px-16 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14">
        
        {/* =========================================================
            LEFT SIDE: GALLERY ENGINE (55% Width / 7 columns)
            ========================================================= */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex flex-col-reverse md:flex-row gap-4">
            
            {/* Vertical Thumbnails Stack (8 Images) */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[550px] no-scrollbar shrink-0 md:w-[92px]">
              {/* Thumbnail 1: Main Image */}
              <button
                onMouseEnter={() => { triggerSlideSound(); setActiveImage(product.images?.[0] || DEFAULT_LUXURY_CAKE.images[0]); setActiveTab('images'); }}
                onClick={() => { triggerBtnSound(); setActiveImage(product.images?.[0] || DEFAULT_LUXURY_CAKE.images[0]); setActiveTab('images'); }}
                className={`aspect-square w-[72px] md:w-full rounded-2xl overflow-hidden border-2 transition-all duration-300 bg-white shadow-sm flex items-center justify-center relative group hover:scale-105 hover:shadow-pink-500/10 ${
                  activeImage === (product.images?.[0] || DEFAULT_LUXURY_CAKE.images[0]) && activeTab === 'images'
                    ? 'border-pink-500 shadow-md ring-2 ring-pink-500/20' 
                    : 'border-slate-100'
                }`}
              >
                <img src={product.images?.[0] || DEFAULT_LUXURY_CAKE.images[0]} className="w-full h-full object-cover rounded-xl" alt="Thumb 1" onError={handleImageError} />
              </button>

              {/* Thumbnail 2: Second Image */}
              <button
                onMouseEnter={() => { triggerSlideSound(); setActiveImage(product.images?.[1] || DEFAULT_LUXURY_CAKE.images[1] || product.images?.[0]); setActiveTab('images'); }}
                onClick={() => { triggerBtnSound(); setActiveImage(product.images?.[1] || DEFAULT_LUXURY_CAKE.images[1] || product.images?.[0]); setActiveTab('images'); }}
                className={`aspect-square w-[72px] md:w-full rounded-2xl overflow-hidden border-2 transition-all duration-300 bg-white shadow-sm flex items-center justify-center relative group hover:scale-105 hover:shadow-pink-500/10 ${
                  activeImage === (product.images?.[1] || DEFAULT_LUXURY_CAKE.images[1] || product.images?.[0]) && activeTab === 'images'
                    ? 'border-pink-500 shadow-md ring-2 ring-pink-500/20' 
                    : 'border-slate-100'
                }`}
              >
                <img src={product.images?.[1] || DEFAULT_LUXURY_CAKE.images[1] || product.images?.[0]} className="w-full h-full object-cover rounded-xl" alt="Thumb 2" onError={handleImageError} />
              </button>

              {/* Thumbnail 3: Third Image */}
              <button
                onMouseEnter={() => { triggerSlideSound(); setActiveImage(product.images?.[2] || DEFAULT_LUXURY_CAKE.images[2] || product.images?.[0]); setActiveTab('images'); }}
                onClick={() => { triggerBtnSound(); setActiveImage(product.images?.[2] || DEFAULT_LUXURY_CAKE.images[2] || product.images?.[0]); setActiveTab('images'); }}
                className={`aspect-square w-[72px] md:w-full rounded-2xl overflow-hidden border-2 transition-all duration-300 bg-white shadow-sm flex items-center justify-center relative group hover:scale-105 hover:shadow-pink-500/10 ${
                  activeImage === (product.images?.[2] || DEFAULT_LUXURY_CAKE.images[2] || product.images?.[0]) && activeTab === 'images'
                    ? 'border-pink-500 shadow-md ring-2 ring-pink-500/20' 
                    : 'border-slate-100'
                }`}
              >
                <img src={product.images?.[2] || DEFAULT_LUXURY_CAKE.images[2] || product.images?.[0]} className="w-full h-full object-cover rounded-xl" alt="Thumb 3" onError={handleImageError} />
              </button>

              {/* Thumbnail 4: Cinematic Video Option */}
              <button
                onClick={() => { triggerBtnSound(); setActiveTab('video'); setIsPlayingVideo(true); }}
                className={`aspect-square w-[72px] md:w-full rounded-2xl overflow-hidden border-2 transition-all duration-300 bg-slate-900 shadow-sm flex flex-col items-center justify-center relative group hover:scale-105 ${
                  activeTab === 'video'
                    ? 'border-pink-500 ring-2 ring-pink-500/20' 
                    : 'border-slate-100'
                }`}
              >
                <img src={product.images?.[3] || DEFAULT_LUXURY_CAKE.images[3] || product.images?.[0]} className="w-full h-full object-cover rounded-xl opacity-40" alt="Video thumb" onError={handleImageError} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-1">
                  <Play className="w-4 h-4 fill-white" />
                  <span className="text-[8px] font-black tracking-wider uppercase mt-1">0:28</span>
                </div>
              </button>

              {/* Thumbnail 5: +More Photos Board */}
              <button
                onClick={() => { triggerBtnSound(); setActiveTab('photos'); }}
                className={`aspect-square w-[72px] md:w-full rounded-2xl overflow-hidden border-2 transition-all duration-300 bg-pink-100 shadow-sm flex items-center justify-center relative group hover:scale-105 ${
                  activeTab === 'photos'
                    ? 'border-pink-500 ring-2 ring-pink-500/20' 
                    : 'border-slate-100'
                }`}
              >
                <img src={product.images?.[4] || DEFAULT_LUXURY_CAKE.images[4] || product.images?.[0]} className="w-full h-full object-cover rounded-xl opacity-20" alt="More thumb" onError={handleImageError} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-pink-700 font-black p-1 text-center">
                  <span className="text-xs">+6</span>
                  <span className="text-[7.5px] uppercase tracking-widest leading-none mt-0.5">Photos</span>
                </div>
              </button>
            </div>

            {/* Main Stage Display (Rounded frame with reflections and badges) */}
            <div className="flex-1 relative aspect-square max-h-[550px] max-w-[550px] bg-white rounded-[32px] border border-pink-100/40 shadow-[0_25px_60px_rgba(236,72,153,0.05)] p-4 select-none group">
              <div 
                className="w-full h-full rounded-[24px] overflow-hidden relative cursor-zoom-in flex items-center justify-center bg-pink-50/10"
                onMouseMove={handleMainImageHover}
                onMouseLeave={handleMainImageLeave}
              >
                <AnimatePresence mode="wait">
                  {activeTab === 'images' && (
                    <motion.div
                      key={activeImage}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="w-full h-full"
                    >
                      <img 
                        src={activeImage} 
                        className="w-full h-full object-cover rounded-[24px]" 
                        alt="Active product presentation" 
                        onError={handleImageError}
                      />
                    </motion.div>
                  )}

                  {activeTab === '360' && (
                    <motion.div
                      key="360"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full relative"
                    >
                      <div 
                        className="w-full h-full rounded-[24px] cursor-ew-resize flex items-center justify-center bg-cover bg-center"
                        style={{ backgroundImage: `url(${product.images[rotationIndex] || product.images[0]})` }}
                        onMouseMove={(e) => {
                          const { left, width } = e.currentTarget.getBoundingClientRect();
                          const currentX = e.clientX - left;
                          const percent = currentX / width;
                          const step = Math.floor(percent * product.images.length);
                          if (step >= 0 && step < product.images.length) {
                            setRotationIndex(step);
                          }
                        }}
                      >
                        <div className="absolute bottom-5 bg-black/70 backdrop-blur-md text-white font-black text-[9px] uppercase tracking-widest px-4 py-2 rounded-full flex items-center gap-2 border border-white/10 shadow-lg">
                          <SlidersHorizontal className="w-3.5 h-3.5 text-pink-400" />
                          Slide cursor left/right to orbit 360°
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'layers' && (
                    <motion.div
                      key="layers"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="w-full h-full flex flex-col justify-between bg-gradient-to-b from-rose-50/40 to-purple-50/20 p-8 rounded-[24px] overflow-y-auto"
                    >
                      <div className="space-y-1.5 text-left border-b border-pink-100/50 pb-3">
                        <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest block">Structural Breakdown</span>
                        <h4 className="text-xl font-black text-slate-800">Master Artisan Interior Layers</h4>
                      </div>

                      <div className="space-y-3 my-4">
                        {[
                          { title: "24K Gold Foil Accent", desc: "Hand-burnished metallic layer for royal glitz", color: "from-amber-400 to-amber-200" },
                          { title: "Velvet Belgian Ganache Coat", desc: "Single-origin pour at exactly 32°C", color: "from-amber-900 to-[#4a2318]" },
                          { title: "Micro-Crumb Sponge Layer I", desc: "Ultra-moist aeration, slow-baked crumb", color: "from-[#26130F] to-[#1a0c0a]" },
                          { title: "Premium Hazelnut Praline", desc: "Caramelized croquant paste with toasted nuts", color: "from-[#c29b6d] to-[#b0804b]" },
                          { title: "Slow-baked Sponge Layer II", desc: "Infused with sugar syrup and grand liqueur", color: "from-[#26130F] to-[#1a0c0a]" }
                        ].map((layer, idx) => (
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={idx} 
                            className="flex items-center gap-4 text-left p-2.5 rounded-xl bg-white/70 border border-pink-50/30 shadow-sm"
                          >
                            <div className={`w-3.5 h-12 rounded-lg bg-gradient-to-b ${layer.color} shrink-0 shadow-inner`} />
                            <div>
                              <p className="text-xs font-black text-slate-800 uppercase tracking-wide">{layer.title}</p>
                              <p className="text-[10px] text-slate-400 font-semibold italic mt-0.5">{layer.desc}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'video' && (
                    <motion.div
                      key="video"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full rounded-[24px] overflow-hidden bg-slate-900 relative flex items-center justify-center"
                    >
                      {!isPlayingVideo ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                          <button 
                            onClick={() => { triggerBtnSound(); setIsPlayingVideo(true); }}
                            className="w-14 h-14 rounded-full bg-pink-500 text-white flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-xl shadow-pink-500/20"
                          >
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          </button>
                          <span className="text-[10px] font-black text-white uppercase tracking-widest mt-4">Play Cinematic Showcase</span>
                        </div>
                      ) : (
                        <video 
                          className="w-full h-full object-cover rounded-[24px]" 
                          autoPlay 
                          controls 
                          loop 
                          playsInline
                        >
                          <source src="https://assets.mixkit.co/videos/preview/mixkit-pouring-glistening-melted-chocolate-42171-large.mp4" type="video/mp4" />
                        </video>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'photos' && (
                    <motion.div
                      key="photos"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full bg-gradient-to-br from-pink-50/20 to-purple-50/20 p-5 rounded-[24px] overflow-y-auto"
                    >
                      <div className="flex justify-between items-center border-b border-pink-100 pb-2.5 mb-4 text-left">
                        <div>
                          <span className="text-[9px] font-black text-pink-500 uppercase tracking-widest block">Client Snapshot Board</span>
                          <h4 className="text-sm font-black text-slate-800">Candid Celebrations</h4>
                        </div>
                        <span className="text-[9px] bg-pink-500/10 text-pink-600 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">Social Feed</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {[
                          "https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&q=80&w=300",
                          "https://images.unsplash.com/photo-1505976378723-9726be53e2c0?auto=format&fit=crop&q=80&w=300",
                          "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=300",
                          "https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&q=80&w=300"
                        ].map((photoUrl, idx) => (
                          <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-100 relative group">
                            <img src={photoUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Insta frame" />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 1. Zoom Lens Element */}
                <div 
                  className="absolute inset-5 pointer-events-none rounded-[16px] z-10 hidden lg:block"
                  style={zoomStyle}
                />

                {/* 2. Glass Reflection Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/5 pointer-events-none rounded-[24px]" />

                {/* 3. Live Cake Message Overlay */}
                {cakeMessage.trim() && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-20"
                  >
                    <p 
                      className="font-serif text-[22px] font-black text-[#FEF3C7] italic text-center whitespace-normal max-w-[200px] leading-tight rotate-[-4deg]"
                      style={{ 
                        textShadow: '2px 2px 3px #451a03, 0 0 1em #f59e0b, 0 0 0.2em #d97706',
                        fontFamily: "'Playfair Display', Georgia, serif"
                      }}
                    >
                      {cakeMessage}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Top Left: ★ BEST SELLER badge */}
              <div className="absolute top-8 left-8 z-30">
                <div className="bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                  <Star className="w-3 h-3 fill-slate-950" />
                  <span>BEST SELLER</span>
                </div>
              </div>

              {/* Top Right: Wishlist Heart button */}
              <div className="absolute top-8 right-8 z-30">
                <button
                  onClick={toggleWishlist}
                  className={`w-9 h-9 rounded-full bg-white hover:bg-slate-50 flex items-center justify-center transition-all shadow-md border ${
                    userWishlisted ? 'text-rose-500 border-rose-200' : 'text-slate-400 border-slate-100'
                  }`}
                >
                  <Heart className={`w-4.5 h-4.5 ${userWishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Bottom Right: Fullscreen maximize button */}
              <div className="absolute bottom-8 right-8 z-30">
                <button
                  onClick={() => { triggerBtnSound(); setActiveTab(activeTab === 'images' ? 'photos' : 'images'); }}
                  className="w-9 h-9 rounded-full bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all shadow-md border"
                  title="Expand board"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Gourmet Characteristics row (4 columns with custom micro indicators) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white border border-pink-100/30 p-4 rounded-3xl shadow-sm mt-2 select-none">
            <div className="text-left space-y-1">
              <span className="text-sm">🌿</span>
              <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-wider block">100% Freshly Baked</h5>
              <p className="text-[9px] text-slate-400 font-semibold leading-none">Baked daily on order</p>
            </div>
            <div className="text-left space-y-1 border-l border-pink-50/50 pl-3">
              <span className="text-sm">✨</span>
              <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-wider block">Imported Cocoa</h5>
              <p className="text-[9px] text-slate-400 font-semibold leading-none">Premium ingredients</p>
            </div>
            <div className="text-left space-y-1 border-l border-pink-50/50 pl-3">
              <span className="text-sm">🧁</span>
              <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-wider block">Artisan Confection</h5>
              <p className="text-[9px] text-slate-400 font-semibold leading-none">Crafted with love</p>
            </div>
            <div className="text-left space-y-1 border-l border-pink-50/50 pl-3">
              <span className="text-sm">⚡</span>
              <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-wider block">Superfast Delivery</h5>
              <p className="text-[9px] text-slate-400 font-semibold leading-none">3-Hour slot available</p>
            </div>
          </div>

          {/* Bulk Event Corporate Enquire Banner */}
          <div className="bg-gradient-to-r from-purple-950 via-[#25100B] to-slate-950 border border-purple-500/20 p-5 rounded-3xl flex items-center justify-between gap-6 text-white text-left relative overflow-hidden group select-none mt-1 shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-xl rounded-full" />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl shadow-inner">
                🎁
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-purple-200">Corporate Bulk & Event Orders?</h4>
                <p className="text-[10px] sm:text-xs text-slate-400 font-semibold italic mt-0.5 leading-none">Get dedicated pricing and tailored custom designs</p>
              </div>
            </div>
            <button
              onClick={() => {
                triggerBtnSound();
                window.dispatchEvent(new CustomEvent('open-cake-ai-shopper', {
                  detail: { message: `Hey! I am interested in bulk ordering "${product.name}" for a special corporate event. Can you help me with pricing and options? 🎁` }
                }));
              }}
              className="bg-white hover:bg-purple-100 text-purple-950 font-black text-[9px] uppercase tracking-widest px-4 py-2.5 rounded-full transition-colors shrink-0 cursor-pointer"
            >
              Enquire Now
            </button>
          </div>

          {/* Extra Gallery Interactive Tabs Menu */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 bg-pink-50/30 border border-pink-100/50 p-1.5 rounded-full select-none w-fit mx-auto">
            {[
              { id: 'images', label: 'Detail Images' },
              { id: '360', label: '360° Orbit' },
              { id: 'layers', label: 'Inside Layers' },
              { id: 'video', label: 'Video Showcase' },
              { id: 'photos', label: 'Customer Board' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { triggerSlideSound(); setActiveTab(tab.id as any); }}
                className={`px-4 py-2 rounded-full text-[10.5px] font-black uppercase tracking-wider transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/10'
                    : 'text-slate-500 hover:text-pink-600 hover:bg-white'
                }`}
              >
                {tab.id === '360' && '🌀 '}{tab.id === 'layers' && '🥞 '}{tab.id === 'video' && '🎥 '}{tab.id === 'photos' && '📸 '}{tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* =========================================================
            RIGHT SIDE: LUXURY CONFIGURATION CARD (45% Width / 5 columns)
            ========================================================= */}
        <section className="lg:col-span-5 relative">
          <div className="lg:sticky lg:top-[120px] bg-white/70 backdrop-blur-[30px] border border-pink-100/50 rounded-[36px] p-6 sm:p-10 shadow-[0_30px_70px_rgba(244,63,94,0.05)] text-left flex flex-col gap-6">
            
            {/* 1. Luxe badges ribbon */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-pink-100/50 text-pink-600 border border-pink-200/50 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">BESTSELLER</span>
              <span className="bg-purple-100/50 text-purple-600 border border-purple-200/50 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">CHEF SPECIAL</span>
              <span className="bg-green-100/50 text-green-700 border border-green-200/50 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">100% EGGLESS AVAILABLE</span>
              <span className="bg-amber-100/50 text-amber-700 border border-amber-200/50 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">LIMITED BATCH</span>
            </div>

            {/* 2. Product Title & Short Bio */}
            <div className="space-y-1.5">
              <h1 className="text-[40px] sm:text-[54px] font-black text-slate-900 tracking-tight leading-[1.05]">{product.name}</h1>
              <p className="text-[13px] text-slate-400 font-semibold italic">{product.description}</p>
            </div>

            {/* 3. Rating Row */}
            <div className="flex items-center gap-3 bg-pink-50/25 border border-pink-100/30 p-2.5 rounded-2xl w-fit">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-slate-800 font-extrabold text-sm">4.9</span>
              <div className="w-[1.5px] h-4 bg-slate-200" />
              <span className="text-[11.5px] font-bold text-slate-500 hover:underline cursor-pointer" onClick={() => scrollToSection(reviewsRef, 'reviews')}>(2,486 Reviews)</span>
              <div className="w-[1.5px] h-4 bg-slate-200" />
              <span className="text-[9.5px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Purchase
              </span>
            </div>

            {/* 4. Luxury Pricing */}
            <div className="flex items-end gap-4 border-b border-pink-100/50 pb-5">
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">BESPOKE OFFER PRICE</span>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-4xl sm:text-[44px] font-black text-slate-900">₹{animatedFinalPrice}</span>
                  <span className="text-lg text-slate-400 line-through font-semibold">₹{animatedSubtotal}</span>
                </div>
              </div>
              <span className="bg-emerald-500 text-white font-black text-[10.5px] px-3.5 py-1.5 rounded-2xl uppercase tracking-widest shadow-lg shadow-emerald-500/10 mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" /> 20% OFF SAVING
              </span>
            </div>

            {/* 5. Live Customization Engine */}
            <div className="space-y-6">
              
              {/* Size Weight Selection (Animated Pills) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center select-none">
                  <label className="text-[10.5px] font-black text-slate-500 uppercase tracking-widest">1. SELECT WEIGHT (KG)</label>
                  <span className="text-[10px] text-pink-500 font-extrabold uppercase tracking-widest">Adjusts price dynamically</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.weights?.map((w) => (
                    <button
                      key={w}
                      onClick={() => { triggerBtnSound(); setSelectedWeight(w); }}
                      className={`px-5 py-3.5 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-300 flex-1 min-w-[70px] text-center border ${
                        selectedWeight === w
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-transparent shadow-lg shadow-pink-500/15 scale-105'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-pink-300'
                      }`}
                    >
                      {w} kg
                    </button>
                  ))}
                </div>
              </div>

              {/* Flavor Selection (Tiles with Icons) */}
              <div className="space-y-3">
                <label className="text-[10.5px] font-black text-slate-500 uppercase tracking-widest block">2. SELECT ARTISANAL FLAVOR</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Belgian Chocolate', label: 'Belgian Truffle', icon: '🍫', color: 'from-[#4a2318] to-[#1a0c0a]' },
                    { id: 'Ferrero Rocher Hazelnut', label: 'Ferrero Rocher', icon: '🌰', color: 'from-[#c29b6d] to-[#4a2318]' },
                    { id: 'Lotus Biscoff Crumble', label: 'Lotus Biscoff', icon: '🍪', color: 'from-[#b0804b] to-[#c29b6d]' },
                    { id: 'Royal Red Velvet', label: 'Royal Red Velvet', icon: '🍓', color: 'from-rose-600 to-rose-400' },
                    { id: 'Sicilian Pistachio', label: 'Sicilian Pistachio', icon: '🌱', color: 'from-[#c1dfb7] to-[#80b171]' },
                    { id: 'Wild Blueberry Bloom', label: 'Wild Blueberry', icon: '🫐', color: 'from-blue-700 to-indigo-900' }
                  ].map((flavor) => (
                    <button
                      key={flavor.id}
                      onClick={() => { triggerBtnSound(); setSelectedFlavor(flavor.id); }}
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-300 flex items-center gap-3 group relative overflow-hidden ${
                        selectedFlavor === flavor.id
                          ? 'border-pink-500 bg-pink-500/5 shadow-md scale-[1.02]'
                          : 'border-slate-100 bg-slate-50/50 hover:border-pink-300'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-white shadow-inner flex items-center justify-center text-lg select-none">
                        {flavor.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide truncate">{flavor.label}</span>
                        <span className="text-[8.5px] font-semibold text-slate-400 italic">Chef recipe</span>
                      </div>
                      {selectedFlavor === flavor.id && (
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center text-white">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message on Cake (Luxury script text field) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center select-none">
                  <label className="text-[10.5px] font-black text-slate-500 uppercase tracking-widest">3. CAKE INSCRIPTION MESSAGE</label>
                  <span className="text-[9.5px] text-pink-500 font-extrabold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 animate-bounce" /> Gold Icing Style
                  </span>
                </div>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    maxLength={26}
                    placeholder="E.g., Happy 25th birthday Julian!"
                    value={cakeMessage}
                    onChange={(e) => setCakeMessage(e.target.value)}
                    className="w-full h-14 pl-12 pr-12 rounded-2xl border border-slate-200 outline-none font-bold text-slate-800 text-xs tracking-wider placeholder-slate-400 focus:border-pink-500 bg-white"
                  />
                  {cakeMessage && (
                    <button 
                      onClick={() => setCakeMessage('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 hover:text-slate-950 uppercase text-[9px] tracking-widest bg-slate-100 px-2 py-1 rounded-full"
                    >
                      CLEAR
                    </button>
                  )}
                </div>
              </div>

              {/* Toggle Accessories Row (Candles / Knife) */}
              <div className="grid grid-cols-2 gap-3 select-none">
                <div 
                  onClick={() => { triggerBtnSound(); setCandles(!candles); }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between ${
                    candles ? 'border-pink-500 bg-pink-500/5' : 'border-slate-100 bg-slate-50/50 hover:border-pink-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🕯️</span>
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Artisan Candles</span>
                  </div>
                  <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${candles ? 'bg-pink-500' : 'bg-slate-200'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${candles ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </div>

                <div 
                  onClick={() => { triggerBtnSound(); setKnifeIncluded(!knifeIncluded); }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between ${
                    knifeIncluded ? 'border-pink-500 bg-pink-500/5' : 'border-slate-100 bg-slate-50/50 hover:border-pink-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🔪</span>
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Gold Cake Knife</span>
                  </div>
                  <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${knifeIncluded ? 'bg-pink-500' : 'bg-slate-200'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${knifeIncluded ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </div>
              </div>

              {/* Greeting Card Dropdown */}
              <div className="space-y-3">
                <label className="text-[10.5px] font-black text-slate-500 uppercase tracking-widest block">4. GREETING CELEBRATION CARD</label>
                <div className="relative">
                  <select
                    value={greetingCard}
                    onChange={(e) => { triggerBtnSound(); setGreetingCard(e.target.value); }}
                    className="w-full h-14 px-4 pr-10 rounded-2xl border border-slate-200 outline-none font-black text-slate-700 text-xs uppercase tracking-wider bg-white appearance-none cursor-pointer"
                  >
                    <option value="None">No Card (Free option)</option>
                    <option value="Happy Birthday">Happy Birthday Special (+₹99)</option>
                    <option value="Anniversary Love">Anniversary Elegant (+₹99)</option>
                    <option value="Congratulation Star">Milestone Congratulations (+₹99)</option>
                    <option value="Gourmet Note">Hand-written Custom Card (+₹99)</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* 4b. PREMIUM ADD-ONS & LUXURY FINISHES */}
              <div className="space-y-3">
                <label className="text-[10.5px] font-black text-slate-500 uppercase tracking-widest block">4b. CHOOSE LUXURY ADD-ONS & ACCENTS</label>
                <div className="space-y-2.5">
                  {/* Gift box add-on */}
                  <div 
                    onClick={() => { triggerBtnSound(); setAddonGiftBox(!addonGiftBox); }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between select-none ${
                      addonGiftBox ? 'border-pink-500 bg-pink-500/5 shadow-sm scale-[1.01]' : 'border-slate-100 bg-slate-50/50 hover:border-pink-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white shadow-inner flex items-center justify-center text-lg">
                        🎁
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide">Elite Climate-Sealed Gift Box</span>
                        <span className="text-[9px] text-slate-400 font-semibold italic">Chilled thermal seal with satin ribbon (+₹49)</span>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${addonGiftBox ? 'border-pink-500 bg-pink-500 text-white' : 'border-slate-300 bg-white'}`}>
                      {addonGiftBox && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Greeting card add-on */}
                  <div 
                    onClick={() => { triggerBtnSound(); setAddonGreetingCard(!addonGreetingCard); }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between select-none ${
                      addonGreetingCard ? 'border-pink-500 bg-pink-500/5 shadow-sm scale-[1.01]' : 'border-slate-100 bg-slate-50/50 hover:border-pink-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white shadow-inner flex items-center justify-center text-lg">
                        ✉️
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide">Botanical Handwritten Card</span>
                        <span className="text-[9px] text-slate-400 font-semibold italic">Heavy textured stock with custom ink note (+₹29)</span>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${addonGreetingCard ? 'border-pink-500 bg-pink-500 text-white' : 'border-slate-300 bg-white'}`}>
                      {addonGreetingCard && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Extra chocolate drip add-on */}
                  <div 
                    onClick={() => { triggerBtnSound(); setAddonExtraChocolate(!addonExtraChocolate); }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between select-none ${
                      addonExtraChocolate ? 'border-pink-500 bg-pink-500/5 shadow-sm scale-[1.01]' : 'border-slate-100 bg-slate-50/50 hover:border-pink-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white shadow-inner flex items-center justify-center text-lg">
                        🍫
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide">Extra Belgian Chocolate Drip</span>
                        <span className="text-[9px] text-slate-400 font-semibold italic">Poured molten-hot just before packing (+₹39)</span>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${addonExtraChocolate ? 'border-pink-500 bg-pink-500 text-white' : 'border-slate-300 bg-white'}`}>
                      {addonExtraChocolate && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* 6. Delivery Checker */}
            <div className="space-y-3 p-5 rounded-3xl bg-pink-50/20 border border-pink-100/30">
              <div className="flex justify-between items-center select-none">
                <label className="text-[10.5px] font-black text-slate-500 uppercase tracking-widest">5. VERIFY ZONE & TIMING</label>
                <span className="text-[10px] text-pink-500 font-extrabold uppercase tracking-widest">Climate-sealed box</span>
              </div>

              {/* Urgency countdown indicator */}
              <div className="bg-amber-50 border border-amber-200/50 p-3 rounded-2xl flex items-center justify-between text-left select-none">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center text-sm shadow-inner">
                    ⚡
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-wide">SAME-DAY DISPATCH TIMEOUT</span>
                    <span className="text-[9px] text-slate-400 font-semibold italic">Freshly baked in our boutique near you</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1 bg-white border border-amber-200 px-3 py-1.5 rounded-xl font-mono text-xs font-black text-amber-600 shadow-sm">
                  <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-[9px] text-amber-400 font-sans">h</span>
                  <span>:</span>
                  <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-[9px] text-amber-400 font-sans">m</span>
                  <span>:</span>
                  <span className="text-pink-500 animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="text-[9px] text-amber-400 font-sans">s</span>
                </div>
              </div>
              <div className="flex gap-2.5">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode..."
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 h-12 px-4 rounded-xl border border-slate-200 outline-none font-bold text-slate-800 text-xs tracking-widest bg-white"
                />
                <button
                  type="button"
                  onClick={checkPincodeDelivery}
                  disabled={checkingDelivery}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest px-5 rounded-xl transition-colors shrink-0 flex items-center justify-center"
                >
                  {checkingDelivery ? "Verifying..." : "Check Delivery"}
                </button>
              </div>

              {/* Delivery ETA results */}
              {deliveryResult && (
                <div className="space-y-2 pt-1 text-xs font-bold text-slate-600">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Check className="w-4 h-4" /> <span>Standard Same-Day (Free) available.</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Check className="w-4 h-4" /> <span>Midnight Deployment available.</span>
                  </div>
                  {deliveryResult.express ? (
                    <div className="flex items-center gap-2 text-pink-600 bg-pink-100/30 px-3 py-1.5 rounded-xl border border-pink-200/50 w-fit">
                      <Clock className="w-3.5 h-3.5 animate-pulse" />
                      <span>Express 2-Hour Delivery (Available, ETA: {deliveryResult.eta})</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400">
                      <AlertCircle className="w-4 h-4" /> <span>Express waitlist active for current window.</span>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Info Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-pink-100/30">
                <span className="bg-white px-2.5 py-1 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-100">🌿 Freshly Baked</span>
                <span className="bg-white px-2.5 py-1 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-100">🥚 Eggless Available</span>
                <span className="bg-white px-2.5 py-1 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-100">📦 Premium Box</span>
                <span className="bg-white px-2.5 py-1 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-100">⚡ 2-Hour Doorstep</span>
              </div>
            </div>

            {/* 7. Animated Live Bill Breakdown (Stripe/Apple Style) */}
            <div className="p-5 rounded-3xl bg-gradient-to-b from-slate-50 to-slate-100/50 border border-slate-100 space-y-2.5 select-none text-xs font-bold text-slate-500">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">BESPOKE ORDER VALUATION</span>
              
              <div className="flex justify-between pt-1">
                <span>Base Cake ({selectedWeight}kg + {selectedFlavor.split(' ')[0]})</span>
                <span className="text-slate-800">₹{Math.round(weightAdjustedPrice + flavorSurcharge)}</span>
              </div>
              
              {(addonGiftBox || addonGreetingCard || addonExtraChocolate || candles || greetingCard !== 'None') && (
                <div className="flex justify-between text-[11px] text-pink-600">
                  <span>Elite Celebration & Gift Accents</span>
                  <span>+₹{giftBoxCost + greetingCardCost + extraChocolateCost + (greetingCard !== 'None' ? 99 : 0)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Subtotal ({quantity} {quantity === 1 ? 'item' : 'items'})</span>
                <span className="text-slate-800">₹{animatedSubtotal}</span>
              </div>

              <div className="flex justify-between text-emerald-600">
                <span>20% Startup Golden Offer</span>
                <span>-₹{animatedDiscount}</span>
              </div>

              <div className="flex justify-between text-[11px]">
                <span>Climate-sealed Delivery</span>
                <span className="text-emerald-600 uppercase tracking-widest text-[10px] font-black">COMPLIMENTARY</span>
              </div>

              <div className="h-px bg-slate-200 my-2" />
              
              <div className="flex justify-between items-center">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TOTAL VALUE</span>
                  <span className="text-2xl font-black text-slate-900">₹{animatedFinalPrice}</span>
                </div>
                
                {/* Quantity Stepper */}
                <div className="flex items-center bg-white border border-slate-200 rounded-full p-1 shadow-inner shrink-0">
                  <button 
                    onClick={() => { triggerBtnSound(); setQuantity(q => Math.max(1, q - 1)); }}
                    className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-black text-slate-800 text-xs px-3">{quantity}</span>
                  <button 
                    onClick={() => { triggerBtnSound(); setQuantity(q => q + 1); }}
                    className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 8. Call to Action buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full h-[60px] rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:brightness-110 active:scale-[0.98] transition-all duration-300 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-pink-500/15 hover:shadow-xl hover:shadow-pink-500/25 flex items-center justify-center gap-2 relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Sparkles className="w-4.5 h-4.5 animate-pulse text-yellow-300" />
                <span>Add To Reservation Basket</span>
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex-1 h-14 rounded-full bg-white hover:bg-slate-50 active:scale-[0.98] transition-all duration-300 border border-slate-200 text-slate-800 font-black text-[10.5px] uppercase tracking-widest shadow-sm"
                >
                  ⚡ Instant Buy Now
                </button>

                {/* Circular Glass Utility Buttons */}
                <button
                  type="button"
                  onClick={toggleWishlist}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border ${
                    userWishlisted 
                      ? 'bg-rose-50 border-rose-200 text-rose-500 shadow-md' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                  title="Save craving"
                >
                  <Heart className={`w-5 h-5 ${userWishlisted ? 'fill-rose-500' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="w-14 h-14 rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 flex items-center justify-center transition-all duration-300"
                  title="Share links"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* =========================================================
          STICKY SCROLL SPY TABS (Sticky Navigation below Header)
          ========================================================= */}
      <div 
        ref={tabsRef}
        className={`w-full z-40 transition-all duration-300 select-none ${
          isTabsSticky 
            ? 'fixed top-[88px] left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-pink-100/40 shadow-md py-1.5' 
            : 'relative border-y border-pink-100/40 py-3 bg-white/40'
        }`}
      >
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 xl:px-12 2xl:px-16 flex items-center justify-start gap-4 sm:gap-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'description', label: 'Curation Story', ref: descRef },
            { id: 'ingredients', label: 'Premium Ingredients', ref: ingredientsRef },
            { id: 'reviews', label: `Client Reviews (${reviews.length})`, ref: reviewsRef },
            { id: 'delivery', label: 'Delivery Protocol', ref: deliveryRef },
            { id: 'faq', label: 'FAQ', ref: faqRef },
            { id: 'related', label: 'Related Bakes', ref: relatedRef }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.ref, tab.id)}
              className={`text-[10.5px] font-black uppercase tracking-widest whitespace-nowrap py-2 transition-all border-b-2 ${
                activeStickyTab === tab.id
                  ? 'border-pink-500 text-pink-600 font-extrabold scale-105'
                  : 'border-transparent text-slate-400 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================
          SCROLLING PAGES: CONTENT SEGMENTS
          ========================================================= */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 xl:px-12 2xl:px-16 space-y-24 py-16">

        {/* 1. CURATION DESCRIPTION (Luxury Editorial Design) */}
        <div ref={descRef} className="scroll-mt-36">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14 items-center">
            
            {/* Editorial imagery */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] rounded-[48px] overflow-hidden shadow-2xl relative border border-pink-100/30">
                <img 
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600" 
                  className="w-full h-full object-cover" 
                  alt="Belgian chef chocolate duster" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#26130F]/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-white text-left space-y-1">
                  <span className="text-[9px] font-black tracking-widest uppercase text-pink-400">CHEF SIGNATURE</span>
                  <p className="text-xl font-bold font-serif italic">"Baked with slow aeration to achieve cloud-like chocolate crumb profile."</p>
                </div>
              </div>
              
              {/* Floating element */}
              <div className="absolute -bottom-6 -right-6 bg-white border border-pink-100 rounded-3xl p-4 shadow-xl max-w-[180px] text-left">
                <span className="text-lg">🍫</span>
                <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-800 mt-1">100% Cocoa</h5>
                <p className="text-[9px] text-slate-400 mt-0.5 leading-snug">Sourced directly from Belgian estate farms.</p>
              </div>
            </div>

            {/* Editorial copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="text-pink-500 font-black text-xs uppercase tracking-widest block">THE MASTER CRAFT STORY</span>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none">A Perfect Symphony of Cocoa and Architecture.</h2>
              <p className="text-[15px] text-slate-500 font-semibold leading-relaxed">
                Designed to disrupt classic bakery layouts, <span className="text-slate-800 font-extrabold">Belgian Chocolate Supreme</span> represents our hallmark gourmet development. Layered with professional precision, it fuses multiple textures of pure chocolate. First, a crust layer of rich praline. Second, an whipped fudge coat. Finally, a royal gold leaf garnish.
              </p>
              
              {/* Illustrated Timeline */}
              <div className="space-y-4 pt-4 border-t border-pink-100/40">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Our Culinary Development Protocol</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { step: "01. Slow Batter", title: "Batter Aeration", desc: "Whisked for 18 minutes to optimize fluffy pocket sizing." },
                    { step: "02. Velvet Pour", title: "Esthetic Ganache", desc: "Coated in premium Belgian ganache at exactly 32.5°C." },
                    { step: "03. Royal Polish", title: "Hand Burnishing", desc: "Finished with 24K gold dust sheets and wild orchard cherries." }
                  ].map((step, i) => (
                    <div key={i} className="space-y-1 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                      <span className="text-[10px] font-black text-pink-500 block">{step.step}</span>
                      <h5 className="text-xs font-black text-slate-800 uppercase tracking-wide">{step.title}</h5>
                      <p className="text-[10px] text-slate-400 font-semibold italic mt-0.5 leading-snug">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 2. PREMIUM INGREDIENTS */}
        <div ref={ingredientsRef} className="scroll-mt-36 space-y-10 text-left">
          <div className="max-w-xl space-y-1.5">
            <span className="text-pink-500 font-black text-xs uppercase tracking-widest block">CLEAN & TRACEABLE RECIPE</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">The Gourmet Anatomy</h2>
            <p className="text-[14px] text-slate-400 font-semibold italic">We hold ourselves to a strict zero-chemical standard. Here are the core building blocks of your cake.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: "🍫", title: "Estoublon Cocoa", origin: "Belgium Estate", desc: "84% single-estate dark cocoa butter, roasted at microscale." },
              { emoji: "🍦", title: "Bourbon Vanilla", origin: "Madagascar Pods", desc: "Raw organic vanilla beans, cold-pressed for floral aromatics." },
              { emoji: "🧈", title: "French Whipped Butter", origin: "Normandy Mills", desc: "Salted churn paste containing 82% sweet fat ratio." },
              { emoji: "🍇", title: "Botanical Extracts", origin: "Organic Farms", desc: "Natural berry juices and organic brown sugar syrups." }
            ].map((ing, i) => (
              <div key={i} className="bg-white border border-pink-100/30 p-6 rounded-[32px] shadow-sm hover:shadow-lg transition-all duration-300 text-left space-y-4 group hover:-translate-y-1">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-2xl group-hover:bg-pink-100 transition-colors">
                  {ing.emoji}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">{ing.title}</h4>
                  <span className="text-[9px] bg-pink-100/50 text-pink-600 font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-block">{ing.origin}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-semibold italic mt-1 leading-relaxed">{ing.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. CLIENT REVIEWS MASONRY & UPLOADER */}
        <div ref={reviewsRef} className="scroll-mt-36 space-y-12 text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pb-6 border-b border-pink-100/50">
            <div className="space-y-1.5">
              <span className="text-pink-500 font-black text-xs uppercase tracking-widest block">CLIENT OBSERVATIONS</span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">The Critique Board</h2>
              <p className="text-[14px] text-slate-400 font-semibold italic">Unfiltered feedback from certified CakeUrban collectors.</p>
            </div>

            {/* Average meter */}
            <div className="flex items-center gap-4 bg-white border border-pink-100/40 p-4 rounded-3xl shadow-sm">
              <div className="text-left">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">RATING METRIC</span>
                <span className="text-3xl font-black text-slate-900">4.9★</span>
              </div>
              <div className="h-10 w-[1.5px] bg-slate-200" />
              <div className="text-left text-[11px] text-slate-400 font-bold">
                <p className="text-slate-800 font-black">98.2% recommendation</p>
                <p className="italic">Based on 2,486 bakes</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Interactive Critique Form with Image Uploader */}
            <div className="lg:col-span-5 bg-white border border-pink-100/50 rounded-[36px] p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-3 mb-6">Leave Your Critique</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-5">
                
                {/* Rating select stars */}
                <div className="space-y-2">
                  <label className="text-[10.5px] font-black text-slate-500 uppercase tracking-widest block">Culinary Assessment</label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setNewRating(s)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          s <= newRating ? 'bg-amber-400 text-[#140603]' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        <Star className={`w-5.5 h-5.5 ${s <= newRating ? 'fill-[#140603]' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment area */}
                <div className="space-y-2">
                  <label className="text-[10.5px] font-black text-slate-500 uppercase tracking-widest block">Detailed Observation</label>
                  <textarea
                    required
                    placeholder="E.g., The ganache texture is majestic, perfectly moisture-locked. Delivery was swift and professional."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full min-h-[120px] rounded-2xl border border-slate-200 p-4 font-semibold italic text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-pink-500"
                  />
                </div>

                {/* Drag and Drop Image simulation */}
                <div className="space-y-2">
                  <label className="text-[10.5px] font-black text-slate-500 uppercase tracking-widest block">Upload Celebration Photo (Optional)</label>
                  <div className="relative border-2 border-dashed border-slate-200 hover:border-pink-500 rounded-2xl p-5 text-center cursor-pointer bg-slate-50/50 hover:bg-pink-50/10 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleReviewImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {uploadingImage ? (
                      <p className="text-[10px] text-pink-500 font-extrabold uppercase tracking-wider">Uploading photo...</p>
                    ) : uploadedReviewImage ? (
                      <div className="flex items-center justify-center gap-3">
                        <img src={uploadedReviewImage} className="w-12 h-12 rounded-xl object-cover border" alt="preview" />
                        <span className="text-[10px] text-emerald-600 font-black uppercase tracking-wider flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Snapshot Ready
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1 text-slate-400">
                        <Upload className="w-6 h-6 mx-auto text-slate-300" />
                        <p className="text-[10.5px] font-black uppercase tracking-wider text-slate-500">Click or Drag & Drop</p>
                        <p className="text-[9px] italic">JPG or PNG (max 4MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Broadcast Critique</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </form>
            </div>

            {/* Masonry Review Cards List */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {reviews.map((rev) => (
                  <motion.div
                    key={rev.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-white border border-pink-100/30 rounded-[32px] shadow-sm text-left flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center font-bold text-pink-600 font-serif text-sm">
                            {rev.userName ? rev.userName.charAt(0).toUpperCase() : 'G'}
                          </div>
                          <div>
                            <h5 className="text-[11.5px] font-black text-slate-800 uppercase tracking-wider">{rev.userName}</h5>
                            <span className="text-[9px] text-slate-400 font-semibold italic">Collector Rank</span>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 font-semibold italic leading-relaxed">"{rev.comment}"</p>
                      
                      {/* Attached review image simulation */}
                      {(rev as any).image && (
                        <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
                          <img src={(rev as any).image} className="w-full h-full object-cover" alt="Review supplement" />
                        </div>
                      )}

                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                      <span className="text-[9.5px] bg-emerald-100/50 text-emerald-800 font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Verified Purchase
                      </span>
                      <span className="text-[9.5px] text-slate-400 font-semibold">
                        {rev.createdAt?.seconds ? new Date(rev.createdAt.seconds * 1000).toLocaleDateString() : 'Today'}
                      </span>
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* 4. CLINICAL DELIVERY PROTOCOL */}
        <div ref={deliveryRef} className="scroll-mt-36">
          <div className="bg-gradient-to-tr from-[#140603] via-[#26130F] to-slate-950 p-8 sm:p-14 rounded-[48px] text-white flex flex-col lg:flex-row items-center gap-10 text-left relative overflow-hidden shadow-xl">
            {/* Ambient gold glow */}
            <div className="absolute top-[-30%] right-[-10%] w-[500px] h-[500px] bg-pink-500/10 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="flex-1 space-y-6 relative z-10">
              <span className="bg-white/10 backdrop-blur-md text-pink-400 font-extrabold text-[9.5px] uppercase tracking-widest px-3.5 py-1.5 rounded-full inline-block border border-white/5">
                CLIMATE CONTROL PROTOCOL
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-none">The Luxury Transit Shield.</h2>
              <p className="text-[14px] text-white/70 font-semibold leading-relaxed italic">
                We deliver your cake in a customized structural luxury box equipped with solid-carbon dry ice plates. This maintains the cake temperature at exactly 4°C, preventing chocolate melting during long journeys in Faridabad NCR heat.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                {[
                  { icon: <Truck className="w-6 h-6 text-pink-400" />, title: "Shock Shield", desc: "Anti-vibration foam mounts within box compartments." },
                  { icon: <Clock className="w-6 h-6 text-pink-400" />, title: "Time Locked", desc: "Fast-tracked courier routing to optimize freshness bounds." },
                  { icon: <ShieldCheck className="w-6 h-6 text-pink-400" />, title: "Fully Covered", desc: "We immediately replace any transit scuffs with instant credit." }
                ].map((item, i) => (
                  <div key={i} className="space-y-1.5 p-4 bg-white/5 rounded-2xl border border-white/10">
                    {item.icon}
                    <h5 className="text-xs font-black uppercase tracking-wide text-white">{item.title}</h5>
                    <p className="text-[10px] text-white/50 font-semibold leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-[40%] shrink-0 relative aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&q=80&w=500" 
                className="w-full h-full object-cover" 
                alt="Box presentation" 
              />
            </div>
          </div>
        </div>

        {/* 5. FAQS ACCORDION */}
        <div ref={faqRef} className="scroll-mt-36 space-y-10 text-left">
          <div className="max-w-xl space-y-1.5">
            <span className="text-pink-500 font-black text-xs uppercase tracking-widest block">HAVE CONCERNS?</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">Frequent Enquiries</h2>
            <p className="text-[14px] text-slate-400 font-semibold italic">Everything you should know about your bespoke cake order.</p>
          </div>

          <div className="max-w-4xl space-y-4">
            {[
              { q: "Is the cake 100% vegetarian/eggless?", a: "Yes! While we offer both options, we cook eggless options in a strictly separate compartment in our bakeries to ensure no cross-contact occurs. Simply toggle the 'Eggless' button to order." },
              { q: "How long can I store this cake in refrigeration?", a: "To enjoy peak fluffy texture, we recommend slicing within 48 hours of doorstep delivery. Always keep the cake in a box inside your refrigerator to protect it from absorbing other food smells." },
              { q: "Can I cancel or reschedule my cake reservation?", a: "Because each cake is slow-baked to order, we lock scheduling details 24 hours prior to the delivery slot. Any changes before this window are completely free of charge. Contact support for help." },
              { q: "Do you deliver to corporate boardrooms or hotels?", a: "Absolutely. Our elite delivery fleet coordinates directly with lobby and front-desk managers in Faridabad & NCR to ensure safe placement and refrigeration of your cake." }
            ].map((faq, i) => (
              <details key={i} className="group bg-white border border-pink-100/30 rounded-[28px] p-6 shadow-sm cursor-pointer [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex justify-between items-center font-black text-xs sm:text-sm uppercase tracking-wider text-slate-800">
                  <span>{faq.q}</span>
                  <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform duration-300 shrink-0" />
                </summary>
                <p className="text-[13.5px] text-slate-500 font-semibold leading-relaxed italic mt-4 border-t border-slate-100 pt-4 cursor-default">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* 6. RELATED PRODUCTS (Luxury carousel with quick-add) */}
        <div ref={relatedRef} className="scroll-mt-36 space-y-10 text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="space-y-1 text-left">
              <span className="text-pink-500 font-black text-xs uppercase tracking-widest block">FREQUENTLY CRAFTED TOGETHER</span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">You Might Also Adore</h2>
            </div>
            <Link 
              to="/shop" 
              onClick={triggerSlideSound}
              className="text-xs font-black uppercase tracking-widest text-pink-600 hover:text-pink-700 transition-colors flex items-center gap-1 border-b border-pink-200 hover:border-pink-500 pb-0.5"
            >
              <span>Explore Boutique Store</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {suggestions.map((item) => (
              <div
                key={item.id}
                onClick={triggerBtnSound}
                className="group bg-white rounded-[36px] overflow-hidden border border-pink-100/30 shadow-sm hover:shadow-[0_20px_40px_rgba(244,63,94,0.06)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image display */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-50 m-3 rounded-[28px]">
                  <img 
                    src={item.images?.[0]} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    onError={handleImageError}
                  />
                  {item.isBestseller && (
                    <div className="absolute top-4 left-4 bg-pink-500 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md">
                      Bestseller
                    </div>
                  )}
                  {/* Hover Quick Add Overlay */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Link
                      to={`/product/${item.id}`}
                      className="bg-white hover:bg-pink-500 hover:text-white text-slate-800 font-black text-[10px] uppercase tracking-widest py-3 px-5 rounded-full transition-colors shadow-lg"
                    >
                      Bespoke Details
                    </Link>
                  </div>
                </div>

                {/* Info and price */}
                <div className="p-6 pt-2 text-left space-y-3">
                  <div className="space-y-1">
                    <h5 className="font-black text-xs sm:text-sm text-slate-800 uppercase tracking-wide group-hover:text-pink-600 transition-colors truncate">
                      {item.name}
                    </h5>
                    <p className="text-[11px] text-slate-400 font-semibold italic line-clamp-1">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <span className="font-extrabold text-base text-slate-900">₹{item.price}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerSuccessSound();
                        addItem(item, { quantity: 1, selectedWeight: 0.5 });
                        toast.success(`Added ${item.name} (0.5kg) to reservation basket!`);
                      }}
                      className="bg-pink-50/80 hover:bg-pink-500 text-pink-600 hover:text-white font-black text-[9px] uppercase tracking-wider px-3.5 py-1.5 rounded-full transition-all"
                    >
                      + Quick Add
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>

      {/* =========================================================
          BOTTOM CTA: NEED SOMETHING TRULY UNIQUE BANNER
          ========================================================= */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 xl:px-12 2xl:px-16 pb-16">
        <div className="relative rounded-[50px] overflow-hidden bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 p-8 sm:p-16 text-center text-white shadow-2xl shadow-pink-500/10">
          
          {/* Floating vector background decorations */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/10 blur-2xl rounded-full animate-pulse pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-purple-500/20 blur-2xl rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="bg-white/25 text-white font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full inline-block backdrop-blur-md border border-white/10 select-none">
              TAILORED ARTISTRY
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-none">Need Something Truly Unique?</h2>
            <p className="text-[14px] text-pink-100 font-semibold max-w-lg mx-auto leading-relaxed italic">
              Work with our Executive Pastry Chefs to engineer a custom multi-tier theme cake matching your corporate brand or majestic wedding colors.
            </p>
            <div className="pt-4 flex justify-center">
              <Link
                to="/custom-order"
                onClick={triggerBtnSound}
                className="bg-white hover:bg-pink-50 text-pink-600 hover:text-pink-700 font-black text-xs uppercase tracking-widest px-10 py-4.5 rounded-full transition-all shadow-lg hover:scale-105 flex items-center gap-2"
              >
                <span>Customize Your Cake Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          MOBILE STICKY BOTTOM BAR (Buy, Cart)
          ========================================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-pink-100/40 p-4 shadow-2xl flex items-center justify-between gap-4 select-none">
        <div className="flex flex-col text-left">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">ESTIMATED BILL</span>
          <span className="text-xl font-black text-slate-900">₹{animatedFinalPrice}</span>
        </div>
        <button
          onClick={handleAddToCart}
          className="flex-1 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-pink-500/10 active:scale-95 transition-transform"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Add To Basket</span>
        </button>
      </div>

    </div>
  );
}
