import React from 'react';
import { Button } from '@/components/ui/Button';

export default function AdminProductList() {
  const MOCK_PRODUCTS = [
    { id: '1', name: 'Premium Blender 3000', sku: 'WN-ELEC-001', category: 'Electronics', price: 12500, status: 'Published', availability: 'Available' },
    { id: '2', name: 'Minimalist Ceramic Vase', sku: 'WN-DECOR-042', category: 'Décor', price: 3200, status: 'Published', availability: 'Supplier Confirmation' },
    { id: '3', name: 'Luxury Cotton Bedding Set', sku: 'WN-HOUS-015', category: 'Household', price: 8500, status: 'Draft', availability: 'Available' },
    { id: '4', name: 'Air Fryer Pro', sku: 'WN-ELEC-008', category: 'Electronics', price: 15000, status: 'Published', availability: 'Unavailable' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-winniep-espresso">Products</h1>
          <p className="text-winniep-textSecondary">Manage your store's product catalogue.</p>
        </div>
        <Button variant="primary">Add New Product</Button>
      </div>

      <div className="bg-white rounded-2xl border border-winniep-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-winniep-border flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="bg-winniep-ivory border border-winniep-border rounded-md px-4 py-2 pl-10 text-sm outline-none focus:ring-2 focus:ring-winniep-copper"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-winniep-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select className="bg-winniep-ivory border border-winniep-border rounded-md px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-winniep-copper appearance-none">
              <option>All Categories</option>
              <option>Household</option>
              <option>Electronics</option>
              <option>Décor</option>
            </select>
          </div>
          <div className="flex gap-2">
             <button className="px-3 py-2 text-xs font-medium bg-winniep-ivory border border-winniep-border rounded-md hover:bg-winniep-muted">Filter</button>
             <button className="px-3 py-2 text-xs font-medium bg-winniep-ivory border border-winniep-border rounded-md hover:bg-winniep-muted">Export</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-winniep-ivory text-winniep-textSecondary font-medium">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Availability</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-winniep-border">
              {MOCK_PRODUCTS.map((product, i) => (
                <tr key={i} className="hover:bg-winniep-muted transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-winniep-ivory rounded border border-winniep-border overflow-hidden relative">
                        <div className="absolute inset-0 flex items-center justify-center text-winniep-espresso opacity-20 text-[8px] italic">Img</div>
                      </div>
                      <span className="font-medium text-winniep-espresso">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{product.sku}</td>
                  <td className="px-6 py-4 text-winniep-textSecondary">{product.category}</td>
                  <td className="px-6 py-4 font-medium">KSh {product.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      product.availability === 'Available' ? 'bg-green-100 text-green-800' :
                      product.availability === 'Supplier Confirmation' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.availability}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      product.status === 'Published' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" className="text-xs py-1 px-3">Edit</Button>
                      <Button variant="secondary" className="text-xs py-1 px-3">Preview</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
