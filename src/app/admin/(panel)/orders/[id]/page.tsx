import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OrderAdminActions } from '@/components/admin/OrderAdminActions';
import { cardClass } from '@/components/admin/styles';
import { ProductImage } from '@/components/ui/ProductImage';
import { requireAdmin } from '@/lib/auth';
import { getDb } from '@/lib/supabase';
import { getSiteUrl } from '@/lib/site';
import { FULFILMENT_BADGE, FULFILMENT_LABEL, PAYMENT_BADGE, PAYMENT_LABEL } from '@/lib/labels';
import { formatDate, formatKsh, UUID_RE, whatsappLink } from '@/lib/utils';
import type { Order, OrderItem, Payment } from '@/lib/types';

export const dynamic = 'force-dynamic';

function customerMessage(order: Order, total: number, link: string): string {
  const name = order.customer_name.split(' ')[0];
  const ref = order.reference;
  switch (order.fulfilment_status) {
    case 'awaiting_availability':
    case 'awaiting_delivery_quote':
      return `Hi ${name}, this is WinnieP about your order ${ref}. We're confirming the details and will get back to you shortly. You can follow it here: ${link}`;
    case 'awaiting_customer_approval':
      return `Hi ${name}, your WinnieP order ${ref} is confirmed. Items ${formatKsh(order.subtotal)} + delivery ${formatKsh(order.delivery_fee ?? 0)} = ${formatKsh(total)}. Please review and approve it here: ${link}`;
    case 'awaiting_payment':
      return `Hi ${name}, your WinnieP order ${ref} is ready for payment. Total: ${formatKsh(total)}. You can pay with M-PESA here: ${link}`;
    case 'processing':
      return `Hi ${name}, we've received your payment for order ${ref} — thank you! We're preparing your order now.`;
    case 'dispatched':
      return `Hi ${name}, your WinnieP order ${ref} is on its way to you.`;
    case 'delivered':
      return `Hi ${name}, your WinnieP order ${ref} has been delivered. Thank you for shopping with us!`;
    case 'cancelled':
      return `Hi ${name}, your WinnieP order ${ref} has been cancelled. Message us if you have any questions.`;
  }
}

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const db = getDb();
  const { data: row } = await db.from('orders').select('*').eq('id', id).maybeSingle();
  if (!row) notFound();
  const order = row as Order;

  const [{ data: itemRows }, { data: paymentRows }, siteUrl] = await Promise.all([
    db.from('order_items').select('*').eq('order_id', id),
    db.from('payments').select('*').eq('order_id', id).order('created_at', { ascending: false }),
    getSiteUrl(),
  ]);
  const items = (itemRows ?? []) as OrderItem[];
  const payments = (paymentRows ?? []) as Payment[];
  const total = order.subtotal + (order.delivery_fee ?? 0);
  const customerLink = `${siteUrl}/order/${order.public_token}`;
  const whatsappHref = whatsappLink(order.customer_phone, customerMessage(order, total, customerLink));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <Link href="/admin/orders" className="text-xs text-winniep-textSecondary hover:text-winniep-copper">← Back to orders</Link>
        <div className="flex flex-wrap items-center gap-3 mt-1">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-winniep-espresso">Order {order.reference}</h1>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${FULFILMENT_BADGE[order.fulfilment_status]}`}>{FULFILMENT_LABEL[order.fulfilment_status]}</span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${PAYMENT_BADGE[order.payment_status]}`}>{PAYMENT_LABEL[order.payment_status]}</span>
        </div>
        <p className="text-xs text-winniep-textSecondary mt-1">Placed {formatDate(order.created_at)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className={`${cardClass} space-y-4`}>
            <h2 className="text-lg font-bold text-winniep-espresso">Items</h2>
            <div className="divide-y divide-winniep-border">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-3 first:pt-0">
                  <div className="w-14 h-14 rounded-lg bg-winniep-ivory overflow-hidden shrink-0 relative">
                    <ProductImage url={item.image_snapshot} alt={item.name_snapshot} width={120} className="absolute inset-0 w-full h-full" />
                  </div>
                  <div className="grow min-w-0">
                    <p className="font-medium text-winniep-espresso">{item.name_snapshot}</p>
                    <p className="text-xs text-winniep-textSecondary">{[item.sku_snapshot, `${formatKsh(item.price_snapshot)} × ${item.quantity}`].filter(Boolean).join(' · ')}</p>
                  </div>
                  <p className="font-bold text-winniep-espresso">{formatKsh(item.price_snapshot * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-winniep-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-winniep-textSecondary"><span>Items subtotal</span><span>{formatKsh(order.subtotal)}</span></div>
              <div className="flex justify-between text-winniep-textSecondary">
                <span>Delivery</span>
                <span>{order.delivery_fee === null ? 'Not quoted yet' : formatKsh(order.delivery_fee)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 text-winniep-espresso">
                <span className="font-bold">Total</span><span className="text-2xl font-bold">{formatKsh(total)}</span>
              </div>
            </div>
          </section>

          <section className={`${cardClass} grid grid-cols-1 sm:grid-cols-2 gap-6`}>
            <div className="space-y-1 text-sm">
              <h2 className="text-lg font-bold text-winniep-espresso mb-2">Customer</h2>
              <p className="font-medium text-winniep-espresso">{order.customer_name}</p>
              <p><a href={`tel:+${order.customer_phone}`} className="text-winniep-copper underline">+{order.customer_phone}</a></p>
              {order.customer_email && <p><a href={`mailto:${order.customer_email}`} className="text-winniep-copper underline">{order.customer_email}</a></p>}
            </div>
            <div className="space-y-1 text-sm">
              <h2 className="text-lg font-bold text-winniep-espresso mb-2">Delivery address</h2>
              <p className="font-medium text-winniep-espresso">{order.delivery_town}, {order.delivery_county}</p>
              {order.delivery_instructions && <p className="text-winniep-textSecondary whitespace-pre-line">{order.delivery_instructions}</p>}
            </div>
          </section>

          <section className={`${cardClass} space-y-3`}>
            <h2 className="text-lg font-bold text-winniep-espresso">Payments</h2>
            {payments.length === 0 ? (
              <p className="text-sm text-winniep-textSecondary">No payment attempts yet.</p>
            ) : (
              <ul className="divide-y divide-winniep-border text-sm">
                {payments.map((p) => (
                  <li key={p.id} className="py-3 first:pt-0 space-y-1">
                    <div className="flex flex-wrap justify-between gap-2">
                      <span className="font-medium text-winniep-espresso">
                        {formatKsh(p.amount)} · {p.provider === 'manual' ? 'Manual' : 'M-PESA'} · {p.status}
                      </span>
                      <span className="text-xs text-winniep-textSecondary">{formatDate(p.created_at)}</span>
                    </div>
                    {p.mpesa_receipt && <p className="text-xs text-winniep-textSecondary">Receipt: <span className="font-mono">{p.mpesa_receipt}</span></p>}
                    {p.result_desc && (
                      <p className={`text-xs ${p.result_desc.startsWith('AMOUNT MISMATCH') ? 'text-red-700 font-medium' : 'text-winniep-textSecondary'}`}>{p.result_desc}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <OrderAdminActions
          orderId={order.id}
          status={order.fulfilment_status}
          paymentStatus={order.payment_status}
          deliveryFee={order.delivery_fee}
          total={total}
          notes={order.admin_notes ?? ''}
          whatsappHref={whatsappHref}
          customerLink={customerLink}
        />
      </div>
    </div>
  );
}
