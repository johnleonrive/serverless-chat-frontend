'use client';

import { useChatStore } from '@/lib/store';
import Link from 'next/link';

export default function Sidebar() {
  const { currentRoom } = useChatStore();

  const rooms = ['general', 'random', 'tech', 'off-topic'];

  return (
    <aside className="w-64 border-r bg-white p-4">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">Rooms</h2>
      <nav className="space-y-2">
        {rooms.map((room) => (
          <Link
            key={room}
            href={`/rooms/${room}`}
            className={`block rounded-md px-4 py-2 transition ${
              currentRoom === room
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            # {room}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
