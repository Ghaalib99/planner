import { Box, Heading, Text } from "@chakra-ui/react";

export default function MijnRoosterPage() {
  return (
    <Box>
      <Heading size="2xl" mb={4} color="gray.800">
        Mijn Rooster
      </Heading>
      <Text color="gray.600">
        Your personal schedule.
      </Text>
    </Box>
  );
}
