'use client';

import { useChatStore } from '@/lib/store';
import Link from 'next/link';

interface SidebarProps {
  username: string;
  onLogout: () => void;
}

export default function Sidebar({ username, onLogout }: SidebarProps) {
  const { currentRoom } = useChatStore();

  const rooms = ['general', 'random', 'tech', 'off-topic'];

  return (
    <aside className="flex w-64 flex-col border-r border-gray-300 bg-white">
      {/* Profile Section - Top Left */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-500 text-gray-900">
            <span className="text-lg font-semibold">
              {username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-semibold text-gray-900">
              {username}
            </p>
            <p className="text-xs text-gray-700">Online</p>
          </div>
        </div>
      </div>

      {/* Rooms Section - Middle */}
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Rooms</h2>
        <nav className="space-y-2">
          {rooms.map((room) => (
            <Link
              key={room}
              href={`/rooms/${room}`}
              className={`block rounded-md px-4 py-2 transition ${
                currentRoom === room
                  ? 'bg-lime-400 text-gray-900'
                  : 'text-gray-900 hover:bg-lime-100'
              }`}
            >
              # {room}
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout Section - Bottom Left */}
      <div className="p-4">
        <button
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-lime-100 focus:outline-none focus:ring-2 focus:ring-lime-400"
        >
          <span>Log Out</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
            />
          </svg>
        </button>
      </div>
    </aside>
  );
}
