"use client";
import { Loan } from "@prisma/client";
import { Card, Flex, Heading, Button, Grid, Box, Tabs } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { Text } from "@radix-ui/themes";
import {
  loansDisplayData,
  loansDisplayDataInterface,
} from "../loansDisplayData";
import ActivityLog from "@/app/components/ActivityLog";
import prisma from "@/prisma/client";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { set } from "zod";

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
  const [activityLog, setActivityLog] = useState<[]>([]);
  const [forwardButtonInfo, setForwardButtonInfo] =
    useState<loansDisplayDataInterface>();
  const [backButtonInfo, setBackButtonInfo] =
    useState<loansDisplayDataInterface>();

  useEffect(() => {
    const fetchLoan = async () => {
      const response = await fetch(`/api/loans/${params.id}`);
      const loan = await response.json();
      setLoan(loan);

      const loanStage = loan.pipelineStage;

      loansDisplayData.map((displayData) => {
        if (displayData.value === loanStage) {
          setLoanColor(displayData.color);
        }
      });

      const currentIndex = loansDisplayData.findIndex(
        (displayData) => displayData.value === loanStage
      );
      console.log(currentIndex);

      if (currentIndex !== -1) {
        if (currentIndex < loansDisplayData.length) {
          const nextStage = loansDisplayData[currentIndex + 1];
          const previousStage = loansDisplayData[currentIndex - 1];
          setForwardButtonInfo(nextStage);
          setBackButtonInfo(previousStage);
        }
      }
    };

    const fetchActivityLog = async () => {
      const response = await fetch(`/api/activitylog/${params.id}`);
      const activityLog = await response.json();
      setActivityLog(activityLog);
    };

    fetchLoan();
    fetchActivityLog();
  }, [forwardButtonInfo, backButtonInfo]);

  return (
    <div>
      <Card className="!bg-cactus">
        <Flex justify={"between"} align="center">
          <Heading size={"5"}>
            You're viewing {loan?.borrowerName}'s loan.
          </Heading>
          <Flex gap={"3"}>
            {backButtonInfo && (
              <Button
                className="hover:cursor-pointer"
                style={{ backgroundColor: backButtonInfo?.color }}
              >
                <IoArrowBackCircleOutline />
                Return loan to {backButtonInfo?.value} stage
              </Button>
            )}
            {forwardButtonInfo && (
              <Button
                className="hover:cursor-pointer"
                style={{ backgroundColor: forwardButtonInfo?.color }}
              >
                Advance loan to {forwardButtonInfo?.value} stage
                <IoArrowForwardCircleOutline />
              </Button>
            )}
          </Flex>
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
                <Text>Current Stage: {loan?.pipelineStage}</Text>
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
                  let rawValue: string | number | Date | null =
                    loan[loanKey as keyof typeof loan];
                  let value: string | number | null;

                  if (rawValue === null) return null;

                  if (loanKey === "createdAt" || loanKey === "updatedAt") {
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
                    value = rawValue;
                  }

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
        <Card className="!bg-maroon">
          <Card>
            <Tabs.Root defaultValue="activityLog">
              <Tabs.List>
                <Tabs.Trigger
                  value="activityLog"
                  className="hover:cursor-pointer"
                >
                  Activity Log
                </Tabs.Trigger>
                <Tabs.Trigger value="tasks" className="hover:cursor-pointer">
                  Tasks
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="fileNotes"
                  className="hover:cursor-pointer"
                >
                  File Notes
                </Tabs.Trigger>
              </Tabs.List>

              <Box>
                <Tabs.Content value="activityLog">
                  <ActivityLog activityLog={activityLog} />
                </Tabs.Content>
              </Box>
            </Tabs.Root>
          </Card>
        </Card>
      </Grid>
    </div>
  );
};

export default LoanDetailPage;
