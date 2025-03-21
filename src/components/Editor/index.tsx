import {
  Box,
  Card,
  HStack,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import { IParserResult, parse } from "protobufjs";
import { useState, useEffect, useMemo } from "react";
import { langs } from "@uiw/codemirror-extensions-langs";
import { tokyoNightStorm } from "@uiw/codemirror-theme-tokyo-night-storm";
import CodeMirror from "@uiw/react-codemirror";
import { HexView } from "../Inspector/HexView";
import { decodeBytes } from "../../protobuf";
import JSON5 from "json5";

const protobufGrammar = langs.protobuf();
const jsonGrammar = langs.json();

export function Editor() {
  const { colorMode } = useColorMode();

  const [protoText, setProtoText] = useState(`message RGB24 {
    required uint32 r = 1;
    required uint32 g = 2;
    required uint32 b = 3;
}`);

  const [jsonText, setJsonText] = useState(`{
    "r": 255,
    "g": 0,
    "b": 0
}`);

  const [buffer, setBuffer] = useState(new Uint8Array(0));

  const [parsedProtoDef, setParsedProtoDef] = useState<
    IParserResult | string | null
  >(null);

  useEffect(() => {
    if (protoText === "") {
      setParsedProtoDef(null);
      return;
    }
    try {
      setParsedProtoDef(parse(protoText));
    } catch (e) {
      if (e instanceof Error) setParsedProtoDef(e.message);
    }
  }, [protoText]);

  useEffect(() => {
    //encode json to buffer using proto definition
    if (parsedProtoDef === null || typeof parsedProtoDef === "string") {
      return;
    }

    try {
      const buffer = parsedProtoDef.root
        .lookupType("RGB24")
        .encode(JSON5.parse(jsonText))
        .finish();

      setBuffer(buffer);
    } catch (e) {
      console.error("Error encoding JSON to buffer:", e);
    }
  }, [jsonText]);

  const typeDefinition = useMemo(() => {
    try {
      return buffer.byteLength > 0 ? decodeBytes(buffer) : null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [buffer]);

  return (
    <Card p={4} mb={6} variant="outline" display="flex" flexDirection="column">
      <VStack spacing={4} width="100%">
        <Box>
          {typeof parsedProtoDef === "string" ? (
            <Text color="red.500">{parsedProtoDef}</Text>
          ) : parsedProtoDef !== null ? (
            <Text color="green.500">
              Successfully parsed{" "}
              {Object.keys(parsedProtoDef?.root?.nested ?? {}).length} messages
            </Text>
          ) : (
            <Text color="gray.500">No valid protobuf data detected</Text>
          )}
        </Box>
        <Box width="100%">
          <HexView buffer={buffer} rootMessage={typeDefinition} />
        </Box>

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
              extensions={[jsonGrammar]}
              theme={colorMode === "light" ? "light" : tokyoNightStorm}
              onChange={(value) => {
                setJsonText(value);
              }}
            />
          </Box>
        </HStack>
      </VStack>
    </Card>
  );
}
