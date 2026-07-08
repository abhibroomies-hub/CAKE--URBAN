/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { ThemeProvider } from './lib/theme';
import { seedProducts } from './lib/seed';
import { NotFoundView, ServerErrorView } from './components/FeedbackStates';

// Lazy load all pages for peak performance
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const CustomOrder = lazy(() => import('./pages/AiDesignerStudio'));
const ThreeDConfigurator = lazy(() => import('./pages/ThreeDConfigurator'));
const Profile = lazy(() => import('./pages/Profile'));
const PremiumDashboard = lazy(() => import('./pages/PremiumDashboard'));
const RewardsLoyalty = lazy(() => import('./pages/RewardsLoyalty'));
const Blog = lazy(() => import('./pages/Blog'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const SeoStudio = lazy(() => import('./pages/SeoStudio'));
const SeoDirectory = lazy(() => import('./pages/SeoDirectory'));
const LocationSEOPage = lazy(() => import('./pages/LocationSEOPage'));
const Legal = lazy(() => import('./pages/Legal'));
const AuthPortal = lazy(() => import('./pages/AuthPortal'));
const ReviewsGallery = lazy(() => import('./pages/ReviewsGallery'));
const LiveOrderTracking = lazy(() => import('./pages/LiveOrderTracking'));
const MyOrders = lazy(() => import('./pages/MyOrders'));

// Premium Category Landing Pages
const BirthdayLanding = lazy(() => import('./pages/BirthdayLanding'));
const WeddingLanding = lazy(() => import('./pages/WeddingLanding'));
const AnniversaryLanding = lazy(() => import('./pages/AnniversaryLanding'));
const KidsLanding = lazy(() => import('./pages/KidsLanding'));
const CookiesCollection = lazy(() => import('./pages/CookiesCollection'));
const CupcakesCollection = lazy(() => import('./pages/CupcakesCollection'));
const DessertsCollection = lazy(() => import('./pages/DessertsCollection'));
const GiftHampersCollection = lazy(() => import('./pages/GiftHampersCollection'));
const CorporateCatering = lazy(() => import('./pages/CorporateCatering'));

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function PageLoader() {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center space-y-4 bg-[#FFF9FC]">
      <div className="relative flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#FF4EA3] animate-spin" />
        <div className="absolute w-14 h-14 rounded-full border-2 border-pink-100 animate-ping opacity-75" />
      </div>
      <p className="text-[11px] uppercase tracking-[0.3em] font-black text-[#FF4EA3] italic animate-pulse">
        Loading CakeUrban Experience...
      </p>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Core Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/custom-order" element={<CustomOrder />} />
        <Route path="/configurator" element={<ThreeDConfigurator />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/seo-studio" element={<SeoStudio />} />
        <Route path="/seo-directory" element={<SeoDirectory />} />
        <Route path="/reviews" element={<ReviewsGallery />} />
        <Route path="/legal" element={<Legal />} />

        {/* Premium Category Landing Pages */}
        <Route path="/birthday-cakes" element={<BirthdayLanding />} />
        <Route path="/wedding-cakes" element={<WeddingLanding />} />
        <Route path="/anniversary-cakes" element={<AnniversaryLanding />} />
        <Route path="/kids-cakes" element={<KidsLanding />} />
        <Route path="/cookies" element={<CookiesCollection />} />
        <Route path="/cupcakes" element={<CupcakesCollection />} />
        <Route path="/desserts" element={<DessertsCollection />} />
        <Route path="/gift-hampers" element={<GiftHampersCollection />} />
        <Route path="/hampers" element={<GiftHampersCollection />} />
        <Route path="/corporate-catering" element={<CorporateCatering />} />
        <Route path="/corporate" element={<CorporateCatering />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<AuthPortal />} />
        <Route path="/signup" element={<AuthPortal />} />
        <Route path="/profile" element={<PremiumDashboard />} />
        <Route path="/account" element={<PremiumDashboard />} />
        <Route path="/rewards" element={<RewardsLoyalty />} />

        {/* Order Tracking & History Routes */}
        <Route path="/track-order" element={<LiveOrderTracking />} />
        <Route path="/track-order/:id" element={<LiveOrderTracking />} />
        <Route path="/my-orders" element={<MyOrders />} />

        {/* Dynamic catch-all for Local SEO Pages */}
        <Route path="/:slug" element={<LocationSEOPage />} />

        {/* Error demonstration routes */}
        <Route path="/404" element={<NotFoundView />} />
        <Route path="/500" element={<ServerErrorView />} />
        <Route path="/error" element={<ServerErrorView />} />

        {/* Absolute catch-all for unrecognized deep paths */}
        <Route path="*" element={<NotFoundView />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  useEffect(() => {
    seedProducts().catch(err => console.error("Auto-seeding failure on startup:", err));
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <AnimatedRoutes />
          </Suspense>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}
