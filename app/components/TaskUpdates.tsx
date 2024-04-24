import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Code,
  DataList,
  Flex,
  IconButton,
  Inset,
  Link,
  Separator,
  Spinner,
  Strong,
  Text,
} from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import ErrorMessage from "./ErrorMessage";
import { MdCancel, MdOutlineCreate } from "react-icons/md";
import ImportantBadge from "./ImportantBadge";
import { format } from "date-fns";
import { GrDocumentMissing } from "react-icons/gr";
import LoadingBadge from "./LoadingBadge";
import { AiOutlineClear } from "react-icons/ai";
import InfoCard from "./InfoCard";
import TaskUpdateLog from "./TaskUpdateLog";
import { formatDateDisplay } from "./formatDateDisplay";
import { Loan, TaskList, TaskUpdates } from "@prisma/client";

// defining a new type that is for the object returned from the API call, an object with a taskList item and an array of taskUpdates. something like `useQuery<TaskList | TaskUpdates[]>` will not work because it's a union, meaning it would expect data to be either a TaskList or an array of TaskUpdates, not an object that contains both.
type TaskData = {
  taskItem: TaskList;
  taskUpdates: TaskUpdates[];
};

const TaskUpdatesPage = ({
  params,
}: {
  params: { id: string; taskid: string };
}) => {
  const {
    data: task,
    error: taskError,
    isPending: taskIsPending,
  } = useQuery<TaskData>({
    queryKey: ["task", params.taskid],
    queryFn: () =>
      fetch(`/api/task/${params.taskid}`).then((res) => res.json()),
  });

  const {
    data: loan,
    error: loanError,
    isPending: loanIsPending,
  } = useQuery<Loan>({
    queryKey: ["task", params.id],
    queryFn: () =>
      fetch(`/api/task/${params.taskid}`).then((res) => res.json()),
  });

  const determineStatusColor = (
    status: "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED" | "PENDING"
  ) => {
    switch (status) {
      case "COMPLETED":
        return "green";
      case "IN_PROGRESS":
        return "orange";
      case "NOT_STARTED":
        return "purple";
      case "PENDING":
        return "red";
    }
  };

  if (taskIsPending) {
    return (
      <div className="mt-4">
        <LoadingBadge />
      </div>
    );
  }

  if (taskError) {
    return <ErrorMessage>{taskError.message}</ErrorMessage>;
  }

  console.log(task);
  return (
    <Box className="mt-4">
      <Separator my="3" size="4" />
      <Card className="!bg-neutral-200">
        <Inset clip="padding-box" side="top" pb="current">
          <Card
            className="!bg-neutral-100"
            style={
              task.taskItem.status === "COMPLETED"
                ? {
                    textDecorationLine: "line-through",
                    opacity: "0.5",
                  }
                : {}
            }
          >
            <Flex gap="3" align="center" className="animate-dropInLite">
              <Avatar
                size="3"
                src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                radius="full"
                fallback="T"
              />
              <DataList.Root>
                <DataList.Item>
                  <DataList.Label minWidth="88px">Task Title</DataList.Label>
                  <DataList.Value>{task.taskItem.title}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label minWidth="88px">Task Details</DataList.Label>
                  <DataList.Value>{task.taskItem.description}</DataList.Value>
                </DataList.Item>
                <DataList.Item align="center">
                  <DataList.Label minWidth="88px">Status</DataList.Label>
                  <DataList.Value>
                    <Badge
                      color={determineStatusColor(task.taskItem.status)}
                      variant="soft"
                      radius="full"
                    >
                      {/* Remember that you cannot use `if` statements in JSX. Only ternary operators or functions. */}
                      {task.taskItem.status === "IN_PROGRESS"
                        ? "IN PROGRESS"
                        : task.taskItem.status === "NOT_STARTED"
                        ? "NOT STARTED"
                        : task.taskItem.status}
                    </Badge>
                  </DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Item>
                    <DataList.Label minWidth="88px">Important?</DataList.Label>
                    <DataList.Value>
                      <Flex align="center" gap="2">
                        <Code variant="ghost">
                          {" "}
                          {task.taskItem.important ? (
                            <ImportantBadge />
                          ) : (
                            <Badge variant="surface">
                              <MdCancel />
                              N/A
                            </Badge>
                          )}
                        </Code>
                        <IconButton
                          size="1"
                          aria-label="Copy value"
                          color="gray"
                          variant="ghost"
                        ></IconButton>
                      </Flex>
                    </DataList.Value>
                  </DataList.Item>
                  <DataList.Label minWidth="88px">Due Date</DataList.Label>
                  <DataList.Value>
                    {task.taskItem.dueDate ? (
                      formatDateDisplay(task.taskItem.dueDate, true)
                    ) : (
                      <Badge>
                        <GrDocumentMissing />
                        <Text>None</Text>
                      </Badge>
                    )}
                  </DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label minWidth="88px">Creation Date</DataList.Label>
                  <DataList.Value>
                    {formatDateDisplay(task.taskItem.createdAt)}
                  </DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label minWidth="88px">
                    Last Updated Date
                  </DataList.Label>
                  <DataList.Value>
                    {formatDateDisplay(task.taskItem.updatedAt)}
                  </DataList.Value>
                </DataList.Item>
              </DataList.Root>
            </Flex>
          </Card>
        </Inset>
        <TaskUpdateLog
          taskUpdates={task.taskUpdates}
          taskId={task.taskItem.id}
        />
      </Card>
    </Box>
  );
};

export default TaskUpdatesPage;
