import React, { useEffect, useState } from "react";
import TabHeader from "./TabHeader";
import { Loan, TaskList } from "@prisma/client";
import Checklist from "./Checklist";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingBadge from "./LoadingBadge";
import ErrorMessage from "./ErrorMessage";

const Tasks = ({ loan }: { loan: Loan }) => {
  //query client is initialized here because it's the parent component that's responsible for fetching the data
  const queryClient = useQueryClient();

  const fetchTaskList = async () => {
    return fetch(`/api/tasklist/${loan.id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API request failed with status ${res.status}`);
        }
        return res.json();
      })
      .catch((error) => {
        console.error("Error fetching task list:", error);
      });
  };

  const {
    data: taskList,
    error,
    isPending,
  } = useQuery({ queryKey: ["taskList"], queryFn: fetchTaskList });
  

  if (isPending) {
    return (
      <div className="mt-4">
        <LoadingBadge />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <ErrorMessage>{error.message}</ErrorMessage>
      </div>
    );
  }

  return (
    <div>
      <TabHeader isTasks={true} loan={loan}/>
      <Checklist
        loan={loan}
        taskList={taskList}
        queryClient={queryClient}
      />
    </div>
  );
};

export default Tasks;
