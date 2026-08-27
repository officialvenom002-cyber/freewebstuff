"use client";

import React, { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Check } from "lucide-react";

interface HelpfulRatingProps {
  resourceId: string;
  initialHelpful: number;
  initialUnhelpful: number;
}

export default function HelpfulRating({ resourceId, initialHelpful, initialUnhelpful }: HelpfulRatingProps) {
  const [helpful, setHelpful] = useState(initialHelpful);
  const [unhelpful, setUnhelpful] = useState(initialUnhelpful);
  const [userVote, setUserVote] = useState<"helpful" | "unhelpful" | null>(null);

  useEffect(() => {
    try {
      const votes = JSON.parse(localStorage.getItem("nexus_votes") || "{}");
      if (votes[resourceId]) {
        setUserVote(votes[resourceId]);
      }
    } catch {
      // Ignore
    }
  }, [resourceId]);

  const handleVote = async (type: "helpful" | "unhelpful") => {
    if (userVote) return; // Prevent double voting

    if (type === "helpful") setHelpful((prev) => prev + 1);
    else setUnhelpful((prev) => prev + 1);

    setUserVote(type);

    try {
      const votes = JSON.parse(localStorage.getItem("nexus_votes") || "{}");
      votes[resourceId] = type;
      localStorage.setItem("nexus_votes", JSON.stringify(votes));

      // Post to API
      await fetch(`/api/resources/${resourceId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHelpful: type === "helpful" }),
      });
    } catch (err) {
      console.error("Failed to register vote:", err);
    }
  };

  const total = helpful + unhelpful;
  const percentage = total > 0 ? Math.round((helpful / total) * 100) : 100;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface border border-surface-border">
      <div>
        <div className="text-sm font-semibold text-content-primary">
          Community Sentiment
        </div>
        <div className="text-xs text-content-muted mt-0.5">
          {percentage}% of users found this resource useful ({total.toLocaleString()} total responses)
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => handleVote("helpful")}
          disabled={userVote !== null}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            userVote === "helpful"
              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
              : "bg-surface-secondary border-surface-border text-content-secondary hover:text-content-primary hover:border-emerald-500/30"
          } ${userVote ? "cursor-default" : ""}`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>Useful</span>
          <span className="text-content-muted">({helpful})</span>
        </button>

        <button
          onClick={() => handleVote("unhelpful")}
          disabled={userVote !== null}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            userVote === "unhelpful"
              ? "bg-red-500/20 text-red-400 border-red-500/40"
              : "bg-surface-secondary border-surface-border text-content-secondary hover:text-content-primary hover:border-red-500/30"
          } ${userVote ? "cursor-default" : ""}`}
        >
          <ThumbsDown className="w-3.5 h-3.5" />
          <span>Not useful</span>
          <span className="text-content-muted">({unhelpful})</span>
        </button>
      </div>
    </div>
  );
}
