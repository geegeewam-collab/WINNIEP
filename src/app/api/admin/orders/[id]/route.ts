import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, delivery_fee } = body;

    // 1. Validate the transition
    // In a real app, we'd check if the transition from current_status -> status is valid

    const updateData: any = {
      fulfilment_status: status,
      updated_at: new Date().toISOString(),
    };

    if (delivery_fee !== undefined) {
      updateData.delivery_fee = delivery_fee;
    }

    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
