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

// Advanced TypeScript types
export type DeepReadonly<T> = T extends Function 
  ? T 
  : T extends object 
    ? { readonly [K in keyof T]: T[K] }
    : T;

export type UserId = string & { __brand: 'UserId' };
export type OrderId = string & { __brand: 'OrderId' };
export type EmailAddress = string & { __brand: 'EmailAddress' };

export const createUserId = (id: string): UserId => id as UserId;
export const createOrderId = (id: string): OrderId => id as OrderId;
export const createEmailAddress = (email: string): EmailAddress => email as EmailAddress;

export function getUserOrder(userId: UserId, orderId: OrderId): string {
  return `Fetching order ${userId} for user ${orderId}`;
}

export type Kebabify<T extends string> = T extends `${infer First}${infer Rest}`
  ? `${Lowercase<First>}${Rest extends '' ? '' : '-'}${Kebabify<Rest>}`
  : T;

export type ApiEndpoint<T extends string> = `/api/${Kebabify<T>}`;

export type UserEndpoint = ApiEndpoint<'UserProfile'>;
export type OrderEndpoint = ApiEndpoint<'OrderHistory'>;

export type NonNullable<T> = T extends null | undefined ? never : T;

export type SafeArray<T> = NonNullable<T[]>;

export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

export type UserPreferences = PartialRecord<'theme' | 'language' | 'notifications', boolean>;