'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Toggle } from './Toggle';
import { cardClass, dangerBtn, inputClass, labelClass, smallBtn } from './styles';
import type { Category } from '@/lib/types';

type Row = Category & { product_count: number };

export function CategoriesManager({ initial }: { initial: Row[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>(initial);
  const [drafts, setDrafts] = useState<Record<string, { name: string; description: string }>>({});
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function call(url: string, method: string, body?: unknown) {
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.success) throw new Error(json?.error || 'Something went wrong.');
    return json;
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setBusy('new');
    setError('');
    try {
      const json = await call('/api/admin/categories', 'POST', { name: newName.trim(), description: newDescription.trim() });
      setRows((r) => [...r, { ...(json.category as Category), product_count: 0 }]);
      setNewName('');
      setNewDescription('');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(null);
    }
  }

  async function save(row: Row) {
    const draft = drafts[row.id];
    if (!draft) return;
    setBusy(row.id);
    setError('');
    try {
      await call(`/api/admin/categories/${row.id}`, 'PATCH', { name: draft.name.trim(), description: draft.description.trim() });
      setRows((r) => r.map((x) => (x.id === row.id ? { ...x, name: draft.name.trim(), description: draft.description.trim() || null } : x)));
      setDrafts((d) => {
        const next = { ...d };
        delete next[row.id];
        return next;
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(null);
    }
  }

  async function setVisible(row: Row, value: boolean) {
    setBusy(row.id);
    setError('');
    try {
      await call(`/api/admin/categories/${row.id}`, 'PATCH', { is_visible: value });
      setRows((r) => r.map((x) => (x.id === row.id ? { ...x, is_visible: value } : x)));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(null);
    }
  }

  async function remove(row: Row) {
    const extra = row.product_count > 0 ? ` Its ${row.product_count} product${row.product_count === 1 ? '' : 's'} will become uncategorised.` : '';
    if (!window.confirm(`Delete the "${row.name}" category?${extra}`)) return;
    setBusy(row.id);
    setError('');
    try {
      await call(`/api/admin/categories/${row.id}`, 'DELETE');
      setRows((r) => r.filter((x) => x.id !== row.id));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={add} className={`${cardClass} space-y-4`}>
        <h2 className="text-lg font-bold text-winniep-espresso">Add a category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass} htmlFor="cat-name">Name</label>
            <input id="cat-name" value={newName} onChange={(e) => setNewName(e.target.value)} className={inputClass} placeholder="e.g. Kitchen" required />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="cat-desc">Short description (optional)</label>
            <input id="cat-desc" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className={inputClass} placeholder="Shown at the top of the category page" />
          </div>
        </div>
        <Button type="submit" variant="primary" className="py-2 text-sm" isLoading={busy === 'new'}>Add category</Button>
      </form>

      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3" role="alert">{error}</p>}

      <div className="space-y-3">
        {rows.length === 0 && <p className="text-sm text-winniep-textSecondary">No categories yet.</p>}
        {rows.map((row) => {
          const draft = drafts[row.id] ?? { name: row.name, description: row.description ?? '' };
          const dirty = drafts[row.id] !== undefined && (draft.name.trim() !== row.name || draft.description.trim() !== (row.description ?? ''));
          const setDraft = (patch: Partial<typeof draft>) => setDrafts((d) => ({ ...d, [row.id]: { ...draft, ...patch } }));
          return (
            <div key={row.id} className={`${cardClass} !p-4 space-y-3 ${busy === row.id ? 'opacity-60' : ''}`}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input value={draft.name} onChange={(e) => setDraft({ name: e.target.value })} className={inputClass} aria-label="Category name" />
                <input value={draft.description} onChange={(e) => setDraft({ description: e.target.value })} className={`${inputClass} sm:col-span-2`} placeholder="Description (optional)" aria-label="Category description" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-winniep-textSecondary">
                  /category/{row.slug} · {row.product_count} product{row.product_count === 1 ? '' : 's'}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-36">
                    <Toggle checked={row.is_visible} disabled={busy === row.id} onChange={(v) => setVisible(row, v)} label={row.is_visible ? 'Visible' : 'Hidden'} />
                  </div>
                  {dirty && (
                    <button type="button" className={smallBtn} disabled={busy === row.id} onClick={() => save(row)}>Save changes</button>
                  )}
                  <button type="button" className={`${dangerBtn} !px-3 !py-1.5 !text-xs`} disabled={busy === row.id} onClick={() => remove(row)}>Delete</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
