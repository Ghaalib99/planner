"use client";

import { Box, Grid, Text, VStack, HStack } from "@chakra-ui/react";

interface TimeSlot {
  time: string;
}

interface Event {
  id: string;
  department: string;
  title: string;
  startTime: string;
  endTime: string;
  staff: string;
  color: string;
  column: number;
  row: number;
  rowSpan: number;
}

const timeSlots: TimeSlot[] = [
  { time: "11:00" },
  { time: "11:30" },
  { time: "12:00" },
  { time: "12:30" },
  { time: "13:00" },
  { time: "13:30" },
  { time: "14:00" },
  { time: "14:30" },
  { time: "15:00" },
];

const departments = [
  "Behandelkamern1",
  "Management",
  "Bijzonderheden-Verlof-Cursus-...",
  "Financien",
];

const sampleEvents: Event[] = [
  {
    id: "1",
    department: "HG",
    title: "Surgery",
    startTime: "11:00",
    endTime: "13:00",
    staff: "Haico de Gast",
    color: "orange",
    column: 1,
    row: 1,
    rowSpan: 4,
  },
  {
    id: "2",
    department: "DL",
    title: "Pijnspecialist",
    startTime: "11:00",
    endTime: "12:00",
    staff: "Diane Lane",
    color: "green",
    column: 2,
    row: 1,
    rowSpan: 2,
  },
  {
    id: "3",
    department: "HG",
    title: "Pijnspecialist",
    startTime: "11:30",
    endTime: "13:30",
    staff: "Diane Lane",
    color: "yellow",
    column: 3,
    row: 2,
    rowSpan: 4,
  },
  {
    id: "4",
    department: "HG",
    title: "Pijnspecialist",
    startTime: "13:00",
    endTime: "15:00",
    staff: "Haico de Gast",
    color: "orange",
    column: 2,
    row: 5,
    rowSpan: 4,
  },
  {
    id: "5",
    department: "HG",
    title: "Pijnspecialist",
    startTime: "16:00",
    endTime: "20:00",
    staff: "Diane Lane",
    color: "green",
    column: 4,
    row: 1,
    rowSpan: 2,
  },
  {
    id: "6",
    department: "HG",
    title: "Pijnspecialist",
    startTime: "11:30",
    endTime: "13:30",
    staff: "Diane Lane",
    color: "yellow",
    column: 4,
    row: 2,
    rowSpan: 4,
  },
];

export const CalendarView = () => {
  const getEventColor = (color: string) => {
    const colors: Record<string, { bg: string; border: string }> = {
      orange: { bg: "#FFF4ED", border: "#FF8A3D" },
      green: { bg: "#F0FDF4", border: "#4ADE80" },
      yellow: { bg: "#FEFCE8", border: "#FDE047" },
    };
    return colors[color] || colors.orange;
  };

  return (
    <Box
      bg="white"
      borderRadius="xl"
      border="1px"
      borderColor="gray.200"
      overflow="hidden"
    >
      {/* Department Headers */}
      <Grid
        templateColumns={{ base: "80px 1fr", md: `80px repeat(${departments.length}, 1fr)` }}
        gap={0}
        borderBottom="1px"
        borderColor="gray.200"
      >
        <Box />
        {departments.map((dept, idx) => (
          <Box
            key={idx}
            px={3}
            py={3}
            borderLeft="1px"
            borderColor="gray.200"
            display={{ base: idx === 0 ? "block" : "none", md: "block" }}
          >
            <Text fontSize="sm" fontWeight="600" color="gray.700" >
              {dept}
            </Text>
          </Box>
        ))}
      </Grid>

      {/* Calendar Grid */}
      <Box position="relative" overflowX="auto">
        <Grid
          templateColumns={{ base: "80px 1fr", md: `80px repeat(${departments.length}, 1fr)` }}
          gap={0}
        >
          {/* Time Column */}
          <VStack align="stretch" gap={0}>
            {timeSlots.map((slot, idx) => (
              <Box
                key={idx}
                h="80px"
                px={3}
                py={2}
                borderBottom="1px"
                borderColor="gray.200"
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
              borderLeft="1px"
              borderColor="gray.200"
              display={{ base: colIdx === 0 ? "block" : "none", md: "block" }}
            >
              {/* Time Slot Backgrounds */}
              {timeSlots.map((_, rowIdx) => (
                <Box
                  key={rowIdx}
                  h="80px"
                  borderBottom="1px"
                  borderColor="gray.200"
                  bg={rowIdx % 2 === 0 ? "gray.50" : "white"}
                />
              ))}

              {/* Events */}
              {sampleEvents
                .filter((event) => event.column === colIdx + 1)
                .map((event) => {
                  const colors = getEventColor(event.color);
                  return (
                    <Box
                      key={event.id}
                      position="absolute"
                      top={`${(event.row - 1) * 80}px`}
                      left="4px"
                      right="4px"
                      h={`${event.rowSpan * 80 - 8}px`}
                      bg={colors.bg}
                      border="2px"
                      borderColor={colors.border}
                      borderRadius="md"
                      p={2}
                      cursor="pointer"
                      _hover={{ shadow: "md" }}
                      transition="all 0.2s"
                    >
                      <VStack align="start" gap={0.5} h="full">
                        <HStack gap={1}>
                          <Text
                            fontSize="xs"
                            fontWeight="600"
                            color="gray.500"
                            bg="white"
                            px={1.5}
                            py={0.5}
                            borderRadius="sm"
                          >
                            {event.department}
                          </Text>
                        </HStack>
                        <Text fontSize="sm" fontWeight="600" color="gray.800">
                          {event.title}
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          {event.startTime} - {event.endTime}
                        </Text>
                        <Text fontSize="xs" color="gray.600" fontWeight="500">
                          {event.staff}
                        </Text>
                      </VStack>
                    </Box>
                  );
                })}
            </Box>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};
