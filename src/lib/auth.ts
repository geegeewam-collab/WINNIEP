import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_COOKIE = 'winniep_admin';
const SESSION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function sessionKey(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return (
    process.env.ADMIN_SESSION_SECRET ||
    createHash('sha256').update(`winniep-session:${password}`).digest('hex')
  );
}

function sign(payload: string, key: string): string {
  return createHmac('sha256', key).update(payload).digest('hex');
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function createSessionToken(): string | null {
  const key = sessionKey();
  if (!key) return null;
  const expires = String(Date.now() + SESSION_MS);
  return `${expires}.${sign(expires, key)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  const key = sessionKey();
  if (!key || !token) return false;
  const [expires, signature] = token.split('.');
  if (!expires || !signature) return false;
  const given = Buffer.from(signature);
  const expected = Buffer.from(sign(expires, key));
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return false;
  return Number(expires) > Date.now();
}

export function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = createHash('sha256').update(input).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: SESSION_MS / 1000,
};

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

/** For server components / pages: redirects to the login page when not signed in. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect('/admin/login');
}

/** For route handlers: returns a 401 response when not signed in, otherwise null. */
export async function adminGuard(): Promise<NextResponse | null> {
  if (await isAdmin()) return null;
  return NextResponse.json({ success: false, error: 'Please sign in again.' }, { status: 401 });
}
