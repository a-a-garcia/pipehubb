import { User } from "@prisma/client";
import {
  Button,
  Dialog,
  Flex,
  TextField,
  Text,
  Separator,
} from "@radix-ui/themes";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

interface SignUpFormProps extends User {
  password: string;
  confirmPassword: string;
  existingUserEmail: string;
}

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormProps>();

  const onSubmit: SubmitHandler<SignUpFormProps> = (data) => {
    console.log(data);
  };

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

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Name
              </Text>
              <TextField.Root
                placeholder="Enter your full name"
                {...register("name", {required: true})} 
              />
              {errors.name && <span>This field is required</span>}
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Email
              </Text>
              <TextField.Root
                placeholder="Enter your email"
                {...register("email")}
                type="email"
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Password
              </Text>
              <TextField.Root
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                {...register("password")}
              >
                {" "}
                <Flex align={"center"} className="mr-2">
                  {showPassword ? (
                    <FaRegEyeSlash
                      className="hover:cursor-pointer"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <FaRegEye
                      className="hover:cursor-pointer"
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                </Flex>
              </TextField.Root>
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Confirm Password
              </Text>
              <TextField.Root
                placeholder="Confirm your password"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
              >
                <Flex align={"center"} className="mr-2">
                  {showConfirmPassword ? (
                    <FaRegEyeSlash
                      className="hover:cursor-pointer"
                      onClick={() => setShowConfirmPassword(false)}
                    />
                  ) : (
                    <FaRegEye
                      className="hover:cursor-pointer"
                      onClick={() => setShowConfirmPassword(true)}
                    />
                  )}
                </Flex>
              </TextField.Root>
            </label>
            <Separator size={"4"} my={"2"} />

            <label>
              <Flex justify={"center"}>
                <Text
                  as="div"
                  size="1"
                  mb="3"
                  align={"center"}
                  className="italic"
                >
                  <strong>Trying to join a loan team that's already on Pipehubb?{" "}</strong><br></br>
                  Enter the email of an existing user. They'll
                  be notified, and once approved by that user, you'll have
                  access to that team's loans and pipeline.
                </Text>
              </Flex>
              <TextField.Root
                placeholder="Enter existing user's email."
                {...register("existingUserEmail")}
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
                  <strong>Don't have a loan team yet?</strong> <br></br> No worries! Simply continue without
                  providing an existing user email, and a new loan team will be created 
                  with you as the first member.
                </Text>
              </Flex>
            </label>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button className="myCustomButton" type="submit">
                Create Account
              </Button>
            </Dialog.Close>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default SignUpForm;
