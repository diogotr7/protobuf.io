import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, extendTheme, ThemeConfig } from "@chakra-ui/react";
import { App } from "./components/App";
import { BufferProvider } from "./contexts/BufferContext";

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: true,
};

const theme = extendTheme({ config });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <BufferProvider>
        <App />
      </BufferProvider>
    </ChakraProvider>
  </StrictMode>
);
