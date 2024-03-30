import {
  Avatar,
  Badge,
  Button,
  Card,
  Flex,
  Inset,
  Text,
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

interface FileNotes {
  id: number;
  loanId: number;
  note: string;
  createdAt: Date;
}

const formatDate = (date: Date) => {
  return format(new Date(date), "MM/dd/yyyy, HH:mm aa");
};

const FileNotes = ({ loan }: { loan: Loan }) => {
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
        <NextLink href={`/loans/create-note/${loan.id}`}>
          <Button className="myCustomButton">
            Create Note
            <MdOutlineCreate />
          </Button>
        </NextLink>
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
                  <Flex justify={"between"} align={"center"}>
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

export default FileNotes;
