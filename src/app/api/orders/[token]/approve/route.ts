import { getDb } from '@/lib/supabase';
import { fail, ok } from '@/lib/api';
import { UUID_RE } from '@/lib/utils';

export async function POST(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    if (!UUID_RE.test(token)) return fail('Order not found.', 404);

    const db = getDb();
    const { data: order, error } = await db
      .from('orders')
      .select('id, fulfilment_status, delivery_fee')
      .eq('public_token', token)
      .maybeSingle();
    if (error) throw error;
    if (!order) return fail('Order not found.', 404);
    if (order.fulfilment_status !== 'awaiting_customer_approval' || order.delivery_fee === null) {
      return fail('This order is not waiting for your approval.');
    }

    const { data: updated, error: updateError } = await db
      .from('orders')
      .update({ fulfilment_status: 'awaiting_payment' })
      .eq('id', order.id)
      .eq('fulfilment_status', 'awaiting_customer_approval')
      .select('id')
      .maybeSingle();
    if (updateError) throw updateError;
    if (!updated) return fail('This order was just updated — please refresh the page.', 409);
    return ok();
  } catch (error) {
    console.error('[orders] approve failed', error);
    return fail('Something went wrong. Please try again.', 500);
  }
}
