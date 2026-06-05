import { Box, Text } from "ink";
import RequestPanel from "../components/RequestPanel.js";
import ResponsePanel from "../components/ResponsePanel.js";
import KeyBindings from "../components/KeyBindings.js";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation.js";
import { useUiState } from "../hooks/useUiState.js";
import { useRequestState } from "../hooks/useRequestState.js";
import { useResponseState } from "../hooks/useResponseState.js";
import { useResponseAction } from "../hooks/useResponseAction.js";
import { useRequestAction } from "../hooks/useRequestAction.js";

interface RequestScreenProps {
  onBack: () => void;
}

export default function RequestScreen({ onBack }: RequestScreenProps) {

  const requestState = useRequestState();
  const responseState = useResponseState();
  const uiState = useUiState();
  const responseActions = useResponseAction({
    responseState,
    uiState
  });
  const requestActions = useRequestAction({
    requestState,
    responseState,
    uiState
  });

  useKeyboardNavigation({ onBack, requestState, responseState, uiState, responseActions, requestActions })

  return (
    <Box flexDirection="column">
      <Box paddingX={1} paddingBottom={0}>
        <Text bold color="cyan">PostCLI </Text>
        <Text>HTTP Request Builder</Text>
      </Box>
      <Box borderStyle="single" borderColor="gray" flexDirection="row">
        <RequestPanel
          requestState={requestState}
          uiState={uiState}
          requestActions={requestActions}/>
        <ResponsePanel
          uiState={uiState}
          responseState={responseState}
          responseActions={responseActions} />
      </Box>
      <KeyBindings />
    </Box>
  );
}