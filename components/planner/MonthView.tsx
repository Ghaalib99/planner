"use client";

import { Box, Grid, Text, VStack, HStack, Badge } from "@chakra-ui/react";
import { Event } from "@/lib/types";
import { useMemo } from "react";

interface MonthViewProps {
  currentDate: Date;
  events?: Event[];
}

export const MonthView = ({ currentDate, events = [] }: MonthViewProps) => {
  const monthData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const firstDayOfWeek = firstDay.getDay();
    
    const daysFromPrevMonth = firstDayOfWeek;
    
    const totalCells = 42;
    
    const days: Array<{
      date: Date;
      dateString: string;
      isCurrentMonth: boolean;
      isToday: boolean;
      events: Event[];
    }> = [];
    
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      const dateString = formatDate(date);
      days.push({
        date,
        dateString,
        isCurrentMonth: false,
        isToday: false,
        events: events.filter(e => e.date === dateString),
      });
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dateString = formatDate(date);
      const today = new Date();
      const isToday = 
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
      
      days.push({
        date,
        dateString,
        isCurrentMonth: true,
        isToday,
        events: events.filter(e => e.date === dateString),
      });
    }
    
    const remainingCells = totalCells - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(year, month + 1, i);
      const dateString = formatDate(date);
      days.push({
        date,
        dateString,
        isCurrentMonth: false,
        isToday: false,
        events: events.filter(e => e.date === dateString),
      });
    }
    
    return days;
  }, [currentDate, events]);
  
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  return (
    <Box mt={4} bg="white" borderRadius="lg" p={4} borderWidth={1} borderColor="gray.200">
      <Grid templateColumns="repeat(7, 1fr)" gap={2} mb={2}>
        {weekDays.map((day) => (
          <Box key={day} textAlign="center" fontWeight="600" fontSize="sm" color="gray.600" py={2}>
            {day}
          </Box>
        ))}
      </Grid>
      
      <Grid templateColumns="repeat(7, 1fr)" gap={2}>
        {monthData.map((day, idx) => (
          <Box
            key={idx}
            minH="100px"
            p={2}
            borderWidth={1}
            borderColor={day.isToday ? "blue.500" : "gray.200"}
            borderRadius="md"
            bg={day.isCurrentMonth ? "white" : "gray.50"}
            opacity={day.isCurrentMonth ? 1 : 0.6}
            position="relative"
            _hover={{ bg: day.isCurrentMonth ? "gray.50" : "gray.100", cursor: "pointer" }}
            transition="all 0.2s"
          >
            <VStack align="stretch" h="full" gap={1}>
              <HStack justify="space-between">
                <Text
                  fontSize="sm"
                  fontWeight={day.isToday ? "700" : "500"}
                  color={day.isToday ? "blue.600" : day.isCurrentMonth ? "gray.800" : "gray.500"}
                >
                  {day.date.getDate()}
                </Text>
                {day.events.length > 0 && (
                  <Badge size="sm" colorScheme="blue" variant="solid" borderRadius="full" fontSize="xs">
                    {day.events.length}
                  </Badge>
                )}
              </HStack>
              
              <VStack align="stretch" gap={1} flex={1}>
                {day.events.slice(0, 2).map((event) => (
                  <Box
                    key={event.id}
                    fontSize="xs"
                    px={2}
                    py={1}
                    borderRadius="sm"
                    bg={
                      event.color === "orange" ? "orange.100" :
                      event.color === "green" ? "green.100" :
                      event.color === "yellow" ? "yellow.100" :
                      event.color === "blue" ? "blue.100" :
                      "purple.100"
                    }
                    color={
                      event.color === "orange" ? "orange.800" :
                      event.color === "green" ? "green.800" :
                      event.color === "yellow" ? "yellow.800" :
                      event.color === "blue" ? "blue.800" :
                      "purple.800"
                    }
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                  >
                    {event.startTime} {event.title}
                  </Box>
                ))}
                {day.events.length > 2 && (
                  <Text fontSize="xs" color="gray.600" px={2}>
                    +{day.events.length - 2} more
                  </Text>
                )}
              </VStack>
            </VStack>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};
