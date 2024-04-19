import {
  Card,
  Flex,
  Button,
  HoverCard,
  Avatar,
  Box,
  Heading,
  Text,
  AlertDialog,
} from "@radix-ui/themes";
import React from "react";
import { AiOutlineClear } from "react-icons/ai";
import { FaCircleExclamation } from "react-icons/fa6";
import { MdOutlineCreate } from "react-icons/md";
import { DocumentChecklist, Loan } from "@prisma/client";
import NextLink from "next/link";
import NoteForm from "./NoteForm";
import ChecklistForm from "./ChecklistForm";
import TasksForm from "./TasksForm";
import CustomAlertDialog from "./CustomAlertDialog";

const TabHeader = ({
  isTasks = false,
  isDocumentChecklist = false,
  isFileNotes = false,
  loan,
}: {
  isTasks?: Boolean;
  isDocumentChecklist?: Boolean;
  isFileNotes?: Boolean;
  loan?: Loan;
}) => {
  const deleteAll = async () => {
    if (isDocumentChecklist) {
      await fetch(`/api/documentchecklist/${loan!.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loanId: loan!.id,
          deleteAll: true,
        }),
      });
    } else if (isFileNotes) {
      await fetch(`/api/filenotes/${loan!.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loanId: loan!.id,
          deleteAll: true,
        }),
      });
    } else {
      await fetch(`/api/tasklist/${loan!.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loanId: loan!.id,
          deleteAll: true,
        }),
      });
    }
    window.location.reload();
  };

  return (
    <Card className="!bg-darkGrey mt-4">
      <Flex justify={"between"} align={"center"}>
        {isTasks && <TasksForm isEditMode={false} />}
        {isDocumentChecklist && (
          <ChecklistForm loan={loan!} isEditMode={false} />
        )}
        {isFileNotes && <NoteForm loan={loan!} isEditMode={false} />}
        <AlertDialog.Root>
          <AlertDialog.Trigger>
            <Button color="red" size="1" className="hover:cursor-pointer">
              <AiOutlineClear />
            </Button>
          </AlertDialog.Trigger>
          <AlertDialog.Content maxWidth="450px">
            <AlertDialog.Title>
              Clear
              {isDocumentChecklist && " Checklist"}
              {isFileNotes && " All File Notes"}
              {isTasks && " All Tasks"}
            </AlertDialog.Title>
            <AlertDialog.Description size="2">
              <FaCircleExclamation color="red" size="20px" />
            </AlertDialog.Description>

            <Flex gap="3" mt="4" justify="end">
              <AlertDialog.Cancel>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action>
                <Button variant="solid" color="red">
                  Revoke access
                </Button>
              </AlertDialog.Action>
            </Flex>
          </AlertDialog.Content>
        </AlertDialog.Root>

        <HoverCard.Root>
          <HoverCard.Trigger>
            <Button
              color="red"
              size="1"
              className="hover:cursor-pointer"
              onClick={() => deleteAll()}
            >
              <AiOutlineClear />
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
                <Heading size={"2"}>
                  Clear
                  {isDocumentChecklist && " Checklist"}
                  {isFileNotes && " All File Notes"}
                  {isTasks && " All Tasks"}
                </Heading>
                <Text size="1">
                  Click this button to delete
                  {isDocumentChecklist && " the entire checklist"}
                  {isFileNotes && " all file notes."}
                  {isTasks && " all tasks."}
                </Text>
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
      </Flex>
    </Card>
  );
};

export default TabHeader;
