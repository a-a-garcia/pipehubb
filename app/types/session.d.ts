// File: next-auth.d.ts
import 'next-auth';

//extending the Session object to include `id`, since it is not included by default.
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
    };
  }
}