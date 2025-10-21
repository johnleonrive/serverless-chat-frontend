'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/lib/store';
import ChatWindow from '@/components/ChatWindow';
import MessageInput from '@/components/MessageInput';
import Sidebar from '@/components/Sidebar';
import ConnectionStatus from '@/components/ConnectionStatus';

export default function ChatPage() {
  const router = useRouter();
  const { connect, disconnect } = useChatStore();

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      router.push('/');
      return;
    }

    // Connect to WebSocket
    connect(username);

    return () => {
      disconnect();
    };
  }, [connect, disconnect, router]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="border-b bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">
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
