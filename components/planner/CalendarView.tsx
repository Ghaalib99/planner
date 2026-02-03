"use client";

import { Box, Grid, Text, VStack, HStack, Badge, Button } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { useMemo, useState } from "react";

interface TimeSlot {
  time: string;
  hour: number;
  minute: number;
}

interface Event {
  id: string;
  department: string;
  title: string;
  startTime: string;
  endTime: string;
  staff: string;
  color: "orange" | "green" | "yellow" | "blue" | "purple";
  column: number;
  columnSpan?: number; // Number of columns the event spans (default: 1)
}

interface CalendarViewProps {
  events?: Event[];
  departments?: string[];
  startHour?: number;
  endHour?: number;
  slotInterval?: 30 | 60;
}

const defaultDepartments = [
  "Behandelingkamer1",
  "Management",
  "Bijzonderheden-Verlof-Cursus-...",
  "Financien",
];

const defaultEvents: Event[] = [
  {
    id: "1",
    department: "HG",
    title: "Surgery",
    startTime: "11:00",
    endTime: "13:00",
    staff: "Haico de Gast",
    color: "orange",
    column: 0,
  },
  {
    id: "2",
    department: "DL",
    title: "Pijnspecialist",
    startTime: "11:00",
    endTime: "13:30",
    staff: "Diane Lane",
    color: "green",
    column: 0,
  },
  {
    id: "3",
    department: "HG",
    title: "Pijnspecialist",
    startTime: "01:30",
    endTime: "05:00",
    staff: "Diane Lane",
    color: "yellow",
    column: 0,
    columnSpan: 2,
  },
  {
    id: "4",
    department: "HG",
    title: "Pijnspecialist",
    startTime: "13:00",
    endTime: "15:00",
    staff: "Haico de Gast",
    color: "orange",
    column: 0,
  },
  {
    id: "5",
    department: "HG",
    title: "Pijnspecialist",
    startTime: "16:00",
    endTime: "20:00",
    staff: "Diane Lane",
    color: "green",
    column: 2,
  },
  {
    id: "6",
    department: "HG",
    title: "Pijnspecialist",
    startTime: "11:30",
    endTime: "13:30",
    staff: "Diane Lane",
    color: "yellow",
    column: 3,
  },
];

export const CalendarView = ({
  events = defaultEvents,
  departments = defaultDepartments,
  startHour = 11,
  endHour = 16,
  slotInterval = 30,
}: CalendarViewProps) => {
  const [expandedColumns, setExpandedColumns] = useState<Set<number>>(new Set());

  // Generate time slots dynamically
  const timeSlots = useMemo(() => {
    const slots: TimeSlot[] = [];
    const intervalMinutes = slotInterval;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        slots.push({
          time: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
          hour,
          minute,
        });
      }
    }
    
    return slots;
  }, [startHour, endHour, slotInterval]);

  // Calculate event position and height
  const calculateEventStyle = (event: Event, colIdx: number, allEvents: Event[]) => {
    const [startHour, startMinute] = event.startTime.split(":").map(Number);
    const [endHour, endMinute] = event.endTime.split(":").map(Number);

    const startMinutesFromDayStart = startHour * 60 + startMinute;
    const endMinutesFromDayStart = endHour * 60 + endMinute;
    const calendarStartMinutes = timeSlots[0].hour * 60 + timeSlots[0].minute;

    const topOffset = ((startMinutesFromDayStart - calendarStartMinutes) / slotInterval) * 80;
    const duration = endMinutesFromDayStart - startMinutesFromDayStart;
    const height = (duration / slotInterval) * 80;

    // Find overlapping events in the same column
    const columnEvents = allEvents.filter((e) => e.column === colIdx);
    const overlappingEvents = columnEvents.filter((e) => {
      const [eStartHour, eStartMinute] = e.startTime.split(":").map(Number);
      const [eEndHour, eEndMinute] = e.endTime.split(":").map(Number);
      const eStartMinutes = eStartHour * 60 + eStartMinute;
      const eEndMinutes = eEndHour * 60 + eEndMinute;
      
      // Check if events overlap
      return (
        (startMinutesFromDayStart < eEndMinutes && endMinutesFromDayStart > eStartMinutes)
      );
    });

    // Sort overlapping events by start time, then by duration (longer first)
    const sortedOverlapping = [...overlappingEvents].sort((a, b) => {
      const aStart = timeToMinutes(a.startTime);
      const bStart = timeToMinutes(b.startTime);
      if (aStart !== bStart) return aStart - bStart;
      
      const aDuration = timeToMinutes(a.endTime) - aStart;
      const bDuration = timeToMinutes(b.endTime) - bStart;
      return bDuration - aDuration; // Longer events first
    });

    // Calculate horizontal position
    const eventIndex = sortedOverlapping.findIndex((e) => e.id === event.id);
    const totalOverlapping = sortedOverlapping.length;
    const widthPercentage = 100 / totalOverlapping;
    const leftPercentage = widthPercentage * eventIndex;

    return { 
      top: topOffset, 
      height,
      leftPercentage,
      widthPercentage,
      hasOverlap: totalOverlapping > 1
    };
  };

  const timeToMinutes = (timeStr: string): number => {
    const [hour, minute] = timeStr.split(":").map(Number);
    return hour * 60 + minute;
  };

  const getEventColor = (color: Event["color"]) => {
    const colors = {
      orange: { 
        bg: "#FFF4ED", 
        border: "#EA580C",
        text: "#EA580C" 
      },
      green: { 
        bg: "#F0FDF4", 
        border: "#16A34A",
        text: "#16A34A" 
      },
      yellow: { 
        bg: "#FEFCE8", 
        border: "#CA8A04",
        text: "#CA8A04" 
      },
      blue: { 
        bg: "#EFF6FF", 
        border: "#2563EB",
        text: "#2563EB" 
      },
      purple: { 
        bg: "#FAF5FF", 
        border: "#9333EA",
        text: "#9333EA" 
      },
    };
    return colors[color] || colors.orange;
  };

  const getColumnEvents = (colIdx: number) => {
    return events.filter((event) => event.column === colIdx);
  };

  const hasOverlappingEvents = (colIdx: number): boolean => {
    const columnEvents = getColumnEvents(colIdx);
    
    for (let i = 0; i < columnEvents.length; i++) {
      for (let j = i + 1; j < columnEvents.length; j++) {
        const event1 = columnEvents[i];
        const event2 = columnEvents[j];
        
        const start1 = timeToMinutes(event1.startTime);
        const end1 = timeToMinutes(event1.endTime);
        const start2 = timeToMinutes(event2.startTime);
        const end2 = timeToMinutes(event2.endTime);
        
        if (start1 < end2 && start2 < end1) {
          return true;
        }
      }
    }
    return false;
  };

  const toggleExpanded = (colIdx: number) => {
    const newExpanded = new Set(expandedColumns);
    if (newExpanded.has(colIdx)) {
      newExpanded.delete(colIdx);
    } else {
      newExpanded.add(colIdx);
    }
    setExpandedColumns(newExpanded);
  };

  const HEADER_HEIGHT = "56px";
  const TIME_COLUMN_WIDTH = "80px";

  return (
    <Box
      bg="white"
      borderRadius="xl"
      border="1px"
      borderColor="gray.200"
      overflow="hidden"
      boxShadow="sm"
      w="full"
    >
      {/* Department Headers */}
      <Grid
        templateColumns={`${TIME_COLUMN_WIDTH} repeat(${departments.length}, minmax(200px, 1fr))`}
        gap={0}
        bg="#F8F9FA"
        position="sticky"
        top={0}
        zIndex={10}
        h={HEADER_HEIGHT}
      >
        <Box 
          px={4} 
          py={4}
          display="flex"
          alignItems="center"
          borderRight="1px solid"
          borderBottom="1px solid"
          borderColor="gray.300"
        >
          <Text fontSize="xs" fontWeight="600" color="gray.600">
            Days
          </Text>
        </Box>
        {departments.map((dept, idx) => (
          <Box
            key={idx}
            px={4}
            py={4}
            borderRight={idx < departments.length - 1 ? "1px solid" : "none"}
            borderBottom="1px solid"
            borderColor="gray.300"
            display="flex"
            alignItems="center"
          >
            <Text 
              fontSize="sm" 
              fontWeight="600" 
              color="gray.700"
              truncate
              title={dept}
            >
              {dept}
            </Text>
          </Box>
        ))}
      </Grid>

      {/* Calendar Grid */}
      <Box position="relative" overflowX="auto" overflowY="visible">
        <Box position="relative">
        <Grid
          templateColumns={`${TIME_COLUMN_WIDTH} repeat(${departments.length}, minmax(200px, 1fr))`}
          gap={0}
          minH="600px"
        >
          {/* Time Column */}
          <VStack align="stretch" gap={0} position="sticky" left={0} bg="white" zIndex={5}>
            {timeSlots.map((slot, idx) => (
              <Box
                key={idx}
                h="80px"
                px={4}
                py={2}
                borderRight="1px solid"
                borderBottom={idx < timeSlots.length - 1 ? "1px solid" : "none"}
                borderColor="gray.300"
                display="flex"
                alignItems="flex-start"
              >
                <Text fontSize="sm" color="gray.600" fontWeight="500">
                  {slot.time}
                </Text>
              </Box>
            ))}
          </VStack>

          {/* Event Columns */}
          {departments.map((dept, colIdx) => (
            <Box
              key={colIdx}
              position="relative"
              minH="full"
            >
              {/* Time Slot Backgrounds */}
              {timeSlots.map((_, rowIdx) => (
                <Box
                  key={rowIdx}
                  h="80px"
                  borderRight={colIdx < departments.length - 1 ? "1px solid" : "none"}
                  borderBottom={rowIdx < timeSlots.length - 1 ? "1px solid" : "none"}
                  borderColor="gray.300"
                  bg="white"
                  transition="background 0.15s"
                  _hover={{ bg: "gray.50" }}
                  cursor="pointer"
                />
              ))}

              {/* See All Button - shows when there are more than 2 events and not expanded */}
              {getColumnEvents(colIdx).length > 2 && !expandedColumns.has(colIdx) && (() => {
                const columnEvents = getColumnEvents(colIdx);
                const totalToShow = 2;
                const widthPercentage = 100 / (totalToShow + 1); // +1 for the "See all" button
                const leftPercentage = widthPercentage * totalToShow;
                
                // Find the earliest event to position the button at the same top position
                const earliestEvent = columnEvents.reduce((earliest, event) => {
                  const eventStart = timeToMinutes(event.startTime);
                  const earliestStart = timeToMinutes(earliest.startTime);
                  return eventStart < earliestStart ? event : earliest;
                });
                
                const [startHour, startMinute] = earliestEvent.startTime.split(":").map(Number);
                const startMinutesFromDayStart = startHour * 60 + startMinute;
                const calendarStartMinutes = timeSlots[0].hour * 60 + timeSlots[0].minute;
                const topOffset = ((startMinutesFromDayStart - calendarStartMinutes) / slotInterval) * 80;
                
                return (
                  <Box
                    position="absolute"
                    top={`${topOffset + 10}px`}
                    left={`calc(${leftPercentage}% + 4px)`}
                    w={`calc(${widthPercentage}% - 8px)`}
                    zIndex={5}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleExpanded(colIdx)}
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                      color="gray.600"
                      fontSize="sm"
                      _hover={{ bg: "gray.50" }}
                    >
                      See all
                    </Button>
                  </Box>
                );
              })()}

              {/* Events */}
              {events
                .filter((event) => event.column === colIdx && (event.columnSpan || 1) === 1)
                .map((event, eventIdx) => {
                  const colors = getEventColor(event.color);
                  const { top, height, leftPercentage, widthPercentage, hasOverlap } = calculateEventStyle(event, colIdx, events);
                  
                  const isExpanded = expandedColumns.has(colIdx);
                  const columnEvents = getColumnEvents(colIdx);
                  
                  // Show first 2 events when collapsed, all events when expanded
                  const maxEventsWhenCollapsed = 2;
                  const eventPosition = columnEvents.findIndex(e => e.id === event.id);
                  const shouldShow = isExpanded || eventPosition < maxEventsWhenCollapsed;

                  if (!shouldShow) return null;
                  
                  // When collapsed and showing first 2 events, position them side by side
                  let displayLeftPercentage = leftPercentage;
                  let displayWidthPercentage = widthPercentage;
                  
                  if (!isExpanded && columnEvents.length > 2) {
                    // Make room for "See all" button as if it's a third item
                    const totalItems = maxEventsWhenCollapsed + 1;
                    displayWidthPercentage = 100 / totalItems;
                    displayLeftPercentage = displayWidthPercentage * eventPosition;
                  }
                  
                  // Handle multi-column spanning events
                  const columnSpan = event.columnSpan || 1;
                  const columnWidth = 100; // Each column is 100% of its grid cell
                  
                  // Calculate the actual width considering column span
                  // We need to get the width of a single column from the grid
                  const spanWidth = columnSpan > 1 ? `${columnSpan * 100}%` : `calc(${displayWidthPercentage}% - 8px)`;
                  const spanLeft = columnSpan > 1 ? "4px" : `calc(${displayLeftPercentage}% + 4px)`;

                  return (
                    <Tooltip
                      key={event.id}
                      content={`${event.title} - ${event.staff} (${event.startTime} - ${event.endTime})`}
                      positioning={{ placement: "top" }}
                      showArrow
                    >
                      <Box
                        position="absolute"
                        top={`${top}px`}
                        left={spanLeft}
                        w={spanWidth}
                        h={`${height}px`}
                        bg={colors.bg}
                        border="2px solid"
                        borderColor={colors.border}
                        borderRadius="lg"
                        p={2.5}
                        cursor="pointer"
                        zIndex={15}
                        _hover={{ 
                          shadow: "md",
                          zIndex: 25,
                        }}
                        transition="all 0.15s ease"
                        overflow="hidden"
                      >
                        <VStack align="start" gap={0.5} h="full">
                          <HStack gap={1} mb={0.5}>
                            <Box
                              fontSize="xs"
                              fontWeight="600"
                              color="gray.600"
                              bg="white"
                              px={1.5}
                              py={0.5}
                              borderRadius="sm"
                            >
                              {event.department}
                            </Box>
                          </HStack>
                          
                          <Text 
                            fontSize="sm" 
                            fontWeight="600" 
                            color="gray.900"
                            lineHeight="1.3"
                            lineClamp={2}
                          >
                            {event.title}
                          </Text>
                          
                          <Text fontSize="xs" color="gray.600" lineHeight="1.4">
                            {event.startTime} - {event.endTime}
                          </Text>
                          
                          <Text 
                            fontSize="xs" 
                            color={colors.text}
                            fontWeight="500"
                            lineHeight="1.4"
                          >
                            {event.staff}
                          </Text>
                        </VStack>
                      </Box>
                    </Tooltip>
                  );
                })}
            </Box>
          ))}
        </Grid>
        
        {/* Multi-column spanning events overlay */}
        <Box position="absolute" top={0} left={TIME_COLUMN_WIDTH} right={0} bottom={0} pointerEvents="none">
          {events.filter(event => (event.columnSpan || 1) > 1).map((event) => {
            const colors = getEventColor(event.color);
            const [startHour, startMinute] = event.startTime.split(":").map(Number);
            const [endHour, endMinute] = event.endTime.split(":").map(Number);
            const startMinutesFromDayStart = startHour * 60 + startMinute;
            const endMinutesFromDayStart = endHour * 60 + endMinute;
            const calendarStartMinutes = timeSlots[0].hour * 60 + timeSlots[0].minute;
            const topOffset = ((startMinutesFromDayStart - calendarStartMinutes) / slotInterval) * 80;
            const duration = endMinutesFromDayStart - startMinutesFromDayStart;
            const height = (duration / slotInterval) * 80;
            
            const columnSpan = event.columnSpan || 1;
            const columnIndex = event.column;
            const leftPercentage = (columnIndex / departments.length) * 100;
            const widthPercentage = (columnSpan / departments.length) * 100;
            
            return (
              <Tooltip
                key={`span-${event.id}`}
                content={`${event.title} - ${event.staff} (${event.startTime} - ${event.endTime})`}
                positioning={{ placement: "top" }}
                showArrow
              >
                <Box
                  position="absolute"
                  top={`${topOffset}px`}
                  left={`calc(${leftPercentage}% + 4px)`}
                  w={`calc(${widthPercentage}% - 8px)`}
                  h={`${height}px`}
                  bg={colors.bg}
                  border="2px solid"
                  borderColor={colors.border}
                  borderRadius="lg"
                  p={2.5}
                  cursor="pointer"
                  zIndex={15}
                  pointerEvents="auto"
                  _hover={{ 
                    shadow: "md",
                    zIndex: 25,
                  }}
                  transition="all 0.15s ease"
                  overflow="hidden"
                >
                  <VStack align="start" gap={0.5} h="full">
                    <HStack gap={1} mb={0.5}>
                      <Box
                        fontSize="xs"
                        fontWeight="600"
                        color="gray.600"
                        bg="white"
                        px={1.5}
                        py={0.5}
                        borderRadius="sm"
                      >
                        {event.department}
                      </Box>
                    </HStack>
                    
                    <Text 
                      fontSize="sm" 
                      fontWeight="600" 
                      color="gray.900"
                      lineHeight="1.3"
                      lineClamp={2}
                    >
                      {event.title}
                    </Text>
                    
                    <Text fontSize="xs" color="gray.600" lineHeight="1.4">
                      {event.startTime} - {event.endTime}
                    </Text>
                    
                    <Text 
                      fontSize="xs" 
                      color={colors.text}
                      fontWeight="500"
                      lineHeight="1.4"
                    >
                      {event.staff}
                    </Text>
                  </VStack>
                </Box>
              </Tooltip>
            );
          })}
        </Box>
        </Box>
      </Box>
    </Box>
  );
};