import { DocumentChecklist, Loan, TaskList } from "@prisma/client";
import {
  Avatar,
  Badge,
  Button,
  Card,
  DropdownMenu,
  Flex,
  Heading,
  Inset,
  Table,
  Text,
} from "@radix-ui/themes";
import { format } from "date-fns";
import React from "react";
import { MdCancel } from "react-icons/md";
import DocumentStatusDropdown from "./DocumentStatusDropdown";
import DeleteAndEditButtons from "./DeleteAndEditButtons";
import ImportantBadge from "./ImportantBadge";
import TabHeader from "./TabHeader";
import TaskStatusDropdown from "./TaskStatusDropdown";
import { QueryClient } from "@tanstack/react-query";
import { GrDocumentMissing } from "react-icons/gr";
import { formatDateDisplay } from "./formatDateDisplay";
import { FaExclamation, FaExclamationCircle } from "react-icons/fa";
import NoItemsFound from "./NoItemsFound";

//cannot conditionally declare (if (isDocumentChecklist) {} ) state, useEffects because it violates rules of hooks - hooks must be called at top level of component.
// fetchDocumentChecklist doesn't return anything so it's type void

const Checklist = ({
  loan,
  taskList,
  documentChecklist,
  fetchDocumentChecklist,
  queryClient,
}: {
  loan: Loan;
  taskList?: TaskList[] | null;
  documentChecklist?: DocumentChecklist[];
  fetchDocumentChecklist?(): void;
  queryClient: QueryClient;
}) => {
  return (
    <div>
      <Card className="mt-4 !bg-white !text-black">
        <Inset
          clip="border-box"
          side="top"
          p="current"
          className="!bg-darkGrey"
        >
          <Flex justify={"between"} align={"center"}>
            <Heading className="text-white">
              {/* Need to change documentChecklist data fetching into React Query for smoother loading of this title */}
              Your {documentChecklist && "document checklist"} {taskList && "task list"} for{" "}
              {loan.borrowerName}
            </Heading>
          </Flex>
        </Inset>
        <Table.Root layout={"auto"}>
          <Table.Header>
            <Table.Row className="animate-dropIn">
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Created By</Table.ColumnHeaderCell>
              {documentChecklist && (
                <Table.ColumnHeaderCell>Document</Table.ColumnHeaderCell>
              )}
              {taskList && (
                <Table.ColumnHeaderCell>Task</Table.ColumnHeaderCell>
              )}
              {taskList && (
                <Table.ColumnHeaderCell>Details</Table.ColumnHeaderCell>
              )}
              <Table.ColumnHeaderCell>Due Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {(documentChecklist && documentChecklist.length === 0) ||
            (taskList && taskList.length === 0) ? (
              <Table.Row className="animate-dropInLite">
                <Table.Cell colSpan={7}>
                  <NoItemsFound />
                </Table.Cell>
              </Table.Row>
            ) : null}
            {documentChecklist &&
              documentChecklist.map((item) => {
                return (
                  // completed item styling
                  <Table.Row
                    key={item.id}
                    className="animate-dropInLite"
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
                      <DocumentStatusDropdown
                        item={item}
                        //making this prop optional (because we are not utilizing it in isTasks mode) causes a typescript error. TS does not like the possibility of this being called outside of documentChecklist. Giving this prop a default value of an empty function is a fix.
                        fetchDocumentChecklist={
                          fetchDocumentChecklist || (() => {})
                        }
                      />
                    </Table.Cell>
                    <Table.Cell style={{ maxWidth: "20px" }}>
                      <Flex direction={"column"} gap="1">
                        <Avatar
                          size="1"
                          src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                          fallback="A"
                          className="mr-2"
                          radius="full"
                        />
                        <Text size="1">
                          On {formatDateDisplay(item.createdAt)}
                        </Text>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      {item.important ? (
                        <div className="mb-1">
                          <ImportantBadge />
                          <br />
                        </div>
                      ) : (
                        ""
                      )}
                      <Text>{item.documentName}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      {/* pass true here to adjustTimeZone prop to only display date, not time */}
                      {item.dueDate
                        ? formatDateDisplay(item.dueDate, true)
                        : "None"}
                    </Table.Cell>
                    <Table.Cell>
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                          <Button variant="surface">
                            <DropdownMenu.TriggerIcon />
                          </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          <DeleteAndEditButtons
                            item={item}
                            type="checklistItem"
                            loan={loan}
                          />
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    </Table.Cell>
                  </Table.Row>
                );
              })}

            {taskList &&
              taskList.map((item) => {
                return (
                  // completed item styling
                  <Table.Row
                    key={item.id}
                    className="animate-dropInLite"
                    style={
                      item.status === "COMPLETED"
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
                      <TaskStatusDropdown
                        item={item}
                        queryClient={queryClient}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Flex direction={"column"} gap="1">
                        <Avatar
                          size="1"
                          src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                          fallback="A"
                          className="mr-2"
                          radius="full"
                        />
                        <Text size="1">
                          On{" "}
                          {item.createdAt && formatDateDisplay(item.createdAt)}
                        </Text>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell maxWidth={"150px"}>
                      {item.important ? (
                        <div className="mb-1">
                          <ImportantBadge />
                          <br />
                        </div>
                      ) : (
                        ""
                      )}
                      <Text>{item.title}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text>{item.description}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      {item.dueDate
                        ? formatDateDisplay(item.dueDate, true)
                        : "None"}
                    </Table.Cell>
                    <Table.Cell>
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                          <Button variant="surface">
                            <DropdownMenu.TriggerIcon />
                          </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          <DeleteAndEditButtons
                            item={item}
                            type="taskList"
                            loan={loan}
                          />
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
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
