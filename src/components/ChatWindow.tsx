'use client';

import { useEffect, useRef } from 'react';
import { useChatStore } from '@/lib/store';
import { format } from 'date-fns';

export default function ChatWindow() {
  const { messages } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-700">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm"
            >
              <div className="mb-1 flex items-baseline justify-between">
                <span className="font-semibold text-gray-900">
                  {message.username}
                </span>
                <span className="text-xs text-gray-700">
                  {format(new Date(message.timestamp), 'HH:mm:ss')}
                </span>
              </div>
              <p className="text-gray-900">{message.content}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
