import React from "react";

export default function SystemCommands() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl md:text-3xl font-bold tracking-wide border-b border-dashed border-zinc-500/20 pb-2">
        System Commands
      </h1>
      <p className="text-base md:text-lg text-zinc-850 dark:text-zinc-300">
        Manage the REPL terminal state using slash commands.
      </p>

      <div className="flex flex-col gap-8 mt-6">
        <div className="flex flex-col gap-2">
          <span className="font-bold text-sm md:text-base text-magenta">/set base &lt;url&gt;</span>
          <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-400">
            Sets the root base URL for relative endpoints. Normalizes to http/https automatically.
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <span className="font-bold text-sm md:text-base text-magenta">/clear</span>
          <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-400">
            Clears the active REPL logs history.
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <span className="font-bold text-sm md:text-base text-magenta">/copy</span>
          <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-400">
            Copies the last received response JSON body to the system clipboard.
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <span className="font-bold text-sm md:text-base text-magenta">/help</span>
          <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-400">
            Outputs a cheat-sheet command guide directly inside the terminal console.
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <span className="font-bold text-sm md:text-base text-magenta">/exit /quit</span>
          <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-400">
            Shuts down the terminal client session.
          </p>
        </div>
      </div>
    </section>
  );
}
