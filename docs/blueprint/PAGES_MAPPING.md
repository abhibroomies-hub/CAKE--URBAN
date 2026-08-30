# CakeUrban — Pages & Route Blueprint

This document details every page view in `/src/pages/`, explaining its purpose, interactive elements, button functions, and data handling.

---

## 1. Home Page (`/src/pages/Home.tsx`)
- **Route**: `/`
- **Purpose**: Main brand storefront, hero banner, featured gourmet cake categories, trending flavors, interactive reviews, instant search triggers, and CTA banners.
- **Key Interactive Buttons & Elements**:
  - **Hero "Order Now" Button**: Scrolls smoothly or navigates directly to `/shop`.
  - **"Design Custom Cake" Button**: Navigates to `/custom-order` for custom cake builder.
  - **Category Cards** (Chocolate, Velvet, Fruit, Cheesecake, Fondant, Pinata): Filter `/shop` catalog by category.
  - **Flavor Badges**: Instant filter trigger for specific cake taste profiles.
  - **"Quick View" Button on Cards**: Opens `QuickViewModal` for fast weight & variant selection without page reload.
  - **"Add to Cart" Button**: Adds product to global cart, plays `success` audio chime, triggers floating cart notification.
  - **Wishlist Heart Icon**: Toggles product favorite state in `wishlist` array.
  - **Review Submission Button**: Opens modal to write customer review with star ratings and photo upload simulation.
  - **Floating AI Assistant Trigger**: Opens `AIPersonalShopper` drawer for smart recommendations.

---

## 2. Shop Catalog (`/src/pages/Shop.tsx`)
- **Route**: `/shop`
- **Purpose**: Main product catalog with real-time multi-attribute filtering, sorting, grid layout switches, and pagination.
- **Key Interactive Buttons & Elements**:
  - **Filter Sidebar Trigger**: Toggles `SmartFilterSidebar` on mobile and desktop.
  - **Search Input Field**: Live text filtering across name, description, and flavor tags.
  - **Sort Dropdown** (Price: Low-High, High-Low, Rating, Popularity, Newest): Re-sorts active product array instantly.
  - **Grid Layout Switcher** (2-column, 3-column, 4-column): Updates Tailwind CSS grid columns dynamically.
  - **Dietary Filter Chips** (Eggless, Sugar-Free, Gluten-Free, Vegan, Organic): Toggles dietary constraint flags.
  - **Clear Filters Button**: Resets all active filter states to default catalog view.

---

## 3. Single Product Detail (`/src/pages/ProductDetail.tsx`)
- **Route**: `/product/:id`
- **Purpose**: Deep-dive product specification, weight selector (0.5kg, 1kg, 2kg, 5kg), flavor variations, custom message on cake, pincode delivery checker, and customer reviews.
- **Key Interactive Buttons & Elements**:
  - **Image Thumbnail Carousel**: Changes active main hero product image view.
  - **Weight Selector Buttons**: Recalculates total product price dynamically based on weight multiplier.
  - **"Eggless / With Egg" Toggle**: Adjusts product pricing (+₹50 for eggless specialty prep) and badge.
  - **Custom Cake Message Input**: Text field to etch custom wording on top of cake.
  - **Pincode Delivery Checker Button**: Validates 6-digit Indian PIN code for same-day delivery availability.
  - **Quantity Incrementor (`+` / `-`)**: Adjusts purchase count.
  - **"Add to Cart" Button**: Commits full product configuration to cart state.
  - **"Buy Now" Button**: Adds item to cart and immediately redirects to `/checkout`.

---

## 4. Custom Cake Builder (`/src/pages/CustomOrder.tsx`)
- **Route**: `/custom-order`
- **Purpose**: 4-step interactive custom confectionery design workflow.
- **Key Interactive Buttons & Elements**:
  - **Step 1: Shape & Tier Selector**: Single Tier, 2-Tier Castle, 3-Tier Grand Wedding, Heart, Number.
  - **Step 2: Base Flavor & Filling**: Belgian Dark, Red Velvet Cream, Alphonso Mango, Pistachio Praline.
  - **Step 3: Frosting & Design Theme**: Fondant Sculpted, Whipped Cream, Buttercream Flowers, Naked Layer.
  - **Step 4: Image Reference Upload**: Allows customer to attach custom cake photo inspiration.
  - **Weight & Serving Slider**: Calculates total weight required for guest count.
  - **"Generate Custom Quote" Button**: Calculates instant price breakdown and adds custom build to cart.

---

## 5. 3D Cake Configurator (`/src/pages/ThreeDConfigurator.tsx`)
- **Route**: `/3d-configurator`
- **Purpose**: Interactive 3D/canvas visualizer where users can rotate, recolor, add toppings, and inspect a 3D cake model.
- **Key Interactive Buttons & Elements**:
  - **3D Rotation Controls**: Orbit controls to rotate cake 360 degrees.
  - **Tier Color Pickers**: Real-time color updates for Tier 1, Tier 2, and Tier 3.
  - **Toppings Toggle Buttons**: Add Macarons, Gold Leaf, Fresh Berries, Edible Pearls.
  - **"Export 3D Design" Button**: Saves 3D snapshot configuration into user order.

---

## 6. AI Designer Studio (`/src/pages/AiDesignerStudio.tsx`)
- **Route**: `/ai-designer`
- **Purpose**: AI-powered custom cake generator using text prompts (e.g., "Cyberpunk Neon Birthday Cake with Chocolate Drip").
- **Key Interactive Buttons & Elements**:
  - **AI Prompt Input**: Text area for user description.
  - **Style Selector Chips**: Vintage Elegance, Modern Minimalist, Floral Garden, Sculptural Art.
  - **"Generate Cake Concept" Button**: Triggers AI generation pipeline to render cake preview and ingredient list.
  - **"Order This AI Creation" Button**: Converts generated design into orderable cart item.

---

## 7. Cart & Cart Drawer (`/src/pages/Cart.tsx` & Drawer)
- **Route**: `/cart`
- **Purpose**: Shopping cart summary, weight verification, gift wrap option, discount coupon redemption, and price breakdown.
- **Key Interactive Buttons & Elements**:
  - **Quantity Adjuster (`+` / `-`)**: Modifies item count in cart.
  - **Remove Item (`Trash` Icon)**: Deletes item from cart state.
  - **Coupon Code Input & Apply Button**: Validates discount codes (e.g., `GOLD10`, `ROYAL200`, `EGGLESSFREE`).
  - **Add Candle / Knife / Greeting Card Checkboxes**: Adds party accessories to order.
  - **"Proceed to Checkout" Button**: Navigates to `/checkout`.

---

## 8. Multi-Step Checkout (`/src/pages/Checkout.tsx`)
- **Route**: `/checkout`
- **Purpose**: Delivery address form, delivery time slot selection (Standard, Midnight 12 AM, Express 2-Hour), payment option selection (UPI / QR, Credit Card, COD, Wallet), and order placement.
- **Key Interactive Buttons & Elements**:
  - **Saved Address Selector**: Fills customer shipping fields automatically.
  - **Delivery Time Slot Radio Buttons**: Selects delivery window (+₹150 for Midnight courier dispatch).
  - **Payment Mode Radio Buttons**: Razorpay / UPI QR simulation, NetBanking, COD.
  - **"Place Royal Order" Button**: Writes order data to Firestore (`orders` collection), clears cart, plays success sound, and redirects to `/order-tracking/:orderId`.

---

## 9. Live Order Tracking (`/src/pages/LiveOrderTracking.tsx`)
- **Route**: `/order-tracking/:id`
- **Purpose**: Real-time GPS-simulated order tracking with live status steps (Baking -> Quality Check -> Out for Delivery -> Delivered).
- **Key Interactive Buttons & Elements**:
  - **"Call Delivery Courier" Button**: Opens direct phone dialer / SMS contact.
  - **"Share Live GPS Tracking" Button**: Copies live tracking URL to clipboard.
  - **"Download Tax Invoice" Button**: Generates printable order receipt PDF/HTML.

---

## 10. Rewards & Loyalty Lounge (`/src/pages/RewardsLoyalty.tsx`)
- **Route**: `/rewards`
- **Purpose**: Gamified Cake Coins lounge with playable scratch cards, daily spin wheel, referral code generator, and VIP status tiers.
- **Key Interactive Buttons & Elements**:
  - **Interactive Scratch Card Canvas**: Mouse/touch scratch surface to peel away cover and unlock coupon codes.
  - **"Spin the Wheel" Button**: Rotates 360-degree fortune wheel to award 50-500 Cake Coins or Free Shipping.
  - **"Copy Referral Code" Button**: Copies `CAKE-ABHISHEK-7241` to clipboard.
  - **Mute / Unmute Sound Button**: Toggles Web Audio SFX globally.

---

## 11. Admin Dashboard (`/src/pages/AdminDashboard.tsx`)
- **Route**: `/admin`
- **Purpose**: Merchant control center for managing live orders, updating delivery statuses, modifying cake inventory prices, and viewing revenue analytics.
- **Key Interactive Buttons & Elements**:
  - **Status Update Dropdown**: Changes order state (Pending -> Baking -> Dispatched -> Completed).
  - **"Add New Product" Button**: Modal to insert new cake listing into Firestore.
  - **Export CSV Reports Button**: Downloads sales report.

---

## 12. Additional Specialized Pages
- **`AuthPortal.tsx` (`/auth`, `/login`)**: Phone OTP & Email login modal/page with Google sign-in support.
- **`MyOrders.tsx` (`/my-orders`)**: Historical list of customer past orders with "Reorder" and "Track" buttons.
- **`Profile.tsx` (`/profile`)**: Customer name, phone, saved delivery addresses, and coin balance.
- **`ReviewsGallery.tsx` (`/reviews`)**: Customer photo reviews, star ratings, and verified buyer badges.
- **`CorporateCatering.tsx` (`/corporate`)**: Bulk corporate order inquiry form with GST invoice options.
- **`SeoStudio.tsx` (`/seo-studio`)**: Real-time SEO metadata, keyword analysis, and sitemap generator tool.
