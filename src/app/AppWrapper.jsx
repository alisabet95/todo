"use client"; // Mark this as a client component

import { SessionProvider } from "next-auth/react";

export default function AppWrapper({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
