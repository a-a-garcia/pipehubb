"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import {
  Button,
  Dialog,
  Flex,
  TextField,
  Text,
  Separator,
  Heading,
  Card,
} from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { createUserSchema } from "../validationSchemas";
import ErrorMessage from "../components/ErrorMessage";
import prisma from "@/prisma/client";
import axios from "axios";

interface SignUpFormProps extends User {
  password: string;
  confirmPassword: string;
  existingUserEmail?: string;
}

//manually validating without Zod because for unknown reason, `existingUserEmail` is not being included in the data object when trying to {...register("existingUserEmail")}, and therefore can't be validated.
function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email) && email.length <= 255;
}

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  //manually setting the existing email state because for unknown reason, `existingUserEmail` is not being included in the data object when trying to {...register("existingUserEmail")}.
  const [existingEmail, setExistingEmail] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<SignUpFormProps>({
    resolver: zodResolver(createUserSchema),
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<SignUpFormProps> = async (data) => {
    if (existingEmail && !validateEmail(existingEmail)) {
      // Handle invalid email
      console.error("Invalid email");
      return;
    }
    try {
      const response = await axios.post("/api/user", {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        // if existingUserEmail is left blank, cast it into undefined because Zod expects undefined if .optional()
        existingUserEmail: existingEmail === "" ? undefined : existingEmail,
      });
      console.log("response: " + JSON.stringify(response));
    } catch (error: any) {
      console.log("error: " + JSON.stringify(error.response.data));
      switch (error.response?.data.error) {
        case "Email already exists.":
          setError("email", {
            type: "manual",
            message: "Email already exists.",
          });
          break;
        case "Couldn't find a user with that email.":
          setError("existingUserEmail", {
            type: "manual",
            message: "Couldn't find a user with that email.",
          });
          break;
        case "New user email and existing user email cannot be the same.":
          setError("existingUserEmail", {
            type: "manual",
            message:
              "New user email and existing user email cannot be the same.",
          });
          break;
      }
    }
  };

  console.log(
    "this is the existingUserEmail input: " + watch("existingUserEmail")
  );

  return (
    <Card>
      <Heading>Sign Up</Heading>
      <Text size="2" mb="4">
        Create a new PipeHubb account!
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Name
            </Text>
            <div className="my-3">
              {errors.name && (
                <ErrorMessage>{errors.name.message}</ErrorMessage>
              )}
            </div>
            <TextField.Root
              placeholder="Enter your full name"
              {...register("name", { required: true })}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Email
            </Text>
            <div className="my-3">
              {errors.email && (
                <ErrorMessage>{errors.email.message}</ErrorMessage>
              )}
            </div>
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
            <div className="my-3">
              {errors.password && (
                <ErrorMessage>{errors.password.message}</ErrorMessage>
              )}
            </div>
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
            <div className="my-3">
              {errors.confirmPassword && (
                <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>
              )}
            </div>
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
                <strong>
                  Trying to join a loan team that's already on Pipehubb?{" "}
                </strong>
                <br></br>
                Enter the email of an existing user. They'll be notified, and
                once approved by that user, you'll have access to that team's
                loans and pipeline.
              </Text>
            </Flex>
            <div className="my-3">
              {errors.existingUserEmail && (
                <ErrorMessage>{errors.existingUserEmail.message}</ErrorMessage>
              )}
            </div>
            <TextField.Root
              placeholder="Enter existing user's email."
              //manually setting the existing email state because for unknown reason, `existingUserEmail` is not being included in the data object when trying to {...register("existingUserEmail")}.
              onChange={(e) => setExistingEmail(e.target.value)}
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
                email, and a new loan team will be created with you as the first
                member.
              </Text>
            </Flex>
          </label>
        </Flex>
        <Flex gap="3" mt="4" justify="end">
          <Button
            variant="soft"
            color="gray"
            onClick={() => router.push("/")}
            className=" hover:cursor-pointer"
          >
            Cancel
          </Button>
          <Button className="myCustomButton hover:cursor-pointer" type="submit">
            Create Account
          </Button>
        </Flex>
      </form>
    </Card>
  );
};

export default SignUpForm;
