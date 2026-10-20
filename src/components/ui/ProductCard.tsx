'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ProductImage } from '@/components/ui/ProductImage';
import { useCart } from '@/context/CartContext';
import { AVAILABILITY_BADGE, AVAILABILITY_LABEL } from '@/lib/labels';
import { formatKsh } from '@/lib/utils';
import type { ProductCardData } from '@/lib/types';

export const ProductCard: React.FC<{ product: ProductCardData }> = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const soldOut = product.availability === 'unavailable';
  const mainImage = product.images[0]?.url ?? '';
  const onSale = product.original_price !== null && product.original_price > product.price;

  const handleAdd = () => {
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: mainImage,
      availability: product.availability,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-winniep-border flex flex-col">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="aspect-square bg-winniep-ivory rounded-lg mb-4 overflow-hidden relative">
          <ProductImage url={mainImage} alt={product.name} width={500} className="absolute inset-0 w-full h-full group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute top-2 right-2">
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${AVAILABILITY_BADGE[product.availability]}`}>
              {AVAILABILITY_LABEL[product.availability]}
            </span>
          </div>
          {product.images.length > 1 && (
            <span className="absolute bottom-2 left-2 text-[10px] font-medium px-2 py-1 rounded-full bg-black/50 text-white">
              {product.images.length} photos
            </span>
          )}
        </div>
        <div className="space-y-1">
          {product.category && <p className="text-xs text-winniep-textSecondary uppercase tracking-wider">{product.category.name}</p>}
          <h3 className="font-medium text-winniep-espresso group-hover:text-winniep-copper transition-colors line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </div>
      </Link>

      <div className="mt-2 mb-4 flex items-baseline gap-2">
        <p className="text-lg font-bold text-winniep-espresso">{formatKsh(product.price)}</p>
        {onSale && <p className="text-xs text-winniep-textSecondary line-through">{formatKsh(product.original_price as number)}</p>}
      </div>

      <Button variant="primary" className="w-full py-2 text-sm mt-auto" disabled={soldOut} onClick={handleAdd}>
        {soldOut ? 'Out of stock' : added ? 'Added ✓' : 'Add to cart'}
      </Button>
    </div>
  );
};
