import { DocumentChecklist, FileNotes, Loan, TaskList } from "@prisma/client";
import {
  Flex,
  HoverCard,
  Button,
  Avatar,
  Box,
  Heading,
  Text,
} from "@radix-ui/themes";
import React from "react";
import { FaEdit } from "react-icons/fa";
import { FaTrashCan, FaCircleExclamation } from "react-icons/fa6";
import NoteForm from "./NoteForm";
import ChecklistForm from "./ChecklistForm";
import { BsFillChatTextFill } from "react-icons/bs";
import NextLink from "next/link";
import TasksForm from "./TasksForm";

//making props more distinct because TypeScript is incorrectly inferring the type of the props
// two different interfaces NoteProps and ChecklistItemProps that are being used in a union type Props

interface NoteProps {
  item: FileNotes;
  type: "note";
  loan: Loan;
}

interface ChecklistItemProps {
  item: DocumentChecklist;
  type: "checklistItem";
  loan: Loan;
}

interface TaskListProps {
  item: TaskList;
  type: "taskList";
  loan: Loan;
}

type Props = NoteProps | ChecklistItemProps | TaskListProps;

const DeleteAndEditButtons = ({ item, type, loan }: Props) => {
  const handleDelete = async () => {
    if (type === "note") {
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
    } else if (type === "checklistItem") {
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
    }
    window.location.reload();
  };

  return (
    <Flex gap={"2"}>
      {type === "note" && (
        <NoteForm loan={loan} isEditMode={true} item={item} />
      )}
      {type === "checklistItem" && (
        <ChecklistForm isEditMode={true} loan={loan} item={item} />
      )}
      {type === "taskList" && (
        <TasksForm isEditMode={true} loan={loan} item={item} />
      )}
      <HoverCard.Root>
        <HoverCard.Trigger>
          <Button
            color="ruby"
            className="hover:cursor-pointer"
            size={"1"}
            onClick={() => handleDelete()}
          >
            <FaTrashCan />
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
              {type === "checklistItem" && (
                <Box>
                  <Heading size={"2"}>Delete Checklist Item</Heading>
                  <Text size="1">
                    Click this button to delete this checklist item.
                  </Text>
                </Box>
              )}
              {type === "note" && (
                <Box>
                  <Heading size={"2"}>Delete Note</Heading>
                  <Text size="1">
                    Click this button to delete this file note.
                  </Text>
                </Box>
              )}
              {type === "taskList" && (
                <Box>
                  <Heading size={"2"}>Delete Task</Heading>
                  <Text size="1">Click this button to delete this task.</Text>
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
      {type === "taskList" && (
        <HoverCard.Root>
          <HoverCard.Trigger>
            <NextLink href={`/loans/${loan.id}/tasks/${item.id}/task-updates`}>
              <Button
                size={"1"}
                color="purple"
                className="hover:cursor-pointer"
              >
                <BsFillChatTextFill />
              </Button>
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
                <Heading size={"2"}>Task Updates</Heading>
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
