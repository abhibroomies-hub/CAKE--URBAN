export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  costPerItem?: number;
  sku?: string;
  barcode?: string;
  vendor?: string;
  productType?: string;
  status?: 'active' | 'draft' | 'archived';
  categories: string[];
  collections?: string[];
  tags?: string[];
  occasions: string[];
  flavors: string[];
  images: string[];
  stockStatus: 'in-stock' | 'out-of-stock';
  inventoryQuantity?: number;
  isCustomizable: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
  weights?: number[];
  dietary?: string[];
  createdAt?: any;
  updatedAt?: any;
  seoTitle?: string;
  seoSlug?: string;
  seoKeywords?: string[];
  seoMetaDescription?: string;
  seoSchema?: string;
  seoCustomParagraph?: string;
  customLocationParagraph?: string;
  instagramCaption?: string;
  pinterestPin?: {
    title: string;
    description: string;
  };
  reviewsCount?: number;
  rating?: number;
}

export interface CategoryCollection {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image?: string;
  group?: 'birthday' | 'designer' | 'trending' | 'general';
  icon?: string;
  badge?: string;
  productCount?: number;
  isFeatured?: boolean;
  sortOrder?: number;
  ruleType?: 'manual' | 'automated';
  conditions?: string;
  createdAt?: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxUsage?: number;
  usageCount: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedWeight?: number;
  selectedFlavor?: string;
  cakeMessage?: string;
  eggless?: boolean;
  extras?: string[];
  additionalInstructions?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  addresses?: Address[];
  role: 'customer' | 'admin';
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  line1: string;
  line2?: string;
  sector: string;
  city: string;
  pincode: string;
}

export interface Order {
  id: string;
  userId?: string;
  guestEmail?: string;
  phoneNumber?: string;
  items: CartItem[];
  total: number;
  status: 'new' | 'baking' | 'out-for-delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: Address;
  deliveryDate: string;
  deliverySlot: string;
  createdAt: string;
  cakeInstructions?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}
