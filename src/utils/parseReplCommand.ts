import { METHODS } from "../constants/constants.js";
import type { Method } from "../types/request.js";

export interface ParsedCommand {
  type: "request" | "system" | "invalid";
  method: Method;
  url: string;
  headers: Record<string, string>;
  queryParams: Record<string, string>;
  body: string; // stringified JSON
  systemCmd?: string;
  systemArgs?: string[];
  error?: string;
}

// Tokenize supporting quotes (e.g. key="val with spaces" or Header:"bearer token")
export function tokenize(str: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let inQuotes = false;
  let quoteChar = "";

  for (let i = 0; i < str.length; i++) {
    const char = str[i]!;
    
    // Toggle quotes
    if ((char === '"' || char === "'") && (i === 0 || str[i - 1] !== "\\")) {
      if (inQuotes && char === quoteChar) {
        inQuotes = false;
      } else if (!inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else {
        current += char;
      }
    } else if (char === " " && !inQuotes) {
      if (current.trim()) {
        tokens.push(current);
        current = "";
      }
    } else {
      current += char;
    }
  }
  if (current.trim()) {
    tokens.push(current);
  }
  return tokens;
}

export function parseKeyPath(key: string): string[] {
  const parts: string[] = [];
  const firstBracket = key.indexOf("[");
  if (firstBracket === -1) {
    return [key];
  }
  parts.push(key.substring(0, firstBracket));
  const bracketRegex = /\[(.*?)\]/g;
  const remaining = key.substring(firstBracket);
  let match;
  while ((match = bracketRegex.exec(remaining)) !== null) {
    parts.push(match[1]!);
  }
  return parts;
}

export function setNestedValue(obj: Record<string, any>, keyPathStr: string, rawVal: string, isJson: boolean) {
  const parts = parseKeyPath(keyPathStr);
  let value: any = rawVal;
  if (isJson) {
    try {
      value = JSON.parse(rawVal);
    } catch {
      value = rawVal;
    }
  }

  let current = obj;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]!;
    const isLast = i === parts.length - 1;

    if (isLast) {
      if (part === "") {
        if (Array.isArray(current)) {
          current.push(value);
        }
      } else {
        current[part] = value;
      }
    } else {
      const nextPart = parts[i + 1]!;
      const isNextArray = nextPart === "" || /^\d+$/.test(nextPart);

      if (part === "") {
        const nextObj = isNextArray ? [] : {};
        if (Array.isArray(current)) {
          current.push(nextObj);
          current = nextObj;
        }
      } else {
        if (current[part] === undefined) {
          current[part] = isNextArray ? [] : {};
        }
        current = current[part];
      }
    }
  }
}

export function parseReplCommand(input: string, baseUrl?: string): ParsedCommand {
  const trimmed = input.trim();
  if (!trimmed) {
    return { type: "invalid", error: "Empty command", method: "GET", url: "", headers: {}, queryParams: {}, body: "" };
  }

  const tokens = tokenize(trimmed);
  const firstToken = tokens[0]!;

  // 1. Check for system command (starts with / followed by valid system command name)
  const SYSTEM_COMMANDS = ["set", "clear", "copy", "help", "exit", "quit"];
  if (firstToken.startsWith("/") && SYSTEM_COMMANDS.includes(firstToken.slice(1).toLowerCase())) {
    return {
      type: "system",
      systemCmd: firstToken.slice(1).toLowerCase(),
      systemArgs: tokens.slice(1),
      method: "GET",
      url: "",
      headers: {},
      queryParams: {},
      body: ""
    };
  }

  // 2. Parse request command
  let method: Method = "GET";
  let rawUrl = "";
  let argTokens: string[] = [];

  const upperFirst = firstToken.toUpperCase();
  if (METHODS.includes(upperFirst as Method)) {
    method = upperFirst as Method;
    rawUrl = tokens[1] ?? "";
    argTokens = tokens.slice(2);
  } else {
    // Implicit GET
    method = "GET";
    rawUrl = firstToken;
    argTokens = tokens.slice(1);
  }

  if (!rawUrl) {
    return { type: "invalid", error: "Missing URL", method, url: "", headers: {}, queryParams: {}, body: "" };
  }

  // Interpolate Base URL if relative path
  let finalUrl = rawUrl;
  if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
    if (finalUrl.startsWith("/")) {
      if (baseUrl) {
        finalUrl = `${baseUrl.replace(/\/$/, "")}${finalUrl}`;
      } else {
        finalUrl = `http://localhost${finalUrl}`;
      }
    } else {
      finalUrl = `http://${finalUrl}`;
    }
  }

  // Parse HTTPie arguments
  const headers: Record<string, string> = {};
  const queryParams: Record<string, string> = {};
  const bodyFields: Record<string, any> = {};

  for (const token of argTokens) {
    let matched = false;

    // A. JSON body field (Key:=JSONVal)
    const jsonMatch = token.match(/^([a-zA-Z0-9_\-\[\]]+):=(.*)$/);
    if (jsonMatch) {
      const [, key, val] = jsonMatch;
      if (key && val !== undefined) {
        setNestedValue(bodyFields, key, val, true);
        matched = true;
      }
    }

    // B. Query Param explicitly (Key==Val)
    if (!matched) {
      const queryMatch = token.match(/^([a-zA-Z0-9_\-\[\]]+)==(.*)$/);
      if (queryMatch) {
        const [, key, val] = queryMatch;
        if (key && val !== undefined) {
          queryParams[key] = val;
          matched = true;
        }
      }
    }

    // C. String Body Field or Query Param fallback (Key=Val)
    if (!matched) {
      const equalsMatch = token.match(/^([a-zA-Z0-9_\-\[\]]+)=(.*)$/);
      if (equalsMatch) {
        const [, key, val] = equalsMatch;
        if (key && val !== undefined) {
          if (["GET", "HEAD", "OPTIONS"].includes(method)) {
            queryParams[key] = val;
          } else {
            setNestedValue(bodyFields, key, val, false);
          }
          matched = true;
        }
      }
    }

    // D. Header (Key:Val) - must not match a URL scheme like http:
    if (!matched) {
      const headerMatch = token.match(/^([a-zA-Z0-9_\-\[\]]+):(.*)$/);
      if (headerMatch) {
        const [, key, val] = headerMatch;
        if (key && val !== undefined) {
          headers[key] = val;
          matched = true;
        }
      }
    }
  }

  // Build body string if there are body fields
  let bodyStr = "";
  if (Object.keys(bodyFields).length > 0) {
    bodyStr = JSON.stringify(bodyFields);
  }

  // Append query parameters to finalUrl if any
  if (Object.keys(queryParams).length > 0) {
    try {
      const urlObj = new URL(finalUrl);
      for (const [k, v] of Object.entries(queryParams)) {
        urlObj.searchParams.append(k, v);
      }
      finalUrl = urlObj.toString();
    } catch {
      // Fallback
    }
  }

  return {
    type: "request",
    method,
    url: finalUrl,
    headers,
    queryParams,
    body: bodyStr
  };
}
