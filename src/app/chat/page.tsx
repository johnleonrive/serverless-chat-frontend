'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/lib/store';
import ChatWindow from '@/components/ChatWindow';
import MessageInput from '@/components/MessageInput';
import Sidebar from '@/components/Sidebar';
import ConnectionStatus from '@/components/ConnectionStatus';

export default function ChatPage() {
  const router = useRouter();
  const { connect, disconnect, recipientId } = useChatStore();
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      router.push('/');
      return;
    }

    setUsername(storedUsername);
    // Connect to WebSocket
    connect(storedUsername);

    return () => {
      disconnect();
    };
  }, [connect, disconnect, router]);

  const handleLogout = () => {
    disconnect();
    localStorage.removeItem('username');
    router.push('/');
  };

  return (
    <div className="flex h-screen bg-lime-50">
      <Sidebar username={username} onLogout={handleLogout} />
      <div className="flex flex-1 flex-col">
        <header className="border-b border-gray-300 bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              {recipientId ? `Chat with ${recipientId}` : 'Serverless Chat'}
            </h1>
            <ConnectionStatus />
          </div>
        </header>
        {recipientId ? (
          <>
            <ChatWindow />
            <MessageInput />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="mx-auto h-16 w-16 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                />
              </svg>
              <h2 className="mt-4 text-lg font-semibold text-gray-900">
                Select a contact to start chatting
              </h2>
              <p className="mt-2 text-sm text-gray-700">
                Choose a contact from the sidebar to begin a conversation
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
