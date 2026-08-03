# Product Requirement Document (PRD) — Cake Urban

## 1. What to Build
**Cake Urban** is a high-performance, luxury 3D artisan cake boutique and full-featured e-commerce platform. It provides customers with an interactive 3D cake customizer atelier, instant location-based local SEO landing pages, seamless express checkout, and a powerful Shopify-style administrative management system for managing products, images, orders, inventory, and SEO automation.

## 2. Target Users
- **Boutique Customers & Event Hosts**: Searching for premium artisan cakes, wedding tier cakes, birthday customized bakes, and gourmet gift hampers with 3D previews.
- **Store Owners & Pastry Chefs (Admins)**: Managing product catalogs, uploading product images (drag-and-drop or URL), configuring weight pricing, updating inventory status, and monitoring real-time orders.
- **Corporate & Local Buyers**: Ordering in bulk for corporate events, anniversary galas, and local delivery across key metro sectors.

## 3. Core Features
- **3D Atelier & Configurator**: Interactive Three.js / Canvas 3D cake customization with flavor layers, frosting colors, toppers, and real-time pricing calculation.
- **Shopify-Style Product Management**:
  - Drag-and-drop image upload with live preview & Base64/URL encoding.
  - Multi-tier weight pricing, eggless toggles, stock status, categories, and tags.
  - Gemini AI auto-generation of SEO tags, meta descriptions, and search titles.
  - Dual local state + Firestore cloud synchronization.
- **Product Detail Engine**: Instant loading from local static pools and Firestore documents, ensuring zero broken clicks across all cards and categories.
- **Offline PWA Capability**: Service worker caching core assets, static product catalog, and cart data for fast offline viewing.
- **Granular SEO Studio**: Programmatic SEO landing pages for 12+ categories, city/sector landing pages, live sitemaps (`sitemap.xml`), and schema health monitors.
