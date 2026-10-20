import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProductCard } from '@/components/ui/ProductCard';
import { ShopToolbar } from '@/components/ui/ShopToolbar';
import { getCategoryBySlug, getProducts } from '@/lib/data';

export const dynamic = 'force-dynamic';

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ q?: string; sort?: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  return { title: category?.name ?? 'Category' };
}

export default async function CategoryPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const { slug } = await params;
  const { q = '', sort = 'newest' } = await searchParams;
  const category = await getCategoryBySlug(slug);
  if (!category || !category.is_visible) notFound();

  const products = await getProducts({ categorySlug: slug, q, sort });

  return (
    <div className="w-full px-4 md:px-8 py-12 md:py-24 bg-winniep-ivory">
      <div className="max-w-[1280px] mx-auto">
        <nav className="flex text-xs text-winniep-textSecondary gap-2 mb-4">
          <a href="/" className="hover:text-winniep-copper transition-colors">Home</a>
          <span>/</span>
          <a href="/shop" className="hover:text-winniep-copper transition-colors">Shop</a>
          <span>/</span>
          <span className="text-winniep-espresso font-medium">{category.name}</span>
        </nav>

        <div className="mb-10 space-y-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-winniep-espresso">{category.name}</h1>
          <p className="text-winniep-textSecondary max-w-2xl">
            {category.description || `Explore our curated selection of ${category.name.toLowerCase()} essentials for your home.`}
          </p>
        </div>

        <ShopToolbar action={`/category/${slug}`} q={q} sort={sort} />

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-winniep-border p-12 text-center space-y-2">
            <p className="text-xl font-display font-bold text-winniep-espresso">Nothing here yet</p>
            <p className="text-winniep-textSecondary">We&apos;re adding new {category.name.toLowerCase()} products soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
