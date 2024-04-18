import { Loan } from "@prisma/client";
import { Box, Card, Flex, Inset, Text } from "@radix-ui/themes";
import React from "react";
import NextLink from "next/link";

interface Props {
  loan: Loan;
  bgColor: string;
}

const LoanCard = ({ loan, bgColor }: Props) => {
  return (
    <div key={loan.borrowerName}>
      <Box
        className="text-white p- text-nowrap overflow-hidden rounded-md text-center p-1"
        style={{ backgroundColor: bgColor }}
      >
        <Text>{loan.borrowerName}</Text>
      </Box>
      <NextLink href={"/loans/" + loan.id + "/activity-log"}>
        <Card size="2" className="!bg-neutral-100">
          <Flex justify={"center"} align={"center"} direction={"column"}>
            <Box>
              <Text>Loan Amount: ${loan.loanAmount}</Text>
            </Box>
          </Flex>
        </Card>
      </NextLink>
    </div>
  );
};

export default LoanCard;
