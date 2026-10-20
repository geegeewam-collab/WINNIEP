import { NextResponse } from 'next/server';

export function fail(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

export function ok(extra: Record<string, unknown> = {}) {
  return NextResponse.json({ success: true, ...extra });
}

/** Postgres unique-violation helper for friendly messages. */
export function isUniqueViolation(error: unknown): boolean {
  return typeof error === 'object' && error !== null && (error as { code?: string }).code === '23505';
}

/** First validation message from a zod error, with the field name when zod's default text is vague. */
export function firstIssue(error: { issues: { message: string; path: PropertyKey[] }[] }): string {
  const issue = error.issues[0];
  if (!issue) return 'Invalid input';
  const vague = /^(invalid|expected|required)/i.test(issue.message);
  const field = issue.path.map(String).join('.');
  return vague && field ? `${field}: ${issue.message}` : issue.message;
}
