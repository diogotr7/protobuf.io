import {
  Box,
  Card,
  Divider,
  HStack,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import { IParserResult, parse } from "protobufjs";
import { useState, useEffect } from "react";
import { langs } from "@uiw/codemirror-extensions-langs";
import { tokyoNightStorm } from "@uiw/codemirror-theme-tokyo-night-storm";
import CodeMirror from "@uiw/react-codemirror";

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
        <Divider />

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
