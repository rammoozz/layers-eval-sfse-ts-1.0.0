import express from 'express';
import { registerUser, loginUser } from '../services/auth';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to recieve registration data' 
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to recieve login data' 
    });
  }
});

export { router as authRoutes };