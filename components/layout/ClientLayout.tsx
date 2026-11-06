"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAdmin = pathname.startsWith("/shobhitadmin") || pathname.startsWith("/admin");

  return (
    <>
      {!isHome && !isAdmin && <Header />}
      <main className="flex-1 w-full flex flex-col will-change-auto">
        {children}
      </main>
      {!isHome && !isAdmin && <Footer />}
    </>
  );
}
