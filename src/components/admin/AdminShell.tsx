'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV = [
  { name: 'Overview', href: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'Products', href: '/admin/products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { name: 'Categories', href: '/admin/categories', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
  { name: 'Orders', href: '/admin/orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
  { name: 'Settings', href: '/admin/settings', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
];

const Icon = ({ d }: { d: string }) => (
  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={d} />
  </svg>
);

export function AdminShell({ children, needsAction }: { children: React.ReactNode; needsAction: number }) {
  const pathname = usePathname() ?? '';
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href));

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-winniep-muted lg:flex">
      {/* mobile top bar */}
      <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-winniep-border h-14 px-4 flex items-center justify-between">
        <span className="font-display font-bold text-lg text-winniep-espresso">WINNIEP <span className="text-xs font-sans font-medium text-winniep-textSecondary">Admin</span></span>
        <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="p-2 text-winniep-espresso">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-winniep-border flex flex-col transition-transform lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-winniep-border">
          <Link href="/admin" className="text-2xl font-display font-bold tracking-tight text-winniep-espresso" onClick={() => setOpen(false)}>
            WINNIEP
          </Link>
          <p className="text-[10px] uppercase tracking-widest text-winniep-textSecondary mt-1">Admin</p>
        </div>

        <nav className="grow p-4 space-y-1 overflow-y-auto">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href) ? 'bg-winniep-espresso text-white' : 'text-winniep-textSecondary hover:bg-winniep-ivory hover:text-winniep-espresso'
              }`}
            >
              <Icon d={item.icon} />
              <span className="grow">{item.name}</span>
              {item.name === 'Orders' && needsAction > 0 && (
                <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-winniep-copper text-white text-[11px] font-bold flex items-center justify-center">
                  {needsAction}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-winniep-border space-y-1">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-winniep-textSecondary hover:bg-winniep-ivory hover:text-winniep-espresso transition-colors">
            <Icon d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            View store
          </a>
          <button type="button" onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-winniep-textSecondary hover:bg-red-50 hover:text-red-700 transition-colors">
            <Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            Sign out
          </button>
        </div>
      </aside>

      <main className="grow min-w-0 p-4 md:p-8 lg:p-10">{children}</main>
    </div>
  );
}
