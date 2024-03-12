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
import React from "react";
import NextLink from "next/link";

const PipelinePage = () => {
  const pipelineStages = [
    {
      name: "Prospect",
      color: "rgb(124 58 237)",
    },
    {
      name: "Application",
      color: "rgb(37 99 235)",
    },
    {
      name: "Processing",
      color: "rgb(202 138 4)",
    },
    {
      name: "Underwriting",
      color: "rgb(234 88 12)",
    },
    {
      name: "Conditional",
      color: "rgb(219 39 119)",
    },
    {
      name: "Closed/Funded",
      color: "rgb(22 163 74)",
    },
  ];

  const sampleLoans = [
    {
      borrowerName: "Anthony Garcia",
      loanAmount: 500000,
    },
    {
      borrowerName: "Coco Garcia-Solis",
      loanAmount: 600000,
    },
    {
      borrowerName: "Coco Garcia-Solis",
      loanAmount: 600000,
    },
  ];

  return (
    <div>
      <Flex direction={"column"} gap={"5"}>
        <Card className="!bg-cactus">
          <Flex justify={"between"} align="center">
            <Heading size={"5"}>Welcome to your pipeline, $USER</Heading>
            <NextLink href="/loans/new">
              <Button>+ New Loan</Button>
            </NextLink>
          </Flex>
        </Card>
        <Card className="!bg-maroon">
          <Grid columns={{ initial: "1", md: "6" }} gap={"4"}>
            {pipelineStages.map((stage) => (
              <div key={stage.name}>
                <Heading
                  style={{ backgroundColor: stage.color }}
                  className="text-white p-4 text-nowrap rounded-md"
                  size={"4"}
                >
                  {stage.name}
                </Heading>
                <Card>
                  <Flex direction={"column"} gap="5">
                    {sampleLoans.map((loan) => (
                      <div key={loan.borrowerName}>
                        <Box className="text-white p- text-nowrap rounded-md text-center p-1">
                          <Text>{loan.borrowerName}</Text>
                        </Box>
                        <Card size="2">
                          <Flex
                            justify={"center"}
                            align={"center"}
                            direction={"column"}
                          >
                            <Box>
                              <Text>Loan Amount: ${loan.loanAmount}</Text>
                            </Box>
                          </Flex>
                        </Card>
                      </div>
                    ))}
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
