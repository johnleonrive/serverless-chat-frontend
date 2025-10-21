'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useChatStore } from '@/lib/store';
import ChatWindow from '@/components/ChatWindow';
import MessageInput from '@/components/MessageInput';
import Sidebar from '@/components/Sidebar';
import ConnectionStatus from '@/components/ConnectionStatus';

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const { joinRoom, currentRoom } = useChatStore();
  const roomId = params.id as string;

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      router.push('/');
      return;
    }

    if (roomId && roomId !== currentRoom) {
      joinRoom(roomId);
    }
  }, [roomId, joinRoom, currentRoom, router]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="border-b bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
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
