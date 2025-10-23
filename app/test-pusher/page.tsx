'use client';

import { useState } from 'react';
import { useRealTimeChat } from '@/hooks/useRealTimeChat';

export default function TestPusher() {
  const [messages, setMessages] = useState<any[]>([]);
  const [testRoomId, setTestRoomId] = useState('test-room');
  const [testUsername, setTestUsername] = useState('tester');

  const { isConnected, sendMessage } = useRealTimeChat({
    roomId: testRoomId,
    username: testUsername,
    onNewMessage: (message) => {
      setMessages(prev => [...prev, message]);
    }
  });

  const handleSendTest = () => {
    sendMessage('Test message from ' + testUsername);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Pusher Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          Room ID:
          <input 
            value={testRoomId} 
            onChange={(e) => setTestRoomId(e.target.value)}
            style={{ marginLeft: '10px' }}
          />
        </label>
        
        <label style={{ marginLeft: '20px' }}>
          Username:
          <input 
            value={testUsername} 
            onChange={(e) => setTestUsername(e.target.value)}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <strong>Status:</strong> {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>

      <button onClick={handleSendTest} style={{ padding: '10px 20px' }}>
        Send Test Message
      </button>

      <div style={{ marginTop: '20px' }}>
        <h3>Messages:</h3>
        {messages.map((msg, i) => (
          <div key={i} style={{ border: '1px solid #ccc', padding: '10px', margin: '5px' }}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}