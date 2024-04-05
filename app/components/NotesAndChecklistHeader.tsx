import {
  Card,
  Flex,
  Button,
  HoverCard,
  Avatar,
  Box,
  Heading,
  Text,
} from "@radix-ui/themes";
import React from "react";
import { AiOutlineClear } from "react-icons/ai";
import { FaCircleExclamation } from "react-icons/fa6";
import { MdOutlineCreate } from "react-icons/md";
import { Loan } from "@prisma/client";
import NextLink from "next/link";
import NoteForm from "./NoteForm";
import ChecklistForm from "./ChecklistForm";

const NotesAndChecklistHeader = ({
  isDocumentChecklist = false,
  isFileNotes = false,
  loan,
}: {
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
    } else {
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
    }
    window.location.reload();
  };

  return (
    <Card className="!bg-darkGrey mt-4">
      <Flex justify={"between"} align={"center"}>
        {isDocumentChecklist && <ChecklistForm loan={loan!} isEditMode={false}/>}
        {isFileNotes && <NoteForm loan={loan!} isEditMode={false} />}
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
                  Clear {isDocumentChecklist ? "Checklist" : "All File Notes"}
                </Heading>
                <Text size="1">
                  Click this button to delete
                  {isDocumentChecklist
                    ? " the entire checklist."
                    : " all file notes."}
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

export default NotesAndChecklistHeader;
