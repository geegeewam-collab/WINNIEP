# WINNIEP — Premium Kenyan Ecommerce Store

WinnieP is a high-end, mobile-first ecommerce platform designed for a premium retail business in Kenya selling household products, electronics, and home décor.

## 🎨 Brand Identity
- **Visual Direction**: Contemporary premium home retail with warm editorial art direction.
- **Design Tokens**:
  - Background: Warm Ivory (#F7F3EB)
  - Accent: Copper (#B87343)
  - Primary Text: Espresso (#2D241F)
  - Typography: Cormorant Garamond (Display) & DM Sans (UI/Body)

## 🚀 Tech Stack
- **Frontend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS.
- **Backend/Database**: Supabase (PostgreSQL, Auth, Storage).
- **Validation**: Zod.
- **Payments**: Safaricom Daraja API (M-PESA Express/STK Push).

## ⚙️ Core Business Logic: The "Review-First" Flow
Unlike generic stores, WinnieP implements a strict order validation pipeline to handle supplier-dependent inventory and mixed delivery arrangements:

1. **Order Request**: Customer submits details $\rightarrow$ Order created in `awaiting_availability` status.
2. **Availability Review**: Admin verifies stock with suppliers.
3. **Delivery Quotation**: Admin determines the exact delivery fee based on destination.
4. **Customer Approval**: Customer is notified via WhatsApp and approves the final total.
5. **Payment Gating**: M-PESA payment is only triggered after all reviews are complete.
6. **Fulfilment**: Order is processed, dispatched, and delivered.

## 🛠️ Local Setup
1. **Install Dependencies**:
   \`\`\`bash
   npm install
   \`\`\`
2. **Environment Variables**:
   Create a \`.env.local\` file with:
   - \`NEXT_PUBLIC_SUPABASE_URL=\`
   - \`NEXT_PUBLIC_SUPABASE_ANON_KEY=\`
   - \`MPESA_CONSUMER_KEY=\`
   - \`MPESA_CONSUMER_SECRET=\`
3. **Run Development Server**:
   \`\`\`bash
   npm run dev
   \`\`\`
