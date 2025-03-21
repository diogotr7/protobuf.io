import { Inspector } from "./Inspector";
import {
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Link,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { Editor } from "./Editor";

export function App() {
  return (
    <Container maxW="container.lg" py={2}>
      <HStack justify="space-between" align="center" mb={4}>
        <Heading>protobuf.io</Heading>
        <Link href="https://github.com/diogotr7/protobuf-inspector" isExternal>
          <IconButton
            aria-label="GitHub repository"
            icon={<FaGithub />}
            variant="ghost"
            fontSize="24px"
          />
        </Link>
      </HStack>

      <Tabs variant="solid-rounded" isFitted defaultIndex={0}>
        <TabList mb={2}>
          <Tab>Inspector</Tab>
          <Tab>Editor</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <Inspector />
          </TabPanel>
          <TabPanel p={0}>
            <Editor />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}
