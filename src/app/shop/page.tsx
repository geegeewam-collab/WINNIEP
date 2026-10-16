import React from 'react';
import { ProductCard } from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/Button';

// Development fixtures for Phase 3
const MOCK_PRODUCTS = [
  { id: '1', name: 'Premium Blender 3000', price: 12500, category: 'Electronics', availability: 'Available' as const, image: '' },
  { id: '2', name: 'Minimalist Ceramic Vase', price: 3200, category: 'Décor', availability: 'Supplier Confirmation' as const, image: '' },
  { id: '3', name: 'Luxury Cotton Bedding Set', price: 8500, category: 'Household', availability: 'Available' as const, image: '' },
  { id: '4', name: 'Air Fryer Pro', price: 15000, category: 'Electronics', availability: 'Unavailable' as const, image: '' },
  { id: '5', name: 'Handwoven Jute Rug', price: 6800, category: 'Décor', availability: 'Available' as const, image: '' },
  { id: '6', name: 'Smart Coffee Maker', price: 11000, category: 'Electronics', availability: 'Supplier Confirmation' as const, image: '' },
  { id: '7', name: 'Orthopedic Memory Foam Pillow', price: 4500, category: 'Household', availability: 'Available' as const, image: '' },
  { id: '8', name: 'Modernist Wall Clock', price: 2800, category: 'Décor', availability: 'Available' as const, image: '' },
];

export default function ShopPage() {
  return (
    <div className="w-full px-4 md:px-8 py-12 md:py-24 bg-winniep-ivory">
      <div className="max-w-[1280px] mx-auto">
        {/* Header Section */}
        <div className="mb-12 space-y-4">
          <nav className="flex text-xs text-winniep-textSecondary gap-2 mb-4">
            <a href="/" className="hover:text-winniep-copper transition-colors">Home</a>
            <span>/</span>
            <span className="text-winniep-espresso font-medium">Shop All</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-winniep-espresso">Shop all products</h1>
              <p className="text-winniep-textSecondary">Browse our curated collection of home essentials.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <select className="bg-white border border-winniep-border rounded-md px-4 py-2 text-sm appearance-none pr-8 focus:ring-2 focus:ring-winniep-copper outline-none">
                  <option>Sort by: Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Name: A-Z</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-winniep-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex-grow max-w-md relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-white border border-winniep-border rounded-md px-4 py-2 pl-10 text-sm focus:ring-2 focus:ring-winniep-copper outline-none"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-winniep-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['All', 'Household', 'Electronics', 'Décor'].map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${cat === 'All' ? 'bg-winniep-espresso text-white' : 'bg-white text-winniep-espresso border border-winniep-border hover:border-winniep-copper'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {MOCK_PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
