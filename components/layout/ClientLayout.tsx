"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import AnnouncementBanner from "../ui/AnnouncementBanner";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      {!isHome && (
        <Header />
      )}
      <main
        className={
          isHome
            ? "flex-1 w-full"
            : pathname?.startsWith("/categories")
            ? "flex-1 w-full max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-6 py-4"
            : "flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6"
        }
      >
        {children}
      </main>
      {!isHome && <Footer />}
    </>
  );
}
