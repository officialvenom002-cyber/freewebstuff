"use client";

import React from "react";

export default function Logo({
  className = "w-8 h-8",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={style}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_12px_rgba(56,189,248,0.35)] transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_16px_rgba(56,189,248,0.55)]"
      >
        <defs>
          {/* Central Planet Gradient - Matte Obsidian Sphere matching Hero Visual */}
          <radialGradient id="heroThemePlanetGrad" cx="35%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#2a374a" />
            <stop offset="25%" stopColor="#1e2838" />
            <stop offset="55%" stopColor="#131a26" />
            <stop offset="85%" stopColor="#0b0f17" />
            <stop offset="100%" stopColor="#070a10" />
          </radialGradient>

          {/* Primary Orbit Ring Gradient (14deg Cyan) */}
          <linearGradient id="heroThemeOrbitCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.4" />
          </linearGradient>

          {/* Secondary Orbit Ring Gradient (-24deg Slate) */}
          <linearGradient id="heroThemeOrbitSlate" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="50%" stopColor="#cbd5e1" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
          </linearGradient>

          {/* Planet Inner Highlight Specular Rim */}
          <radialGradient id="heroThemeGlint" cx="35%" cy="28%" r="45%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>

          {/* Front Clipping Mask for 3D Overlapping */}
          <clipPath id="heroThemeFrontClip">
            <rect x="0" y="49" width="100" height="51" />
          </clipPath>
        </defs>

        {/* Ambient Soft Aura Glow */}
        <circle cx="50" cy="50" r="36" fill="#38bdf8" opacity="0.1" filter="blur(6px)" />

        {/* Floor Glow Reflection */}
        <ellipse cx="50" cy="78" rx="28" ry="5" fill="#38bdf8" opacity="0.2" filter="blur(4px)" />

        {/* Back Half: Secondary Slate Orbit Ring (Rotated -24deg) */}
        <ellipse
          cx="50"
          cy="50"
          rx="44"
          ry="15"
          transform="rotate(-24 50 50)"
          stroke="url(#heroThemeOrbitSlate)"
          strokeWidth="2.8"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Back Half: Primary Cyan Orbit Ring (Rotated 14deg) */}
        <ellipse
          cx="50"
          cy="50"
          rx="48"
          ry="17"
          transform="rotate(14 50 50)"
          stroke="url(#heroThemeOrbitCyan)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Planet Center Sphere (Matte Obsidian) */}
        <circle cx="50" cy="50" r="24" fill="url(#heroThemePlanetGrad)" />
        
        {/* Planet Outer Rim & Specular Ring */}
        <circle
          cx="50"
          cy="50"
          r="24"
          stroke="rgba(255, 255, 255, 0.16)"
          strokeWidth="1.2"
        />

        {/* Planet Inner Specular Highlight */}
        <circle cx="50" cy="50" r="24" fill="url(#heroThemeGlint)" />

        {/* Front Half: Secondary Orbit Ring (-24deg overlapping in front) */}
        <g clipPath="url(#heroThemeFrontClip)">
          <ellipse
            cx="50"
            cy="50"
            rx="44"
            ry="15"
            transform="rotate(-24 50 50)"
            stroke="url(#heroThemeOrbitSlate)"
            strokeWidth="3.0"
            strokeLinecap="round"
            opacity="0.9"
          />
        </g>

        {/* Front Half: Primary Cyan Orbit Ring (14deg overlapping in front) */}
        <g clipPath="url(#heroThemeFrontClip)">
          <ellipse
            cx="50"
            cy="50"
            rx="48"
            ry="17"
            transform="rotate(14 50 50)"
            stroke="url(#heroThemeOrbitCyan)"
            strokeWidth="3.4"
            strokeLinecap="round"
          />
        </g>

        {/* Orbital Particle Dot 1 (Cyan - Top Right) */}
        <circle cx="85" cy="38" r="3.2" fill="#38bdf8" />
        <circle cx="85" cy="38" r="6.0" fill="#38bdf8" opacity="0.35" />

        {/* Orbital Particle Dot 2 (Slate/Ice - Bottom Left) */}
        <circle cx="16" cy="62" r="2.8" fill="#cbd5e1" />
        <circle cx="16" cy="62" r="5.5" fill="#cbd5e1" opacity="0.35" />
      </svg>
    </div>
  );
}
