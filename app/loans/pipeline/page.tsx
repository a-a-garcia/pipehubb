"use client";
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Inset,
  Text,
} from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import LoanCard from "./LoanCard";
import { Loan } from "@prisma/client";
import { Pipe } from "stream";

interface PipelineData {
  name: string;
  value: string;
  color: string;
}

const PipelinePage = () => {
  const [loans, setLoans] = useState<Record<string, Loan[]>>({});

  useEffect(() => {
    const fetchLoans = async () => {
      const response = await fetch("/api/loans");
      const data = await response.json();
      console.log(data);
      setLoans(data);
    };
    fetchLoans();
  }, []);

  const pipelineData = [
    {
      name: "Prospect",
      value: "PROSPECT",
      color: "rgb(124 58 237)",
    },
    {
      name: "Application",
      value: "APPLICATION",
      color: "rgb(37 99 235)",
    },
    {
      name: "Processing",
      value: "PROCESSING",
      color: "rgb(202 138 4)",
    },
    {
      name: "Underwriting",
      value: "UNDERWRITING",
      color: "rgb(234 88 12)",
    },
    {
      name: "Conditional",
      value: "CONDITIONAL",
      color: "rgb(219 39 119)",
    },
    {
      name: "Closed/Funded",
      value: "CLOSED",
      color: "rgb(22 163 74)",
    },
  ];

  return (
    <div>
      <Flex direction={"column"} gap={"5"}>
        <Card className="!bg-cactus">
          <Flex justify={"between"} align="center">
            <Heading size={"5"}>Welcome to your pipeline, $USER</Heading>
            <NextLink href="/loans/new">
              <Button className="hover:cursor-pointer">+ New Loan</Button>
            </NextLink>
          </Flex>
        </Card>
        <Card className="!bg-maroon">
          <Grid columns={{ initial: "1", md: "6" }} gap={"4"}>
            {pipelineData.map((data: PipelineData) => (
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
