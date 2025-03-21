import { Card, HStack, Badge, Spacer } from "@chakra-ui/react";
import { FieldWithNumber } from "../../types";
import { DataDisplay } from "./DataDisplay";

export function FieldDisplay({ field }: { field: FieldWithNumber }) {
  return (
    <Card variant="outline" p={2} mt={2}>
      <HStack mb={2}>
        <Badge colorScheme="purple">Field {field.fieldNumber}</Badge>
        <Badge colorScheme="teal">Type: {field.type}</Badge>
        <Spacer />
        <Badge colorScheme="yellow">{field.offset} offset</Badge>
        <Badge colorScheme="red">{field.tagSize} tag</Badge>
        <Badge colorScheme="red">{field.dataSize} data</Badge>
      </HStack>
      <DataDisplay field={field} />
    </Card>
  );
}
