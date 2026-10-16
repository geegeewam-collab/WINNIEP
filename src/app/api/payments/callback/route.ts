import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { CheckoutRequestID, ResultCode, ResultDesc, PhoneNumber } = body;

    // 1. Find the order associated with this CheckoutRequestID
    // Note: CheckoutRequestID is stored in the 'payments' table
    const { data: payment, error: payError } = await supabase
      .from('payments')
      .select('order_id')
      .eq('transaction_ref', CheckoutRequestID)
      .single();

    if (payError || !payment) {
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Payment not found' }, { status: 400 });
    }

    const { order_id } = payment;

    // 2. Handle the result code
    if (ResultCode === 0) {
      // Success
      const { error: updateError } = await supabase
        .from('orders')
        .update({ payment_status: 'successful' })
        .eq('id', order_id);

      if (updateError) throw updateError;
    } else {
      // Failure/Cancellation
      const { error: updateError } = await supabase
        .from('orders')
        .update({ payment_status: 'failed' })
        .eq('id', order_id);

      if (updateError) throw updateError;
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });

  } catch (error: any) {
    console.error('M-PESA Callback Error:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Internal Server Error' }, { status: 500 });
  }
}
