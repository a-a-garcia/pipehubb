import { DocumentChecklist, Loan } from "@prisma/client";
import { Select, Table, Badge } from "@radix-ui/themes";
import axios from "axios";
import fetchDocumentChecklist from "./Checklist";
import { useEffect, useState } from "react";

//destructure both item and fetchDocumentChecklist from props, the same object.
//fetchDocumentChecklist is of type `(loanId: String) => void` because it doesn't return anything.
const StatusDropdown = ({
  item,
  fetchDocumentChecklist,
}: {
  item: DocumentChecklist;
  fetchDocumentChecklist: (loanId: string) => void;
}) => {
  const [status, setStatus] = useState(item.status);

  useEffect(() => {
    fetchDocumentChecklist(String(item.loanId));
  }, [status]);

  const handleChange = async (value: "PENDING" | "RECEIVED" | "REQUESTED") => {
    await axios.patch(`/api/documentchecklist/${item.id}`, {
      id: item.id,
      status: value,
    });
    setStatus(value);
  };

  return (
    <Select.Root
      defaultValue={item.status}
      onValueChange={(value: "PENDING" | "RECEIVED" | "REQUESTED") =>
        handleChange(value)
      }
    >
      <Select.Trigger variant="ghost" className="hover:cursor-pointer" />
      <Select.Content variant="soft" color="gray">
        <Select.Item value={"PENDING"}>
          <Badge color="red" className="hover:cursor-pointer">
            PENDING
          </Badge>
        </Select.Item>
        <Select.Item value={"REQUESTED"}>
          <Badge color="orange" className="hover:cursor-pointer">
            REQUESTED
          </Badge>
        </Select.Item>
        <Select.Item value={"RECEIVED"}>
          <Badge color="green" className="hover:cursor-pointer">
            RECEIVED
          </Badge>
        </Select.Item>
      </Select.Content>
    </Select.Root>
  );
};

export default StatusDropdown;
