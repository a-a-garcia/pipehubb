import { Loan } from "@prisma/client";
import { Card, Flex, Heading } from "@radix-ui/themes";
import React from "react";

const LoanHeading = ({loan} : {loan: Loan}) => {
  return (
    <Card className="!bg-cactus">
      <Flex justify={"between"} align="center">
        <Heading size={"5"}>
          You're viewing {loan?.borrowerName}'s loan.
        </Heading>
      </Flex>
    </Card>
  );
};

export default LoanHeading;
