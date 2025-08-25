import { HStack, Text, Select, Spacer } from "@chakra-ui/react";
import { useState } from "react";
import { Fixed64 } from "../../protobuf/primitives";

const reprs = ["int", "uint", "double"] as const;
type Float64Representation = (typeof reprs)[number];

export function Fixed64Display({ fixed64 }: { fixed64: Fixed64 }) {
  const [repr, setRepr] = useState<Float64Representation>("int");

  //let the user switch between representations
  return (
    <HStack justify="space-between">
      {repr === "uint" && (
        <Text fontFamily="mono">{fixed64.data.uint64Representation}</Text>
      )}
      {repr === "int" && (
        <Text fontFamily="mono">{fixed64.data.int64Representation}</Text>
      )}
      {repr === "double" && (
        <Text fontFamily="mono">{fixed64.data.doubleRepresentation}</Text>
      )}
      <Spacer />
      <Select
        size="sm"
        onChange={(e) => setRepr(e.target.value as Float64Representation)}
        maxW="6em"
      >
        {reprs.map((repr) => (
          <option key={repr} value={repr}>
            {repr}
          </option>
        ))}
      </Select>
    </HStack>
  );
}
