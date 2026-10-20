import React from 'react';
import type { Metadata } from 'next';
import { InfoPage } from '@/components/layout/InfoPage';

export const metadata: Metadata = { title: 'About WinnieP' };

export default function AboutPage() {
  return (
    <InfoPage title="About WinnieP" intro="Premium household products, electronics and décor for the modern Kenyan home.">
      <p>
        WinnieP believes that the things we surround ourselves with should bring both function and beauty into our lives.
        We curate a selection of household essentials, appliances and décor that blend modern style with enduring quality.
      </p>
      <h2>How we work</h2>
      <p>
        Some of our products are held by trusted suppliers rather than on our shelves. So that you never pay for something
        we can&apos;t deliver, we confirm availability and your delivery cost <em>before</em> you pay. Once everything is confirmed,
        you approve the final total and pay securely with M-PESA.
      </p>
      <h2>Talk to us</h2>
      <p>Questions about a product or an order? Message us on WhatsApp — see our <a href="/contact">contact page</a>.</p>
    </InfoPage>
  );
}
