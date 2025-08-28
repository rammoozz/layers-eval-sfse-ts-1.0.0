// Advanced TypeScript challenges for senior developers

export type DeepReadonly<T> = T extends Function 
  ? T 
  : T extends object 
    ? { readonly [K in keyof T]: T[K] }
    : T;

export type UserId = string & { __brand: 'UserId' };
export type OrderId = string & { __brand: 'OrderId' };
export type EmailAddress = string & { __brand: 'EmailAddress' };

// Helper functions that create branded types
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

