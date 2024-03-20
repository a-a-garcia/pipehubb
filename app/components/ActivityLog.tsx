import { Card, Flex, Inset, Text } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { set } from "zod";

interface ActivityLog {
  id: number;
  loanId: number;
  message: string;
  createdAt: Date;
}

const ActivityLog = ({ activityLog }: { activityLog: ActivityLog[] }) => {
  return (
    <Flex direction={"column"} gap={"1"}>
      {activityLog &&
        activityLog.map((activity) => {
          return (
            <Flex key={activity.id} direction={"column"} gap="5">
              <Card className="mt-4">
                <Inset
                  clip="border-box"
                  side="top"
                  p="current"
                  className="!bg-darkGrey"
                >
                    <Text className="italic text-white">
                      {activity.createdAt.toString()}
                    </Text>
                </Inset>
                <Text>
                  <Flex align={"center"} className="mt-2">
                    <FaCheckCircle className="mr-2" />
                    <Text>{activity.message}</Text>
                  </Flex>
                </Text>
              </Card>
            </Flex>
          );
        })}
    </Flex>
  );
};

export default ActivityLog;