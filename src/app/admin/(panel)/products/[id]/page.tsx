import React from 'react';
import { notFound } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import { requireAdmin } from '@/lib/auth';
import { getCategories, normalizeProduct } from '@/lib/data';
import { getDb } from '@/lib/supabase';
import { UUID_RE } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const { data, error } = await getDb().from('products').select('*, category:categories(id, name, slug)').eq('id', id).maybeSingle();
  if (error) throw error;
  if (!data) notFound();

  const categories = await getCategories({ all: true });
  return <ProductForm key={id} categories={categories} product={normalizeProduct(data)} />;
}
