# Memory & Database Strategy — Cake Urban

## 1. Firebase Firestore Schemas
Firestore Database ID: `ai-studio-cakeurban-9e732168-61b8-475b-89f5-37b1e865019e`

### Collection: `products`
```typescript
interface ProductDocument {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  categories: string[];
  occasions: string[];
  flavors: string[];
  images: string[];
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock';
  isCustomizable: boolean;
  bakingTimeHours?: number;
  rating?: number;
  reviewsCount?: number;
  isBestseller?: boolean;
  isChefSpecial?: boolean;
  createdAt?: string;
  seoTags?: string[];
  seoDescription?: string;
  threeDPreset?: string;
}
```

### Collection: `orders`
```typescript
interface OrderDocument {
  id: string;
  userId: string;
  guestEmail?: string;
  items: CartItem[];
  total: number;
  status: 'new' | 'baking' | 'dispatched' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: Address;
  deliveryDate: string;
  deliverySlot: string;
  createdAt: string;
}
```

## 2. Offline-First Caching Strategy
- **Service Worker (`public/sw.js`)**: Intercepts `GET` requests for HTML, JS, CSS, and core images. Stores successfully retrieved assets in `cake-urban-v1-offline` cache.
- **LocalStorage Sync (`cake_urban_cart`, `cake_urban_products_override`)**: Saves user cart state, custom cake configurations, and newly added admin products locally so offline users never lose state.
