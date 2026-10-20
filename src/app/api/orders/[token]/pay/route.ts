import { getDb } from '@/lib/supabase';
import { fail, ok } from '@/lib/api';
import { isMpesaConfigured, stkPush } from '@/lib/mpesa';
import { getSiteUrl } from '@/lib/site';
import { normalizeKenyanPhone, UUID_RE } from '@/lib/utils';

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    if (!UUID_RE.test(token)) return fail('Order not found.', 404);
    if (!isMpesaConfigured()) {
      return fail('Online payment is not switched on yet. We will send you the M-PESA payment details on WhatsApp.', 503);
    }

    const body = await request.json().catch(() => null);
    const db = getDb();
    const { data: order, error } = await db.from('orders').select('*').eq('public_token', token).maybeSingle();
    if (error) throw error;
    if (!order) return fail('Order not found.', 404);
    if (order.fulfilment_status !== 'awaiting_payment') return fail('This order is not ready for payment yet.');
    if (order.payment_status === 'successful') return fail('This order has already been paid.');
    if (order.delivery_fee === null) return fail('The delivery cost for this order has not been confirmed yet.');

    const phone = normalizeKenyanPhone(typeof body?.phone === 'string' ? body.phone : order.customer_phone);
    if (!phone) return fail('Enter a valid Safaricom number, e.g. 0712 345 678.');

    const amount = order.subtotal + order.delivery_fee;
    if (amount < 1) return fail('Nothing to pay on this order.');

    const result = await stkPush({ phone, amount, reference: order.reference, siteUrl: await getSiteUrl() });

    const { error: payError } = await db.from('payments').insert({
      order_id: order.id,
      transaction_ref: result.checkoutRequestId,
      merchant_request_id: result.merchantRequestId,
      amount,
      phone,
      status: 'pending',
    });
    if (payError) throw payError;
    await db.from('orders').update({ payment_status: 'pending' }).eq('id', order.id);

    return ok({ message: result.customerMessage });
  } catch (error) {
    console.error('[orders] pay failed', error);
    return fail('We could not start the M-PESA payment. Please check the number and try again, or message us on WhatsApp.', 502);
  }
}
