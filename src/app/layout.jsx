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
      <body className={` antialiased`}>
        <AppWrapper>
          <Navbar />
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}
