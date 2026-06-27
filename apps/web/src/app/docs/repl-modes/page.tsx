import React from "react";

export default function ReplModes() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl md:text-3xl font-bold tracking-wide border-b border-dashed border-zinc-500/20 pb-2">
        REPL Modes
      </h1>
      <p className="text-base md:text-lg text-zinc-850 dark:text-zinc-300">
        The interactive terminal uses two modes for high speed request configuration and output review.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
        <div
          className="p-5 rounded-xl border border-zinc-500 bg-zinc-200/20 dark:border-zinc-800 dark:bg-zinc-900/20"
        >
          <span className="font-bold text-magenta text-sm uppercase tracking-wider">
            Input Mode (Default)
          </span>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-400">
            Allows typing commands, URLs, and bodies directly at the prompt. Supports automatic tab-completion.
          </p>
        </div>
        <div
          className="p-5 rounded-xl border border-zinc-500 bg-zinc-200/20 dark:border-zinc-800 dark:bg-zinc-900/20"
        >
          <span className="font-bold text-magenta text-sm uppercase tracking-wider">
            Scroll Mode (Escape)
          </span>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-400">
            Disconnects console typing to let you scroll history, open the response details inspector, and copy response payloads.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-6">
        <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-zinc-500">
          Key Bindings Reference
        </span>
        <div
          className="border overflow-hidden rounded-xl border-zinc-500 bg-white text-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
        >
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-zinc-500 dark:border-zinc-800">
                <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider w-[150px]">Key</th>
                <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-300 dark:border-zinc-850">
                <td className="p-4 font-semibold font-mono">Escape</td>
                <td className="p-4 text-zinc-800 dark:text-zinc-300">Switch from Input Mode to Scroll Mode</td>
              </tr>
              <tr className="border-b border-zinc-300 dark:border-zinc-850">
                <td className="p-4 font-semibold font-mono">i / Escape</td>
                <td className="p-4 text-zinc-800 dark:text-zinc-300">Return to Input Mode (from Scroll Mode)</td>
              </tr>
              <tr className="border-b border-zinc-300 dark:border-zinc-850">
                <td className="p-4 font-semibold font-mono">j / k (Arrow keys)</td>
                <td className="p-4 text-zinc-800 dark:text-zinc-300">Scroll output logs (Scroll Mode only)</td>
              </tr>
              <tr className="border-b border-zinc-300 dark:border-zinc-850">
                <td className="p-4 font-semibold font-mono">v</td>
                <td className="p-4 text-zinc-800 dark:text-zinc-300">Open Response Inspector panel (Body vs Headers tabs)</td>
              </tr>
              <tr className="border-b border-zinc-300 dark:border-zinc-850">
                <td className="p-4 font-semibold font-mono">c</td>
                <td className="p-4 text-zinc-800 dark:text-zinc-300">Copy active tab content to clipboard (Response Inspector mode)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold font-mono">q</td>
                <td className="p-4 text-zinc-800 dark:text-zinc-300">Exit the client shell</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
