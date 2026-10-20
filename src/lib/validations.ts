import { z } from 'zod';

const availability = z.enum(['available', 'confirmation_required', 'unavailable']);

const imageSchema = z.object({
  url: z.string().url().max(600),
  public_id: z.string().min(1).max(300),
});

// NOTE: no .default() here on purpose — the same shape is reused (via .partial()) for PATCH,
// and defaults would silently overwrite existing data (e.g. wipe images on a stock toggle).
const productShape = {
  name: z.string().trim().min(2, 'Product name must be at least 2 characters').max(160),
  slug: z.string().trim().max(120).optional(),
  description: z.string().trim().max(5000).optional(),
  sku: z.string().trim().max(60).optional(),
  category_id: z.string().uuid('Invalid category').nullable().optional(),
  price: z.number().int('Price must be a whole number').min(0, 'Price cannot be negative').max(100000000),
  original_price: z.number().int().min(0).max(100000000).nullable().optional(),
  availability,
  images: z.array(imageSchema).max(12, 'A product can have at most 12 photos'),
  is_featured: z.boolean(),
  is_published: z.boolean(),
};

export const ProductCreateSchema = z.object(productShape);
export const ProductPatchSchema = z.object(productShape).partial();

export const CategorySchema = z.object({
  name: z.string().trim().min(2, 'Category name must be at least 2 characters').max(60),
  slug: z.string().trim().max(80).optional(),
  description: z.string().trim().max(500).optional(),
  image_url: z.string().url().max(600).nullable().optional(),
  image_public_id: z.string().min(1).max(300).nullable().optional(),
  is_visible: z.boolean().optional(),
  sort_order: z.number().int().min(0).max(1000).optional(),
});
export const CategoryPatchSchema = CategorySchema.partial();

export const OrderRequestSchema = z.object({
  customer_name: z.string().trim().min(2, 'Full name is required').max(100),
  customer_phone: z.string().trim().min(9, 'Phone number is required').max(20),
  customer_email: z.string().trim().email('Enter a valid email or leave it blank').max(160).optional().or(z.literal('')),
  delivery_county: z.string().trim().min(2, 'County is required').max(60),
  delivery_town: z.string().trim().min(2, 'Town is required').max(100),
  delivery_instructions: z.string().trim().max(500).optional(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().min(1).max(50),
      })
    )
    .min(1, 'Cart cannot be empty')
    .max(50),
  company: z.string().optional(), // honeypot — real users never fill this
});

export const SettingsSchema = z.object({
  whatsapp_number: z.string().trim().min(9, 'WhatsApp number is required').max(20),
  store_email: z.string().trim().email('Enter a valid email or leave it blank').max(160).optional().or(z.literal('')),
  announcement_text: z.string().trim().max(200).optional(),
  delivery_rules: z
    .array(
      z.object({
        county: z.string().trim().min(2).max(60),
        fee: z.number().int().min(0).max(1000000),
      })
    )
    .max(60),
});
