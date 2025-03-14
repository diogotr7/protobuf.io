import { Card, HStack, Badge, Spacer } from "@chakra-ui/react";
import { SizedRawField } from "../types";
import { DataDisplay } from "./DataDisplay";

export function FieldDisplay({ field }: { field: [number, SizedRawField] }) {
  return (
    <Card variant="outline" p={2} mt={2}>
      <HStack mb={2}>
        <Badge colorScheme="purple">Field {field[0]}</Badge>
        <Badge colorScheme="teal">Type: {field[1].type}</Badge>
        <Spacer />
        <Badge colorScheme="yellow">{field[1].offset} offset</Badge>
        <Badge colorScheme="red">{field[1].tagSize} tag</Badge>
        <Badge colorScheme="red">{field[1].dataSize} data</Badge>
      </HStack>
      <DataDisplay field={field[1]} />
    </Card>
  );
}
