import { Card, HStack, Badge, Spacer } from "@chakra-ui/react";
import { SizedField } from "../types";
import { DataDisplay } from "./DataDisplay";

export function FieldDisplay({ field }: { field: [number, SizedField] }) {
  return (
    <Card variant="outline" p={2} mt={2}>
      <HStack mb={2}>
        <Badge colorScheme="purple">Field {field[0]}</Badge>
        <Badge colorScheme="teal">Type: {field[1].type}</Badge>
        <Spacer />
        <Badge colorScheme="red">{field[1].tagBytes} tag</Badge>
        <Badge colorScheme="red">{field[1].dataBytes} data</Badge>
      </HStack>
      <DataDisplay field={field[1]} />
    </Card>
  );
}
