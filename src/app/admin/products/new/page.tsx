import React from 'react';
import { Button } from '@/components/ui/Button';

export default function AddProductPage() {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-bold text-winniep-espresso">Add a Product</h1>
          <p className="text-winniep-textSecondary">Create a new listing for your store.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">Save Draft</Button>
          <Button variant="primary">Publish Product</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-2xl border border-winniep-border shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-winniep-espresso border-b border-winniep-border pb-4">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase text-winniep-textSecondary tracking-wider">Product Name</label>
                <input type="text" className="w-full bg-winniep-ivory border border-winniep-border rounded-md px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-winniep-copper" placeholder="e.g. Premium Blender 3000" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-winniep-textSecondary tracking-wider">URL Slug</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-winniep-muted border border-r-0 border-winniep-border rounded-l-md text-xs text-winniep-textSecondary">/product/</span>
                  <input type="text" className="w-full bg-winniep-ivory border border-winniep-border rounded-r-md px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-winniep-copper" placeholder="premium-blender-3000" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-winniep-textSecondary tracking-wider">SKU / Product Code</label>
                <input type="text" className="w-full bg-winniep-ivory border border-winniep-border rounded-md px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-winniep-copper" placeholder="WN-ELEC-001" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-winniep-textSecondary tracking-wider">Category</label>
                <select className="w-full bg-winniep-ivory border border-winniep-border rounded-md px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-winniep-copper appearance-none">
                  <option>Household</option>
                  <option>Electronics</option>
                  <option>Décor</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-winniep-textSecondary tracking-wider">Subcategory</label>
                <input type="text" className="w-full bg-winniep-ivory border border-winniep-border rounded-md px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-winniep-copper" placeholder="Kitchen Appliances" />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase text-winniep-textSecondary tracking-wider">Description</label>
                <textarea rows={4} className="w-full bg-winniep-ivory border border-winniep-border rounded-md px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-winniep-copper" placeholder="Describe the product features and benefits..."></textarea>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-2xl border border-winniep-border shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-winniep-espresso border-b border-winniep-border pb-4">Pricing & Availability</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-winniep-textSecondary tracking-wider">Selling Price (KSh)</label>
                <input type="number" className="w-full bg-winniep-ivory border border-winniep-border rounded-md px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-winniep-copper" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-winniep-textSecondary tracking-wider">Original Price (KSh)</label>
                <input type="number" className="w-full bg-winniep-ivory border border-winniep-border rounded-md px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-winniep-copper" placeholder="Optional" />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase text-winniep-textSecondary tracking-wider">Availability Status</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'available', label: 'Available for order', desc: 'In stock and ready' },
                    { id: 'confirmation', label: 'Supplier Confirmation', desc: 'Verify before payment' },
                    { id: 'unavailable', label: 'Temporarily Unavailable', desc: 'Out of stock' },
                  ].map((option) => (
                    <label key={option.id} className="relative flex flex-col p-4 border border-winniep-border rounded-lg cursor-pointer hover:border-winniep-copper transition-all">
                      <input type="radio" name="availability" value={option.id} className="absolute opacity-0" defaultChecked={option.id === 'available'} />
                      <span className="font-bold text-sm text-winniep-espresso">{option.label}</span>
                      <span className="text-[10px] text-winniep-textSecondary">{option.desc}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
          <section className="bg-white p-8 rounded-2xl border border-winniep-border shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-winniep-espresso border-b border-winniep-border pb-4">Photographs</h3>
            <div className="aspect-square w-full bg-winniep-ivory border-2 border-dashed border-winniep-border rounded-xl flex flex-col items-center justify-center p-6 text-center space-y-4 cursor-pointer hover:border-winniep-copper transition-colors">
              <svg className="w-10 h-10 text-winniep-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <div className="space-y-1">
                <p className="text-sm font-bold text-winniep-espresso">Upload images</p>
                <p className="text-xs text-winniep-textSecondary">JPG, PNG or WebP. Max 5MB per file.</p>
              </div>
              <input type="file" multiple className="hidden" id="product-images" />
              <label htmlFor="product-images" className="px-4 py-2 bg-winniep-espresso text-white text-xs font-bold rounded-md cursor-pointer">
                Select Files
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square bg-winniep-muted rounded-md border border-winniep-border relative group">
                  <div className="absolute inset-0 flex items-center justify-center text-[8px] text-winniep-textSecondary opacity-50 italic">Img {i}</div>
                  <button className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-8 rounded-2xl border border-winniep-border shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-winniep-espresso border-b border-winniep-border pb-4">Publication</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-winniep-ivory rounded-lg border border-winniep-border">
                <span className="text-sm font-medium text-winniep-espresso">Feature on Homepage</span>
                <div className="relative inline-flex h-5 w-10 items-center justify-between rounded-full bg-winniep-border transition-colors focus:outline-none">
                  <span className="absolute left-1 top-1 h-3 w-3 rounded-full bg-white transition-transform translate-x-5" />
                  <input type="checkbox" className="sr-only peer" />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-winniep-ivory rounded-lg border border-winniep-border">
                <span className="text-sm font-medium text-winniep-espresso">Publicly Visible</span>
                <div className="relative inline-flex h-5 w-10 items-center justify-between rounded-full bg-winniep-copper" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
