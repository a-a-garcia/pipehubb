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
import { number, set } from "zod";

//interface to get params from the URL
interface Props {
  params: {
    id: string;
  };
}

//formats "updatedAt" to more human readable "Last Updated At"
function formatKeyDisplay(key: string) {
  const result = key.replace(/([A-Z])/g, " $1");
  if (key === "updatedAt") return "Last Updated At";
  return result.charAt(0).toUpperCase() + result.slice(1);
}

const LoanDetailPage = ({ params }: Props) => {
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loanColor, setLoanColor] = useState<string>("");
  const [activityLog, setActivityLog] = useState<[]>([]);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [nextStageInfo, setNextStageInfo] =
    useState<loansDisplayDataInterface>();
  const [previousStageInfo, setPreviousStageInfo] =
    useState<loansDisplayDataInterface>();

  useEffect(() => {
    const fetchLoan = async () => {
      const response = await fetch(`/api/loans/${params.id}`);
      const loan = await response.json();
      setLoan(loan);

      // mapping over loansDisplayData, and if an item's .value matches loanStage, dynamically set the color
      loansDisplayData.map((displayData) => {
        if (displayData.value === loan.pipelineStage) {
          setLoanColor(displayData.color);
        }
      });

      // find the current index with .findIndex, which returns the index of the first element in the array that satisfies the provided testing function
      setCurrentStageIndex(
        loansDisplayData.findIndex(
          (displayData) => displayData.value === loan?.pipelineStage
        )
      );
    };

    // fetches the activity log for the loan
    const fetchActivityLog = async () => {
      const response = await fetch(`/api/activitylog/${params.id}`);
      const activityLog = await response.json();
      setActivityLog(activityLog);
    };

    //function calls
    fetchLoan();
    fetchActivityLog();
  }, []);

  // separate useEffect to handle the forward and back buttons
  useEffect(() => {
    //logic to prevent forward and back buttons from rendering when there is no next or previous stage
    if (currentStageIndex !== -1) {
      if (currentStageIndex < loansDisplayData.length) {
        setNextStageInfo(loansDisplayData[currentStageIndex + 1]);
        setPreviousStageInfo(loansDisplayData[currentStageIndex - 1]);
      }
    }

    // the state for these must be placed in the dependency array so the value is immediately updated once state is set (calling the setter schedules an update, but doesn't immediately update the state value)
  }, [currentStageIndex, nextStageInfo, previousStageInfo]);

  const handleStageChange = async (stageInfo: loansDisplayDataInterface) => {
    //patch request to update the pipelineStage
    await fetch(`/api/loans/${params.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pipelineStage: stageInfo.value }),
    });
    //refresh the page to reflect the change
    window.location.reload();
  };

  return (
    <div>
      <Card className="!bg-cactus">
        <Flex justify={"between"} align="center">
          <Heading size={"5"}>
            You're viewing {loan?.borrowerName}'s loan.
          </Heading>
          <Flex gap={"3"}>
            {previousStageInfo && (
              <Button
                onClick={() => handleStageChange(previousStageInfo)}
                className="hover:cursor-pointer"
                style={{ backgroundColor: previousStageInfo?.color }}
              >
                <IoArrowBackCircleOutline />
                Return loan to {previousStageInfo?.value} stage
              </Button>
            )}
            {nextStageInfo && (
              <Button
                onClick={() => handleStageChange(nextStageInfo)}
                className="hover:cursor-pointer"
                style={{ backgroundColor: nextStageInfo?.color }}
              >
                Advance loan to {nextStageInfo?.value} stage
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
              <Flex direction={"column"} align={"center"} justify={"center"}>
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

                <Tabs.Trigger
                  value="documentChecklist"
                  className="hover:cursor-pointer"
                >
                  Document Checklist
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
