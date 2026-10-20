import { adminGuard } from '@/lib/auth';
import { getDb } from '@/lib/supabase';
import { fail, firstIssue, isUniqueViolation, ok } from '@/lib/api';
import { ProductPatchSchema } from '@/lib/validations';
import { slugify, UUID_RE } from '@/lib/utils';
import { uniqueSlug } from '@/lib/slug';
import { cleanupImages } from '@/lib/product-images';
import type { ProductImage } from '@/lib/types';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Ctx) {
  const denied = await adminGuard();
  if (denied) return denied;
  try {
    const { id } = await params;
    if (!UUID_RE.test(id)) return fail('Product not found.', 404);

    const body = await request.json().catch(() => null);
    const parsed = ProductPatchSchema.safeParse(body);
    if (!parsed.success) return fail(firstIssue(parsed.error));
    const p = parsed.data;

    const db = getDb();
    const { data: existing, error: loadError } = await db.from('products').select('id, images').eq('id', id).maybeSingle();
    if (loadError) throw loadError;
    if (!existing) return fail('Product not found.', 404);

    const update: Record<string, unknown> = {};
    if (p.name !== undefined) update.name = p.name;
    if (p.slug !== undefined && p.slug.trim() !== '') {
      update.slug = await uniqueSlug('products', slugify(p.slug) || 'product', id);
    }
    if (p.description !== undefined) update.description = p.description || null;
    if (p.sku !== undefined) update.sku = p.sku || null;
    if (p.category_id !== undefined) update.category_id = p.category_id || null;
    if (p.price !== undefined) update.price = p.price;
    if (p.original_price !== undefined) update.original_price = p.original_price;
    if (p.availability !== undefined) update.availability = p.availability;
    if (p.images !== undefined) update.images = p.images;
    if (p.is_featured !== undefined) update.is_featured = p.is_featured;
    if (p.is_published !== undefined) update.is_published = p.is_published;

    if (Object.keys(update).length === 0) return ok();

    const { error } = await db.from('products').update(update).eq('id', id);
    if (error) {
      if (isUniqueViolation(error)) return fail('Another product already uses this SKU.', 409);
      throw error;
    }

    if (p.images !== undefined) {
      const keep = new Set(p.images.map((i) => i.public_id));
      const old: ProductImage[] = Array.isArray(existing.images) ? existing.images : [];
      await cleanupImages(old.filter((i) => !keep.has(i.public_id)));
    }
    return ok();
  } catch (error) {
    console.error('[admin] update product failed', error);
    return fail('Could not update the product. Please try again.', 500);
  }
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const denied = await adminGuard();
  if (denied) return denied;
  try {
    const { id } = await params;
    if (!UUID_RE.test(id)) return fail('Product not found.', 404);

    const db = getDb();
    const { data: existing } = await db.from('products').select('images').eq('id', id).maybeSingle();
    const { error } = await db.from('products').delete().eq('id', id);
    if (error) throw error;
    await cleanupImages(Array.isArray(existing?.images) ? existing.images : []);
    return ok();
  } catch (error) {
    console.error('[admin] delete product failed', error);
    return fail('Could not delete the product. Please try again.', 500);
  }
}
