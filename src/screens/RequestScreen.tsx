import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import { executeRequest } from "../core/executeRequest.js";
import clipboard from "clipboardy";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RequestScreenProps {
  onBack: () => void;
}

type Method      = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
type RightTab    = "body" | "headers";
type PanelFocus  = "left" | "right";
type LeftSection = "url-method" | "params" | "req-headers" | "body" | "auth";
type EditMode    = "none" | "url" | "body" | "kv-key" | "kv-value";

interface KVPair     { key: string; value: string; }
interface TextField  { value: string; cursor: number; }
type ResponseData =
  | { status: number; headers: Record<string, string>; body: string; time: number }
  | { error: string; time: number };

// ─── Constants ────────────────────────────────────────────────────────────────

const METHODS: Method[]         = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"];
const LEFT_SECTIONS: LeftSection[] = ["url-method", "params", "req-headers", "body", "auth"];
const VIEWPORT_HEIGHT            = 18; // lines visible in response viewport
const DIVIDER                    = "─".repeat(54);
const RIGHT_DIVIDER              = "─".repeat(56);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function statusColor(s: number) {
  if (s >= 500) return "red";
  if (s >= 400) return "yellow";
  if (s >= 300) return "cyan";
  return "green";
}

function prettyBody(raw: string): string {
  try { return JSON.stringify(JSON.parse(raw), null, 2); }
  catch { return raw; }
}

function buildUrl(base: string, params: KVPair[]): string {
  const active = params.filter(p => p.key.trim());
  if (!active.length) return base;
  const qs = active.map(p =>
    `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`
  ).join("&");
  return base.includes("?") ? `${base}&${qs}` : `${base}?${qs}`;
}

function makeField(value = ""): TextField {
  return { value, cursor: value.length };
}

function tfInsert(f: TextField, ch: string): TextField {
  return { value: f.value.slice(0, f.cursor) + ch + f.value.slice(f.cursor), cursor: f.cursor + 1 };
}

function tfDelete(f: TextField): TextField {
  if (f.cursor === 0) return f;
  return { value: f.value.slice(0, f.cursor - 1) + f.value.slice(f.cursor), cursor: f.cursor - 1 };
}

function tfLeft(f: TextField):  TextField { return { ...f, cursor: Math.max(0, f.cursor - 1) }; }
function tfRight(f: TextField): TextField { return { ...f, cursor: Math.min(f.value.length, f.cursor + 1) }; }

function byteSize(s: string): string {
  const b = new TextEncoder().encode(s).length;
  return b < 1024 ? `${b} B` : `${(b / 1024).toFixed(1)} KB`;
}

// ─── TextInput ────────────────────────────────────────────────────────────────
// Renders a single-line field with a block cursor when active.

function TextInput({ field, active, width }: { field: TextField; active: boolean; width?: number }) {
  const { value, cursor } = field;
  // Truncate display to width if provided (prevent layout blowing up)
  const maxShow  = width ? width - 1 : 9999;
  // Show a window around the cursor
  const winStart = Math.max(0, cursor - maxShow + 1);
  const display  = value.slice(winStart);
  const relCursor = cursor - winStart;

  const before    = display.slice(0, relCursor);
  const atCursor  = display[relCursor] ?? " ";
  const after     = display.slice(relCursor + 1);

  return (
    <Text>
      <Text color={active ? "white" : "gray"}>{before}</Text>
      {active
        ? <Text backgroundColor="cyan" color="black">{atCursor}</Text>
        : <Text color="gray">{value[cursor] ?? ""}</Text>}
      <Text color={active ? "white" : "gray"}>{after}</Text>
    </Text>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function RequestScreen({ onBack }: RequestScreenProps) {

  // ── Request state ──
  const [method, setMethod]         = useState<Method>("GET");
  const [urlField, setUrlField]     = useState<TextField>(makeField("http://example.com/"));
  const [params, setParams]         = useState<KVPair[]>([]);
  const [reqHeaders, setReqHeaders] = useState<KVPair[]>([]);
  const [bodyField, setBodyField]   = useState<TextField>(makeField(""));

  // ── UI state ──
  const [panel, setPanel]           = useState<PanelFocus>("left");
  const [leftSec, setLeftSec]       = useState<LeftSection>("url-method");
  const [rightTab, setRightTab]     = useState<RightTab>("body");
  const [editMode, setEditMode]     = useState<EditMode>("none");
  const [kvCursor, setKvCursor]     = useState(0);
  const [draftKey, setDraftKey]     = useState<TextField>(makeField());
  const [draftValue, setDraftValue] = useState<TextField>(makeField());

  // ── Response state ──
  const [loading, setLoading]       = useState(false);
  const [response, setResponse]     = useState<ResponseData | null>(null);
  const [respScroll, setRespScroll] = useState(0);
  const [copied, setCopied]         = useState(false);

  const isEditing = editMode !== "none";

  // ── Helpers ──────────────────────────────────────────────────────────────

  const cycleMethod = (dir: 1 | -1) => {
    const i = METHODS.indexOf(method);
    setMethod(METHODS[(i + dir + METHODS.length) % METHODS.length]!);
  };

  const autoHeaders: KVPair[] = [
    { key: "Accept", value: "application/json" },
    ...(!["GET", "HEAD"].includes(method) && bodyField.value.trim()
      ? [{ key: "Content-Type", value: "application/json" }]
      : []),
  ];

  const sendRequest = async () => {
    setLoading(true);
    setResponse(null);
    setRespScroll(0);

    const builtHeaders: Record<string, string> = {};
    autoHeaders.forEach(h => { builtHeaders[h.key] = h.value; });
    reqHeaders.forEach(h => { if (h.key.trim()) builtHeaders[h.key] = h.value; });

    const result = await executeRequest({
      method,
      url: buildUrl(urlField.value, params),
      headers: builtHeaders,
      ...(!["GET", "HEAD"].includes(method) && bodyField.value.trim()
        ? { body: bodyField.value }
        : {}),
    });

    setResponse(result);
    setLoading(false);
  };

  const commitDraft = (target: "params" | "req-headers") => {
    if (draftKey.value.trim()) {
      const entry: KVPair = { key: draftKey.value, value: draftValue.value };
      if (target === "params") setParams(p => [...p, entry]);
      else setReqHeaders(h => [...h, entry]);
    }
    setDraftKey(makeField());
    setDraftValue(makeField());
    setEditMode("none");
  };

  const deleteRow = (target: "params" | "req-headers") => {
    if (target === "params") {
      if (!params.length) return;
      setParams(p => p.filter((_, i) => i !== kvCursor));
    } else {
      if (!reqHeaders.length) return;
      setReqHeaders(h => h.filter((_, i) => i !== kvCursor));
    }
    setKvCursor(c => Math.max(0, c - 1));
  };

  const copyResponse = async () => {
    if (!response || "error" in response) return;
    try {
      await clipboard.write(prettyBody(response.body));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  // ── Response viewport ──────────────────────────────────────────────────────

  const responseLines: string[] = (() => {
    if (!response || "error" in response) return [];
    if (rightTab === "body") return prettyBody(response.body).split("\n");
    return Object.entries(response.headers).map(([k, v]) => `${k}: ${v}`);
  })();

  const totalLines   = responseLines.length;
  const visibleLines = responseLines.slice(respScroll, respScroll + VIEWPORT_HEIGHT);
  // Pad to fixed height so layout doesn't shift
  const paddedLines  = [
    ...visibleLines,
    ...Array(Math.max(0, VIEWPORT_HEIGHT - visibleLines.length)).fill(""),
  ];

  // ── Input ─────────────────────────────────────────────────────────────────

  useInput((input, key) => {

    // ── Edit mode: capture all input ──
    if (isEditing) {
      if (key.escape) {
        setDraftKey(makeField()); setDraftValue(makeField()); setEditMode("none");
        return;
      }
      if (key.return) {
        if (editMode === "url" || editMode === "body") { setEditMode("none"); return; }
        if (editMode === "kv-key")   { setEditMode("kv-value"); return; }
        if (editMode === "kv-value") { commitDraft(leftSec === "params" ? "params" : "req-headers"); return; }
        return;
      }
      if (key.leftArrow) {
        if (editMode === "url")           setUrlField(tfLeft(urlField));
        else if (editMode === "body")     setBodyField(tfLeft(bodyField));
        else if (editMode === "kv-key")   setDraftKey(tfLeft(draftKey));
        else if (editMode === "kv-value") setDraftValue(tfLeft(draftValue));
        return;
      }
      if (key.rightArrow) {
        if (editMode === "url")           setUrlField(tfRight(urlField));
        else if (editMode === "body")     setBodyField(tfRight(bodyField));
        else if (editMode === "kv-key")   setDraftKey(tfRight(draftKey));
        else if (editMode === "kv-value") setDraftValue(tfRight(draftValue));
        return;
      }
      if (key.backspace || key.delete) {
        if (editMode === "url")           setUrlField(tfDelete(urlField));
        else if (editMode === "body")     setBodyField(tfDelete(bodyField));
        else if (editMode === "kv-key")   setDraftKey(tfDelete(draftKey));
        else if (editMode === "kv-value") setDraftValue(tfDelete(draftValue));
        return;
      }
      if (input) {
        if (editMode === "url")           setUrlField(tfInsert(urlField, input));
        else if (editMode === "body")     setBodyField(tfInsert(bodyField, input));
        else if (editMode === "kv-key")   setDraftKey(tfInsert(draftKey, input));
        else if (editMode === "kv-value") setDraftValue(tfInsert(draftValue, input));
      }
      return;
    }

    // ── Global ──
    if (input === "q" || input === "Q") { onBack(); return; }
    if (input === "e" || input === "E") { void sendRequest(); return; }
    if (input === "c" || input === "C") { void copyResponse(); return; }

    // ── Tab: switch panel focus ──
    if (key.tab) {
      setPanel(p => p === "left" ? "right" : "left");
      return;
    }

    // ── LEFT panel ──────────────────────────────────────────────────────────
    if (panel === "left") {

      // j / down  →  move section down (or KV row down)
      if (input === "j" || key.downArrow) {
        if (leftSec === "params" && kvCursor < params.length - 1) {
          setKvCursor(c => c + 1); return;
        }
        if (leftSec === "req-headers" && kvCursor < reqHeaders.length - 1) {
          setKvCursor(c => c + 1); return;
        }
        const i = LEFT_SECTIONS.indexOf(leftSec);
        if (i < LEFT_SECTIONS.length - 1) {
          setLeftSec(LEFT_SECTIONS[i + 1]!);
          setKvCursor(0);
        }
        return;
      }

      // k / up  →  move section up (or KV row up)
      if (input === "k" || key.upArrow) {
        if ((leftSec === "params" || leftSec === "req-headers") && kvCursor > 0) {
          setKvCursor(c => c - 1); return;
        }
        const i = LEFT_SECTIONS.indexOf(leftSec);
        if (i > 0) {
          setLeftSec(LEFT_SECTIONS[i - 1]!);
          setKvCursor(0);
        }
        return;
      }

      // section-specific
      if (leftSec === "url-method") {
        if (input === "i")           setEditMode("url");
        if (key.leftArrow)           cycleMethod(-1);
        if (key.rightArrow)          cycleMethod(1);
      }

      if (leftSec === "params") {
        if (input === "a" || input === "A") {
          setKvCursor(params.length);
          setDraftKey(makeField()); setDraftValue(makeField());
          setEditMode("kv-key");
        }
        if (input === "d" || input === "D") deleteRow("params");
      }

      if (leftSec === "req-headers") {
        if (input === "a" || input === "A") {
          setKvCursor(reqHeaders.length);
          setDraftKey(makeField()); setDraftValue(makeField());
          setEditMode("kv-key");
        }
        if (input === "d" || input === "D") deleteRow("req-headers");
      }

      if (leftSec === "body") {
        if (input === "i") setEditMode("body");
      }
    }

    // ── RIGHT panel ─────────────────────────────────────────────────────────
    if (panel === "right") {

      // h/l or left/right  →  switch response tab
      if (input === "h" || key.leftArrow)  { setRightTab("body");    setRespScroll(0); return; }
      if (input === "l" || key.rightArrow) { setRightTab("headers"); setRespScroll(0); return; }

      // j/k  →  scroll response viewport
      if (input === "j" || key.downArrow) {
        setRespScroll(s => Math.min(s + 1, Math.max(0, totalLines - VIEWPORT_HEIGHT)));
        return;
      }
      if (input === "k" || key.upArrow) {
        setRespScroll(s => Math.max(0, s - 1));
        return;
      }

      // G  →  jump to end, gg  →  jump to top
      if (input === "G") {
        setRespScroll(Math.max(0, totalLines - VIEWPORT_HEIGHT));
        return;
      }
      if (input === "g") {
        setRespScroll(0);
        return;
      }
    }
  });

  // ── Render ────────────────────────────────────────────────────────────────

  const leftActive  = panel === "left";
  const rightActive = panel === "right";

  // helper: section header row
  function SectionHeader({ label, right }: { label: string; right?: React.ReactNode }) {
    const active = leftSec;
    return (
      <Box justifyContent="space-between">
        <Text color={active && leftActive ? "cyan" : active ? "cyan" : "gray"} bold>
          {">"} {label}
        </Text>
        {right && <Text dimColor>{right}</Text>}
      </Box>
    );
  }

  return (
    <Box flexDirection="column">

      {/* ── Title ── */}
      <Box paddingX={1} paddingBottom={0}>
        <Text bold color="cyan">PostCLI </Text>
        <Text>HTTP Request Builder</Text>
      </Box>

      {/* ── Outer border wrapping both panels ── */}
      <Box borderStyle="single" borderColor="gray" flexDirection="row">

        {/* ════════════ LEFT PANEL ════════════ */}
        <Box
          flexDirection="column"
          width={60}
          borderRight
          borderStyle="single"
          borderColor="gray"
          paddingX={1}
          paddingY={1}
        >

          {/* [1] URL & METHOD */}
          <SectionHeader label="URL & METHOD" />
          <Box marginTop={1} gap={1}>
            {/* Method: fixed width 10 always */}
            <Box borderStyle="single" borderColor={leftSec === "url-method" && leftActive ? "magenta" : "gray"} width={10} justifyContent="center">
              <Text color="cyan" bold>{method.padEnd(5)}</Text>
              {/* <Text dimColor>∨</Text> */}
            </Box>
            {/* URL: fixed width box */}
            <Box
              borderStyle="single"
              borderColor={editMode === "url" ? "cyan" : leftSec === "url-method" && leftActive ? "cyan" : "gray"}
              width={40}
              paddingX={1}
            >
              <TextInput field={urlField} active={editMode === "url"} width={38} />
            </Box>
          </Box>
          {leftSec === "url-method" && leftActive && editMode === "none" && (
            <Box marginTop={1} gap={3}>
              <Text dimColor>[i] Edit URL</Text>
              <Text dimColor>[←/→] Change Method</Text>
            </Box>
          )}

          <Text dimColor>{DIVIDER}</Text>

          {/* [2] PARAMS */}
          <SectionHeader label="PARAMS" right={`(${params.length})`} />
          <Box marginTop={1} flexDirection="column">
            {params.length === 0 && editMode !== "kv-key" && editMode !== "kv-value" && leftSec !== "params" && (
              <Text dimColor>No params</Text>
            )}
            {params.length === 0 && leftSec === "params" && editMode === "none" && (
              <Text dimColor>No params</Text>
            )}
            {params.map((p, i) => {
              const sel = leftSec === "params" && i === kvCursor && leftActive;
              return (
                <Box key={i}>
                  <Text color={sel ? "cyan" : "gray"}>{sel ? "▶ " : "  "}</Text>
                  <Text color="cyan">{p.key}</Text>
                  <Text color="gray">: </Text>
                  <Text>{p.value}</Text>
                </Box>
              );
            })}
            {leftSec === "params" && (editMode === "kv-key" || editMode === "kv-value") && (
              <Box>
                <Text color="cyan">▶ </Text>
                <TextInput field={draftKey} active={editMode === "kv-key"} width={18} />
                <Text color="gray">: </Text>
                <TextInput field={draftValue} active={editMode === "kv-value"} width={18} />
              </Box>
            )}
          </Box>
          {leftSec === "params" && leftActive && editMode === "none" && (
            <Box marginTop={1} gap={2}>
              <Text dimColor>[a] Add</Text>
              <Text dimColor>[d] Delete</Text>
            </Box>
          )}

          <Text dimColor>{DIVIDER}</Text>

          {/* [3] HEADERS */}
          <SectionHeader label="HEADERS" right={`(${autoHeaders.length + reqHeaders.length})`} />
          <Box marginTop={1} flexDirection="column">
            {autoHeaders.map((h, i) => (
              <Box key={`auto-${i}`}>
                <Text>  </Text>
                <Text color="cyan">{h.key}</Text>
                <Text color="gray">: </Text>
                <Text>{h.value}</Text>
              </Box>
            ))}
            {reqHeaders.map((h, i) => {
              const sel = leftSec === "req-headers" && i === kvCursor && leftActive;
              return (
                <Box key={i}>
                  <Text color={sel ? "cyan" : "gray"}>{sel ? "▶ " : "  "}</Text>
                  <Text color="cyan">{h.key}</Text>
                  <Text color="gray">: </Text>
                  <Text>{h.value}</Text>
                </Box>
              );
            })}
            {leftSec === "req-headers" && (editMode === "kv-key" || editMode === "kv-value") && (
              <Box>
                <Text color="cyan">▶ </Text>
                <TextInput field={draftKey} active={editMode === "kv-key"} width={18} />
                <Text color="gray">: </Text>
                <TextInput field={draftValue} active={editMode === "kv-value"} width={18} />
              </Box>
            )}
            {reqHeaders.length === 0 && leftSec !== "req-headers" && (
              <Text dimColor>  No custom headers</Text>
            )}
          </Box>
          {leftSec === "req-headers" && leftActive && editMode === "none" && (
            <Box marginTop={1} gap={2}>
              <Text dimColor>[a] Add</Text>
              <Text dimColor>[d] Delete</Text>
            </Box>
          )}

          <Text dimColor>{DIVIDER}</Text>

          {/* [4] BODY */}
          <Box justifyContent="space-between">
            <SectionHeader label="BODY" />
            <Text dimColor>Raw (JSON)</Text>
          </Box>
          <Box marginTop={1}>
            {["GET", "HEAD"].includes(method) ? (
              <Text dimColor>{method} has no body.</Text>
            ) : editMode === "body" ? (
              <Box borderStyle="single" borderColor="cyan" paddingX={1} width={52}>
                <TextInput field={bodyField} active width={50} />
              </Box>
            ) : (
              <Text color={bodyField.value ? "white" : "gray"}>
                {bodyField.value || "Empty body"}
              </Text>
            )}
          </Box>
          {leftSec === "body" && leftActive && editMode === "none" && !["GET", "HEAD"].includes(method) && (
            <Box marginTop={1}>
              <Text dimColor>[i] Edit body</Text>
            </Box>
          )}

          <Text dimColor>{DIVIDER}</Text>

          {/* [5] AUTHORIZATION */}
          <Box>
            <SectionHeader label="AUTHORIZATION" />
            {/* <Text dimColor>Coming soon</Text> */}
          </Box>
          <Box marginTop={1}>
            <Text dimColor>Authorization configuration</Text>
          </Box>

        </Box>

        {/* ════════════ RIGHT PANEL ════════════ */}
        <Box flexDirection="column" flexGrow={1} paddingX={1} paddingY={1}>

          {/* Response tabs */}
          <Box gap={3} marginBottom={0}>
            <Text
              bold
              color={rightTab === "body" ? "green" : "gray"}
              underline={rightTab === "body"}
            >
              RESPONSE BODY
            </Text>
            <Text
              bold
              color={rightTab === "headers" ? "green" : "gray"}
              underline={rightTab === "headers"}
            >
              HEADERS
            </Text>
            {rightActive && (
              <Text dimColor>  h/l switch  j/k scroll</Text>
            )}
          </Box>

          <Text dimColor>{RIGHT_DIVIDER}</Text>

          {/* Fixed-height viewport */}
          <Box flexDirection="column" height={VIEWPORT_HEIGHT} overflow="hidden">
            {loading && (
              <Text color="gray">⟳  Sending...</Text>
            )}

            {!loading && !response && (
              <Text dimColor>Press [e] to send the request.</Text>
            )}

            {!loading && response && "error" in response && (
              <Box flexDirection="column">
                <Text color="red" bold>✗ Request Failed</Text>
                <Text color="red">{response.error}</Text>
              </Box>
            )}

            {!loading && response && !("error" in response) &&
              paddedLines.map((line, i) => (
                <Text key={i}>{line}</Text>
              ))
            }
          </Box>

          <Text dimColor>{RIGHT_DIVIDER}</Text>

          {/* Status bar */}
          <Box gap={3} marginTop={0}>
            {response && !("error" in response) ? (
              <>
                <Text>
                  <Text dimColor>Status: </Text>
                  <Text color={statusColor(response.status)} bold>
                    {response.status} {response.status < 400 ? "ok" : "err"}
                  </Text>
                </Text>
                <Text>
                  <Text dimColor>Time: </Text>
                  <Text>{response.time}ms</Text>
                </Text>
                <Text>
                  <Text dimColor>Size: </Text>
                  <Text>{byteSize(response.body)}</Text>
                </Text>
                {totalLines > VIEWPORT_HEIGHT && (
                  <Text dimColor>[{respScroll + 1}–{Math.min(respScroll + VIEWPORT_HEIGHT, totalLines)}/{totalLines}]</Text>
                )}
                {copied
                  ? <Text color="green">✓ Copied!</Text>
                  : null
                }
              </>
            ) : response && "error" in response ? (
              <>
                <Text><Text dimColor>Status: </Text><Text color="red">error</Text></Text>
                <Text><Text dimColor>Time: </Text><Text>{response.time}ms</Text></Text>
                <Text><Text dimColor>Size: </Text><Text>—</Text></Text>
              </>
            ) : (
              <>
                <Text dimColor>Status: —</Text>
                <Text dimColor>Time: —</Text>
                <Text dimColor>Size: —</Text>
              </>
            )}
          </Box>

        </Box>
      </Box>

      {/* ── Bottom keybinds ── */}
      <Box paddingX={1} paddingTop={0} gap={2}>
        <Text><Text color="cyan">[j/k]</Text><Text dimColor> navigate</Text></Text>
        <Text><Text color="cyan">[i]</Text><Text dimColor> edit field</Text></Text>
        <Text><Text color="green">[e]</Text><Text dimColor> send</Text></Text>
        <Text><Text color="green">[c]</Text><Text dimColor> copy response</Text></Text>
        <Text><Text color="red">[q]</Text><Text dimColor> back</Text></Text>
        <Text><Text color="cyan">[Tab]</Text><Text dimColor> switch panel</Text></Text>
        <Text><Text color="cyan">[Esc]</Text><Text dimColor> stop editing</Text></Text>
      </Box>

    </Box>
  );
}