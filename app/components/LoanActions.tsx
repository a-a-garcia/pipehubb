"use client";
import React, { useEffect, useState } from "react";
import { loansDisplayData, loansDisplayDataInterface } from "../loans/loansDisplayData";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CustomAlertDialog from "@/app/components/CustomAlertDialog";
import {
  Box,
  Card,
  Flex,
  Button,
  Separator,
  Text,
  Spinner,
} from "@radix-ui/themes";
import NextLink from "next/link";
import { FaEdit } from "react-icons/fa";
import {
  IoArrowBackCircleOutline,
  IoArrowForwardCircleOutline,
} from "react-icons/io5";
import LoanTabs from "@/app/components/LoanTabs";
import ErrorMessage from "@/app/components/ErrorMessage";
import { Loan } from "@prisma/client";
import { set } from "date-fns";

type User = {
  id: string
  name: string
  email: string
  image: string
}

const LoanActions = ({ params, user }: { params: { id: string }, user: User }) => {
  const queryClient = useQueryClient();
  const loan = queryClient.getQueryData<Loan>(["loan"]);
  
  const [editLoading, setEditLoading] = useState(false);
  const [prevStageLoading, setPrevStageLoading] = useState(false);
  const [nextStageLoading, setNextStageLoading] = useState(false);
  
  const [loanColor, setLoanColor] = useState<string>("");
  
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  
  const [nextStageInfo, setNextStageInfo] =
  useState<loansDisplayDataInterface>();
  
  const [previousStageInfo, setPreviousStageInfo] =
  useState<loansDisplayDataInterface>();
  
  useEffect(() => {
      // mapping over loansDisplayData, and if an item's .value matches loanStage, dynamically set the color
      if (loan) {
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
        }
    }, [loan]);
    
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
      try {
        //patch request to update the pipelineStage
        await fetch(`/api/loans/${params.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ pipelineStage: stageInfo.value }),
        });
        
        // await fetch(`/api/activitylog`, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //         loanId: params.id,
        //         userId: user.id,
        //         message: `${user.name} moved loan to ${stageInfo.value} stage.`,
        //     }),
        // });
      } catch (error) {
        console.error("ERROR: " + error)
      }
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
    //this has been moved to just above the return statement because if not, the useState/useEffect hooks may not always call (ie if a loan is not found) which violates the rules of hooks - they must be called in the same order each time. 
    if (!loan) {
      return <ErrorMessage>Could not find loan.</ErrorMessage>;
    }
    return (
        <Box>
      <LoanTabs params={params} isLoanActions={true} />
      <Card className="mt-5 !bg-darkGrey">
        <Flex gap={"3"} direction={"column"} className="animate-dropInLite">
          <Flex direction={"column"} gap="4" align={"center"}>
            <NextLink href={`/loans/edit/${loan?.id}`}>
              <Button
                color="indigo"
                className="hover:cursor-pointer"
                onClick={() => setEditLoading(true)}
                disabled={editLoading}
              >
                <Text>Edit loan</Text>
                <FaEdit />
                {editLoading && <Spinner />}
              </Button>
            </NextLink>
            <CustomAlertDialog loan={loan!} />
          </Flex>

          <Separator my="3" size="4" />
          <Flex justify={"between"} className="animate-dropIn">
            {previousStageInfo && (
              <Button
                onClick={() => {
                  handleStageChange(previousStageInfo)
                  setPrevStageLoading(true)
                }}
                className="hover:cursor-pointer"
                style={{
                  backgroundColor: previousStageInfo?.color,
                }}
              >
                {prevStageLoading && <Spinner />}
                <IoArrowBackCircleOutline />
                Return loan to {previousStageInfo?.value} stage
              </Button>
            )}
            {nextStageInfo && (
              <Button
                onClick={() =>  {
                  handleStageChange(nextStageInfo) 
                  setNextStageLoading(true)
                }}
                className="hover:cursor-pointer"
                style={{
                  backgroundColor: nextStageInfo?.color,
                }}
              >
                Advance loan to {nextStageInfo?.value} stage
                <IoArrowForwardCircleOutline />
                {nextStageLoading && <Spinner />}
              </Button>
            )}
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
};

export default LoanActions;
