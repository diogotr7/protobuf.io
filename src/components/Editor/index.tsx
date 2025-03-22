import {
  Box,
  Card,
  HStack,
  Select,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import { Enum, Field, OneOf, parse, Type } from "protobufjs";
import { useState, useMemo, useEffect } from "react";
import { langs } from "@uiw/codemirror-extensions-langs";
import { tokyoNightStorm } from "@uiw/codemirror-theme-tokyo-night-storm";
import CodeMirror from "@uiw/react-codemirror";
import { HexView } from "../Inspector/HexView";
import { decodeBytes } from "../../protobuf/decode";
import JSON5 from "json5";
import { jsonLanguage } from "@codemirror/lang-json";

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

        <HStack spacing={4} width="100%">
          <Box flex="1">
            <CodeMirror
              value={protoText}
              width="100%"
              height="300px"
              extensions={[protobufGrammar]}
              theme={colorMode === "light" ? "light" : tokyoNightStorm}
              onChange={(value) => {
                setProtoText(value);
              }}
            />
          </Box>
          <Box flex="1">
            <CodeMirror
              value={jsonText}
              width="100%"
              height="300px"
              extensions={[jsonLanguage]}
              theme={colorMode === "light" ? "light" : tokyoNightStorm}
              onChange={(value) => {
                setJsonText(value);
              }}
            />
          </Box>
        </HStack>

        <Box width="100%">
          <HexView buffer={buffer} rootMessage={typeDefinition} />
        </Box>
      </VStack>
    </Card>
  );
}
