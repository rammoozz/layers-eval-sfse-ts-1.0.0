import { WebSocketServer, WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { getDatabase } from '../database/init';

const notificationEmitter = new EventEmitter();
const userSockets = new Map<string, WebSocket[]>();

export function setupWebSocket(wss: WebSocketServer) {
  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');
    let userId: string | null = null;
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        handleWebSocketMessage(ws, data, (id: string) => {
          userId = id;
          // Subscribe user to notifications
          if (!userSockets.has(userId)) {
            userSockets.set(userId, []);
          }
          userSockets.get(userId)?.push(ws);
          console.log(`User ${userId} subscribed to notifications`);
        });
      } catch (error) {
        ws.send(JSON.stringify({ error: 'Invalid message format' }));
      }
    });
    
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
      // Remove socket from user's connections
      if (userId) {
        const sockets = userSockets.get(userId);
        if (sockets) {
          const index = sockets.indexOf(ws);
          if (index > -1) {
            sockets.splice(index, 1);
          }
          if (sockets.length === 0) {
            userSockets.delete(userId);
          }
        }
      }
    });
    
    // Send initial connection confirmation
    ws.send(JSON.stringify({ 
      type: 'connection', 
      message: 'Connected to notification service' 
    }));
  });
}

function handleWebSocketMessage(ws: WebSocket, data: any, onSubscribe?: (userId: string) => void) {
  switch (data.type) {
    case 'subscribe':
      // Subscribe to notifications for a user
      if (data.userId && onSubscribe) {
        onSubscribe(data.userId);
        ws.send(JSON.stringify({ 
          type: 'subscribed', 
          userId: data.userId,
          message: 'Successfully subscribed to notifications' 
        }));
      }
      break;
    case 'ping':
      ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
      break;
  }
}

export async function broadcastNotification(userId: string, notification: any) {
  const db = getDatabase();
  
  // Send to specific user's WebSocket connections
  const userConnections = userSockets.get(userId);
  if (userConnections) {
    const notificationData = {
      type: 'notification',
      userId,
      ...notification,
      timestamp: Date.now()
    };
    
    userConnections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(notificationData));
      }
    });
  }
  
  // Save to database
  db.run(
    'INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)',
    [notification.id, userId, notification.title, notification.message, notification.type],
    (err) => {
      if (err) {
        console.error('Failed to save notification:', err);
      }
    }
  );
}

export function clearAllListeners() {
  notificationEmitter.removeAllListeners();
  console.log('All notification listeners cleared');
}