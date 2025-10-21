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
  const { connect, disconnect } = useChatStore();
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
              Serverless Chat
            </h1>
            <ConnectionStatus />
          </div>
        </header>
        <ChatWindow />
        <MessageInput />
      </div>
    </div>
  );
}
