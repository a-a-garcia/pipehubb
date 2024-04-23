import { ActivityLog, FileNotes, TaskUpdates } from "@prisma/client";
import {
  Avatar,
  Badge,
  Box,
  Card,
  Flex,
  Inset,
  Strong,
  Text,
} from "@radix-ui/themes";
import React from "react";
import { formatDateDisplay } from "./formatDateDisplay";
import ImportantBadge from "./ImportantBadge";

const InfoCard = ({
  activity,
  taskUpdate,
  fileNote,
}: {
  activity?: ActivityLog;
  taskUpdate?: TaskUpdates;
  fileNote?: FileNotes;
}) => {
  return (
    <Box
      key={
        (activity && activity.id) ||
        (taskUpdate && taskUpdate.id) ||
        (fileNote && fileNote.id)
      }
    >
      <Card size="2" className="!bg-neutral-100">
        <Inset clip="padding-box" side="top" pb="current">
          <Card className="!bg-darkGrey">
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
                  {fileNote && fileNote.important && <ImportantBadge />}
                  {taskUpdate && taskUpdate.important && <ImportantBadge />}
                </Flex>
              </Box>
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
