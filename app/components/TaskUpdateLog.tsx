import { Flex, Badge, Strong, Separator, Button } from "@radix-ui/themes";
import React from "react";
import { MdOutlineCreate } from "react-icons/md";
import InfoCard from "./InfoCard";
import { TaskUpdates } from "@prisma/client";
import NoteForm from "./NoteForm";
import NoItemsFound from "./NoItemsFound";

const TaskUpdateLog = ({
  taskUpdates,
  taskId,
}: {
  taskUpdates: TaskUpdates[];
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
      <Flex justify={"end"} className="mb-2">
        <NoteForm isTaskUpdates={true} taskId={taskId} isEditMode={false} />
      </Flex>
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
