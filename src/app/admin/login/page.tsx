'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        setError(json?.error || 'Could not sign in.');
        setLoading(false);
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch {
      setError('Network problem — check your connection and try again.');
      setLoading(false);
    }
  }

  return (
    <div className="grow min-h-screen flex items-center justify-center bg-winniep-ivory px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-winniep-border">
        <div className="text-center mb-8">
          <div className="text-3xl font-display font-bold text-winniep-espresso tracking-tight">WINNIEP</div>
          <p className="text-xs uppercase tracking-widest text-winniep-textSecondary mt-1">Admin sign in</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-winniep-textSecondary tracking-wider" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-winniep-border rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-winniep-copper outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3" role="alert">{error}</p>}

          <Button type="submit" variant="primary" className="w-full py-3" isLoading={loading}>Sign in</Button>
        </form>
      </div>
    </div>
  );
}
