// src/app/(backend)/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/app/lib/authOptions"; // Adjust the path to your auth config

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
