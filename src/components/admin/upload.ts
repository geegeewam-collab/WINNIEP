import type { ProductImage } from '@/lib/types';

export interface UploadSignature {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
}

/** Downscale big phone photos before upload (faster on mobile data). Falls back to the original file. */
export async function shrink(file: File, maxDim = 1800): Promise<Blob> {
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

/** Asks our server (admin only) for a signed upload ticket. */
export async function getUploadSignature(): Promise<UploadSignature> {
  const res = await fetch('/api/admin/upload-signature', { method: 'POST' });
  const sig = await res.json().catch(() => null);
  if (!res.ok || !sig?.success) throw new Error(sig?.error || 'Could not start the upload. Please sign in again.');
  return sig as UploadSignature;
}

/** Shrinks one photo and uploads it straight to Cloudinary. Throws a readable Error on failure. */
export async function uploadToCloudinary(file: File, sig: UploadSignature): Promise<ProductImage> {
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
  return { url: json.secure_url as string, public_id: json.public_id as string };
}
