import React from 'react';
import { PageHeader } from '@/components/admin/PageHeader';
import { SettingsForm } from '@/components/admin/SettingsForm';
import { requireAdmin } from '@/lib/auth';
import { getSettings } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getSettings();
  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Settings" description="Contact details, announcement bar and delivery prices." />
      <SettingsForm initial={settings} />
    </div>
  );
}
