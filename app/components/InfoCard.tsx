import {
  ActivityLog,
  DocumentChecklist,
  FileNotes,
  Loan,
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
  Text,
} from "@radix-ui/themes";
import React from "react";
import { formatDateDisplay } from "./formatDateDisplay";
import ImportantBadge from "./ImportantBadge";
import DeleteAndEditButtons from "./DeleteAndEditButtons";
import { useQueryClient } from "@tanstack/react-query";
import { FaUserTie } from "react-icons/fa6";

interface activityLogWithUser extends ActivityLog {
  user: { name: string; image: string };
}

interface taskUpdatesWithUser extends TaskUpdates {
  user: { name: string; image: string };
}

interface fileNotesWithUser extends FileNotes {
  user: { name: string; image: string };
}

const InfoCard = ({
  activity,
  checklistItem,
  taskUpdate,
  fileNote,
}: {
  checklistItem?: DocumentChecklist;
  activity?: activityLogWithUser;
  taskUpdate?: taskUpdatesWithUser;
  fileNote?: fileNotesWithUser;
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
                  src={activity ? activity!.user!.image! : taskUpdate ? taskUpdate!.user!.image! : fileNote ? fileNote!.user!.image! : ""}
                  fallback={<FaUserTie />}
                  radius="full"
                />
                <Box>
                  <Text as="div" size="2" className="!text-white">
                    {activity ? activity.user.name : taskUpdate ? taskUpdate.user.name : fileNote ? fileNote.user.name : "*Name not found*"}
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
