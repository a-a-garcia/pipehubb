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
import TaskUpdateCard from "./TaskUpdateCard";
import { AiOutlineClear } from "react-icons/ai";
import InfoCard from "./InfoCard";
import TaskUpdateLog from "./TaskUpdateLog";
import { formatDateDisplay } from "./formatDateDisplay";
import { TaskList } from "@prisma/client";

const TaskUpdatesPage = ({
  params,
}: {
  params: { id: string; taskid: string };
}) => {
  const {
    data: task,
    error,
    isPending,
  } = useQuery<TaskList>({
    queryKey: ["task", params.taskid],
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

  if (isPending) {
    return (
      <div className="mt-4">
        <LoadingBadge />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage>{error.message}</ErrorMessage>;
  }
  return (
    <Box className="mt-4">
      <Separator my="3" size="4" />
      <Card className="!bg-neutral-200">
        <Inset clip="padding-box" side="top" pb="current">
          <Card className="!bg-neutral-100">
            <Flex gap="3" align="center">
              <Avatar
                size="3"
                src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                radius="full"
                fallback="T"
              />
              <DataList.Root>
                <DataList.Item>
                  <DataList.Label minWidth="88px">Task Title</DataList.Label>
                  <DataList.Value>{task.title}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label minWidth="88px">Task Details</DataList.Label>
                  <DataList.Value>{task.description}</DataList.Value>
                </DataList.Item>
                <DataList.Item align="center">
                  <DataList.Label minWidth="88px">Status</DataList.Label>
                  <DataList.Value>
                    <Badge
                      color={determineStatusColor(task.status)}
                      variant="soft"
                      radius="full"
                    >
                      {task.status}
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
                          {task.important ? (
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
                    {task.dueDate ? (
                      formatDateDisplay(task.dueDate, true)
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
                  <DataList.Value>{formatDateDisplay(task.createdAt)}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label minWidth="88px">
                    Last Updated Date
                  </DataList.Label>
                  <DataList.Value>{formatDateDisplay(task.updatedAt)}</DataList.Value>
                </DataList.Item>
              </DataList.Root>
            </Flex>
          </Card>
        </Inset>
        <TaskUpdateLog />
      </Card>
    </Box>
  );
};

export default TaskUpdatesPage;
