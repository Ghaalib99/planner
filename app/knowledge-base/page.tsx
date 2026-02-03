import { Box, Heading, Text } from "@chakra-ui/react";

export default function KnowledgeBasePage() {
  return (
    <Box>
      <Heading size="2xl" mb={4} color="gray.800">
        Knowledge Base
      </Heading>
      <Text color="gray.600">
        Browse knowledge base articles.
      </Text>
    </Box>
  );
}
