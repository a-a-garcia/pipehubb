"use client";
import ActivityLog from "@/app/components/ActivityLog";
import LoanHeading from "@/app/components/LoanHeading";
import LoanTabs from "@/app/components/LoanTabs";
import { QueryClient, useQuery } from "@tanstack/react-query";
import React from "react";

const ActivityLogPage = async ({ params }: { params: { id: string } }) => {
  const {
    isFetching,
    isStale,
    isFetched,
    error,
    isPending,
    data: loan,
  } = useQuery({
    queryKey: ["loan", params.id],
    queryFn: () => fetch(`/api/loans/${params.id}`).then((res) => res.json()),
  });

  if (isFetching && !isStale) {
    console.log('Data is being fetched from cache');
  } else if (isFetching && isStale) {
    console.log('Data is being fetched from server');
  }
  return (
    <div>
      <LoanTabs params={params} isActivityLog={true}/>
      <ActivityLog loan={loan} />
    </div>
  );
};

export default ActivityLogPage;
