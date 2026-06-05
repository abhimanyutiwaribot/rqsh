import { VIEWPORT_HEIGHT } from "../constants/constants.js";
import { useResponseState } from "../hooks/useResponseState.js";
import { useUiState } from "../hooks/useUiState.js";

export function statusColor(s: number) {
  if (s >= 500) return "red";
  if (s >= 400) return "yellow";
  if (s >= 300) return "cyan";
  return "green";
}

export function prettyBody(raw: string): string {
  try { return JSON.stringify(JSON.parse(raw), null, 2); }
  catch { return raw; }
}

export function byteSize(s: string): string {
  const b = new TextEncoder().encode(s).length;
  return b < 1024 ? `${b} B` : `${(b / 1024).toFixed(1)} KB`;
}

const responseState = useResponseState()
const uiState = useUiState();

const responseLines: string[] = (() => {
  if (!responseState.response || "error" in responseState.response) return [];
  if (uiState.rightTab === "body") return prettyBody(responseState.response.body).split("\n");
  return Object.entries(responseState.response.headers).map(([k, v]) => `${k}: ${v}`);
})();

export const totalLines = responseLines.length;
export const visibleLines = responseLines.slice(responseState.respScroll, responseState.respScroll + VIEWPORT_HEIGHT);
// Pad to fixed height so layout doesn't shift
export const paddedLines = [
  ...visibleLines,
  ...Array(Math.max(0, VIEWPORT_HEIGHT - visibleLines.length)).fill(""),
];
