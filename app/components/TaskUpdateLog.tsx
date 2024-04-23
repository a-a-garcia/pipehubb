import { Flex, Badge, Strong, Separator, Button } from "@radix-ui/themes";
import React from "react";
import { MdOutlineCreate } from "react-icons/md";
import InfoCard from "./InfoCard";

const TaskUpdateLog = () => {
  return (
    <div>
      <Flex justify={"center"} align={"center"}>
        <Badge color="purple" size="2" className="m-2">
          <Strong>Task Update Log</Strong>
        </Badge>
        <Separator my="4" size="4" />
      </Flex>
      <Flex justify={"end"} className="mb-2">
        <Button size="1" className="myCustomButton hover:cursor-pointer">
          Create Update <MdOutlineCreate />
        </Button>
      </Flex>
      <InfoCard />
    </div>
  );
};

export default TaskUpdateLog;
