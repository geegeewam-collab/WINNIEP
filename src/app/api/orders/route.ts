import { getDb } from '@/lib/supabase';
import { getSettings } from '@/lib/data';
import { fail, firstIssue, ok } from '@/lib/api';
import { OrderRequestSchema } from '@/lib/validations';
import { findDeliveryFee, normalizeKenyanPhone } from '@/lib/utils';
import type { FulfilmentStatus } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = OrderRequestSchema.safeParse(body);
    if (!parsed.success) return fail(firstIssue(parsed.error));
    const data = parsed.data;

    // Honeypot: pretend success so bots move on.
    if (data.company) return ok({ token: null, reference: 'WNP-0000' });

    const phone = normalizeKenyanPhone(data.customer_phone);
    if (!phone) return fail('Enter a valid Kenyan phone number, e.g. 0712 345 678.');

    // Merge duplicate lines
    const qtyById = new Map<string, number>();
    for (const item of data.items) qtyById.set(item.productId, (qtyById.get(item.productId) ?? 0) + item.quantity);

    const db = getDb();
    const { data: products, error: prodError } = await db
      .from('products')
      .select('id, name, sku, price, availability, images, is_published')
      .in('id', Array.from(qtyById.keys()));
    if (prodError) throw prodError;

    type Row = { id: string; name: string; sku: string | null; price: number; availability: string; images: { url: string }[] | null; is_published: boolean };
    const byId = new Map<string, Row>((products ?? []).map((p: Row) => [p.id, p]));

    let subtotal = 0;
    let requiresReview = false;
    const orderItems: {
      product_id: string;
      name_snapshot: string;
      sku_snapshot: string | null;
      price_snapshot: number;
      quantity: number;
      image_snapshot: string | null;
    }[] = [];

    for (const [productId, quantity] of qtyById) {
      const product = byId.get(productId);
      if (!product || !product.is_published) {
        return fail('One of the items in your cart is no longer available. Please remove it and try again.');
      }
      if (product.availability === 'unavailable') {
        return fail(`"${product.name}" is currently out of stock. Please remove it from your cart.`);
      }
      if (product.availability === 'confirmation_required') requiresReview = true;
      subtotal += product.price * quantity;
      orderItems.push({
        product_id: product.id,
        name_snapshot: product.name,
        sku_snapshot: product.sku,
        price_snapshot: product.price,
        quantity,
        image_snapshot: product.images?.[0]?.url ?? null,
      });
    }

    // Delivery: a matching county rule prices it automatically, otherwise it needs a manual quote.
    const settings = await getSettings();
    const deliveryFee = findDeliveryFee(settings.delivery_rules, data.delivery_county);

    let status: FulfilmentStatus;
    if (requiresReview) status = 'awaiting_availability';
    else if (deliveryFee === null) status = 'awaiting_delivery_quote';
    else status = 'awaiting_payment';

    const { data: order, error: orderError } = await db
      .from('orders')
      .insert({
        customer_name: data.customer_name,
        customer_phone: phone,
        customer_email: data.customer_email || null,
        delivery_county: data.delivery_county,
        delivery_town: data.delivery_town,
        delivery_instructions: data.delivery_instructions || null,
        subtotal,
        delivery_fee: deliveryFee,
        fulfilment_status: status,
        payment_status: 'not_started',
      })
      .select('id, reference, public_token')
      .single();
    if (orderError || !order) throw orderError ?? new Error('Order insert returned nothing');

    const { error: itemsError } = await db.from('order_items').insert(orderItems.map((item) => ({ ...item, order_id: order.id })));
    if (itemsError) {
      await db.from('orders').delete().eq('id', order.id); // don't leave an empty order behind
      throw itemsError;
    }

    return ok({ token: order.public_token, reference: order.reference, status });
  } catch (error) {
    console.error('[orders] create failed', error);
    return fail('We could not place your order just now. Please try again, or message us on WhatsApp.', 500);
  }
}
