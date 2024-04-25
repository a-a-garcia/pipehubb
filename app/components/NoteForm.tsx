import {
  DocumentChecklist,
  FileNotes,
  Loan,
  TaskUpdates,
} from "@prisma/client";
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
  Spinner,
} from "@radix-ui/themes";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdOutlineCreate } from "react-icons/md";
import ImportantBadge from "./ImportantBadge";
import { FaEdit } from "react-icons/fa";
import MarkAsImportant from "./MarkAsImportant";
import { createFileNoteSchema } from "../validationSchemas";

const NoteForm = ({
  loan,
  isEditMode,
  isFileNotes,
  isTaskUpdates,
  taskId,
  item,
}: {
  loan?: Loan;
  isEditMode: Boolean;
  isFileNotes?: Boolean;
  isTaskUpdates?: Boolean;
  taskId?: number;
  item?: FileNotes | TaskUpdates;
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [importantInput, setImportantInput] = useState(false);
  console.log(item)

  useEffect(() => {
    if (isEditMode && isFileNotes) {
      setNoteInput((item as FileNotes)?.note);
      // if the important field is null or undefined, set it to false. This is probably from the radix-UI Checkbox component having the indeterminate value possibility
      setImportantInput((item as FileNotes)?.important ?? false);
    } else if (isEditMode && isTaskUpdates) {
      setNoteInput((item as TaskUpdates)?.message);
      setImportantInput((item as TaskUpdates)?.important ?? false);
    }
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      //editing a file note
      if (isEditMode && isFileNotes) {
        await axios.patch(`/api/filenotes/${loan!.id}`, {
          noteId: (item as FileNotes).id,
          note: noteInput,
          important: importantInput,
        });
        //creation of a new note
      } else if (isFileNotes) {
        const validate = createFileNoteSchema.safeParse({
          note: noteInput,
          important: importantInput,
        });
        if (!validate.success) {
          setError(validate.error.errors[0].message);
          return;
        }
        const response = await axios.post(`/api/filenotes`, {
          loanId: loan!.id,
          note: noteInput,
          important: importantInput,
        });
        const correctedMessage = importantInput
          ? "USER created a new important note."
          : "USER created a new note.";

        await fetch(`/api/activitylog`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            loanId: loan!.id,
            message: correctedMessage,
          }),
        });
        console.log("Response from server:", response.data);
        //creating a task
      } else if (isEditMode && isTaskUpdates) {
        await axios.patch(`/api/taskupdates`, {
          taskUpdateId: (item as TaskUpdates).id,
          message: noteInput,
          important: importantInput,
        });
      } else if (isTaskUpdates) {
        await axios.post(`/api/taskupdates`, {
          taskId: taskId,
          message: noteInput,
          important: importantInput,
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
          <Flex align={"center"} gap="1">
            <Text>
              {!isEditMode ? "Create" : "Edit"}{" "}
            </Text>
            {!isEditMode ? <MdOutlineCreate /> : <FaEdit />}
          </Flex>
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
              {isEditMode && (
                <Heading size={"3"}>
                  Editing{" "}
                  {isFileNotes ? "Note" : isTaskUpdates && "Task Update"}...
                </Heading>
              )}
              <TextArea
                className="mt-1"
                defaultValue={isEditMode ? noteInput : ""}
                placeholder={
                  isFileNotes
                    ? "Write a note.."
                    : isTaskUpdates && "Write a new task update.."
                }
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
                    onClick={() => setSubmitting(true)}
                  >
                    Submit
                    {submitting && <Spinner className="ml-2" />}
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
