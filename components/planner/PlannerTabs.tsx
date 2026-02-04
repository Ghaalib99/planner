"use client";

import { Box, HStack, Text } from "@chakra-ui/react";

interface Tab {
  id: string;
  label: string;
}

const tabs: Tab[] = [
  { id: "live", label: "Live" },
  { id: "planner", label: "Planner" },
];

interface PlannerTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const PlannerTabs = ({ activeTab, onTabChange }: PlannerTabsProps) => {
  const colors = activeTab === "live" 
    ? { bg: "#FF6669/10", border: "#FF6669", active: "#FF383C" }
    : { bg: "#5653FC/10", border: "#5653FC", active: "#5653FC" };
  
  const description = activeTab === "live" 
    ? "Description of the live" 
    : "Description of the planner view";

  return (
    <HStack gap={2} mb={4} p={1} flexWrap="wrap" rounded="full" bg={colors.bg} borderWidth={1} borderColor={colors.border}>
      <Box bg="white" p={1} rounded="full" display="flex" gap={2}>
      {tabs.map((tab) => (
        <Box
          key={tab.id}
          as="button"
          px={4}
          py={1.5}
          borderRadius="full"
          bg={activeTab === tab.id ? colors.active : "white"}
          color={activeTab === tab.id ? "white" : "gray.600"}
          fontSize="sm"
          fontWeight="500"
          cursor="pointer"
          transition="all 0.2s"
          _hover={{
            bg: activeTab === tab.id ? colors.active : "gray.100",
          }}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </Box>
      ))}
      </Box>
        <Text ml={2} color="#242424">{description}</Text>
      
    </HStack>
  );
};
