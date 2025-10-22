import { create } from 'zustand';
import { WebSocketManager } from './ws';
import type { Message } from '@/types/message';

type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

interface ChatState {
  messages: Message[];
  connectionStatus: ConnectionStatus;
  currentChatId: string | null;
  recipientId: string | null;
  username: string | null;
  ws: WebSocketManager | null;

  // Actions
  connect: (username: string) => void;
  disconnect: () => void;
  sendMessage: (content: string) => void;
  selectChat: (recipientUserId: string) => void;
  addMessage: (message: Message) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  connectionStatus: 'disconnected',
  currentChatId: null,
  recipientId: null,
  username: null,
  ws: null,

  connect: (username: string) => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;

    if (!wsUrl) {
      console.error('WebSocket URL not configured');
      return;
    }

    // Add userId query parameter to WebSocket URL
    const urlWithUserId = `${wsUrl}?userId=${encodeURIComponent(username)}`;

    const ws = new WebSocketManager({
      url: urlWithUserId,
      onMessage: (data: unknown) => {
        // Handle incoming messages from backend
        const parsedData = data as {
          type?: string;
          messageId?: string;
          senderId?: string;
          text?: string;
          timestamp?: number;
          chatId?: string;
        };

        if (
          parsedData.type === 'message' &&
          parsedData.messageId &&
          parsedData.senderId &&
          parsedData.timestamp
        ) {
          const message: Message = {
            id: parsedData.messageId,
            username: parsedData.senderId,
            content: parsedData.text || '',
            timestamp: new Date(parsedData.timestamp * 1000).toISOString(),
            chatId: parsedData.chatId,
          };
          get().addMessage(message);
        }
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
    const { ws, username, currentChatId, recipientId } = get();

    if (!ws || !username || !recipientId || !currentChatId) return;

    // Send message in backend's expected format
    const sent = ws.send({
      action: 'sendmessage',
      chatId: currentChatId,
      text: content,
    });

    if (sent) {
      // Optimistically add message to local state
      const message: Message = {
        id: crypto.randomUUID(),
        username,
        content,
        timestamp: new Date().toISOString(),
        chatId: currentChatId,
      };
      get().addMessage(message);
    }
  },

  selectChat: (recipientUserId: string) => {
    const { username } = get();

    if (!username) return;

    // Create chatId in format: "user1#user2" (sorted alphabetically)
    const users = [username, recipientUserId].sort();
    const chatId = `${users[0]}#${users[1]}`;

    set({
      currentChatId: chatId,
      recipientId: recipientUserId,
      messages: [],
    });
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
