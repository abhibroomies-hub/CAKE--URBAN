# Engineering & Quality Rules — Cake Urban

## Core Directives & Standards

### 1. Functional Integrity & Zero Broken Navigation
- Every product card, list item, search result, or image must be clickable and correctly route to `/product/:id`.
- Product lookup MUST check both the local static fallback pool (`PREMIUM_PRODUCTS_POOL`) and Firebase Firestore, guaranteeing instant rendering without blank screens or 444 errors.

### 2. Shopify-Style Product Administration
- Product creation and editing must allow:
  1. Image upload via Drag-and-Drop or direct file selection (converted to compressed Base64 preview) OR direct URL input.
  2. Weight option configuration with instant unit price adjustments.
  3. Eggless / Sugar-free toggles, Stock Status selection, Category tagging, and 3D Model Preset assignments.
  4. 1-Click Gemini AI auto-generation of SEO tags, meta descriptions, and Google indexing keywords.
  5. Immediate dual-persistence (Firestore Cloud + LocalStorage backup).

### 3. Visual Sophistication & 3D Interactive Design
- All major product cards and showcase elements must feature GPU-accelerated 3D tilt interaction via `Interactive3DTilt`.
- Micro-interactions must maintain 120Hz/240Hz screen fluidity with high-frequency spring physics (`stiffness: 280, damping: 24`).
- Maintain dark-mode luxury gold/rose highlights (`#DFB15B`, `#DE9088`) paired with crisp light-mode neutral layouts.

### 4. Fast Performance & Offline First
- Core static assets and app shell must be cached by `sw.js` for offline view capability.
- Display an informative, non-intrusive offline status banner whenever network connection is lost.
