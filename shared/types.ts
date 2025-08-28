export type DatabaseRecord<T extends Record<K, V>, K extends keyof T, V = unknown> = {
  id: string;
  data: T;
  metadata: Record<K, V>;
};

// Missing export that frontend imports
export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
}

// Discriminated union that can result in never type
export type UserAction = 
  | { type: 'CREATE'; payload: { name: string } }
  | { type: 'UPDATE'; payload: { id: string; name: string } }
  | { type: 'DELETE'; payload: { id: string } };

export function handleUserAction(action: UserAction): string {
  switch (action.type) {
    case 'CREATE':
      return `Creating user: ${action.payload.name}`;
    case 'UPDATE':
      return `Updating user ${action.payload.id}: ${action.payload.name}`;
    case 'DELETE':
      return `Deleting user: ${action.payload.id}`;
  }
}

export const defaultUsеrId = "anonymous";