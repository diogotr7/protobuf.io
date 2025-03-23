import {
  Card,
  Flex,
  Text,
  Tooltip,
  VStack,
  Badge,
  Divider,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { SizedRawMessage } from "../../types";

interface ByteInfo {
  offset: number;
  type: "tag" | "data" | "unknown";
  fieldType?: string;
  fieldNumber?: number;
  messageDepth: number;
  description: string;
  color: string;
}

interface HexViewProps {
  buffer: Uint8Array;
  rootMessage: SizedRawMessage | null;
}

// Get color for a specific byte type
function getColorForByteType(type: string, fieldType?: string): string {
  switch (type) {
    case "tag":
      return "yellow";
    case "data":
      switch (fieldType) {
        case "varint":
          return "purple";
        case "string":
          return "green";
        case "message":
          return "blue";
        case "bytes":
          return "red";
        case "fixed32":
          return "teal";
        case "fixed64":
          return "orange";
        case "repeatedField":
          return "pink";
        default:
          return "gray";
      }
    default:
      return "gray.200";
  }
}

// Process message recursively to get byte information
function processMessage(
  message: SizedRawMessage,
  byteInfoMap: Map<number, ByteInfo>,
  messageDepth: number = 0
): void {
  // Process each field in the message
  message.fields.forEach((field) => {
    const fieldStart = field.offset;
    const fieldEnd = fieldStart + field.tagSize + field.dataSize;

    // Tag bytes
    for (let i = fieldStart; i < fieldStart + field.tagSize; i++) {
      byteInfoMap.set(i, {
        offset: i,
        type: "tag",
        fieldNumber: field.fieldNumber,
        fieldType: field.type,
        messageDepth,
        description: `Field ${field.fieldNumber} Tag (${field.type})`,
        color: getColorForByteType("tag"),
      });
    }

    // Data bytes
    for (let i = fieldStart + field.tagSize; i < fieldEnd; i++) {
      byteInfoMap.set(i, {
        offset: i,
        type: "data",
        fieldNumber: field.fieldNumber,
        fieldType: field.type,
        messageDepth,
        description: `Field ${field.fieldNumber} Data (${field.type})`,
        color: getColorForByteType("data", field.type),
      });
    }

    // Recursively process nested messages
    if (field.type === "message") {
      processMessage(field.data, byteInfoMap, messageDepth + 1);
    }
  });
}

export function HexView({ buffer, rootMessage }: HexViewProps) {
  const bytesPerRow =
    useBreakpointValue(
      {
        base: 8, // Extra small screens
        sm: 12, // Small screens
        md: 16, // Medium screens
        lg: 32, // Large screens
        //xl: 64, // Extra large screens
      },
      { ssr: false }
    ) || 16;

  // Process buffer and colorize based on the message structure
  const byteInfoArray = useMemo(() => {
    const byteInfoMap = new Map<number, ByteInfo>();

    // Initialize all bytes as unknown
    for (let i = 0; i < buffer.length; i++) {
      byteInfoMap.set(i, {
        offset: i,
        type: "unknown",
        messageDepth: 0,
        description: "Unknown byte",
        color: "gray.100",
      });
    }

    // Process message structure if available
    if (rootMessage) {
      processMessage(rootMessage, byteInfoMap);
    }

    // Convert map to array and sort by offset
    return Array.from(byteInfoMap.values()).sort((a, b) => a.offset - b.offset);
  }, [buffer, rootMessage]);

  // Group bytes into rows
  const rows = useMemo(() => {
    const result = [];
    for (let i = 0; i < byteInfoArray.length; i += bytesPerRow) {
      result.push(byteInfoArray.slice(i, i + bytesPerRow));
    }
    return result;
  }, [byteInfoArray, bytesPerRow]);

  if (buffer.length === 0) return null;

  return (
    <Card p={4} variant="outline">
      <VStack spacing={4} align="stretch">
        {/* Adjust spacing so that the actual byte rows line up close together */}
        <Stack spacing={0}>
          {rows.map((row, rowIndex) => (
            <Flex key={rowIndex} align="center" width="100%">
              <Text fontFamily="mono" color="gray.500" flexShrink={0} pr={2}>
                {(rowIndex * bytesPerRow).toString(16).padStart(4, "0")}
              </Text>

              <Flex flex="1" width="100%">
                {row.map((byteInfo) => (
                  <Tooltip
                    bg={`${byteInfo.color}.200`}
                    key={byteInfo.offset}
                    label={`0x${byteInfo.offset
                      .toString(16)
                      .padStart(2, "0")} (${byteInfo.offset})  | ${
                      byteInfo.fieldType
                    } | ${byteInfo.type}`}
                    placement="top"
                  >
                    <Badge
                      key={byteInfo.offset}
                      flex={1}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontFamily="mono"
                      fontSize="lg"
                      colorScheme={byteInfo.color}
                      borderRadius={0}
                    >
                      {buffer[byteInfo.offset].toString(16).padStart(2, "0")}
                    </Badge>
                  </Tooltip>
                ))}
                {/* Fill remaining space with empty boxes if row is not complete */}
                {row.length < bytesPerRow &&
                  Array(bytesPerRow - row.length)
                    .fill(0)
                    .map((_, i) => (
                      <Badge
                        key={i}
                        flex={1}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontFamily="mono"
                        fontSize="lg"
                        borderRadius={0}
                        colorScheme="whiteAlpha"
                      />
                    ))}
              </Flex>
            </Flex>
          ))}
        </Stack>
        <Divider />
        <Flex wrap="wrap" gap={1}>
          <Badge colorScheme="yellow">Tag</Badge>
          <Badge colorScheme="purple">VarInt</Badge>
          <Badge colorScheme="green">String</Badge>
          <Badge colorScheme="blue">Message</Badge>
          <Badge colorScheme="red">Bytes</Badge>
          <Badge colorScheme="teal">Fixed32</Badge>
          <Badge colorScheme="orange">Fixed64</Badge>
          <Badge colorScheme="pink">Repeated</Badge>
          <Badge colorScheme="gray">Unknown</Badge>
        </Flex>
      </VStack>
    </Card>
  );
}
