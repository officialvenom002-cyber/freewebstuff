"use client";

import React from "react";
import SearchToggle from "./SearchToggle";

export default function HeroSearchTrigger() {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("open-search-modal"));
  };

  return (
    <SearchToggle
      onClick={handleClick}
      variant="hero"
      placeholder="Search 15,000+ resources..."
      className="w-full max-w-2xl"
    />
  );
}
