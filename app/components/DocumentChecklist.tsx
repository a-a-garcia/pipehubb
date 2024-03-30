import {
  DocumentChecklist as DocumentChecklistType,
  Loan,
} from "@prisma/client";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Flex,
  Heading,
  HoverCard,
  Inset,
  Select,
  Table,
  Text,
} from "@radix-ui/themes";
import { format, set } from "date-fns";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "@/public/images/pipeHubb_logo_transparent.png";
import { FaEdit } from "react-icons/fa";
import { FaCircleExclamation, FaTrashCan } from "react-icons/fa6";
import { MdOutlineCreate } from "react-icons/md";
import { AiOutlineClear } from "react-icons/ai";

const formatDate = (date: Date) => {
  return format(new Date(date), "MM/dd/yyyy, HH:mm aa");
};

const DocumentChecklist = ({ loan }: { loan: Loan }) => {
  const [documentChecklist, setDocumentChecklist] = useState<
    DocumentChecklistType[] | null
  >(null);
  const [badgeColor, setBadgeColor] = useState<string>();

  useEffect(() => {
    const fetchDocumentChecklist = async () => {
      const response = await fetch(`/api/documentchecklist/${loan.id}`);
      const data = await response.json();
      console.log(data);
      setDocumentChecklist(data);
      setBadgeColor(determineBadgeColor(data.status));
    };
    if (!documentChecklist) {
      fetchDocumentChecklist();
    }
  }, [loan.id]);

  return (
    <div>
      <Box className="mt-4">
        <Flex justify={"end"}>
          <Button className="myCustomButton hover:cursor-pointer">
            Create Checklist Item(s) <MdOutlineCreate />
          </Button>
        </Flex>
        <Card className="mt-4">
          <Inset
            clip="border-box"
            side="top"
            p="current"
            className="!bg-darkGrey"
          >
            <Flex justify={"between"} align={"center"}>
              <Heading className="text-white">
                Your checklist for {loan.borrowerName}
              </Heading>
              <HoverCard.Root>
                <HoverCard.Trigger>
                  <Button color="red" size="1" className="hover:cursor-pointer">
                    <AiOutlineClear />
                  </Button>
                </HoverCard.Trigger>
                <HoverCard.Content className=" max-w-64" size={"1"}>
                  <Flex gap="4">
                    <Avatar
                      size="1"
                      fallback="R"
                      radius="full"
                      src="/images/pipeHubb_logo_transparent.png"
                    />
                    <Box>
                      <Heading size={"2"}>Clear Checklist</Heading>
                      <Text size="1">
                        Click this button to delete <strong>the entire</strong>{" "}
                        checklist.
                      </Text>
                      <Flex gap="2" className="mt-2" align={"center"}>
                        <FaCircleExclamation color="red" size="15px" />
                        <Text size="1" color="red">
                          {" "}
                          This is a permanent action.
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                </HoverCard.Content>
              </HoverCard.Root>
            </Flex>
          </Inset>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Created By</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Document</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Due Date</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {documentChecklist &&
                documentChecklist.map((item) => {
                  return (
                    <Table.Row>
                      <Table.Cell>
                        <Checkbox />
                      </Table.Cell>
                      <Table.Cell>
                        <Avatar
                          size="1"
                          src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                          fallback="A"
                          className="mr-2"
                          radius="full"
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Text>{item.documentName}</Text>
                      </Table.Cell>
                      <Select.Root defaultValue={item.status}>
                        <Table.Cell>
                          <Select.Trigger
                            variant="ghost"
                            className="hover:cursor-pointer"
                          />
                          <Select.Content variant="soft" color="gray">
                            <Select.Item value={item.status}>
                              <Badge color={determineBadgeColor(item.status)}>
                                {item.status}
                              </Badge>
                            </Select.Item>
                          </Select.Content>
                        </Table.Cell>
                      </Select.Root>
                      <Table.Cell>
                        {item.dueDate ? formatDate(item.dueDate) : "None"}
                      </Table.Cell>
                      <Table.Cell>
                        <Flex gap={"2"}>
                          <HoverCard.Root>
                            <HoverCard.Trigger>
                              <Button
                                color="indigo"
                                className="hover:cursor-pointer"
                                size={"1"}
                              >
                                <FaEdit />
                              </Button>
                            </HoverCard.Trigger>
                            <HoverCard.Content className=" max-w-64" size={"1"}>
                              <Flex gap="4">
                                <Avatar
                                  size="1"
                                  fallback="R"
                                  radius="full"
                                  src="/images/pipeHubb_logo_transparent.png"
                                />
                                <Box>
                                  <Heading size={"2"}>
                                    Edit Checklist Item
                                  </Heading>
                                  <Text size="1">
                                    Click this button to edit the content of
                                    this checklist item.
                                  </Text>
                                </Box>
                              </Flex>
                            </HoverCard.Content>
                          </HoverCard.Root>
                          <HoverCard.Root>
                            <HoverCard.Trigger>
                              <Button
                                color="red"
                                className="hover:cursor-pointer"
                                size={"1"}
                              >
                                <FaTrashCan />
                              </Button>
                            </HoverCard.Trigger>
                            <HoverCard.Content className=" max-w-64" size={"1"}>
                              <Flex gap="4">
                                <Avatar
                                  size="1"
                                  fallback="R"
                                  radius="full"
                                  src="/images/pipeHubb_logo_transparent.png"
                                />
                                <Box>
                                  <Heading size={"2"}>
                                    Delete Checklist Item
                                  </Heading>
                                  <Text size="1">
                                    Click this button to delete this checklist
                                    item.
                                  </Text>
                                  <Flex
                                    gap="2"
                                    className="mt-2"
                                    align={"center"}
                                  >
                                    <FaCircleExclamation
                                      color="red"
                                      size="15px"
                                    />
                                    <Text size="1" color="red">
                                      {" "}
                                      This is a permanent action.
                                    </Text>
                                  </Flex>
                                </Box>
                              </Flex>
                            </HoverCard.Content>
                          </HoverCard.Root>
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
            </Table.Body>
          </Table.Root>
        </Card>
      </Box>
    </div>
  );
};
const determineBadgeColor = (
  status: string
): "crimson" | "orange" | "green" | undefined => {
  switch (status) {
    case "PENDING":
      return "crimson";
    case "REQUESTED":
      return "orange";
    case "RECEIVED":
      return "green";
    default:
      return undefined;
  }
};
export default DocumentChecklist;
