import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { getDatabase } from '../database/init';
import { broadcastNotification } from '../services/websocket';
import { randomUUID } from 'crypto';

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  const db = getDatabase();
  const userId = (req.user as any)?.id;
  
  if (!userId) {
    return res.status(401).json({ success: false, message: 'User not authenticated' });
  }
  
  // Query to get notifications in chronological order (oldest first)
  db.all(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (err, notifications) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      
      res.json({ success: true, data: notifications });
    }
  );
});

// Create notification (for testing)
router.post('/', authenticateToken, async (req, res) => {
  const { title, message, type } = req.body;
  const userId = (req.user as any)?.id;
  
  if (!userId) {
    return res.status(401).json({ success: false, message: 'User not authenticated' });
  }
  
  const notificationId = randomUUID();
  const notification = {
    id: notificationId,
    title,
    message,
    type: type || 'info'
  };
  
  try {
    await broadcastNotification(userId, notification);
    
    res.status(201).json({ 
      success: true, 
      data: { ...notification, userId } 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create notification' 
    });
  }
});

// Mark notification as read
router.put('/:id/read', authenticateToken, (req, res) => {
  const db = getDatabase();
  const userId = (req.user as any)?.id;
  const notificationId = req.params.id;
  
  if (!userId) {
    return res.status(401).json({ success: false, message: 'User not authenticated' });
  }
  
  db.run(
    'UPDATE notifications SET read = TRUE WHERE id = ? AND user_id = ?',
    [notificationId, userId],
    function(err) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ success: false, message: 'Notification not found' });
      }
      
      res.json({ success: true, message: 'Notification marked as read' });
    }
  );
});

export { router as notificationRoutes };