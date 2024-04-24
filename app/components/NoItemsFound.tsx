import { Badge, Flex } from "@radix-ui/themes";
import React from "react";
import { GrDocumentMissing } from "react-icons/gr";

const NoItemsFound = () => {
  return (
    <Flex justify={"center"}>
      <Badge color="gray">
        <GrDocumentMissing />
        No Items Found
      </Badge>
    </Flex>
  );
};

export default NoItemsFound;
