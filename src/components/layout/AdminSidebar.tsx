import React from 'react';
import Link from 'next/link';

export const AdminSidebar = ({ activePath }: { activePath: string }) => {
  const navItems = [
    { name: 'Overview', path: '/admin', icon: 'M3 12q0-4.5 3.5-6.5T12 3v3h3q.5 0 1 .5T16 7v10q0 .5-.5 1T15 18H6q-.5 0-1-.5T5 17V7q0-.5.5-1T6 6h3v3' }, // Simplified icon
    { name: 'Products', path: '/admin/products', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
    { name: 'Categories', path: '/admin/categories', icon: 'M4 6h16M4 12h16M4 18h16' },
    { name: 'Orders', path: '/admin/orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { name: 'Settings', path: '/admin/settings', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-winniep-border h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-winniep-border">
        <div className="text-xl font-display font-bold text-winniep-espresso tracking-tight">WINNIEP Admin</div>
      </div>
      <nav className="grow p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activePath === item.path
                ? 'bg-winniep-ivory text-winniep-copper'
                : 'text-winniep-textSecondary hover:bg-winniep-muted hover:text-winniep-espresso'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-winniep-border">
        <Link
          href="/admin/login"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6-4v12" />
          </svg>
          Logout
        </Link>
      </div>
    </aside>
  );
};
