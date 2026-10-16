'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    availability: 'Available' | 'Supplier Confirmation' | 'Unavailable';
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const availabilityColors = {
    'Available': 'bg-green-100 text-green-800',
    'Supplier Confirmation': 'bg-amber-100 text-amber-800',
    'Unavailable': 'bg-red-100 text-red-800',
  };

  return (
    <div className="group bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-winniep-border">
      <div className="aspect-square bg-winniep-ivory rounded-lg mb-4 overflow-hidden relative">
        <div className="absolute inset-0 flex items-center justify-center text-winniep-espresso opacity-10 font-display italic">
          {product.name}
        </div>
        <div className="absolute top-2 right-2">
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${availabilityColors[product.availability]}`}>
            {product.availability}
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-xs text-winniep-textSecondary uppercase tracking-wider">{product.category}</p>
        <h3 className="font-medium text-winniep-espresso group-hover:text-winniep-copper transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-lg font-bold text-winniep-espresso mb-4">
          KSh {product.price.toLocaleString()}
        </p>
      </div>

      <Button
        variant="primary"
        className="w-full py-2 text-sm"
        disabled={product.availability === 'Unavailable'}
        onClick={() =>
          addToCart({ productId: product.id, name: product.name, price: product.price, image: product.image })
        }
      >
        Add to cart
      </Button>
    </div>
  );
};
