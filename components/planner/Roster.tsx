"use client";

import {
  Box,
  Input,
  VStack,
  HStack,
  Text,
  Badge,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { Filter, SearchNormal1 } from "iconsax-react";
import { useState } from "react";
import { StaffMember } from "@/lib/types";
import { defaultStaff } from "@/lib/data";
import { AiOutlineExpandAlt } from "react-icons/ai";
import { BsArrowsAngleExpand } from "react-icons/bs";
import { useDraggable } from "@dnd-kit/core";

const DraggableStaffCard = ({ staff }: { staff: StaffMember }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: staff.name, // Use staff name as the ID for dragging
  });

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      p={4}
      my={2}
      borderWidth="1px"
      borderColor="gray.100"
      _hover={{ bg: "gray.50" }}
      rounded="lg"
      cursor={isDragging ? "grabbing" : "grab"}
      transition="background 0.2s"
      opacity={isDragging ? 0.5 : 1}
      bg={isDragging ? "blue.50" : "white"}
    >
      <HStack align="start" gap={3}>
        <Box
          w="40px"
          h="40px"
          borderRadius="full"
          bg="gray.100"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          <Text fontSize="sm" fontWeight="600" color="gray.600">
            {staff.initials}
          </Text>
        </Box>

        {/* Info */}
        <VStack align="start" gap={1} flex={1}>
          <HStack justify="space-between" w="full">
            <Text fontSize="sm" fontWeight="600" color="gray.800" >
              {staff.name}
            </Text>
            {staff.status === "onLeave" && (
              <Badge
                fontSize="2xs"
                fontWeight="500"
                bg="red.100"
                color="red.500"
                px={2}
                py={0.5}
                borderRadius="md"
              >
                • On leave
              </Badge>
            )}
          </HStack>

          <HStack gap={2} fontSize="xs" color="gray.500">
            <Text bg="gray.200" p={1} px={2} rounded="lg">{staff.totalHours}</Text>
            <Text bg="gray.200" p={1} px={2} rounded="lg">{staff.overtimeHours}</Text>
          </HStack>

          <HStack gap={2} w="full" justify="space-between" align="center">
            <Text fontSize="xs" bg="red.100" p={1} px={2} rounded="lg" color="red.500" fontWeight="500">
              {staff.dateRange}
            </Text>

            <HStack gap={1}>
              {staff.daysWorked.map((day, idx) => (
                <Box
                  key={idx}
                  fontSize="2xs"
                  fontWeight="500"
                  color={
                    day === "m"
                      ? "green.600"
                      : day === "di"
                        ? "green.600"
                        : day === "w"
                          ? "orange.600"
                          : day === "do"
                            ? "orange.600"
                            : "orange.600"
                  }
                  px={1}
                >
                  {day}
                </Box>
              ))}
            </HStack>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
};

export const Roster = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "available" | "onLeave"
  >("all");

  const filteredStaff = defaultStaff.filter((staff) => {
    const matchesSearch = staff.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "available" && staff.status === "available") ||
      (activeFilter === "onLeave" && staff.status === "onLeave");
    return matchesSearch && matchesFilter;
  });

  const allCount = defaultStaff.length;
  const availableCount = defaultStaff.filter(
    (s) => s.status === "available",
  ).length;
  const onLeaveCount = defaultStaff.filter(
    (s) => s.status === "onLeave",
  ).length;

  return (
    <Box
      w={{ base: "full", lg: "320px" }}
      flexShrink={0}
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="xl"
      overflow="hidden"
      p={4}
      maxH={{ base: "auto", lg: "90vh" }}
    >
      <HStack p={4} borderBottomWidth="1px" borderBottomColor="gray.200">
        <BsArrowsAngleExpand
          size={20}
          style={{ marginRight: "16px", color: "black" }}
        />
        <Text
          fontSize="lg"
          fontWeight="600"
          color="gray.800"
          borderBottomColor="gray.200"
          borderLeftWidth="1px"
          pl={4}
        >
          Roster
        </Text>
      </HStack>

      <Flex
        align="center"
        justify="space-between"
        p={4}
        borderBottomWidth="1px"
        borderBottomColor="gray.200"
      >
        <Box position="relative" mr={4}>
          <SearchNormal1
            size={18}
            color="#9CA3AF"
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1,
            }}
          />
          <Input
            placeholder="Search"
            pl="40px"
            borderColor="gray.300"
            borderRadius="lg"
            fontSize="sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            _focus={{
              borderColor: "blue.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
            }}
          />
        </Box>

        <IconButton
          variant="ghost"
          size="sm"
          borderWidth="1px"
          borderColor="#D9E5F2"
          borderStyle="solid"
          color={"#000"}
          _hover={{ bg: "gray.100" }}
        >
          <Filter size={18} color={"#000"} />
        </IconButton>
      </Flex>

      <HStack
        gap={3}
        px={4}
        py={3}
              mt={2}
              my={4}
        borderBottomWidth="1px"
        borderBottomColor="gray.200"
      >
        <Box
          as="button"
          fontSize="sm"
          fontWeight="500"
          color={activeFilter === "all" ? "blue.600" : "gray.600"}
          borderBottomWidth={activeFilter === "all" ? "2px" : "0"}
          borderBottomColor="blue.600"
          pb={1}
          onClick={() => setActiveFilter("all")}
          cursor="pointer"
        >
          All{" "}
          <Box as="span" bg="gray.200" color="black" p={1} px={2} rounded="lg">
            {allCount}
          </Box>
        </Box>
        <Box
          as="button"
          fontSize="sm"
          fontWeight="500"
          color={activeFilter === "available" ? "blue.600" : "gray.600"}
          borderBottomWidth={activeFilter === "available" ? "2px" : "0"}
          borderBottomColor="blue.600"
          pb={1}
          onClick={() => setActiveFilter("available")}
          cursor="pointer"
        >
          Available{" "}
                    <Box as="span" bg="gray.200" color="black" p={1} px={2} rounded="lg">

            {availableCount}
          </Box>
        </Box>
        <Box
          as="button"
          fontSize="sm"
          fontWeight="500"
          color={activeFilter === "onLeave" ? "blue.600" : "gray.600"}
          borderBottomWidth={activeFilter === "onLeave" ? "2px" : "0"}
          borderBottomColor="blue.600"
          pb={1}
          onClick={() => setActiveFilter("onLeave")}
          cursor="pointer"
        >
          On Leave{" "}
          <Box as="span" bg="gray.200" color="black" p={1} px={2} rounded="lg">
            {onLeaveCount}
          </Box>
        </Box>
      </HStack>

      <VStack
        gap={0}
        align="stretch"
        maxH="600px"
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#CBD5E0",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#A0AEC0",
          },
        }}
      >
        {filteredStaff.map((staff) => (
          <DraggableStaffCard key={staff.id} staff={staff} />
        ))}
      </VStack>
    </Box>
  );
};
