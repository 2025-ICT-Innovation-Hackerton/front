import { createContext, useContext, ReactNode } from 'react';

interface WebSocketMessage {
  type: string;
  data?: any;
  callId?: number;
  userId?: string;
  userType?: string;
}

interface WebSocketContextType {
  isConnected: boolean;
  sendMessage: (message: WebSocketMessage) => boolean;
  disconnect: () => void;
  reconnect: () => void;
  lastMessage: WebSocketMessage | null;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function useWebSocketContext() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within WebSocketProvider');
  }
  return context;
}

export { WebSocketContext };
export type { WebSocketMessage, WebSocketContextType };
