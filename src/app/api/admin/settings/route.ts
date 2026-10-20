import { adminGuard } from '@/lib/auth';
import { getDb } from '@/lib/supabase';
import { fail, firstIssue, ok } from '@/lib/api';
import { SettingsSchema } from '@/lib/validations';

export async function PUT(request: Request) {
  const denied = await adminGuard();
  if (denied) return denied;
  try {
    const body = await request.json().catch(() => null);
    const parsed = SettingsSchema.safeParse(body);
    if (!parsed.success) return fail(firstIssue(parsed.error));
    const s = parsed.data;

    let whatsapp = s.whatsapp_number.replace(/\D/g, '');
    if (whatsapp.startsWith('0')) whatsapp = `254${whatsapp.slice(1)}`;
    if (whatsapp.length < 11 || whatsapp.length > 15) return fail('Enter the WhatsApp number with country code, e.g. 254712345678.');

    // one rule per county (last one wins)
    const rules = new Map<string, { county: string; fee: number }>();
    for (const r of s.delivery_rules) rules.set(r.county.trim().toLowerCase(), { county: r.county.trim(), fee: r.fee });

    const { error } = await getDb().from('store_settings').upsert({
      id: 1,
      whatsapp_number: whatsapp,
      store_email: s.store_email || null,
      announcement_text: s.announcement_text || null,
      delivery_rules: Array.from(rules.values()),
    });
    if (error) throw error;
    return ok();
  } catch (error) {
    console.error('[admin] save settings failed', error);
    return fail('Could not save settings. Please try again.', 500);
  }
}
