'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductImage } from '@/components/ui/ProductImage';

export interface HeroSlide {
  id: string;
  slug: string;
  name: string;
  image: string;
  priceLabel: string;
}

const INTERVAL_MS = 7000;

/** Cross-fading hero: one slide per featured product, advancing every 7 seconds (pauses on hover / touch). */
export function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [count, paused, index]); // `index` restarts the 7s clock after a manual dot click

  if (count === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-winniep-espresso opacity-30 font-display italic text-xl p-8 text-center">
        WinnieP
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {slides.map((slide, i) => {
        const active = i === index;
        return (
          <div
            key={slide.id}
            aria-hidden={!active}
            className={`absolute inset-0 transition-opacity duration-1000 ${active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <Link href={`/product/${slide.slug}`} tabIndex={active ? 0 : -1} className="absolute inset-0 block" aria-label={slide.name}>
              <ProductImage url={slide.image} alt={slide.name} width={1000} priority={i === 0} className="absolute inset-0 w-full h-full" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5 pt-16 text-white">
                <p className="font-display font-bold text-lg leading-tight line-clamp-1">{slide.name}</p>
                <p className="text-sm opacity-90">{slide.priceLabel}</p>
              </div>
            </Link>
          </div>
        );
      })}

      {count > 1 && (
        <div className="absolute bottom-4 right-5 z-10 flex gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show ${slide.name}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-2 bg-white/60 hover:bg-white/90'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
