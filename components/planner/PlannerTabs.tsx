"use client";

import { Box, HStack, Text } from "@chakra-ui/react";

interface Tab {
  id: string;
  label: string;
}

const tabs: Tab[] = [
  { id: "live", label: "Live" },
  { id: "planner", label: "Planner" },
  { id: "description", label: "Description of the live" },
];

interface PlannerTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const PlannerTabs = ({ activeTab, onTabChange }: PlannerTabsProps) => {
  return (
    <HStack gap={2} mb={4} flexWrap="wrap">
      {tabs.map((tab) => (
        <Box
          key={tab.id}
          as="button"
          px={4}
          py={2}
          borderRadius="full"
          bg={activeTab === tab.id ? "red.500" : "transparent"}
          color={activeTab === tab.id ? "white" : "gray.600"}
          fontSize="sm"
          fontWeight="500"
          cursor="pointer"
          transition="all 0.2s"
          _hover={{
            bg: activeTab === tab.id ? "red.600" : "gray.100",
          }}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </Box>
      ))}
    </HStack>
  );
};
