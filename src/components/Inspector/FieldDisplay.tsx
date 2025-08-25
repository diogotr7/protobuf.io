import { Card, HStack, Badge, Spacer } from "@chakra-ui/react";
import { DataDisplay } from "./DataDisplay";
import { Field } from "../../protobuf/field";

export function FieldDisplay({ field }: { field: Field }) {
  const { fieldHeader, fieldBody } = field;

  return (
    <Card variant="outline" p={2} mt={2}>
      <HStack mb={2}>
        <Badge colorScheme="purple">Field {fieldHeader.data.fieldNumber}</Badge>
        <Badge colorScheme="teal">Type {fieldBody.fieldType}</Badge>
        <Spacer />
        <Badge colorScheme="yellow">{fieldHeader.offset} offset</Badge>
        <Badge colorScheme="red">{fieldHeader.size} tag</Badge>
        <Badge colorScheme="red">{fieldBody.fieldData.size} data</Badge>
      </HStack>
      <DataDisplay field={field} />
    </Card>
  );
}
