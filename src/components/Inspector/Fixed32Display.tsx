import { HStack, Text, Select, Spacer } from "@chakra-ui/react";
import { useState } from "react";
import { Fixed32 } from "../../protobuf/primitives";

const reprs = ["int", "uint", "float"] as const;
type Float32Representation = (typeof reprs)[number];

export function Fixed32Display({ fixed32 }: { fixed32: Fixed32 }) {
  const [repr, setRepr] = useState<Float32Representation>("int");

  //let the user switch between representations
  return (
    <HStack justify="space-between">
      {repr === "uint" && (
        <Text fontFamily="mono">{fixed32.data.uint32Representation}</Text>
      )}
      {repr === "int" && (
        <Text fontFamily="mono">{fixed32.data.int32Representation}</Text>
      )}
      {repr === "float" && (
        <Text fontFamily="mono">{fixed32.data.floatRepresentation}</Text>
      )}
      <Spacer />
      <Select
        size="sm"
        onChange={(e) => setRepr(e.target.value as Float32Representation)}
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
