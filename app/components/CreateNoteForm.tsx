import { Loan } from "@prisma/client";
import {
  Flex,
  Popover,
  Button,
  Avatar,
  Box,
  TextArea,
  Checkbox,
  Badge,
  Text,
} from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaCircleExclamation } from "react-icons/fa6";
import { MdOutlineCreate } from "react-icons/md";
import { createFileNoteSchema } from "../validationSchemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ImportantBadge from "./ImportantBadge";

type CreateFileNoteData = z.infer<typeof createFileNoteSchema>;

const CreateNoteForm = ({ loan }: { loan: Loan }) => {
  const [error, setError] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [importantInput, setImportantInput] = useState(false);

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

      window.location.reload();
    } catch (error) {
      console.error("Error occurred while submitting form:", error); // log any errors
      setError("An error occurred while creating the note.");
    }
  };

  return (
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
              <form onSubmit={onSubmit}>
                <TextArea
                  placeholder="Write a note…"
                  style={{ height: 120 }}
                  onChange={(e) => {
                    setNoteInput(e.target.value);
                  }}
                />
                <Flex gap="3" mt="3" justify="between">
                  <Flex align="center" gap="2" asChild>
                    <Text
                      as="label"
                      size="2"
                    >
                      {/* Radix UI checkbox has additional possible value for checked - `indeterminate` so must handle that */}
                      <Checkbox onCheckedChange={(value) => value !== 'indeterminate' && setImportantInput(value)}/>
                      <Text>
                        Mark as <ImportantBadge />
                      </Text>
                    </Text>
                  </Flex>

                  <Popover.Close>
                    <Button
                      className="myCustomButton hover:cursor-pointer"
                      size="1"
                      type="submit"
                    >
                      Create
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

export default CreateNoteForm;
