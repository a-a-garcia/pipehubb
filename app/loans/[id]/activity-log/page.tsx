"use client";
import ActivityLog from "@/app/components/ActivityLog";
import LoanHeading from "@/app/components/LoanHeading";
import LoanTabs from "@/app/components/LoanTabs";
import { QueryClient, useQuery } from "@tanstack/react-query";
import React from "react";

const ActivityLogPage = async ({ params }: { params: { id: string } }) => {
  const {
    isFetching,
    error,
    data: loan,
  } = useQuery({
    queryKey: ["loan", params.id],
    queryFn: () => fetch(`/api/loans/${params.id}`).then((res) => res.json()),
  });

  if (isFetching) {
    console.log("fetching from activity log page")
  }
  
  return (
    <div>
      <LoanTabs params={params} isActivityLog={true}/>
      <ActivityLog loan={loan} />
    </div>
  );
};

export default ActivityLogPage;
