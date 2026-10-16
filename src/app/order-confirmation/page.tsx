import React from 'react';
import { Button } from '@/components/ui/Button';

export default function OrderConfirmationPage() {
  return (
    <div className="w-full px-4 md:px-8 py-24 bg-winniep-ivory flex flex-col items-center text-center">
      <div className="max-w-2xl">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-display font-bold text-winniep-espresso mb-4">Order Received!</h1>
        <p className="text-lg text-winniep-textSecondary mb-12 leading-relaxed">
          Thank you for shopping with WinnieP. We have received your order request.
          Our team is now verifying item availability and calculating your delivery cost.
        </p>

        <div className="bg-white p-8 rounded-2xl border border-winniep-border shadow-sm mb-12 text-left">
          <h3 className="font-bold text-winniep-espresso mb-4 uppercase text-xs tracking-widest">What happens next?</h3>
          <ul className="space-y-4 text-sm text-winniep-textSecondary">
            <li className="flex gap-3">
              <span className="font-bold text-winniep-copper">01.</span>
              <span>We check with our suppliers to ensure everything is in stock.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-winniep-copper">02.</span>
              <span>We calculate the most accurate delivery fee for your location.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-winniep-copper">03.</span>
              <span>You will receive a WhatsApp message with the final total and a payment link.</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" as="a" href="/shop" className="px-12">
            Continue Shopping
          </Button>
          <Button variant="secondary" as="a" href="/contact" className="px-12">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
