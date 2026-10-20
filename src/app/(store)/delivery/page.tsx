import React from 'react';
import type { Metadata } from 'next';
import { InfoPage } from '@/components/layout/InfoPage';

export const metadata: Metadata = { title: 'Delivery information' };

export default function DeliveryPage() {
  return (
    <InfoPage title="Delivery information" intro="We deliver across Kenya. Your delivery cost is confirmed before you pay.">
      <h2>How ordering and delivery work</h2>
      <ul>
        <li>Place your order request on the website — you don&apos;t pay yet.</li>
        <li>We confirm that your items are available and work out the delivery cost for your county and town.</li>
        <li>We contact you on WhatsApp with the final total. You review it, approve it, and pay with M-PESA.</li>
        <li>Once payment is received we prepare your order and dispatch it to you.</li>
      </ul>
      <h2>Delivery cost</h2>
      <p>
        Delivery cost depends on where you are. For some locations the cost is shown straight away; for others we quote
        it after reviewing your order. You&apos;ll always see the full total before you pay.
      </p>
      <h2>Questions?</h2>
      <p>Message us on WhatsApp from the <a href="/contact">contact page</a> and we&apos;ll help.</p>
    </InfoPage>
  );
}
