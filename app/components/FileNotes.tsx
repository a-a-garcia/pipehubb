import { Flex, Spinner } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { Loan } from "@prisma/client";
import { FileNotes } from "@prisma/client";
import TabHeader from "./TabHeader";
import InfoCard from "./InfoCard";
import NoItemsFound from "./NoItemsFound";
import { useQuery } from "@tanstack/react-query";
import ErrorMessage from "./ErrorMessage";

interface FileNotesWithUser extends FileNotes {
  user: { name: string; image: string };
}

const FileNotesComponent = ({ loan }: { loan: Loan }) => {
  const {
    data: fetchedFileNotes,
    isPending,
    error,
  } = useQuery<FileNotesWithUser[]>({
    queryKey: ["fileNotes", loan.id],
    queryFn: () => fetch(`/api/filenotes/${loan.id}`).then((res) => res.json()),
  });

  if (isPending) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage>{error.message}</ErrorMessage>
  }

  return (
    <>
      {loan && loan.id ? (
        <Flex direction={"column"} gap={"4"}>
          <TabHeader loan={loan} isFileNotes={true} />
          {fetchedFileNotes && fetchedFileNotes.length === 0 && (
            <NoItemsFound />
          )}
          {fetchedFileNotes &&
            fetchedFileNotes.map((note) => {
              return <InfoCard fileNote={note} key={note.id} />;
            })}
        </Flex>
      ) : (
        <ErrorMessage>An error has occurred.</ErrorMessage>
      )}
    </>
  );
};

export default FileNotesComponent;
