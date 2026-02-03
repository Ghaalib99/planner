import { Box, Heading, Text } from "@chakra-ui/react";

export default function HomePage() {
  return (
    <Box>
      <Heading size="2xl" mb={4} color="gray.800">
        Startpagina
      </Heading>
      <Text color="gray.600">
        Welcome to the home page.
      </Text>
    </Box>
  );
}
