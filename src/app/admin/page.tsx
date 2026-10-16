import React from 'react';
import { Button } from '@/components/ui/Button';

export default function AdminOverview() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-winniep-espresso">Store Overview</h1>
          <p className="text-winniep-textSecondary">Welcome back. Here is what's happening in your store today.</p>
        </div>
        <Button variant="primary">Add New Product</Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Products', value: '142', change: '+12 this month', color: 'bg-white' },
          { label: 'Orders Awaiting Action', value: '8', change: 'Requires review', color: 'bg-amber-50 text-amber-800' },
          { label: 'Supplier Confirmations', value: '5', change: 'Pending response', color: 'bg-blue-50 text-blue-800' },
          { label: 'Pending Payments', value: '12', change: 'Awaiting M-PESA', color: 'bg-green-50 text-green-800' },
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-2xl border border-winniep-border shadow-sm ${stat.color}`}>
            <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">{stat.label}</p>
            <p className="text-3xl font-display font-bold mb-2">{stat.value}</p>
            <p className="text-xs font-medium opacity-80">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-winniep-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-winniep-border flex justify-between items-center">
          <h3 className="text-lg font-display font-bold text-winniep-espresso">Recent Orders</h3>
          <Button variant="secondary" className="text-xs py-2">View All Orders</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-winniep-ivory text-winniep-textSecondary font-medium">
              <tr>
                <th className="px-6 py-4">Order Ref</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-winniep-border">
              {[
                { ref: 'WNP-1001', name: 'Jane Doe', total: '12,500', payment: 'Successful', status: 'Processing' },
                { ref: 'WNP-1002', name: 'John Smith', total: '3,200', payment: 'Not Started', status: 'Awaiting Availability' },
                { ref: 'WNP-1003', name: 'Alice Wanjiku', total: '8,500', payment: 'Pending', status: 'Awaiting Delivery Quote' },
                { ref: 'WNP-1004', name: 'Bob Musyoka', total: '15,000', payment: 'Successful', status: 'Dispatched' },
              ].map((order, i) => (
                <tr key={i} className="hover:bg-winniep-muted transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">{order.ref}</td>
                  <td className="px-6 py-4 font-medium">{order.name}</td>
                  <td className="px-6 py-4">KSh {order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      order.payment === 'Successful' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {order.payment}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="secondary" className="text-xs py-1 px-3">Details</Button>
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
