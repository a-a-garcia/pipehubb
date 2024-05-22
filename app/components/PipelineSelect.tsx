import { LoanTeam, User } from "@prisma/client";
import { Button, Flex, Select, Spinner } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import ErrorMessage from "./ErrorMessage";
import { useRouter, useSearchParams } from "next/navigation";
import { queryClient } from "../api/ReactQueryProviderClient";
import LoginMessage from "./LoginMessage";

interface Props {
  setSelectedPipeline?: (value: string) => void;
  selectedPipeline?: string;
  isLoanForm?: boolean;
}

const PipelineSelect = ({ setSelectedPipeline = () => {}, selectedPipeline, isLoanForm}: Props) => {
  const { status, data: session } = useSession();
  const router = useRouter();
  const {
    data: loanTeams,
    isPending,
    error,
  } = useQuery({
    queryKey: ["allPipelines", { userId: session?.user.id }],
    queryFn: () =>
      fetch(`/api/pipelines/${session?.user.id}`).then((res) => res.json()),
      enabled: !!session?.user.id,
  });
  const [openLoginMessage, setOpenLoginMessage] = useState(false);

  const switchPipelines = async (value: string) => {
    const response = await fetch(`/api/loans/?teamName=${value}`);
    const data = await response.json();
    console.log(data);

    queryClient.setQueryData(["allLoans", session?.user.id], data);
    router.push(`/loans/pipeline?teamName=${value}`);
  };

  if (error) {
    return <ErrorMessage>{String(error)}</ErrorMessage>;
  }

  return (
    <Flex direction={"column"} gap={"2"}>
      <Select.Root onValueChange={isLoanForm ? value => setSelectedPipeline(value) : switchPipelines}>
        <Select.Trigger
          placeholder={
            isPending
              ? "Loading..."
              : isLoanForm
              ? "Assign Loan To Team..."
              : "Switch To Another Pipeline"
          }
        ></Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Label>
              {isLoanForm ? "Choose a loan team: " : "Choose a team pipeline: "}
            </Select.Label>
            {loanTeams &&
              loanTeams.map((loanTeam: LoanTeam) => {
                return (
                  <Select.Item
                    key={loanTeam.id}
                    value={isLoanForm ? loanTeam.id.toString() : loanTeam.teamName}
                    className="hover:cursor-pointer"
                  >
                    {loanTeam.teamName}
                  </Select.Item>
                );
              })}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      {!isLoanForm && (
        <Flex justify={"center"}>
          <Button
            variant="soft"
            color="plum"
            onClick={() => setOpenLoginMessage(true)}
          >
            Open Loan Request Menu
          </Button>
          {openLoginMessage && (
            <LoginMessage
              open={openLoginMessage}
              setOpen={setOpenLoginMessage}
            />
          )}
        </Flex>
      )}
    </Flex>
  );
};

export default PipelineSelect;
