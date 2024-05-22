import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  Flex,
  Heading,
  TextField,
  Text,
  Separator,
  Button,
  Grid,
  Spinner,
} from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { loanTeamExistingUserSchema } from "../validationSchemas";
import axios from "axios";
import ErrorMessage from "./ErrorMessage";
import LoanTeamRequests from "./LoanTeamRequests";

interface formDataProps {
  existingUserEmail?: string;
}

interface Props {
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

//manually validating without Zod because for unknown reason, `existingUserEmail` is not being included in the data object when trying to {...register("existingUserEmail")}, and therefore can't be validated.
function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email) && email.length <= 255;
}

const LoginMessage = ({
  open: externalOpen,
  setOpen: externalSetOpen,
}: Props) => {
  const { data: session, status } = useSession();

  const {
    data: userData,
    isPending,
    error,
  } = useQuery({
    queryKey: ["userInSession", { userId: session?.user.id }],
    queryFn: () =>
      fetch(`/api/user/${session?.user.id}`).then((res) => res.json()),
    enabled: !!session?.user.id,
  });

  const {
    data: loanTeamRequests,
    isPending: isPendingLoanTeamRequests,
    error: errorLoanTeamRequests,
  } = useQuery({
    queryKey: ["loanTeamRequets", session?.user.id],
    queryFn: () =>
      fetch(`/api/loanteamrequests/${session?.user.id}`).then((res) =>
        res.json()
      ),
  });

  isPendingLoanTeamRequests && <Spinner />;

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
      console.log({
        id: session?.user.id,
        existingUserEmail: existingEmail,
        teamName: `${session?.user.name}'s team`,
      });
      const response = await axios
        .put(`/api/user/${session?.user.id}`, {
          id: session?.user.id,
          existingUserEmail: existingEmail,
          teamName: `${session?.user.name}'s team`,
        })
        .then((response) => {
          setOpen(false);
          return response; // return the response from the server
        });
      window.location.reload();
    } catch (error: any) {
      console.log(error);
      setFormError(error.response.data.error);
    }
  };

  const [internalOpen, setInternalOpen] = useState(false);

  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalSetOpen || setInternalOpen;

  useEffect(() => {
    setOpen(true);
    if (formError) {
      setOpen(true);
    }
  }, [formError, setOpen]);

  return (
    <div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        {/* Shown when user is opening the loan team request menu of their own volition */}
        {externalOpen && (
          <Dialog.Content>
            <Heading>Loan Team Request Menu</Heading>
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
                    <LoanTeamRequests loanTeamRequests={loanTeamRequests} />
                    <br></br>
                    Want to send a request to join a another team? Enter the
                    email of an existing user. They&apos;ll be notified, and once
                    approved by that user, you&apos;ll have access to the loans and
                    pipelines that the user has approved you to access.
                  </Text>
                </Flex>
                <div className="my-3">
                  {formError && <ErrorMessage>{formError}</ErrorMessage>}
                </div>
                <Grid
                  rows={"1"}
                  gap="2"
                  columns={"2"}
                  className="!border !rounded-md !border-solid !border-maroon p-5"
                >
                  <TextField.Root
                    placeholder="Enter existing user's email."
                    type="email"
                    onChange={(e) => setExistingEmail(e.target.value)}
                  />
                  <Flex justify={"end"}>
                    <Button className="myCustomButton !w-1/2" type="submit">
                      Submit
                    </Button>
                  </Flex>
                </Grid>
              </label>
              <Flex gap="3" mt="4" align={"end"} direction={"column"}>
                <Dialog.Close>
                  <Button variant="soft" color="gray">
                    Close
                  </Button>
                </Dialog.Close>
              </Flex>
            </form>
          </Dialog.Content>
        )}
        {/* Shown when user is a member of at least one team, and has at least one incoming loan team */}
        {/* refactored using optional chaining `?`, to avoid trying to access properties of undefined */}
        {/* loanTeamRequests[0]?.length > 0 will first check if loanTeamRequests[0] exists. If it does, it will then check if its length is greater than 0. If loanTeamRequests[0] does not exist (i.e., it's undefined), it will immediately return undefined and not attempt to access the length property, thus avoiding a TypeError. */}
        {((userData &&
          userData[1]?.message === "userTeams>=1" &&
          loanTeamRequests &&
          loanTeamRequests[1]?.length > 0) ||
          (loanTeamRequests && loanTeamRequests[0]?.length > 0)) && (
          <Dialog.Content>
            <Heading>
              Heads up, here&apos;s an update on your loan team requests.
            </Heading>
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
                    <LoanTeamRequests loanTeamRequests={loanTeamRequests} />
                    <br></br>
                    Want to send a request to join a another team? Enter the
                    email of an existing user. They&apos;ll be notified, and once
                    approved by that user, you&apos;ll have access to the loans and
                    pipelines that the user has approved you to access.
                  </Text>
                </Flex>
                <div className="my-3">
                  {formError && <ErrorMessage>{formError}</ErrorMessage>}
                </div>
                <Grid
                  rows={"1"}
                  gap="2"
                  columns={"2"}
                  className="!border !rounded-md !border-solid !border-maroon p-5"
                >
                  <TextField.Root
                    placeholder="Enter existing user's email."
                    type="email"
                    onChange={(e) => setExistingEmail(e.target.value)}
                  />
                  <Flex justify={"end"}>
                    <Button className="myCustomButton !w-1/2" type="submit">
                      Submit
                    </Button>
                  </Flex>
                </Grid>
              </label>
              <Flex gap="3" mt="4" align={"end"} direction={"column"}>
                <Dialog.Close>
                  <Button variant="soft" color="gray">
                    Close
                  </Button>
                </Dialog.Close>
              </Flex>
            </form>
          </Dialog.Content>
        )}
        {/* user logs beyond their first time, but has not joined at least one team yet. */}

        {userData &&
          userData[1].message === "userTeams=0" &&
          userData[0].firstTimeLogin === false && (
            <Dialog.Content>
              <Heading>Welcome to Pipehubb!</Heading>
              <Text as="div" size="1" mb="4">
                We know you&apos;re eager to get started, but you either need to join
                an existing loan team or start your own.
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
                      <LoanTeamRequests loanTeamRequests={loanTeamRequests} />
                      <br></br>
                      Want to send a request to a different team? Enter the
                      email of an existing user. They&apos;ll be notified, and once
                      approved by that user, you&apos;ll have access to the loans and
                      pipelines that the user has approved you to access.
                    </Text>
                  </Flex>
                  <div className="my-3">
                    {formError && <ErrorMessage>{formError}</ErrorMessage>}
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
                      <strong>Don&apos;t have a loan team yet?</strong> <br></br> No
                      worries! Simply continue without providing an existing
                      user email, and a new loan team will be created with you
                      as the first member.
                    </Text>
                  </Flex>
                </label>
                <Flex gap="3" mt="4" justify="end">
                  <Dialog.Close>
                    <Button variant="soft" color="gray">
                      Cancel
                    </Button>
                  </Dialog.Close>
                  <Button className="myCustomButton" type="submit">
                    Submit
                  </Button>
                </Flex>
              </form>
            </Dialog.Content>
          )}
        {/* user logs in for first time. */}
        {userData && userData[0].firstTimeLogin && (
          <Dialog.Content>
            <Heading>Welcome to Pipehubb!</Heading>
            <Text as="div" size="1" mb="4">
              To get started, you&apos;ll need to join a loan team, or create a new
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
                    Enter the email of an existing user. They&apos;ll be notified,
                    and once approved by that user, you&apos;ll have access to the
                    loans and pipelines that the user has approved you to
                    access.
                  </Text>
                </Flex>
                <div className="my-3">
                  {formError && <ErrorMessage>{formError}</ErrorMessage>}
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
                    <strong>Don&apos;t have a loan team yet?</strong> <br></br> No
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
                <Button className="myCustomButton" type="submit">
                  Submit
                </Button>
              </Flex>
            </form>
          </Dialog.Content>
        )}
      </Dialog.Root>
    </div>
  );
};

export default LoginMessage;
