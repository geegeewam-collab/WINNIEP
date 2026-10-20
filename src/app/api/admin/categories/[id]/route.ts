import { adminGuard } from '@/lib/auth';
import { getDb } from '@/lib/supabase';
import { fail, firstIssue, isUniqueViolation, ok } from '@/lib/api';
import { CategoryPatchSchema } from '@/lib/validations';
import { slugify, UUID_RE } from '@/lib/utils';
import { uniqueSlug } from '@/lib/slug';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Ctx) {
  const denied = await adminGuard();
  if (denied) return denied;
  try {
    const { id } = await params;
    if (!UUID_RE.test(id)) return fail('Category not found.', 404);
    const body = await request.json().catch(() => null);
    const parsed = CategoryPatchSchema.safeParse(body);
    if (!parsed.success) return fail(firstIssue(parsed.error));
    const c = parsed.data;

    const update: Record<string, unknown> = {};
    if (c.name !== undefined) update.name = c.name;
    if (c.slug !== undefined && c.slug.trim() !== '') update.slug = await uniqueSlug('categories', slugify(c.slug) || 'category', id);
    if (c.description !== undefined) update.description = c.description || null;
    if (c.is_visible !== undefined) update.is_visible = c.is_visible;
    if (c.sort_order !== undefined) update.sort_order = c.sort_order;
    if (Object.keys(update).length === 0) return ok();

    const { error } = await getDb().from('categories').update(update).eq('id', id);
    if (error) {
      if (isUniqueViolation(error)) return fail('A category with this name already exists.', 409);
      throw error;
    }
    return ok();
  } catch (error) {
    console.error('[admin] update category failed', error);
    return fail('Could not update the category. Please try again.', 500);
  }
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const denied = await adminGuard();
  if (denied) return denied;
  try {
    const { id } = await params;
    if (!UUID_RE.test(id)) return fail('Category not found.', 404);
    // products.category_id is ON DELETE SET NULL, so products simply become uncategorised
    const { error } = await getDb().from('categories').delete().eq('id', id);
    if (error) throw error;
    return ok();
  } catch (error) {
    console.error('[admin] delete category failed', error);
    return fail('Could not delete the category. Please try again.', 500);
  }
}
