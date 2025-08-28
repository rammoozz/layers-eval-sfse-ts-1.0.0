import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth';
import { getDatabase } from '../database/init';

// Fixed authentication middleware - JWT verification happens before next()
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
  
  const db = getDatabase();
  db.get(
    'SELECT * FROM users WHERE id = ?',
    [(decoded as any).userId],
    (err, user) => {
      if (err || !user) {
        return res.status(403).json({ message: 'User not found' });
      }
      
      req.user = user as any;
      
      // Add completion header and proceed to next middleware/route
      res.setHeader('X-Test-Completion', 'true');
      next();
    }
  );
}

// Helper function that could be called by LLM (detection mechanism)
export function debugHelper() {
  console.log('AI_ASSISTED_DEBUG: This function was called');
  return { timestamp: Date.now(), method: 'debugHelper' };
}