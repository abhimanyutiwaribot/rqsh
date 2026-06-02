import React, { useState } from "react";
import { Box, Text, useInput } from "ink";

interface RequestScreenProps {
  onBack: () => void;
}

type RequestTab = "builder" | "params" | "headers" | "body";

const tabs: RequestTab[] = ["builder", "params", "headers", "body"];

export default function RequestScreen({ onBack }: RequestScreenProps) {
  const [activeTab, setActiveTab] = useState<RequestTab>("builder");
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://api.example.com/endpoint");
  const [params, setParams] = useState<string[]>([]);
  const [body, setBody] = useState("");

  useInput((input, key) => {
    if (input === "q" || input === "Q") {
      onBack();
    }

    if (key.tab && !key.shift) {
      const currentIndex = tabs.indexOf(activeTab);
      const nextTab =
        (tabs[(currentIndex + 1) % tabs.length] as RequestTab) || tabs[0]!;
      console.log(nextTab)
      setActiveTab(nextTab);
    }

    if (key.tab && key.shift) {
      const currentIndex = tabs.indexOf(activeTab);
      const prevTab =
        (tabs[(currentIndex - 1 + tabs.length) % tabs.length] as RequestTab) ||
        tabs[0]!;
      setActiveTab(prevTab);
    }

    if (input === "1") setActiveTab("builder");
    if (input === "2") setActiveTab("params");
    if (input === "3") setActiveTab("headers");
    if (input === "4") setActiveTab("body");
  });

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={2}>
        <Text bold>HTTP Request Builder</Text>
      </Box>

      <Box marginBottom={1} gap={3}>
        {tabs.map((tab) => (
          <Text key={tab} bold={activeTab === tab}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        ))}
      </Box>

      <Box marginBottom={2}>
        <Text>{"\u2500".repeat(80)}</Text>
      </Box>

      {activeTab === "builder" && (
        <Box flexDirection="column" marginBottom={2}>
          <Box marginBottom={1}>
            <Box width={15}>
              <Text>Method:</Text>
            </Box>
            <Text bold>{method}</Text>
          </Box>

          <Box marginBottom={1}>
            <Box width={15}>
              <Text>URL:</Text>
            </Box>
            <Text>{url}</Text>
          </Box>

          <Box marginTop={2} gap={3}>
            <Text color="blue">Enter - Send</Text>
            <Text color="white">Ctrl+S - Save</Text>
          </Box>
        </Box>
      )}

      {activeTab === "params" && (
        <Box flexDirection="column" marginBottom={2}>
          <Box marginBottom={1}>
            <Text>Query Parameters:</Text>
          </Box>
          {params.length === 0 ? (
            <Text dimColor>No parameters added</Text>
          ) : (
            params.map((p, i) => <Text key={i}>{p}</Text>)
          )}
        </Box>
      )}

      {activeTab === "headers" && (
        <Box flexDirection="column" marginBottom={2}>
          <Box marginBottom={1}>
            <Text>Request Headers:</Text>
          </Box>
          <Box marginBottom={1}>
            <Box width={25}>
              <Text>Content-Type</Text>
            </Box>
            <Text>application/json</Text>
          </Box>
          <Box>
            <Box width={25}>
              <Text>User-Agent</Text>
            </Box>
            <Text>PostCLI/1.0.0</Text>
          </Box>
        </Box>
      )}

      {activeTab === "body" && (
        <Box flexDirection="column" marginBottom={2}>
          <Box marginBottom={1}>
            <Text>Request Body:</Text>
          </Box>
          <Box paddingX={1} borderStyle="single" borderColor="white">
            <Text>{body || "No body"}</Text>
          </Box>
        </Box>
      )}

      <Box marginTop={2} gap={3}>
        <Text color="gray">Tab - Next</Text>
        <Text color="gray">Shift+Tab - Prev</Text>
        <Text color="gray">Q - Back</Text>
      </Box>
    </Box>
  );
}

// Note: Only one default export allowed
