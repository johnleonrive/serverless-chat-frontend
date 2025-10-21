'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      // Store username in localStorage or state management
      localStorage.setItem('username', username.trim());
      router.push('/chat');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-lime-50 to-lime-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-900">
          Serverless Chat
        </h1>
        <p className="mb-6 text-center text-gray-700">
          CPSC 465 - Real-time WebSocket Chat
        </p>
        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-900"
            >
              Enter your username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
              placeholder="Your name"
              required
              minLength={2}
              maxLength={20}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-lime-500 px-4 py-2 font-medium text-gray-900 transition hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2"
          >
            Join Chat
          </button>
        </form>
      </div>
    </main>
  );
}
