"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import InstallCard, { INSTALL_COMMANDS } from "../components/landing/InstallCard";
import VideoCard from "../components/landing/VideoCard";
import CommandBuilder from "../components/landing/CommandBuilder";
import ComparisonTable from "../components/landing/ComparisonTable";
import Footer from "../components/Footer";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activePkg, setActivePkg] = useState<"npm" | "bun" | "yarn" | "pnpm">("npm");
  const [copied, setCopied] = useState(false);

  // Initialize theme based on preference or system
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMANDS[activePkg]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      className={`min-h-screen font-mono flex flex-col transition-colors duration-300 ${
        isDarkMode ? "bg-black text-white" : "bg-[#d6d6d6] text-black"
      }`}
    >
      {/* Header Wrapper: wider width to stand out */}
      <div className="w-full max-w-6xl mx-auto px-4 pt-6 md:px-8 md:pt-12">
        <Header isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} />
      </div>

      {/* Main Content Wrapper */}
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-12 md:gap-20 px-4 pb-12 md:px-8 md:pb-24 mt-8 md:mt-16">
        {/* Content Section: Split Columns, aligned at start top level */}
        <main className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Left Column: Heading and Install Snippet */}
          <div className="md:col-span-5 flex flex-col items-center md:items-start gap-6 md:gap-8 w-full">
            {/* Mobile Tagline (exactly 3 lines, centered) */}
            <h1 className="block md:hidden text-xl font-semibold leading-relaxed tracking-wide text-center w-full whitespace-pre-line">
              {"An interactive,\nTerminal-based HTTP-Client\n"}
              <span className="inline-block bg-magenta text-black font-bold px-3 py-0.5 mt-2 rounded-[8px_24px_12px_32px_/_16px_8px_24px_12px] rotate-[-1.5deg] shadow-sm select-none">
                built for you!!
              </span>
            </h1>

            {/* Desktop Tagline (flows naturally, left-aligned) */}
            <h1 className="hidden md:block text-2xl font-semibold leading-relaxed tracking-wide text-left w-full">
              An interactive, Terminal-based <br /> HTTP-Client <br />
              <span className="inline-block bg-magenta text-black font-bold px-4 py-1 mt-0 -ml-4 rounded-[10px_35px_15px_30px_/_20px_10px_30px_15px] rotate-[-2deg] shadow-sm select-none">
                built for you!!
              </span>
            </h1>

            {/* Install command card */}
            <InstallCard
              isDarkMode={isDarkMode}
              activePkg={activePkg}
              onSelectPkg={setActivePkg}
              copied={copied}
              onCopy={handleCopy}
            />
          </div>

          {/* Right Column: Demo Video Placeholder */}
          <div className="md:col-span-7 w-full flex items-center justify-center">
            <VideoCard isDarkMode={isDarkMode} />
          </div>
        </main>

        {/* Divider */}
        <div className={`h-px w-full transition-colors ${isDarkMode ? "bg-zinc-800" : "bg-zinc-400"}`} />

        {/* Interactive Command Builder Section */}
        <CommandBuilder isDarkMode={isDarkMode} />

        {/* Divider */}
        <div className={`h-px w-full transition-colors ${isDarkMode ? "bg-zinc-800" : "bg-zinc-400"}`} />

        {/* Comparison Section */}
        <ComparisonTable isDarkMode={isDarkMode} />

        {/* Footer Wrapper: matches header alignment and width */}
        <Footer isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}
