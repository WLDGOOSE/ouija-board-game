import { NextRequest, NextResponse } from 'next/server';
import { getClientKey } from './security';

// Simple in-memory sliding window limiter per client key
const buckets = new Map<string, { count: number; reset: number }>();

export function rateLimit(req: NextRequest, max = 60, windowMs = 60_000): NextResponse | null {
  const key = getClientKey(req);
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket || bucket.reset < now) {
    bucket = { count: 0, reset: now + windowMs };
    buckets.set(key, bucket);
  }
  bucket.count += 1;
  if (bucket.count > max) {
    const retry = Math.max(0, bucket.reset - now);
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests', retryAfterMs: retry }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil(retry / 1000).toString(),
        },
      }
    );
  }
  return null;
}