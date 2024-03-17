import React from "react";
import Skeleton from "@/app/components/Skeleton";
import { Box, Flex } from "@radix-ui/themes";
import Spinner from "@/app/components/Spinner";
import { Text } from "@radix-ui/themes";

const PipelineSkeleton = () => {
  return (
    <div>
      <Box>
        <Flex gap={"1"} align={"center"} justify={"center"}>
          <Text>Loading...</Text>
          <Spinner></Spinner>
        </Flex>
        <Skeleton height={"3rem"} className="mb-3"/>
        <Skeleton height={"40rem"} />
      </Box>
    </div>
  );
};

export default PipelineSkeleton;
