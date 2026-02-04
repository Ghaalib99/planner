"use client";

import { Box, Flex, Heading, Text, NativeSelectRoot, NativeSelectField } from "@chakra-ui/react";
import { PlannerTabs } from "@/components/planner/PlannerTabs";
import { PlannerHeader } from "@/components/planner/PlannerHeader";
import { CalendarView } from "@/components/planner/CalendarView";
import { Roster } from "@/components/planner/Roster";
import { useState } from "react";
import { Add, Arrow, ArrowDown2 } from "iconsax-react";

export default function PlannerPage() {
  const [activeTab, setActiveTab] = useState("live");
  const [currentDate, setCurrentDate] = useState(new Date());

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
        <Heading size="2xl" color="gray.800">
          Planner
        </Heading>
        
        <Flex gap={3}>
          <NativeSelectRoot w="120px">
            <ArrowDown2 size={16} color="black" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", zIndex: 1 }} />
            <NativeSelectField 
              placeholder="Open Days"
              borderWidth="1.5px"
              borderColor="gray.400"
              color="black"
              fontWeight="500"
              pl="32px"
              _hover={{ borderColor: "gray.500" }}
            >
              <option value="option1">Option 1</option>
            </NativeSelectField>
          </NativeSelectRoot>
          
          <NativeSelectRoot w="120px">
            <Add size={16} color="black" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", zIndex: 1 }} />
            <NativeSelectField 
              placeholder="Nieuw"
              borderWidth="1.5px"
              borderColor="gray.400"
              color="black"
              fontWeight="500"
              pl="32px"
              _hover={{ borderColor: "gray.500" }}
            >
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </NativeSelectField>
          </NativeSelectRoot>
        </Flex>
      </Flex> 

      <Box p={{ base: 4, md: 6 }} >
        <PlannerTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <Flex gap={4}>
          {activeTab === "live" && <Roster />}
          
          <Box flex={1}>
            <PlannerHeader
              currentDate={currentDate}
              onDateChange={setCurrentDate}
            />
            <CalendarView currentDate={currentDate} />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
