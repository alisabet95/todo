"use client"; // Mark this as a client component
import { Provider } from "react-redux";
import store from "./store/store";

import { SessionProvider } from "next-auth/react";

export default function AppWrapper({ children }) {
  return (
    <SessionProvider>
      <Provider store={store}>{children}</Provider>
    </SessionProvider>
  );
}
