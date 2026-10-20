'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { cardClass, inputClass, labelClass, smallBtn } from './styles';
import { KENYA_COUNTIES } from '@/lib/counties';
import type { StoreSettings } from '@/lib/types';

export function SettingsForm({ initial }: { initial: StoreSettings }) {
  const router = useRouter();
  const [whatsapp, setWhatsapp] = useState(initial.whatsapp_number);
  const [email, setEmail] = useState(initial.store_email ?? '');
  const [announcement, setAnnouncement] = useState(initial.announcement_text ?? '');
  const [rules, setRules] = useState<{ county: string; fee: string }[]>(
    initial.delivery_rules.map((r) => ({ county: r.county, fee: String(r.fee) }))
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaved(false);

    const cleaned: { county: string; fee: number }[] = [];
    for (const rule of rules) {
      if (!rule.county.trim() && !rule.fee.trim()) continue; // ignore blank rows
      const fee = Number(rule.fee.replace(/[,\s]/g, ''));
      if (!rule.county.trim() || !Number.isInteger(fee) || fee < 0) {
        setError('Each delivery rule needs a county and a whole-number fee in KSh.');
        return;
      }
      cleaned.push({ county: rule.county.trim(), fee });
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whatsapp_number: whatsapp.trim(),
          store_email: email.trim(),
          announcement_text: announcement.trim(),
          delivery_rules: cleaned,
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) setError(json?.error || 'Could not save settings.');
      else {
        setSaved(true);
        router.refresh();
      }
    } catch {
      setError('Network problem — check your connection and try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <section className={`${cardClass} space-y-5`}>
        <h2 className="text-lg font-bold text-winniep-espresso">Store contact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass} htmlFor="wa">WhatsApp number</label>
            <input id="wa" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={inputClass} placeholder="254712345678" required />
            <p className="text-[11px] text-winniep-textSecondary mt-1">Used for all WhatsApp buttons on the site.</p>
          </div>
          <div>
            <label className={labelClass} htmlFor="email">Store email (optional)</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="hello@yourstore.com" />
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="announce">Announcement bar (optional)</label>
          <input id="announce" value={announcement} onChange={(e) => setAnnouncement(e.target.value)} className={inputClass} placeholder="e.g. Free delivery within Nairobi this weekend" maxLength={200} />
          <p className="text-[11px] text-winniep-textSecondary mt-1">Shown in a slim bar at the very top of the shop. Leave empty to hide it.</p>
        </div>
      </section>

      <section className={`${cardClass} space-y-4`}>
        <div>
          <h2 className="text-lg font-bold text-winniep-espresso">Delivery prices by county</h2>
          <p className="text-sm text-winniep-textSecondary">
            If a customer&apos;s county is listed here, delivery is priced automatically. Any other county is left for you to quote on the order.
          </p>
        </div>
        <datalist id="counties">
          {KENYA_COUNTIES.map((c) => (<option key={c} value={c} />))}
        </datalist>
        <div className="space-y-3">
          {rules.map((rule, i) => (
            <div key={i} className="flex gap-3">
              <input
                list="counties"
                value={rule.county}
                onChange={(e) => setRules((r) => r.map((x, j) => (j === i ? { ...x, county: e.target.value } : x)))}
                className={inputClass}
                placeholder="County, e.g. Nairobi"
                aria-label="County"
              />
              <input
                inputMode="numeric"
                value={rule.fee}
                onChange={(e) => setRules((r) => r.map((x, j) => (j === i ? { ...x, fee: e.target.value } : x)))}
                className={`${inputClass} max-w-[9rem]`}
                placeholder="Fee (KSh)"
                aria-label="Delivery fee in KSh"
              />
              <button type="button" className={smallBtn} onClick={() => setRules((r) => r.filter((_, j) => j !== i))} aria-label="Remove rule">✕</button>
            </div>
          ))}
        </div>
        <button type="button" className={smallBtn} onClick={() => setRules((r) => [...r, { county: '', fee: '' }])}>+ Add county</button>
      </section>

      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3" role="alert">{error}</p>}
      {saved && <p className="text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg p-3">Settings saved.</p>}
      <Button type="submit" variant="primary" isLoading={saving}>Save settings</Button>
    </form>
  );
}
