"use client";

import React, { useState, useEffect } from "react";

interface LiveUserPresenceProps {
  className?: string;
  compact?: boolean;
}

export default function LiveUserPresence({ className = "", compact = false }: LiveUserPresenceProps) {
  const [onlineCount, setOnlineCount] = useState<number>(14);

  useEffect(() => {
    let isMounted = true;

    const pingLiveUser = async () => {
      try {
        const res = await fetch("/api/live-users", { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.onlineUsers === "number" && isMounted) {
            setOnlineCount(data.onlineUsers);
          }
        }
      } catch {
        // Safe fallback
      }
    };

    pingLiveUser();
    const interval = setInterval(pingLiveUser, 30000); // 30s heartbeat

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400 font-mono text-[11.5px] select-none transition-all duration-200 hover:border-emerald-500/40 hover:bg-emerald-500/[0.12] ${className}`}
      title={`${onlineCount} active visitors on FreeWebStuff right now`}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
      </span>
      <span className="font-semibold tabular-nums">{onlineCount}</span>
      {!compact && (
        <span className="font-sans text-[11px] text-emerald-300/80">live</span>
      )}
    </div>
  );
}
