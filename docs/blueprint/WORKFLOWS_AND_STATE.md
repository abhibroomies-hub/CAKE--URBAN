# CakeUrban — User Workflows & State Management Blueprint

This document explains the end-to-end user workflows, state persistence, and lifecycle transitions across the CakeUrban application.

---

## 1. Primary Purchase & Ordering Workflow

```
[1. Landing / Search] ──> [2. Product Discovery] ──> [3. Configuration]
       │                          │                          │
       ▼                          ▼                          ▼
 Home / Shop / AI       Filter / Search / Category    Weight, Flavor, Message,
  Personal Shopper       Quick View Modal              Eggless Prep Options
                                                             │
                                                             ▼
[6. Order Tracking] <── [5. Checkout & Payment] <── [4. Cart & Coupons]
       │                          │                          │
 Live GPS Map, Status     Address, Time Slot,          Apply Promo Codes,
 Updates, Invoice PDF     UPI QR / Card / COD          Candles, Gift Wrap
```

### Detailed Step-by-Step Flow:
1. **Product Discovery**: User explores cakes via Home Page featured slider, Shop catalog filters, or AI Personal Shopper prompt.
2. **Product Configuration**:
   - Select weight (0.5 kg to 5 kg).
   - Choose Eggless vs With Egg option (+₹50 for eggless).
   - Enter custom message to be written on the cake (e.g. "Happy 25th Birthday Rahul!").
   - Enter 6-digit Pincode to verify delivery slot availability.
3. **Cart Addition**:
   - Item added to `cart` array stored in React State & `localStorage` (`cakeurban_cart`).
   - Plays `success` chime sound and displays floating toast notification.
4. **Cart Review & Coupons**:
   - User opens Cart page or slide-over drawer.
   - Enter promo code (e.g. `GOLD10` or `ROYAL200`) to apply instant percentage/flat discount.
   - Add party accessories (Candles, Knife, Greeting Card).
5. **Checkout & Order Placement**:
   - User enters delivery contact details & delivery address.
   - Select delivery slot (Standard Same-Day vs Midnight 12:00 AM Courier Dispatch).
   - Choose Payment method (Razorpay simulation, UPI QR, COD).
   - Click "Place Royal Order". Order object is pushed to Firebase Firestore (`orders` collection).
6. **Live Order Tracking**:
   - Redirected to `/order-tracking/:orderId`.
   - Real-time animated status stepper (Order Confirmed -> Baking in Oven -> Decorating -> Out for Delivery -> Delivered).

---

## 2. Custom 3D & AI Cake Builder Workflows

### A. Custom Order Builder (`/custom-order`)
1. User selects tier count (1 Tier, 2 Tier, 3 Tier) and shape.
2. Choose sponge flavor, filling cream, and outer frosting style.
3. Upload reference image inspiration file.
4. Calculate serving count & weight requirements.
5. Generate instant custom price quote and push to cart.

### B. AI Designer Studio (`/ai-designer`)
1. User types natural language prompt (e.g., "3-tier gold leaf chocolate cake with fresh strawberries").
2. AI generation logic constructs visual recipe and prompt preview.
3. Click "Order This AI Creation" to convert AI recipe into cart item.

---

## 3. Rewards & Loyalty Gamification Flow (`/rewards`)

1. **Cake Coins Accumulation**:
   - Earn 10 Cake Coins for every ₹100 spent on checkout.
   - Earn bonus coins for submitting product reviews or sharing referral links.
2. **Interactive Scratch Cards**:
   - User scratches gold canvas surface to reveal hidden discount codes.
3. **Daily Fortune Spin Wheel**:
   - User spins wheel once per day to win free shipping or coin multipliers.
4. **Coin Redemption**:
   - 10 Cake Coins = ₹1 cash value redeemable directly at checkout.
