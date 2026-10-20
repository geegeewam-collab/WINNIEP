import React from 'react';
import type { Metadata } from 'next';
import { InfoPage } from '@/components/layout/InfoPage';

export const metadata: Metadata = { title: 'Terms of service' };

export default function TermsPage() {
  return (
    <InfoPage title="Terms of service" intro="The basics of shopping with WinnieP.">
      <h2>Orders</h2>
      <p>
        Submitting an order on this website is a request to buy. An order is only confirmed once we have checked
        availability and delivery cost with you and you have approved the final total.
      </p>
      <h2>Prices and availability</h2>
      <p>
        Prices are shown in Kenya Shillings (KSh). Product availability can change; items marked &ldquo;Supplier
        confirmation&rdquo; are confirmed with our supplier before you pay.
      </p>
      <h2>Payment</h2>
      <p>Payment is made by M-PESA after your order has been approved. Your order is processed once payment is received.</p>
      <h2>Problems with an order</h2>
      <p>
        If an item arrives damaged or is not what you ordered, contact us on WhatsApp as soon as possible with your order
        reference and we will work with you to resolve it.
      </p>
    </InfoPage>
  );
}
