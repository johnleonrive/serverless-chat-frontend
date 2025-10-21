type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

interface WebSocketConfig {
  url: string;
  onMessage: (data: unknown) => void;
  onStatusChange: (status: ConnectionStatus) => void;
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
}

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private retryCount = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private maxRetries: number;
  private baseDelay: number;
  private maxDelay: number;

  constructor(config: WebSocketConfig) {
    this.config = config;
    this.maxRetries = config.maxRetries ?? 5;
    this.baseDelay = config.baseDelay ?? 1000;
    this.maxDelay = config.maxDelay ?? 30000;
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.config.onStatusChange('connecting');

    try {
      this.ws = new WebSocket(this.config.url);

      this.ws.onopen = () => {
        this.retryCount = 0;
        this.config.onStatusChange('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.config.onMessage(data);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        this.config.onStatusChange('disconnected');
        this.handleReconnect();
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      this.config.onStatusChange('disconnected');
      this.handleReconnect();
    }
  }

  private handleReconnect(): void {
    if (this.retryCount >= this.maxRetries) {
      console.error('Max reconnection attempts reached');
      return;
    }

    const delay = Math.min(
      this.baseDelay * Math.pow(2, this.retryCount),
      this.maxDelay
    );

    this.retryCount++;

    this.reconnectTimeout = setTimeout(() => {
      console.log(`Reconnecting... (attempt ${this.retryCount})`);
      this.connect();
    }, delay);
  }

  send(data: unknown): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
      return true;
    }
    return false;
  }

  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.retryCount = 0;
    this.config.onStatusChange('disconnected');
  }

  getStatus(): ConnectionStatus {
    if (!this.ws) return 'disconnected';
    if (this.ws.readyState === WebSocket.OPEN) return 'connected';
    if (this.ws.readyState === WebSocket.CONNECTING) return 'connecting';
    return 'disconnected';
  }
}
