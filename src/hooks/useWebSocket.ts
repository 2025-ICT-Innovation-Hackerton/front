import { useEffect, useRef, useState, useCallback } from 'react';

type MessageType = 
  | 'CREATE_STORAGE_CALL'
  | 'CREATE_DELIVERY_CALL'
  | 'NEW_CALL'
  | 'ACCEPT_CALL'
  | 'CALL_ACCEPTED'
  | 'CALL_CANCELLED'
  | 'AUTH';

interface WebSocketMessage {
  type: MessageType;
  data?: any;
  callId?: number;
  userId?: string;
  userType?: string;
}

interface UseWebSocketOptions {
  url: string;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  autoReconnect?: boolean;
  reconnectInterval?: number;
}

export function useWebSocket({
  url,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
  autoReconnect = true,
  reconnectInterval = 3000
}: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const shouldReconnectRef = useRef(true);
  
  // 콜백들을 ref로 저장하여 재연결 방지
  const onMessageRef = useRef(onMessage);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);
  const onErrorRef = useRef(onError);

  // 콜백 업데이트
  useEffect(() => {
    onMessageRef.current = onMessage;
    onConnectRef.current = onConnect;
    onDisconnectRef.current = onDisconnect;
    onErrorRef.current = onError;
  }, [onMessage, onConnect, onDisconnect, onError]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('웹소켓 메시지 전송:', message);
      wsRef.current.send(JSON.stringify(message));
      return true;
    } else {
      console.warn('웹소켓이 연결되어 있지 않습니다');
      return false;
    }
  }, []);

  const connect = useCallback(() => {
    // 이미 연결되어 있으면 무시
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('이미 웹소켓이 연결되어 있습니다');
      return;
    }

    try {
      console.log('🔌 웹소켓 연결 시도:', url);
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log('✅ 웹소켓 연결 성공');
        setIsConnected(true);
        wsRef.current = ws;
        onConnectRef.current?.();
        
        // 연결 성공 시 인증 메시지 전송
        const userType = localStorage.getItem('userType');
        const userId = localStorage.getItem('userId') || 'user_' + Date.now();
        localStorage.setItem('userId', userId);
        
        console.log('🔐 인증 메시지 전송 (userId:', userId, ', userType:', userType, ')');
        ws.send(JSON.stringify({
          type: 'AUTH',
          userId,
          userType
        }));
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;
          console.log('📥 웹소켓 메시지 수신:', message);
          setLastMessage(message);
          onMessageRef.current?.(message);
        } catch (error) {
          console.error('❌ 메시지 파싱 에러:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ 웹소켓 에러:', error);
        onErrorRef.current?.(error);
      };

      ws.onclose = () => {
        console.log('👋 웹소켓 연결 종료');
        setIsConnected(false);
        wsRef.current = null;
        onDisconnectRef.current?.();

        // 자동 재연결
        if (autoReconnect && shouldReconnectRef.current) {
          console.log(`⏱️  ${reconnectInterval}ms 후 재연결 시도...`);
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('❌ 웹소켓 연결 실패:', error);
    }
  }, [url, autoReconnect, reconnectInterval]);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  // 최초 1회만 연결
  useEffect(() => {
    shouldReconnectRef.current = true;
    connect();

    return () => {
      shouldReconnectRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
    };
  }, [url]); // url이 변경될 때만 재연결

  return {
    isConnected,
    sendMessage,
    disconnect,
    reconnect: connect,
    lastMessage
  };
}
