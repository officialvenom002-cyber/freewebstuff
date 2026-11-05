"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAdmin = pathname.startsWith("/shobhitadmin") || pathname.startsWith("/admin");

  React.useEffect(() => {
    // Warm up the all-categories data in the background browser cache
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      (window as any).requestIdleCallback(() => {
        fetch("/data/all-categories-boxes.json", { cache: "force-cache" }).catch(() => {});
      });
    } else {
      setTimeout(() => {
        fetch("/data/all-categories-boxes.json", { cache: "force-cache" }).catch(() => {});
      }, 1000);
    }
  }, []);

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
