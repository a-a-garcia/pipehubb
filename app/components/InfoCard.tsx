import {
  ActivityLog,
  DocumentChecklist,
  FileNotes,
  Loan,
  TaskList,
  TaskUpdates,
} from "@prisma/client";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  DropdownMenu,
  Flex,
  Inset,
  Strong,
  Text,
} from "@radix-ui/themes";
import React from "react";
import { formatDateDisplay } from "./formatDateDisplay";
import ImportantBadge from "./ImportantBadge";
import DeleteAndEditButtons from "./DeleteAndEditButtons";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const InfoCard = ({
  activity,
  checklistItem,
  taskUpdate,
  fileNote,
}: {
  checklistItem?: DocumentChecklist;
  activity?: ActivityLog;
  taskUpdate?: TaskUpdates;
  fileNote?: FileNotes;
}) => {
  const queryClient = useQueryClient();
  const loan: Loan | undefined = queryClient.getQueryData(["loan"]);
  if (!loan) {
    return null;
  }
  return (
    <Box
      key={
        (activity && activity.id) ||
        (taskUpdate && taskUpdate.id) ||
        (fileNote && fileNote.id)
      }
      className={`animate-dropInLite`}
    >
      <Card size="2" className={`!bg-neutral-100`}>
        <Inset clip="padding-box" side="top" pb="current">
          <Card className="!bg-darkGrey">
            <Flex justify={"between"}>
              <Flex gap="3" align="center">
                <Avatar
                  size="3"
                  src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                  fallback="A"
                  radius="full"
                />
                <Box>
                  <Text as="div" size="2" className="!text-white">
                    Anthony Garcia
                  </Text>
                  <Flex gap="2">
                    <Badge variant="solid">
                      {activity && formatDateDisplay(activity.createdAt)}
                      {fileNote && formatDateDisplay(fileNote.createdAt)}
                      {taskUpdate && formatDateDisplay(taskUpdate.createdAt)}
                    </Badge>
                  </Flex>
                </Box>
              </Flex>
              <Flex direction={"column"} gap="2">
                {fileNote && fileNote.important && <ImportantBadge />}
                {taskUpdate && taskUpdate.important && <ImportantBadge />}
                {!activity && (
                  <Flex justify={"end"}>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <Button variant="surface" size={"1"} className="hover:cursor-pointer">
                          <DropdownMenu.TriggerIcon />
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DeleteAndEditButtons
                          item={fileNote || taskUpdate || checklistItem}
                          isFileNotes={fileNote ? true : false}
                          isDocumentChecklist={checklistItem ? true : false}
                          isTaskUpdates={taskUpdate ? true : false}
                          loan={loan}
                        />
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </Flex>
                )}
              </Flex>
            </Flex>
          </Card>
        </Inset>
        <Box>
          <Text>{activity && activity.message}</Text>
          <Text>{fileNote && fileNote.note}</Text>
          <Text>{taskUpdate && taskUpdate.message}</Text>
        </Box>
      </Card>
    </Box>
  );
};

export default InfoCard;
