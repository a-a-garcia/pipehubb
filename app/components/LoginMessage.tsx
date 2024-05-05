import { zodResolver } from "@hookform/resolvers/zod";
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
import { useForm } from "react-hook-form";
import { loanTeamExistingUserSchema } from "../validationSchemas";
import axios from "axios";
import ErrorMessage from "./ErrorMessage";

interface formDataProps {
  existingUserEmail?: string;
}


//manually validating without Zod because for unknown reason, `existingUserEmail` is not being included in the data object when trying to {...register("existingUserEmail")}, and therefore can't be validated.
function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email) && email.length <= 255;
}

const LoginMessage = () => {
  const { data: session, status, } = useSession();
  const {
    data: user,
    isPending,
    error,
  } = useQuery({
    queryKey: ["userInSession", { userId: session?.user.id }],
    queryFn: () =>
      fetch(`/api/user/${session?.user.id}`).then((res) => res.json()),
    enabled: !!session
  });

  console.log("session: ", session)

  const { handleSubmit } = useForm({
    resolver: zodResolver(loanTeamExistingUserSchema),
  });
  const [existingEmail, setExistingEmail] = useState<string>("");
  const [formError, setFormError] = useState<string>("");

  const onSubmit = async (data: formDataProps) => {
    if (existingEmail && !validateEmail(existingEmail)) {
      // Handle invalid email
      console.error("Invalid email");
      return;
    }
    try {
      const response = await axios.put(`/api/user/${session?.user.id}`, {
        id: session?.user.id,
        existingUserEmail: existingEmail,
        teamName: `${session?.user.name}'s team`
      });
      console.log(response.data);
    } catch (error: any) {
      console.log(error)
      setFormError(error.response.data.error);
    }
  };

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true)
    if (formError) {
      setOpen(true);
    }
  }, [formError]);

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
            <form onSubmit={handleSubmit(onSubmit)}>
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
                    Enter the email of an existing user. They'll be notified,
                    and once approved by that user, you'll have access to that
                    team's loans and pipeline.
                  </Text>
                </Flex>
                <div className="my-3">
                  {formError && (
                    <ErrorMessage>
                      {formError}
                    </ErrorMessage>
                  )}
                </div>
                <TextField.Root
                  placeholder="Enter existing user's email."
                  type="email"
                  onChange={(e) => setExistingEmail(e.target.value)}
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
                  <Button className="myCustomButton" type="submit">
                    Submit
                  </Button>
                </Dialog.Close>
              </Flex>
            </form>
          </Dialog.Content>
        )}
      </Dialog.Root>
    </div>
  );
};

export default LoginMessage;
