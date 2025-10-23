import { useState, useEffect, useCallback, useRef } from 'react';
import { Message } from '@/app/components/types';

// Only import Pusher client-side
let pusherClient: any = null;
if (typeof window !== 'undefined') {
  try {
    const Pusher = require('pusher-js');
    if (process.env.NODE_ENV !== 'production') {
      try { Pusher.logToConsole = true; } catch {}
    }
    const _key = process.env.NEXT_PUBLIC_PUSHER_KEY!;
    const _cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER!;
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Pusher] init', { key: _key?.slice(0, 6) + '…', cluster: _cluster });
    }
    pusherClient = new Pusher(_key, {
      cluster: _cluster,
      forceTLS: true,
      enabledTransports: ['ws', 'wss'],
      disabledTransports: ['sockjs', 'xhr_streaming', 'xhr_polling']
    });
  } catch (error) {
    console.warn('Pusher client failed to initialize, using fallback mode', error);
  }
}

export function useRealTimeChat({
  roomId,
  username,
  onNewMessage,
  onBoardInteraction,
  onUserJoined,
  onUserLeft
}: any) {
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<any>(null);

  // Simple fallback mode if Pusher isn't available
  const isFallbackMode = !pusherClient;

  const sendMessage = useCallback(async (text: string, type: Message['type'] = 'user') => {
    if (!roomId || !username) return false;

    try {
      const response = await fetch('/api/pusher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: `room-${roomId}`,
          event: 'chat-message',
          data: { sender: username, text, type, senderId: username }
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send chat message:', error);
      return false;
    }
  }, [roomId, username]);

  const sendBoardInteraction = useCallback(async (interaction: any) => {
    if (!roomId || !username) return false;

    try {
      const response = await fetch('/api/pusher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: `room-${roomId}`,
          event: 'board-interaction',
          data: { interaction, username, senderId: username }
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send board interaction:', error);
      return false;
    }
  }, [roomId, username]);

  const sendSpiritResponse = useCallback(async (response: string, spiritName: string) => {
    if (!roomId) return false;

    try {
      const res = await fetch('/api/pusher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: `room-${roomId}`,
          event: 'spirit-response',
          data: { response, spiritName, isSpirit: true }
        })
      });

      return res.ok;
    } catch (error) {
      console.error('Failed to send spirit response:', error);
      return false;
    }
  }, [roomId]);

  // Real-time setup (only if Pusher is available)
  useEffect(() => {
    if (isFallbackMode) {
      console.log('Using fallback mode - real-time features limited');
      setIsConnected(false);
      return;
    }

    if (!roomId || !pusherClient) return;

    const channelName = `room-${roomId}`;
    
    try {
      const channel = pusherClient.subscribe(channelName);
      channelRef.current = channel;

      channel.bind('pusher:subscription_succeeded', () => {
        setIsConnected(true);
      });

      channel.bind('pusher:subscription_error', () => {
        setIsConnected(false);
      });

      const currentUsername = username;

      channel.bind('chat-message', (data: any) => {
        if (data.senderId !== currentUsername) {
          onNewMessage({
            sender: data.sender,
            text: data.text,
            type: data.type
          });
        }
      });

      channel.bind('board-interaction', (data: any) => {
        if (data.senderId !== currentUsername) {
          onBoardInteraction?.(data);
        }
      });

      channel.bind('user-joined', onUserJoined);
      channel.bind('user-left', onUserLeft);
      channel.bind('spirit-response', (data: any) => {
        onNewMessage({
          sender: data.spiritName,
          text: data.response,
          type: 'spirit'
        });
      });

    } catch (error) {
      console.warn('Pusher setup failed, using fallback', error);
      setIsConnected(false);
    }

    return () => {
      channelRef.current?.unsubscribe();
      setIsConnected(false);
    };
  }, [roomId, username, onNewMessage, onBoardInteraction, onUserJoined, onUserLeft, isFallbackMode]);

  return {
    isConnected,
    sendMessage,
    sendBoardInteraction,
    sendSpiritResponse,
    isFallbackMode
  };
}