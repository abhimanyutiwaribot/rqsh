import type { Metadata } from "next";
import InstallCard from "../components/landing/InstallCard";
import VideoCard from "../components/landing/VideoCard";
import CommandBuilder from "../components/landing/CommandBuilder";
import ComparisonTable from "../components/landing/ComparisonTable";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "RQSH — Interactive Terminal HTTP Client",
  description: "An interactive, terminal-based HTTP client built for developers. Write requests using clean parameters, navigate outputs with Vim keys, and configure API calls in a REPL console.",
};

export default function Home() {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-12 md:gap-20 px-4 pb-12 md:px-8 md:pb-24 mt-8 md:mt-16 flex-grow">
      
      {/* Hero Header Section */}
      <main className="flex flex-col gap-12 items-center w-full">
        {/* Titles & Install Card Wrapper */}
        <div className="flex flex-col gap-8 items-center w-full max-w-2xl">
          {/* Brand Titles */}
          <div className="flex flex-col items-center gap-4 w-full">
            <h1 className="block md:hidden text-xl font-semibold leading-relaxed tracking-wide text-center w-full whitespace-pre-line">
              {"An interactive,\nTerminal-based HTTP-Client\n"}
              <span className="inline-block bg-magenta text-black font-bold px-3 py-0.5 mt-2 rounded-[8px_24px_12px_32px_/_16px_8px_24px_12px] rotate-[-1.5deg] shadow-sm select-none">
                built for you!!
              </span>
            </h1>
            <h1 className="hidden md:block text-2xl md:text-3xl font-semibold leading-relaxed tracking-wide text-center w-full">
              An interactive, terminal-based <br /> HTTP-Client <br />
              <span className="inline-block bg-magenta text-black font-bold px-4 py-1 mt-3 rounded-[10px_35px_15px_30px_/_20px_10px_30px_15px] rotate-[-2deg] shadow-sm select-none">
                built for you!!
              </span>
            </h1>
          </div>
          
          {/* Global Install Command Selector */}
          <div className="w-full max-w-md">
            <InstallCard />
          </div>
        </div>

        {/* Massive Full-Width Terminal Demo Video */}
        <div className="w-full flex items-center justify-center mt-2">
          <VideoCard />
        </div>
      </main>

      <div className="h-px w-full transition-colors bg-zinc-400 dark:bg-zinc-800" />
      <CommandBuilder />
      <div className="h-px w-full transition-colors bg-zinc-400 dark:bg-zinc-800" />
      <ComparisonTable />
      <Footer />
    </div>
  );
}
