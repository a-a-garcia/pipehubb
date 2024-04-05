import { DocumentChecklist, FileNotes, Loan } from "@prisma/client";
import {
  Flex,
  Popover,
  Button,
  Avatar,
  Box,
  TextArea,
  Checkbox,
  Text,
  Heading,
} from "@radix-ui/themes";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdOutlineCreate } from "react-icons/md";
import { createFileNoteSchema } from "../validationSchemas";
import ImportantBadge from "./ImportantBadge";
import { FaEdit } from "react-icons/fa";
import MarkAsImportant from "./MarkAsImportant";

const NoteForm = ({
  loan,
  isEditMode,
  item,
}: {
  loan: Loan;
  isEditMode: Boolean;
  item?: DocumentChecklist | FileNotes;
}) => {
  const [error, setError] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [importantInput, setImportantInput] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setNoteInput((item as FileNotes)?.note);
      // if the important field is null or undefined, set it to false. This is probably from the radix-UI Checkbox component having the indeterminate value possibility
      setImportantInput((item as FileNotes)?.important ?? false);
    }
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({
      loanId: loan.id,
      note: noteInput,
      important: importantInput,
    });
    try {
      const validate = createFileNoteSchema.safeParse({
        loanId: loan.id,
        note: noteInput,
        important: importantInput,
      });

      if (!validate.success) {
        setError(validate.error.errors[0].message);
        return;
      }

      if (isEditMode) {
        await axios.patch(`/api/filenotes/${loan.id}`, {
          noteId: (item as FileNotes).id,
          note: noteInput,
          important: importantInput,
        });
      } else {
        const response = await axios.post(`/api/filenotes`, {
          loanId: loan.id,
          note: noteInput,
          important: importantInput,
        });
        console.log("Response from server:", response.data); // log the server response

        const correctedMessage = importantInput
          ? "USER created a new important note."
          : "USER created a new note.";

        await fetch(`/api/activitylog`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            loanId: loan.id,
            message: correctedMessage,
          }),
        });
      }

      window.location.reload();
    } catch (error) {
      console.error("Error occurred while submitting form:", error); // log any errors
      setError("An error occurred while creating the note.");
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button className="myCustomButton hover:cursor-pointer" size="1">
          {!isEditMode && "Create Note"}
          {isEditMode ? <FaEdit /> : <MdOutlineCreate />}
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
            <form onSubmit={onSubmit}>
              {isEditMode && <Heading size={"3"}>Editing note</Heading>}
              <TextArea
                className="mt-1"
                defaultValue={isEditMode ? noteInput : ""}
                placeholder="Write a note..."
                style={{ height: 120 }}
                onChange={(e) => {
                  setNoteInput(e.target.value);
                }}
              ></TextArea>
              <Flex gap="3" mt="3" justify="between">
                <MarkAsImportant
                  importantInput={importantInput}
                  setImportantInput={setImportantInput}
                />
                <Popover.Close>
                  <Button
                    className="myCustomButton hover:cursor-pointer"
                    size="1"
                    type="submit"
                  >
                    Submit
                  </Button>
                </Popover.Close>
              </Flex>
            </form>
          </Box>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
};

export default NoteForm;
