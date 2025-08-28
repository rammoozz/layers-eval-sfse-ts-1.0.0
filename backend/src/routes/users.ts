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

// Get user export data - placeholder for incomplete feature
router.get('/export', authenticateToken, (req, res) => {
  // TODO: Implement data export functionality
  // This feature is mentioned in requirements but not implemented
  res.status(501).json({ 
    success: false, 
    message: 'Export functionality not yet implemented' 
  });
});

export { router as userRoutes };