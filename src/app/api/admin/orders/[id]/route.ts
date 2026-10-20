import { z } from 'zod';
import { adminGuard } from '@/lib/auth';
import { getDb } from '@/lib/supabase';
import { fail, firstIssue, ok } from '@/lib/api';
import { UUID_RE } from '@/lib/utils';
import type { FulfilmentStatus, Order } from '@/lib/types';

type Ctx = { params: Promise<{ id: string }> };

const ActionSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('confirm_availability') }),
  z.object({ action: z.literal('set_delivery_fee'), fee: z.number().int().min(0).max(1000000) }),
  z.object({ action: z.literal('mark_approved') }),
  z.object({ action: z.literal('mark_paid') }),
  z.object({ action: z.literal('mark_dispatched') }),
  z.object({ action: z.literal('mark_delivered') }),
  z.object({ action: z.literal('cancel') }),
  z.object({ action: z.literal('save_notes'), notes: z.string().max(2000) }),
]);

export async function PATCH(request: Request, { params }: Ctx) {
  const denied = await adminGuard();
  if (denied) return denied;
  try {
    const { id } = await params;
    if (!UUID_RE.test(id)) return fail('Order not found.', 404);

    const body = await request.json().catch(() => null);
    const parsed = ActionSchema.safeParse(body);
    if (!parsed.success) return fail(firstIssue(parsed.error));
    const act = parsed.data;

    const db = getDb();
    const { data: row, error: loadError } = await db.from('orders').select('*').eq('id', id).maybeSingle();
    if (loadError) throw loadError;
    if (!row) return fail('Order not found.', 404);
    const order = row as Order;
    const status = order.fulfilment_status;

    const update: Record<string, unknown> = {};
    let guardStatus = true; // only apply if the status is still what we loaded (avoids double-clicks / stale tabs)
    let recordManualPayment = false;

    switch (act.action) {
      case 'confirm_availability':
        if (status !== 'awaiting_availability') return fail('This order is not waiting for an availability check.');
        update.fulfilment_status = (order.delivery_fee !== null ? 'awaiting_customer_approval' : 'awaiting_delivery_quote') satisfies FulfilmentStatus;
        break;

      case 'set_delivery_fee':
        if (order.payment_status === 'successful') return fail('This order is already paid — the delivery fee can no longer change.');
        if (!(['awaiting_availability', 'awaiting_delivery_quote', 'awaiting_customer_approval', 'awaiting_payment'] as FulfilmentStatus[]).includes(status)) {
          return fail('The delivery fee can only be changed before payment.');
        }
        update.delivery_fee = act.fee;
        // Still waiting on availability? Keep waiting. Otherwise the customer must (re-)approve the new total.
        if (status !== 'awaiting_availability') {
          update.fulfilment_status = 'awaiting_customer_approval';
          update.payment_status = 'not_started';
        }
        break;

      case 'mark_approved':
        if (status !== 'awaiting_customer_approval' || order.delivery_fee === null) return fail('This order is not waiting for customer approval.');
        update.fulfilment_status = 'awaiting_payment';
        break;

      case 'mark_paid':
        if (!(status === 'awaiting_payment' || status === 'awaiting_customer_approval') || order.delivery_fee === null) {
          return fail('Confirm availability and the delivery fee before marking an order as paid.');
        }
        update.fulfilment_status = 'processing';
        update.payment_status = 'successful';
        recordManualPayment = true;
        break;

      case 'mark_dispatched':
        if (status !== 'processing') return fail('Only paid orders in processing can be dispatched.');
        update.fulfilment_status = 'dispatched';
        break;

      case 'mark_delivered':
        if (status !== 'dispatched') return fail('Only dispatched orders can be marked delivered.');
        update.fulfilment_status = 'delivered';
        break;

      case 'cancel':
        if (status === 'dispatched' || status === 'delivered' || status === 'cancelled') return fail('This order can no longer be cancelled.');
        update.fulfilment_status = 'cancelled';
        break;

      case 'save_notes':
        update.admin_notes = act.notes.trim() || null;
        guardStatus = false;
        break;
    }

    let query = db.from('orders').update(update).eq('id', id);
    if (guardStatus) query = query.eq('fulfilment_status', status);
    const { data: updated, error } = await query.select('id').maybeSingle();
    if (error) throw error;
    if (!updated) return fail('This order was just updated by someone else — refresh the page and try again.', 409);

    if (recordManualPayment) {
      await db.from('payments').insert({
        order_id: id,
        amount: order.subtotal + (order.delivery_fee ?? 0),
        phone: order.customer_phone,
        status: 'successful',
        provider: 'manual',
        result_desc: 'Marked as paid by admin',
      });
    }
    return ok();
  } catch (error) {
    console.error('[admin] order action failed', error);
    return fail('Could not update the order. Please try again.', 500);
  }
}
