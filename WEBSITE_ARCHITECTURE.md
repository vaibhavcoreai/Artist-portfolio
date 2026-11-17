# Deepak Patil - Artist Portfolio: Complete System & Architecture Specification

> **Purpose of this document:** Provide an exhaustive, structured technical and functional blueprint of the Deepak Patil Artist Portfolio website. AI agents, prompt engineers, or developers can use this document to understand every feature, architecture component, data schema, animation pattern, and aesthetic rule to generate high-precision code, feature updates, marketing copy, or technical prompts.

---

## 1. Executive Summary & Purpose

- **Application Name:** Deepak Patil - Contemporary Artist Portfolio
- **Core Domain/Niche:** High-end contemporary fine art portfolio, interactive exhibition showcase, direct collector inquiry system, and admin content management studio.
- **Target Audience:** Fine art collectors, gallery curators, art patrons, interior architects, art enthusiasts.
- **Tone & Aesthetic:** Luxury, museum-grade, editorial, contemplative, atmospheric, dark-mode first ("near-black" canvas accented with "aged-gold", serif typography, smooth inertial motion).
- **Core Value Proposition:**
  1. Immersive presentation of physical art mediums (Oil on Canvas, Watercolour, Charcoal & Pastel).
  2. Multiple interactive viewing modes (Standard Paginated Gallery with Lightbox, WebGL 3D Cylinder Exhibit / Doom Gallery, Infinite Pan & Zoom Canvas Gallery).
  3. Direct friction-free acquisition & commission inquiry pipelines (WhatsApp direct prefilled messages, telephone, contact form).
  4. Full Supabase-backed Studio Admin panel for live catalog curation, order/visibility management, and artist milestones.

---

## 2. Tech Stack & Dependencies

### Core Framework & Build
- **Runtime / Language:** React 19 (`react` & `react-dom` ^19.2.4), TypeScript (`~5.9.3`)
- **Build Tool:** Vite (`^8.0.1`)
- **Routing:** React Router DOM v6 (`react-router-dom` ^6.30.3)
- **Styling:** Tailwind CSS (`^3.4.19`), PostCSS, custom design tokens in `src/tokens.ts` and `src/globals.css`

### 3D & Graphics Engine
- **Three.js Ecosystem:**
  - `three` (`^0.183.2`): Core WebGL renderer
  - `@react-three/fiber` (`^9.5.0`): React reconciler for Three.js
  - `@react-three/drei` (`^10.7.7`): Useful helpers for R3F scenes
  - `maath` (`^0.10.8`): Math helpers for Three.js & procedural movement
  - `gl-matrix` (`^3.4.4`): Matrix and vector computations

### Animations & Transitions
- **Framer Motion / Motion:** `framer-motion` (`^12.38.0`) and `motion` (`^12.38.0`) for page transitions, stagger animations, modal animations, scroll transforms.
- **GSAP:** `gsap` (`^3.15.0`) for complex timeline choreographies.

### Backend & Cloud Infrastructure
- **BaaS (Backend as a Service):** Supabase (`@supabase/supabase-js` ^2.99.3)
  - PostgreSQL database with Real-time subscriptions
  - Supabase Storage buckets for high-res artwork images and event moments
- **File Uploads:** `react-dropzone` (`^15.0.0`)
- **ID Generation:** `uuid` (`^13.0.0`)

---

## 3. Design System & Visual Language

### Color Palette (Tokens)
- **`near-black` (`#080608` / `#0D0B0D`):** Deep background darkness providing high contrast for paintings.
- **`deep-charcoal` (`#141214` / `#1A181A`):** Card surfaces, admin panels, elevated containers.
- **`aged-gold` (`#C4A468` / `#D4AF37` / `#B89758`):** Luxury accents, active indicators, category badges, subtle borders (`aged-gold/20`).
- **`warm-ivory` (`#F7F4EE` / `#FAF8F5`):** Primary editorial text, artist name, serif headings.
- **`ghost-white` (`#E6E4E2`):** Body typography, secondary metadata with variable opacities (`text-ghost-white/50`, `/70`).

### Typography Hierarchy
- **Display / Headings:** Serif font family (`font-serif`, italic styling, e.g., Playfair Display or Cormorant Garamond aesthetic), uppercase tracking, large editorial scales (`text-display`).
- **Subheadings & Labels:** Sans-serif (`font-sans`), tracked out wide (`tracking-[0.2em]` to `tracking-[0.4em]`), uppercase, gold accent.
- **Body & Data:** Clean neutral sans-serif with generous line-height (`leading-relaxed`) and delicate font weight (`font-light`).

### Interactive Signatures
- **Custom Cursor:** Smooth mouse tracking dot (`cursor-dot`) and inertial lagging ring (`cursor-ring`) via `useCursor` hook. Hidden on mobile touch devices.
- **Magnetic Buttons:** `MagneticButton.tsx` snaps buttons toward cursor proximity.
- **Initial Loading Screen:** Editorial progress loader (`LoadingScreen.tsx`) before unmounting and revealing the viewport.
- **Page Transitions:** `<PageTransition>` and `<ScrollToTop>` ensuring seamless cross-fades and scroll reset between routes.

---

## 4. Site Architecture & Route Map

| Path | Component / Page | Purpose & Core Feature Set |
|---|---|---|
| `/` | `Home.tsx` | Hero landing with interactive Antigravity particle canvas, artist overview banner, quick entry points, slide-over About preview, and footer. |
| `/gallery` | `GalleryPage.tsx` | Standard 2D paginated catalog (6 artworks per page), category filters, detail preview modal, high-resolution fullscreen lightbox, and direct inquiry slide-out. |
| `/exhibit` | `DoomGalleryPage.tsx` | 3D WebGL interactive infinite cylindrical rotary exhibition (`InfiniteMenu`), mouse-drag / touch-swipe navigation, real-time Supabase sync. |
| `/canvas` | `CanvasGalleryPage.tsx` | Infinite 2D drag-and-pan canvas grid (`InfiniteCanvas`), spatial exploration of artworks floating across space. |
| `/about` | `AboutPage.tsx` | Artist biography, artistic philosophy, timeline of career moments/photos, comprehensive lists of awards, solo exhibitions, group shows, and notable private collections. |
| `/inquiry` | `InquiryPage.tsx` | Collector acquisition portal with direct 1-click WhatsApp messaging (`wa.me`), studio phone hotline, email, and commission consultation details. |
| `/admin/*` | `Admin.tsx` | Password-gated private studio management suite: CRUD for Artworks, CRUD for Career Moments, and Studio Settings. |

---

## 5. Detailed Component Breakdown

### 5.1 Hero & Landing (`src/components/Hero/Hero.tsx` & `AntigravityCanvas.tsx`)
- **Particle System:** Canvas-based interactive particle field simulating anti-gravity physics that react gently to cursor motion and ambient drift.
- **Scroll Effects:** Framer Motion `useScroll` transforms reducing scale (`1 -> 0.88`) and fading opacity (`1 -> 0`) as the user scrolls into the body.
- **Editorial Elements:** Ganesha signature emblem, artist title, discipline ("Contemporary Fine Art"), and CTA directing visitors to `/gallery`.

### 5.2 Three Gallery Viewing Modes

#### Mode 1: Standard Catalog (`src/pages/GalleryPage.tsx`)
- **Pagination Engine:** Fixed `PAGE_SIZE = 6` items per view with clean previous/next controls and numbered page selectors.
- **Direct Link Support:** Accepts URL search param `?id=<artwork_id>`: automatically calculates the target page, selects the artwork, and displays its detailed preview.
- **Components:**
  - `ArtworkCard.tsx`: Displays artwork image, title, medium, dimensions, sold badge (`isSold`), and quick inquiry CTA.
  - `Lightbox.tsx`: Fullscreen immersive image view with zoom and backdrop dimming.
  - `InquiryPanel.tsx`: Contextual drawer to inquire directly about the selected piece via pre-filled WhatsApp message.

#### Mode 2: WebGL 3D Cylinder Exhibit (`src/pages/DoomGalleryPage.tsx` & `InfiniteMenu.tsx`)
- **Rendering:** Three.js / React Three Fiber cylindrical scene.
- **Interaction:** Artworks curved into a 3D cylindrical gallery ring. Users drag horizontally/vertically or scroll to rotate through pieces in an infinite loop.
- **Real-time DB Sync:** Supabase postgres changes channel (`artworks_doom_gallery`) listening to updates, deletes, and inserts.

#### Mode 3: Infinite Pan Canvas (`src/pages/CanvasGalleryPage.tsx` & `InfiniteCanvas.tsx`)
- **Interaction:** Infinite coordinate plane where artworks are distributed across coordinates. Users click and drag to pan across infinite 2D canvas space with zoom controls.
- **Real-time DB Sync:** Listens on `artworks_canvas_gallery` channel.

### 5.3 About & Milestones (`src/pages/AboutPage.tsx`)
- **Artist:** Deepak Patil
- **Key Historical Data:**
  - **Awards:** 11+ national and state honors including Nehru Cultural Award (1995), Chitralila Niketan Award (1995), Nokia Asia Pacific Merit (2000), Surbhi Kala Ratna Puraskar (2003), All India Lokmanya Tilak Cash Awards (2004, 2007), Prafulla Dahanukar Art Foundation (2018).
  - **Solo Exhibitions:** Art Society of India, Camlin Art Foundation, Tilak Smruti, State Art Exhibition, Bombay Art Society.
  - **Group Shows:** Jehangir Art Gallery (Mumbai), Kala Sadhana Kendra, India Art Gallery, Sanskruti Art Festival, etc.
  - **Prestigious Collectors:** Mahesh Manjrekar (Director/Actor), Devaki Pandit (Classical Singer), Yatin Shah (Chairman Precision Camshaft), collectors in USA and across India.
- **Studio Moments Section:** Supabase-managed visual gallery of studio photos, exhibition inaugurations, and painting processes.

### 5.4 Navigation & Header (`src/components/NavBar/NavBar.tsx` & `StaggeredMenu.tsx`)
- **Desktop:** Minimalist floating bar with gold accents, brand logo, and quick links.
- **Mobile / Full Overlay Menu:** `StaggeredMenu.tsx` provides high-end cinematic full-screen menu with staggered letter/link animations.

### 5.5 Admin Studio (`src/pages/Admin.tsx`)
- **Authentication:** Gated with environment password `VITE_ADMIN_PASSWORD` (defaults to session-stored auth `sessionStorage.getItem('adminAuth')`).
- **Modules:**
  1. `AdminArtworks.tsx`: Create, update, delete artworks. Upload high-res images via drag-and-drop (`react-dropzone`) directly into Supabase Storage. Control visibility, display order, title, medium, size (cm), freeform category, description, and sale status (`isSold`).
  2. `AdminMoments.tsx`: Manage career timeline moments (year, image, title, description).
  3. `AdminSettings.tsx`: Configure studio contact details, passwords, and display toggles.

---

## 6. Data Models & Database Schemas

### 6.1 `artworks` Table (Supabase PostgreSQL)
```typescript
export interface Artwork {
  id: number | string;            // UUID or serial id
  title: string;                  // Title of artwork (e.g. "Stillness Before Rain")
  medium: string;                 // e.g. "Oil on Canvas", "Watercolour", "Charcoal"
  size: string;                   // Dimensions (e.g. "90x120cm")
  category: string;               // Free-text or preset: "oil", "watercolour", "charcoal", etc.
  aspectRatio: number;            // Width-to-height ratio for masonry/grid layout (default: 0.85)
  imageUrl?: string;              // Public Supabase Storage URL
  description?: string;           // Curatorial narrative or technique details
  isSold?: boolean;               // Acquisition availability toggle
  is_visible?: boolean;           // Show/hide from public gallery
  display_order?: number;         // Sorting rank for custom curation
}
```

### 6.2 `moments` Table
```typescript
export interface Moment {
  id: string;                     // UUID
  image_url: string;              // Photo URL from storage
  title: string;                  // Milestone title
  description: string;            // Details of event or achievement
  year: number;                   // Year occurred (e.g. 1995, 2018)
}
```

---

## 7. Key Integrations & Inquiry Workflows

1. **WhatsApp Direct Booking / Acquisition:**
   - Link format: `https://wa.me/919890646123?text=...`
   - Prefilled message includes artwork title, medium, and size automatically when triggered from `InquiryPanel.tsx`.
2. **Direct Hotline:**
   - Phone link: `tel:+919890646123`
3. **Supabase Realtime Channel Protocol:**
   - Realtime listeners enable live exhibition screens or admin updates to reflect across clients without page reload.

---

## 8. AI Prompting Guide & Persona Instructions

When passing this document to an AI agent to generate features, code, or prompts, instruct the model with the following rules:

### System Prompt Directive for AI Agents
> "You are an expert full-stack engineer and high-end luxury creative designer working on the Deepak Patil Artist Portfolio.
> Always maintain the dark editorial palette (`#080608` near-black, `#C4A468` aged-gold, `#FAF8F5` warm-ivory).
> Use fluid motion with Framer Motion or Three.js/R3F.
> Ensure all database interactions adhere to the Supabase client pattern (`src/lib/supabase.ts`) and TypeScript interfaces (`Artwork`, `Moment`).
> When designing collector-facing interfaces, prioritize intimacy, visual breathing room, serif-italic display typography, and smooth WhatsApp acquisition pathways."

### Common Prompting Templates for this Project:
1. **New 3D Interaction Prompt:** *"Using Three.js and `@react-three/fiber`, add a [feature, e.g. virtual frame lighting simulator] to `/exhibit` matching the existing `InfiniteMenu` architecture."*
2. **Admin Enhancement Prompt:** *"Update `AdminArtworks.tsx` to support [e.g. batch reordering / price tags] ensuring Supabase schema compatibility."*
3. **Gallery Layout Prompt:** *"Create a new exhibition view mode that renders artworks with [e.g. horizontal gallery scroll / masonry wall] adhering to Tailwind tokens and `ArtworkCard` specs."*
