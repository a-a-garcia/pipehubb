import { Avatar, Badge, Card, Flex, Inset, Text } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { set } from "zod";
import Image from "next/image";
import logo from "@/public/images/pipeHubb_logo_transparent.png";
import { format } from "date-fns";
import { Loan } from "@prisma/client";
import { formatDateDisplay } from "./formatDateDisplay";
import InfoCard from "./InfoCard";

interface ActivityLog {
  id: number;
  loanId: number;
  userId: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}


const ActivityLog = ({ loan }: { loan: Loan }) => {
  const [fetchedActivityLog, setFetchedActivityLog] = useState<ActivityLog[]>(
    []
  );


  useEffect(() => {
    // fetches the activity log for the loan
    const fetchActivityLog = async () => {
      const response = await fetch(`/api/activitylog/${loan.id}`);
      const activityLog = await response.json();
      setFetchedActivityLog(activityLog);
    };
    fetchActivityLog();
  });

  return (
    <Flex direction={"column"} gap={"4"} className="mt-4">
      {fetchedActivityLog &&
        fetchedActivityLog.map((activity) => {
          return (
            <InfoCard activity={activity} />
          );
        })}
    </Flex>
  );
};

export default ActivityLog;
