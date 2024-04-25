import { DocumentChecklist, Loan } from "@prisma/client";
import { AlertDialog, Button, Flex, Separator, Spinner, Text } from "@radix-ui/themes";
import React, { useState } from "react";
import { FaTrashCan } from "react-icons/fa6";
import Image from "next/image";
import logo from "@/public/images/pipeHubb_logo_transparent.png";

const CustomAlertDialog = ({ loan }: { loan?: Loan }, { checklistItem } : { checklistItem? : DocumentChecklist}) => {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    try {
      setLoading(true);
      fetch(`/api/loans/${loan?.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      window.location.href = "/loans/pipeline";
    } catch {
      console.error("An error occurred");
    }
  };
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button color="red" className="hover:cursor-pointer">
          {loan ? <Text>Delete loan</Text> : <Text>Delete checklist item</Text>}
          <FaTrashCan />
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>
          <Flex justify={"between"} align={"center"}>
            <Text>Are you sure?</Text>
            <Image src={logo} alt="Pipehubb Logo" width="35"></Image>
          </Flex>
        </AlertDialog.Title>
        <Separator my="3" size="4" />
        <AlertDialog.Description size="2">
          This action cannot be undone.
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button
              variant="soft"
              color="gray"
              className="hover:cursor-pointer"
            >
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button
              onClick={handleDelete}
              disabled={loading}
              variant="solid"
              color="red"
              className="hover:cursor-pointer"
            >
              Delete Loan
              {loading && <Spinner />}
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default CustomAlertDialog;
