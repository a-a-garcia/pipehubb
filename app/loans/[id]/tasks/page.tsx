"use client";
import LoanTabs from "@/app/components/LoanTabs";
import Tasks from "@/app/components/Tasks";
import { Loan } from "@prisma/client";
import { Spinner } from "@radix-ui/themes";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";

const TasksListPage = ({ params }: { params: { id: string } }) => {
  const queryClient = useQueryClient();
  const loan = queryClient.getQueryData<Loan>(["loan"]);

  if (!loan) {
    return <div>No loan found.</div>;
  }

  return (
    <div>
      <LoanTabs params={params} isTasks={true} />
      <Tasks loan={loan} />
    </div>
  );
};

export default TasksListPage;
