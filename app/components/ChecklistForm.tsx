import {
  Dialog,
  Button,
  Flex,
  TextField,
  Text,
  Card,
  Table,
  Badge,
} from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { MdCancel, MdOutlineCreate } from "react-icons/md";
import MarkAsImportant from "./MarkAsImportant";
import { format } from "date-fns";
import ImportantBadge from "./ImportantBadge";
import { FaTrashCan } from "react-icons/fa6";
import { DocumentChecklist, Loan } from "@prisma/client";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { GrDocumentMissing } from "react-icons/gr";
import { formatDateDisplay } from "./formatDateDisplay";
import { useSession } from "next-auth/react";

interface ChecklistItem {
  loanId: BigInt;
  documentName: string;
  userId: string;
  dueDate: string | null;
  important: boolean;
}

const ChecklistForm = ({
  loan,
  isEditMode,
  item,
}: {
  loan: Loan;
  isEditMode: Boolean;
  item?: DocumentChecklist;
}) => {
  const [checklistToSubmit, setChecklistToSubmit] = useState<ChecklistItem[]>(
    []
  );
  const [importantInput, setImportantInput] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const userInSession = useSession().data?.user;

  const handleAddChecklistItem = () => {
    const newChecklistItem = {
      userId: userInSession!.id,
      loanId: loan.id,
      documentName: documentName,
      dueDate: dueDate === "" ? null : new Date(dueDate).toISOString(),
      important: importantInput,
    };
    console.log(newChecklistItem);
    setChecklistToSubmit([...checklistToSubmit, newChecklistItem]);
    setDocumentName("");
    setDueDate("");
    setImportantInput(false);
  };

  const deleteChecklistItem = (documentName: string) => {
    const updatedChecklist = checklistToSubmit.filter(
      (item) => item.documentName !== documentName
    );
    console.log(updatedChecklist);
    setChecklistToSubmit(updatedChecklist);
  };

  const handleFinish = async () => {
    try {
      if (isEditMode) {
        await axios.patch(`/api/documentchecklist`, {
          id: item?.id,
          documentName: documentName,
          dueDate: dueDate === "" ? null : new Date(dueDate).toISOString(),
          important: importantInput,
        });
      } else {
        await axios.post(`/api/documentchecklist`, checklistToSubmit);
      }
    } catch {
      console.log(
        "An error occurred while attempting to submit the checklist."
      );
    }
    window.location.reload();
  };

  useEffect(() => {
    if (isEditMode) {
      setDocumentName(item?.documentName ? item.documentName : "");
      setDueDate(
        //must use "yyyy-MM-dd" because the TextField component with type="date" expects it in that format.
        item?.dueDate ? format(new Date(item.dueDate), "yyyy-MM-dd") : ""
      );
      setImportantInput(item?.important ? item.important : false);
    }
  }, [checklistToSubmit]);

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        {isEditMode ? (
          <Button className="myCustomButton hover:cursor-pointer" size="1">
            Edit <FaEdit />
          </Button>
        ) : (
          <Button className="myCustomButton hover:cursor-pointer" size="1">
            Create Checklist Item(s) <MdOutlineCreate />
          </Button>
        )}
      </Dialog.Trigger>

      <form>
        <Dialog.Content>
          <Dialog.Title>
            {isEditMode ? "Editing Checklist Item..." : "Create Checklist"}
          </Dialog.Title>
          <Dialog.Description size="2" mb="4">
            {!isEditMode &&
              "Add new checklist item(s) to the document checklist."}
          </Dialog.Description>
          <Card>
            <Flex direction="column" gap="3">
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Document Name
                </Text>
                <TextField.Root
                  placeholder="Enter document name"
                  onChange={(e) => setDocumentName(e.target.value)}
                  value={documentName}
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
              {!isEditMode && (
                <Flex justify={"start"}>
                  <Button
                    className="myCustomButton"
                    onClick={() => handleAddChecklistItem()}
                  >
                    <Text size="1">Add Checklist Item</Text>
                  </Button>
                </Flex>
              )}
            </Flex>
          </Card>
          {!isEditMode && (
            <div>
              <Card className="!bg-darkGrey text-white mt-4">
                <Text>Checklist Item(s) To Be Added</Text>
              </Card>
              <Card>
                <Table.Root>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell>Document</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>
                        Important?
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Due Date</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {checklistToSubmit.length === 0 && (
                      <Table.Row>
                        <Table.Cell>
                          <Text>No checklist items have been added.</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <GrDocumentMissing />
                        </Table.Cell>
                        <Table.Cell>
                          <GrDocumentMissing />
                        </Table.Cell>
                      </Table.Row>
                    )}
                    {checklistToSubmit.map((item) => {
                      return (
                        <Table.Row
                          key={item.documentName}
                          className="!bg-green-100 animate-dropIn"
                        >
                          <Table.Cell>{item.documentName}</Table.Cell>
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
                            {item.dueDate === null ? (
                              <Badge variant="surface">
                                <MdCancel />
                                N/A
                              </Badge>
                            ) : (
                              // pass true here for adjustForTimezone prop so the time doesn't display
                              formatDateDisplay(item.dueDate, true)
                            )}
                          </Table.Cell>
                          <Table.Cell>
                            <Button
                              variant="solid"
                              color="red"
                              size="1"
                              onClick={() =>
                                deleteChecklistItem(item.documentName)
                              }
                            >
                              <FaTrashCan />
                            </Button>
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table.Root>
              </Card>
            </div>
          )}

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button
                variant="soft"
                color="gray"
                onClick={() => setChecklistToSubmit([])}
              >
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              {isEditMode ? (
                <Button
                  color="blue"
                  onClick={() => handleFinish()}
                >
                  Finish
                </Button>
              ) : (
                <Button
                  color="blue"
                  onClick={() => handleFinish()}
                  disabled={checklistToSubmit.length > 0 ? false : true}
                >
                  Finish
                </Button>
              )}
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </form>
    </Dialog.Root>
  );
};

export default ChecklistForm;
