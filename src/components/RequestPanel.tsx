import { Box, Text } from "ink";
import SectionHeader from "./SectionHeader.js";
import { DIVIDER } from "../constants/constants.js";
import { useRequestState } from "../hooks/useRequestState.js";
import { useUiState } from "../hooks/useUiState.js";
import TextInput from "./TextInput.js";
import { autoHeaders } from "../utils/request.js";

export default function RequestPanel(){

  const requestState = useRequestState()
  const uiState = useUiState()

  const leftActive = uiState.panel === "left";  

  return (
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
            <Box borderStyle="single" borderColor={uiState.leftSec === "url-method" && leftActive ? "magenta" : "gray"} width={10} justifyContent="center">
              <Text color="cyan" bold>{requestState.method.padEnd(5)}</Text>
              {/* <Text dimColor>∨</Text> */}
            </Box>
            {/* URL: fixed width box */}
            <Box
              borderStyle="single"
              borderColor={uiState.editMode === "url" ? "cyan" : uiState.leftSec === "url-method" && leftActive ? "cyan" : "gray"}
              width={40}
              paddingX={1}
            >
              <TextInput field={requestState.urlField} active={uiState.editMode === "url"} width={38} />
            </Box>
          </Box>
          {uiState.leftSec === "url-method" && leftActive && uiState.editMode === "none" && (
            <Box marginTop={1} gap={3}>
              <Text dimColor>[i] Edit URL</Text>
              <Text dimColor>[←/→] Change Method</Text>
            </Box>
          )}

          <Text dimColor>{DIVIDER}</Text>

          {/* [2] PARAMS */}
          <SectionHeader label="PARAMS" right={`(${requestState.params.length})`} />
          <Box marginTop={1} flexDirection="column">
            {requestState.params.length === 0 && uiState.editMode !== "kv-key" && uiState.editMode !== "kv-value" && uiState.leftSec !== "params" && (
              <Text dimColor>No params</Text>
            )}
            {requestState.params.length === 0 && uiState.leftSec === "params" && uiState.editMode === "none" && (
              <Text dimColor>No params</Text>
            )}
            {requestState.params.map((p, i) => {
              const sel = uiState.leftSec === "params" && i === uiState.kvCursor && leftActive;
              return (
                <Box key={i}>
                  <Text color={sel ? "cyan" : "gray"}>{sel ? "▶ " : "  "}</Text>
                  <Text color="cyan">{p.key}</Text>
                  <Text color="gray">: </Text>
                  <Text>{p.value}</Text>
                </Box>
              );
            })}
            {uiState.leftSec === "params" && (uiState.editMode === "kv-key" || uiState.editMode === "kv-value") && (
              <Box>
                <Text color="cyan">▶ </Text>
                <TextInput field={uiState.draftKey} active={uiState.editMode === "kv-key"} width={18} />
                <Text color="gray">: </Text>
                <TextInput field={uiState.draftValue} active={uiState.editMode === "kv-value"} width={18} />
              </Box>
            )}
          </Box>
          {uiState.leftSec === "params" && leftActive && uiState.editMode === "none" && (
            <Box marginTop={1} gap={2}>
              <Text dimColor>[a] Add</Text>
              <Text dimColor>[d] Delete</Text>
            </Box>
          )}

          <Text dimColor>{DIVIDER}</Text>

          {/* [3] HEADERS */}
          <SectionHeader label="HEADERS" right={`(${autoHeaders.length + requestState.reqHeaders.length})`} />
          <Box marginTop={1} flexDirection="column">
            {autoHeaders.map((h, i) => (
              <Box key={`auto-${i}`}>
                <Text>  </Text>
                <Text color="cyan">{h.key}</Text>
                <Text color="gray">: </Text>
                <Text>{h.value}</Text>
              </Box>
            ))}
            {requestState.reqHeaders.map((h, i) => {
              const sel = uiState.leftSec === "req-headers" && i === uiState.kvCursor && leftActive;
              return (
                <Box key={i}>
                  <Text color={sel ? "cyan" : "gray"}>{sel ? "▶ " : "  "}</Text>
                  <Text color="cyan">{h.key}</Text>
                  <Text color="gray">: </Text>
                  <Text>{h.value}</Text>
                </Box>
              );
            })}
            {uiState.leftSec === "req-headers" && (uiState.editMode === "kv-key" || uiState.editMode === "kv-value") && (
              <Box>
                <Text color="cyan">▶ </Text>
                <TextInput field={uiState.draftKey} active={uiState.editMode === "kv-key"} width={18} />
                <Text color="gray">: </Text>
                <TextInput field={uiState.draftValue} active={uiState.editMode === "kv-value"} width={18} />
              </Box>
            )}
            {requestState.reqHeaders.length === 0 && uiState.leftSec !== "req-headers" && (
              <Text dimColor>  No custom headers</Text>
            )}
          </Box>
          {uiState.leftSec === "req-headers" && leftActive && uiState.editMode === "none" && (
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
            {["GET", "HEAD"].includes(requestState.method) ? (
              <Text dimColor>{requestState.method} has no body.</Text>
            ) : uiState.editMode === "body" ? (
              <Box borderStyle="single" borderColor="cyan" paddingX={1} width={52}>
                <TextInput field={requestState.bodyField} active width={50} />
              </Box>
            ) : (
              <Text color={requestState.bodyField.value ? "white" : "gray"}>
                {requestState.bodyField.value || "Empty body"}
              </Text>
            )}
          </Box>
          {uiState.leftSec === "body" && leftActive && uiState.editMode === "none" && !["GET", "HEAD"].includes(requestState.method) && (
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
  )
}