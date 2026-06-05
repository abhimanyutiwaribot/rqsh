import { useState } from "react";
import type { ResponseData } from "../types/request.js";


export function useResponseState(){
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [respScroll, setRespScroll] = useState(0);
  const [copied, setCopied] = useState(false);

  return {
    loading,
    setLoading,
    response,
    setResponse,
    respScroll,
    setRespScroll,
    copied,
    setCopied
  }
}