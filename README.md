# WINNIEP — online store

Next.js 16 · Tailwind v4 · Supabase (database) · Cloudinary (product photos) · M-PESA (optional STK push)

**Customer flow:** browse → cart → order request → *you* confirm availability + delivery → customer approves the total → pays with M-PESA → you dispatch.
**Admin:** `/admin` — password login, products (price, in/out of stock, multiple photos, publish/draft), categories, orders, settings.

---

## One-time setup (≈15 minutes)

### 1. Supabase (database)
1. Create a project at supabase.com.
2. **SQL Editor → New query** → paste all of `supabase/schema.sql` → **Run**.
3. **Project Settings → API**: copy the **Project URL** and the **`service_role` key** (keep it secret).

### 2. Cloudinary (photos)
1. Create a free account at cloudinary.com.
2. Dashboard → copy **Cloud name**, **API Key**, **API Secret**.

### 3. Environment variables
Add these in **Vercel → Project → Settings → Environment Variables** (and in `.env.local` for local dev — see `.env.example`):

| Variable | Value |
|---|---|
| `SUPABASE_URL` | Supabase Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role key |
| `ADMIN_PASSWORD` | your admin password (make it long) |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | from Cloudinary |
| `NEXT_PUBLIC_SITE_URL` | your live URL, e.g. `https://winniep.co.ke` |

Then **redeploy**. Open `/admin/login`, sign in, and the Overview page shows a checklist of anything still missing.

### 4. Optional: M-PESA STK push
Needs a Safaricom Daraja app. Set `MPESA_ENV`, `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, `MPESA_SHORTCODE`, `MPESA_PASSKEY`, `MPESA_CALLBACK_SECRET` (+ `MPESA_TRANSACTION_TYPE=CustomerBuyGoodsOnline` and `MPESA_PARTY_B=<till>` for a Till number). Without these the site still works: customers are told you'll send payment details on WhatsApp, and you press **Mark as paid** in the order page once the money arrives.

---

## Running the shop

* **Add a product:** Admin → Products → *Add product*. Upload several photos (front/side/top) from your phone or computer; the first one is the main photo. Choose *In stock*, *Supplier confirmation* (you confirm with your supplier before the customer pays) or *Out of stock*.
* **Update stock fast:** Admin → Products — change the stock dropdown or the Published switch right in the list.
* **Orders:** Admin → Orders. For each order the page shows the next step (confirm availability → set delivery fee → message the customer on WhatsApp → they approve & pay → dispatch → delivered). The WhatsApp button is pre-filled with the right message and the customer's order link.
* **Delivery prices:** Admin → Settings → add counties with a fee. Listed counties are priced automatically; any other county waits for your quote.

## Local development
```bash
cp .env.example .env.local   # fill it in
npm install
npm run dev
```

## Security notes
* The database is only ever accessed from the server with the service-role key; Row Level Security is on with no public policies, so the public anon key can read/write nothing.
* Admin pages and every admin API route check a signed, HttpOnly session cookie.
* Never put the service-role key or Cloudinary secret in a `NEXT_PUBLIC_*` variable.
