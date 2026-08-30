# CakeUrban — Components & Interactive Buttons Reference

This reference catalog maps all UI components in `/src/components/`, listing every button, drawer, modal, and control function.

---

## 1. Navigation & Header Components

### `Header.tsx`
- **Location**: Top of every page inside `Layout.tsx`.
- **Buttons & Functions**:
  - **Brand Logo Button**: Navigates to Home (`/`).
  - **Category Nav Links** (Cakes, Cupcakes, Custom 3D, Rewards, Corporate, Reviews): Navigates to corresponding route.
  - **Search Icon / Bar Trigger**: Focuses `AiSearchBar` with predictive suggestions.
  - **Wishlist Heart Button**: Opens Wishlist drawer or navigates to `/profile#wishlist` with live count badge.
  - **Cart Bag Button**: Toggles slide-over Cart drawer with real-time total price & badge.
  - **User Profile Avatar / Login Button**: Navigates to `/profile` if logged in, or opens `AuthPortal` modal if guest.
  - **Mobile Menu Toggle (Hamburger)**: Opens `MobileNav` full-screen sheet on mobile viewports.

### `MobileNav.tsx`
- **Location**: Rendered dynamically when hamburger menu is toggled.
- **Buttons & Functions**:
  - **Close Button (`X`)**: Closes navigation drawer.
  - **Quick Category Badges**: Direct links to Chocolate, Eggless, Velvet, Pinata, 3D Builder.
  - **Phone Call Hotline Button**: Initiates phone call (`tel:+919876543210`).
  - **WhatsApp Order Button**: Opens direct WhatsApp chat with pre-filled cake query.

---

## 2. Product Showcase & Card Components

### `ProductCard.tsx`
- **Location**: Used in `Home.tsx`, `Shop.tsx`, and category landing pages.
- **Buttons & Functions**:
  - **Card Container Click**: Navigates to `/product/:id`.
  - **Wishlist Heart Button**: Toggles favorite status in wishlist array; plays `tap` sound.
  - **Quick View Eye Button**: Opens `QuickViewModal` with weight & flavor options.
  - **"Add to Cart" Liquid Gold Button**: Instant add to cart with default 1kg weight; plays `success` audio chime and triggers toast.
  - **Badge Tags**: Displays "Best Seller", "Eggless", "100% Organic", or "Same Day Delivery".

### `QuickViewModal.tsx`
- **Location**: Modal popup rendered over the active page.
- **Buttons & Functions**:
  - **Close Modal (`X` / Backdrop Click)**: Dismisses quick view.
  - **Weight Pill Selectors** (0.5kg, 1kg, 2kg): Recalculates item price.
  - **Eggless Option Checkbox**: Adds eggless preparation fee (+₹50).
  - **Quantity Controls (`+` / `-`)**: Adjusts unit quantity.
  - **"Add To Shopping Bag" Button**: Commits configured product to cart.

---

## 3. Interactive Floating & Utility Components

### `AIPersonalShopper.tsx`
- **Location**: Floating AI drawer trigger on bottom-right corner.
- **Buttons & Functions**:
  - **Floating Sparkle Button**: Toggles AI Assistant chat drawer.
  - **Preset Query Chips**: "Cake for 25th Anniversary", "Kids Superhero Cake", "Eggless Fruit Cake under ₹1000".
  - **Send Message Button**: Sends custom natural language cake recommendation request.
  - **"Add Recommended Cake to Cart" Button**: Direct add to cart from AI recommendation cards.

### `GlobalFloatingActions.tsx`
- **Location**: Fixed floating action dock (bottom-right / bottom-left).
- **Buttons & Functions**:
  - **Scroll-to-Top Button**: Smoothly scrolls window back to top (`window.scrollTo({ top: 0, behavior: 'smooth' })`).
  - **Quick Cart Button**: Displays live item count and opens cart drawer instantly.
  - **Call Helpline Button**: Opens instant call popover.
  - **WhatsApp Support Button**: Direct link to WhatsApp concierge.

### `SmartFilterSidebar.tsx`
- **Location**: Side drawer on `/shop` page.
- **Buttons & Functions**:
  - **Category Checkboxes**: Toggles Chocolate, Fruit, Velvet, Cheesecake, Fondant, Pinata filters.
  - **Price Range Slider**: Min/Max price filter ($ / ₹).
  - **Dietary Toggles**: Eggless, Sugar-Free, Gluten-Free, Vegan.
  - **Minimum Star Rating Selector**: 4+ Stars, 4.5+ Stars.
  - **"Reset All Filters" Button**: Clears all active filter states.

---

## 4. Feedback & Audio Utilities

### `LiveToastAndExitPopup.tsx`
- **Location**: Global notification overlay manager.
- **Buttons & Functions**:
  - **Dismiss Toast Button**: Closes active notification banner.
  - **Exit Intent Discount Button**: Applies emergency 10% exit-intent promo code before user leaves page.

### `lib/audio.ts` (Sound Effects Engine)
- **Functions**:
  - `playSound('click')`: Short metallic click SFX for general buttons.
  - `playSound('success')`: High-frequency pleasant chord for Add-to-Cart & Order Placement.
  - `playSound('scratch')`: Textured friction SFX for Loyalty scratch card.
  - `playSound('spin')`: Accelerating wheel spin SFX for Fortune wheel.
  - `playSound('tap')`: Soft tactile bump for filter toggles.
