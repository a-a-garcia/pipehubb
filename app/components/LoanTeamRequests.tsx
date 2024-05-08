import { LoanTeam, LoanTeamRequest } from "@prisma/client";
import React from "react";
import { serverSessionAuth } from "../api/auth/authOptions";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Flex, Heading, Spinner, Table } from "@radix-ui/themes";
import { formatDateDisplay } from "./formatDateDisplay";
import ErrorMessage from "./ErrorMessage";
import { useSession } from "next-auth/react";
import NoItemsFound from "./NoItemsFound";
import LoadingBadge from "./LoadingBadge";
import { FaCheck } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";

interface LoanTeamRequestWithName extends LoanTeamRequest {
  requesteeEmail?: string;
  requestorEmail?: string;
}

const LoanTeamRequests = ({loanTeamRequests} : {loanTeamRequests : LoanTeamRequest[][]}) => {
  return (
    <Flex direction={"column"} gap="2">
      <Card className="!bg-cactus">
        <Heading size={"4"}>Your outgoing loan team requests... </Heading>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Request Sent To</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Requested On</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {loanTeamRequests &&
              loanTeamRequests[0].length > 0 &&
              loanTeamRequests[0].map((request: LoanTeamRequestWithName) => (
                <Table.Row key={request.id}>
                  <Table.Cell>{request.requesteeEmail}</Table.Cell>
                  <Table.Cell>
                    {formatDateDisplay(request.createdAt)}
                  </Table.Cell>
                  <Table.Cell>{request.status}</Table.Cell>
                </Table.Row>
              ))}
            {loanTeamRequests && loanTeamRequests[0].length === 0 && (
              <Table.Row>
                <Table.Cell colSpan={3}>
                  <NoItemsFound />
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Card>
      <Card className="!bg-cactus">
        <Heading size={"4"}>Your incoming loan team requests... </Heading>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Requested By</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Requested On</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Take Action</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {loanTeamRequests &&
              loanTeamRequests[1].length > 0 &&
              loanTeamRequests[1].map((request: LoanTeamRequestWithName) => (
                <Table.Row key={request.id}>
                  <Table.Cell>{request.requestorEmail}</Table.Cell>
                  <Table.Cell>
                    {formatDateDisplay(request.createdAt)}
                  </Table.Cell>
                  <Table.Cell>{request.status}</Table.Cell>
                  <Table.Cell>
                    <Flex gap={"2"}>
                      <Button color="green">Approve <FaCheck /></Button>
                      <Button color="red">Reject <MdCancel /></Button>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            {loanTeamRequests && loanTeamRequests[1].length === 0 && (
              <Table.Row>
                <Table.Cell colSpan={4}>
                  <NoItemsFound />
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Card>
    </Flex>
  );
};

export default LoanTeamRequests;
