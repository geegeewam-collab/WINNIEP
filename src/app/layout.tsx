import React from 'react';
import { Header } from '@/components/layout/Header';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <CartProvider>
  <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-winniep-espresso text-winniep-ivory py-12 px-4 md:px-8">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="text-2xl font-display font-bold tracking-tight">WINNIEP</div>
              <p className="text-sm text-winniep-sand opacity-80 leading-relaxed">
                Premium household products, electronics, and décor for the modern Kenyan home.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Shop</h4>
              <ul className="space-y-2 text-sm text-winniep-sand opacity-80">
                <li><a href="/shop" className="hover:text-winniep-copper transition-colors">All Products</a></li>
                <li><a href="/category/household" className="hover:text-winniep-copper transition-colors">Household</a></li>
                <li><a href="/category/electronics" className="hover:text-winniep-copper transition-colors">Electronics</a></li>
                <li><a href="/category/decor" className="hover:text-winniep-copper transition-colors">Décor</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Support</h4>
              <ul className="space-y-2 text-sm text-winniep-sand opacity-80">
                <li><a href="/about" className="hover:text-winniep-copper transition-colors">About WinnieP</a></li>
                <li><a href="/delivery" className="hover:text-winniep-copper transition-colors">Delivery Info</a></li>
                <li><a href="/faq" className="hover:text-winniep-copper transition-colors">FAQ</a></li>
                <li><a href="/contact" className="hover:text-winniep-copper transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Contact</h4>
              <ul className="space-y-2 text-sm text-winniep-sand opacity-80">
                <li>WhatsApp: 0756 374 843</li>
                <li><a href="/privacy" className="hover:text-winniep-copper transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-winniep-copper transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-[1280px] mx-auto mt-12 pt-8 border-t border-winniep-sand border-opacity-20 text-center text-xs text-winniep-sand opacity-60">
            © {new Date().getFullYear()} WINNIEP. All rights reserved.
          </div>
        </footer>
      </body>
  </CartProvider>
    </html>
  );
}
