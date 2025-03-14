import { Stack, HStack, Badge, Code } from "@chakra-ui/react";

function toHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join(" ");
}

export function BytesDisplay({ bytes }: { bytes: Uint8Array }) {
  return (
    <Stack>
      <HStack>
        <Badge colorScheme="red">Length: {bytes.length}</Badge>
      </HStack>
      <Code p={2} borderRadius="md">
        {toHex(bytes)}
      </Code>
    </Stack>
  );
}
