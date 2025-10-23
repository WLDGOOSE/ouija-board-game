import { NextRequest, NextResponse } from 'next/server';

// Production-safe Pusher initialization
function getPusher() {
  if (typeof window !== 'undefined') {
    throw new Error('Pusher should only be used server-side');
  }

  const Pusher = require('pusher');
  
  return new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    useTLS: true
  });
}

export async function POST(req: NextRequest) {
  // Simple logging for production
  console.log('Pusher API called');
  
  try {
    const body = await req.json();
    const { event, channel, data } = body;

    // Basic validation
    if (!channel || !event) {
      return NextResponse.json(
        { success: false, error: 'Missing channel or event' },
        { status: 400 }
      );
    }

    const pusher = getPusher();
    await pusher.trigger(channel, event, data || {});

    return NextResponse.json({ 
      success: true,
      message: 'Event sent'
    });

  } catch (error: any) {
    console.error('Pusher error:', error.message);
    
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