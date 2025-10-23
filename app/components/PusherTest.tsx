'use client';

import { useEffect, useState } from 'react';
import { pusherClient } from '@/lib/pusher';

export default function PusherTest() {
  const [status, setStatus] = useState('Testing...');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const testChannel = pusherClient.subscribe('test-channel');

    testChannel.bind('pusher:subscription_succeeded', () => {
      setStatus('✅ Connected to Pusher!');
      console.log('Pusher connection successful');
    });

    testChannel.bind('pusher:subscription_error', (error: any) => {
      setStatus('❌ Pusher connection failed');
      console.error('Pusher error:', error);
    });

    testChannel.bind('test-event', (data: any) => {
      setMessages(prev => [...prev, `Test: ${data.message}`]);
    });

    // Test sending a message
    const testPusher = async () => {
      try {
        const response = await fetch('/api/pusher', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channel: 'test-channel',
            event: 'test-event',
            data: { message: 'Hello from Pusher!' }
          })
        });
        
        if (response.ok) {
          console.log('Test message sent successfully');
        } else {
          console.error('Failed to send test message');
        }
      } catch (error) {
        console.error('Error sending test:', error);
      }
    };

    testPusher();

    return () => {
      testChannel.unsubscribe();
    };
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      background: '#1a1a1a', 
      color: 'white',
      margin: '10px',
      borderRadius: '8px'
    }}>
      <h3>Pusher Test</h3>
      <p>Status: {status}</p>
      <div>
        <h4>Messages:</h4>
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
    </div>
  );
}