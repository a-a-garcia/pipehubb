import {
  Dialog,
  Button,
  Card,
  Flex,
  TextField,
  Text,
  TextArea,
  Spinner,
} from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdOutlineCreate } from "react-icons/md";
import MarkAsImportant from "./MarkAsImportant";
import { Loan } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";

interface TaskList {
  id: number;
  loanId: number;
  title: string;
  userId: string;
  description: string | null;
  dueDate: Date | null;
  important: boolean | null;
}

const TasksForm = ({
  isEditMode,
  loan,
  item,
}: {
  isEditMode: Boolean;
  loan: Loan;
  item?: TaskList;
}) => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [importantInput, setImportantInput] = useState(false);
  const session = useSession();

  const handleSubmit = async () => {
    setSubmitting(true);
    const data = {
      id: item?.id,
      loanId: loan.id,
      title: title,
      userId: session.data!.user!.id,
      description: description,
      dueDate: dueDate === "" ? null : new Date(dueDate).toISOString(),
      important: importantInput,
    };
    if (isEditMode) {
      try {
        // send the data via axios with NO curly braces, or else it will be sent as a nested object. Meaning the data will not be accessible in the backend via `body.id` but rather `body.data.id`
        const response = await axios.patch(`/api/tasklist`, data);
        console.log(response);
        if (response.status === 200) {
          console.log("Update successful");
        } else {
          console.log("Update failed with status: ", response.status);
        }
      } catch (error) {
        console.log("Update failed with error: ", error);
      }
    } else {
      console.log(data)
      await axios.post(`/api/tasklist`, data);
    }
    window.location.reload();
  };

  useEffect(() => {
    if (isEditMode) {
      setTitle(item?.title ? item.title : "");
      setDescription(item?.description ? item.description : "");
      setDueDate(
        item?.dueDate ? new Date(item.dueDate).toISOString().slice(0, 10) : ""
      );
      setImportantInput(item?.important ? item.important : false);
    }
  }, []);

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        {isEditMode ? (
          <Button className="myCustomButton hover:cursor-pointer" size="1">
            Edit <FaEdit />
          </Button>
        ) : (
          <Button className="myCustomButton hover:cursor-pointer" size="1">
            Create Task <MdOutlineCreate />
          </Button>
        )}
      </Dialog.Trigger>

      <form>
        <Dialog.Content>
          <Dialog.Title>
            {isEditMode ? "Editing Task..." : "Create Task"}
          </Dialog.Title>
          <Dialog.Description size="2" mb="4">
            {!isEditMode && "Add a new task to the task list."}
          </Dialog.Description>
          <Card>
            <Flex direction="column" gap="3">
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Task Title
                </Text>
                <TextField.Root
                  placeholder="Enter Task Title"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                />
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Task Description (Optional)
                </Text>
                <TextArea
                  placeholder="Enter Task Description"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                />
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Due Date (Optional)
                </Text>
                <TextField.Root
                  type="date"
                  onChange={(e) => setDueDate(e.target.value)}
                  value={dueDate}
                />
              </label>
              <label>
                <MarkAsImportant
                  importantInput={importantInput}
                  setImportantInput={setImportantInput}
                />
              </label>
            </Flex>
          </Card>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button
                className="myCustomButton"
                onClick={() => handleSubmit()}
              >
                Submit {submitting && <Spinner />}
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </form>
    </Dialog.Root>
  );
};

export default TasksForm;
