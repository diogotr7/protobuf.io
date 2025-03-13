import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  HStack,
  Text,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useState } from "react";
import { VarInt } from "../types";

const reprs = ["int", "uint", "sint", "boolean"] as const;
type VarIntRepresentation = (typeof reprs)[number];

export function VarIntDisplay({ varInt: varInt }: { varInt: VarInt }) {
  const [repr, setRepr] = useState<VarIntRepresentation>("int");

  //let the user switch between representations
  return (
    <HStack justify="space-between">
      {repr === "uint" && (
        <Text fontFamily="mono">{varInt.uint64Representation.toString()}</Text>
      )}
      {repr === "int" && (
        <Text fontFamily="mono">{varInt.int64Representation.toString()}</Text>
      )}
      {repr === "boolean" && (
        <Text fontFamily="mono">{varInt.booleanRepresentation.toString()}</Text>
      )}
      {repr === "sint" && (
        <Text fontFamily="mono">{varInt.sint64Representation.toString()}</Text>
      )}
      <Menu variant="outline" size="xs">
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          {repr}
        </MenuButton>
        <MenuList>
          {reprs.map((repr) => (
            <MenuItem key={repr} onClick={() => setRepr(repr)}>
              {repr}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </HStack>
  );
}
