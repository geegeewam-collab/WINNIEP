import { createHash } from 'node:crypto';

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

export function cloudinaryConfig(): CloudinaryConfig | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
}

const sha1 = (value: string) => createHash('sha1').update(value).digest('hex');

export const UPLOAD_FOLDER = 'winniep/products';

/** Signed params so the browser can upload straight to Cloudinary (bypasses Vercel's 4.5MB body limit). */
export function signUpload() {
  const cfg = cloudinaryConfig();
  if (!cfg) return null;
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = sha1(`folder=${UPLOAD_FOLDER}&timestamp=${timestamp}${cfg.apiSecret}`);
  return { cloudName: cfg.cloudName, apiKey: cfg.apiKey, timestamp, folder: UPLOAD_FOLDER, signature };
}

/** Best-effort delete of an image we no longer use. Never throws. */
export async function destroyImage(publicId: string): Promise<void> {
  const cfg = cloudinaryConfig();
  if (!cfg || !publicId) return;
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = sha1(`public_id=${publicId}&timestamp=${timestamp}${cfg.apiSecret}`);
    const body = new URLSearchParams({
      public_id: publicId,
      timestamp: String(timestamp),
      api_key: cfg.apiKey,
      signature,
    });
    await fetch(`https://api.cloudinary.com/v1_1/${cfg.cloudName}/image/destroy`, { method: 'POST', body });
  } catch (error) {
    console.error('Cloudinary destroy failed', publicId, error);
  }
}
