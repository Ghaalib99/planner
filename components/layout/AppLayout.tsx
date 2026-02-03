"use client";

import { Box, Flex } from "@chakra-ui/react";
import * as Drawer from "@/components/ui/drawer";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useState } from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Flex minH="100vh" bg="white">
      {/* Desktop Sidebar */}
      <Box borderRight="3px" borderColor="gray.700" display={{ base: "none", md: "block" }}>
        <Sidebar />
      </Box>

      {/* Mobile Sidebar Drawer */}
      <Drawer.DrawerRoot
        open={isSidebarOpen}
        onOpenChange={(e) => setIsSidebarOpen(e.open)}
        placement="start"
      >
        <Drawer.DrawerBackdrop />
        <Drawer.DrawerContent>
          <Drawer.DrawerHeader>
            <Drawer.DrawerTitle>Menu</Drawer.DrawerTitle>
            <Drawer.DrawerCloseTrigger />
          </Drawer.DrawerHeader>
          <Drawer.DrawerBody p={0}>
            <Sidebar />
          </Drawer.DrawerBody>
        </Drawer.DrawerContent>
      </Drawer.DrawerRoot>

      {/* Main Content Area */}
      <Flex flex={1} direction="column" overflow="hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <Box
          as="main"
          flex={1}
          overflowY="auto"
          
          
        >
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};
