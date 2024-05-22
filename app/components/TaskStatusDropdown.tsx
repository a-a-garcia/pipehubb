import { TaskList } from "@prisma/client";
import { Select, Badge } from "@radix-ui/themes";
import axios from "axios";
import { QueryClient, useQueryClient } from "@tanstack/react-query";

//destructure both item and fetchDocumentChecklist from props, the same object.
//fetchDocumentChecklist is of type `(loanId: String) => void` because it doesn't return anything.
const TaskStatusDropdown = ({
  item,
}: {
  item: TaskList;
  queryClient: QueryClient;
}) => {
  const queryClient = useQueryClient();

  const handleChange = async (
    value: "NOT_STARTED" | "PENDING" | "IN_PROGRESS" | "COMPLETED"
  ) => {
    await axios.patch(`/api/tasklist/${item.id}`, {
      id: item.id,
      status: value,
    });
    queryClient.invalidateQueries({queryKey: ["taskList"]});
  };

  return (
    <Select.Root
      defaultValue={item.status}
      onValueChange={(
        value: "NOT_STARTED" | "PENDING" | "IN_PROGRESS" | "COMPLETED"
      ) => handleChange(value)}
    >
      <Select.Trigger variant="ghost" className="hover:cursor-pointer" />
      <Select.Content variant="soft" color="gray">
        <Select.Item value={"NOT_STARTED"}>
          <Badge color="purple" className="hover:cursor-pointer">
            NOT STARTED
          </Badge>
        </Select.Item>
        <Select.Item value={"IN_PROGRESS"}>
          <Badge color="orange" className="hover:cursor-pointer">
            IN PROGRESS
          </Badge>
        </Select.Item>
        <Select.Item value={"COMPLETED"}>
          <Badge color="green" className="hover:cursor-pointer">
            COMPLETED
          </Badge>
        </Select.Item>
        <Select.Item value={"PENDING"}>
          <Badge color="red" className="hover:cursor-pointer">
            PENDING
          </Badge>
        </Select.Item>
      </Select.Content>
    </Select.Root>
  );
};

export default TaskStatusDropdown;
