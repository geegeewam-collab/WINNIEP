import React from 'react';
import type { Metadata } from 'next';
import { InfoPage } from '@/components/layout/InfoPage';
import { Button } from '@/components/ui/Button';
import { getSettings } from '@/lib/data';
import { formatPhoneDisplay, whatsappLink } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Contact us' };

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <InfoPage title="Contact us" intro="The fastest way to reach us is WhatsApp.">
      <p>
        <Button as="a" href={whatsappLink(settings.whatsapp_number, 'Hello WinnieP!')} target="_blank" rel="noopener noreferrer">
          Chat on WhatsApp · {formatPhoneDisplay(settings.whatsapp_number)}
        </Button>
      </p>
      {settings.store_email && (
        <p>
          Email: <a href={`mailto:${settings.store_email}`}>{settings.store_email}</a>
        </p>
      )}
      <p>When you message us about an order, please include your order reference (it looks like WNP-1001).</p>
    </InfoPage>
  );
}
