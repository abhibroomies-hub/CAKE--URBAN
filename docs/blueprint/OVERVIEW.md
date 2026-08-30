# CakeUrban — Master Architecture & Technical Overview

## 1. Executive Application Summary
**CakeUrban** is a hyper-premium, full-stack gourmet confectionery and luxury cake e-commerce platform built with React (TypeScript), Vite, Tailwind CSS, Framer Motion, and Firebase Firestore.

- **Primary Stack**: React 18 (TypeScript), Vite, Tailwind CSS v4, Lucide Icons, Framer Motion.
- **Database & Persistence**: Firebase Firestore (`ai-studio-cakeurban-9e732168-61b8-475b-89f5-37b1e865019e`) + LocalStorage fallback.
- **Visual Design System**: Dark luxury gold theme (`#131313` custom geometric textured pattern, `#DFB15B` liquid gold accents, `#1E0B07` rich chocolate tones, `#FFFDFB` crisp typography).

---

## 2. Global Directory Structure & Key Files

```
├── /docs/blueprint/               # Full Project Blueprint & Mapping Directory
│   ├── OVERVIEW.md               # Architecture, Tech Stack & Global Rules (This File)
│   ├── PAGES_MAPPING.md          # Complete Analysis of Every Page & Interactive Feature
│   ├── COMPONENTS_AND_BUTTONS.md # Comprehensive Button & UI Component Reference
│   ├── WORKFLOWS_AND_STATE.md    # User Journeys, Shopping Flow, Customizer & Tracking
│   └── FIREBASE_AND_SERVICES.md  # Firestore Schemas, Audio Synthesizer & SEO Logic
│
├── /src/
│   ├── App.tsx                    # Main App Entry, React Router Configuration, Providers
│   ├── main.tsx                   # React DOM Root Mounting
│   ├── index.css                  # Global Styling, Custom HTML Pattern, Tailwind Rules
│   ├── types.ts                   # TypeScript Interfaces for Products, Cart, Orders, Reviews
│   ├── custom.d.ts                # Environment & Webpack Type Declarations
│   │
│   ├── /components/               # Reusable UI & Widget System
│   │   ├── Layout.tsx             # Root Layout Wrapper, Parallax Engine, Header/Footer Mounting
│   │   ├── Header.tsx             # Main Navigation Header, Search Trigger, Cart Badge, Wishlist
│   │   ├── Footer.tsx             # Footer Links, Newsletter Form, Social Media Links
│   │   ├── ProductCard.tsx        # Standard Product Item Card with Quick Add & Hover Effects
│   │   ├── AIPersonalShopper.tsx  # Floating AI Recommendation Assistant Drawer
│   │   ├── AiSearchBar.tsx        # Smart Predictive Search & Voice/Text Filter
│   │   ├── AnnouncementBar.tsx    # Live Announcement & Ticker Strip
│   │   ├── GlobalFloatingActions.tsx # Scroll To Top, Quick Call, Cart Trigger, VIP Badge
│   │   ├── LiveOrderTracking.tsx # Real-time Map & Progress Tracking Widget
│   │   ├── SmartFilterSidebar.tsx # Category, Price, Flavor & Dietary Filter Drawer
│   │   ├── QuickViewModal.tsx     # Fast Product Detail Modal with Weight & Flavor Choice
│   │   └── ...                    # Additional Luxury Widgets
│   │
│   ├── /pages/                    # Application Views & Route Handlers
│   │   ├── Home.tsx               # Main Landing Page (Hero, Categories, Best Sellers, Reviews)
│   │   ├── Shop.tsx               # Full Catalog with Filters, Grid Views & Sorting
│   │   ├── ProductDetail.tsx      # Comprehensive Single Product View with Customizations
│   │   ├── CustomOrder.tsx        # Custom Cake Builder Form (Tier, Flavor, Message, Delivery)
│   │   ├── ThreeDConfigurator.tsx # Interactive 3D Cake Visualizer & Customizer
│   │   ├── AiDesignerStudio.tsx   # AI Prompt-Based Custom Cake Image & Recipe Generator
│   │   ├── Cart.tsx               # Cart Drawer/Page with Item Controls & Coupon Code Input
│   │   ├── Checkout.tsx           # Multi-step Checkout, Address, Payment Methods & Orders
│   │   ├── LiveOrderTracking.tsx  # Real-time Order Delivery Map & Status Tracker
│   │   ├── RewardsLoyalty.tsx     # VIP Royalty Club, Scratch Cards, Spin Wheel & Referrals
│   │   ├── AdminDashboard.tsx     # Merchant Order, Inventory & Customer Management
│   │   └── ...                    # Specialized Landing & SEO Pages
│   │
│   └── /lib/                      # Utilities & Service Libraries
│       ├── firebase.ts            # Firebase App & Firestore Database Client
│       ├── audio.ts               # Web Audio API Sound Effects Synthesizer
│       └── utils.ts               # Helper Functions (Currency Format, CN class merger)
```

---

## 3. Global State & Data Flow
- **Cart Context / State**: Persistent cart stored in `localStorage` (`cakeurban_cart`), syncs with Firestore for logged-in users.
- **Wishlist State**: Synchronized array of favorited product IDs (`cakeurban_wishlist`).
- **User Authentication**: Managed via AuthPortal / Local session storage (`cakeurban_user`), supporting VIP membership tiers (Sovereign Gold, VIP Platinum, Velvet Diamond).
- **Sound Effects Engine**: Managed via `/src/lib/audio.ts` (Web Audio API synthesizers for click, success, scratch, spin wheel, and tap sounds).
