import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { OrderRequestSchema } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validate input
    const validatedData = OrderRequestSchema.parse(body);

    // 2. Retrieve authoritative product data
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('id, name, price, availability')
      .in('id', validatedData.items.map(i => i.productId));

    if (prodError || !products) throw new Error('Could not retrieve products');

    // 3. Calculate totals and check availability
    let subtotal = 0;
    let requiresReview = false;

    const orderItems = validatedData.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);

      if (product.availability === 'confirmation_required') requiresReview = true;

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      return {
        product_id: product.id,
        name_snapshot: product.name,
        price_snapshot: product.price,
        quantity: item.quantity,
      };
    });

    // 4. Determine order status
    const fulfilmentStatus = requiresReview ? 'awaiting_availability' : 'awaiting_payment';

    // 5. Create durable order record
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: validatedData.customer_name,
        customer_phone: validatedData.customer_phone,
        delivery_county: validatedData.delivery_county,
        delivery_town: validatedData.delivery_town,
        delivery_instructions: validatedData.delivery_instructions,
        total_amount: subtotal,
        fulfilment_status: fulfilmentStatus,
        payment_status: 'not_started',
        reference: `WNP-${Math.floor(1000 + Math.random() * 9000)}`,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 6. Save order items
    const itemsToInsert = orderItems.map(item => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);
    if (itemsError) throw itemsError;

    return NextResponse.json({
      success: true,
      orderId: order.id,
      reference: order.reference,
      requiresReview
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
