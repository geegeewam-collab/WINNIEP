import React from 'react';
import { ProductForm } from '@/components/admin/ProductForm';
import { requireAdmin } from '@/lib/auth';
import { getCategories } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await getCategories({ all: true });
  return <ProductForm categories={categories} />;
}
