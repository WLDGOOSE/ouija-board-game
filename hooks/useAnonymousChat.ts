import { useEffect, useRef, useState, useCallback } from 'react';

export function useAnonymousChat({ username, onNewMessage, onUserCountUpdate }: {
  username: string;
  onNewMessage: (msg: { sender: string; text: string; type: 'user' | 'system' | 'spirit' }) => void;
  onUserCountUpdate?: (count: number) => void;
}) {
  const [isConnected, setIsConnected] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isPaired, setIsPaired] = useState(false);
  const [partnerName, setPartnerName] = useState<string>('');
  const [matchId, setMatchId] = useState<string>('');

  const pusherRef = useRef<any>(null);
  const presenceRef = useRef<any>(null);
  const pairChannelRef = useRef<any>(null);
  const matchesChannelRef = useRef<any>(null);
  const anonIdRef = useRef<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Generate a stable anonymous session id
    if (!anonIdRef.current) {
      try {
        const uuid = (crypto as any)?.randomUUID?.();
        anonIdRef.current = uuid || Math.random().toString(36).slice(2, 10);
      } catch {
        anonIdRef.current = Math.random().toString(36).slice(2, 10);
      }
    }

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

      // Presence for counting online anonymous users
      const presence = pusherRef.current.subscribe('presence-anonymous');
      presenceRef.current = presence;

      const updateCount = () => {
        const count = presence.members?.count || 0;
        setOnlineCount(count);
        onUserCountUpdate?.(count);
      };

      presence.bind('pusher:subscription_succeeded', updateCount);
      presence.bind('pusher:member_added', updateCount);
      presence.bind('pusher:member_removed', updateCount);

      // Listen for matchmaking events
      const matchesChannel = pusherRef.current.subscribe('anonymous-matches');
      matchesChannelRef.current = matchesChannel;
      matchesChannel.bind('matched', (data: any) => {
        const users: string[] = data?.users || [];
        const ids: string[] = data?.userIds || [];
        const mid: string = data?.matchId;
        if (!mid) return;

        const myId = anonIdRef.current;
        const myIndex = ids.length === 2 ? ids.indexOf(myId) : -1;
        if (myIndex === -1 && ids.length === 2) return;

        let partner = '';
        if (myIndex !== -1 && users.length === 2) {
          const partnerIndex = myIndex === 0 ? 1 : 0;
          partner = users[partnerIndex] || '';
        } else {
          partner = users.find(u => u !== username) || '';
        }

        setMatchId(mid);
        setPartnerName(partner);
        setIsWaiting(false);
        setIsPaired(true);

        // Subscribe to dedicated pair channel for this match
        try {
          const pairChannel = pusherRef.current.subscribe(`anonymous-${mid}`);
          pairChannelRef.current = pairChannel;

          pairChannel.bind('pusher:subscription_succeeded', () => {
            setIsConnected(true);
            onNewMessage({ sender: 'SYSTEM', text: `Paired with ${partner}. You can chat now.`, type: 'system' });
          });

          pairChannel.bind('pusher:subscription_error', () => {
            setIsConnected(false);
          });

          pairChannel.bind('chat-message', (msg: any) => {
            if (!msg) return;
            if (msg.senderId === username) return;
            onNewMessage({ sender: msg.sender, text: msg.text, type: msg.type || 'user' });
          });

          pairChannel.bind('session-ended', () => {
            onNewMessage({ sender: 'SYSTEM', text: 'Anonymous session ended.', type: 'system' });
            cleanupPair();
          });
        } catch (e) {
          console.warn('Failed to subscribe to pair channel', e);
        }
      });

      return () => {
        try { pairChannelRef.current?.unsubscribe?.(); } catch {}
        try { matchesChannelRef.current?.unsubscribe?.(); } catch {}
        try { presenceRef.current?.unsubscribe?.(); } catch {}
        setIsConnected(false);
        setIsWaiting(false);
        setIsPaired(false);
        setPartnerName('');
        setMatchId('');
      };
    } catch (e) {
      console.warn('Anonymous chat init failed', e);
    }
  }, [username, onNewMessage, onUserCountUpdate]);

  const startAnonymousChat = useCallback(async () => {
    try {
      setIsWaiting(true);
      setIsPaired(false);
      setPartnerName('');
      setMatchId('');

      const res = await fetch('/api/anonymous/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, anonId: anonIdRef.current })
      });

      if (!res.ok) {
        setIsWaiting(false);
        const err = await res.json().catch(() => ({}));
        console.error('Matchmaking error:', err);
        return false;
      }

      const data = await res.json();
      if (data.status === 'matched') {
        setMatchId(data.matchId);
        setPartnerName(data.partner);
        setIsWaiting(false);
        setIsPaired(true);
        // Subscribe immediately to pair channel if not already via matches event
        try {
          const pairChannel = pusherRef.current.subscribe(`anonymous-${data.matchId}`);
          pairChannelRef.current = pairChannel;
          pairChannel.bind('pusher:subscription_succeeded', () => setIsConnected(true));
          pairChannel.bind('pusher:subscription_error', () => setIsConnected(false));
          pairChannel.bind('chat-message', (msg: any) => {
            if (!msg) return;
            if (msg.senderId === username) return;
            onNewMessage({ sender: msg.sender, text: msg.text, type: msg.type || 'user' });
          });
          pairChannel.bind('session-ended', () => {
            onNewMessage({ sender: 'SYSTEM', text: 'Anonymous session ended.', type: 'system' });
            cleanupPair();
          });
        } catch (e) {
          console.warn('Pair subscription error', e);
        }
        return true;
      } else {
        // Waiting; will get matched via Pusher event
        return true;
      }
    } catch (e) {
      console.error('Failed to start anonymous chat', e);
      setIsWaiting(false);
      return false;
    }
  }, [username, onNewMessage]);

  const sendAnonymousMessage = useCallback(async (text: string) => {
    if (!matchId) return false;
    try {
      const res = await fetch('/api/pusher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: `anonymous-${matchId}`,
          event: 'chat-message',
          data: { sender: username, text, type: 'user', senderId: username }
        })
      });
      return res.ok;
    } catch (e) {
      console.error('Failed to send anonymous message', e);
      return false;
    }
  }, [username, matchId]);

  const endAnonymousSession = useCallback(async () => {
    if (!matchId) return false;
    try {
      const res = await fetch('/api/pusher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: `anonymous-${matchId}`,
          event: 'session-ended',
          data: { by: username }
        })
      });
      cleanupPair();
      return res.ok;
    } catch (e) {
      console.error('Failed to end anonymous session', e);
      return false;
    }
  }, [username, matchId]);

  const cleanupPair = useCallback(() => {
    try { pairChannelRef.current?.unsubscribe?.(); } catch {}
    setIsConnected(false);
    setIsWaiting(false);
    setIsPaired(false);
    setPartnerName('');
    setMatchId('');
  }, []);

  return { 
    isConnected, 
    onlineCount, 
    isWaiting, 
    isPaired, 
    partnerName, 
    matchId, 
    startAnonymousChat, 
    sendAnonymousMessage, 
    endAnonymousSession 
  };
}