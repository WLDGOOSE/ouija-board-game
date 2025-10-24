import { NextRequest } from 'next/server';

export function sanitizeIdentifier(input: string, opts?: { maxLen?: number; pattern?: RegExp }): string {
  const maxLen = opts?.maxLen ?? 32;
  const pattern = opts?.pattern ?? /^[a-zA-Z0-9_-]+$/;
  const trimmed = (input || '').trim().slice(0, maxLen);
  const cleaned = trimmed.replace(/[^a-zA-Z0-9_-]/g, '');
  if (!pattern.test(cleaned)) {
    // Fallback to a safe short id
    return Math.random().toString(36).slice(2, 10);
  }
  return cleaned;
}

export function isAllowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin') || '';
  const host = req.headers.get('host') || '';
  // Allow same-origin and localhost dev. In production, set NEXT_PUBLIC_BASE_URL.
  const allowed = [
    process.env.NEXT_PUBLIC_BASE_URL || '',
    `http://${host}`,
    `https://${host}`,
    'http://localhost:3000',
    'https://localhost:3000'
  ].filter(Boolean);
  return allowed.some((o) => origin.startsWith(o));
}

export function getClientKey(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for') || '';
  const ip = fwd.split(',')[0].trim() || 'local';
  const ua = req.headers.get('user-agent') || '';
  return `${ip}:${ua.slice(0, 20)}`;
}