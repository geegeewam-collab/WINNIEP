import { adminGuard } from '@/lib/auth';
import { getDb } from '@/lib/supabase';
import { fail, firstIssue, isUniqueViolation, ok } from '@/lib/api';
import { ProductCreateSchema } from '@/lib/validations';
import { slugify } from '@/lib/utils';
import { uniqueSlug } from '@/lib/slug';

export async function POST(request: Request) {
  const denied = await adminGuard();
  if (denied) return denied;
  try {
    const body = await request.json().catch(() => null);
    const parsed = ProductCreateSchema.safeParse(body);
    if (!parsed.success) return fail(firstIssue(parsed.error));
    const p = parsed.data;

    const slug = await uniqueSlug('products', slugify(p.slug || p.name) || 'product');
    const { data, error } = await getDb()
      .from('products')
      .insert({
        name: p.name,
        slug,
        description: p.description || null,
        sku: p.sku || null,
        category_id: p.category_id || null,
        price: p.price,
        original_price: p.original_price ?? null,
        availability: p.availability,
        images: p.images,
        is_featured: p.is_featured,
        is_published: p.is_published,
      })
      .select('id, slug')
      .single();
    if (error) {
      if (isUniqueViolation(error)) return fail('Another product already uses this SKU.', 409);
      throw error;
    }
    return ok({ product: data });
  } catch (error) {
    console.error('[admin] create product failed', error);
    return fail('Could not save the product. Please try again.', 500);
  }
}
