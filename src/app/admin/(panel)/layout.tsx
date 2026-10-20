import React from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import { requireAdmin } from '@/lib/auth';
import { getDb } from '@/lib/supabase';
import { NEEDS_ACTION } from '@/lib/labels';

export const dynamic = 'force-dynamic';

async function countNeedsAction(): Promise<number> {
  try {
    const { count } = await getDb().from('orders').select('id', { count: 'exact', head: true }).in('fulfilment_status', NEEDS_ACTION);
    return count ?? 0;
  } catch {
    return 0;
  }
}

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const needsAction = await countNeedsAction();
  return <AdminShell needsAction={needsAction}>{children}</AdminShell>;
}
