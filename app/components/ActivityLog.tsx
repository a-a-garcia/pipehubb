import { Flex } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { Loan, ActivityLog as ActivityLogType } from "@prisma/client";
import InfoCard from "./InfoCard";

interface activityLogWithUser extends ActivityLogType {
  user: { name: string; image: string };
}


const ActivityLog = ({ loan }: { loan: Loan }) => {
  const [fetchedActivityLog, setFetchedActivityLog] = useState<activityLogWithUser[]>(
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
            <InfoCard activity={activity} key={activity.id}/>
          );
        })}
    </Flex>
  );
};

export default ActivityLog;
