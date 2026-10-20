import type { DeliveryRule } from './types';

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
}

export function formatKsh(amount: number): string {
  return `KSh ${Math.round(amount).toLocaleString('en-US')}`;
}

/** Accepts 07xx / 01xx / +2547xx / 2547xx / 7xx and returns 2547XXXXXXXX, or null if invalid. */
export function normalizeKenyanPhone(input: string): string | null {
  const digits = input.replace(/[\s\-().]/g, '');
  let m = /^\+?254([17]\d{8})$/.exec(digits);
  if (m) return `254${m[1]}`;
  m = /^0([17]\d{8})$/.exec(digits);
  if (m) return `254${m[1]}`;
  m = /^([17]\d{8})$/.exec(digits);
  if (m) return `254${m[1]}`;
  return null;
}

/** 254756374843 -> +254 756 374 843 */
export function formatPhoneDisplay(phone: string): string {
  const d = phone.replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('254')) return `+254 ${d.slice(3, 6)} ${d.slice(6, 9)} ${d.slice(9)}`;
  return phone;
}

export function whatsappLink(number: string, text?: string): string {
  let digits = number.replace(/\D/g, '');
  if (digits.startsWith('0')) digits = `254${digits.slice(1)}`;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

/** Adds Cloudinary delivery transforms (auto format/quality + max width). Leaves other URLs untouched. */
export function imgUrl(url: string | undefined | null, width?: number): string {
  if (!url) return '';
  if (!width || !url.includes('/image/upload/')) return url;
  return url.replace('/image/upload/', `/image/upload/f_auto,q_auto,c_limit,w_${width}/`);
}

export function findDeliveryFee(rules: DeliveryRule[], county: string): number | null {
  const wanted = county.trim().toLowerCase();
  const rule = rules.find((r) => r.county.trim().toLowerCase() === wanted);
  return rule ? rule.fee : null;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Nairobi',
  });
}

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** How many products can be featured (they form the home-page slideshow). */
export const MAX_FEATURED_PRODUCTS = 10;
