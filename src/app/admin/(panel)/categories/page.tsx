import React from 'react';
import { CategoriesManager, type CategoryRow } from '@/components/admin/CategoriesManager';
import { DbError, PageHeader } from '@/components/admin/PageHeader';
import { requireAdmin } from '@/lib/auth';
import { getDb } from '@/lib/supabase';
import type { Category } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  await requireAdmin();
  let rows: CategoryRow[] = [];
  let error = '';
  try {
    const db = getDb();
    const [cats, prods] = await Promise.all([
      db.from('categories').select('*').order('sort_order', { ascending: true }).order('name', { ascending: true }),
      db.from('products').select('category_id, images, is_published').order('created_at', { ascending: false }),
    ]);
    if (cats.error) throw cats.error;
    if (prods.error) throw prods.error;
    const counts = new Map<string, number>();
    const fallback = new Map<string, string>(); // newest published product photo per category — what the shop shows by default
    for (const p of (prods.data ?? []) as { category_id: string | null; images: { url: string }[] | null; is_published: boolean }[]) {
      if (!p.category_id) continue;
      counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
      const url = Array.isArray(p.images) ? p.images[0]?.url : undefined;
      if (p.is_published && url && !fallback.has(p.category_id)) fallback.set(p.category_id, url);
    }
    rows = ((cats.data ?? []) as Category[]).map((c) => ({ ...c, product_count: counts.get(c.id) ?? 0, fallback: fallback.get(c.id) ?? null }));
  } catch (e) {
    console.error('[admin] categories failed', e);
    error = e instanceof Error ? e.message : 'Unknown error';
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Categories" description="Group products into collections and set the picture shown for each on the home page." />
      {error ? <DbError message={error} /> : <CategoriesManager initial={rows} />}
    </div>
  );
}
