// src/app/lib/authOptions.ts
import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/app/lib/prisma/client";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";

// Define ExtendedUser to match Prisma schema and NextAuth expectations
interface ExtendedUser extends User {
  id: string; // NextAuth expects string, convert from Prisma's Int
  username: string; // Required for CredentialsProvider
  email: string; // Required by NextAuth's User type
  name?: string; // Optional in your schema
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<ExtendedUser | null> {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
          select: {
            id: true,
            username: true,
            email: true,
            password: true,
            name: true, // Now recognized after regeneration
          },
        });

        if (!user || !user.password) {
          throw new Error("User not found or invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id.toString(),
          username: user.username,
          email: user.email ?? "", // Fallback for null
          name: user.name ?? undefined, // Optional
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email as string },
        });

        if (!existingUser) {
          // Generate a unique username
          const defaultUsername = `google_${user.email?.split("@")[0]}`;

          // Save user in database
          await prisma.user.create({
            data: {
              email: user.email as string,
              name: user.name || "Google User",
              username: defaultUsername,
              image: user.image,
            },
          });
        }
      }
      return true;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (token) {
        session.user = {
          id: token.id as string,
          username: token.username as string,
          email: token.email as string,
          name: token.name as string | undefined,
        };
      }
      return session;
    },
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: User | AdapterUser; // Handle both User and AdapterUser
      account?: any; // Optional, included for completeness
      profile?: any; // Optional
      trigger?: "signIn" | "signUp" | "update"; // Optional
      isNewUser?: boolean; // Optional
      session?: any; // Optional
    }): Promise<JWT> {
      if (user) {
        // Type assertion to handle ExtendedUser or fallback
        const extendedUser = user as ExtendedUser;
        token.id = user.id;
        token.username = extendedUser.username || "unknown"; // Fallback if username isn’t present
        token.email = user.email; // Required
        token.name = user.name; // Optional
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/", // Your custom sign-in page
  },
};
