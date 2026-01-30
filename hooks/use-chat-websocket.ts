import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/lib/auth-client';

const MESSAGE_TYPES = {
    JOIN_CHAT: 'join_chat',
    CHAT_MESSAGE: 'chat_message',
    READ_RECEIPT: 'read_receipt',
    ERROR: 'error',
    // Presence & Typing
    USER_ONLINE: 'user_online',
    USER_OFFLINE: 'user_offline',
    USER_ONLINE_BATCH: 'user_online_batch',
    TYPING_START: 'typing_start',
    TYPING_STOP: 'typing_stop'
};

export const useChatWebSocket = () => {
    const { data: session } = useAuth();
    const [isConnected, setIsConnected] = useState(false);

    // State for Presence and Typing
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
    const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({}); // { convId: [userIds] }

    const wsRef = useRef<WebSocket | null>(null);

    // Event listeners
    const onMessageReceivedRef = useRef<((message: any) => void) | null>(null);
    const onReadReceiptReceivedRef = useRef<((receipt: any) => void) | null>(null);

    const connect = useCallback(() => {
        /**
         * Establishes WebSocket connection with dynamic host fallback for production.
         * Author: Sanket
         */
        if (!session?.user) return;

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = process.env.NEXT_PUBLIC_WS_HOST || `${window.location.hostname}:8080`;
        const wsUrl = `${protocol}//${host}`;

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('Chat WebSocket connected');
            setIsConnected(true);

            // Join chat
            // @ts-ignore
            const token = session?.token || 'anonymous';
            ws.send(JSON.stringify({
                type: MESSAGE_TYPES.JOIN_CHAT,
                payload: { token }
            }));
        };

        ws.onmessage = (event) => {
            try {
                const { type, payload } = JSON.parse(event.data);
                switch (type) {
                    case MESSAGE_TYPES.CHAT_MESSAGE:
                        if (onMessageReceivedRef.current) {
                            onMessageReceivedRef.current(payload);
                        }
                        break;
                    case MESSAGE_TYPES.READ_RECEIPT:
                        if (onReadReceiptReceivedRef.current) {
                            onReadReceiptReceivedRef.current(payload);
                        }
                        break;

                    // Presence
                    case MESSAGE_TYPES.USER_ONLINE:
                        setOnlineUsers(prev => {
                            const next = new Set(prev);
                            next.add(payload.userId);
                            return next;
                        });
                        break;
                    case MESSAGE_TYPES.USER_OFFLINE:
                        setOnlineUsers(prev => {
                            const next = new Set(prev);
                            next.delete(payload.userId);
                            return next;
                        });
                        break;
                    case MESSAGE_TYPES.USER_ONLINE_BATCH:
                        setOnlineUsers(new Set(payload.userIds));
                        break;

                    // Typing
                    case MESSAGE_TYPES.TYPING_START:
                        setTypingUsers(prev => {
                            const { conversationId, userId } = payload;
                            const current = prev[conversationId] || [];
                            if (!current.includes(userId)) {
                                return { ...prev, [conversationId]: [...current, userId] };
                            }
                            return prev;
                        });
                        break;
                    case MESSAGE_TYPES.TYPING_STOP:
                        setTypingUsers(prev => {
                            const { conversationId, userId } = payload;
                            const current = prev[conversationId] || [];
                            return { ...prev, [conversationId]: current.filter(id => id !== userId) };
                        });
                        break;
                }
            } catch (e) {
                console.error("WS Parse Error", e);
            }
        };

        ws.onclose = () => {
            setIsConnected(false);
            console.log('Chat WebSocket disconnected');
            // Auto reconnect
            setTimeout(connect, 3000);
        };

        wsRef.current = ws;
    }, [session]);

    useEffect(() => {
        if (session?.user) {
            connect();
        }
        return () => {
            wsRef.current?.close();
        }
    }, [session, connect]);

    const sendChatMessage = (receiverId: string, message: string, conversationId: string, messageId?: string) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: MESSAGE_TYPES.CHAT_MESSAGE,
                payload: { receiverId, message, conversationId, messageId }
            }));
        }
    };

    const sendReadReceipt = (senderId: string, conversationId: string) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: MESSAGE_TYPES.READ_RECEIPT,
                payload: { senderId, conversationId }
            }));
        }
    };

    const sendTypingStart = (receiverId: string, conversationId: string) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: MESSAGE_TYPES.TYPING_START,
                payload: { receiverId, conversationId }
            }));
        }
    };

    const sendTypingStop = (receiverId: string, conversationId: string) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: MESSAGE_TYPES.TYPING_STOP,
                payload: { receiverId, conversationId }
            }));
        }
    };

    return {
        isConnected,
        onlineUsers, // Set<string>
        typingUsers, // { [convId]: string[] }
        sendChatMessage,
        sendReadReceipt,
        sendTypingStart,
        sendTypingStop,
        setOnMessageReceived: (cb: (msg: any) => void) => { onMessageReceivedRef.current = cb },
        setOnReadReceiptReceived: (cb: (receipt: any) => void) => { onReadReceiptReceivedRef.current = cb }
    };
};
