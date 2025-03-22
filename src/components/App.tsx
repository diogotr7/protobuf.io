import { Inspector } from "./Inspector";
import {
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Link,
  IconButton,
  HStack,
  Text,
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { Editor } from "./Editor";

export function App() {
  return (
    <Container maxW="container.xl" py={2}>
      <HStack justify="space-between" align="center" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          protobuf.io
        </Text>
        <Link href="https://github.com/diogotr7/protobuf.io" isExternal>
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
