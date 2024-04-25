import {
  DocumentChecklist,
  FileNotes,
  Loan,
  TaskList,
  TaskUpdates,
} from "@prisma/client";
import {
  Flex,
  HoverCard,
  Button,
  Avatar,
  Box,
  Heading,
  Text,
  Spinner,
} from "@radix-ui/themes";
import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FaTrashCan, FaCircleExclamation } from "react-icons/fa6";
import NoteForm from "./NoteForm";
import ChecklistForm from "./ChecklistForm";
import { BsFillChatTextFill } from "react-icons/bs";
import NextLink from "next/link";
import TasksForm from "./TasksForm";

//making props more distinct because TypeScript is incorrectly inferring the type of the props
// two different interfaces NoteProps and ChecklistItemProps that are being used in a union type Props

type Props = {
  item: DocumentChecklist | TaskUpdates | TaskList | FileNotes | undefined;
  loan: Loan;
  isDocumentChecklist?: boolean;
  isTaskUpdates?: boolean;
  isTaskList?: boolean;
  isFileNotes?: boolean;
};

const DeleteAndEditButtons = ({
  item,
  loan,
  isFileNotes,
  isTaskUpdates,
  isTaskList,
  isDocumentChecklist,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!item) {
      console.log("No item to delete");
      return;
    }
    if (isFileNotes) {
      const response = await fetch(`/api/filenotes/${loan.id}`, {
        body: JSON.stringify({
          noteId: item.id,
        }),
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
    } else if (isDocumentChecklist) {
      const response = await fetch(`/api/documentchecklist/${loan.id}`, {
        body: JSON.stringify({
          checklistId: item.id,
        }),
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
    } else if (isTaskList) {
      const response = await fetch(`/api/tasklist/${loan.id}`, {
        body: JSON.stringify({
          taskId: item.id,
        }),
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
    } else if (isTaskUpdates) {
      const response = await fetch(`/api/taskupdates/`, {
        body: JSON.stringify({
          taskUpdateId: item.id,
        }),
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
    }
    window.location.reload();
  };
  console.log("fileNotes: " + isFileNotes, "taskUpdates: " + isTaskUpdates, "taskList: " + isTaskList, "documentChecklist: " + isDocumentChecklist)

  return (
    <Flex gap="2" direction={"column"}>
      {isFileNotes && (
        <NoteForm loan={loan} isEditMode={true} item={item as FileNotes} isFileNotes={true}/>
      )}
      {isDocumentChecklist && (
        <ChecklistForm
          isEditMode={true}
          loan={loan}
          item={item as DocumentChecklist}
        />
      )}
      {isTaskList && (
        <TasksForm isEditMode={true} loan={loan} item={item as TaskList} />
      )}
      {isTaskUpdates && (
        <NoteForm isEditMode={true} loan={loan} item={item as TaskUpdates} isTaskUpdates={true}/>
      )}
      <HoverCard.Root>
        <HoverCard.Trigger>
          <Button
            color="ruby"
            className="hover:cursor-pointer"
            size={"1"}
            disabled={!item}
            onClick={() => handleDelete()}
          >
            Delete <FaTrashCan />
          </Button>
        </HoverCard.Trigger>
        <HoverCard.Content className=" max-w-64" size={"1"}>
          <Flex gap="4">
            <Avatar
              size="1"
              fallback="R"
              radius="full"
              src="/images/pipeHubb_logo_transparent.png"
            />
            <Box>
              {isDocumentChecklist && (
                <Box>
                  <Heading size={"2"}>Delete Checklist Item</Heading>
                  <Text size="1">
                    Click this button to delete this checklist item.
                  </Text>
                </Box>
              )}
              {isFileNotes && (
                <Box>
                  <Heading size={"2"}>Delete Note</Heading>
                  <Text size="1">
                    Click this button to delete this file note.
                  </Text>
                </Box>
              )}
              {isTaskList && (
                <Box>
                  <Heading size={"2"}>Delete Task</Heading>
                  <Text size="1">Click this button to delete this task.</Text>
                </Box>
              )}
              {isTaskUpdates && (
                <Box>
                  <Heading size={"2"}>Delete Task Update</Heading>
                  <Text size="1">Click this button to delete this task update.</Text>
                </Box>
              )}
              <Flex gap="2" className="mt-2" align={"center"}>
                <FaCircleExclamation color="red" size="15px" />
                <Text size="1" color="red">
                  {" "}
                  This is a permanent action.
                </Text>
              </Flex>
            </Box>
          </Flex>
        </HoverCard.Content>
      </HoverCard.Root>
      {isTaskList && (
        <HoverCard.Root>
          <HoverCard.Trigger className="mt-2">
            <NextLink
              href={`/loans/${loan.id}/tasks/${item?.id}/task-updates`}
              onClick={() => setIsLoading(true)}
            >
              <Flex direction={"column"}>
                <Button
                  size={"1"}
                  color="purple"
                  className="hover:cursor-pointer"
                >
                  Log <BsFillChatTextFill />
                </Button>
              </Flex>
            </NextLink>
          </HoverCard.Trigger>
          <HoverCard.Content>
            <Flex gap="4">
              <Avatar
                size="1"
                fallback="R"
                radius="full"
                src="/images/pipeHubb_logo_transparent.png"
              />
              <Box>
                <Flex align={"center"} gap="2">
                  <Heading size={"2"}>Task Updates</Heading>
                  {isLoading && <Spinner />}
                </Flex>
                <Text size="1">
                  Click this button to view the task update log for this task.
                </Text>
              </Box>
            </Flex>
          </HoverCard.Content>
        </HoverCard.Root>
      )}
    </Flex>
  );
};

export default DeleteAndEditButtons;
