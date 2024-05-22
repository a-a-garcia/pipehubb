import { LoanTeamRequest } from "@prisma/client";
import React from "react";
import { Button, Card, Flex, Heading, Table } from "@radix-ui/themes";
import { formatDateDisplay } from "./formatDateDisplay";
import NoItemsFound from "./NoItemsFound";
import { FaCheck } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";

interface LoanTeamRequestWithName extends LoanTeamRequest {
  requesteeEmail?: string;
  requestorEmail?: string;
  teamName?: string;
}

const LoanTeamRequests = ({
  loanTeamRequests,
}: {
  loanTeamRequests: LoanTeamRequest[][];
}) => {
  const handleClick = (action: string, requestId: number) => {
    console.log(action, requestId);
    const response = fetch(`/api/loanteamrequests`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: action,
        id: requestId,
      }),
    });
    window.location.reload();
  };

  return (
    <Flex direction={"column"} gap="2">
      <Card className="!bg-cactus">
        <Heading size={"4"}>Your outgoing loan team requests... </Heading>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Request Sent To</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                Requested Team to Join
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Requested On</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Take Action</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {loanTeamRequests &&
              loanTeamRequests[0].length > 0 &&
              loanTeamRequests[0].map((request: LoanTeamRequestWithName) => (
                <Table.Row key={request.id}>
                  <Table.Cell>{request.requesteeEmail}</Table.Cell>
                  <Table.Cell>{request.teamName}</Table.Cell>
                  <Table.Cell>
                    {formatDateDisplay(request.createdAt)}
                  </Table.Cell>
                  <Table.Cell>{request.status}</Table.Cell>
                  <Table.Cell>
                    <Button
                      disabled={request.status === "PENDING" ? true : false}
                      color="blue"
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick("CONFIRMED", request.id);
                      }}
                    >
                      Confirm
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            {loanTeamRequests && loanTeamRequests[0].length === 0 && (
              <Table.Row>
                <Table.Cell colSpan={5}>
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
              <Table.ColumnHeaderCell>
                Requested Team To Join
              </Table.ColumnHeaderCell>
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
                  <Table.Cell>{request.teamName}</Table.Cell>
                  <Table.Cell>
                    {formatDateDisplay(request.createdAt)}
                  </Table.Cell>
                  <Table.Cell>{request.status}</Table.Cell>
                  <Table.Cell>
                    <Flex gap={"2"} direction={"column"}>
                      <Button
                        color="green"
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick("ACCEPTED", request.id);
                        }}
                      >
                        Approve <FaCheck />
                      </Button>
                      <Button
                        color="red"
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick("REJECTED", request.id);
                        }}
                      >
                        Reject <MdCancel />
                      </Button>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            {loanTeamRequests && loanTeamRequests[1].length === 0 && (
              <Table.Row>
                <Table.Cell colSpan={5}>
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
