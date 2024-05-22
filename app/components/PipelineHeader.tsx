import { Card, Flex, Heading, Button, Text, Spinner } from "@radix-ui/themes";
import React from "react";
import NextLink from "next/link";
import { MdOutlineCreate } from "react-icons/md";
import { useSession } from "next-auth/react";

const PipelineHeader = ({teamName} : {teamName?: string}) => {
  const { status, data: session } = useSession();
  return (
    <Card className="!bg-cactus">
      <Flex justify={"between"} align="center" gap="2">
        { status === "authenticated" ? (
          <Heading size={"5"}>Welcome, {session!.user!.name}!</Heading>
        ) : <Spinner />
        }
        {teamName ? (
        <Text>You&apos;re currently viewing {teamName}&apos;s pipeline.</Text>
        ) : <Text>No pipeline to view.</Text>}
      </Flex>
    </Card>
  );
};

export default PipelineHeader;
