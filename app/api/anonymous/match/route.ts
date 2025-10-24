import { NextRequest, NextResponse } from 'next/server';
import Pusher from 'pusher';

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
    const body = await req.json();
    const username: string | undefined = body?.username;
    let anonId: string | undefined = body?.anonId;

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Missing username' }, { status: 400 });
    }
    if (!anonId || typeof anonId !== 'string') {
      // Generate a fallback anonId if client didn't provide one
      anonId = Math.random().toString(36).slice(2, 10);
    }

    // If no one is waiting, set current user in queue
    if (!waitingUser) {
      waitingUser = { username, anonId };
      return NextResponse.json({ status: 'waiting' });
    }

    // Prevent pairing with self (same anonId)
    if (waitingUser.anonId === anonId) {
      return NextResponse.json({ status: 'waiting' });
    }

    // Pair users
    const partner = waitingUser.username;
    const partnerId = waitingUser.anonId;
    const matchId = Math.random().toString(36).slice(2, 10);
    waitingUser = null;

    // Notify listeners on a shared channel that a match occurred
    const pusher = getPusher();
    await pusher.trigger('anonymous-matches', 'matched', {
      matchId,
      users: [username, partner],
      userIds: [anonId, partnerId]
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