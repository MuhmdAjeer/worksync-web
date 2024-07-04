import { NextAuthOptions, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import { z } from "zod";
import ApiClient from "../apiClient";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        try {
          const data = await ApiClient.login({
            email: credentials?.email!,
            password: credentials?.password!,
          });

          console.log({ data });

          if (!data.access_token) {
            return null;
          }
          // SEND USER DETAILS FROM SERVER
          console.log({ data });
          return {
            email: credentials?.email,
            id: data.id,
            image: "fds",
            username: data.username,
            access_token: data.access_token,
          };
        } catch (error) {
          return null;
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token, user }) {
      session.access_token = token.access_token;
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          username: token.username,
        },
      };
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.access_token = user.access_token || "";
        token.username = user.username;
      }

      return token;
    },
  },
  debug: true,
};
