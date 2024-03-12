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
import NextLink from "next/link";

const NavBar = () => {
  const navLinks = [
    {
      name: "Login",
      href: "/login",
    },
    {
      name: "Sign Up",
      href: "/signup",
    },
    {
      name: "Logout",
      href: "/logout",
    },
    {
      name: "Settings",
      href: "/settings",
    },
  ];

  return (
    <nav
      className="bg-darkGrey
    px-5 py-2 shadow-md"
    >
      <Container>
        <Flex justify={"between"} align={"center"}>
          <NextLink href="/">
            <Image src={logo} alt="Pipehub logo" className="size-20" />
          </NextLink>

          <Box>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="soft" className="hover:cursor-pointer">
                  <RxDropdownMenu className="size-8 text-white" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content variant="soft">
                <DropdownMenu.Label>Hi, USER.</DropdownMenu.Label>
                {navLinks.map((navLink) => {
                  return (
                    <DropdownMenuItem
                      key={navLink.name}
                      className="hover:cursor-pointer"
                    >
                      <NextLink href={navLink.href}>{navLink.name}</NextLink>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Box>
        </Flex>
      </Container>
    </nav>
  );
};

export default NavBar;
