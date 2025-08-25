import { ThemeTypings } from "@chakra-ui/react";
import { Message } from "../../protobuf/message";

type Color = ThemeTypings["colorSchemes"];

export interface ByteInfo {
  offset: number;
  type: "tag" | "data" | "unknown";
  fieldType?: string;
  fieldNumber?: number;
  messageDepth: number;
  description: string;
  color: Color;
}

// Get color for a specific byte type
export function getColorForByteType(type: string, fieldType?: string): Color {
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
      return "gray";
  }
}

// Process message recursively to get byte information
export function processMessage(
  message: Message,
  byteInfoMap: Map<number, ByteInfo>,
  messageDepth: number = 0
): void {
  // return;
  // // Process each field in the message
  // message.data.fields.forEach(({ fieldBody: field }) => {
  //   const fieldStart = field.offset;
  //   const fieldEnd = fieldStart + field.tagSize + field.dataSize;
  //   // Tag bytes
  //   for (let i = fieldStart; i < fieldStart + field.tagSize; i++) {
  //     byteInfoMap.set(i, {
  //       offset: i,
  //       type: "tag",
  //       fieldNumber: field.fieldNumber,
  //       fieldType: field.type,
  //       messageDepth,
  //       description: `Field ${field.fieldNumber} Tag (${field.type})`,
  //       color: getColorForByteType("tag"),
  //     });
  //   }
  //   // Data bytes
  //   for (let i = fieldStart + field.tagSize; i < fieldEnd; i++) {
  //     byteInfoMap.set(i, {
  //       offset: i,
  //       type: "data",
  //       fieldNumber: field.fieldNumber,
  //       fieldType: field.type,
  //       messageDepth,
  //       description: `Field ${field.fieldNumber} Data (${field.type})`,
  //       color: getColorForByteType("data", field.type),
  //     });
  //   }
  //   // Recursively process nested messages
  //   if (field.type === "message") {
  //     processMessage(field.data, byteInfoMap, messageDepth + 1);
  //   }
  // });
}
