import React from 'react';
import Link from 'next/link';
import { DbError, PageHeader } from '@/components/admin/PageHeader';
import { cardClass } from '@/components/admin/styles';
import { requireAdmin } from '@/lib/auth';
import { cloudinaryConfig } from '@/lib/cloudinary';
import { getDb, isDbConfigured } from '@/lib/supabase';
import { isMpesaConfigured } from '@/lib/mpesa';
import { FULFILMENT_BADGE, FULFILMENT_LABEL, NEEDS_ACTION } from '@/lib/labels';
import { formatDate, formatKsh } from '@/lib/utils';
import type { Order } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  await requireAdmin();

  let error = '';
  let stats = { products: 0, published: 0, out: 0, needsAction: 0, awaitingPayment: 0, revenue: 0, paidOrders: 0 };
  let recent: Order[] = [];

  if (!isDbConfigured()) {
    error = 'Database environment variables are missing.';
  } else {
    try {
      const db = getDb();
      const head = { count: 'exact' as const, head: true };
      const [total, published, out, needs, awaitingPay, paid, latest] = await Promise.all([
        db.from('products').select('id', head),
        db.from('products').select('id', head).eq('is_published', true),
        db.from('products').select('id', head).eq('availability', 'unavailable'),
        db.from('orders').select('id', head).in('fulfilment_status', NEEDS_ACTION),
        db.from('orders').select('id', head).eq('fulfilment_status', 'awaiting_payment'),
        db.from('orders').select('subtotal, delivery_fee').eq('payment_status', 'successful'),
        db.from('orders').select('*').order('created_at', { ascending: false }).limit(6),
      ]);
      const failed = [total, published, out, needs, awaitingPay, paid, latest].find((r) => r.error);
      if (failed?.error) throw failed.error;
      const paidRows = (paid.data ?? []) as { subtotal: number; delivery_fee: number | null }[];
      stats = {
        products: total.count ?? 0,
        published: published.count ?? 0,
        out: out.count ?? 0,
        needsAction: needs.count ?? 0,
        awaitingPayment: awaitingPay.count ?? 0,
        revenue: paidRows.reduce((sum, r) => sum + r.subtotal + (r.delivery_fee ?? 0), 0),
        paidOrders: paidRows.length,
      };
      recent = (latest.data ?? []) as Order[];
    } catch (e) {
      console.error('[admin] overview failed', e);
      error = e instanceof Error ? e.message : 'Unknown error';
    }
  }

  const setup = [
    { ok: cloudinaryConfig() !== null, text: 'Photo uploads need CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.' },
    { ok: isMpesaConfigured(), text: 'M-PESA STK push is off (MPESA_* variables not set). Orders still work — use "Mark as paid" after the customer pays you.', optional: true },
  ].filter((s) => !s.ok);

  const cards = [
    { label: 'Orders needing action', value: stats.needsAction, href: '/admin/orders?status=action', highlight: stats.needsAction > 0 },
    { label: 'Awaiting payment', value: stats.awaitingPayment, href: '/admin/orders?status=payment' },
    { label: 'Products (published)', value: `${stats.published} / ${stats.products}`, href: '/admin/products' },
    { label: 'Out of stock', value: stats.out, href: '/admin/products' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Overview"
        description="Your store at a glance."
        action={<Link href="/admin/products/new" className="btn-primary inline-block text-sm py-2">+ Add product</Link>}
      />

      {error && <div className="mb-8"><DbError message={error} /></div>}

      {setup.length > 0 && (
        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 space-y-2">
          <p className="font-bold">Setup to finish</p>
          <ul className="list-disc pl-5 space-y-1">
            {setup.map((s) => (<li key={s.text}>{s.text}</li>))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className={`${cardClass} hover:border-winniep-copper transition-colors ${c.highlight ? '!border-winniep-copper' : ''}`}>
            <p className="text-xs uppercase tracking-wider text-winniep-textSecondary mb-2">{c.label}</p>
            <p className="text-3xl font-bold text-winniep-espresso">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className={`${cardClass} mb-8`}>
        <p className="text-xs uppercase tracking-wider text-winniep-textSecondary mb-2">Paid revenue ({stats.paidOrders} order{stats.paidOrders === 1 ? '' : 's'})</p>
        <p className="text-3xl font-bold text-winniep-espresso">{formatKsh(stats.revenue)}</p>
      </div>

      <section className={`${cardClass} !p-0 overflow-hidden`}>
        <div className="flex items-center justify-between p-5 border-b border-winniep-border">
          <h2 className="text-lg font-bold text-winniep-espresso">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm text-winniep-copper hover:underline">View all</Link>
        </div>
        {recent.length === 0 ? (
          <p className="p-8 text-center text-sm text-winniep-textSecondary">No orders yet. They&apos;ll show up here as soon as customers place them.</p>
        ) : (
          <ul className="divide-y divide-winniep-border">
            {recent.map((o) => (
              <li key={o.id}>
                <Link href={`/admin/orders/${o.id}`} className="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-winniep-ivory transition-colors">
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-bold text-winniep-espresso">{o.reference}</p>
                    <p className="text-xs text-winniep-textSecondary truncate">{o.customer_name} · {o.delivery_town} · {formatDate(o.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-winniep-espresso">{formatKsh(o.subtotal + (o.delivery_fee ?? 0))}</span>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${FULFILMENT_BADGE[o.fulfilment_status]}`}>{FULFILMENT_LABEL[o.fulfilment_status]}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
