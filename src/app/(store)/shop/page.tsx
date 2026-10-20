import React from 'react';
import type { Metadata } from 'next';
import { ProductCard } from '@/components/ui/ProductCard';
import { ShopToolbar } from '@/components/ui/ShopToolbar';
import { getCategories, getProducts } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Shop all products' };

type SearchParams = Promise<{ q?: string; category?: string; sort?: string }>;

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const { q = '', category = '', sort = 'newest' } = await searchParams;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ q, categorySlug: category || undefined, sort }),
  ]);

  return (
    <div className="w-full px-4 md:px-8 py-12 md:py-24 bg-winniep-ivory">
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-10 space-y-4">
          <nav className="flex text-xs text-winniep-textSecondary gap-2 mb-4">
            <a href="/" className="hover:text-winniep-copper transition-colors">Home</a>
            <span>/</span>
            <span className="text-winniep-espresso font-medium">Shop All</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-winniep-espresso">Shop all products</h1>
          <p className="text-winniep-textSecondary">Browse our curated collection of home essentials.</p>
        </div>

        <ShopToolbar action="/shop" categories={categories} q={q} category={category} sort={sort} />

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-winniep-border p-12 text-center space-y-2">
            <p className="text-xl font-display font-bold text-winniep-espresso">No products found</p>
            <p className="text-winniep-textSecondary">
              {q || category ? 'Try a different search or category.' : 'New products are coming soon.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
