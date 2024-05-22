import { Flex, Badge, Strong, Separator, Box } from "@radix-ui/themes";
import React from "react";
import InfoCard from "./InfoCard";
import { TaskUpdates } from "@prisma/client";
import NoItemsFound from "./NoItemsFound";
import TabHeader from "./TabHeader";

interface TaskUpdatesWithUser extends TaskUpdates {
  user: { name: string; image: string };
}

const TaskUpdateLog = ({
  taskUpdates,
  taskId,
}: {
  taskUpdates: TaskUpdatesWithUser[];
  taskId: number;
}) => {
  return (
    <div>
      <Flex justify={"center"} align={"center"}>
        <Badge color="purple" size="2" className="m-2">
          <Strong>Task Update Log</Strong>
        </Badge>
        <Separator my="4" size="4" />
      </Flex>
      <Box className="my-5">
        <TabHeader taskId={taskId} isTaskUpdates={true} />
      </Box>
      <Flex direction={"column"} gap="4">
        {taskUpdates.length === 0 && <NoItemsFound />}
        {taskUpdates.map((taskUpdate) => {
          return <InfoCard key={taskUpdate.id} taskUpdate={taskUpdate} />;
        })}
      </Flex>
    </div>
  );
};

export default TaskUpdateLog;
