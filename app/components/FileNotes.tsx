import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Flex,
  Inset,
  Popover,
  Text,
  TextArea,
} from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { set } from "zod";
import Image from "next/image";
import logo from "@/public/images/pipeHubb_logo_transparent.png";
import { format } from "date-fns";
import { Loan } from "@prisma/client";
import { MdOutlineCreate } from "react-icons/md";
import NextLink from "next/link";
import DeleteAndEditButtons from "./DeleteAndEditButtons";
import { FileNotes } from "@prisma/client";
import { FaCircleExclamation } from "react-icons/fa6";

const formatDate = (date: Date) => {
  return format(new Date(date), "MM/dd/yyyy, HH:mm aa");
};

const FileNotesComponent = ({ loan }: { loan: Loan }) => {
  const [fetchedFileNotes, setFetchedFileNotes] = useState<FileNotes[]>([]);

  useEffect(() => {
    const fetchFileNotes = async () => {
      const response = await fetch(`/api/filenotes/${loan.id}`);
      const fileNotes = await response.json();
      console.log(fileNotes);
      setFetchedFileNotes(fileNotes);
    };
    fetchFileNotes();
  }, []);

  return (
    <Flex direction={"column"} gap={"4"}>
      <Flex className="mt-4" justify={"end"}>
        <Popover.Root>
          <Popover.Trigger>
            <Button className="myCustomButton hover:cursor-pointer">
              Create Note
              <MdOutlineCreate />
            </Button>
          </Popover.Trigger>
          <Popover.Content>
            <Flex gap="3">
              <Avatar
                size="2"
                src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                fallback="A"
                radius="full"
              />
              <Box>
                <TextArea placeholder="Write a note…" style={{ height: 120 }} />
                <Flex gap="3" mt="3" justify="between">
                  <Flex align="center" gap="2" asChild>
                    <Text as="label" size="2">
                      <Checkbox />
                      <Text>
                        Mark as{" "}
                        <Badge color="red">
                          <FaCircleExclamation color="red" size="10px" />
                          Important
                        </Badge>
                      </Text>
                    </Text>
                  </Flex>

                  <Popover.Close>
                    <Button
                      className="myCustomButton hover:cursor-pointer"
                      size="1"
                    >
                      Create
                    </Button>
                  </Popover.Close>
                </Flex>
              </Box>
            </Flex>
          </Popover.Content>
        </Popover.Root>
      </Flex>
      {fetchedFileNotes &&
        fetchedFileNotes.map((note) => {
          return (
            <Flex key={note.id} direction={"column"} gap="5">
              <Card>
                <Inset
                  clip="border-box"
                  side="top"
                  p="current"
                  className="!bg-darkGrey"
                >
                  <Flex gap="2" justify={"between"}>
                    <Flex gap={"1"} align={"center"}>
                      <Avatar
                        size="1"
                        src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                        fallback="A"
                        className="mr-2"
                        radius="full"
                      ></Avatar>
                      <Badge color="ruby" variant="solid">
                        {formatDate(note.createdAt)}
                      </Badge>
                    </Flex>
                    <DeleteAndEditButtons item={note} type="note" />
                  </Flex>
                </Inset>
                <Text>
                  <Flex align={"center"} className="mt-2" gap="2">
                    <Text>{note.note}</Text>
                  </Flex>
                </Text>
              </Card>
            </Flex>
          );
        })}
    </Flex>
  );
};

export default FileNotesComponent;
