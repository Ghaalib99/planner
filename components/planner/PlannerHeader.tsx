"use client";

import { Box, Flex, HStack, Button, Text, IconButton, NativeSelectRoot, NativeSelectField } from "@chakra-ui/react";
import { Shuffle, Filter, ArrowLeft2, ArrowRight2, Lock, Add, People, ArrowDown2 } from "iconsax-react";
import { FiChevronDown } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import { useState } from "react";

interface PlannerHeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export const PlannerHeader = ({ currentDate, onDateChange }: PlannerHeaderProps) => {
  const [viewMode, setViewMode] = useState<"day" | "week" | "month" | "custom">("day");
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

  const goToCurrentDay = () => {
    onDateChange(new Date());
  };

  return (
    <Flex
      justify="space-between"
      align="center"
      gap={4}
      mb={6}
      flexWrap="wrap"
    >
      <HStack gap={4}>
        <Text fontSize="sm" color="black" borderWidth="1px" borderColor="gray.300"  p={1} px={3} rounded="full" fontWeight="500">
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
          onClick={goToCurrentDay}
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

        <NativeSelectRoot w="130px" size="sm">
          <Box 
            position="absolute" 
            left="12px" 
            top="50%" 
            transform="translateY(-50%)" 
            pointerEvents="none" 
            zIndex={1}
            display="flex"
            alignItems="center"
          >
            <GoDotFill color={"#0CA740"} size={12}/>
          </Box>
          <FiChevronDown 
            size={16} 
            color="black" 
            style={{ 
              position: "absolute", 
              right: "10px", 
              top: "50%", 
              transform: "translateY(-50%)", 
              pointerEvents: "none", 
              zIndex: 1 
            }} 
          />
          <NativeSelectField
            borderWidth="1px"
            borderColor="#D9E5F2"
            color="black"
            fontWeight="500"
            pl="28px"
            pr="32px"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as "day" | "week" | "month" | "custom")}
            _hover={{ borderColor: "gray.300" }}
          >
            <option value="day">This day</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
            <option value="custom">Custom</option>
          </NativeSelectField>
        </NativeSelectRoot>

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
