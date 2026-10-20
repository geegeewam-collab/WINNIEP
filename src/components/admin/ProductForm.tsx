'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ImageUploader } from './ImageUploader';
import { Toggle } from './Toggle';
import { cardClass, dangerBtn, inputClass, labelClass } from './styles';
import { slugify } from '@/lib/utils';
import type { Availability, Category, Product, ProductImage } from '@/lib/types';

const AVAILABILITY_OPTIONS: { value: Availability; title: string; desc: string }[] = [
  { value: 'available', title: 'In stock', desc: 'Customers can order it right away.' },
  { value: 'confirmation_required', title: 'Supplier confirmation', desc: 'You confirm with your supplier before the customer pays.' },
  { value: 'unavailable', title: 'Out of stock', desc: "Shown as sold out — can't be ordered." },
];

export function ProductForm({ categories, product }: { categories: Category[]; product?: Product }) {
  const router = useRouter();
  const editing = Boolean(product);

  const [name, setName] = useState(product?.name ?? '');
  const [slug, setSlug] = useState(product?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(editing);
  const [sku, setSku] = useState(product?.sku ?? '');
  const [categoryId, setCategoryId] = useState(product?.category_id ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [originalPrice, setOriginalPrice] = useState(product?.original_price != null ? String(product.original_price) : '');
  const [availability, setAvailability] = useState<Availability>(product?.availability ?? 'available');
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);
  const [isPublished, setIsPublished] = useState(product?.is_published ?? true);
  const [images, setImages] = useState<ProductImage[]>(product?.images ?? []);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const onNameChange = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const toInt = (value: string): number => Number(value.replace(/[,\s]/g, ''));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving || uploading) return;
    setError('');

    if (name.trim().length < 2) return setError('Enter a product name.');
    const priceNum = toInt(price);
    if (price.trim() === '' || !Number.isInteger(priceNum) || priceNum < 0) {
      return setError('Enter the price as a whole number in KSh, e.g. 2500.');
    }
    let original: number | null = null;
    if (originalPrice.trim() !== '') {
      original = toInt(originalPrice);
      if (!Number.isInteger(original) || original < 0) return setError('"Was" price must be a whole number in KSh.');
    }

    setSaving(true);
    try {
      const res = await fetch(editing ? `/api/admin/products/${product!.id}` : '/api/admin/products', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim() || undefined,
          description: description.trim(),
          sku: sku.trim(),
          category_id: categoryId || null,
          price: priceNum,
          original_price: original,
          availability,
          images,
          is_featured: isFeatured,
          is_published: isPublished,
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        setError(json?.error || 'Could not save the product.');
        setSaving(false);
        return;
      }
      router.push('/admin/products');
      router.refresh();
    } catch {
      setError('Network problem — check your connection and try again.');
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!product) return;
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        setError(json?.error || 'Could not delete the product.');
        setDeleting(false);
        return;
      }
      router.push('/admin/products');
      router.refresh();
    } catch {
      setError('Network problem — check your connection and try again.');
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/admin/products" className="text-xs text-winniep-textSecondary hover:text-winniep-copper">← Back to products</Link>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-winniep-espresso mt-1">
            {editing ? 'Edit product' : 'Add new product'}
          </h1>
        </div>
        <div className="flex gap-3">
          {editing && product && (
            <a href={`/product/${product.slug}`} target="_blank" rel="noopener noreferrer" className="btn-secondary py-2 text-sm">Preview</a>
          )}
          <Button type="submit" variant="primary" className="py-2 text-sm" isLoading={saving} disabled={uploading}>
            {uploading ? 'Uploading photos…' : editing ? 'Save changes' : 'Save product'}
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-4" role="alert">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className={`${cardClass} space-y-5`}>
            <h2 className="text-lg font-bold text-winniep-espresso">Product details</h2>
            <div>
              <label className={labelClass} htmlFor="name">Product name</label>
              <input id="name" value={name} onChange={(e) => onNameChange(e.target.value)} className={inputClass} placeholder="e.g. Ceramic Table Lamp" required />
            </div>
            <div>
              <label className={labelClass} htmlFor="description">Description</label>
              <textarea id="description" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} placeholder="Size, material, colour, what's in the box…" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass} htmlFor="sku">SKU (optional)</label>
                <input id="sku" value={sku} onChange={(e) => setSku(e.target.value)} className={inputClass} placeholder="e.g. LMP-001" />
              </div>
              <div>
                <label className={labelClass} htmlFor="slug">Web address</label>
                <input
                  id="slug"
                  value={slug}
                  onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }}
                  className={inputClass}
                  placeholder="ceramic-table-lamp"
                />
                <p className="text-[11px] text-winniep-textSecondary mt-1 truncate">/product/{slug || '…'}</p>
              </div>
            </div>
          </section>

          <section className={`${cardClass} space-y-5`}>
            <h2 className="text-lg font-bold text-winniep-espresso">Pricing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass} htmlFor="price">Price (KSh)</label>
                <input id="price" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} placeholder="2500" required />
              </div>
              <div>
                <label className={labelClass} htmlFor="original">Was price (optional)</label>
                <input id="original" inputMode="numeric" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className={inputClass} placeholder="3000 — shows a strike-through" />
              </div>
            </div>
          </section>

          <section className={`${cardClass} space-y-4`}>
            <div>
              <h2 className="text-lg font-bold text-winniep-espresso">Photos</h2>
              <p className="text-sm text-winniep-textSecondary">Upload several angles so customers can see the front, side and top.</p>
            </div>
            <ImageUploader images={images} onChange={setImages} onBusyChange={setUploading} />
          </section>
        </div>

        <div className="space-y-6">
          <section className={`${cardClass} space-y-4`}>
            <h2 className="text-lg font-bold text-winniep-espresso">Stock</h2>
            <div className="space-y-2">
              {AVAILABILITY_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                    availability === opt.value ? 'border-winniep-copper bg-winniep-ivory' : 'border-winniep-border hover:border-winniep-sand'
                  }`}
                >
                  <input
                    type="radio"
                    name="availability"
                    value={opt.value}
                    checked={availability === opt.value}
                    onChange={() => setAvailability(opt.value)}
                    className="mt-1 accent-[#B87343]"
                  />
                  <span>
                    <span className="block text-sm font-medium text-winniep-espresso">{opt.title}</span>
                    <span className="block text-xs text-winniep-textSecondary">{opt.desc}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className={`${cardClass} space-y-4`}>
            <h2 className="text-lg font-bold text-winniep-espresso">Visibility</h2>
            <Toggle checked={isPublished} onChange={setIsPublished} label="Published" hint="Off = hidden draft (you can still preview it)" />
            <Toggle checked={isFeatured} onChange={setIsFeatured} label="Featured" hint="Show on the home page" />
          </section>

          <section className={`${cardClass} space-y-3`}>
            <h2 className="text-lg font-bold text-winniep-espresso">Category</h2>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputClass} aria-label="Category">
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <Link href="/admin/categories" className="text-xs text-winniep-copper underline">Manage categories</Link>
          </section>

          {editing && (
            <button type="button" onClick={handleDelete} disabled={deleting} className={`${dangerBtn} w-full`}>
              {deleting ? 'Deleting…' : 'Delete this product'}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
