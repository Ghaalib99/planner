"use client";

import { Box, Flex, HStack, Button, Text, IconButton } from "@chakra-ui/react";
import { Shuffle, Filter, ArrowLeft2, ArrowRight2, Lock, Add, People, ArrowDown2 } from "iconsax-react";
import { FiChevronDown } from "react-icons/fi";

interface PlannerHeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export const PlannerHeader = ({ currentDate, onDateChange }: PlannerHeaderProps) => {
  const formatDay = (date: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return `${days[date.getDay()]} ${date.getDate()}`;
  };

  const formatMonth = (date: Date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]}, ${date.getFullYear()}`;
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
      justify="space-between"
      align="center"
      gap={4}
      mb={6}
      flexWrap="wrap"
    >
      {/* Left: Date */}
      <HStack gap={4}>
        <Text fontSize="sm" color="gray.600" fontWeight="500">
          {formatDay(currentDate)}
        </Text>
        <Text fontSize="lg" fontWeight="600" color="gray.800">
          {formatMonth(currentDate)}
        </Text>
      </HStack>

      {/* Right: Controls */}
      <HStack flexWrap="wrap">
        <IconButton
          variant="ghost"
          size="sm"
           borderWidth="1px"
          borderColor="#D9E5F2"
          borderStyle="solid"
          color={"#000"}
          _hover={{ bg: "gray.100" }}
        >
          <People size={18} color={"#000"}/>
        </IconButton>

        <IconButton
          variant="ghost"
          size="sm"
           borderWidth="1px"
          borderColor="#D9E5F2"
          borderStyle="solid"
          color={"#000"}
          _hover={{ bg: "gray.100" }}
        >
          <Filter size={18} color={"#000"}/>
        </IconButton>

        <IconButton
          variant="ghost"
          size="sm"
          borderWidth="1px"
          borderRightWidth={0}
          borderColor="#D9E5F2"
          borderStyle="solid"
          color={"#000"}
          onClick={goToPreviousDay}
          _hover={{ bg: "gray.100" }}
        >
          <ArrowLeft2 size={18} color={"#000"}/>
        </IconButton>

        <Button
          variant="outline"
          size="sm"
           borderWidth="1px"
          borderColor="#D9E5F2"
          borderStyle="solid"
          mx="-10px"
          color={"#000"}
          _hover={{ bg: "gray.50" }}
        >
          Current day
        </Button>

        <IconButton
          variant="ghost"
          size="sm"
           borderWidth="1px"
          borderColor="#D9E5F2"
          borderStyle="solid"
          borderLeftWidth={0}
          color={"#000"}
          onClick={goToNextDay}
          _hover={{ bg: "gray.100" }}
        >
          <ArrowRight2 size={18} color={"#000"}/>
        </IconButton>

        <Button
          variant="outline"
          size="sm"
           borderWidth="1px"
          borderColor="#D9E5F2"
          borderStyle="solid"
          color={"#000"}
          _hover={{ bg: "gray.50" }}
        >
          This day
          <FiChevronDown style={{ marginLeft: "0.5rem" }} color={"#000"}/>
        </Button>

        <Button
          variant="outline"
          size="sm"
           borderWidth="1px"
          borderColor="#D9E5F2"
          borderStyle="solid"
          color={"#000"}
          _hover={{ bg: "gray.50" }}
        >
          Publish All
        </Button>

        <Button
          variant="outline"
          size="sm"
          borderWidth="1px"
          borderColor="#D9E5F2"
          borderStyle="solid"
          color={"#000"}
          _hover={{ bg: "gray.50" }}
        >
          <Add size={20} style={{ marginRight: "0.5rem" }} color="#000"/>
          Lock Shift
        </Button>
      </HStack>
    </Flex>
  );
};
