import { Loan } from "@prisma/client";
import { Box, Card, Flex, ScrollArea, Text } from "@radix-ui/themes";
import React from "react";

//formats "updatedAt" to more human readable "Last Updated At"
function formatKeyDisplay(key: string) {
  const result = key.replace(/([A-Z])/g, " $1");
  if (key === "updatedAt") return "Loan Details Last Updated";
  return result.charAt(0).toUpperCase() + result.slice(1);
}

const LoanDetails = ({
  loanColor,
  loan,
}: {
  loanColor: string;
  loan: Loan;
}) => {
  return (
    <Card className="!bg-maroon text-white">
      <Flex direction={"column"} gap="4">
        <Card style={{ backgroundColor: loanColor }}>
          <Flex direction={"column"} align={"center"} justify={"center"}>
            <Text>{loan?.pipelineStage}</Text>
            <Text>{loan?.borrowerName}</Text>
          </Flex>
        </Card>
        <ScrollArea
          type="auto"
          scrollbars="both"
          style={{ height: 800 }}
        >
          <Box>
            <Card className="!bg-darkGrey text-white">
              <Flex direction={"column"} align={"center"}>
                <Text>Loan Details</Text>
              </Flex>
            </Card>
            {Object.keys(loan || {}).map((loanKey) => {
              if (loanKey === "id") return null;

              if (loan && loanKey in loan) {
                let rawValue: string | number | bigint | Date | null =
                  loan[loanKey as keyof typeof loan];
                let value: string | number | bigint | null;

                if (rawValue === null) return null;

                if (loanKey === "createdAt" || loanKey === "updatedAt") {
                  if (typeof rawValue === "bigint") { throw new Error ("Unexpected BigInt for field " + loanKey);}
                  value = new Date(rawValue!).toLocaleString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  });
                } else if (rawValue instanceof Date) {
                  throw new Error("Unexpected Date for field " + loanKey);
                } else {
                  value = typeof rawValue === "bigint" ? rawValue.toString() : rawValue;
                }

                return (
                  <Card className="text-black !bg-neutral-300" key={loanKey}>
                    <Flex direction={"column"} align={"center"}>
                      <Text>{formatKeyDisplay(loanKey)}: </Text>
                      <Card className="bg-neutral-100">{value}</Card>
                    </Flex>
                  </Card>
                );
              }
              return null;
            })}
          </Box>
        </ScrollArea>
      </Flex>
    </Card>
  );
};

export default LoanDetails;
