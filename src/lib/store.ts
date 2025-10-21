import { create } from 'zustand';
import { WebSocketManager } from './ws';
import type { Message } from '@/types/message';

type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

interface ChatState {
  messages: Message[];
  connectionStatus: ConnectionStatus;
  currentRoom: string | null;
  username: string | null;
  ws: WebSocketManager | null;

  // Actions
  connect: (username: string) => void;
  disconnect: () => void;
  sendMessage: (content: string) => void;
  joinRoom: (roomId: string) => void;
  addMessage: (message: Message) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  connectionStatus: 'disconnected',
  currentRoom: null,
  username: null,
  ws: null,

  connect: (username: string) => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;

    if (!wsUrl) {
      console.error('WebSocket URL not configured');
      return;
    }

    const ws = new WebSocketManager({
      url: wsUrl,
      onMessage: (data) => {
        // Handle incoming messages
        // This is a placeholder - adjust based on your backend message format
        const message = data as Message;
        get().addMessage(message);
      },
      onStatusChange: (status) => {
        set({ connectionStatus: status });
      },
    });

    ws.connect();
    set({ ws, username });
  },

  disconnect: () => {
    const { ws } = get();
    ws?.disconnect();
    set({ ws: null, connectionStatus: 'disconnected' });
  },

  sendMessage: (content: string) => {
    const { ws, username, currentRoom } = get();

    if (!ws || !username) return;

    const message: Message = {
      id: crypto.randomUUID(),
      username,
      content,
      timestamp: new Date().toISOString(),
      roomId: currentRoom || 'general',
    };

    const sent = ws.send({
      action: 'sendMessage',
      message,
    });

    if (sent) {
      // Optimistically add message to local state
      get().addMessage(message);
    }
  },

  joinRoom: (roomId: string) => {
    const { ws } = get();

    if (ws) {
      ws.send({
        action: 'joinRoom',
        roomId,
      });
    }

    set({ currentRoom: roomId, messages: [] });
  },

  addMessage: (message: Message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  setConnectionStatus: (status: ConnectionStatus) => {
    set({ connectionStatus: status });
  },
}));
