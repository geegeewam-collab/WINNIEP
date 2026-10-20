'use client';

import React, { useRef, useState } from 'react';
import { imgUrl } from '@/lib/utils';
import { smallBtn } from './styles';
import type { ProductImage } from '@/lib/types';

interface Props {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  onBusyChange?: (busy: boolean) => void;
  max?: number;
}

/** Downscale big phone photos before upload (faster on mobile data). Falls back to the original file. */
async function shrink(file: File, maxDim = 1800): Promise<Blob> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 1.5 * 1024 * 1024) return file;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.fillStyle = '#ffffff'; // PNG transparency -> white instead of black
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.88));
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

export function ImageUploader({ images, onChange, onBusyChange, max = 12 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const busy = uploading > 0;

  async function handleFiles(list: FileList | null) {
    const files = Array.from(list ?? []).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) return;
    const room = max - images.length;
    if (room <= 0) {
      setError(`A product can have at most ${max} photos.`);
      return;
    }
    const chosen = files.slice(0, room);
    setError(files.length > room ? `Only ${room} more photo${room === 1 ? '' : 's'} fit — the rest were skipped.` : '');
    setUploading(chosen.length);
    onBusyChange?.(true);

    let working = [...images];
    try {
      const sigRes = await fetch('/api/admin/upload-signature', { method: 'POST' });
      const sig = await sigRes.json().catch(() => null);
      if (!sigRes.ok || !sig?.success) throw new Error(sig?.error || 'Could not start the upload. Please sign in again.');

      for (const file of chosen) {
        try {
          const blob = await shrink(file);
          if (blob.size > 10 * 1024 * 1024) throw new Error(`${file.name} is bigger than 10 MB.`);
          const form = new FormData();
          form.append('file', blob, blob === file ? file.name : 'photo.jpg');
          form.append('api_key', sig.apiKey);
          form.append('timestamp', String(sig.timestamp));
          form.append('folder', sig.folder);
          form.append('signature', sig.signature);
          const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, { method: 'POST', body: form });
          const json = await res.json().catch(() => null);
          if (!res.ok || !json?.secure_url) throw new Error(json?.error?.message || `Upload failed for ${file.name}.`);
          working = [...working, { url: json.secure_url as string, public_id: json.public_id as string }];
          onChange(working);
        } catch (e) {
          const msg = e instanceof Error ? e.message : `Upload failed for ${file.name}.`;
          setError((prev) => (prev ? `${prev} ${msg}` : msg));
        } finally {
          setUploading((n) => Math.max(0, n - 1));
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.');
    } finally {
      setUploading(0);
      onBusyChange?.(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  const remove = (index: number) => onChange(images.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((img, i) => (
            <div key={img.public_id} className="rounded-lg border border-winniep-border bg-winniep-ivory overflow-hidden">
              <div className="relative aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgUrl(img.url, 400)} alt={`Product photo ${i + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                {i === 0 && (
                  <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-winniep-copper text-white px-2 py-1 rounded-full">
                    Main
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1 p-2 bg-white">
                <button type="button" className={smallBtn} disabled={busy || i === 0} onClick={() => move(i, i - 1)} aria-label="Move earlier">←</button>
                <button type="button" className={smallBtn} disabled={busy || i === images.length - 1} onClick={() => move(i, i + 1)} aria-label="Move later">→</button>
                {i !== 0 && (
                  <button type="button" className={smallBtn} disabled={busy} onClick={() => move(i, 0)}>Make main</button>
                )}
                <button type="button" className={`${smallBtn} ml-auto !text-red-700`} disabled={busy} onClick={() => remove(i)} aria-label="Remove photo">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length < max && (
        <label
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); void handleFiles(e.dataTransfer.files); }}
          className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center cursor-pointer transition-colors ${
            dragging ? 'border-winniep-copper bg-winniep-ivory' : 'border-winniep-border hover:border-winniep-copper'
          } ${busy ? 'opacity-60 pointer-events-none' : ''}`}
        >
          <svg className="w-8 h-8 text-winniep-copper" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-medium text-winniep-espresso">
            {busy ? `Uploading ${uploading} photo${uploading === 1 ? '' : 's'}…` : images.length === 0 ? 'Add photos from your device' : 'Add more photos'}
          </span>
          <span className="text-xs text-winniep-textSecondary">Tap to choose (you can pick several) or drag them here. Show the front, side and top views.</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => void handleFiles(e.target.files)}
          />
        </label>
      )}

      <p className="text-xs text-winniep-textSecondary">
        {images.length} / {max} photos. The first photo is the main one shown in the shop — use the arrows or &ldquo;Make main&rdquo; to reorder.
      </p>
      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3" role="alert">{error}</p>}
    </div>
  );
}
