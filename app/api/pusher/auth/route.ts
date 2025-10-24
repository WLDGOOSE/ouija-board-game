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
    const body = await parseBody(req);
    const socket_id = body?.socket_id;
    const channel_name = body?.channel_name;

    if (!socket_id || !channel_name) {
      return NextResponse.json({ error: 'Missing socket_id or channel_name' }, { status: 400 });
    }

    if (!channel_name.startsWith('presence-')) {
      return NextResponse.json({ error: 'Invalid channel type' }, { status: 400 });
    }

    const usernameParam = req.nextUrl.searchParams.get('username');
    const displayName = usernameParam || 'Anonymous';

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