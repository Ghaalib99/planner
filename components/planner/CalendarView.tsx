"use client";

import { Box, Grid, Text, VStack, HStack, Badge, Button } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { useMemo, useState } from "react";
import { Event, CalendarViewProps, TimeSlot } from "@/lib/types";
import { defaultDepartments, defaultEvents } from "@/lib/data";
import { EventDetailDialog } from "./EventDetailDialog";
import { useDroppable } from "@dnd-kit/core";

const DroppableCell = ({ 
  id, 
  children,
  isLast = false,
  isLastRow = false
}: { 
  id: string; 
  children?: React.ReactNode;
  isLast?: boolean;
  isLastRow?: boolean;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  
  return (
    <Box
      ref={setNodeRef}
      h="80px"
      borderRight={!isLast ? "1px solid" : "none"}
      borderBottom={!isLastRow ? "1px solid" : "none"}
      borderColor="gray.300"
      bg={isOver ? "blue.50" : "white"}
      py={1}
      transition="background 0.2s ease"
      _hover={{ bg: isOver ? "blue.100" : "gray.50" }}
      cursor="pointer"
      position="relative"
    >
      {children}
    </Box>
  );
};

export const CalendarView = ({
  events = defaultEvents,
  departments = defaultDepartments,
  startHour = 11,
  endHour = 16,
  slotInterval = 30,
  currentDate = new Date(),
}: CalendarViewProps) => {
  const [expandedColumns, setExpandedColumns] = useState<Set<number>>(new Set());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const currentDateString = formatDate(currentDate);
  const filteredEvents = events.filter(event => !event.date || event.date === currentDateString);

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

  const calculateEventStyle = (event: Event, colIdx: number, allEvents: Event[]) => {
    const [startHour, startMinute] = event.startTime.split(":").map(Number);
    const [endHour, endMinute] = event.endTime.split(":").map(Number);

    const startMinutesFromDayStart = startHour * 60 + startMinute;
    const endMinutesFromDayStart = endHour * 60 + endMinute;
    const calendarStartMinutes = timeSlots[0].hour * 60 + timeSlots[0].minute;

    const topOffset = ((startMinutesFromDayStart - calendarStartMinutes) / slotInterval) * 80;
    const duration = endMinutesFromDayStart - startMinutesFromDayStart;
    const height = (duration / slotInterval) * 80;

    const columnEvents = allEvents.filter((e) => e.column === colIdx);
    const overlappingEvents = columnEvents.filter((e) => {
      const [eStartHour, eStartMinute] = e.startTime.split(":").map(Number);
      const [eEndHour, eEndMinute] = e.endTime.split(":").map(Number);
      const eStartMinutes = eStartHour * 60 + eStartMinute;
      const eEndMinutes = eEndHour * 60 + eEndMinute;
      
      return (
        (startMinutesFromDayStart < eEndMinutes && endMinutesFromDayStart > eStartMinutes)
      );
    });

    const sortedOverlapping = [...overlappingEvents].sort((a, b) => {
      const aStart = timeToMinutes(a.startTime);
      const bStart = timeToMinutes(b.startTime);
      if (aStart !== bStart) return aStart - bStart;
      
      const aDuration = timeToMinutes(a.endTime) - aStart;
      const bDuration = timeToMinutes(b.endTime) - bStart;
      return bDuration - aDuration; 
    });

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
    return filteredEvents.filter((event) => event.column === colIdx);
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

      <Box position="relative" overflowX="auto" overflowY="visible">
        <Box position="relative">
        <Grid
          templateColumns={`${TIME_COLUMN_WIDTH} repeat(${departments.length}, minmax(200px, 1fr))`}
          gap={0}
          minH="600px"
        >
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

          {departments.map((dept, colIdx) => (
            <Box
              key={colIdx}
              position="relative"
              minH="full"
            >
              {timeSlots.map((slot, rowIdx) => {
                const dropId = `${dept}-${slot.time}-${currentDateString}`;
                return (
                  <DroppableCell
                    key={rowIdx}
                    id={dropId}
                    isLast={colIdx === departments.length - 1}
                    isLastRow={rowIdx === timeSlots.length - 1}
                  />
                );
              })}

              {colIdx === 0 && (() => {
                const widthPercentage = 100 / 3; 
                const leftPercentage = 2 * widthPercentage; 
                
                const buttonHour = 12;
                const buttonMinute = 0;
                const buttonMinutesFromDayStart = buttonHour * 60 + buttonMinute;
                const calendarStartMinutes = timeSlots[0].hour * 60 + timeSlots[0].minute;
                const topOffset = ((buttonMinutesFromDayStart - calendarStartMinutes) / slotInterval) * 80;
                
                return (
                  <Box
                    position="absolute"
                    top={`${topOffset + 4}px`}
                    left={`calc(${leftPercentage}% + 4px)`}
                    w={`calc(${widthPercentage}% - 8px)`}
                    h="72px"
                    zIndex={5}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg="#F0F5FA"
                    borderColor="gray.300"
                    borderRadius="lg"
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    _hover={{ bg: "gray.200", borderColor: "gray.400" }}
                    cursor="default"
                  >
                    <Text
                      fontSize="sm"
                      fontWeight="500"
                      color="gray.600"
                    >
                      See all
                    </Text>
                  </Box>
                );
              })()}

              {filteredEvents
                .filter((event) => event.column === colIdx && (event.columnSpan || 1) === 1)
                .map((event, eventIdx) => {
                  const colors = getEventColor(event.color);
                  const { top, height, leftPercentage, widthPercentage, hasOverlap } = calculateEventStyle(event, colIdx, filteredEvents);
                  
                  const isExpanded = expandedColumns.has(colIdx);
                  const columnEvents = getColumnEvents(colIdx).filter(e => (e.columnSpan || 1) === 1);
                  const totalEvents = columnEvents.length;
                  
                  const maxEventsWhenCollapsed = 2;
                  const eventPosition = columnEvents.findIndex(e => e.id === event.id);
                  const shouldShow = isExpanded || eventPosition < maxEventsWhenCollapsed;

                  if (!shouldShow) return null;
                  
                  let displayLeftPercentage = 0;
                  let displayWidthPercentage = 100;
                  
                  if (event.subColumn !== undefined && event.subColumnSpan !== undefined) {
                    const subColumnWidth = 100 / 3;
                    displayLeftPercentage = event.subColumn * subColumnWidth;
                    displayWidthPercentage = event.subColumnSpan * subColumnWidth;
                  } else if (isExpanded) {
                    displayLeftPercentage = leftPercentage;
                    displayWidthPercentage = widthPercentage;
                  } else {
                    if (totalEvents === 1) {
                      displayLeftPercentage = 0;
                      displayWidthPercentage = 100;
                    } else if (totalEvents === 2) {
                      displayWidthPercentage = 50;
                      displayLeftPercentage = eventPosition * 50;
                    } else {
                      displayWidthPercentage = 100 / 3;
                      displayLeftPercentage = eventPosition * (100 / 3);
                    }
                  }

                  return (
                    <Tooltip
                      key={event.id}
                      content={`${event.title} - ${event.staff} (${event.startTime} - ${event.endTime})`}
                      positioning={{ placement: "top" }}
                      showArrow
                    >
                      <Box
                        position="absolute"
                        top={`${top + 4}px`}
                        left={`calc(${displayLeftPercentage}% + 4px)`}
                        w={`calc(${displayWidthPercentage}% - 8px)`}
                        h={`calc(${height}px - 8px)`}
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
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        overflow="hidden"
                        onClick={(e) => {
                          setSelectedEvent(event);
                          setAnchorEl(e.currentTarget);
                        }}
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
                              borderRadius="full"
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
        
        <Box position="absolute" top={0} left={TIME_COLUMN_WIDTH} right={0} bottom={0} pointerEvents="none">
          {filteredEvents.filter(event => (event.columnSpan || 1) > 1).map((event) => {
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
            const subColumn = event.subColumn || 0;
            const subColumnSpan = event.subColumnSpan || 3; 
     
            const departmentWidth = 100 / departments.length;
            const subColumnWidth = departmentWidth / 3;
            
            const leftPercentage = (columnIndex * departmentWidth) + (subColumn * subColumnWidth);
            
            const widthPercentage = subColumnSpan * subColumnWidth;
            
            return (
              <Tooltip
                key={`span-${event.id}`}
                content={`${event.title} - ${event.staff} (${event.startTime} - ${event.endTime})`}
                positioning={{ placement: "top" }}
                showArrow
              >
                <Box
                  position="absolute"
                  top={`${topOffset + 4}px`}
                  left={`calc(${leftPercentage}% + 4px)`}
                  w={`calc(${widthPercentage}% - 8px)`}
                  h={`calc(${height}px - 8px)`}
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
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  overflow="hidden"
                  onClick={(e) => {
                    setSelectedEvent(event);
                    setAnchorEl(e.currentTarget);
                  }}
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
                        borderRadius="100%"
                        rounded="full"
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

      <EventDetailDialog 
        event={selectedEvent}
        events={filteredEvents}
        open={!!selectedEvent}
        onClose={() => {
          setSelectedEvent(null);
          setAnchorEl(null);
        }}
        anchorEl={anchorEl}
      />
    </Box>
  );
};