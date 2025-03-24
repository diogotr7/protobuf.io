import {
  Box,
  Card,
  HStack,
  Select,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import { Enum, Field, OneOf, parse, Type } from "protobufjs";
import { useState, useMemo, useEffect, useRef } from "react";
import { langs } from "@uiw/codemirror-extensions-langs";
import { tokyoNightStorm } from "@uiw/codemirror-theme-tokyo-night-storm";
import CodeMirror from "@uiw/react-codemirror";
import { decodeBytes } from "../../protobuf/decode";
import JSON5 from "json5";
import { jsonLanguage } from "@codemirror/lang-json";
import { HexView } from "../HexView";

const protobufGrammar = langs.protobuf();

function getDefaultScalarValue(field: Field) {
  const defaultValue = field.getOption("default");
  if (defaultValue !== undefined) {
    console.log(`default value for ${field.name}:`, defaultValue);
    return defaultValue;
  }

  switch (field.type) {
    case "int32":
    case "int64":
    case "uint32":
    case "uint64":
    case "sint32":
    case "sint64":
    case "fixed32":
    case "fixed64":
    case "sfixed32":
    case "sfixed64":
    case "float":
    case "double":
      return 0;
    case "bool":
      return false;
    case "string":
      return "";
    case "bytes":
      return new Uint8Array(0);
    default:
      return null;
  }
}

function getDefaultMessageForType(type: Type) {
  let message: any = {};
  let partOfs: OneOf[] = [];
  for (const field of type.fieldsArray) {
    const subType = field.resolve();

    if (subType.partOf && partOfs.includes(subType.partOf)) {
      continue;
    }

    if (subType.resolvedType === null) {
      const scalar = getDefaultScalarValue(subType);
      if (subType.repeated) {
        message[field.name] = [scalar];
      } else {
        message[field.name] = scalar;
      }
      continue;
    }

    if (subType.resolvedType instanceof Enum) {
      let value = 0;
      const defaultValueName = subType.getOption("default");
      if (defaultValueName !== undefined) {
        value = subType.resolvedType.values[defaultValueName];

        const defaultValueIdx = Object.entries(
          subType.resolvedType.values
        ).findIndex((value) => value[0] === defaultValueName);
        if (defaultValueIdx !== -1) {
          value = defaultValueIdx;
        }
      }
      if (subType.repeated) {
        message[field.name] = [value];
      } else {
        message[field.name] = value;
      }
      continue;
    }

    const defMessage = getDefaultMessageForType(subType.resolvedType);
    if (subType.repeated) {
      message[field.name] = [defMessage];
    } else {
      message[field.name] = defMessage;
    }

    if (subType.partOf) {
      partOfs.push(subType.partOf);
    }
  }

  return message;
}

export function Editor() {
  const { colorMode } = useColorMode();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(50); // percentage

  const editorHeight = "400px";

  const [protoText, setProtoText] = useState(`message Color {
      required uint32 r = 1;
      required uint32 g = 2;
      required uint32 b = 3;
  }`);

  const [jsonText, setJsonText] = useState("");

  const [messageType, setMessageType] = useState<string | undefined>();

  const parsedProtoDef = useMemo(() => {
    if (protoText === "") {
      return null;
    }

    try {
      return parse(protoText);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) return e.message;
      return null;
    }
  }, [protoText]);

  const selectedType = useMemo(() => {
    if (
      parsedProtoDef === null ||
      typeof parsedProtoDef === "string" ||
      messageType === undefined
    ) {
      return null;
    }
    try {
      return parsedProtoDef?.root?.lookupType(messageType);
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [parsedProtoDef, messageType]);

  const buffer = useMemo(() => {
    if (selectedType === null) return new Uint8Array(0);

    try {
      return selectedType.encode(JSON5.parse(jsonText)).finish();
    } catch (e) {
      console.error("Error encoding JSON to buffer:", e);
      return new Uint8Array(0);
    }
  }, [jsonText, selectedType]);

  const typeDefinition = useMemo(() => {
    if (buffer.byteLength === 0) return null;

    try {
      return decodeBytes(buffer);
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [buffer]);

  useEffect(() => {
    if (selectedType === null) return;

    try {
      const defaultMessage = getDefaultMessageForType(selectedType);

      setJsonText(JSON.stringify(defaultMessage, null, 2));
    } catch (e) {
      console.error(e);
    }
  }, [selectedType]);

  const typeOptions = useMemo(() => {
    if (typeof parsedProtoDef === "string") return [];

    return (
      Object.values(parsedProtoDef?.root?.nested ?? {})
        //hide enums
        .filter(
          (message) => message instanceof Type && message.fieldsArray.length > 0
        )
        .map((message) => message.name)
    );
  }, [parsedProtoDef]);

  // Handle the start of dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle the dragging motion
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const mouseX = e.clientX - containerRect.left;

      // Calculate new width percentage
      let newLeftWidth = (mouseX / containerWidth) * 100;

      // Set limits to prevent panels from becoming too small
      newLeftWidth = Math.max(20, Math.min(80, newLeftWidth));

      setLeftPanelWidth(newLeftWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <Card p={4} mb={6} variant="outline" display="flex" flexDirection="column">
      <VStack spacing={4} width="100%">
        {typeof parsedProtoDef !== "string" && (
          <Select
            placeholder="Select message type"
            onChange={(e) => setMessageType(e.target.value)}
          >
            {typeOptions.map((message, idx) => (
              <option key={idx}>{message}</option>
            ))}
          </Select>
        )}

        <Box width="100%" position="relative" ref={containerRef}>
          <HStack spacing={0} width="100%" position="relative">
            {/* Left editor */}
            <Box width={`${leftPanelWidth}%`} pr={2}>
              <CodeMirror
                value={protoText}
                width="100%"
                height={editorHeight}
                extensions={[protobufGrammar]}
                theme={colorMode === "light" ? "light" : tokyoNightStorm}
                onChange={(value) => {
                  setProtoText(value);
                }}
              />
            </Box>

            {/* Draggable divider */}
            <Box
              position="absolute"
              top={0}
              left={`${leftPanelWidth}%`}
              height={editorHeight}
              width="6px"
              bg={colorMode === "light" ? "gray.200" : "gray.600"}
              transform="translateX(-50%)"
              cursor="col-resize"
              zIndex={10}
              onMouseDown={handleMouseDown}
              _hover={{ bg: colorMode === "light" ? "blue.300" : "blue.500" }}
              transition="background-color 0.2s"
              opacity={isDragging ? 1 : 0.7}
              borderRadius="sm"
            />

            {/* Right editor */}
            <Box width={`${100 - leftPanelWidth}%`} pl={2}>
              <CodeMirror
                value={jsonText}
                width="100%"
                height={editorHeight}
                extensions={[jsonLanguage]}
                theme={colorMode === "light" ? "light" : tokyoNightStorm}
                onChange={(value) => {
                  setJsonText(value);
                }}
              />
            </Box>
          </HStack>
        </Box>

        <Box width="100%">
          <HexView buffer={buffer} rootMessage={typeDefinition} />
        </Box>
      </VStack>
    </Card>
  );
}
