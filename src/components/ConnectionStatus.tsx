'use client';

import { useChatStore } from '@/lib/store';

export default function ConnectionStatus() {
  const { connectionStatus } = useChatStore();

  const statusConfig = {
    connected: {
      text: 'Connected',
      color: 'bg-lime-500',
      textColor: 'text-gray-900',
    },
    connecting: {
      text: 'Connecting...',
      color: 'bg-amber-500',
      textColor: 'text-gray-900',
    },
    disconnected: {
      text: 'Disconnected',
      color: 'bg-red-500',
      textColor: 'text-gray-900',
    },
  };

  const config = statusConfig[connectionStatus];

  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-full ${config.color}`} />
      <span className={`text-sm font-medium ${config.textColor}`}>
        {config.text}
      </span>
    </div>
  );
}
