import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getSettings } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      {settings.announcement_text && (
        <div className="bg-winniep-espresso text-winniep-ivory text-xs text-center py-2 px-4">{settings.announcement_text}</div>
      )}
      <Header whatsapp={settings.whatsapp_number} />
      <main className="grow">{children}</main>
      <Footer whatsapp={settings.whatsapp_number} email={settings.store_email} />
    </>
  );
}
