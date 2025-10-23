import PusherClient from 'pusher-js';

export const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  forceTLS: true,
  enabledTransports: ['ws', 'wss'],
  disabledTransports: ['sockjs', 'xhr_streaming', 'xhr_polling']
});