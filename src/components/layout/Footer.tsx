import React from 'react';
import Link from 'next/link';
import { formatPhoneDisplay, whatsappLink } from '@/lib/utils';

const linkClass = 'hover:text-winniep-copper transition-colors';

export function Footer({ whatsapp, email }: { whatsapp: string; email: string | null }) {
  return (
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
            <li><Link href="/shop" className={linkClass}>All Products</Link></li>
            <li><Link href="/category/household" className={linkClass}>Household</Link></li>
            <li><Link href="/category/electronics" className={linkClass}>Electronics</Link></li>
            <li><Link href="/category/decor" className={linkClass}>Décor</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Support</h4>
          <ul className="space-y-2 text-sm text-winniep-sand opacity-80">
            <li><Link href="/about" className={linkClass}>About WinnieP</Link></li>
            <li><Link href="/delivery" className={linkClass}>Delivery Info</Link></li>
            <li><Link href="/faq" className={linkClass}>FAQ</Link></li>
            <li><Link href="/contact" className={linkClass}>Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Contact</h4>
          <ul className="space-y-2 text-sm text-winniep-sand opacity-80">
            <li>
              <a href={whatsappLink(whatsapp)} target="_blank" rel="noopener noreferrer" className={linkClass}>
                WhatsApp: {formatPhoneDisplay(whatsapp)}
              </a>
            </li>
            {email && <li><a href={`mailto:${email}`} className={linkClass}>{email}</a></li>}
            <li><Link href="/privacy" className={linkClass}>Privacy Policy</Link></li>
            <li><Link href="/terms" className={linkClass}>Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto mt-12 pt-8 border-t border-winniep-sand/20 text-center text-xs text-winniep-sand opacity-60">
        © {new Date().getFullYear()} WINNIEP. All rights reserved.
      </div>
    </footer>
  );
}
