"use client";
import { Loan } from "@prisma/client";
import { Card, Flex, Heading, Button, Grid, Box } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { Text } from "@radix-ui/themes";
import {
  loansDisplayData,
  loansDisplayDataInterface,
} from "../loansDisplayData";

interface Props {
  params: {
    id: string;
  };
}

function formatKeyDisplay(key: string) {
  const result = key.replace(/([A-Z])/g, " $1");
  if (key === "updatedAt") return "Last Updated At";
  return result.charAt(0).toUpperCase() + result.slice(1);
}

const LoanDetailPage = ({ params }: Props) => {
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loanColor, setLoanColor] = useState<string>("");

  useEffect(() => {
    const fetchLoan = async () => {
      const response = await fetch(`/api/loans/${params.id}`);
      const loan = await response.json();
      setLoan(loan);
      console.log(loan);
      const loanStage = loan.pipelineStage;
      loansDisplayData.map((displayData) => {
        if (displayData.value === loanStage) {
          setLoanColor(displayData.color);
        }
      });
    };

    fetchLoan();
  }, []);

  return (
    <div>
      <Card className="!bg-cactus">
        <Flex justify={"between"} align="center">
          <Heading size={"5"}>
            You're viewing {loan?.borrowerName}'s loan.
          </Heading>
        </Flex>
      </Card>

      <Grid
        columns={{ initial: "1", md: "2" }}
        style={{ gridTemplateColumns: "1fr 3fr" }}
        gap="5"
        className="mt-5"
      >
        <Card className="!bg-maroon text-white">
          <Flex direction={"column"} gap="4">
            <Card style={{ backgroundColor: loanColor }}>
              <Flex direction={"column"} align={"center"}>
                <Text>{loan?.pipelineStage}</Text>
                <Text>{loan?.borrowerName}</Text>
              </Flex>
            </Card>
            <Box>
              <Card className="!bg-darkGrey text-white">
                <Flex direction={"column"} align={"center"}>
                  <Text>Loan Details</Text>
                </Flex>
              </Card>
              {Object.keys(loan || {}).map((loanKey) => {
                if (loanKey === "id") return null;

                if (loan && loanKey in loan) {
                  let value: string | number | Date | null =
                    loan[loanKey as keyof typeof loan];

                  if (loanKey === "createdAt" || loanKey === "updatedAt") {
                    value = new Date(value!).toLocaleString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    });
                  }
                  if (typeof value === "number") {
                    value = value.toString();
                  }
                  console.log(typeof value);
                  return (
                    <Card className="text-black">
                      <Flex direction={"column"} align={"center"}>
                        <Text>{formatKeyDisplay(loanKey)}: </Text>
                        <Card>{value}</Card>
                      </Flex>
                    </Card>
                  );
                }
                return null;
              })}
            </Box>
          </Flex>
        </Card>
        <Card className="!bg-maroon"></Card>
      </Grid>
    </div>
  );
};

export default LoanDetailPage;
