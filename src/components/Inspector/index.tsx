import { useCallback, useMemo } from "react";
import { decodeBytes } from "../../protobuf/decode";
import {
  Flex,
  Container,
  Card,
  Button,
  ButtonGroup,
  Text,
  useToast,
  Tooltip,
  Wrap,
  HStack,
  Stack,
} from "@chakra-ui/react";
import { MessageDisplay } from "./MessageDisplay";
import { useProtoActions as useBufferManagement } from "../../hooks/useProtoActions";
import { useLinkSharing } from "../../hooks/useLinkSharing";
import { InfoIcon } from "@chakra-ui/icons";
import { examples } from "../../utils/exampleBuffers";
import { HexView } from "./HexView";

export function Inspector() {
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

  return (
    <Container
      maxW="container.lg"
      p={0}
      display="flex"
      flexDirection="column"
      gap={2}
    >
      <Card p={2} variant="outline">
        <Flex direction="column" gap={2}>
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

      {buffer.byteLength > 0 && (
        <HexView buffer={buffer} rootMessage={typeDefinition} />
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
