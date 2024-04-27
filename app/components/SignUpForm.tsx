import { Button, Dialog, Flex, TextField, Text } from "@radix-ui/themes";
import React from "react";

const SignUpForm = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button className="myCustomButton hover:cursor-pointer" size={"3"}>
          Sign Up
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Sign Up</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Create an account.
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Name
            </Text>
            <TextField.Root placeholder="Enter your full name" />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Email
            </Text>
            <TextField.Root placeholder="Enter your email" />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Password
            </Text>
            <TextField.Root placeholder="Enter your email" />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Confirm Password
            </Text>
            <TextField.Root placeholder="Enter your email" />
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button className="myCustomButton">Create Account</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default SignUpForm;
