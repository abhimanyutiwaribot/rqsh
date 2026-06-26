import React from "react";

interface VideoCardProps {
  isDarkMode: boolean;
}

export default function VideoCard({ isDarkMode }: VideoCardProps) {
  return (
    <div
      className={`w-full h-[250px] sm:h-[350px] md:h-[400px] rounded-3xl border overflow-hidden relative flex items-center justify-center transition-all ${
        isDarkMode ? "border-zinc-800 bg-black" : "border-zinc-500 bg-zinc-200/30"
      }`}
    >
      {/* Branded Fallback Placeholder label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 select-none z-0">
        <span className={`text-xs md:text-sm font-semibold tracking-wide font-mono ${
          isDarkMode ? "text-magenta/50" : "text-magenta/80"
        }`}>
          [ demo video ]
        </span>
      </div>
      <video
        src="/demo.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover relative z-10"
        onError={(e) => {
          // Hide missing video outline
          (e.target as HTMLVideoElement).style.opacity = "0";
        }}
      />
    </div>
  );
}
