import { useEffect, useRef, useState, useCallback } from 'react';

export function useAnonymousChat({ username, onNewMessage, onUserCountUpdate }: {
  username: string;
  onNewMessage: (msg: { sender: string; text: string; type: 'user' | 'system' | 'spirit' }) => void;
  onUserCountUpdate?: (count: number) => void;
}) {
  const [isConnected, setIsConnected] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const pusherRef = useRef<any>(null);
  const channelRef = useRef<any>(null);
  const presenceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const Pusher = require('pusher-js');
      const key = process.env.NEXT_PUBLIC_PUSHER_KEY!;
      const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER!;

      pusherRef.current = new Pusher(key, {
        cluster,
        forceTLS: true,
        enabledTransports: ['ws', 'wss'],
        disabledTransports: ['sockjs', 'xhr_streaming', 'xhr_polling'],
        authEndpoint: `/api/pusher/auth?username=${encodeURIComponent(username || 'Anonymous')}`
      });

      // Presence for counting
      const presence = pusherRef.current.subscribe('presence-anonymous');
      presenceRef.current = presence;

      presence.bind('pusher:subscription_succeeded', () => {
        const count = presence.members?.count || 0;
        setOnlineCount(count);
        onUserCountUpdate?.(count);
      });
      presence.bind('pusher:member_added', () => {
        const count = presence.members?.count || 0;
        setOnlineCount(count);
        onUserCountUpdate?.(count);
      });
      presence.bind('pusher:member_removed', () => {
        const count = presence.members?.count || 0;
        setOnlineCount(count);
        onUserCountUpdate?.(count);
      });

      // Anonymous chat channel
      const channel = pusherRef.current.subscribe('anonymous');
      channelRef.current = channel;

      channel.bind('pusher:subscription_succeeded', () => {
        setIsConnected(true);
      });

      channel.bind('pusher:subscription_error', () => {
        setIsConnected(false);
      });

      channel.bind('chat-message', (data: any) => {
        if (!data) return;
        if (data.senderId === username) return;
        onNewMessage({ sender: data.sender, text: data.text, type: data.type || 'user' });
      });

      channel.bind('session-ended', (data: any) => {
        setIsConnected(false);
        onNewMessage({ sender: 'SYSTEM', text: 'Anonymous session ended.', type: 'system' });
      });

      return () => {
        try { channelRef.current?.unsubscribe(); } catch {}
        try { presenceRef.current?.unsubscribe(); } catch {}
        setIsConnected(false);
      };
    } catch (e) {
      console.warn('Anonymous chat init failed', e);
    }
  }, [username, onNewMessage, onUserCountUpdate]);

  const sendAnonymousMessage = useCallback(async (text: string) => {
    try {
      const res = await fetch('/api/pusher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'anonymous',
          event: 'chat-message',
          data: { sender: username, text, type: 'user', senderId: username }
        })
      });
      return res.ok;
    } catch (e) {
      console.error('Failed to send anonymous message', e);
      return false;
    }
  }, [username]);

  const endAnonymousSession = useCallback(async () => {
    try {
      const res = await fetch('/api/pusher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'anonymous',
          event: 'session-ended',
          data: { by: username }
        })
      });
      return res.ok;
    } catch (e) {
      console.error('Failed to end anonymous session', e);
      return false;
    }
  }, [username]);

  return { isConnected, onlineCount, sendAnonymousMessage, endAnonymousSession };
}