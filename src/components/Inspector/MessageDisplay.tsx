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
import { FieldDisplay } from "./FieldDisplay";
import { Message } from "../../protobuf/message";

export function MessageDisplay({ message }: { message: Message }) {
  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: true,
  });

  return (
    <Card p={2} variant="outline">
      {/* margin 0 here and mt 2 in the Card to behave properly with collapse */}
      <Stack spacing={0}>
        <HStack>
          <Badge colorScheme="orange">Message</Badge>
          <Spacer />
          <Badge colorScheme="yellow">{message.offset} offset</Badge>
          <Button size="xs" onClick={onToggle}>
            {isOpen ? <ChevronDownIcon /> : <ChevronUpIcon />}
          </Button>
        </HStack>
        <Collapse in={isOpen} animateOpacity startingHeight={0.0001}>
          {message.data.fields.map((field, idx) => (
            <FieldDisplay key={idx} field={field} />
          ))}
        </Collapse>
      </Stack>
    </Card>
  );
}
