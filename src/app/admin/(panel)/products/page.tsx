import React from 'react';
import Link from 'next/link';
import { DbError, PageHeader } from '@/components/admin/PageHeader';
import { ProductsManager } from '@/components/admin/ProductsManager';
import { requireAdmin } from '@/lib/auth';
import { queryProducts } from '@/lib/data';
import type { Product } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  await requireAdmin();
  let products: Product[] = [];
  let error = '';
  try {
    products = await queryProducts({ includeUnpublished: true });
  } catch (e) {
    console.error('[admin] products failed', e);
    error = e instanceof Error ? e.message : 'Unknown error';
  }

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Products"
        description="Update stock, prices and visibility. Changes go live immediately."
        action={<Link href="/admin/products/new" className="btn-primary inline-block text-sm py-2">+ Add product</Link>}
      />
      {error ? <DbError message={error} /> : <ProductsManager initial={products} />}
    </div>
  );
}
