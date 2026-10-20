import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="grow flex flex-col items-center justify-center text-center px-4 py-24 bg-winniep-ivory">
      <p className="text-xs font-bold uppercase tracking-widest text-winniep-copper mb-3">404</p>
      <h1 className="text-4xl font-display font-bold text-winniep-espresso mb-4">We couldn&apos;t find that page</h1>
      <p className="text-winniep-textSecondary mb-8 max-w-md">The link may be old, or the product may no longer be available.</p>
      <Link href="/shop" className="btn-primary inline-block">Continue shopping</Link>
    </div>
  );
}
