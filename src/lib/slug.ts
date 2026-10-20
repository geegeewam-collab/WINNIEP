import { getDb } from './supabase';
import { MAX_FEATURED_PRODUCTS } from './utils';

/** Returns `base`, or `base-2`, `base-3`… if that slug is already taken by another row. */
export async function uniqueSlug(table: 'products' | 'categories', base: string, excludeId?: string): Promise<string> {
  const { data, error } = await getDb().from(table).select('id, slug').like('slug', `${base}%`);
  if (error) throw error;
  const taken = new Set(
    (data ?? []).filter((row: { id: string }) => row.id !== excludeId).map((row: { slug: string }) => row.slug)
  );
  if (!taken.has(base)) return base;
  for (let i = 2; i < 1000; i++) {
    const candidate = `${base}-${i}`;
    if (!taken.has(candidate)) return candidate;
  }
  return `${base}-${Date.now()}`;
}

/** True when marking one more product as featured would exceed the home-page slideshow limit. */
export async function featuredLimitReached(excludeId?: string): Promise<boolean> {
  let q = getDb().from('products').select('id', { count: 'exact', head: true }).eq('is_featured', true);
  if (excludeId) q = q.neq('id', excludeId);
  const { count, error } = await q;
  if (error) throw error;
  return (count ?? 0) >= MAX_FEATURED_PRODUCTS;
}

export const FEATURED_LIMIT_MESSAGE = `You already have ${MAX_FEATURED_PRODUCTS} featured products (the maximum). Un-feature one first.`;
