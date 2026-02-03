"use client";

import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { PlannerTabs } from "@/components/planner/PlannerTabs";
import { PlannerHeader } from "@/components/planner/PlannerHeader";
import { CalendarView } from "@/components/planner/CalendarView";
import { useState } from "react";
import { Select } from "@chakra-ui/react";

export default function PlannerPage() {
  const [activeTab, setActiveTab] = useState("live");
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 8));

  return (
    <Box>
      <Flex
        p={6}
        align="center"
        borderBottomWidth={1}
        borderBottomColor="#D9E5F2"
        borderBottomStyle="solid"
        mb={4}
        justify="space-between"
      >
        <Heading size="2xl" mb={4} color="gray.800">
          Planner
        </Heading>
      </Flex> 

      <Box p={{ base: 4, md: 6 }}>
        <PlannerTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <PlannerHeader
          currentDate={currentDate}
          onDateChange={setCurrentDate}
        />

        <CalendarView />
      </Box>
    </Box>
  );
}
