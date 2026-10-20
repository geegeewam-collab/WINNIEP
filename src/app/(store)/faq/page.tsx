import React from 'react';
import type { Metadata } from 'next';
import { InfoPage } from '@/components/layout/InfoPage';

export const metadata: Metadata = { title: 'FAQ' };

const FAQ = [
  ['Do I pay when I place my order?', 'No. You send an order request first. We confirm availability and delivery cost, then you approve the total and pay with M-PESA.'],
  ['How do I pay?', 'With M-PESA. Once your order is approved, you can pay from your order page, or we will send you the payment details on WhatsApp.'],
  ['How will I know the status of my order?', 'Open the order link you received after checkout — it always shows the latest status. We also update you on WhatsApp.'],
  ['What does "Supplier confirmation" mean?', 'The item is held by our supplier, so we confirm they have it before you pay.'],
  ['Which areas do you deliver to?', 'We deliver across Kenya. The delivery cost depends on your county and town and is confirmed before you pay.'],
  ['Something is wrong with my order — what do I do?', 'Message us on WhatsApp with your order reference and we will put it right.'],
];

export default function FaqPage() {
  return (
    <InfoPage title="Frequently asked questions">
      {FAQ.map(([q, a]) => (
        <div key={q}>
          <h2>{q}</h2>
          <p>{a}</p>
        </div>
      ))}
    </InfoPage>
  );
}
