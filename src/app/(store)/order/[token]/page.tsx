import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { OrderActions } from '@/components/ui/OrderActions';
import { ProductImage } from '@/components/ui/ProductImage';
import { getDb } from '@/lib/supabase';
import { getSettings } from '@/lib/data';
import { isMpesaConfigured } from '@/lib/mpesa';
import { FULFILMENT_BADGE, FULFILMENT_LABEL, PAYMENT_BADGE, PAYMENT_LABEL } from '@/lib/labels';
import { formatKsh, UUID_RE, whatsappLink } from '@/lib/utils';
import type { FulfilmentStatus, Order, OrderItem } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Your order', robots: { index: false, follow: false } };

type Params = Promise<{ token: string }>;
type SearchParams = Promise<{ new?: string }>;

const STATUS_MESSAGE: Record<FulfilmentStatus, string> = {
  awaiting_availability: "We're confirming availability of your items with our supplier. We'll contact you on WhatsApp shortly.",
  awaiting_delivery_quote: "We're working out the delivery cost to your area. We'll contact you on WhatsApp shortly.",
  awaiting_customer_approval: 'Your order is confirmed. Please check the final total and approve it to continue.',
  awaiting_payment: 'Your order is approved and ready for payment.',
  processing: 'Payment received — thank you! We are preparing your order.',
  dispatched: 'Your order is on its way to you.',
  delivered: 'Your order has been delivered. Thank you for shopping with WinnieP!',
  cancelled: 'This order was cancelled. Message us on WhatsApp if you have any questions.',
};

export default async function OrderPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const { token } = await params;
  const { new: isNew } = await searchParams;
  if (!UUID_RE.test(token)) notFound();

  const db = getDb();
  const { data: orderRow } = await db.from('orders').select('*').eq('public_token', token).maybeSingle();
  if (!orderRow) notFound();
  const order = orderRow as Order;

  const [{ data: itemRows }, settings] = await Promise.all([
    db.from('order_items').select('*').eq('order_id', order.id),
    getSettings(),
  ]);
  const items = (itemRows ?? []) as OrderItem[];
  const total = order.subtotal + (order.delivery_fee ?? 0);
  const whatsappHref = whatsappLink(settings.whatsapp_number, `Hello WinnieP, I'm asking about my order ${order.reference}.`);

  return (
    <div className="w-full px-4 md:px-8 py-12 md:py-20 bg-winniep-ivory">
      <div className="max-w-[760px] mx-auto space-y-8">
        <div className="text-center space-y-3">
          {isNew && (
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-display font-bold text-winniep-espresso">
            {isNew ? 'Order received!' : 'Your order'}
          </h1>
          <p className="text-winniep-textSecondary">
            Reference <span className="font-mono font-bold text-winniep-espresso">{order.reference}</span>
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${FULFILMENT_BADGE[order.fulfilment_status]}`}>
              {FULFILMENT_LABEL[order.fulfilment_status]}
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${PAYMENT_BADGE[order.payment_status]}`}>
              Payment: {PAYMENT_LABEL[order.payment_status]}
            </span>
          </div>
          <p className="text-winniep-textSecondary max-w-lg mx-auto">{STATUS_MESSAGE[order.fulfilment_status]}</p>
          {isNew && <p className="text-xs text-winniep-textSecondary">Save this page&apos;s link — you can come back to it any time to approve and pay.</p>}
        </div>

        <div className="bg-white rounded-2xl border border-winniep-border shadow-sm p-6 md:p-8 space-y-6">
          <h2 className="text-lg font-bold text-winniep-espresso border-b border-winniep-border pb-4">Items</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="w-14 h-14 rounded-lg bg-winniep-ivory overflow-hidden shrink-0 relative">
                  <ProductImage url={item.image_snapshot} alt={item.name_snapshot} width={120} className="absolute inset-0 w-full h-full" />
                </div>
                <div className="grow min-w-0">
                  <p className="font-medium text-winniep-espresso truncate">{item.name_snapshot}</p>
                  <p className="text-xs text-winniep-textSecondary">{formatKsh(item.price_snapshot)} × {item.quantity}</p>
                </div>
                <p className="font-bold text-winniep-espresso">{formatKsh(item.price_snapshot * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-winniep-border pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-winniep-textSecondary">
              <span>Subtotal</span><span>{formatKsh(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-winniep-textSecondary">
              <span>Delivery to {order.delivery_town}, {order.delivery_county}</span>
              <span>{order.delivery_fee === null ? 'To be confirmed' : formatKsh(order.delivery_fee)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 text-winniep-espresso">
              <span className="font-bold">{order.delivery_fee === null ? 'Total so far' : 'Total'}</span>
              <span className="text-2xl font-bold">{formatKsh(total)}</span>
            </div>
          </div>
        </div>

        {order.fulfilment_status !== 'cancelled' && (
          <OrderActions
            token={token}
            status={order.fulfilment_status}
            paymentStatus={order.payment_status}
            total={total}
            defaultPhone={`0${order.customer_phone.slice(3)}`}
            mpesaEnabled={isMpesaConfigured()}
            whatsappHref={whatsappHref}
          />
        )}

        <p className="text-center text-sm">
          <Link href="/shop" className="text-winniep-copper underline">Continue shopping</Link>
        </p>
      </div>
    </div>
  );
}
