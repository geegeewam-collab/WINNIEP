import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProductGallery } from '@/components/ui/ProductGallery';
import { ProductPurchase } from '@/components/ui/ProductPurchase';
import { ProductCard } from '@/components/ui/ProductCard';
import { getProductBySlug, getProducts, getSettings } from '@/lib/data';
import { isAdmin } from '@/lib/auth';
import { AVAILABILITY_BADGE, AVAILABILITY_LABEL } from '@/lib/labels';
import { formatKsh, imgUrl, whatsappLink } from '@/lib/utils';
import { getSiteUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product not found' };
  const image = product.images[0]?.url;
  return {
    title: product.name,
    description: product.description?.slice(0, 160) || `${product.name} — ${formatKsh(product.price)} at WinnieP`,
    openGraph: image ? { title: product.name, images: [imgUrl(image, 1200)] } : { title: product.name },
  };
}

const AVAILABILITY_NOTE = {
  available: 'In stock and ready to order.',
  confirmation_required: 'Available on request — we confirm stock with our supplier before you pay.',
  unavailable: 'This product is currently out of stock.',
} as const;

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const admin = await isAdmin();
  const product = await getProductBySlug(slug, admin);
  if (!product) notFound();

  const [settings, siteUrl, related] = await Promise.all([
    getSettings(),
    getSiteUrl(),
    product.category ? getProducts({ categorySlug: product.category.slug, limit: 5 }) : Promise.resolve([]),
  ]);
  const others = related.filter((p) => p.id !== product.id).slice(0, 4);
  const onSale = product.original_price !== null && product.original_price > product.price;
  const enquiry = whatsappLink(
    settings.whatsapp_number,
    `Hello WinnieP, I'm interested in "${product.name}" (${siteUrl}/product/${product.slug}).`
  );

  return (
    <div className="w-full px-4 md:px-8 py-10 md:py-16 bg-winniep-ivory">
      <div className="max-w-[1280px] mx-auto">
        {!product.is_published && (
          <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 text-amber-800 text-sm px-4 py-3">
            <strong>Preview.</strong> This product is a draft — customers can&apos;t see it yet.{' '}
            <Link href={`/admin/products/${product.id}`} className="underline font-medium">Edit product</Link>
          </div>
        )}

        <nav className="flex flex-wrap text-xs text-winniep-textSecondary gap-2 mb-8">
          <Link href="/" className="hover:text-winniep-copper transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-winniep-copper transition-colors">Shop</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link href={`/category/${product.category.slug}`} className="hover:text-winniep-copper transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-winniep-espresso font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">
          <div className="md:col-span-7">
            <ProductGallery images={product.images} name={product.name} />
          </div>

          <div className="md:col-span-5 space-y-6">
            <div className="space-y-3">
              {product.category && (
                <p className="text-xs text-winniep-textSecondary uppercase tracking-wider">{product.category.name}</p>
              )}
              <h1 className="text-3xl md:text-4xl font-display font-bold text-winniep-espresso leading-tight">{product.name}</h1>
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-bold text-winniep-espresso">{formatKsh(product.price)}</p>
                {onSale && (
                  <p className="text-lg text-winniep-textSecondary line-through">{formatKsh(product.original_price as number)}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${AVAILABILITY_BADGE[product.availability]}`}>
                  {AVAILABILITY_LABEL[product.availability]}
                </span>
                <span className="text-sm text-winniep-textSecondary">{AVAILABILITY_NOTE[product.availability]}</span>
              </div>
            </div>

            <ProductPurchase
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                original_price: product.original_price,
                availability: product.availability,
                images: product.images,
                category: product.category,
              }}
              enquiryHref={enquiry}
            />

            {product.description && (
              <div className="pt-6 border-t border-winniep-border space-y-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-winniep-espresso">Details</h2>
                <p className="text-winniep-textSecondary leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}

            <p className="text-xs text-winniep-textSecondary">
              Delivery cost is confirmed for your location before you pay.{' '}
              <Link href="/delivery" className="underline">How delivery works</Link>
            </p>
          </div>
        </div>

        {others.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-display font-bold text-winniep-espresso mb-8">You may also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {others.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
