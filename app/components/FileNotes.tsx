import { Avatar, Badge, Card, Flex, Inset, Text } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Loan } from "@prisma/client";
import DeleteAndEditButtons from "./DeleteAndEditButtons";
import { FileNotes } from "@prisma/client";
import CreateNoteForm from "./CreateNoteForm";
import ImportantBadge from "./ImportantBadge";
import NotesAndChecklistHeader from "./NotesAndChecklistHeader";

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
      <NotesAndChecklistHeader loan={loan} isFileNotes={true} />
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
                      <Badge color="gray" variant="solid">
                        {formatDate(note.createdAt)}
                      </Badge>
                      {note.important && <ImportantBadge />}
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
