'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ProductImage } from '@/components/ui/ProductImage';
import { Toggle } from './Toggle';
import { cardClass, dangerBtn, inputClass, smallBtn } from './styles';
import { AVAILABILITY_LABEL } from '@/lib/labels';
import { formatKsh } from '@/lib/utils';
import type { Availability, Product } from '@/lib/types';

type Filter = 'all' | 'published' | 'draft' | 'out' | 'confirm';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'published', label: 'Published' },
  { key: 'draft', label: 'Drafts' },
  { key: 'confirm', label: 'Supplier confirmation' },
  { key: 'out', label: 'Out of stock' },
];

export function ProductsManager({ initial }: { initial: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initial);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return products.filter((p) => {
      if (needle && !(p.name.toLowerCase().includes(needle) || (p.sku ?? '').toLowerCase().includes(needle))) return false;
      switch (filter) {
        case 'published': return p.is_published;
        case 'draft': return !p.is_published;
        case 'out': return p.availability === 'unavailable';
        case 'confirm': return p.availability === 'confirmation_required';
        default: return true;
      }
    });
  }, [products, q, filter]);

  async function patch(id: string, body: Partial<Pick<Product, 'availability' | 'is_published' | 'is_featured'>>) {
    setBusyId(id);
    setError('');
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        setError(json?.error || 'Could not update the product.');
      } else {
        setProducts((list) => list.map((p) => (p.id === id ? { ...p, ...body } : p)));
      }
    } catch {
      setError('Network problem — check your connection and try again.');
    } finally {
      setBusyId(null);
    }
  }

  async function remove(product: Product) {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setBusyId(product.id);
    setError('');
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) setError(json?.error || 'Could not delete the product.');
      else setProducts((list) => list.filter((p) => p.id !== product.id));
    } catch {
      setError('Network problem — check your connection and try again.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or SKU…"
          className={`${inputClass} sm:max-w-sm`}
        />
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filter === f.key ? 'bg-winniep-espresso text-white' : 'bg-white border border-winniep-border text-winniep-espresso hover:border-winniep-copper'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3" role="alert">{error}</p>}

      {visible.length === 0 ? (
        <div className={`${cardClass} text-center py-12`}>
          <p className="font-display text-xl font-bold text-winniep-espresso mb-1">
            {products.length === 0 ? 'No products yet' : 'No products match'}
          </p>
          <p className="text-sm text-winniep-textSecondary mb-4">
            {products.length === 0 ? 'Add your first product to get started.' : 'Try a different search or filter.'}
          </p>
          {products.length === 0 && <Link href="/admin/products/new" className="btn-primary inline-block">Add product</Link>}
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((p) => (
            <div key={p.id} className={`${cardClass} !p-4 flex flex-col md:flex-row md:items-center gap-4 ${busyId === p.id ? 'opacity-60' : ''}`}>
              <div className="flex items-center gap-4 min-w-0 md:w-[38%]">
                <div className="w-16 h-16 rounded-lg bg-winniep-ivory overflow-hidden shrink-0 relative">
                  <ProductImage url={p.images[0]?.url} alt={p.name} width={160} className="absolute inset-0 w-full h-full" />
                </div>
                <div className="min-w-0">
                  <Link href={`/admin/products/${p.id}`} className="font-medium text-winniep-espresso hover:text-winniep-copper line-clamp-2">
                    {p.name}
                  </Link>
                  <p className="text-xs text-winniep-textSecondary truncate">
                    {[p.category?.name, p.sku, `${p.images.length} photo${p.images.length === 1 ? '' : 's'}`].filter(Boolean).join(' · ')}
                  </p>
                  <p className="text-sm font-bold text-winniep-espresso">{formatKsh(p.price)}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 md:grow md:justify-between">
                <select
                  value={p.availability}
                  disabled={busyId === p.id}
                  onChange={(e) => patch(p.id, { availability: e.target.value as Availability })}
                  className="bg-white border border-winniep-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-winniep-copper outline-none"
                  aria-label={`Stock status for ${p.name}`}
                >
                  {(Object.keys(AVAILABILITY_LABEL) as Availability[]).map((key) => (
                    <option key={key} value={key}>{AVAILABILITY_LABEL[key]}</option>
                  ))}
                </select>

                <div className="w-40">
                  <Toggle checked={p.is_published} disabled={busyId === p.id} onChange={(v) => patch(p.id, { is_published: v })} label={p.is_published ? 'Published' : 'Draft'} />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={busyId === p.id}
                    onClick={() => patch(p.id, { is_featured: !p.is_featured })}
                    className={`${smallBtn} ${p.is_featured ? '!border-winniep-copper !text-winniep-copper' : ''}`}
                    aria-pressed={p.is_featured}
                    title="Featured products appear in the home page slideshow"
                  >
                    {p.is_featured ? '★ Featured' : '☆ Feature'}
                  </button>
                  <Link href={`/admin/products/${p.id}`} className={smallBtn}>Edit</Link>
                  <a href={`/product/${p.slug}`} target="_blank" rel="noopener noreferrer" className={smallBtn}>Preview</a>
                  <button type="button" onClick={() => remove(p)} disabled={busyId === p.id} className={`${dangerBtn} !px-3 !py-1.5 !text-xs`}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
