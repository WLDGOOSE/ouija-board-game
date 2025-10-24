import { NextRequest, NextResponse } from 'next/server';
import Pusher from 'pusher';

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
    const body = await req.json();
    const { roomId, username, isAnonymous = false } = body;

    // Basic validation
    if (!roomId || !username) {
      return NextResponse.json(
        { success: false, error: 'Missing roomId or username' },
        { status: 400 }
      );
    }

    const pusher = getPusher();
    const channelName = `room-${roomId}`;
    
    // Only emit user-joined event if not anonymous
    if (!isAnonymous) {
      await pusher.trigger(channelName, 'user-joined', {
        username,
        message: `${username} has joined the session`
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