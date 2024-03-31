import { DocumentChecklist, FileNotes } from "@prisma/client";
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

//making props more distinct because TypeScript is incorrectly inferring the type of the props

interface NoteProps {
  item: FileNotes;
  type: "note";
}

interface ChecklistItemProps {
  item: DocumentChecklist;
  type: "checklistItem";
}

type Props = NoteProps | ChecklistItemProps;

const DeleteAndEditButtons = ({ item, type }: Props) => {
  return (
    <Flex gap={"2"}>
      <HoverCard.Root>
        <HoverCard.Trigger>
          <Button color="indigo" className="hover:cursor-pointer" size={"1"}>
            <FaEdit />
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
            {type === "checklistItem" && (
              <Box>
                <Heading size={"2"}>Edit Checklist Item</Heading>
                <Text size="1">
                  Click this button to edit the content of this checklist item.
                </Text>
              </Box>
            )}
            {type === "note" && (
              <Box>
                <Heading size={"2"}>Edit Note</Heading>
                <Text size="1">
                  Click this button to edit the content of this file note.
                </Text>
              </Box>
            )}
          </Flex>
        </HoverCard.Content>
      </HoverCard.Root>
      <HoverCard.Root>
        <HoverCard.Trigger>
          <Button color="red" className="hover:cursor-pointer" size={"1"}>
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
              {type === 'checklistItem' && (
                <Box>
                  <Heading size={"2"}>Delete Checklist Item</Heading>
                  <Text size="1">
                    Click this button to delete this checklist item.
                  </Text>
                </Box>
              )}
              {type === 'note' && (
                <Box>
                  <Heading size={"2"}>Delete Note</Heading>
                  <Text size="1">
                    Click this button to delete this file note.
                  </Text>
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
    </Flex>
  );
};

export default DeleteAndEditButtons;
