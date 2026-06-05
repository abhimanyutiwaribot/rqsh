import { Box, Text } from "ink";
import { useUiState } from "../hooks/useUiState.js";
import { leftActive } from "../constants/constants.js";

export default function SectionHeader({ label, right }: { label: string; right?: React.ReactNode }) {
  const uiState = useUiState()
  const active = uiState.leftSec;
  return (
    <Box justifyContent="space-between">
      <Text color={active && leftActive ? "cyan" : active ? "cyan" : "gray"} bold>
        {">"} {label}
      </Text>
      {right && <Text dimColor>{right}</Text>}
    </Box>
  );
}