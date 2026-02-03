"use client";

import { Box, HStack, Text, IconButton, Flex } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import { Element3, Setting2, Notification } from "iconsax-react";
import { FiChevronDown, FiMenu } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <Box
      as="header"
      w="full"
      bg="white"
      borderBottomWidth="1px"
          borderBottomColor="#D9E5F2"
        borderBottomStyle="solid"
      px={{ base: 4, md: 6 }}
      py={3}
      position="sticky"
      top={0}
      zIndex="sticky"
    >
      <Flex justify="end" align="center">
      

        
        <HStack color="#000" gap={{ base: 2, md: 4, }}>
          <IconButton
            variant="ghost"
            aria-label="Grid view"
            bg="#F6FAFD"
            rounded="lg"
            size="sm"
            _hover={{ bg: "gray.100" }}
          >
            <RxDashboard size={30} color="#009FE3"/>
          </IconButton>

          <IconButton
            variant="ghost"
            aria-label="Settings"
            bg="#F6FAFD"
            rounded="lg"
            size="sm"
            _hover={{ bg: "gray.100" }}
          >
            <Setting2 size={30} color="#000"/>
          </IconButton>

          <Box position="relative">
            <IconButton
              variant="ghost"
              aria-label="Notifications"
              bg="#F6FAFD"
              rounded="lg"
              size="sm"
              _hover={{ bg: "gray.100" }}
            >
              <Notification size={30} color="#000"/>
            </IconButton>
            <Box
              position="absolute"
              top={1}
              right={1}
              w={2}
              h={2}
              bg="red.500"
              borderRadius="full"
            />
          </Box>

          {/* User Profile */}
          <HStack
            gap={2}
            cursor="pointer"
            px={2}
            py={1}
            borderRadius="md"
            _hover={{ bg: "gray.50" }}
            display={{ base: "none", md: "flex" }}
          >
            <Avatar
              size="sm"
              name="Paul Cornelius"
              bg="gray.300"
            />
            <Box>
              <Text fontSize="sm" fontWeight="500" color="gray.800">
                Paul Cornelius
              </Text>
              <Text fontSize="xs" color="gray.500">
                Paul@doctor.com
              </Text>
            </Box>
            <FiChevronDown size={16} color="gray" />
          </HStack>

          {/* Mobile User Avatar */}
          <Avatar
            size="sm"
            name="Paul Cornelius"
            bg="gray.300"
            display={{ base: "flex", md: "none" }}
          />
        </HStack>
      </Flex>
    </Box>
  );
};
