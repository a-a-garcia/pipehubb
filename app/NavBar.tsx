"use client";
import React from "react";
import Image from "next/image";
import logo from "@/public/images/pipeHubb_logo_nav.png";
import { RxDropdownMenu } from "react-icons/rx";
import {
  Flex,
  Container,
  DropdownMenu,
  Box,
  Button,
  Avatar,
  Link,
  Skeleton,
  Card,
  Text
} from "@radix-ui/themes";
import NextLink from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { FaUserTie } from "react-icons/fa6";

const AuthStatus = () => {
  const { status, data: session } = useSession();

  console.log(status, session);

  if (status === "loading") {
    return;
  }

  if (status === "unauthenticated") {
    return;
  }

  return (
    <Box>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button size="3" className="hover:cursor-pointer">
            <Avatar
              src={session!.user!.image!}
              fallback={<FaUserTie />}
              size="2"
              radius="full"
            />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>Welcome to PipeHubb, {session!.user!.name} </DropdownMenu.Label>
          <DropdownMenu.Separator />
          <DropdownMenu.Item onClick={() => signOut({callbackUrl: '/'})}>
            <Text className="hover:underline hover:cursor-pointer">
              Log Out
            </Text>
          </DropdownMenu.Item>
          {status === "authenticated" && (
            <DropdownMenu.Item>
              <Link
                href="/loans/pipeline
            "
              >
                Pipeline
              </Link>
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Box>
  );
};

const NavBar = () => {
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
            <AuthStatus />
          </Box>
        </Flex>
      </Container>
    </nav>
  );
};

export default NavBar;
