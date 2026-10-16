# WINNIEP — DATABASE SCHEMA (PostgreSQL)

## 1. Core Entities

### `categories`
- `id`: uuid (PK)
- `name`: text (Not Null, Unique)
- `slug`: text (Not Null, Unique)
- `description`: text
- `image_url`: text
- `is_visible`: boolean (Default: true)
- `parent_id`: uuid (FK -> categories.id, Nullable)
- `created_at`: timestamptz (Default: now())

### `products`
- `id`: uuid (PK)
- `name`: text (Not Null)
- `slug`: text (Not Null, Unique)
- `description`: text
- `sku`: text (Unique)
- `category_id`: uuid (FK -> categories.id)
- `price`: integer (Not Null) -- Stored in minor units (e.g., cents)
- `original_price`: integer (Nullable)
- `availability`: text (Check: 'available', 'confirmation_required', 'unavailable')
- `is_featured`: boolean (Default: false)
- `is_published`: boolean (Default: false)
- `created_at`: timestamptz (Default: now())
- `updated_at`: timestamptz (Default: now())

### `product_images`
- `id`: uuid (PK)
- `product_id`: uuid (FK -> products.id, On Delete: Cascade)
- `url`: text (Not Null)
- `alt_text`: text
- `is_main`: boolean (Default: false)
- `sort_order`: integer (Default: 0)

### `orders`
- `id`: uuid (PK)
- `reference`: text (Unique, Not Null) -- Public order ref (e.g., WNP-1001)
- `customer_name`: text (Not Null)
- `customer_phone`: text (Not Null)
- `customer_email`: text (Nullable)
- `delivery_county`: text (Not Null)
- `delivery_town`: text (Not Null)
- `delivery_instructions`: text
- `total_amount`: integer (Not Null)
- `delivery_fee`: integer (Default: 0)
- `fulfilment_status`: text (Check: 'awaiting_availability', 'awaiting_delivery_quote', 'awaiting_customer_approval', 'awaiting_payment', 'processing', 'dispatched', 'delivered', 'cancelled')
- `payment_status`: text (Check: 'not_started', 'pending', 'successful', 'failed', 'cancelled', 'expired')
- `created_at`: timestamptz (Default: now())
- `updated_at`: timestamptz (Default: now())

### `order_items`
- `id`: uuid (PK)
- `order_id`: uuid (FK -> orders.id, On Delete: Cascade)
- `product_id`: uuid (FK -> products.id)
- `name_snapshot`: text (Not Null) -- Purchase-time name
- `sku_snapshot`: text (Nullable)
- `price_snapshot`: integer (Not Null) -- Purchase-time price
- `quantity`: integer (Not Null)
- `variant_snapshot`: text (Nullable)

### `payments`
- `id`: uuid (PK)
- `order_id`: uuid (FK -> orders.id)
- `transaction_ref`: text (Unique) -- M-PESA Checkout Request ID
- `amount`: integer (Not Null)
- `status`: text (Check: 'pending', 'successful', 'failed')
- `provider`: text (Default: 'mpesa')
- `created_at`: timestamptz (Default: now())

### `store_settings`
- `id`: integer (PK, Default: 1)
- `whatsapp_contact`: text (Not Null)
- `store_email`: text
- `announcement_text`: text
- `delivery_rules`: jsonb -- Store zone-based or fixed rates
- `updated_at`: timestamptz (Default: now())
