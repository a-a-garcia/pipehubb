import {
  Dialog,
  Button,
  Flex,
  TextField,
  Text,
  Box,
  Card,
  Table,
  Badge,
} from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { MdCancel, MdOutlineCreate } from "react-icons/md";
import MarkAsImportant from "./MarkAsImportant";
import { set } from "date-fns";
import ImportantBadge from "./ImportantBadge";
import { FaTrashCan } from "react-icons/fa6";

interface ChecklistItem {
  documentName: string;
  dueDate: string;
  important: boolean;
}

const ChecklistForm = () => {
  const [checklistToSubmit, setChecklistToSubmit] = useState<ChecklistItem[]>(
    []
  );
  const [importantInput, setImportantInput] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleAddChecklistItem = () => {
    const newChecklistItem = {
      documentName: documentName,
      dueDate: dueDate,
      important: importantInput,
    };
    setChecklistToSubmit([...checklistToSubmit, newChecklistItem]);
    setDocumentName("");
    setDueDate("");
    setImportantInput(false);
  };

  useEffect(() => {
    console.log(checklistToSubmit);
  }, [checklistToSubmit]);

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button className="myCustomButton hover:cursor-pointer" size="1">
          Create Checklist Item(s) <MdOutlineCreate />
        </Button>
      </Dialog.Trigger>

      <form>
        <Dialog.Content>
          <Dialog.Title>Create Checklist</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Add new checklist item(s) to the document checklist.
          </Dialog.Description>
          <Card>
            <Flex direction="column" gap="3">
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Document Name
                </Text>
                <TextField.Root>
                  <TextField.Input
                    placeholder="Enter document name"
                    onChange={(e) => setDocumentName(e.target.value)}
                    value={documentName}
                  />
                </TextField.Root>
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Due Date (Optional)
                </Text>
                <TextField.Root>
                  <TextField.Input
                    type="date"
                    onChange={(e) => setDueDate(e.target.value)}
                    value={dueDate}
                  />
                </TextField.Root>
              </label>
              <label>
                <MarkAsImportant
                  importantInput={importantInput}
                  setImportantInput={setImportantInput}
                />
              </label>
              <Flex justify={"start"}>
                <Button
                  className="myCustomButton"
                  onClick={() => handleAddChecklistItem()}
                >
                  <Text size="1">Add Checklist Item</Text>
                </Button>
              </Flex>
            </Flex>
          </Card>

          <Card className="!bg-darkGrey text-white mt-4">
            <Text>Checklist Item(s) To Be Added</Text>
          </Card>
          <Card>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Document</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Due Date</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Important?</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {checklistToSubmit.map((item) => {
                  return (
                    <Table.Row
                      key={item.documentName}
                      className="!bg-green-100"
                    >
                      <Table.Cell>{item.documentName}</Table.Cell>
                      <Table.Cell>
                        {item.dueDate === "" ? (
                          <Badge variant="surface">
                            <MdCancel />
                            N/A
                          </Badge>
                        ) : (
                          item.dueDate
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        {item.important ? (
                          <ImportantBadge />
                        ) : (
                          <Badge variant="surface">
                            <MdCancel />
                            N/A
                          </Badge>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <Button variant="solid" color="red" size="1">
                          <FaTrashCan />
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Root>
          </Card>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button className="myCustomButton">Finish</Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </form>
    </Dialog.Root>
  );
};

export default ChecklistForm;
