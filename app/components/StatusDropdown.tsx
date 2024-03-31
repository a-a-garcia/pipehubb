import { DocumentChecklist } from "@prisma/client";
import { Select, Table, Badge } from "@radix-ui/themes";
import axios from "axios";

const StatusDropdown = ({ item }: { item: DocumentChecklist }) => {
  const handleChange = async (value: string) => {
    await axios.patch(`/api/documentchecklist/${item.id}`, {
        id: item.id,
        status: value
    })
  }

  return (
    <Table.Cell>
      <Select.Root
        defaultValue={item.status}
        onValueChange={(value) => handleChange(value)}
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
    </Table.Cell>
  );
};

export default StatusDropdown;
