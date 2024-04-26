import { Card, Flex, Heading, Button, Spinner } from "@radix-ui/themes";
import React from "react";
import NextLink from "next/link";
import { MdOutlineCreate } from "react-icons/md";
import { useSession } from "next-auth/react";

const PipelineHeader = () => {
  const { status, data: session } = useSession();
  return (
    <Card className="!bg-cactus">
      <Flex justify={"between"} align="center">
        { status === "authenticated" ? (
          <Heading size={"5"}>Welcome to your pipeline, {session!.user!.name}</Heading>
        ) : <Spinner />
        }
        <NextLink href="/loans/new">
          <Button size="1" className="hover:cursor-pointer myCustomButton">Create Loan<MdOutlineCreate /></Button>
        </NextLink>
      </Flex>
    </Card>
  );
};

export default PipelineHeader;
