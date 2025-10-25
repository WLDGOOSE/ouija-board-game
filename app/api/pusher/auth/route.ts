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

function parseBody(req: NextRequest): Promise<{ socket_id?: string; channel_name?: string }> {
  const contentType = req.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return req.json();
  }
  return req.text().then((text) => {
    const out: any = {};
    text.split('&').forEach((pair) => {
      const [k, v] = pair.split('=');
      if (!k) return;
      out[decodeURIComponent(k)] = decodeURIComponent(v || '');
    });
    return out;
  });
}

export async function POST(req: NextRequest) {
  try {
    // Origin and rate limit checks
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden origin' }, { status: 403 });
    }
    const isDev = process.env.NODE_ENV !== 'production';
    const limited = rateLimit(req, isDev ? 300 : 60, 60_000);
    if (limited) return limited;

    const body = await parseBody(req);
    const socket_id = body?.socket_id;
    const raw_channel = body?.channel_name || '';

    if (!socket_id || !raw_channel) {
      return NextResponse.json({ error: 'Missing socket_id or channel_name' }, { status: 400 });
    }

    // Strict channel validation: presence-room-<id>
    const channel_name = sanitizeIdentifier(raw_channel, { maxLen: 64, pattern: /^presence-[a-zA-Z0-9_-]+$/ });
    if (!channel_name.startsWith('presence-')) {
      return NextResponse.json({ error: 'Invalid channel' }, { status: 400 });
    }

    const usernameParam = req.nextUrl.searchParams.get('username') || 'Anonymous';
    const displayName = sanitizeIdentifier(usernameParam, { maxLen: 24 });

    const presenceData = {
      user_id: 'anon-' + Math.random().toString(36).slice(2),
      user_info: { name: displayName }
    };

    const pusher = getPusher();
    const authResponse = (pusher as any).authenticate(socket_id, channel_name, presenceData);

    return new NextResponse(JSON.stringify(authResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Pusher auth error:', error?.message || error);
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
  }
}