import React from 'react';
import { imgUrl } from '@/lib/utils';

interface Props {
  url?: string | null;
  alt: string;
  width?: number;
  className?: string;
  priority?: boolean;
}

/** Plain <img> on purpose: Cloudinary already serves optimised, resized images (see imgUrl). */
export function ProductImage({ url, alt, width = 600, className = '', priority = false }: Props) {
  if (!url) {
    return (
      <div className={`flex items-center justify-center bg-winniep-ivory text-winniep-espresso/20 font-display italic text-sm p-3 text-center ${className}`}>
        {alt}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgUrl(url, width)}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={`object-cover ${className}`}
    />
  );
}
