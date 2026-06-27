import React from "react";

export default function GettingStarted() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl md:text-3xl font-bold tracking-wide border-b border-dashed border-zinc-500/20 pb-2">
        Getting Started
      </h1>
      <p className="text-base md:text-lg text-zinc-850 dark:text-zinc-300">
        Install postcli globally to access the interactive HTTP terminal client shell directly from any console.
      </p>
      
      <div className="flex flex-col gap-2 mt-4">
        <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-zinc-500">
          Installation
        </span>
        <div
          className="p-5 rounded-xl border relative font-mono text-sm overflow-x-auto select-all border-zinc-500 bg-white text-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
        >
          <div className="flex flex-col gap-4">
            <div><span className="text-zinc-500"># npm</span> <br />npm install -g postcli</div>
            <div><span className="text-zinc-500"># bun</span> <br />bun add -g postcli</div>
            <div><span className="text-zinc-500"># yarn</span> <br />yarn global add postcli</div>
            <div><span className="text-zinc-500"># pnpm</span> <br />pnpm add -g postcli</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-zinc-500">
          Launching the REPL
        </span>
        <p className="text-base text-zinc-850 dark:text-zinc-300">
          Once installed, run the cli name to launch the client prompt:
        </p>
        <div
          className="p-5 rounded-xl border font-mono text-sm overflow-x-auto select-all border-zinc-500 bg-white text-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
        >
          postcli
        </div>
      </div>
    </section>
  );
}
