# CakeUrban — Firebase, Database & Backend Services Reference

This document documents the database schema, persistent collections, and audio/service modules used in CakeUrban.

---

## 1. Firebase Firestore Configuration
- **Database ID**: `ai-studio-cakeurban-9e732168-61b8-475b-89f5-37b1e865019e`
- **Location Config**: Configured in `/src/lib/firebase.ts`.

---

## 2. Firestore Collections & Schema Definitions

### Collection: `products`
```typescript
interface ProductDocument {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: 'chocolate' | 'velvet' | 'fruit' | 'cheesecake' | 'fondant' | 'pinata' | 'cupcakes';
  flavor: string;
  rating: number;
  reviewsCount: number;
  images: string[];
  description: string;
  egglessAvailable: boolean;
  isBestSeller?: boolean;
  weights: number[]; // e.g. [0.5, 1, 2, 5]
  ingredients?: string[];
  createdAt: string;
}
```

### Collection: `orders`
```typescript
interface OrderDocument {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  deliveryDate: string;
  deliverySlot: 'standard' | 'midnight' | 'express';
  items: Array<{
    productId: string;
    productName: string;
    weight: number;
    eggless: boolean;
    customMessage: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  discountApplied: number;
  paymentMethod: 'upi' | 'card' | 'cod';
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'confirmed' | 'baking' | 'quality_check' | 'out_for_delivery' | 'delivered';
  trackingGps: {
    lat: number;
    lng: number;
  };
  createdAt: string;
}
```

### Collection: `reviews`
```typescript
interface ReviewDocument {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  photoUrl?: string;
  verifiedBuyer: boolean;
  createdAt: string;
}
```

### Collection: `loyalty_users`
```typescript
interface LoyaltyUserDocument {
  uid: string;
  phone: string;
  coinBalance: number;
  loyaltyTier: 'Sovereign Gold' | 'VIP Platinum' | 'Velvet Diamond';
  referralCode: string;
  totalOrdersCount: number;
  claimedCoupons: string[];
  scratchedCards: string[];
  lastSpinTimestamp?: string;
}
```

---

## 3. Web Audio API Sound Synthesizer (`/src/lib/audio.ts`)
CakeUrban features custom synth audio feedback built without external heavy audio assets:
- Uses `window.AudioContext` or `window.webkitAudioContext`.
- Generates pure sine & triangle wave oscillators with custom gain envelopes for instant responsive audio feedback without network requests.

---

## 4. LocalStorage Fallback Keys
- `cakeurban_cart`: Backup JSON array for cart items.
- `cakeurban_wishlist`: Backup JSON array of favorited product IDs.
- `cakeurban_coins`: User active coin balance in offline mode.
- `cakeurban_recent`: Array of recently viewed product objects.
