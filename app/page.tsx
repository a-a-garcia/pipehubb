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
import SignUpForm from "./components/SignUpForm";
import { useState } from "react";

export default function Home() {
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSigupLoading] = useState(false);
  const { status } = useSession();
  const router = useRouter();
  if (status === "authenticated") {
    router.push("/loans/pipeline");
  }

  const handleClick = (isLogin: Boolean, isSignup: Boolean) => {
    if (isLogin) {
      setLoginLoading(true);
      signIn(undefined, { callbackUrl: "/loans/pipeline" });
    } else if (isSignup) {
      setSigupLoading(true);
      router.push("/sign-up");
    }
  };

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
              onClick={() => handleClick(true, false)}
            >
              Log In
              {loginLoading && <Spinner />}
            </Button>
            <Button
              className="hover:cursor-pointer myCustomButton"
              size={"3"}
              onClick={() => handleClick(false, true)}
            >
              Sign Up
              {signupLoading && <Spinner />}
            </Button>
          </Flex>
        </Flex>
      </Card>
    </div>
  );
}
