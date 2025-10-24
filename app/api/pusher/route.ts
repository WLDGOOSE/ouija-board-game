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
  // Simple logging for production
  console.log('Pusher API called');
  
  try {
    // Enforce origin and rate limit
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ success: false, error: 'Forbidden origin' }, { status: 403 });
    }
    const limited = rateLimit(req, 120, 60_000);
    if (limited) return limited;

    const body = await req.json();
    const rawEvent = body?.event ?? '';
    const rawChannel = body?.channel ?? '';
    const data = body?.data ?? {};

    const event = sanitizeIdentifier(String(rawEvent), { maxLen: 32 });
    const channel = sanitizeIdentifier(String(rawChannel), { maxLen: 64 });

    if (!channel || !event) {
      return NextResponse.json(
        { success: false, error: 'Missing channel or event' },
        { status: 400 }
      );
    }

    // Restrict channels and events
    const isRoom = /^room-[a-zA-Z0-9_-]+$/.test(channel);
    const isAnon = /^anonymous-[a-zA-Z0-9_-]+$/.test(channel);
    const isDev = process.env.NODE_ENV !== 'production';

    const allowedEvents = new Set([
      'chat-message',
      'board-interaction',
      'user-joined',
      'user-left',
      'spirit-response',
      'session-ended',
      'matched'
    ]);
    if (isDev) {
      allowedEvents.add('test-event');
    }

    if (!(isRoom || isAnon || (isDev && channel === 'test-channel'))) {
      return NextResponse.json({ success: false, error: 'Invalid channel' }, { status: 400 });
    }
    if (!allowedEvents.has(event)) {
      return NextResponse.json({ success: false, error: 'Invalid event' }, { status: 400 });
    }

    // Basic payload size limit and type check
    if (typeof data !== 'object' || data === null) {
      return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
    }
    const size = JSON.stringify(data).length;
    if (size > 10_000) {
      return NextResponse.json({ success: false, error: 'Payload too large' }, { status: 413 });
    }

    const pusher = getPusher();
    await pusher.trigger(channel, event, data);

    return NextResponse.json({ 
      success: true,
      message: 'Event sent'
    });

  } catch (error: any) {
    console.error('Pusher error:', error?.message || error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Message delivery failed'
      }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'ready',
    timestamp: new Date().toISOString()
  });
}