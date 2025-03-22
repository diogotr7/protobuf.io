import { useToast } from "@chakra-ui/react";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  arrayBufferToBase64,
  arrayBufferToHex,
  base64ToArrayBuffer,
  decimalBytesToArrayBuffer,
  hexToArrayBuffer,
} from "../utils/conversions";

interface BufferContextType {
  buffer: Uint8Array;
  setBuffer: (buffer: Uint8Array) => void;
  handleCopyb64: () => void;
  handleCopyHex: () => void;
  handleCopyDecimal: () => void;
  handlePasteb64: () => void;
  handlePasteHex: () => void;
  handlePasteDecimal: () => void;
  handleUploadFile: () => void;
  handleDownloadFile: () => void;
  handleShare: () => void;
  clear: () => void;
}

const BufferContext = createContext<BufferContextType | undefined>(undefined);

export function BufferProvider({ children }: { children: ReactNode }) {
  const [buffer, setBuffer] = useState<Uint8Array>(new Uint8Array());
  const toast = useToast();

  // Effect to handle URL params when component mounts or URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const b64Param = searchParams.get("data");

    if (b64Param) {
      try {
        // Decode base64 URL parameter
        const decodedB64 = decodeURIComponent(b64Param);
        const newBuffer = base64ToArrayBuffer(decodedB64);
        setBuffer(newBuffer);
        history.replaceState({}, document.title, location.pathname);
      } catch (e) {
        console.error("Error decoding URL parameter:", e);
        toast({
          title: "Error decoding URL parameter",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  }, [location.search, toast]);

  const getShareableLink = useCallback(() => {
    if (buffer.byteLength === 0) return "";

    const b64String = arrayBufferToBase64(buffer);
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?data=${encodeURIComponent(b64String)}`;
  }, [buffer]);

  // Handler for copy button - copies base64 encoded data
  const handleCopyb64 = useCallback(() => {
    if (buffer.byteLength > 0) {
      const b64String = arrayBufferToBase64(buffer);
      navigator.clipboard.writeText(b64String);
      toast({
        title: "Base64 data copied",
        status: "success",
        duration: 2000,
      });
    } else {
      toast({
        title: "Nothing to copy",
        status: "info",
        duration: 2000,
      });
    }
  }, [buffer, toast]);

  const handleCopyHex = useCallback(() => {
    if (buffer.byteLength > 0) {
      const hexString = arrayBufferToHex(buffer);
      navigator.clipboard.writeText(hexString);
      toast({
        title: "Hex data copied",
        status: "success",
        duration: 2000,
      });
    } else {
      toast({
        title: "Nothing to copy",
        status: "info",
        duration: 2000,
      });
    }
  }, [buffer, toast]);

  // Handler for paste button - expects base64 encoded data
  const handlePasteb64 = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        try {
          const newBuffer = base64ToArrayBuffer(text.trim());
          setBuffer(newBuffer);
          toast({
            title: "Base64 data pasted",
            status: "success",
            duration: 2000,
          });
        } catch (e) {
          toast({
            title: "Invalid base64 data",
            status: "error",
            duration: 3000,
          });
        }
      }
    } catch (err) {
      toast({
        title: "Failed to read clipboard",
        description: "Please check browser permissions",
        status: "error",
        duration: 3000,
      });
    }
  }, [toast]);

  const handlePasteHex = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        try {
          const newBuffer = hexToArrayBuffer(text.trim());
          setBuffer(newBuffer);
          toast({
            title: "Hex data pasted",
            status: "success",
            duration: 2000,
          });
        } catch (e) {
          toast({
            title: "Invalid hex data",
            status: "error",
            duration: 3000,
          });
        }
      }
    } catch (err) {
      toast({
        title: "Failed to read clipboard",
        description: "Please check browser permissions",
        status: "error",
        duration: 3000,
      });
    }
  }, [toast]);

  const handleUploadFile = useCallback(async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".bin";
    fileInput.onchange = async () => {
      const file = fileInput.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const buffer = e.target?.result;
          if (buffer instanceof ArrayBuffer) {
            setBuffer(new Uint8Array(buffer));
          }
        };
        reader.readAsArrayBuffer(file);
      }
    };
    fileInput.click();
  }, []);

  const handleDownloadFile = useCallback(() => {
    if (buffer.byteLength > 0) {
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "protobuf.bin";
      a.click();
      URL.revokeObjectURL(url);
    } else {
      toast({
        title: "Nothing to download",
        status: "info",
        duration: 2000,
      });
    }
  }, [buffer, toast]);

  const handleCopyDecimal = useCallback(() => {
    if (buffer.byteLength > 0) {
      const decimalString = Array.from(buffer).join(", ");
      navigator.clipboard.writeText(decimalString);
      toast({
        title: "Decimal data copied",
        status: "success",
        duration: 2000,
      });
    } else {
      toast({
        title: "Nothing to copy",
        status: "info",
        duration: 2000,
      });
    }
  }, [buffer, toast]);

  const handlePasteDecimal = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        try {
          const newBuffer = decimalBytesToArrayBuffer(text.trim());
          setBuffer(newBuffer);
          toast({
            title: "Decimal data pasted",
            status: "success",
            duration: 2000,
          });
        } catch (e) {
          toast({
            title: "Invalid decimal data",
            status: "error",
            duration: 3000,
          });
        }
      }
    } catch (err) {
      toast({
        title: "Failed to read clipboard",
        description: "Please check browser permissions",
        status: "error",
        duration: 3000,
      });
    }
  }, [toast]);

  // Handler for share button
  const handleShare = useCallback(() => {
    if (buffer.byteLength > 0) {
      const shareableLink = getShareableLink();

      navigator.clipboard.writeText(shareableLink);
      toast({
        title: "Link copied to clipboard",
        status: "success",
        duration: 2000,
      });
    } else {
      toast({
        title: "Nothing to share",
        status: "info",
        duration: 2000,
      });
    }
  }, [buffer, getShareableLink, toast]);

  const clear = useCallback(() => {
    setBuffer(new Uint8Array(0));
  }, []);

  const value = useMemo(
    () => ({
      buffer,
      setBuffer,
      handleCopyb64,
      handleCopyHex,
      handleCopyDecimal,
      handlePasteb64,
      handlePasteHex,
      handlePasteDecimal,
      handleUploadFile,
      handleDownloadFile,
      handleShare,
      clear,
    }),
    [
      buffer,
      setBuffer,
      handleCopyb64,
      handleCopyHex,
      handleCopyDecimal,
      handlePasteb64,
      handlePasteHex,
      handlePasteDecimal,
      handleUploadFile,
      handleDownloadFile,
      handleShare,
      clear,
    ]
  );

  return (
    <BufferContext.Provider value={value}>{children}</BufferContext.Provider>
  );
}

export function useBuffer() {
  const context = useContext(BufferContext);
  if (context === undefined) {
    throw new Error("useBuffer must be used within a BufferProvider");
  }
  return context;
}
