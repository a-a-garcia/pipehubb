"use client";
import ErrorMessage from "@/app/components/ErrorMessage";
import LoanTabs from "@/app/components/LoanTabs";
import Tasks from "@/app/components/Tasks";
import TaskUpdates from "@/app/components/TaskUpdates";
import { Button, Spinner } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";

const TasksUpdatesPage = ({
  params,
}: {
  params: { id: string; taskid: string };
}) => {
  const router = useRouter();
  return (
    <div>
      <Button
        className="myCustomButton hover:cursor-pointer"
        onClick={() => router.back()}
      >
        Return to Tasks
      </Button>
      <TaskUpdates params={params} />
    </div>
  );
};

export default TasksUpdatesPage;
