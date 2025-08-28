import { WebSocketServer, WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { getDatabase } from '../database/init';

const notificationEmitter = new EventEmitter();

export function setupWebSocket(wss: WebSocketServer) {
  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');
    
    notificationEmitter.on('notification', (data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      }
    });
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        handleWebSocketMessage(ws, data);
      } catch (error) {
        ws.send(JSON.stringify({ error: 'Invalid message format' }));
      }
    });
    
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
    
    // Send initial connection confirmation
    ws.send(JSON.stringify({ 
      type: 'connection', 
      message: 'Connected to notification service' 
    }));
  });
}

function handleWebSocketMessage(ws: WebSocket, data: any) {
  switch (data.type) {
    case 'subscribe':
      // Subscribe to notifications for a user
        break;
    case 'ping':
      ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
      break;
  }
}

export async function broadcastNotification(userId: string, notification: any) {
  const db = getDatabase();
  
  notificationEmitter.emit('notification', {
    userId,
    ...notification,
    timestamp: Date.now()
  });
  
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