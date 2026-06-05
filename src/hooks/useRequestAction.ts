import clipboard from "clipboardy";
import { METHODS } from "../constants/constants.js";
import { executeRequest } from "../core/executeRequest.js";
import type { KVPair } from "../types/request.js";
import { buildUrl } from "../utils/request.js";
import { useRequestState } from "./useRequestState.js";
import { useResponseState } from "./useResponseState.js";
import { prettyBody } from "../utils/response.js";
import { useUiState } from "./useUiState.js";
import { makeField } from "../utils/textField.js";

export function useRequestAction() {
  const requestState = useRequestState();
  const responseState = useResponseState()
  const uiState = useUiState()

  const cycleMethod = (dir: 1 | -1) => {
    const i = METHODS.indexOf(requestState.method);
    requestState.setMethod(METHODS[(i + dir + METHODS.length) % METHODS.length]!);
  };

  const autoHeaders: KVPair[] = [
    { key: "Accept", value: "application/json" },
    ...(!["GET", "HEAD"].includes(requestState.method) && requestState.bodyField.value.trim()
      ? [{ key: "Content-Type", value: "application/json" }]
      : []),
  ];

  const sendRequest = async () => {
    responseState.setLoading(true);
    responseState.setResponse(null);
    responseState.setRespScroll(0);

    const builtHeaders: Record<string, string> = {};
    autoHeaders.forEach(h => { builtHeaders[h.key] = h.value; });
    requestState.reqHeaders.forEach(h => { if (h.key.trim()) builtHeaders[h.key] = h.value; });

    const result = await executeRequest({
      method: requestState.method,
      url: buildUrl(requestState.urlField.value, requestState.params),
      headers: builtHeaders,
      ...(!["GET", "HEAD"].includes(requestState.method) && requestState.bodyField.value.trim()
        ? { body: requestState.bodyField.value }
        : {}),
    });

    responseState.setResponse(result);
    responseState.setLoading(false);
  };

  const commitDraft = (target: "params" | "req-headers") => {
    if (uiState.draftKey.value.trim()) {
      const entry: KVPair = { key: uiState.draftKey.value, value: uiState.draftValue.value };
      if (target === "params") requestState.setParams(p => [...p, entry]);
      else requestState.setReqHeaders(h => [...h, entry]);
    }
    uiState.setDraftKey(makeField());
    uiState.setDraftValue(makeField());
    uiState.setEditMode("none");
  };

  const deleteRow = (target: "params" | "req-headers") => {
    if (target === "params") {
      if (!requestState.params.length) return;
      requestState.setParams(p => p.filter((_, i) => i !== uiState.kvCursor));
    } else {
      if (!requestState.reqHeaders.length) return;
      requestState.setReqHeaders(h => h.filter((_, i) => i !== uiState.kvCursor));
    }
    uiState.setKvCursor(c => Math.max(0, c - 1));
  };

  const copyResponse = async () => {
    if (!responseState.response || "error" in responseState.response) return;
    try {
      await clipboard.write(prettyBody(responseState.response.body));
      responseState.setCopied(true);
      setTimeout(() => responseState.setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  return {
    cycleMethod,
    sendRequest,
    autoHeaders,
    commitDraft,
    deleteRow,
    copyResponse
  }
}