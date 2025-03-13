import { useEffect } from "react";
import { base64ToArrayBuffer } from "../utils/conversions";
import { useToast } from "@chakra-ui/react";

export function useLinkSharing(setBuffer: (buffer: Uint8Array) => void) {
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
  }, [location.search, setBuffer, toast]);
}
