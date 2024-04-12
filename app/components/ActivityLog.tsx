import { Avatar, Badge, Card, Flex, Inset, Text } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { set } from "zod";
import Image from "next/image";
import logo from "@/public/images/pipeHubb_logo_transparent.png";
import { format } from "date-fns";
import { Loan } from "@prisma/client";

interface ActivityLog {
  id: number;
  loanId: number;
  message: string;
  createdAt: Date;
}

const formatDate = (date: Date) => {
  return format(new Date(date), "MM/dd/yyyy, HH:mm aa");
};

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
    <Flex direction={"column"} gap={"1"}>
      {fetchedActivityLog &&
        fetchedActivityLog.map((activity) => {
          return (
            <Flex key={activity.id} direction={"column"} gap="5">
              <Card className="mt-4">
                <Inset
                  clip="padding-box"
                  side="top"
                  p="current"
                  className="!bg-darkGrey !mb-2"
                >
                  <Flex gap="3" align={"center"}>
                    <Image
                      src={logo}
                      alt="PipeHubb logo"
                      width={25}
                      height={25}
                    />
                    <Badge color="gray" variant="solid">
                      {formatDate(activity.createdAt)}
                    </Badge>
                  </Flex>
                </Inset>
                <Text>
                  <Inset p="current" className="bg-neutral-100 text-black !rounded-sm">
                    <Flex align={"center"} gap="2">
                      <Avatar
                        size="2"
                        src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                        fallback="A"
                        radius="full"
                      ></Avatar>
                      <Text>{activity.message}</Text>
                    </Flex>
                  </Inset>
                </Text>
              </Card>
            </Flex>
          );
        })}
    </Flex>
  );
};

export default ActivityLog;
