import React from 'react';
import Link from 'next/link';
import { DbError, PageHeader } from '@/components/admin/PageHeader';
import { cardClass } from '@/components/admin/styles';
import { requireAdmin } from '@/lib/auth';
import { getDb } from '@/lib/supabase';
import { FULFILMENT_BADGE, FULFILMENT_LABEL, NEEDS_ACTION, PAYMENT_BADGE, PAYMENT_LABEL } from '@/lib/labels';
import { formatDate, formatKsh } from '@/lib/utils';
import type { FulfilmentStatus, Order } from '@/lib/types';

export const dynamic = 'force-dynamic';

const GROUPS: { key: string; label: string; statuses?: FulfilmentStatus[] }[] = [
  { key: 'all', label: 'All' },
  { key: 'action', label: 'Needs action', statuses: NEEDS_ACTION },
  { key: 'approval', label: 'Awaiting customer', statuses: ['awaiting_customer_approval'] },
  { key: 'payment', label: 'Awaiting payment', statuses: ['awaiting_payment'] },
  { key: 'processing', label: 'Processing', statuses: ['processing'] },
  { key: 'dispatched', label: 'Dispatched', statuses: ['dispatched'] },
  { key: 'delivered', label: 'Delivered', statuses: ['delivered'] },
  { key: 'cancelled', label: 'Cancelled', statuses: ['cancelled'] },
];

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin();
  const { status = 'all' } = await searchParams;
  const group = GROUPS.find((g) => g.key === status) ?? GROUPS[0];

  let orders: Order[] = [];
  let error = '';
  try {
    let q = getDb().from('orders').select('*').order('created_at', { ascending: false }).limit(200);
    if (group.statuses) q = q.in('fulfilment_status', group.statuses);
    const { data, error: dbError } = await q;
    if (dbError) throw dbError;
    orders = (data ?? []) as Order[];
  } catch (e) {
    console.error('[admin] orders failed', e);
    error = e instanceof Error ? e.message : 'Unknown error';
  }

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Orders" description="Review new requests, confirm availability and delivery, then follow each order through to delivery." />

      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
        {GROUPS.map((g) => (
          <Link
            key={g.key}
            href={g.key === 'all' ? '/admin/orders' : `/admin/orders?status=${g.key}`}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              g.key === group.key ? 'bg-winniep-espresso text-white' : 'bg-white border border-winniep-border text-winniep-espresso hover:border-winniep-copper'
            }`}
          >
            {g.label}
          </Link>
        ))}
      </div>

      {error ? (
        <DbError message={error} />
      ) : orders.length === 0 ? (
        <div className={`${cardClass} text-center py-12 text-sm text-winniep-textSecondary`}>No orders here yet.</div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link key={o.id} href={`/admin/orders/${o.id}`} className={`${cardClass} !p-4 flex flex-wrap items-center justify-between gap-3 hover:border-winniep-copper transition-colors`}>
              <div className="min-w-0">
                <p className="font-mono text-sm font-bold text-winniep-espresso">{o.reference}</p>
                <p className="text-sm text-winniep-espresso">{o.customer_name}</p>
                <p className="text-xs text-winniep-textSecondary">{o.delivery_town}, {o.delivery_county} · {formatDate(o.created_at)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-bold text-winniep-espresso">
                  {formatKsh(o.subtotal + (o.delivery_fee ?? 0))}
                  {o.delivery_fee === null && <span className="text-[10px] font-normal text-winniep-textSecondary"> + delivery</span>}
                </span>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${FULFILMENT_BADGE[o.fulfilment_status]}`}>{FULFILMENT_LABEL[o.fulfilment_status]}</span>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${PAYMENT_BADGE[o.payment_status]}`}>{PAYMENT_LABEL[o.payment_status]}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
