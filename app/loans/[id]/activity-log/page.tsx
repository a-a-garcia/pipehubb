"use client";
import ActivityLog from "@/app/components/ActivityLog";
import LoadingBadge from "@/app/components/LoadingBadge";
import LoanTabs from "@/app/components/LoanTabs";
import { Loan } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";

const ActivityLogPage = ({ params }: { params: { id: string } }) => {
  const queryClient = useQueryClient();
  const loan = queryClient.getQueryData<Loan>(["loan"]);

  if (!loan) {
    return <div><LoadingBadge /></div>
  }
  
  return (
    <div>
      <LoanTabs params={params} isActivityLog={true}/>
      <ActivityLog loan={loan} />
    </div>
  );
};

export default ActivityLogPage;
