import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { parse } from 'url';
import jwt from 'jsonwebtoken';
import { db } from '../lib/db.js';

const server = createServer();
const wss = new WebSocketServer({ server });

// Store active connections by whiteboard ID
const whiteboardConnections = new Map();

// Store user cursors by whiteboard ID
const whiteboardCursors = new Map();

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
  ERROR: 'error'
};

// Utility function to broadcast to all users in a whiteboard
function broadcastToWhiteboard(whiteboardId, message, excludeWs = null) {
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
async function authenticateConnection(token) {
  try {
    if (!token) return null;
    
    // Remove 'Bearer ' prefix if present
    const cleanToken = token.replace('Bearer ', '');
    
    // Verify JWT token
    const decoded = jwt.verify(cleanToken, process.env.AUTH_SECRET);
    
    // Get user from database
    const user = await db.user.findUnique({
      where: { id: decoded.sub },
      select: { id: true, name: true, email: true, role: true }
    });
    
    return user;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

// Check if user can access whiteboard
async function canAccessWhiteboard(userId, whiteboardId) {
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
async function updateParticipantStatus(userId, whiteboardId, isOnline) {
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

// Handle WebSocket connection
wss.on('connection', async (ws, req) => {
  console.log('New WebSocket connection');
  
  let currentUser = null;
  let currentWhiteboardId = null;

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
          whiteboardConnections.get(whiteboardId).push({
            ws,
            userId: currentUser.id,
            user: currentUser,
            role
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

          const cursorsList = Array.from(whiteboardCursors.get(whiteboardId).entries()).map(([userId, cursor]) => ({
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

          const currentCursors = Array.from(whiteboardCursors.get(currentWhiteboardId).entries()).map(([userId, cursor]) => ({
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
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

const PORT = process.env.WS_PORT || 8080;

server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});

export { wss, MESSAGE_TYPES };