import React from 'react';

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-winniep-muted flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-winniep-border overflow-hidden">
        <div className="p-8 text-center border-b border-winniep-border">
          <div className="text-3xl font-display font-bold text-winniep-espresso mb-2">WINNIEP</div>
          <p className="text-sm text-winniep-textSecondary">Sign in to your store administration</p>
        </div>
        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-winniep-textSecondary tracking-wider">Email Address</label>
              <input
                type="email"
                className="w-full bg-winniep-ivory border border-winniep-border rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-winniep-copper outline-none"
                placeholder="admin@winniep.co.ke"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-winniep-textSecondary tracking-wider">Password</label>
              <input
                type="password"
                className="w-full bg-winniep-ivory border border-winniep-border rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-winniep-copper outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            className="w-full bg-winniep-espresso text-white py-3 rounded-md font-bold hover:bg-opacity-90 transition-colors"
            onClick={() => window.location.href = '/admin'}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
