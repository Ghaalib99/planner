"use client";

import { Box, Flex, HStack, Button, Text } from "@chakra-ui/react";
import { Shuffle, Filter, ArrowLeft2, ArrowRight2, Lock, Add } from "iconsax-react";
import { FiChevronDown } from "react-icons/fi";

interface PlannerHeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export const PlannerHeader = ({ currentDate, onDateChange }: PlannerHeaderProps) => {
  const formatDate = (date: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  return (
    <Flex
      direction={{ base: "column", lg: "row" }}
      justify="space-between"
      align={{ base: "stretch", lg: "center" }}
      gap={4}
      mb={6}
    >
      {/* Left: Date and Controls */}
      <HStack gap={3} flexWrap="wrap">
        <Text fontSize="sm" color="gray.600" fontWeight="500">
          {formatDate(currentDate)}
        </Text>

        <HStack gap={2}>
          <Button
            variant="ghost"
            size="sm"
            px={2}
            _hover={{ bg: "gray.100" }}
          >
            <Shuffle size={18} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            px={2}
            _hover={{ bg: "gray.100" }}
          >
            <Filter size={18} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            px={2}
            onClick={goToPreviousDay}
            _hover={{ bg: "gray.100" }}
          >
            <ArrowLeft2 size={18} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            px={2}
            onClick={goToNextDay}
            _hover={{ bg: "gray.100" }}
          >
            <ArrowRight2 size={18} />
          </Button>
        </HStack>

        <Button
          variant="outline"
          size="sm"
          rightIcon={<FiChevronDown />}
          borderColor="gray.300"
          _hover={{ bg: "gray.50" }}
        >
          Current day
        </Button>

        <Button
          variant="outline"
          size="sm"
          rightIcon={<FiChevronDown />}
          borderColor="gray.300"
          _hover={{ bg: "gray.50" }}
        >
          This day
        </Button>
      </HStack>

      {/* Right: Action Buttons */}
      <HStack gap={2} flexWrap="wrap">
        <Button
          variant="outline"
          size="sm"
          borderColor="gray.300"
          _hover={{ bg: "gray.50" }}
        >
          Publish All
        </Button>

        <Button
          variant="outline"
          size="sm"
          leftIcon={<Lock size={16} />}
          borderColor="gray.300"
          _hover={{ bg: "gray.50" }}
        >
          Lock Shift
        </Button>

        <Button
          colorScheme="blue"
          size="sm"
          leftIcon={<Add size={16} />}
          rightIcon={<FiChevronDown />}
        >
          Nieuw
        </Button>
      </HStack>
    </Flex>
  );
};
