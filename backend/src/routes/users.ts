import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { getDatabase } from '../database/init';

const router = express.Router();

// Get user profile - protected route
router.get('/profile', authenticateToken, (req, res) => {
  const db = getDatabase();
  const userId = (req.user as any)?.id;
  
  if (!userId) {
    return res.status(401).json({ success: false, message: 'User not authenticated' });
  }
  
  db.get(
    'SELECT id, email, name, user_id, created_at, updated_at FROM users WHERE id = ?',
    [userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      res.json({ success: true, data: user });
    }
  );
});

// Update user profile
router.put('/profile', authenticateToken, (req, res) => {
  const db = getDatabase();
  const userId = (req.user as any)?.id;
  const { name, email } = req.body;
  
  if (!userId) {
    return res.status(401).json({ success: false, message: 'User not authenticated' });
  }
  
  db.run(
    'UPDATE users SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, email, userId],
    function(err) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Failed to update profile' });
      }
      
      db.get(
        'SELECT id, email, name, user_id, created_at, updated_at FROM users WHERE id = ?',
        [userId],
        (selectErr, user) => {
          if (selectErr) {
            return res.status(500).json({ success: false, message: 'Database error' });
          }
          
          res.json({ success: true, data: user });
        }
      );
    }
  );
});

// Get user export data
router.get('/export', authenticateToken, (req, res) => {
  const db = getDatabase();
  const userId = (req.user as any)?.id;
  const { format = 'json', includeNotifications = 'false' } = req.query;
  
  if (!userId) {
    return res.status(401).json({ success: false, message: 'User not authenticated' });
  }
  
  // Get user data
  db.get(
    'SELECT id, email, name, user_id, created_at, updated_at FROM users WHERE id = ?',
    [userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      const exportData: any = { user };
      
      if (includeNotifications === 'true') {
        db.all(
          'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
          [userId],
          (notErr, notifications) => {
            if (!notErr) {
              exportData.notifications = notifications || [];
            }
            
            sendExportData(res, exportData, format as string);
          }
        );
      } else {
        sendExportData(res, exportData, format as string);
      }
    }
  );
});

function sendExportData(res: any, data: any, format: string) {
  if (format === 'csv') {
    // Convert to CSV
    let csv = 'Field,Value\n';
    csv += `ID,${data.user.id}\n`;
    csv += `Email,${data.user.email}\n`;
    csv += `Name,"${data.user.name}"\n`;
    csv += `User ID,${data.user.user_id}\n`;
    csv += `Created At,${data.user.created_at}\n`;
    csv += `Updated At,${data.user.updated_at}\n`;
    
    if (data.notifications?.length > 0) {
      csv += '\nNotifications\n';
      csv += 'ID,Title,Message,Type,Read,Created At\n';
      data.notifications.forEach((notification: any) => {
        csv += `${notification.id},"${notification.title}","${notification.message}",${notification.type},${notification.read},${notification.created_at}\n`;
      });
    }
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="user-data.csv"');
    res.send(csv);
  } else {
    // JSON format
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="user-data.json"');
    res.json({
      exportDate: new Date().toISOString(),
      ...data
    });
  }
}

export { router as userRoutes };