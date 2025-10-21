'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useChatStore } from '@/lib/store';
import ChatWindow from '@/components/ChatWindow';
import MessageInput from '@/components/MessageInput';
import Sidebar from '@/components/Sidebar';
import ConnectionStatus from '@/components/ConnectionStatus';

export function generateStaticParams() {
  return [
    { id: 'general' },
    { id: 'random' },
    { id: 'tech' },
    { id: 'off-topic' },
  ];
}

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const { joinRoom, currentRoom, disconnect } = useChatStore();
  const roomId = params.id as string;
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      router.push('/');
      return;
    }

    setUsername(storedUsername);

    if (roomId && roomId !== currentRoom) {
      joinRoom(roomId);
    }
  }, [roomId, joinRoom, currentRoom, router]);

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
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Room: {roomId}
              </h1>
            </div>
            <ConnectionStatus />
          </div>
        </header>
        <ChatWindow />
        <MessageInput />
      </div>
    </div>
  );
}
