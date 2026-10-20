'use client';

import React from 'react';
import Link from 'next/link';
import type { Category } from '@/lib/types';

interface Props {
  action: string; // page the search form submits to (/shop or /category/x)
  categories?: Pick<Category, 'id' | 'name' | 'slug'>[]; // omit on category pages
  q?: string;
  category?: string;
  sort?: string;
}

export function ShopToolbar({ action, categories, q = '', category = '', sort = 'newest' }: Props) {
  const pillHref = (slug: string) => {
    const params = new URLSearchParams();
    if (slug) params.set('category', slug);
    if (q) params.set('q', q);
    if (sort && sort !== 'newest') params.set('sort', sort);
    const qs = params.toString();
    return qs ? `${action}?${qs}` : action;
  };

  return (
    <div className="space-y-4 mb-8">
      <form action={action} method="get" className="flex flex-col sm:flex-row gap-3">
        {category && <input type="hidden" name="category" value={category} />}
        <div className="grow max-w-md relative">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search products..."
            className="w-full bg-white border border-winniep-border rounded-md px-4 py-2 pl-10 text-sm focus:ring-2 focus:ring-winniep-copper outline-none"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-winniep-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select
          name="sort"
          defaultValue={sort}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
          className="bg-white border border-winniep-border rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-winniep-copper outline-none"
          aria-label="Sort products"
        >
          <option value="newest">Sort by: Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name">Name: A–Z</option>
        </select>
        <button type="submit" className="btn-secondary py-2 text-sm">Search</button>
      </form>

      {categories && categories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[{ id: 'all', name: 'All', slug: '' }, ...categories].map((cat) => {
            const active = cat.slug === category;
            return (
              <Link
                key={cat.id}
                href={pillHref(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  active
                    ? 'bg-winniep-espresso text-white'
                    : 'bg-white text-winniep-espresso border border-winniep-border hover:border-winniep-copper'
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
