'use client';

import React, { useState } from 'react';
import { ProductImage } from '@/components/ui/ProductImage';
import { imgUrl } from '@/lib/utils';
import type { ProductImage as Img } from '@/lib/types';

export function ProductGallery({ images, name }: { images: Img[]; name: string }) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const current = images[Math.min(index, Math.max(0, count - 1))];
  const go = (delta: number) => setIndex((i) => (i + delta + count) % count);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square bg-white border border-winniep-border rounded-2xl overflow-hidden">
        <ProductImage url={current?.url} alt={name} width={1200} priority className="absolute inset-0 w-full h-full" />
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white"
            >
              ›
            </button>
            <span className="absolute bottom-3 right-3 text-xs px-2 py-1 rounded-full bg-black/50 text-white">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((img, i) => (
            <button
              key={img.public_id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}`}
              className={`aspect-square rounded-lg overflow-hidden border-2 bg-white transition-colors ${
                i === index ? 'border-winniep-copper' : 'border-winniep-border hover:border-winniep-sand'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imgUrl(img.url, 200)} alt={`${name} — view ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
