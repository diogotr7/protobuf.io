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
import { examples } from "../utils/exampleBuffers";
import { HexView } from "./HexView"; // Import the new component

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
        </Flex>
      </Card>

      {/* Add the HexView component here, between the buttons and the message display */}
      {buffer.byteLength > 0 && (
        <HexView
          buffer={buffer}
          rootMessage={typeDefinition}
          bytesPerRow={32}
        />
      )}

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
