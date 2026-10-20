import { getDb } from './supabase';
import type { Category, CategoryCard, DeliveryRule, Product, StoreSettings } from './types';

const PRODUCT_SELECT = '*, category:categories(id, name, slug)';

export const DEFAULT_SETTINGS: StoreSettings = {
  whatsapp_number: '254756374843',
  store_email: null,
  announcement_text: null,
  delivery_rules: [],
};

/** Storefront reads should never take the whole page down: log and fall back instead. */
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error('[data]', error);
    return fallback;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeProduct(row: any): Product {
  return {
    ...row,
    images: Array.isArray(row.images) ? row.images : [],
    category: row.category && !Array.isArray(row.category) ? row.category : null,
  } as Product;
}

export interface ProductQuery {
  q?: string;
  categorySlug?: string;
  sort?: string;
  featured?: boolean;
  limit?: number;
  includeUnpublished?: boolean;
}

export async function queryProducts(opts: ProductQuery = {}): Promise<Product[]> {
  const db = getDb();

  let categoryId: string | undefined;
  if (opts.categorySlug) {
    const { data: cat, error } = await db.from('categories').select('id').eq('slug', opts.categorySlug).maybeSingle();
    if (error) throw error;
    if (!cat) return [];
    categoryId = cat.id as string;
  }

  let q = db.from('products').select(PRODUCT_SELECT);
  if (!opts.includeUnpublished) q = q.eq('is_published', true);
  if (categoryId) q = q.eq('category_id', categoryId);
  if (opts.featured) q = q.eq('is_featured', true);
  if (opts.q) {
    const clean = opts.q.replace(/[%,()*\\]/g, ' ').trim();
    if (clean) q = q.ilike('name', `%${clean}%`);
  }

  switch (opts.sort) {
    case 'price_asc':
      q = q.order('price', { ascending: true });
      break;
    case 'price_desc':
      q = q.order('price', { ascending: false });
      break;
    case 'name':
      q = q.order('name', { ascending: true });
      break;
    default:
      q = q.order('created_at', { ascending: false });
  }
  if (opts.limit) q = q.limit(opts.limit);

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(normalizeProduct);
}

export function getProducts(opts: ProductQuery = {}): Promise<Product[]> {
  return safe(() => queryProducts(opts), []);
}

export function getProductBySlug(slug: string, includeUnpublished = false): Promise<Product | null> {
  return safe(async () => {
    let q = getDb().from('products').select(PRODUCT_SELECT).eq('slug', slug);
    if (!includeUnpublished) q = q.eq('is_published', true);
    const { data, error } = await q.maybeSingle();
    if (error) throw error;
    return data ? normalizeProduct(data) : null;
  }, null);
}

export function getCategories(opts: { all?: boolean } = {}): Promise<Category[]> {
  return safe(async () => {
    let q = getDb().from('categories').select('*').order('sort_order', { ascending: true }).order('name', { ascending: true });
    if (!opts.all) q = q.eq('is_visible', true);
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []) as Category[];
  }, []);
}

export function getCategoryBySlug(slug: string): Promise<Category | null> {
  return safe(async () => {
    const { data, error } = await getDb().from('categories').select('*').eq('slug', slug).maybeSingle();
    if (error) throw error;
    return (data as Category | null) ?? null;
  }, null);
}

export function getSettings(): Promise<StoreSettings> {
  return safe(async () => {
    const { data, error } = await getDb().from('store_settings').select('*').eq('id', 1).maybeSingle();
    if (error) throw error;
    if (!data) return DEFAULT_SETTINGS;
    const rules: DeliveryRule[] = Array.isArray(data.delivery_rules) ? data.delivery_rules : [];
    return {
      whatsapp_number: data.whatsapp_number || DEFAULT_SETTINGS.whatsapp_number,
      store_email: data.store_email ?? null,
      announcement_text: data.announcement_text ?? null,
      delivery_rules: rules,
    };
  }, DEFAULT_SETTINGS);
}

/**
 * Visible categories, each with a cover picture: the photo uploaded for the category if there is one,
 * otherwise the main photo of its newest published product that has a photo, otherwise null (placeholder).
 */
export function getCategoryCards(): Promise<CategoryCard[]> {
  return safe(async () => {
    const categories = await getCategories();
    if (categories.length === 0) return [];
    const needFallback = categories.filter((c) => !c.image_url);
    const fallback = new Map<string, string>();
    if (needFallback.length > 0) {
      const { data, error } = await getDb()
        .from('products')
        .select('category_id, images')
        .eq('is_published', true)
        .in('category_id', needFallback.map((c) => c.id))
        .order('created_at', { ascending: false })
        .limit(500);
      if (error) throw error;
      for (const row of (data ?? []) as { category_id: string | null; images: { url: string }[] | null }[]) {
        const url = Array.isArray(row.images) ? row.images[0]?.url : undefined;
        if (row.category_id && url && !fallback.has(row.category_id)) fallback.set(row.category_id, url);
      }
    }
    return categories.map((c) => ({ ...c, cover: c.image_url || fallback.get(c.id) || null }));
  }, []);
}
