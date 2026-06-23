#!/usr/bin/env node

import { render } from "ink";
import React from "react";
import App from "./App.js";

// Enter alternate screen buffer to avoid polluting the terminal scrollback
process.stdout.write("\x1b[?1049h");
// Clear screen and reset cursor position to top-left
process.stdout.write("\x1b[2J\x1b[H");

const { cleanup } = render(<App />);

function restore() {
  process.stdout.write("\x1b[?1049l");
}

// Ensure alternate screen is restored on exit
process.on("exit", restore);

// Catch termination signals to clean up cleanly
process.on("SIGINT", () => {
  cleanup();
  process.exit(0);
});
process.on("SIGTERM", () => {
  cleanup();
  process.exit(0);
});