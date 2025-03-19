// src/app/layout.jsx (Server-Side)
//import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import AppWrapper from "./AppWrapper"; // New client-side wrapper

import Navbar from "./navbar";

export const metadata = {
  title: "Project",
  description: "this is a to-do app. it belongs to Ali Sabet",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`flex flex-col min-h-screen antialiased`}>
        <AppWrapper>
          <Navbar />
          {children}
        </AppWrapper>
        <footer className="mt-auto text-left text-xs text-black p-4">
          © 2023 Ali Sabet <address>Rasht,Iran</address>
        </footer>
      </body>
    </html>
  );
}
