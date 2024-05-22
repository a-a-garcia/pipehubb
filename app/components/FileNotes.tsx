import { Flex } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { Loan } from "@prisma/client";
import { FileNotes } from "@prisma/client";
import TabHeader from "./TabHeader";
import InfoCard from "./InfoCard";
import NoItemsFound from "./NoItemsFound";

interface FileNotesWithUser extends FileNotes {
  user: { name: string; image: string };
}

const FileNotesComponent = ({ loan }: { loan: Loan }) => {
  const [fetchedFileNotes, setFetchedFileNotes] = useState<FileNotesWithUser[]>([]);

  useEffect(() => {
    const fetchFileNotes = async () => {
      const response = await fetch(`/api/filenotes/${loan.id}`);
      const fileNotes = await response.json();
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
            <InfoCard fileNote={note} key={note.id} />
          );
        })}
    </Flex>
  );
};

export default FileNotesComponent;
