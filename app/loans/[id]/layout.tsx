"use client";
import LoanDetails from "@/app/components/LoanDetails";
import LoanHeading from "@/app/components/LoanHeading";
import {
  Badge,
  Card,
  Flex,
  Grid,
  ScrollArea,
  Spinner,
  TabNav,
  Text,
} from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { error } from "console";
import React, { use, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import {
  loansDisplayData,
  loansDisplayDataInterface,
} from "../loansDisplayData";
import ErrorMessage from "@/app/components/ErrorMessage";
import logo from "@/public/images/pipeHubb_logo_transparent.png";
import Image from "next/image";
import { queryClient } from "@/app/api/ReactQueryProviderClient";
import LoadingBadge from "@/app/components/LoadingBadge";

const ActivityLogPage = ({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: { id: string } }>) => {
  const [loanColor, setLoanColor] = useState<string>("");
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const {
    isFetched,
    isPending,
    error,
    data: loan,
  } = useQuery({
    queryKey: ["loan"],
    queryFn: () => fetch(`/api/loans/${params.id}`).then((res) => res.json()),
  });

  useEffect(() => {
    // mapping over loansDisplayData, and if an item's .value matches loanStage, dynamically set the color
    if (loan) {
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
    }
  }, [isFetched, loan]);

  if (isPending) {
    return (
      <Flex justify="center" align="center" style={{ height: "80vh" }}>
        <LoadingBadge />
      </Flex>
    );
  }

  if (error) {
    return (
      <ErrorMessage>
        An error occurred: <strong>{error.message}</strong>
      </ErrorMessage>
    );
  }

  return (
    <div>
      <LoanHeading loan={loan!} />
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
              scrollbars="both"
              style={{ height: 900, width: 810 }}
            >
              <Card className="!bg-neutral-300">
                <div>{children}</div>
              </Card>
            </ScrollArea>
          </Card>
        )}
      </Grid>
    </div>
  );
};

export default ActivityLogPage;
