# WINNIEP — UI/UX DESIGN SPECIFICATION

## 1. Visual Identity
Contemporary premium home retail with warm editorial art direction.

### Design Tokens
**Colors**
- `Primary Background`: #F7F3EB (Warm Ivory)
- `Brand Accent`: #B87343 (Copper)
- `Primary Text/Dark`: #2D241F (Deep Espresso)
- `Secondary Surface`: #DFCFBA (Soft Sand)
- `White Surface`: #FFFFFF
- `Secondary Text`: #6F655D
- `Subtle Border`: #E8E0D6
- `Muted Background`: #F0E9DF

**Typography**
- `Display`: Cormorant Garamond (Serif) - Used for expressive editorial headings.
- `UI/Body`: DM Sans (Sans-Serif) - Used for navigation, product titles, pricing, and forms.

**Spacing System**
- 4px increments.
- Page side padding: Mobile (18-22px), Desktop (48-64px).
- Section spacing: Mobile (40-56px), Desktop (64-88px).

## 2. Global Components
### Header
- **Announcement Strip**: Slim (32px), Espresso background, light text.
- **Main Header**: 78-88px height.
    - Left: WinnieP wordmark.
    - Center: Nav (Home, Shop, Household, Electronics, Décor, About).
    - Right: Search, WhatsApp, Cart (with item count).
- **Mobile Header**: Menu toggle, Wordmark, Search icon, Cart icon.

### Footer
- 4-column layout: Brand/Description, Shop Links, Support Links, Contact/Policies.

## 3. Page-by-Page Layouts
### Homepage (`/`)
- **Hero**: Two-column (Text 45%, Image 55%).
- **Category Intro**: 3 cards (Household, Electronics, Décor).
- **Featured Products**: 4-column grid (Desktop), 2-column (Mobile).
- **Brand Experience**: Editorial section with imagery.
- **Service Strip**: Icons for Delivery, Support, Availability, Payments.

### Shop All (`/shop`)
- **Toolbar**: Search, Category select, Sort, Filter.
- **Grid**: Responsive columns (4 $\rightarrow$ 3 $\rightarrow$ 2).
- **States**: Loading skeletons, Empty result state.

### Product Detail (`/product/[slug]`)
- **Layout**: 2-column (Gallery 55%, Info 45%).
- **Gallery**: Primary image + thumbnails.
- **Info**: Breadcrumbs $\rightarrow$ Name $\rightarrow$ Price $\rightarrow$ Availability $\rightarrow$ Variants $\rightarrow$ Quantity $\rightarrow$ Add to Cart $\rightarrow$ WhatsApp enquiry.

### Cart & Checkout (`/cart`, `/checkout`)
- **Cart**: Order summary, item list with thumbnails, quantity controls.
- **Checkout**: Single-page grouped sections (Contact $\rightarrow$ Delivery $\rightarrow$ Payment $\rightarrow$ Final Review).

### Admin Dashboard (`/admin`)
- **Layout**: Fixed left sidebar (230-250px), main content area.
- **Overview**: Metric cards, Recent Orders table.
- **Product Editor**: Logical grouped sections, Image uploader with previews.

## 4. Implementation Phases
- **Phase 1**: Design Foundation (Tokens, Global Layout, Base Components).
- **Phase 2**: Homepage Implementation.
- **Phase 3**: Product Discovery (Shop, Categories, PDP).
- **Phase 4**: Cart & Order Request (Review-first logic).
- **Phase 5**: Admin Dashboard (Product/Order/Category management).
- **Phase 6**: Integrations (M-PESA Daraja, Delivery rules).
- **Phase 7**: QA & Polish.
