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

const PipelinePage = () => {
  const { status, data: session } = useSession();
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const {
    isFetched,
    error,
    data: loans,
  } = useQuery({
    queryKey: ["allLoans"],
    queryFn: () => fetch("/api/loans").then((res) => res.json()),
  });
  useEffect(() => {
    if (isFetched) {
      setIsLoadingPage(false);
    }
  }, [isFetched]);

  console.log(session);

  if (error)
    return (
      <ErrorMessage>
        An error occurred: <strong>{error.message}</strong>
      </ErrorMessage>
    );

  console.log(loans);

  return (
    <div>
      <FirstTimeLogin />
      <Flex direction={"column"} gap={"5"}>
        <Flex justify={"between"} align={"center"}>
          <PipelineHeader />
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
                    {loans?.[data.value]?.length === 0 ? (
                      <Flex justify={"center"}>
                        <Badge color="gray">
                          <GrDocumentMissing />
                          No loans found
                        </Badge>
                      </Flex>
                    ) : (
                      (loans?.[data.value] || []).map((loan: Loan) => {
                        return (
                          <div>
                            {loans[data.value].length === 0 && (
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
