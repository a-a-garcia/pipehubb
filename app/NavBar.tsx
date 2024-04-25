"use client";
import React from "react";
import Image from "next/image";
import logo from "@/public/images/pipeHubb_logo_nav.png";
import { RxDropdownMenu } from "react-icons/rx";
import { Flex, Container, DropdownMenu, Box, Button, Avatar, Link, Skeleton } from "@radix-ui/themes";
import NextLink from "next/link";
import { useSession } from "next-auth/react";

const AuthStatus = () => {
  const { status, data: session } = useSession();

  if (status === "loading") {
    return <Skeleton width={"3rem"} />;
  }

  if (status === "unauthenticated") {
    return (
      <Link className="nav-link" href="/api/auth/signin">
        Login
      </Link>
    );
  }

  return (
    <Box>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Avatar
            src={session!.user!.image!}
            fallback="?"
            size="2"
            radius="full"
            className="cursor-pointer"
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>{session!.user!.email}</DropdownMenu.Label>
          <DropdownMenu.Item>
            <Link
              href="/api/auth/signout
            "
            >
              Log Out
            </Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Box>
  );
};

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
                <DropdownMenu.Item>
                  <AuthStatus />
                </DropdownMenu.Item>
                {/* {navLinks.map((navLink) => {
                  return (
                    <DropdownMenu.Item
                      key={navLink.name}
                      className="hover:cursor-pointer"
                    >
                      <NextLink href={navLink.href}>{navLink.name}</NextLink>
                    </DropdownMenu.Item>
                  );
                })} */}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Box>
        </Flex>
      </Container>
    </nav>
  );
};

export default NavBar;
