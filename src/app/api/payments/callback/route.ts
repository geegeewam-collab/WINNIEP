import { NextResponse } from 'next/server';
import { getDb } from '@/lib/supabase';
import { mpesaCallbackSecret } from '@/lib/mpesa';

const accepted = () => NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });

interface CallbackItem {
  Name: string;
  Value?: string | number;
}

export async function POST(request: Request) {
  // Daraja does not sign callbacks, so the callback URL itself carries a secret.
  const secret = mpesaCallbackSecret();
  if (!secret || new URL(request.url).searchParams.get('secret') !== secret) {
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const cb = body?.Body?.stkCallback;
    if (!cb?.CheckoutRequestID) return accepted();

    const db = getDb();
    const { data: payment } = await db.from('payments').select('*').eq('transaction_ref', cb.CheckoutRequestID).maybeSingle();
    if (!payment || payment.status === 'successful') return accepted(); // unknown or already processed (idempotent)

    const { data: order } = await db.from('orders').select('*').eq('id', payment.order_id).maybeSingle();
    if (!order) return accepted();

    const resultCode = Number(cb.ResultCode);

    if (resultCode === 0) {
      const items: CallbackItem[] = Array.isArray(cb.CallbackMetadata?.Item) ? cb.CallbackMetadata.Item : [];
      const pick = (name: string) => items.find((i) => i.Name === name)?.Value;
      const paid = Number(pick('Amount'));
      const receipt = String(pick('MpesaReceiptNumber') ?? '');
      const expected = order.subtotal + (order.delivery_fee ?? 0);

      if (paid !== expected) {
        // Money arrived but doesn't match the order total — don't auto-confirm; flag for manual reconciliation.
        await db
          .from('payments')
          .update({
            status: 'failed',
            mpesa_receipt: receipt || null,
            result_desc: `AMOUNT MISMATCH: receipt ${receipt} paid KSh ${paid}, order total is KSh ${expected}. Reconcile manually.`,
          })
          .eq('id', payment.id);
        await db.from('orders').update({ payment_status: 'failed' }).eq('id', order.id);
        return accepted();
      }

      await db
        .from('payments')
        .update({ status: 'successful', mpesa_receipt: receipt || null, result_desc: String(cb.ResultDesc ?? 'Success') })
        .eq('id', payment.id);

      const update: Record<string, string> = { payment_status: 'successful' };
      if (order.fulfilment_status === 'awaiting_payment') update.fulfilment_status = 'processing';
      await db.from('orders').update(update).eq('id', order.id);
    } else {
      await db
        .from('payments')
        .update({ status: 'failed', result_desc: String(cb.ResultDesc ?? `Failed (${resultCode})`) })
        .eq('id', payment.id);
      if (order.payment_status !== 'successful') {
        // 1032 = customer cancelled the prompt, 1037 = prompt timed out
        const paymentStatus = resultCode === 1032 ? 'cancelled' : resultCode === 1037 ? 'expired' : 'failed';
        await db.from('orders').update({ payment_status: paymentStatus }).eq('id', order.id);
      }
    }
    return accepted();
  } catch (error) {
    console.error('[mpesa] callback error', error);
    return accepted(); // always ack so Safaricom doesn't keep retrying; we log the failure
  }
}
