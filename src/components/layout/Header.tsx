'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { whatsappLink } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Household', href: '/category/household' },
  { label: 'Electronics', href: '/category/electronics' },
  { label: 'Décor', href: '/category/decor' },
  { label: 'About', href: '/about' },
];

export const Header = ({ whatsapp }: { whatsapp: string }) => {
  const { cartCount } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-winniep-ivory/95 backdrop-blur border-b border-winniep-border">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-display font-bold tracking-tight text-winniep-espresso">
          WINNIEP
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-winniep-espresso">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-winniep-copper transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link href="/shop" className="p-2 text-winniep-espresso hover:text-winniep-copper transition-colors" aria-label="Search products">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
          <a
            href={whatsappLink(whatsapp, 'Hello WinnieP, I have a question.')}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block p-2 text-winniep-espresso hover:text-winniep-copper transition-colors"
            aria-label="Chat on WhatsApp"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </a>
          <Link href="/cart" className="relative p-2 text-winniep-espresso hover:text-winniep-copper transition-colors" aria-label="Shopping bag">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-winniep-copper text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="md:hidden p-2 text-winniep-espresso"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-winniep-border bg-winniep-ivory px-4 py-4 flex flex-col gap-4 text-sm font-medium text-winniep-espresso">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="hover:text-winniep-copper transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};
