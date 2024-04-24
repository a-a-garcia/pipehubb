import { Loan } from "@prisma/client";
import { Box, Card, Flex, Inset, Spinner, Text } from "@radix-ui/themes";
import React, { useState } from "react";
import NextLink from "next/link";

interface Props {
  loan: Loan;
  bgColor: string;
}

const LoanCard = ({ loan, bgColor }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div key={loan.borrowerName}>
      <Box
        className="text-white p- text-nowrap overflow-hidden rounded-md text-center p-1"
        style={{ backgroundColor: bgColor }}
      >
        <Flex align="center" gap="2" justify={"center"}>
          <Text>{loan.borrowerName}</Text>
          {isLoading && <Spinner />}
        </Flex>
      </Box>
      <NextLink href={"/loans/" + loan.id + "/activity-log"} onClick={() => setIsLoading(true)}>
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
