import { DocumentChecklist, Loan, TaskList } from "@prisma/client";
import {
  Avatar,
  Box,
  Button,
  Card,
  DropdownMenu,
  Flex,
  Heading,
  HoverCard,
  Inset,
  Table,
  Text,
} from "@radix-ui/themes";
import React from "react";
import DocumentStatusDropdown from "./DocumentStatusDropdown";
import DeleteAndEditButtons from "./DeleteAndEditButtons";
import ImportantBadge from "./ImportantBadge";
import TaskStatusDropdown from "./TaskStatusDropdown";
import { QueryClient } from "@tanstack/react-query";
import { formatDateDisplay } from "./formatDateDisplay";
import NoItemsFound from "./NoItemsFound";
import { FaUserTie } from "react-icons/fa6";

interface User {
  name: string;
  image: string;
  email: string;
}

interface DocumentChecklistItemWithUser extends DocumentChecklist {
  user: User;
}

interface TaskListItemWithUser extends TaskList {
  user: User;
}

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
  taskList?: TaskListItemWithUser[] | null;
  documentChecklist?: DocumentChecklistItemWithUser[];
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
              Your {documentChecklist && "document checklist"}{" "}
              {taskList && "task list"} for {loan.borrowerName}
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
                        <HoverCard.Root>
                          <HoverCard.Trigger>
                            <Avatar
                              size="1"
                              src={item.user?.image}
                              fallback={<FaUserTie />}
                              className="mr-2"
                              radius="full"
                            />
                          </HoverCard.Trigger>
                          <HoverCard.Content>
                            <Flex gap="4">
                              <Avatar
                                size="3"
                                fallback={<FaUserTie />}
                                radius="full"
                                src={item.user.image}
                              />
                              <Box>
                                <Heading size="3" as="h3">
                                  {item.user.name}
                                </Heading>
                                <Text as="div" size="2" color="gray" mb="2">
                                  {item.user.email}
                                </Text>
                              </Box>
                            </Flex>
                          </HoverCard.Content>
                        </HoverCard.Root>
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
                            isDocumentChecklist={true}
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
                        <HoverCard.Root>
                          <HoverCard.Trigger>
                            <Avatar
                              size="1"
                              src={item.user?.image}
                              fallback={<FaUserTie />}
                              className="mr-2"
                              radius="full"
                            />
                          </HoverCard.Trigger>
                          <HoverCard.Content>
                            <Flex gap="4">
                              <Avatar
                                size="3"
                                fallback={<FaUserTie />}
                                radius="full"
                                src={item.user.image}
                              />
                              <Box>
                                <Heading size="3" as="h3">
                                  {item.user.name}
                                </Heading>
                                <Text as="div" size="2" color="gray" mb="2">
                                  {item.user.email}
                                </Text>
                              </Box>
                            </Flex>
                          </HoverCard.Content>
                        </HoverCard.Root>
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
                          <Button
                            variant="surface"
                            size={"1"}
                            className="hover:cursor-pointer"
                          >
                            <DropdownMenu.TriggerIcon />
                          </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          <DeleteAndEditButtons
                            item={item}
                            loan={loan}
                            isTaskList={true}
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
