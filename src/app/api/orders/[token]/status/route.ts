import { NextResponse } from 'next/server';
import { getDb } from '@/lib/supabase';
import { UUID_RE } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!UUID_RE.test(token)) return NextResponse.json({ success: false }, { status: 404 });
  try {
    const { data } = await getDb()
      .from('orders')
      .select('fulfilment_status, payment_status')
      .eq('public_token', token)
      .maybeSingle();
    if (!data) return NextResponse.json({ success: false }, { status: 404 });
    return NextResponse.json({ success: true, ...data });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
