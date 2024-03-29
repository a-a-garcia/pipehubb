"use client";
import React, { use, useEffect, useState } from "react";
import "easymde/dist/easymde.min.css";
import {
  Card,
  Heading,
  Button,
  Flex,
  Callout,
  TextArea,
} from "@radix-ui/themes";
import { createFileNoteSchema } from "@/app/validationSchemas";
import { z } from "zod";
import { Loan } from "@prisma/client";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdOutlineCreate } from "react-icons/md";
// import { useRouter } from "next/navigation";
import axios from "axios";
import { FaExclamationCircle } from "react-icons/fa";
import Spinner from "@/app/components/Spinner";
import ErrorMessage from "@/app/components/ErrorMessage";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { register } from "module";

type CreateFileNoteData = z.infer<typeof createFileNoteSchema>;

const CreateNotePage = ({ params }: { params: { id: string } }) => {

  useEffect(() => {
    const fetchLoan = async () => {
      const response = await fetch(`/api/loans/${params.id}`);
      const loan = await response.json();
      setLoan(loan);
      console.log(loan);
    };
    fetchLoan();
  }, []);


  const router = useRouter();
  const [error, setError] = useState("");
  const [loan, setLoan] = useState<Loan | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noteInput, setNoteInput] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({loanId: params.id, note: noteInput})
    try {
      const validate = createFileNoteSchema.safeParse({loanId: parseInt(params.id), note: noteInput})

      if (!validate.success) {
        setError(validate.error.errors[0].message);
        return;
      }
      

      const response = await axios.post(`/api/filenotes`, {
        loanId: parseInt(params.id),
        note: noteInput,
      });
      console.log("Response from server:", response.data); // log the server response
      router.push(`/loans/${params.id}`);
    } catch (error) {
      console.error("Error occurred while submitting form:", error); // log any errors
      setError("An error occurred while creating the note.");
    }
  };

  return (
    <div>
      {error && (
        <Callout.Root className="mb-5" color="red">
          <Callout.Icon>
            <FaExclamationCircle />
          </Callout.Icon>
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form onSubmit={onSubmit}>
        <Card className="!bg-darkGrey">
          <Flex gap="4" direction={"column"}>
            <div>
              <Card className="!bg-deepPink">
                <Heading className="text-white">
                  Create a Note for $BorrowerName's loan
                </Heading>
              </Card>
              <Card>
                <TextArea
                  placeholder="Type your note here..."
                  onChange={(e) => setNoteInput(e.target.value)}
                  size="3"
                ></TextArea>
                {/* <ErrorMessage>{errors.note?.message}</ErrorMessage> */}
              </Card>
            </div>
            <Flex justify={"end"}>
              <Button
                type="submit"
                className="hover:cursor-pointer"
                disabled={isSubmitting}
              >
                <MdOutlineCreate />
                Create Note
                {isSubmitting && <Spinner />}
              </Button>
            </Flex>
          </Flex>
        </Card>
      </form>
    </div>
  );
};

export default CreateNotePage;
