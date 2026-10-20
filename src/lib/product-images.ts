import { destroyImage } from './cloudinary';
import { getDb } from './supabase';
import type { ProductImage } from './types';

/**
 * Deletes images from Cloudinary, except ones that past orders still show as thumbnails.
 * Best effort — never throws.
 */
export async function cleanupImages(images: ProductImage[]): Promise<void> {
  if (images.length === 0) return;
  try {
    const { data } = await getDb()
      .from('order_items')
      .select('image_snapshot')
      .in('image_snapshot', images.map((i) => i.url));
    const used = new Set((data ?? []).map((row: { image_snapshot: string | null }) => row.image_snapshot));
    await Promise.all(images.filter((i) => !used.has(i.url)).map((i) => destroyImage(i.public_id)));
  } catch (error) {
    console.error('cleanupImages failed', error);
  }
}
