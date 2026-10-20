export type Availability = 'available' | 'confirmation_required' | 'unavailable';

export type FulfilmentStatus =
  | 'awaiting_availability'
  | 'awaiting_delivery_quote'
  | 'awaiting_customer_approval'
  | 'awaiting_payment'
  | 'processing'
  | 'dispatched'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'not_started' | 'pending' | 'successful' | 'failed' | 'cancelled' | 'expired';

export interface ProductImage {
  url: string;
  public_id: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url?: string | null;
  image_public_id?: string | null;
  is_visible: boolean;
  sort_order: number;
}

/** A category plus the picture the storefront should show for it. */
export type CategoryCard = Category & { cover: string | null };

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sku: string | null;
  category_id: string | null;
  price: number;
  original_price: number | null;
  availability: Availability;
  images: ProductImage[];
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  category: { id: string; name: string; slug: string } | null;
}

/** The small, serialisable subset the storefront cards need. */
export type ProductCardData = Pick<
  Product,
  'id' | 'slug' | 'name' | 'price' | 'original_price' | 'availability' | 'images'
> & { category: { name: string } | null };

export interface Order {
  id: string;
  reference: string;
  public_token: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_county: string;
  delivery_town: string;
  delivery_instructions: string | null;
  subtotal: number;
  delivery_fee: number | null;
  fulfilment_status: FulfilmentStatus;
  payment_status: PaymentStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  name_snapshot: string;
  sku_snapshot: string | null;
  price_snapshot: number;
  quantity: number;
  image_snapshot: string | null;
}

export interface Payment {
  id: string;
  order_id: string;
  transaction_ref: string | null;
  amount: number;
  phone: string | null;
  status: 'pending' | 'successful' | 'failed';
  mpesa_receipt: string | null;
  result_desc: string | null;
  provider: string;
  created_at: string;
}

export interface DeliveryRule {
  county: string;
  fee: number;
}

export interface StoreSettings {
  whatsapp_number: string;
  store_email: string | null;
  announcement_text: string | null;
  delivery_rules: DeliveryRule[];
}
