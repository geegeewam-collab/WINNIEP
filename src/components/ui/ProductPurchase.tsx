'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import type { ProductCardData } from '@/lib/types';

export function ProductPurchase({ product, enquiryHref }: { product: ProductCardData; enquiryHref: string }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const soldOut = product.availability === 'unavailable';

  const handleAdd = () => {
    addToCart(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url ?? '',
        availability: product.availability,
      },
      qty
    );
    setAdded(true);
  };

  return (
    <div className="space-y-4">
      {!soldOut && (
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold uppercase tracking-wider text-winniep-textSecondary">Quantity</span>
          <div className="flex items-center border border-winniep-border rounded-md overflow-hidden bg-white">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-winniep-muted" aria-label="Decrease quantity">−</button>
            <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">{qty}</span>
            <button type="button" onClick={() => setQty((q) => Math.min(50, q + 1))} className="px-4 py-2 hover:bg-winniep-muted" aria-label="Increase quantity">+</button>
          </div>
        </div>
      )}

      <Button variant="primary" className="w-full py-4 text-base" disabled={soldOut} onClick={handleAdd}>
        {soldOut ? 'Out of stock' : 'Add to cart'}
      </Button>

      {added && (
        <p className="text-sm text-green-700">
          Added to your cart.{' '}
          <Link href="/cart" className="underline font-medium">View cart</Link>
        </p>
      )}

      <Button as="a" href={enquiryHref} target="_blank" rel="noopener noreferrer" variant="secondary" className="w-full py-3">
        Ask about this on WhatsApp
      </Button>
    </div>
  );
}
