import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, createSessionToken, isAdminConfigured, passwordMatches, sessionCookieOptions } from '@/lib/auth';
import { fail } from '@/lib/api';

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return fail('Admin login is not set up yet. Add ADMIN_PASSWORD to your environment variables and redeploy.', 500);
  }
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!passwordMatches(password)) {
    await new Promise((resolve) => setTimeout(resolve, 800)); // slow down guessing
    return fail('Incorrect password.', 401);
  }

  const token = createSessionToken();
  if (!token) return fail('Could not start a session.', 500);
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions);
  return res;
}
