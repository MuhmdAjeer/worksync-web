import "next-auth";
import type { User } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User;
    access_token?: string;
  }

  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    access_token: string | null;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends User {
    access_token?: string;
    accessTokenExpires: number;
  }
}
