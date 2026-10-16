import { z } from 'zod';

export const ProductSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug is required'),
  description: z.string().min(10, 'Description is too short'),
  category_id: z.string().uuid('Invalid category ID'),
  price: z.number().positive('Price must be a positive number'),
  availability: z.enum(['available', 'confirmation_required', 'unavailable']),
  is_published: z.boolean().optional(),
  is_featured: z.boolean().optional(),
});

export const OrderRequestSchema = z.object({
  customer_name: z.string().min(2, 'Full name is required'),
  customer_phone: z.string().regex(/^\+?254\d{9}$/, 'Invalid Kenyan phone number'),
  delivery_county: z.string().min(2, 'County is required'),
  delivery_town: z.string().min(2, 'Town is required'),
  delivery_instructions: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
  })).min(1, 'Cart cannot be empty'),
});
