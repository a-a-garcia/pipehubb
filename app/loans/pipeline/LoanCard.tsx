import { Loan } from "@prisma/client";
import { Box, Card, Flex, Text } from "@radix-ui/themes";
import React from "react";

interface Props {
  loan: Loan;
  bgColor: string;
}

const LoanCard = ({ loan, bgColor }: Props) => {
  return (
    <div key={loan.borrowerName}>
      <Box
        className="text-white p- text-nowrap
                                        overflow-hidden
                                        rounded-md text-center p-1"
        style={{ backgroundColor: bgColor }}
      >
        <Text>{loan.borrowerName}</Text>
      </Box>
      <Card size="2">
        <Flex justify={"center"} align={"center"} direction={"column"}>
          <Box>
            <Text>Loan Amount: ${loan.loanAmount}</Text>
          </Box>
        </Flex>
      </Card>
    </div>
  );
};

export default LoanCard;
