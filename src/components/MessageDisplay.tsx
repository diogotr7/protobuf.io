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
import { Message } from "../types";
import { FieldDisplay } from "./FieldDisplay";

export function MessageDisplay({ message }: { message: Message }) {
  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: true,
  });
  const asArray = useMemo(
    () => Array.from(message.fields.entries()),
    [message]
  );

  return (
    <Card p={2} variant="outline">
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
            <FieldDisplay key={idx} field={[fieldNumber, field]} />
          ))}
        </Collapse>
      </Stack>
    </Card>
  );
}
