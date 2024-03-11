import type { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: {
      id: string;
      email?: string;
      firstName?: string;
      lastName?: string;
      birthday?: DateTime;
    };
  }
}
