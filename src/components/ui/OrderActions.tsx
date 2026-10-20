'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { formatKsh } from '@/lib/utils';
import type { FulfilmentStatus, PaymentStatus } from '@/lib/types';

interface Props {
  token: string;
  status: FulfilmentStatus;
  paymentStatus: PaymentStatus;
  total: number;
  defaultPhone: string;
  mpesaEnabled: boolean;
  whatsappHref: string;
}

export function OrderActions({ token, status, paymentStatus, total, defaultPhone, mpesaEnabled, whatsappHref }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState(defaultPhone);
  const [waiting, setWaiting] = useState(paymentStatus === 'pending');

  const call = useCallback(
    async (path: string, body?: unknown) => {
      const res = await fetch(`/api/orders/${token}/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) throw new Error(json?.error || 'Something went wrong. Please try again.');
      return json as { success: true; message?: string };
    },
    [token]
  );

  // While an M-PESA prompt is outstanding, poll for the result.
  useEffect(() => {
    if (!waiting) return;
    let cancelled = false;
    const started = Date.now();
    const timer = setInterval(async () => {
      if (cancelled) return;
      try {
        const res = await fetch(`/api/orders/${token}/status`, { cache: 'no-store' });
        const json = await res.json();
        if (json.payment_status === 'successful' || json.payment_status === 'failed') {
          setWaiting(false);
          router.refresh();
        }
      } catch {
        /* keep polling */
      }
      if (Date.now() - started > 120000) {
        setWaiting(false);
        setMessage('We have not received a payment confirmation yet. If you paid, it will update shortly — you can also message us on WhatsApp.');
      }
    }, 4000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [waiting, token, router]);

  async function approve() {
    setBusy(true);
    setError('');
    try {
      await call('approve');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  async function pay() {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const json = await call('pay', { phone });
      setMessage(json.message || 'Check your phone and enter your M-PESA PIN to complete the payment.');
      setWaiting(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {status === 'awaiting_customer_approval' && (
        <div className="space-y-3">
          <p className="text-sm text-winniep-textSecondary">
            Everything is confirmed. If the total below looks right, approve it to continue to payment.
          </p>
          <Button variant="primary" className="w-full py-4" isLoading={busy} onClick={approve}>
            Approve total of {formatKsh(total)}
          </Button>
        </div>
      )}

      {status === 'awaiting_payment' && paymentStatus !== 'successful' && (
        <div className="space-y-3">
          {mpesaEnabled ? (
            <>
              <label className="text-xs font-bold uppercase text-winniep-textSecondary tracking-wider" htmlFor="mpesa-phone">
                M-PESA phone number
              </label>
              <input
                id="mpesa-phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white border border-winniep-border rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-winniep-copper outline-none"
                placeholder="07XX XXX XXX"
              />
              <Button variant="primary" className="w-full py-4" isLoading={busy || waiting} onClick={pay}>
                {waiting ? 'Waiting for M-PESA…' : `Pay ${formatKsh(total)} with M-PESA`}
              </Button>
              {paymentStatus === 'failed' && !waiting && (
                <p className="text-sm text-red-700">The last payment attempt didn&apos;t go through. You can try again.</p>
              )}
            </>
          ) : (
            <p className="text-sm text-winniep-textSecondary bg-winniep-muted border border-winniep-border rounded-lg p-4">
              Your order is ready for payment. We&apos;ll send the M-PESA payment details on WhatsApp — or message us and we&apos;ll
              send them right away.
            </p>
          )}
        </div>
      )}

      {message && <p className="text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg p-4">{message}</p>}
      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-4" role="alert">{error}</p>}

      <Button as="a" href={whatsappHref} target="_blank" rel="noopener noreferrer" variant="secondary" className="w-full">
        Chat with us on WhatsApp
      </Button>
    </div>
  );
}
