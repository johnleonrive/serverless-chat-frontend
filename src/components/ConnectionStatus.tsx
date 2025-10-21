'use client';

import { useChatStore } from '@/lib/store';

export default function ConnectionStatus() {
  const { connectionStatus } = useChatStore();

  const statusConfig = {
    connected: {
      text: 'Connected',
      color: 'bg-green-500',
      textColor: 'text-green-700',
    },
    connecting: {
      text: 'Connecting...',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-700',
    },
    disconnected: {
      text: 'Disconnected',
      color: 'bg-red-500',
      textColor: 'text-red-700',
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
