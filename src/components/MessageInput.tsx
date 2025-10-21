'use client';

import { useState } from 'react';
import { useChatStore } from '@/lib/store';

export default function MessageInput() {
  const [message, setMessage] = useState('');
  const { sendMessage, connectionStatus } = useChatStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && connectionStatus === 'connected') {
      sendMessage(message.trim());
      setMessage('');
    }
  };

  const isDisabled = connectionStatus !== 'connected';

  return (
    <div className="border-t bg-white p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isDisabled ? 'Connecting...' : 'Type your message...'}
          disabled={isDisabled}
          className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          maxLength={500}
        />
        <button
          type="submit"
          disabled={isDisabled || !message.trim()}
          className="rounded-md bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          Send
        </button>
      </form>
    </div>
  );
}
