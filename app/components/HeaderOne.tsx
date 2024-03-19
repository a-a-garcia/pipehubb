import { Card, Flex, Heading, Button } from "@radix-ui/themes";
import React from "react";
import NextLink from "next/link";

const HeaderOne = () => {
  return (
    <Card className="!bg-cactus">
      <Flex justify={"between"} align="center">
        <Heading size={"5"}>Welcome to your pipeline, $USER</Heading>
        <NextLink href="/loans/new">
          <Button className="hover:cursor-pointer">+ New Loan</Button>
        </NextLink>
      </Flex>
    </Card>
  );
};

export default HeaderOne;
