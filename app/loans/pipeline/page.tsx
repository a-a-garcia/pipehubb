"use client";
import Skeleton from "@/app/components/Skeleton";
import { Loan } from "@prisma/client";
import {
  Badge,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Spinner,
  Text,
} from "@radix-ui/themes";
import { GrDocumentMissing } from "react-icons/gr";
import { useEffect, useState } from "react";
import LoanCard from "./LoanCard";
import {
  loansDisplayData,
  loansDisplayDataInterface,
} from "@/app/loans/loansDisplayData";
import PipelineHeader from "@/app/components/PipelineHeader";
import { useQuery } from "@tanstack/react-query";
import ErrorMessage from "@/app/components/ErrorMessage";
import { useSession } from "next-auth/react";
import PipelineSelect from "@/app/components/PipelineSelect";
import { MdOutlineCreate } from "react-icons/md";
import NextLink from "next/link";
import FirstTimeLogin from "@/app/components/LoginMessage";
import LoadingBadge from "@/app/components/LoadingBadge";

const PipelinePage = () => {
  const { status, data: session } = useSession();
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const {
    isFetched,
    error,
    isLoading,
    data: pipelineData,
  } = useQuery({
    queryKey: ["allLoans", session?.user.id],
    queryFn: () => {
      const url = new URL(window.location.href);
      const teamName = url.searchParams.get("teamName");
      const fetchUrl = teamName
        ? `/api/loans?teamName=${teamName}`
        : `/api/loans`;
      return fetch(fetchUrl).then(async (res) => {
        const response = await res.json();
        if (response.message === "teamPermissions=false") {
          throw new Error("You are not apart of this team.");
        } else return response;
      });
    },
  });
  useEffect(() => {
    if (isFetched) {
      setIsLoadingPage(false);
    }
  }, [isFetched]);

  if (error)
    return (
      <ErrorMessage>
        <strong>{error.message}</strong>
      </ErrorMessage>
    );

  console.log(pipelineData);
  return (
    <div>
      <FirstTimeLogin />
      <Flex direction={"column"} gap={"5"}>
        {isLoading && <LoadingBadge />}
        <Flex justify={"between"} align={"center"}>
          {isLoading ? (
            <Spinner />
          ) : pipelineData && pipelineData[1] ? (
            <PipelineHeader teamName={pipelineData[1].teamName} />
          ) : (
            <PipelineHeader />
          )}
          <PipelineSelect />
        </Flex>
        <Card className="!bg-maroon">
          <Flex justify={"end"} className="mb-3">
            <NextLink href="/loans/new">
              <Button size="1" className="hover:cursor-pointer myCustomButton">
                Create Loan
                <MdOutlineCreate />
              </Button>
            </NextLink>
          </Flex>
          <Grid columns={{ initial: "1", md: "6" }} gap={"4"}>
            {loansDisplayData.map((data: loansDisplayDataInterface) => (
              <div key={data.name}>
                <Heading
                  style={{ backgroundColor: data.color }}
                  className="text-white p-4 text-nowrap rounded-md"
                  size={"4"}
                >
                  {data.name}
                </Heading>
                <Card className="!bg-neutral-300">
                  <Flex direction={"column"} gap="5">
                    {isLoadingPage && <Skeleton count={5} height={"5rem"} />}
                    {/* checking for the existence of data before trying to access data or will get a runtime `pipelineData is undefined` error.  Additionally, we must access `pipelineData[0]` now as the data returned from the API is an [{...pipeline data...}}, {...loan team data...}]*/}
                    {pipelineData &&
                    pipelineData[0]?.[data.value]?.length === 0 ? (
                      <Flex justify={"center"}>
                        <Badge color="gray">
                          <GrDocumentMissing />
                          No loans found
                        </Badge>
                      </Flex>
                    ) : (
                      (
                        (pipelineData && pipelineData[0]?.[data.value]) ||
                        []
                      ).map((loan: Loan) => {
                        return (
                          <div>
                            {pipelineData &&
                              pipelineData[0][data.value].length === 0 && (
                                <Text>No loans in this stage</Text>
                              )}
                            <LoanCard
                              key={loan.borrowerName}
                              loan={loan}
                              bgColor={data.color}
                            />
                          </div>
                        );
                      })
                    )}
                  </Flex>
                </Card>
              </div>
            ))}
          </Grid>
        </Card>
      </Flex>
    </div>
  );
};

export default PipelinePage;
