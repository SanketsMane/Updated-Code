import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/lib/auth-client';

const MESSAGE_TYPES = {
  JOIN_WHITEBOARD: 'join_whiteboard',
  LEAVE_WHITEBOARD: 'leave_whiteboard',
  CURSOR_MOVE: 'cursor_move',
  ELEMENT_ADD: 'element_add',
  ELEMENT_UPDATE: 'element_update',
  ELEMENT_DELETE: 'element_delete',
  ELEMENT_BULK_UPDATE: 'element_bulk_update',
  PARTICIPANT_UPDATE: 'participant_update',
  WHITEBOARD_CLEAR: 'whiteboard_clear',
  SYNC_REQUEST: 'sync_request',
  SYNC_RESPONSE: 'sync_response',
  USER_JOINED: 'user_joined',
  USER_LEFT: 'user_left',
  ERROR: 'error'
};

interface WhiteboardUser {
  id: string;
  name: string;
  email: string;
}

interface WhiteboardParticipant {
  user: WhiteboardUser;
  role: 'Owner' | 'Editor' | 'Viewer';
}

interface WhiteboardCursor {
  userId: string;
  x: number;
  y: number;
  user: WhiteboardUser;
  timestamp: number;
}

interface WhiteboardElement {
  id: string;
  type: string;
  data: any;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation: number;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth: number;
  opacity: number;
  zIndex: number;
  createdBy?: WhiteboardUser;
}

interface UseWhiteboardWebSocketProps {
  whiteboardId: string;
  enabled?: boolean;
}

interface UseWhiteboardWebSocketReturn {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  
  // Participants
  participants: WhiteboardParticipant[];
  cursors: WhiteboardCursor[];
  userRole: string | null;
  
  // Actions
  sendCursorMove: (x: number, y: number) => void;
  sendElementAdd: (element: Partial<WhiteboardElement>) => void;
  sendElementUpdate: (elementId: string, updates: Partial<WhiteboardElement>) => void;
  sendElementDelete: (elementId: string) => void;
  sendWhiteboardClear: () => void;
  requestSync: () => void;
  
  // Event handlers (set these to handle real-time updates)
  onElementAdd?: (element: WhiteboardElement) => void;
  onElementUpdate?: (elementId: string, updates: Partial<WhiteboardElement>) => void;
  onElementDelete?: (elementId: string) => void;
  onWhiteboardClear?: () => void;
  onUserJoined?: (user: WhiteboardUser) => void;
  onUserLeft?: (user: WhiteboardUser) => void;
}

export const useWhiteboardWebSocket = ({ 
  whiteboardId, 
  enabled = true 
}: UseWhiteboardWebSocketProps): UseWhiteboardWebSocketReturn => {
  const { data: session } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [participants, setParticipants] = useState<WhiteboardParticipant[]>([]);
  const [cursors, setCursors] = useState<WhiteboardCursor[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const eventHandlersRef = useRef<{
    onElementAdd?: (element: WhiteboardElement) => void;
    onElementUpdate?: (elementId: string, updates: Partial<WhiteboardElement>) => void;
    onElementDelete?: (elementId: string) => void;
    onWhiteboardClear?: () => void;
    onUserJoined?: (user: WhiteboardUser) => void;
    onUserLeft?: (user: WhiteboardUser) => void;
  }>({});

  // Get WebSocket URL from environment
  const getWebSocketUrl = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.NEXT_PUBLIC_WS_HOST || 'localhost:8080';
    return `${protocol}//${host}`;
  };

  // Send message to WebSocket
  const sendMessage = useCallback((type: string, payload: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, payload }));
    }
  }, []);

  // Action functions
  const sendCursorMove = useCallback((x: number, y: number) => {
    sendMessage(MESSAGE_TYPES.CURSOR_MOVE, { x, y });
  }, [sendMessage]);

  const sendElementAdd = useCallback((element: Partial<WhiteboardElement>) => {
    sendMessage(MESSAGE_TYPES.ELEMENT_ADD, element);
  }, [sendMessage]);

  const sendElementUpdate = useCallback((elementId: string, updates: Partial<WhiteboardElement>) => {
    sendMessage(MESSAGE_TYPES.ELEMENT_UPDATE, { elementId, updates });
  }, [sendMessage]);

  const sendElementDelete = useCallback((elementId: string) => {
    sendMessage(MESSAGE_TYPES.ELEMENT_DELETE, { elementId });
  }, [sendMessage]);

  const sendWhiteboardClear = useCallback(() => {
    sendMessage(MESSAGE_TYPES.WHITEBOARD_CLEAR, {});
  }, [sendMessage]);

  const requestSync = useCallback(() => {
    sendMessage(MESSAGE_TYPES.SYNC_REQUEST, {});
  }, [sendMessage]);

  // Connect to WebSocket
  const connect = useCallback(async () => {
    if (!session?.user || !whiteboardId || !enabled) return;
    
    setIsConnecting(true);
    setError(null);

    try {
      const wsUrl = getWebSocketUrl();
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setIsConnecting(false);
        
        // Join whiteboard
        const token = (session as any)?.token || 'anonymous';
        sendMessage(MESSAGE_TYPES.JOIN_WHITEBOARD, {
          whiteboardId,
          token
        });
      };

      ws.onmessage = (event) => {
        try {
          const { type, payload } = JSON.parse(event.data);
          
          switch (type) {
            case MESSAGE_TYPES.SYNC_RESPONSE:
              setParticipants(payload.participants || []);
              setCursors(payload.cursors || []);
              if (payload.userRole) {
                setUserRole(payload.userRole);
              }
              break;

            case MESSAGE_TYPES.USER_JOINED:
              setParticipants(prev => {
                const exists = prev.find(p => p.user.id === payload.user.id);
                if (exists) return prev;
                return [...prev, { user: payload.user, role: payload.role }];
              });
              eventHandlersRef.current.onUserJoined?.(payload.user);
              break;

            case MESSAGE_TYPES.USER_LEFT:
              setParticipants(prev => 
                prev.filter(p => p.user.id !== payload.user.id)
              );
              setCursors(prev => 
                prev.filter(c => c.userId !== payload.user.id)
              );
              eventHandlersRef.current.onUserLeft?.(payload.user);
              break;

            case MESSAGE_TYPES.CURSOR_MOVE:
              setCursors(prev => {
                const filtered = prev.filter(c => c.userId !== payload.userId);
                return [...filtered, {
                  userId: payload.userId,
                  x: payload.x,
                  y: payload.y,
                  user: payload.user,
                  timestamp: Date.now()
                }];
              });
              break;

            case MESSAGE_TYPES.ELEMENT_ADD:
              eventHandlersRef.current.onElementAdd?.(payload);
              break;

            case MESSAGE_TYPES.ELEMENT_UPDATE:
              eventHandlersRef.current.onElementUpdate?.(payload.elementId, payload.updates);
              break;

            case MESSAGE_TYPES.ELEMENT_DELETE:
              eventHandlersRef.current.onElementDelete?.(payload.elementId);
              break;

            case MESSAGE_TYPES.WHITEBOARD_CLEAR:
              eventHandlersRef.current.onWhiteboardClear?.();
              break;

            case MESSAGE_TYPES.ERROR:
              console.error('WebSocket error:', payload.message);
              setError(payload.message);
              break;

            default:
              console.log('Unknown WebSocket message type:', type);
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setIsConnecting(false);
        wsRef.current = null;
        
        // Auto-reconnect after 3 seconds
        setTimeout(() => {
          if (enabled) {
            connect();
          }
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('WebSocket connection failed');
        setIsConnecting(false);
      };

      wsRef.current = ws;
      
    } catch (err) {
      console.error('Error connecting to WebSocket:', err);
      setError('Failed to connect to WebSocket');
      setIsConnecting(false);
    }
  }, [session, whiteboardId, enabled, sendMessage]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
    setParticipants([]);
    setCursors([]);
    setUserRole(null);
  }, []);

  // Connect/disconnect based on dependencies
  useEffect(() => {
    if (enabled && session?.user && whiteboardId) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, session?.user, whiteboardId, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // Clean up old cursors (remove cursors older than 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setCursors(prev => 
        prev.filter(cursor => now - cursor.timestamp < 5000)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    // Connection state
    isConnected,
    isConnecting,
    error,
    
    // Participants
    participants,
    cursors,
    userRole,
    
    // Actions
    sendCursorMove,
    sendElementAdd,
    sendElementUpdate,
    sendElementDelete,
    sendWhiteboardClear,
    requestSync,
    
    // Event handler setters
    setEventHandlers: (handlers: typeof eventHandlersRef.current) => {
      eventHandlersRef.current = { ...eventHandlersRef.current, ...handlers };
    }
  } as UseWhiteboardWebSocketReturn & {
    setEventHandlers: (handlers: any) => void;
  };
};