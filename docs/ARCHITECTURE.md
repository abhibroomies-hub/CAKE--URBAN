# System Architecture & Technical Specifications — Cake Urban

## 1. High-Level Architecture
Cake Urban uses a full-stack SPA + Cloud Server architecture built with React, Vite, TypeScript, and Tailwind CSS, backed by Firebase Firestore for persistent data and client-side PWA caching.

```
[ Browser / PWA Client ] 
   ├── 3D Canvas & Interactive3DTilt Engine (120Hz/240Hz GPU Accelerated)
   ├── React Router (SPA Routing)
   ├── Offline Service Worker Cache (/sw.js)
   └── Local State & LocalStorage Store (Offline-First)
           │
           ▼
[ API Proxy & Firebase Integration Layer ]
   ├── Firebase Firestore (`ai-studio-cakeurban-9e732168-61b8-475b-89f5-37b1e865019e`)
   └── Google Gemini API Proxy (`/api/gemini` for auto-SEO tags & AI Personal Shopper)
```

## 2. Tech Stack
- **Frontend Framework**: React 18 with Vite & TypeScript
- **Styling**: Tailwind CSS, Motion (`motion/react`), Lucide Icons
- **3D & Canvas Rendering**: Three.js, Lucide 3D helpers, Custom Spring-Physics 3D Tilt (`Interactive3DTilt`)
- **Database & Auth**: Firebase Firestore & Firebase Auth (`firebase-applet-config.json`)
- **Offline / PWA**: Custom Service Worker (`sw.js`), Web App Manifest (`manifest.json`)

## 3. Directory & File Structure
```
/
├── public/                     # Static assets, sitemaps, robots.txt, sw.js, manifest.json
├── src/
│   ├── assets/                 # High-resolution optimized cake assets
│   ├── components/             # Reusable UI components
│   │   ├── Interactive3DTilt.tsx   # 3D Tilt Card wrapper
│   │   ├── OfflineBanner.tsx       # Offline PWA connection indicator
│   │   ├── ProductCard.tsx         # Interactive 3D Product Card with Quick View & Direct Cart
│   │   ├── Rotating3DCake.tsx      # Interactive 3D Canvas model
│   │   ├── SEO.tsx                 # Dynamic Helmet/Meta tag manager
│   │   └── ...
│   ├── hooks/                  # Auth & Custom Hooks
│   ├── lib/                    # Firebase config, Sound engine, Shop Data pool, Theme system
│   ├── pages/                  # Route views
│   │   ├── AdminDashboard.tsx      # Shopify-style product & inventory management
│   │   ├── Home.tsx                # Hero 3D slider & showcase
│   │   ├── ProductDetail.tsx       # Dynamic product view with instant fallback & 3D preview
│   │   ├── Shop.tsx                # Catalog with instant filtering & sorting
│   │   ├── ThreeDConfigurator.tsx  # 3D Customization Atelier
│   │   └── ...
│   ├── App.tsx                 # Route definitions & global providers
│   ├── index.css               # Global Tailwind CSS & GPU acceleration classes
│   └── main.tsx                # Entry point
└── docs/                       # Project Documentation & Specifications
```
