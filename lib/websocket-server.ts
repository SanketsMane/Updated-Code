// @ts-nocheck
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';
import { prisma as db } from './db';

const server = createServer();
const wss = new WebSocketServer({ server });

// Heartbeat interface
interface ExtendedWebSocket extends WebSocket {
  isAlive: boolean;
  userId?: string;
}

// Store active connections by whiteboard ID
const whiteboardConnections = new Map<string, { ws: ExtendedWebSocket, userId: string, user: any, role: string }[]>();

// Store active chat connections by User ID
const chatConnections = new Map<string, { ws: ExtendedWebSocket, user: any }[]>();

// Store user cursors by whiteboard ID
const whiteboardCursors = new Map<string, Map<string, any>>();

// Message types
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
  ERROR: 'error',
  // Chat types
  JOIN_CHAT: 'join_chat',
  CHAT_MESSAGE: 'chat_message',
  READ_RECEIPT: 'read_receipt',
  // Presence & Typing
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',
  USER_ONLINE_BATCH: 'user_online_batch',
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop'
};

// Utility function to broadcast to all users in a whiteboard
function broadcastToWhiteboard(whiteboardId: string, message: any, excludeWs: ExtendedWebSocket | null = null) {
  const connections = whiteboardConnections.get(whiteboardId) || [];
  connections.forEach(({ ws, userId }) => {
    if (ws !== excludeWs && ws.readyState === ws.OPEN) {
      try {
        ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('Error sending message to user:', userId, error);
      }
    }
  });
}

// Authenticate WebSocket connection
async function authenticateConnection(token: string) {
  try {
    if (!token) return null;

    // Remove 'Bearer ' prefix if present
    const cleanToken = token.replace('Bearer ', '');

    // Verify JWT token using correct secret
    const decoded = jwt.verify(cleanToken, process.env.BETTER_AUTH_SECRET!) as jwt.JwtPayload;

    // Get user from database
    const user = await db.user.findUnique({
      where: { id: decoded.sub as string },
      select: { id: true, name: true, email: true, role: true }
    });

    return user;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

// Check if user can access whiteboard
async function canAccessWhiteboard(userId: string, whiteboardId: string) {
  try {
    const whiteboard = await db.whiteboard.findUnique({
      where: { id: whiteboardId },
      select: {
        createdById: true,
        isPublic: true,
        participants: {
          where: { userId },
          select: { id: true, role: true }
        }
      }
    });

    if (!whiteboard) return { canAccess: false, role: null };

    const isOwner = whiteboard.createdById === userId;
    const participant = whiteboard.participants[0];
    const isParticipant = !!participant;
    const isPublic = whiteboard.isPublic;

    if (isOwner || isParticipant || isPublic) {
      const role = isOwner ? 'Owner' : (participant?.role || 'Viewer');
      return { canAccess: true, role };
    }

    return { canAccess: false, role: null };
  } catch (error) {
    console.error('Error checking whiteboard access:', error);
    return { canAccess: false, role: null };
  }
}

// Update participant online status
async function updateParticipantStatus(userId: string, whiteboardId: string, isOnline: boolean) {
  try {
    await db.whiteboardParticipant.updateMany({
      where: {
        userId,
        whiteboardId
      },
      data: {
        isOnline,
        lastSeen: new Date()
      }
    });
  } catch (error) {
    console.error('Error updating participant status:', error);
  }
}

// Helper: Get all user IDs that have a conversation with this user
async function getPeers(userId: string) {
  try {
    const conversations = await db.conversation.findMany({
      where: {
        OR: [
          { participant1Id: userId },
          { participant2Id: userId }
        ]
      },
      select: {
        participant1Id: true,
        participant2Id: true
      }
    });

    const peerIds = new Set<string>();
    conversations.forEach(c => {
      if (c.participant1Id !== userId) peerIds.add(c.participant1Id);
      if (c.participant2Id !== userId) peerIds.add(c.participant2Id);
    });
    return Array.from(peerIds);
  } catch (error) {
    console.error('Error fetching peers:', error);
    return [];
  }
}

// Broadcast status to specific users
function broadcastStatus(userId: string, isOnline: boolean, peerIds: string[]) {
  const message = JSON.stringify({
    type: isOnline ? MESSAGE_TYPES.USER_ONLINE : MESSAGE_TYPES.USER_OFFLINE,
    payload: { userId, timestamp: new Date().toISOString() }
  });

  peerIds.forEach(peerId => {
    const connections = chatConnections.get(peerId);
    if (connections) {
      connections.forEach(({ ws }) => {
        if (ws.readyState === ws.OPEN) {
          ws.send(message);
        }
      });
    }
  });
}

// Handle WebSocket connection
wss.on('connection', async (socket: WebSocket, req) => {
  const ws = socket as ExtendedWebSocket;
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });

  console.log('New WebSocket connection');

  let currentUser: any = null;
  let currentWhiteboardId: string | null = null;

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());
      const { type, payload } = message;

      switch (type) {
        case MESSAGE_TYPES.JOIN_WHITEBOARD:
          const { whiteboardId, token } = payload;

          // Authenticate user
          currentUser = await authenticateConnection(token);
          if (!currentUser) {
            ws.send(JSON.stringify({
              type: MESSAGE_TYPES.ERROR,
              payload: { message: 'Authentication failed' }
            }));
            return;
          }
          ws.userId = currentUser.id;

          // Check whiteboard access
          const { canAccess, role } = await canAccessWhiteboard(currentUser.id, whiteboardId);
          if (!canAccess) {
            ws.send(JSON.stringify({
              type: MESSAGE_TYPES.ERROR,
              payload: { message: 'Access denied to whiteboard' }
            }));
            return;
          }

          currentWhiteboardId = whiteboardId;

          // Add to connections map
          if (!whiteboardConnections.has(whiteboardId)) {
            whiteboardConnections.set(whiteboardId, []);
          }
          whiteboardConnections.get(whiteboardId)!.push({
            ws,
            userId: currentUser.id,
            user: currentUser,
            role: role as string
          });

          // Initialize cursors map if not exists
          if (!whiteboardCursors.has(whiteboardId)) {
            whiteboardCursors.set(whiteboardId, new Map());
          }

          // Update participant status
          await updateParticipantStatus(currentUser.id, whiteboardId, true);

          // Notify others that user joined
          broadcastToWhiteboard(whiteboardId, {
            type: MESSAGE_TYPES.USER_JOINED,
            payload: {
              user: currentUser,
              role,
              timestamp: new Date().toISOString()
            }
          }, ws);

          // Send current participants and cursors to the new user
          const connections = whiteboardConnections.get(whiteboardId) || [];
          const participants = connections.map(conn => ({
            user: conn.user,
            role: conn.role
          }));

          const cursorsList = Array.from(whiteboardCursors.get(whiteboardId)!.entries()).map(([userId, cursor]) => ({
            userId,
            ...cursor
          }));

          ws.send(JSON.stringify({
            type: MESSAGE_TYPES.SYNC_RESPONSE,
            payload: {
              participants,
              cursors: cursorsList,
              userRole: role
            }
          }));

          break;

        case MESSAGE_TYPES.CURSOR_MOVE:
          if (!currentWhiteboardId || !currentUser) return;

          const { x, y } = payload;

          // Update cursor position
          const cursors = whiteboardCursors.get(currentWhiteboardId);
          if (cursors) {
            cursors.set(currentUser.id, {
              x,
              y,
              user: currentUser,
              timestamp: Date.now()
            });

            // Broadcast cursor position to others
            broadcastToWhiteboard(currentWhiteboardId, {
              type: MESSAGE_TYPES.CURSOR_MOVE,
              payload: {
                userId: currentUser.id,
                x,
                y,
                user: currentUser
              }
            }, ws);
          }

          break;

        case MESSAGE_TYPES.ELEMENT_ADD:
          if (!currentWhiteboardId || !currentUser) return;

          // Broadcast new element to all users
          broadcastToWhiteboard(currentWhiteboardId, {
            type: MESSAGE_TYPES.ELEMENT_ADD,
            payload: {
              ...payload,
              createdBy: currentUser
            }
          });

          break;

        case MESSAGE_TYPES.ELEMENT_UPDATE:
          if (!currentWhiteboardId || !currentUser) return;

          // Broadcast element update
          broadcastToWhiteboard(currentWhiteboardId, {
            type: MESSAGE_TYPES.ELEMENT_UPDATE,
            payload: {
              ...payload,
              updatedBy: currentUser
            }
          });

          break;

        case MESSAGE_TYPES.ELEMENT_DELETE:
          if (!currentWhiteboardId || !currentUser) return;

          // Broadcast element deletion
          broadcastToWhiteboard(currentWhiteboardId, {
            type: MESSAGE_TYPES.ELEMENT_DELETE,
            payload: {
              ...payload,
              deletedBy: currentUser
            }
          });

          break;

        case MESSAGE_TYPES.WHITEBOARD_CLEAR:
          if (!currentWhiteboardId || !currentUser) return;

          // Broadcast whiteboard clear
          broadcastToWhiteboard(currentWhiteboardId, {
            type: MESSAGE_TYPES.WHITEBOARD_CLEAR,
            payload: {
              clearedBy: currentUser,
              timestamp: new Date().toISOString()
            }
          });

          break;

        case MESSAGE_TYPES.SYNC_REQUEST:
          if (!currentWhiteboardId) return;

          // Send current state to requesting user
          const currentConnections = whiteboardConnections.get(currentWhiteboardId) || [];
          const currentParticipants = currentConnections.map(conn => ({
            user: conn.user,
            role: conn.role
          }));

          const currentCursors = Array.from(whiteboardCursors.get(currentWhiteboardId)!.entries()).map(([userId, cursor]) => ({
            userId,
            ...cursor
          }));

          ws.send(JSON.stringify({
            type: MESSAGE_TYPES.SYNC_RESPONSE,
            payload: {
              participants: currentParticipants,
              cursors: currentCursors
            }
          }));

          break;

        case MESSAGE_TYPES.JOIN_CHAT:
          const { token: chatToken } = payload;
          currentUser = await authenticateConnection(chatToken);

          if (!currentUser) {
            ws.send(JSON.stringify({ type: MESSAGE_TYPES.ERROR, payload: { message: 'Auth failed' } }));
            return;
          }
          ws.userId = currentUser.id;

          if (!chatConnections.has(currentUser.id)) {
            chatConnections.set(currentUser.id, []);
          }
          chatConnections.get(currentUser.id)!.push({ ws, user: currentUser });

          // PRESENCE LOGIC
          const peerIds = await getPeers(currentUser.id);

          // 1. Notify peers I am online
          broadcastStatus(currentUser.id, true, peerIds);

          // 2. Tell me which peers are online
          const onlinePeers = peerIds.filter(pid => chatConnections.has(pid) && chatConnections.get(pid)!.length > 0);
          ws.send(JSON.stringify({
            type: MESSAGE_TYPES.USER_ONLINE_BATCH, // New type
            payload: { userIds: onlinePeers }
          }));

          break;

        case MESSAGE_TYPES.CHAT_MESSAGE:
          if (!currentUser) return;
          const { receiverId, message: chatMsg, conversationId, messageId } = payload;

          // Send to receiver if online
          const receiverConns = chatConnections.get(receiverId);
          if (receiverConns) {
            receiverConns.forEach(({ ws: rWs }) => {
              if (rWs.readyState === rWs.OPEN) {
                rWs.send(JSON.stringify({
                  type: MESSAGE_TYPES.CHAT_MESSAGE,
                  payload: {
                    sender: currentUser,
                    content: chatMsg,
                    conversationId,
                    id: messageId,
                    createdAt: new Date()
                  }
                }));
              }
            });
          }
          break;

        case MESSAGE_TYPES.READ_RECEIPT:
          // Logic to notify sender that message was read
          if (!currentUser) return;
          const { senderId: msgSenderId, conversationId: readConvId } = payload;
          const senderConns = chatConnections.get(msgSenderId);
          if (senderConns) {
            senderConns.forEach(({ ws: sWs }) => {
              if (sWs.readyState === sWs.OPEN) {
                sWs.send(JSON.stringify({
                  type: MESSAGE_TYPES.READ_RECEIPT,
                  payload: {
                    readerId: currentUser.id,
                    conversationId: readConvId
                  }
                }));
              }
            });
          }
          break;

        // TYPING INDICATORS
        case MESSAGE_TYPES.TYPING_START:
        case MESSAGE_TYPES.TYPING_STOP:
          if (!currentUser) return;
          const { conversationId: typingConvId, receiverId: typingReceiverId } = payload;

          if (typingReceiverId) {
            const rConns = chatConnections.get(typingReceiverId);
            if (rConns) {
              rConns.forEach(({ ws: rWs }) => {
                if (rWs.readyState === rWs.OPEN) {
                  rWs.send(JSON.stringify({
                    type: type, // Echo back START/STOP
                    payload: {
                      userId: currentUser.id,
                      conversationId: typingConvId
                    }
                  }));
                }
              });
            }
          }
          break;

        default:
          console.log('Unknown message type:', type);
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
      ws.send(JSON.stringify({
        type: MESSAGE_TYPES.ERROR,
        payload: { message: 'Invalid message format' }
      }));
    }
  });

  ws.on('close', async () => {
    console.log('WebSocket connection closed');

    if (currentWhiteboardId && currentUser) {
      // Remove from connections
      const connections = whiteboardConnections.get(currentWhiteboardId);
      if (connections) {
        const index = connections.findIndex(conn => conn.ws === ws);
        if (index !== -1) {
          connections.splice(index, 1);
        }

        // Clean up empty whiteboard connections
        if (connections.length === 0) {
          whiteboardConnections.delete(currentWhiteboardId);
          whiteboardCursors.delete(currentWhiteboardId);
        } else {
          // Remove cursor
          const cursors = whiteboardCursors.get(currentWhiteboardId);
          if (cursors) {
            cursors.delete(currentUser.id);
          }

          // Notify others that user left
          broadcastToWhiteboard(currentWhiteboardId, {
            type: MESSAGE_TYPES.USER_LEFT,
            payload: {
              user: currentUser,
              timestamp: new Date().toISOString()
            }
          });
        }
      }

      // Update participant status
      await updateParticipantStatus(currentUser.id, currentWhiteboardId, false);
    }

    // Remove from chat connections
    if (currentUser) {
      const connections = chatConnections.get(currentUser.id);
      let wasLastConnection = false;

      if (connections) {
        const index = connections.findIndex(conn => conn.ws === ws);
        if (index !== -1) {
          connections.splice(index, 1);
        }
        if (connections.length === 0) {
          chatConnections.delete(currentUser.id);
          wasLastConnection = true;
        }
      }

      // If user is truly offline (no tabs open), broadcast offline status
      if (wasLastConnection) {
        const peerIds = await getPeers(currentUser.id);
        broadcastStatus(currentUser.id, false, peerIds);
      }
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Heartbeat interval
const interval = setInterval(() => {
  wss.clients.forEach((socket) => {
    const ws = socket as ExtendedWebSocket;
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('close', () => {
  clearInterval(interval);
});

const PORT = 8080;

server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});

export { wss, MESSAGE_TYPES };