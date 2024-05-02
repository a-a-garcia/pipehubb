import {
  Dialog,
  Flex,
  Heading,
  TextField,
  Text,
  Separator,
  Button,
} from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const LoginMessage = () => {
  const { data: session, status } = useSession();
  const {
    data: user,
    isPending,
    error,
  } = useQuery({
    queryKey: ["userInSession", { userId: session?.user.id }],
    queryFn: () =>
      fetch(`/api/user/${session?.user.id}`).then((res) => res.json()),
  });
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(true);
  }, []);
  console.log("logging user from LoginMessage " + user)
  console.log("logging data from useQuery " + user)
  console.log("logging data from session " + session)
  return (
    <div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        {user && user.firstTimeLogin && (
          <Dialog.Content>
            <Heading>Welcome to Pipehubb!</Heading>
            <Text as="div" size="1" mb="4">
              To get started, you'll need to join a loan team, or create a new
              one.
            </Text>
            <Separator my="4" size={"4"} />
            <label>
              <Flex justify={"center"}>
                <Text
                  as="div"
                  size="1"
                  mb="3"
                  align={"center"}
                  className="italic"
                >
                  <strong>Is your team already on PipeHubb? </strong>
                  <br></br>
                  Enter the email of an existing user. They'll be notified, and
                  once approved by that user, you'll have access to that team's
                  loans and pipeline.
                </Text>
              </Flex>
              <TextField.Root
                placeholder="Enter existing user's email."
                type="email"
              />
              <Flex justify={"center"}>
                <Text
                  as="div"
                  size="1"
                  mt="3"
                  align={"center"}
                  className="italic"
                >
                  <strong>Don't have a loan team yet?</strong> <br></br> No
                  worries! Simply continue without providing an existing user
                  email, and a new loan team will be created with you as the
                  first member.
                </Text>
              </Flex>
            </label>
            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
              <Dialog.Close>
                <Button className="myCustomButton">Submit</Button>
              </Dialog.Close>
            </Flex>
          </Dialog.Content>
        )}
      </Dialog.Root>
    </div>
  );
};

export default LoginMessage;
