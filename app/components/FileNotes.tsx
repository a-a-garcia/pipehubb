import { Avatar, Badge, Card, Flex, Inset, Text } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Loan } from "@prisma/client";
import DeleteAndEditButtons from "./DeleteAndEditButtons";
import { FileNotes } from "@prisma/client";
import CreateNoteForm from "./NoteForm";
import ImportantBadge from "./ImportantBadge";
import TabHeader from "./TabHeader";
import { GrDocumentMissing } from "react-icons/gr";
import InfoCard from "./InfoCard";
import NoItemsFound from "./NoItemsFound";

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
      <TabHeader loan={loan} isFileNotes={true} />
      {fetchedFileNotes.length === 0 && (
        <NoItemsFound />
      )}
      {fetchedFileNotes &&
        fetchedFileNotes.map((note) => {
          return (
            <InfoCard fileNote={note} />
          );
        })}
    </Flex>
  );
};

export default FileNotesComponent;
