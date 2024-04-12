"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loan } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { createLoanSchema } from "../validationSchemas";
import {
  Flex,
  Card,
  Heading,
  Grid,
  Box,
  Text,
  Button,
  Callout,
  Select,
  TextField,
} from "@radix-ui/themes";
import Spinner from "./Spinner";
import { z } from "zod";
import { IoMdAlert } from "react-icons/io";
import ErrorMessage from "./ErrorMessage";

type LoanFormData = z.infer<typeof createLoanSchema>;

const LoanForm = ({ loan }: { loan?: Loan }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoanFormData>({
    resolver: zodResolver(createLoanSchema),
    mode: "onSubmit"
  });

  const [validationErrors, setValidationErrors] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newlyCreatedLoan, setNewlyCreatedLoan] = useState<Loan>();
  const [newlyUpdatedLoan, setNewlyUpdatedLoan] = useState<Loan>();

  const router = useRouter();

  const submitForm = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      if (!loan) {
        const response = await axios.post("/api/loans", data);
        const newLoan = response.data;
        setNewlyCreatedLoan(newLoan);
        await loanCreationActivity(newLoan);
      } else {
        const response = await axios.put(`/api/loans/${loan.id}`, data);
        const updatedLoan = response.data;
        setNewlyUpdatedLoan(updatedLoan);
        await loanUpdateActivity(updatedLoan);
        router.push("/loans/pipeline");
      }
    } catch {
      console.error("Failed to create loan");
      setValidationErrors("Failed to create loan");
    }
  });

  const loanCreationActivity = async (newLoan: Loan) => {
    try {
      if (newLoan) {
        await axios.post("/api/activitylog", {
          loanId: newLoan.id,
          message: `USER created a new loan for new borrower ${newLoan.borrowerName}.`,
        });
        console.log("SUCCESS: Created activity log for loan creation");
      }
      router.push("/loans/pipeline");
    } catch {
      console.error("Failed to create activity log for loan creation");
      setValidationErrors("Failed to create activity log for loan creation");
    }
  };

  const loanUpdateActivity = async (updatedLoan: Loan) => {
    try {
      if (updatedLoan) {
        await axios.post("/api/activitylog", {
          loanId: updatedLoan.id,
          message: `USER updated loan details for borrower ${updatedLoan.borrowerName}.`,
        });
        console.log(`SUCCESS: Created activity log for loan update`);
        router.push("/loans/pipeline");
      }
    } catch {
      console.error("Failed to create activity log for loan update");
      setValidationErrors("Failed to create activity log for loan update");
    }
  };

  return (
    <div>
      {validationErrors && (
        <Callout.Root size="3" variant="surface" role="alert" className="my-5">
          <Callout.Icon>
            <IoMdAlert />
          </Callout.Icon>
          <Callout.Text>{validationErrors}</Callout.Text>
        </Callout.Root>
      )}
      <Box className="bg-deepPink p-5 text-white rounded-md">
        {loan ? (
          <Heading>Editing {loan.borrowerName}'s loan.</Heading>
        ) : (
          <Heading>Create a Loan</Heading>
        )}
      </Box>
      <Card
        className="p-4
      !bg-darkGrey"
      >
        <form onSubmit={submitForm}>
          <Box className="border border-deepPink p-5 rounded-md">
            <h2 className="text-white mb-2">Required: </h2>
            <Flex gap={"5"} direction={"column"}>
              <Card>
                <Flex direction={"column"} gap="1">
                  <Controller
                    defaultValue={loan?.borrowerName}
                    control={control}
                    name="borrowerName"
                    render={({ field }) => {
                      return (
                        <div className="w-100 md:w-1/2">
                          <Text>Borrower Name:</Text>
                          <ErrorMessage>
                            {errors.borrowerName?.message}
                          </ErrorMessage>
                          <TextField.Root {...field} type="text" required />
                        </div>
                      );
                    }}
                  ></Controller>
                </Flex>
              </Card>
            </Flex>
          </Box>
          <Box className="mt-4 border border-maroon p-5 rounded-md">
            <h2 className="text-white mb-2">Other fields:</h2>
            <Grid gap={"5"} columns={{ initial: "1", md: "2" }}>
              <Card>
                <Controller
                  control={control}
                  name="transactionType"
                  render={({ field }) => {
                    return (
                      <Flex direction={"column"} gap="1" align={"start"}>
                        <Text>Transaction Type:</Text>
                        <ErrorMessage>
                          {errors.transactionType?.message}
                        </ErrorMessage>
                        <Select.Root
                          defaultValue={loan?.transactionType || undefined}
                          onValueChange={field.onChange}
                          {...field}
                        >
                          <Select.Trigger
                            variant="surface"
                            placeholder="Choose a type..."
                          />
                          <Select.Content>
                            <Select.Item value="PURCHASE">Purchase</Select.Item>
                            <Select.Item value="REFINANCE">
                              Refinance
                            </Select.Item>
                          </Select.Content>
                        </Select.Root>
                      </Flex>
                    );
                  }}
                ></Controller>
              </Card>
              <Card>
                <Flex direction={"column"} gap="1">
                  <Controller
                    defaultValue={loan?.loanAmount || undefined}
                    control={control}
                    name="loanAmount"
                    render={({ field }) => {
                      return (
                        <div className="w-100 md:w-1/2">
                          <Text>Loan Amount:</Text>
                          <ErrorMessage>
                            {errors.loanAmount?.message}
                          </ErrorMessage>
                          <TextField.Root
                            {...field}
                            type="number"
                            min={0}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value === "" ? undefined : parseInt(value)
                              );
                            }}
                          />
                        </div>
                      );
                    }}
                  ></Controller>
                </Flex>
              </Card>
              <Card>
                <Flex direction={"column"} gap="1">
                  <Controller
                    defaultValue={loan?.propertyAddress || undefined}
                    control={control}
                    name="propertyAddress"
                    render={({ field }) => {
                      return (
                        <div className="w-100 md:w-1/2">
                          <Text>Subject Property Address: </Text>
                          <ErrorMessage>
                            {errors.propertyAddress?.message}
                          </ErrorMessage>
                          <TextField.Root
                            {...field}
                            type="text"
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === "" ? undefined : value);
                            }}
                          />
                        </div>
                      );
                    }}
                  ></Controller>
                </Flex>
              </Card>
              <Card>
                <Flex direction={"column"} gap="1">
                  <Controller
                    defaultValue={loan?.borrowerEmail || undefined}
                    control={control}
                    name="borrowerEmail"
                    render={({ field }) => {
                      return (
                        <div className="w-100 md:w-1/2">
                          <Text>Borrower Email: </Text>
                          <ErrorMessage>
                            {errors.borrowerEmail?.message}
                          </ErrorMessage>
                          <TextField.Root
                            {...field}
                            type="email"
                            value={field.value?.toString() || ''}
                            onChange={(e) => {
                              const value = e.target.value.trim();
                              field.onChange(value === "" ? undefined : value);
                            }}
                          />
                        </div>
                      );
                    }}
                  ></Controller>
                </Flex>
              </Card>
              <Card>
                <Controller
                  defaultValue={loan?.borrowerPhone || undefined}
                  control={control}
                  name="borrowerPhone"
                  render={({ field }) => {
                    return (
                      <Flex
                        direction={"column"}
                        gap="1"
                        className="w-100 md:w-1/2"
                      >
                        <Text>Borrower Phone Number: </Text>
                        <ErrorMessage>
                          {errors.borrowerPhone?.message}
                        </ErrorMessage>
                        <TextField.Root
                          {...field}
                          type="text"
                          pattern="\d{3}-\d{3}-\d{4}"
                          onChange={(e) => {
                            const phoneNumber = e.target.value;
                            const formattedPhoneNumber = phoneNumber.replace(
                              /(\d{3})(\d{3})(\d{4})/,
                              "$1-$2-$3"
                            );
                            if (phoneNumber.length === 10) {
                            }
                            field.onChange(formattedPhoneNumber);
                          }}
                        />
                      </Flex>
                    );
                  }}
                ></Controller>
              </Card>
              <Card>
                <Controller
                  defaultValue={loan?.purchasePrice || undefined}
                  control={control}
                  name="purchasePrice"
                  render={({ field }) => {
                    return (
                      <Flex
                        direction={"column"}
                        gap="1"
                        className="w-100 md:w-1/2"
                      >
                        <Text>Purchase Price (if applicable): </Text>
                        <ErrorMessage>
                          {errors.purchasePrice?.message}
                        </ErrorMessage>
                        <TextField.Root
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? undefined : parseInt(value));
                          }}
                          type="number"
                        />
                      </Flex>
                    );
                  }}
                ></Controller>
              </Card>
              <Card>
                <Controller
                  defaultValue={loan?.creditScore || undefined}
                  control={control}
                  name="creditScore"
                  render={({ field }) => {
                    return (
                      <Flex
                        direction={"column"}
                        gap="1"
                        className="w-1/2 md:w-1/4"
                      >
                        <Text>Credit Score: </Text>
                        <ErrorMessage>
                          {errors.creditScore?.message}
                        </ErrorMessage>
                        <TextField.Root
                          {...field}
                          type="number"
                          min={300}
                          max={850}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? undefined : parseInt(value));
                          }}
                        />
                      </Flex>
                    );
                  }}
                ></Controller>
              </Card>
              <Card>
                <Controller
                  defaultValue={loan?.referralSource || undefined}
                  control={control}
                  name="referralSource"
                  render={({ field }) => {
                    return (
                      <Flex
                        direction={"column"}
                        gap="1"
                        className="w-100 md:w-1/2"
                      >
                        <Text>Referral Source:</Text>
                        <ErrorMessage>
                          {errors.referralSource?.message}
                        </ErrorMessage>
                        <TextField.Root
                          {...field}
                          type="text"
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? undefined : value);
                          }}
                        />
                      </Flex>
                    );
                  }}
                ></Controller>
              </Card>
            </Grid>
          </Box>
          <Flex justify={"end"} className="mt-4">
            <Button disabled={isSubmitting} className="hover:cursor-pointer myCustomButton">
              <input type="submit" className="hover:cursor-pointer" />
              {isSubmitting ? <Spinner /> : ""}
            </Button>
          </Flex>
        </form>
      </Card>
    </div>
  );
};

export default LoanForm;
