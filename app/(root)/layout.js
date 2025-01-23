"use client";
import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";

export default function Layout({ children }) {
  return (
    <SessionProvider>
      <main className="font-work-sans">
        <Navbar />
        {children}
        <Toaster />
      </main>
    </SessionProvider>
  );
}
