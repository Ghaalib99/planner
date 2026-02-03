"use client";

import { Box, Text, VStack, HStack, IconButton, Flex } from "@chakra-ui/react";
import {
  Home,
  Calendar,
  Setting2,
  DocumentText,
  Book,
  MessageText,
  Folder2,
  HambergerMenu,
  AddSquare,
} from "iconsax-react";
import { useState } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { RxDashboard } from "react-icons/rx";
import { CgFile, CgFileDocument } from "react-icons/cg";
import { TbFile } from "react-icons/tb";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    label: "Startpagina",
    icon: RxDashboard,
    path: "/",
  },
  {
    label: "Rooster",
    icon: AddSquare,
    path: "/rooster",
    children: [
      { label: "Mijn Rooster", icon: CgFileDocument, path: "/rooster/mijn" },
      { label: "Planner", icon: CgFile, path: "/planner" },
      { label: "Instellingen", icon: CgFile, path: "/rooster/settings" },
    ],
  },
  {
    label: "My to do Protocols",
    icon: CgFile,
    path: "/protocols",
  },
  {
    label: "Document Management",
    icon: TbFile,
    path: "/documents",
  },
  {
    label: "Department News",
    icon: TbFile,
    path: "/department-news",
  },
  {
    label: "Knowledge Base",
    icon: TbFile,
    path: "/knowledge-base",
  },
  {
    label: "General News",
    icon: TbFile,
    path: "/general-news",
  },
];

export const Sidebar = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>(["Rooster"]);
  const [activeItem, setActiveItem] = useState("/planner");

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

  return (
    <Box
      as="aside"
      w={{ base: "full", md: "260px" }}
      h="100vh"
      bg="white"
      borderRightWidth="1px"
      borderRightColor="#D9E5F2"
      borderRightStyle="solid"
      position={{ base: "fixed", md: "sticky" }}
      top="0"
      left="0"
      zIndex="sticky"
      overflowY="auto"
      pt={4}
      pb={6}
    >
      <Flex align="center" justify="space-between" px={6} mb={6}>
        <Image src="/logo.svg" alt="Logo" width={130} height={60} />
        <IconButton aria-label="Search database">
          <HambergerMenu size="28" color="#2D3648" />
        </IconButton>
      </Flex>

      <VStack align="stretch" gap={1} px={3}>
        {navItems.map((item) => (
          <NavItemComponent
            key={item.label}
            item={item}
            isExpanded={expandedItems.includes(item.label)}
            onToggle={toggleExpand}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
          />
        ))}
      </VStack>
    </Box>
  );
};

interface NavItemComponentProps {
  item: NavItem;
  isExpanded: boolean;
  onToggle: (label: string) => void;
  activeItem: string;
  setActiveItem: (path: string) => void;
  isChild?: boolean;
}

const NavItemComponent = ({
  item,
  isExpanded,
  onToggle,
  activeItem,
  setActiveItem,
  isChild = false,
}: NavItemComponentProps) => {
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;
  const isActive = activeItem === item.path;

  const isIconsaxIcon = [AddSquare, HambergerMenu].includes(Icon as any);

  const content = (
    <>
      <Box as="span" fontSize="20px" display="flex" alignItems="center">
        {isIconsaxIcon ? (
          <Icon size={20} variant={isActive ? "Bold" : "Outline"} />
        ) : (
          <Icon />
        )}
      </Box>
      <Text
        flex={1}
        fontSize="sm"
        fontWeight={isActive ? "600" : "400"}
        textAlign="left"
      >
        {item.label}
      </Text>
      {hasChildren && (
        <Box as="span" fontSize="lg">
          {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
        </Box>
      )}
    </>
  );

  const commonStyles = {
    w: "full",
    px: 3,
    py: 2.5,
    borderRadius: "md",
    bg: isActive ? "blue.50" : "transparent",
    color: isActive ? "blue.600" : "gray.700",
    _hover: {
      bg: isActive ? "blue.50" : "gray.50",
    },
    transition: "all 0.2s",
    cursor: "pointer",
    gap: 3,
    pl: isChild ? 8 : 3,
  };

  return (
    <Box>
      {hasChildren ? (
        <HStack
          as="button"
          onClick={() => onToggle(item.label)}
          {...commonStyles}
        >
          {content}
        </HStack>
      ) : (
        <Link href={item.path} passHref legacyBehavior>
          <HStack
            as="a"
            onClick={() => setActiveItem(item.path)}
            {...commonStyles}
          >
            {content}
          </HStack>
        </Link>
      )}

      {hasChildren && isExpanded && (
        <VStack align="stretch" gap={1} mt={1}>
          {item.children!.map((child) => (
            <NavItemComponent
              key={child.label}
              item={child}
              isExpanded={false}
              onToggle={onToggle}
              activeItem={activeItem}
              setActiveItem={setActiveItem}
              isChild
            />
          ))}
        </VStack>
      )}
    </Box>
  );
};
