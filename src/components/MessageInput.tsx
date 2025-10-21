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
    <div className="border-t border-gray-300 bg-white p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isDisabled ? 'Connecting...' : 'Type your message...'}
          disabled={isDisabled}
          className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-400 disabled:bg-gray-100 disabled:text-gray-500"
          maxLength={500}
        />
        <button
          type="submit"
          disabled={isDisabled || !message.trim()}
          className="rounded-md bg-lime-500 px-6 py-2 font-medium text-gray-900 transition hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          Send
        </button>
      </form>
    </div>
  );
}
