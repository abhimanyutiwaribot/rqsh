"use client";

import React from "react";

export default function VideoCard() {
  return (
    <div
      className="w-full aspect-video rounded-3xl border overflow-hidden relative flex items-center justify-center transition-all border-zinc-500 bg-zinc-200/30 dark:border-zinc-800 dark:bg-black/40 shadow-sm"
    >
      {/* Branded Fallback Placeholder label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 select-none z-0">
        <span className="text-xs md:text-sm font-semibold tracking-wide font-mono text-magenta/80 dark:text-magenta/50">
          [ loading demo video... ]
        </span>
      </div>
      <video
        src="/demo.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-contain relative z-10"
        onError={(e) => {
          // Hide missing video outline
          (e.target as HTMLVideoElement).style.opacity = "0";
        }}
      />
    </div>
  );
}
