import {
  DocumentChecklist as DocumentChecklistType,
  Loan,
} from "@prisma/client";
import {
  Avatar,
  Badge,
  Card,
  Checkbox,
  Flex,
  Heading,
  Inset,
  Table,
  Text,
} from "@radix-ui/themes";
import { format, set } from "date-fns";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "@/public/images/pipeHubb_logo_transparent.png";

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
      <Card className="!bg-cactus mt-4">
        <Card className="mt-4">
          <Inset
            clip="border-box"
            side="top"
            p="current"
            className="!bg-darkGrey"
          >
            <Heading className="text-white">
              Your checklist for {loan.borrowerName}
            </Heading>
          </Inset>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Created By</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  Requested Document
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Due Date</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {documentChecklist &&
                documentChecklist.map((item, index) => {
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
                      <Table.Cell>
                        <Badge color={determineBadgeColor(item.status)}>
                          {item.status}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        {item.dueDate ? formatDate(item.dueDate) : "None"}
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
            </Table.Body>
          </Table.Root>
        </Card>
      </Card>
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
