import { useState } from "react";
import { makeField, type TextField } from "../utils/textField.js";
import type { KVPair, Method } from "../types/request.js";

export function useRequestState() {
  const [method, setMethod] = useState<Method>("GET");
  const [urlField, setUrlField] = useState<TextField>(makeField("http://example.com/"));
  const [params, setParams] = useState<KVPair[]>([]);
  const [reqHeaders, setReqHeaders] = useState<KVPair[]>([]);
  const [bodyField, setBodyField] = useState<TextField>(makeField(""));

  return {
    method,
    setMethod,
    urlField,
    setUrlField,
    params,
    setParams,
    reqHeaders,
    setReqHeaders,
    bodyField,
    setBodyField
  }
}