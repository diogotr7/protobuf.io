import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  useDisclosure,
  Card,
  Stack,
  HStack,
  Badge,
  Spacer,
  Button,
  Collapse,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { DataDisplay } from "./DataDisplay";
import { Message } from "../types";

export function MessageDisplay({
  message,
  depth,
}: {
  message: Message;
  depth: number;
}) {
  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: true,
  });
  const asArray = useMemo(
    () => Array.from(message.fields.entries()),
    [message]
  );

  return (
    <Card ml={depth * 2} p={2} variant="outline">
      {/* margin 0 here and mt 2 in the Card to behave properly with collapse */}
      <Stack spacing={0}>
        <HStack>
          <Badge colorScheme="orange">Message</Badge>
          <Spacer />
          {message.headerSize > 0 && (
            <Badge colorScheme="red">{message.headerSize} tag</Badge>
          )}
          <Badge colorScheme="red">{message.dataSize} data</Badge>
          <Button size="xs" onClick={onToggle}>
            {isOpen ? <ChevronDownIcon /> : <ChevronUpIcon />}
          </Button>
        </HStack>
        <Collapse in={isOpen} animateOpacity startingHeight={0.0001}>
          {asArray.map(([fieldNumber, field], idx) => (
            <Card variant="outline" key={idx} p={4} mt={2}>
              <HStack mb={2}>
                <Badge colorScheme="purple">Field {fieldNumber}</Badge>
                <Badge colorScheme="teal">Type: {field.type}</Badge>
                <Spacer />
                <Badge colorScheme="red">{field.tagBytes} tag</Badge>
                <Badge colorScheme="red">{field.dataBytes} data</Badge>
              </HStack>
              <DataDisplay field={field} depth={depth + 1} />
            </Card>
          ))}
        </Collapse>
      </Stack>
    </Card>
  );
}
