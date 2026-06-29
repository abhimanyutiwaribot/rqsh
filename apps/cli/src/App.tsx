import React from "react";
import { useRqsh } from "./hooks/useRqshCli.js";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation.js";
import ResponseInspector from "./components/ResponseInspector.js";
import ReplConsole from "./components/ReplConsole.js";

export default function App() {
  const state = useRqsh();

  // Wire up REPL keyboard event loop
  useKeyboardNavigation({ state });

  return state.viewingResponse ? (
    <ResponseInspector state={state} />
  ) : (
    <ReplConsole state={state} />
  );
}