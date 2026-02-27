import 'next-auth';

declare module 'next-auth' {

  interface User {
    phone?: string
    location?: string
    bloodGroup?: string
  }
}

