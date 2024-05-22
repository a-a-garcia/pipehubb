import {
  Card,
  Flex,
  Button,
  Text,
  AlertDialog,
} from "@radix-ui/themes";
import React from "react";
import { AiOutlineClear } from "react-icons/ai";
import { FaCircleExclamation } from "react-icons/fa6";
import { Loan } from "@prisma/client";
import NoteForm from "./NoteForm";
import ChecklistForm from "./ChecklistForm";
import TasksForm from "./TasksForm";

const TabHeader = ({
  isTasks = false,
  isDocumentChecklist = false,
  isFileNotes = false,
  isTaskUpdates = false,
  taskId,
  loan,
}: {
  isTasks?: Boolean;
  isDocumentChecklist?: Boolean;
  isFileNotes?: Boolean;
  isTaskUpdates?: Boolean;
  loan?: Loan;
  taskId?: number;
}) => {
  // Deleting all items for file notes, document checklist, task list, and task updates
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
    } else if (isTasks){
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
    } else if (isTaskUpdates){
      await fetch(`/api/taskupdates`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskListId: taskId,
          deleteAll: true,
        }),
      });
    }
    window.location.reload();
  };

  return (
    <Card className="!bg-darkGrey mt-4">
      <Flex justify={"between"} align={"center"}>
        {isTaskUpdates && <NoteForm isTaskUpdates={true} taskId={taskId} isEditMode={false} />}
        {isTasks && <TasksForm loan={loan!} isEditMode={false} />}
        {isDocumentChecklist && (
          <ChecklistForm loan={loan!} isEditMode={false} />
        )}
        {isFileNotes && (
          <NoteForm loan={loan!} isEditMode={false} isFileNotes={true} />
        )}
        <AlertDialog.Root>
          <AlertDialog.Trigger>
            <Button color="red" size="1" className="hover:cursor-pointer">
              <AiOutlineClear />
            </Button>
          </AlertDialog.Trigger>
          <AlertDialog.Content maxWidth="450px">
            <AlertDialog.Title>
              <Flex gap="2" align="center">
                <FaCircleExclamation color="red" size="20px" />{" "}
                <Text color="red">
                  WARNING! Continuing will delete
                  {isDocumentChecklist && " your entire checklist."}
                  {isFileNotes && " all File Notes."}
                  {isTasks && " all Tasks."}
                  {isTaskUpdates && " all Task Updates."}
                </Text>
              </Flex>
            </AlertDialog.Title>
            <AlertDialog.Description size="2">
              This button is to clear all items. This action is{" "}
              <strong>permanent</strong>, so make sure this is what you want
              before continuing.
            </AlertDialog.Description>
            <Flex gap="3" mt="4" justify="end">
              <AlertDialog.Cancel>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action>
                <Button variant="solid" color="red" onClick={() => deleteAll()}>
                  Delete all
                </Button>
              </AlertDialog.Action>
            </Flex>
          </AlertDialog.Content>
        </AlertDialog.Root>
      </Flex>
    </Card>
  );
};

export default TabHeader;
