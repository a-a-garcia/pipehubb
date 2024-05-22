import { Loan } from "@prisma/client";
import { Button, Card, Flex, Heading, Link } from "@radix-ui/themes";
import React from "react";
import NextLink from 'next/link';

const LoanHeading = ({ loan }: { loan: Loan }) => {
  return (
    <Card className="!bg-cactus">
      <Flex justify={"between"} align="center">
        <Heading size={"5"}>
          You&apos;re viewing {loan?.borrowerName}&apos;s loan.
        </Heading>
        <NextLink href={"/loans/pipeline"}>
          <Button size={"1"} className="hover:cursor-pointer">Return to Pipeline</Button>
        </NextLink>
      </Flex>
    </Card>
  );
};

export default LoanHeading;
