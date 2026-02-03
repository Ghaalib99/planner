import { Box, Heading, Text } from "@chakra-ui/react";

export default function DocumentsPage() {
  return (
    <Box>
      <Heading size="2xl" mb={4} color="gray.800">
        Document Management
      </Heading>
      <Text color="gray.600">
        Manage your documents.
      </Text>
    </Box>
  );
}
