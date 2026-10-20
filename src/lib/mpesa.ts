/**
 * Safaricom Daraja — M-PESA Express (STK Push).
 * Fully optional: when the env vars are not set, isMpesaConfigured() is false and the
 * storefront falls back to "we'll send payment details on WhatsApp" + manual "mark as paid" in admin.
 */
interface MpesaConfig {
  baseUrl: string;
  consumerKey: string;
  consumerSecret: string;
  shortcode: string;
  passkey: string;
  transactionType: string;
  partyB: string;
  callbackSecret: string;
}

export function mpesaConfig(): MpesaConfig | null {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  const callbackSecret = process.env.MPESA_CALLBACK_SECRET;
  if (!consumerKey || !consumerSecret || !shortcode || !passkey || !callbackSecret) return null;
  return {
    baseUrl: process.env.MPESA_ENV === 'production' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke',
    consumerKey,
    consumerSecret,
    shortcode,
    passkey,
    transactionType: process.env.MPESA_TRANSACTION_TYPE || 'CustomerPayBillOnline',
    partyB: process.env.MPESA_PARTY_B || shortcode,
    callbackSecret,
  };
}

export function isMpesaConfigured(): boolean {
  return mpesaConfig() !== null;
}

export function mpesaCallbackSecret(): string | null {
  return mpesaConfig()?.callbackSecret ?? null;
}

async function getAccessToken(cfg: MpesaConfig): Promise<string> {
  const basic = Buffer.from(`${cfg.consumerKey}:${cfg.consumerSecret}`).toString('base64');
  const res = await fetch(`${cfg.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${basic}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`M-PESA auth failed (${res.status})`);
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error('M-PESA auth returned no token');
  return json.access_token;
}

function timestamp(): string {
  // Nairobi time (UTC+3), format YYYYMMDDHHmmss
  const d = new Date(Date.now() + 3 * 60 * 60 * 1000);
  return d.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
}

export interface StkResult {
  merchantRequestId: string;
  checkoutRequestId: string;
  customerMessage: string;
}

export async function stkPush(args: { phone: string; amount: number; reference: string; siteUrl: string }): Promise<StkResult> {
  const cfg = mpesaConfig();
  if (!cfg) throw new Error('M-PESA is not configured');
  const token = await getAccessToken(cfg);
  const ts = timestamp();
  const password = Buffer.from(`${cfg.shortcode}${cfg.passkey}${ts}`).toString('base64');

  const res = await fetch(`${cfg.baseUrl}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify({
      BusinessShortCode: cfg.shortcode,
      Password: password,
      Timestamp: ts,
      TransactionType: cfg.transactionType,
      Amount: Math.round(args.amount),
      PartyA: args.phone,
      PartyB: cfg.partyB,
      PhoneNumber: args.phone,
      CallBackURL: `${args.siteUrl}/api/payments/callback?secret=${encodeURIComponent(cfg.callbackSecret)}`,
      AccountReference: args.reference.slice(0, 12),
      TransactionDesc: 'WinnieP order',
    }),
  });

  const json = (await res.json().catch(() => ({}))) as {
    ResponseCode?: string;
    MerchantRequestID?: string;
    CheckoutRequestID?: string;
    CustomerMessage?: string;
    errorMessage?: string;
    ResponseDescription?: string;
  };

  if (!res.ok || json.ResponseCode !== '0' || !json.CheckoutRequestID) {
    throw new Error(json.errorMessage || json.ResponseDescription || `STK push failed (${res.status})`);
  }
  return {
    merchantRequestId: json.MerchantRequestID ?? '',
    checkoutRequestId: json.CheckoutRequestID,
    customerMessage: json.CustomerMessage ?? 'Check your phone to enter your M-PESA PIN.',
  };
}
