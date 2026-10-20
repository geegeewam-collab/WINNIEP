import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: { default: 'WINNIEP — Home essentials, electronics & décor', template: '%s · WINNIEP' },
  description: 'Premium household products, electronics, and décor for the modern Kenyan home.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
