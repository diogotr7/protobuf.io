import { Stack, HStack, Badge } from "@chakra-ui/react";
import { DataDisplay } from "./DataDisplay";
import { Field } from "../types";

export function RepeatedFieldDisplay({
  fields,
  depth,
}: {
  fields: Field[];
  depth: number;
}) {
  return (
    <Stack w="full" spacing={2} align="stretch">
      <HStack>
        <Badge colorScheme="green">InnerTag: {fields[0].tag}</Badge>
        <Badge colorScheme="blue">Repeated {fields.length}</Badge>
      </HStack>
      {fields.map((field, idx) => (
        <DataDisplay key={idx} field={field} depth={depth} />
      ))}
    </Stack>
  );
}
