"use client";
import React from "react";
import Image from "next/image";
import logo from "@/public/images/pipeHubb_logo_nav.png";
import { RxDropdownMenu } from "react-icons/rx";
import {
  Flex,
  Container,
  DropdownMenu,
  DropdownMenuItem,
  Box,
  Button,
} from "@radix-ui/themes";

const NavBar = () => {
  return (
    <nav
      className="bg-darkGrey
    px-5 py-2 shadow-md"
    >
      <Container>
        <Flex justify={"between"} align={"center"}>
          <Image src={logo} alt="Pipehub logo" className="size-20" />

          <Box>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="soft">
                  <RxDropdownMenu className="size-8 text-white" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content variant="soft">
                <DropdownMenu.Label>Hi, USER.</DropdownMenu.Label>
                <DropdownMenuItem>Sign Up</DropdownMenuItem>
                <DropdownMenuItem>Login</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Box>
        </Flex>
      </Container>
    </nav>
  );
};

export default NavBar;
