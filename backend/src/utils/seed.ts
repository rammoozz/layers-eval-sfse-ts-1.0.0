import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { getDatabase } from '../database/init';

export async function seedDatabase() {
  const db = getDatabase();
  
  // Create demo user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const userId = randomUUID();
  const user_id = randomUUID();
  
  return new Promise<void>((resolve, reject) => {
    // Insert demo user
    db.run(
      `INSERT OR REPLACE INTO users (id, email, name, password, user_id) VALUES (?, ?, ?, ?, ?)`,
      [userId, 'admin@test.com', 'Demo User', hashedPassword, user_id],
      function(err) {
        if (err) {
          console.error('Failed to create demo user:', err);
          reject(err);
          return;
        }
        
        // Insert some demo notifications
        const notifications = [
          {
            id: randomUUID(),
            user_id: userId,
            title: 'Welcome!',
            message: 'Welcome to Layers. Your account has been set up successfully.',
            type: 'info'
          },
          {
            id: randomUUID(),
            user_id: userId,
            title: 'System Update',
            message: 'The system will be updated tonight at midnight.',
            type: 'warning'
          },
          {
            id: randomUUID(),
            user_id: userId,
            title: 'Export Ready',
            message: 'Your data export request has been completed.',
            type: 'success'
          }
        ];
        
        let completed = 0;
        notifications.forEach(notification => {
          db.run(
            `INSERT OR REPLACE INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)`,
            [notification.id, notification.user_id, notification.title, notification.message, notification.type],
            (notifErr) => {
              if (notifErr) {
                console.error('Failed to create notification:', notifErr);
              }
              completed++;
              if (completed === notifications.length) {
                console.log('Demo data seeded successfully');
                resolve();
              }
            }
          );
        });
      }
    );
  });
}