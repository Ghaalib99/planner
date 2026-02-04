"use client";

import { Box, Text, VStack, HStack, Portal } from "@chakra-ui/react";
import { Event } from "@/lib/types";
import { useEffect, useRef } from "react";
import { CloseButton } from "@/components/ui/close-button";

interface EventDetailDialogProps {
  event: Event | null;
  events: Event[];
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

export const EventDetailDialog = ({ event, events, open, onClose, anchorEl }: EventDetailDialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && anchorEl && dialogRef.current) {
      const anchorRect = anchorEl.getBoundingClientRect();
      const dialogRect = dialogRef.current.getBoundingClientRect();
      
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let top = anchorRect.top + anchorRect.height / 2 - dialogRect.height / 2;
      let left = anchorRect.right + 16;
      
      if (left + dialogRect.width > viewportWidth - 16) {
        left = anchorRect.left - dialogRect.width - 16;
      }
      
      if (left < 16) {
        left = (viewportWidth - dialogRect.width) / 2;
      }
      
      top = Math.max(16, Math.min(top, viewportHeight - dialogRect.height - 16));
      
      dialogRef.current.style.top = `${top}px`;
      dialogRef.current.style.left = `${left}px`;
    }
  }, [open, anchorEl]);

  if (!event) return null;

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

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return `${days[date.getDay()]} ${date.getDate()}`;
  };

  const groupedEvents = events
    .sort((a, b) => {
      const [aHour, aMin] = a.startTime.split(":").map(Number);
      const [bHour, bMin] = b.startTime.split(":").map(Number);
      return (aHour * 60 + aMin) - (bHour * 60 + bMin);
    })
    .reduce((acc, evt) => {
      const timeKey = evt.startTime.split(":")[0] + ":00";
      if (!acc[timeKey]) acc[timeKey] = [];
      acc[timeKey].push(evt);
      return acc;
    }, {} as Record<string, Event[]>);

  if (!open) return null;

  return (
    <Portal>
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={1000}
        onClick={onClose}
      />
      
      <Box
        ref={dialogRef}
        position="fixed"
        width="400px"
        maxH="500px"
        overflowY="auto"
        bg="white"
        shadow="2xl"
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="xl"
        zIndex={1001}
        css={{
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#CBD5E0',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#A0AEC0',
          },
        }}
      >
        <CloseButton
          position="absolute"
          top="2"
          right="2"
          size="sm"
          onClick={onClose}
          zIndex={1}
        />
        
        <Box borderBottomWidth="1px" pb={3} pt={4} px={4}>
          <Text fontSize="lg" fontWeight="600" color="gray.800">
            {formatDate(event.date)}
          </Text>
        </Box>
        
        <VStack align="stretch" gap={0}>
          {Object.entries(groupedEvents).map(([time, timeEvents]) => (
              <Box key={time}>
                <Text 
                  fontSize="sm" 
                  fontWeight="600" 
                  color="gray.800"
                  px={4}
                  pt={4}
                  pb={2}
                >
                  {time}
                </Text>
                <VStack align="stretch" gap={2} px={4} pb={4}>
                  {timeEvents.map((evt) => {
                    const colors = getEventColor(evt.color);
                    return (
                      <Box
                        key={evt.id}
                        bg={colors.bg}
                        border="2px solid"
                        borderColor={colors.border}
                        borderRadius="lg"
                        p={3}
                      >
                        <HStack align="start" gap={3}>
                          <Box
                            fontSize="xs"
                            fontWeight="600"
                            color="gray.500"
                            bg="white"
                            px={2}
                            py={1}
                            borderRadius="md"
                            flexShrink={0}
                          >
                            {evt.department}
                          </Box>
                          <VStack align="start" gap={0.5} flex={1}>
                            <Text fontSize="sm" fontWeight="600" color="gray.900">
                              {evt.title}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              {evt.startTime} - {evt.endTime}
                            </Text>
                            <Text fontSize="xs" color={colors.text} fontWeight="500">
                              {evt.staff}
                            </Text>
                          </VStack>
                        </HStack>
                      </Box>
                    );
                  })}
                </VStack>
              </Box>
            ))}
          </VStack>
      </Box>
    </Portal>
  );
};
