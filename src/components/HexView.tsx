import {
  Card,
  Flex,
  Text,
  Tooltip,
  VStack,
  Badge,
  Heading,
  Divider,
} from "@chakra-ui/react";
import { SizedRawMessage } from "../types";
import { useMemo } from "react";

interface ByteInfo {
  offset: number;
  value: number;
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
  bytesPerRow?: number;
}

// Get color for a specific byte type
const getColorForByteType = (type: string, fieldType?: string): string => {
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
};

// Process message recursively to get byte information
const processMessage = (
  message: SizedRawMessage,
  byteInfoMap: Map<number, ByteInfo>,
  messageDepth: number = 0
): void => {
  //const messageStart = message.offset;
  //const messageEnd = messageStart + message.tagSize + message.dataSize;

  // Process each field in the message
  message.fields.forEach(({ field, fieldNumber }) => {
    const fieldStart = field.offset;
    const fieldEnd = fieldStart + field.tagSize + field.dataSize;

    // Tag bytes
    for (let i = fieldStart; i < fieldStart + field.tagSize; i++) {
      byteInfoMap.set(i, {
        offset: i,
        value: i,
        type: "tag",
        fieldNumber,
        fieldType: field.type,
        messageDepth,
        description: `Field ${fieldNumber} Tag (${field.type})`,
        color: getColorForByteType("tag"),
      });
    }

    // Data bytes
    for (let i = fieldStart + field.tagSize; i < fieldEnd; i++) {
      byteInfoMap.set(i, {
        offset: i,
        value: i,
        type: "data",
        fieldNumber,
        fieldType: field.type,
        messageDepth,
        description: `Field ${fieldNumber} Data (${field.type})`,
        color: getColorForByteType("data", field.type),
      });
    }

    // Recursively process nested messages
    if (field.type === "message") {
      processMessage(field.data, byteInfoMap, messageDepth + 1);
    }
  });
};

export const HexView: React.FC<HexViewProps> = ({
  buffer,
  rootMessage,
  bytesPerRow = 32,
}) => {
  // Process buffer and colorize based on the message structure
  const byteInfoArray = useMemo(() => {
    const byteInfoMap = new Map<number, ByteInfo>();

    // Initialize all bytes as unknown
    for (let i = 0; i < buffer.length; i++) {
      byteInfoMap.set(i, {
        offset: i,
        value: buffer[i],
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

  // No content to display
  if (buffer.length === 0) {
    return null;
  }

  return (
    <Card p={4} mb={6} variant="outline">
      <VStack spacing={2} align="stretch">
        <Heading size="sm" mb={2}>
          Hex Byte Visualization
        </Heading>

        <Flex wrap="wrap" mb={2} gap={2}>
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

        <Divider mb={2} />

        {rows.map((row, rowIndex) => (
          <Flex key={rowIndex} align="center" width="100%">
            <Text fontFamily="mono" color="gray.500" w="60px" flexShrink={0}>
              {(rowIndex * bytesPerRow).toString(16).padStart(4, "0")}:
            </Text>

            <Flex wrap="wrap" flex="1" justifyContent="flex-start">
              {row.map((byteInfo) => (
                <Tooltip
                  key={byteInfo.offset}
                  label={`Offset: 0x${byteInfo.offset
                    .toString(16)
                    .padStart(2, "0")} - ${byteInfo.description}`}
                  placement="top"
                >
                  <Badge
                    colorScheme={byteInfo.color}
                    borderRadius="sm"
                    fontFamily="mono"
                    fontSize="sm"
                    m="1px"
                    minW="24px"
                    textAlign="center"
                  >
                    {buffer[byteInfo.offset].toString(16).padStart(2, "0")}
                  </Badge>
                </Tooltip>
              ))}
            </Flex>
          </Flex>
        ))}
      </VStack>
    </Card>
  );
};
