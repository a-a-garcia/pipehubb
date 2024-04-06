import { DocumentChecklist, Loan } from "@prisma/client";
import {
  Avatar,
  Badge,
  Card,
  Flex,
  Heading,
  Inset,
  Table,
  Text,
} from "@radix-ui/themes";
import { format } from "date-fns";
import React from "react";
import { MdCancel } from "react-icons/md";
import StatusDropdown from "./StatusDropdown";
import DeleteAndEditButtons from "./DeleteAndEditButtons";
import ImportantBadge from "./ImportantBadge";
import TabHeader from "./TabHeader";

const formatDate = (date: Date) => {
  return format(new Date(date), "MM/dd/yyyy, HH:mm aa");
};

//cannot conditionally declare (if (isDocumentChecklist) {} ) state, useEffects because it violates rules of hooks - hooks must be called at top level of component.
// fetchDocumentChecklist doesn't return anything so it's type void

const Checklist = ({
  isTasks,
  loan,
  documentChecklist,
  fetchDocumentChecklist,
}: {
  isTasks: Boolean;
  loan: Loan;
  isDocumentChecklist: Boolean;
  documentChecklist?: DocumentChecklist[];
  fetchDocumentChecklist(): void;
}) => {
  return (
    <div>
      <Card className="mt-4">
        <Inset
          clip="border-box"
          side="top"
          p="current"
          className="!bg-darkGrey"
        >
          <Flex justify={"between"} align={"center"}>
            <Heading className="text-white">
              Your {documentChecklist ? "checklist" : "task list"} for {loan.borrowerName}
            </Heading>
          </Flex>
        </Inset>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Created By</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Important?</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Document</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Due Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {documentChecklist &&
              documentChecklist.map((item) => {
                return (
                  // completed item styling
                  <Table.Row
                    key={item.id}
                    style={
                      item.status === "RECEIVED"
                        ? {
                            textDecorationLine: "line-through",
                            opacity: "0.5",
                            backgroundColor: "rgb(220 252 231)",
                            color: "rgb(156 163 175)",
                          }
                        : {}
                    }
                  >
                    <Table.Cell>
                      <StatusDropdown
                        item={item}
                        fetchDocumentChecklist={fetchDocumentChecklist}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Flex>
                        <Avatar
                          size="1"
                          src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                          fallback="A"
                          className="mr-2"
                          radius="full"
                        />
                        <Text size="1">On {formatDate(item.createdAt)}</Text>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex justify={"center"}>
                        {item.important ? (
                          <ImportantBadge />
                        ) : (
                          <Badge variant="surface">
                            <MdCancel />
                            N/A
                          </Badge>
                        )}
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      <Text>{item.documentName}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      {item.dueDate ? formatDate(item.dueDate) : "None"}
                    </Table.Cell>
                    <Table.Cell>
                      <DeleteAndEditButtons
                        item={item}
                        type="checklistItem"
                        loan={loan}
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
          </Table.Body>
        </Table.Root>
      </Card>
    </div>
  );
};
export default Checklist;
