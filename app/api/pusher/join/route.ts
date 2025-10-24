import { NextRequest, NextResponse } from 'next/server';
import Pusher from 'pusher';
import { isAllowedOrigin, sanitizeIdentifier } from '@/lib/security';
import { rateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';

// Production-safe Pusher initialization
function getPusher() {
  if (typeof window !== 'undefined') {
    throw new Error('Pusher should only be used server-side');
  }

  return new Pusher({
    appId: process.env.PUSHER_APP_ID as string,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY as string,
    secret: process.env.PUSHER_SECRET as string,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    useTLS: true
  });
}

export async function POST(req: NextRequest) {
  try {
    // Enforce origin and rate limit
    if (!isAllowedOrigin(req)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden origin' },
        { status: 403 }
      );
    }
    const limited = rateLimit(req, 60, 60_000);
    if (limited) return limited;

    const body = await req.json();
    const { roomId, username, isAnonymous = false } = body;

    // Sanitize inputs
    const cleanRoomId = sanitizeIdentifier(String(roomId || ''), { maxLen: 24 });
    const cleanUsername = sanitizeIdentifier(String(username || ''), { maxLen: 24 });

    if (!cleanRoomId || !cleanUsername) {
      return NextResponse.json(
        { success: false, error: 'Missing roomId or username' },
        { status: 400 }
      );
    }

    const pusher = getPusher();
    const channelName = `room-${cleanRoomId}`;
    
    // Only emit user-joined event if not anonymous
    if (!isAnonymous) {
      await pusher.trigger(channelName, 'user-joined', {
        username: cleanUsername,
        message: `${cleanUsername} has joined the session`
      });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Joined room successfully',
      isAnonymous
    });

  } catch (error: any) {
    console.error('Join room error:', error?.message || error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to join room'
      }, 
      { status: 500 }
    );
  }
}