import { adminGuard } from '@/lib/auth';
import { fail, ok } from '@/lib/api';
import { signUpload } from '@/lib/cloudinary';

export async function POST() {
  const denied = await adminGuard();
  if (denied) return denied;
  const signed = signUpload();
  if (!signed) {
    return fail('Photo uploads are not set up yet. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to your environment variables.', 503);
  }
  return ok(signed);
}
