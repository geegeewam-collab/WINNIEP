import { adminGuard } from '@/lib/auth';
import { getDb } from '@/lib/supabase';
import { fail, firstIssue, isUniqueViolation, ok } from '@/lib/api';
import { CategorySchema } from '@/lib/validations';
import { slugify } from '@/lib/utils';
import { uniqueSlug } from '@/lib/slug';

export async function POST(request: Request) {
  const denied = await adminGuard();
  if (denied) return denied;
  try {
    const body = await request.json().catch(() => null);
    const parsed = CategorySchema.safeParse(body);
    if (!parsed.success) return fail(firstIssue(parsed.error));
    const c = parsed.data;

    const slug = await uniqueSlug('categories', slugify(c.slug || c.name) || 'category');
    const { data, error } = await getDb()
      .from('categories')
      .insert({
        name: c.name,
        slug,
        description: c.description || null,
        is_visible: c.is_visible ?? true,
        sort_order: c.sort_order ?? 0,
      })
      .select('*')
      .single();
    if (error) {
      if (isUniqueViolation(error)) return fail('A category with this name already exists.', 409);
      throw error;
    }
    return ok({ category: data });
  } catch (error) {
    console.error('[admin] create category failed', error);
    return fail('Could not save the category. Please try again.', 500);
  }
}
