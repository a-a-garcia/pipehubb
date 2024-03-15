"use client";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Select,
  TextField,
} from "@radix-ui/themes";
import React, { FormEvent } from "react";
import { createLoanSchema } from "@/app/validationSchemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import * as Form from "@radix-ui/react-form";
import { Text } from "@radix-ui/themes";
import axios from "axios";

type LoanFormData = z.infer<typeof createLoanSchema>;

function NewLoanPage() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoanFormData>({
    resolver: zodResolver(createLoanSchema)
  });

  const submitForm = handleSubmit(async (data) => {
    console.log("SUBMITTING")
    await axios.post("/api/loans", data);
  })

  return (
    <div className="md:w-1/2">
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
            <Flex gap={"5"} direction={"column"}>
              <Card className="!bg-cactus">
                <Controller
                  control={control}
                  name="transactionType"
                  render={({ field }) => {
                    return (
                      <Flex direction={"column"} gap="1" align={"start"}>
                        <Text>Transaction Type:</Text>
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
                          <TextField.Input
                          {...field}
                          type="number"
                          min={0}
                          defaultValue={0}
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
                          <TextField.Input {...field} type="text" />
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
                          <TextField.Input {...field} type="email" />
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
                        <TextField.Input
                          {...field}
                          type="text"
                          pattern="\d{3}-\d{3}-\d{4}"
                          onChange={(e) => {
                            const phoneNumber = e.target.value;
                            if (phoneNumber.length === 10) {
                              const formattedPhoneNumber = phoneNumber.replace(
                                /(\d{3})(\d{3})(\d{4})/,
                                "$1-$2-$3"
                              );
                              field.onChange(formattedPhoneNumber);
                            }
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
                        <TextField.Input {...field} type="number" />
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
                        <TextField.Input
                          {...field}
                          type="number"
                          min={300}
                          max={850}
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
                        <TextField.Input
                          {...field}
                          type="text"
                        />
                      </Flex>
                    );
                  }}
                ></Controller>
              </Card>
            </Flex>
          </Box>
          <Flex justify={"end"} className="mt-4">
            <Button>
              <input type="submit" />
            </Button>
          </Flex>
        </form>
      </Card>
    </div>
  );
}

export default NewLoanPage;

// const NewLoanPage = () => {
//   const {
//     register,
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(createLoanSchema),
//     defaultValues: {
//       borrowerName: "",
//       loanAmount: 0,
//       transactionType: "PURCHASE",
//     }
//   });

//   const router = useRouter();

//   return (
//     <div className="md:w-1/2">
//       <Box className="bg-deepPink p-5 text-white rounded-md">
//         <Heading>Create a Loan</Heading>
//       </Box>
//       <Card
//         className="p-4
//       !bg-darkGrey"
//       >
//         <form onSubmit={handleSubmit(console.log)}>
//           <Flex gap={"5"} direction={"column"}>
//             <Card className="!bg-cactus">
//               <Flex direction={"column"} align={"start"} gap={"1"}>
//                 <Text>Name</Text>
//                 <TextField.Root>
//                   <TextField.Input
//                     {...register("borrowerName")}
//                     className="p-1"
//                     name="borrowerName"
//                     type="text"
//                     required
//                   ></TextField.Input>
//                 </TextField.Root>
//               </Flex>
//             </Card>
//             <Card className="!bg-cactus">
//               <Flex direction={"column"} align={"start"} gap={"1"}>
//                 <Text>Loan Amount</Text>
//                 <TextField.Root>
//                   <TextField.Input
//                     {...register("loanAmount", { pattern: /\d+/ })}
//                     name="loanAmount"
//                     className="p-1"
//                   ></TextField.Input>
//                 </TextField.Root>
//               </Flex>
//             </Card>
//             <Card className="!bg-cactus">
//               <Flex direction={"column"} align={"start"} gap={"2"}>
//                 <Text>Transaction Type:</Text>
//                 <Select.Root
//                   defaultValue="PURCHASE"
//                   {...register("transactionType")}
//                   name="transactionType"
//                 >
//                   <Select.Trigger variant="surface" />
//                   <Select.Content>
//                     <Select.Item value="PURCHASE">Purchase</Select.Item>
//                     <Select.Item value="REFINANCE">Refinance</Select.Item>
//                   </Select.Content>
//                 </Select.Root>
//               </Flex>
//             </Card>
//             <Flex justify={"end"}>
//               <input type="submit" value="Submit" />
//             </Flex>
//           </Flex>
//         </form>
//       </Card>
//     </div>
//   );
// };

// export default NewLoanPage;
