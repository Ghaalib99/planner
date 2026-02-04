"use client";

import { Box, Flex, Heading, Text, NativeSelectRoot, NativeSelectField } from "@chakra-ui/react";
import { PlannerTabs } from "@/components/planner/PlannerTabs";
import { PlannerHeader } from "@/components/planner/PlannerHeader";
import { CalendarView } from "@/components/planner/CalendarView";
import { MonthView } from "@/components/planner/MonthView";
import { Roster } from "@/components/planner/Roster";
import { useState } from "react";
import { Add, Arrow, ArrowDown2 } from "iconsax-react";
import { defaultEvents } from "@/lib/data";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Event } from "@/lib/types";

export default function PlannerPage() {
  const [activeTab, setActiveTab] = useState("live");
  const [liveDate, setLiveDate] = useState(new Date());
  const [plannerDate, setPlannerDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week" | "month" | "custom">("day");
  const [events, setEvents] = useState<Event[]>(defaultEvents);
  
  const currentDate = activeTab === "live" ? liveDate : plannerDate;
  const setCurrentDate = activeTab === "live" ? setLiveDate : setPlannerDate;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const dropData = typeof over.id === 'string' ? over.id : String(over.id);
    const [department, timeSlot, date] = dropData.split('-');
    
    const staffId = String(active.id);
    
    const newEvent: Event = {
      id: `event-${Date.now()}`,
      department: department || "HG",
      title: "New Assignment",
      startTime: timeSlot || "11:00",
      endTime: addHours(timeSlot || "11:00", 2), 
      staff: staffId,
      color: "blue",
      column: 0,
      subColumn: 0,
      subColumnSpan: 1,
      date: date || formatDate(currentDate),
      description: "Newly scheduled event",
    };
    
    setEvents([...events, newEvent]);
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const addHours = (time: string, hours: number) => {
    const [hour, minute] = time.split(':').map(Number);
    const newHour = (hour + hours) % 24;
    return `${String(newHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  };

  return (
    <Box>
      <Flex
        p={{ base: 4, md: 6 }}
        align="center"
        borderBottomWidth={1}
        borderBottomColor="#D9E5F2"
        borderBottomStyle="solid"
        mb={4}
        justify="space-between"
        flexWrap="wrap"
        gap={4}
      >
        <Heading size={{ base: "xl", md: "2xl" }} color="gray.800">
          Planner
        </Heading>
        
        <Flex gap={3} display={{ base: "none", md: "flex" }}>
          <NativeSelectRoot w="150px">
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
          
          <NativeSelectRoot w="150px">
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

        <DndContext onDragEnd={handleDragEnd}>
          <Flex gap={4} direction={{ base: "column", lg: "row" }}>
            {activeTab === "live" && <Roster />}
            
            <Box flex={1} w="full" overflowX="auto">
              <PlannerHeader
                currentDate={currentDate}
                onDateChange={setCurrentDate}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
              {viewMode === "month" ? (
                <MonthView currentDate={currentDate} events={events} />
              ) : (
                <CalendarView currentDate={currentDate} events={events} />
              )}
            </Box>
          </Flex>
        </DndContext>
      </Box>
    </Box>
  );
}
