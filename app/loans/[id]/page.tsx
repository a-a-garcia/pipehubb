"use client";
import { Loan } from "@prisma/client";
import {
  Card,
  Flex,
  Heading,
  Button,
  Grid,
  Box,
  Tabs,
  Separator,
  ScrollArea,
  Inset,
} from "@radix-ui/themes";
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
import Skeleton from "@/app/components/Skeleton";
import Spinner from "@/app/components/Spinner";
import { FaEdit } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import Image from "next/image";
import logo from "@/public/images/pipeHubb_logo_transparent.png";
import FileNotes from "@/app/components/FileNotes";
import Checklist from "@/app/components/Checklist";
import CustomAlertDialog from "@/app/components/CustomAlertDialog";
import { useRouter } from "next/navigation";
import DocumentChecklist from "@/app/components/DocumentChecklist";
import Tasks from "@/app/components/Tasks";
import LoanHeading from "@/app/components/LoanHeading";
import LoanDetails from "@/app/components/LoanDetails";

//interface to get params from the URL
interface Props {
  params: {
    id: string;
  };
}

const LoanDetailPage = ({ params }: Props) => {
  const [loan, setLoan] = useState<Loan | null>(null);

  const [loanColor, setLoanColor] = useState<string>("");

  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);

  const [nextStageInfo, setNextStageInfo] =
    useState<loansDisplayDataInterface>();

  const [previousStageInfo, setPreviousStageInfo] =
    useState<loansDisplayDataInterface>();

  const [isLoading, setIsLoading] = useState<boolean>(true);

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

      setIsLoading(false);
      // find the current index with .findIndex, which returns the index of the first element in the array that satisfies the provided testing function
      setCurrentStageIndex(
        loansDisplayData.findIndex(
          (displayData) => displayData.value === loan?.pipelineStage
        )
      );
    };

    //function calls
    fetchLoan();
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

    await fetch(`/api/activitylog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loanId: parseInt(params.id),
        message: `USER moved loan to ${stageInfo.value} stage.`,
      }),
    });
    //refresh the page to reflect the change
    window.location.reload();
  };

  const handleDelete = async () => {
    try {
      fetch(`/api/loans/${params.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      window.location.href = "/loans/pipeline";
    } catch {
      console.error("An error occurred");
    }
  };

  return (
    <div>
      {isLoading ? (
        <div>
          <Flex justify={"center"}>
            <Text size="4">
              Loading...
              <Spinner />
            </Text>
          </Flex>
          <Skeleton height={"3rem"} />
        </div>
      ) : (
        <LoanHeading loan={loan!} />
      )}
      <Grid
        columns={{ initial: "1", md: "2" }}
        style={{ gridTemplateColumns: "1fr 3fr" }}
        gap="5"
        className="mt-5"
      >
        {isLoading ? (
          <Skeleton height={"40rem"} />
        ) : (
          <LoanDetails loanColor={loanColor} loan={loan!} />
        )}

        {isLoading ? (
          <Skeleton height={"40rem"} />
        ) : (
          <Card className="!bg-maroon">
            <ScrollArea
              type="auto"
              scrollbars="vertical"
              style={{ height: 900 }}
            >
              <Card className="!bg-neutral-300">
                <Tabs.Root defaultValue="activityLog" className="!text-white">
                  <Tabs.List>
                    <Tabs.Trigger
                      value="activityLog"
                      className="hover:cursor-pointer"
                    >
                      Activity Log
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="tasks"
                      className="hover:cursor-pointer"
                    >
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

                    <Tabs.Trigger
                      value="loanActions"
                      className="hover:cursor-pointer"
                    >
                      Loan Actions
                    </Tabs.Trigger>
                  </Tabs.List>

                  <Box>
                    <Tabs.Content value="activityLog">
                      <ActivityLog loan={loan!} />
                    </Tabs.Content>
                  </Box>

                  <Box>
                    <Tabs.Content value="tasks">
                      <Tasks loan={loan!} />
                    </Tabs.Content>
                  </Box>

                  <Box>
                    <Tabs.Content value="fileNotes">
                      <FileNotes loan={loan!} />
                    </Tabs.Content>
                  </Box>

                  <Box>
                    <Tabs.Content value="documentChecklist">
                      <DocumentChecklist loan={loan!} />
                    </Tabs.Content>
                  </Box>

                  <Box>
                    <Tabs.Content value="loanActions">
                      <Card className="mt-5 !bg-darkGrey">
                        <Flex gap={"3"} direction={"column"}>
                          <Flex direction={"column"} gap="4" align={"center"}>
                            <NextLink href={`/loans/edit/${loan?.id}`}>
                              <Button
                                color="indigo"
                                className="hover:cursor-pointer"
                              >
                                <Text>Edit loan</Text>
                                <FaEdit />
                              </Button>
                            </NextLink>
                            <CustomAlertDialog loan={loan!} />
                          </Flex>

                          <Separator my="3" size="4" />
                          <Flex justify={"between"}>
                            {previousStageInfo && (
                              <Button
                                onClick={() =>
                                  handleStageChange(previousStageInfo)
                                }
                                className="hover:cursor-pointer"
                                style={{
                                  backgroundColor: previousStageInfo?.color,
                                }}
                              >
                                <IoArrowBackCircleOutline />
                                Return loan to {previousStageInfo?.value} stage
                              </Button>
                            )}
                            {nextStageInfo && (
                              <Button
                                onClick={() => handleStageChange(nextStageInfo)}
                                className="hover:cursor-pointer"
                                style={{
                                  backgroundColor: nextStageInfo?.color,
                                }}
                              >
                                Advance loan to {nextStageInfo?.value} stage
                                <IoArrowForwardCircleOutline />
                              </Button>
                            )}
                          </Flex>
                        </Flex>
                      </Card>
                    </Tabs.Content>
                  </Box>
                </Tabs.Root>
              </Card>
            </ScrollArea>
          </Card>
        )}
      </Grid>
    </div>
  );
};

export default LoanDetailPage;
