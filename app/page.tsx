"use client";
import {
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Spinner,
  Text,
} from "@radix-ui/themes";
import Image from "next/image";
import Logo from "../public/images/pipeHubb_logo_with_text.png";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();
  if (status === "authenticated") {
    router.push("/loans/pipeline");
  }


  return (
    <div className="flex flex-col items-center md:flex-row md:items-stretch md:pt-24">
      <Image
        src={Logo}
        alt="PipeHubb logo, with 'Pipehubb' as text underneath"
      ></Image>
      <Card className="!bg-cactus shadow-md p-5 mt-10 md:mt-0" size={"5"}>
        <Flex direction={"column"} gap={"5"}>
          <Heading className="text-deepPink" size={"8"}>
            [pie-YEE-puh-HUH-buh] (noun):{" "}
          </Heading>
          <Text size={"7"} className="font-medium">
            Sales pipeline software designed specifically with the loan officer
            team in mind.
          </Text>
          <Flex
            justify={"center"}
            gap={"5"}
            direction="column"
            align={"center"}
          >
            <Button
              className="hover:cursor-pointer myCustomButton"
              size={"3"}
              onClick={() =>
                signIn(undefined, { callbackUrl: "/loans/pipeline" })
              }
            >
              Log In
            </Button>
              <Button
                className="hover:cursor-pointer myCustomButton"
                size={"3"}
              >
                Sign Up
              </Button>
          </Flex>
        </Flex>
      </Card>
    </div>
  );
}
