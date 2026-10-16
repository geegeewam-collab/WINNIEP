import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Mock data for the order detail page
  const order = {
    reference: 'WNP-1002',
    customer_name: 'John Smith',
    customer_phone: '0756 000 000',
    delivery_county: 'Nairobi',
    delivery_town: 'Westlands',
    delivery_instructions: 'Leave at the gate',
    total_amount: 3200,
    delivery_fee: 0,
    fulfilment_status: 'awaiting_availability',
    payment_status: 'not_started',
    items: [
      { productId: '2', name: 'Minimalist Ceramic Vase', price: 3200, quantity: 1 },
    ]
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-bold text-winniep-espresso">Order Details</h1>
          <p className="text-winniep-textSecondary">Ref: {order.reference}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" as="a" href="/admin/orders">Back to Orders</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer & Delivery Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-winniep-border shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-winniep-espresso border-b border-winniep-border pb-4">Customer Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold uppercase text-winniep-textSecondary mb-1">Full Name</p>
                <p className="text-winniep-espresso font-medium">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-winniep-textSecondary mb-1">Phone Number</p>
                <p className="text-winniep-espresso font-medium">{order.customer_phone}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-winniep-textSecondary mb-1">County</p>
                <p className="text-winniep-espresso font-medium">{order.delivery_county}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-winniep-textSecondary mb-1">Town/City</p>
                <p className="text-winniep-espresso font-medium">{order.delivery_town}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-bold uppercase text-winniep-textSecondary mb-1">Delivery Instructions</p>
                <p className="text-winniep-espresso font-medium">{order.delivery_instructions || 'No instructions provided'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-winniep-border shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-winniep-espresso border-b border-winniep-border pb-4">Order Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-winniep-textSecondary font-medium">
                  <tr>
                    <th className="pb-4">Product</th>
                    <th className="pb-4 text-center">Qty</th>
                    <th className="pb-4 text-right">Unit Price</th>
                    <th className="pb-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-winniep-border">
                  {order.items.map((item, i) => (
                    <tr key={i} className="group">
                      <td className="py-4 font-medium text-winniep-espresso">{item.name}</td>
                      <td className="py-4 text-center">{item.quantity}</td>
                      <td className="py-4 text-right">KSh {item.price.toLocaleString()}</td>
                      <td className="py-4 text-right font-bold text-winniep-espresso">KSh {(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Order Actions Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-winniep-border shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-winniep-espresso border-b border-winniep-border pb-4">Order Control</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-winniep-textSecondary">Payment Status</span>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-600">{order.payment_status}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-winniep-textSecondary">Fulfilment Status</span>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-800">{order.fulfilment_status.replace(/_/g, ' ')}</span>
              </div>
            </div>

            <div className="pt-6 space-y-4">
              {order.fulfilment_status === 'awaiting_availability' && (
                <Button variant="primary" className="w-full py-3">Confirm Availability</Button>
              )}
              {order.fulfilment_status === 'awaiting_delivery_quote' && (
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase text-winniep-textSecondary tracking-wider">Set Delivery Fee (KSh)</label>
                  <div className="flex gap-2">
                    <input type="number" className="flex-grow bg-winniep-ivory border border-winniep-border rounded-md px-3 py-2 text-sm" placeholder="0.00" />
                    <Button variant="primary" className="px-4 py-2 text-xs">Apply</Button>
                  </div>
                </div>
              )}
              {order.fulfilment_status === 'awaiting_customer_approval' && (
                <Button variant="primary" className="w-full py-3">Notify Customer</Button>
              )}
              {order.fulfilment_status === 'awaiting_payment' && (
                <Button variant="primary" className="w-full py-3">Trigger M-PESA Push</Button>
              )}
            </div>
          </div>

          <div className="bg-winniep-ivory p-6 rounded-2xl border border-winniep-border shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-winniep-espresso">Order Total</h4>
            <div className="flex justify-between items-center">
              <span className="text-sm text-winniep-textSecondary">Items Subtotal</span>
              <span className="font-medium">KSh {order.total_amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-winniep-textSecondary">Delivery Fee</span>
              <span className="font-medium">KSh {order.delivery_fee.toLocaleString()}</span>
            </div>
            <div className="border-t border-winniep-border pt-3 flex justify-between items-center font-bold text-winniep-espresso">
              <span>Final Amount</span>
              <span className="text-xl">KSh {(order.total_amount + order.delivery_fee).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
