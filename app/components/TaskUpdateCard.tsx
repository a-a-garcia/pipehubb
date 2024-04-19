import { Avatar, Box, Card, Flex, Inset, Strong, Text } from "@radix-ui/themes";
import React from "react";

const TaskUpdateCard = () => {
  return (
    <Box>
      <Card size="2" className="!bg-neutral-100">
        <Inset clip="padding-box" side="top" pb="current">
          <Card className="!bg-darkGrey">
            <Flex gap="3" align="center">
              <Avatar
                size="3"
                src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
                radius="full"
                fallback="T"
              />
              <Box>
                <Text as="div" size="2" weight="bold" className="!text-white">
                  Anthony Garcia
                </Text>
                <Text as="div" size="2" color="gray" className="!text-white">
                  On 04/19/2024, at 4:20 PM
                </Text>
              </Box>
            </Flex>
          </Card>
        </Inset>
        <Box>
            <Text>TEST</Text>
        </Box>
      </Card>
    </Box>
  );
};

export default TaskUpdateCard;
