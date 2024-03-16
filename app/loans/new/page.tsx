"use client";
import { createLoanSchema } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Callout,
  Card,
  Flex,
  Grid,
  Heading,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { IoMdAlert } from "react-icons/io";
import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";

type LoanFormData = z.infer<typeof createLoanSchema>;

function NewLoanPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoanFormData>({
    resolver: zodResolver(createLoanSchema),
  });

  const [validationErrors, setValidationErrors] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const submitForm = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      await axios.post("/api/loans", data);
      router.push("/loans/pipeline");
    } catch {
      console.error("Failed to create loan");
      setValidationErrors("Failed to create loan");
    }
  });

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
        <Heading>Create a Loan</Heading>
      </Box>
      <Card
        className="p-4
      !bg-darkGrey"
      >
        <form onSubmit={submitForm}>
          <Box className="border border-deepPink p-5 rounded-md">
            <h2 className="text-white mb-2">Required: </h2>
            <Flex gap={"5"} direction={"column"}>
              <Card className="!bg-cactus">
                <Flex direction={"column"} gap="1" align={"start"}>
                  <Controller
                    control={control}
                    name="borrowerName"
                    render={({ field }) => {
                      return (
                        <div>
                          <Text>Borrower Name:</Text>
                          <ErrorMessage>
                            {errors.borrowerName?.message}
                          </ErrorMessage>
                          <TextField.Input {...field} type="text" required />
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
              <Card className="!bg-cactus">
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
                        <Select.Root onValueChange={field.onChange} {...field}>
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
              <Card className="!bg-cactus">
                <Flex direction={"column"} gap="1" align={"start"}>
                  <Controller
                    control={control}
                    name="loanAmount"
                    render={({ field }) => {
                      return (
                        <div>
                          <Text>Loan Amount:</Text>
                          <ErrorMessage>
                            {errors.loanAmount?.message}
                          </ErrorMessage>
                          <TextField.Input
                            {...field}
                            type="number"
                            min={0}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value ? parseInt(value) : undefined
                              );
                            }}
                          />
                        </div>
                      );
                    }}
                  ></Controller>
                </Flex>
              </Card>
              <Card className="!bg-cactus">
                <Flex direction={"column"} gap="1" align={"start"}>
                  <Controller
                    control={control}
                    name="propertyAddress"
                    render={({ field }) => {
                      return (
                        <div>
                          <Text>Subject Property Address: </Text>
                          <ErrorMessage>
                            {errors.propertyAddress?.message}
                          </ErrorMessage>
                          <TextField.Input
                            {...field}
                            type="text"
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value ? value : undefined);
                            }}
                          />
                        </div>
                      );
                    }}
                  ></Controller>
                </Flex>
              </Card>
              <Card className="!bg-cactus">
                <Flex direction={"column"} gap="1" align={"start"}>
                  <Controller
                    control={control}
                    name="borrowerEmail"
                    render={({ field }) => {
                      return (
                        <div>
                          <Text>Borrower Email: </Text>
                          <ErrorMessage>
                            {errors.borrowerEmail?.message}
                          </ErrorMessage>
                          <TextField.Input
                            {...field}
                            type="email"
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value ? value : undefined);
                            }}
                          />
                        </div>
                      );
                    }}
                  ></Controller>
                </Flex>
              </Card>
              <Card className="!bg-cactus">
                <Controller
                  control={control}
                  name="borrowerPhone"
                  render={({ field }) => {
                    return (
                      <Flex direction={"column"} gap="1" align={"start"}>
                        <Text>Borrower Phone Number: </Text>
                        <ErrorMessage>
                          {errors.borrowerPhone?.message}
                        </ErrorMessage>
                        <TextField.Input
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
              <Card className="!bg-cactus">
                <Controller
                  control={control}
                  name="purchasePrice"
                  render={({ field }) => {
                    return (
                      <Flex direction={"column"} gap="1" align={"start"}>
                        <Text>Purchase Price (if applicable): </Text>
                        <ErrorMessage>
                          {errors.purchasePrice?.message}
                        </ErrorMessage>
                        <TextField.Input
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value ? parseInt(value) : undefined);
                          }}
                          type="number"
                        />
                      </Flex>
                    );
                  }}
                ></Controller>
              </Card>
              <Card className="!bg-cactus">
                <Controller
                  control={control}
                  name="creditScore"
                  render={({ field }) => {
                    return (
                      <Flex direction={"column"} gap="1" align={"start"}>
                        <Text>Credit Score: </Text>
                        <ErrorMessage>
                          {errors.creditScore?.message}
                        </ErrorMessage>
                        <TextField.Input
                          {...field}
                          type="number"
                          min={300}
                          max={850}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value ? parseInt(value) : undefined);
                          }}
                        />
                      </Flex>
                    );
                  }}
                ></Controller>
              </Card>
              <Card className="!bg-cactus">
                <Controller
                  control={control}
                  name="referralSource"
                  render={({ field }) => {
                    return (
                      <Flex direction={"column"} gap="1" align={"start"}>
                        <Text>Referral Source:</Text>
                        <ErrorMessage>
                          {errors.referralSource?.message}
                        </ErrorMessage>
                        <TextField.Input
                          {...field}
                          type="text"
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value ? value : undefined);
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
            <Button disabled={isSubmitting}>
              <input type="submit" />
              {isSubmitting ? <Spinner /> : ""}
            </Button>
          </Flex>
        </form>
      </Card>
    </div>
  );
}

export default NewLoanPage;
