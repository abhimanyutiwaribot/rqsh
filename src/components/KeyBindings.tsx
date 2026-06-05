import { Box, Text } from "ink";

export default function KeyBindings() {
  return (
    <Box paddingX={1} paddingTop={0} gap={2}>
      <Text><Text color="cyan">[j/k]</Text><Text dimColor> navigate</Text></Text>
      <Text><Text color="cyan">[i]</Text><Text dimColor> edit field</Text></Text>
      <Text><Text color="green">[e]</Text><Text dimColor> send</Text></Text>
      <Text><Text color="green">[c]</Text><Text dimColor> copy response</Text></Text>
      <Text><Text color="red">[q]</Text><Text dimColor> back</Text></Text>
      <Text><Text color="cyan">[Tab]</Text><Text dimColor> switch panel</Text></Text>
      <Text><Text color="cyan">[Esc]</Text><Text dimColor> stop editing</Text></Text>
    </Box>
  )
}