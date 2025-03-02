// src/app/layout.jsx (Server-Side)
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppWrapper from "./AppWrapper"; // New client-side wrapper
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import Navbar from "./navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Project",
  description: "this is a to-do app. it belongs to Ali Sabet",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppWrapper>
          <Navbar />
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}
