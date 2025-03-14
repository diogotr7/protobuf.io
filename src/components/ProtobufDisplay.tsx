import { useCallback, useMemo } from "react";
import { decodeBytes } from "../protobuf";
import {
  Flex,
  Container,
  Heading,
  Card,
  Button,
  ButtonGroup,
  Text,
  useToast,
  Box,
  Tooltip,
  Wrap,
  HStack,
  Stack,
} from "@chakra-ui/react";
import { MessageDisplay } from "./MessageDisplay";
import { bytesToHexDisplay } from "../utils/conversions";
import { useProtoActions as useBufferManagement } from "../hooks/useProtoActions";
import { useLinkSharing } from "../hooks/useLinkSharing";
import { InfoIcon } from "@chakra-ui/icons";

const examples = [
  new Uint8Array([
    10, 12, 114, 10, 8, 159, 48, 16, 225, 15, 24, 50, 32, 25, 10, 10, 18, 8, 8,
    1, 16, 15, 24, 30, 32, 0, 10, 4, 82, 2, 8, 0, 10, 5, 90, 3, 8, 140, 1,
  ]),
  new Uint8Array([
    10, 18, 8, 86, 16, 255, 255, 3, 24, 255, 255, 3, 32, 255, 255, 3, 40, 255,
    255, 3, 34, 46, 10, 14, 122, 12, 8, 159, 240, 3, 16, 255, 15, 24, 100, 32,
    139, 1, 10, 13, 50, 11, 8, 255, 1, 16, 8, 24, 2, 32, 255, 255, 3, 10, 13,
    50, 11, 8, 255, 1, 16, 4, 24, 2, 32, 224, 255, 3,
  ]),
  new Uint8Array([
    10, 19, 10, 17, 80, 114, 111, 102, 105, 108, 101, 32, 73, 110, 100, 105, 99,
    97, 116, 111, 114, 10, 7, 10, 5, 83, 111, 108, 105, 100, 10, 26, 10, 24, 84,
    121, 112, 105, 110, 103, 32, 83, 112, 101, 101, 100, 32, 77, 101, 116, 101,
    114, 32, 40, 75, 80, 83, 41, 10, 11, 10, 9, 75, 101, 121, 32, 68, 101, 112,
    116, 104,
  ]),
];

export function ProtobufDisplay() {
  const toast = useToast();

  const {
    buffer,
    setBuffer,
    handleCopyHex,
    handleCopyb64,
    handleCopyDecimal,
    handlePasteHex,
    handleDownloadFile,
    handlePasteb64,
    handlePasteDecimal,
    handleShare,
    handleUploadFile,
  } = useBufferManagement();

  useLinkSharing(setBuffer);

  const clear = useCallback(() => {
    setBuffer(new Uint8Array(0));
  }, [setBuffer]);

  const typeDefinition = useMemo(() => {
    try {
      return buffer.byteLength > 0 ? decodeBytes(buffer) : null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [buffer]);

  const bufferDisplay = useMemo(() => {
    if (buffer.byteLength === 0) return "";

    return bytesToHexDisplay(buffer);
  }, [buffer]);

  return (
    <Container maxW="container.lg" py={8}>
      <Heading mb={6}>Protobuf Inspector</Heading>

      <Card p={4} mb={6} variant="outline">
        <Flex direction="column" gap={4}>
          <Box>
            <Text fontWeight="bold" mb={2}>
              Current Buffer ({buffer.byteLength} bytes):
            </Text>
            <Card variant="outline" p={3}>
              <Text fontFamily="mono" fontSize="sm" noOfLines={2}>
                {bufferDisplay || "(empty)"}
              </Text>
            </Card>
          </Box>
          <Wrap spacing={3} justify="space-evenly">
            <Card p={2} mb={2} variant="outline">
              <Flex direction="column" gap={0}>
                <Tooltip
                  label={
                    "Format: CgxyCgifMBDhDxgyIBkKChIICAEQDxgeIAAKBFICCAAKBVoDCIwB"
                  }
                >
                  <InfoIcon color="gray.500" />
                </Tooltip>

                <Text fontWeight="bold" mb={2} textAlign="center">
                  Base64
                </Text>

                <HStack justify="center">
                  <ButtonGroup size="sm" variant="outline">
                    <Button onClick={handleCopyb64}>Copy</Button>
                    <Button onClick={handlePasteb64}>Paste</Button>
                  </ButtonGroup>
                </HStack>
              </Flex>
            </Card>

            <Card p={2} mb={2} variant="outline">
              <Flex direction="column" gap={0}>
                <Tooltip label={"Format: 00 A0 DE AD BE EF"}>
                  <InfoIcon color="gray.500" />
                </Tooltip>
                <Text fontWeight="bold" mb={2} textAlign="center">
                  Hex
                </Text>
                <HStack justify="center">
                  <ButtonGroup size="sm" variant="outline">
                    <Button onClick={handleCopyHex}>Copy</Button>
                    <Button onClick={handlePasteHex}>Paste</Button>
                  </ButtonGroup>
                </HStack>
              </Flex>
            </Card>

            <Card p={2} mb={2} variant="outline">
              <Flex direction="column" gap={0}>
                <Tooltip label={"Format: 8, 9, 16, 32"}>
                  <InfoIcon color="gray.500" />
                </Tooltip>
                <Text fontWeight="bold" mb={2} textAlign="center">
                  Decimal
                </Text>
                <HStack justify="center">
                  <ButtonGroup size="sm" variant="outline">
                    <Button onClick={handleCopyDecimal}>Copy</Button>
                    <Button onClick={handlePasteDecimal}>Paste</Button>
                  </ButtonGroup>
                </HStack>
              </Flex>
            </Card>

            <Card p={2} mb={2} variant="outline">
              <Flex direction="column" gap={0}>
                <Tooltip label={"Download or upload a file"}>
                  <InfoIcon color="gray.500" />
                </Tooltip>
                <Text fontWeight="bold" mb={2} textAlign="center">
                  File
                </Text>
                <HStack justify="center">
                  <ButtonGroup size="sm" variant="outline">
                    <Button onClick={handleDownloadFile}>Download</Button>
                    <Button onClick={handleUploadFile}>Upload</Button>
                  </ButtonGroup>
                </HStack>
              </Flex>
            </Card>

            <Card p={2} mb={2} variant="outline">
              <Flex direction="column" gap={0}>
                <Tooltip label={"Copy a link with the buffer data included"}>
                  <InfoIcon color="gray.500" />
                </Tooltip>
                <Text fontWeight="bold" mb={2} textAlign="center">
                  Sharing
                </Text>
                <HStack justify="center">
                  <ButtonGroup size="sm" variant="outline">
                    <Button onClick={handleShare}>Copy Link</Button>
                    <Button onClick={clear}>Clear</Button>
                  </ButtonGroup>
                </HStack>
              </Flex>
            </Card>
          </Wrap>
        </Flex>
      </Card>

      {typeDefinition !== null ? (
        <MessageDisplay message={typeDefinition} />
      ) : (
        <Card p={2} variant="outline">
          <Text mb={3}>
            No valid protobuf data detected. Try one of these examples:
          </Text>
          <Stack justify="center" spacing={2}>
            {examples.map((example, idx) => (
              <Button
                key={idx}
                onClick={() => {
                  setBuffer(example);
                  toast({
                    title: "Example loaded",
                    status: "success",
                    duration: 2000,
                  });
                }}
                size="sm"
              >
                Example {idx + 1} ({example.byteLength} bytes)
              </Button>
            ))}
          </Stack>
        </Card>
      )}
    </Container>
  );
}
