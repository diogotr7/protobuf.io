import { useColorMode, Card, Divider, Text } from "@chakra-ui/react";
import { tokyoNightStorm } from "@uiw/codemirror-theme-tokyo-night-storm";
import { IParserResult, parse } from "protobufjs";
import { useState, useEffect } from "react";
import { langs } from "@uiw/codemirror-extensions-langs";
import CodeMirror from "@uiw/react-codemirror";

const protobufGrammar = langs.protobuf();

export function ProtoDefinitionEditor() {
  const colorMode = useColorMode();

  const [text, setText] = useState("// Paste your protobuf data here");

  const [parsedProtoDef, setParsedProtoDef] = useState<
    IParserResult | string | null
  >(null);

  useEffect(() => {
    if (text === "") {
      setParsedProtoDef(null);
      return;
    }
    try {
      setParsedProtoDef(parse(text));
    } catch (e) {
      if (e instanceof Error) setParsedProtoDef(e.message);
    }
  }, [text]);

  return (
    <Card p={4} mb={6} variant="outline">
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
      <Divider my={4} />

      <CodeMirror
        value={text}
        height="200px"
        extensions={[protobufGrammar]}
        theme={colorMode.colorMode === "light" ? "light" : tokyoNightStorm}
        onChange={(value, _) => {
          setText(value);
        }}
      />
    </Card>
  );
}
