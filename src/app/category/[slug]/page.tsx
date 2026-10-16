import React from 'react';
import { ProductCard } from '@/components/ui/ProductCard';

// Development fixtures for Category
const MOCK_PRODUCTS = [
  { id: '1', name: 'Premium Blender 3000', price: 12500, category: 'Electronics', availability: 'Available' as const, image: '' },
  { id: '2', name: 'Minimalist Ceramic Vase', price: 3200, category: 'Décor', availability: 'Supplier Confirmation' as const, image: '' },
  { id: '3', name: 'Luxury Cotton Bedding Set', price: 8500, category: 'Household', availability: 'Available' as const, image: '' },
  { id: '4', name: 'Air Fryer Pro', price: 15000, category: 'Electronics', availability: 'Unavailable' as const, image: '' },
  { id: '5', name: 'Handwoven Jute Rug', price: 6800, category: 'Décor', availability: 'Available' as const, image: '' },
  { id: '6', name: 'Smart Coffee Maker', price: 11000, category: 'Electronics', availability: 'Supplier Confirmation' as const, image: '' },
];

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="w-full px-4 md:px-8 py-12 md:py-24 bg-winniep-ivory">
      <div className="max-w-[1280px] mx-auto">
        <nav className="flex text-xs text-winniep-textSecondary gap-2 mb-4">
          <a href="/" className="hover:text-winniep-copper transition-colors">Home</a>
          <span>/</span>
          <a href="/shop" className="hover:text-winniep-copper transition-colors">Shop</a>
          <span>/</span>
          <span className="text-winniep-espresso font-medium">{categoryName}</span>
        </nav>

        <div className="mb-12 space-y-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-winniep-espresso">{categoryName}</h1>
          <p className="text-winniep-textSecondary max-w-2xl">
            Explore our curated selection of {categoryName.toLowerCase()} essentials for your home.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {MOCK_PRODUCTS.filter(p => p.category.toLowerCase() === slug.toLowerCase()).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
