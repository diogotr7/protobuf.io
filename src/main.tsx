import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, extendTheme, ThemeConfig } from "@chakra-ui/react";
import { ProtobufDisplay } from "./components/ProtobufDisplay";

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: true,
};

const theme = extendTheme({ config });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <ProtobufDisplay />
    </ChakraProvider>
  </StrictMode>
);
