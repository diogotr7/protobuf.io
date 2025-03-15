import { HStack, Text, Select, Spacer } from "@chakra-ui/react";
import { useState } from "react";
import { VarInt } from "../types/field";

const reprs = ["int", "uint", "sint"] as const;
type VarIntRepresentation = (typeof reprs)[number];

export function VarIntDisplay({ varInt: varInt }: { varInt: VarInt }) {
  const [repr, setRepr] = useState<VarIntRepresentation>("int");

  //let the user switch between representations
  return (
    <HStack justify="space-between">
      {repr === "uint" && <Text fontFamily="mono">{varInt.uint}</Text>}
      {repr === "int" && <Text fontFamily="mono">{varInt.int}</Text>}
      {repr === "sint" && <Text fontFamily="mono">{varInt.sint}</Text>}
      <Spacer />
      <Select
        size="sm"
        onChange={(e) => setRepr(e.target.value as VarIntRepresentation)}
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
