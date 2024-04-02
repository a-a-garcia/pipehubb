"use client";
import Skeleton from "@/app/components/Skeleton";
import { Loan } from "@prisma/client";
import {
  Button,
  Card,
  Flex,
  Grid,
  Heading
} from "@radix-ui/themes";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import LoanCard from "./LoanCard";
import HeaderOne from "@/app/components/PipelineHeader";
import { loansDisplayData, loansDisplayDataInterface } from "@/app/loans/loansDisplayData"
import PipelineHeader from "@/app/components/PipelineHeader";

const PipelinePage = () => {
  const [loans, setLoans] = useState<Record<string, Loan[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      const response = await fetch("/api/loans");
      const data = await response.json();
      console.log(data);
      setLoans(data);
      setIsLoading(false);
    };
    fetchLoans();
  }, []);

  return (
    <div>
      <Flex direction={"column"} gap={"5"}>
        <PipelineHeader />
        <Card className="!bg-maroon">
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
                <Card>
                  <Flex direction={"column"} gap="5">
                    {isLoading && <Skeleton count={5} height={"5rem"} />}
                    {(loans[data.value] || []).map((loan: Loan) => {
                      return (
                        <LoanCard
                          key={loan.borrowerName}
                          loan={loan}
                          bgColor={data.color}
                        />
                      );
                    })}
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
