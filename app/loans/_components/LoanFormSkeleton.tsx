import React from "react";
import Skeleton from "@/app/components/Skeleton";
import { Box, Flex } from "@radix-ui/themes";
import Spinner from "@/app/components/Spinner";
import { Text } from "@radix-ui/themes";

const LoanFormSkeleton = () => {
  return (
    <div>
      <Box>
        <Flex gap={"1"} align={"center"} justify={"center"}>
          <Text>Loading...</Text>
          <Spinner></Spinner>
        </Flex>
        <Skeleton height={"4rem"} />
        <Skeleton height={"30rem"} />
      </Box>
    </div>
  );
};

export default LoanFormSkeleton;
