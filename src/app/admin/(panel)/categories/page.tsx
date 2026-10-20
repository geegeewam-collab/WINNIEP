import React from 'react';
import { CategoriesManager } from '@/components/admin/CategoriesManager';
import { DbError, PageHeader } from '@/components/admin/PageHeader';
import { requireAdmin } from '@/lib/auth';
import { getDb } from '@/lib/supabase';
import type { Category } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  await requireAdmin();
  let rows: (Category & { product_count: number })[] = [];
  let error = '';
  try {
    const db = getDb();
    const [cats, prods] = await Promise.all([
      db.from('categories').select('*').order('sort_order', { ascending: true }).order('name', { ascending: true }),
      db.from('products').select('category_id'),
    ]);
    if (cats.error) throw cats.error;
    if (prods.error) throw prods.error;
    const counts = new Map<string, number>();
    for (const p of (prods.data ?? []) as { category_id: string | null }[]) {
      if (p.category_id) counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
    }
    rows = ((cats.data ?? []) as Category[]).map((c) => ({ ...c, product_count: counts.get(c.id) ?? 0 }));
  } catch (e) {
    console.error('[admin] categories failed', e);
    error = e instanceof Error ? e.message : 'Unknown error';
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Categories" description="Group products so customers can browse by collection." />
      {error ? <DbError message={error} /> : <CategoriesManager initial={rows} />}
    </div>
  );
}
