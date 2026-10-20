'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { KENYA_COUNTIES } from '@/lib/counties';
import { formatKsh } from '@/lib/utils';

const inputClass =
  'w-full bg-white border border-winniep-border rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-winniep-copper outline-none';
const labelClass = 'text-xs font-bold uppercase text-winniep-textSecondary tracking-wider';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    delivery_county: '',
    delivery_town: '',
    delivery_instructions: '',
    company: '', // honeypot
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const requiresReview = cart.some((item) => item.availability === 'confirmation_required');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: cart.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success || !json.token) {
        setError(json?.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }
      clearCart();
      router.push(`/order/${json.token}?new=1`);
    } catch {
      setError('Network problem — please check your connection and try again.');
      setSubmitting(false);
    }
  }

  if (cart.length === 0) {
    return (
      <div className="w-full px-4 md:px-8 py-24 bg-winniep-ivory flex flex-col items-center text-center">
        <h1 className="text-3xl font-display font-bold text-winniep-espresso mb-4">Your bag is empty</h1>
        <p className="text-winniep-textSecondary mb-8">Add a few products before checking out.</p>
        <Button variant="primary" as="a" href="/shop" className="px-12">Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-8 py-12 md:py-24 bg-winniep-ivory">
      <div className="max-w-[1000px] mx-auto">
        <nav className="flex text-xs text-winniep-textSecondary gap-2 mb-8">
          <Link href="/" className="hover:text-winniep-copper transition-colors">Home</Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-winniep-copper transition-colors">Cart</Link>
          <span>/</span>
          <span className="text-winniep-espresso font-medium">Checkout</span>
        </nav>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-winniep-espresso text-white flex items-center justify-center text-sm font-bold">1</div>
                <h2 className="text-2xl font-display font-bold text-winniep-espresso">Contact Details</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={labelClass} htmlFor="name">Full Name</label>
                  <input id="name" type="text" required autoComplete="name" value={form.customer_name} onChange={set('customer_name')} className={inputClass} placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <label className={labelClass} htmlFor="phone">Phone / WhatsApp</label>
                  <input id="phone" type="tel" required autoComplete="tel" inputMode="tel" value={form.customer_phone} onChange={set('customer_phone')} className={inputClass} placeholder="07XX XXX XXX" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className={labelClass} htmlFor="email">Email (Optional)</label>
                  <input id="email" type="email" autoComplete="email" value={form.customer_email} onChange={set('customer_email')} className={inputClass} placeholder="email@example.com" />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-winniep-espresso text-white flex items-center justify-center text-sm font-bold">2</div>
                <h2 className="text-2xl font-display font-bold text-winniep-espresso">Delivery Address</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={labelClass} htmlFor="county">County</label>
                  <select id="county" required value={form.delivery_county} onChange={set('delivery_county')} className={inputClass}>
                    <option value="">Select county</option>
                    {KENYA_COUNTIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={labelClass} htmlFor="town">Town / Estate</label>
                  <input id="town" type="text" required value={form.delivery_town} onChange={set('delivery_town')} className={inputClass} placeholder="e.g. Westlands" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className={labelClass} htmlFor="instructions">Delivery Instructions (Optional)</label>
                  <textarea id="instructions" rows={3} value={form.delivery_instructions} onChange={set('delivery_instructions')} className={inputClass} placeholder="House number, landmark, etc." />
                </div>
              </div>
            </section>

            {/* honeypot — hidden from people, bots fill it */}
            <input type="text" name="company" tabIndex={-1} autoComplete="off" value={form.company} onChange={set('company')} className="hidden" aria-hidden="true" />

            <section className="space-y-4">
              <div className={`${requiresReview ? 'bg-amber-50 border-amber-200' : 'bg-winniep-muted border-winniep-border'} border p-6 rounded-xl`}>
                <h4 className="font-bold text-winniep-espresso mb-2">How your order works</h4>
                <ol className="text-sm text-winniep-textSecondary leading-relaxed list-decimal pl-5 space-y-1">
                  <li>You send your order request — no payment yet.</li>
                  <li>{requiresReview ? 'We confirm availability with our supplier and work out delivery to your area.' : 'We confirm your delivery cost for your area.'}</li>
                  <li>You approve the final total and pay with M-PESA.</li>
                </ol>
              </div>

              {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-4" role="alert">{error}</p>}

              <Button type="submit" variant="primary" className="w-full py-4 text-lg" isLoading={submitting}>
                Place order request
              </Button>
            </section>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-winniep-border lg:sticky lg:top-28">
              <h3 className="text-xl font-display font-bold text-winniep-espresso mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.productId} className="flex justify-between gap-3 text-sm">
                    <span className="text-winniep-textSecondary truncate">{item.name} × {item.quantity}</span>
                    <span className="font-medium text-winniep-espresso shrink-0">{formatKsh(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-winniep-border pt-4 space-y-3">
                <div className="flex justify-between text-sm text-winniep-textSecondary">
                  <span>Subtotal</span>
                  <span>{formatKsh(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-winniep-textSecondary">
                  <span>Delivery</span>
                  <span className="italic">Confirmed next</span>
                </div>
                <div className="flex justify-between items-center pt-3">
                  <span className="font-bold text-winniep-espresso">Items total</span>
                  <span className="text-xl font-bold text-winniep-espresso">{formatKsh(cartTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
