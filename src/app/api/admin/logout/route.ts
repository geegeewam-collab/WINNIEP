import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, sessionCookieOptions } from '@/lib/auth';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, '', { ...sessionCookieOptions, maxAge: 0 });
  return res;
}
