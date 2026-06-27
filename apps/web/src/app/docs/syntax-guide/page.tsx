import React from "react";

export default function SyntaxGuide() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl md:text-3xl font-bold tracking-wide border-b border-dashed border-zinc-500/20 pb-2">
        Syntax Guide
      </h1>
      <p className="text-base md:text-lg text-zinc-850 dark:text-zinc-300">
        Construct quick HTTP requests using our intuitive parameters mapping. Parameters are tokenized using spaces.
      </p>

      <div className="flex flex-col gap-8 mt-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm md:text-base font-bold text-magenta">1. HTTP Method & URL Path</span>
          <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-400">
            Prepend the method keyword. If omitted, the request defaults to GET. Relative paths compile against the Base URL.
          </p>
          <div className="p-4 rounded-lg border font-mono text-sm overflow-x-auto select-all border-zinc-500 bg-white text-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
            GET /posts <br />
            /posts/1
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm md:text-base font-bold text-magenta">2. Query Parameters (==)</span>
          <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-400">
            Map query queries using the double equals symbol.
          </p>
          <div className="p-4 rounded-lg border font-mono text-sm overflow-x-auto select-all border-zinc-500 bg-white text-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
            GET /posts limit==10 page==2
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm md:text-base font-bold text-magenta">3. Custom Headers (:)</span>
          <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-400">
            Map headers using the colon separator. Quote values containing spaces.
          </p>
          <div className="p-4 rounded-lg border font-mono text-sm overflow-x-auto select-all border-zinc-500 bg-white text-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
            GET /users Authorization:"Bearer token123" Content-Type:application/json
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm md:text-base font-bold text-magenta">4. JSON Body String Parameters (=)</span>
          <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-400">
            For POST, PUT, or PATCH, assign key-value strings with the single equals symbol.
          </p>
          <div className="p-4 rounded-lg border font-mono text-sm overflow-x-auto select-all border-zinc-500 bg-white text-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
            POST /posts title="New post" category=tech
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm md:text-base font-bold text-magenta">5. Raw Type JSON Values (:=)</span>
          <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-400">
            Map non-string types (booleans, numbers, arrays, nested objects) to JSON using the colon-equals symbol.
          </p>
          <div className="p-4 rounded-lg border font-mono text-sm overflow-x-auto select-all border-zinc-500 bg-white text-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
            POST /posts published:=true views:=150 tags:='["news", "web"]'
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm md:text-base font-bold text-magenta">6. Nested JSON Objects (user[name])</span>
          <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-400">
            Build nested fields using standard bracket notation.
          </p>
          <div className="p-4 rounded-lg border font-mono text-sm overflow-x-auto select-all border-zinc-500 bg-white text-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
            POST /users user[name]="John" user[address][city]="Seattle"
          </div>
        </div>
      </div>
    </section>
  );
}
