import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  userId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Notification schema
export const NotificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  message: z.string(),
  type: z.enum(['info', 'warning', 'error', 'success']),
  read: z.boolean(),
  createdAt: z.string().datetime(),
});

export const CreateNotificationSchema = z.object({
  userId: z.string(),
  title: z.string(),
  message: z.string(),
  type: z.enum(['info', 'warning', 'error', 'success']),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
});

export const ExportRequestSchema = z.object({
  format: z.enum(['csv', 'json']),
  includeNotifications: z.boolean().optional().default(false),
});

// Export types
export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type ExportRequest = z.infer<typeof ExportRequestSchema>;
export type Notification = z.infer<typeof NotificationSchema>;
export type CreateNotification = z.infer<typeof CreateNotificationSchema>;

export type AuthUser = User & {
  permissions: UserPermissions;
};

export type UserPermissions = {
  user: AuthUser;
  canEdit: boolean;
  canDelete: boolean;
};