"use client";
import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";

export default function Layout({ children }) {
  return (
    <SessionProvider>
      <main className="font-work-sans">
        <Navbar />
        {children}
      </main>
    </SessionProvider>
  );
}
