'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { cardClass, dangerBtn, inputClass, labelClass, smallBtn } from './styles';
import { formatKsh } from '@/lib/utils';
import type { FulfilmentStatus, PaymentStatus } from '@/lib/types';

interface Props {
  orderId: string;
  status: FulfilmentStatus;
  paymentStatus: PaymentStatus;
  deliveryFee: number | null;
  total: number;
  notes: string;
  whatsappHref: string;
  customerLink: string;
}

const HELP: Record<FulfilmentStatus, string> = {
  awaiting_availability: 'Check with your supplier that every item is available, then confirm below.',
  awaiting_delivery_quote: 'Work out the delivery cost for this address and enter it below.',
  awaiting_customer_approval: 'Send the customer the final total on WhatsApp. They approve it from their order page (or you can mark it approved if they agreed in chat).',
  awaiting_payment: 'Waiting for the customer to pay with M-PESA. If they paid another way, mark it as paid.',
  processing: 'Payment received. Prepare the order, then mark it dispatched.',
  dispatched: 'On its way. Mark it delivered once the customer has received it.',
  delivered: 'All done.',
  cancelled: 'This order was cancelled.',
};

const FEE_EDITABLE: FulfilmentStatus[] = ['awaiting_availability', 'awaiting_delivery_quote', 'awaiting_customer_approval', 'awaiting_payment'];

export function OrderAdminActions({ orderId, status, paymentStatus, deliveryFee, total, notes, whatsappHref, customerLink }: Props) {
  const router = useRouter();
  const [fee, setFee] = useState(deliveryFee === null ? '' : String(deliveryFee));
  const [noteText, setNoteText] = useState(notes);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  async function run(body: Record<string, unknown>, confirmText?: string) {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) setError(json?.error || 'Could not update the order.');
      else router.refresh();
    } catch {
      setError('Network problem — check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  function saveFee() {
    const n = Number(fee.replace(/[,\s]/g, ''));
    if (fee.trim() === '' || !Number.isInteger(n) || n < 0) {
      setError('Enter the delivery fee as a whole number in KSh (0 for free delivery).');
      return;
    }
    void run({ action: 'set_delivery_fee', fee: n });
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(customerLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt('Copy this link:', customerLink);
    }
  }

  const feeEditable = FEE_EDITABLE.includes(status) && paymentStatus !== 'successful';
  const cancellable = !['dispatched', 'delivered', 'cancelled'].includes(status);

  return (
    <div className="space-y-6">
      <section className={`${cardClass} space-y-4`}>
        <h2 className="text-lg font-bold text-winniep-espresso">Next step</h2>
        <p className="text-sm text-winniep-textSecondary">{HELP[status]}</p>

        {status === 'awaiting_availability' && (
          <Button variant="primary" className="w-full" isLoading={busy} onClick={() => run({ action: 'confirm_availability' })}>
            Items are available — confirm
          </Button>
        )}
        {status === 'awaiting_customer_approval' && (
          <Button variant="secondary" className="w-full" isLoading={busy} onClick={() => run({ action: 'mark_approved' }, 'Mark this order as approved by the customer?')}>
            Customer agreed — mark approved
          </Button>
        )}
        {(status === 'awaiting_payment' || status === 'awaiting_customer_approval') && deliveryFee !== null && (
          <Button variant="primary" className="w-full" isLoading={busy} onClick={() => run({ action: 'mark_paid' }, `Mark this order as PAID (${formatKsh(total)})? Only do this once you have received the money.`)}>
            Mark as paid ({formatKsh(total)})
          </Button>
        )}
        {status === 'processing' && (
          <Button variant="primary" className="w-full" isLoading={busy} onClick={() => run({ action: 'mark_dispatched' })}>Mark as dispatched</Button>
        )}
        {status === 'dispatched' && (
          <Button variant="primary" className="w-full" isLoading={busy} onClick={() => run({ action: 'mark_delivered' })}>Mark as delivered</Button>
        )}

        {feeEditable && (
          <div className="pt-4 border-t border-winniep-border space-y-2">
            <label className={labelClass} htmlFor="fee">Delivery fee (KSh)</label>
            <div className="flex gap-3">
              <input id="fee" inputMode="numeric" value={fee} onChange={(e) => setFee(e.target.value)} className={inputClass} placeholder="e.g. 350" />
              <button type="button" className={`${smallBtn} !px-4`} disabled={busy} onClick={saveFee}>
                {deliveryFee === null ? 'Set fee' : 'Update fee'}
              </button>
            </div>
            {status !== 'awaiting_availability' && deliveryFee !== null && (
              <p className="text-[11px] text-winniep-textSecondary">Changing the fee sends the order back to the customer for approval of the new total.</p>
            )}
          </div>
        )}

        {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3" role="alert">{error}</p>}
      </section>

      <section className={`${cardClass} space-y-3`}>
        <h2 className="text-lg font-bold text-winniep-espresso">Contact customer</h2>
        <Button as="a" href={whatsappHref} target="_blank" rel="noopener noreferrer" variant="secondary" className="w-full">
          Message on WhatsApp
        </Button>
        <button type="button" onClick={copyLink} className={`${smallBtn} w-full !py-2`}>
          {copied ? 'Link copied ✓' : 'Copy customer order link'}
        </button>
        <p className="text-[11px] text-winniep-textSecondary">The WhatsApp message is pre-filled for the current step and includes the link where the customer approves and pays.</p>
      </section>

      <section className={`${cardClass} space-y-3`}>
        <h2 className="text-lg font-bold text-winniep-espresso">Internal notes</h2>
        <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} rows={3} className={inputClass} placeholder="Only visible to you" />
        <button type="button" className={smallBtn} disabled={busy || noteText === notes} onClick={() => run({ action: 'save_notes', notes: noteText })}>
          Save note
        </button>
      </section>

      {cancellable && (
        <button type="button" disabled={busy} className={`${dangerBtn} w-full`} onClick={() => run({ action: 'cancel' }, 'Cancel this order? The customer will see it as cancelled.')}>
          Cancel order
        </button>
      )}
    </div>
  );
}
