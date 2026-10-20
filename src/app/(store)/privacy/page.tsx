import React from 'react';
import type { Metadata } from 'next';
import { InfoPage } from '@/components/layout/InfoPage';

export const metadata: Metadata = { title: 'Privacy policy' };

export default function PrivacyPage() {
  return (
    <InfoPage title="Privacy policy" intro="What we collect, and why.">
      <h2>What we collect</h2>
      <p>
        When you place an order we collect your name, phone number, delivery location and instructions, an optional email
        address, and the items you ordered.
      </p>
      <h2>How we use it</h2>
      <p>
        We use this information only to process and deliver your order, to contact you about it (usually on WhatsApp or by
        phone), and to keep a record of your purchase. We do not sell your personal information.
      </p>
      <h2>Payments</h2>
      <p>
        Payments are made through Safaricom M-PESA. We never see or store your M-PESA PIN. We keep the payment reference and
        amount so we can match payments to orders.
      </p>
      <h2>Your choices</h2>
      <p>To ask us to correct or delete your information, message us via the <a href="/contact">contact page</a>.</p>
    </InfoPage>
  );
}
