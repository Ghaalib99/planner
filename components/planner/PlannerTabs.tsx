"use client";

import { Box, HStack, Text } from "@chakra-ui/react";

interface Tab {
  id: string;
  label: string;
}

const tabs: Tab[] = [
  { id: "live", label: "Live" },
  { id: "planner", label: "Planner" },
  // { id: "description", label: "Description of the live" },
];

interface PlannerTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const PlannerTabs = ({ activeTab, onTabChange }: PlannerTabsProps) => {
  return (
    <HStack gap={2} mb={4} p={1} flexWrap="wrap" rounded="full" bg="#FF6669/10" borderWidth={1} borderColor="#FF6669">
      <Box bg="white" p={1} rounded="full" display="flex" gap={2}>
      {tabs.map((tab) => (
        <Box
          key={tab.id}
          as="button"
          px={4}
          py={1.5}
          borderRadius="full"
          bg={activeTab === tab.id ? "#FF383C" : "white"}
          color={activeTab === tab.id ? "white" : "gray.600"}
          fontSize="sm"
          fontWeight="500"
          cursor="pointer"
          transition="all 0.2s"
          _hover={{
            bg: activeTab === tab.id ? "red.500" : "gray.100",
          }}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </Box>
      ))}
      </Box>
        <Text ml={2} color="#242424">Description of the live</Text>
      
    </HStack>
  );
};
