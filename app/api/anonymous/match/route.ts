import { NextRequest, NextResponse } from 'next/server';
import Pusher from 'pusher';
import { isAllowedOrigin, sanitizeIdentifier } from '@/lib/security';
import { rateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';

function getPusher() {
  return new Pusher({
    appId: process.env.PUSHER_APP_ID as string,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY as string,
    secret: process.env.PUSHER_SECRET as string,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    useTLS: true
  });
}

// Simple in-memory matchmaking queue
type WaitingUser = { username: string; anonId: string };
let waitingUser: WaitingUser | null = null;

export async function POST(req: NextRequest) {
  try {
    // Enforce origin and rate limit
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden origin' }, { status: 403 });
    }
    const limited = rateLimit(req, 30, 30_000);
    if (limited) return limited;

    const body = await req.json();
    const username: string | undefined = body?.username;
    let anonId: string | undefined = body?.anonId;

    const cleanUsername = username ? sanitizeIdentifier(username, { maxLen: 24 }) : '';
    const cleanAnonId = anonId ? sanitizeIdentifier(anonId, { maxLen: 16 }) : '';

    if (!cleanUsername) {
      return NextResponse.json({ error: 'Missing username' }, { status: 400 });
    }

    // Generate a fallback anonId if client didn't provide one
    const finalAnonId = cleanAnonId || Math.random().toString(36).slice(2, 10);

    // If no one is waiting, set current user in queue
    if (!waitingUser) {
      waitingUser = { username: cleanUsername, anonId: finalAnonId };
      return NextResponse.json({ status: 'waiting' });
    }

    // Prevent pairing with self (same anonId)
    if (waitingUser.anonId === finalAnonId) {
      return NextResponse.json({ status: 'waiting' });
    }

    // Pair users
    const partner = waitingUser.username;
    const partnerId = waitingUser.anonId;
    const matchId = Math.random().toString(36).slice(2, 10);
    waitingUser = null;

    // Notify listeners on the allowed channel that a match occurred
    const pusher = getPusher();
    await pusher.trigger('anonymous-matches', 'matched', {
      matchId,
      users: [cleanUsername, partner],
      userIds: [finalAnonId, partnerId]
    });

    return NextResponse.json({ status: 'matched', matchId, partner });
  } catch (error: any) {
    console.error('Anonymous match error:', error?.message || error);
    return NextResponse.json({ error: 'Matchmaking failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}