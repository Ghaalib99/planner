import { Box, Heading, Text } from "@chakra-ui/react";

export default function DepartmentNewsPage() {
  return (
    <Box>
      <Heading size="2xl" mb={4} color="gray.800">
        Department News
      </Heading>
      <Text color="gray.600">
        Latest news from your department.
      </Text>
    </Box>
  );
}
