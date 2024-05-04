import { LoanTeam, User } from "@prisma/client";
import { Select, Spinner } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React from "react";
import ErrorMessage from "./ErrorMessage";
import { useRouter, useSearchParams } from "next/navigation";

const PipelineSelect = () => {
  const { status, data: session } = useSession();
  const router = useRouter();
  const { data: loanTeams, isPending, error } = useQuery({
    queryKey: ["allPipelines", { userId: session?.user.id }],
    queryFn: () =>
      fetch(`/api/pipelines/${session?.user.id}`).then((res) => res.json()),
  });
  
  const switchPipelines = (value: string) => {
    router.push(`/loans/pipeline?teamName=${value}`);
  }

  if (error) {
    return <ErrorMessage>{String(error)}</ErrorMessage>;
  }

  return (
    <Select.Root onValueChange={switchPipelines}>
      <Select.Trigger placeholder="Switch To Another Pipeline"/>
      <Select.Content>
        <Select.Group>
          <Select.Label>Choose a team pipeline: </Select.Label>
          {loanTeams && loanTeams.map((loanTeam: LoanTeam) => {
            return <Select.Item key={loanTeam.id} value={loanTeam.teamName} className="hover:cursor-pointer">{loanTeam.teamName}</Select.Item>
          })}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default PipelineSelect;
