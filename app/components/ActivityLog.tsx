import { Flex } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { Loan, ActivityLog as ActivityLogType } from "@prisma/client";
import InfoCard from "./InfoCard";
import { useQuery } from "@tanstack/react-query";

interface activityLogWithUser extends ActivityLogType {
  user: { name: string; image: string };
}


const ActivityLog = ({ loan }: { loan: Loan }) => {
  const { data: fetchedActivityLog, isPending, error } = useQuery<activityLogWithUser[]>({
    queryKey: ["activityLog", loan.id],
    queryFn: () => fetch(`/api/activitylog/${loan.id}`).then((res) => res.json())
  });

  console.log(fetchedActivityLog)

  return (
    <Flex direction={"column"} gap={"4"} className="mt-4">
      {fetchedActivityLog &&
        fetchedActivityLog.map((activity) => {
          return (
            <InfoCard activity={activity} key={activity.id}/>
          );
        })}
    </Flex>
  );
};

export default ActivityLog;
