import { getDb } from './supabase';

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
