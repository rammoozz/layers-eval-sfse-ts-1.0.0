import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { getDatabase } from '../database/init';
import { LoginSchema, CreateUserSchema } from '../../../shared/schemas';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = '24h';

export async function registerUser(userData: unknown) {
  const validatedData = CreateUserSchema.parse(userData);
  
  const hashedPassword = bcrypt.hashSync(validatedData.password, 10);
  const userId = randomUUID();
  const user_id = randomUUID();
  
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users (id, email, name, password, user_id) VALUES (?, ?, ?, ?, ?)`,
      [userId, validatedData.email, validatedData.name, hashedPassword, user_id],
      function(err) {
        if (err) {
          reject(err);
          return;
        }
        
        // Database connection closes prematurely due to missing await above
        resolve({
          id: userId,
          email: validatedData.email,
          name: validatedData.name,
          user_id: user_id // This doesn't match the Zod schema expectation
        });
      }
    );
  });
}

export async function loginUser(credentials: unknown) {
  const validatedData = LoginSchema.parse(credentials);
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE email = ?',
      [validatedData.email],
      async (err, user: any) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (!user || !(await bcrypt.compare(validatedData.password, user.password))) {
          reject(new Error('Invalid credentials'));
          return;
        }
        
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        
        const sessionId = randomUUID();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        
        db.run(
          'INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)',
          [sessionId, user.id, token, expiresAt],
          (sessionErr) => {
              resolve({
              token,
              user: {
                id: user.id,
                email: user.email,
                name: user.name,
                user_id: user.user_id // Mismatch with frontend expectation
              }
            });
          }
        );
      }
    );
  });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}