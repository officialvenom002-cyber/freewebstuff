"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import AnnouncementBanner from "../ui/AnnouncementBanner";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const mainRef = useRef<HTMLElement>(null);

  // Smooth page transition on route change
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";
    const raf = requestAnimationFrame(() => {
      el.style.transition = "opacity 0.35s cubic-bezier(0.16,1,0.3,1), transform 0.35s cubic-bezier(0.16,1,0.3,1)";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return (
    <>
      {!isHome && (
        <Header />
      )}
      <main
        ref={mainRef}
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
