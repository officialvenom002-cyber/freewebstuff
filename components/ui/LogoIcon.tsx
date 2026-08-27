"use client";

import React from "react";
import Logo from "./Logo";

interface LogoIconProps {
  className?: string;
  size?: number;
}

export default function LogoIcon({ className = "", size = 36 }: LogoIconProps) {
  return (
    <Logo className={`shrink-0 ${className}`} style={{ width: size, height: size }} />
  );
}
